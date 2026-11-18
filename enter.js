var HP=(function(){var m=/^#p=(.+)$/.exec(location.hash);if(!m)return '';try{return decodeURIComponent(m[1])}catch(e){return ''}})();
var cd=document.getElementById('cd'),er=document.getElementById('er'),go=document.getElementById('go');
function enter(fromLink){var v=fromLink===true?HP:cd.value.trim();if(!v)return;er.textContent='';go.disabled=true;
  fetch('/api/enter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:v})}).then(function(r){
    if(r.status===429)throw 'many';if(!r.ok)throw 'bad';return r.json()}).then(function(d){location.href='/c/'+encodeURIComponent(d.token)})
  .catch(function(e){go.disabled=false;er.textContent=e==='many'?'יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.':(fromLink===true?'הקישור כבר לא תקף, כנראה שהחלפתם סיסמה. היכנסו עם הסיסמה החדשה.':'הסיסמה לא נמצאה. בדקו שהקלדתם נכון.')})}
go.addEventListener('click',function(){enter()});cd.addEventListener('keydown',function(e){if(e.key==='Enter')enter()});
if(HP){try{history.replaceState(null,'',location.pathname)}catch(e){}enter(true)}else cd.focus();
