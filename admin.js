/* מסך המנהלת: /admin */
(function(){
ADM=true;
var A={auth:null,list:[],cur:null,tab:'sum',y:S.y,m:S.m,open:{},err:''};
var app=document.getElementById('app'),nav=document.getElementById('nav'),budTimer=null;

function api(m,u,b){
  return fetch(u,{method:m,headers:b?{'Content-Type':'application/json'}:{},body:b?JSON.stringify(b):undefined}).then(function(r){
    return r.json().catch(function(){return{}}).then(function(j){
      if(r.status===401&&A.auth){A.auth=false;render()}
      if(!r.ok){var e=new Error(j.error||String(r.status));e.status=r.status;throw e}
      return j});
  });
}
function status(t){var e=document.getElementById('sv');if(e)e.textContent=t||''}
function cur(){return A.list.filter(function(c){return c.id===A.cur})[0]}
function typing(){var a=document.activeElement;return a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)}

/* מצב הזוג כפי שהחישובים מצפים לו */
function cs(c){
  c.budget=c.budget||{};c.budget.bud=c.budget.bud||{};
  var s=Object.assign(newState(),c.state||{});
  s.L=Object.assign({sv:[],ln:[],ins:[],gl:[]},(c.state&&c.state.L)||{});
  s.cs=Object.assign({hid:[],hg:[],ng:[],ni:{}},c.budget.cs||{});s.bud=c.budget.bud;s.fam=c.name;s.y=A.y;s.m=A.m;s.tab='';s.open=A.open;
  return s;
}
function sumC(c){
  return W(cs(c),function(){
    var over=[];
    G.forEach(function(g){if(g.t==='i')return;var a=gs('act',g),b=gs('bud',g);if(b&&a>b)over.push(g.n+' · חריגה '+fm(a-b));else if(!b&&a)over.push(g.n+' · ללא תקציב')});
    return{ai:ts('act','i'),ae:ex('act'),pi:ts('bud','i'),pe:ex('bud'),bi:ts('bal','i'),be:ex('bal'),over:over,ok:!!(ts('act','i')||ex('act'))};
  });
}
function badge(c,s){
  if(c.stage<2)return s.be>0?'<span class="bdg ok">מילאו מאזן</span>':'<span class="bdg wn">ממתינים למאזן</span>';
  if(!s.ok)return '<span class="bdg wn">לא דיווחו החודש</span>';
  return s.over.length?'<span class="bdg bd">'+s.over.length+' חריגות</span>':'<span class="bdg ok">במסגרת</span>';
}
function link(c){return location.origin+'/c/'+c.token}
function invText(c){return 'שלום משפחת '+c.name+',\nזה הקישור האישי שלכם לניהול התקציב: '+link(c)+'\nנכנסים ישירות מהקישור, בלי סיסמה. כדאי לשמור אותו ולא להעביר הלאה.\nבכניסה הראשונה מלאו את המאזן החודשי.'}

/* ---------- תצוגות ---------- */
function loginView(){
  return '<div class="login c"><h2 style="margin:0">כניסת מאמנת</h2><input id="pw" type="password" placeholder="סיסמה" autocomplete="current-password"><button class="btn" data-a="login" style="width:100%">כניסה</button><div class="err" id="er">'+esc(A.err)+'</div></div>';
}
function listView(){
  S=newState();S.y=A.y;S.m=A.m;bG();
  var wait=0,ov=0;
  var rows=A.list.map(function(c){
    var s=sumC(c);
    if(c.stage<2){if(!(s.be>0))wait++}else if(s.over.length)ov++;
    var sub=c.stage<2?'שלב 1 · '+ago(c.updated_at):(s.ok?'הוצאות '+fm(s.ae)+' מתוך '+fm(s.pe)+' · ':'')+ago(c.updated_at);
    return '<button class="c cc" data-a="op" data-id="'+c.id+'"><div class="tot" style="padding:0"><span>'+esc(c.name)+'</span>'+badge(c,s)+'</div><small class="hint" style="margin:4px 0 0;display:block">'+sub+'</small></button>';
  }).join('');
  return '<div class="top"><b>הזוגות שלי</b><span><a class="btn sec" style="text-decoration:none" href="/api/admin/backup" download>הורדת גיבוי</a> <button class="btn sec" data-a="logout">יציאה</button></span></div>'+
    '<div class="c"><div class="f"><input id="nf" placeholder="שם המשפחה"><button class="btn" data-a="mk">+ זוג חדש</button></div></div>'+
    monSel()+
    '<div class="g">'+tile(A.list.length,'זוגות')+tile(wait,'ממתינים למאזן')+tile(ov,'עם חריגות החודש',ov?'neg':'')+'</div>'+
    (rows||'<div class="c"><p class="hint" style="margin:0">עדיין אין זוגות. הוסיפי זוג ראשון למעלה, ותקבלי קישור אישי לשליחה.</p></div>');
}
function detailView(c){
  S=cs(c);bG();
  var T=[['sum','סקירה'],['bal','מאזן'],['bud','תקציב'],['mon','מעקב חודשי'],['yr','סיכום שנתי'],['sv','חסכונות והלוואות'],['ins','ביטוחים ויעדים'],['mg','ניהול']];
  nav.innerHTML=T.map(function(t){return '<button data-a="tb" data-id="'+t[0]+'" class="'+(A.tab===t[0]?'on':'')+'">'+t[1]+'</button>'}).join('');
  var f={sum:function(){return sumView(c)},bal:bal,bud:bud,mon:mon,yr:yr,sv:tvs,ins:tin,mg:function(){return mgView(c)}}[A.tab]||function(){return sumView(c)};
  return '<div class="top"><button class="btn sec" data-a="bk">→ חזרה לרשימה</button><b>'+esc(c.name)+'</b></div>'+f();
}
function sumView(c){
  var s=sumC(c),st2=c.stage>=2;
  var rows=G.filter(function(g){return g.t!=='i'}).map(function(g){
    if(!st2){var v=gs('bal',g);return v?'<div class="r"><label>'+esc(g.n)+'</label><span>'+fm(v)+(s.bi?' · '+Math.round(v/s.bi*100)+'%':'')+'</span></div>':''}
    var a=gs('act',g),b=gs('bud',g);if(!a&&!b)return '';var p=b?a/b:2;
    return '<div class="cat"><div class="t"><span>'+esc(g.n)+'</span><span class="'+(a>b?'neg':'')+'">'+fm(a)+' מתוך '+fm(b)+'</span></div><div class="bar"><i class="'+cls(g,p)+'" style="width:'+Math.min(100,p*100)+'%"></i></div></div>';
  }).join('');
  var ins=S.L.ins.reduce(function(a,x){return a+(x.f==='שנתי'?n(x.p)/12:n(x.p))},0);
  var chT=0,chD=0;c.msgs.forEach(function(m){if(m.k==='ch'){chT++;if(S.chd[m.id])chD++}});
  return '<div class="c"><div class="hint" style="margin:0">'+ago(c.updated_at)+(c.seen_at?' · נכנסו לאחרונה '+new Date(c.seen_at).toLocaleDateString('he-IL'):' · טרם נכנסו')+'</div></div>'+
    monSel()+
    (st2?'<div class="g">'+tile(fm(s.ai),'הכנסות (תקציב '+fm(s.pi)+')')+tile(fm(s.ae),'הוצאות (תקציב '+fm(s.pe)+')',s.pe&&s.ae>s.pe?'neg':'')+tile(fm(s.ai-s.ae),'יתרה',s.ai-s.ae<0?'neg':'')+'</div>'
      :'<div class="g">'+tile(fm(s.bi),'הכנסות חודשיות')+tile(fm(s.be),'הוצאות חודשיות')+tile(fm(s.bi-s.be),'יתרה חודשית',s.bi-s.be<0?'neg':'')+'</div>')+
    '<div class="c"><b>'+(st2?'מול התקציב':'פירוט ההוצאות במאזן')+'</b>'+(rows||'<p class="hint" style="margin:6px 0 0">אין עדיין נתונים.</p>')+'</div>'+
    '<div class="g">'+tile(fm(sm('sv','v')),'שווי חסכונות')+tile(fm(sm('ln','b')),'יתרת הלוואות')+tile(fm(ins),'ביטוחים בחודש')+'</div>'+
    (S.note[ym()]?'<div class="c"><b>הערת הזוג לחודש</b><div style="white-space:pre-wrap;margin-top:6px;font-size:14px">'+esc(S.note[ym()])+'</div></div>':'')+
    (chT?'<div class="c">'+chD+' מתוך '+chT+' אתגרים סומנו כבוצעו</div>':'');
}
function mgView(c){
  var tasks=c.tasks.map(function(t,i){return '<div class="r"><input type="checkbox" style="width:auto" data-a="tt" data-i="'+i+'"'+(t.d?' checked':'')+'><label'+(t.d?' style="text-decoration:line-through;color:var(--mu)"':'')+'>'+esc(t.t)+'</label><button class="gh" style="width:30px;color:var(--bd)" data-a="td" data-i="'+i+'" aria-label="מחיקה">✕</button></div>'}).join('');
  var sent=c.msgs.slice().sort(function(a,b){return b.ts-a.ts}).map(function(m){return '<div class="it"><div class="tot" style="padding:0;font-weight:400"><small>'+(m.k==='ch'?'אתגר':'הודעה')+' · '+new Date(m.ts).toLocaleDateString('he-IL')+'</small><button class="gh" style="width:30px;color:var(--bd)" data-a="md" data-id="'+esc(m.id)+'" aria-label="מחיקה">✕</button></div><div style="white-space:pre-wrap;font-size:14px">'+esc(m.x)+'</div></div>'}).join('');
  var wa='https://wa.me/?text='+encodeURIComponent(invText(c));
  return '<div class="c"><b>הקישור האישי של הזוג</b><p class="hint" style="margin:4px 0 8px">הקישור פותח את האתר ישירות, בלי חשבון ובלי סיסמה.</p>'+
    '<textarea id="itx" rows="5" readonly style="width:100%">'+esc(invText(c))+'</textarea>'+
    '<div class="f" style="margin-top:8px"><button class="btn" data-a="cp">העתקה</button><a class="btn" style="text-decoration:none;text-align:center" href="'+wa+'" target="_blank" rel="noopener noreferrer">שליחה בוואטסאפ</a></div>'+
    '<div class="f" style="margin-top:8px"><button class="btn sec" data-a="rg">קישור חדש (מבטל את הישן)</button></div></div>'+
    '<div class="c"><b>שלב</b><div class="f" style="margin-top:8px"><select id="stg"><option value="1"'+(c.stage===1?' selected':'')+'>שלב 1: מאזן בלבד</option><option value="2"'+(c.stage===2?' selected':'')+'>שלב 2: תקציב ומעקב חודשי</option></select></div><p class="hint" style="margin:6px 0 0">בשלב 1 הזוג ממלא רק מאזן. אחרי שבנית עבורו תקציב בלשונית "תקציב", עברי לשלב 2 והוא יראה את התקציב ויתחיל לדווח.</p></div>'+
    '<div class="c"><b>שם המשפחה</b><div class="f" style="margin-top:8px"><input id="rn" value="'+esc(c.name)+'"></div></div>'+
    '<div class="c"><b>הערות פרטיות שלי</b><textarea id="nt1" rows="4" style="width:100%;margin-top:6px">'+esc(c.notes)+'</textarea><p class="hint" style="margin:4px 0 0">לא גלוי לזוג.</p></div>'+
    '<div class="c"><b>משימות לפגישה הבאה</b>'+tasks+'<div class="f" style="margin-top:8px"><input id="tn" placeholder="משימה חדשה"><button class="btn" data-a="ta">הוספה</button></div></div>'+
    '<div class="c"><b>הודעה או אתגר לזוג</b><div class="f" style="margin:8px 0"><select id="mt"><option value="msg">הודעה</option><option value="ch">אתגר</option></select></div><textarea id="mx" rows="3" style="width:100%" placeholder="לדוגמה: החודש מנסים להוריד 10% ממזון"></textarea><button class="btn" data-a="sm" style="margin-top:8px">שליחה</button>'+sent+'</div>'+
    '<div class="c"><button class="btn sec" data-a="dl" style="color:var(--bd)">מחיקת הזוג וכל הנתונים שלו</button></div>';
}
/* במסכי הצפייה הערכים של הזוג נעולים, רק התקציב והניהול ניתנים לעריכה */
function lock(){
  if(A.tab==='bud'||A.tab==='mg'||A.tab==='sum')return;
  app.querySelectorAll('input,select,textarea').forEach(function(e){if(e.id!=='ms'&&e.id!=='yr'&&!e.classList.contains('fcin'))e.disabled=true});
  app.querySelectorAll('button[data-a=mo],button[data-a=la],button[data-a=ld],button[data-a=add]').forEach(function(b){b.disabled=true});
}
function render(){
  if(A.auth===null){nav.innerHTML='';app.innerHTML='<div class="c">טוען...</div>';return}
  if(!A.auth){nav.innerHTML='';app.innerHTML=loginView();return}
  var c=A.cur&&cur();
  if(c){app.innerHTML=detailView(c);lock()}
  else{A.cur=null;nav.innerHTML='';app.innerHTML=listView()}
}
function keepFocus(fn){
  var a=document.activeElement,id=a&&a.dataset&&a.dataset.k?a.dataset.s+'#'+a.dataset.k:null;
  fn();
  if(id){var el=[].find.call(document.querySelectorAll('input[data-k]'),function(x){return x.dataset.s+'#'+x.dataset.k===id});if(el)el.focus()}
}

/* ---------- שמירה ---------- */
function put(c,body){
  status('שומרת...');
  return api('PUT','/api/admin/couples/'+c.id,body).then(function(r){
    ['name','stage','notes','tasks','msgs'].forEach(function(k){c[k]=r[k]});
    status('✓ נשמר');
  }).catch(function(){status('השמירה נכשלה, נסי שוב')});
}
function saveBud(c){
  status('שומרת...');clearTimeout(budTimer);
  budTimer=setTimeout(function(){
    api('PUT','/api/admin/couples/'+c.id,{bud:c.budget.bud,cs:c.budget.cs||{}}).then(function(){status('✓ התקציב נשמר')}).catch(function(){status('השמירה נכשלה, נסי שוב')});
  },600);
}
function load(){
  return api('GET','/api/admin/couples').then(function(l){A.list=l}).catch(function(){});
}
function copyText(id){
  var ta=document.getElementById(id);if(!ta)return;
  ta.focus();ta.select();
  var done=function(){status('הועתק')};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(ta.value).then(done,function(){try{document.execCommand('copy');done()}catch(e){status('סמני והעתיקי ידנית')}});
  else{try{document.execCommand('copy');done()}catch(e){status('סמני והעתיקי ידנית')}}
}

/* ---------- אירועים ---------- */
document.addEventListener('change',function(e){
  var t=e.target,d=t.dataset,c=cur();
  if(t.id==='ms'){A.m=+t.value;render();return}
  if(t.id==='yr'){if(t.value){A.y=+t.value;render()}return}
  if(!c)return;
  if(d.s==='bud'){S.bud[d.k]=n(t.value);saveBud(c);keepFocus(render);return}
  if(d.s==='fc'){c.state=c.state||{};(c.state.fc=c.state.fc||{})[d.k]=t.value;keepFocus(render);return}
  if(t.id==='nt1'){c.notes=t.value;put(c,{notes:c.notes})}
  else if(t.id==='stg')put(c,{stage:+t.value}).then(render);
  else if(t.id==='rn'){var v=t.value.trim();if(v)put(c,{name:v}).then(render)}
});
document.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.id==='pw')doLogin()});
function doLogin(){
  var pw=document.getElementById('pw');if(!pw)return;
  api('POST','/api/admin/login',{password:pw.value}).then(function(){A.auth=true;A.err='';return load()}).then(render).catch(function(er){
    A.err=er.status===429?'יותר מדי ניסיונות. נסי שוב בעוד כמה דקות.':'הסיסמה שגויה';
    var x=document.getElementById('er');if(x)x.textContent=A.err;
  });
}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-a]');if(!b)return;
  var a=b.dataset.a,x=b.dataset,c=cur();
  if(a==='login'){doLogin();return}
  if(a==='logout'){api('POST','/api/admin/logout').then(function(){A.auth=false;A.cur=null;A.list=[];render()});return}
  if(a==='mk'){
    var el=document.getElementById('nf'),nm=el?el.value.trim():'';if(!nm)return;
    api('POST','/api/admin/couples',{name:nm}).then(function(r){A.list.unshift(r);A.cur=r.id;A.tab='mg';render()}).catch(function(){status('היצירה נכשלה')});
    return;
  }
  if(a==='op'){A.cur=+x.id;A.tab='sum';render();return}
  if(a==='bk'){A.cur=null;render();return}
  if(a==='tb'){A.tab=x.id;render();return}
  if(a==='tg'){A.open[x.id]=!A.open[x.id];render();return}
  if(!c)return;
  if(a==='fill'){G.forEach(function(g){its(g).forEach(function(i){var k=g.n+'|'+i;S.bud[k]=n(S.bal[k])})});saveBud(c);render()}
  else if(a==='xi'||a==='xg'||a==='ai'||a==='ag'){
    var k2=c.budget.cs=Object.assign({hid:[],hg:[],ng:[],ni:{}},c.budget.cs||{});
    var cl=function(v){return String(v||'').replace(/\|/g,' ').trim().slice(0,60)};
    if(a==='xi'){var key=x.g+'|'+x.i,L2=k2.ni[x.g]||[],ix=L2.indexOf(x.i);if(ix>=0)L2.splice(ix,1);if(k2.hid.indexOf(key)<0)k2.hid.push(key)}
    else if(a==='xg'){var ngi=k2.ng.findIndex(function(z){return z.n===x.g});if(ngi>=0)k2.ng.splice(ngi,1);else if(k2.hg.indexOf(x.g)<0)k2.hg.push(x.g)}
    else if(a==='ai'){var g1=document.getElementById('sg').value,nm=cl(document.getElementById('sn').value);if(!nm)return;var gg=G.filter(function(z){return z.n===g1})[0];if(!gg||its(gg).indexOf(nm)>=0){status('התת קטגוריה כבר קיימת');return}var hk=g1+'|'+nm,hx=k2.hid.indexOf(hk);if(hx>=0)k2.hid.splice(hx,1);else(k2.ni[g1]=k2.ni[g1]||[]).push(nm);A.open[g1]=true}
    else{var nm2=cl(document.getElementById('cn2').value),tt=document.getElementById('ct').value;if(!nm2)return;if(G.some(function(z){return z.n===nm2})){status('הקטגוריה כבר קיימת');return}var hg2=k2.hg.indexOf(nm2);if(hg2>=0)k2.hg.splice(hg2,1);else k2.ng.push({t:tt,n:nm2});A.open[nm2]=true}
    saveBud(c);render()}
  else if(a==='cp')copyText('itx');
  else if(a==='ta'){var v=document.getElementById('tn').value.trim();if(v){c.tasks.push({t:v,d:0});put(c,{tasks:c.tasks}).then(render)}}
  else if(a==='tt'){var tk=c.tasks[+x.i];if(tk){tk.d=tk.d?0:1;put(c,{tasks:c.tasks}).then(render)}}
  else if(a==='td'){c.tasks.splice(+x.i,1);put(c,{tasks:c.tasks}).then(render)}
  else if(a==='sm'){var tx=document.getElementById('mx').value.trim();if(tx){c.msgs.push({id:String(Date.now()),k:document.getElementById('mt').value,x:tx,ts:Date.now()});put(c,{msgs:c.msgs}).then(render)}}
  else if(a==='md'){c.msgs=c.msgs.filter(function(m){return m.id!==x.id});put(c,{msgs:c.msgs}).then(render)}
  else if(a==='rg'){if(confirm('הקישור הישן יפסיק לעבוד, ותצטרכי לשלוח לזוג את החדש. להמשיך?'))api('POST','/api/admin/couples/'+c.id+'/regenerate').then(function(r){c.token=r.token;render();status('נוצר קישור חדש')}).catch(function(){status('הפעולה נכשלה')})}
  else if(a==='dl'){if(confirm('למחוק את הזוג ואת כל הנתונים שלו? אי אפשר לשחזר.'))api('DELETE','/api/admin/couples/'+c.id).then(function(){A.list=A.list.filter(function(q){return q.id!==c.id});A.cur=null;render()}).catch(function(){status('המחיקה נכשלה')})}
});
function refresh(){if(A.auth&&!typing()){load().then(function(){if(!typing())render()})}}
document.addEventListener('visibilitychange',function(){if(!document.hidden)refresh()});
setInterval(refresh,60000);

api('GET','/api/admin/me').then(function(r){A.auth=!!r.auth;return A.auth?load():null}).then(render).catch(function(){A.auth=false;render()});
})();
