// Only skill and task identifiers leave the learner's device, inside an encrypted snapshot.
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
    notes:Object.values(state.notes).filter(v=>v.trim()).length,
    labs:permittedLabs.filter(k=>Object.hasOwn(state.labs,k)),exam};
}
const parentSync=(()=>{
  const lib=window.ArcadeLive, prefix='study-arcade.live.';
  let pair=null, pending=null, device=null, stamp=0, receipt=0, delivered='', running=false,timer=null,retry=2500;
  let feedback='Automatic family updates are off on this browser.';
  function ui(text) {
    feedback=text;const e=id('familyStatus');if(e)e.textContent=text;
    const off=id('disconnectFamily');if(off)off.hidden=!pair;
  }
  function stored(k){try{return localStorage.getItem(prefix+k)||'';}catch{return '';}}
  function persist(k,v){try{localStorage.setItem(prefix+k,v);return true;}catch{return false;}}
  function identity(){
    if(device)return;
    device=stored('device');if(!/^[a-f0-9]{32}$/.test(device)){
      device=Array.from(crypto.getRandomValues(new Uint8Array(16)),n=>n.toString(16).padStart(2,'0')).join('');
      persist('device',device);
    }
    stamp=Number(stored('stamp'))||0;
  }
  function queue(delay=1200) {
    if(!pair||otherTab)return;clearTimeout(timer);timer=setTimeout(send,delay);
  }
  function makePayload(){
    const snapshot=familySnapshot();
    // Changes such as visiting a room do not count as new work on the dashboard.
    const signature=JSON.stringify(snapshot);
    return {snapshot,signature};
  }
  async function send(){
    if(!pair||running||otherTab)return;
    if(!navigator.onLine){ui('Offline. Your family update will retry when this workbook is open online.');return;}
    const {snapshot,signature}=makePayload();
    if(signature===delivered){ui(receipt?'Last confirmed family update: '+new Date(receipt).toLocaleString()+' · Device '+(device||stored('device')).slice(-6).toUpperCase()+'.':'Family dashboard connected.');return;}
    running=true;const c=pair;
    try{
      identity();
      if(!pending||pending.signature!==signature){
        const rev=Math.max(Date.now(),stamp+1,Number(stored('stamp'))+1);stamp=rev;persist('stamp',String(rev));
        const blob=await lib.seal(c,device,rev,snapshot);pending={signature,rev,blob};
      }
      if(pair!==c)return;
      const batch=pending;
      const ack=await lib.request({op:'write',key:c.token,id:device,rev:batch.rev,blob:batch.blob});
      if(pair!==c)return;
      if(ack.rev!==batch.rev){stamp=Math.max(stamp,ack.rev||0);persist('stamp',String(stamp));pending=null;throw Error('A newer update was received. Retrying.');}
      delivered=signature;receipt=Date.now();persist('receipt',String(receipt));persist('delivered',signature);pending=null;retry=2500;
      ui('Last confirmed family update: '+new Date(receipt).toLocaleString()+' · Device '+device.slice(-6).toUpperCase()+'.');
    }catch{
      if(pair===c){ui('Waiting to sync. The workbook will retry automatically while open.');queue(retry);retry=Math.min(retry*2,60000);}
      return;
    }finally{running=false;}
    if(pair&&makePayload().signature!==delivered)queue(200);
  }
  function install(input){
    try{
      const c=lib.config('writer',input);
      if(!crypto.subtle)throw Error('Open the HTTPS workshop in a browser that supports encrypted connections.');
      if(pair&&c.token===pair.token&&c.cipher===pair.cipher){queue(0);return;}
      const saved=persist('writer.v1',JSON.stringify(c));
      pair=c;pending=null;delivered='';receipt=0;persist('delivered','');persist('receipt','0');
      ui(saved?'Connecting this browser to the family dashboard…':'Connecting for this session. This browser blocks saved settings.');queue(0);
    }catch(e){ui(e.message);}
  }
  function boot(){
    try{pair=lib.readConfig('writer');}catch{}
    if(pair){delivered=stored('delivered');receipt=Number(stored('receipt'))||0;ui('Family dashboard connected.');queue(100);}
    else if(family?.dashboardPairing&&!stored('paused'))install(family.dashboardPairing);
    function pairFromLink(){
      const params=location.hash.match(/^#connect=([\w-]{43})\.([\w-]{43})$/);
      if(!params)return;
      history.replaceState(null,'','#progress');install({role:'writer',token:params[1],cipher:params[2]});persist('paused','');route(false);
    }
    pairFromLink();window.addEventListener('hashchange',pairFromLink);
    id('disconnectFamily').onclick=()=>{
      clearTimeout(timer);pair=null;pending=null;delivered='';try{localStorage.removeItem(lib.storageKey('writer'));}catch{}
      persist('paused','1');ui('Automatic updates paused on this browser. Reopen the private device link or reimport the paired family plan to reconnect.');
    };
    window.addEventListener('online',()=>queue(0));window.addEventListener('focus',()=>queue(450));
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')queue(200);else if(pair)send();});
    setInterval(()=>{if(document.visibilityState==='visible')queue(50);},45000);
    ui(feedback);
  }
  return {boot,queue,importPlan(plan){if(plan?.dashboardPairing){persist('paused','');install(plan.dashboardPairing);}}};
})();
