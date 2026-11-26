const BOX_STEPS = [
  [
    "Turn the box into a stage",
    "Lay the box on one long side, with the open side facing you. The bottom of the box is now the back wall. Put your meadow sketch behind the figures. You could use a copy or draw a new meadow on scrap paper.",
  ],
  [
    "Make a figure stand up",
    "Draw Persephone on a strip of paper or thin card. Leave a little extra paper below her feet. Fold that strip backward like the foot of an L. Tape the foot to the floor of the box and see if she stands.",
  ],
  [
    "Show one change",
    "What happens to the same meadow when Persephone is away? Try a bare plant and a blooming plant side by side, or draw them on the two sides of a card you can turn. Where will Demeter stand?",
  ],
  [
    "Tell the story with your box",
    "Point to the meadow, move or point to Persephone, then show the change in the plants. Ask a listener what changed and why. Add your title where they can see it. Write your own paragraph to go with the box.",
  ],
];
function familyHandout(key) {
  const photo = familyPack?.handout?.[key];
  if (!photo) return "";
  const examples = key === "examples",
    label = examples
      ? "See the teacher’s project examples"
      : "See the teacher’s directions";
  const alt = examples
    ? "The class handout shows shoebox scenes and posters that use picture panels."
    : "The class sheet lists a poster or diorama, a written paragraph, five things to include, and the December 1 due date.";
  return (
    '<details class="handoutPhoto"><summary>' +
    label +
    '</summary><figure><img loading="lazy" src="' +
    photo +
    '" alt="' +
    alt +
    '"><figcaption>' +
    (examples
      ? "Find the figures in the shoebox. What do you notice behind them?"
      : "Read the five paragraph checks with a grown-up.") +
    "</figcaption></figure></details>"
  );
}
function projectLabel(s) {
  return s.format === "Diorama" && s.meadowIdea
    ? "Shoebox diorama · " + s.meadowIdea
    : s.format || "Poster or diorama";
}
function chooseMeadowIdea() {
  const chips = Object.keys(MEADOW_IDEAS)
    .map((key) =>
      button(
        key,
        "meadowIdea",
        key,
        state.meadowIdea === key ? "on" : "",
        'aria-pressed="' + (state.meadowIdea === key) + '"',
      ),
    )
    .join("");
  return (
    '<section class="panel"><h2>How will my meadow change?</h2><p>Pick an idea to try with paper scraps. You can change your mind.</p><div class="chips">' +
    chips +
    "</div>" +
    (state.meadowIdea
      ? '<p class="inset" role="status">' +
        esc(MEADOW_IDEAS[state.meadowIdea]) +
        "</p>"
      : "") +
    field(
      "scene",
      "My own plan",
      "When Persephone comes back, my meadow will…",
    ) +
    "</section>"
  );
}
function shoeboxRoom() {
  const diagrams = [
    "Turn the opening toward you",
    "Put the meadow behind the figures",
    "Fold a paper foot and tape it down",
  ]
    .map(
      (label, i) =>
        '<figure><img src="' +
        BOX_ART[i] +
        '" alt=""><figcaption>' +
        label +
        "</figcaption></figure>",
    )
    .join("");
  const steps = BOX_STEPS.map(
    ([title, body], i) =>
      "<li><h3>" + esc(title) + "</h3><p>" + esc(body) + "</p></li>",
  ).join("");
  return (
    head(
      "Project studio · Due December 1",
      "My shoebox diorama",
      "A diorama is a little scene you build inside a box. Someone looking in through the open side can see where your story happens.",
    ) +
    '<section class="panel"><div class="split"><figure><img class="studioPic" src="' +
    (familyPack?.sketch || ART[0]) +
    '" alt="' +
    (familyPack ? "Your meadow sketch" : "Persephone in a flowering meadow") +
    '"><figcaption class="caption">' +
    (familyPack
      ? "Your meadow can become the back wall."
      : "Start with a meadow you draw yourself.") +
    "</figcaption></figure><div><h2>Before you glue</h2><p>Find a shoebox, scrap paper or thin card, crayons, and tape or glue. Rest a picture against the back and stand a folded scrap in front. Look into the box at eye level. Can you see both?</p><p><b>My first decision</b> · Which moment do I want someone to see first?</p></div></div>" +
    familyHandout("examples") +
    "</section>" +
    chooseMeadowIdea() +
    '<section class="panel"><h2>Build it at your table</h2><div class="boxDiagrams">' +
    diagrams +
    '</div><ol class="boxSteps">' +
    steps +
    "</ol></section>" +
    '<section class="panel green"><h2>A job for each of you</h2><p><b>Grown-up</b> · Steady the box, cut thick cardboard if needed, and help tape the first folded foot.</p><p><b>Storyteller</b> · Choose the scene, draw the characters, place them, and tell the story. Ask your listener, “What did you see change in my meadow?”</p></section>' +
    '<section class="panel"><h2>From my box to my paragraph</h2><p>Say the title. Point to the characters and the setting. Tell what happens in order. Finish by explaining why the seasons change <em>in this myth</em>.</p>' +
    familyHandout("directions") +
    '<div class="btnrow">' +
    button("Use my shoebox plan", "useShoebox", "", "primary") +
    button("Write my paragraph", "openStep", 4) +
    "</div></section>"
  );
}
function projectHint() {
  if (state.format === "Diorama")
    return (
      '<div class="inset"><b>My shoebox scene</b><p>Stand the box on its long side. Look through the open front. What belongs on the back wall, and who will stand out in front?</p>' +
      goButton("Open my shoebox build guide", "shoebox", true) +
      "</div>"
    );
  if (state.format === "Poster")
    return '<p class="inset">You could draw two views of your meadow, or tell the events in comic panels. Which layout will help a reader see what changes?</p>';
  return (
    "<p>Try a two-scene poster, a comic-strip poster, or a shoebox scene. Which idea helps you show the biggest change in the story?</p>" +
    goButton("Look inside a shoebox diorama", "shoebox")
  );
}
