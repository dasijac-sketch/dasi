/* קוד משותף: נתוני קטגוריות, חישובים ותצוגות */
var D=[['i','הכנסות','הכנסה מעבודה בן זוג,הכנסה מעבודה בת זוג,קצבת ילדים,הכנסה מליווי משפחות,עזרה ממשפחה,הכנסה מנכסים,הכנסה מהקופה'],
['f','הוצאות בית','שכר דירה,משכנתא דירה למגורים,ביטוח חיים למשכנתא,ביטוח מבנה ותכולה,גז,חשמל,ארנונה,מים,ועד בית,בר מים,עוזרת,עיתונים'],
['f','תקשורת','טלפון,טלפון נייד,אינטרנט,WAZE'],
['f','חינוך','מעון / מטפלת,גנים,בית ספר,חיידר,ישיבה,סמינר,לימודי הורים,חוגים ושיעורי עזר,פסיכולוג / הוראה מתקנת,צהרונים,דמי שכלול,ספרי לימוד,טיולים שנתיים,קייטנות,ועד בית ספר'],
['f','תחבורה','ביטוח רכב,דלק,כביש 6,חניות,טיפולים ורישוי,רב קו,הסעות,ביטוח שמשות וסוללה'],
['f','בריאות','קופת חולים - ביטוח משלים,ביטוח בריאות פרטי,תרופות,רפואה משלימה,טיפולי שיניים,משקפיים ועדשות'],
['f','בנקים ואשראי','הלוואות,עסקאות בתשלומים,עמלות בנק,דמי כרטיס'],
['f','השקעות וחסכונות','קרן חרום,הוצאות לא מתוכננות,חסכונות,משכנתא דירה להשקעה,הלוואות לצורך חיסכון'],
['f','שונות קבועות','נסיעות וחופשות,ביטוח לאומי,מקווה,הוצאות חג,ניקוי יבש,תרומות ומעשרות'],
['v','קניות','אוכל ומוצרי מכולת,אוכל מחוץ לבית,סיגריות,הוצאות תינוקות,ביגוד והנעלה לחגים,ביגוד והנעלה עונתי'],
['v','טיפוח','קוסמטיקה,מספרה / פאנית,דיאטה,מכון כושר,קנטרי'],
['v','תחבורה משתנה',''],
['v','בית','מוצרים ורהיטים לבית,ספרים,תיקונים וטכנאים,אחזקת הבית'],
['v','בילויים','בילויים,מסעדות,צעצועים,מתנות לצוות בית הספר,מתנות לבני משפחה,מתנות לאירועים'],
['v','שונות משתנות','דמי כיס הורים,דמי כיס ילדים']];
var G=[];
function ecs(){var c=(S&&S.cs)||{};return{hid:c.hid||[],hg:c.hg||[],ng:c.ng||[],ni:c.ni||{}}}
function bG(){var c=ecs();G=D.map(function(a){return{t:a[0],n:a[1],i:a[2]?a[2].split(','):[]}}).filter(function(g){return c.hg.indexOf(g.n)<0}).concat(c.ng.map(function(x){return{t:x.t,n:x.n,i:[]}}))}
var SEC={i:'הכנסות',f:'הוצאות קבועות',v:'הוצאות משתנות'};
var MN=['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
var ADM=false,RO=false,STAGE=1,INBOX=[];
function newState(){return{bal:{},bud:{},act:{},cx:{},note:{},fam:'',chd:{},ppl:0,mo:{},rt:{},cs:{hid:[],hg:[],ng:[],ni:{}},L:{sv:[],ln:[],ins:[],gl:[]},y:new Date().getFullYear(),m:new Date().getMonth()+1,tab:'home',open:{}}}
var S=newState();
function W(st,fn){var o=S;S=st;bG();try{return fn()}finally{S=o;bG()}}
function ago(t){if(!t)return 'טרם עודכן';var m=Math.round((Date.now()-t)/60000);return m<1?'עודכן עכשיו':m<60?'עודכן לפני '+m+' דקות':m<1440?'עודכן לפני '+Math.round(m/60)+' שעות':'עודכן לפני '+Math.round(m/1440)+' ימים'}
function monSel(){var o=MN.map(function(m,i){return '<option value="'+(i+1)+'"'+(i+1===S.m?' selected':'')+'>'+m+'</option>'}).join('');return '<div class="f" style="margin-bottom:10px"><select id="ms">'+o+'</select><input id="yr" type="number" value="'+S.y+'" style="max-width:100px"></div>'}
function n(v){return Number(v)||0}
function fm(v){return Math.round(v).toLocaleString('he-IL')+' ₪'}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function ym(){return S.y+'-'+S.m}
function rc(k){var m=(S.mo[k]||[]).filter(function(v){return v!==''&&v!=null});if(m.length)S.bal[k]=m.reduce(function(a,b){return a+b},0)/m.length;else delete S.bal[k]}
function its(g){var c=ecs();return g.i.concat(c.ni[g.n]||[],S.cx[g.n]||[]).filter(function(i,x,a){return c.hid.indexOf(g.n+'|'+i)<0&&a.indexOf(i)===x})}
function st(sn,k){return sn==='act'?(S.act[k||ym()]||{}):S[sn]}
function gs(sn,g,k){var s=st(sn,k);return its(g).reduce(function(a,i){return a+n(s[g.n+'|'+i])},0)}
function ts(sn,t,k){return G.filter(function(g){return g.t===t}).reduce(function(a,g){return a+gs(sn,g,k)},0)}
function ex(sn,k){return ts(sn,'f',k)+ts(sn,'v',k)}
function cls(g,p){return g.t==='i'?(p>=1?'ok':p>=.8?'wn':'bd'):(p>1?'bd':p>=.85?'wn':'ok')}
function grp(g,mode){
  var sn=mode==='mon'?'act':mode,s=st(sn),sub=gs(sn,g),bs=gs('bud',g),inc=ts('bal','i'),o=S.open[g.n];
  var meta=mode==='bal'?fm(sub)+(inc&&g.t!=='i'?' · '+Math.round(sub/inc*100)+'%':''):mode==='bud'?fm(sub):fm(sub)+' / '+fm(bs);
  var bar=mode==='mon'&&bs?'<div class="bar"><i class="'+cls(g,sub/bs)+'" style="width:'+Math.min(100,sub/bs*100)+'%"></i></div>':'';
  var rows=o?its(g).map(function(i){
    var k=g.n+'|'+i,inp='<input type="number" inputmode="decimal" min="0"'+(RO&&mode==='bud'?' disabled':'')+' data-s="'+sn+'" data-k="'+esc(k)+'" value="'+(s[k]||'')+'" placeholder="0">';
    if(mode==='mon'){var bv=n(S.bud[k]),av=n(s[k]),d=g.t==='i'?av-bv:bv-av;return '<div class="r"><label>'+esc(i)+'<small>תקציב '+fm(bv)+'</small></label>'+inp+'<span class="d '+(d<0?'neg':'')+'">'+fm(d)+'</span></div>'}
    if(mode==='bal'){var mo=(S.mo[k]||[]).slice(),fl=mo.filter(function(v){return v!==''&&v!=null}).length,rt=S.rt[k]||{},ex2=g.t!=='i';
      while(mo.length<2)mo.push('');
      var sel=function(w){return '<select data-s="rt" data-k="'+esc(k)+'" data-w="'+w+'" aria-label="דירוג"><option value="">—</option>'+[1,2,3,4,5].map(function(v){return '<option'+(String(rt[w])===String(v)?' selected':'')+'>'+v+'</option>'}).join('')+'</select>'};
      var ra=n(rt.a),rb=n(rt.b),rav=ra&&rb?(ra+rb)/2:0;
      return '<div class="it bl"><div class="tot" style="padding:0"><span>'+esc(i)+'</span><span>'+(s[k]!==undefined&&s[k]!==''?fm(n(s[k])):'—')+'</span></div>'+
      '<div class="dt">'+Array.from(mo,function(v,j){return '<span><small>חודש '+(j+1)+'</small><input type="number" inputmode="decimal" min="0" data-s="mo" data-k="'+esc(k)+'" data-j="'+j+'" value="'+(v===undefined||v===null?'':v)+'"></span>'}).join('')+'<button class="btn sec" data-a="mo" data-id="'+esc(k)+'" aria-label="הוספת חודש">+ חודש</button></div>'+
      '<small>'+(fl>1?'ממוצע של '+fl+' חודשים':'מלאו חודשיים והממוצע יחושב לבד')+'</small>'+
      (ex2?'<div class="dt"><span><small>דירוג בן זוג</small>'+sel('a')+'</span><span><small>דירוג בת זוג</small>'+sel('b')+'</span>'+(rav?'<span><small>ממוצע דירוג</small><b>'+rav.toFixed(1)+'</b></span>':'')+'</div>':'')+'</div>'}
    return '<div class="r"><label>'+esc(i)+(mode==='bud'?'<small>במאזן '+fm(n(S.bal[k]))+'</small>':'')+'</label>'+inp+(ADM&&mode==='bud'?'<button class="gh" style="width:30px;color:var(--bd)" data-a="xi" data-g="'+esc(g.n)+'" data-i="'+esc(i)+'" aria-label="הסרת תת קטגוריה '+esc(i)+'">✕</button>':'')+'</div>'}).join(''):'';
  return '<div class="c"><button class="gh" data-a="tg" data-id="'+esc(g.n)+'"><span>'+(o?'▾ ':'◂ ')+esc(g.n)+'</span><span>'+meta+'</span></button>'+bar+rows+(ADM&&mode==='bud'&&o?'<div class="r"><button class="btn sec" style="color:var(--bd)" data-a="xg" data-g="'+esc(g.n)+'">הסרת הקטגוריה "'+esc(g.n)+'"</button></div>':'')+'</div>'}
function secs(mode){return ['i','f','v'].map(function(t){return '<h3>'+SEC[t]+'</h3>'+G.filter(function(g){return g.t===t}).map(function(g){return grp(g,mode)}).join('')}).join('')}
function bottom(sn,k){var i=ts(sn,'i',k),e=ex(sn,k);return '<div class="c"><div class="tot"><span>סה״כ הכנסות</span><span>'+fm(i)+'</span></div><div class="tot"><span>סה״כ הוצאות</span><span>'+fm(e)+'</span></div><div class="tot"><span>יתרה</span><span class="'+(i-e<0?'neg':'')+'">'+fm(i-e)+'</span></div></div>'}
function bal(){
  var food=n(S.bal['קניות|אוכל ומוצרי מכולת']),p=n(S.ppl);
  var opts=G.map(function(g){return '<option>'+esc(g.n)+'</option>'}).join('');
  return '<p class="hint">לכל סעיף הזינו את הסכום של חודשיים והממוצע יחושב לבד (אפשר להוסיף עוד חודשים). בן הזוג ובת הזוג מדרגים כל הוצאה: 1 = חיוני, 5 = אפשר לוותר.</p>'+secs('bal')+bottom('bal')+
  '<div class="c"><div class="r" style="border:0"><label>מספר נפשות בבית</label><input type="number" min="0" data-s="ppl" data-k="x" value="'+(S.ppl||'')+'"></div>'+
  (p&&food?'<div class="tot"><span>מזון לנפש לשבוע</span><span>'+fm(food/p/4.2)+'</span></div>':'')+'</div>'+
  '<div class="c"><b>הוספת סעיף</b><div class="f" style="margin-top:8px"><select id="cg">'+opts+'</select><input id="cn" placeholder="שם הסעיף"><button class="btn" data-a="add">הוספה</button></div></div>'}
function structUI(){var o=G.map(function(g){return '<option>'+esc(g.n)+'</option>'}).join('');return '<div class="c"><b>ניהול קטגוריות</b><p class="hint">שינוי כאן מתעדכן אצל הזוג במאזן, בתקציב, במעקב ובסיכומים. הסרה מסתירה את הסעיף, והנתונים נשמרים.</p><div class="f"><select id="sg">'+o+'</select><input id="sn" placeholder="שם תת קטגוריה"><button class="btn" data-a="ai">הוספת תת קטגוריה</button></div><div class="f" style="margin-top:8px"><select id="ct"><option value="f">הוצאה קבועה (אשראי)</option><option value="v">הוצאה משתנה (מעטפה)</option><option value="i">הכנסה</option></select><input id="cn2" placeholder="שם קטגוריה חדשה"><button class="btn" data-a="ag">הוספת קטגוריה</button></div></div>'}
function bud(){return '<p class="hint">'+(RO?'התקציב נקבע עבורכם על ידי המאמנת, ומוצג כאן לצפייה.':'התקציב נבנה מהמאזן. אפשר להעתיק אותו ואז לשנות סעיפים.')+'</p>'+(RO?'':'<button class="btn" data-a="fill" style="margin-bottom:6px">העתק מהמאזן</button>')+secs('bud')+bottom('bud')+(ADM?structUI():'')}
function mon(){
  var k=ym(),ai=ts('act','i'),pi=ts('bud','i'),ae=ex('act'),pe=ex('bud');
  var ms=MN.map(function(m,i){return '<option value="'+(i+1)+'"'+(i+1===S.m?' selected':'')+'>'+m+'</option>'}).join('');
  return '<div class="f" style="margin-bottom:10px"><select id="ms">'+ms+'</select><input id="yr" type="number" value="'+S.y+'" style="max-width:100px"></div>'+
  '<div class="g"><div class="k"><b>'+fm(ai)+'</b><span>הכנסות (תקציב '+fm(pi)+')</span></div><div class="k"><b class="'+(ae>pe&&pe?'neg':'')+'">'+fm(ae)+'</b><span>הוצאות (תקציב '+fm(pe)+')</span></div><div class="k"><b class="'+(ai-ae<0?'neg':'')+'">'+fm(ai-ae)+'</b><span>יתרה בפועל</span></div></div>'+
  '<p class="hint">הזינו את הסכום בפועל לכל סעיף. העמודה האחרונה מראה את ההפרש מהתקציב, ובאדום חריגה.</p>'+secs('mon')+
  '<div class="c"><b>הערות לחודש</b><textarea id="nt" rows="3" style="width:100%;margin-top:6px" placeholder="סיכום, מסקנות ומשימות לחודש הבא">'+esc(S.note[k]||'')+'</textarea></div>'}
function yr(){
  var rows='',TI=0,TE=0,TP=0;
  MN.forEach(function(m,i){var k=S.y+'-'+(i+1),ai=ts('act','i',k),ae=ex('act',k);
    if(!ai&&!ae){rows+='<tr><td>'+m+'</td><td colspan="4">—</td></tr>';return}
    TI+=ai;TE+=ae;TP+=ex('bud')-ae;
    rows+='<tr><td>'+m+'</td><td>'+fm(ai)+'</td><td>'+fm(ae)+'</td><td class="'+(ai-ae<0?'neg':'')+'">'+fm(ai-ae)+'</td><td class="'+(ex('bud')-ae<0?'neg':'')+'">'+fm(ex('bud')-ae)+'</td></tr>'});
  rows+='<tr><th>סה״כ</th><th>'+fm(TI)+'</th><th>'+fm(TE)+'</th><th>'+fm(TI-TE)+'</th><th>'+fm(TP)+'</th></tr>';
  return '<div class="c ov"><b>שנת '+S.y+'</b><table><tr><th>חודש</th><th>הכנסות</th><th>הוצאות</th><th>יתרה</th><th>פער מהתקציב</th></tr>'+rows+'</table></div><p class="hint">פער מהתקציב: חיובי = חסכתם ביחס לתוכנית, שלילי = חריגה.</p>'}
var FD={sv:[{k:'n',l:'שם החיסכון',t:'t'},{k:'m',l:'הפקדה חודשית',t:'n'},{k:'v',l:'שווי נוכחי',t:'n'},{k:'q',l:'נזילות',t:'s',o:['נזיל מיידית','תוך שנה','ארוך טווח']}],
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
function tvs(){
  var dep=sm('sv','m'),val=sm('sv','v'),liq=sm('sv','v',function(x){return x.q==='נזיל מיידית'}),e=ex('bal'),lb=sm('ln','b'),lp=sm('ln','p'),inc=ts('bal','i');
  return '<div class="g">'+tile(fm(val),'שווי חסכונות')+tile(fm(dep),'הפקדה חודשית')+tile(e?(liq/e).toFixed(1):'—','כרית ביטחון (חודשי הוצאות)')+'</div>'+
  lst('sv','חסכונות','קרן השתלמות, חיסכון לכל ילד, קופות ועוד. כרית הביטחון מחושבת מחסכונות שסומנו נזיל מיידית, מול ההוצאות החודשיות במאזן.')+
  '<div class="g">'+tile(fm(lb),'יתרת הלוואות')+tile(fm(lp),'החזר חודשי')+tile(inc?Math.round(lp/inc*100)+'%':'—','מההכנסה',inc&&lp/inc>.2?'neg':'')+'</div>'+
  lst('ln','הלוואות ועסקאות בתשלומים','ההחזר החודשי אמור להופיע גם בסעיף הלוואות במאזן.',function(x){return n(x.p)&&n(x.c)?'<small>סה״כ עד סיום: '+fm(n(x.p)*n(x.c))+'</small>':''})}
function tin(){
  var mo=S.L.ins.reduce(function(a,x){return a+(x.f==='שנתי'?n(x.p)/12:n(x.p))},0),need=0;
  S.L.gl.forEach(function(x){var m=gm(x.d),r=n(x.t)-n(x.s);if(m>0&&r>0)need+=r/m});
  return '<div class="g">'+tile(fm(mo),'ביטוחים בחודש')+tile(fm(mo*12),'ביטוחים בשנה')+tile(fm(need),'נדרש בחודש ליעדים')+'</div>'+
  lst('ins','ביטוחים','לכל ביטוח הזינו פרמיה ותדירות. ביטוח שנתי מחושב גם כעלות חודשית, כדי לשמור בצד כל חודש.',function(x){return x.f==='שנתי'&&n(x.p)?'<small>שווה ערך ל-'+fm(n(x.p)/12)+' בחודש</small>':''})+
  lst('gl','יעדים','רכב, דירה, חתונה של ילד ועוד. מוצג כמה נותר וכמה כדאי לחסוך בחודש.',function(x){var t=n(x.t),r=t-n(x.s),m=gm(x.d);if(!t)return '';var p=n(x.s)/t;
    return '<div class="bar"><i class="'+(p>=1?'ok':'wn')+'" style="width:'+Math.min(100,p*100)+'%"></i></div><small>'+(r<=0?'היעד הושג':m==null?'נותר '+fm(r):m>0?'נותרו '+m+' חודשים · כדאי לחסוך '+fm(r/m)+' בחודש':'המועד עבר, נותר '+fm(r))+'</small>'})}

/* מסך הבית של הזוג */
function home(){
  var ai=ts('act','i'),ae=ex('act'),pi=ts('bud','i'),pe=ex('bud'),bi=ts('bal','i'),be=ex('bal'),over=[],near=[],st2=STAGE>=2;
  if(st2)G.forEach(function(g){if(g.t==='i')return;var a=gs('act',g),b=gs('bud',g);if(b&&a>b)over.push(g.n+' · חריגה של '+fm(a-b));else if(b&&a>=.85*b)near.push(g.n+' · '+Math.round(a/b*100)+'% מהתקציב')});
  var steps=[['bal','מילוי המאזן החודשי',be>0]];
  if(st2)steps.push(['bud','התקציב שנקבע עבורכם',pe>0],['mon','דיווח הכנסות והוצאות בפועל',ai>0||ae>0]);
  var done=steps.filter(function(s){return s[2]}).length;
  var h='<div class="hero"><div class="hm">'+MN[S.m-1]+' '+S.y+'</div><div class="hl">שלום משפחת '+esc(S.fam)+'</div>'+(st2?'<div class="hb">'+fm(ai-ae)+'</div><div class="hm">נשאר לכם החודש · הכנסות '+fm(ai)+' · הוצאות '+fm(ae)+'</div>':'')+'</div>';
  if(done<steps.length)h+='<div class="c"><b>הצעדים שלכם</b>'+steps.map(function(s){return '<button class="r cc" data-a="tab" data-id="'+s[0]+'"><span>'+(s[2]?'✓ ':'○ ')+s[1]+'</span></button>'}).join('')+'</div>';
  if(!st2){
    h+=be>0||bi>0?'<div class="g">'+tile(fm(bi),'הכנסות חודשיות')+tile(fm(be),'הוצאות חודשיות')+tile(fm(bi-be),'יתרה חודשית',bi-be<0?'neg':'')+'</div><div class="c">תודה על מילוי המאזן. המאמנת תבנה עבורכם את התקציב, ותעדכן אתכם כאן.</div>':'<div class="c">התחילו במילוי המאזן: הזינו את ההכנסות וההוצאות החודשיות הממוצעות שלכם.</div>'}
  else{
    
    if(over.length||near.length)h+='<div class="c"><b>שימו לב החודש</b>'+over.map(function(x){return '<div class="r"><span class="bdg bd">חריגה</span><label>'+esc(x)+'</label></div>'}).join('')+near.map(function(x){return '<div class="r"><span class="bdg wn">קרוב</span><label>'+esc(x)+'</label></div>'}).join('')+'</div>';
    else if(ae>0)h+='<div class="c">✓ אין חריגות מהתקציב החודש</div>'}
  if(st2){
    var PAL=['#2F6FED','#1C8C6E','#E0562E','#8A4FD6','#0E8FA6','#C2307A'];
    var vs=G.filter(function(g){return g.t==='v'&&gs('bud',g)>0}),fs=G.filter(function(g){return g.t==='f'&&gs('bud',g)>0});
    if(vs.length){var rem=0;vs.forEach(function(g){rem+=gs('bud',g)-gs('act',g)});
      h+='<div class="sh"><h2>המעטפות שלכם</h2><span>מזומן · נשאר '+fm(rem)+'</span></div><div class="env">'+vs.map(function(g,i){var b=gs('bud',g),a=gs('act',g),r=b-a,p=Math.min(100,Math.max(0,a/b*100)),c=PAL[i%PAL.length];
        return '<div class="ev"><div class="evt" style="background:'+c+'"></div><div class="evb"><div class="evn">'+esc(g.n)+'</div><div class="evv'+(r<0?' neg':'')+'">'+fm(r)+'</div><small>נשאר מתוך '+fm(b)+'</small><div class="bar"><i style="width:'+p+'%;background:'+(r<0?'var(--bd)':c)+'"></i></div>'+(r<=0?'<small class="neg">'+(r<0?'חריגה':'המעטפה ריקה')+'</small>':a>=.85*b?'<small style="color:#b45309">קרוב לסוף</small>':'')+'</div></div>'}).join('')+'</div>'}
    if(fs.length){var dn=fs.filter(function(g){return gs('act',g)>0}).length;
      h+='<div class="sh"><h2>אשראי · הוצאות קבועות</h2><span>'+dn+' מתוך '+fs.length+' חויבו</span></div><div class="c">'+fs.map(function(g){var a=gs('act',g),b=gs('bud',g);return '<div class="r"><label>'+esc(g.n)+'</label><b>'+fm(a>0?a:b)+'</b><span class="bdg '+(a>0?'okb':'mut')+'">'+(a>0?'חויב':'ממתין')+'</span></div>'}).join('')+'</div>'}}
  var gl=S.L.gl.filter(function(x){return n(x.t)>0});
  if(gl.length)h+='<div class="sh"><h2>היעדים שלנו</h2></div><div class="goals">'+gl.map(function(x,i){var t=n(x.t),p=Math.min(100,Math.round(n(x.s)/t*100)),c=['#2F6FED','#E0562E','#1C8C6E','#8A4FD6'][i%4],m=gm(x.d);
    return '<div class="gc"><div class="evn">'+esc(x.n||'יעד')+'</div><svg viewBox="0 0 64 64" width="76" height="76" role="img" aria-label="'+p+' אחוז מהיעד"><circle cx="32" cy="32" r="26" fill="none" stroke="var(--ln)" stroke-width="8"/><circle cx="32" cy="32" r="26" fill="none" stroke="'+c+'" stroke-width="8" stroke-linecap="round" stroke-dasharray="'+(p*1.634)+' 163.4" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle" font-size="15" font-weight="700" fill="currentColor">'+p+'%</text></svg><small>'+fm(n(x.s))+' מתוך '+fm(t)+'</small>'+(m>0&&t>n(x.s)?'<small>כדאי לחסוך '+fm((t-n(x.s))/m)+' בחודש</small>':'')+'</div>'}).join('')+'</div>';
  var ms=INBOX.slice().sort(function(a,b){return b.ts-a.ts}).slice(0,6);
  if(ms.length)h+='<div class="c"><b>מהמאמנת</b>'+ms.map(function(m){return '<div class="it"><small>'+(m.k==='ch'?'אתגר':'הודעה')+' · '+new Date(m.ts).toLocaleDateString('he-IL')+'</small><div style="white-space:pre-wrap">'+esc(m.x)+'</div>'+(m.k==='ch'?'<label style="font-size:14px"><input type="checkbox" style="width:auto" data-s="chd" data-k="'+esc(m.id)+'"'+(S.chd[m.id]?' checked':'')+'> בוצע</label>':'')+'</div>'}).join('')+'</div>';
  return h}

try{bG()}catch(e){}
