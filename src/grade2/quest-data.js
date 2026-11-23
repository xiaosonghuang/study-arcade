const DAYS = [
  {
    day: "Mon",
    date: "Nov 23",
    title: "Step into the meadow",
    step: 0,
    task: "Study the meadow and put the myth’s four scenes in order.",
    math: "facts",
    english: "clue",
  },
  {
    day: "Tue",
    date: "Nov 24",
    title: "Design your scene",
    step: 2,
    task: "Choose a poster or diorama. Sketch Earth and the Underworld and gather your materials.",
    math: "trade",
    english: "words",
  },
  {
    day: "Wed",
    date: "Nov 25",
    title: "Bring your scene to life",
    step: 3,
    task: "Build the setting. Add the characters and one clue that shows the season.",
    math: "stories",
    english: "clue",
  },
  { day: "Thu", date: "Nov 26", title: "Enjoy Thanksgiving", step: null },
  {
    day: "Fri",
    date: "Nov 27",
    title: "Write in your own words",
    step: 4,
    task: "Tell the myth to someone, then write the paragraph the way you told it.",
    math: "preview",
    english: "books",
  },
  {
    day: "Sat–Sun",
    date: "Nov 28–29",
    title: "Finish and share",
    step: 5,
    task: "Check your visual against the paragraph and rehearse with someone. Choose either day.",
    math: "checks",
    english: "memory",
  },
  {
    day: "Mon",
    date: "Nov 30",
    title: "Pack for Tuesday",
    step: 5,
    task: "Read the five checks. Pack the paragraph and your poster or diorama together.",
  },
];
const GOALS = [
  {
    q: ["Rolls at the beginning", "Rolls left after the picnic", "Rolls eaten"],
    right: 1,
    hint: "Look at the final question. You need the amount left after both changes.",
  },
  {
    q: [
      "All the leaves now",
      "Only the leaves she cut out",
      "Leaves on one tree",
    ],
    right: 0,
    hint: "The question asks for the new total.",
  },
  {
    q: ["Seeds she gives away", "Seeds in her picture", "Seeds she keeps"],
    right: 2,
    hint: "Find what remains after both groups are taken away.",
  },
  {
    q: [
      "Length of both strips together",
      "Difference between the lengths",
      "Length of the yellow strip",
    ],
    right: 1,
    hint: "“How much longer” asks for a difference.",
  },
];
const STAMPS = [
  { title: "The flower picker", scene: 0, position: "50% 55%" },
  { title: "A lantern underground", scene: 1, position: "15% 45%" },
  { title: "A pathway home", scene: 1, position: "70% 60%" },
  { title: "Demeter’s quiet field", scene: 2, position: "50% 55%" },
  { title: "The pomegranate", scene: 3, position: "92% 92%" },
  { title: "Spring returns", scene: 3, position: "45% 35%" },
];
const SKILLS = {
  fluency: "Make a ten",
  stories: "Follow a two-step story",
  regroup: "Trade ones and tens",
  pairs: "Find friendly pairs",
  clue: "Find a clue in a passage",
  meaning: "Word meanings",
  spelling: "Spelling",
  editing: "Capitals and punctuation",
};
// Each item has one answer and a reason that also works when the learner guessed correctly.
function item(skill, prompt, choices, right, why, passage = "") {
  return { skill, prompt, choices, right, why, passage };
}
const ROUNDS = [
  [
    item(
      "fluency",
      "What is 8 + 6?",
      ["12", "13", "14"],
      2,
      "Give 2 from the 6 to the 8. Ten plus the remaining 4 is 14.",
    ),
    item(
      "clue",
      "Which sentence shows that the painter wants to protect her work?",
      [
        "The table is near a window.",
        "Nia covers the wet painting before the rain begins.",
        "She has two brushes.",
      ],
      1,
      "Covering the painting before the rain starts protects it from water.",
      "The table is near a window. Nia covers the wet painting before the rain begins. She has two brushes.",
    ),
    item(
      "stories",
      "There are 26 apples. Add 14, then use 8 in a pie. How many are left?",
      ["32", "40", "48"],
      0,
      "First 26 + 14 = 40. Then take away the 8 used in the pie. 40 − 8 = 32.",
    ),
    item(
      "meaning",
      "Which word means the opposite of brave?",
      ["fearful", "bold", "courageous"],
      0,
      "A person who feels fearful is afraid. Bold and courageous are close in meaning to brave.",
    ),
    item(
      "regroup",
      "57 + 68 makes 15 ones. What does the finished answer look like?",
      [
        "1 hundred, 1 ten, 5 ones",
        "1 hundred, 2 tens, 5 ones",
        "12 hundreds, 5 ones",
      ],
      1,
      "Trade 10 of the 15 ones for a ten. The 12 tens become 1 hundred and 2 tens. The total is 125.",
    ),
    item(
      "spelling",
      "Choose the spelling that completes the sentence: We heard a loud ___.",
      ["noize", "nois", "noise"],
      2,
      "Noise is spelled n-o-i-s-e. It means a sound.",
    ),
  ],
  [
    item(
      "pairs",
      "Find a friendly pair in 27 + 33 + 18 + 22. What is the total?",
      ["90", "100", "110"],
      1,
      "27 + 33 = 60 and 18 + 22 = 40. The two pairs make 100.",
    ),
    item(
      "clue",
      "Which sentence shows why Jay changes his model?",
      [
        "Jay builds a fence from paper.",
        "He has a box of pencils.",
        "The paper bends when he tries to stand it up.",
      ],
      2,
      "The bending paper is the problem. That detail explains why he chooses stiffer card.",
      "Jay builds a fence from paper. The paper bends when he tries to stand it up. He tries stiffer card. He has a box of pencils.",
    ),
    item(
      "stories",
      "A class made 32 stars on Monday and 18 on Tuesday. They hung 21. How many still need to be hung?",
      ["29", "50", "71"],
      0,
      "32 + 18 = 50 stars made. 50 − 21 = 29 stars still to hang.",
    ),
    item(
      "editing",
      "Which sentence is ready for a story?",
      [
        "on Friday, Mina drew a fox.",
        "On Friday, Mina drew a fox.",
        "On friday, Mina drew a fox",
      ],
      1,
      "A sentence, a day, and a name begin with capitals. A statement ends with a period.",
    ),
    item(
      "regroup",
      "What is 86 + 46?",
      ["122", "142", "132"],
      2,
      "6 + 6 makes 12 ones. Trade for a ten and 2 ones. Then 8 + 4 + 1 makes 13 tens, so the total is 132.",
    ),
    item(
      "meaning",
      "In a story, a foe is someone’s ___.",
      ["helper", "enemy", "friend"],
      1,
      "Foe means enemy. Friend is an opposite.",
    ),
  ],
];
const FRESH = {
  fluency: [
    item(
      "fluency",
      "Try 7 + 8. Which sum is the same?",
      ["10 + 5", "10 + 7", "10 + 3"],
      0,
      "Move 3 from the 8 to the 7. You have 10 + 5.",
    ),
    item(
      "fluency",
      "What is 15 − 7?",
      ["7", "8", "9"],
      1,
      "Take 5 away to reach 10, then 2 more. You land on 8.",
    ),
  ],
  stories: [
    item(
      "stories",
      "Mira had 28 beads, found 12 more, then used 9. How many beads remain?",
      ["40", "49", "31"],
      2,
      "28 + 12 = 40, then 40 − 9 = 31.",
    ),
    item(
      "stories",
      "There are 34 paper buds. Draw 16 more, then color 23. How many still need color?",
      ["27", "50", "73"],
      0,
      "34 + 16 = 50, then 50 − 23 = 27.",
    ),
  ],
  regroup: [
    item(
      "regroup",
      "What happens when you add 74 + 58?",
      [
        "12 tens stay 12 ones",
        "12 ones trade to 1 ten and 2 ones",
        "12 ones trade to 2 tens",
      ],
      1,
      "4 + 8 gives 12 ones. The new ten joins 7 and 5 tens. The total is 132.",
    ),
    item(
      "regroup",
      "What is 67 + 55?",
      ["112", "121", "122"],
      2,
      "7 + 5 makes 12 ones. Trade for 1 ten. 6 + 5 + 1 = 12 tens. Total: 122.",
    ),
  ],
  pairs: [
    item(
      "pairs",
      "What is 24 + 36 + 15 + 25?",
      ["90", "100", "110"],
      1,
      "24 + 36 = 60, and 15 + 25 = 40. Together they make 100.",
    ),
    item(
      "pairs",
      "Can you add 48 + 12 + 37 quickly?",
      ["97", "87", "107"],
      0,
      "48 and 12 make 60. Add 37 to get 97.",
    ),
  ],
  clue: [
    item(
      "clue",
      "Which detail tells you why Bo ties the stem?",
      ["The pot is red.", "The stem droops.", "Bo counts two leaves."],
      1,
      "A drooping stem needs support. The stick gives the stem something to lean on.",
      "The pot is red. The stem droops. Bo ties it to a stick. Bo counts two leaves.",
    ),
    item(
      "clue",
      "Which detail shows that Jo has been practicing?",
      [
        "Jo owns a map.",
        "A bird flies past.",
        "Today she tells the whole story without peeking.",
      ],
      2,
      "Telling the story without looking shows that Jo remembers the sequence.",
      "Jo owns a map. She used to peek at it to tell her story. Today she tells the whole story without peeking. A bird flies past.",
    ),
  ],
  meaning: [
    item(
      "meaning",
      "A little path goes beneath a bridge. Which word can replace beneath?",
      ["over", "under", "beside"],
      1,
      "Under and beneath both mean lower than something else.",
    ),
    item(
      "meaning",
      "Which word means the opposite of last?",
      ["first", "final", "late"],
      0,
      "First comes at the beginning. Last comes at the end.",
    ),
  ],
  spelling: [
    item(
      "spelling",
      "Which word belongs here? We walked down the ___.",
      ["roed", "rode", "road"],
      2,
      "Road is a path for travel. Rode tells about a ride in the past.",
    ),
    item(
      "spelling",
      "Choose the word for a sweet-looking kitten.",
      ["cuet", "cute", "coot"],
      1,
      "Cute is spelled c-u-t-e. The final e helps the u say its name.",
    ),
  ],
  editing: [
    item(
      "editing",
      "Which sentence asks the question clearly?",
      ["Where did Maya go?", "where did Maya go.", "Where did maya go"],
      0,
      "Begin the sentence and the name with capitals. A question ends with a question mark.",
    ),
    item(
      "editing",
      "Which sentence is ready to share?",
      ["sam built a house.", "Sam built a house", "Sam built a house."],
      2,
      "The name Sam begins with a capital. A statement ends with a period.",
    ),
  ],
};
