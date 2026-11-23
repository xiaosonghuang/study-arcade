const $ = (s) => document.querySelector(s);
const KEY = "study-arcade.grade2.work.v2";
const PROPS = ["stiff", "flexible", "absorbent", "water-resistant"];
const OBJECTS = ["Cardboard", "Paper towel", "Foil"];
const groupSizes = {
  facts: 4,
  stories: 4,
  preview: 4,
  clue: 3,
  words: 10,
  history: 3,
};
const noteKeys = [
  "sketch",
  "supplies",
  "scene",
  "build",
  "draft",
  "rehearse",
  "book",
  "bookClue",
  "memory",
  "science",
  "measure",
  "historyIdea",
  "readingIdea",
  "firstSentence",
  "revisedSentence",
];
function dayNow() {
  const d = new Date();
  if (localDay() >= "2026-11-30") return 6;
  if (d.getFullYear() !== 2026 || d.getMonth() !== 10) return 0;
  return d.getDate() < 24
    ? 0
    : d.getDate() < 28
      ? d.getDate() - 23
      : d.getDate() < 30
        ? 5
        : 6;
}
function dateKey() {
  const d = new Date();
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("-");
}
function initial() {
  return {
    rounds: [emptyRound(), emptyRound()],
    roundIndex: 0,
    review: {},
    storyGoals: {},
    activeReview: "",
    route: "home",
    selectedOn: dateKey(),
    day: dayNow(),
    step: 0,
    format: "",
    notes: Object.fromEntries(noteKeys.map((k) => [k, ""])),
    materials: [],
    checks: [],
    order: [],
    storyTry: false,
    sceneCard: 0,
    finished: [],
    positions: Object.fromEntries(Object.keys(groupSizes).map((k) => [k, 0])),
    answers: {},
    attempts: {},
    numberInputs: {},
    wordMode: "meaning",
    spellAnswers: {},
    spellTries: {},
    spells: {},
    trade: [0, 11, 15],
    properties: {},
    objects: 0,
    daysDone: [],
    tasks: [],
  };
}
const validRoutes = new Set(ROUTES);
const cleanList = (v, max) =>
  Array.isArray(v)
    ? [...new Set(v.filter((n) => Number.isInteger(n) && n >= 0 && n < max))]
    : [];
const clampInt = (v, lo, hi, fallback = lo) =>
  Number.isInteger(v) && v >= lo && v <= hi ? v : fallback;
const cleanText = (v, max = 3000) =>
  typeof v === "string" ? v.slice(0, max) : "";
