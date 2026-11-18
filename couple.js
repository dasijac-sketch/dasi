/* אפליקציית הזוג: נטען לפי הקישור האישי /c/<קוד> */
(function(){
var TOKEN=location.pathname.split('/')[2]||'',API='/api/c/'+encodeURIComponent(TOKEN);
RO=true;
var dirty=false,busy=false,timer=null;
var app=document.getElementById('app'),nav=document.getElementById('nav');
function status(t){var e=document.getElementById('sv');if(e)e.textContent=t||''}
function tabs(){var o=openTk(),t=[['home','בית'],['tasks','משימות ואתגרים'+(o?' ('+o+')':'')],['bal','מאזן']];if(STAGE>=2)t.push(['bud','התקציב'],['mon','מעקב חודשי'],['yr','סיכום שנתי']);if(STAGE>=2)t=t.filter(function(x){return x[0]!=='bal'});t.push(['sv','חסכונות והלוואות'],['ins','ביטוחים ויעדים']);return t}
function budgetBody(){return STAGE>=3?{bud:S.bud0,cs:S.cs,sc:S.sc||[]}:undefined}
function payload(){return{bal:S.bal,mo:S.mo,rt:S.rt,fc:S.fc||{},fm:S.fm||{},pm:S.pm||{},dn:n(S.dn),cx:S.cx,L:S.L,act:S.act,note:S.note,chd:S.chd,ppl:n(S.ppl),md:S.md||{},mt:S.mt||{}}}
function apply(d){
  var keep={y:S.y,m:S.m,tab:S.tab,open:S.open,vs:S.vs};
  S=Object.assign(newState(),d.state||{},keep);
  S.L=Object.assign(defL(),(d.state&&d.state.L)||{});
  S.cs=Object.assign({hid:[],hg:[],ng:[],ni:{}},d.cs||{});bG();S.bud0=d.bud||{};S.sc=d.sc||[];if(S.vs==null){try{S.vs=localStorage.getItem('vs')||''}catch(e){S.vs=''}}if(!S.sc.some(function(z){return z.id===S.vs}))S.vs='';useVs();S.fam=d.name||'';STAGE=d.stage||1;RO=STAGE<3;INBOX=d.msgs||[];
  if(tabs().map(function(x){return x[0]}).indexOf(S.tab)<0)S.tab='home';
}
function render(){
  nav.innerHTML=tabs().map(function(t){return '<button data-a="tab" data-id="'+t[0]+'" class="'+(S.tab===t[0]?'on':'')+'">'+t[1]+'</button>'}).join('');
  var f={home:home,tasks:tasksView,bal:bal,bud:bud,mon:mon,yr:yr,sv:tvs,ins:tin}[S.tab]||home;
  app.innerHTML=(/^(home|bud|mon|yr)$/.test(S.tab)&&STAGE>=2?vsUI():'')+f()+(/^(bal|sv|ins)$/.test(S.tab)?doneUI():'');
}
function save(){dirty=true;clearTimeout(timer);timer=setTimeout(flush,700);status('שומר...')}
function flush(){
  clearTimeout(timer);timer=null;
  if(busy){timer=setTimeout(flush,400);return}
  busy=true;dirty=false;
  fetch(API+'/state',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({state:payload(),budget:budgetBody()})})
    .then(function(r){if(!r.ok)throw 0;return r.json()})
    .then(function(){busy=false;if(dirty)flush();else status('✓ נשמר')})
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
  if(t.id==='yr'){if(t.value){S.y=+t.value;render()}return}
  if(d.s==='chd')S.chd[d.k]=t.checked?1:0;
  else if(d.s==='ppl')S.ppl=n(t.value);
  else if(d.s==='act'){var k=ym();S.act[k]=S.act[k]||{};S.act[k][d.k]=n(t.value)}
  else if(d.s==='L'){var p=d.k.split('.');S.L[p[0]][+p[1]][p[2]]=d.ty==='n'?n(t.value):t.value}
  else if(d.s==='mo'){var ar=S.mo[d.k]=S.mo[d.k]||[];for(var q=0;q<+d.j;q++)if(ar[q]===undefined)ar[q]='';ar[+d.j]=t.value===''?'':n(t.value);rc(d.k)}
  else if(d.s==='bud'){S.bud[d.k]=n(t.value)}
  else if(d.s==='fm'){S.fm=S.fm||{};S.fm[d.k]=n(t.value)}
  else if(d.s==='pm'){if(RO&&S.tab==='bud')return;S.pm=S.pm||{};S.pm[d.k]=t.value}
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
  else if(a==='fill'){G.forEach(function(g){its(g).forEach(function(i){var k=g.n+'|'+i;S.bud[k]=n(S.bal[k])})});save()}
  else if(a==='md'){S.md=S.md||{};S.md[ym()]=Date.now();save()}
  else if(a==='umd'){S.md=S.md||{};delete S.md[ym()];save()}
  else if(a==='gt'){S.tab='tasks'}
  else if(a==='mta'){var ti=document.getElementById('mti'),tx=ti&&ti.value.trim();if(!tx)return;S.mt=S.mt||{};S.mt['m'+Date.now()]={x:tx.slice(0,200),ts:Date.now()}  ;save()}
  else if(a==='mtd'){if(S.mt)delete S.mt[b.dataset.id];save()}
  else if(a==='dn'){S.dn=Date.now();save()}
  else if(a==='undn'){S.dn=0;save()}
  else if(a==='la'){S.L[b.dataset.l].push({});save()}
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
