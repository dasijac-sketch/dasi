/* סיווג הוצאות מקבצי אשראי ועו"ש - עיבוד מקומי בדפדפן, נשמרים רק סכומים וכללי סיווג */
var TX={ei:-1,wT:0,wn:0,wD:0,open:false,bal:false,step:1,ents:[],files:[],as:{},ok:{},hist:[],sk:[],pm:null,all:false,view:'u',mode:'card',ty:'',cg:'',det:false,addFor:'',otFor:'',err:'',busy:false};
var TXD=[[/סופר|שופרסל|רמי לוי|יוחננוף|מגה|ויקטורי|טיב טעם|מכולת|אושר עד|פרש מרקט|חצי חינם/,['סופר','מזון','מכולת']],
[/דלק|פז |סונול|דור אלון|טן |רב.?קו|כביש 6|חניה|פנגו|סלופארק|גט טקסי|אוטובוס|רכבת/,['דלק','רכב','תחבורה','חניה']],
[/סלקום|פרטנר|הוט|יס |בזק|פלאפון|גולן טלקום|רמי לוי תקשורת|אינטרנט/,['תקשורת','טלפון','סלולר','אינטרנט']],
[/חשמל|מקורות|מים|ארנונה|עירי/,['חשמל','מים','ארנונה']],
[/מכבי|כללית|מאוחדת|לאומית שרותי|סופר.?פארם|בית מרקחת|רופא|קופת חולים/,['בריאות','רפואי','תרופות','רופא']],
[/ביטוח|הראל|מגדל|הפניקס|כלל|מנורה|איילון|שירביט/,['ביטוח']],
[/מסעדה|קפה|פיצה|מקדונלד|וולט|תן ביס|ארומה|פיצה|שווארמה|דומינו|בורגר/,['מסעד','בילוי','קפה','אוכל בחוץ']],
[/זארה|קסטרו|הד קאנטרי|פוקס|h&m|טרמינל|שילב|גולף|אופנה|ביגוד|נעל/,['ביגוד','הנעלה']],
[/נטפליקס|ספוטיפיי|דיסני|apple|google|אמזון|amazon|aliexpress|עלי אקספרס/,['מנוי','מנויים','בידור','קניות']],
[/גן |צהרון|בית ספר|חוג|שיעור|אוניברסיטה|מכללה/,['חינוך','ילדים','חוגים','לימודים']]];
var TXC=[[/מזון|סופר/,['סופר','מזון']],[/דלק|רכב|תחבורה/,['דלק','רכב','תחבורה']],[/ביגוד|אופנה|הנעלה/,['ביגוד']],[/רפוא|בריאות|פארם/,['בריאות','רפואי']],[/מסעד|בילוי|פנאי|תיירות/,['מסעד','בילוי','פנאי']],[/תקשורת|טלפון/,['תקשורת','טלפון']],[/ביטוח/,['ביטוח']],[/חינוך|לימוד/,['חינוך','לימודים']]];
var TXCARD=/ישראכרט|מקס|כאל|לאומי ?קארד|ויזה|דיינרס|אמריקן|isracard|\bmax\b|\bcal\b|visa|חיוב כרט|כרטיס אשראי|כ\.?א\.?ל/i;
var TXCASH=/משיכת? מזומן|כספומט|\batm\b|משיכה/i;
function txNorm(s){return String(s||'').replace(/[‎‏]/g,'').replace(/\s+/g,' ').replace(/[\d\/\.\-*]{4,}/g,'').trim().slice(0,40)}
function txLoad(cb){if(window.XLSX)return cb();var s=document.createElement('script');s.src='/xlsx.js?v=2';s.onload=cb;s.onerror=function(){TX.busy=false;TX.err='לא הצלחנו לטעון את רכיב הקריאה. נסו שוב.';render()};document.head.appendChild(s)}
function txDate(v){if(v instanceof Date)return v.getTime();if(typeof v==='number'&&v>20000&&v<80000)return Math.round((v-25569)*864e5)+432e5;
  var m=String(v||'').match(/(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{2,4})/);if(m){var y=+m[3];if(y<100)y+=2000;return new Date(y,+m[2]-1,+m[1],12).getTime()}return 0}
function txNum(v){if(typeof v==='number')return v;var s=String(v==null?'':v).replace(/[₪,\s‎‏]/g,'');var neg=/^\(.*\)$/.test(s)||/-$/.test(s);s=s.replace(/[()]/g,'').replace(/-$/,'');var x=parseFloat(s);if(isNaN(x))return 0;return neg?-Math.abs(x):x}
function txGuess(rows){var dc={},tc={},nc={},cnt=0,first=-1;
  rows.forEach(function(r,i){var has=false;r.forEach(function(v,j){if(txDate(v)&&(v instanceof Date||/\d[\/\.\-]\d/.test(String(v))||typeof v==='number'&&v>20000&&v<80000)&&typeof v!=='boolean'){dc[j]=(dc[j]||0)+1;has=true}});
    if(has){cnt++;if(first<0)first=i;r.forEach(function(v,j){if(dc[j]&&txDate(v))return;if(typeof v==='number')nc[j]=(nc[j]||0)+1;else if(/[\u05d0-\u05eaA-Za-z]{2,}/.test(String(v)))tc[j]=(tc[j]||0)+1;else if(v!==''&&!isNaN(txNum(v)))nc[j]=(nc[j]||0)+1})}});
  if(cnt<2)return null;var top=function(o){var b=-1,m=0;for(var k in o)if(o[k]>m){m=o[k];b=+k}return b},dcol=top(dc),ncols=Object.keys(nc).filter(function(k){return nc[k]>=cnt/3&&+k!==dcol}).map(Number).sort(function(a,b){return a-b});
  if(!ncols.length)return null;var tcol=top(tc),c={h:first-1,d:dcol,n:tcol,ct:-1,db:-1,cr:-1,ch:ncols[0]};
  if(ncols.length>=2){var a=ncols[0],b=ncols[1],ex=0,both=0;rows.forEach(function(r){var x=txNum(r[a]),y=txNum(r[b]);if(x&&y)both++;else if(x||y)ex++});if(ex>=cnt*0.7&&both<=cnt*0.2){c.db=a;c.cr=b}}
  return c}
