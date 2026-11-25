/* סיווג הוצאות מקבצי אשראי ועו"ש - עיבוד מקומי בדפדפן, נשמרים רק סכומים וכללי סיווג */
var TX={open:false,step:1,ents:[],files:[],as:{},all:false,view:'u',addFor:'',err:'',busy:false};
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
function txFile(wb,fname){var out=[];
  wb.SheetNames.forEach(function(sn){var rows=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,raw:true,defval:''}),h=-1,c={};
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
      sh.push({d:d,nm:nm2,a:a,b:bank?1:0,ct:c.ct>=0?String(r2[c.ct]||'').trim():''})}
    if(!bank){var ng=sh.filter(function(x){return x.a<0}).length;if(ng>sh.length/2)sh.forEach(function(x){x.a=-x.a})}
    out=out.concat(sh)});
  return out}
function txRng(){var sd=Math.min(28,Math.max(1,n(S.sd)||1));return[new Date(S.y,S.m-1,sd).getTime(),new Date(S.y,S.m,sd).getTime()-1]}
function txItems(){var o=[];G.forEach(function(g){its(g).forEach(function(i){o.push({k:g.n+'|'+i,g:g,i:i})})});return o}
function txFind(frs,inc){var it=txItems().filter(function(x){return inc?x.g.t==='i':x.g.t!=='i'});
  for(var a=0;a<frs.length;a++)for(var b=0;b<it.length;b++)if(it[b].i.indexOf(frs[a])>=0||it[b].g.n.indexOf(frs[a])>=0)return it[b].k;return ''}
function txValid(k){return txItems().some(function(x){return x.k===k})}
function txGroups(){var r=txRng(),gs={},cardAny=TX.ents.some(function(e){return !e.b});
  TX.ents.forEach(function(e){if(!TX.all&&(e.d<r[0]||e.d>r[1]))return;var inc=e.b&&e.a<0,key=(inc?'i':'e')+'|'+e.nm,g=gs[key]=gs[key]||{k:key,nm:e.nm,inc:inc,n:0,t:0,ct:e.ct,b:e.b,sk:''};
    g.n++;g.t+=inc?-e.a:e.a;if(e.b&&!inc){if(TXCARD.test(e.nm)&&cardAny)g.sk='card';else if(TXCASH.test(e.nm))g.sk='cash'}});
  var l=Object.keys(gs).map(function(k){return gs[k]});
  l.forEach(function(g){if(TX.as[g.k]===undefined){var v='',ur=S.ur||{};
    if(g.sk)v='x';else{var rk=ur[g.k];if(rk&&txValid(rk))v=rk;
      if(!v)for(var i=0;i<TXD.length&&!v;i++)if(TXD[i][0].test(g.nm)&&!g.inc)v=txFind(TXD[i][1],false);
      if(!v&&g.ct&&!g.inc)for(var j=0;j<TXC.length&&!v;j++)if(TXC[j][0].test(g.ct))v=txFind(TXC[j][1],false)}
    TX.as[g.k]=v}});
  return l.sort(function(a,b){return b.t-a.t})}
function txOpts(inc){var s='<option value="">בחירה…</option>';
  G.forEach(function(g){if((g.t==='i')!==inc)return;var it=its(g);if(!it.length)return;s+='<optgroup label="'+esc(g.n)+'">'+it.map(function(i){return '<option value="'+esc(g.n+'|'+i)+'">'+esc(i)+'</option>'}).join('')+'</optgroup>'});
  if(inc)return s+'<option value="x">לא נספר כהכנסה</option><option value="__new">+ סעיף חדש…</option>';
  return s+'<option value="x">לא נספר (העברה/חיוב כפול)</option><option value="__new">+ קטגוריה חדשה…</option>'}
function txBtn(){if(STAGE<2||RO)return '';var done=n((S.md||{})[ym()]);
  return '<div class="c"><b>העלאת פירוט אשראי ועו"ש</b><div class="hint" style="margin:4px 0 8px">'+(done?'אפשר להעלות שוב ולעדכן את הסיווג.':'בסוף החודש מעלים את קבצי האקסל מחברת האשראי ומהבנק, מסווגים את ההוצאות לקטגוריות התקציב, וממשיכים לדיווח על המעטפות.')+'</div><button class="btn" data-tx="open">להעלאת קבצים וסיווג</button></div>'}
