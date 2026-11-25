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
var IC={gl:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',send:'<path d="M21 3L3 11l7 3 3 7z"/><path d="M10 14l11-11"/>',plane:'<path d="M3 13l18-7-7 18-3-8z"/>',car:'<path d="M5 16h14M6 16l1.5-5h9L18 16M7 19a1 1 0 100-2 1 1 0 000 2zM17 19a1 1 0 100-2 1 1 0 000 2zM4 16v-2l2-1M20 16v-2l-2-1"/>',ring:'<circle cx="12" cy="14" r="6"/><path d="M9 4l3 4 3-4"/>',book:'<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5"/>',shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',tgt:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',gift:'<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18M12 8c-2-4-6-3-5 0M12 8c2-4 6-3 5 0"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',srch:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',pdf:'<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6"/>',xls:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 15h16M10 4v16"/>',cash:'<rect x="3" y="7" width="18" height="10" rx="2"/><circle cx="12" cy="12" r="2.5"/>',card:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h3"/>',rep:'<path d="M4 12a8 8 0 0114-5l2 2M20 4v5h-5M20 12a8 8 0 01-14 5l-2-2M4 20v-5h5"/>',inn:'<path d="M12 4v14M6 12l6 6 6-6"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',unlock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 017.5-1.5"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',check:'<path d="M5 12l5 5 9-10"/>',nxt:'<path d="M15 6l-6 6 6 6"/>',bck:'<path d="M9 6l6 6-6 6"/>',plus:'<path d="M12 5v14M5 12h14"/>',skip:'<path d="M11 6l-6 6 6 6M19 6l-6 6 6 6"/>',list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',cards:'<rect x="4" y="5" width="16" height="14" rx="2"/>',xx:'<path d="M6 6l12 12M18 6L6 18"/>',undo:'<path d="M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3"/>',rl:'<path d="M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2zM9 9h6M9 13h6"/>',"me": "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21c0-4 4-6 8-6s8 2 8 6\"/>", "home": "<path d=\"M3 11l9-8 9 8\"/><path d=\"M5 10v10h14V10\"/><path d=\"M10 20v-6h4v6\"/>", "tasks": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M8 12l3 3 5-6\"/>", "bal": "<path d=\"M12 3v18M6 21h12M5 7h14\"/><path d=\"M5 7l-3 7a3 3 0 006 0zM19 7l-3 7a3 3 0 006 0z\"/>", "bud": "<path d=\"M3 7h16a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z\"/><path d=\"M3 7l12-4v4\"/><circle cx=\"17\" cy=\"14\" r=\"1\"/>", "mon": "<path d=\"M5 20V11M12 20V4M19 20v-6\"/>", "yr": "<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/>", "sv": "<ellipse cx=\"12\" cy=\"6\" rx=\"8\" ry=\"3\"/><path d=\"M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6\"/>", "yc": "<path d=\"M21 12a9 9 0 11-3-6.7M21 4v5h-5\"/>", "ins": "<path d=\"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z\"/><path d=\"M9 12l2 2 4-4\"/>", "sum": "<rect x=\"3\" y=\"3\" width=\"7\" height=\"9\" rx=\"1\"/><rect x=\"14\" y=\"3\" width=\"7\" height=\"5\" rx=\"1\"/><rect x=\"14\" y=\"12\" width=\"7\" height=\"9\" rx=\"1\"/><rect x=\"3\" y=\"16\" width=\"7\" height=\"5\" rx=\"1\"/>", "sc": "<circle cx=\"6\" cy=\"5\" r=\"2\"/><circle cx=\"6\" cy=\"19\" r=\"2\"/><circle cx=\"18\" cy=\"9\" r=\"2\"/><path d=\"M6 7v10M18 11c0 4-6 3-12 6\"/>", "mg": "<circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1\"/>", "inc": "<path d=\"M12 3v14M6 11l6 6 6-6M4 21h16\"/>", "phone": "<rect x=\"7\" y=\"2\" width=\"10\" height=\"20\" rx=\"2\"/><path d=\"M11 18h2\"/>", "edu": "<path d=\"M2 8l10-5 10 5-10 5z\"/><path d=\"M6 10.5V16c0 1 3 3 6 3s6-2 6-3v-5.5\"/>", "car": "<path d=\"M5 16l1.5-6A2 2 0 018.4 8.5h7.2a2 2 0 011.9 1.5L19 16\"/><rect x=\"3\" y=\"16\" width=\"18\" height=\"4\" rx=\"1\"/>", "heart": "<path d=\"M12 21s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 6-8 11-8 11z\"/>", "card": "<rect x=\"2\" y=\"5\" width=\"20\" height=\"14\" rx=\"2\"/><path d=\"M2 10h20\"/>", "trend": "<path d=\"M3 17l6-6 4 4 8-8M15 7h6v6\"/>", "dots": "<circle cx=\"5\" cy=\"12\" r=\"1.5\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\"/><circle cx=\"19\" cy=\"12\" r=\"1.5\"/>", "cart": "<path d=\"M3 4h2l2.4 11h11l2-8H6\"/><circle cx=\"9\" cy=\"20\" r=\"1.5\"/><circle cx=\"18\" cy=\"20\" r=\"1.5\"/>", "spark": "<path d=\"M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z\"/>", "music": "<path d=\"M9 18V5l12-2v13\"/><circle cx=\"6\" cy=\"18\" r=\"3\"/><circle cx=\"18\" cy=\"16\" r=\"3\"/>", "dot": "<circle cx=\"12\" cy=\"12\" r=\"4\"/>"},GIC={"הכנסות": "inc", "הוצאות בית": "home", "תקשורת": "phone", "חינוך": "edu", "תחבורה": "car", "תחבורה משתנה": "car", "בריאות": "heart", "בנקים ואשראי": "card", "השקעות וחסכונות": "trend", "שונות קבועות": "dots", "שונות משתנות": "dots", "קניות": "cart", "טיפוח": "spark", "בית": "home", "בילויים": "music", "ביטוחים": "ins"},GCOL=['#1F3A5F','#1F6F50','#8C3B3B','#C9A23F','#7A5C8C','#5B7DA6','#A0762A','#6B6F7A'];
function ic(nm,s){s=s||20;return '<svg class="ic" viewBox="0 0 24 24" width="'+s+'" height="'+s+'" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(IC[nm]||IC.dot)+'</svg>'}
function gic(nm){var i=0,k;for(k=0;k<nm.length;k++)i=(i+nm.charCodeAt(k))%GCOL.length;var c=GCOL[i];return '<span class="gi" style="color:'+c+';background:'+c+'1f">'+ic(GIC[nm]||'dot',18)+'</span>'}
function navLbl(id,l){return '<span class="ni">'+ic(id,20)+'<span>'+l+'</span></span>'}
function bG(){var c=ecs();G=D.map(function(a){return{t:a[0],n:a[1],i:a[2]?a[2].split(','):[]}}).filter(function(g){return c.hg.indexOf(g.n)<0}).concat(c.ng.map(function(x){return{t:x.t,n:x.n,i:[]}}));if(insItems().length){G.push({t:'f',n:'ביטוחים',i:[],auto:1});insSync()}}
var SEC={i:'הכנסות',f:'הוצאות קבועות',v:'הוצאות משתנות'};
var MN=['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
var ADM=false,RO=false,STAGE=1,INBOX=[],PWSET=0,PROF={};
function perNow(sd){var d=new Date(),dy=Math.min(28,Math.max(1,n(sd)||1)),y=d.getFullYear(),m=d.getMonth()+1;if(d.getDate()<dy){m--;if(m<1){m=12;y--}}return{y:y,m:m}}
function newState(){return{bal:{},bud:{},act:{},cx:{},note:{},fam:'',chd:{},ppl:0,mo:{},rt:{},pm:{},fc:{},fm:{},dn:0,cs:{hid:[],hg:[],ng:[],ni:{}},L:{sv:[],ln:[],ins:[],gl:[],pn:[]},env:{},yc:{},yx:{},md:{},mt:{},y:new Date().getFullYear(),m:new Date().getMonth()+1,tab:'home',open:{}}}
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
function vsSel(){var l=S.sc||[];if(!l.length)return '';return '<select id="vs" aria-label="תקציב להצגה" title="תקציב להצגה" style="flex:1 1 130px;min-width:0"><option value="">התקציב</option>'+l.map(function(z){return '<option value="'+esc(z.id)+'"'+(z.id===S.vs?' selected':'')+'>'+esc(z.n)+(z.d?' (מ-'+esc(z.d)+')':'')+'</option>'}).join('')+'</select>'}
function vsUI(){var l=S.sc||[];if(!l.length)return '';return '<div class="c vs"><label style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>תקציב להצגה</b><select id="vs" aria-label="בחירת תקציב או תסריט"><option value="">התקציב</option>'+l.map(function(z){return '<option value="'+esc(z.id)+'"'+(z.id===S.vs?' selected':'')+'>'+esc(z.n)+(z.d?' (מ-'+esc(z.d)+')':'')+'</option>'}).join('')+'</select></label></div>'}
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
      var sel=function(w){return '<select data-s="rt" data-k="'+esc(k)+'" data-w="'+w+'" aria-label="דירוג"><option value="">—</option>'+[1,2,3,4,5,6,7,8,9,10].map(function(v){return '<option'+(String(rt[w])===String(v)?' selected':'')+'>'+v+'</option>'}).join('')+'</select>'};
      var ra=n(rt.a),rb=n(rt.b),rav=ra&&rb?(ra+rb)/2:0;
      return '<div class="it bl"><div class="tot" style="padding:0"><span>'+esc(i)+'</span><span>'+(s[k]!==undefined&&s[k]!==''?fm(n(s[k])):'—')+'</span></div>'+
      '<div class="dt">'+Array.from(mo,function(v,j){return '<span><small>חודש '+(j+1)+'</small><input type="number" inputmode="decimal" min="0" data-s="mo" data-k="'+esc(k)+'" data-j="'+j+'" value="'+(v===undefined||v===null?'':v)+'"'+(g.auto?' disabled':'')+'></span>'}).join('')+'<button class="btn sec" data-a="mo" data-id="'+esc(k)+'" aria-label="הוספת חודש">'+ic('plus',18)+'<span>חודש</span></button></div>'+
      '<small>'+(g.auto?'נוסף אוטומטית מלשונית הביטוחים':fl>1?'ממוצע של '+fl+' חודשים':'מלאו חודשיים והממוצע יחושב לבד')+'</small>'+
      (ex2?'<div class="dt"><span><small>אמצעי תשלום</small>'+pmSel(g,i,false)+'</span><span><small>דירוג בן זוג</small>'+sel('a')+'</span><span><small>דירוג בת זוג</small>'+sel('b')+'</span>'+(rav?'<span><small>ממוצע דירוג</small><b>'+rav.toFixed(1)+'</b></span>':'')+'</div>':'')+'</div>'}
    return '<div class="r"><label>'+esc(i)+(mode==='bud'?'<small>במאזן '+fm(n(S.bal[k]))+''+'</small>':mode==='scb'?'<small>בתקציב הנוכחי '+fm(n(S.bud[k]))+'</small>':'')+'</label>'+inp+(mode==='bud'&&g.t!=='i'?pmSel(g,i,!!S.vs):'')+(ADM&&mode==='bud'?'<button class="gh" style="width:30px;color:var(--bd)" data-a="xi" data-g="'+esc(g.n)+'" data-i="'+esc(i)+'" aria-label="הסרת תת קטגוריה '+esc(i)+'">✕</button>':'')+'</div>'}).join(''):'';
  return '<div class="c"><button class="gh" data-a="tg" data-id="'+esc(g.n)+'"><span class="gn">'+gic(g.n)+'<span>'+esc(g.n)+'</span><i class="ar">'+(o?'▾':'◂')+'</i></span><span>'+meta+'</span></button>'+bar+rows+(ADM&&mode==='bud'&&o&&ecs().ng.some(function(z){return z.n===g.n})?'<div class="r"><button class="btn sec" style="color:var(--bd)" data-a="xg" data-g="'+esc(g.n)+'">הסרת הקטגוריה "'+esc(g.n)+'"</button></div>':'')+'</div>'}
function secs(mode){return ['i','f','v'].map(function(t){return '<h3>'+SEC[t]+'</h3>'+G.filter(function(g){return g.t===t}).map(function(g){return grp(g,mode)}).join('')}).join('')}
function bottom(sn,k){var i=ts(sn,'i',k),e=ex(sn,k);return (sn==='bud'||sn==='bal'?pmSum(sn):'')+'<div class="c"><div class="tot"><span>סה״כ הכנסות</span><span>'+fm(i)+'</span></div><div class="tot"><span>סה״כ הוצאות</span><span>'+fm(e)+'</span></div><div class="tot"><span>יתרה</span><span class="'+(i-e<0?'neg':'')+'">'+fm(i-e)+'</span></div></div>'}
function bal(){
  if(window.TX&&TX.open&&TX.bal)return TXUI();
  var food=n(S.bal['קניות|אוכל ומוצרי מכולת']),p=n(S.ppl)||((S.L.kd||[]).length?2+S.L.kd.length:0);
  var opts=G.map(function(g){return '<option>'+esc(g.n)+'</option>'}).join('');
  return (ADM?'':rulesUI())+'<p class="hint">לכל סעיף הזינו את הסכום של חודשיים והממוצע יחושב לבד (אפשר להוסיף עוד חודשים). בן הזוג ובת הזוג מדרגים כל הוצאה: 1 = חיוני, 5 = אפשר לוותר.</p>'+(typeof txBtnBal==='function'?txBtnBal():'')+secs('bal')+bottom('bal')+
  '<div class="c"><div class="r" style="border:0"><label>מספר נפשות בבית</label><input type="number" min="0" data-s="ppl" data-k="x" value="'+(S.ppl||'')+'"></div>'+
  (p&&food?'<div class="tot"><span>מזון לנפש לשבוע</span><span>'+fm(food/p/4.2)+'</span></div>':'')+'</div>'+
  '<div class="c"><b>הוספת סעיף</b><div class="f" style="margin-top:8px"><select id="cg">'+opts+'</select><input id="cn" placeholder="שם הסעיף"><button class="btn" data-a="add">'+ic('plus',18)+'<span>הוספה</span></button></div></div>'}
function structUI(){var o=G.map(function(g){return '<option>'+esc(g.n)+'</option>'}).join('');return '<div class="c"><b>ניהול קטגוריות</b><p class="hint">שינוי כאן מתעדכן אצל הזוג במאזן, בתקציב, במעקב ובסיכומים. אפשר להוסיף ולהסיר תתי קטגוריות, ולהוסיף קטגוריה חדשה (רק קטגוריה שהוספת אפשר להסיר). הסרה מסתירה את הסעיף, והנתונים נשמרים.</p><div class="f"><select id="sg">'+o+'</select><input id="sn" placeholder="שם תת קטגוריה"><button class="btn" data-a="ai">הוספת תת קטגוריה</button></div><div class="f" style="margin-top:8px"><select id="ct"><option value="f">הוצאה קבועה (אשראי)</option><option value="v">הוצאה משתנה (מעטפה)</option><option value="i">הכנסה</option></select><input id="cn2" placeholder="שם קטגוריה חדשה"><button class="btn" data-a="ag">הוספת קטגוריה</button></div></div>'}
function budLocked(){return !ADM&&!RO&&!!n(S.bl)&&!S.vs}
function budLock(){if(ADM||RO||S.vs)return '';return n(S.bl)?'<button class="lkb on" data-a="bul" title="לחיצה לפתיחת התקציב לעריכה" aria-label="פתיחת התקציב">'+ic('lock',18)+'<span>נעול</span></button>':'<button class="lkb" data-a="blk" title="לחיצה לנעילת התקציב" aria-label="נעילת התקציב">'+ic('unlock',18)+'<span>פתוח</span></button>'}
function pgHead(t,r){return '<div class="mhd"><h2 class="mtt">'+esc(t)+'</h2><span style="flex:1"></span>'+(r||'')+'</div>'}
var SCDEL='';
function scBar(){if(ADM||STAGE<2)return '';var l=S.sc||[];
  return '<div class="mft">'+'<button class="'+(!S.vs?'on':'')+'" data-a="vs0" data-id="">התקציב</button>'+l.map(function(z){return '<button class="'+(S.vs===z.id?'on':'')+'" data-a="vs0" data-id="'+esc(z.id)+'">'+esc(z.n)+'</button>'}).join('')+'</div>'+
   (S.vs&&!RO?(SCDEL===S.vs?'<div class="c scd"><b>למחוק את התסריט "'+esc(((l.filter(function(z){return z.id===S.vs})[0])||{}).n||'')+'"?</b><div class="hint" style="margin:4px 0 0">אי אפשר לשחזר.</div><div class="f"><button class="btn dng" data-a="dscy" title="מחיקה">'+ic('xx',18)+'<span>מחיקה</span></button><button class="btn sec" data-a="dscn">'+ic('xx',18)+'<span>ביטול</span></button></div></div>':'<div class="scb"><button class="lkb" data-a="dsc" title="מחיקת התסריט" aria-label="מחיקת התסריט">'+ic('xx',16)+'<span>מחיקת התסריט</span></button></div>'):'')+
   (RO?'':'<details class="c nsc"><summary>'+ic('plus',18)+'<span>תסריט חדש</span></summary><div class="hint" style="margin:6px 0">עותק של התקציב לעריכה בנפרד.</div><div class="f"><input id="scn" maxlength="60" placeholder="שם התסריט, למשל: אחרי עליית שכר" style="flex:1 1 160px"><button class="btn" data-a="nsc" title="יצירת תסריט">'+ic('check',18)+'<span>יצירה</span></button></div></details>')}
