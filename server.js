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

const q = {
  byToken: db.prepare('SELECT * FROM couples WHERE token = ?'),
  byId: db.prepare('SELECT * FROM couples WHERE id = ?'),
  all: db.prepare('SELECT * FROM couples ORDER BY COALESCE(updated_at, created_at) DESC'),
  insert: db.prepare('INSERT INTO couples(token, name, created_at) VALUES (?, ?, ?)'),
  saveState: db.prepare('UPDATE couples SET state = ?, updated_at = ? WHERE id = ?'),
  seen: db.prepare('UPDATE couples SET seen_at = ? WHERE id = ?'),
  del: db.prepare('DELETE FROM couples WHERE id = ?'),
  setToken: db.prepare('UPDATE couples SET token = ? WHERE id = ?')
};

/* ---------- כלים ---------- */
const newToken = () => crypto.randomBytes(18).toString('base64url');
const tokenOk = t => typeof t === 'string' && /^[A-Za-z0-9_-]{20,64}$/.test(t);
const parse = (s, d) => { try { return JSON.parse(s); } catch (e) { return d; } };
const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
const sha = s => crypto.createHash('sha256').update(String(s)).digest();

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
const COUPLE_KEYS = { bal: 'o', mo: 'o', rt: 'o', fc: 'o', cx: 'o', L: 'o', act: 'o', note: 'o', chd: 'o', ppl: 'n' };

app.get('/api/c/:token', (req, res) => {
  const row = coupleFromToken(req, res); if (!row) return;
  q.seen.run(Date.now(), row.id);
  res.json({
    name: row.name,
    stage: row.stage,
    state: parse(row.state, {}),
    bud: (parse(row.budget, {}).bud) || {},
    cs: (parse(row.budget, {}).cs) || {},
    msgs: parse(row.msgs, []),
    updated_at: row.updated_at || 0
  });
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

const shape = r => ({
  id: r.id, token: r.token, name: r.name, stage: r.stage,
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
  const info = q.insert.run(newToken(), name, Date.now());
  res.json(shape(q.byId.get(info.lastInsertRowid)));
});

app.put('/api/admin/couples/:id/state', requireAdmin, (req, res) => {
  const row = q.byId.get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'not_found' });
  const b = req.body || {}, cur = parse(row.state, {}), num = v => typeof v === 'number' && isFinite(v);
  for (const k of ['bal', 'mo', 'rt']) if (k in b) { if (!isObj(b[k])) return res.status(400).json({ error: 'bad_' + k }); cur[k] = b[k]; }
  if ('L' in b) {
    const L = b.L, okL = (a, f) => Array.isArray(a) && a.length <= 300 && a.every(x => isObj(x) && typeof x.n === 'string' && x.n.length <= 200 && f.every(k => num(x[k])));
    if (!isObj(L) || !okL(L.sv || [], ['m', 'v']) || !okL(L.ln || [], ['b', 'c', 'p'])) return res.status(400).json({ error: 'bad_L' });
    cur.L = Object.assign({}, cur.L || {}, { sv: L.sv || [], ln: L.ln || [] });
  }
  const now = Date.now();
  q.saveState.run(JSON.stringify(cur), now, row.id);
  res.json(shape(q.byId.get(row.id)));
});
app.put('/api/admin/couples/:id', requireAdmin, (req, res) => {
  const row = q.byId.get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'not_found' });
  const b = req.body || {}, sets = [], vals = [];
  if ('name' in b) { if (typeof b.name !== 'string' || !b.name.trim() || b.name.length > 80) return res.status(400).json({ error: 'bad_name' }); sets.push('name = ?'); vals.push(b.name.trim()); }
  if ('stage' in b) { if (![1, 2].includes(b.stage)) return res.status(400).json({ error: 'bad_stage' }); sets.push('stage = ?'); vals.push(b.stage); }
  if ('notes' in b) { if (typeof b.notes !== 'string' || b.notes.length > 20000) return res.status(400).json({ error: 'bad_notes' }); sets.push('notes = ?'); vals.push(b.notes); }
  if ('tasks' in b) {
    if (!Array.isArray(b.tasks) || b.tasks.length > 200 || b.tasks.some(t => !isObj(t) || typeof t.t !== 'string' || t.t.length > 500)) return res.status(400).json({ error: 'bad_tasks' });
    sets.push('tasks = ?'); vals.push(JSON.stringify(b.tasks.map(t => ({ t: t.t, d: t.d ? 1 : 0 }))));
  }
  if ('msgs' in b) {
    if (!Array.isArray(b.msgs) || b.msgs.length > 200 || b.msgs.some(m => !isObj(m) || !['msg', 'ch'].includes(m.k) || typeof m.x !== 'string' || m.x.length > 2000)) return res.status(400).json({ error: 'bad_msgs' });
    sets.push('msgs = ?'); vals.push(JSON.stringify(b.msgs.map(m => ({ id: String(m.id), k: m.k, x: m.x, ts: Number(m.ts) || Date.now() }))));
  }
  if ('bud' in b || 'cs' in b || 'sc' in b) {
    const cur = parse(row.budget, {});
    let bud = cur.bud || {}, cs = cur.cs || {}, sc = cur.sc || [];
    if ('sc' in b) {
      const okNum = o => isObj(o) && Object.values(o).every(v => typeof v === 'number' && isFinite(v));
      if (!Array.isArray(b.sc) || b.sc.length > 20 || b.sc.some(z => !isObj(z) || typeof z.id !== 'string' || z.id.length > 40 || typeof z.n !== 'string' || !z.n.trim() || z.n.length > 60 || typeof z.d !== 'string' || z.d.length > 7 || !okNum(z.bud))) return res.status(400).json({ error: 'bad_sc' });
      sc = b.sc.map(z => ({ id: z.id, n: z.n, d: z.d, bud: z.bud }));
    }
    if ('bud' in b) {
      if (!isObj(b.bud) || Object.values(b.bud).some(v => typeof v !== 'number' || !isFinite(v))) return res.status(400).json({ error: 'bad_bud' });
      bud = b.bud;
    }
    if ('cs' in b) {
      const c = b.cs, strs = a => Array.isArray(a) && a.length <= 2000 && a.every(x => typeof x === 'string' && x.length <= 130 && x.trim());
      if (!isObj(c) || !strs(c.hid || []) || !strs(c.hg || []) || !Array.isArray(c.ng || []) || (c.ng || []).length > 100 || (c.ng || []).some(x => !isObj(x) || !['i', 'f', 'v'].includes(x.t) || typeof x.n !== 'string' || !x.n.trim() || x.n.length > 60 || x.n.includes('|')) || !isObj(c.ni || {}) || Object.values(c.ni || {}).some(a => !strs(a))) return res.status(400).json({ error: 'bad_cs' });
      cs = { hid: c.hid || [], hg: c.hg || [], ng: (c.ng || []).map(x => ({ t: x.t, n: x.n })), ni: c.ni || {} };
    }
    sets.push('budget = ?'); vals.push(JSON.stringify({ bud, cs, sc }));
  }
  if (!sets.length) return res.json(shape(row));
  db.prepare(`UPDATE couples SET ${sets.join(', ')} WHERE id = ?`).run(...vals, row.id);
  res.json(shape(q.byId.get(row.id)));
});

