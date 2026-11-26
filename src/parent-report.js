// The parent report includes dated school tasks. Peers receive only skill evidence and checked IDs.
function familySnapshot() {
  const subjects={};
  for(const key of Object.keys(quizRoom)){
    const entries=Object.entries(state.quizzes[key]?.answers||{});
    subjects[key]={
      tried:entries.map(([i])=>Number(i)),
      solved:entries.filter(([,a])=>a.solved||a.mastered).map(([i])=>Number(i)),
      due:entries.filter(([,a])=>a.due&&a.due<=today()).map(([i])=>Number(i))
    };
  }
  const tasks=distinctTasks();
  const permittedLabs=['cs-client','cs-flex','cs-selector','cs-runner','math-area','science-particles','poetryStudio','math-substitution','science-assembly'];
  let exam=null;
  if(state.exam){
    const e=state.exam;
    exam={done:e.finished,answered:e.answers.filter(a=>a!==null).length,
      score:e.finished?examForms[e.set].filter((q,i)=>q[2]===e.answers[i]).length:null};
  }
  const taskIDs=list=>list.map(t=>t.id).slice(0,64);
  return {v:1,at:state.lastActivityAt,subjects,
    blocks:{all:taskIDs(tasks),done:taskIDs(tasks.filter(t=>state.checks['block-'+t.id])),
      started:taskIDs(tasks.filter(t=>!state.checks['block-'+t.id]&&evidence(t)))},
    guide:learningState().ledger,school:schoolSnapshot(),schoolNext:upcomingSchool(),checkin:learningState().checkin ? {tricky:learningState().checkin.tricky,at:learningState().checkin.at} : null,
    notes:Object.values(state.notes).filter(v=>v.trim()).length,
    labs:permittedLabs.filter(k=>Object.hasOwn(state.labs,k)),exam};
}
const parentSync=createReportSync({
  prefix:'study-arcade.live.',snapshotForDevice:familySnapshot,conflict:()=>otherTab,plan:()=>family,
  openProgress:()=>route(false),
  skills:{
    project:snapshot=>({v:1,guide:snapshot.guide,done:snapshot.blocks.done}),
    restore:restoreGuidePeers,clear:resetGuidePeers,
    accept:peers=>setGuidePeers(GuideSkills.merge(...peers.map(p=>p.guide)),peers.flatMap(p=>p.done||[]))
  }
});
