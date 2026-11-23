function lessonTile(k, color) {
  const [title, sub, icon] = LESSONS[k];
  return tile(title, sub, icon, k, color);
}
function practice() {
  return (
    head(
      "Review & discover",
      "Practice",
      "Choose one short activity. You can come back for a different one tomorrow.",
    ) +
    `<div class="sectionHead"><h2>Play with numbers</h2></div><div class="grid">${["trade", "facts", "stories", "preview"].map((k) => lessonTile(k, "warm")).join("")}</div><div class="sectionHead"><h2>Read, write & tell</h2></div><div class="grid">${["clue", "books", "words", "memory"].map((k) => lessonTile(k, "lilac")).join("")}</div>`
  );
}
function explore() {
  return (
    head(
      "Look closely",
      "Explore",
      "Pick up an object, ask a question, and try out an idea.",
    ) +
    `<div class="grid">${lessonTile("matter", "")}${lessonTile("history", "blue")}</div><section class="panel green"><h3>Tell someone what you noticed</h3><p>Start with “I noticed…” and point to the detail that gave you the idea.</p></section>`
  );
}
function quizNav(k) {
  const i = state.positions[k],
    n = groupSizes[k],
    wordSpell = k === "words" && state.wordMode === "spell",
    done = Array.from({ length: n }, (_, z) =>
      wordSpell ? state.spellAnswers[z] : state.answers[k + z],
    ).filter(Boolean).length;
  return `<div class="footerActions">${button("Previous", "position", i - 1, "", i === 0 ? "disabled" : "")}<span class="progress">${i + 1} of ${n} · ${done} solved</span>${i === n - 1 ? goButton("More activities", k === "history" ? "explore" : "practice") : button("Next", "position", i + 1, "primary")}</div>`;
}
function quizResult(k, i, good, hint) {
  let id = k + i;
  return state.answers[id]
    ? feed(good)
    : state.attempts[id]
      ? feed(hint, false)
      : "";
}
function choiceQuiz(k, i, q, opts) {
  return `<p class="stem">${esc(q)}</p>${opts.map((t, n) => button(t, "answerChoice", n, "choice")).join("")}`;
}
function numberQuiz(k) {
  const i = state.positions[k],
    item = QUESTIONS[k][i],
    id = k + i;
  let extra =
    k === "stories"
      ? `<div class="inset">Read it twice. Draw a bar on paper for each amount. What are you trying to find?</div>`
      : k === "preview"
        ? `<p class="hint">${i < 2 ? "Draw ones and tens on paper, circle each group of ten, and write the same trade beside your sum." : "Look for numbers that make a friendly ten."}</p>`
        : "";
  return (
    head(
      k === "preview" ? "Coming after break" : "Math practice",
      LESSONS[k][0],
      k === "stories"
        ? "Read the story, choose what to find, then draw or write your answer."
        : k === "preview"
          ? "First draw your trades, then try adding several numbers."
          : "Find a way to make ten or move through ten.",
    ) +
    `<section class="panel"><p class="eyebrow">${k === "preview" ? (i < 2 ? "Lessons 20–21 · Draw and write" : "Lesson 22 · Friendly pairs") : "Try it"}</p><p class="${k === "stories" ? "stem" : "bigsum"}">${esc(item[0])}</p>${extra}${k === "stories" ? goalChoices(i) : ""}<form data-quiz="number"><label class="field" for="mathAnswer">My answer</label><div class="mathline"><input type="text" id="mathAnswer" ${k === "stories" && state.storyGoals[i] !== GOALS[i].right ? "disabled" : ""} inputmode="numeric" maxlength="8" autocomplete="off" data-num="${id}" value="${esc(state.numberInputs[id] || "")}"><button class="primary" ${k === "stories" && state.storyGoals[i] !== GOALS[i].right ? "disabled" : ""} type="submit">Check answer</button></div></form>${quizResult(k, i, item[3], item[2])}<details><summary>Show a hint</summary><p>${item[2]}</p></details></section>${quizNav(k)}${k === "preview" ? goButton("Try the trade mat", "trade") : ""}`
  );
}
function trade() {
  const [h, t, o] = state.trade,
    done = t < 10 && o < 10;
  const info = done
    ? "You made 1 hundred, 2 tens, and 5 ones. That is 125!"
    : o < 10
      ? "You made a new ten. Can you trade ten tens for one hundred?"
      : t < 10
        ? "You made a new hundred. Can your ones make another ten?"
        : "Count the ones and tens. Trade ten small units for one larger unit.";
  let places = [
    [h, 100, "Hundreds"],
    [t, 10, "Tens"],
    [o, 1, "Ones"],
  ];
  return (
    head(
      "Math lab · Place value",
      "Trade ones and tens",
      "Combine the counters for 68 + 57. How many hundreds, tens, and ones will you have?",
    ) +
    `<section class="panel"><div class="split"><div><h3>My place-value mat</h3><div class="countergrid">${places.map(([n, value, label]) => `<div class="place"><b>${label} · ${n}</b><div class="disks" aria-label="${n} ${label}">${Array.from({ length: n }, () => `<span aria-hidden="true" class="disk d${value}">${value}</span>`).join("")}</div></div>`).join("")}</div><div class="btnrow">${button("Trade 10 ones", "trade", "ones", "", o < 10 ? "disabled" : "")}${button("Trade 10 tens", "trade", "tens", "", t < 10 ? "disabled" : "")}</div></div><div><h3>My written sum</h3><div class="vertical">  68\n+ 57\n────\n${done ? " 125" : o < 10 ? "  □5" : h === 1 ? " 1□□" : " □□□"}</div><p class="caption">${done ? "Write the 1 in hundreds, 2 in tens and 5 in ones." : o < 10 ? "Write 5 in the ones place. Your new ten goes in the tens column." : h === 1 ? "The new hundred goes in the hundreds column. Your ones can still make a ten." : "The boxes are the answer’s hundreds, tens and ones places."}</p><p class="caption">${h} hundred${h === 1 ? "" : "s"}, ${t} tens and ${o} ones</p></div></div>${feed(info)}<div class="btnrow">${button("Start the trade again", "resetTrade")}${goButton("Try a picnic problem", "stories", true)}</div></section>`
  );
}
function reading() {
  let k = "clue",
    i = state.positions[k],
    p = READINGS[i];
  return (
    head(
      "Reading & speaking",
      "Find a story clue",
      "Read the little passage. Choose a detail, then explain your thinking aloud.",
    ) +
    `<section class="panel plum"><h2>${p.title}</h2><p class="readText">${p.text}</p></section><section class="panel">${choiceQuiz(k, i, p.q, p.opts)}${quizResult(k, i, p.why, p.hint)}<p class="hint">Try saying, “I think this because the story says…”</p></section>${quizNav(k)}`
  );
}
function books() {
  return (
    head(
      "Reading aloud",
      "My reading time",
      "Choose a picture book or chapter book you enjoy. Read together for today’s short session. Enjoy up to 20 minutes when you have time.",
    ) +
    `<section class="panel plum"><h3>Choose a page to share</h3><ol><li>Read a few pages to yourself or with someone.</li><li>Retell something that happened. How did a character feel?</li><li>Point to a word or picture that helped you figure it out.</li></ol>${field("book", "Which book did you choose?", "The title is…")}${field("bookClue", "What clue did you find?", "I think … because the picture or words show …")}</section>${goButton("Try a short reading clue", "clue")}`
  );
}
function words() {
  const k = "words",
    i = state.positions.words,
    spell = state.wordMode === "spell",
    word = WORDS[i][0],
    g = GAMEWORDS[i],
    opts = i % 3 === 1 ? [g[2], g[3]] : [g[3], g[2]];
  const direction = spell
    ? `<p class="stem">${WORDS[i][3]}</p><p class="hint">Think of a word from the word bank that fits the blank.</p><form data-quiz="spelling"><label class="field" for="spellAnswer">Spell the missing word</label><div class="mathline"><input type="text" id="spellAnswer" data-spell="${i}" maxlength="30" autocomplete="off" autocapitalize="none" spellcheck="false" value="${esc(state.spells[i] || "")}"><button class="primary" type="submit">Check spelling</button></div></form>${state.spellAnswers[i] ? feed("You spelled " + word + " correctly. Read the sentence aloud.") : state.spellTries[i] ? feed("Try again. The word starts with " + word[0] + " and has " + word.length + " letters.", false) : ""}`
    : choiceQuiz(
        k,
        i,
        `Which word ${g[1] === "synonym" ? "means about the same as" : "means the opposite of"} “${g[0]}”?`,
        opts,
      ) +
      quizResult(
        k,
        i,
        `Yes. ${g[0]} and ${g[2]} are ${g[1]}s.`,
        `A ${g[1]} ${g[1] === "synonym" ? "has a similar meaning" : "has the opposite meaning"}. Say each choice aloud.`,
      );
  return (
    head(
      "Word workshop",
      "Play with words",
      "Use the ten words for the first week back. Try their meanings, then practice spelling.",
    ) +
    `<div class="tabs">${button("Word meanings", "wordMode", "meaning", !spell ? "on" : "", `aria-pressed="${!spell}"`)}${button("Spell it", "wordMode", "spell", spell ? "on" : "", `aria-pressed="${spell}"`)}</div><section class="panel"><p class="eyebrow">${spell ? "Spelling" : g[1]}</p>${direction}<details><summary>Open my word bank</summary><p>${WORDS.map((w) => w[0]).join(" · ")}</p></details></section>${quizNav(k)}`
  );
}
function memory() {
  return (
    head(
      "Writing & sharing",
      "My break memory",
      "Tell a true story about one small moment from your break.",
    ) +
    `<section class="panel plum"><h3>Start with a moment you remember clearly</h3><p>Who was there? What happened first? What did someone say? How did the moment end?</p>${field("memory", "My personal narrative", "One day during break…", true)}${field("firstSentence", "Pick one sentence from your story", "Copy your sentence here.")}${field("revisedSentence", "Give your sentence another try", "Check capitals and ending punctuation. Add one detail if you like.")}<p class="hint">Read it aloud. Start names with capital letters. Check your ending marks. If you wrote someone’s exact words, try quotation marks.</p></section>`
  );
}
function science() {
  let i = state.objects,
    selected = state.properties[i] || [];
  return (
    head(
      "Science · Properties of matter",
      "Test my materials",
      "Find a scrap of cardboard, a paper towel, and foil. Put them on a tray.",
    ) +
    `<section class="panel green"><h3>Which material works best for your scene?</h3><p>Predict first. Bend each scrap gently. Try one drop of water and watch what happens. Use scraps so your project stays dry.</p>${tabs(OBJECTS, i, "object")}<p class="stem">What did you notice about the ${OBJECTS[i].toLowerCase()}?</p><div class="chips">${PROPS.map((s, n) => button(s, "property", n, selected.includes(n) ? "on" : "", `aria-pressed="${selected.includes(n)}"`)).join("")}</div><details><summary>What do those words mean?</summary><p><b>Stiff</b> holds its shape. <b>Flexible</b> bends easily. <b>Absorbent</b> soaks up water. <b>Water-resistant</b> lets a drop sit on the surface for a while.</p></details>${field("science", "What will you use in your project, and why?", "I will use … for … because …")}${field("measure", "Try measuring two scraps with a ruler", "My scraps are … cm and … cm. The longer one is … cm longer.")}</section>${goButton("Back to my project", "studio")}`
  );
}
function historyLesson() {
  const k = "history",
    i = state.positions[k],
    o = HISTORY[i];
  return (
    head(
      "History · War of 1812",
      "Three history objects",
      "The United States and Britain fought a war that began in 1812. Look for clues to the past in three familiar objects.",
    ) +
    tabs(
      HISTORY.map((e) => e.title),
      i,
      "position",
    ) +
    `<section class="panel green"><span class="objects" aria-hidden="true">${o.icon}</span><h2>${o.title}</h2><p>${o.ask}</p><p class="readText">${o.text}</p></section><section class="panel">${choiceQuiz(k, i, o.q, o.opts)}${quizResult(k, i, o.why, o.hint)}</section>${quizNav(k)}${field("historyIdea", "What would you like to ask about one of these objects?", "I wonder…")}`
  );
}
