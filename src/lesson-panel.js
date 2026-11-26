function renderLesson(unit, view) {
  const index = Math.max(0, Math.min(unit.steps.length - 1, Math.trunc(view.step) || 0));
  const step = unit.steps[index];
  const guided = view.stage === 'guided';
  const recall = !guided && view.item === 3;
  const stretch = !guided && view.item === 2;
  const solved = ['aided', 'solo', 'guided'].includes(view.feedback);
  const projectKey = 'guide-project-' + unit.id;
  const themeNames = {game:'Game', sports:'Sports', story:'Story', mystery:'Mystery'};
  const theme = Object.hasOwn(themeNames, view.theme) ? view.theme : 'game';

  function action(act, text, options = {}) {
    const indexAttr = Number.isInteger(options.n) ? ' data-n="' + options.n + '"' : '';
    return '<button type="button" data-act="' + act + '"' + indexAttr +
      ' class="' + (options.primary ? 'primary' : 'secondary') + '">' + esc(text) + '</button>';
  }

  function example(part) {
    return '<pre class="lesson-visual" style="white-space:pre-wrap;overflow-wrap:anywhere" dir="auto">' +
      esc(part.visual) + '</pre><p>' + esc(part.why) + '</p>';
  }

  function labLink() {
    const destinations = {
      html:['selector','Test CSS selectors'], flex:['layout','Build the layout'], keys:['sprite','Move the sprite'],
      expand:['tiles','Build a rectangle'], factor:['tiles','Build a rectangle'], equiv:['diagnose','Test two expressions'],
      rhyme:['evidence','Hear a stanza'], image:['evidence','Explore a poem’s imagery'], claim:['writing','Write a reading'],
      particles:['particles','Rearrange the particles'], conserve:['atoms','Build the products'], model:['model','Explore the evidence']
    };
    const [topic, title] = destinations[unit.id] || ['', 'Open the lab'];
    return '<a href="#' + esc(unit.room) + '" data-topic="' + esc(topic) + '">' +
      esc(title + ' in ' + labels[unit.room]) + ' <span aria-hidden="true">→</span></a>';
  }

  function project() {
    return '<details class="card lesson-project"' + (view.mode === 'challenge' ? ' open' : '') +
      '><summary>Make it yours</summary><div class="grid2"><div><h3>' + esc(themeNames[theme]) +
      ' project idea</h3><p>' + esc(unit.themes[theme]) + '</p><p>' + esc(unit.project.task) +
      '</p><p>' + labLink() + '</p></div><div><h3>Check your work</h3><p>' + esc(unit.project.check) +
      '</p>' + note(projectKey, 'My evidence or next revision') +
      check(projectKey, 'I tried the project and checked my work.') + '</div></div></details>';
  }

  function media() {
    const source = unit.media;
    if (!source || !/^https:\/\//i.test(source.url)) return '';
    const textExample = unit.steps.map(part => '<li><strong>' + esc(part.title) +
      '</strong>' + example(part) + '</li>').join('');
    return '<details class="card lesson-media"><summary>Explore another explanation</summary><p><a href="' +
      esc(source.url) + '" target="_blank" rel="noopener noreferrer">' + esc(source.title) +
      '</a> <span class="small">(online, opens a new tab)</span></p><p>' + esc(source.prompt) +
      '</p><details><summary>Read an offline explanation</summary><p>' + esc(unit.explain) +
      '</p><ol>' + textExample + '</ol></details></details>';
  }

  function walk() {
    const first = index === 0;
    const last = index === unit.steps.length - 1;
    const buttons = [];
    if (!first) buttons.push(action('step', 'Previous step', {n:index - 1}));
    buttons.push(last ? action('guided', 'Try the guided question', {primary:true}) :
      action('step', 'Next step', {n:index + 1, primary:true}));
    if (last) buttons.push(action('try', 'Try it on my own'));
    if (last && view.status?.solo === 2 && !view.status.stretch) buttons.push(action('challenge', 'Take the stretch question'));
    const overview = first ? '<p class="lesson-intro">' + esc(unit.explain) + '</p>' : '';
    return '<article class="card lesson-card"><p class="eyebrow lesson-path">Worked example · Step ' +
      (index + 1) + ' of ' + unit.steps.length + '</p><h2 id="lessonFocus" tabindex="-1">' +
      esc(step.title) + '</h2>' + overview + example(step) +
      (first ? '<details class="lesson-coach"><summary>How to approach this</summary><p>' + esc(unit.skill) + '</p><p>' + esc(unit.coach) + '</p></details>' : '') +
      '<div class="actions lesson-actions">' + buttons.join('') + '</div></article>';
  }

  function questionCard() {
    const q = guided ? unit.guided : recall ? unit.recall : unit.items[view.item] || unit.items[0];
    const title = guided ? 'Try it with a guide' : recall ? 'Recall it from memory' :
      stretch ? 'Take the challenge' : 'Try it on your own';
    const options = q.options.map((text, i) => {
      const correct = solved && i === q.answer;
      return '<button type="button" data-act="answer" data-n="' + i + '"' +
        (correct ? ' class="correct"' : '') + (view.lock || solved ? ' disabled' : '') + '>' +
        (correct ? '<strong>Correct · </strong>' : '') + esc(text) + '</button>';
    }).join('');
    let response = '', buttons = [];
    if (solved) {
      const label = guided ? 'You followed the example.' : view.feedback === 'aided' ? 'You solved it with support.' :
        recall ? 'You remembered it.' : 'You solved it on your own.';
      response = '<div class="feedback good lesson-feedback" role="status"><strong>' + label +
        '</strong><p>' + esc(q.why) + '</p></div>';
      buttons.push(action('advance', 'Continue', {primary:true}));
    } else if (view.feedback === 'miss') {
      response = '<div class="feedback lesson-feedback" role="status"><strong>Take another look.</strong><p>' +
        esc(q.hint) + '</p></div><details class="lesson-scaffold"><summary>Revisit the worked example</summary><p>' +
        esc(unit.coach) + '</p>' + unit.steps.map(part => '<h3>' + esc(part.title) + '</h3>' + example(part)).join('') + '</details>';
      buttons.push(action('alternate', 'Try a different question', {primary:true}));
      buttons.push(action('teach', 'Walk through the lesson'));
    } else {
      if (guided) response = '<p class="tip lesson-coach">' + esc(unit.coach) + '</p>';
      if (view.hint) {
        response += '<p class="feedback lesson-feedback" role="status"><strong>Hint.</strong> ' + esc(q.hint) + '</p>';
      } else {
        buttons.push(action('hint', 'Show a hint'));
      }
    }
    return '<article class="card lesson-card"><p class="eyebrow lesson-path">' + esc(unit.title) +
      '</p><h2 id="lessonFocus" tabindex="-1">' + title + '</h2><p id="lessonQuestion" class="lesson-question"><strong>' +
      esc(q.q) + '</strong></p><div class="choices lesson-choices" role="group" aria-labelledby="lessonQuestion">' +
      options + '</div>' + response + (buttons.length ? '<div class="actions lesson-actions">' + buttons.join('') + '</div>' : '') +
      '</article>';
  }

  let further = '';
  if (view.status?.recallDue && !recall) {
    further = '<p class="lesson-recall">' + action('recall', 'Try the later-day recall') + '</p>';
  }
  return (view.stage === 'walk' ? walk() : questionCard()) + further + project() + media();
}
