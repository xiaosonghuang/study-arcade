function gradeSnapshot() {
  const t = state.trail,
    earlier = [];
  for (const [group, size] of Object.entries(groupSizes)) {
    for (let i = 0; i < size; i++)
      if (state.attempts[group + i]) earlier.push(group + i);
  }
  for (let i = 0; i < 10; i++)
    if (state.spellTries[i]) earlier.push("spell" + i);
  state.rounds.forEach((r, i) => {
    if (r.submitted) earlier.push("round" + i);
  });
  const marks = {},
    reviews = {},
    paper = {};
  for (const skill of PATH_ORDER) {
    for (const stage of ["guide", "solo"])
      PATHS[skill][stage].forEach((_, i) => {
        const id = markId(skill, stage, i);
        if (t.marks[id]) marks[id] = t.marks[id];
      });
    if (t.reviewAt[skill])
      reviews[skill] = { due: t.due[skill] || "", at: t.reviewAt[skill] };
  }
  PAPER.forEach((_, i) => {
    if (t.paper[i]) paper[i] = { done: t.paper[i].done, at: t.paper[i].at };
  });
  return {
    v: 2,
    book: "grade2",
    paper,
    marks,
    reviews,
    earlier,
    steps: state.finished.slice().sort(),
  };
}
const gradeSync = createReportSync({
  prefix: "study-arcade.grade2.live.",
  snapshotForDevice: gradeSnapshot,
  conflict: () => storageConflict,
  plan: () => familyPack,
});
