const CLIPS = {
  mental: {
    name: "Khan Academy · Two-digit addition",
    url: "https://www.khanacademy.org/v/adding-two-digit-numbers-without-regrouping",
    before: "Predict 24 + 35. Which parts would you add first?",
    after:
      "Can you draw two tens and four ones, then add three tens and five ones?",
    offline:
      "Draw 24 and 35 as sticks and dots. Slide the sticks together to make five tens, then count nine dots. What stayed the same when you moved them?",
  },
  evidence: {
    name: "Arizona PBS · Miss K and the word infer",
    url: "https://www.pbs.org/video/eight-previews-miss-k-and-word-infer/",
    before:
      "If a friend runs inside carrying a dripping umbrella, what might have happened?",
    after: "Tell someone one thing you saw and one idea you inferred from it.",
    offline:
      "Act it out. Pretend to shake water from an umbrella. Ask someone to guess the weather and name the movement that helped them decide. Switch roles with a new clue.",
  },
  science: {
    name: "NASA eClips · What causes seasons?",
    url: "https://science.nasa.gov/eclips/videos/what-causes-seasons/",
    before:
      "When it is summer where you live, could someone far away be having winter?",
    after:
      "How does the explanation with sunlight differ from the explanation in the Greek myth?",
    offline:
      "Stand a pencil upright on paper as a pretend tree. Aim a flashlight straight at the paper and then at a slant from the same distance. Which patch spreads out? Earth's tilt changes how directly sunlight hits each half of the planet and how long its days are.",
  },
};
const QUICK = [
  {
    key: "trade",
    prompt: "Which pair would you add first in 28 + 14 + 12?",
    choices: ["28 and 14", "28 and 12", "14 and 12"],
    correct: 1,
    why: "28 and 12 make 40. The zero makes adding 14 easier.",
  },
  {
    key: "evidence",
    prompt:
      "Jo tied down the tent as the branches bent. What clue tells you it was windy?",
    choices: ["The branches bent.", "Jo was outside.", "There was a tent."],
    correct: 0,
    why: "Bending branches show the air pushing on them. Being outdoors alone gives less information.",
  },
];
const pickChips = (opts, chosen, act) =>
  '<div class="chips">' +
  opts
    .map(([k, label]) =>
      button(
        label,
        act,
        k,
        k === chosen ? "on" : "",
        'aria-pressed="' + (k === chosen) + '"',
      ),
    )
    .join("") +
  "</div>";