function restore(raw) {
  const legacy =
    raw?.version === 1 &&
    typeof raw.kind === "string" &&
    /^[a-z]+-fieldbook$/.test(raw.kind);
  if (
    !(legacy || (raw?.version === 2 && raw.kind === "grade2-fieldbook")) ||
    !raw.work ||
    typeof raw.work !== "object" ||
    Array.isArray(raw.work)
  )
    throw Error("This file is not a Fieldbook progress backup.");
  const obj = raw.work,
    s = initial();
  if (!obj.notes || typeof obj.notes !== "object" || !Array.isArray(obj.checks))
    throw Error("This backup is missing project information.");
  if (validRoutes.has(obj.route)) s.route = obj.route;
  s.selectedOn = cleanText(obj.selectedOn, 15) || dateKey();
  s.step = clampInt(obj.step, 0, 5);
  s.day = clampInt(obj.day, 0, 6, s.day);
  s.sceneCard = clampInt(obj.sceneCard, 0, 3);
  s.objects = clampInt(obj.objects, 0, 2);
  s.format = ["Poster", "Diorama"].includes(obj.format) ? obj.format : "";
  for (const k of noteKeys)
    s.notes[k] = cleanText(obj.notes[k], k === "draft" ? 10000 : 3000);
  for (const [k, n] of Object.entries({
    checks: 5,
    materials: MATERIALS.length,
    order: 4,
    finished: 6,
    daysDone: 7,
    tasks: 3,
  }))
    s[k] = cleanList(obj[k], n);
  s.storyTry = obj.storyTry === true;
  for (const [group, limit] of Object.entries(groupSizes)) {
    s.positions[group] = clampInt(obj.positions?.[group], 0, limit - 1);
    for (let i = 0; i < limit; i++) {
      let k = group + i;
      if (obj.attempts?.[k] === true) s.attempts[k] = true;
      if (obj.answers?.[k] === true) s.answers[k] = true;
      if (typeof obj.numberInputs?.[k] === "string")
        s.numberInputs[k] = cleanText(obj.numberInputs[k], 8);
    }
  }
  for (let i = 0; i < 10; i++) {
    if (obj.spellAnswers?.[i] === true) s.spellAnswers[i] = true;
    if (obj.spellTries?.[i] === true) s.spellTries[i] = true;
    if (typeof obj.spells?.[i] === "string")
      s.spells[i] = cleanText(obj.spells[i], 30);
  }
  if (obj.wordMode === "spell") s.wordMode = "spell";
  if (
    [
      [0, 11, 15],
      [0, 12, 5],
      [1, 1, 15],
      [1, 2, 5],
    ].some((t) => JSON.stringify(t) === JSON.stringify(obj.trade))
  )
    s.trade = obj.trade.slice();
  for (let i = 0; i < OBJECTS.length; i++)
    s.properties[i] = cleanList(obj.properties?.[i], PROPS.length);
  restoreActivities(s, obj);
  return s;
}
let state = initial(),
  canSave = true,
  pending = null;
const wrap = () => ({ kind: "grade2-fieldbook", version: 2, work: state });
let lastStored = null,
  storageConflict = false;