function budSum(){var i=ts('bud','i'),e=ex('bud');return '<div class="s3"><div><span>הכנסות ₪</span><b>'+fm(i).replace(' ₪','')+'</b></div><div><span>הוצאות ₪</span><b>'+fm(e).replace(' ₪','')+'</b></div><div><span>יתרה ₪</span><b class="'+(i-e<0?'neg':'pos')+'">'+fm(i-e).replace(' ₪','')+'</b></div></div>'}
function budRO(){var h='';G.forEach(function(g){var rows=its(g).map(function(i){return{i:i,v:n(S.bud[g.n+'|'+i])}}).filter(function(r){return r.v});if(!rows.length)return;var t=rows.reduce(function(s,r){return s+r.v},0);
  h+='<div class="c lkg"><div class="lkh">'+gic(g.n)+'<b>'+esc(g.n)+'</b></div>'+rows.map(function(r){return '<div class="brr"><span>'+mic(g,r.i)+' '+esc(r.i)+'</span><b>'+fm(r.v)+'</b></div>'}).join('')+'<div class="brr lks"><span>סה"כ</span><b>'+fm(t)+'</b></div></div>'});return h}
function bud(){if(budLocked())return scBar()+budSum()+budRO();return (ADM?'':scBar()+budSum())+'<p class="hint">'+(RO?'לצפייה בלבד.':ADM?'התקציב נבנה מהמאזן. אפשר להעתיק אותו ואז לשנות סעיפים.':(S.vs?'עריכת תסריט. התקציב לא משתנה.':''))+'</p>'+(ADM&&!RO?'<button class="btn" data-a="fill" style="margin-bottom:6px">העתק מהמאזן</button>':'')+secs('bud')+bottom('bud')+(ADM?structUI():'')}
function mgmtRulesUI(){var cT=0,dy=Math.min(28,Math.max(1,n(S.sd)||1));envKs().forEach(function(x){cT+=n(S.bud[x.k])});
 function R(i,t,d){return '<div class="rlr"><b class="rln">'+i+'</b><div><div class="rlt">'+t+'</div><div class="rld">'+d+'</div></div></div>'}
 return '<div class="c"><b style="font-size:17px">כללי ניהול התקציב</b></div>'+
 '<div class="c"><b>הוצאות קבועות</b>'+
 R(1,'ישיבה חודשית למציאת הפער','פעם בחודש, ביום '+dy+' בחודש, אחרי שהגיעו כל החשבונות, עוברים על ההוצאות הקבועות אחת לאחת, ממלאים מה שהיה בפועל ומשווים לתקציב.')+
 R(2,'פער שלילי סוגרים תוך 30 יום','פער חיובי אפשר להשתמש בו להעלאת רמת חיים. פער שלילי חובה לסגור בתוך 30 יום.')+
 R(3,'כלל החיסכון','יש הוצאות שקשה לשמור להן כסף בצד, כמו חיסכון, נופש ואירועים לא צפויים. לכל אחת מהן קובעים הוראת קבע חודשית בסכום שנקבע בתקציב, בחשבון נזיל. בחיסכון ארוך טווח כדאי להיוועץ ביועץ השקעות.')+
 R(4,'כלל 70-30','כשנוסף כסף לתקציב, למשל הלוואה שנגמרה, עליית שכר או הכנסה חד-פעמית עד 10,000 ₪: 70% הולכים לחיסכון ו-30% להעלאת רמת חיים.')+'</div>'+
 '<div class="c"><b>הוצאות משתנות</b>'+
 R(1,'מזומן בלבד','בהוצאות משתנות משתמשים רק במזומן, בלי אשראי ובלי צ\'קים. כדאי לא להחזיק את כרטיס האשראי בארנק ולהשתמש בו רק להוצאות קבועות, אם צריך.')+
 R(2,'משיכה בתחילת החודש','בתחילת כל חודש מושכים במזומן את התקציב החודשי להוצאות המשתנות'+(cT?': '+fm(cT)+' החודש.':'.'))+
 R(3,'חלוקה למעטפות','מחלקים את הסכום שנמשך למעטפות, לפי הסעיפים בתקציב.')+
 R(4,'לא מלווים ממעטפה למעטפה','לכל סעיף נקבע סכום חודשי לפי ההוצאה השנתית שלו. כסף שנשאר במעטפה נשמר לחודשים הבאים ולא עובר לסעיף אחר. בסוף השנה, מה שנשאר במעטפות אפשר להשתמש בו להעלאת רמת חיים.')+'</div>'}
function rlLink(){return '<button class="stp" data-a="tab" data-id="rl"><span><b>הכללים שלנו</b><small>איך מנהלים הוצאות קבועות ומזומן</small></span><span class="ck">‹</span></button>'}
function monRules(){if(STAGE<2||!n((S.md||{})[ym()]))return '';var ai=ts('act','i'),pi=ts('bud','i'),ae=ex('act'),h='';
  if(pi>0&&ai>pi){var x=ai-pi;h+='<div class="c rl2"><b>הכנסה חריגה החודש: '+fm(x)+'</b><div class="hint" style="margin:4px 0 0">כלל 70-30: '+(x>10000?'מעל 10,000 ₪ כדאי להתייעץ עם המאמנת. לפי הכלל, ':'')+fm(x*.7)+' מיועדים לחיסכון ו-'+fm(x*.3)+' להעלאת רמת חיים. אפשר לעדכן את התקציב בהתאם.</div>'+'<div class="f" style="margin-top:8px">'+(S.mt&&S.mt['x37'+ym()]?'<span class="hint" style="margin:0">✓ נוספה משימה</span>':'<button class="btn" data-a="t37" data-v="'+Math.round(x*.7)+'">להוסיף משימה: להעביר '+fm(x*.7)+' לחיסכון</button>')+'</div></div>'}
  if(ai>0&&ae>ai){h+='<div class="c rl2 bd2"><b>פער שלילי של '+fm(ae-ai)+'</b><div class="hint" style="margin:4px 0 0">פער שלילי חובה לסגור תוך 30 יום. לא מלווים ממעטפה למעטפה, וחוזרים למסגרת בחודש הבא.</div></div>'}
  return h}
function mon(){
  if(window.TX&&TX.open&&!TX.bal)return TXUI();
  var k=ym(),ai=ts('act','i'),pi=ts('bud','i'),ae=ex('act'),pe=ex('bud');
  var ms=MN.map(function(m,i){return '<option value="'+(i+1)+'"'+(i+1===S.m?' selected':'')+'>'+m+'</option>'}).join('');
  var vss=vsSel();
  return '<div class="mhd"><button class="chv" data-a="mpv" title="חודש קודם" aria-label="חודש קודם">'+ic('bck',22)+'</button><h2 class="mtt">'+MN[S.m-1]+' '+S.y+'</h2><button class="chv" data-a="mnx" title="חודש הבא" aria-label="חודש הבא">'+ic('nxt',22)+'</button><span style="flex:1"></span>'+lockBtn(k)+'</div>'+(vss?'<div class="mvs"><small>תקציב להצגה</small>'+vss+'</div>':'')+
  '<div class="s3"><div><span>הכנסות ₪</span><b>'+fm(ai).replace(' ₪','')+'</b><small>תקציב '+fm(pi)+'</small></div><div><span>הוצאות ₪</span><b class="'+(ae>pe&&pe?'neg':'')+'">'+fm(ae).replace(' ₪','')+'</b><small>תקציב '+fm(pe)+'</small></div><div><span>יתרה ₪</span><b class="'+(ai-ae<0?'neg':'pos')+'">'+fm(ai-ae).replace(' ₪','')+'</b></div></div>'+
  (isLocked(k)?'':overUI())+(typeof txBtn==='function'?txBtn():'')+(isLocked(k)?'':'')+(isLocked(k)?lockBody(k):monSeg())+
  (isLocked(k)?closeSum(k):'<div class="c"><b>סיכום ותובנות</b><div class="hint" style="margin:4px 0 0">יופיעו אחרי סגירת החודש.</div><textarea id="nt" rows="3" style="width:100%;margin-top:10px" placeholder="הערות לחודש: מסקנות ומשימות לחודש הבא">'+esc(S.note[k]||'')+'</textarea></div>')}
function yr(){
  var rows='',TI=0,TE=0,TP=0;
  MN.forEach(function(m,i){var k=S.y+'-'+(i+1),ai=ts('act','i',k),ae=ex('act',k);
    if(!ai&&!ae){rows+='<tr><td>'+m+'</td><td colspan="4">—</td></tr>';return}
    TI+=ai;TE+=ae;TP+=ex('bud')-ae;
    rows+='<tr><td>'+m+'</td><td>'+fm(ai)+'</td><td>'+fm(ae)+'</td><td class="'+(ai-ae<0?'neg':'')+'">'+fm(ai-ae)+'</td><td class="'+(ex('bud')-ae<0?'neg':'')+'">'+fm(ex('bud')-ae)+'</td></tr>'});
  rows+='<tr><th>סה״כ</th><th>'+fm(TI)+'</th><th>'+fm(TE)+'</th><th>'+fm(TI-TE)+'</th><th>'+fm(TP)+'</th></tr>';
  return '<div class="c ov"><b>שנת '+S.y+'</b><table><tr><th>חודש</th><th>הכנסות</th><th>הוצאות</th><th>יתרה</th><th>פער מהתקציב</th></tr>'+rows+'</table></div><p class="hint">פער מהתקציב: חיובי = חסכתם ביחס לתוכנית, שלילי = חריגה.</p>'}
function defL(){return{sv:['יתרה בעו"ש','חיסכון לכל ילד','קופת גמל','קרן השתלמות','קרן חרום','הוצאות בלתי מתוכננות'].map(function(x){return{n:x,m:'',v:'',r:'',y:'',q:''}}),ln:[],ins:[],gl:[],kd:[],pn:['פנסיה בן זוג','פנסיה בת זוג'].map(function(x){return{n:x,v:'',m:'',e:'',c:''}})}}
var FD={pn:[{k:'n',l:'שם',t:'t'},{k:'v',l:'שווי נוכחי',t:'n'},{k:'m',l:'הפקדה חודשית',t:'n'},{k:'e',l:'הצפי לפנסיה',t:'n'},{k:'c',l:'עמלות %',t:'n'},{k:'iv',l:'איפה מושקע',t:'t'}],kd:[{k:'n',l:'שם הילד/ה',t:'t'},{k:'a',l:'גיל',t:'n'}],sv:[{k:'n',l:'שם החיסכון',t:'t'},{k:'m',l:'הפקדה חודשית',t:'n'},{k:'v',l:'שווי נוכחי',t:'n'},{k:'r',l:'תשואה שנתית %',t:'n'},{k:'y',l:'צפי לעוד (שנים)',t:'n'},{k:'q',l:'נזילות',t:'s',o:['נזיל מיידית','תוך שנה','ארוך טווח']},{k:'iv',l:'איפה מושקע',t:'t'}],
ln:[{k:'y',l:'סוג',t:'s',o:['הלוואה','משכנתא']},{k:'n',l:'שם ההלוואה / המשכנתא',t:'t'},{k:'w',l:'שווי הנכס',t:'n',w:'משכנתא'},{k:'b',l:'יתרה',t:'n'},{k:'c',l:'חודשים לסיום',t:'n'},{k:'p',l:'החזר חודשי',t:'n'},{k:'r',l:'ריבית שנתית % (לא חובה)',t:'n'}],
ins:[{k:'y',l:'סוג',t:'s',o:['חיים','בריאות','רכב','דירה ותכולה','אובדן כושר עבודה','אחר']},{k:'n',l:'חברה / פירוט',t:'t'},{k:'p',l:'פרמיה',t:'n'},{k:'f',l:'תדירות',t:'s',o:['חודשי','שנתי']},{k:'r',l:'חידוש',t:'m'}],
gl:[{k:'n',l:'שם היעד',t:'t'},{k:'t',l:'סכום יעד',t:'n'},{k:'s',l:'נחסך עד כה',t:'n'},{k:'d',l:'תאריך יעד',t:'m'}]};
function sm(l,f,fn){return S.L[l].filter(fn||function(){return true}).reduce(function(a,x){return a+n(x[f])},0)}
function tile(b,s,c){return '<div class="k"><b class="'+(c||'')+'">'+b+'</b><span>'+s+'</span></div>'}
function fld(l,i,f,v){var b=' data-s="L" data-k="'+l+'.'+i+'.'+f.k+'"'+(f.t==='n'?' data-ty="n"':''),h;
  if(f.t==='s')h='<select'+b+'>'+(v?'':'<option value="">—</option>')+f.o.map(function(o){return '<option'+(o===v?' selected':'')+'>'+o+'</option>'}).join('')+'</select>';
  else h='<input type="'+(f.t==='n'?'number':f.t==='m'?'month':'text')+'"'+b+' value="'+esc(v==null?'':v)+'"'+(f.t==='n'?' inputmode="decimal" min="0"':'')+'>';
  return '<span><small>'+f.l+'</small>'+h+'</span>'}
function lst(l,title,hint,xf){return '<div class="c"><b>'+title+'</b><p class="hint">'+hint+'</p>'+S.L[l].map(function(x,i){return '<div class="it"><div class="fl">'+FD[l].filter(function(f){return !f.w||x.y===f.w}).map(function(f){return fld(l,i,f,x[f.k])}).join('')+'<button class="gh" style="width:30px;color:var(--bd)" data-a="ld" data-l="'+l+'" data-i="'+i+'" aria-label="מחיקה">✕</button></div>'+(xf?xf(x):'')+estLine(l,x)+insLine(l,x)+'</div>'}).join('')+'<button class="btn" data-a="la" data-l="'+l+'" style="margin-top:8px">'+ic('plus',18)+'<span>הוספה</span></button>'+(l==='ln'?' <button class="btn sec" data-a="la" data-l="ln" data-y="משכנתא" data-nm="משכנתא דירה" style="margin-top:8px">+ משכנתא דירה</button>':'')+'</div>'}
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
  '<svg viewBox="0 0 '+W+' '+H+'" width="100%" role="img" aria-label="גרף תחזית חיסכון" style="max-height:170px"><polyline points="'+dl+'" fill="none" stroke="#8a97b0" stroke-width="2" stroke-dasharray="4 3"/><polyline points="'+pts(sc[0])+'" fill="none" stroke="#8C3B3B" stroke-width="2"/><polyline points="'+pts(sc[1])+'" fill="none" stroke="#1F3A5F" stroke-width="3"/><polyline points="'+pts(sc[2])+'" fill="none" stroke="#1F6F50" stroke-width="2"/></svg>'+
  '<small class="hint">קו מקווקו: הפקדות בלבד · כתום: '+sc[0]+'% · כחול: '+sc[1]+'% · ירוק: '+sc[2]+'%</small>'+
  '<div class="ov"><table><tr><th>שנה</th><th>הפקדות</th><th>תשואה '+sc[0]+'%</th><th>תשואה '+sc[1]+'%</th><th>תשואה '+sc[2]+'%</th></tr>'+rows+'</table></div>':'<p class="hint">הזינו סכום התחלתי או הפקדה חודשית, תשואה ומספר שנים כדי לראות תחזית.</p>')}}
