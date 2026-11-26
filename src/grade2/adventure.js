const FAMILY_KEY = "study-arcade.grade2.family.v1";
let familyPack = null,
  familyMessage = "";
try {
  const saved = localStorage.getItem(FAMILY_KEY);
  if (saved) familyPack = parseFamily(JSON.parse(saved));
} catch {}
function isFamilyPhoto(value) {
  return (
    typeof value === "string" &&
    value.length <= 1600000 &&
    /^data:image\/jpeg;base64,\/9j\/[A-Za-z0-9+/=\r\n]+$/.test(value)
  );
}
function applyFamilyFormat() {
  if (!state.format && familyPack?.projectFormat)
    state.format = familyPack.projectFormat;
}
function parseFamily(raw) {
  const name = typeof raw?.firstName === "string" ? raw.firstName.trim() : "";
  if (
    raw?.kind !== "grade2-family" ||
    raw.version !== 1 ||
    !name ||
    name.length > 45 ||
    !isFamilyPhoto(raw.sketch)
  )
    throw Error("Choose the Grade 2 family pack.");
  const pack = {
    kind: raw.kind,
    version: 1,
    firstName: name,
    sketch: raw.sketch,
  };
  if (["Poster", "Diorama"].includes(raw.projectFormat))
    pack.projectFormat = raw.projectFormat;
  if (raw.handout) {
    if (!["directions", "examples"].every((k) => isFamilyPhoto(raw.handout[k])))
      throw Error("Choose the complete family pack.");
    pack.handout = {
      directions: raw.handout.directions,
      examples: raw.handout.examples,
    };
  }
  if (typeof raw.learningNote === "string")
    pack.learningNote = raw.learningNote.slice(0, 650);
  if (raw.dashboardPairing)
    pack.dashboardPairing = ArcadeLive.config("writer", raw.dashboardPairing);
  return pack;
}
function emptyRound() {
  return { choices: Array(6).fill(null), submitted: false };
}
function restoreActivities(s, obj) {
  s.roundIndex = clampInt(obj.roundIndex, 0, 1);
  s.rounds = ROUNDS.map((questions, index) => {
    const old = obj.rounds?.[index],
      r = emptyRound();
    r.choices = questions.map((q, n) => {
      const v = old?.choices?.[n];
      return Number.isInteger(v) && v >= 0 && v < q.choices.length ? v : null;
    });
    r.submitted = old?.submitted === true && r.choices.every((v) => v !== null);
    return r;
  });
  for (const skill of Object.keys(SKILLS)) {
    const entry = obj.review?.[skill];
    if (
      !entry ||
      typeof entry !== "object" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(entry.due)
    )
      continue;
    s.review[skill] = {
      due: entry.due,
      index: clampInt(entry.index, 0, FRESH[skill].length - 1),
      answer: clampInt(entry.answer, -1, 2, -1),
      answerDay: /^\d{4}-\d{2}-\d{2}$/.test(entry.answerDay)
        ? entry.answerDay
        : "",
      cleared: entry.cleared === true,
    };
  }
  if (Object.hasOwn(s.review, obj.activeReview))
    s.activeReview = obj.activeReview;
  for (let n = 0; n < GOALS.length; n++) {
    let val = obj.storyGoals?.[n];
    if (Number.isInteger(val) && val >= 0 && val < 3) s.storyGoals[n] = val;
  }
}
function localDay(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}
function afterProject() {
  return localDay() > "2026-12-01";
}
function practiceSkill(k, i) {
  if (k === "facts") return "fluency";
  if (k === "preview") return i < 2 ? "regroup" : "pairs";
  if (k === "words") return "meaning";
  return k;
}
function scheduleReview(skill) {
  if (!Object.hasOwn(SKILLS, skill)) return;
  let current = state.review[skill];
  if (current && !current.cleared) return;
  state.review[skill] = {
    due: localDay(1),
    index: current ? (current.index + 1) % FRESH[skill].length : 0,
    answer: -1,
    answerDay: "",
    cleared: false,
  };
}
function goalChoices(i) {
  const goal = GOALS[i],
    chosen = state.storyGoals[i],
    correct = chosen === goal.right;
  return `<fieldset class="goal"><legend>What are you trying to find?</legend><div class="chips">${goal.q.map((x, n) => button(x, "storyGoal", n, chosen === n ? "on" : "", `aria-pressed="${chosen === n}"`)).join("")}</div>${chosen === undefined ? "" : feed(correct ? "You found the question. Try the numbers now." : goal.hint, correct)}</fieldset>`;
}
function meadow() {
  const n = state.finished.length;
  return `<section class="panel meadow"><div class="sectionHead"><h2>My story collection</h2><span>${n} of 6 scenes</span></div><p>Finish a project step to add its picture. Tap a frame to visit that step.</p><div class="stamps">${STAMPS.map((s, i) => `<button data-act="openStep" data-val="${i}" class="stamp ${state.finished.includes(i) ? "revealed" : ""}" aria-label="${esc(STEPS[i])}, ${state.finished.includes(i) ? s.title : "picture to collect"}">${state.finished.includes(i) ? `<img src="${ART[s.scene]}" alt="" style="object-position:${s.position}">` : `<span class="unopened" aria-hidden="true">${["❀", "✧", "☾", "❧", "✿", "☀"][i]}</span>`}<span>${state.finished.includes(i) ? s.title : STEPS[i]}</span></button>`).join("")}</div></section>`;
}
function dailyTile(title, desc, icon, route, color, step) {
  const target = Number.isInteger(step)
    ? `data-act="openStep" data-val="${step}"`
    : `data-go="${route}"`;
  return `<button class="tile ${color}" ${target}><span class="icon" aria-hidden="true">${icon}</span><strong>${esc(title)}</strong><small>${esc(desc)}</small></button>`;
}
function dayPanel() {
  const d = DAYS[state.day],
    week = afterProject();
  const daybar = `<div class="daybar" aria-label="Choose a day">${DAYS.map((x, i) => `<button data-act="day" data-val="${i}" class="${state.day === i ? "on" : ""}" aria-pressed="${state.day === i}">${x.day}<small>${x.date}${state.daysDone.includes(i) ? " ✓" : ""}</small></button>`).join("")}</div>`;
  let actions = "";
  if (d.step === null)
    actions = `<p>Today is free. Close your fieldbook and enjoy the holiday.</p>`;
  else if (!d.math)
    actions = `<p>${d.task} Allow 5–10 minutes.</p>${button("Check my project", "openStep", 5, "primary")}`;
  else
    actions = `<div class="grid daily">${dailyTile("Make my project", "20 minutes · " + d.task, "✿", null, "", d.step)}${dailyTile("Play with numbers", "8–10 minutes · " + (d.math === "checks" ? "Try a mixed readiness round." : LESSONS[d.math][0]), "▦", d.math, "warm")}${dailyTile("Read & write", "8–10 minutes · " + LESSONS[d.english][0] + (d.english === "books" ? " · Read a favorite passage." : ""), "Aa", d.english, "lilac")}</div>`;
  return `<section class="agenda"><div class="sectionHead"><h2>${week ? "My project-week plan" : "What shall I do today?"}</h2><span>November 23–30</span></div>${daybar}<article class="panel"><p class="eyebrow">${esc(d.date)}</p><h3>${esc(d.title)}</h3>${actions}${d.step !== null ? chk("I finished my plan for this day", "daysDone", state.day, state.daysDone.includes(state.day)) : ""}</article></section>`;
}
function readiness() {
  const index = state.roundIndex,
    form = ROUNDS[index],
    r = state.rounds[index],
    done = r.choices.filter((a) => a !== null).length;
  const score = form.filter((q, i) => q.right === r.choices[i]).length;
  let result = r.submitted
    ? `<div class="panel green" role="status"><h2>${score} of 6 correct</h2><p>${score === 6 ? "You explained a whole round of skills. Pick a different round when you’re ready." : "Read the explanations below. Each missed skill has a different problem you can try."}</p><div class="btnrow">${goButton("Open my review", "review")}${button("Start this round again", "resetRound")}</div></div>`
    : "";
  return (
    head(
      "Math + English",
      "Readiness checks",
      "Each round has three math questions and three English questions. Take your time. You can change your choices before checking.",
    ) +
    tabs(["Round 1 · Meadow", "Round 2 · Garden"], index, "round") +
    result +
    form
      .map(
        (q, i) =>
          `<fieldset class="panel question"><legend>${i + 1} · ${esc(SKILLS[q.skill])}</legend>${q.passage ? `<p class="readText">${esc(q.passage)}</p>` : ""}<p class="stem">${esc(q.prompt)}</p>${q.choices.map((c, n) => `<label class="pick"><input type="radio" name="round-${i}" data-round-question="${i}" value="${n}" ${r.choices[i] === n ? "checked" : ""} ${r.submitted ? "disabled" : ""}><span>${esc(c)}</span></label>`).join("")}${r.submitted ? feed((q.right === r.choices[i] ? "You got it. " : "Try this next time. ") + q.why, q.right === r.choices[i]) + (q.right !== r.choices[i] ? button("Try a fresh problem", "fresh", q.skill) : "") : ""}</fieldset>`,
      )
      .join("") +
    `<div class="footerActions"><span id="roundCount">${done} of 6 answered</span>${r.submitted ? button("Try the other round", "round", 1 - index, "primary") : button("Check my round", "submitRound", "", "primary", done < 6 ? "disabled" : "")}</div>`
  );
}
function reviewRoom() {
  const active = Object.entries(state.review)
    .filter(([, e]) => !e.cleared)
    .sort((a, b) => a[1].due.localeCompare(b[1].due));
  if (!active.length)
    return (
      head(
        "Practice again",
        "Try again tomorrow",
        "When a question is tricky, a new problem for that skill will appear here.",
      ) +
      `<div class="panel green"><h2>Ready for a challenge?</h2><p>Try a readiness round or practice a math or English skill.</p>${goButton("Choose a round", "checks", true)}</div>`
    );
  const key = active.some(([k]) => k === state.activeReview)
    ? state.activeReview
    : active[0][0];
  const e = state.review[key];
  if (e.due <= localDay() && e.answer >= 0 && e.answerDay !== localDay()) {
    e.index = (e.index + 1) % FRESH[key].length;
    e.answer = -1;
    e.answerDay = "";
  }
  const q = FRESH[key][e.index],
    correct = e.answer === q.right,
    later = e.due > localDay();
  const tabs = `<div class="chips">${active.map(([k, entry]) => button(SKILLS[k] + (entry.due <= localDay() ? " · ready today" : ""), "fresh", k, k === key ? "on" : "", `aria-pressed="${k === key}"`)).join("")}</div>`;
  return (
    head(
      "One more try",
      "Try again tomorrow",
      "Choose a skill to practice now. Come back on another day to see what you remember.",
    ) +
    tabs +
    `<section class="panel green"><p class="eyebrow">${later ? "Practice ahead" : "Ready to revisit"} · ${esc(SKILLS[key])}</p>${q.passage ? `<p class="readText">${esc(q.passage)}</p>` : ""}<h2>${esc(q.prompt)}</h2>${q.choices.map((c, i) => button(c, "reviewAnswer", key + "|" + i, "choice", `aria-pressed="${e.answer === i}"`)).join("")}${e.answer < 0 ? "" : feed(correct ? q.why + " Come back for another example on your review day." : "Look again. " + q.why, correct)}</section>`
  );
}
function family() {
  return (
    head(
      "Family guide",
      "For grown-ups",
      "Begin with a project step, then spend a few minutes on math and English. Hands-on work is part of the 35–45 minutes.",
    ) +
    `<section class="panel green"><h2>Open a family pack</h2><p>Open the private file for your meadow sketch, project choice and photos of the teacher’s handout. The updated private pack also connects this browser to your read-only family dashboard.</p><div class="btnrow">${button("Open family pack", "openPack", "", "primary")}${familyPack ? button("Remove personalization", "removePack") : ""}</div><p role="status" id="familyMessage">${esc(familyMessage || (familyPack ? "Family pack active for " + familyPack.firstName + "." : "Original fieldbook artwork is active."))}</p></section>
 ${familyPack?.learningNote ? '<section class="panel"><h2>From the family learning notes</h2><p>' + esc(familyPack.learningNote) + "</p></section>" : ""}
 <section class="panel"><h2>Family dashboard</h2><p>Only project checkboxes and practice results are included in the encrypted summary. Drawings, personal choices and written work stay here.</p><p id="familyStatus" role="status"></p><button id="disconnectFamily" hidden>Pause family updates</button><p>Open the private parent viewing link in your family folder to see progress.</p></section>
 <section class="panel"><h2>Move progress between devices</h2><p>Save the progress file to your family folder and load it on the next device. Earlier Thanksgiving fieldbook backups work here too. Load the family pack separately.</p><div class="btnrow">${button("Save my progress", "export")}${button("Load my progress", "import")}${button("Copy or paste backup text", "backupText")}</div>${location.protocol !== "file:" ? '<a class="download" href="./index.html" download="Grade 2 Fieldbook.html">Download offline fieldbook</a>' : "<p>You’re using the offline edition.</p>"}</section>
 <section class="panel"><h2>Coming up in class</h2><p><b>Tuesday, December 1</b> · Bring the poster or diorama and its written paragraph. The five classroom checklist items are in Check &amp; share.</p><p><b>December 1–3</b> · Math Module 4 Lessons 20, 21, and 22, plus English Skills practice pages 1, 2, and 3. The ten spelling words appear in Play with words.</p><p>The six-question rounds are home practice for these skills. The latest class update gave no date for another test.</p>${button("Print my project sheet", "print")}</section>
 <details class="panel"><summary>Learning sources</summary><p>Original practice follows the class project criteria and Grade 2 Module 4. The original story illustrations retell the Greek myth of Demeter and Persephone.</p><ul class="sourceList"><li><a target="_blank" rel="noreferrer" href="https://greatminds.org/hubfs/knowledge/resources/math/EM_Basic_Curriculum_Files/Teacher_Editions/G2_TeacherEditions/EM_G2_M4_TeacherEdition.pdf">Great Minds · Grade 2 Module 4</a></li><li><a target="_blank" rel="noreferrer" href="https://www.whitehousehistory.org/questions/how-did-dolley-madison-save-george-washingtons-portrait">White House Historical Association · Washington’s portrait</a></li><li><a target="_blank" rel="noreferrer" href="https://www.history.navy.mil/our-collections/art/exhibits/communities/uss-constitution.html">U.S. Navy · USS Constitution</a></li><li><a target="_blank" rel="noreferrer" href="https://www.nps.gov/fomc/learn/historyculture/the-star-spangled-banner.htm">National Park Service · Fort McHenry</a></li></ul></details>`
  );
}
async function loadFamilyFile(file) {
  if (!file) return;
  try {
    if (file.size > 1700000) throw Error("This file is too large.");
    const pack = parseFamily(JSON.parse(await file.text()));
    await Promise.all(
      [pack.sketch, ...Object.values(pack.handout || {})].map(async (src) => {
        const probe = new Image();
        probe.src = src;
        await probe.decode();
      }),
    );
    familyPack = pack;
    applyFamilyFormat();
    gradeSync.importPlan(pack);
    familyMessage = "Family pack active for " + pack.firstName + ".";
    try {
      localStorage.setItem(FAMILY_KEY, JSON.stringify(pack));
    } catch {
      familyMessage += " Reopen the pack next time to use it again.";
    }
  } catch {
    familyMessage =
      "Choose the Grade 2 family-pack JSON file from your family folder.";
  }
  if (state.route === "family") render();
}
function extraAction(action, v, target) {
  const r = state.rounds[state.roundIndex];
  switch (action) {
    case "openPack":
      $("#familyInput").value = "";
      $("#familyInput").click();
      return true;
    case "removePack":
      gradeSync.pause();
      familyPack = null;
      familyMessage = "Original fieldbook artwork is active.";
      try {
        localStorage.removeItem(FAMILY_KEY);
      } catch {}
      break;
    case "round":
      state.roundIndex = Number(v);
      go("checks");
      return true;
    case "submitRound":
      if (r.submitted || r.choices.some((x) => x === null)) return true;
      r.submitted = true;
      ROUNDS[state.roundIndex].forEach((q, i) => {
        if (q.right !== r.choices[i]) scheduleReview(q.skill);
      });
      go("checks");
      return true;
    case "resetRound":
      state.rounds[state.roundIndex] = emptyRound();
      go("checks");
      return true;
    case "storyGoal":
      state.storyGoals[state.positions.stories] = Number(v);
      if (Number(v) !== GOALS[state.positions.stories].right)
        scheduleReview("stories");
      break;
    case "fresh":
      if (!Object.hasOwn(SKILLS, v)) return true;
      if (!state.review[v] || state.review[v].cleared) scheduleReview(v);
      state.activeReview = v;
      go("review");
      return true;
    case "reviewAnswer": {
      const [skill, value] = v.split("|"),
        e = state.review[skill];
      if (!e || e.cleared) return true;
      const q = FRESH[skill][e.index];
      e.answer = Number(value);
      e.answerDay = localDay();
      if (e.answer === q.right && e.due <= localDay()) {
        e.cleared = true;
        redraw(target);
        showDialog(
          `<h2>You remembered!</h2><p>${esc(q.why)}</p><p>You completed the review for ${esc(SKILLS[skill].toLowerCase())}.</p>`,
        );
        return true;
      }
      break;
    }
    default:
      return false;
  }
  redraw(target);
  return true;
}
$("#familyInput").addEventListener("change", (ev) =>
  loadFamilyFile(ev.target.files[0]),
);
document.addEventListener("change", (ev) => {
  const el = ev.target;
  if (el.dataset.roundQuestion === undefined || state.route !== "checks")
    return;
  const r = state.rounds[state.roundIndex];
  if (r.submitted) return;
  r.choices[Number(el.dataset.roundQuestion)] = Number(el.value);
  const done = r.choices.filter((x) => x !== null).length;
  $("#roundCount").textContent = `${done} of 6 answered`;
  document.querySelector('[data-act="submitRound"]').disabled = done !== 6;
  save();
});
