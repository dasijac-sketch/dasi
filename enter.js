var RT=(function(){var m=/^#r=(.+)$/.exec(location.hash);return m?m[1]:''})();
var HP=(function(){var m=/^#p=(.+)$/.exec(location.hash);if(!m)return '';try{return decodeURIComponent(m[1])}catch(e){return ''}})();
var cd=document.getElementById('cd'),er=document.getElementById('er'),go=document.getElementById('go');
function enter(fromLink){var v=fromLink===true?HP:cd.value.trim();if(!v)return;er.textContent='';go.disabled=true;
  fetch('/api/enter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:v})}).then(function(r){
    if(r.status===429)throw 'many';if(!r.ok)throw 'bad';return r.json()}).then(function(d){location.href='/c/'+encodeURIComponent(d.token)})
  .catch(function(e){go.disabled=false;er.textContent=e==='many'?'יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.':(fromLink===true?'הקישור כבר לא תקף, כנראה שהחלפתם סיסמה. היכנסו עם הסיסמה החדשה.':'הסיסמה לא נמצאה. בדקו שהקלדתם נכון.')})}
go.addEventListener('click',function(){enter()});cd.addEventListener('keydown',function(e){if(e.key==='Enter')enter()});
if(HP){try{history.replaceState(null,'',location.pathname)}catch(e){}enter(true)}else cd.focus();

var $=function(i){return document.getElementById(i)};
$('fg').addEventListener('click',function(){$('fgc').style.display='block';$('fc').focus()});
$('fs').addEventListener('click',function(){var v=$('fc').value.trim();if(v.length<5)return;$('fs').disabled=true;$('fm').textContent='';
  fetch('/api/forgot',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contact:v})}).then(function(r){if(r.status===429)throw 'many';if(!r.ok)throw 'bad';return r.json()}).then(function(d){$('fs').disabled=false;$('fm').textContent=d.auto?'אם הפרטים נמצאים אצלנו, נשלח אליהם קישור. בדקו גם בספאם.':'אם הפרטים נמצאים אצלנו, הבקשה הועברה למאמנת והיא תחזור אליכם עם קישור חדש.'}).catch(function(e){$('fs').disabled=false;$('fm').textContent=e==='many'?'יותר מדי ניסיונות. נסו שוב בעוד כמה דקות.':'הבקשה נכשלה. בדקו את הפרטים ונסו שוב.'})});
if(RT){try{history.replaceState(null,'',location.pathname)}catch(e){}$('rsc').style.display='block';document.querySelectorAll('.c')[0].style.display='none';$('r1').focus();
  $('rs').addEventListener('click',function(){var a=$('r1').value,b=$('r2').value;$('re').textContent='';
    if(!/^[\x21-\x7e\u05d0-\u05ea]{6,40}$/.test(a)){$('re').textContent='הסיסמה צריכה להיות באורך 6 עד 40 תווים, בלי רווחים.';return}
    if(a!==b){$('re').textContent='שתי הסיסמאות לא זהות.';return}
    $('rs').disabled=true;fetch('/api/reset',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:RT,password:a})}).then(function(r){return r.json().then(function(j){return{ok:r.ok,s:r.status,j:j}})}).then(function(o){if(o.ok)location.href='/c/'+encodeURIComponent(o.j.token);else{$('rs').disabled=false;$('re').textContent=o.s===404?'הקישור פג תוקף. בקשו קישור חדש מדף הכניסה.':o.s===409?'הסיסמה כבר בשימוש, בחרו אחרת.':'השמירה נכשלה'}}).catch(function(){$('rs').disabled=false;$('re').textContent='השמירה נכשלה'})})}
