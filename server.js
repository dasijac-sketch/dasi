'use strict';
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const Database = require('better-sqlite3');

/* ---------- הגדרות ---------- */
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const SESSION_SECRET = process.env.SESSION_SECRET || '';
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const SECURE = process.env.NODE_ENV === 'production';

if (ADMIN_PASSWORD.length < 8 || SESSION_SECRET.length < 16) {
  console.error('חסרות הגדרות: ADMIN_PASSWORD (לפחות 8 תווים) ו-SESSION_SECRET (לפחות 16 תווים) חייבים להיות מוגדרים.');
  process.exit(1);
}

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new Database(path.join(DATA_DIR, 'budget.db'));
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS couples(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  stage INTEGER NOT NULL DEFAULT 1,
  state TEXT NOT NULL DEFAULT '{}',
  budget TEXT NOT NULL DEFAULT '{}',
  notes TEXT NOT NULL DEFAULT '',
  tasks TEXT NOT NULL DEFAULT '[]',
  msgs TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  updated_at INTEGER,
  seen_at INTEGER
)`);

{
  const cols = db.prepare('PRAGMA table_info(couples)').all().map(c => c.name);
  if (!cols.includes('code')) db.exec('ALTER TABLE couples ADD COLUMN code TEXT');
  if (!cols.includes('cmsgs')) db.exec("ALTER TABLE couples ADD COLUMN cmsgs TEXT NOT NULL DEFAULT '[]'");
  if (!cols.includes('profile')) db.exec("ALTER TABLE couples ADD COLUMN profile TEXT NOT NULL DEFAULT '{}'");
  if (!cols.includes('rst')) db.exec("ALTER TABLE couples ADD COLUMN rst TEXT NOT NULL DEFAULT '{}'");
  if (!cols.includes('cown')) db.exec('ALTER TABLE couples ADD COLUMN cown INTEGER NOT NULL DEFAULT 0');
  db.exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_couples_code ON couples(code)');
}
const CODE_AL = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const genCode = () => Array.from(crypto.randomBytes(6), b => CODE_AL[b % CODE_AL.length]).join('');
const normCode = c => String(c || '').trim().toLowerCase();
const codeOk = c => typeof c === 'string' && /^[\x21-\x7e\u05d0-\u05ea]{6,40}$/.test(normCode(c));
const hcode = c => 'h:' + crypto.createHmac('sha256', SESSION_SECRET || 'x').update(normCode(c)).digest('hex');
const q = {
  byCode0: db.prepare('SELECT * FROM couples WHERE code = ?'),
  setCode: db.prepare('UPDATE couples SET code = ? WHERE id = ?'),
  byToken: db.prepare('SELECT * FROM couples WHERE token = ?'),
  byId: db.prepare('SELECT * FROM couples WHERE id = ?'),
  all: db.prepare('SELECT * FROM couples ORDER BY COALESCE(updated_at, created_at) DESC'),
  insert: db.prepare('INSERT INTO couples(token, name, created_at, code) VALUES (?, ?, ?, ?)'),
  saveState: db.prepare('UPDATE couples SET state = ?, updated_at = ? WHERE id = ?'),
  seen: db.prepare('UPDATE couples SET seen_at = ? WHERE id = ?'),
  del: db.prepare('DELETE FROM couples WHERE id = ?'),
  setToken: db.prepare('UPDATE couples SET token = ? WHERE id = ?')
};
q.byCode = c => q.byCode0.get(normCode(c)) || q.byCode0.get(hcode(c));
db.prepare("SELECT id, code FROM couples WHERE cown = 1 AND code NOT LIKE 'h:%'").all().forEach(r => q.setCode.run(hcode(r.code), r.id));

/* ---------- כלים ---------- */
function freshCode() { for (;;) { const c = normCode(genCode()); if (!q.byCode(c)) return c; } }
db.prepare('SELECT id FROM couples WHERE code IS NULL').all().forEach(r => q.setCode.run(freshCode(), r.id));
const newToken = () => crypto.randomBytes(18).toString('base64url');
const tokenOk = t => typeof t === 'string' && /^[A-Za-z0-9_-]{20,64}$/.test(t);
const parse = (s, d) => { try { return JSON.parse(s); } catch (e) { return d; } };
const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
const sha = s => crypto.createHash('sha256').update(String(s)).digest();
const digits = v => String(v || '').replace(/\D/g, '');
function cleanProfile(p) {
  if (!isObj(p)) return null;
  const o = {};
  for (const k of ['n1', 'n2', 'ph', 'em']) {
    const v = p[k] == null ? '' : String(p[k]).trim();
    if (v.length > 80) return null;
    o[k] = v;
  }
  if (o.em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.em)) return null;
  if (o.ph && (digits(o.ph).length < 7 || digits(o.ph).length > 15)) return null;
  return o;
}
async function sendMail(to, subject, text) {
  const from = process.env.MAIL_FROM, nm = process.env.MAIL_FROM_NAME || 'נקודת איזון';
  try {
    if (process.env.BREVO_API_KEY && from) {
      const r = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ sender: { name: nm, email: from }, to: [{ email: to }], subject, textContent: text }) });
      return r.ok;
    }
    if (process.env.RESEND_API_KEY && from) {
      const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: nm + ' <' + from + '>', to: [to], subject, text }) });
      return r.ok;
    }
  } catch (e) { console.error('mail failed', e.message); }
  return false;
}
const mailOn = () => !!((process.env.BREVO_API_KEY || process.env.RESEND_API_KEY) && process.env.MAIL_FROM);

/* הגבלת קצב פשוטה בזיכרון: מפתח -> {n, until} */
const buckets = new Map();
function limited(key, max, windowMs) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || b.reset < now) { b = { n: 0, reset: now + windowMs }; buckets.set(key, b); }
  return b.n >= max;
}
function hit(key, windowMs) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || b.reset < now) { b = { n: 0, reset: now + windowMs }; buckets.set(key, b); }
  b.n++;
}
setInterval(() => { const now = Date.now(); for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k); }, 600000).unref();

/* ---------- סשן של המנהלת (עוגייה חתומה) ---------- */
const SESSION_MS = 1000 * 60 * 60 * 24 * 14;
const sign = v => crypto.createHmac('sha256', SESSION_SECRET).update(v).digest('base64url');
function makeSession() { const exp = String(Date.now() + SESSION_MS); return exp + '.' + sign(exp); }
function validSession(c) {
  if (!c) return false;
  const [exp, mac] = c.split('.');
  if (!exp || !mac) return false;
  const good = sign(exp);
  if (mac.length !== good.length || !crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(good))) return false;
  return Number(exp) > Date.now();
}
function cookie(req, name) {
  const h = req.headers.cookie || '';
  for (const p of h.split(';')) { const i = p.indexOf('='); if (i > 0 && p.slice(0, i).trim() === name) return decodeURIComponent(p.slice(i + 1).trim()); }
  return '';
}
function setCookie(res, value, maxAgeSec) {
  res.setHeader('Set-Cookie', `sid=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSec}${SECURE ? '; Secure' : ''}`);
}
const requireAdmin = (req, res, next) => validSession(cookie(req, 'sid')) ? next() : res.status(401).json({ error: 'unauthorized' });

/* ---------- אפליקציה ---------- */
const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  if (SECURE) res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  if (req.path.startsWith('/api/')) res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use(express.json({ limit: '1mb' }));

/* בדיקת תקינות */
app.get('/healthz', (req, res) => res.type('text').send('ok'));

/* ---------- API של הזוגות (לפי קישור אישי) ---------- */
function coupleFromToken(req, res) {
  const ip = req.ip;
  if (limited('bad:' + ip, 40, 10 * 60 * 1000)) { res.status(429).json({ error: 'too_many' }); return null; }
  const t = req.params.token;
  const row = tokenOk(t) ? q.byToken.get(t) : null;
  if (!row) { hit('bad:' + ip, 10 * 60 * 1000); res.status(404).json({ error: 'not_found' }); return null; }
  return row;
}
/* בדיקה ומיזוג של חלקי התקציב: bud, cs, sc */
function budgetFrom(b, cur) {
  let bud = cur.bud || {}, cs = cur.cs || {}, sc = cur.sc || [];
  const okNum = o => isObj(o) && Object.values(o).every(v => typeof v === 'number' && isFinite(v));
  if ('sc' in b) {
    if (!Array.isArray(b.sc) || b.sc.length > 20 || b.sc.some(z => !isObj(z) || typeof z.id !== 'string' || z.id.length > 40 || typeof z.n !== 'string' || !z.n.trim() || z.n.length > 60 || typeof z.d !== 'string' || z.d.length > 7 || !okNum(z.bud))) return { error: 'bad_sc' };
    sc = b.sc.map(z => Object.assign({ id: z.id, n: z.n, d: z.d, bud: z.bud }, typeof z.bl === 'number' && isFinite(z.bl) && z.bl > 0 ? { bl: z.bl } : {}));
  }
  if ('bud' in b) {
    if (!okNum(b.bud)) return { error: 'bad_bud' };
    bud = b.bud;
  }
  if ('cs' in b) {
    const c = b.cs, strs = a => Array.isArray(a) && a.length <= 2000 && a.every(x => typeof x === 'string' && x.length <= 130 && x.trim());
    if (!isObj(c) || !strs(c.hid || []) || !strs(c.hg || []) || !Array.isArray(c.ng || []) || (c.ng || []).length > 100 || (c.ng || []).some(x => !isObj(x) || !['i', 'f', 'v'].includes(x.t) || typeof x.n !== 'string' || !x.n.trim() || x.n.length > 60 || x.n.includes('|')) || !isObj(c.ni || {}) || Object.values(c.ni || {}).some(a => !strs(a))) return { error: 'bad_cs' };
    cs = { hid: c.hid || [], hg: c.hg || [], ng: (c.ng || []).map(x => ({ t: x.t, n: x.n })), ni: c.ni || {}, mtg: Math.max(0, Math.min(99, parseInt(c.mtg) || 0)) };
  }
  return { value: { bud, cs, sc } };
}

const COUPLE_KEYS = { bal: 'o', mo: 'o', rt: 'o', fc: 'o', fm: 'o', pm: 'o', dn: 'n', cx: 'o', L: 'o', act: 'o', note: 'o', chd: 'o', ppl: 'n', md: 'o', mt: 'o', yc: 'o', yx: 'o', env: 'o', sd: 'n', aic: 'o', sn: 'n', nw: 'o', ur: 'o', tx: 'o', nwi: 'o', bl: 'n', bf: 'n' };

app.get('/api/c/:token', (req, res) => {
  const row = coupleFromToken(req, res); if (!row) return;
  q.seen.run(Date.now(), row.id);
  res.json({
    name: row.name,
    pwset: row.cown ? 1 : 0,
    profile: parse(row.profile, {}),
    stage: row.stage,
    state: parse(row.state, {}),
    bud: (parse(row.budget, {}).bud) || {},
    cs: (parse(row.budget, {}).cs) || {},
    sc: (parse(row.budget, {}).sc) || [],
    msgs: parse(row.msgs, []),
    updated_at: row.updated_at || 0
  });
});

app.post('/api/enter', (req, res) => {
  const ip = req.ip || 'x';
  if (limited('enter:' + ip, 10, 10 * 60 * 1000)) return res.status(429).json({ error: 'too_many' });
  hit('enter:' + ip, 10 * 60 * 1000);
  const row = codeOk(req.body && req.body.code) ? q.byCode(normCode(req.body.code)) : null;
  if (!row) return res.status(404).json({ error: 'bad_code' });
  res.json({ token: row.token });
});

app.post('/api/c/:token/update', (req, res) => {
  const row = coupleFromToken(req, res); if (!row) return;
  if (limited('upd:' + row.id, 10, 60 * 60 * 1000)) return res.status(429).json({ error: 'too_many' });
  const x = req.body && typeof req.body.x === 'string' ? req.body.x.trim() : '';
  if (!x || x.length > 2000) return res.status(400).json({ error: 'bad_text' });
  hit('upd:' + row.id, 60 * 60 * 1000);
  const list = parse(row.cmsgs, []);
  list.push({ id: String(Date.now()), x, ts: Date.now(), read: 0 });
  db.prepare('UPDATE couples SET cmsgs = ? WHERE id = ?').run(JSON.stringify(list.slice(-50)), row.id);
  res.json({ ok: true });
});

app.post('/api/c/:token/code', (req, res) => {
  const row = coupleFromToken(req, res); if (!row) return;
  if (limited('cc:' + row.id, 10, 60 * 60 * 1000)) return res.status(429).json({ error: 'too_many' });
  hit('cc:' + row.id, 60 * 60 * 1000);
  const c = req.body && req.body.code;
  if (!codeOk(c)) return res.status(400).json({ error: 'bad_code' });
  const nc = normCode(c), ex = q.byCode(nc);
  if (ex && ex.id !== row.id) return res.status(409).json({ error: 'code_taken' });
  db.prepare('UPDATE couples SET code = ?, cown = 1 WHERE id = ?').run(hcode(nc), row.id);
  res.json({ ok: true });
});

app.put('/api/c/:token/profile', (req, res) => {
  const row = coupleFromToken(req, res); if (!row) return;
  const p = cleanProfile(req.body && req.body.profile);
  if (!p) return res.status(400).json({ error: 'bad_profile' });
  db.prepare('UPDATE couples SET profile = ? WHERE id = ?').run(JSON.stringify(p), row.id);
  res.json({ ok: true });
});

app.post('/api/c/:token/rotate', (req, res) => {
  const row = coupleFromToken(req, res); if (!row) return;
  const t = newToken();
  q.setToken.run(t, row.id);
  res.json({ ok: true, token: t });
});

app.post('/api/forgot', async (req, res) => {
  const ip = req.ip || 'x';
  if (limited('fg:' + ip, 5, 10 * 60 * 1000)) return res.status(429).json({ error: 'too_many' });
  hit('fg:' + ip, 10 * 60 * 1000);
  const c = String((req.body && req.body.contact) || '').trim().toLowerCase();
  const dg = digits(c);
  if (c.length < 5 || c.length > 80) return res.status(400).json({ error: 'bad_contact' });
  const rows = db.prepare('SELECT * FROM couples').all().filter(r => {
    const p = parse(r.profile, {});
    return (c.includes('@') && p.em && p.em.toLowerCase() === c) || (dg.length >= 7 && p.ph && digits(p.ph).slice(-9) === dg.slice(-9));
  });
  res.json({ ok: true, auto: mailOn() });
  for (const row of rows) try {
    const p = parse(row.profile, {});
    const tok = crypto.randomBytes(24).toString('base64url');
    db.prepare('UPDATE couples SET rst = ? WHERE id = ?').run(JSON.stringify({ h: sha(tok).toString('hex'), exp: Date.now() + 3600 * 1000 }), row.id);
    const base = (process.env.PUBLIC_URL || (req.protocol + '://' + req.get('host'))).replace(/\/$/, '');
    let sent = false;
    if (p.em && mailOn()) sent = await sendMail(p.em, 'איפוס סיסמה לנקודת איזון', 'שלום,\nהתקבלה בקשה לאיפוס הסיסמה שלכם.\nלבחירת סיסמה חדשה (הקישור תקף לשעה):\n' + base + '/#r=' + tok + '\n\nאם לא ביקשתם, אפשר להתעלם מההודעה.');
    if (!sent) {
      const list = parse(row.cmsgs, []);
      list.push({ id: String(Date.now()), x: 'הזוג ביקש איפוס סיסמה (' + (p.ph || p.em || '') + '). שליחה אוטומטית לא מוגדרת, אפשר לאפס מכרטיס "סיסמה" ולשלוח להם קישור חדש.', ts: Date.now(), read: 0 });
      db.prepare('UPDATE couples SET cmsgs = ? WHERE id = ?').run(JSON.stringify(list.slice(-50)), row.id);
    }
  } catch (e) { console.error('forgot failed', e.message); }
});

app.post('/api/reset', (req, res) => {
  const ip = req.ip || 'x';
  if (limited('rs:' + ip, 10, 10 * 60 * 1000)) return res.status(429).json({ error: 'too_many' });
  hit('rs:' + ip, 10 * 60 * 1000);
  const tok = req.body && req.body.token, pw = req.body && req.body.password;
  if (typeof tok !== 'string' || !codeOk(pw)) return res.status(400).json({ error: 'bad_request' });
  const hh = sha(tok).toString('hex');
  const row = db.prepare('SELECT * FROM couples').all().find(r => { const x = parse(r.rst, {}); return x.h === hh && x.exp > Date.now(); });
  if (!row) return res.status(404).json({ error: 'expired' });
  const nc = normCode(pw), ex = q.byCode(nc);
  if (ex && ex.id !== row.id) return res.status(409).json({ error: 'code_taken' });
  db.prepare("UPDATE couples SET code = ?, cown = 1, rst = '{}' WHERE id = ?").run(hcode(nc), row.id);
  res.json({ ok: true, token: row.token });
});

app.put('/api/c/:token/state', (req, res) => {
  const row = coupleFromToken(req, res); if (!row) return;
  if (limited('put:' + row.id, 120, 60 * 1000)) return res.status(429).json({ error: 'too_many' });
  hit('put:' + row.id, 60 * 1000);
  const incoming = req.body && req.body.state;
  if (!isObj(incoming)) return res.status(400).json({ error: 'bad_state' });
  const clean = {};
  for (const [k, type] of Object.entries(COUPLE_KEYS)) {
    if (!(k in incoming)) continue;
    if (type === 'o' && !isObj(incoming[k])) return res.status(400).json({ error: 'bad_' + k });
    if (type === 'n' && typeof incoming[k] !== 'number') return res.status(400).json({ error: 'bad_' + k });
    clean[k] = incoming[k];
  }
  const now = Date.now();
  if (row.stage >= 2 && isObj(req.body.budget)) {
    const r2 = budgetFrom(req.body.budget, parse(row.budget, {}));
    if (r2.error) return res.status(400).json({ error: r2.error });
    db.prepare('UPDATE couples SET budget = ? WHERE id = ?').run(JSON.stringify(r2.value), row.id);
  }
  q.saveState.run(JSON.stringify(clean), now, row.id);
  res.json({ ok: true, updated_at: now });
});

/* ---------- API של המנהלת ---------- */
app.post('/api/admin/login', (req, res) => {
  const ip = req.ip, key = 'login:' + ip;
  if (limited(key, 5, 15 * 60 * 1000)) return res.status(429).json({ error: 'too_many' });
  const pw = req.body && req.body.password;
  const ok = typeof pw === 'string' && crypto.timingSafeEqual(sha(pw), sha(ADMIN_PASSWORD));
  if (!ok) { hit(key, 15 * 60 * 1000); return res.status(401).json({ error: 'bad_password' }); }
  setCookie(res, makeSession(), SESSION_MS / 1000);
  res.json({ ok: true });
});
app.post('/api/admin/logout', (req, res) => { setCookie(res, '', 0); res.json({ ok: true }); });
app.get('/api/admin/me', (req, res) => res.json({ auth: validSession(cookie(req, 'sid')) }));

/* זוג ששוחרר (שלב 3): המאמנת לא רואה יותר את הנתונים שלו */
const shape = r => r.stage === 3 ? ({
  id: r.id, token: '', code: r.cown ? '' : (r.code || '').toUpperCase(), cown: r.cown ? 1 : 0, profile: parse(r.profile, {}), cmsgs: parse(r.cmsgs, []), name: r.name, stage: 3, released: true,
  state: {}, budget: {}, notes: r.notes, tasks: parse(r.tasks, []), msgs: [],
  created_at: r.created_at, updated_at: 0, seen_at: 0
}) : ({
  id: r.id, token: r.token, code: r.cown ? '' : (r.code || '').toUpperCase(), cown: r.cown ? 1 : 0, profile: parse(r.profile, {}), cmsgs: parse(r.cmsgs, []), name: r.name, stage: r.stage,
  state: parse(r.state, {}), budget: parse(r.budget, {}),
  notes: r.notes, tasks: parse(r.tasks, []), msgs: parse(r.msgs, []),
  created_at: r.created_at, updated_at: r.updated_at || 0, seen_at: r.seen_at || 0
});

app.get('/api/admin/couples', requireAdmin, (req, res) => res.json(q.all.all().map(shape)));

app.get('/api/admin/backup', requireAdmin, (req, res) => {
  const d = new Date().toISOString().slice(0, 10);
  res.setHeader('Content-Disposition', `attachment; filename="budget-backup-${d}.json"`);
  res.json({ exported_at: Date.now(), couples: q.all.all().map(shape) });
});

app.post('/api/admin/couples', requireAdmin, (req, res) => {
  const name = req.body && typeof req.body.name === 'string' ? req.body.name.trim() : '';
  if (!name || name.length > 80) return res.status(400).json({ error: 'bad_name' });
  const info = q.insert.run(newToken(), name, Date.now(), freshCode());
  res.json(shape(q.byId.get(info.lastInsertRowid)));
});

app.put('/api/admin/couples/:id/state', requireAdmin, (req, res) => {
  const row = q.byId.get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'not_found' });
  if (row.stage === 3) return res.status(403).json({ error: 'released' });
  const b = req.body || {}, cur = parse(row.state, {}), num = v => typeof v === 'number' && isFinite(v);
  for (const k of ['bal', 'mo', 'rt', 'pm', 'fm']) if (k in b) { if (!isObj(b[k])) return res.status(400).json({ error: 'bad_' + k }); cur[k] = b[k]; }
  if ('L' in b) {
    const L = b.L, okV = v => v === undefined || v === '' || num(v) || (typeof v === 'string' && v.length <= 200);
    const okL = a => Array.isArray(a) && a.length <= 300 && a.every(x => isObj(x) && Object.entries(x).every(([k, v]) => k === 'p' ? (typeof v === 'string' && v.length <= 40000 && v.startsWith('data:image/')) : okV(v)));
    const keys = ['sv', 'ln', 'ins', 'gl', 'pn', 'kd'];
    if (!isObj(L) || keys.some(k => k in L && !okL(L[k]))) return res.status(400).json({ error: 'bad_L' });
    cur.L = Object.assign({}, cur.L || {});
    keys.forEach(k => { if (k in L) cur.L[k] = L[k]; });
  }
  const now = Date.now();
  q.saveState.run(JSON.stringify(cur), now, row.id);
  res.json(shape(q.byId.get(row.id)));
});
app.put('/api/admin/couples/:id', requireAdmin, (req, res) => {
  const row = q.byId.get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'not_found' });
  const b = req.body || {}, sets = [], vals = [];
  if (row.stage === 3 && ['bud', 'cs', 'sc', 'msgs'].some(k => k in b)) return res.status(403).json({ error: 'released' });
  if ('name' in b) { if (typeof b.name !== 'string' || !b.name.trim() || b.name.length > 80) return res.status(400).json({ error: 'bad_name' }); sets.push('name = ?'); vals.push(b.name.trim()); }
  if ('stage' in b) { if (![1, 2, 3].includes(b.stage)) return res.status(400).json({ error: 'bad_stage' }); sets.push('stage = ?'); vals.push(b.stage); }
  if ('code' in b) {
    if (row.cown && !b.reset) return res.status(403).json({ error: 'couple_owned' });
    if (!codeOk(b.code)) return res.status(400).json({ error: 'bad_code' });
    const nc = normCode(b.code), ex = q.byCode(nc);
    if (ex && ex.id !== row.id) return res.status(409).json({ error: 'code_taken' });
    sets.push('code = ?'); vals.push(nc);
    if (row.cown) { sets.push('cown = 0'); }
  }
  if ('profile' in b) { const p = cleanProfile(b.profile); if (!p) return res.status(400).json({ error: 'bad_profile' }); sets.push('profile = ?'); vals.push(JSON.stringify(p)); }
  if ('cmsgs' in b) {
    if (!Array.isArray(b.cmsgs) || b.cmsgs.length > 50 || b.cmsgs.some(m => !isObj(m) || typeof m.x !== 'string' || m.x.length > 2000)) return res.status(400).json({ error: 'bad_cmsgs' });
    sets.push('cmsgs = ?'); vals.push(JSON.stringify(b.cmsgs.map(m => ({ id: String(m.id), x: m.x, ts: Number(m.ts) || Date.now(), read: m.read ? 1 : 0 }))));
  }
  if ('notes' in b) { if (typeof b.notes !== 'string' || b.notes.length > 20000) return res.status(400).json({ error: 'bad_notes' }); sets.push('notes = ?'); vals.push(b.notes); }
  if ('tasks' in b) {
    if (!Array.isArray(b.tasks) || b.tasks.length > 200 || b.tasks.some(t => !isObj(t) || typeof t.t !== 'string' || t.t.length > 500 || (t.dt != null && (typeof t.dt !== 'string' || t.dt.length > 10)))) return res.status(400).json({ error: 'bad_tasks' });
    sets.push('tasks = ?'); vals.push(JSON.stringify(b.tasks.map(t => ({ t: t.t, d: t.d ? 1 : 0, dt: t.dt || '' }))));
  }
  if ('msgs' in b) {
    if (!Array.isArray(b.msgs) || b.msgs.length > 200 || b.msgs.some(m => !isObj(m) || !['msg', 'ch', 'tk'].includes(m.k) || typeof m.x !== 'string' || m.x.length > 2000 || (m.due != null && (typeof m.due !== 'string' || m.due.length > 10)))) return res.status(400).json({ error: 'bad_msgs' });
    sets.push('msgs = ?'); vals.push(JSON.stringify(b.msgs.map(m => ({ id: String(m.id), k: m.k, x: m.x, due: m.due || '', ts: Number(m.ts) || Date.now() }))));
  }
  if ('bud' in b || 'cs' in b || 'sc' in b) {
    const r2 = budgetFrom(b, parse(row.budget, {}));
    if (r2.error) return res.status(400).json({ error: r2.error });
    sets.push('budget = ?'); vals.push(JSON.stringify(r2.value));
  }
  if (!sets.length) return res.json(shape(row));
  db.prepare(`UPDATE couples SET ${sets.join(', ')} WHERE id = ?`).run(...vals, row.id);
  res.json(shape(q.byId.get(row.id)));
});

app.post('/api/admin/couples/:id/regenerate', requireAdmin, (req, res) => {
  const row = q.byId.get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'not_found' });
  if (row.stage === 3) return res.status(403).json({ error: 'released' });
  q.setToken.run(newToken(), row.id);
  res.json(shape(q.byId.get(row.id)));
});

app.delete('/api/admin/couples/:id', requireAdmin, (req, res) => {
  q.del.run(Number(req.params.id));
  res.json({ ok: true });
});

/* ---------- גיבוי יומי של בסיס הנתונים ---------- */
const BK_DIR = path.join(DATA_DIR, 'backups');
function dailyBackup() {
  try {
    fs.mkdirSync(BK_DIR, { recursive: true });
    const f = path.join(BK_DIR, 'budget-' + new Date().toISOString().slice(0, 10) + '.db');
    if (!fs.existsSync(f)) db.backup(f).then(() => {
      const old = fs.readdirSync(BK_DIR).filter(x => /^budget-.*\.db$/.test(x)).sort().slice(0, -14);
      old.forEach(x => fs.unlinkSync(path.join(BK_DIR, x)));
    }).catch(e => console.error('backup failed', e.message));
  } catch (e) { console.error('backup failed', e.message); }
}
dailyBackup(); setInterval(dailyBackup, 6 * 60 * 60 * 1000).unref();

/* ---------- תזכורות בטלפון (Web Push) ---------- */
let webpush = null;
try { webpush = require('web-push'); } catch (e) { console.error('web-push missing'); }
db.exec(`CREATE TABLE IF NOT EXISTS push_subs(id INTEGER PRIMARY KEY AUTOINCREMENT, couple_id INTEGER NOT NULL, endpoint TEXT UNIQUE NOT NULL, sub TEXT NOT NULL, created_at INTEGER NOT NULL)`);
db.exec(`CREATE TABLE IF NOT EXISTS push_log(couple_id INTEGER NOT NULL, kind TEXT NOT NULL, day TEXT NOT NULL, PRIMARY KEY(couple_id, kind, day))`);
let VAPID = null;
if (webpush) {
  try {
    const vf = path.join(DATA_DIR, 'vapid.json');
    VAPID = process.env.VAPID_PUBLIC && process.env.VAPID_PRIVATE ? { publicKey: process.env.VAPID_PUBLIC, privateKey: process.env.VAPID_PRIVATE }
      : fs.existsSync(vf) ? JSON.parse(fs.readFileSync(vf, 'utf8')) : null;
    if (!VAPID) { VAPID = webpush.generateVAPIDKeys(); fs.writeFileSync(vf, JSON.stringify(VAPID), { mode: 0o600 }); }
    webpush.setVapidDetails('mailto:' + (process.env.PUSH_CONTACT || 'noreply@example.com'), VAPID.publicKey, VAPID.privateKey);
  } catch (e) { console.error('vapid failed', e.message); VAPID = null; }
}
const pq = {
  add: db.prepare('INSERT INTO push_subs(couple_id, endpoint, sub, created_at) VALUES(?,?,?,?) ON CONFLICT(endpoint) DO UPDATE SET couple_id=excluded.couple_id, sub=excluded.sub'),
  del: db.prepare('DELETE FROM push_subs WHERE endpoint=?'),
  delMine: db.prepare('DELETE FROM push_subs WHERE endpoint=? AND couple_id=?'),
  cnt: db.prepare('SELECT COUNT(*) n FROM push_subs WHERE couple_id=?'),
  all: db.prepare('SELECT s.couple_id, s.endpoint, s.sub, c.state, c.stage, c.token FROM push_subs s JOIN couples c ON c.id=s.couple_id'),
  logged: db.prepare('SELECT 1 FROM push_log WHERE couple_id=? AND kind=? AND day=?'),
  log: db.prepare('INSERT OR IGNORE INTO push_log(couple_id, kind, day) VALUES(?,?,?)'),
};
app.get('/api/push-key', (req, res) => res.json({ key: VAPID ? VAPID.publicKey : null }));
app.get('/api/c/:token/push', (req, res) => { const row = coupleFromToken(req, res); if (!row) return; res.json({ n: pq.cnt.get(row.id).n }); });
app.post('/api/c/:token/push', (req, res) => {
  const row = coupleFromToken(req, res); if (!row) return;
  const b = req.body || {}, sub = b.sub;
  if (!VAPID || !sub || typeof sub.endpoint !== 'string' || !/^https:\/\//.test(sub.endpoint) || sub.endpoint.length > 1000 || !sub.keys || typeof sub.keys.p256dh !== 'string' || typeof sub.keys.auth !== 'string') return res.status(400).json({ error: 'bad_sub' });
  if (pq.cnt.get(row.id).n >= 10) return res.status(400).json({ error: 'too_many' });
  pq.add.run(row.id, sub.endpoint, JSON.stringify({ endpoint: sub.endpoint, keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth } }), Date.now());
  res.json({ ok: true });
});
app.delete('/api/c/:token/push', (req, res) => {
  const row = coupleFromToken(req, res); if (!row) return;
  const ep = req.body && req.body.endpoint; if (typeof ep === 'string') pq.delMine.run(ep, row.id);
  res.json({ ok: true });
});
function ilNow() { const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).formatToParts(new Date()); const g = t => +p.find(x => x.type === t).value; return { y: g('year'), m: g('month'), d: g('day'), h: g('hour') % 24 }; }
function pushMsgs(st, stage, now) {
  if (stage < 2) return [];
  const sd = Math.min(28, Math.max(1, parseInt(st.sd) || 1)), out = [];
  const dim = new Date(now.y, now.m, 0).getDate();
  const daysToStart = now.d < sd ? sd - now.d : dim - now.d + sd;
  if (now.d === sd) out.push(['start', 'חודש חדש התחיל', 'זמן למשוך מזומן למעטפות ולקבוע את ישיבת התקציב החודשית.']);
  if (daysToStart === 3) out.push(['end3', 'עוד 3 ימים לסוף החודש', 'כדאי להכין את פירוט האשראי ודפי הבנק לסגירת החודש.']);
  /* חודש קודם שלא נסגר, שבוע אחרי תחילת החודש */
  let pm = now.d >= sd ? now.m - 1 : now.m - 2, py = now.y; while (pm < 1) { pm += 12; py--; }
  const pk = py + '-' + pm, md = (st.md || {})[pk], act = (st.act || {})[pk];
  const started = now.d >= sd ? now.d - sd : now.d + (new Date(now.y, now.m - 1, 0).getDate() - sd);
  if (started === 7 && !md && act && Object.keys(act).length) out.push(['open', 'החודש הקודם עוד פתוח', 'כדאי לסיים את הסיווג והמעטפות ולסגור את החודש.']);
  return out;
}
async function pushTick() {
  if (!webpush || !VAPID) return;
  const now = ilNow(); if (now.h < 9 || now.h > 20) return;
  const day = now.y + '-' + now.m + '-' + now.d;
  for (const r of pq.all.all()) {
    let st = {}; try { st = JSON.parse(r.state || '{}'); } catch (e) { }
    for (const [kind, title, body] of pushMsgs(st, r.stage, now)) {
      if (pq.logged.get(r.couple_id, kind, day + '|' + r.endpoint.slice(-24))) continue;
      try {
        await webpush.sendNotification(JSON.parse(r.sub), JSON.stringify({ title, body, url: '/c/' + r.token }), { TTL: 12 * 3600 });
        pq.log.run(r.couple_id, kind, day + '|' + r.endpoint.slice(-24));
      } catch (e) { if (e.statusCode === 404 || e.statusCode === 410) pq.del.run(r.endpoint); else console.error('push failed', e.statusCode || e.message); }
    }
  }
}
setTimeout(pushTick, 60 * 1000).unref(); setInterval(pushTick, 60 * 60 * 1000).unref();

/* ---------- דפים ---------- */
const PUB_DIR = path.join(__dirname, 'public');
const pub = fs.existsSync(PUB_DIR) ? PUB_DIR : __dirname; /* תומך גם בקבצים שבשורש המאגר */
const ASSETS = new Set(['enter.js','favicon.svg','icon-180.png','icon-192.png','icon-512.png','xlsx.js','import.js','tx.js','lib.js', 'couple.js', 'admin.js', 'style.css']);
const page = f => (req, res) => { res.setHeader('Cache-Control', 'no-cache'); res.sendFile(path.join(pub, f)); };
app.get('/', page('enter.html'));
app.get('/admin', page('admin.html'));
app.get('/c/:token', page('couple.html'));
app.get('/c/:token/manifest.webmanifest', (req, res) => {
  res.type('application/manifest+json').json({ name: 'נקודת איזון', short_name: 'נקודת איזון', lang: 'he', dir: 'rtl', start_url: '/c/' + encodeURIComponent(req.params.token), scope: '/c/', display: 'standalone', background_color: '#ffffff', theme_color: '#1f3a5f', icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }] });
});
app.get('/sw.js', (req, res) => { res.setHeader('Cache-Control', 'no-cache'); res.type('application/javascript').send("self.addEventListener('install',function(){self.skipWaiting()});self.addEventListener('activate',function(e){e.waitUntil(self.clients.claim())});self.addEventListener('fetch',function(e){e.respondWith(fetch(e.request))});self.addEventListener('push',function(e){var d={};try{d=e.data.json()}catch(x){}e.waitUntil(self.registration.showNotification(d.title||'נקודת איזון',{body:d.body||'',dir:'rtl',lang:'he',icon:'/icon-192.png',badge:'/icon-192.png',data:{url:d.url||'/'}}))});self.addEventListener('notificationclick',function(e){e.notification.close();var u=(e.notification.data&&e.notification.data.url)||'/';e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(function(l){for(var i=0;i<l.length;i++){if(l[i].url.indexOf(u)>=0&&'focus' in l[i])return l[i].focus()}return self.clients.openWindow(u)}))});"); });
app.get('/:file', (req, res, next) => ASSETS.has(req.params.file) ? page(req.params.file)(req, res) : next());
app.use((req, res) => res.status(404).type('text').send('העמוד לא נמצא'));
app.use((err, req, res, next) => { console.error(err); res.status(err.status || 500).json({ error: 'server_error' }); });

app.listen(PORT, () => console.log('האתר פועל על פורט ' + PORT));
