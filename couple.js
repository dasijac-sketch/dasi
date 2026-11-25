/* אפליקציית הזוג: נטען לפי הקישור האישי /c/<קוד> */
(function(){
var TOKEN=location.pathname.split('/')[2]||'',API='/api/c/'+encodeURIComponent(TOKEN);
RO=true;
var dirty=false,busy=false,timer=null;
var app=document.getElementById('app'),nav=document.getElementById('nav');
function status(t){var e=document.getElementById('sv');if(e)e.textContent=t||''}
var OB=-1,DEFP=null,INSTH=false;try{if(!localStorage.getItem('ob1'))OB=0;if(localStorage.getItem('insx'))INSTH=true}catch(e){}
function obx(){OB=-1;try{localStorage.setItem('ob1','1')}catch(e){}}
function obUI(){if(OB<0)return '';var P=[['ברוכים הבאים','זה המקום האישי שלכם לניהול התקציב. נכנסים ישירות מהקישור, בלי סיסמה, וכל מה שממלאים נשמר אוטומטית.'],
 ['מה ממלאים עכשיו','מאזן: הכנסות והוצאות של חודשיים, כל אחד מבני הזוג מדרג כל הוצאה, ואחר כך חסכונות, הלוואות וביטוחים. בסוף לוחצים "הושלם".'],
 ['ומה אחר כך','המאמנת בונה עבורכם תקציב, ומשם מעקב חודשי פשוט: מזינים מה קרה בפועל ורואים איפה אתם עומדים.']];
 return '<div class="c ob"><div class="obs">'+P.map(function(x,i){return '<i class="'+(i===OB?'on':'')+'"></i>'}).join('')+'</div><b>'+P[OB][0]+'</b><p>'+P[OB][1]+'</p><div class="f"><button class="btn" data-a="obn">'+(OB<2?'הבא':'מתחילים')+'</button><button class="btn sec" data-a="obx">דילוג</button></div></div>'}
function instUI(){if(INSTH||OB>=0)return '';var ios=/iphone|ipad|ipod/i.test(navigator.userAgent),sa=window.matchMedia&&matchMedia('(display-mode: standalone)').matches||navigator.standalone;if(sa)return '';
 if(DEFP)return '<div class="c"><b>התקנה כאפליקציה</b><div class="hint" style="margin:4px 0 8px">אייקון על המסך הראשי ופתיחה במסך מלא.</div><div class="f"><button class="btn" data-a="inst">התקנה</button><button class="btn sec" data-a="insx">לא עכשיו</button></div></div>';
 if(ios)return '<div class="c"><b>הוספה למסך הבית</b><div class="hint" style="margin:4px 0 8px">בספארי לוחצים על כפתור השיתוף ואז על "הוספה למסך הבית".</div><button class="btn sec" data-a="insx">הבנתי</button></div>';return ''}
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();DEFP=e;try{render()}catch(x){}});
if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(function(){});
function tabs(){var o=openTk(),t=[['home','בית'],['tasks','משימות ואתגרים'+(o?' ('+o+')':'')],['bal','מאזן']];if(STAGE>=2)t.push(['bud','התקציב'],['mon','מעקב חודשי'],['rl','הכללים'],['yr','סיכום שנתי']);if(STAGE>=2)t=t.filter(function(x){return x[0]!=='bal'});t.push(['sv','חסכונות והלוואות'],['yc','מעגל השנה'],['ins','ביטוחים ויעדים'],['me','אזור אישי']);return t}
var LASTB='',PINIT=false;function bdJ(){return JSON.stringify({bud:S.bud0,cs:S.cs,sc:S.sc||[]})}
function budgetBody(){return STAGE>=2&&bdJ()!==LASTB?{bud:S.bud0,cs:S.cs,sc:S.sc||[]}:undefined}
function payload(){return{nw:S.nw||{},sn:n(S.sn),aic:S.aic||{},sd:n(S.sd),bal:S.bal,mo:S.mo,rt:S.rt,fc:S.fc||{},fm:S.fm||{},pm:S.pm||{},env:S.env||{},yc:S.yc||{},yx:S.yx||{},dn:n(S.dn),cx:S.cx,L:S.L,act:S.act,note:S.note,chd:S.chd,ppl:n(S.ppl),md:S.md||{},mt:S.mt||{},ur:S.ur||{}}}
function apply(d){
  PWSET=d.pwset?1:0;PROF=d.profile||{};
  var keep={y:S.y,m:S.m,tab:S.tab,open:S.open,vs:S.vs,seg:S.seg};
  S=Object.assign(newState(),d.state||{},keep);
  S.L=Object.assign(defL(),(d.state&&d.state.L)||{});
  S.cs=Object.assign({hid:[],hg:[],ng:[],ni:{}},d.cs||{});bG();S.bud0=d.bud||{};S.sc=d.sc||[];if(S.vs==null){try{S.vs=localStorage.getItem('vs')||''}catch(e){S.vs=''}}if(!S.sc.some(function(z){return z.id===S.vs}))S.vs='';useVs();LASTB=bdJ();S.fam=d.name||'';STAGE=d.stage||1;RO=STAGE<2;INBOX=d.msgs||[];
  if(!PINIT){var P1=perNow(S.sd);S.y=P1.y;S.m=P1.m;PINIT=true}
  var chg=autoInc();chg=stampU()||chg;chg=snapNw()||chg;chg=autoYr()||chg;if(chg)save();
  if(tabs().map(function(x){return x[0]}).indexOf(S.tab)<0)S.tab='home';
}
function render(){
  nav.innerHTML=tabs().map(function(t){return '<button data-a="tab" data-id="'+t[0]+'" class="'+(S.tab===t[0]?'on':'')+'">'+navLbl(t[0],t[1])+'</button>'}).join('');
  var f={me:meUI,home:home,tasks:tasksView,bal:bal,bud:bud,mon:mon,rl:mgmtRulesUI,yr:yr,sv:tvs,yc:ycTab,ins:tin}[S.tab]||home;
  app.innerHTML=(S.tab==='home'?obUI()+instUI():'')+(/^(home|bud|mon|yr)$/.test(S.tab)&&STAGE>=2?vsUI():'')+f()+(/^(bal|sv|ins)$/.test(S.tab)?doneUI():'')+fabUI();
  hintFold(app);
}
window.render=render;window.save=save;
function save(){dirty=true;clearTimeout(timer);timer=setTimeout(flush,700);status('שומר...')}
function flush(){
  clearTimeout(timer);timer=null;
  if(busy){timer=setTimeout(flush,400);return}
  busy=true;dirty=false;var bb=budgetBody(),sent=bdJ();
  fetch(API+'/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({state:payload(),budget:bb})})
    .then(function(r){if(!r.ok)throw 0;return r.json()})
    .then(function(){busy=false;if(bb)LASTB=sent;if(dirty)flush();else status('✓ נשמר')})
    .catch(function(){busy=false;dirty=true;status('השמירה נכשלה, מנסה שוב...');timer=setTimeout(flush,5000)});
}
function typing(){var a=document.activeElement;return a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)}
function refresh(){
  if(dirty||busy||typing())return;
  fetch(API,{cache:'no-store'}).then(function(r){return r.ok?r.json():null}).then(function(d){if(!d||dirty||busy||typing())return;apply(d);render()}).catch(function(){});
}
document.addEventListener('change',function(e){
  var t=e.target,d=t.dataset;
  if(d.s==='bud'&&RO)return;
  if(t.id==='vs'){S.vs=t.value;try{localStorage.setItem('vs',S.vs)}catch(e){}useVs();render();return}
  if(t.id==='ms'){S.m=+t.value;render();return}
  if(d.s==='prof'){PROF[d.k]=t.value.trim();var pr=document.getElementById('pfr');fetch(API+'/profile',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({profile:PROF})}).then(function(r){if(pr)pr.textContent=r.ok?'✓ נשמר':'הפרט לא תקין (בדקו מייל וטלפון)'}).catch(function(){if(pr)pr.textContent='השמירה נכשלה'});return}
  if(t.id==='sdd'){S.sd=+t.value;var P2=perNow(S.sd);S.y=P2.y;S.m=P2.m;save();render();return}
  if(t.id==='yr'){if(t.value){S.y=+t.value;render()}return}
  if(d.s==='envl'||d.s==='envm'){var ee=S.env=S.env||{};ee[d.e]=ee[d.e]||{};if(d.s==='envl'){(ee[d.e].left=ee[d.e].left||{})[d.k]=t.value===''?'':Math.max(0,n(t.value))}else{(ee[d.e].mv=ee[d.e].mv||{})[d.k]=t.value}save();return}
  if(d.s==='chd')S.chd[d.k]=t.checked?1:0;
  else if(d.s==='yc'){S.yc=S.yc||{};S.yc[d.k]=n(t.value)}
  else if(d.s==='ppl')S.ppl=n(t.value);
  else if(d.s==='act'){var k=ym();S.act[k]=S.act[k]||{};S.act[k][d.k]=n(t.value)}
  else if(d.s==='L'){var p=d.k.split('.');S.L[p[0]][+p[1]][p[2]]=d.ty==='n'?n(t.value):t.value;touchU(p[0],S.L[p[0]][+p[1]],p[2]);if(p[2]==='y'){save();render();return}}
  else if(d.s==='mo'){var ar=S.mo[d.k]=S.mo[d.k]||[];for(var q=0;q<+d.j;q++)if(ar[q]===undefined)ar[q]='';ar[+d.j]=t.value===''?'':n(t.value);rc(d.k)}
  else if(d.s==='bud'){S.bud[d.k]=n(t.value)}
  else if(d.s==='fm'){S.fm=S.fm||{};S.fm[d.k]=n(t.value)}
  else if(d.s==='pm'){S.pm=S.pm||{};S.pm[d.k]=t.value}
  else if(d.s==='fc'){S.fc=S.fc||{};S.fc[d.k]=t.value}
  else if(d.s==='rt'){var rr=S.rt[d.k]=S.rt[d.k]||{};rr[d.w]=t.value}
  else if(d.s==='bal')S.bal[d.k]=n(t.value);
  else if(t.id==='nt')S.note[ym()]=t.value;
  else return;
  save();
  setTimeout(function(){
    var a=document.activeElement,id=a&&a.dataset&&a.dataset.k?a.dataset.s+'#'+a.dataset.k+'#'+(a.dataset.j||a.dataset.w||''):null;
    render();
    if(id){var el=[].find.call(document.querySelectorAll('input[data-k],select[data-k]'),function(x){return x.dataset.s+'#'+x.dataset.k+'#'+(x.dataset.j||x.dataset.w||'')===id});if(el)el.focus()}
  },0);
});
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-a]');if(!b)return;var a=b.dataset.a;
  if(a==='tab')S.tab=b.dataset.id;
  else if(a==='tg')S.open[b.dataset.id]=!S.open[b.dataset.id];
  else if(a==='fill'&&false){G.forEach(function(g){its(g).forEach(function(i){var k=g.n+'|'+i;S.bud[k]=n(S.bal[k])})});save()}
  else if(a==='unl'){MU[ym()]=1;render();return}
  else if(a==='rel'){delete MU[ym()];render();return}
  else if(a==='md'){S.md=S.md||{};S.md[ym()]=Date.now();save()}
  else if(a==='umd'){S.md=S.md||{};delete S.md[ym()];save()}
  else if(a==='gt'){S.tab='tasks'}
  else if(a==='t37'){S.mt=S.mt||{};S.mt['x37'+ym()]={x:('להעביר '+fm(n(b.dataset.v))+' מההכנסה החריגה של החודש לחיסכון').slice(0,200),ts:Date.now()};save();render()}
  else if(a==='mta'){var ti=document.getElementById('mti'),tx=ti&&ti.value.trim();if(!tx)return;S.mt=S.mt||{};S.mt['m'+Date.now()]={x:tx.slice(0,200),ts:Date.now()}  ;save()}
  else if(a==='yxa'){var ys=document.getElementById('yxs').value,yn=document.getElementById('yxn').value.trim();if(!yn)return;S.yx=S.yx||{};S.yx[ys]=(S.yx[ys]||[]).concat(yn.slice(0,80));save()}
  else if(a==='envw'){S.env=S.env||{};(S.env[b.dataset.e]=S.env[b.dataset.e]||{}).w=Date.now();save()}
  else if(a==='envx'){if(S.env&&S.env[b.dataset.e])S.env[b.dataset.e].w=0;save()}
  else if(a==='envc'){S.env=S.env||{};S.env[b.dataset.e]=S.env[b.dataset.e]||{};envFinish(b.dataset.e);save()}
  else if(a==='envu'){envUndo(b.dataset.e);save()}
  else if(a==='seg'){S.seg=b.dataset.id}
  else if(a==='cus'){var cx=document.getElementById('cux'),tx=cx&&cx.value.trim(),cc=document.getElementById('cuc');if(!tx)return;if(cc&&cc.checked)tx+='\n\n'+cuSummary();
    fetch(API+'/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({x:tx})}).then(function(r){if(!r.ok)throw 1;CUM='✓ העדכון נשלח למאמנת';render()}).catch(function(){CUM='השליחה נכשלה, נסו שוב';render()});return}
  else if(a==='og'){S.open[b.dataset.id]=true}
  else if(a==='gm'){S.y=+b.dataset.y;S.m=+b.dataset.m;S.tab='mon'}
  else if(a==='obn'){OB++;if(OB>2)obx()}
  else if(a==='obx'){obx()}
  else if(a==='inst'&&DEFP){DEFP.prompt();DEFP=null;INSTH=true}
  else if(a==='insx'){INSTH=true;try{localStorage.setItem('insx','1')}catch(e){}}
  else if(a==='tkd'){S.chd[b.dataset.id]=S.chd[b.dataset.id]?0:1;save()}
  else if(a==='mtd'){var tid=b.dataset.id;if(S.mt&&S.mt[tid])delete S.mt[tid];else S.chd['hid:'+tid]=1;delete S.chd[tid];save()}
  else if(a==='dn'){S.dn=Date.now();save()}
  else if(a==='undn'){S.dn=0;save()}
  else if(a==='gocash'){S.seg='מזומן';S.tab='mon';render()}
  else if(a==='mpv'){S.m--;if(S.m<1){S.m=12;S.y--}render()}
  else if(a==='mnx'){S.m++;if(S.m>12){S.m=1;S.y++}render()}
  else if(a==='mcu'){var Pc=perNow(S.sd);S.y=Pc.y;S.m=Pc.m;render()}
  else if(a==='r37'){var v=Math.min(1e9,n(document.getElementById('r37').value)),o=document.getElementById('r37o');o.textContent=v>0?(v>10000?'מעל 10,000 ₪ כדאי להתייעץ עם המאמנת. לפי הכלל, ':'')+'לחיסכון '+fm(v*.7)+' · להעלאת רמת חיים '+fm(v*.3):'הזינו סכום'}
  else if(a==='yrk'){S.chd.yrk=Date.now();S.chd['yk'+new Date().getFullYear()]=1;save();render()}
  else if(a==='rmd'){S.chd['rm5'+ym()]=1;save()}
  else if(a==='nsn'){S.sn=Date.now();save();render()}
  else if(a==='dvc'){if(!confirm('לנתק את כל המכשירים האחרים? הם ייכנסו שוב עם הסיסמה.'))return;fetch(API+'/rotate',{method:'POST'}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){location.href='/c/'+encodeURIComponent(j.token)}).catch(function(){status('הפעולה נכשלה')})}
  else if(a==='pws'){var p1=document.getElementById('pw1').value,p2=document.getElementById('pw2').value,re=document.getElementById('ccr');
    if(!/^[\x21-\x7e\u05d0-\u05ea]{6,40}$/.test(p1)){re.textContent='הסיסמה צריכה להיות באורך 6 עד 40 תווים, בלי רווחים.';return}
    if(p1!==p2){re.textContent='שתי הסיסמאות לא זהות.';return}
    if(!confirm('להחליף את הסיסמה? הסיסמה הקודמת תפסיק לעבוד, והסיסמה החדשה לא תוצג באתר.'))return;
    fetch(API+'/code',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:p1})}).then(function(r){return r.json().then(function(j){return{ok:r.ok,s:r.status,j:j}})}).then(function(o){if(o.ok){PWSET=1;render();status('✓ הסיסמה הוחלפה')}else re.textContent=o.s===409?'הסיסמה כבר בשימוש, בחרו אחרת.':o.s===429?'יותר מדי ניסיונות, נסו מאוחר יותר.':'ההחלפה נכשלה'}).catch(function(){re.textContent='ההחלפה נכשלה'})}
  else if(a==='la'){S.L[b.dataset.l].push(b.dataset.y?{y:b.dataset.y,n:b.dataset.nm||''}:{});save()}
  else if(a==='ld'){S.L[b.dataset.l].splice(+b.dataset.i,1);save()}
  else if(a==='mo'){var ma=S.mo[b.dataset.id]=S.mo[b.dataset.id]||[];while(ma.length<2)ma.push('');ma.push('');save()}
  else if(a==='add'){var g=document.getElementById('cg').value,nm=document.getElementById('cn').value.trim();if(!nm)return;S.cx[g]=(S.cx[g]||[]).concat(nm);S.open[g]=true;save()}
  else return;
  render();
});
document.addEventListener('visibilitychange',function(){if(!document.hidden)refresh()});
window.addEventListener('pagehide',function(){if(dirty)fetch(API+'/state',{method:'PUT',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({state:payload()})})});
setInterval(refresh,60000);

fetch(API,{cache:'no-store'}).then(function(r){if(r.status===404)throw 'nf';if(!r.ok)throw 'err';return r.json()}).then(function(d){
  apply(d);status('✓ מחובר');render();
}).catch(function(e){
  status('');
  app.innerHTML=e==='nf'?'<div class="c">הקישור אינו תקין או שכבר אינו פעיל. פנו למאמנת לקבלת קישור חדש.</div>':'<div class="c">לא ניתן להתחבר כרגע. נסו לרענן את הדף בעוד רגע.</div>';
});
})();

document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.id==='mti'){e.preventDefault();var b=document.querySelector('[data-a=mta]');if(b)b.click()}});