function txBack(){return '<button class="btn sec" data-tx="close">חזרה למעקב</button>'}
function TXUI(){var h='<div class="c"><b>סיווג הוצאות '+MN[S.m-1]+' '+S.y+'</b><div class="hint" style="margin:4px 0 0">הקבצים נקראים רק במכשיר שלכם. נשמרים רק הסכומים לכל סעיף וכללי הסיווג, לא פירוט העסקאות.</div></div>';
  if(TX.err)h+='<div class="c" style="border:1px solid var(--bd)">'+esc(TX.err)+'</div>';
  if(TX.step===1){
    h+='<div class="c"><b>שלב 1: בחירת קבצים</b><div class="hint" style="margin:4px 0 8px">אפשר לבחור כמה קבצים יחד: פירוט אשראי של כל הכרטיסים ודף חשבון בנק (Excel או CSV).</div><label id="txdz" class="dz"><b>גוררים לכאן את הקבצים</b><small>או לוחצים לבחירה</small><input type="file" id="txf" accept=".xls,.xlsx,.csv" multiple hidden></label>'+(TX.busy?'<p class="hint">קורא קבצים…</p>':'')+
    (TX.files.length?'<ul style="margin:10px 0 0;padding-inline-start:18px">'+TX.files.map(function(f){return '<li>'+esc(f.nm)+' <small class="hint">('+f.n+' תנועות)</small></li>'}).join('')+'</ul>':'')+'</div>';
    if(TX.ents.length){var gl=txGroups();h+='<div class="f"><button class="btn" data-tx="go">המשך לסיווג ('+gl.length+' בתי עסק)</button><button class="btn sec" data-tx="clr">ניקוי</button></div>'}
    return h+'<div class="f" style="margin-top:8px">'+txBack()+'</div>'}
  if(TX.step===2){var gl2=txGroups(),un=gl2.filter(function(g){return !TX.as[g.k]}),r=txRng(),out=TX.ents.filter(function(e){return e.d<r[0]||e.d>r[1]}).length,oe=txOpts(false),oi=txOpts(true);
    h+='<div class="c"><b>שלב 2: שיוך לקטגוריות</b><div class="hint" style="margin:4px 0">'+(un.length?'נותרו '+un.length+' בתי עסק לשיוך':'הכל משויך')+'. מה שנלמד כאן יוצע אוטומטית בחודש הבא.</div>'+
    (out?'<label class="hint"><input type="checkbox" data-tx="all"'+(TX.all?' checked':'')+'> כולל '+out+' תנועות מחוץ לתקופה ('+new Date(r[0]).toLocaleDateString('he-IL')+' עד '+new Date(r[1]).toLocaleDateString('he-IL')+')</label>':'')+
    '<div class="f" style="margin-top:8px"><button class="sg'+(TX.view==='u'?' on':'')+'" data-tx="vu"><span>לא משויכים</span><small>'+un.length+'</small></button><button class="sg'+(TX.view==='a'?' on':'')+'" data-tx="va"><span>הכל</span><small>'+gl2.length+'</small></button></div></div>';
    var show=TX.view==='u'?un:gl2;
    h+='<div class="c">'+(show.length?show.map(function(g){var cur=TX.as[g.k]||'',o=(g.inc?oi:oe).replace('value="'+esc(cur)+'"','value="'+esc(cur)+'" selected'),
      f2=TX.addFor===g.k?txAddForm(g):'';
      return '<div class="r" style="flex-wrap:wrap"><label style="flex:1 1 140px">'+esc(g.nm)+'<small>'+g.n+' תנועות · '+fm(g.t)+(g.inc?' · הכנסה':'')+(g.sk==='card'?' · נראה כחיוב כרטיס':g.sk==='cash'?' · נראה כמשיכת מזומן':'')+'</small></label><select data-tx="as" data-g="'+esc(g.k)+'" style="flex:1 1 150px">'+o+'</select>'+f2+'</div>'}).join(''):'<p class="hint" style="margin:0">אין כאן שורות.</p>')+'</div>';
    return h+'<div class="f"><button class="btn" data-tx="sum"'+(un.length?' disabled':'')+'>לסיכום</button><button class="btn sec" data-tx="back">חזרה</button></div>'+(un.length?'<p class="hint">כדי להמשיך צריך לשייך כל שורה, או לבחור "לא נספר".</p>':'')}
  var sm=txSum(),ks=Object.keys(sm.e).concat(Object.keys(sm.i)),rows='';
  h+='<div class="c"><b>שלב 3: סיכום וסיום חודש</b><div class="hint" style="margin:4px 0 8px">הסכומים יירשמו כביצוע בפועל בסעיפים. סעיפים שכבר הוזנו בהם סכום יתעדכנו.</div>';
  [['i','הכנסות'],['e','הוצאות']].forEach(function(p){var o=sm[p[0]],ky=Object.keys(o);if(!ky.length)return;rows+='<div class="sgh"><b>'+p[1]+'</b></div>'+ky.map(function(k){var old=n(st('act')[k]);return '<div class="r"><label>'+esc(k.split('|')[1])+'<small>'+esc(k.split('|')[0])+(old&&Math.round(old)!==o[k]?' · היה '+fm(old):'')+'</small></label><b>'+fm(o[k])+'</b></div>'}).join('')});
  h+=(ks.length?rows:'<p class="hint">אין סכומים לרישום.</p>')+'<div class="r"><label><b>יתרה</b></label><b class="'+(sm.ti-sm.te<0?'neg':'')+'">'+fm(sm.ti-sm.te)+'</b></div></div>';
  return h+'<div class="f"><button class="btn" data-tx="fin">אישור וסיום החודש, מעבר למעטפות</button><button class="btn sec" data-tx="go">חזרה לסיווג</button></div>'}