app.post('/api/admin/couples/:id/regenerate', requireAdmin, (req, res) => {
  const row = q.byId.get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'not_found' });
  q.setToken.run(newToken(), row.id);
  res.json(shape(q.byId.get(row.id)));
});

app.delete('/api/admin/couples/:id', requireAdmin, (req, res) => {
  q.del.run(Number(req.params.id));
  res.json({ ok: true });
});

/* ---------- דפים ---------- */
const PUB_DIR = path.join(__dirname, 'public');
const pub = fs.existsSync(PUB_DIR) ? PUB_DIR : __dirname; /* תומך גם בקבצים שבשורש המאגר */
const ASSETS = new Set(['xlsx.js','import.js','lib.js', 'couple.js', 'admin.js', 'style.css']);
const page = f => (req, res) => { res.setHeader('Cache-Control', 'no-cache'); res.sendFile(path.join(pub, f)); };
app.get('/', (req, res) => res.redirect('/admin'));
app.get('/admin', page('admin.html'));
app.get('/c/:token', page('couple.html'));
app.get('/:file', (req, res, next) => ASSETS.has(req.params.file) ? page(req.params.file)(req, res) : next());
app.use((req, res) => res.status(404).type('text').send('העמוד לא נמצא'));
app.use((err, req, res, next) => { console.error(err); res.status(err.status || 500).json({ error: 'server_error' }); });

app.listen(PORT, () => console.log('האתר פועל על פורט ' + PORT));