function txHtml(buf){var u=new Uint8Array(buf),head=new TextDecoder('utf-8').decode(u.subarray(0,3000));if(!/<\s*(html|table|!doctype)/i.test(head))return null;
  var cs=(head.match(/charset=["']?([\w-]+)/i)||[])[1]||'utf-8',tx;try{tx=new TextDecoder(cs).decode(u)}catch(e){tx=new TextDecoder('utf-8').decode(u)}
  var doc=new DOMParser().parseFromString(tx,'text/html'),R={},names=[];
  Array.prototype.forEach.call(doc.querySelectorAll('table'),function(t,i){if(t.querySelector('table'))return;var rows=Array.prototype.map.call(t.querySelectorAll('tr'),function(tr){return Array.prototype.map.call(tr.children,function(c){return c.textContent.replace(/[\u200e\u200f\u202a-\u202e]/g,'').replace(/\s+/g,' ').trim()})});
    if(rows.length>1){R['t'+i]=rows;names.push('t'+i)}});
  var am=tx.replace(/<[^>]*>/g,' ').match(/חשבון\s*:?[\s\u200e\u200f\u202a-\u202e]*([\d][\d\-\/]{4,})/);
  return names.length?{SheetNames:names,R:R,acc:am?am[1]:''}:null}
function txFile(wb,fname){var out=[];
  wb.SheetNames.forEach(function(sn){var rows=wb.R?wb.R[sn]:XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,raw:true,defval:''}),h=-1,c={};
    for(var i=0;i<Math.min(rows.length,40)&&h<0;i++){var r=rows[i].map(function(x){return String(x).replace(/\s+/g,' ').trim()});
      var di=-1,ai=-1;r.forEach(function(t,j){if(/תאריך/.test(t)&&(di<0||/עסקה/.test(t)))di=j});
      r.forEach(function(t,j){if(/חובה|סכום|חיוב/.test(t)&&!/תאריך/.test(t)&&ai<0)ai=j});
      if(di>=0&&ai>=0){h=i;c.d=di;
        var nm=-1;r.forEach(function(t,j){if(nm<0&&/בית עסק|תיאור|תאור|פרטים|שם|הפעולה/.test(t))nm=j});c.n=nm;
        var db=-1,cr=-1,ch=-1,am=-1,ct=-1;
        r.forEach(function(t,j){if(/חובה/.test(t))db=j;else if(/זכות/.test(t))cr=j;else if(/סכום חיוב|חיוב בש/.test(t)&&ch<0)ch=j;else if(/סכום/.test(t)&&am<0)am=j;if(/ענף|קטגוריה/.test(t))ct=j});
        c.db=db;c.cr=cr;c.ch=ch>=0?ch:am;c.ct=ct}}
    if(h<0){c=txGuess(rows);if(!c)return;h=c.h}
    var bank=c.db>=0||c.cr>=0,sh=[];
    for(var k=h+1;k<rows.length;k++){var r2=rows[k],d=txDate(r2[c.d]);if(!d)continue;var a;
      if(bank){a=txNum(r2[c.db])-txNum(r2[c.cr])}else a=txNum(r2[c.ch]);if(!a)continue;
      var nm2=txNorm(c.n>=0?r2[c.n]:'');if(!nm2)nm2='ללא שם';
      var xs=[];(rows[h]||[]).forEach(function(hn,j){hn=String(hn).trim();if(!hn||j===c.d||j===c.n||j===c.db||j===c.cr||j===c.ch||j===c.ct||/יתרה|תאריך|סכום|חובה|זכות|חיוב/.test(hn))return;var v=String(r2[j]==null?'':r2[j]).replace(/\s+/g,' ').trim();if(v&&v!=='0'&&v!=='0.00'&&xs.length<4)xs.push(hn+': '+v)});
      sh.push({d:d,nm:nm2,a:a,b:bank?1:0,ct:c.ct>=0?String(r2[c.ct]||'').trim():'',x:xs.join(' · ')})}
    if(!bank){var ng=sh.filter(function(x){return x.a<0}).length;if(ng>sh.length/2)sh.forEach(function(x){x.a=-x.a})}
    out=out.concat(sh)});
  return out}
function txPer(e){var sd=Math.min(28,Math.max(1,n(S.sd)||1)),d=new Date(e.d-(sd-1)*864e5);return d.getFullYear()*12+d.getMonth()}
function txCur(){return S.y*12+S.m-1}
function txPL(p){return MN[p%12]+' '+Math.floor(p/12)}
function txPers(){var o={};TX.ents.forEach(function(e){var p=txPer(e);o[p]=(o[p]||0)+1});return Object.keys(o).map(Number).sort(function(a,b){return a-b}).map(function(p){return{p:p,n:o[p]}})}
function txIn(e){var p=txPer(e);if(TX.bal){if(!TX.pm){TX.pm={};txPers().slice(-2).forEach(function(x){TX.pm[x.p]=1})}return !!TX.pm[p]}return TX.all||p===txCur()}
function txItems(){var o=[];G.forEach(function(g){its(g).forEach(function(i){o.push({k:g.n+'|'+i,g:g,i:i})})});return o}
function txFind(frs,inc){var it=txItems().filter(function(x){return inc?x.g.t==='i':x.g.t!=='i'});
  for(var a=0;a<frs.length;a++)for(var b=0;b<it.length;b++)if(it[b].i.indexOf(frs[a])>=0||it[b].g.n.indexOf(frs[a])>=0)return it[b].k;return ''}
function txValid(k){return txItems().some(function(x){return x.k===k})}
function txOtG(){var g=G.filter(function(x){return x.n==='שונות משתנות'})[0]||G.filter(function(x){return x.t==='v'})[0]||G.filter(function(x){return x.t!=='i'})[0];return g?g.n:'שונות משתנות'}
function txIsOt(v){return !!v&&(v.indexOf('__ot:')===0||v.indexOf('__oi:')===0)}
function txOtI(){var g=G.filter(function(x){return x.t==='i'})[0];return g?g.n:'הכנסות'}
function txVK(v){return v&&v.indexOf('__ot:')===0?txOtG()+'|חד-פעמי: '+v.slice(5):v&&v.indexOf('__oi:')===0?txOtI()+'|חד-פעמי: '+v.slice(5):v}
var TXGEN=/^(הוראת קבע|העברה|העברה דיגיטל|העברה בנקאית|שיק|הפקדת שיק|ביט|פייבוקס|paybox|זיכוי|חיוב|הפקדה|משיכה|העברה מחשבון|העברה לחשבון)$/i;
function txEK(e,i){var inc=e.b&&e.a<0,base=(inc?'i':'e')+'|'+e.nm;return TX.spm&&TX.spm[base]?base+'#'+i:base}
function txGroups(){var gs={},cardAny=TX.ents.some(function(e){return !e.b}),cnt={};TX.sp=TX.sp||{};
  TX.ents.forEach(function(e){if(!txIn(e))return;var inc=e.b&&e.a<0,base=(inc?'i':'e')+'|'+e.nm;cnt[base]=(cnt[base]||0)+1});
  TX.spm={};Object.keys(cnt).forEach(function(k){var nm=k.slice(2);if(cnt[k]>1&&(TX.sp[k]===undefined?TXGEN.test(nm):TX.sp[k]))TX.spm[k]=1});
  TX.ents.forEach(function(e,ix){if(!txIn(e))return;var inc=e.b&&e.a<0,base=(inc?'i':'e')+'|'+e.nm,sub=!!TX.spm[base],key=sub?base+'#'+ix:base,g=gs[key]=gs[key]||{k:key,nm:e.nm,inc:inc,n:0,t:0,ct:e.ct,b:e.b,sk:'',d1:e.d,d2:e.d,sub:sub,base:base,can:cnt[base]>1};
    g.n++;g.t+=inc?-e.a:e.a;if(e.d<g.d1)g.d1=e.d;if(e.d>g.d2)g.d2=e.d;if(e.b&&!inc){if(TXCARD.test(e.nm)&&cardAny)g.sk='card';else if(TXCASH.test(e.nm))g.sk='cash'}});
  var l=Object.keys(gs).map(function(k){return gs[k]});
  l.forEach(function(g){if(TX.as[g.k]===undefined){var v='',ur=S.ur||{};
    if(g.sk)v=g.sk==='cash'&&!TX.bal&&envKs().length?'__env':'x';else{var rk=g.sub?'':ur[g.k];if(rk&&(rk==='x'||rk==='__env'||txValid(rk)))v=rk;
      if(!v)for(var i=0;i<TXD.length&&!v;i++)if(TXD[i][0].test(g.nm)&&!g.inc)v=txFind(TXD[i][1],false);
      if(!v&&g.ct&&!g.inc)for(var j=0;j<TXC.length&&!v;j++)if(TXC[j][0].test(g.ct))v=txFind(TXC[j][1],false)}
    TX.as[g.k]=v}});
  return l.sort(function(a,b){return (b.inc?1:0)-(a.inc?1:0)||b.t-a.t})}
function txOpts(inc){var s='<option value="">בחירה…</option>';
  G.forEach(function(g){if((g.t==='i')!==inc)return;var it=its(g);if(!it.length)return;s+='<optgroup label="'+esc(g.n)+'">'+it.map(function(i){return '<option value="'+esc(g.n+'|'+i)+'">'+esc(i)+'</option>'}).join('')+'</optgroup>'});
  if(inc)return s+'<option value="x">לא נספר כהכנסה</option><option value="__ot">הכנסה חד-פעמית…</option><option value="__new">+ סעיף חדש…</option>';
  return s+'<option value="x">לא נספר (העברה/חיוב כפול)</option>'+(!TX.bal&&envKs().length?'<option value="__env">משיכה למעטפות</option>':'')+'<option value="__ot">הוצאה חד-פעמית…</option><option value="__new">+ קטגוריה חדשה…</option>'}
function txBtn(){if(STAGE<2||RO||n((S.md||{})[ym()]))return '';var done=Object.keys(S.act[ym()]||{}).length;
  return '<div class="c"><b>העלאת פירוט אשראי ועו"ש</b><div class="hint" style="margin:4px 0 8px">'+(done?'אפשר להעלות שוב ולעדכן את הסיווג.':'בסוף החודש מעלים את קבצי האקסל מחברת האשראי ומהבנק, מסווגים את ההוצאות לקטגוריות התקציב, וממשיכים לדיווח על המעטפות.')+'</div><button class="btn" data-tx="open" title="להעלאת קבצים וסיווג">'+ic('upload',18)+'<span>העלאת קבצים</span></button></div>'}
function txBtnBal(){if(typeof ADM!=='undefined'&&ADM)return '';
  return '<div class="c"><b>מילוי המאזן מקבצים</b><div class="hint" style="margin:4px 0 8px">מעלים פירוט אשראי ודפי בנק של חודשיים, מסווגים, והממוצע נכנס למאזן. אחר כך אפשר לעדכן כל סכום ידנית.</div><button class="btn" data-tx="openb" title="להעלאת קבצים">'+ic('upload',18)+'<span>העלאת קבצים</span></button></div>'}
function txBack(){return '<button class="btn sec" data-tx="close">'+(TX.bal?'חזרה למאזן':'חזרה למעקב')+'</button>'}
function txOtForm(g){return '<div class="otf"><b>'+(g.inc?'הכנסה':'הוצאה')+' חד-פעמית · '+fm(g.t)+'</b><div class="hint" style="margin:2px 0 6px">'+(TX.bal?'לא נכללת בממוצע של המאזן.':'נרשמת תחת "'+(g.inc?txOtI():txOtG())+'" ונספרת רק בחודש הזה.')+'</div><input id="txot" placeholder="על מה הלך הכסף?" value="'+esc(g.nm)+'" style="width:100%"><textarea id="txotd" rows="2" placeholder="פירוט נוסף (לא חובה), יישמר בהערות החודש" style="width:100%;margin-top:6px"></textarea><div class="f" style="margin-top:8px"><button class="btn" data-tx="otok" data-g="'+esc(g.k)+'" title="הוספה">'+ic('check',18)+'<span>הוספה</span></button><button class="btn sec" data-tx="otno" title="ביטול">'+ic('xx',18)+'<span>ביטול</span></button></div></div>'}
function txAddForm(g){var gs=G.filter(function(x){return (x.t==='i')===!!g.inc}).map(function(x){return '<option value="'+esc(x.n)+'">'+esc(x.n)+'</option>'}).join('');
  return '<div style="flex:1 1 100%;display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><select id="txng">'+gs+'</select><input id="txnn" placeholder="שם הסעיף החדש" style="flex:1 1 120px"><button class="btn" data-tx="addok" data-g="'+esc(g.k)+'" title="הוספה">'+ic('check',18)+'<span>הוספה</span></button><button class="btn sec" data-tx="addno" title="ביטול">'+ic('xx',18)+'<span>ביטול</span></button></div>'}
function txAsLbl(v){return v==='x'?'לא נספר':v==='__env'?'משיכה למעטפות':txIsOt(v)?'חד-פעמי: '+v.slice(5):v?v.split('|')[1]:''}
function txCard(gl){var ty=TX.ty||'',q=gl.filter(function(g){return !TX.ok[g.k]&&(!ty||(ty==='i')===!!g.inc)}),sk=TX.sk||[];
  q=q.filter(function(g){return sk.indexOf(g.k)<0}).concat(q.filter(function(g){return sk.indexOf(g.k)>=0}));
  var rem=gl.filter(function(g){return !TX.ok[g.k]}).length,tot=gl.length,pc=tot?Math.round((tot-rem)*100/tot):100;
  var h='<div class="c"><div style="display:flex;justify-content:space-between;align-items:center"><b>נשארו '+rem+' לסיווג</b><button class="btn sec" data-tx="mlist" style="padding:4px 10px" title="תצוגת רשימה">'+ic('list',18)+'<span>רשימה</span></button></div><div class="pgb"><i style="width:'+pc+'%"></i></div>'+
   '<div class="f"><button class="sg'+(ty===''?' on':'')+'" data-tx="ty" data-v=""><span>הכל</span></button><button class="sg'+(ty==='e'?' on':'')+'" data-tx="ty" data-v="e"><span>הוצאות</span><small>'+gl.filter(function(g){return !g.inc&&!TX.ok[g.k]}).length+'</small></button><button class="sg'+(ty==='i'?' on':'')+'" data-tx="ty" data-v="i"><span>הכנסות</span><small>'+gl.filter(function(g){return g.inc&&!TX.ok[g.k]}).length+'</small></button></div></div>';
  if(!q.length)return h+'<div class="c" style="text-align:center"><b>'+(rem?'אין עוד פריטים בסוג הזה':'סיימתם לסווג הכל')+'</b><p class="hint">אפשר לעבור על הרשימה לפני הסיכום.</p><div class="f" style="justify-content:center"><button class="btn" data-tx="sum" title="לסיכום">'+ic('check',18)+'<span>סיכום</span></button><button class="btn sec" data-tx="mlist" title="לרשימה">'+ic('list',18)+'<span>רשימה</span></button></div></div>';
  var g=q[0],cur=TX.as[g.k]||'',inc=g.inc,fd=function(t){return new Date(t).toLocaleDateString('he-IL',{day:'numeric',month:'numeric'})};
  h+='<div class="tcard '+(inc?'ti':'te')+'"><span class="tbd">'+(inc?'הכנסה':'הוצאה')+'</span><div class="tam">'+(inc?'+':'')+fm(g.t)+'</div><div class="tnm">'+esc(g.nm)+'</div><div class="hint">'+(g.n>1?g.n+' תנועות · ':'')+fd(g.d1)+(g.d2!==g.d1?' – '+fd(g.d2):'')+(g.ct?' · ענף: '+esc(g.ct):'')+'</div>'+
   (g.sk==='card'?'<div class="hint">נראה כחיוב כרטיס אשראי שכבר מפורט בקובץ האשראי</div>':g.sk==='cash'?'<div class="hint">נראה כמשיכת מזומן: המעטפות מדווחות בנפרד</div>':!inc&&TXCARD.test(g.nm)?'<div class="hint">חיוב כרטיס אשראי: כדאי להעלות גם את פירוט האשראי</div>':'')+
   (g.can&&!g.sub?'<button class="lk" data-tx="spl" data-g="'+esc(g.base)+'">לשייך כל תנועה בנפרד ('+g.n+')</button> ':'')+(g.sub?'<button class="lk" data-tx="mrg" data-g="'+esc(g.base)+'">לאחד עם שאר התנועות באותו שם</button> ':'')+'<button class="lk" data-tx="det">'+(TX.det?'הסתרת פרטים':'פרטים')+'</button>'+
   (TX.det?'<div class="tdt">'+TX.ents.filter(function(e){return txIn(e)&&e.nm===g.nm&&((e.b&&e.a<0)===!!inc)}).slice(0,15).map(function(e){return '<div><span>'+fd(e.d)+(e.x?'<small class="hint" style="display:block">'+esc(e.x)+'</small>':'')+'</span><span>'+fm(Math.abs(e.a))+'</span></div>'}).join('')+'</div>':'')+'</div>';
  if(TX.otFor===g.k)return h+'<div class="c">'+txOtForm(g)+'</div>';
  if(TX.addFor===g.k)return h+'<div class="c"><b>קטגוריה חדשה</b>'+txAddForm(g)+'</div>';
  if(cur)h+='<div class="c" style="text-align:center"><div class="hint" style="margin:0 0 6px">הצעה</div><button class="btn" data-tx="pick" data-v="'+esc(cur)+'" style="width:100%">'+esc(txAsLbl(cur))+(cur!=='x'&&!txIsOt(cur)&&cur!=='__env'?' <small>('+esc(cur.split('|')[0])+')</small>':'')+' ✓</button></div>';
  var gg=G.filter(function(x){return (x.t==='i')===!!inc&&its(x).length}),sel=TX.cg&&gg.some(function(x){return x.n===TX.cg})?TX.cg:(cur&&cur.indexOf('|')>0?cur.split('|')[0]:'');
  h+='<div class="c"><b>'+(cur?'או לבחור קטגוריה אחרת':'לאיזו קטגוריה?')+'</b><div class="chs">'+gg.map(function(x){return '<button class="chp gp'+(sel===x.n?' on':'')+'" data-tx="grp" data-v="'+esc(x.n)+'">'+esc(x.n)+'</button>'}).join('')+'</div>';
  var gx=gg.filter(function(x){return x.n===sel})[0];
  if(gx)h+='<div class="chs">'+its(gx).map(function(i){return '<button class="chp" data-tx="pick" data-v="'+esc(gx.n+'|'+i)+'">'+esc(i)+'</button>'}).join('')+'</div>';
  h+='<div class="chs" style="margin-top:8px"><button class="chp sc" data-tx="pick" data-v="x">'+(inc?'לא נספר כהכנסה':'לא נספר')+'</button>'+(!inc&&!TX.bal&&envKs().length?'<button class="chp sc" data-tx="pick" data-v="__env">משיכה למעטפות</button>':'')+'<button class="chp sc" data-tx="ot" data-g="'+esc(g.k)+'">'+(inc?'הכנסה חד-פעמית':'הוצאה חד-פעמית')+'</button>'+'<button class="chp sc" data-tx="nw" data-g="'+esc(g.k)+'">+ חדשה</button></div></div>';
  h+='<div class="f"><button class="btn sec" data-tx="skp" title="דילוג">'+ic('skip',18)+'<span>דילוג</span></button>'+((TX.hist||[]).length?'<button class="btn sec" data-tx="prv" title="חזרה">'+ic('bck',18)+'<span>חזרה</span></button>':'')+(gl.some(function(x){return !TX.ok[x.k]&&TX.as[x.k]})?'<button class="btn sec" data-tx="okall" title="אישור כל ההצעות">'+ic('check',18)+'<span>אשר הכל</span></button>':'')+'</div>';
  return h}
function TXUI(){var h='<div class="c"><b>'+(TX.bal?'מילוי המאזן מקבצים':'סיווג הוצאות '+MN[S.m-1]+' '+S.y)+'</b><div class="hint" style="margin:4px 0 0">הקבצים נקראים רק במכשיר שלכם. נשמרים רק הסכומים לכל סעיף וכללי הסיווג, לא פירוט העסקאות.</div></div>';
  if(TX.err)h+='<div class="c" style="border:1px solid var(--bd)">'+esc(TX.err)+'</div>';
  if(TX.step===1){
    h+='<div class="c"><b>שלב 1: בחירת קבצים</b><div class="hint" style="margin:4px 0 8px">'+(TX.bal?'אפשר לבחור כמה קבצים יחד: חודשיים של פירוט אשראי ושל דפי בנק (Excel, CSV או קובץ שיוצא מהבנק).':'אפשר לבחור כמה קבצים יחד: פירוט אשראי של כל הכרטיסים ודף חשבון בנק (Excel או CSV).')+'</div><label id="txdz" class="dz"><b>גוררים לכאן את הקבצים</b><small>או לוחצים לבחירה</small><input type="file" id="txf" accept=".xls,.xlsx,.csv" multiple hidden></label>'+(TX.busy?'<p class="hint">קורא קבצים…</p>':'')+
    (TX.files.length?'<ul style="margin:10px 0 0;padding-inline-start:18px">'+TX.files.map(function(f){return '<li>'+esc(f.nm)+' <small class="hint">('+f.n+' תנועות'+(f.acc?' · חשבון '+esc(f.acc):'')+')</small></li>'}).join('')+'</ul>':'')+'</div>';
    if(TX.bal&&TX.ents.length){txIn(TX.ents[0]);h+='<div class="c"><b>אילו חודשים לכלול?</b><div class="hint" style="margin:4px 0 6px">מומלץ חודשיים שלמים. החודש הנוכחי בדרך כלל חלקי.</div>'+txPers().map(function(x){return '<label class="r" style="border:0"><span>'+esc(txPL(x.p))+' <small class="hint">'+x.n+' תנועות</small></span><input type="checkbox" data-tx="pm" data-v="'+x.p+'"'+(TX.pm[x.p]?' checked':'')+'></label>'}).join('')+'</div>'}
    if(TX.ents.length){var gl=txGroups();h+='<div class="f"><button class="btn" data-tx="go">המשך לסיווג ('+gl.length+' בתי עסק)</button><button class="btn sec" data-tx="clr" title="ניקוי">'+ic('xx',18)+'<span>ניקוי</span></button></div>'}
    return h+'<div class="f" style="margin-top:8px">'+txBack()+'</div>'}
  if(TX.step===2){var gl2=txGroups();
    if(TX.mode!=='list')return h+txCard(gl2)+'<div class="f" style="margin-top:8px"><button class="btn sec" data-tx="back" title="חזרה לקבצים">'+ic('bck',18)+'<span>חזרה</span></button></div>';
    var un=gl2.filter(function(g){return !TX.as[g.k]}),oe=txOpts(false),oi=txOpts(true),ty=TX.ty||'';
    var out=!TX.bal?TX.ents.filter(function(e){return !txIn(e)}).length:0;
    h+='<div class="c"><div style="display:flex;justify-content:space-between;align-items:center"><b>שלב 2: שיוך לקטגוריות</b><button class="btn sec" data-tx="mcard" style="padding:4px 10px" title="תצוגת כרטיסים">'+ic('cards',18)+'<span>כרטיסים</span></button></div><div class="hint" style="margin:4px 0">'+(un.length?'נותרו '+un.length+' בתי עסק לשיוך':'הכל משויך')+'. מה שנלמד כאן יוצע אוטומטית בפעם הבאה.</div>'+
    (out?'<label class="hint"><input type="checkbox" data-tx="all"'+(TX.all?' checked':'')+'> כולל '+out+' תנועות מחוץ לתקופה</label>':'')+
    '<div class="f" style="margin-top:8px"><button class="sg'+(TX.view==='u'?' on':'')+'" data-tx="vu"><span>לא משויכים</span><small>'+un.length+'</small></button><button class="sg'+(TX.view==='a'?' on':'')+'" data-tx="va"><span>הכל</span><small>'+gl2.length+'</small></button></div></div>';
    var show=(TX.view==='u'?un:gl2).filter(function(g){return !ty||(ty==='i')===!!g.inc});
    h+='<div class="c">'+(show.length?show.map(function(g){var cur=TX.as[g.k]||'',o=(g.inc?oi:oe);if(txIsOt(cur))o=o.replace('<option value="__ot">','<option value="'+esc(cur)+'" selected>'+esc(txAsLbl(cur))+'</option><option value="__ot">');else o=o.replace('value="'+esc(cur)+'"','value="'+esc(cur)+'" selected');
      var f2=TX.addFor===g.k?txAddForm(g):TX.otFor===g.k?txOtForm(g):'';
      return '<div class="r" style="flex-wrap:wrap"><label style="flex:1 1 140px">'+esc(g.nm)+'<small>'+(g.sub?new Date(g.d1).toLocaleDateString('he-IL',{day:'numeric',month:'numeric'})+' · ':g.n+' תנועות · ')+fm(g.t)+(g.inc?' · הכנסה':'')+(g.sk==='card'?' · נראה כחיוב כרטיס':g.sk==='cash'?' · נראה כמשיכת מזומן':!g.sk&&!g.inc&&TXCARD.test(g.nm)?' · חיוב כרטיס אשראי: כדאי להעלות גם את פירוט האשראי':'')+'</small></label><select data-tx="as" data-g="'+esc(g.k)+'" style="flex:1 1 150px">'+o+'</select>'+(g.can&&!g.sub?'<button class="lk" data-tx="spl" data-g="'+esc(g.base)+'">לשייך כל תנועה בנפרד</button>':g.sub?'<button class="lk" data-tx="mrg" data-g="'+esc(g.base)+'">איחוד</button>':'')+f2+'</div>'}).join(''):'<p class="hint" style="margin:0">אין כאן שורות.</p>')+'</div>';
    return h+'<div class="f"><button class="btn" data-tx="sum"'+(un.length?' disabled':'')+' title="לסיכום">'+ic('check',18)+'<span>סיכום</span></button><button class="btn sec" data-tx="back" title="חזרה">'+ic('bck',18)+'<span>חזרה</span></button></div>'+(un.length?'<p class="hint">כדי להמשיך צריך לשייך כל שורה, או לבחור "לא נספר".</p>':'')}
  if(TX.step===4)return txEnvUI();
  var sm=txSum(),rows='';
  if(TX.bal){var ps=Object.keys(TX.pm).filter(function(p){return TX.pm[p]}).map(Number).sort(function(a,b){return a-b}),ks=Object.keys(sm.m);
    h+='<div class="c"><b>שלב 3: סיכום למאזן</b><div class="hint" style="margin:4px 0 8px">'+(ps.length?'לכל סעיף יירשמו הסכומים של '+ps.map(txPL).join(' ו')+', והממוצע יחושב במאזן. סעיפים שכבר מולאו בהם יוחלפו. אפשר לעדכן סכומים אחר כך.':'לא נבחרו חודשים.')+'</div>'+
    (ks.length?ks.map(function(k){var a=sm.m[k],av=ps.reduce(function(s,p){return s+n(a[p])},0)/(ps.length||1);return '<div class="r"><label>'+esc(k.split('|')[1])+'<small>'+esc(k.split('|')[0])+' · '+ps.map(function(p){return fm(n(a[p]))}).join(' · ')+'</small></label><b>'+fm(av)+'</b></div>'}).join(''):'<p class="hint">אין סכומים לרישום.</p>')+
    (sm.ot?'<p class="hint">הוצאות חד-פעמיות ('+fm(sm.ot)+') לא נכללו בממוצע.</p>':'')+'</div>';
    return h+'<div class="f"><button class="btn" data-tx="fin"'+(ks.length?'':' disabled')+' title="עדכון המאזן">'+ic('check',18)+'<span>עדכון המאזן</span></button><button class="btn sec" data-tx="go" title="חזרה לסיווג">'+ic('nxt',18)+'<span>המשך</span></button></div>'}
  h+='<div class="c"><b>שלב 3: סיכום וסיום חודש</b><div class="hint" style="margin:4px 0 8px">הסכומים יירשמו כביצוע בפועל בסעיפים. סעיפים שכבר הוזנו בהם סכום יתעדכנו, ואפשר לשנות אותם אחר כך.</div>';
  [['i','הכנסות'],['e','הוצאות']].forEach(function(p){var o=sm[p[0]],ky=Object.keys(o);if(!ky.length)return;rows+='<div class="sgh"><b>'+p[1]+'</b></div>'+ky.map(function(k){var old=n(st('act')[k]);return '<div class="r"><label>'+esc(k.split('|')[1])+'<small>'+esc(k.split('|')[0])+(old&&Math.round(old)!==o[k]?' · היה '+fm(old):'')+'</small></label><b>'+fm(o[k])+'</b></div>'}).join('')});
  h+=(rows||'<p class="hint">אין סכומים לרישום.</p>')+'<div class="r"><label><b>יתרה</b></label><b class="'+(sm.ti-sm.te<0?'neg':'')+'">'+fm(sm.ti-sm.te)+'</b></div></div>';
  var has=txHas();if(has)h+='<div class="c"><b>יש כבר נתונים בחודש הזה</b><div class="chs"><button class="chp'+(TX.im==='add'?' on':'')+'" data-tx="im" data-v="add">להוסיף לנתונים הקיימים</button><button class="chp'+(TX.im==='new'?' on':'')+'" data-tx="im" data-v="new">למלא הכל מחדש</button></div><div class="hint" style="margin-top:6px">הוספה מצטרפת לסכומים שכבר הוזנו. מילוי מחדש מחליף אותם (מעטפות לא נמחקות).</div></div>';
  return h+'<div class="f"><button class="btn" data-tx="fin"'+(has&&!TX.im?' disabled':'')+' title="אישור הסכומים והמשך למעטפות">'+ic('check',18)+'<span>אישור והמשך</span></button><button class="btn sec" data-tx="go" title="חזרה לסיווג">'+ic('nxt',18)+'<span>המשך</span></button></div>'}
function txSum(){var gl=txGroups(),e={},i={},te=0,ti=0,m={},ot=0;
  if(TX.bal){var gm={};gl.forEach(function(g){gm[g.k]=g});
    TX.ents.forEach(function(en,ix){if(!txIn(en))return;var inc=en.b&&en.a<0,gk=txEK(en,ix),v=TX.as[gk];if(!v||v==='x'||v==='__env')return;var a=inc?-en.a:en.a;if(txIsOt(v)){ot+=inc?-a:a;return}var p=txPer(en);(m[v]=m[v]||{})[p]=(m[v][p]||0)+a});
    Object.keys(m).forEach(function(k){Object.keys(m[k]).forEach(function(p){m[k][p]=Math.round(m[k][p])})});return{m:m,ot:Math.round(ot),e:e,i:i,te:0,ti:0}}
  gl.forEach(function(g){var v=TX.as[g.k];if(!v||v==='x'||v==='__env')return;v=txVK(v);var t=Math.round(g.t);if(g.inc){i[v]=(i[v]||0)+t;ti+=t}else{e[v]=(e[v]||0)+t;te+=t}});
  return{e:e,i:i,te:te,ti:ti,m:m,ot:0}}
function txHas(){var a=S.act[ym()]||{};return Object.keys(a).some(function(x){var g=G.filter(function(q){return q.n===x.split('|')[0]})[0];if(g&&g.t==='i'&&n(a[x])===n(S.bud[x]))return false;return n(a[x])>0})}
function txFin(){var sm=txSum(),ur=S.ur=S.ur||{};
  if(TX.bal){var ps=Object.keys(TX.pm).filter(function(p){return TX.pm[p]}).map(Number).sort(function(a,b){return a-b});
    Object.keys(sm.m).forEach(function(k){S.mo[k]=ps.map(function(p){return n(sm.m[k][p])});rc(k)});
    TX.ents.forEach(function(){});}
  else{var k=ym(),a=S.act[k]=S.act[k]||{};
    if(TX.im==='new'){Object.keys(a).forEach(function(x){var pp=x.split('|');var gg=G.filter(function(q){return q.n===pp[0]})[0];if(!(gg&&segOf(gg,pp[1])==='מזומן'))delete a[x]})}
    [sm.e,sm.i].forEach(function(o){Object.keys(o).forEach(function(x){a[x]=(TX.im==='add'?n(a[x]):0)+o[x];if(x.indexOf('|חד-פעמי: ')>0){var p=x.split('|');S.cx=S.cx||{};var l=S.cx[p[0]]=S.cx[p[0]]||[];if(l.indexOf(p[1])<0)l.push(p[1])}})})}
  if(!TX.bal){var wd=0;txGroups().forEach(function(g){if(TX.as[g.k]==='__env'&&g.d2>wd)wd=g.d2});if(wd){S.env=S.env||{};var ev=S.env[ym()]=S.env[ym()]||{};if(!ev.w)ev.w=wd}}
  if(!TX.bal){var nl=[];txGroups().forEach(function(g){var v=TX.as[g.k];if(txIsOt(v)){var t=v.slice(5);nl.push('חד-פעמי: '+t+' ('+fm(g.t)+')'+(TX.od&&TX.od[t]?' - '+TX.od[t]:''))}});if(nl.length){S.note=S.note||{};var k2=ym();S.note[k2]=((S.note[k2]?S.note[k2]+'\n':'')+nl.join('\n'))}}
  txGroups().forEach(function(g){if(g.sub)return;var v=TX.as[g.k];if(v&&v!=='__new'&&!txIsOt(v)){delete ur[g.k];ur[g.k]=v}});
  var ks=Object.keys(ur);while(ks.length>500)delete ur[ks.shift()];
  var wasBal=TX.bal,wT=0,wD=0,wn=0;if(!wasBal){txGroups().forEach(function(g){if(TX.as[g.k]==='__env'){wT+=g.t;wn+=g.n;if(g.d2>wD)wD=g.d2}});S.seg='מזומן'}else S.tab='bal';
  var goEnv=!wasBal&&envKs().length>0;
  TX.ents=[];TX.files=[];TX.as={};TX.ok={};TX.hist=[];TX.sk=[];TX.pm=null;TX.bal=false;
  if(goEnv){TX.wT=Math.round(wT);TX.wn=wn;TX.wD=wD;TX.step=4;TX.ei=-1;var ev=(S.env=S.env||{})[ym()]=S.env[ym()]||{};if(!ev.w)ev.w=wD||Date.now();if(TX.wT&&!n(ev.wa))ev.wa=TX.wT;save();render();window.scrollTo(0,0);return}
  S.md=S.md||{};S.md[ym()]=Date.now();TX.open=false;TX.step=1;save();render();window.scrollTo(0,0)}
function txEnvUI(){var k=ym(),ks=envKs(),e=(S.env=S.env||{})[k]=S.env[k]||{},i=TX.ei,cT=0;ks.forEach(function(x){cT+=n(S.bud[x.k])});
  var h='<div class="c"><b>המעטפות של '+MN[S.m-1]+'</b></div>';
  if(TX.err)h+='<div class="c" style="border:1px solid var(--bd)">'+esc(TX.err)+'</div>';
  if(i<0){return h+'<div class="c"><b>כמה הכנסתם למעטפות?</b><div class="hint" style="margin:4px 0 8px">'+(TX.wT?'בקבצים זוהו '+TX.wn+' משיכות מזומן בסך '+fm(TX.wT)+'.':'לא זוהתה משיכת מזומן בקבצים. אפשר להזין ידנית.')+' בתקציב הוקצבו למעטפות '+fm(cT)+'.</div><input type="number" inputmode="decimal" id="txwa" value="'+(n(e.wa)||'')+'" placeholder="'+Math.round(cT)+'" style="width:100%;font-size:22px"></div>'+
    '<div class="f"><button class="btn" data-tx="env0">להתחלת הדיווח על המעטפות ('+ks.length+')</button><button class="btn sec" data-tx="envskip" title="אדווח אחר כך">'+ic('skip',18)+'<span>אחר כך</span></button></div>'}
  if(i>=ks.length)i=TX.ei=ks.length-1;var x=ks[i],av=n(S.bud[x.k])+envCarry(x.k,k),lf=(e.left||{})[x.k],mv=(e.mv||{})[x.k]||'carry',lfv=lf===undefined||lf===''?'':n(lf);
  h+='<div class="c"><div style="display:flex;justify-content:space-between"><b>מעטפה '+(i+1)+' מתוך '+ks.length+'</b></div><div class="pgb"><i style="width:'+Math.round(i*100/ks.length)+'%"></i></div></div>'+
   '<div class="tcard te"><span class="tbd">מעטפה</span><div class="tnm" style="margin-top:8px">'+esc(x.i)+'</div><div class="hint">'+esc(x.g.n)+'</div><div class="tam">'+fm(av)+'</div><div class="hint">זמין במעטפה'+(av>n(S.bud[x.k])?' (כולל '+fm(av-n(S.bud[x.k]))+' מהחודש שעבר)':'')+'</div></div>'+
   '<div class="c"><b>כמה נשאר במעטפה?</b><input type="number" inputmode="decimal" id="txel" min="0" value="'+lfv+'" placeholder="0" style="width:100%;font-size:22px;margin-top:6px"><div class="chs"><button class="chp sc" data-tx="envl" data-v="0">נוצל הכל</button><button class="chp sc" data-tx="envl" data-v="'+Math.round(av)+'">לא נגעתי</button></div>'+
   (lfv>0?'<div style="margin-top:10px"><small class="hint">מה עושים עם היתרה?</small><select id="txem" style="width:100%">'+'<option value="carry"'+(mv==='carry'?' selected':'')+'>נשארת במעטפה</option><option value="free"'+(mv==='free'?' selected':'')+'>לא מועברת</option>'+(envAnn(x.k)?'':ks.filter(function(y){return y.k!==x.k}).map(function(y){return '<option value="'+esc(y.k)+'"'+(mv===y.k?' selected':'')+'>להעביר ל'+esc(envLbl(y))+'</option>'}).join(''))+'</select>'+(envAnn(x.k)?'<div class="hint">מעטפה שנתית: היתרה נשמרת ולא מועברת למעטפה אחרת.</div>':'')+'</div>':'')+'</div>'+
   '<div class="f">'+(i>0?'<button class="btn sec" data-tx="envp" title="חזרה">'+ic('bck',18)+'<span>חזרה</span></button>':'')+'<button class="btn" data-tx="envn">'+(i===ks.length-1?'סיום החודש':'הבאה')+'</button></div>';return h}
function txEnvSave(){var k=ym(),ks=envKs(),e=S.env[k],i=TX.ei;if(i<0)return;var x=ks[i];if(!x)return;var el=document.getElementById('txel'),em=document.getElementById('txem');e.left=e.left||{};e.mv=e.mv||{};
  if(el&&el.value!=='')e.left[x.k]=Math.max(0,n(el.value));if(em)e.mv[x.k]=em.value}
function txRead(fl){fl=Array.prototype.slice.call(fl||[]);if(!fl.length)return;TX.busy=true;TX.err='';render();
    txLoad(function(){var left=fl.length,bad=[];fl.forEach(function(f){var fr=new FileReader();fr.onload=function(){try{var wb=txHtml(fr.result)||XLSX.read(new Uint8Array(fr.result),{type:'array',cellDates:true}),en=txFile(wb,f.name);
        if(!en.length)bad.push(f.name);else{TX.ents=TX.ents.concat(en);TX.files.push({nm:f.name,n:en.length,acc:wb.acc||''})}}catch(x){bad.push(f.name)}
        if(!--left){TX.busy=false;if(bad.length)TX.err='לא זוהו תנועות בקבצים: '+bad.join(', ')+'. ודאו שזה פירוט עסקאות עם עמודות תאריך וסכום.';TX.as={};TX.ok={};TX.pm=null;render()}};fr.onerror=function(){bad.push(f.name);if(!--left){TX.busy=false;render()}};fr.readAsArrayBuffer(f)})})}
function txAssign(gk,v){TX.as[gk]=v;TX.ok[gk]=1;(TX.hist=TX.hist||[]).push(gk);TX.cg='';TX.det=false;TX.otFor='';TX.addFor=''}
document.addEventListener('dragover',function(e){var z=e.target.closest&&e.target.closest('#txdz');if(z){e.preventDefault();z.classList.add('dzo')}});
document.addEventListener('dragleave',function(e){var z=e.target.closest&&e.target.closest('#txdz');if(z)z.classList.remove('dzo')});
document.addEventListener('drop',function(e){var z=e.target.closest&&e.target.closest('#txdz');if(z){e.preventDefault();z.classList.remove('dzo');txRead(e.dataTransfer.files)}else if(TX.open)e.preventDefault()});
document.addEventListener('change',function(e){var t=e.target;
  if(t.id==='txf'){txRead(t.files);return}
  var a=t.dataset&&t.dataset.tx;if(!a)return;
  if(a==='all'){TX.all=t.checked;TX.as={};TX.ok={};render()}
  else if(a==='pm'){TX.pm=TX.pm||{};TX.pm[t.dataset.v]=t.checked?1:0;TX.as={};TX.ok={}}
  else if(a==='em'){}
  else if(a==='as'){var y=window.scrollY,g=t.dataset.g;if(t.value==='__new'){TX.addFor=g;TX.otFor=''}else if(t.value==='__ot'){TX.otFor=g;TX.addFor=''}else{TX.addFor='';TX.otFor='';TX.as[g]=t.value;TX.ok[g]=1}render();window.scrollTo(0,y)}});
document.addEventListener('click',function(e){var b=e.target.closest('[data-tx]');if(!b||b.tagName==='SELECT'||(b.tagName==='INPUT'&&b.type!=='button'))return;var a=b.dataset.tx,y=window.scrollY,g=b.dataset.g;
  var R=function(k){render();window.scrollTo(0,k?y:0)};
  if((a==='open'||a==='openb')&&a==='open'&&n((S.md||{})[ym()]))return;
  if(a==='open'||a==='openb'){TX.open=true;TX.bal=a==='openb';if(TX.bal)S.tab='bal';TX.step=1;TX.err='';TX.im='';R()}
  else if(a==='close'){TX.open=false;TX.bal=false;render()}
  else if(a==='clr'){TX.ents=[];TX.files=[];TX.as={};TX.ok={};TX.pm=null;TX.err='';R(1)}
  else if(a==='go'){TX.step=2;R()}
  else if(a==='back'){TX.step=1;R()}
  else if(a==='vu'||a==='va'){TX.view=a==='vu'?'u':'a';R(1)}
  else if(a==='mlist'){TX.mode='list';R(1)}
  else if(a==='mcard'){TX.mode='card';R(1)}
  else if(a==='ty'){TX.ty=b.dataset.v;R(1)}
  else if(a==='sum'){TX.step=3;R()}
  else if(a==='fin')txFin();
  else if(a==='spl'){TX.sp[g]=true;R(1)}
  else if(a==='mrg'){TX.sp[g]=false;R(1)}
  else if(a==='im'){TX.im=b.dataset.v;R(1)}
  else if(a==='det'){TX.det=!TX.det;R(1)}
  else if(a==='grp'){TX.cg=b.dataset.v;R(1)}
  else if(a==='pick'){var cq=txCardCur();if(cq){txAssign(cq.k,b.dataset.v);R(1)}}
  else if(a==='skp'){var c2=txCardCur();if(c2){TX.sk=(TX.sk||[]).filter(function(k){return k!==c2.k});TX.sk.push(c2.k);TX.det=false;R(1)}}
  else if(a==='prv'){var hk=(TX.hist||[]).pop();if(hk){TX.ok[hk]=0;TX.sk=(TX.sk||[]).filter(function(k){return k!==hk});TX.cg='';R(1)}}
  else if(a==='okall'){Object.keys(TX.as).forEach(function(k){if(TX.as[k])TX.ok[k]=1});R()}
  else if(a==='env0'){var wa=document.getElementById('txwa');S.env[ym()].wa=wa?n(wa.value):0;TX.ei=0;save();R()}
  else if(a==='envskip'){TX.open=false;TX.step=1;save();render();window.scrollTo(0,0)}
  else if(a==='envl'){var el2=document.getElementById('txel');if(el2){el2.value=b.dataset.v;txEnvSave();R(1)}}
  else if(a==='envp'){txEnvSave();TX.ei--;save();R()}
  else if(a==='envn'){txEnvSave();var kk=envKs();if(TX.ei>=kk.length-1){envFinish(ym());S.md=S.md||{};S.md[ym()]=Date.now();TX.open=false;TX.step=1;S.seg='מזומן';save();render();window.scrollTo(0,0)}else{TX.ei++;save();R()}}
  else if(a==='ot'){TX.otFor=g;TX.addFor='';R(1)}
  else if(a==='nw'){TX.addFor=g;TX.otFor='';R(1)}
  else if(a==='otno'||a==='addno'){TX.otFor='';TX.addFor='';R(1)}
  else if(a==='otok'){var tx=((document.getElementById('txot')||{}).value||'').trim().slice(0,40);if(!tx){TX.err='נא לכתוב על מה הלך הכסף';R(1);return}TX.err='';var og=txGroups().filter(function(x){return x.k===g})[0];var dt=((document.getElementById('txotd')||{}).value||'').trim().slice(0,200);TX.od=TX.od||{};if(dt)TX.od[tx]=dt;txAssign(g,(og&&og.inc?'__oi:':'__ot:')+tx);R(1)}
  else if(a==='addok'){var gn=(document.getElementById('txng')||{}).value,nn=((document.getElementById('txnn')||{}).value||'').trim();
    if(!gn||!nn){TX.err='נא למלא את שם הסעיף';R(1);return}TX.err='';S.cx=S.cx||{};var l=S.cx[gn]=S.cx[gn]||[];if(l.indexOf(nn)<0)l.push(nn);
    txAssign(g,gn+'|'+nn);save();R(1)}});
function txCardCur(){var gl=txGroups(),ty=TX.ty||'',sk=TX.sk||[],q=gl.filter(function(g){return !TX.ok[g.k]&&(!ty||(ty==='i')===!!g.inc)});q=q.filter(function(g){return sk.indexOf(g.k)<0}).concat(q.filter(function(g){return sk.indexOf(g.k)>=0}));return q[0]}
