'use strict';
const id = key => document.getElementById(key);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels = {computing:'Computer science',math:'Math',english:'English',science:'Science'};
const quizRoom = {computing:'computing',math:'math',poetry:'english',science:'science'};
const pageNames = {home:'Workshop',...labels,plan:'My plan',progress:'My progress',sheet:'School-return sheet',rehearsal:'Mixed rehearsal'};
const blurbs = {computing:'Build a site and steer a sprite.',math:'Snap tiles into equivalent expressions.',english:'Find the line that makes a poem work.',science:'Build molecules and balance atoms.'};
const colors = {computing:'#d7d0f6',math:'#f4c6a3',english:'#f3d987',science:'#afdbd1'};
const artwork = {
 computing:'<rect x="33" y="10" width="104" height="62" rx="9" fill="#fff7e4"/><path d="M33 26h104" fill="none"/><circle cx="43" cy="18" r="2" fill="#ee956c"/><circle cx="51" cy="18" r="2" fill="#9cb86d"/><path d="m66 37-10 10 10 9m37-19 10 10-10 9m-18-23-6 27" fill="none"/><path d="m126 53 17 14-10 1-3 8z" fill="#dfee82"/>',
 math:'<g fill="#a09bcc"><rect x="34" y="14" width="43" height="15" rx="3"/><rect x="34" y="34" width="43" height="15" rx="3"/><rect x="34" y="54" width="43" height="15" rx="3"/></g><g fill="#f9efb5"><rect x="84" y="14" width="15" height="15" rx="3"/><rect x="84" y="34" width="15" height="15" rx="3"/><rect x="84" y="54" width="15" height="15" rx="3"/><rect x="105" y="14" width="15" height="15" rx="3"/><rect x="105" y="34" width="15" height="15" rx="3"/><rect x="105" y="54" width="15" height="15" rx="3"/></g><path d="M128 14h6v55h-6" fill="none"/>',
 english:'<g transform="rotate(-8 79 44)"><rect x="39" y="10" width="75" height="60" rx="5" fill="#fff8dd"/><path d="M51 24h43m-43 10h33m-33 11h40m-40 10h24" stroke="#82738a"/></g><g transform="rotate(32 116 39)"><rect x="110" y="9" width="12" height="47" rx="3" fill="#bbabd9"/><path d="m110 56 6 14 6-14z" fill="#eeb680"/></g>',
 science:'<path d="m52 55 28-24 37 21" fill="none" stroke-width="9"/><circle cx="49" cy="57" r="14" fill="#fef4d2"/><circle cx="81" cy="31" r="20" fill="#df936f"/><circle cx="119" cy="55" r="14" fill="#fef4d2"/><g fill="#3c3351" stroke="none" font-family="Arial,sans-serif" font-size="14" text-anchor="middle"><text x="49" y="62">H</text><text x="81" y="36">O</text><text x="119" y="60">H</text></g>'
};
function art(k, cls=''){return '<svg class="'+cls+'" viewBox="0 0 170 82" fill="none" stroke="#42394c" stroke-width="2.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+artwork[k]+'</svg>';}
const today=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
function nextDate(){const d=new Date();d.setDate(d.getDate()+1);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
const plain=o=>!!o&&typeof o==='object'&&!Array.isArray(o);
const progressKey='study-arcade.progress.v2',planKey='study-arcade.family.v1';
function empty(){return {app:'study-arcade',version:2,updated:null,day:'',lastRoom:'computing',checks:{},notes:{},labs:{},quizzes:{},exam:null};}
let state=empty(), family=null, storageOK=true, otherTab=false, stagedPlan=null, stagedProgress=null, current='', warmIndex=0, pendingTopic=null;
function safeJson(raw){
 if(typeof raw!=='string'||raw.length>2400000) throw Error('Choose a complete JSON file under 2.4 MB.');
 let obj;try{obj=JSON.parse(raw,(key,value)=>{if(['__proto__','constructor','prototype'].includes(key))throw Error();return value;});}catch{throw Error('This file does not contain readable workbook JSON.');}return obj;
}
function readProgress(raw){
 const v=safeJson(raw);
 if(!plain(v))throw Error('Choose a progress backup.');
 const old=v.version===1&&typeof v.app==='string'&&v.app.endsWith('-thanksgiving-2026');
 if(!(old||v.version===2&&v.app==='study-arcade')||![v.notes,v.checks,v.labs,v.quizzes].every(plain))throw Error('Choose a Study Arcade or earlier Thanksgiving progress file.');
 if(!Object.values(v.notes).every(x=>typeof x==='string'&&x.length<=10000)||!Object.values(v.checks).every(x=>typeof x==='boolean'))throw Error('Unreadable notes or checkboxes.');
 for(const [k,q] of Object.entries(v.quizzes)){
  if(!plain(q)||!Number.isInteger(q.index)||q.index<0||!plain(q.answers))throw Error('Unreadable practice record.');
  const bank=BANK[k];if(!bank)continue;
  if(q.index>=bank.length)throw Error('Unknown practice question.');
  for(const [i,a] of Object.entries(q.answers)){
   if(!/^\d+$/.test(i)||!bank[i]||!plain(a)||!Number.isInteger(a.choice)||!bank[i].options[a.choice]||typeof a.missed!=='boolean'||typeof a.solved!=='boolean')throw Error('Unreadable practice answer.');
   if(old&&a.missed)a.due=today();
  }
 }
 const merged={...empty(),notes:v.notes,checks:v.checks,labs:v.labs,quizzes:v.quizzes};
 if(typeof v.updated==='string'&&Number.isFinite(Date.parse(v.updated)))merged.updated=v.updated;
 if(typeof v.day==='string'&&v.day.length<=12)merged.day=v.day;
 if(Object.hasOwn(labels,v.lastRoom))merged.lastRoom=v.lastRoom;
 if(!old&&v.exam!==null&&v.exam!==undefined){
  const e=v.exam;if(!plain(e)||!Number.isInteger(e.set)||e.set<0||e.set>1||!Array.isArray(e.answers)||e.answers.length!==6||!e.answers.every(a=>a===null||Number.isInteger(a)&&a>=0&&a<4)||typeof e.finished!=='boolean'||e.finished&&e.answers.includes(null))throw Error('Unreadable rehearsal record.');merged.exam=e;
 }
 return merged;
}
const strings=a=>Array.isArray(a)&&a.every(s=>typeof s==='string'&&s.length<=8000);
const goodId=s=>typeof s==='string'&&/^[a-zA-Z0-9_-]{1,70}$/.test(s);
function parsePlan(raw){
 const v=safeJson(raw);if(!plain(v)||v.kind!=='study-arcade-family-plan'||v.version!==1||typeof v.title!=='string'||!plain(v.links)||!Array.isArray(v.days)||!v.days.length||!Array.isArray(v.questions)||!Array.isArray(v.pack)||!strings(v.dates))throw Error('Choose the private family-plan JSON from your folder.');
 for(const [key,l] of Object.entries(v.links)){if(!goodId(key)||!plain(l)||typeof l.label!=='string'||typeof l.url!=='string'||!/^https:\/\//i.test(l.url)||!new URL(l.url).hostname)throw Error('A plan link is unreadable.');}
 const seen=new Set();
 if(v.days.length>100||v.questions.length>8||v.pack.length>20||v.dates.length>20)throw Error('This family plan is too large.');
 for(const d of v.days){if(!plain(d)||!/^\d{4}-\d{2}-\d{2}$/.test(d.date)||seen.has(d.date)||typeof d.title!=='string'||typeof d.time!=='string'||typeof d.intro!=='string'||!Array.isArray(d.tasks))throw Error('A plan day is unreadable.');seen.add(d.date);if(d.catchup&&(!strings(d.catchup)||!d.catchup.every(goodId)))throw Error('Unreadable catch-up checklist.');
 for(const t of d.tasks){if(!plain(t)||!goodId(t.id)||!Object.hasOwn(pageNames,t.room)||typeof t.title!=='string'||typeof t.text!=='string'||!strings(t.links)||!t.links.every(k=>Object.hasOwn(v.links,k))||!strings(t.notes)||!t.notes.every(goodId))throw Error('A plan task is unreadable.');}}
 for(const item of [...v.questions,...v.pack])if(!plain(item)||!goodId(item.key)||typeof item.label!=='string'||typeof item.prompt!=='string')throw Error('A school-return item is unreadable.');
 return v;
}
function load(){
 try{localStorage.setItem(progressKey+'.test','1');localStorage.removeItem(progressKey+'.test');}catch{storageOK=false;return;}
 try{const raw=localStorage.getItem(progressKey);if(raw)state=readProgress(raw);}catch{storageOK=false;}
 try{const raw=localStorage.getItem(planKey);if(raw)family=parsePlan(raw);}catch{/* A new family file can be selected in My plan. */}
}
function save(){
 state.updated=new Date().toISOString();if(storageOK&&!otherTab){try{localStorage.setItem(progressKey,JSON.stringify(state));}catch{storageOK=false;}}status();
}
function status(){
 const s=id('storeStatus');if(!s)return;
 s.textContent=otherTab?'Another tab changed this workbook. Export your work here or reload to use the newest copy.':storageOK?'Your answers and notes are saved in this browser. Export your progress to move it to another device.':'This browser cannot keep a local copy. Export or copy your progress before closing.';
 if(storageOK&&!otherTab)id('saveWarning').hidden=true;
 if(!storageOK||otherTab){id('saveWarning').hidden=false;id('saveWarning').textContent=otherTab?'Another tab saved changes. Open Progress to keep this copy.':'Local saving is unavailable. Open Progress to export your work.';}
}
window.getLab=k=>state.labs[k];window.saveLab=(k,v)=>{state.labs[k]=v;save();};
window.addEventListener('storage',e=>{if(e.key===progressKey&&e.newValue!==JSON.stringify(state)){otherTab=true;status();}});
function fields(root=document){
 root.querySelectorAll('[data-note]').forEach(el=>{el.value=state.notes[el.dataset.note]||'';if(el.tagName!=='SELECT')el.maxLength=4000;});
 root.querySelectorAll('[data-check]').forEach(el=>{el.checked=!!state.checks[el.dataset.check];});
}
function note(k,label){return '<label>'+esc(label)+'<textarea data-note="'+esc(k)+'"></textarea></label>';}
function check(k,label){return '<label><input type="checkbox" data-check="'+esc(k)+'"> '+esc(label)+'</label>';}
function fileDownload(text,name){const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
function currentDay(){if(!family)return null;const a=family.days;return a.find(d=>d.date>=today())||a[a.length-1];}
function selectedDay(){return family.days.find(d=>d.date===state.day||d.legacy===state.day)||currentDay();}
function home(){
 id('roomCards').innerHTML=Object.keys(labels).map(k=>'<a class="room-card" href="#'+k+'"><div class="tile-art" style="background:'+colors[k]+'">'+art(k)+'</div><div class="copy"><h3>'+labels[k]+' <span aria-hidden="true">↗</span></h3><p>'+blurbs[k]+'</p></div></a>').join('');
 const date=currentDay();id('continue').href=date?'#plan':'#'+state.lastRoom;id('continue').onclick=()=>{if(date){state.day=date.date;save();}};
 id('planTease').innerHTML=family?'<p><b>'+esc(family.title)+'</b> · '+esc(date.title)+'</p><a href="#plan">Open my plan →</a>':'<p><b>Have a family plan?</b> Open it to see your own assignments and dates.</p><a href="#plan">Open a plan →</a>';
 reviewPanel();
}
const warms=[
 ['math','What does 3(x + 2) expand to?','3x + 6. Each of the three rows contains one x tile and two unit tiles.'],
 ['science','How many atoms make one H₂O molecule?','Three atoms. The small 2 counts two hydrogen atoms, and O contributes one oxygen atom.'],
 ['computing','Which CSS property puts space between flex items?','gap sets the space between neighboring flex items. Try it on a parent container.'],
 ['english','“The page waits.” What is the poet doing?','Giving a page a human action is personification. It can make a blank page feel like an expectant listener.']
];
function warm(){const [k,q,a]=warms[warmIndex];id('warmArt').innerHTML=art(k,'warm-art');id('warmPrompt').textContent=q;id('warmAnswer').textContent=a;id('warmAnswer').hidden=true;id('reveal').textContent='Reveal answer';id('reveal').setAttribute('aria-expanded','false');}
function dueList(){const due=[];for(const k of Object.keys(quizRoom)){const answers=state.quizzes[k]?.answers||{};for(const [i,a] of Object.entries(answers)){if(a.due&&a.due<=today())due.push([k,Number(i)]);}}return due;}
function reviewPanel(){const due=dueList(),box=id('reviewPanel');box.hidden=!due.length;if(due.length)box.innerHTML='<p><b>Ready for another try?</b> '+due.length+' earlier practice '+(due.length===1?'question is':'questions are')+' ready to revisit.</p><button data-revisit="1">Review a missed skill →</button>';}
function quizState(k){return state.quizzes[k]||(state.quizzes[k]={index:0,answers:{}});}
function quizRender(k,focus=false){
 const holder=document.querySelector('[data-quiz="'+k+'"]');if(!holder)return;
 const b=BANK[k],s=quizState(k),q=b[s.index],a=s.answers[s.index],shown=a&&!a.reviewing?a:null;
 const h=shown?'<p role="status" class="feedback '+(shown.solved?'good':'')+'"><b>'+(shown.solved?'That’s it. ':'Try again. ')+'</b>'+esc(shown.solved?q.why:q.hint)+'</p>':'';
 const choices=q.options.map((o,i)=>'<button type="button" data-answer="'+i+'" class="'+(shown&&shown.choice===i?(shown.solved?'correct':'wrong'):'')+'" '+(shown?.solved?'disabled':'')+'>'+esc(o)+'</button>').join('');
 holder.innerHTML='<div class="quizbox"><div class="quizhead"><b>Try it on your own</b><span>Question '+(s.index+1)+' / '+b.length+'</span></div><h3 tabindex="-1">'+esc(q.q)+'</h3><div class="choices">'+choices+'</div>'+h+'<div class="quiznext"><button data-step="next">'+(shown?.solved?'Next challenge':'Try a fresh question')+' →</button><button class="linkbtn" data-step="prev">Previous</button>'+(Object.values(s.answers).some(r=>r.missed)?'<button data-step="missed" class="linkbtn">Revisit a miss</button>':'')+(shown?.solved?'<button class="linkbtn" data-step="retry">Try from memory</button>':'')+'</div></div>';
 if(focus){const el=holder.querySelector('[role=status]')||holder.querySelector('h3');el.tabIndex=-1;el.focus({preventScroll:true});}
}
function quizAction(btn,box){
 const k=box.dataset.quiz,s=quizState(k),bank=BANK[k],q=bank[s.index],last=s.answers[s.index];
 if(btn.hasAttribute('data-answer')){
  if(last?.solved&&!last.reviewing)return;const choice=Number(btn.dataset.answer),solved=choice===q.answer;
  const due=solved?(last?.due&&last.due<=today()&&last.reviewing?null:last?.due||null):nextDate();
  s.answers[s.index]={choice,solved,missed:!!last?.missed||!solved,mastered:!!last?.mastered||solved,reviewing:false,due};
 }else{
  switch(btn.dataset.step){
  case 'retry':if(last)last.reviewing=true;break;
  case 'missed':{for(let n=1;n<=bank.length;n++){let i=(s.index+n)%bank.length;if(s.answers[i]?.missed){s.index=i;s.answers[i].reviewing=true;break;}}break;}
  default:s.index=(s.index+(btn.dataset.step==='prev'?-1:1)+bank.length)%bank.length;
  }
 }
 save();quizRender(k,true);reviewPanel();
}
const lessonTargets={brief:'Choose a design brief',layout:'Build the layout',selector:'Predict which lines will change',sprite:'Move a sprite with a condition',tiles:'Rectangle lab',diagnose:'Catch the missing term',atoms:'Build the products yourself',writing:'Write, then revise',evidence:'Choose your evidence'};
function openLesson(topic,room){
 const heading=Array.from(id(room).querySelectorAll('h2')).find(h=>h.textContent.trim()===lessonTargets[topic]);if(!heading)return;
 heading.tabIndex=-1;heading.scrollIntoView({block:'start'});heading.focus({preventScroll:true});
}
function dateLabel(date){return new Date(date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});}
function taskLinks(t){return t.links.map(k=>family.links[k]).map(l=>'<a href="'+esc(l.url)+'" target="_blank" rel="noopener noreferrer">'+esc(l.label)+' ↗</a>').join(' ');}
function distinctTasks(){const seen=new Map();for(const d of family?.days||[])for(const t of d.tasks)if(!seen.has(t.id))seen.set(t.id,t);return Array.from(seen.values());}
function tasksForDay(d){if(!d.catchup)return d.tasks;const tasks=distinctTasks();return d.catchup.map(key=>tasks.find(t=>t.id===key)).filter(t=>t&&!state.checks['block-'+t.id]);}
function planner(){
 const box=id('planner');
 if(!family){box.innerHTML='<div class="card"><h2>Bring your schedule into the workshop</h2><p>Download your private family-plan file from Box. Open it below to add your daily work, assignment links, and school-return sheet.</p><p>Until then, all four subject rooms are ready to explore.</p><a href="#home">Choose a subject →</a></div>';id('familyDetails').open=true;return;}
 const d=selectedDay(),list=tasksForDay(d);
 box.innerHTML='<p class="intro">'+esc(family.title)+'</p><div class="dayselect"><label>Choose a day<select id="dateChoice">'+family.days.map(x=>'<option value="'+esc(x.date)+'" '+(x===d?'selected':'')+'>'+esc(dateLabel(x.date))+' · '+esc(x.title)+'</option>').join('')+'</select></label><button id="toToday">Go to today</button><a href="#sheet">School-return sheet →</a></div><h2>'+esc(d.title)+'</h2><p><b>'+esc(dateLabel(d.date))+' · '+esc(d.time)+'</b></p><p>'+esc(d.intro)+'</p><div class="blocks">'+list.map(t=>'<article class="card"><p class="eyebrow">'+esc(pageNames[t.room])+'</p><h3>'+esc(t.title)+'</h3><p>'+esc(t.text)+'</p><div class="school-links">'+(t.room==='plan'?'':'<a href="#'+t.room+'" data-topic="'+esc(t.target||'')+'">Open '+esc(pageNames[t.room])+' →</a>')+taskLinks(t)+'</div><details><summary>Evidence and notes</summary>'+note('evidence-'+t.id,'What can I show? What will I do next?')+'</details>'+check('block-'+t.id,'I finished this block')+'</article>').join('')+'</div>'+(d.catchup&&!list.length?'<p>All the break blocks are finished. Check your school-return sheet and pack your work.</p>':'');
 fields(box);
}
function evidence(t){return state.notes['evidence-'+t.id]?.trim()||t.notes.map(k=>state.notes[k]?.trim()).filter(Boolean).join(' · ');}
function short(s,n){s=String(s||'').trim().replace(/\s+/g,' ');return s.length>n?s.slice(0,n-1)+'…':s;}
function sheet(){
 const el=id('sheetBody');if(!family){el.innerHTML='<div class="card"><p>Open your family plan to get the checklist and teacher questions for your first day back.</p><a class="secondary" href="#plan">Open my plan</a></div>';return;}
 const tasks=distinctTasks(),rows=tasks.filter(t=>state.checks['block-'+t.id]||evidence(t));
 el.innerHTML='<button class="primary" id="printSheet" type="button">Print one-page sheet</button><article class="card"><h2>Work I can show</h2>'+(rows.length?'<ul>'+rows.map(t=>'<li><b>'+esc(t.title)+'</b> · '+(state.checks['block-'+t.id]?'Finished':'In progress')+' '+esc(evidence(t))+'</li>').join('')+'</ul>':'<p>Add evidence to a study block or write in a lesson notebook. It will appear here.</p>')+'</article><div class="grid2"><article class="card"><h2>Questions to take</h2>'+family.questions.map(q=>'<p><b>'+esc(q.label)+'</b> · '+esc(q.prompt)+'</p>'+note(q.key,'My question for '+q.label)).join('')+note('teacherReply','Teacher reply, next action, and confirmed date')+'</article><article class="card"><h2>Pack and hand in</h2>'+family.pack.map(i=>check(i.key,i.label)).join('')+'<h3>Coming up</h3><ul>'+family.dates.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></article></div>';
 fields(el);
}
function printPage(){
 if(!family){id('paper').innerHTML='<h1>School-return sheet</h1><p>Open your family plan to print its questions and checklist.</p>';return;}
 const tasks=distinctTasks(),evidenced=tasks.filter(t=>evidence(t)||state.checks['block-'+t.id]);
 const pageTasks=(evidenced.length?evidenced:tasks).slice(0,10);
 id('paper').innerHTML='<h1>My school-return sheet</h1><p>'+esc(family.title)+'</p><h2>Work I can show</h2><table><tr><th>Study block</th><th>Progress and evidence</th></tr>'+pageTasks.map(t=>'<tr><td>'+esc(short(t.title,54))+'</td><td>'+esc((state.checks['block-'+t.id]?'Finished':'Open')+' · '+short(evidence(t),80))+'</td></tr>').join('')+'</table><h2>Teacher conversations</h2>'+family.questions.map(q=>'<p><b>'+esc(q.label)+'</b> · '+esc(short(state.notes[q.key]||q.prompt,126))+'</p>').join('')+'<p><b>Reply / confirmed date</b> '+esc(short(state.notes.teacherReply,145))+'</p><h2>Pack and hand in</h2><p>'+family.pack.map(i=>(state.checks[i.key]?'☑ ':'☐ ')+esc(i.label)).join(' · ')+'</p><h2>Coming up</h2>'+family.dates.map(s=>'<p>'+esc(s)+'</p>').join('')+'<p class="small">Shows up to ten blocks. Full notes stay in the workshop.</p>';
}
function notebook(){
 const entries=Object.entries(state.notes).filter(([,s])=>s.trim());
 if(!entries.length)return '';
 return '<details class="card"><summary>My saved notebook · '+entries.length+' entries</summary>'+entries.map(([k,v])=>{const field=Array.from(document.querySelectorAll('[data-note]')).find(e=>e.dataset.note===k),human=field?.labels?.[0]?.textContent.trim()||k.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[-_]/g,' ');return '<p><b>'+esc(short(human,100))+'</b><br>'+esc(v)+'</p>';}).join('')+'</details>';
}
function mastery(){
 const due=dueList();id('mastery').innerHTML='<article class="card"><h2>Skills in practice</h2>'+Object.entries(quizRoom).map(([k,r])=>{const done=Object.values(quizState(k).answers).filter(v=>v.solved||v.mastered).length;return '<div class="mastery-row"><a href="#'+r+'">'+labels[r]+'</a><progress value="'+done+'" max="'+BANK[k].length+'" aria-label="'+labels[r]+' questions solved"></progress><span>'+done+' / '+BANK[k].length+'</span></div>';}).join('')+'<p>'+due.length+' question'+(due.length===1?' is':'s are')+' ready to revisit today.</p>'+(due.length?'<button data-revisit="1">Review a missed skill</button>':'')+'</article>'+notebook();status();
}
// Two parallel forms keep the retake fresh while covering the same six skills.
const examForms=[
 [['Expand 4(2x + 3).',['8x + 12','8x + 3','6x + 7','4x + 12'],0,'Four groups of 2x + 3 contain 8x and 12 units.'],
 ['Factor 12x + 18 using the greatest common factor.',['3(4x + 6)','6(2x + 3)','6(2x + 18)','12(x + 6)'],1,'Both terms divide by 6, leaving 2x and 3.'],
 ['In 7x − 5, which number is the coefficient of x?',['−5','5','7','x'],2,'7 multiplies x. The constant is −5.'],
 ['Someone rewrites 5(2x − 1) as 10x − 1. What needs changing?',['Replace 10x with 7x','Change the minus sign to plus','Multiply x by 1','Multiply −1 by 5 as well'],3,'The factor 5 multiplies both terms, giving 10x − 5.'],
 ['If x = 3, what do 2(x + 4) and 2x + 8 both equal?',['10','14','12','18'],1,'2(3 + 4) = 14 and 2·3 + 8 = 14.'],
 ['Which observation proves two expressions equivalent for every x?',['They agree at x = 0','They have the same number of terms','Distributing turns one into the other','They use the same variable'],2,'The distributive property applies to every value of x.']],
 [['Expand 3(4x − 2).',['7x − 2','12x − 2','12x − 6','12x + 6'],2,'Multiply both 4x and −2 by 3.'],
 ['Factor 15x + 25 using the greatest common factor.',['5(3x + 5)','3(5x + 5)','5(3x + 25)','15(x + 10)'],0,'The greatest common factor is 5. Inside the parentheses are 3x and 5.'],
 ['What is the constant term in 9x − 4?',['9','x','4','−4'],3,'The term without a variable is −4, including its sign.'],
 ['A student rewrites 8x + 12 as 4(2x + 12). Which fix works?',['Change 4 to 8','Divide 12 by 4 inside the parentheses','Change 2x to 8x','Multiply 12 by 4 inside the parentheses'],1,'Divide each term by 4 to get 4(2x + 3).'],
 ['At x = 2, what is the value of 3(2x + 1)?',['9','12','15','18'],2,'3(4 + 1) gives 15. Its expansion, 6x + 3, gives 15 too.'],
 ['Which pair is equivalent for all values of x?',['4(x + 2) and 4x + 2','3x + 1 and 4x','x + 6 and 6x','2(3x + 1) and 6x + 2'],3,'Distributing the 2 gives 6x + 2 for every x.']]
];
function rehearsal(){
 if(!state.exam)state.exam={set:0,answers:Array(6).fill(null),finished:false};const e=state.exam,qs=examForms[e.set],score=qs.filter((q,i)=>q[2]===e.answers[i]).length;
 id('exam').innerHTML=(e.finished?'<h2>'+score+' of 6 correct</h2><p>Compare your reasoning with each explanation.</p>':'<h2>Six questions</h2><p>Answer each one. You can change your choices before checking the round.</p>')+qs.map((q,i)=>'<fieldset><legend><b>'+(i+1)+'. '+esc(q[0])+'</b></legend>'+q[1].map((o,j)=>'<label><input type="radio" name="exam-'+i+'" data-exam="'+i+'" value="'+j+'" '+(e.answers[i]===j?'checked':'')+' '+(e.finished?'disabled':'')+'> '+esc(o)+'</label>').join('')+(e.finished?'<p class="feedback '+(q[2]===e.answers[i]?'good':'')+'"><b>'+(q[2]===e.answers[i]?'Correct. ':'Check this one. ')+'</b>'+esc(q[3])+'</p>':'')+'</fieldset>').join('')+(e.finished?'<button id="againExam">Try the other round →</button>':'<button id="finishExam">Check my rehearsal</button><p id="examMsg" role="status"></p>');
}
function route(scroll=true){
 const hash=location.hash.slice(1);const k=Object.hasOwn(pageNames,hash)?hash:'home';current=k;
 document.querySelectorAll('section.room').forEach(el=>{el.classList.toggle('active',el.id===k);});
 document.querySelectorAll('.nav nav a').forEach(el=>{const dest=el.hash.slice(1),active=dest===k||dest==='home'&&Object.hasOwn(labels,k)||k==='rehearsal'&&dest==='home'||k==='sheet'&&dest==='plan';if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
 if(Object.hasOwn(labels,k)&&state.lastRoom!==k){state.lastRoom=k;save();}
 if(k==='home')home();if(k==='plan')planner();if(k==='sheet')sheet();if(k==='progress')mastery();if(k==='rehearsal')rehearsal();
 document.title=pageNames[k]+' · Study Arcade';if(scroll){window.scrollTo(0,0);id('workspace').focus({preventScroll:true});if(pendingTopic&&pendingTopic.room===k){const item=pendingTopic;pendingTopic=null;requestAnimationFrame(()=>openLesson(item.topic,k));}}
}
function restoreAll(){for(const k of Object.keys(quizRoom))quizRender(k);fields();window.dispatchEvent(new Event('restore-labs'));route(false);}
function reviewProgress(raw){stagedProgress=null;id('progressPreview').hidden=true;try{stagedProgress=readProgress(raw);const n=Object.values(stagedProgress.notes).filter(x=>x.trim()).length;id('pendingProgress').textContent=n+' notes · '+Object.values(stagedProgress.checks).filter(Boolean).length+' checked items · '+(stagedProgress.updated?new Date(stagedProgress.updated).toLocaleString():'Undated')+'. Using this backup replaces progress in this browser. Export your current copy first if you want to keep it.';id('progressPreview').hidden=false;id('progressMessage').textContent='Backup ready to review.';}catch(e){id('progressMessage').textContent=e.message;}}
function reviewPlan(raw){stagedPlan=null;id('planPreview').hidden=true;try{stagedPlan=parsePlan(raw);id('pendingPlan').textContent=stagedPlan.title+' · '+stagedPlan.days.length+' scheduled days. Use this schedule on this device?';id('planPreview').hidden=false;id('planMessage').textContent='Plan ready.';}catch(e){id('planMessage').textContent=e.message;}}
function readInput(input,callback,errId){
 input.onchange=async()=>{const f=input.files[0];if(!f)return;input.value='';if(errId==='planMessage'){stagedPlan=null;id('planPreview').hidden=true;}else{stagedProgress=null;id('progressPreview').hidden=true;}try{if(f.size>2400000)throw Error('Choose a file smaller than 2.4 MB.');callback(await f.text());}catch(e){id(errId).textContent=e.message;}};
}
function bootArcade(){
 load();status();warm();const mathRoom=id('math');if(!mathRoom.querySelector('a[href="#rehearsal"]')){const link=document.createElement('p');link.innerHTML='<a class="secondary" href="#rehearsal">Take the mixed math rehearsal →</a>';mathRoom.append(link);}
 id('shuffle').onclick=()=>{warmIndex=(warmIndex+1)%warms.length;warm();};
 id('reveal').onclick=()=>{const a=id('warmAnswer');a.hidden=!a.hidden;id('reveal').textContent=a.hidden?'Reveal answer':'Hide answer';id('reveal').setAttribute('aria-expanded',String(!a.hidden));};
 id('export').onclick=()=>{fileDownload(JSON.stringify(state,null,2),'Study-Arcade-Progress-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json');id('progressMessage').textContent='Progress file prepared. Save it in your private folder.';};
 id('showText').onclick=()=>{id('backupText').value=JSON.stringify(state,null,2);id('backupText').focus();id('backupText').select();};
 id('reviewText').onclick=()=>reviewProgress(id('backupText').value);
 readInput(id('familyFile'),reviewPlan,'planMessage');readInput(id('progressFile'),reviewProgress,'progressMessage');
 id('useProgress').onclick=()=>{if(!stagedProgress)return;state=stagedProgress;stagedProgress=null;otherTab=false;id('saveWarning').hidden=true;id('progressPreview').hidden=true;id('backupText').value='';save();restoreAll();id('progressMessage').textContent='Progress imported.';};
 id('cancelProgress').onclick=()=>{stagedProgress=null;id('progressPreview').hidden=true;id('progressMessage').textContent='Current work kept.';};
 id('usePlan').onclick=()=>{if(!stagedPlan)return;family=stagedPlan;stagedPlan=null;id('planPreview').hidden=true;let persisted=false;try{localStorage.setItem(planKey,JSON.stringify(family));persisted=true;}catch{}id('planMessage').textContent=persisted?'Plan saved in this browser.':'Plan opened for this session. Import it again if you close this browser.';planner();};
 id('cancelPlan').onclick=()=>{stagedPlan=null;id('planPreview').hidden=true;id('planMessage').textContent='Current plan kept.';};
 id('offline').href=location.href.split('#')[0].split('?')[0].replace(/\/$/,'/index.html');
 document.addEventListener('input',ev=>{const e=ev.target;if(e.matches('[data-note]')){state.notes[e.dataset.note]=e.value.slice(0,4000);save();}});
 document.addEventListener('change',ev=>{const e=ev.target;if(e.matches('[data-check]')){state.checks[e.dataset.check]=e.checked;document.querySelectorAll('[data-check]').forEach(o=>{if(o!==e&&o.dataset.check===e.dataset.check)o.checked=e.checked;});save();if(current==='plan'&&selectedDay()?.catchup)planner();}
 if(e.id==='dateChoice'){state.day=e.value;save();planner();id('dateChoice').focus({preventScroll:true});}
 if(e.hasAttribute('data-exam')){state.exam.answers[Number(e.dataset.exam)]=Number(e.value);save();}});
 document.addEventListener('click',ev=>{const a=ev.target.closest('a');if(a?.classList.contains('skip')){ev.preventDefault();id('workspace').focus();return;}
 if(a?.dataset.topic&&Object.hasOwn(lessonTargets,a.dataset.topic)){ev.preventDefault();pendingTopic={topic:a.dataset.topic,room:a.hash.slice(1)};if(location.hash===a.hash)route();else location.hash=a.hash;}
 const b=ev.target.closest('button');if(!b)return;const qb=b.closest('[data-quiz]');if(qb&&(b.hasAttribute('data-answer')||b.hasAttribute('data-step')))quizAction(b,qb);
 if(b.hasAttribute('data-revisit')){const first=dueList()[0];if(!first)return;const [k,i]=first,q=quizState(k);q.index=i;q.answers[i].reviewing=true;save();location.hash=quizRoom[k];quizRender(k);requestAnimationFrame(()=>{const h=document.querySelector('[data-quiz="'+k+'"] h3');h.scrollIntoView({block:'center'});h.focus({preventScroll:true});});}
 if(b.id==='toToday'){state.day=currentDay().date;save();planner();}
 if(b.id==='printSheet'){printPage();window.print();}
 if(b.id==='finishExam'){if(state.exam.answers.includes(null)){id('examMsg').textContent='Choose an answer for all six questions first.';}else{state.exam.finished=true;save();rehearsal();id('exam').scrollIntoView();}}
 if(b.id==='againExam'){state.exam={set:1-state.exam.set,answers:Array(6).fill(null),finished:false};save();rehearsal();id('exam').scrollIntoView();}});
 window.addEventListener('beforeprint',printPage);window.addEventListener('hashchange',()=>route());restoreAll();
}
