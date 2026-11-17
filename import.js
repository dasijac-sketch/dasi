/* טעינת אקסל: זיהוי סעיפים לפי שם והתאמה לקטגוריות של הזוג */
function xn(s){return String(s==null?'':s).replace(/[‎‏]/g,'').replace(/["'״׳`]/g,'').replace(/\s+/g,' ').trim()}
var XAL={'אוכל במיר':'אוכל מחוץ לבית','לימודים הורים':'לימודי הורים','תיקנוים וטכנאים':'תיקונים וטכנאים','קוסמטיקה טיפולים ומוצרים':'קוסמטיקה','קופח ביטוח בריאות משלים':'קופת חולים - ביטוח משלים','הוצאות בלתי מתוכננות':'הוצאות לא מתוכננות','ספרי לימוד תחילת שנה':'ספרי לימוד','טיולים שנתיים':'טיולים','חוגים / שיעורי עזר':'חוגים ושיעורי עזר','רכב טיפולים ורישוי':'טיפולים ורישוי','עדשות ראיה / משקפיים':'משקפיים ועדשות','הסעות מיר':'הסעות','ביטוח שמשות ובטריה':'ביטוח שמשות וסוללה','עיסקאות בתשלומים':'עסקאות בתשלומים'};
var XSKIP=/השורה התחתונה|רשמו כאן|לחץ כאן|הוסף כאן|הוסיפו כאן|סהכ|סכה|סה״כ/;
function xfindGroup(name,sec){var nm=xn(name),al={f:{'שונות':'שונות קבועות'},v:{'שונות':'שונות משתנות','תחבורה':'תחבורה משתנה'}}[sec]||{};if(al[nm])nm=al[nm];
  return G.filter(function(g){return xn(g.n)===nm&&(!sec||g.t===sec)})[0]||G.filter(function(g){return xn(g.n)===nm})[0]||null}
function xfindItem(g,label){var l=xn(label).replace(/\s*\*$/,''),al=XAL[l];if(al)l=al;var L=its(g),c=L.filter(function(i){return xn(i)===l})[0];if(c)return c;
  c=L.filter(function(i){var a=xn(i);return a.length>=4&&l.length>=4&&(a.indexOf(l)===0||l.indexOf(a)===0)})[0];return c||null}
function xnum(v){return typeof v==='number'&&isFinite(v)?v:(typeof v==='string'&&/^\s*-?[\d,.]+\s*$/.test(v)?Number(v.replace(/,/g,'')):null)}
function xparseSheet(rows,mode){
  var out={items:[],unk:[]},sec='',grp='',role=null;
  rows.forEach(function(r){
    var cells=r.map(xn),first=-1,hdr={};
    cells.forEach(function(c,i){if(c==='הכנסות'&&sec!=='i'){sec='i'}if(c==='הוצאות קבועות')sec='f';if(c==='הוצאות משתנות')sec='v';
      if(c==='הכנסה קיימת'||c==='תקציב'||c==='ממוצע שנתי'||c==='ממוצע')hdr.val=i;if(/^חודש 1/.test(c))hdr.m1=i;if(/^חודש 2/.test(c))hdr.m2=i;if(/דרוג בן/.test(c))hdr.ra=i;if(/דרוג בת/.test(c))hdr.rb=i});
    if(hdr.val!=null){role=hdr;return}
    if(!role)return;
    var firstRole=Math.min.apply(null,[role.val,role.m1,role.m2,role.ra,role.rb].filter(function(x){return x!=null}));
    var strs=[];for(var i=0;i<firstRole&&i<cells.length;i++)if(cells[i]&&xnum(r[i])===null)strs.push(cells[i]);
    if(!strs.length)return;
    var label=strs[strs.length-1],gc=strs.length>1?strs[strs.length-2]:'';
    if(gc&&xfindGroup(gc,sec))grp=xn(gc);
    else if(strs.length===1&&xfindGroup(label,sec)&&xnum(r[role.val])===null){grp=label;return}
    if(!label||XSKIP.test(label)||label===grp&&strs.length===1)return;
    var val=xnum(r[role.val]),m1=role.m1!=null?xnum(r[role.m1]):null,m2=role.m2!=null?xnum(r[role.m2]):null,ra=role.ra!=null?xnum(r[role.ra]):null,rb=role.rb!=null?xnum(r[role.rb]):null;
    if(val==null&&m1==null&&m2==null)return;
    if(sec==='i')grp='הכנסות';
    out.items.push({sec:sec,group:grp,label:label,val:val==null?((m1||0)+(m2||0))/((m1!=null&&m2!=null)?2:1):val,m1:m1,m2:m2,ra:ra,rb:rb})});
  return out}
function xparseSav(rows){var L={sv:[],ln:[]},mode='';
  rows.forEach(function(r){var c=r.map(xn),j=c.join('|');
    if(/חסכונות קיימים/.test(j)){mode='sv';return}if(/^פנסיה|\|פנסיה/.test(j)&&c.indexOf('פנסיה')>=0){mode='';return}
    if(c.indexOf('הלוואות')>=0&&c.length&&c.filter(Boolean).length===1||c.indexOf('עסקאות בתשלומים')>=0&&c.filter(Boolean).length===1){mode='ln';return}
    if(c.indexOf('משכנתא')>=0&&c.filter(Boolean).length===1){mode='';return}
    var f=-1;c.forEach(function(x,i){if(f<0&&x&&xnum(r[i])===null&&!/^פירוט|שם ה|^סה|לחץ כאן|תאריך|^יתרת|^סיום|^החזר/.test(x))f=i});
    if(f<0||XSKIP.test(c[f]))return;var nums=r.map(xnum);
    if(mode==='sv'){var hd=function(k){return null};var m=nums[f+2],v=nums[f+3];if(m==null&&v==null)return;L.sv.push({n:c[f],m:m||0,v:v||0,q:''})}
    else if(mode==='ln'){var b=nums[f+1],mo=nums[f+2],p=nums[f+4]!=null?nums[f+4]:nums[f+3];if(!b&&!p)return;L.ln.push({n:c[f],b:b||0,c:mo||0,p:p||0})}});
  return L}
/* מחזיר תוצאה לתצוגה מקדימה והחלה: {bal,mo,rt,bud,ni,L,matched,added,skipped} */
function xplan(wb,target){
  var names=wb.SheetNames,pick=function(re){return names.filter(function(s){return re.test(s)})[0]};
  var sn=target==='bal'?(pick(/^מאזן חודשי/)||names[0]):(pick(/התקציב שלי|תקציב/)||pick(/^מאזן חודשי/)||names[0]);
  var rows=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,raw:true,defval:null});
  var p=xparseSheet(rows),R={sheet:sn,vals:{},mo:{},rt:{},ni:{},matched:0,added:[],skipped:[],L:null};
  p.items.forEach(function(it){
    var g=xfindGroup(it.group,it.sec);if(!g){R.skipped.push(it.label+' (קבוצה לא מזוהה: '+it.group+')');return}
    var key,item=xfindItem(g,it.label);
    if(!item){var og=G.filter(function(z){return z.t===g.t&&z!==g&&xfindItem(z,it.label)})[0];if(og){g=og;item=xfindItem(og,it.label)}}
    if(!item){if(!it.val&&!it.m1&&!it.m2)return;item=it.label;(R.ni[g.n]=R.ni[g.n]||[]).push(item);R.added.push(g.n+' › '+item)}else R.matched++;
    key=g.n+'|'+item;R.vals[key]=it.val;
    if(target==='bal'){if(it.m1!=null||it.m2!=null)R.mo[key]=[it.m1==null?'':it.m1,it.m2==null?'':it.m2];var rt={};if(it.ra)rt.a=String(it.ra);if(it.rb)rt.b=String(it.rb);if(rt.a||rt.b)R.rt[key]=rt}});
  if(target==='bal'){var ss=pick(/חסכונות והלוואות/);if(ss){var L=xparseSav(XLSX.utils.sheet_to_json(wb.Sheets[ss],{header:1,raw:true,defval:null}));if(L.sv.length||L.ln.length)R.L=L}}
  return R}