function fcUI(){var f=S.fc||{},inp=function(k,l,u,ph){return '<span><small>'+l+'</small><input type="number" inputmode="decimal" min="0" class="fcin" data-s="fc" data-k="'+k+'" value="'+(f[k]===undefined?'':esc(f[k]))+'" placeholder="'+(ph||'0')+'" aria-label="'+l+'"></span>'};
  var dep=sm('sv','m'),val=sm('sv','v'),pre=(val||dep)?'<div class="hint">אפשר להתחיל מהחסכונות שלכם: שווי נוכחי '+fm(val)+', הפקדה חודשית '+fm(dep)+'.</div>':'';
  return '<div class="c" id="fcc"><b>תחזית חיסכון לפי תשואה</b><p class="hint">כמה יהיה שווה הכסף אם מפקידים סכום קבוע בכל חודש. התשואה היא שנתית, והחישוב מניח הפקדה בסוף כל חודש. זו הערכה בלבד ולא הבטחה לתשואה.</p>'+pre+
  '<div class="dt">'+inp('p','סכום התחלתי')+inp('m','הפקדה חודשית')+inp('r','תשואה שנתית %','', '5')+inp('y','מספר שנים','','10')+inp('s','פער לתרחישים %','','2')+'</div><div id="fcout">'+fcalc().html+'</div></div>'}
function svf(x){var f=S.fc||{},r=x.r!==undefined&&x.r!==''&&x.r!==null?n(x.r):(f.r!==undefined&&f.r!==''?n(f.r):null),y=n(x.y)||n(f.y);if(r==null||!y)return '<small>בחרו תשואה ומספר שנים כדי לראות צפי.</small>';var a=fv(n(x.v),n(x.m),r,y),d=n(x.v)+n(x.m)*12*y;return '<div class="fcr"><b>צפי בעוד '+y+' שנים: '+fm(a)+'</b><small>בתשואה של '+r+'% לשנה · הפקדות '+fm(n(x.m)*12*y)+' · רווח צפוי '+fm(a-d)+'</small></div>'}
function svt(){var f=S.fc||{},t=0,c=0;S.L.sv.forEach(function(x){var r=x.r!==undefined&&x.r!==''&&x.r!==null?n(x.r):(f.r!==undefined&&f.r!==''?n(f.r):null),y=n(x.y)||n(f.y);if(r==null||!y)return;t+=fv(n(x.v),n(x.m),r,y);c++});return c?t:null}
var YC=[["תשרי", ["מקומות ביכ\"נ", "מזון לחג (בנוסף להוצאות המזון הרגילות)", "כפרות", "נסיעות חוה\"מ", "ארבעת המינים", "הוצאות סוכה", "מתנות אשה/ילדים"]], ["כסלו", ["דמי חנוכה", "מסיבות"]], ["שבט", ["פירות ט\"ו בשבט"]], ["אדר", ["תחפושות", "מתנות גננות/מלמדים/מורות", "משלוחי מנות ומחצית השקל", "מתנות לאביונים", "סעודה/אירוח"]], ["ניסן", ["צביעה וסיוד", "נקיון/עוזרת", "אוכל לפני פסח", "קמחא דפסחא/מכירת חמץ", "מזון לחג (בנוסף להוצאות המזון הרגילות)", "מצות", "מתנות לאשה/ילדים כולל אפיקומן"]], ["אייר", ["ל\"ג בעומר"]], ["סיון", ["חג השבועות"]], ["חופשת הקיץ", ["מחנות קיץ", "קייטנות", "אתרים ואטרקציות", "חופשה שנתית משפחתית", "חופשה שנתית זוגית", "נסיעות/רכב/טיסות", "ציוד / משחקים / שונות"]], ["ביגוד והנעלה", ["תלבושת לבית הספר", "ביגוד חגי תשרי", "ביגוד פסח", "ביגוד עונתי קיץ ילדים", "ביגוד עונתי קיץ הורים", "ביגוד עונתי חורף ילדים", "ביגוד עונתי חורף הורים", "הנעלה קיץ הורים / ילדים", "הנעלה חורף הורים / ילדים"]]];
function ycSecs(){return YC.map(function(s){return[s[0],s[1].concat((S.yx||{})[s[0]]||[])]})}
function ycTab(){var yc=S.yc||{},tt=0;
  var body=ycSecs().map(function(s){var sub=0;s[1].forEach(function(i){sub+=n(yc[s[0]+'|'+i])});tt+=sub;
    return '<details class="c"'+(sub?' open':'')+'><summary style="cursor:pointer"><b>'+s[0]+'</b><span style="float:left">'+(sub?fm(sub):'')+'</span></summary>'+s[1].map(function(i){var k=s[0]+'|'+i;return '<div class="r"><label>'+esc(i)+'</label><input type="number" inputmode="decimal" min="0" data-s="yc" data-k="'+esc(k)+'" value="'+(yc[k]||'')+'" placeholder="0"'+(ADM?' disabled':'')+'></div>'}).join('')+'</details>'}).join('');
  return '<div class="g">'+tile(fm(tt),'סה״כ לשנה')+tile(fm(tt/12),'ממוצע לחודש')+'</div><p class="hint">הוצאות שמגיעות פעם בשנה, לפי חגים ועונות. הממוצע החודשי עוזר למלא את סעיפי החגים, החופשות והביגוד במאזן.</p>'+body+
  (ADM?'':'<div class="c"><b>הוספת הוצאה</b><div class="f" style="margin-top:8px"><select id="yxs">'+YC.map(function(s){return '<option>'+s[0]+'</option>'}).join('')+'</select><input id="yxn" type="text" maxlength="80" placeholder="שם ההוצאה"><button class="btn" data-a="yxa">'+ic('plus',18)+'<span>הוספה</span></button></div></div>')}
function tvs(){
  var dep=sm('sv','m'),val=tot('sv'),liq=tot('sv',function(x){return x.q==='נזיל מיידית'}),e=ex('bal'),lb=sm('ln','b'),lp=sm('ln','p'),inc=ts('bal','i');
  return '<div class="g">'+tile('כ-'+fm(val),'שווי חסכונות (משוער)')+tile(fm(dep),'הפקדה חודשית')+tile(e?(liq/e).toFixed(1):'—','כרית ביטחון (חודשי הוצאות)')+'</div>'+(svt()!=null?'<div class="c"><b>צפי כולל לחסכונות: '+fm(svt())+'</b><div class="hint" style="margin:0">סכום הצפי של החסכונות שהוגדרו להם תשואה ושנים.</div></div>':'')+
  lst('pn','פנסיה','לכל קרן פנסיה: שווי נוכחי, הפקדה חודשית, הצפי לפנסיה ואחוז עמלות.',function(x){return n(x.v)?'<small>שווי נוכחי '+fm(n(x.v))+(n(x.m)?' · הפקדה שנתית '+fm(n(x.m)*12):'')+'</small>':''})+
  lst('sv','חסכונות','קרן השתלמות, חיסכון לכל ילד, קופות ועוד. לכל חיסכון בחרו תשואה שנתית ומספר שנים, ותראו כמה הוא צפוי להיות שווה. כרית הביטחון מחושבת מחסכונות שסומנו נזיל מיידית, מול ההוצאות החודשיות במאזן.',svf)+
  '<div class="g">'+tile('כ-'+fm(tot('ln',function(x){return !isMg(x)})),'יתרת הלוואות (משוער)')+tile('כ-'+fm(tot('ln',isMg)),'יתרת משכנתא (משוער)')+tile(fm(sm('ln','p',function(x){return x.y!=='משכנתא'})),'החזר חודשי על הלוואות')+tile(fm(sm('ln','p',function(x){return x.y==='משכנתא'})),'החזר חודשי על משכנתא')+tile(inc?Math.round(lp/inc*100)+'%':'—','מההכנסה (סה״כ החזרים)',inc&&lp/inc>.2?'neg':'')+'</div>'+
  lst('ln','הלוואות ועסקאות בתשלומים','ההחזר החודשי אמור להופיע גם בסעיף הלוואות במאזן.',function(x){var o=n(x.p)&&n(x.c)?'<small>סה״כ עד סיום: '+fm(n(x.p)*n(x.c))+'</small>':'';if(x.y==='משכנתא'&&n(x.w))o+='<small>שווי הנכס '+fm(n(x.w))+(n(x.b)?' · יתרת המשכנתא '+Math.round(n(x.b)/n(x.w)*100)+'% משווי הנכס · הון עצמי '+fm(Math.max(0,n(x.w)-n(x.b))):'')+'</small>';return o})+fcUI()}
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
  return '<div class="g">'+tile(fm(mo),'ביטוחים בחודש')+tile(fm(mo*12),'ביטוחים בשנה')+'</div>'+
  lst('ins','ביטוחים','לכל ביטוח הזינו פרמיה ותדירות. ביטוח שנתי מחושב גם כעלות חודשית, כדי לשמור בצד כל חודש.',function(x){return x.f==='שנתי'&&n(x.p)?'<small>שווה ערך ל-'+fm(n(x.p)/12)+' בחודש</small>':''})}
function tgl(){var need=0;S.L.gl.forEach(function(x){var m=gm(x.d),r=n(x.t)-n(x.s);if(m>0&&r>0)need+=r/m});
  return fmUI()+(need?'<div class="g">'+tile(fm(need),'נדרש בחודש ליעדים')+'</div>':'')+
  lst('gl','יעדים','רכב, דירה, חתונה של ילד ועוד. מוצג כמה נותר וכמה כדאי לחסוך בחודש.',function(x){var t=n(x.t),r=t-n(x.s),m=gm(x.d);if(!t)return '';var p=n(x.s)/t;
    return '<div class="bar"><i class="'+(p>=1?'ok':'wn')+'" style="width:'+Math.min(100,p*100)+'%"></i></div><small>'+(r<=0?'היעד הושג':m==null?'נותר '+fm(r):m>0?'נותרו '+m+' חודשים · כדאי לחסוך '+fm(r/m)+' בחודש':'המועד עבר, נותר '+fm(r))+'</small>'})}

