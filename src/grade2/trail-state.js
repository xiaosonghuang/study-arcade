const PATHS = { ...TRAIL_WORDS, ...TRAIL_MATH };
const PATH_ORDER = [
  "project",
  "mental",
  "trade",
  "stories",
  "evidence",
  "words",
  "writing",
  "science",
];
const SUBJECT_ICONS = ["✿", "±", "▦", "◇", "⌕", "Aa", "✎", "☀"];
const PAPER = [
  "I made my poster or diorama",
  "I wrote my paragraph",
  "I practiced sharing out loud",
  "I packed both pieces",
];
const PAPER_STEPS = [3, 4, 5, 5];
const PAPER_NEXT = [
  "Build your poster or diorama",
  "Write your own paragraph",
  "Rehearse with a listener",
  "Pack the picture and paragraph together",
];
const LEGACY_PATHS = {
  fluency: "mental",
  regroup: "trade",
  pairs: "trade",
  stories: "stories",
  clue: "evidence",
  meaning: "words",
  spelling: "words",
  editing: "writing",
};
const STAGES = ["model", "guide", "solo", "stretch", "preview", "interest"];
function freshTrail() {
  return {
    skill: "project",
    stage: "model",
    interest: "nature",
    minutes: 40,
    step: 0,
    guide: 0,
    solo: 0,
    choice: -1,
    hint: false,
    miss: false,
    started: false,
    checkin: "new",
    focus: "",
    probes: {},
    paper: {},
    marks: {},
    due: {},
    reviewAt: {},
    savedTurn: null,
  };
}
function cleanTrail(raw) {
  const t = freshTrail();
  if (!raw || typeof raw !== "object") return t;
  const pick = (key, options) => {
    if (options.includes(raw[key])) t[key] = raw[key];
  };
  pick("skill", PATH_ORDER);
  pick("stage", STAGES);
  pick("interest", Object.keys(TRAIL_INTERESTS));
  pick("minutes", [10, 20, 40]);
  pick("checkin", ["new", "done", "later"]);
  pick("focus", PATH_ORDER);
  for (const k of ["started", "hint", "miss"]) t[k] = raw[k] === true;
  t.step = clampInt(raw.step, 0, PATHS[t.skill].example.steps.length);
  t.guide = clampInt(raw.guide, 0, 1);
  t.solo = clampInt(raw.solo, 0, 3);
  t.choice = clampInt(raw.choice, -1, 2, -1);
  const saved = raw.savedTurn;
  if (saved && PATH_ORDER.includes(saved.skill))
    t.savedTurn = { skill: saved.skill, solo: clampInt(saved.solo, 0, 3) };
  for (let i = 0; i < 2; i++) {
    const v = raw.probes?.[i];
    if (Number.isInteger(v) && v >= 0 && v <= 2) t.probes[i] = v;
  }
  PAPER.forEach((_, i) => {
    let v = raw.paper?.[i];
    if (
      v &&
      typeof v.done === "boolean" &&
      Number.isSafeInteger(v.at) &&
      v.at > 0
    )
      t.paper[i] = { done: v.done, at: v.at };
  });
  for (const skill of PATH_ORDER) {
    const at = raw.reviewAt?.[skill];
    if (Number.isSafeInteger(at) && at > 0) t.reviewAt[skill] = at;
    const day = raw.due?.[skill];
    if (typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day))
      t.due[skill] = day;
    for (const stage of ["guide", "solo"]) {
      PATHS[skill][stage].forEach((_, i) => {
        const id = markId(skill, stage, i),
          v = raw.marks?.[id];
        if (["tried", "helped", "independent"].includes(v))
          t.marks[id] = stage === "guide" && v === "independent" ? "helped" : v;
      });
    }
  }
  return t;
}
function markId(skill, stage, n) {
  return skill + "." + stage + "." + n;
}
function trailCount(skill, level) {
  return Object.entries(state.trail.marks).filter(
    ([k, v]) => k.startsWith(skill + ".") && v === level,
  ).length;
}
function nextPaper() {
  return PAPER.findIndex((_, i) => !state.trail.paper[i]?.done);
}
function legacyReview() {
  return Object.keys(LEGACY_PATHS).find(
    (k) => state.review[k] && !state.review[k].cleared,
  );
}
function studyPick() {
  const t = state.trail;
  const due = PATH_ORDER.find((k) => t.due[k] && t.due[k] <= localDay());
  if (due) return due;
  if (t.focus && trailCount(t.focus, "independent") < 2) return t.focus;
  const probe = QUICK.find(
    (q, i) =>
      t.probes[i] !== undefined &&
      t.probes[i] !== q.correct &&
      trailCount(q.key, "independent") < 2,
  );
  if (probe) return probe.key;
  const old = legacyReview();
  if (old && trailCount(LEGACY_PATHS[old], "independent") < 2)
    return LEGACY_PATHS[old];
  const basics = ["evidence", "trade", "writing", "stories", "words", "mental"];
  return basics.reduce((a, b) =>
    trailCount(a, "independent") <= trailCount(b, "independent") ? a : b,
  );
}
function chosenSolo(skill) {
  const marks = state.trail.marks;
  const fresh = PATHS[skill].solo.findIndex(
    (_, i) => !marks[markId(skill, "solo", i)],
  );
  if (fresh !== -1) return fresh;
  const pending = PATHS[skill].solo.findIndex(
    (_, i) => marks[markId(skill, "solo", i)] === "tried",
  );
  return pending !== -1
    ? pending
    : (state.trail.solo + 1) % PATHS[skill].solo.length;
}
