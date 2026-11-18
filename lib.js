/* קוד משותף: נתוני קטגוריות, חישובים ותצוגות */
var D=[['i','הכנסות','הכנסה מעבודה בן זוג,הכנסה מעבודה בת זוג,קצבת ילדים,קצבה אחרת,עזרה ממשפחה,הכנסה מנכסים'],
['f','הוצאות בית','שכר דירה,משכנתא דירה למגורים,ביטוח תכולה,ועד בית,חשמל,ארנונה,מים,גז,בר מים,עוזרת,עיתונים'],
['f','תקשורת','טלפון,טלפון נייד,אינטרנט'],
['f','חינוך','מעון / מטפלת,גנים,בית ספר,חיידר,ישיבה,סמינר,לימודים הורים,חוגים / שיעורי עזר,פסיכולוג / הוראה מתקנת,צהרונים,דמי שכלול,ספרי לימוד תחילת שנה,טיולים שנתיים,קייטנות,ועד בית ספר'],
['f','תחבורה','ביטוח רכב,דלק,כביש 6,חניות,רכב טיפולים ורישוי,רב קו,הסעות קבועות הורים / ילדים'],
['f','בריאות','קופ"ח ביטוח בריאות משלים,ביטוח בריאות פרטי,תרופות,רפואה משלימה,טיפולי שיניים,עדשות ראיה / משקפיים,טיפול רגשי'],
['f','בנקים ואשראי','הלוואות,עיסקאות בתשלומים,עמלות בנק,דמי כרטיס'],
['f','השקעות וחסכונות','הלוואה שנלקחו לצורך השקעה,משכנתא דירה להשקעה,קרן חרום,הוצאות לא מתוכננות,חסכונות,נסיעות וחופשות'],
['f','שונות קבועות','ביטוח לאומי,מקווה,הוצאות חג,ניקוי יבש,תרומות ומעשרות'],
['v','קניות','אוכל ומוצרי מכולת,אוכל בחוץ,סיגריות,הוצאות תינוקות,ביגוד חגים,ביגוד והנעלה עונתי'],
['v','טיפוח','קוסמטיקה טיפולים ומוצרים,מספרה / פאנית,דיאטה,מכון כושר,קנטרי'],
['v','תחבורה משתנה',''],
['v','בית','מוצרים ורהיטים לבית,ספרים,תיקנוים וטכנאים,אחזקת הבית'],
['v','בילויים','בילויים,מסעדות,צעצועים,מתנות לצוות בית הספר,מתנות לבני משפחה,מתנות לאירועים'],
['v','שונות משתנות','דמי כיס הורים,דמי כיס ילדים']];
var G=[];
function ecs(){var c=(S&&S.cs)||{};return{hid:c.hid||[],hg:c.hg||[],ng:c.ng||[],ni:c.ni||{}}}
function insItems(){var l=(S.L&&S.L.ins)||[],seen={},o=[];l.forEach(function(x){var p=x.f==='שנתי'?n(x.p)/12:n(x.p);if(!(p>0))return;var nm=((x.y||'')+(x.n?' - '+x.n:'')).trim()||'ביטוח';while(seen[nm])nm+=' ';seen[nm]=1;o.push({n:nm,v:Math.round(p*100)/100})});return o}
function insSync(){insItems().forEach(function(x){S.bal['ביטוחים|'+x.n]=x.v})}
var IC={"home": "<path d=\"M3 11l9-8 9 8\"/><path d=\"M5 10v10h14V10\"/><path d=\"M10 20v-6h4v6\"/>", "tasks": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M8 12l3 3 5-6\"/>", "bal": "<path d=\"M12 3v18M6 21h12M5 7h14\"/><path d=\"M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z\"/>", "bud": "<path d=\"M3 7h16a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z\"/><path d=\"M3 7l12-4v4\"/><circle cx=\"17\" cy=\"14\" r=\"1\"/>", "mon": "<path d=\"M5 20V11M12 20V4M19 20v-6\"/>", "yr": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/>", "sv": "<ellipse cx=\"12\" cy=\"6\" rx=\"8\" ry=\"3\"/><path d=\"M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6\"/>", "yc": "<path d=\"M21 12a9 9 0 11-3-6.7M21 4v5h-5\"/>", "ins": "<path d=\"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z\"/><path d=\"M9 12l2 2 4-4\"/>", "sum": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"9\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"5\" rx=\"1\"/><rect x=\"14\" y=\"12\" width=\"7\" height=\"9\" rx=\"1\"/><rect x=\"3\" y=\"16\" width=\"7\" height=\"5\" rx=\"1\"/>", "sc": "<circle cx=\"6\" cy=\"5\" r=\"2\"/><circle cx=\"6\" cy=\"19\" r=\"2\"/><circle cx=\"18\" cy=\"9\" r=\"2\"/><path d=\"M6 7v10M18 11c0 4-6 3-12 6\"/>", "mg": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1\"/>", "inc": "<path d=\"M12 3v14M6 11l6 6 6-6M4 21h16\"/>", "phone": "<rect x=\"7\" y=\"2\" width=\"10\" height=\"20\" rx=\"2\"/><path d=\"M11 18h2\"/>", "edu": "<path d=\"M2 8l10-5 10 5-10 5z\"/><path d=\"M6 10.5V16c0 1 3 3 6 3s6-2 6-3v-5.5\"/>", "car": "<path d=\"M5 16l1.5-6A2 2 0 018.4 8.5h7.2a2 2 0 011.9 1.5L19 16\"/><rect x=\"3\" y=\"16\" width=\"18\" height=\"4\" rx=\"1\"/>", "heart": "<path d=\"M12 21s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 6-8 11-8 11z\"/>", "card": "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"M2 10h20\"/>", "trend": "<path d=\"M3 17l6-6 4 4 8-8M15 7h6v6\"/>", "dots": "<circle cx=\"5\" cy=\"12\" r=\"1.5\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\"/><circle cx=\"19\" cy=\"12\" r=\"1.5\"/>", "cart": "<path d=\"M3 4h2l2.4 11h11l2-8H6\"/><circle cx=\"9\" cy=\"20\" r=\"1.5\"/><circle cx=\"18\" cy=\"20\" r=\"1.5\"/>", "spark": "<path d=\"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z\"/>", "music": "<path d=\"M9 18V5l12-2v13\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><circle cx=\"18\" cy=\"16\" r=\"3\"/>", "dot": "<circle cx=\"12\" cy=\"12\" r=\"4\"/>"},GIC={"הכנסות": "inc", "הוצאות בית": "home", "תקשורת": "phone", "חינוך": "edu", "תחבורה": "car", "תחבורה משתנה": "car", "בריאות": "heart", "בנקים ואשראי": "card", "השקעות וחסכונות": "trend", "שונות קבועות": "dots", "שונות משתנות": "dots", "קניות": "cart", "טיפוח": "spark", "בית": "home", "בילויים": "music", "ביטוחים": "ins"},GCOL=['#2F6FED','#1C8C6E','#E0562E','#8A4FD6','#0E8FA6','#C2307A','#B45309','#4A5873'];
function ic(nm,s){s=s||20;return '<svg class="ic" viewBox="0 0 24 24" width="'+s+'" height="'+s+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(IC[nm]||IC.dot)+'</svg>'}
function gic(nm){var i=0,k;for(k=0;k<nm.length;k++)i=(i+nm.charCodeAt(k))%GCOL.length;var c=GCOL[i];return '<span class="gi" style="color:'+c+';background:'+c+'1f">'+ic(GIC[nm]||'dot',18)+'</span>'}
function navLbl(id,l){return '<span class="ni">'+ic(id,20)+'<span>'+l+'</span></span>'}
function bG(){var c=ecs();G=D.map(function(a){return{t:a[0],n:a[1],i:a[2]?a[2].split(','):[]}}).filter(function(g){return c.hg.indexOf(g.n)<0}).concat(c.ng.map(function(x){return{t:x.t,n:x.n,i:[]}}));if(insItems().length){G.push({t:'f',n:'ביטוחים',i:[],auto:1});insSync()}}
var SEC={i:'הכנסות',f:'הוצאות קבועות',v:'הוצאות משתנות'};
var MN=['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
var ADM=false,RO=false,STAGE=1,INBOX=[];
function newState(){return{bal:{},bud:{},act:{},cx:{},note:{},fam:'',chd:{},ppl:0,mo:{},rt:{},pm:{},fc:{},fm:{},dn:0,cs:{hid:[],hg:[],ng:[],ni:{}},L:{sv:[],ln:[],ins:[],gl:[],pn:[]},yc:{},yx:{},md:{},mt:{},y:new Date().getFullYear(),m:new Date().getMonth()+1,tab:'home',open:{}}}
var S=newState();
function W(st,fn){var o=S;S=st;bG();try{return fn()}finally{S=o;bG()}}
function ago(t){if(!t)return 'טרם עודכן';var m=Math.round((Date.now()-t)/60000);return m<1?'עודכן עכשיו':m<60?'עודכן לפני '+m+' דקות':m<1440?'עודכן לפני '+Math.round(m/60)+' שעות':'עודכן לפני '+Math.round(m/1440)+' ימים'}
function monSel(){var o=MN.map(function(m,i){return '<option value="'+(i+1)+'"'+(i+1===S.m?' selected':'')+'>'+m+'</option>'}).join('');return '<div class="f" style="margin-bottom:10px"><select id="ms">'+o+'</select><input id="yr" type="number" value="'+S.y+'" style="max-width:100px"></div>'}
function n(v){return Number(v)||0}
function fm(v){return Math.round(v).toLocaleString('he-IL')+' ₪'}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ym(){return S.y+'-'+S.m}
function rc(k){var m=(S.mo[k]||[]).filter(function(v){return v!==''&&v!=null});if(m.length)S.bal[k]=m.reduce(function(a,b){return a+b},0)/m.length;else delete S.bal[k]}
function its(g){if(g.auto)return insItems().map(function(x){return x.n});var c=ecs();return g.i.concat(c.ni[g.n]||[],S.cx[g.n]||[]).filter(function(i,x,a){return c.hid.indexOf(g.n+'|'+i)<0&&a.indexOf(i)===x})}
function st(sn,k){return sn==='act'?(S.act[k||ym()]||{}):(S[sn]||{})}
function useVs(){var z=(S.sc||[]).filter(function(x){return x.id===S.vs})[0];S.bud=z?z.bud:(S.bud0||{})}
function vsUI(){var l=S.sc||[];if(!l.length)return '<div class="c vs"><label style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>תקציב להצגה</b><select id="vs" disabled aria-label="בחירת תקציב או תסריט"><option>התקציב הנוכחי</option></select></label><div class="hint" style="margin:6px 0 0">כשהמאמנת תוסיף תסריטים, למשל מעבר דירה או ילד נוסף, תוכלו לבחור כאן איזה תקציב לראות.</div></div>';return '<div class="c vs"><label style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>תקציב להצגה</b><select id="vs" aria-label="בחירת תקציב או תסריט"><option value="">התקציב הנוכחי</option>'+l.map(function(z){return '<option value="'+esc(z.id)+'"'+(z.id===S.vs?' selected':'')+'>'+esc(z.n)+(z.d?' (מ-'+esc(z.d)+')':'')+'</option>'}).join('')+'</select></label></div>'}
function tot(b){var o=S.scb;S.scb=b||{};var r={i:ts('scb','i'),f:ts('scb','f'),v:ts('scb','v')};r.e=r.f+r.v;r.b=r.i-r.e;S.scb=o;return r}
function gs(sn,g,k){var s=st(sn,k);return its(g).reduce(function(a,i){return a+n(s[g.n+'|'+i])},0)}
function ts(sn,t,k){return G.filter(function(g){return g.t===t}).reduce(function(a,g){return a+gs(sn,g,k)},0)}
function ex(sn,k){return ts(sn,'f',k)+ts(sn,'v',k)}
function cls(g,p){return g.t==='i'?(p>=1?'ok':p>=.8?'wn':'bd'):(p>1?'bd':p>=.85?'wn':'ok')}
function grp(g,mode){
  var sn=mode==='mon'?'act':mode,s=st(sn),sub=gs(sn,g),bs=gs('bud',g),inc=ts('bal','i'),o=S.open[g.n];
  var meta=mode==='bal'?fm(sub)+(inc&&g.t!=='i'?' · '+Math.round(sub/inc*100)+'%':''):mode==='bud'||mode==='scb'?fm(sub):fm(sub)+' / '+fm(bs);
  var bar=mode==='mon'&&bs?'<div class="bar"><i class="'+cls(g,sub/bs)+'" style="width:'+Math.min(100,sub/bs*100)+'%"></i></div>':'';
  var rows=o?its(g).map(function(i){
    var k=g.n+'|'+i,inp='<input type="number" inputmode="decimal" min="0"'+(RO&&mode==='bud'?' disabled':'')+' data-s="'+sn+'" data-k="'+esc(k)+'" value="'+(s[k]||'')+'" placeholder="0">';
    if(mode==='mon'){var bv=n(S.bud[k]),av=n(s[k]),d=g.t==='i'?av-bv:bv-av;return '<div class="r"><label>'+esc(i)+'<small>תקציב '+fm(bv)+(g.t!=='i'&&pmv(g,i)?' · '+esc(pmv(g,i)):'')+'</small></label>'+inp+'<span class="d '+(d<0?'neg':'')+'">'+fm(d)+'</span></div>'}
    if(mode==='bal'){var mo=(S.mo[k]||[]).slice(),fl=mo.filter(function(v){return v!==''&&v!=null}).length,rt=S.rt[k]||{},ex2=g.t!=='i';
      while(mo.length<2)mo.push('');
      var sel=function(w){return '<select data-s="rt" data-k="'+esc(k)+'" data-w="'+w+'" aria-label="דירוג"><option value="">—</option>'+[1,2,3,4,5].map(function(v){return '<option'+(String(rt[w])===String(v)?' selected':'')+'>'+v+'</option>'}).join('')+'</select>'};
      var ra=n(rt.a),rb=n(rt.b),rav=ra&&rb?(ra+rb)/2:0;
      return '<div class="it bl"><div class="tot" style="padding:0"><span>'+esc(i)+'</span><span>'+(s[k]!==undefined&&s[k]!==''?fm(n(s[k])):'—')+'</span></div>'+
      '<div class="dt">'+Array.from(mo,function(v,j){return '<span><small>חודש '+(j+1)+'</small><input type="number" inputmode="decimal" min="0" data-s="mo" data-k="'+esc(k)+'" data-j="'+j+'" value="'+(v===undefined||v===null?'':v)+'"'+(g.auto?' disabled':'')+'></span>'}).join('')+'<button class="btn sec" data-a="mo" data-id="'+esc(k)+'" aria-label="הוספת חודש">+ חודש</button></div>'+
      '<small>'+(g.auto?'נוסף אוטומטית מלשונית הביטוחים':fl>1?'ממוצע של '+fl+' חודשים':'מלאו חודשיים והממוצע יחושב לבד')+'</small>'+
      (ex2?'<div class="dt"><span><small>אמצעי תשלום</small>'+pmSel(g,i,false)+'</span><span><small>דירוג בן זוג</small>'+sel('a')+'</span><span><small>דירוג בת זוג</small>'+sel('b')+'</span>'+(rav?'<span><small>ממוצע דירוג</small><b>'+rav.toFixed(1)+'</b></span>':'')+'</div>':'')+'</div>'}
    return '<div class="r"><label>'+esc(i)+(mode==='bud'?'<small>במאזן '+fm(n(S.bal[k]))+(ADM?rtTxt(k):'')+'</small>':mode==='scb'?'<small>בתקציב הנוכחי '+fm(n(S.bud[k]))+'</small>':'')+'</label>'+inp+(mode==='bud'&&g.t!=='i'?pmSel(g,i,RO):'')+(ADM&&mode==='bud'?'<button class="gh" style="width:30px;color:var(--bd)" data-a="xi" data-g="'+esc(g.n)+'" data-i="'+esc(i)+'" aria-label="הסרת תת קטגוריה '+esc(i)+'">✕</button>':'')+'</div>'}).join(''):'';
  return '<div class="c"><button class="gh" data-a="tg" data-id="'+esc(g.n)+'"><span class="gn">'+gic(g.n)+'<span>'+esc(g.n)+'</span><i class="ar">'+(o?'▾':'◂')+'</i></span><span>'+meta+'</span></button>'+bar+rows+(ADM&&mode==='bud'&&o&&ecs().ng.some(function(z){return z.n===g.n})?'<div class="r"><button class="btn sec" style="color:var(--bd)" data-a="xg" data-g="'+esc(g.n)+'">הסרת הקטגוריה "'+esc(g.n)+'"</button></div>':'')+'</div>'}
function secs(mode){return ['i','f','v'].map(function(t){return '<h3>'+SEC[t]+'</h3>'+G.filter(function(g){return g.t===t}).map(function(g){return grp(g,mode)}).join('')}).join('')}
function bottom(sn,k){var i=ts(sn,'i',k),e=ex(sn,k);return (sn==='bud'||sn==='bal'?pmSum(sn):'')+'<div class="c"><div class="tot"><span>סה״כ הכנסות</span><span>'+fm(i)+'</span></div><div class="tot"><span>סה״כ הוצאות</span><span>'+fm(e)+'</span></div><div class="tot"><span>יתרה</span><span class="'+(i-e<0?'neg':'')+'">'+fm(i-e)+'</span></div></div>'}
function bal(){
  var food=n(S.bal['קניות|אוכל ומוצרי מכולת']),p=n(S.ppl)||((S.L.kd||[]).length?2+S.L.kd.length:0);
  var opts=G.map(function(g){return '<option>'+esc(g.n)+'</option>'}).join('');
  return (ADM?'':rulesUI())+'<p class="hint">לכל סעיף הזינו את הסכום של חודשיים והממוצע יחושב לבד (אפשר להוסיף עוד חודשים). בן הזוג ובת הזוג מדרגים כל הוצאה: 1 = חיוני, 5 = אפשר לוותר.</p>'+secs('bal')+bottom('bal')+
  '<div class="c"><div class="r" style="border:0"><label>מספר נפשות בבית</label><input type="number" min="0" data-s="ppl" data-k="x" value="'+(S.ppl||'')+'"></div>'+
  (p&&food?'<div class="tot"><span>מזון לנפש לשבוע</span><span>'+fm(food/p/4.2)+'</span></div>':'')+'</div>'+
  '<div class="c"><b>הוספת סעיף</b><div class="f" style="margin-top:8px"><select id="cg">'+opts+'</select><input id="cn" placeholder="שם הסעיף"><button class="btn" data-a="add">הוספה</button></div></div>'}
function structUI(){var o=G.map(function(g){return '<option>'+esc(g.n)+'</option>'}).join('');return '<div class="c"><b>ניהול קטגוריות</b><p class="hint">שינוי כאן מתעדכן אצל הזוג במאזן, בתקציב, במעקב ובסיכומים. אפשר להוסיף ולהסיר תתי קטגוריות, ולהוסיף קטגוריה חדשה (רק קטגוריה שהוספת אפשר להסיר). הסרה מסתירה את הסעיף, והנתונים נשמרים.</p><div class="f"><select id="sg">'+o+'</select><input id="sn" placeholder="שם תת קטגוריה"><button class="btn" data-a="ai">הוספת תת קטגוריה</button></div><div class="f" style="margin-top:8px"><select id="ct"><option value="f">הוצאה קבועה (אשראי)</option><option value="v">הוצאה משתנה (מעטפה)</option><option value="i">הכנסה</option></select><input id="cn2" placeholder="שם קטגוריה חדשה"><button class="btn" data-a="ag">הוספת קטגוריה</button></div></div>'}
function bud(){return '<p class="hint">'+(RO?'התקציב נקבע עבורכם על ידי המאמנת, ומוצג כאן לצפייה.':'התקציב נבנה מהמאזן. אפשר להעתיק אותו ואז לשנות סעיפים.')+'</p>'+(RO?'':'<button class="btn" data-a="fill" style="margin-bottom:6px">העתק מהמאזן</button>')+secs('bud')+bottom('bud')+(ADM?structUI():'')}
function mon(){
  var k=ym(),ai=ts('act','i'),pi=ts('bud','i'),ae=ex('act'),pe=ex('bud');
  var ms=MN.map(function(m,i){return '<option value="'+(i+1)+'"'+(i+1===S.m?' selected':'')+'>'+m+'</option>'}).join('');
  return '<div class="f" style="margin-bottom:10px"><select id="ms">'+ms+'</select><input id="yr" type="number" value="'+S.y+'" style="max-width:100px"></div>'+
  '<div class="g"><div class="k"><b>'+fm(ai)+'</b><span>הכנסות (תקציב '+fm(pi)+')</span></div><div class="k"><b class="'+(ae>pe&&pe?'neg':'')+'">'+fm(ae)+'</b><span>הוצאות (תקציב '+fm(pe)+')</span></div><div class="k"><b class="'+(ai-ae<0?'neg':'')+'">'+fm(ai-ae)+'</b><span>יתרה בפועל</span></div></div>'+
  overUI()+'<p class="hint">הזינו את הסכום בפועל לכל סעיף. העמודה האחרונה מראה את ההפרש מהתקציב, ובאדום חריגה.</p>'+secs('mon')+
  '<div class="c"><b>הערות לחודש</b><textarea id="nt" rows="3" style="width:100%;margin-top:6px" placeholder="סיכום, מסקנות ומשימות לחודש הבא">'+esc(S.note[k]||'')+'</textarea></div>'+mdUI()}
function yr(){
  var rows='',TI=0,TE=0,TP=0;
  MN.forEach(function(m,i){var k=S.y+'-'+(i+1),ai=ts('act','i',k),ae=ex('act',k);
    if(!ai&&!ae){rows+='<tr><td>'+m+'</td><td colspan="4">—</td></tr>';return}
    TI+=ai;TE+=ae;TP+=ex('bud')-ae;
    rows+='<tr><td>'+m+'</td><td>'+fm(ai)+'</td><td>'+fm(ae)+'</td><td class="'+(ai-ae<0?'neg':'')+'">'+fm(ai-ae)+'</td><td class="'+(ex('bud')-ae<0?'neg':'')+'">'+fm(ex('bud')-ae)+'</td></tr>'});
  rows+='<tr><th>סה״כ</th><th>'+fm(TI)+'</th><th>'+fm(TE)+'</th><th>'+fm(TI-TE)+'</th><th>'+fm(TP)+'</th></tr>';
  return '<div class="c ov"><b>שנת '+S.y+'</b><table><tr><th>חודש</th><th>הכנסות</th><th>הוצאות</th><th>יתרה</th><th>פער מהתקציב</th></tr>'+rows+'</table></div><p class="hint">פער מהתקציב: חיובי = חסכתם ביחס לתוכנית, שלילי = חריגה.</p>'}
function defL(){return{sv:['יתרה בעו"ש','חיסכון לכל ילד','קופת גמל','קרן השתלמות','קרן חרום','הוצאות בלתי מתוכננות'].map(function(x){return{n:x,m:'',v:'',r:'',y:'',q:''}}),ln:[],ins:[],gl:[],kd:[],pn:['פנסיה בן זוג','פנסיה בת זוג'].map(function(x){return{n:x,v:'',m:'',e:'',c:''}})}}
var FD={pn:[{k:'n',l:'שם',t:'t'},{k:'v',l:'שווי נוכחי',t:'n'},{k:'m',l:'הפקדה חודשית',t:'n'},{k:'e',l:'הצפי לפנסיה',t:'n'},{k:'c',l:'עמלות %',t:'n'}],kd:[{k:'n',l:'שם הילד/ה',t:'t'},{k:'a',l:'גיל',t:'n'}],sv:[{k:'n',l:'שם החיסכון',t:'t'},{k:'m',l:'הפקדה חודשית',t:'n'},{k:'v',l:'שווי נוכחי',t:'n'},{k:'r',l:'תשואה שנתית %',t:'n'},{k:'y',l:'צפי לעוד (שנים)',t:'n'},{k:'q',l:'נזילות',t:'s',o:['נזיל מיידית','תוך שנה','ארוך טווח']}],
ln:[{k:'n',l:'שם ההלוואה',t:'t'},{k:'b',l:'יתרה',t:'n'},{k:'c',l:'חודשים לסיום',t:'n'},{k:'p',l:'החזר חודשי',t:'n'}],
ins:[{k:'y',l:'סוג',t:'s',o:['חיים','בריאות','רכב','דירה ותכולה','אובדן כושר עבודה','אחר']},{k:'n',l:'חברה / פירוט',t:'t'},{k:'p',l:'פרמיה',t:'n'},{k:'f',l:'תדירות',t:'s',o:['חודשי','שנתי']},{k:'r',l:'חידוש',t:'m'}],
gl:[{k:'n',l:'שם היעד',t:'t'},{k:'t',l:'סכום יעד',t:'n'},{k:'s',l:'נחסך עד כה',t:'n'},{k:'d',l:'תאריך יעד',t:'m'}]};
function sm(l,f,fn){return S.L[l].filter(fn||function(){return true}).reduce(function(a,x){return a+n(x[f])},0)}
function tile(b,s,c){return '<div class="k"><b class="'+(c||'')+'">'+b+'</b><span>'+s+'</span></div>'}
function fld(l,i,f,v){var b=' data-s="L" data-k="'+l+'.'+i+'.'+f.k+'"'+(f.t==='n'?' data-ty="n"':''),h;
  if(f.t==='s')h='<select'+b+'>'+(v?'':'<option value="">—</option>')+f.o.map(function(o){return '<option'+(o===v?' selected':'')+'>'+o+'</option>'}).join('')+'</select>';
  else h='<input type="'+(f.t==='n'?'number':f.t==='m'?'month':'text')+'"'+b+' value="'+esc(v==null?'':v)+'"'+(f.t==='n'?' inputmode="decimal" min="0"':'')+'>';
  return '<span><small>'+f.l+'</small>'+h+'</span>'}
function lst(l,title,hint,xf){return '<div class="c"><b>'+title+'</b><p class="hint">'+hint+'</p>'+S.L[l].map(function(x,i){return '<div class="it"><div class="fl">'+FD[l].map(function(f){return fld(l,i,f,x[f.k])}).join('')+'<button class="gh" style="width:30px;color:var(--bd)" data-a="ld" data-l="'+l+'" data-i="'+i+'" aria-label="מחיקה">✕</button></div>'+(xf?xf(x):'')+'</div>'}).join('')+'<button class="btn" data-a="la" data-l="'+l+'" style="margin-top:8px">+ הוספה</button></div>'}
function gm(d){if(!d)return null;var p=d.split('-'),t=new Date();return (+p[0]-t.getFullYear())*12+(+p[1]-(t.getMonth()+1))}
function fv(p,m,r,y){var i=Math.pow(1+r/100,1/12)-1,k=Math.round(y*12),v=p;for(var j=0;j<k;j++)v=v*(1+i)+m;return v}
function fcalc(){var f=S.fc||{},p=n(f.p),m=n(f.m),r=n(f.r),y=Math.min(60,Math.max(0,n(f.y))),sp=n(f.s)||2;
  var sc=[Math.max(0,r-sp),r,r+sp],ys=[],yy;for(yy=1;yy<=y;yy++)ys.push(yy);
  var dep=function(t){return p+m*t*12};
  var rows=ys.filter(function(t){return t<=10||t%5===0||t===y}).map(function(t){return '<tr><td>'+t+'</td><td>'+fm(dep(t))+'</td>'+sc.map(function(c){return '<td>'+fm(fv(p,m,c,t))+'</td>'}).join('')+'</tr>'}).join('');
  var W=320,H=120,pts=function(c){return ys.length?[0].concat(ys).map(function(t,ix){return (ix/ys.length*W).toFixed(1)+','+(H-8-(fv(p,m,c,t)/Math.max(1,fv(p,m,sc[2],y)))*(H-16)).toFixed(1)}).join(' '):''};
  var dl=ys.length?[0].concat(ys).map(function(t,ix){return (ix/ys.length*W).toFixed(1)+','+(H-8-(dep(t)/Math.max(1,fv(p,m,sc[2],y)))*(H-16)).toFixed(1)}).join(' '):'';
  var gain=fv(p,m,r,y)-dep(y);
  return {sc:sc,y:y,html:(y>0&&(p||m)?'<div class="g">'+tile(fm(fv(p,m,r,y)),'שווי צפוי בתשואה '+r+'%')+tile(fm(dep(y)),'סך הפקדות')+tile(fm(gain),'רווח צפוי')+'</div>'+
  '<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="גרף תחזית חיסכון" style="max-height:170px"><polyline points="'+dl+'" fill="none" stroke="#8a97b0" stroke-width="2" stroke-dasharray="4 3"/><polyline points="'+pts(sc[0])+'" fill="none" stroke="#e0562e" stroke-width="2"/><polyline points="'+pts(sc[1])+'" fill="none" stroke="#2f6fed" stroke-width="3"/><polyline points="'+pts(sc[2])+'" fill="none" stroke="#1c8c6e" stroke-width="2"/></svg>'+
  '<small class="hint">קו מקווקו: הפקדות בלבד · כתום: '+sc[0]+'% · כחול: '+sc[1]+'% · ירוק: '+sc[2]+'%</small>'+
  '<div class="ov"><table><tr><th>שנה</th><th>הפקדות</th><th>תשואה '+sc[0]+'%</th><th>תשואה '+sc[1]+'%</th><th>תשואה '+sc[2]+'%</th></tr>'+rows+'</table></div>':'<p class="hint">הזינו סכום התחלתי או הפקדה חודשית, תשואה ומספר שנים כדי לראות תחזית.</p>')}}
function fcUI(){var f=S.fc||{},inp=function(k,l,u,ph){return '<span><small>'+l+'</small><input type="number" inputmode="decimal" min="0" class="fcin" data-s="fc" data-k="'+k+'" value="'+(f[k]===undefined?'':esc(f[k]))+'" placeholder="'+(ph||'0')+'" aria-label="'+l+'"></span>'};
  var dep=sm('sv','m'),val=sm('sv','v'),pre=(val||dep)?'<div class="hint">אפשר להתחיל מהחסכונות שלכם: שווי נוכחי '+fm(val)+', הפקדה חודשית '+fm(dep)+'.</div>':'';
  return '<div class="c"><b>תחזית חיסכון לפי תשואה</b><p class="hint">כמה יהיה שווה הכסף אם מפקידים סכום קבוע בכל חודש. התשואה היא שנתית, והחישוב מניח הפקדה בסוף כל חודש. זו הערכה בלבד ולא הבטחה לתשואה.</p>'+pre+
  '<div class="dt">'+inp('p','סכום התחלתי')+inp('m','הפקדה חודשית')+inp('r','תשואה שנתית %','', '5')+inp('y','מספר שנים','','10')+inp('s','פער לתרחישים %','','2')+'</div><div id="fcout">'+fcalc().html+'</div></div>'}
function svf(x){var f=S.fc||{},r=x.r!==undefined&&x.r!==''&&x.r!==null?n(x.r):(f.r!==undefined&&f.r!==''?n(f.r):null),y=n(x.y)||n(f.y);if(r==null||!y)return '<small>בחרו תשואה ומספר שנים כדי לראות צפי.</small>';var a=fv(n(x.v),n(x.m),r,y),d=n(x.v)+n(x.m)*12*y;return '<div class="fcr"><b>צפי בעוד '+y+' שנים: '+fm(a)+'</b><small>בתשואה של '+r+'% לשנה · הפקדות '+fm(n(x.m)*12*y)+' · רווח צפוי '+fm(a-d)+'</small></div>'}
function svt(){var f=S.fc||{},t=0,c=0;S.L.sv.forEach(function(x){var r=x.r!==undefined&&x.r!==''&&x.r!==null?n(x.r):(f.r!==undefined&&f.r!==''?n(f.r):null),y=n(x.y)||n(f.y);if(r==null||!y)return;t+=fv(n(x.v),n(x.m),r,y);c++});return c?t:null}
var YC=[["תשרי", ["מקומות ביכ\"נ", "מזון לחג (בנוסף להוצאות המזון הרגילות)", "כפרות", "נסיעות חוה\"מ", "ארבעת המינים", "הוצאות סוכה", "מתנות אשה/ילדים"]], ["כסלו", ["דמי חנוכה", "מסיבות"]], ["שבט", ["פירות ט\"ו בשבט"]], ["אדר", ["תחפושות", "מתנות גננות/מלמדים/מורות", "משלוחי מנות ומחצית השקל", "מתנות לאביונים", "סעודה/אירוח"]], ["ניסן", ["צביעה וסיוד", "נקיון/עוזרת", "אוכל לפני פסח", "קמחא דפסחא/מכירת חמץ", "מזון לחג (בנוסף להוצאות המזון הרגילות)", "מצות", "מתנות לאשה/ילדים כולל אפיקומן"]], ["אייר", ["ל\"ג בעומר"]], ["סיון", ["חג השבועות"]], ["חופשת הקיץ", ["מחנות קיץ", "קייטנות", "אתרים ואטרקציות", "חופשה שנתית משפחתית", "חופשה שנתית זוגית", "נסיעות/רכב/טיסות", "ציוד / משחקים / שונות"]], ["ביגוד והנעלה", ["תלבושת לבית הספר", "ביגוד חגי תשרי", "ביגוד פסח", "ביגוד עונתי קיץ ילדים", "ביגוד עונתי קיץ הורים", "ביגוד עונתי חורף ילדים", "ביגוד עונתי חורף הורים", "הנעלה קיץ הורים / ילדים", "הנעלה חורף הורים / ילדים"]]];
function ycSecs(){return YC.map(function(s){return[s[0],s[1].concat((S.yx||{})[s[0]]||[])]})}
function ycTab(){var yc=S.yc||{},tt=0;
  var body=ycSecs().map(function(s){var sub=0;s[1].forEach(function(i){sub+=n(yc[s[0]+'|'+i])});tt+=sub;
    return '<details class="c"'+(sub?' open':'')+'><summary style="cursor:pointer"><b>'+s[0]+'</b><span style="float:left">'+(sub?fm(sub):'')+'</span></summary>'+s[1].map(function(i){var k=s[0]+'|'+i;return '<div class="r"><label>'+esc(i)+'</label><input type="number" inputmode="decimal" min="0" data-s="yc" data-k="'+esc(k)+'" value="'+(yc[k]||'')+'" placeholder="0"'+(ADM?' disabled':'')+'></div>'}).join('')+'</details>'}).join('');
  return '<div class="g">'+tile(fm(tt),'סה״כ לשנה')+tile(fm(tt/12),'ממוצע לחודש')+'</div><p class="hint">הוצאות שמגיעות פעם בשנה, לפי חגים ועונות. הממוצע החודשי עוזר למלא את סעיפי החגים, החופשות והביגוד במאזן.</p>'+body+
  (ADM?'':'<div class="c"><b>הוספת הוצאה</b><div class="f" style="margin-top:8px"><select id="yxs">'+YC.map(function(s){return '<option>'+s[0]+'</option>'}).join('')+'</select><input id="yxn" type="text" maxlength="80" placeholder="שם ההוצאה"><button class="btn" data-a="yxa">הוספה</button></div></div>')}
function tvs(){
  var dep=sm('sv','m'),val=sm('sv','v'),liq=sm('sv','v',function(x){return x.q==='נזיל מיידית'}),e=ex('bal'),lb=sm('ln','b'),lp=sm('ln','p'),inc=ts('bal','i');
  return '<div class="g">'+tile(fm(val),'שווי חסכונות')+tile(fm(dep),'הפקדה חודשית')+tile(e?(liq/e).toFixed(1):'—','כרית ביטחון (חודשי הוצאות)')+'</div>'+(svt()!=null?'<div class="c"><b>צפי כולל לחסכונות: '+fm(svt())+'</b><div class="hint" style="margin:0">סכום הצפי של החסכונות שהוגדרו להם תשואה ושנים.</div></div>':'')+
  lst('pn','פנסיה','לכל קרן פנסיה: שווי נוכחי, הפקדה חודשית, הצפי לפנסיה ואחוז עמלות.',function(x){return n(x.v)?'<small>שווי נוכחי '+fm(n(x.v))+(n(x.m)?' · הפקדה שנתית '+fm(n(x.m)*12):'')+'</small>':''})+
  lst('sv','חסכונות','קרן השתלמות, חיסכון לכל ילד, קופות ועוד. לכל חיסכון בחרו תשואה שנתית ומספר שנים, ותראו כמה הוא צפוי להיות שווה. כרית הביטחון מחושבת מחסכונות שסומנו נזיל מיידית, מול ההוצאות החודשיות במאזן.',svf)+
  '<div class="g">'+tile(fm(lb),'יתרת הלוואות')+tile(fm(lp),'החזר חודשי')+tile(inc?Math.round(lp/inc*100)+'%':'—','מההכנסה',inc&&lp/inc>.2?'neg':'')+'</div>'+
  lst('ln','הלוואות ועסקאות בתשלומים','ההחזר החודשי אמור להופיע גם בסעיף הלוואות במאזן.',function(x){return n(x.p)&&n(x.c)?'<small>סה״כ עד סיום: '+fm(n(x.p)*n(x.c))+'</small>':''})+fcUI()}
function fmUI(){var f=S.fm||{},k=S.L.kd||[],ag=k.filter(function(x){return x.a!==''&&x.a!=null}).map(function(x){return n(x.a)}).sort(function(a,b){return b-a});
  var inp=function(key,l){return '<span><small>'+l+'</small><input type="number" inputmode="numeric" min="0" max="120" data-s="fm" data-k="'+key+'" value="'+(f[key]===undefined||f[key]===0?'':esc(f[key]))+'" aria-label="'+l+'"></span>'};
  return '<div class="c"><b>הסיפור המשפחתי שלנו</b><p class="hint">גילאי ההורים והילדים עוזרים לתכנן יעדים לאורך השנים, כמו בר מצווה, חתונה ופרישה.</p><div class="dt">'+inp('a','גיל בן הזוג')+inp('b','גיל בת הזוג')+'</div>'+
  (k.length?'<div class="hint" style="margin:8px 0 0">'+(k.length===1?'ילד אחד':k.length+' ילדים')+(ag.length>1?' · הגדול בן '+ag[0]+', הקטן בן '+ag[ag.length-1]:ag.length?' · בן '+ag[0]:'')+' · '+(2+k.length)+' נפשות בבית</div>':'')+'</div>'+
  lst('kd','הילדים','שם וגיל של כל ילד. אפשר להוסיף כמה שצריך.')}
function rtTxt(k){if(!n(S.dn))return '';var r=S.rt[k]||{},a=n(r.a),b=n(r.b);if(!a&&!b)return '';return ' · דירוג'+(a?' בן '+a:'')+(b?' בת '+b:'')+(a&&b?' · ממוצע '+((a+b)/2).toFixed(1):'')}
function ctxUI(){if(!n(S.dn))return '<div class="c"><b>תמונת מצב לבניית התקציב</b><div class="hint" style="margin:6px 0 0">הסיפור המשפחתי, היעדים, הביטוחים ודירוגי בני הזוג יופיעו כאן ברגע שהזוג יסמן "הושלם".</div></div>';var f=S.fm||{},k=S.L.kd||[],ins=S.L.ins.reduce(function(a,x){return a+(x.f==='שנתי'?n(x.p)/12:n(x.p))},0);
  var ag=k.map(function(x){return esc(x.n||'ילד')+(x.a!==''&&x.a!=null?' ('+esc(x.a)+')':'')}).join(', ');
  var gl=S.L.gl.filter(function(x){return x.n||n(x.t)}).map(function(x){var t=n(x.t),m=gm(x.d),r=t-n(x.s);return esc(x.n||'יעד')+': '+fm(t)+(m>0&&r>0?' · כדאי '+fm(r/m)+' בחודש':'')}).join('<br>');
  var low=[];G.forEach(function(g){if(g.t==='i')return;its(g).forEach(function(i){var r=S.rt[g.n+'|'+i]||{},a=n(r.a),b=n(r.b);if(a&&b&&Math.abs(a-b)>=2)low.push(esc(i)+' (בן '+a+', בת '+b+')')})});
  return '<div class="c"><b>תמונת מצב לבניית התקציב</b><div class="hint" style="margin:6px 0 0;line-height:1.7">'+
   '<b>סיפור משפחתי:</b> '+((f.a||f.b)?'בן זוג '+(f.a||'?')+', בת זוג '+(f.b||'?'):'לא מולא')+(k.length?' · ילדים: '+ag:'')+'<br>'+
   '<b>יעדים:</b> '+(gl||'לא הוגדרו')+'<br>'+
   '<b>ביטוחים:</b> '+fm(ins)+' בחודש · <b>חסכונות:</b> '+fm(sm('sv','v'))+' · <b>הלוואות:</b> '+fm(sm('ln','b'))+
   (low.length?'<br><b>פערי דירוג בין בני הזוג:</b> '+low.join(', '):'')+'</div></div>'}
function tin(){
  var mo=S.L.ins.reduce(function(a,x){return a+(x.f==='שנתי'?n(x.p)/12:n(x.p))},0),need=0;
  S.L.gl.forEach(function(x){var m=gm(x.d),r=n(x.t)-n(x.s);if(m>0&&r>0)need+=r/m});
  return fmUI()+'<div class="g">'+tile(fm(mo),'ביטוחים בחודש')+tile(fm(mo*12),'ביטוחים בשנה')+tile(fm(need),'נדרש בחודש ליעדים')+'</div>'+
  lst('ins','ביטוחים','לכל ביטוח הזינו פרמיה ותדירות. ביטוח שנתי מחושב גם כעלות חודשית, כדי לשמור בצד כל חודש.',function(x){return x.f==='שנתי'&&n(x.p)?'<small>שווה ערך ל-'+fm(n(x.p)/12)+' בחודש</small>':''})+
  lst('gl','יעדים','רכב, דירה, חתונה של ילד ועוד. מוצג כמה נותר וכמה כדאי לחסוך בחודש.',function(x){var t=n(x.t),r=t-n(x.s),m=gm(x.d);if(!t)return '';var p=n(x.s)/t;
    return '<div class="bar"><i class="'+(p>=1?'ok':'wn')+'" style="width:'+Math.min(100,p*100)+'%"></i></div><small>'+(r<=0?'היעד הושג':m==null?'נותר '+fm(r):m>0?'נותרו '+m+' חודשים · כדאי לחסוך '+fm(r/m)+' בחודש':'המועד עבר, נותר '+fm(r))+'</small>'})}

/* מסך הבית של הזוג */
function doneUI(){if(STAGE>=2)return '';var dt=n(S.dn);if(RO===false&&false)return '';return dt?'<div class="c"><b>✓ סימנתם שהמאזן הושלם</b><div class="hint" style="margin:4px 0 8px">המאמנת רואה שהשלמתם ב-'+new Date(dt).toLocaleDateString('he-IL')+'. אפשר להמשיך לעדכן, ואפשר לבטל את הסימון.</div><button class="btn sec" data-a="undn">ביטול הסימון</button></div>':'<div class="c"><b>סיימתם למלא?</b><div class="hint" style="margin:4px 0 8px">אחרי שמילאתם את המאזן, החסכונות, ההלוואות והביטוחים, לחצו על הכפתור כדי שהמאמנת תדע שהשלמתם.</div><button class="btn" data-a="dn">הושלם</button></div>'}
var PMS=['מזומן','אשראי','הו"ק','חיסכון קצר (הו"ק)','חיסכון ארוך (הו"ק)'];
function pmv(g,i){var v=(S.pm||{})[g.n+'|'+i];return v||(g.t==='v'?'מזומן':g.t==='f'?'אשראי':'')}
function gsm(sn,g,cash){var s=st(sn);return its(g).reduce(function(a,i){var c=pmv(g,i)==='מזומן';return a+((cash?c:!c)?n(s[g.n+'|'+i]):0)},0)}
function pmSel(g,i,dis){var k=g.n+'|'+i,v=pmv(g,i);return '<select data-s="pm" data-k="'+esc(k)+'" aria-label="אמצעי תשלום"'+(dis?' disabled':'')+'>'+PMS.map(function(o){return '<option value="'+esc(o)+'"'+(o===v?' selected':'')+'>'+esc(o)+'</option>'}).join('')+'</select>'}
var PMC={'מזומן':'#1c8c6e','אשראי':'#2f6fed','הו"ק':'#8a4fd6','חיסכון קצר (הו"ק)':'#e0562e','חיסכון ארוך (הו"ק)':'#c2307a','אחר':'#8a97b0'};
function pmChart(m){var ks=Object.keys(m).sort(function(a,b){return m[b]-m[a]}),T=ks.reduce(function(a,k){return a+m[k]},0);if(!T)return '';
  var C=2*Math.PI*40,off=0,arcs=ks.map(function(k){var l=m[k]/T*C,r='<circle cx="50" cy="50" r="40" fill="none" stroke="'+(PMC[k]||'#8a97b0')+'" stroke-width="16" stroke-dasharray="'+l.toFixed(2)+' '+(C-l).toFixed(2)+'" stroke-dashoffset="'+(-off).toFixed(2)+'" transform="rotate(-90 50 50)"/>';off+=l;return r}).join('');
  return '<div class="pmc"><svg viewBox="0 0 100 100" width="130" height="130" role="img" aria-label="חלוקת ההוצאות לפי אמצעי תשלום">'+arcs+'<text x="50" y="47" text-anchor="middle" font-size="9" fill="currentColor">סך הוצאות</text><text x="50" y="59" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">'+fm(T)+'</text></svg><div class="pml">'+ks.map(function(k){return '<div><i style="background:'+(PMC[k]||'#8a97b0')+'"></i><span>'+esc(k)+'</span><b>'+fm(m[k])+'</b><small>'+Math.round(m[k]/T*100)+'%</small></div>'}).join('')+'</div></div>'}
function pmData(sn){var m={},s=st(sn),any=0;G.forEach(function(g){if(g.t==='i')return;its(g).forEach(function(i){var x=n(s[g.n+'|'+i]);if(!x)return;var p=pmv(g,i)||'אחר';m[p]=(m[p]||0)+x;any=1})});return any?m:null}
function pmSum(sn){var m=pmData(sn);if(!m)return '';
  return '<div class="c"><b>לאן הולכות ההוצאות</b><div class="hint" style="margin:2px 0 6px">לפי אמצעי תשלום</div>'+pmChart(m)+(m['מזומן']?'<div class="tot" style="color:#0f6b52;margin-top:8px"><span>מזומן להוצאה החודש</span><span>'+fm(m['מזומן'])+'</span></div>':'')+'</div>'}
function openTk(){return INBOX.filter(function(m){return(m.k==='tk'||m.k==='ch')&&!S.chd[m.id]}).length+Object.keys(S.mt||{}).filter(function(id){return !S.chd[id]}).length}
function dueTxt(m){return m.due?' · עד '+new Date(m.due+'T00:00').toLocaleDateString('he-IL'):''}
var RULES=[["שיתוף פעולה זוגי", "חשוב ששני בני הזוג יהיו מעורבים במילוי. זו משימה משותפת שמטרתה ליצור בהירות, הבנה ושיתוף. רק כששני בני הזוג מעורבים ומחויבים להצלחה, התהליך באמת מצליח."], ["רישום הוצאות", "למלא כל הוצאה בדיוק כפי שהיא. לא מסננים, לא מתלבטים, לא דנים, רק מתעדים. זה לא הזמן להתווכח אם ההוצאה \"נכונה\" או \"מיותרת\". בשביל זה תדרגו כל הוצאה בהמשך."], ["מילוי חודשיים רצופים", "ממלאים לשני חודשים עוקבים כדי לקבל תמונה מלאה ולזהות דפוסים חוזרים."], ["שימוש בנתוני אשראי", "רושמים את החיובים בדיוק כפי שמופיעים בכרטיסי האשראי בחודש שעליו אתם עובדים, גם אם ההוצאה בוצעה בחודש קודם."], ["עסקאות בתשלומים", "כל תשלום נחשב הלוואה. את הסכום החודשי רושמים בהוצאות, ואת יתרת התשלומים בלשונית \"חסכונות והלוואות\"."], ["הלוואות", "ממלאים את כל ההלוואות הקיימות, כולל גמ\"ח, בנק, מינוס ועסקאות בתשלומים."], ["חסכונות ונכסים", "מציינים חסכונות, קופות גמל, חיסכון לכל ילד, קרן השתלמות, השקעות, נכסים כמו דירה וכל נכס פיננסי אחר."], ["ממוצע שנתי", "לאחר מילוי חודשיים הממוצע מחושב לבד. לסעיפי חגים, חופשות וכדומה כדאי להתחשב בהוצאה השנתית כולה."], ["סולם ערכים אישי", "בסיום, כל אחד מבני הזוג מדרג את הסעיפים לפי הערכים האישיים שלו. התקציב צריך לשקף את המשפחה שלכם."]];
function rulesUI(){var empty=!Object.keys(S.bal||{}).length;
  return '<details class="c rul"'+(empty?' open':'')+'><summary><b>הוראות למילוי המאזן</b></summary><div class="rl">'+RULES.map(function(r,i){return '<div class="rr"><span>'+(i+1)+'</span><div><b>'+r[0]+'</b><div class="hint" style="margin:2px 0 0">'+r[1]+'</div></div></div>'}).join('')+'<div class="hint" style="margin-top:10px">לכל שאלה אפשר לפנות לדסי הרשטיק, מאמנת לכלכלת המשפחה: <a href="mailto:nekodatizon@gmail.com">nekodatizon@gmail.com</a> · <a href="tel:0548421336">054-8421336</a></div></div></details>'}
function overUI(){var o=G.filter(function(g){var b=gs('bud',g),a=gs('act',g);return g.t!=='i'&&b>0&&a>b});if(!o.length)return '';
  return '<div class="c" style="border:1px solid var(--bd)"><b>'+(o.length===1?'קטגוריה אחת חרגה':o.length+' קטגוריות חרגו')+' מהתקציב</b>'+o.map(function(g){var a=gs('act',g),b=gs('bud',g);return '<button class="r cc" data-a="og" data-id="'+esc(g.n)+'"><span>'+esc(g.n)+'</span><span class="neg">+'+fm(a-b)+'</span></button>'}).join('')+'</div>'}
function remUI(){if(STAGE<2)return '';var d=new Date(),py=d.getMonth()?d.getFullYear():d.getFullYear()-1,pm=d.getMonth()||12,pk=py+'-'+pm;
  if(n((S.md||{})[pk])||!S.act[pk]||!Object.keys(S.act[pk]).length)return '';
  return '<div class="c" style="border:1px solid var(--wn)"><b>סגירת '+MN[pm-1]+'</b><div class="hint" style="margin:4px 0 8px">'+MN[pm-1]+' עוד לא סומן כהושלם. כדאי לעבור על ההוצאות בפועל ולסגור את החודש.</div><button class="btn" data-a="gm" data-y="'+py+'" data-m="'+pm+'">לסגירת החודש</button></div>'}
function mdUI(){var k=ym(),dt=n((S.md||{})[k]),bal=ts('act','i')-ex('act');
  if(!dt)return '<div class="c"><b>סיימתם את החודש?</b><div class="hint" style="margin:4px 0 8px">אחרי שהזנתם את כל ההכנסות וההוצאות בפועל, לחצו על הכפתור.</div><button class="btn" data-a="md">הושלם לחודש זה</button></div>';
  var msg=bal>0?'איזה כיף! נשארה לכם יתרה של '+fm(bal)+'. אפשר לקחת אותה לקטגוריה שחשובה לכם, כמו חיסכון, יעד או משהו שרציתם לעצמכם.':bal<0?'יש חריגה של '+fm(-bal)+'. צריך לכסות אותה בתוך החודש הקרוב. אפשר להוסיף לעצמכם משימה בלשונית "משימות ואתגרים".':'יצאתם מאוזנים החודש, כל הכבוד.';
  return '<div class="c" style="border:2px solid '+(bal<0?'var(--bd)':'var(--ok)')+'"><b>✓ החודש הושלם</b><p style="margin:8px 0">'+msg+'</p><div class="f">'+(bal<0?'<button class="btn" data-a="gt">להוספת משימה</button>':'')+'<button class="btn sec" data-a="umd">ביטול הסימון</button></div></div>'}
function tkAll(){var K={tk:'מהמאמנת',ch:'אתגר'},l=INBOX.filter(function(m){return m.k==='tk'||m.k==='ch'}).map(function(m){return{id:m.id,x:m.x,ts:m.ts,due:m.due||'',tag:K[m.k],own:false}});
  var mt=S.mt||{};Object.keys(mt).forEach(function(id){l.push({id:id,x:mt[id].x,ts:mt[id].ts,due:'',tag:'שלי',own:true})});return l}
function tkCard(t){var dn=!!S.chd[t.id],od=!dn&&t.due&&new Date(t.due+'T23:59')<new Date();
  return '<div class="tk'+(dn?' dn':'')+'"><button class="tkc" data-a="tkd" data-id="'+esc(t.id)+'" aria-pressed="'+dn+'" aria-label="'+(dn?'ביטול סימון':'סימון כבוצע')+'">'+(dn?'✓':'')+'</button><div class="tkb"><div class="tkx">'+esc(t.x)+'</div><div class="tkm"><span class="chip'+(t.own?' me':t.tag==='אתגר'?' ch':'')+'">'+t.tag+'</span>'+(t.due?'<span class="chip'+(od?' od':'')+'">'+(od?'באיחור · ':'עד ')+new Date(t.due+'T00:00').toLocaleDateString('he-IL',{day:'numeric',month:'short'})+'</span>':'')+'</div></div>'+(t.own?'<button class="tkx2" data-a="mtd" data-id="'+esc(t.id)+'" aria-label="מחיקת משימה">✕</button>':'')+'</div>'}
function tasksView(){var all=tkAll().sort(function(a,b){return (a.due||'9')<(b.due||'9')?-1:(a.due||'9')>(b.due||'9')?1:b.ts-a.ts}),op=all.filter(function(t){return !S.chd[t.id]}),dn=all.filter(function(t){return S.chd[t.id]}),pc=all.length?Math.round(dn.length/all.length*100):0;
  var msgs=INBOX.filter(function(m){return m.k==='msg'}).sort(function(a,b){return b.ts-a.ts});
  return '<div class="c tkh"><div class="tkt"><b>'+(all.length?(op.length?op.length+' משימות פתוחות':'הכל בוצע, כל הכבוד'):'אין משימות עדיין')+'</b>'+(all.length?'<span>'+dn.length+' מתוך '+all.length+'</span>':'')+'</div>'+(all.length?'<div class="bar"><i class="ok" style="width:'+pc+'%"></i></div>':'')+
   '<div class="tka"><input id="mti" type="text" maxlength="200" placeholder="הוספת משימה לעצמנו" aria-label="משימה חדשה"><button class="btn" data-a="mta" aria-label="הוספה">+</button></div></div>'+
   (op.length?'<div class="tkl">'+op.map(tkCard).join('')+'</div>':'')+
   (dn.length?'<details class="tkd"><summary>בוצעו ('+dn.length+')</summary><div class="tkl">'+dn.map(tkCard).join('')+'</div></details>':'')+
   (msgs.length?'<h3>הודעות מהמאמנת</h3>'+msgs.map(function(m){return '<div class="c tkn"><small>'+new Date(m.ts).toLocaleDateString('he-IL')+'</small><div style="white-space:pre-wrap">'+esc(m.x)+'</div></div>'}).join(''):'')}
function home(){
  var ai=ts('act','i'),ae=ex('act'),pi=ts('bud','i'),pe=ex('bud'),bi=ts('bal','i'),be=ex('bal'),over=[],near=[],st2=STAGE>=2;
  if(st2)G.forEach(function(g){if(g.t==='i')return;var a=gs('act',g),b=gs('bud',g);if(b&&a>b)over.push(g.n+' · חריגה של '+fm(a-b));else if(b&&a>=.85*b)near.push(g.n+' · '+Math.round(a/b*100)+'% מהתקציב')});
  var steps=st2?[]:[['bal','מילוי המאזן, החסכונות, ההלוואות והביטוחים, ולחיצה על "הושלם"',!!n(S.dn)]];
  if(st2)steps.push(['bud','התקציב שנקבע עבורכם',pe>0],['mon','דיווח הכנסות והוצאות בפועל',ai>0||ae>0]);
  var done=steps.filter(function(s){return s[2]}).length;
  var h='<div class="hero"><div class="hm">'+MN[S.m-1]+' '+S.y+'</div><div class="hl">שלום משפחת '+esc(S.fam)+'</div>'+(st2?'<div class="hb">'+fm(ai-ae)+'</div><div class="hm">נשאר לכם החודש · הכנסות '+fm(ai)+' · הוצאות '+fm(ae)+'</div>':'')+'</div>';
  h+=remUI();
  if(done<steps.length)h+='<div class="c"><b>הצעדים שלכם</b>'+steps.map(function(s){return '<button class="r cc" data-a="tab" data-id="'+s[0]+'"><span>'+(s[2]?'✓ ':'○ ')+s[1]+'</span></button>'}).join('')+'</div>';
  if(!n(S.dn))h+=doneUI();
  if(!st2){
    h+=be>0||bi>0?'<div class="g">'+tile(fm(bi),'הכנסות חודשיות')+tile(fm(be),'הוצאות חודשיות')+tile(fm(bi-be),'יתרה חודשית',bi-be<0?'neg':'')+'</div><div class="c">תודה על מילוי המאזן. המאמנת תבנה עבורכם את התקציב, ותעדכן אתכם כאן.</div>':'<div class="c">התחילו במילוי המאזן: הזינו את ההכנסות וההוצאות החודשיות הממוצעות שלכם.</div>'}
  else{
    
    if(over.length||near.length)h+='<div class="c"><b>שימו לב החודש</b>'+over.map(function(x){return '<div class="r"><span class="bdg bd">חריגה</span><label>'+esc(x)+'</label></div>'}).join('')+near.map(function(x){return '<div class="r"><span class="bdg wn">קרוב</span><label>'+esc(x)+'</label></div>'}).join('')+'</div>';
    else if(ae>0)h+='<div class="c">✓ אין חריגות מהתקציב החודש</div>'}
  if(st2){
    var PAL=['#2F6FED','#1C8C6E','#E0562E','#8A4FD6','#0E8FA6','#C2307A'];
    var vs=G.filter(function(g){return g.t!=='i'&&gsm('bud',g,true)>0}),fs=G.filter(function(g){return g.t!=='i'&&gsm('bud',g,false)>0}),cashT=0;vs.forEach(function(g){cashT+=gsm('bud',g,true)});
    if(vs.length){h+='<div class="c cashc"><div class="hint" style="margin:0">מזומן להוצאה החודש</div><div class="evv">'+fm(cashT)+'</div><small class="hint">הסכום שכדאי למשוך כדי למלא את המעטפות.</small></div>';var rem=0;vs.forEach(function(g){rem+=gsm('bud',g,true)-gsm('act',g,true)});
      h+='<div class="sh"><h2>'+ic('bud',20)+' המעטפות שלכם</h2><span>מזומן · נשאר '+fm(rem)+'</span></div><div class="env">'+vs.map(function(g,i){var b=gsm('bud',g,true),a=gsm('act',g,true),r=b-a,p=Math.min(100,Math.max(0,a/b*100)),c=PAL[i%PAL.length];
        return '<div class="ev"><div class="evt" style="background:'+c+'"></div><div class="evb"><div class="evn">'+esc(g.n)+'</div><div class="evv'+(r<0?' neg':'')+'">'+fm(r)+'</div><small>נשאר מתוך '+fm(b)+'</small><div class="bar"><i style="width:'+p+'%;background:'+(r<0?'var(--bd)':c)+'"></i></div>'+(r<=0?'<small class="neg">'+(r<0?'חריגה':'המעטפה ריקה')+'</small>':a>=.85*b?'<small style="color:#b45309">קרוב לסוף</small>':'')+'</div></div>'}).join('')+'</div>'}
    if(fs.length){var dn=fs.filter(function(g){return gsm('act',g,false)>0}).length;
      h+='<div class="sh"><h2>'+ic('card',20)+' אשראי והוראות קבע</h2><span>'+dn+' מתוך '+fs.length+' חויבו</span></div><div class="c">'+fs.map(function(g){var a=gsm('act',g,false),b=gsm('bud',g,false);return '<div class="r"><label>'+esc(g.n)+'</label><b>'+fm(a>0?a:b)+'</b><span class="bdg '+(a>0?'okb':'mut')+'">'+(a>0?'חויב':'ממתין')+'</span></div>'}).join('')+'</div>'}}
  if(st2)h+=pmSum('bud');
  var gl=S.L.gl.filter(function(x){return n(x.t)>0});
  if(gl.length)h+='<div class="sh"><h2>'+ic('trend',20)+' היעדים שלנו</h2></div><div class="goals">'+gl.map(function(x,i){var t=n(x.t),p=Math.min(100,Math.round(n(x.s)/t*100)),c=['#2F6FED','#E0562E','#1C8C6E','#8A4FD6'][i%4],m=gm(x.d);
    return '<div class="gc"><div class="evn">'+esc(x.n||'יעד')+'</div><svg viewBox="0 0 64 64" width="76" height="76" role="img" aria-label="'+p+' אחוז מהיעד"><circle cx="32" cy="32" r="26" fill="none" stroke="var(--ln)" stroke-width="8"/><circle cx="32" cy="32" r="26" fill="none" stroke="'+c+'" stroke-width="8" stroke-linecap="round" stroke-dasharray="'+(p*1.634)+' 163.4" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle" font-size="15" font-weight="700" fill="currentColor">'+p+'%</text></svg><small>'+fm(n(x.s))+' מתוך '+fm(t)+'</small>'+(m>0&&t>n(x.s)?'<small>כדאי לחסוך '+fm((t-n(x.s))/m)+' בחודש</small>':'')+'</div>'}).join('')+'</div>';
  var ms=INBOX.filter(function(m){return m.k==='msg'}).sort(function(a,b){return b.ts-a.ts}).slice(0,3),ot=openTk();
  if(ot)h+='<div class="c"><b>יש לכם '+ot+' משימות ואתגרים פתוחים</b><div style="margin-top:8px"><button class="btn" data-a="tab" data-id="tasks">לצפייה</button></div></div>';
  if(ms.length)h+='<div class="c"><b>מהמאמנת</b>'+ms.map(function(m){return '<div class="it"><small>הודעה · '+new Date(m.ts).toLocaleDateString('he-IL')+'</small><div style="white-space:pre-wrap">'+esc(m.x)+'</div></div>'}).join('')+'</div>';
  return h}

try{bG()}catch(e){}