try {
  lastStored = localStorage.getItem(KEY);
  if (lastStored) state = restore(JSON.parse(lastStored));
} catch {
  canSave = false;
  storageConflict = lastStored !== null;
}
if (state.selectedOn !== dateKey()) {
  state.day = dayNow();
  state.selectedOn = dateKey();
}
function save() {
  const status = $("#saveState");
  try {
    if (localStorage.getItem(KEY) !== lastStored) storageConflict = true;
    if (storageConflict) {
      status.textContent =
        "Another copy of your work is here. Export this tab’s work or reload for the saved copy.";
      return;
    }
    const next = JSON.stringify(wrap());
    if (next !== lastStored) {
      localStorage.setItem(KEY, next);
      lastStored = next;
    }
    canSave = true;
  } catch {
    canSave = false;
  }
  status.textContent = canSave
    ? "Saved on this device"
    : "Session only · Use Save my progress";
}
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function button(label, action, value = "", className = "", attrs = "") {
  return `<button data-act="${action}" data-val="${esc(value)}" class="${className}" ${attrs}>${esc(label)}</button>`;
}
function goButton(label, route, primary = false) {
  return `<button data-go="${route}" class="${primary ? "primary" : ""}">${esc(label)}</button>`;
}
function field(k, label, ph = "", large = false) {
  return `<label class="field" for="note-${k}">${esc(label)}</label><textarea id="note-${k}" data-note="${k}" maxlength="${k === "draft" ? 10000 : 3000}" class="${large ? "largeText" : ""}" placeholder="${esc(ph)}">${esc(state.notes[k])}</textarea>`;
}
function chk(label, key, index, on) {
  return `<label class="check"><input type="checkbox" data-check="${key}" value="${index}" ${on ? "checked" : ""}><span>${esc(label)}</span></label>`;
}
function tabs(labels, selected, action) {
  return `<div class="tabs">${labels.map((t, i) => button(t, action, i, selected === i ? "on" : "", `aria-pressed="${selected === i}"`)).join("")}</div>`;
}
function tile(label, sub, icon, route, color = "") {
  return `<button class="tile ${color}" data-go="${route}"><span class="icon" aria-hidden="true">${esc(icon)}</span><strong>${esc(label)}</strong><small>${esc(sub)}</small></button>`;
}
function head(label, title, desc) {
  return `<div class="pageHead"><p class="eyebrow">${esc(label)}</p><h1>${esc(title)}</h1><p class="sub">${esc(desc)}</p></div>`;
}
function feed(message, ok = true) {
  return message
    ? `<div class="feedback ${ok ? "" : "try"}" role="status">${esc(message)}</div>`
    : "";
}
function changeList(list, i, on) {
  const index = list.indexOf(i);
  if (on && index < 0) list.push(i);
  if (!on && index >= 0) list.splice(index, 1);
}
function navCat(route) {
  if (route === "review") return "checks";
  if (
    [
      "trade",
      "facts",
      "stories",
      "preview",
      "clue",
      "books",
      "words",
      "memory",
    ].includes(route)
  )
    return "practice";
  if (["history", "matter"].includes(route)) return "explore";
  return route;
}
function menu() {
  const links = [
    ["home", "Home"],
    ["studio", "Project studio"],
    ["practice", "Practice"],
    ["checks", "Readiness"],
    ["explore", "Explore"],
  ];
  $("#nav").innerHTML = links
    .map(
      ([k, l]) =>
        `<a href="#${k}" ${navCat(state.route) === k ? 'aria-current="page"' : ""}>${l}</a>`,
    )
    .join("");
  document
    .querySelector(".parentBtn")
    .setAttribute("aria-pressed", String(state.route === "family"));
}
const STUDIO_SUB = [
  "Look closely at the meadow. What could happen here?",
  "Meet the characters, then tell the myth in order.",
  "Choose what you want to make and how you will make it.",
  "Take your idea off the screen and into the world.",
  "Tell the story first. Write it the way you would tell it.",
  "Check the teacher’s list and get ready to share.",
];
function story() {
  let i = state.sceneCard,
    order = state.order,
    correct = order.length === 4 && order.every((v, j) => v === j);
  return `<div class="split"><img class="storypic" src="${ART[i]}" alt="${esc(SCENES[i][0])}"><div><p class="eyebrow">Read the myth</p><h3>${SCENES[i][0]}</h3><p class="readText">${SCENES[i][1]}</p>${tabs(["1", "2", "3", "4"], i, "sceneCard")}</div></div><hr><h3>Can you put the pictures in order?</h3><p>Tap the first event, then the next. Tap a chosen picture to take it out.</p><div class="storygrid">${[2, 0, 3, 1].map((n) => `<button class="storycard ${order.includes(n) ? "chosen" : ""}" data-act="sequence" data-val="${n}" aria-pressed="${order.includes(n)}"><img src="${ART[n]}" alt=""><span>${order.includes(n) ? `${order.indexOf(n) + 1}. ` : ""}${SCENES[n][0]}</span></button>`).join("")}</div><p class="inset mt"><strong>My order</strong> · ${order.length ? order.map((n) => SCENES[n][0]).join(" / ") : "Choose a picture to begin."}</p>${button("Check my order", "checkStory")}${state.storyTry ? feed(correct ? "Yes! Tell the four events to someone in your own words." : order.length < 4 ? "Pick all four pictures before you check." : "Look at which part first shows the plants wilting. You can change your order and try again.", correct) : ""}`;
}
function studio() {
  const i = state.step;
  let part;
  if (i === 0)
    part = `<div class="split"><figure><img src="${familyPack?.sketch || ART[0]}" class="studioPic" alt="${familyPack ? "Your meadow sketch" : "Persephone in a flowering meadow"}"><figcaption class="caption">${familyPack ? "Your original meadow sketch" : "Imagine your own meadow scene"}</figcaption></figure><div><h3>Where is Persephone?</h3><p>Point to a place where she could stand. Where could you show a change from warm to cold?</p>${field("sketch", "What would you add to your sketch?", "I could draw…")}</div></div>`;
  if (i === 1) part = story();
  if (i === 2)
    part = `<h3>What will you make?</h3><p>A <b>poster</b> tells a story on one flat page. A <b>diorama</b> lets you build a little world inside a box.</p><div class="chips">${["Poster", "Diorama"].map((t) => button(t, "format", t, state.format === t ? "on" : "", `aria-pressed="${state.format === t}"`)).join("")}</div>${state.format ? `<p class="inset">${state.format === "Poster" ? "Try dividing your poster into two scenes. Where will your title and paragraph go?" : "Stand your box on one side. What could go in front? What could go at the back?"}</p>` : ""}${field("scene", "How will you show Earth and the Underworld?", "I want one part to show…")}<h3 class="mt">My materials</h3><div class="grid">${MATERIALS.map((m, n) => chk(m, "materials", n, state.materials.includes(n))).join("")}</div>${field("supplies", "Anything else to gather?", "I might also use…")}`;
  if (i === 3)
    part = `<h3>Bring your plan to the table</h3><p class="inset"><b>${esc(state.format || "My project")}</b> · ${esc(state.notes.scene || "Think of one detail you want someone to notice first.")}</p><p><b>My materials</b> · ${esc(
      state.materials
        .map((n) => MATERIALS[n])
        .concat(state.notes.supplies || [])
        .join(", ") || "Choose or write materials in My plan.",
    )}</p>${["Make the setting first. Add the meadow or the Underworld.", "Add characters. Show something that changes during the myth.", "Add the title and leave room for your paragraph."].map((t, n) => chk(t, "tasks", n, state.tasks.includes(n))).join("")}${field("build", "What did you add today?", "One detail I made was…")}${goButton("Try a material test", "matter")}`;
  if (i === 4)
    part = `<h3>Talk it through first</h3><p>Tell someone who was there, where they were, and what changed. Which detail helps explain the seasons in this myth?</p><details><summary>Give me sentence starters</summary><p class="inset">My myth is called … &nbsp; • &nbsp; In the meadow … &nbsp; • &nbsp; When … &nbsp; • &nbsp; In the end … &nbsp; • &nbsp; This myth explains …</p></details>${field("draft", "My paragraph", "Write your own paragraph here, or use this space to plan what you will write on paper.", true)}<p class="hint">Read it aloud. Check your capital letters and ending punctuation.</p>`;
  if (i === 5)
    part = `<div class="split"><div><h3>My paragraph checklist</h3>${CHECKS.map((t, n) => chk(t, "checks", n, state.checks.includes(n))).join("")}</div><div><h3>My words</h3><p class="inset" style="white-space:pre-wrap;overflow-wrap:anywhere">${esc(state.notes.draft || "If you wrote on paper, look at your paragraph as you check each detail.")}</p>${button("Edit my paragraph", "openStep", 4)}</div></div>${field("rehearse", "What would you like to point out when you share?", "I want to show you…")}<p><b>Pack for Tuesday, December 1.</b> Put the finished poster or diorama and your written paragraph together.</p>${button("Print my project sheet", "print")}`;
  return (
    head(
      "Demeter and Persephone · Due December 1",
      "Project studio",
      "Plan your scene, make a poster or diorama, and write your own paragraph.",
    ) +
    tabs(
      STEPS.map((x, n) => `${state.finished.includes(n) ? "✓ " : ""}${x}`),
      i,
      "step",
    ) +
    `<section class="panel"><p class="eyebrow">Step ${i + 1} of 6</p><h2>${STEPS[i]}</h2><p class="sub">${STUDIO_SUB[i]}</p>${part}</section><div class="footerActions"><div>${chk("I finished this step", "finished", i, state.finished.includes(i))}${state.finished.includes(i) ? `<span class="hint" role="status">Added to your meadow: ${STAMPS[i].title}.</span>` : ""}</div>${i < 5 ? button("Next step", "openStep", i + 1, "primary") : goButton("Back to home", "home", true)}</div>`
  );
}
