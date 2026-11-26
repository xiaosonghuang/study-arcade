const guideById = Object.fromEntries(GUIDES.map(u => [u.id,u]));
const themeNames = {game:'Game design',sports:'Sports',story:'Storytelling',mystery:'Science mystery'};
const modeNames = {teach:'Teach me',practice:'Practice',challenge:'Challenge'};
const taskGuide = {find:'html',delta:'expand',layout:'flex',read:'rhyme',css:'html',poster:'claim',algebra:'factor',atoms:'model',keys:'keys','submit-keys':'keys','expand-recall':'expand','science-recall':'conserve','factor-recall':'factor','vocab-review':'equiv','mixed-test':'equiv','beta-day':'expand'};
const oldSkills = {
  computing:['html','html','html','html','html','html','html','html','html','html','html',null,null,null,null,'html'],
  math:['expand','expand','factor','factor','expand','factor','equiv',null,null,'factor','expand','expand'],
  science:['particles','particles','conserve','conserve','model','particles','model','particles','particles','conserve','model','particles'],
  poetry:['rhyme','image','claim','image','rhyme','claim','claim','image','image','claim','rhyme','claim']
};
const choice = (obj,key,fallback) => Object.hasOwn(obj,key) ? key : fallback;
const peerKey='study-arcade.live.guided-peers.v1';
let peers={ledger:{},done:[]}, session=null;
function readLearning(v) {
  const input=plain(v)?v:{}, c=input.checkin;
  const checkin=plain(c) && /^\d{4}-\d{2}-\d{2}$/.test(c.at) ? {
    at:c.at,tricky:choice(guideById,c.tricky,''),finished:typeof c.finished==='string'?c.finished.slice(0,100):''
  } : null;
  return {unit:choice(guideById,input.unit,'html'),mode:choice(modeNames,input.mode,'teach'),
    theme:choice(themeNames,input.theme,'game'),checkin,ledger:GuideSkills.merge(input.ledger)};
}
function learningState(){return state.learning ||= readLearning(null);}
function allGuideEvidence(){return GuideSkills.merge(peers.ledger,learningState().ledger);}
function restoreGuidePeers(){
  try{const v=JSON.parse(localStorage.getItem(peerKey));if(v)setGuidePeers(v.ledger,v.done);}catch{}
}
function resetGuidePeers(){
  peers={ledger:{},done:[]};try{localStorage.removeItem(peerKey);}catch{}refreshSuggestions();
}
function setGuidePeers(ledger,done){
  const value={ledger:GuideSkills.merge(ledger),done:[...new Set((Array.isArray(done)?done:[]).filter(goodId))].sort()};
  if(JSON.stringify(value)===JSON.stringify(peers))return;
  peers=value;try{localStorage.setItem(peerKey,JSON.stringify(value));}catch{}
  refreshSuggestions();
}
function refreshSuggestions(){
  if(current==='home')renderGuideHome();
  if(current==='progress')renderGuideProgress();
  if(current==='learn'){
    // Keep a focused form, in-flight answer, and the open walkthrough intact.
    const box=id('guideSuggestion');if(box)box.innerHTML=recommendationMarkup();
    if(session && !session.feedback && !session.hint && !id('lessonPanel').contains(document.activeElement))renderPanel();
  }
}
const datedPlan=()=>family?.days.find(d=>d.date===today());
function assignedTasks(day){
  if(!day)return [];
  if(day.catchup)return day.catchup.map(id=>distinctTasks().find(t=>t.id===id)).filter(Boolean);
  return day.tasks;
}
function schoolSnapshot(d=datedPlan()){
  return d?{date:d.date,tasks:assignedTasks(d).slice(0,8).map(t=>({id:t.id,title:short(t.title,90)}))}:null;
}
function upcomingSchool(){
  const future=family?.days.find(day=>day.date>today() && assignedTasks(day).some(t=>!state.checks['block-'+t.id]));
  return future ? schoolSnapshot(future) : null;
}
function earlierPractice(skill){
  for(const [bank,skills] of Object.entries(oldSkills)){
    const answers=state.quizzes[bank]?.answers||{};
    if(skills.some((id,i)=>id===skill && (answers[i]?.solved||answers[i]?.mastered)))return true;
  }
  return false;
}
function suggestion(){
  const lesson=learningState(),ledger=allGuideEvidence(),day=datedPlan();
  const support=u=>GuideSkills.status(ledger,u.id);
  const rest=day&&!day.catchup&&!day.tasks.length;
  const tasks=assignedTasks(day);
  const task=tasks.find(t=>!state.checks['block-'+t.id]&&!peers.done.includes(t.id));
  if(task){
    const skill=guideById[taskGuide[task.id]], stats=skill && support(skill);
    const familiar=skill && earlierPractice(skill.id);
    const mode=stats?.recallDue?'recall':stats?.solo===2?'challenge':stats?.needsHelp?'teach':stats?.solo||familiar?'practice':'teach';
    return {title:task.title,reason:dateLabel(day.date)+' · Your family plan. Start with 10–15 minutes. '+(familiar && !stats.solo?'You have solved a related workbook question. Try a new one. ':'')+(tasks.length>1?'Also on the plan: '+tasks.filter(t=>t.id!==task.id).map(t=>t.title).join(' · ')+'.':''),
      unit:skill?.id,mode,plan:true};
  }
  const rememberedCheck=GUIDES.find(u=>support(u).recallDue);
  const tricky=guideById[lesson.checkin?.tricky];
  const needs=GUIDES.find(u=>support(u).needsHelp);
  const legacy=dueList().map(([key,i])=>guideById[oldSkills[key]?.[i]]).find(Boolean);
  const partial=GUIDES.find(u=>support(u).solo===1);
  const ready=GUIDES.find(u=>support(u).solo===2 && !support(u).stretch);
  const familiar=[guideById[lesson.unit],...GUIDES].find(u=>!ledger[u.id] && earlierPractice(u.id));
  const recommendations=[
    [rememberedCheck,'recall','You solved two different questions independently on an earlier day. Try one new question from memory.'],
    [needs,'teach','A recent question needed a hint. Try the worked example, then a different question.'],
    [legacy,'teach','An earlier workshop question is due for review. This guide teaches that skill.'],
    [tricky && !support(tricky).solo && tricky,'teach','You picked this skill at check-in. Start with one example.'],
    [partial,'practice','You solved one independent example. Try a different one.'],
    [ready,'challenge','You solved two different examples on your own. Try the stretch problem.'],
    [familiar,'practice','You have solved a related question in the original workbook. Try a fresh example here.'],
    [guideById[lesson.unit],lesson.mode,'Choose a worked example or jump straight into practice.']
  ];
  const [u,mode,reason]=recommendations.find(([unit])=>unit);
  return {title:rest?day.title+' · Free choice':u.title,reason:rest?'Your family plan leaves today open. Return another day or explore something for fun.':reason,unit:u.id,mode,rest};
}
function recommendationMarkup(){
  const s=suggestion();
  return '<div><p class="eyebrow">'+(s.plan?'First on your plan':s.rest?'Open day':'Your next step')+'</p><h2>'+esc(s.title)+'</h2><p>'+esc(s.reason)+'</p></div><div class="guide-actions">'+(s.unit?'<button class="primary" data-guide-start>'+esc(s.plan&&s.mode==='teach'?'Start the walkthrough':s.mode==='challenge'?'Try the stretch problem':s.mode==='practice'?'Continue practice':s.mode==='recall'?'Try the recall check':s.rest?'Explore a lesson':'Open this lesson')+' →</button>':'')+(s.plan?'<a class="secondary" href="#plan" data-today-plan>Open school checklist →</a>':'')+'</div>';
}
function renderGuideHome(){id('todayGuide').innerHTML=recommendationMarkup()+'<a href="#learn" class="studio-link">Choose a lesson in the learning studio →</a>';}
function selectOptions(entries,selected){
  return entries.map(([key,name])=>'<option value="'+esc(key)+'"'+(key===selected?' selected':'')+'>'+esc(name)+'</option>').join('');
}
function unitOptions(selected){
  return Object.entries(labels).map(([room,title])=>'<optgroup label="'+esc(title)+'">'+selectOptions(GUIDES.filter(u=>u.room===room).map(u=>[u.id,u.title]),selected)+'</optgroup>').join('');
}
function renderCheckin(){
  const p=learningState(),c=p.checkin,tasks=distinctTasks();
  const options=[['','Still working or nothing to add'],...tasks.map(t=>[t.id,t.title]),['other','Something else I did for school']];
  return '<details class="card guide-checkin"'+(!c?' open':'')+'><summary>'+esc(c?'My check-in · '+dateLabel(c.at):'Start with a quick check-in')+'</summary><div class="guide-selects"><label>What have you already finished? <select id="guideFinished">'+selectOptions(options,c?.finished)+'</select></label><label>What felt tricky? <select id="guideTricky"><option value="">Nothing in particular</option>'+unitOptions(c?.tricky)+'</select></label><label>What sounds interesting? <select id="guideInterest">'+selectOptions(Object.entries(themeNames),p.theme)+'</select></label></div><button type="button" data-checkin-save>Save my check-in</button><span id="checkinMessage" role="status"></span></details>';
}
function renderControls(){
  const p=learningState();
  id('guideControls').innerHTML='<div class="guide-selects studio-tools"><label>Lesson<select id="guideUnit">'+unitOptions(p.unit)+'</select></label><label>My theme<select id="guideTheme">'+selectOptions(Object.entries(themeNames),p.theme)+'</select></label></div><div class="mode-picks" role="group" aria-label="How to learn">'+Object.entries(modeNames).map(([value,name])=>'<button type="button" data-mode="'+value+'" aria-pressed="'+(p.mode===value)+'">'+name+'</button>').join('')+'</div>';
}
function availableItem(unit,skip=-1){
  const rows=allGuideEvidence()[unit.id]||{},now=GuideSkills.day(),choices=[0,1].filter(n=>n!==skip);
  return choices.find(n=>!rows[n]?.[2] && rows[n]?.[0]!==now) ?? choices.find(n=>!rows[n]?.[2]) ?? choices[0];
}
function createSession(unit,mode){
  const item=mode==='challenge'?2:mode==='recall'?3:availableItem(unit);
  return {id:unit.id,stage:mode==='teach'?'walk':'item',item,step:0,hint:false,feedback:'',lock:false};
}
function renderLearning(){
  const p=learningState();
  if(!session||session.id!==p.unit)session=createSession(guideById[p.unit],p.mode);
  id('guideStart').innerHTML=renderCheckin()+'<aside class="today-guide" id="guideSuggestion">'+recommendationMarkup()+'</aside>';
  renderControls();renderPanel();
}
function renderPanel(focus=false){
  const p=learningState(),u=guideById[p.unit],panel=id('lessonPanel');
  if(!session)return;
  panel.innerHTML=renderLesson(u,{...session,mode:p.mode,theme:p.theme,status:GuideSkills.status(allGuideEvidence(),u.id)});
  fields(panel);
  if(focus){const target=panel.querySelector('.lesson-feedback[role="status"]')||id('lessonFocus');if(target){target.tabIndex=-1;target.focus();}}
}
function openGuide(unitId,mode){
  const p=learningState(),u=guideById[unitId];if(!u)return;
  p.unit=unitId;p.mode=mode==='recall'?'practice':choice(modeNames,mode,'teach');
  session=createSession(u,mode);save(false);
  if(current!=='learn')location.hash='learn';else{renderControls();renderPanel(true);}
}
function reflect(skill,index,{supported=false,solved=false}={}){
  const learning=learningState(),now=GuideSkills.day(),combined=allGuideEvidence()[skill]?.[index]||[];
  const rows=learning.ledger[skill] ||= {}, row=rows[index] ||= [0,0,0,0];
  const aided=supported||combined[0]===now;
  if(supported)row[0]=now;
  if(solved){if(aided)row[1]=now;else row[2] ||= now;}
  row[3]=now;save();return aided;
}
function lessonAction(button){
  const action=button.dataset.act,num=Number(button.dataset.n),p=learningState(),u=guideById[p.unit],s=session;
  if(!s)return;
  const question=s.stage==='guided'?u.guided:s.item===3?u.recall:u.items[s.item];
  if(action==='answer'||action==='hint'){
    if(s.lock||s.stage==='walk'||(!Number.isInteger(num)&&action==='answer'))return;
    const independent=s.stage==='item',solved=action==='answer'&&num===question.answer;
    if(!solved){
      s.hint=true;s.feedback=action==='answer'?'miss':'';
      if(independent)reflect(u.id,s.item,{supported:true});
    }else{
      const aided=independent && reflect(u.id,s.item,{supported:s.hint,solved:true});
      s.feedback=independent?(aided?'aided':'solo'):'guided';s.lock=true;
      if(!independent)save();
    }
    renderPanel(true);refreshSuggestionBox();return;
  }
  const stats=GuideSkills.status(allGuideEvidence(),u.id);
  if(action==='step'){s.step=Math.max(0,Math.min(u.steps.length-1,num));s.stage='walk';}
  if(action==='guided'){s.stage='guided';}
  if(action==='teach'){openGuide(u.id,'teach');return;}
  if(action==='recall' && !stats.recallDue)return;
  if(action==='advance'&&s.stage==='item' && (s.item===2||s.item===3)){
    const units=GUIDES.filter(x=>x.room===u.room),next=units[(units.indexOf(u)+1)%units.length];openGuide(next.id,'teach');return;
  }
  if(['try','alternate','advance','challenge','recall'].includes(action)){
    const previous=s.stage==='item'?s.item:-1;
    s.item=action==='challenge'?2:action==='recall'?3:action==='advance'&&stats.recallDue?3:action==='advance'&&stats.solo===2?2:availableItem(u,action==='alternate'||action==='advance'?previous:-1);
    s.stage='item';p.mode=s.item===2?'challenge':'practice';renderControls();save(false);
  }
  s.feedback='';s.hint=false;s.lock=false;renderPanel(true);
}
function refreshSuggestionBox(){const el=id('guideSuggestion');if(el)el.innerHTML=recommendationMarkup();}
function renderGuideProgress(){
  const ledger=allGuideEvidence();
  id('guideProgress').innerHTML='<article class="card"><h2>My learning studio skills</h2><p>Two different practice solutions on your own open a stretch recommendation. A fresh question on a later day checks what stuck.</p><ul class="skill-list">'+GUIDES.map(u=>{
    const s=GuideSkills.status(ledger,u.id);return '<li><button class="linkbtn" data-learn-unit="'+u.id+'">'+esc(u.title)+'</button><span>'+esc(s.remembered?'Remembered on a later day':s.recallDue?'Ready for recall':s.stretch?'Stretch solved independently':s.solo===2?'Ready for stretch':s.solo===1?'1 of 2 independent':s.supported?'Solved with support':s.needsHelp?'Hint used':'Ready to explore')+'</span></li>';
  }).join('')+'</ul></article>';
}
function setupLearning(){
  if(location.protocol!=='file:' && 'serviceWorker' in navigator){
    navigator.serviceWorker.register('./workbook-worker.js').catch(()=>{ /* The downloaded HTML also works offline. */ });
  }
  for(const [room,name] of Object.entries(labels)){
    const slot=document.createElement('aside');slot.className='subject-guides';
    slot.innerHTML='<b>'+esc(name)+' walkthroughs</b><div>'+GUIDES.filter(u=>u.room===room).map(u=>'<button data-learn-unit="'+u.id+'">'+esc(u.title)+'</button>').join('')+'</div>';
    const intro=id(room).querySelector('.intro')||id(room).querySelector('h1');intro?.after(slot);
  }
  document.addEventListener('change',event=>{
    const e=event.target,p=learningState();
    if(e.id==='guideUnit')openGuide(e.value,p.mode);
    if(e.id==='guideTheme'){p.theme=choice(themeNames,e.value,'game');save(false);if(id('guideInterest'))id('guideInterest').value=p.theme;renderPanel();}
  });
  document.addEventListener('click',event=>{
    const button=event.target.closest('button,a');if(!button)return;
    if(button.hasAttribute('data-checkin-save')){
      const p=learningState(),finished=id('guideFinished').value;p.theme=id('guideInterest').value;
      p.checkin={finished,tricky:id('guideTricky').value,at:today()};
      if(distinctTasks().some(t=>t.id===finished))state.checks['block-'+finished]=true;
      save();renderLearning();id('checkinMessage').textContent=' Saved. You can change your choices anytime.';id('guideStart').querySelector('summary').focus();return;
    }
    if(button.hasAttribute('data-today-plan') && datedPlan()){state.day=today();save(false);}
    if(button.hasAttribute('data-guide-start')){const s=suggestion();if(s.unit)openGuide(s.unit,s.mode);}
    if(button.dataset.learnUnit)openGuide(button.dataset.learnUnit,'teach');
    if(button.dataset.mode)openGuide(learningState().unit,button.dataset.mode);
    if(button.dataset.act)lessonAction(button);
  });
}
