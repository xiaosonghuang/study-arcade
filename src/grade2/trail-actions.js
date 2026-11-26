function startPath(skill, stage) {
  if (!PATH_ORDER.includes(skill) || !STAGES.includes(stage)) return;
  const t = state.trail;
  const lastSkill = t.skill;
  t.skill = skill;
  t.stage = stage;
  t.started = true;
  t.choice = -1;
  t.hint = false;
  t.miss = false;
  t.step = 0;
  t.savedTurn = null;
  if (stage === "guide") t.guide = 0;
  if (stage === "solo") t.solo = chosenSolo(skill);
  if (lastSkill !== skill && stage !== "solo") t.solo = 0;
  go("trail");
}
function guidedFallback() {
  const t = state.trail;
  if (t.stage === "solo") t.savedTurn = { skill: t.skill, solo: t.solo };
  t.guide = t.stage === "guide" ? 1 - t.guide : 1;
  t.stage = "guide";
  t.choice = -1;
  t.hint = false;
  t.miss = false;
}
function trailAction(act, v, el) {
  const t = state.trail,
    k = t.skill;
  switch (act) {
    case "minutes":
      t.minutes = Number(v);
      break;
    case "interestPick":
      if (Object.hasOwn(TRAIL_INTERESTS, v)) t.interest = v;
      break;
    case "focusPick":
      t.focus = PATH_ORDER.includes(v) ? v : "";
      break;
    case "probe": {
      const [i, n] = v.split(".").map(Number);
      if (QUICK[i] && n >= 0 && n <= 2) t.probes[i] = n;
      break;
    }
    case "skipCheck":
    case "finishCheck":
      t.checkin = act === "skipCheck" ? "later" : "done";
      go("home");
      return true;
    case "sessionGo":
      if (v === "desk") {
        state.step = nextProjectStep();
        go("studio");
      }
      if (PATH_ORDER.includes(v)) startPath(v, "model");
      if (v === "check") go("checks");
      if (v === "curious") startPath("science", "interest");
      return true;
    case "continueTrail":
      if (nextPaper() !== -1 && !afterProject()) {
        state.step = nextProjectStep();
        go("studio");
      } else if (t.started && t.skill === studyPick()) go("trail");
      else startPath(studyPick(), "model");
      return true;
    case "resumeTrail":
      go("trail");
      return true;
    case "path":
    case "homeModel":
    case "homeStretch":
    case "reviewTrail":
      startPath(
        v,
        act === "homeStretch"
          ? "stretch"
          : act === "reviewTrail"
            ? "solo"
            : "model",
      );
      return true;
    case "stage":
      if (v !== t.stage) startPath(k, v);
      return true;
    case "modelStep":
      t.step = Math.min(PATHS[k].example.steps.length, t.step + 1);
      break;
    case "replay":
      t.step = 0;
      break;
    case "trailHint": {
      t.hint = true;
      const id = markId(k, t.stage, t.stage === "solo" ? t.solo : t.guide);
      t.marks[id] ??= "tried";
      t.due[k] ??= localDay(1);
      t.reviewAt[k] = Date.now();
      break;
    }
    case "trailAnswer": {
      const solo = t.stage === "solo",
        index = solo ? t.solo : t.guide,
        q = PATHS[k][t.stage][index],
        id = markId(k, t.stage, index);
      if (t.choice === q.correct) return true;
      t.choice = Number(v);
      const before = t.marks[id];
      if (t.choice === q.correct) {
        if (!before || before === "tried")
          t.marks[id] =
            solo && !t.hint && !t.miss && !before ? "independent" : "helped";
      } else {
        t.miss = true;
        t.marks[id] ??= "tried";
      }
      t.reviewAt[k] = Date.now();
      const reviewToday = t.due[k] && t.due[k] <= localDay();
      if (reviewToday && solo && t.choice === q.correct && !t.hint && !t.miss)
        delete t.due[k];
      else if (!reviewToday) t.due[k] = localDay(1);
      break;
    }
    case "alternateGuide":
      guidedFallback();
      break;
    case "guidedNext": {
      const back = t.savedTurn;
      if (back) {
        t.stage = "solo";
        t.solo = back.solo;
        t.choice = -1;
        t.hint = false;
        t.miss = true;
        t.savedTurn = null;
        go("trail");
      } else startPath(k, "solo");
      return true;
    }
    case "anotherSolo":
      startPath(k, "solo");
      return true;
    default:
      return false;
  }
  redraw(el);
  return true;
}
document.addEventListener("change", (event) => {
  const el = event.target;
  if (el.dataset.paper === undefined) return;
  const i = Number(el.dataset.paper);
  if (Number.isInteger(i) && i >= 0 && i < PAPER.length) {
    state.trail.paper[i] = { done: el.checked, at: Date.now() };
    save();
  }
});
