var cd=document.getElementById('cd'),er=document.getElementById('er'),go=document.getElementById('go');
function enter(){var v=cd.value.trim();if(!v)return;er.textContent='';go.disabled=true;
  fetch('/api/enter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:v})}).then(function(r){
    if(r.status===429)throw 'many';if(!r.ok)throw 'bad';return r.json()}).then(function(d){location.href='/c/'+encodeURIComponent(d.token)})
  .catch(function(e){go.disabled=false;er.textContent=e==='many'?'יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.':'הקוד לא נמצא. בדקו שהקלדתם נכון.'})}
go.addEventListener('click',enter);cd.addEventListener('keydown',function(e){if(e.key==='Enter')enter()});cd.focus();
