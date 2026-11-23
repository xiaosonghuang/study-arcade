(function () {
  'use strict';
  function startCS() {
    const byId = id => document.getElementById(id);
    if (!byId('cs-client')) return;
    const style = document.createElement('style');
    style.textContent = [
      '.cs-worked{display:flex;justify-content:space-between;gap:.5rem;padding:.8rem;background:#122f33;border-bottom:.4rem solid #9d794f;border-radius:.65rem .65rem .25rem .25rem;color:#fcf6df}',
      '.cs-worked span{display:grid;place-items:center;min-height:2.2rem;padding:.2rem .8rem;background:#fed288;border:1px solid #734e32;border-radius:.2rem;color:#372613;font-weight:700}',
      '.cs-brief-feedback{font-weight:600;min-height:1.4em}.cs-explain summary{cursor:pointer}.cs-flex-line:focus-visible{outline:2px solid #397ce2;outline-offset:2px}',
      '.cs-controls{display:flex;align-items:end;gap:.65rem .85rem;flex-wrap:wrap;margin:1rem 0}',
      '.cs-controls label,.cs-plan-rows label{display:grid;gap:.25rem}',
      '.cs-controls select,#cs-client{width:auto;max-width:100%;min-height:44px}',
      '.cs-code{overflow-x:auto;white-space:pre-wrap;overflow-wrap:anywhere;background:#f2f5f3;color:#17352f;padding:.85rem 1rem;border-radius:.55rem;line-height:1.5;font-size:.93rem}',
      '.cs-lab-preview{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:.8rem}',
      '.cs-runway{min-width:0;background:#f6f7f3;border:1px solid #c8d6cc;border-radius:.6rem;padding:.65rem;color:#17352f}',
      '.cs-runway>b{display:block;font-size:.88rem;margin-bottom:.35rem}',
      '.cs-flex-line{box-sizing:border-box;max-width:100%;display:flex;min-height:7.5rem;padding:.5rem;gap:.32rem;overflow:auto;border:1px dashed #5a796f;border-radius:.3rem;background:white}',
      '.cs-flex-line>span{box-sizing:border-box;flex:none;display:grid;place-items:center;width:3.6rem;height:2.25rem;background:#d4e7de;color:#153e34;border:1px solid #709788;border-radius:.3rem;font-size:.84rem}',
      '#cs-flex-gallery>span{background:#dae5f2;color:#26394f;border-color:#8ba3bd}',
      '.cs-plan-rows{display:grid;gap:.8rem}.cs-plan-rows>div{display:grid;grid-template-columns:4rem 1fr 1fr 1.6fr;align-items:end;gap:.6rem;border-bottom:1px solid #ced8d2;padding-bottom:.75rem}',
      '.cs-plan-rows input{width:100%;box-sizing:border-box}.cs-checks{display:grid;gap:.6rem}.cs-checks label{display:block}',
      '.cs-checks input[type=checkbox]{width:1.15rem;height:1.15rem;vertical-align:middle;margin-right:.45rem}',
      '.cs-style-sample{padding:.5rem .75rem;border:1px solid #a6b8af;border-radius:.5rem}.cs-style-sample p{padding:.28rem .55rem;margin:.28rem 0;font-size:1rem}',
      '.cs-game-board{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));width:min(100%,22rem);box-sizing:border-box;border:1px solid #829d90;border-radius:.55rem;overflow:hidden;background:#e1ebe4}',
      '.cs-game-board:focus-visible{outline:3px solid #3b71a4;outline-offset:3px}',
      '.cs-game-board>span{min-height:2.55rem;display:grid;place-items:center;border:.5px solid #b7cabd;color:#324638;font:600 1.05rem/1 system-ui}',
      '.cs-game-board>span.cs-g-flag{background:#fff0c9;color:#624400}.cs-game-board>span.cs-g-player{background:#205744;color:white}',
      '.cs-game-pad{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.7rem}.cs-game-pad button,.cs-controls button{min-height:44px}',
      '@media(max-width:760px){.cs-plan-rows>div{grid-template-columns:1fr 1fr}.cs-plan-rows>div>strong,.cs-plan-rows>div>label:last-child{grid-column:1/-1}}',
      '@media(max-width:480px){.cs-controls label{flex:1 1 45%}.cs-game-pad button{flex:1 1 27%}}'
    ].join('\n');
    document.head.appendChild(style);

    function read(key) {
      return typeof window.getLab === 'function' ? window.getLab(key) : undefined;
    }
    function write(key, value) {
      if (typeof window.saveLab === 'function') window.saveLab(key, value);
    }
    function choose(candidate, allowed, fallback) {
      return allowed.includes(candidate) ? candidate : fallback;
    }

    const client = byId('cs-client');
    const briefs = {
      '': {
        request: 'Pick a client to see the layout request.',
        banner: ['Logo', 'Title', 'Menu', 'News'],
        gallery: ['One', 'Two', 'Three', 'Four']
      },
      comic: {
        request: 'The comic shop needs a wide banner with four links in a row, spaced from edge to edge. Its narrow gallery should show four covers in reading order, wrapping onto another row whenever they run out of space.',
        banner: ['Shop', 'New', 'Series', 'Events'],
        gallery: ['Vol. 1', 'Vol. 2', 'Vol. 3', 'Vol. 4']
      },
      soccer: {
        request: 'The soccer club wants four links stacked in one vertical column, centered horizontally. The gallery stores the weeks oldest first. Give it the wide setting and display one row with the newest week on the left of the four.',
        banner: ['Club', 'Team', 'Games', 'News'],
        gallery: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
      }
    };
    function renderClient() {
      const brief = briefs[client.value];
      byId('cs-client-tip').textContent = brief.request;
      for (const group of ['banner', 'gallery']) {
        const items = byId('cs-flex-' + group).children;
        brief[group].forEach((text, index) => { items[index].textContent = text; });
      }
      byId('cs-brief-feedback').textContent = '';
    }
    client.addEventListener('change', () => {
      renderClient();
      write('cs-client', client.value);
    });

    const flexOptions = {
      direction: ['row', 'column', 'row-reverse'], wrap: ['nowrap', 'wrap'],
      justify: ['flex-start', 'center', 'space-between'], align: ['flex-start', 'center', 'flex-end'],
      size: ['wide', 'narrow']
    };
    const flexDefaults = {direction:'row', wrap:'nowrap', justify:'flex-start', align:'flex-start', size:'wide'};
    const flexGroups = ['banner','gallery'];
    const chosenGroup = byId('cs-flex-target');
    let flex;
    function cleanFlex(raw) {
      const result={target:choose(raw?.target, flexGroups, 'banner')};
      for (const id of flexGroups) {
        result[id]={};
        for (const [key, options] of Object.entries(flexOptions)) {
          result[id][key]=choose(raw?.[id]?.[key], options, flexDefaults[key]);
        }
      }
      return result;
    }
    function renderFlex() {
      byId('cs-brief-feedback').textContent = '';
      chosenGroup.value=flex.target;
      const current=flex[flex.target];
      for (const key of Object.keys(flexOptions)) byId('cs-flex-'+key).value=current[key];
      for (const group of flexGroups) {
        const data=flex[group];
        const box=byId('cs-flex-'+group);
        box.style.flexDirection=data.direction;
        box.style.flexWrap=data.wrap;
        box.style.justifyContent=data.justify;
        box.style.alignItems=data.align;
        box.style.width=data.size==='wide'?'100%':'11.5rem';
        box.style.height=data.direction==='column'?(data.wrap==='wrap'?'8.2rem':'12rem'):'';
      }
      byId('cs-flex-code').textContent='.'+flex.target+' {\n  display: flex;\n  flex-direction: '+current.direction+';\n  flex-wrap: '+current.wrap+';\n  justify-content: '+current.justify+';\n  align-items: '+current.align+';\n}';
      const axis=current.direction==='column'?'top to bottom':current.direction==='row-reverse'?'right to left':'left to right';
      const wrap=current.wrap==='nowrap'?'One line stays together. Scroll inside the sample if it overflows.':'The children may start a new line when space runs out.';
      byId('cs-flex-meaning').textContent='The '+flex.target+' arranges its children '+axis+'. '+wrap;
    }
    chosenGroup.addEventListener('change', () => {
      flex.target=chosenGroup.value;renderFlex();write('cs-flex',flex);
    });
    for (const key of Object.keys(flexOptions)) {
      byId('cs-flex-'+key).addEventListener('change',event=>{
        flex[flex.target][key]=event.target.value;renderFlex();write('cs-flex',flex);
      });
    }

    byId('cs-check-brief').addEventListener('click', () => {
      const message = byId('cs-brief-feedback');
      const {banner, gallery} = flex;
      if (!client.value) {
        message.textContent = 'Choose the comic shop or soccer club first so you have a design to test.';
        return;
      }
      const hints = [];
      if (client.value === 'comic') {
        if (banner.direction !== 'row' || banner.justify !== 'space-between' || banner.size !== 'wide') {
          hints.push('Banner: use a wide row and spread links from edge to edge along its main axis.');
        }
        if (gallery.direction !== 'row' || gallery.wrap !== 'wrap' || gallery.size !== 'narrow') {
          hints.push('Gallery: try a narrow row and let the covers wrap in reading order.');
        }
      } else {
        if (banner.direction !== 'column' || banner.wrap !== 'nowrap' || banner.align !== 'center') {
          hints.push('Banner: keep links in one column; the cross axis runs horizontally, so center the children there.');
        }
        if (gallery.direction !== 'row-reverse' || gallery.wrap !== 'nowrap' || gallery.size !== 'wide') {
          hints.push('Gallery: choose a wide, single row, then reverse its direction to move Week 4 to the left.');
        }
      }
      message.textContent = hints.length ? hints.join(' ') : 'Both containers match the brief. Which property would you keep if the page became narrower?';
    });

    const selectors = ['.caption','.credit','p'];
    const answers = {'.caption':'2','.credit':'3',p:'4'};
    const desc = {'.caption':'Only the two paragraphs with class="caption" match.', '.credit':'Only the credits paragraph has class="credit".',p:'All three lines are p elements.'};
    let selectorState;
    function renderSelector() {
      byId('cs-selector').value=selectorState.selector;
      byId('cs-guess').value=selectorState.guess;
      byId('cs-selector-code').textContent=selectorState.selector+' {\n  background-color: #fff0bf;\n  font-weight: bold;\n}';
      for (const p of byId('cs-style-result').querySelectorAll('p')) {
        const active=selectorState.ran && p.matches(selectorState.selector);
        p.style.backgroundColor=active?'#fff0bf':'';
        p.style.fontWeight=active?'bold':'';
        p.style.color=active?'#433917':'';
      }
      const correct=selectorState.guess===answers[selectorState.selector];
      const prefix=correct?'Your prediction matches the browser. ':'Compare your prediction with the highlighted lines. ';
      byId('cs-style-feedback').textContent=selectorState.ran ? prefix+desc[selectorState.selector] : 'Choose a selector and a prediction, then run the rule.';
    }
    byId('cs-selector').addEventListener('change',event=>{
      selectorState={selector:event.target.value,guess:'',ran:false};renderSelector();write('cs-selector',selectorState);
    });
    byId('cs-guess').addEventListener('change',event=>{
      selectorState.guess=event.target.value;selectorState.ran=false;renderSelector();write('cs-selector',selectorState);
    });
    byId('cs-run-style').addEventListener('click',()=>{
      if (!selectorState.guess) {
        byId('cs-style-feedback').textContent='Choose the lines you expect the selector to match first.';
        byId('cs-guess').focus();return;
      }
      selectorState.ran=true;renderSelector();write('cs-selector',selectorState);
    });

    const board=byId('cs-board');
    const moves={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
    const arrows={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};
    let runner;
    for(let index=0;index<20;index++) {
      const cell=document.createElement('span');
      cell.setAttribute('aria-hidden','true');
      board.appendChild(cell);
    }
    function renderRunner(message) {
      for (let index=0;index<20;index++) {
        const isPlayer=index===runner.y*5+runner.x;
        const isFlag=index===9;
        const cell=board.children[index];
        cell.className=isPlayer?'cs-g-player':isFlag?'cs-g-flag':'';
        cell.textContent=isPlayer?(isFlag?'★':'●'):isFlag?'⚑':'';
      }
      byId('cs-game-feedback').textContent=(message?message+' ':'')+'Runner at ('+runner.x+', '+runner.y+'). Flag at (4, 1). Steps taken: '+runner.steps+'.';
    }
    function move(direction) {
      const [dx,dy]=moves[direction];
      const nextX=runner.x+dx, nextY=runner.y+dy;
      if (nextX<0 || nextX>4 || nextY<0 || nextY>3) {
        renderRunner('Edge reached. The boundary condition blocked that step.');return;
      }
      runner={x:nextX,y:nextY,steps:Math.min(99999,runner.steps+1)};
      const message=nextX===4 && nextY===1 ? 'You reached the flag! Try moving right here.' : '';
      renderRunner(message);write('cs-runner',runner);
    }
    board.addEventListener('keydown',event=>{
      const direction=arrows[event.key];
      if (direction) {event.preventDefault();move(direction);}
    });
    for (const button of byId('cs-pad').querySelectorAll('[data-cs-move]')) {
      button.addEventListener('click',()=>move(button.dataset.csMove));
    }
    byId('cs-game-reset').addEventListener('click',()=>{
      runner={x:0,y:0,steps:0};renderRunner('Back at the starting corner.');write('cs-runner',runner);
    });
    function restore() {
      client.value=choose(read('cs-client'),Object.keys(briefs),'');renderClient();
      flex=cleanFlex(read('cs-flex'));renderFlex();
      const saved=read('cs-selector');
      selectorState={selector:choose(saved?.selector,selectors,'.caption'),guess:choose(saved?.guess,['1','2','3','4'],''),ran:saved?.ran===true && ['1','2','3','4'].includes(saved?.guess)};
      renderSelector();
      const savedRunner=read('cs-runner');
      const bounded=(value,max)=>Number.isInteger(value)&&value>=0&&value<=max?value:0;
      runner={x:bounded(savedRunner?.x,4),y:bounded(savedRunner?.y,3),steps:bounded(savedRunner?.steps,99999)};
      renderRunner('');
    }
    window.addEventListener('restore-labs',restore);
    restore();
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',startCS,{once:true}); else startCS();
}());