/* מסך הבית של הזוג */
function doneUI(){if(STAGE>=2)return '';var dt=n(S.dn);if(RO===false&&false)return '';return dt?'<div class="c"><b>✓ סימנתם שהמאזן הושלם</b><div class="hint" style="margin:4px 0 8px">המאמנת רואה שהשלמתם ב-'+new Date(dt).toLocaleDateString('he-IL')+'. אפשר להמשיך לעדכן, ואפשר לבטל את הסימון.</div><button class="btn sec" data-a="undn">ביטול הסימון</button></div>':'<div class="c"><b>סיימתם למלא?</b><div class="hint" style="margin:4px 0 8px">אחרי שמילאתם את המאזן, החסכונות, ההלוואות והביטוחים, לחצו על הכפתור כדי שהמאמנת תדע שהשלמתם.</div><button class="btn" data-a="dn">'+ic('check',18)+'<span>הושלם</span></button></div>'}
var PMS=['מזומן','אשראי','הו"ק','חיסכון קצר (הו"ק)','חיסכון ארוך (הו"ק)'];
function pmv(g,i){var v=(S.pm||{})[g.n+'|'+i];if(v)return v;if(g.t==='i')return '';
  if(/חסכונות|חיסכון|השתלמות|פנסי/.test(i))return 'חיסכון ארוך (הו"ק)';
  if(/קרן חרום|לא מתוכננות|נסיעות וחופשות|חופש/.test(i))return 'חיסכון קצר (הו"ק)';
  if(/ביטוח|משכנתא|שכר דירה|ארנונה|ועד בית|^הלוואות$|הלוואה|קופ"ח|דמי כרטיס/.test(i))return 'הו"ק';
  return g.t==='v'?'מזומן':g.t==='f'?'אשראי':''}
function gsm(sn,g,cash){var s=st(sn);return its(g).reduce(function(a,i){var c=pmv(g,i)==='מזומן';return a+((cash?c:!c)?n(s[g.n+'|'+i]):0)},0)}
function pmSel(g,i,dis){var k=g.n+'|'+i,v=pmv(g,i);return '<select data-s="pm" data-k="'+esc(k)+'" aria-label="אמצעי תשלום"'+(dis?' disabled':'')+'>'+PMS.map(function(o){return '<option value="'+esc(o)+'"'+(o===v?' selected':'')+'>'+esc(o)+'</option>'}).join('')+'</select>'}
var PMC={'מזומן':'#1F6F50','אשראי':'#1F3A5F','הו"ק':'#C9A23F','חיסכון קצר (הו"ק)':'#8C3B3B','חיסכון ארוך (הו"ק)':'#5B7DA6','אחר':'#8a97b0'};
function pmChart(m){var ks=Object.keys(m).sort(function(a,b){return m[b]-m[a]}),T=ks.reduce(function(a,k){return a+m[k]},0);if(!T)return '';
  var C=2*Math.PI*40,off=0,arcs=ks.map(function(k){var l=m[k]/T*C,r='<circle cx="50" cy="50" r="40" fill="none" stroke="'+(PMC[k]||'#8a97b0')+'" stroke-width="16" stroke-dasharray="'+l.toFixed(2)+' '+(C-l).toFixed(2)+'" stroke-dashoffset="'+(-off).toFixed(2)+'" transform="rotate(-90 50 50)"/>';off+=l;return r}).join('');
  return '<div class="pmc"><svg viewBox="0 0 100 100" width="130" height="130" role="img" aria-label="חלוקת ההוצאות לפי אמצעי תשלום">'+arcs+'<text x="50" y="47" text-anchor="middle" font-size="9" fill="currentColor">סך הוצאות</text><text x="50" y="59" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">'+fm(T)+'</text></svg><div class="pml">'+ks.map(function(k){return '<div><i style="background:'+(PMC[k]||'#8a97b0')+'"></i><span>'+esc(k)+'</span><b>'+fm(m[k])+'</b><small>'+Math.round(m[k]/T*100)+'%</small></div>'}).join('')+'</div></div>'}
function pmData(sn){var m={},s=st(sn),any=0;G.forEach(function(g){if(g.t==='i')return;its(g).forEach(function(i){var x=n(s[g.n+'|'+i]);if(!x)return;var p=pmv(g,i)||'אחר';m[p]=(m[p]||0)+x;any=1})});return any?m:null}
function pmSum(sn){var m=pmData(sn);if(!m)return '';
  return '<div class="c"><b>לאן הולכות ההוצאות</b><div class="hint" style="margin:2px 0 6px">לפי אמצעי תשלום</div>'+pmChart(m)+(m['מזומן']?'<div class="tot" style="color:#1F6F50;margin-top:8px"><span>מזומן להוצאה החודש</span><span>'+fm(m['מזומן'])+'</span></div>':'')+'</div>'}
function openTk(){return INBOX.filter(function(m){return(m.k==='tk'||m.k==='ch')&&!S.chd[m.id]&&!S.chd['hid:'+m.id]}).length+Object.keys(S.mt||{}).filter(function(id){return !S.chd[id]}).length}
function dueTxt(m){return m.due?' · עד '+new Date(m.due+'T00:00').toLocaleDateString('he-IL'):''}
var RULES=[["שיתוף פעולה זוגי", "חשוב ששני בני הזוג יהיו מעורבים במילוי. זו משימה משותפת שמטרתה ליצור בהירות, הבנה ושיתוף. רק כששני בני הזוג מעורבים ומחויבים להצלחה, התהליך באמת מצליח."], ["רישום הוצאות", "למלא כל הוצאה בדיוק כפי שהיא. לא מסננים, לא מתלבטים, לא דנים, רק מתעדים. זה לא הזמן להתווכח אם ההוצאה \"נכונה\" או \"מיותרת\". בשביל זה תדרגו כל הוצאה בהמשך."], ["מילוי חודשיים רצופים", "ממלאים לשני חודשים עוקבים כדי לקבל תמונה מלאה ולזהות דפוסים חוזרים."], ["שימוש בנתוני אשראי", "רושמים את החיובים בדיוק כפי שמופיעים בכרטיסי האשראי בחודש שעליו אתם עובדים, גם אם ההוצאה בוצעה בחודש קודם."], ["עסקאות בתשלומים", "כל תשלום נחשב הלוואה. את הסכום החודשי רושמים בהוצאות, ואת יתרת התשלומים בלשונית \"חסכונות והלוואות\"."], ["הלוואות", "ממלאים את כל ההלוואות הקיימות, כולל גמ\"ח, בנק, מינוס ועסקאות בתשלומים."], ["חסכונות ונכסים", "מציינים חסכונות, קופות גמל, חיסכון לכל ילד, קרן השתלמות, השקעות, נכסים כמו דירה וכל נכס פיננסי אחר."], ["ממוצע שנתי", "לאחר מילוי חודשיים הממוצע מחושב לבד. לסעיפי חגים, חופשות וכדומה כדאי להתחשב בהוצאה השנתית כולה."], ["סולם ערכים אישי", "בסיום, כל אחד מבני הזוג מדרג את הסעיפים לפי הערכים האישיים שלו. התקציב צריך לשקף את המשפחה שלכם."]];
function rulesUI(){var empty=!Object.keys(S.bal||{}).length;
  return '<details class="c rul"'+(empty?' open':'')+'><summary><b>הוראות למילוי המאזן</b></summary><div class="rl">'+RULES.map(function(r,i){return '<div class="rr"><span>'+(i+1)+'</span><div><b>'+r[0]+'</b><div class="hint" style="margin:2px 0 0">'+r[1]+'</div></div></div>'}).join('')+'<div class="hint" style="margin-top:10px">לכל שאלה אפשר לפנות לדסי הרשטיק, מאמנת לכלכלת המשפחה: <a href="mailto:nekodatizon@gmail.com">nekodatizon@gmail.com</a> · <a href="tel:0548421336">054-8421336</a></div></div></details>'}
function ekPrev(k){var p=k.split('-'),y=+p[0],m=+p[1];return m>1?y+'-'+(m-1):(y-1)+'-12'}
function envCarry(key,k){var e=(S.env||{})[ekPrev(k)];if(!e||!e.done||!e.left)return 0;var t=0;Object.keys(e.left).forEach(function(h){var v=n(e.left[h]);if(v<=0)return;var mv=(e.mv||{})[h]||'carry';if(envAnn(h)&&mv!=='free')mv='carry';var dest=mv==='carry'?h:mv==='free'?null:mv;if(dest===key)t+=v});return t}
function envKs(){var o=[];G.forEach(function(g){if(g.t==='i')return;its(g).forEach(function(i){var k=g.n+'|'+i;if(pmv(g,i)==='מזומן'&&n(S.bud[k])>0)o.push({g:g,i:i,k:k})})});return o}
var ANN=/חופש|נופש|ביגוד|הנעלה|חג|מתנות|אירוע|רהיט|שיפוץ|בריכה|קייטנ/;
function envAnn(k){return ANN.test(k)}
function envLbl(e){return e.i+(e.g.n!==e.i?' ('+e.g.n+')':'')}
function envFinish(k){var e=S.env[k];e.left=e.left||{};e.d={};var a=S.act[k]=S.act[k]||{};
  envKs().forEach(function(x){var av=n(S.bud[x.k])+envCarry(x.k,k),lf=e.left[x.k];lf=(lf===''||lf===undefined)?av:Math.max(0,Math.min(av,n(lf)));e.left[x.k]=lf;var sp=Math.round(av-lf);a[x.k]=sp;e.d[x.k]=sp});
  e.done=Date.now()}
function envUndo(k){var e=S.env[k];if(!e)return;Object.keys(e.d||{}).forEach(function(key){if(S.act[k])delete S.act[k][key]});e.d={};e.done=0}
function envClose(k){var e=(S.env||{})[k]||{};if(!e.w)return '';var vs=envKs();if(!vs.length)return '';var mn=MN[+k.split('-')[1]-1],nm={};vs.forEach(function(x){nm[x.k]=envLbl(x)});
  if(e.done){var tl=0,mvl=[];vs.forEach(function(x){var v=n((e.left||{})[x.k]);tl+=v;var m=(e.mv||{})[x.k]||'carry';if(v>0)mvl.push(esc(nm[x.k])+': '+fm(v)+(m==='carry'?' נשאר במעטפה':m==='free'?' לא מועבר':' עובר ל'+esc(nm[m]||m)))});
    return '<div class="c" style="border:2px solid var(--ok)"><b>✓ מעטפות '+mn+' נסגרו</b><p style="margin:8px 0">'+(tl>0?'נשארו '+fm(tl)+' במעטפות.':'כל המזומן נוצל.')+'</p>'+(mvl.length?'<div class="hint">'+mvl.join('<br>')+'</div>':'')+'<button class="btn sec" style="margin-top:8px" data-a="envu" data-e="'+k+'">פתיחה מחדש</button></div>'}
  return '<div class="c"><b>סגירת מעטפות '+mn+'</b><div class="hint" style="margin:4px 0 10px">בסוף החודש מסמנים כמה נשאר בכל מעטפה.</div>'+
    vs.map(function(x){var av=n(S.bud[x.k])+envCarry(x.k,k),lf=(e.left||{})[x.k],mv=(e.mv||{})[x.k]||'carry';
      return '<div class="it"><div class="tot" style="padding:0"><span>'+esc(x.i)+(x.g.n!==x.i?' <small>'+esc(x.g.n)+'</small>':'')+'</span><small>זמין '+fm(av)+'</small></div><div class="fl" style="margin-top:6px"><span><small>כמה נשאר?</small><input type="number" inputmode="decimal" min="0" data-s="envl" data-e="'+k+'" data-k="'+esc(x.k)+'" value="'+(lf===undefined||lf===''?'':lf)+'" placeholder="0"></span><span><small>היתרה</small><select data-s="envm" data-e="'+k+'" data-k="'+esc(x.k)+'"><option value="carry"'+(mv==='carry'?' selected':'')+'>נשארת במעטפה</option><option value="free"'+(mv==='free'?' selected':'')+'>לא מועברת</option>'+(envAnn(x.k)?'':vs.filter(function(y){return y.k!==x.k}).map(function(y){return '<option value="'+esc(y.k)+'"'+(mv===y.k?' selected':'')+'>להעביר ל'+esc(envLbl(y))+'</option>'}).join(''))+'</select></span></div>'+(envAnn(x.k)?'<div class="hint" style="margin:6px 0 0">מעטפה שנתית: היתרה נשמרת לחודשים הבאים ולא מועברת למעטפה אחרת.</div>':'')+'</div>'}).join('')+
    '<button class="btn" style="margin-top:10px" data-a="envc" data-e="'+k+'">סיום חודש</button></div>'}
function envWd(k){var e=(S.env||{})[k]||{};return e.w?'<div class="hint" style="margin:8px 0 0">✓ משכתם ב-'+new Date(e.w).toLocaleDateString('he-IL')+' <button class="btn sec" style="padding:4px 10px;margin-right:6px" data-a="envx" data-e="'+k+'">'+ic('xx',18)+'<span>ביטול</span></button></div>':'<button class="btn" style="margin-top:10px" data-a="envw" data-e="'+k+'">'+ic('cash',18)+'<span>משכנו ומילאנו</span></button>'}
var SEGS=[['i','הכנסות'],['אשראי','אשראי'],['מזומן','מעטפות'],['הו"ק','הו"ק לטווח קצר'],['sv','הו"ק לטווח ארוך']];
function segOf(g,i){if(g.t==='i')return 'i';var p=pmv(g,i);return p==='אשראי'||p==='מזומן'||p==='הו"ק'?p:/קצר/.test(p)?'הו"ק':/חיסכון/.test(p)?'sv':'אשראי'}
function segItems(sg){var o=[],a=st('act');G.forEach(function(g){its(g).forEach(function(i){if(segOf(g,i)!==sg)return;var k=g.n+'|'+i;if(n(S.bud[k])>0||n(a[k])>0)o.push({g:g,i:i,k:k})})});return o}
function monSeg(){var sg=S.seg||'אשראי',a=st('act'),tb=SEGS.map(function(x){var it=segItems(x[0]),t=0;it.forEach(function(y){t+=n(a[y.k])});return '<button class="sg'+(sg===x[0]?' on':'')+'" data-a="seg" data-id="'+x[0]+'"><span>'+x[1]+'</span><small>'+(it.length?fm(t):'—')+'</small></button>'}).join('');
  var body;
  if(sg==='מזומן'){var nv=envKs(),cT=0;nv.forEach(function(x){cT+=n(S.bud[x.k])});body=nv.length?'<div class="c cashc"><div class="hint" style="margin:0">מזומן למעטפות החודש</div><div class="evv">'+fm(cT)+'</div>'+envWd(ym())+'</div>'+(S.env&&S.env[ekPrev(ym())]&&!S.env[ekPrev(ym())].done?envClose(ekPrev(ym())):'')+envClose(ym()):'<div class="c"><p class="hint" style="margin:0">אין עדיין סעיפים במזומן. בתקציב אפשר לסמן לכל סעיף אמצעי תשלום.</p></div>'}
  else{var it=segItems(sg),last='';body=it.length?it.map(function(x){var hd='';if(x.g.n!==last){last=x.g.n;hd='<div class="sgh">'+gic(x.g.n)+'<b>'+esc(x.g.n)+'</b></div>'}
      var bv=n(S.bud[x.k]),av=n(a[x.k]),d=sg==='i'?av-bv:bv-av;
      return hd+'<div class="r"><label>'+esc(x.i)+'<small>תקציב '+fm(bv)+'</small></label><input type="number" inputmode="decimal" min="0" data-s="act" data-k="'+esc(x.k)+'" value="'+(av||'')+'" placeholder="0"><span class="d '+(d<0?'neg':'')+'">'+fm(d)+'</span>'+'</div>'}).join('')+'':'<div class="c"><p class="hint" style="margin:0">אין סעיפים בקטגוריה הזו.</p></div>';
    if(it.length)body='<div class="c">'+body+'</div>'}
  return '<div class="sgs">'+tb+'</div>'+body}
function overUI(){var o=G.filter(function(g){var b=gs('bud',g),a=gs('act',g);return g.t!=='i'&&b>0&&a>b});if(!o.length)return '';
  return '<div class="c" style="border:1px solid var(--bd)"><b>'+(o.length===1?'קטגוריה אחת חרגה':o.length+' קטגוריות חרגו')+' מהתקציב</b>'+o.map(function(g){var a=gs('act',g),b=gs('bud',g);return '<button class="r cc" data-a="og" data-id="'+esc(g.n)+'"><span>'+esc(g.n)+'</span><span class="neg">+'+fm(a-b)+'</span></button>'}).join('')+'</div>'}
function remUI(){if(STAGE<2)return '';var P0=perNow(S.sd),py=P0.m>1?P0.y:P0.y-1,pm=P0.m>1?P0.m-1:12,pk=py+'-'+pm;
  if(n((S.md||{})[pk])||!S.act[pk]||!Object.keys(S.act[pk]).length)return '';
  return '<div class="c" style="border:1px solid var(--wn)"><b>סגירת '+MN[pm-1]+'</b><div class="hint" style="margin:4px 0 8px">'+MN[pm-1]+' עוד לא סומן כהושלם. כדאי לעבור על ההוצאות בפועל ולסגור את החודש.</div><button class="btn" data-a="gm" data-y="'+py+'" data-m="'+pm+'">'+ic('lock',18)+'<span>סגירת החודש</span></button></div>'}
function mdUI(){var k=ym(),dt=n((S.md||{})[k]),bal=ts('act','i')-ex('act'),ev=envKs().length>0,envOk=!ev||!!(S.env&&S.env[k]&&S.env[k].done);
  if(!dt)return '<div class="c"><b>סיימתם את החודש?</b><div class="hint" style="margin:4px 0 8px">'+(envOk?'אחרי שהזנתם את כל ההכנסות וההוצאות ומילאתם את המעטפות אפשר לסגור את החודש.':'קודם ממלאים וסוגרים את המעטפות, ואז סוגרים את החודש.')+'</div><button class="btn" data-a="md" title="סיום החודש"'+(envOk?'':' disabled')+'>'+ic('lock',18)+'<span>סגירת החודש</span></button></div>';
  var msg=bal>0?'איזה כיף! נשארה לכם יתרה של '+fm(bal)+'. אפשר לקחת אותה לקטגוריה שחשובה לכם, כמו חיסכון, יעד או משהו שרציתם לעצמכם.':bal<0?'יש חריגה של '+fm(-bal)+'. צריך לכסות אותה בתוך החודש הקרוב. אפשר להוסיף לעצמכם משימה בלשונית "משימות ואתגרים".':'יצאתם מאוזנים החודש, כל הכבוד.';
  return '<div class="c" style="border:2px solid '+(bal<0?'var(--bd)':'var(--ok)')+'"><b>סיכום החודש</b><p style="margin:8px 0">'+msg+'</p><div class="f"><button class="btn" data-a="gt" title="הוספת משימה">'+ic('plus',18)+'<span>משימה</span></button></div></div>'}
function tkAll(){var K={tk:'מהמאמנת',ch:'אתגר'},l=INBOX.filter(function(m){return m.k==='tk'||m.k==='ch'}).map(function(m){return{id:m.id,x:m.x,ts:m.ts,due:m.due||'',tag:K[m.k],own:false}}).filter(function(t){return !(S.chd||{})['hid:'+t.id]});
  var mt=S.mt||{};Object.keys(mt).forEach(function(id){l.push({id:id,x:mt[id].x,ts:mt[id].ts,due:'',tag:'שלי',own:true})});return l}
function tkCard(t){var dn=!!S.chd[t.id],od=!dn&&t.due&&new Date(t.due+'T23:59')<new Date();
  return '<div class="tk'+(dn?' dn':'')+'"><button class="tkc" data-a="tkd" data-id="'+esc(t.id)+'" aria-pressed="'+dn+'" aria-label="'+(dn?'ביטול סימון':'סימון כבוצע')+'">'+(dn?'✓':'')+'</button><div class="tkb"><div class="tkx">'+esc(t.x)+'</div><div class="tkm"><span class="chip'+(t.own?' me':t.tag==='אתגר'?' ch':'')+'">'+t.tag+'</span>'+(t.due?'<span class="chip'+(od?' od':'')+'">'+(od?'באיחור · ':'עד ')+new Date(t.due+'T00:00').toLocaleDateString('he-IL',{day:'numeric',month:'short'})+'</span>':'')+'</div></div>'+'<button class="tkx2" data-a="mtd" data-id="'+esc(t.id)+'" aria-label="הסרת משימה">✕</button></div>'}
var CODE='',CUM='';
function cuSummary(){var st=STAGE>=2,i=st?ts('bud','i'):ts('bal','i'),e=st?ex('bud'):ex('bal');return (st?'סיכום התקציב':'סיכום המאזן')+': הכנסות '+fm(i)+', הוצאות '+fm(e)+', יתרה '+fm(i-e)}
function cuUI(){return '<div class="c"><b>עדכון למאמנת</b><p class="hint" style="margin:4px 0 8px">'+(STAGE>=3?'סיימתם את התהליך והמאמנת כבר לא רואה מה אתם עושים כאן. כשתרצו לעדכן אותה או לשאול משהו, כתבו כאן ושלחו.':'המאמנת רואה מה שאתם ממלאים. אפשר גם לשלוח לה הודעה ישירה בכפתור.')+'</p><textarea id="cux" rows="3" style="width:100%" maxlength="1800" placeholder="מה תרצו לעדכן או לשאול?"></textarea><label style="display:flex;gap:8px;align-items:center;font-size:14px;margin-top:6px"><input type="checkbox" id="cuc" style="width:auto"> לצרף סיכום מספרים</label><button class="btn" style="margin-top:8px" data-a="cus">'+ic('send',18)+'<span>שליחה</span></button>'+(CUM?'<div class="hint" style="margin:8px 0 0;color:var(--ok)">'+CUM+'</div>':'')+'</div>'}
function tasksView(){var all=tkAll().sort(function(a,b){return (a.due||'9')<(b.due||'9')?-1:(a.due||'9')>(b.due||'9')?1:b.ts-a.ts}),op=all.filter(function(t){return !S.chd[t.id]}),dn=all.filter(function(t){return S.chd[t.id]}),pc=all.length?Math.round(dn.length/all.length*100):0;
  var msgs=INBOX.filter(function(m){return m.k==='msg'}).sort(function(a,b){return b.ts-a.ts});
  return '<div class="c tkh"><div class="tkt"><b>'+(all.length?(op.length?op.length+' משימות פתוחות':'הכל בוצע, כל הכבוד'):'אין משימות עדיין')+'</b>'+(all.length?'<span>'+dn.length+' מתוך '+all.length+'</span>':'')+'</div>'+(all.length?'<div class="bar"><i class="ok" style="width:'+pc+'%"></i></div>':'')+
   '<div class="tka"><input id="mti" type="text" maxlength="200" placeholder="הוספת משימה לעצמנו" aria-label="משימה חדשה"><button class="btn" data-a="mta" aria-label="הוספה">+</button></div></div>'+
   (op.length?'<div class="tkl">'+op.map(tkCard).join('')+'</div>':'')+
   (dn.length?'<details class="tkd"><summary>בוצעו ('+dn.length+')</summary><div class="tkl">'+dn.map(tkCard).join('')+'</div></details>':'')+
   (msgs.length?'<h3>הודעות מהמאמנת</h3>'+msgs.map(function(m){return '<div class="c tkn"><small>'+new Date(m.ts).toLocaleDateString('he-IL')+'</small><div style="white-space:pre-wrap">'+esc(m.x)+'</div></div>'}).join(''):'')+cuUI()}
function trendUI(){var pts=[],m,k;for(m=1;m<=S.m;m++){k=S.y+'-'+m;var i=ts('act','i',k),e=ex('act',k);if(i>0||e>0)pts.push({m:m,v:i-e})}
  pts=pts.slice(-6);if(pts.length<2)return '';
  var W=320,H=96,mx=Math.max.apply(null,pts.map(function(p){return p.v})),mn=Math.min.apply(null,pts.map(function(p){return p.v})),rg=Math.max(1,mx-mn),
  xy=pts.map(function(p,i){return [W-8-i/(pts.length-1)*(W-16),H-14-((p.v-mn)/rg)*(H-34)]}),
  d=xy.slice().reverse().map(function(q,i){return (i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)}).join(' '),lp=xy[xy.length-1];
  return '<svg class="tr" viewBox="0 0 '+W+' '+H+'" width="100%" height="'+H+'" role="img" aria-label="היתרה החודשית שלכם בחודשים האחרונים"><defs><linearGradient id="trg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F3A5F" stop-opacity=".22"/><stop offset="1" stop-color="#1F3A5F" stop-opacity="0"/></linearGradient></defs><path d="'+d+' L'+W+' '+H+' L0 '+H+'Z" fill="url(#trg)"/><path d="'+d+'" fill="none" stroke="#1F3A5F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="'+lp[0].toFixed(1)+'" cy="'+lp[1].toFixed(1)+'" r="6" fill="#fff" stroke="#1F3A5F" stroke-width="3"/></svg><div class="trl">'+pts.map(function(p){return '<span>'+MN[p.m-1].slice(0,3)+'</span>'}).join('')+'</div>'}
function actList(){var rows=G.filter(function(g){return g.t!=='i'&&gs('act',g)>0}).sort(function(a,b){return gs('act',b)-gs('act',a)}).slice(0,6);
  if(!rows.length)return '';
  return '<div class="sh"><h2>'+ic('card',20)+' הוצאות החודש</h2><button class="lnk" data-a="tab" data-id="mon">לכל הדיווח</button></div><div class="c actl">'+rows.map(function(g){var a=gs('act',g),b=gs('bud',g),p=b?Math.min(100,Math.round(a/b*100)):0;return '<div class="ar">'+gic(g.n)+'<div class="am"><div class="an">'+esc(g.n)+'</div>'+(b?'<div class="ab"><i class="'+(a>b?'o':'')+'" style="width:'+p+'%"></i></div>':'')+'</div><div class="aa'+(b&&a>b?' neg':'')+'">'+fm(a)+(b?'<small>מתוך '+fm(b)+'</small>':'')+'</div></div>'}).join('')+'</div>'}
function meUI(){var sd=Math.min(28,Math.max(1,n(S.sd)||1)),P=perNow(sd),o='',i;for(i=1;i<=28;i++)o+='<option value="'+i+'"'+(i===sd?' selected':'')+'>'+i+'</option>';
  var nx=P.m===12?1:P.m+1,ex2=sd===1?'החודש אצלכם מתחיל ב-1 לחודש, כמו בלוח השנה.':'עד ה-'+(sd-1)+' בחודש מוצג החודש הקודם שמילאתם, ומה-'+sd+' בחודש מוצג החודש החדש.';
  return '<div class="c"><b>תחילת החודש שלכם</b><p class="hint">באיזה תאריך מתחיל אצלכם החודש הכלכלי, למשל יום קבלת המשכורת. החודש המוצג בכל האתר מתעדכן לפי זה.</p><div class="f"><label for="sdd">החודש שלי מתחיל ב-</label><select id="sdd" style="max-width:90px">'+o+'</select><span>לחודש</span></div><p class="hint" style="margin:8px 0 0">'+ex2+' כרגע מוצג: <b>'+MN[P.m-1]+' '+P.y+'</b>. ב-'+sd+'/'+nx+' יוצג '+MN[nx-1]+'.</p></div>'+
  '<div class="c"><b>פרטי קשר</b><p class="hint">משמשים לשחזור הסיסמה אם תשכחו אותה, ולקשר עם המאמנת.</p><div class="f" style="flex-direction:column;align-items:stretch;gap:8px"><input data-s="prof" data-k="n1" value="'+esc(PROF.n1||'')+'" placeholder="שם בן הזוג" maxlength="80" aria-label="שם בן הזוג"><input data-s="prof" data-k="n2" value="'+esc(PROF.n2||'')+'" placeholder="שם בת הזוג" maxlength="80" aria-label="שם בת הזוג"><input data-s="prof" data-k="ph" type="tel" inputmode="tel" value="'+esc(PROF.ph||'')+'" placeholder="טלפון נייד" maxlength="30" aria-label="טלפון"><input data-s="prof" data-k="em" type="email" inputmode="email" value="'+esc(PROF.em||'')+'" placeholder="כתובת מייל" maxlength="80" aria-label="מייל"></div><div class="hint" id="pfr" style="margin:6px 0 0"></div></div>'+
  '<div class="c"><b>סיסמה</b><p class="hint">'+(PWSET?'בחרתם סיסמה אישית. היא לא מוצגת באתר, ואף אחד לא יכול לראות אותה.':'הסיסמה הראשונית נשלחה אליכם מהמאמנת. מומלץ להחליף אותה עכשיו לסיסמה אישית, ומאותו רגע היא לא תוצג בשום מקום.')+' אם תשכחו אותה, יש בדף הכניסה "שכחתי את הסיסמה".</p><div class="f" style="flex-direction:column;align-items:stretch;gap:8px"><input id="pw1" type="password" autocomplete="new-password" placeholder="סיסמה חדשה (6 עד 40 תווים)" maxlength="40" aria-label="סיסמה חדשה"><input id="pw2" type="password" autocomplete="new-password" placeholder="הקלידו שוב את הסיסמה החדשה" maxlength="40" aria-label="אימות סיסמה"><button class="btn" data-a="pws">החלפת סיסמה</button></div><div class="hint" id="ccr" style="margin:8px 0 0"></div></div>'+
  '<div class="c"><b>מכשירים מחוברים</b><p class="hint">אם איבדתם מכשיר או שיתפתם את הקישור, אפשר לנתק את כל המכשירים האחרים. המכשיר הזה יישאר מחובר.</p><button class="btn sec" data-a="dvc">ניתוק מכשירים אחרים</button></div>'}
function autoInc(){if(STAGE<2||ADM)return false;var P=perNow(S.sd);if(S.y!==P.y||S.m!==P.m)return false;var k=ym();S.aic=S.aic||{};if(S.aic[k])return false;S.aic[k]=1;var B=S.bud0||S.bud||{},s=S.act[k]=S.act[k]||{};G.forEach(function(g){if(g.t!=='i')return;its(g).forEach(function(i){var key=g.n+'|'+i,b=n(B[key]);if(b>0&&s[key]===undefined)s[key]=b})});return true}
function heroUI(ai,ae,pi,pe,cT,hasCash){var cv=ai-ae,pe1=pe>0?Math.min(1,ae/pe):0,pi1=pi>0?Math.min(1,ai/pi):0,C1=2*Math.PI*80,C2=2*Math.PI*58;
  var ring='<svg viewBox="0 0 190 190" width="190" height="190" role="img" aria-label="הוצאות '+Math.round(pe1*100)+' אחוז מהצפוי, הכנסות '+Math.round(pi1*100)+' אחוז מהצפוי"><circle cx="95" cy="95" r="80" fill="none" stroke="#EEF1F7" stroke-width="16"/><circle cx="95" cy="95" r="80" fill="none" stroke="'+(pe>0&&ae>pe?'#8C3B3B':'#1F3A5F')+'" stroke-width="16" stroke-linecap="round" stroke-dasharray="'+(pe1*C1).toFixed(1)+' '+C1.toFixed(1)+'" transform="rotate(-90 95 95)"/><circle cx="95" cy="95" r="58" fill="none" stroke="#EEF1F7" stroke-width="10"/><circle cx="95" cy="95" r="58" fill="none" stroke="#C9A23F" stroke-width="10" stroke-linecap="round" stroke-dasharray="'+(pi1*C2).toFixed(1)+' '+C2.toFixed(1)+'" transform="rotate(-90 95 95)"/><text x="95" y="90" text-anchor="middle" font-size="12" fill="#6B778C">נשאר החודש</text><text x="95" y="116" text-anchor="middle" font-size="26" font-weight="800" fill="'+(cv<0?'#8C3B3B':'#1B2A41')+'">'+fm(cv)+'</text></svg>';
  return '<div class="hero2 hr1"><div class="hm2">'+MN[S.m-1]+' '+S.y+' · משפחת '+esc(S.fam)+'</div>'+ring+'<div class="lgd"><span><i style="background:#1F3A5F"></i>הוצאות'+(pe>0?' '+Math.round(pe1*100)+'% מהצפוי':'')+'</span><span><i style="background:#C9A23F"></i>הכנסות'+(pi>0?' '+Math.round(pi1*100)+'% מהצפוי':'')+'</span></div></div>'+
  '<div class="sg2"><div class="sk"><small>הכנסות צפויות החודש</small><b>'+fm(pi)+'</b></div><div class="sk"><small>הכנסות שהתקבלו</small><b class="pos">'+fm(ai)+'</b></div><div class="sk"><small>הוצאות החודש</small><b'+(pe>0&&ae>pe?' class="neg"':'')+'>'+fm(ae)+'</b>'+(pe>0?'<small>מתוך '+fm(pe)+'</small>':'')+'</div>'+(hasCash?'<div class="sk"><small>מזומן למשיכה</small><b>'+fm(cT)+'</b><button class="lnk" data-a="tab" data-id="mon">לפירוט במעקב</button></div>':'')+'</div>'}
function homeSum(){var sv=tot('sv'),pn=tot('pn'),lb=tot('ln',function(x){return !isMg(x)}),lp=sm('ln','p',function(x){return !isMg(x)}),mb=tot('ln',isMg),mp=sm('ln','p',isMg),pv=sm('ln','w',isMg),t=[],c=function(v){return 'כ-'+fm(v)};
  if(sv)t.push(['שווי חסכונות (משוער)',c(sv),'']);if(pn)t.push(['שווי פנסיה (משוער)',c(pn),'']);
  if(lb)t.push(['יתרת הלוואות (משוער)',c(lb),'']);if(lp)t.push(['החזר חודשי על הלוואות',fm(lp),'']);
  if(mb)t.push(['יתרת משכנתא (משוער)',c(mb),pv?'מתוך שווי נכס '+fm(pv):'']);if(mp)t.push(['החזר חודשי על משכנתא',fm(mp),'']);
  if(!t.length)return '';
  return '<div class="sh"><h2>'+ic('sv',20)+' תמונת מצב</h2><button class="lnk" data-a="tab" data-id="sv">לפירוט ועדכון</button></div><div class="sg2">'+t.map(function(x){return '<div class="sk"><small>'+x[0]+'</small><b>'+x[1]+'</b>'+(x[2]?'<small>'+x[2]+'</small>':'')+'</div>'}).join('')+'</div>'}
function curK(){var P=perNow(S.sd);return P.y+'-'+P.m}
function mel(u){if(!u)return 0;var a=String(u).split('-'),P=perNow(S.sd);return Math.max(0,(P.y*12+P.m)-(+a[0]*12+ +a[1]))}
function estV(x){var e=mel(x.u),v=n(x.v),m=n(x.m),i=Math.pow(1+n(x.r)/100,1/12)-1,j;for(j=0;j<e;j++)v=v*(1+i)+m;return v}
function estB(x){var e=mel(x.u),b=n(x.b),p=n(x.p),i=Math.pow(1+n(x.r)/100,1/12)-1,j;for(j=0;j<e&&b>0;j++)b=Math.max(0,b*(1+i)-p);return b}
function estC(x){return Math.max(0,n(x.c)-mel(x.u))}
function isMg(x){return x.y==='משכנתא'}
function tot(l,fn){return S.L[l].filter(fn||function(){return true}).reduce(function(a,x){return a+(l==='ln'?estB(x):estV(x))},0)}
function touchU(l,x,f){if(((l==='sv'||l==='pn')&&f==='v')||(l==='ln'&&f==='b'))x.u=curK()}
function stampU(){var ch=false;['sv','pn','ln'].forEach(function(l){(S.L[l]||[]).forEach(function(x){if(!x.u&&(l==='ln'?n(x.b):n(x.v))){x.u=curK();ch=true}})});return ch}
function nwParts(){var a=tot('sv')+tot('pn')+sm('ln','w',isMg),li=tot('ln');return{a:a,l:li,v:a-li}}
function snapNw(){var p=nwParts();if(!p.a&&!p.l)return false;S.nw=S.nw||{};var k=curK(),v=Math.round(p.v);if(S.nw[k]===v)return false;S.nw[k]=v;return true}
function uTxt(u){var a=String(u||'').split('-');return a.length===2?a[1]+'/'+a[0]:''}
function estLine(l,x){var T='<span class="est">משוער</span> ',N=' לסכום האמיתי היכנסו לאזור האישי שלכם בבנק או בגוף המנהל.',u=mel(x.u)>0;
  if(l==='ln'){if(!n(x.b))return '';return '<small>'+T+(u?'יתרה היום '+fm(estB(x))+(n(x.c)?' · נותרו כ-'+estC(x)+' חודשים':'')+' (נכון לעדכון מ-'+uTxt(x.u)+').':'היתרה שהוזנה היא הערכה.')+N+'</small>'}
  if(l==='sv'||l==='pn')return n(x.v)?'<small>'+T+(u?'שווי היום '+fm(estV(x))+' (נכון לעדכון מ-'+uTxt(x.u)+').':'הסכום שהוזן הוא הערכה.')+N+'</small>':'';
  return ''}
function insLine(l,x){var t=[],r=n(x.r);
  if(l==='sv'||l==='pn'){if(!String(x.iv||'').trim())t.push('כדאי לציין איפה הכסף מושקע, כדי שיהיה ברור אם הוא עובד בשבילכם.');
    if(l==='pn')t.push('כדאי לבדוק דמי ניהול ומסלול השקעה אחת לשנה.');
    if(l==='sv'&&n(x.v)&&r>0&&r<1.5&&x.q!=='נזיל מיידית')t.push('תשואה נמוכה לכסף שאינו צריך נזילות מיידית. כדאי לבדוק חלופות.')}
  if(l==='ln'){if(!r&&n(x.b))t.push('כדאי להזין ריבית, כדי לדעת כמה ההלוואה עולה לכם.');else if(r>=6)t.push('ריבית של '+r+'%. כדאי לבדוק הצעה למחזור או לאיחוד.');if(x.y==='משכנתא'&&n(x.b))t.push('בתיק משכנתא כדאי לבדוק מחזור פעם בכמה שנים.')}
  if(l==='ins'){var g=gm(x.r);if(g!=null&&g>=0&&g<=2)t.push('החידוש בעוד '+g+' חודשים. זה זמן טוב להשוות מחיר.');else t.push('פעם בשנה כדאי לבדוק כפל כיסויים ולהשוות מחיר.')}
  return t.length?'<div class="insl">'+t.map(function(z){return '<div>'+esc(z)+'</div>'}).join('')+'</div>':''}
function phase(){var P=perNow(S.sd);if(S.y!==P.y||S.m!==P.m)return 'view';var d=new Date(),dy=Math.min(28,Math.max(1,n(S.sd)||1)),st=new Date(P.y,P.m-1,dy),nx=new Date(P.y,P.m,dy),el=Math.floor((d-st)/864e5),left=Math.ceil((nx-d)/864e5);return el<5?'start':left<=5?'end':'mid'}
function dLeft(){var P=perNow(S.sd),dy=Math.min(28,Math.max(1,n(S.sd)||1));return Math.max(0,Math.ceil((new Date(P.y,P.m,dy)-new Date())/864e5))}
function spark(pts,id,aria){var W=320,H=90;if(pts.length<2)return '';var mx=Math.max.apply(null,pts.map(function(p){return p.v})),mn=Math.min.apply(null,pts.map(function(p){return p.v})),rg=Math.max(1,mx-mn),
  xy=pts.map(function(p,i){return [W-8-i/(pts.length-1)*(W-16),H-14-((p.v-mn)/rg)*(H-34)]}),d=xy.slice().reverse().map(function(q,i){return (i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)}).join(' '),lp=xy[xy.length-1];
  return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" height="'+H+'" role="img" aria-label="'+aria+'" class="tr"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F6F50" stop-opacity=".25"/><stop offset="1" stop-color="#1F6F50" stop-opacity="0"/></linearGradient></defs><path d="'+d+' L'+W+' '+H+' L0 '+H+'Z" fill="url(#'+id+')"/><path d="'+d+'" fill="none" stroke="#1F6F50" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="'+lp[0].toFixed(1)+'" cy="'+lp[1].toFixed(1)+'" r="6" fill="#fff" stroke="#1F6F50" stroke-width="3"/></svg><div class="trl">'+pts.map(function(p){return '<span>'+MN[p.m-1].slice(0,3)+'</span>'}).join('')+'</div>'}
function nwUI(){var p=nwParts();if(!p.a&&!p.l)return '';var ks=Object.keys(S.nw||{}).sort(function(a,b){var x=a.split('-'),y=b.split('-');return (+x[0]*12+ +x[1])-(+y[0]*12+ +y[1])}).slice(-6),pts=ks.map(function(k){return{v:S.nw[k],m:+k.split('-')[1]}});
  return '<div class="hero2 nwc"><div class="hm2">שווי נקי (משוער)</div><div class="hb2" style="font-size:30px'+(p.v<0?';color:#8C3B3B':'')+'">כ-'+fm(p.v)+'</div><div class="h2s"><span>נכסים <b>'+fm(p.a)+'</b></span><span>התחייבויות <b>'+fm(p.l)+'</b></span></div>'+spark(pts,'nwg','השווי הנקי בחודשים האחרונים')+'<div class="hm2" style="margin-top:8px">ההערכה לפי ההפקדות וההחזרים החודשיים ואינה סכום מדויק. לסכום המדויק היכנסו לאזור האישי שלכם בבנק או בגוף המנהל. <button class="lnk" data-a="tab" data-id="sv">עדכון יתרות מהבנק</button></div></div>'}
function yrkDue(){if(STAGE<2||ADM)return false;var t=n((S.chd||{}).yrk);return !(t&&Date.now()-t<365*864e5)}
function autoYr(){if(!yrkDue())return false;var k='yk'+new Date().getFullYear();S.mt=S.mt||{};if(S.mt[k]||(S.chd||{})[k])return false;S.mt[k]={x:'בדיקה שנתית: לבדוק ביטוחים, חסכונות ודמי ניהול',ts:Date.now()};return true}
function yrkUI(){if(STAGE<2)return '';var t=n((S.chd||{}).yrk);if(t&&Date.now()-t<365*864e5)return '';return '<div class="nw"><b>הגיע הזמן לבדיקה שנתית</b><div class="nwi">פעם בשנה כדאי לבדוק את הביטוחים, החסכונות ודמי הניהול: האם יש כפל, האם המחיר עדיין הוגן, והאם הכסף עובד בשבילכם. אפשר לבקש הצעות מחיר ולהתייעץ עם המאמנת.</div><div class="f"><button class="btn" data-a="yrk">'+ic('check',18)+'<span>בדקנו</span></button><button class="btn sec" data-a="tab" data-id="tasks">'+ic('plus',18)+'<span>משימה</span></button></div></div>'}
function staleUI(){var s=false;['sv','pn','ln'].forEach(function(l){(S.L[l]||[]).forEach(function(x){if(mel(x.u)>=3)s=true})});return s?'<div class="nw"><b>הגיע הזמן לעדכן יתרות</b><div class="nwi">עברו כמה חודשים מעדכון החסכונות וההלוואות. כמה דקות מול האפליקציה של הבנק, וההערכה חוזרת להיות מדויקת.</div><div class="f"><button class="btn" data-a="tab" data-id="sv">'+ic('nxt',18)+'<span>עדכון יתרות</span></button></div></div>':''}
function planUI(ph,pi,pe,cT,hasCash){var st=ph==='start',pl=pi-pe,left=dLeft();
  return '<div class="hero2 plan"><div class="hm2">'+MN[S.m-1]+' '+S.y+' · משפחת '+esc(S.fam)+'</div><div class="hb2" style="font-size:26px">'+(st?'פותחים את החודש':'התוכנית של החודש')+'</div><div class="hm2" style="margin-top:6px;line-height:1.5">'+(st?'כמה צעדים קצרים והחודש מתחיל בביטחון: מושכים מזומן למעטפות ועוברים על התקציב.':'אין צורך לדווח עכשיו. בעוד '+left+' ימים סוגרים את החודש.')+'</div><div class="f" style="margin-top:12px;flex-wrap:wrap">'+(st&&hasCash?'<button class="btn" data-a="gocash">משיכת מזומן ומילוי מעטפות</button>':'')+'<button class="btn'+(st&&hasCash?' sec':'')+'" data-a="tab" data-id="bud">'+ic('nxt',18)+'<span>תקציב</span></button></div></div>'+
  '<div class="sg2"><div class="sk"><small>הכנסות צפויות החודש</small><b>'+fm(pi)+'</b></div><div class="sk"><small>הוצאות מתוכננות</small><b>'+fm(pe)+'</b></div><div class="sk"><small>יתרה מתוכננת</small><b class="'+(pl<0?'neg':'pos')+'">'+fm(pl)+'</b></div>'+(hasCash?'<div class="sk"><small>מזומן למשיכה</small><b>'+fm(cT)+'</b></div>':'')+'</div>'}
function endUI(){if((S.md||{})[ym()])return '';return '<div class="hero2 plan"><div class="hb2" style="font-size:24px">סוגרים את החודש</div><div class="hm2" style="margin-top:6px;line-height:1.5">נשארו '+dLeft()+' ימים. מדווחים הוצאות בפועל, מאשרים שההכנסות נכונות וסוגרים מעטפות.</div><div class="f" style="margin-top:12px"><button class="btn" data-a="tab" data-id="mon">'+ic('nxt',18)+'<span>מעקב חודשי</span></button></div></div>'}
function monBar(){var P=perNow(S.sd),cur=S.y===P.y&&S.m===P.m;return '<div class="mb'+(cur?'':' offm')+'"><button class="mbb" data-a="mpv" aria-label="חודש קודם">→</button><div class="mbt"><div class="mbn">'+MN[S.m-1]+' '+S.y+'</div><div class="mbs'+(cur?'':' off')+'">'+(cur?'החודש הנוכחי':'<button class="lnk" data-a="mcu">חזרה לחודש הנוכחי</button>')+'</div></div><button class="mbb" data-a="mnx" aria-label="חודש הבא">←</button></div>'}
function rmUI(){if(STAGE<2||phase()!=='end')return '';var k='rm5'+ym();if((S.chd||{})[k])return '';var d=dLeft();return '<div class="c rl2"><b>'+(d>1?'נשארו '+d+' ימים לסגירת החודש':'מחר סוגרים את החודש')+'</b><div class="hint" style="margin:4px 0 8px">זה הזמן להתחיל להתכונן: לאסוף חיובי אשראי וחשבונות שהגיעו, ולבדוק שהוראות הקבע נכנסו. אין צורך לעשות הכול עכשיו.</div><button class="btn sec" data-a="rmd">'+ic('check',18)+'<span>הבנתי</span></button></div>'}
function newsUI(){var sn=n(S.sn),lim=Date.now()-14*864e5,l=INBOX.filter(function(m){return m.ts>sn&&m.ts>lim}).sort(function(a,b){return b.ts-a.ts});if(!l.length)return '';
  var K={msg:'הודעה חדשה מהמאמנת',tk:'משימה חדשה מהמאמנת',ch:'אתגר חדש מהמאמנת'};
  return '<div class="nw" role="status"><b>'+(l.length===1?K[l[0].k]||'הודעה חדשה מהמאמנת':l.length+' עדכונים חדשים מהמאמנת')+'</b>'+l.slice(0,3).map(function(m){return '<div class="nwi">'+esc(m.x)+'</div>'}).join('')+'<div class="f"><button class="btn" data-a="nsn">'+ic('check',18)+'<span>קראתי</span></button>'+(l.some(function(m){return m.k!=='msg'})?'<button class="btn sec" data-a="tab" data-id="tasks">'+ic('nxt',18)+'<span>משימות</span></button>':'')+'</div></div>'}

var MIND=[
['קודם מבינים איפה אנחנו, ורק אחר כך מחליטים. אין כאן אשמים, יש נתונים.','הוצאה שחשובה לכם באמת היא לא בזבוז. מקצצים קודם במה שלא מורגש.','כסף בלי תפקיד נעלם. כשלכל שקל יש מקום, הוא כבר לא נעלם.'],
['התקציב הוא הסכמה בין שניכם, לא עונש.','כל הוצאה קבועה נבדקת פעם בחודש, בלי הפתעות ובלי התנצלויות.','פער שלילי הוא מידע. סוגרים אותו תוך 30 יום ונרגעים.'],
['מעטפה ריקה בסוף החודש היא סימן שהתכנון עובד, לא כישלון.','כסף שנשאר במעטפה נשמר לחודשים הבאים ולא עובר לסעיף אחר.','כשנכנס כסף חדש, 70% מיועד לעתיד ו-30% להנאה.'],
['הרגל נבנה מחזרה. ישיבה חודשית אחת קצרה שומרת על הכל.','אתם כבר יודעים איפה הכסף שלכם. עכשיו הוא עובד בשבילכם.']];
function phIdx(){return STAGE>=3?3:STAGE>=2?2:(n(S.dn)?1:0)}
function mindUI(){var i=phIdx(),l=MIND[i],d=new Date(),x=Math.floor((d-new Date(d.getFullYear(),0,0))/864e5);return '<div class="mnd">'+esc(l[x%l.length])+'</div>'}
var PRE=['דפי חשבון בנק של שלושת החודשים האחרונים','פירוט כרטיסי האשראי','פירוט הלוואות ומשכנתא: יתרה, ריבית ותאריך סיום','דוחות חסכונות, פנסיה וביטוחים','רשימת יעדים: מה, כמה עולה ועד מתי'];
var MTG=['עברנו על כל החשבונות שהגיעו והזנו את ההוצאה בפועל','השווינו לתקציב ומצאנו את הפער','משכנו מזומן וחילקנו למעטפות','פער שלילי? קבענו איך סוגרים אותו תוך 30 יום'];
function chkRow(id,t){var dn=!!S.chd[id];return '<button class="stp" data-a="tkd" data-id="'+id+'"><span><b>'+esc(t)+'</b></span><span class="ck'+(dn?' ok':'')+'">'+(dn?'✓':'')+'</span></button>'}
function mtgUI(){var mk='mt'+ym()+'_';return '<div class="c jr"><b>ישיבת התקציב החודשית</b><div class="hint" style="margin:4px 0 0">מומלץ לקיים אותה ב-'+Math.min(28,Math.max(1,n(S.sd)||1))+' לחודש, אחרי שהגיעו כל החשבונות.</div>'+MTG.map(function(t,k){return chkRow(mk+k,t)}).join('')+'</div>'}
function journeyUI(){var i=phIdx();if(STAGE>=3||(STAGE===2&&n((S.cs||{}).mtg)>=6))return '';var L=['הכנה ומאזן','בניית התקציב','מעקב חודשי','עצמאות'],h='<div class="c jr"><b>איפה אנחנו בתהליך</b><div class="jt">'+L.map(function(t,k){return '<span class="'+(k<i?'dn':k===i?'on':'')+'"><i>'+(k<i?'✓':k+1)+'</i>'+t+'</span>'}).join('')+'</div>'+mindUI();
 if(i===0)h+='<details class="jd"'+(Object.keys(S.bal||{}).length?'':' open')+'><summary>לקראת המפגש: מה כדאי להכין</summary>'+PRE.map(function(t,k){return chkRow('pre'+k,t)}).join('')+'</details>';
 if(i===1)h+='<div class="hint" style="margin:10px 0 0">המאמנת בונה עכשיו את התקציב. עד אז אפשר להשלים חסרים במאזן.</div>';
 return h+'</div>'}
function r37UI(){var ai=ts('act','i'),pi=ts('bud','i'),ex2=pi>0&&ai>pi?ai-pi:0;return '<details class="c jd2"><summary><b>נכנס כסף חדש?</b></summary><div class="hint" style="margin:6px 0">הכנסה חד-פעמית עד 10,000 ₪, עליית שכר או הלוואה שנסגרה: 70% הולכים לחיסכון ו-30% להעלאת רמת החיים.'+(ex2?' החודש נכנסו '+fm(ex2)+' מעל התקציב. לפי הכלל: '+fm(ex2*.7)+' לחיסכון ו-'+fm(ex2*.3)+' להנאה.':'')+'</div><div class="f"><input id="r37" type="number" inputmode="decimal" min="0" placeholder="סכום בשקלים"><button class="btn" data-a="r37">'+ic('check',18)+'<span>חישוב</span></button></div><div id="r37o" class="hint" style="margin-top:8px"></div></details>'}
function home(){
  var ai=ts('act','i'),ae=ex('act'),pi=ts('bud','i'),pe=ex('bud'),bi=ts('bal','i'),be=ex('bal'),over=[],near=[],st2=STAGE>=2;
  if(st2)G.forEach(function(g){if(g.t==='i')return;var a=gs('act',g),b=gs('bud',g);if(b&&a>b)over.push(g.n+' · חריגה של '+fm(a-b));else if(b&&a>=.85*b)near.push(g.n+' · '+Math.round(a/b*100)+'% מהתקציב')});
  var steps=st2?[]:[['bal','מעבר למאזן','מילוי המאזן, החסכונות, ההלוואות והביטוחים, ולחיצה על "הושלם"',!!n(S.dn)]];
  if(st2)steps.push(['bud','מעבר לתקציב','התקציב שנקבע עבורכם',pe>0],['mon','מעבר למעקב החודשי','דיווח הכנסות והוצאות בפועל',ai>0||ae>0]);
  var done=steps.filter(function(s){return s[3]}).length;
  var pk=(S.m===1?(S.y-1)+'-12':S.y+'-'+(S.m-1)),pv=ts('act','i',pk)-ex('act',pk),cv=ai-ae,dl=(ts('act','i',pk)>0||ex('act',pk)>0)?cv-pv:null;
   var ev0=st2?envKs():[],cT=0;ev0.forEach(function(x){cT+=n(S.bud[x.k])});
   var ph=st2?phase():'';
   var h=st2?trendUI()+pmChart()+goalsUI()+homeSum():'<div class="hero2"><div class="hm2">'+MN[S.m-1]+' '+S.y+'</div><div class="hb2" style="font-size:26px">שלום משפחת '+esc(S.fam)+'</div>'+(bi>0||be>0?'<div class="h2s"><span>הכנסות חודשיות <b>'+fm(bi)+'</b></span><span>הוצאות חודשיות <b>'+fm(be)+'</b></span><span>יתרה <b>'+fm(bi-be)+'</b></span></div>':'<div class="hm2" style="margin-top:6px">מתחילים במילוי המאזן. הכל נשמר אוטומטית.</div>')+'</div>';
  h=greet()+remUI()+newsUI()+rmUI()+h;
  h+=journeyUI();
  if(st2)h+=yrkUI();
  if(st2&&ph==='start')h+=mtgUI();
  if(!st2&&done<steps.length)h+='<div class="c"><b>'+(st2?'לאן עוברים':'הצעדים שלכם')+'</b>'+steps.map(function(s){return '<button class="stp" data-a="tab" data-id="'+s[0]+'"><span><b>'+s[1]+'</b><small>'+s[2]+'</small></span><span class="ck'+(s[3]?' ok':'')+'">'+(s[3]?'✓':'')+'</span></button>'}).join('')+'</div>';
  if(st2)h+=rptUI()+svChUI()+lnEndUI()+creditUI()+tipsUI();
  if(!n(S.dn))h+=doneUI();
  if(!st2){
    h+=be>0||bi>0?'<div class="g">'+tile(fm(bi),'הכנסות חודשיות')+tile(fm(be),'הוצאות חודשיות')+tile(fm(bi-be),'יתרה חודשית',bi-be<0?'neg':'')+'</div><div class="c">תודה על מילוי המאזן. המאמנת תבנה עבורכם את התקציב, ותעדכן אתכם כאן.</div>':'<div class="c">התחילו במילוי המאזן: הזינו את ההכנסות וההוצאות החודשיות הממוצעות שלכם.</div>'}
  if(st2)h+=staleUI();
  var ms=INBOX.filter(function(m){return m.k==='msg'}).sort(function(a,b){return b.ts-a.ts}).slice(0,3),ot=openTk();
  if(ot)h+='<div class="c"><b>יש לכם '+ot+' משימות ואתגרים פתוחים</b><div style="margin-top:8px"><button class="btn" data-a="tab" data-id="tasks">'+ic('nxt',18)+'<span>לצפייה</span></button></div></div>';
  if(ms.length)h+='<div class="c"><b>מהמאמנת</b>'+ms.map(function(m){return '<div class="it"><small>הודעה · '+new Date(m.ts).toLocaleDateString('he-IL')+'</small><div style="white-space:pre-wrap">'+esc(m.x)+'</div></div>'}).join('')+'</div>';
  if(st2||STAGE>=3)h+=cuUI();
  return h}

try{bG()}catch(e){}

/* UX: קיפול הסברים ארוכים, כפתור + צף ותגיות מצב */
function hintFold(root){if(!root||(window.TX&&TX.open))return;Array.prototype.forEach.call(root.querySelectorAll('.hint'),function(h){
  if(h.dataset.hf||h.closest('.tcard,.otf,.hq,.fab,.dz')||h.querySelector('input,button,select,textarea,a'))return;h.dataset.hf='1';
  if((h.textContent||'').length<80)return;h.classList.add('hfold');var b=document.createElement('button');b.type='button';b.className='hq';b.setAttribute('aria-label','הסבר');b.textContent='?';b.dataset.hq='1';
  h.parentNode.insertBefore(b,h)})}
function fabUI(){if(typeof ADM!=='undefined'&&ADM)return '';var it=[];
  if(STAGE>=2){if(!n((S.md||{})[ym()]))it.push(['mon','העלאת קבצים וסיווג','tx']);it.push(['mon','דיווח חודשי','']);}
  else it.push(['bal','העלאת קבצים למאזן','txb']);
  it.push(['tasks','משימה חדשה','task']);
  return '<div class="fab" id="fab"><div class="fabm" hidden>'+it.map(function(x){return '<button type="button" data-fab="'+x[0]+'" data-fx="'+x[2]+'">'+x[1]+'</button>'}).join('')+'</div><button type="button" class="fabb" data-fabt="1" aria-label="הוספה">+</button></div>'}
document.addEventListener('click',function(e){var mi=e.target.closest&&e.target.closest('.mi');Array.prototype.forEach.call(document.querySelectorAll('.mi.on'),function(x){if(x!==mi)x.classList.remove('on')});if(mi){mi.classList.toggle('on');return}var q=e.target.closest&&e.target.closest('[data-hq]');
  if(q){var h=q.nextElementSibling;if(h){h.classList.toggle('hopen');q.classList.toggle('on')}return}
  var ft=e.target.closest&&e.target.closest('[data-fabt]'),fm2=document.querySelector('.fabm');
  if(ft&&fm2){fm2.hidden=!fm2.hidden;return}
  var fa=e.target.closest&&e.target.closest('[data-fab]');
  if(fa){if(fm2)fm2.hidden=true;S.tab=fa.dataset.fab;if(window.TX){TX.open=false;TX.bal=false;if(fa.dataset.fx==='tx'){TX.open=true;TX.step=1;TX.err=''}else if(fa.dataset.fx==='txb'){TX.open=true;TX.bal=true;TX.step=1;TX.err=''}}
    if(typeof render==='function')render();window.scrollTo(0,0);if(fa.dataset.fx==='task')setTimeout(function(){var i=document.getElementById('mti');if(i)i.focus()},50);return}
  if(fm2&&!fm2.hidden&&!(e.target.closest&&e.target.closest('.fab')))fm2.hidden=true},true);

var MU={};
function isLocked(k){return !!n((S.md||{})[k])}
function lockBtn(k){var ev=envKs().length>0,ok=!ev||!!(S.env&&S.env[k]&&S.env[k].done);
  return isLocked(k)?'<button class="lkb on" data-a="unl" title="לחיצה לפתיחת החודש" aria-label="פתיחת החודש">'+ic('lock',18)+'<span>נסגר</span></button>':'<button class="lkb" data-a="md" title="'+(ok?'לחיצה לסגירת החודש':'קודם סוגרים את המעטפות')+'" aria-label="סגירת החודש"'+(ok?'':' disabled')+'>'+ic('unlock',18)+'<span>פתוח</span></button>'}
function lockBar(k){if(!n((S.md||{})[k]))return '';
  return '<div class="c lockc"><span class="lki">'+ic('lock',26)+'</span><div style="flex:1"><b>החודש סגור</b><div class="hint" style="margin:2px 0 0">נסגר ב-'+new Date(n(S.md[k])).toLocaleDateString('he-IL')+'. אפשר להוסיף משימות.</div></div><button class="ib" data-a="gt" title="הוספת משימה" aria-label="הוספת משימה">'+ic('plus',22)+'</button></div>'}
var SGI={'i':['inn','הכנסה'],'אשראי':['card','אשראי'],'מזומן':['cash','מזומן'],'הו"ק':['rep','הו"ק לטווח קצר'],'sv':['sv','הו"ק לטווח ארוך']};
function mic(g,i){var sg=segOf(g,i),x=SGI[sg];if(!x)return '';return '<span class="mi" data-tip="'+esc(x[1])+'" title="'+esc(x[1])+'" tabindex="0">'+ic(x[0],16)+'</span>'}
var MF='all',EYE={};
function lockBody(k){var a=st('act'),h='',cnt={all:0,sv:0,ov:0};
  G.forEach(function(g){var inc=g.t==='i',rows=its(g).map(function(i){var kk=g.n+'|'+i,bv=n(S.bud[kk]),av=n(a[kk]),d=inc?av-bv:bv-av;return (bv||av)?{i:i,bv:bv,av:av,d:d}:null}).filter(Boolean);
    rows.forEach(function(r){cnt.all++;if(r.d>0)cnt.sv++;if(r.d<0)cnt.ov++});
    var sh=rows.filter(function(r){return MF==='all'||(MF==='sv'?r.d>0:r.d<0)});if(!sh.length)return;
    var tb=0,ta=0;rows.forEach(function(r){tb+=r.bv;ta+=r.av});var dd=inc?ta-tb:tb-ta;
    h+='<div class="c lkg"><div class="lkh">'+gic(g.n)+'<b>'+esc(g.n)+'</b></div>'+
     sh.map(function(r){var kk=g.n+'|'+r.i,tl=((S.tx||{})[k]||[]).filter(function(t){return t[3]===kk}),nw=(S.nwi||{})[kk]===k;
       return '<div class="lkr" data-q="'+esc(r.i+' '+g.n)+'"><span>'+mic(g,r.i)+' '+esc(r.i)+(nw?' <em class="nwt">חדש</em>':'')+(tl.length?' <button class="eye'+(EYE[kk]?' on':'')+'" data-a="eye" data-k="'+esc(kk)+'" title="העסקאות ('+tl.length+')" aria-label="הצגת העסקאות">'+ic('eye',15)+'</button>':'')+'</span><small>'+fm(r.bv)+'</small><b>'+fm(r.av)+'</b><span class="dp '+(r.d<0?'neg':r.d>0?'pos':'')+'">'+(r.d>0?'+':'')+fm(r.d)+'</span></div>'+
        (EYE[kk]&&tl.length?'<div class="txl">'+tl.map(function(t){return '<div><span>'+esc(t[0])+'</span><span>'+esc(t[1])+'</span><b>'+fm(t[2])+'</b></div>'}).join('')+'</div>':'')}).join('')+
     '<div class="lkr lks"><span>סה"כ</span><small>'+fm(tb)+'</small><b>'+fm(ta)+'</b><span class="dp '+(dd<0?'neg':dd>0?'pos':'')+'">'+(dd>0?'+':'')+fm(dd)+'</span></div></div>'});
  var tabs='<div class="mft">'+[['all','הכל'],['sv','חסכתי'],['ov','חרגתי']].map(function(t){return '<button class="'+(MF===t[0]?'on':'')+'" data-a="mf" data-id="'+t[0]+'">'+t[1]+' <small>('+cnt[t[0]]+')</small></button>'}).join('')+'</div>';
  var tools='<div class="mtl"><label class="mq">'+ic('srch',16)+'<input id="mq" type="search" placeholder="חיפוש בדוח" autocomplete="off"></label><button class="ib sm" data-a="xpdf" title="הדפסה / PDF" aria-label="PDF">'+ic('pdf',18)+'</button><button class="ib sm" data-a="xcsv" title="ייצוא לאקסל" aria-label="אקסל">'+ic('xls',18)+'</button></div>';
  return tools+tabs+'<div class="lkt"><span></span><small>תקציב</small><small>בפועל</small><small>הפרש</small></div>'+(h||'<div class="c"><p class="hint">אין שורות להצגה.</p></div>')+envRO(k)}
function envRO(k){var ks=envKs();if(!ks.length)return '';var e=(S.env||{})[k]||{},L=e.left||{},D=e.d||{},M=e.mv||{};
  var rows=ks.map(function(x){var b=n(S.bud[x.k]),av=b+envCarry(x.k,k),sp=D[x.k]!=null?n(D[x.k]):Math.max(0,av-n(L[x.k])),lf=n(L[x.k]),mv=M[x.k]||'carry',dest=lf>0?(mv==='carry'||envAnn(x.k)?'נשאר במעטפה':mv==='free'?'לא מועבר':'הועבר ל'+((ks.filter(function(y){return y.k===mv})[0]||{}).i||'')):'';
    return '<div class="lkr"><span><span class="mi" data-tip="מזומן" title="מזומן" tabindex="0">'+ic('cash',16)+'</span> '+esc(x.i)+(dest?'<small style="display:block">'+esc(dest)+'</small>':'')+'</span><small>'+fm(av)+'</small><b>'+fm(sp)+'</b><span class="d">'+fm(lf)+'</span></div>'}).join('');
  return '<div class="lkt" style="margin-top:12px"><b style="text-align:right">מעטפות</b><small>זמין</small><small>הוצא</small><small>נשאר</small></div><div class="c lkg">'+(e.done?'':'<p class="hint" style="margin:0 0 6px">המעטפות לא דווחו לפני הסגירה.</p>')+rows+'</div>'}
function closeSum(k){var ai=ts('act','i'),pi=ts('bud','i'),ae=ex('act'),pe=ex('bud'),bal=ai-ae,L=[];
  L.push(['inn','הכנסות: '+fm(ai)+(pi?(ai>=pi?' (מעל התכנון ב-'+fm(ai-pi)+')':' (פחות מהתכנון ב-'+fm(pi-ai)+')'):'')]);
  L.push(['card','הוצאות: '+fm(ae)+(pe?(ae<=pe?' (חסכתם '+fm(pe-ae)+' מהתכנון)':' (חריגה של '+fm(ae-pe)+')'):'')]);
  var ov=G.filter(function(g){return g.t!=='i'&&gs('bud',g)>0&&gs('act',g)>gs('bud',g)}).map(function(g){return{n:g.n,d:gs('act',g)-gs('bud',g)}}).sort(function(a,b){return b.d-a.d}).slice(0,3);
  if(ov.length)L.push(['dot','חרגו: '+ov.map(function(o){return o.n+' ('+fm(o.d)+')'}).join(', ')]);
  var un=G.filter(function(g){return g.t!=='i'&&gs('bud',g)>0&&gs('act',g)<gs('bud',g)}).map(function(g){return{n:g.n,d:gs('bud',g)-gs('act',g)}}).sort(function(a,b){return b.d-a.d}).slice(0,2);
  if(un.length)L.push(['check','הכי טוב: '+un.map(function(o){return o.n+' (נשאר '+fm(o.d)+')'}).join(', ')]);
  var ks=envKs();if(ks.length){var e=(S.env||{})[k]||{},cT=0,sp=0,lf=0,car=0;ks.forEach(function(x){cT+=n(S.bud[x.k]);var l=n((e.left||{})[x.k]);lf+=l;sp+=n((e.d||{})[x.k]);var mv=(e.mv||{})[x.k]||'carry';if(l>0&&mv!=='free')car+=l});
    L.push(['cash','מזומן: תוכנן '+fm(cT)+(n(e.wa)?', נמשך '+fm(n(e.wa)):'')+', הוצא '+fm(sp)]);
    if(n(e.wa)&&n(e.wa)>cT)L.push(['dot','משכתם '+fm(n(e.wa)-cT)+' יותר מהמתוכנן למעטפות']);
    if(lf)L.push(['cash','נשאר במעטפות '+fm(lf)+(car?', מתוכו '+fm(car)+' ממשיך לחודש הבא':'')])}
  var ot=Object.keys(st('act')).filter(function(x){return x.indexOf('|חד-פעמי: ')>0});if(ot.length)L.push(['plus',ot.length+' פריטים חד-פעמיים החודש']);
  var R=[],ex0=pi>0&&ai>pi?ai-pi:0;
  if(ex0)R.push('<div class="csl rl">'+ic('rl',18)+'<span><b>כלל 70-30:</b> הכנסה חריגה של '+fm(ex0)+'. '+fm(ex0*.7)+' לחיסכון ו-'+fm(ex0*.3)+' להעלאת רמת חיים.'+(ex0>10000?' מעל 10,000 ₪ כדאי להתייעץ עם המאמנת.':'')+(S.mt&&S.mt['x37'+k]?' ✓ נוספה משימה':' <button class="lk" data-a="t37" data-v="'+Math.round(ex0*.7)+'">להוסיף משימה</button>')+'</span></div>');
  if(bal<0)R.push('<div class="csl rl">'+ic('rl',18)+'<span><b>פער שלילי</b> סוגרים תוך 30 יום. לא מלווים ממעטפה למעטפה.</span></div>');
  var ek=envKs(),ee=(S.env||{})[k]||{},annL=ek.filter(function(x){return envAnn(x.k)&&n((ee.left||{})[x.k])>0});
  if(annL.length)R.push('<div class="csl rl">'+ic('rl',18)+'<span><b>מעטפות שנתיות</b> ('+annL.map(function(x){return x.i}).join(', ')+'): היתרה נשמרת לשימוש בהמשך השנה ולא מועברת למעטפה אחרת.</span></div>');
  if(bal>0)R.push('<div class="csl rl">'+ic('rl',18)+'<span><b>יתרה חיובית</b> לא נשארת בעו"ש: מעבירים לחיסכון או ליעד שבחרתם.</span></div>');
  var msg=bal>0?'נשארה יתרה של '+fm(bal)+'. כדאי להעביר אותה לחיסכון או ליעד.':bal<0?'יש פער שלילי של '+fm(-bal)+'. צריך לסגור אותו בחודש הקרוב.':'יצאתם מאוזנים, כל הכבוד.';
  return '<div class="c csum" style="border:2px solid '+(bal<0?'var(--bd)':'var(--ok)')+'"><b>סיכום ותובנות</b><div class="csb '+(bal<0?'neg':'')+'">'+fm(bal)+'</div><p class="hint" style="margin:0 0 10px">'+msg+'</p>'+L.map(function(l){return '<div class="csl">'+ic(l[0],18)+'<span>'+esc(l[1])+'</span></div>'}).join('')+(R.length?'<div class="sgh" style="margin-top:12px"><b>כללים רלוונטיים</b></div>'+R.join(''):'')+(S.note[k]?'<div class="sgh" style="margin-top:12px"><b>הערות</b></div><p style="margin:4px 0 0;white-space:pre-line">'+esc(S.note[k])+'</p>':'')+'<div class="f" style="margin-top:14px"><button class="btn" data-a="gt" title="הוספת משימה">'+ic('plus',18)+'<span>משימה</span></button></div></div>'}

document.addEventListener('input',function(e){if(!e.target||e.target.id!=='mq')return;var q=e.target.value.trim();
  Array.prototype.forEach.call(document.querySelectorAll('.lkg'),function(g){var any=false;Array.prototype.forEach.call(g.querySelectorAll('.lkr[data-q]'),function(r){var ok=!q||r.dataset.q.indexOf(q)>=0;r.style.display=ok?'':'none';if(ok)any=true});if(g.querySelector('.lkr[data-q]'))g.style.display=any?'':'none'})});
function xCsv(){var k=ym(),a=st('act'),L=[['קבוצה','סעיף','אמצעי תשלום','תקציב','בפועל','הפרש']];
  G.forEach(function(g){var inc=g.t==='i';its(g).forEach(function(i){var kk=g.n+'|'+i,bv=n(S.bud[kk]),av=n(a[kk]);if(!bv&&!av)return;var x=SGI[segOf(g,i)];L.push([g.n,i,x?x[1]:'',bv,av,inc?av-bv:bv-av])})});
  var ai=ts('act','i'),ae=ex('act');L.push([]);L.push(['סה"כ הכנסות','','','',ai,'']);L.push(['סה"כ הוצאות','','','',ae,'']);L.push(['יתרה','','','',ai-ae,'']);
  var tl=(S.tx||{})[k]||[];if(tl.length){L.push([]);L.push(['תאריך','בית עסק','סכום','סעיף']);tl.forEach(function(t){L.push([t[0],t[1],t[2],(t[3]||'').split('|')[1]||''])})}
  var csv='﻿'+L.map(function(r){return r.map(function(c){c=String(c==null?'':c);return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(',')}).join('\r\n');
  var u=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),l=document.createElement('a');l.href=u;l.download='דוח-'+MN[S.m-1]+'-'+S.y+'.csv';document.body.appendChild(l);l.click();setTimeout(function(){URL.revokeObjectURL(u);l.remove()},500)}

function lastMs(){var P=perNow(S.sd),ms=[],st=n((S.md||{})[P.y+'-'+P.m])?0:1;for(var i=st;i<st+3;i++){var m=P.m-i,y=P.y;while(m<1){m+=12;y--}var k=y+'-'+m,a=S.act[k]||{};ms.push({k:k,m:m,y:y,a:a,has:Object.keys(a).some(function(x){return n(a[x])>0})})}return ms}
function lastMsD(){return lastMs().filter(function(x){return x.has})}
function rptUI(){var ms=lastMsD();
  if(!ms.length)return '';var need=ms.length===1?1:2,out=[];
  G.forEach(function(g){if(g.t==='i')return;its(g).forEach(function(it){var kk=g.n+'|'+it,b=n(S.bud[kk]);if(!b)return;var c=0,sum=0;ms.forEach(function(x){var v=n(x.a[kk]);if(v>b){c++;sum+=v-b}});if(c>=need)out.push({i:it,g:g.n,c:c,av:sum/c})})});
  if(!out.length)return '';out.sort(function(a,b){return b.c-a.c||b.av-a.av});
  return '<div class="c rpt"><div class="rph">'+ic('rep',20)+'<b>חריגות שחוזרות</b></div><div class="hint" data-hf="1" style="margin:4px 0 8px">'+(ms.length===1?'חרגו בחודש האחרון.':'חרגו ב-2 מתוך '+ms.length+' החודשים האחרונים.')+' כדאי לעדכן תקציב או להוריד הוצאה.</div>'+
    out.slice(0,6).map(function(o){return '<div class="rpr"><span>'+esc(o.i)+'<small>'+esc(o.g)+'</small></span><em>'+o.c+'/'+ms.length+'</em><span class="dp neg">+'+fm(o.av)+'</span></div>'}).join('')+
    (out.length>6?'<p class="hint" style="margin:6px 0 0">ועוד '+(out.length-6)+' סעיפים.</p>':'')+'<div class="f"><button class="btn sec" data-a="tab" data-id="bud" title="מעבר לתקציב">'+ic('bud',18)+'<span>לתקציב</span></button></div></div>'}

function mSum(k){var i=0,e=0;G.forEach(function(g){its(g).forEach(function(it){var v=n((S.act[k]||{})[g.n+'|'+it]);if(g.t==='i')i+=v;else if(segOf(g,it)!=='sv')e+=v})});return{i:i,e:e}}
function trendUI(){var ms0=lastMs().slice().reverse(),ms=ms0.filter(function(x){return x.has});
  if(!ms.length)return '<div class="c"><div class="rph" style="color:#1F3A5F">'+ic('trend',20)+'<b>מגמות</b></div><div class="hint" data-hf="1" style="margin:6px 0 0">אחרי שתסגרו את החודש הראשון יופיעו כאן מגמות של 3 החודשים האחרונים.</div></div>';
  var d=ms.map(function(x){var t=mSum(x.k);return{l:MN[x.m-1],i:t.i,e:t.e,b:t.i-t.e}}),d0=ms0.map(function(x){if(!x.has)return{l:MN[x.m-1],no:1};var t=mSum(x.k);return{l:MN[x.m-1],i:t.i,e:t.e,b:t.i-t.e}}),mx=Math.max.apply(null,d.map(function(x){return Math.max(x.i,x.e)}))||1,av=d.reduce(function(s,x){return s+x.b},0)/d.length;
  var tr='';if(d.length>1){var a=d[0].e,b=d[d.length-1].e;if(a>0){var p=Math.round((b-a)/a*100);tr=p>3?'ההוצאות עלו ב-'+p+'% מ'+d[0].l+' ל'+d[d.length-1].l:p<-3?'ההוצאות ירדו ב-'+(-p)+'% מ'+d[0].l+' ל'+d[d.length-1].l:'ההוצאות יציבות'}}
  return '<div class="c trd"><div class="rph" style="color:#1F3A5F">'+ic('trend',20)+'<b>מגמות '+(d.length>1?d.length+' החודשים האחרונים':'החודש האחרון')+'</b></div>'+
   '<div class="rgs">'+d0.map(function(x){if(x.no)return '<div class="rgc">'+donut([{v:1,c:"#e8edf3"}],84,10,'<small>אין נתונים</small>')+'<span>'+x.l+'</span><b>—</b></div>';var r=x.i>0?x.e/x.i:1,c=r>1?'#b23b3b':r>.9?'#C9A23F':'#1f7a3a';return '<div class="rgc">'+donut([{v:Math.min(r,1),c:c},{v:Math.max(0,1-Math.min(r,1)),c:'#e8edf3'}],84,10,'<b>'+Math.round(r*100)+'%</b>')+'<span>'+x.l+'</span><b class="'+(x.b<0?'neg':'pos')+'">'+fm(x.b)+'</b></div>'}).join('')+'</div>'+
   '<div class="hint" data-hf="1" style="text-align:center;margin:2px 0 6px">אחוז מההכנסה שהוצא</div>'+
   '<div class="csl">'+ic('dot',16)+'<span>יתרה ממוצעת: <b class="'+(av<0?'neg':'')+'">'+fm(av)+'</b> בחודש'+(tr?' · '+tr:'')+'</span></div></div>'}
function pmChart(){var ms=lastMsD().slice().reverse();if(!ms.length)return '';var SG=[['אשראי','אשראי','#1F3A5F'],['מזומן','מזומן','#C9A23F'],['הו"ק','הו"ק קצר','#5b8fb0'],['sv','הו"ק ארוך','#9bbf3a']];
  var cols=ms.map(function(x){var o={},t=0;SG.forEach(function(s){o[s[0]]=0});G.forEach(function(g){if(g.t==='i')return;its(g).forEach(function(it){var sg=segOf(g,it);if(o[sg]!=null)o[sg]+=n(x.a[g.n+'|'+it])})});SG.forEach(function(s){t+=o[s[0]]});return{l:MN[x.m-1],o:o,t:t}});
  var A={},T=0;SG.forEach(function(s){A[s[0]]=cols.reduce(function(a,c){return a+c.o[s[0]]},0)/cols.length;T+=A[s[0]]});if(!T)return '';if(cols.length>1)cols.push({l:'ממוצע',o:A,t:T,avg:1});
  return '<div class="c"><div class="rph" style="color:#1F3A5F">'+ic('card',20)+'<b>חלוקה לפי אמצעי תשלום</b></div><div class="pmg" style="grid-template-columns:repeat('+cols.length+',1fr)">'+cols.map(function(c){return '<div class="pmc'+(c.avg?' avg':'')+'">'+donut(SG.map(function(s){return{v:c.o[s[0]],c:s[2]}}),70,11,'<b style="font-size:11px">'+fm(c.t).replace(' ₪','')+'</b>')+'<span>'+c.l+'</span></div>'}).join('')+'</div>'+
   '<div class="pml3">'+SG.filter(function(s){return A[s[0]]}).map(function(s){return '<span><i style="background:'+s[2]+'"></i>'+s[1]+' <b>'+Math.round(A[s[0]]/T*100)+'%</b> · '+fm(A[s[0]])+'</span>'}).join('')+'</div>'+
   '<div class="hint" data-hf="1" style="margin:8px 0 0">הסכום במרכז הוא סך ההוצאות של החודש. במקרא: הממוצע החודשי.</div></div>'}
function donut(seg,sz,th,ctr){var r=(sz-th)/2,C=2*Math.PI*r,t=seg.reduce(function(a,x){return a+x.v},0)||1,off=0,cs='';
  seg.forEach(function(x){if(!x.v)return;var l=x.v/t*C;cs+='<circle cx="'+sz/2+'" cy="'+sz/2+'" r="'+r+'" fill="none" stroke="'+x.c+'" stroke-width="'+th+'" stroke-dasharray="'+l+' '+(C-l)+'" stroke-dashoffset="'+(-off)+'"/>';off+=l});
  return '<div class="dnt" style="width:'+sz+'px;height:'+sz+'px"><svg viewBox="0 0 '+sz+' '+sz+'" width="'+sz+'" height="'+sz+'" style="transform:rotate(-90deg)"><circle cx="'+sz/2+'" cy="'+sz/2+'" r="'+r+'" fill="none" stroke="#eef2f7" stroke-width="'+th+'"/>'+cs+'</svg><div class="dnc">'+ctr+'</div></div>'}
function gIc(nm){nm=nm||'';return /חופש|טיול|נופש|חו"ל/.test(nm)?'plane':/רכב|אוטו/.test(nm)?'car':/דיר|בית|משכנ|שיפוץ/.test(nm)?'home':/חתונ|בר מצו|בת מצו|שמח|אירוע/.test(nm)?'ring':/לימוד|תואר|ישיב|חינוך/.test(nm)?'book':/חירום|ביטחון|לא צפוי|כרית/.test(nm)?'shield':/מתנ/.test(nm)?'gift':'tgt'}
function goalsUI(){var h='';
var gl=S.L.gl.filter(function(x){return n(x.t)>0});
  if(gl.length)h+='<div class="sh"><h2>'+ic('trend',20)+' היעדים שלנו</h2></div><div class="gcs">'+gl.map(function(x,i){var t=n(x.t),p=Math.min(100,Math.round(n(x.s)/t*100)),c=['#C9A23F','#1F6F50','#1F3A5F','#8C3B3B'][i%4],m=gm(x.d);
    return '<div class="gk"><div class="gkn"><span class="gki" style="color:'+c+';background:'+c+'1f">'+ic(gIc(x.n),18)+'</span>'+esc(x.n||'יעד')+'</div><div class="gkb"><i style="width:'+p+'%;background:'+c+'"></i></div><small>'+fm(n(x.s))+' מתוך '+fm(t)+' <span style="opacity:.7">(משוער)</span></small></div>'}).join('')+'</div>';
  if(gl.length)h+='<div class="c gcta"><button class="btn sec" data-a="gofc" title="מחשבון ריבית דריבית">'+ic('trend',18)+'<span>מחשבון ריבית דריבית</span></button></div>';
  return h}
function greet(){var hr=new Date().getHours(),g=hr<5?'לילה טוב':hr<12?'בוקר טוב':hr<17?'צהריים טובים':hr<21?'ערב טוב':'לילה טוב';return '<div class="mhd"><h2 class="mtt">'+g+(S.fam?' משפחת '+esc(S.fam):'')+'</h2></div>'}
function svChUI(){var ms=lastMsD();if(ms.length<2)return '';var cur=ms[0],prv=ms[1],out=[];
  G.forEach(function(g){its(g).forEach(function(it){if(segOf(g,it)!=='sv')return;var kk=g.n+'|'+it,a=n(cur.a[kk]),b=n(prv.a[kk]);
    if(b>0&&a===0)out.push([it,'הופסק','הופקדו '+fm(b)+' ב'+MN[prv.m-1]+', ובחודש '+MN[cur.m-1]+' לא הופקד כלום']);
    else if(b>0&&a>0&&Math.abs(a-b)/b>.2)out.push([it,a>b?'גדל':'קטן',fm(b)+' ← '+fm(a)])})});
  (S.L.sv||[]).forEach(function(x){if(x.n&&n(x.m)===0&&n(x.v)>0&&!out.some(function(o){return o[0]===x.n}))out.push([x.n,'ללא הפקדה','אין הפקדה חודשית לחיסכון הזה'])});
  if(!out.length)return '';
  return '<div class="c"><div class="rph" style="color:#8a6410">'+ic('sv',20)+'<b>חסכונות שהופסקו או השתנו</b></div>'+out.map(function(o){return '<div class="rpr"><span>'+esc(o[0])+'<small>'+esc(o[2])+'</small></span><em>'+o[1]+'</em><span></span></div>'}).join('')+'<div class="hint" data-hf="1" style="margin:8px 0 0">כדאי לוודא שההפסקה מכוונת.</div></div>'}
function lnEndUI(){var l=(S.L.ln||[]).filter(function(x){var c=n(x.c);return c>0&&c<=12&&n(x.p)>0}).sort(function(a,b){return n(a.c)-n(b.c)});if(!l.length)return '';
  var t=l.reduce(function(s,x){return s+n(x.p)},0);
  return '<div class="c"><div class="rph" style="color:#1f7a3a">'+ic('check',20)+'<b>הלוואות שעומדות להסתיים</b></div>'+l.map(function(x){return '<div class="rpr"><span>'+esc(x.n||x.y||'הלוואה')+'<small>החזר חודשי '+fm(n(x.p))+' · משוער</small></span><em>עוד '+n(x.c)+' ח׳</em><span></span></div>'}).join('')+'<div class="hint" data-hf="1" style="margin:8px 0 0">יתפנו '+fm(t)+' בחודש. כדאי להעביר אותם לחיסכון.</div></div>'}
function creditUI(){var ms=lastMsD(),neg=ms.filter(function(x){var t=mSum(x.k);return t.i-t.e<0}).length,L=[],lp=(S.L.ln||[]).reduce(function(s,x){return s+n(x.p)},0),inc=ms.length?ms.reduce(function(s,x){return s+mSum(x.k).i},0)/ms.length:ts('bud','i'),nl=(S.L.ln||[]).filter(function(x){return x.y!=='משכנתא'&&n(x.b)>0}).length;
  if(neg>=2)L.push('ב-'+neg+' מתוך '+ms.length+' החודשים האחרונים ההוצאות היו גבוהות מההכנסות. מינוס מתמשך בחשבון וחריגה ממסגרת האשראי עלולים לפגוע בדירוג האשראי.');
  if(inc>0&&lp/inc>.4)L.push('ההחזרים החודשיים על הלוואות הם כ-'+Math.round(lp/inc*100)+'% מההכנסה. נטל החזרים גבוה עלול להקשות על קבלת אשראי בעתיד.');
  if(nl>=3)L.push('יש '+nl+' הלוואות פעילות. ריבוי הלוואות עלול להשפיע על הדירוג. כדאי לבדוק עם המאמנת איחוד או פירעון.');
  if(!L.length)return '';
  return '<div class="c"><div class="rph">'+ic('card',20)+'<b>השפעה אפשרית על דירוג האשראי</b></div>'+L.map(function(x){return '<div class="csl">'+ic('dot',16)+'<span>'+esc(x)+'</span></div>'}).join('')+'<div class="hint" data-hf="1" style="margin:8px 0 0">הערכה כללית בלבד.</div></div>'}
function tipsUI(){var ms=lastMsD(),T=[];if(!ms.length)return '';var av=ms.reduce(function(s,x){var t=mSum(x.k);return s+t.i-t.e},0)/ms.length;
  if(av<0)T.push('היתרה הממוצעת שלילית. מתחילים מהסעיף שחורג הכי הרבה, ומורידים בו 10% בחודש הבא.');
  if(av>0)T.push('יש יתרה חיובית של כ-'+fm(av)+' בחודש. כדאי להגדיר הוראת קבע לחיסכון בתחילת החודש, לפני שהכסף מתפזר.');
  var ev=envKs();if(ev.length){var lf=ms.filter(function(x){var e=(S.env||{})[x.k];return e&&e.left&&Object.keys(e.left).some(function(k){return n(e.left[k])>0})}).length;if(lf>=2)T.push('נשאר כסף במעטפות כמה חודשים ברציפות. אפשר להקטין את המעטפות ולהעביר את ההפרש לחיסכון.')}
  if((S.L.ln||[]).some(function(x){var c=n(x.c);return c>0&&c<=12}))T.push('הלוואה מסתיימת בקרוב. ההחזר שמתפנה הוא הזדמנות לחיסכון בלי להרגיש בכיס.');
  if(!T.length)return '';
  return '<div class="c"><div class="rph" style="color:#C9A23F">'+ic('rl',20)+'<b>טיפים בשבילכם</b></div>'+T.slice(0,3).map(function(x){return '<div class="csl">'+ic('dot',16)+'<span>'+esc(x)+'</span></div>'}).join('')+'</div>'}
