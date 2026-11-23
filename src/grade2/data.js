const STEPS = [
  "My sketch",
  "Story cards",
  "My plan",
  "Make it",
  "My paragraph",
  "Check & share",
];
const SCENES = [
  [
    "Meadow flowers",
    "Persephone picks flowers in a meadow. Her mother, Demeter, cares for the growing plants.",
  ],
  [
    "The Underworld",
    "Hades takes Persephone to the Underworld. Demeter searches for her daughter.",
  ],
  [
    "A quiet field",
    "Demeter misses Persephone. In the myth, the plants stop growing and the fields grow bare.",
  ],
  [
    "Together again",
    "Persephone has eaten pomegranate seeds. She will spend part of each year in each world. When she returns to Demeter, flowers bloom again.",
  ],
];
const CHECKS = [
  "I named the myth.",
  "I named the characters, including the gods or mythical beings.",
  "I told where the story happens.",
  "I told the important events in order.",
  "I explained what the myth says about nature or people.",
];
const MATERIALS = [
  "Poster board",
  "Shoebox",
  "Colored paper",
  "Glue or tape",
  "Crayons or markers",
  "Clay",
  "Cotton",
  "Leaves or flowers",
  "Red beads or paper seeds",
];
const QUESTIONS = {
  facts: [
    [
      "8 + 7",
      15,
      "Make ten first. Eight needs two. How much of the seven is left?",
      "8 + 2 + 5 = 15.",
    ],
    [
      "14 − 6",
      8,
      "Take away four to reach ten. How much more must you take away?",
      "14 − 4 − 2 = 8.",
    ],
    ["9 + 8", 17, "Move one from the eight over to the nine.", "10 + 7 = 17."],
    [
      "16 − 9",
      7,
      "Imagine taking away ten, then putting one back.",
      "16 − 10 + 1 = 7.",
    ],
  ],
  stories: [
    [
      "There are 18 rolls at the picnic. A friend brings 12 more. Then 9 are eaten. How many rolls are left?",
      21,
      "Draw 18 and 12 parts joining. After you find the total, cross out the 9 that were eaten.",
      "18 + 12 = 30. Then 30 − 9 = 21 rolls.",
    ],
    [
      "Mina has 24 paper leaves. She cuts out 17 more. How many paper leaves does she have now?",
      41,
      "Draw two parts of one whole. Trade ten ones if you need to.",
      "24 + 17 = 41 paper leaves.",
    ],
    [
      "There are 52 seeds. Mina uses 16 in a picture and gives 8 to a friend. How many does she keep?",
      28,
      "Two groups leave the pile. Try 52 minus 16 first, then take away 8.",
      "52 − 16 = 36. Then 36 − 8 = 28 seeds.",
    ],
    [
      "A strip of yellow paper is 34 cm long. A green strip is 19 cm long. How much longer is the yellow strip?",
      15,
      "Draw two strips starting at the same spot. What distance connects 19 and 34?",
      "19 + 1 + 14 = 34. The difference is 15 cm.",
    ],
  ],
  preview: [
    [
      "58 + 67",
      125,
      "8 ones and 7 ones make 15 ones. Trade ten for a ten. How many tens can you trade now?",
      "15 ones become 1 ten and 5 ones. 12 tens become 1 hundred and 2 tens. Total: 125.",
    ],
    [
      "76 + 48",
      124,
      "Add ones first. Then add the tens, including your new ten.",
      "6 + 8 makes 14 ones. 7 + 4 + 1 makes 12 tens. Total: 124.",
    ],
    [
      "35 + 25 + 42",
      102,
      "Which two numbers make a friendly ten?",
      "35 + 25 = 60. Then 60 + 42 = 102.",
    ],
    [
      "28 + 32 + 15 + 25",
      100,
      "Look for pairs with ones that make ten.",
      "28 + 32 = 60 and 15 + 25 = 40. Together they make 100.",
    ],
  ],
};
const READINGS = [
  {
    title: "The empty field",
    text: "Demeter walked past a field of dry stalks. She held a flower from Persephone’s meadow close to her heart. She called her daughter’s name, but only the wind answered.",
    q: "Which sentence shows Demeter keeping a reminder of her daughter?",
    opts: [
      "Demeter walked past a field of dry stalks.",
      "She held a flower from Persephone’s meadow close to her heart.",
      "She called her daughter’s name, but only the wind answered.",
    ],
    right: 1,
    hint: "Look for something Demeter does because she is thinking of Persephone.",
    why: "The flower reminds her of Persephone. Keeping it close gives us a clue to her feelings.",
  },
  {
    title: "A bridge for Beetle",
    text: "A beetle stopped beside a puddle. Mina laid a stiff leaf across the water. She watched until the beetle reached the grass on the other side.",
    q: "Which sentence shows that the bridge worked?",
    opts: [
      "A beetle stopped beside a puddle.",
      "Mina laid a stiff leaf across the water.",
      "She watched until the beetle reached the grass on the other side.",
    ],
    right: 2,
    hint: "Think about the job the leaf needed to do.",
    why: "The beetle needed a bridge. A stiff leaf could hold its shape across the puddle.",
  },
  {
    title: "The practice audience",
    text: "Kai wanted to tell the class about his model. First he showed it to his little brother. Next he practiced one sentence with Dad. The next day, he raised his hand.",
    q: "Which detail suggests that practice helped Kai feel ready?",
    opts: [
      "The next day, he raised his hand.",
      "First he showed it to his little brother.",
      "Kai wanted to tell the class about his model.",
    ],
    right: 0,
    hint: "What did Kai do at the end that he was preparing to do?",
    why: "Raising his hand shows that Kai was ready to share his idea.",
  },
];
const WORDS = [
  ["under", "beneath", "over", "The cat slept ___ the chair."],
  ["noise", "sound", "silence", "We heard a loud ___ in the yard."],
  ["open", "uncover", "close", "Please ___ the box so we can see inside."],
  [
    "brave",
    "courageous",
    "fearful",
    "She felt ___ enough to speak to the class.",
  ],
  ["cute", "adorable", null, "The fuzzy kitten looked ___."],
  ["minus", null, "plus", "Seven ___ two equals five."],
  ["last", "final", "first", "I read the ___ page of my book."],
  ["foe", "enemy", "friend", "In the story, the hero meets a ___."],
  [
    "robber",
    "thief",
    null,
    "The ___ took a bag that belonged to someone else.",
  ],
  ["road", "street", null, "We follow the ___ to school."],
];
const GAMEWORDS = [
  ["noise", "synonym", "sound", "quiet"],
  ["brave", "synonym", "courageous", "afraid"],
  ["under", "antonym", "over", "beneath"],
  ["open", "antonym", "close", "unlock"],
  ["cute", "synonym", "adorable", "angry"],
  ["minus", "antonym", "plus", "subtract"],
  ["last", "antonym", "first", "final"],
  ["foe", "antonym", "friend", "enemy"],
  ["robber", "synonym", "thief", "helper"],
  ["road", "synonym", "street", "river"],
];
const HISTORY = [
  {
    title: "A picture frame",
    icon: "🖼️",
    ask: "Look at a framed picture. Why might someone save it for people in the future?",
    text: "During the War of 1812, fighting reached Washington in 1814. Before she left the President’s House, Dolley Madison helped make sure a large portrait of George Washington was taken to safety. Other people helped carry it away.",
    q: "What did the people save?",
    opts: [
      "A portrait of George Washington",
      "A model of a ship",
      "A new American flag",
    ],
    right: 0,
    hint: "Look for the thing that could hang inside a picture frame.",
    why: "They saved a portrait, a picture of a person.",
  },
  {
    title: "A piece of wood",
    icon: "🪵",
    ask: "Tap a wooden table. What makes wood useful for building something strong?",
    text: "USS Constitution was a sailing ship with a thick wooden hull. The hull is the body of a ship. During the War of 1812 people nicknamed this American ship Old Ironsides.",
    q: "What material was the hull of Old Ironsides made of?",
    opts: ["Iron", "Glass", "Wood"],
    right: 2,
    hint: "A nickname can describe how strong something seems.",
    why: "Its strong wooden hull helped give the ship its nickname.",
  },
  {
    title: "A piece of cloth",
    icon: "🧵",
    ask: "Hold the corner of a cloth. What happens when a breeze catches it?",
    text: "In 1814 a large American flag flew over Fort McHenry in Baltimore. Francis Scott Key saw the flag after a night of fighting. He wrote words about what he saw. Those words later became the national anthem, The Star-Spangled Banner.",
    q: "What inspired Key to write?",
    opts: [
      "A sailing lesson",
      "Seeing the flag still flying",
      "A piece of wood",
    ],
    right: 1,
    hint: "Imagine looking toward the fort the next morning.",
    why: "The sight of the flag inspired Key’s words.",
  },
];
const LESSONS = {
  trade: ["Trade ones and tens", "Math lab", "🧮"],
  facts: ["Make a ten", "Mental math", "✦"],
  stories: ["Picnic story problems", "Read, draw, write", "✎"],
  preview: ["Next week’s math", "Module 4 · Lessons 20–22", "▦"],
  clue: ["Find a story clue", "Reading & speaking", "📖"],
  books: ["My reading time", "Reading aloud", "☘"],
  words: ["Play with words", "Spelling & word meanings", "Aa"],
  memory: ["My break memory", "Personal narrative", "✎"],
  matter: ["Test my materials", "Properties of matter", "✂"],
  history: ["Three history objects", "The War of 1812", "⚓"],
};
const ROUTES = [
  "home",
  "studio",
  "practice",
  "explore",
  "family",
  "checks",
  "review",
  ...Object.keys(LESSONS),
];