function txAddForm(g){var gs=G.filter(function(x){return (x.t==='i')===!!g.inc}).map(function(x){return '<option value="'+esc(x.n)+'">'+esc(x.n)+'</option>'}).join('');
  return '<div style="flex:1 1 100%;display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"><select id="txng">'+gs+'</select><input id="txnn" placeholder="שם הסעיף החדש" style="flex:1 1 120px"><button class="btn" data-tx="addok" data-g="'+esc(g.k)+'">הוספה</button><button class="btn sec" data-tx="addno">ביטול</button></div>'}
function txSum(){var gl=txGroups(),e={},i={},te=0,ti=0;
  gl.forEach(function(g){var v=TX.as[g.k];if(!v||v==='x')return;var t=Math.round(g.inc?g.t:g.t);if(g.inc){i[v]=(i[v]||0)+t;ti+=t}else{e[v]=(e[v]||0)+t;te+=t}});
  return{e:e,i:i,te:te,ti:ti}}
function txFin(){var sm=txSum(),k=ym(),a=S.act[k]=S.act[k]||{},ur=S.ur=S.ur||{};
  [sm.e,sm.i].forEach(function(o){Object.keys(o).forEach(function(x){a[x]=o[x]})});
  txGroups().forEach(function(g){var v=TX.as[g.k];if(v&&v!=='x'&&v!=='__new'){delete ur[g.k];ur[g.k]=v}else if(v==='x'&&g.sk){delete ur[g.k];ur[g.k]='x'}});
  var ks=Object.keys(ur);while(ks.length>500)delete ur[ks.shift()];
  S.md=S.md||{};S.md[k]=Date.now();S.seg='מזומן';TX.open=false;TX.ents=[];TX.files=[];TX.as={};TX.step=1;save();render();window.scrollTo(0,0)}
function txRead(fl){fl=Array.prototype.slice.call(fl||[]);if(!fl.length)return;TX.busy=true;TX.err='';render();
    txLoad(function(){var left=fl.length,bad=[];fl.forEach(function(f){var fr=new FileReader();fr.onload=function(){try{var wb=XLSX.read(new Uint8Array(fr.result),{type:'array',cellDates:true}),en=txFile(wb,f.name);
        if(!en.length)bad.push(f.name);else{TX.ents=TX.ents.concat(en);TX.files.push({nm:f.name,n:en.length})}}catch(x){bad.push(f.name)}
        if(!--left){TX.busy=false;if(bad.length)TX.err='לא זוהו תנועות בקבצים: '+bad.join(', ')+'. ודאו שזה פירוט עסקאות עם עמודות תאריך וסכום.';TX.as={};render()}};fr.onerror=function(){bad.push(f.name);if(!--left){TX.busy=false;render()}};fr.readAsArrayBuffer(f)})})}
document.addEventListener('dragover',function(e){var z=e.target.closest&&e.target.closest('#txdz');if(z){e.preventDefault();z.classList.add('dzo')}});
document.addEventListener('dragleave',function(e){var z=e.target.closest&&e.target.closest('#txdz');if(z)z.classList.remove('dzo')});
document.addEventListener('drop',function(e){var z=e.target.closest&&e.target.closest('#txdz');if(z){e.preventDefault();z.classList.remove('dzo');txRead(e.dataTransfer.files)}else if(TX.open)e.preventDefault()});
document.addEventListener('change',function(e){var t=e.target;
  if(t.id==='txf'){txRead(t.files);return}
  var a=t.dataset&&t.dataset.tx;if(!a)return;
  if(a==='all'){TX.all=t.checked;TX.as={};render()}
  else if(a==='as'){var y=window.scrollY,g=t.dataset.g;if(t.value==='__new'){TX.addFor=g}else{TX.addFor='';TX.as[g]=t.value}render();window.scrollTo(0,y)}});
document.addEventListener('click',function(e){var b=e.target.closest('[data-tx]');if(!b||b.tagName==='SELECT'||b.tagName==='INPUT')return;var a=b.dataset.tx,y=window.scrollY;
  if(a==='open'){TX.open=true;TX.step=1;TX.err='';render();window.scrollTo(0,0)}
  else if(a==='close'){TX.open=false;render()}
  else if(a==='clr'){TX.ents=[];TX.files=[];TX.as={};TX.err='';render()}
  else if(a==='go'){TX.step=2;render();window.scrollTo(0,0)}
  else if(a==='back'){TX.step=1;render()}
  else if(a==='vu'||a==='va'){TX.view=a==='vu'?'u':'a';render();window.scrollTo(0,y)}
  else if(a==='sum'){TX.step=3;render();window.scrollTo(0,0)}
  else if(a==='fin')txFin();
  else if(a==='addno'){TX.addFor='';render();window.scrollTo(0,y)}
  else if(a==='addok'){var gn=(document.getElementById('txng')||{}).value,nn=((document.getElementById('txnn')||{}).value||'').trim();
    if(!gn||!nn){TX.err='נא למלא את שם הסעיף';render();return}TX.err='';S.cx=S.cx||{};var l=S.cx[gn]=S.cx[gn]||[];if(l.indexOf(nn)<0)l.push(nn);
    TX.as[b.dataset.g]=gn+'|'+nn;TX.addFor='';save();render();window.scrollTo(0,y)}});
