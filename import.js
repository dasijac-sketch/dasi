/* טעינת אקסל: זיהוי סעיפים לפי שם והתאמה לקטגוריות של הזוג */
function xn(s){return String(s==null?'':s).replace(/[‎‏]/g,'').replace(/["'״׳`]/g,'').replace(/\s+/g,' ').trim()}
var XAL={'אוכל במיר':'אוכל בחוץ','אוכל מחוץ לבית':'אוכל בחוץ','ביגוד והנעלה חגים':'ביגוד חגים','ביגוד והנעלה לחגים':'ביגוד חגים','הלוואות לצרוך השקעה':'הלוואה שנלקחו לצורך השקעה','הלוואות שנלקחו לצורך חיסכון':'הלוואה שנלקחו לצורך השקעה','הלוואות לצורך חיסכון':'הלוואה שנלקחו לצורך השקעה','ביטוח מבנה ותכולה':'ביטוח תכולה','לימודי הורים':'לימודים הורים','חוגים ושיעורי עזר':'חוגים / שיעורי עזר','עסקאות בתשלומים':'עיסקאות בתשלומים','תיקונים וטכנאים':'תיקנוים וטכנאים','קוסמטיקה':'קוסמטיקה טיפולים ומוצרים','משקפיים ועדשות':'עדשות ראיה / משקפיים'};
var XLINK=/^ל(טבלת|פרוט|הוראות|עמוד)/;
var XSKIP=/השורה התחתונה|רשמו כאן|לחץ כאן|הוסף כאן|הוסיפו כאן|סהכ|סכה|סה״כ/;
function xfindGroup(name,sec){var nm=xn(name),al={f:{'שונות':'שונות קבועות'},v:{'שונות':'שונות משתנות','תחבורה':'תחבורה משתנה'}}[sec]||{};if(al[nm])nm=al[nm];
  return G.filter(function(g){return xn(g.n)===nm&&(!sec||g.t===sec)})[0]||G.filter(function(g){return xn(g.n)===nm})[0]||null}
function xfindItem(g,label){var l=xn(label).replace(/\s*\*$/,''),al=XAL[l];if(al)l=al;var L=its(g),c=L.filter(function(i){return xn(i)===l})[0];if(c)return c;
  c=L.filter(function(i){var a=xn(i);return a.length>=4&&l.length>=4&&(a.indexOf(l)===0||l.indexOf(a)===0)})[0];return c||null}
function xnum(v){return typeof v==='number'&&isFinite(v)?v:(typeof v==='string'&&/^\s*-?[\d,.]+\s*$/.test(v)?Number(v.replace(/,/g,'')):null)}
function xparseSheet(rows,mode){mode=mode||'';
  var out={items:[],unk:[],struct:[]},sec='',grp='',role=null,sg=null;
  var sreg=function(g){var k=sec+'|'+g;sg=out.struct.filter(function(z){return z.k===k})[0];if(!sg){sg={k:k,sec:sec,name:g,items:[]};out.struct.push(sg)}};
  rows.forEach(function(r){
    var cells=r.map(xn),first=-1,hdr={};
    cells.forEach(function(c,i){if(c==='הכנסות'&&sec!=='i'){sec='i'}if(c==='הוצאות קבועות')sec='f';if(c==='הוצאות משתנות')sec='v';
      if(c==='הכנסה קיימת'){if(hdr.m1==null)hdr.m1=i;else if(hdr.m2==null)hdr.m2=i;hdr.inc=1}if(c==='תקציב חדש')hdr.nb=i;if(c==='תקציב'||c==='ממוצע שנתי'||c==='ממוצע')hdr.val=i;if(/^חודש 1/.test(c))hdr.m1=i;if(/^חודש 2/.test(c))hdr.m2=i;if(/[דת]י?רוג בן|ציון בן/.test(c))hdr.ra=i;if(/[דת]י?רוג בת|ציון בת/.test(c))hdr.rb=i;if(c==='אמצעי תשלום')hdr.pm=i});
    if(mode==='bud'&&hdr.nb!=null)hdr.val=hdr.nb;
    if(hdr.val!=null||hdr.inc){role=hdr;return}
    if(!role)return;
    var firstRole=Math.min.apply(null,[role.val,role.m1,role.m2,role.ra,role.rb,role.nb].filter(function(x){return x!=null}));
    var strs=[],sidx=[];for(var i=0;i<firstRole&&i<cells.length;i++)if(cells[i]&&xnum(r[i])===null&&!XLINK.test(cells[i])){strs.push(cells[i]);sidx.push(i)}
    if(!strs.length)return;
    var label=strs[strs.length-1],gc=strs.length>1&&sidx[sidx.length-2]===sidx[sidx.length-1]-1?strs[strs.length-2]:'';
    if(sec==='i')grp='הכנסות';
    else if(gc){grp=xn(gc);sreg(grp)}
    else if(strs.length===1&&xfindGroup(label,sec)&&xnum(r[role.val])===null){grp=label;sreg(grp);return}
    if(sec==='i'&&(!sg||sg.sec!=='i'))sreg('הכנסות');
    if(!label||XSKIP.test(label)||label===grp&&strs.length===1)return;
    if(sg&&sec&&sg.sec===sec&&sg.name===grp){var cl=label.replace(/\s*\*$/,'').trim();sg.items.push(cl)}
    var val=role.val!=null?xnum(r[role.val]):null,m1=role.m1!=null?xnum(r[role.m1]):null,m2=role.m2!=null?xnum(r[role.m2]):null,pmx=role.pm!=null?xn(r[role.pm]):'',ra=role.ra!=null?xnum(r[role.ra]):null,rb=role.rb!=null?xnum(r[role.rb]):null;
    if(val==null&&m1==null&&m2==null)return;
    out.items.push({sec:sec,group:grp,label:label,val:val==null?((m1||0)+(m2||0))/((m1!=null&&m2!=null)?2:1):val,m1:m1,m2:m2,ra:ra,rb:rb,pm:/מזומן/.test(pmx)?'מזומן':/אשראי/.test(pmx)?'אשראי':/הוק/.test(pmx)?'הו"ק':''})});
  return out}
function xmonthsTo(v){var d=null;if(typeof v==='number'&&v>20000&&v<80000)d=new Date((v-25569)*864e5);else if(typeof v==='number'&&v>=2000&&v<=2200)d=new Date(v,11,1);else return 0;var t=new Date(),m=(d.getFullYear()-t.getFullYear())*12+d.getMonth()-t.getMonth();return m>0?m:0}
function xparseSav(rows){var L={sv:[],ln:[],pn:[]},mode='',hl=null,hm=null;
  rows.forEach(function(r){var c=r.map(xn),j=c.join('|');
    if(c.indexOf('יתרת ההלוואה')>=0&&c.indexOf('שם המסלול')<0){hl={};c.forEach(function(x,i){if(x==='יתרת ההלוואה')hl.b=i;if(/^סיום בעוד/.test(x))hl.mo=i;if(x==='תאריך סיום')hl.dt=i;if(x==='החזר חודשי')hl.p=i;if(x==='ריבית')hl.r=i});return}
    if(c.indexOf('שם המסלול')>=0){hm={};c.forEach(function(x,i){if(x==='יתרת ההלוואה')hm.b=i;if(/מועד סיום|תאריך סיום/.test(x))hm.e=i;if(x==='החזר חודשי')hm.p=i;if(x==='תנאים')hm.t=i});return}
    if(mode==='mg'&&hm&&!/^סה/.test(c.filter(Boolean)[0]||'')){var xb=xnum(r[hm.b]),xp=xnum(r[hm.p]);if(xb||xp){L.ln.push({y:'משכנתא',n:(c[0]&&c[0]!==c[hm.b]?c[0]:'משכנתא'),b:xb||0,c:xmonthsTo(r[hm.e]),p:xp||0});return}}
    if(/חסכונות קיימים/.test(j)){mode='sv';return}if(/^פנסיה|\|פנסיה/.test(j)&&c.indexOf('פנסיה')>=0){mode='pn';return}
    if(c.indexOf('הלוואות')>=0&&c.length&&c.filter(Boolean).length===1||c.filter(function(x){return /^ע[יס]*ק[אות]+ בתשלומים$/.test(x)}).length&&c.filter(Boolean).length===1){mode='ln';return}
    if(c.indexOf('משכנתא')>=0&&c.filter(Boolean).length===1){mode='mg';return}
    var f=-1;c.forEach(function(x,i){if(f<0&&x&&xnum(r[i])===null&&!/^פירוט|שם ה|^סה|לחץ כאן|תאריך|^יתרת|^סיום|^החזר/.test(x))f=i});
    if(f<0||XSKIP.test(c[f]))return;var nums=r.map(xnum);
    if(mode==='sv'){var hd=function(k){return null};var m=nums[f+2],v=nums[f+3];if(m==null&&v==null)return;L.sv.push({n:c[f],m:m||0,v:v||0,q:''})}
    else if(mode==='pn'){var pv=nums[f+1],pm=nums[f+2],pe=nums[f+3],pc=nums[f+4];if(pc==null&&/^\d+(\.\d+)?\s*\/\s*\d/.test(c[f+4]||''))pc=Number(c[f+4].split('/')[0]);if(pv==null&&pm==null&&pe==null)return;L.pn.push({n:c[f],v:pv||0,m:pm||0,e:pe||0,c:pc||0})}
    else if(mode==='mg'){var mb=nums[f+1],mp=nums[f+3];if(!mb&&!mp)return;L.ln.push({n:'משכנתא - '+c[f],b:mb||0,c:0,p:mp||0})}
    else if(mode==='ln'){var b,mo,p;if(hl&&hl.b!=null){b=nums[hl.b];mo=hl.mo!=null?nums[hl.mo]:null;if(!mo&&hl.dt!=null)mo=xmonthsTo(r[hl.dt]);p=hl.p!=null?nums[hl.p]:null;var rr0=hl.r!=null?nums[hl.r]:null;if(b==null&&p==null)return;L.ln.push({y:'הלוואה',n:c[f],b:b||0,c:mo||0,p:p||0,r:rr0||''})}else{b=nums[f+1];mo=nums[f+2];p=nums[f+4]!=null?nums[f+4]:nums[f+3];if(b==null&&p==null&&mo==null)return;L.ln.push({n:c[f],b:b||0,c:mo||0,p:p||0})}}});
  if(!L.pn.length)delete L.pn;return L}
/* מחזיר תוצאה לתצוגה מקדימה והחלה: {bal,mo,rt,bud,ni,L,matched,added,skipped} */
function xplan(wb,target){
  var names=wb.SheetNames,pick=function(re){return names.filter(function(s){return re.test(s)})[0]};
  var sn=target==='bal'?(pick(/^מאזן חודשי/)||pick(/^מאזן$/)||names[0]):(pick(/התקציב שלי|^תקציב$/)||pick(/^מאזן חודשי/)||pick(/^מאזן$/)||names[0]);
  var rows=XLSX.utils.sheet_to_json(wb.Sheets[sn],{header:1,raw:true,defval:null});
  var p=xparseSheet(rows,target),R={sheet:sn,vals:{},mo:{},rt:{},pm:{},ni:{},matched:0,added:[],skipped:[],L:null,cs:null,hidden:0,groups:0,nitems:0};
  var useCs=null;
  if(p.struct.some(function(z){return z.items.length})){
    useCs=W({cs:{},cx:{}},function(){var cs={hid:[],hg:[],ng:[],ni:{}},seen={};
      p.struct.forEach(function(z){if(!z.items.length&&z.sec==='i')return;var bg=xfindGroup(z.name,z.sec),nm=bg?bg.n:z.name.replace(/\|/g,' ').trim(),keep={};
        if(bg&&seen[bg.n])return;if(bg)seen[bg.n]=1;
        if(!bg){if(G.some(function(g){return g.n===nm})||cs.ng.some(function(g){return g.n===nm}))nm=nm+' ('+(z.sec==='f'?'קבועות':'משתנות')+')';cs.ng.push({t:z.sec||'v',n:nm});R.added.push('קטגוריה: '+nm)}
        z.items.forEach(function(lb){var it=bg?xfindItem(bg,lb):null;if(it&&keep[it]){var l3=xn(lb).replace(/\s*\*$/,'');it=its(bg).filter(function(i){return !keep[i]&&xn(i).indexOf(l3)===0})[0]||'';if(!it)return}
          if(it){keep[it]=1}else{var nn=lb.replace(/\|/g,' ').trim();if(keep[nn])return;keep[nn]=1;(cs.ni[nm]=cs.ni[nm]||[]).push(nn);if(bg)R.added.push(nm+' › '+nn)}});
        if(bg)its(bg).forEach(function(i){if(!keep[i]){cs.hid.push(bg.n+'|'+i);R.hidden++}});R.nitems+=z.items.length});
      G.forEach(function(g){if(!seen[g.n]&&!cs.ng.some(function(z){return z.n===g.n})){cs.hg.push(g.n)}});
      R.groups=p.struct.filter(function(z){return z.items.length||z.sec!=='i'}).length;return cs});
    R.cs=useCs}
  var runItems=function(){
  p.items.forEach(function(it){
    var g=xfindGroup(it.group,it.sec);if(!g){R.skipped.push(it.label+' (קבוצה לא מזוהה: '+it.group+')');return}
    var key,item=xfindItem(g,it.label);
    if(item&&R.vals[g.n+'|'+item]!==undefined){var l2=xn(it.label).replace(/\s*\*$/,''),alt=its(g).filter(function(i){var q=xn(i);return q!==xn(item)&&q.indexOf(l2)===0&&R.vals[g.n+'|'+i]===undefined})[0];if(alt)item=alt}
    if(!item){var og=G.filter(function(z){return z.t===g.t&&z!==g&&xfindItem(z,it.label)})[0];if(og){g=og;item=xfindItem(og,it.label)}}
    if(!item){if(!it.val&&!it.m1&&!it.m2)return;item=it.label;(R.ni[g.n]=R.ni[g.n]||[]).push(item);R.added.push(g.n+' › '+item)}else R.matched++;
    key=g.n+'|'+item;R.vals[key]=it.val;
    if(target==='bal'){if(it.m1!=null||it.m2!=null)R.mo[key]=[it.m1==null?'':it.m1,it.m2==null?'':it.m2];var rt={};if(it.ra)rt.a=String(it.ra);if(it.rb)rt.b=String(it.rb);if(rt.a||rt.b)R.rt[key]=rt;if(it.pm)R.pm[key]=it.pm}});};
  if(useCs)W({cs:useCs,cx:{}},runItems);else runItems();
  if(target==='bal'){var ss=pick(/חסכונות והלוואות/),sRows=function(nm){return XLSX.utils.sheet_to_json(wb.Sheets[nm],{header:1,raw:true,defval:null})};
  if(!ss){var sv0=pick(/^חסכונות$/),ln0=pick(/^הלוואות$/);if(sv0||ln0){var rr=[];if(sv0)rr=rr.concat(sRows(sv0));if(ln0)rr=rr.concat([[null,'הלוואות']],sRows(ln0));var L2=xparseSav(rr);if(L2.sv.length||L2.ln.length||(L2.pn||[]).length)R.L=L2}}
  if(ss){var L=xparseSav(sRows(ss));if(L.sv.length||L.ln.length||L.pn.length)R.L=L}}
  return R}