function trailShelf() {
  return (
    '<div class="trailShelf">' +
    PATH_ORDER.map((k, i) => {
      const p = PATHS[k],
        count = trailCount(k, "independent");
      return (
        '<button class="trailTile color' +
        (i % 4) +
        '" data-act="path" data-val="' +
        k +
        '"><span class="trailIcon" aria-hidden="true">' +
        SUBJECT_ICONS[i] +
        "</span><span><strong>" +
        esc(p.title) +
        "</strong><small>" +
        esc(p.teaser) +
        "</small>" +
        (count
          ? '<small class="inkFlag">' + count + " solved on my own</small>"
          : "") +
        "</span></button>"
      );
    }).join("") +
    "</div>"
  );
}
function interestPicker() {
  return (
    "<h3>What sounds fun today?</h3>" +
    pickChips(
      Object.entries(TRAIL_INTERESTS).map(([k, v]) => [k, v.title]),
      state.trail.interest,
      "interestPick",
    ) +
    '<p class="inset" aria-live="polite">' +
    esc(TRAIL_INTERESTS[state.trail.interest].sample) +
    "</p>"
  );
}
function nextProjectStep() {
  const gap = nextPaper(),
    legacy = STEPS.findIndex((_, i) => !state.finished.includes(i));
  if (gap === 0 && !state.trail.paper[0] && legacy >= 0 && legacy < 3)
    return legacy === 0 && familyPack ? 1 : legacy;
  return gap >= 0 ? PAPER_STEPS[gap] : 5;
}
function sessionPlan() {
  const t = state.trail,
    p = nextPaper(),
    skill = studyPick(),
    book = p !== -1 && !afterProject();
  const math = ["trade", "mental", "stories"],
    english = ["evidence", "writing", "words"];
  const pick = (group) =>
    group.includes(skill)
      ? skill
      : group.reduce((a, b) =>
          trailCount(a, "independent") <= trailCount(b, "independent") ? a : b,
        );
  const mathPath = pick(math),
    englishPath = pick(english);
  const mathBlock = ["Math · " + PATHS[mathPath].title, mathPath],
    englishBlock = ["English · " + PATHS[englishPath].title, englishPath];
  const learning = english.includes(skill)
    ? [englishBlock, mathBlock]
    : [mathBlock, englishBlock];
  const pieces = book
    ? [
        [
          nextProjectStep() < 3 ? STEPS[nextProjectStep()] : PAPER_NEXT[p],
          "desk",
        ],
        ...learning,
      ]
    : [...learning, ["Mixed test practice", "check"]];
  const times =
    t.minutes === 10 ? [10] : t.minutes === 20 ? [12, 8] : [20, 10, 10];
  return (
    '<section class="panel session"><div class="sectionHead"><h2>My time today</h2>' +
    pickChips(
      [10, 20, 40].map((n) => [n, n + " min"]),
      t.minutes,
      "minutes",
    ) +
    '</div><ol class="sessionList">' +
    times
      .map(
        (n, i) =>
          "<li><b>" +
          n +
          " min</b>" +
          button(pieces[i][0], "sessionGo", pieces[i][1]) +
          "</li>",
      )
      .join("") +
    "</ol></section>"
  );
}
function homeProgress() {
  const marks = Object.values(state.trail.marks),
    paper = Object.values(state.trail.paper).filter((p) => p.done).length;
  const earlier =
    Object.keys(state.attempts).length + Object.keys(state.spellTries).length;
  if (
    !marks.length &&
    !Object.keys(state.trail.paper).length &&
    !earlier &&
    !state.finished.length
  )
    return "";
  const independent = marks.filter((v) => v === "independent").length,
    helped = marks.filter((v) => v === "helped").length;
  return (
    '<section class="panel"><h2>My progress</h2><p>' +
    independent +
    " solved on my own · " +
    helped +
    " solved with help · " +
    paper +
    " of 4 project jobs checked at home.</p>" +
    (earlier || state.finished.length
      ? "<p>Your earlier work is here too. " +
        earlier +
        " practice items tried and " +
        state.finished.length +
        " studio steps checked.</p>"
      : "") +
    goButton("See my review basket", "basket") +
    "</section>"
  );
}
function richHome() {
  const t = state.trail,
    p = nextPaper(),
    holiday = localDay() === "2026-11-26",
    book = p !== -1 && !afterProject(),
    active = t.started;
  const next = studyPick(),
    projectTitle =
      nextProjectStep() < 3 ? STEPS[nextProjectStep()] : PAPER_NEXT[p];
  const name = familyPack
    ? esc(familyPack.firstName) + "’s fieldbook"
    : "My meadow fieldbook";
  const lead = holiday
    ? "Today is free. Enjoy Thanksgiving together. Your fieldbook will be here tomorrow."
    : book
      ? "Up next for December 1 · " + projectTitle + "."
      : "Up next · " + PATHS[next].title + ". " + PATHS[next].teaser;
  return (
    '<section class="hero richHero"><div class="heroText"><p class="eyebrow">' +
    (holiday
      ? "Thanksgiving Day"
      : book
        ? "Demeter and Persephone · Due Dec 1"
        : "Learning trails") +
    "</p><h1>" +
    name +
    "</h1><p>" +
    esc(lead) +
    "</p>" +
    (holiday ? "" : button("Continue", "continueTrail", "", "primary")) +
    '</div><img src="' +
    ART[0] +
    '" alt="Persephone gathering flowers in the meadow"></section>' +
    (holiday
      ? ""
      : '<div class="trailDoors">' +
        button("Show me how", "homeModel", book ? "project" : next) +
        button("Challenge me", "homeStretch", book ? "project" : next) +
        (active
          ? button("Resume " + PATHS[t.skill].title, "resumeTrail")
          : "") +
        "</div>") +
    (t.checkin === "new"
      ? '<section class="checkInvite"><div><h2>Where should I start?</h2><p>Tell your fieldbook what you already did on paper. Try two quick questions if you like.</p></div><div class="btnrow">' +
        goButton("My quick check-in", "checkin", true) +
        button("Maybe later", "skipCheck") +
        "</div></section>"
      : "") +
    (holiday ? "" : sessionPlan()) +
    homeProgress() +
    '<div class="sectionHead"><h2>Pick a learning trail</h2></div>' +
    trailShelf() +
    '<section class="panel">' +
    interestPicker() +
    '</section><div class="grid">' +
    tile(
      "Test practice",
      "Try six untimed math and English questions.",
      "✦",
      "checks",
      "lilac",
    ) +
    tile(
      "My check-in",
      "Update what I finished and what to practice.",
      "✓",
      "checkin",
    ) +
    tile(
      "My review basket",
      "Revisit a skill that needs another turn.",
      "↻",
      "basket",
      "warm",
    ) +
    "</div>" +
    meadow() +
    '<details class="panel"><summary>My Thanksgiving calendar</summary>' +
    dayPanel() +
    "</details>"
  );
}
function checkinRoom() {
  const t = state.trail;
  return (
    head(
      "My starting point",
      "What have I done?",
      "Look at your project or ask someone who saw it. You can update these boxes any time.",
    ) +
    '<section class="panel"><h2>At my table</h2>' +
    PAPER.map(
      (label, i) =>
        '<label class="check"><input type="checkbox" data-paper="' +
        i +
        '" ' +
        (t.paper[i]?.done ? "checked" : "") +
        "><span>" +
        label +
        "</span></label>",
    ).join("") +
    '</section><section class="panel"><h2>Two quick tries</h2><p>Try either one. Your answer helps choose your next trail.</p>' +
    QUICK.map(
      (q, i) =>
        '<fieldset class="quick"><legend>' +
        esc(q.prompt) +
        "</legend>" +
        pickChips(
          q.choices.map((s, n) => [i + "." + n, s]),
          i + "." + t.probes[i],
          "probe",
        ) +
        (t.probes[i] === undefined
          ? ""
          : feed(q.why, t.probes[i] === q.correct)) +
        "</fieldset>",
    ).join("") +
    '</section><section class="panel"><h2>Choose something to work on</h2>' +
    pickChips(
      [["", "Pick for me"], ...PATH_ORDER.map((k) => [k, PATHS[k].title])],
      t.focus,
      "focusPick",
    ) +
    '</section><div class="btnrow">' +
    button("Save my check-in", "finishCheck", "", "primary") +
    button("Skip for now", "skipCheck") +
    "</div>"
  );
}
function reviewBasket() {
  const keys = PATH_ORDER.filter((k) => state.trail.due[k]);
  return (
    head(
      "Memory practice",
      "My review basket",
      "Try a different question tomorrow. See what you remember before opening a hint.",
    ) +
    '<section class="panel"><h2>Learning trails</h2>' +
    (keys.length
      ? keys
          .map(
            (k) =>
              '<div class="reviewLine"><span>' +
              esc(PATHS[k].title) +
              " · " +
              (state.trail.due[k] <= localDay()
                ? "Ready today"
                : "Come back " + esc(state.trail.due[k])) +
              "</span>" +
              button("Try a question", "reviewTrail", k) +
              "</div>",
          )
          .join("")
      : "<p>Your first practice turn will put a trail here.</p>") +
    '</section><section class="panel"><h2>From earlier practice</h2><p>Your earlier practice and readiness rounds have their own review questions.</p>' +
    goButton("Open earlier reviews", "review") +
    "</section>"
  );
}
function clipCard(skill) {
  const v = CLIPS[skill];
  if (!v) return "";
  return (
    '<details class="panel"><summary>Watch or try it here</summary><h3>Before you watch</h3><p>' +
    esc(v.before) +
    '</p><a class="download" target="_blank" rel="noopener noreferrer" href="' +
    v.url +
    '">' +
    esc(v.name) +
    " (opens a new tab)</a><h3>Afterward</h3><p>" +
    esc(v.after) +
    "</p><h3>Try it offline</h3><p>" +
    esc(v.offline) +
    "</p></details>"
  );
}
function modelPicture(t) {
  if (t.skill === "writing")
    return '<div class="compare"><div><b>Original sentence</b>The bird went to the tree.</div><div><b>My revision</b>The sparrow darted into the oak with a blue thread in its beak.</div></div>';
  if (t.skill === "mental") {
    const groups = t.step < 2 ? [8, 7] : [10, 5];
    return (
      '<div class="frames">' +
      groups
        .map(
          (n) =>
            "<figure><figcaption>" +
            n +
            ' fireflies</figcaption><div class="tenFrame" aria-hidden="true">' +
            Array.from(
              { length: 10 },
              (_, i) => '<i class="' + (i < n ? "lit" : "") + '"></i>',
            ).join("") +
            "</div></figure>",
        )
        .join("") +
      "</div>"
    );
  }
  if (t.skill === "trade") {
    const values = [
      ["68 sticks", "57 sticks"],
      ["6 tens + 8 ones", "5 tens + 7 ones"],
      ["11 tens", "15 ones = 1 ten + 5 ones"],
      ["12 tens", "5 ones", "125 sticks"],
      ["70 + 55", "125 sticks"],
    ];
    return (
      '<div class="mathSteps">' +
      values[t.step].map((v) => "<span>" + v + "</span>").join("") +
      "</div>"
    );
  }
  return "";
}
function modelView(p, t) {
  const m = p.example;
  return (
    '<p class="eyebrow">Worked example</p><h2>' +
    esc(
      t.skill === "writing" ? "Which details change your picture?" : m.prompt,
    ) +
    "</h2>" +
    modelPicture(t) +
    '<ol class="walk">' +
    m.steps
      .slice(0, t.step)
      .map((s) => "<li>" + esc(s) + "</li>")
      .join("") +
    "</ol>" +
    (t.step < m.steps.length
      ? button(
          t.step ? "Show the next step" : "Show the first step",
          "modelStep",
          "",
          "primary",
        )
      : '<p class="inset">' +
        esc(m.takeaway) +
        "</p>" +
        button("Try it together", "stage", "guide", "primary")) +
    (t.step ? button("Replay example", "replay") : "")
  );
}
function questionView(p, t) {
  const solo = t.stage === "solo",
    q = p[t.stage][solo ? t.solo : t.guide],
    answered = t.choice >= 0,
    correct = t.choice === q.correct;
  return (
    '<p class="eyebrow">' +
    (solo ? "On my own" : "Try it together") +
    "</p><h2>" +
    esc(q.prompt) +
    '</h2><div class="trailChoices">' +
    q.choices
      .map((s, i) =>
        button(
          s,
          "trailAnswer",
          i,
          "choice" + (t.choice === i ? " on" : ""),
          correct ? "disabled" : 'aria-pressed="' + (t.choice === i) + '"',
        ),
      )
      .join("") +
    "</div>" +
    (t.hint
      ? '<p class="inset">' + esc(q.hint) + "</p>"
      : !correct
        ? button("Give me a hint", "trailHint")
        : "") +
    (answered
      ? feed(correct ? q.explain : q.miss[t.choice] || q.hint, correct)
      : "") +
    (answered
      ? '<div class="btnrow">' +
        (correct
          ? button(
              solo
                ? "Try another question"
                : t.savedTurn
                  ? "Back to my question"
                  : "Try one on my own",
              solo ? "anotherSolo" : "guidedNext",
              "",
              "primary",
            ) +
            (solo && trailCount(t.skill, "independent") >= 2
              ? button("Ready for a stretch", "stage", "stretch")
              : "")
          : button(
              "Walk through a different example",
              "alternateGuide",
              "",
              "primary",
            )) +
        "</div>"
      : "")
  );
}
function challengeView(p, t) {
  const themed = t.stage === "interest",
    a = themed ? TRAIL_INTERESTS[t.interest][t.skill] : p[t.stage],
    hints = themed ? [a.nudge] : a.hints;
  return (
    '<p class="eyebrow">' +
    esc(
      themed
        ? TRAIL_INTERESTS[t.interest].title
        : t.stage === "stretch"
          ? "Stretch puzzle"
          : "Grade 3 preview",
    ) +
    "</p><h2>" +
    esc(a.prompt) +
    "</h2><p>Try it aloud, draw it, or use objects. Show someone how you know.</p>" +
    hints
      .map(
        (s, i) =>
          "<details><summary>Clue " +
          (i + 1) +
          "</summary><p>" +
          esc(s) +
          "</p></details>",
      )
      .join("") +
    "<details><summary>Compare ideas with a grown-up</summary><p>" +
    esc(a.discuss) +
    "</p></details>" +
    button("Try one on my own", "stage", "solo")
  );
}
function lessonRoom() {
  const t = state.trail,
    p = PATHS[t.skill],
    labels = [
      "Show me how",
      "Together",
      "On my own",
      "Stretch",
      "Grade 3 preview",
      TRAIL_INTERESTS[t.interest].title,
    ];
  const main =
    t.stage === "model"
      ? modelView(p, t)
      : ["guide", "solo"].includes(t.stage)
        ? questionView(p, t)
        : challengeView(p, t);
  const action = {
    project: ["Take this to my project", "studio"],
    mental: ["Play number games", "facts"],
    trade: ["Move base-ten blocks", "trade"],
    stories: ["Solve a story on paper", "stories"],
    evidence: ["Read another passage", "clue"],
    words: ["Spell the ten class words", "words"],
    writing: ["Revise my own sentence", "memory"],
    science: ["Try a material test", "matter"],
  }[t.skill];
  return (
    head("Learning trail", p.title, p.why) +
    pickChips(
      STAGES.map((k, i) => [k, labels[i]]),
      t.stage,
      "stage",
    ) +
    '<section class="panel learningCard" aria-live="polite">' +
    main +
    "</section>" +
    clipCard(t.skill) +
    '<section class="panel trailExit"><div><h3>Use what you learned</h3><p>' +
    esc(p.teaser) +
    "</p></div>" +
    goButton(action[0], action[1], true) +
    '</section><details class="panel"><summary>Change my interest</summary>' +
    interestPicker() +
    "</details>" +
    goButton("Choose another trail", "home")
  );
}
