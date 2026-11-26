const gradeSkills = {
  project: "Myth project",
  mental: "Mental math",
  trade: "Regrouping",
  stories: "Story problems",
  evidence: "Reading evidence",
  words: "Spelling and vocabulary",
  writing: "Writing revision",
  science: "Science",
};
const paperNames = [
  "Poster or diorama made",
  "Paragraph written",
  "Sharing rehearsed",
  "Both pieces packed",
];
const advice = {
  project:
    "Ask for the myth’s title, characters, setting, main events and what it explains.",
  mental: "Give her 8 + 6 and ask which two pieces make ten.",
  trade: "Use tens and ones to show why 46 + 28 needs a trade.",
  stories:
    "Ask her to name what the question is asking before choosing an operation.",
  evidence:
    "Read a new paragraph together and ask which words support her idea.",
  words:
    "Pick two class words, cover them and have her write and explain each one.",
  writing:
    "Read one sentence aloud and ask her to add a detail that helps the reader see it.",
  science:
    "Ask what she would change and what she would keep the same in a fair test.",
};
const gradeLevels = ["tried", "helped", "independent"];
function gradeRecord(row) {
  const s = row?.snapshot;
  if (
    s?.book !== "grade2" ||
    s.v !== 2 ||
    typeof row.id !== "string" ||
    !validTime(row.received)
  )
    return null;
  const marks = {},
    paper = {},
    reviews = {};
  for (const k of Object.keys(gradeSkills)) {
    for (const stage of ["guide", "solo"]) {
      const size = stage === "guide" ? 2 : 4;
      for (let i = 0; i < size; i++) {
        const key = k + "." + stage + "." + i,
          value = s.marks?.[key];
        if (gradeLevels.includes(value))
          marks[key] =
            stage === "guide" && value === "independent" ? "helped" : value;
      }
    }
    const r = s.reviews?.[k];
    if (
      r &&
      validTime(r.at) &&
      typeof r.due === "string" &&
      (r.due === "" || /^\d{4}-\d{2}-\d{2}$/.test(r.due))
    )
      reviews[k] = r;
  }
  paperNames.forEach((_, i) => {
    const v = s.paper?.[i];
    if (typeof v?.done === "boolean" && validTime(v.at)) paper[i] = v;
  });
  const earlier = list(s.earlier).filter(
    (id) =>
      typeof id === "string" &&
      /^(?:(?:facts|stories|preview)[0-3]|(?:clue|history)[0-2]|(?:spell|words)[0-9]|round[0-1])$/.test(
        id,
      ),
  );
  return {
    grade2: true,
    id: row.id,
    received: row.received,
    marks,
    paper,
    reviews,
    earlier,
    steps: numbers(s.steps, 6),
  };
}
function gradeOverview(records) {
  const area = byId("grade-report");
  area.hidden = false;
  area.replaceChildren(h("h2", "Grade 2 fieldbook"));
  if (!records.length) {
    area.append(
      h(
        "p",
        "Waiting for a Grade 2 report. In the fieldbook, open For grown-ups and import the updated private family pack on the learner’s device.",
        "explain",
      ),
    );
    return;
  }
  const papers = {},
    reviews = {},
    marks = {},
    earlier = new Set(),
    steps = new Set();
  for (const r of records) {
    for (const [k, v] of Object.entries(r.marks))
      if (gradeLevels.indexOf(v) > gradeLevels.indexOf(marks[k])) marks[k] = v;
    for (const [source, out] of [
      [r.paper, papers],
      [r.reviews, reviews],
    ])
      for (const [k, v] of Object.entries(source))
        if (!out[k] || v.at > out[k].at) out[k] = v;
    add(earlier, r.earlier);
    add(steps, r.steps);
  }
  const last = Math.max(...records.map((r) => r.received)),
    date = new Date();
  const day = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  const counts = (k, l) =>
    Object.entries(marks).filter(([id, v]) => id.startsWith(k + ".") && v === l)
      .length;
  area.append(
    h(
      "p",
      "Latest Grade 2 upload " +
        stamp(last) +
        " · " +
        plural(records.length, "browser") +
        "." +
        (Date.now() - last > 86400000 ? " This upload is over a day old." : ""),
      "explain",
    ),
  );
  const metrics = h("div", null, "metrics");
  metrics.append(
    metric(
      Object.values(marks).filter((v) => v === "independent").length,
      "Solved independently",
      "Fresh problems answered before a hint or retry",
    ),
    metric(
      Object.values(marks).filter((v) => v === "helped").length,
      "Solved with help",
      "Guided questions, hints and corrected answers",
    ),
    metric(
      Object.values(papers).filter((v) => v.done).length + " / 4",
      "At the project table",
      "Physical milestones checked by the family",
    ),
  );
  area.append(metrics);
  const recent = h("div", null, "recent"),
    paper = h("article", null, "card"),
    rec = h("article", null, "card"),
    ul = h("ul", null, "review-list");
  paper.append(h("h3", "Paper project · December 1"));
  paperNames.forEach((n, i) =>
    ul.append(
      h(
        "li",
        n +
          " · " +
          (papers[i]?.done ? "Checked" : papers[i] ? "Open" : "Unconfirmed"),
      ),
    ),
  );
  paper.append(
    ul,
    h("p", steps.size + " of 6 studio steps checked in the app.", "detail"),
  );
  const missing = paperNames.findIndex((_, i) => !papers[i]?.done),
    keys = Object.keys(gradeSkills);
  const due = keys.find((k) => reviews[k]?.due && reviews[k].due <= day);
  const next =
    due ||
    keys.find(
      (k) =>
        counts(k, "helped") + counts(k, "tried") > 0 &&
        counts(k, "independent") < 2,
    ) ||
    "evidence";
  const paperAdvice = [
    "Look together at the poster or diorama. Ask her to point out a detail that tells you where the myth happens.",
    "Have her tell the myth aloud, then write it in her own words and check the five project details.",
    "Listen to a rehearsal. Ask which part of the picture best explains a change in the story.",
    "Place the project and paragraph together for school.",
  ][missing];
  rec.append(
    h("h3", "One thing to do together"),
    h(
      "p",
      day <= "2026-12-01" && missing >= 0 ? paperAdvice : advice[next],
      "detail",
    ),
    h(
      "p",
      earlier.size +
        " earlier practice items or rounds recorded. Earlier work has no hint history.",
      "detail",
    ),
  );
  recent.append(paper, rec);
  area.append(recent);
  const skills = h("div", null, "subjects");
  for (const k of keys) {
    const card = h("article", null, "card subject");
    card.style.setProperty(
      "--hue",
      ["project", "science"].includes(k) ? "#87b89e" : "#e6b66c",
    );
    card.append(
      h("h3", gradeSkills[k]),
      h(
        "p",
        counts(k, "independent") +
          " independent · " +
          counts(k, "helped") +
          " with help · " +
          counts(k, "tried") +
          " still working",
      ),
    );
    if (reviews[k]?.due)
      card.append(
        h(
          "p",
          reviews[k].due <= day
            ? "Ready to review"
            : "Review " + reviews[k].due,
        ),
      );
    skills.append(card);
  }
  area.append(skills);
}
