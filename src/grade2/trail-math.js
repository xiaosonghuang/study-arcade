// Each guided and independent problem has its own feedback for each choice.
const TRAIL_MATH = {
  mental: {
    title: "Catch a friendly ten",
    teaser: "Slide a few fireflies between jars to make a sum easier to see.",
    why: "Ten is easy to add in your head. You can move some from one group to another and still have the same total.",
    example: {
      prompt:
        "A jar holds 8 fireflies. Another holds 7. How many glow altogether?",
      steps: [
        "Picture two full hands. The 8 jar needs 2 more to reach 10.",
        "Split the 7 into 2 and 5. Imagine the 2 flying into the first jar. The jars now hold 10 and 5.",
        "Add 10 + 5 to get 15. Check by counting on seven hops from 8. You land on 15 again.",
      ],
      takeaway:
        "Ask how far the first number is from ten. Take just that many from the other number.",
    },
    guide: [
      {
        prompt:
          "A pond has 9 frogs on one log and 6 on another. One frog hops from the 6-log to the 9-log. What sum can you use now?",
        choices: ["10 + 6", "10 + 5", "9 + 5"],
        correct: 1,
        hint: "When one log gains a frog, the other log loses one.",
        explain: "The logs now hold 10 and 5. All 15 frogs are still there.",
        miss: [
          "The first log gained one, so the six-frog log must lose one too.",
          "",
          "The second log lost one. Add that frog to the first log.",
        ],
      },
      {
        prompt:
          "There are 7 blue beads and 5 gold beads. Slide enough gold beads beside the blue ones to make a group of 10. How many gold beads stay behind?",
        choices: ["3", "5", "2"],
        correct: 2,
        hint: "Count from 7 up to 10, then take that many out of 5.",
        explain:
          "You slide 3 gold beads to fill the group. Two gold beads stay behind, so the total is 12.",
        miss: [
          "Three is the number that slides over. How many stay out of the five?",
          "Five gold beads started there. Three slide into the group of ten.",
          "",
        ],
      },
    ],
    solo: [
      {
        prompt:
          "An artist has 8 red buttons and 6 green buttons. Which sum uses the same buttons in a group of ten and some extras?",
        choices: ["10 + 2", "10 + 6", "10 + 4"],
        correct: 2,
        hint: "Move 2 of the 6 green buttons next to the 8 red ones.",
        explain: "Move 2, leave 4. Both 8 + 6 and 10 + 4 make 14.",
        miss: [
          "Two is what you move. The extras are the green buttons left behind.",
          "Six was the whole green group. Two of those are already in the ten.",
          "",
        ],
      },
      {
        prompt:
          "A cave has 9 bats near the door and 8 farther in. How many bats are there?",
        choices: ["17", "18", "16"],
        correct: 0,
        hint: "Make the 9 a 10 using one of the 8 bats.",
        explain: "9 + 8 becomes 10 + 7. That makes 17 bats.",
        miss: [
          "",
          "10 + 8 would add an extra bat. One of the eight went into the ten.",
          "After one of the eight moves, seven stay behind. Check 10 + 7.",
        ],
      },
      {
        prompt:
          "A rover picked up 19 pebbles, then 6 more. Which quick count shows its total?",
        choices: ["20 + 6 = 26", "20 + 5 = 25", "20 + 4 = 24"],
        correct: 1,
        hint: "Nineteen needs just one pebble to reach 20.",
        explain: "Split the 6 into 1 and 5. Add 19 + 1 + 5 to get 25.",
        miss: [
          "One of the six already helped 19 reach 20. How many are left?",
          "",
          "Only one of the six moved to make 20. Count how many remain.",
        ],
      },
      {
        prompt:
          "A baker has 28 little stars and adds 7. What can she count after she makes 30?",
        choices: ["30 + 7", "30 + 3", "30 + 5"],
        correct: 2,
        hint: "Twenty-eight needs 2 stars to reach 30. Split 7 into 2 and something.",
        explain:
          "Two of the seven fill the gap to 30. Five stay left, so 28 + 7 = 35.",
        miss: [
          "Two of those seven are already in the thirty.",
          "Seven split into 2 and 3 would give only five stars. Check the split.",
          "",
        ],
      },
    ],
    stretch: {
      prompt:
        "A moth keeper has two jars with 16 moths in all. Each jar must hold at least one. How many different pairs can you draw? Swapping the jars counts as the same pair.",
      hints: [
        "Start with 1 and 15. Move one moth at a time from the fuller jar.",
        "Stop when the jars match. What happens to the pairs after that?",
      ],
      discuss:
        "There are eight pairs, from 1 + 15 up to 8 + 8. A one-moth move keeps the total at 16. After 8 + 8 the pairs begin to repeat in reverse.",
    },
    preview: {
      prompt:
        "A moon garden has 3 rows of 6 lamps. Can you find the total with a double, then find it another way by turning the garden?",
      hints: [
        "Two rows of 6 make 12. Add the last row.",
        "Turn your drawing so that each new row contains 3 lamps.",
      ],
      discuss:
        "6 + 6 + 6 makes 18. When the page turns there are 6 rows of 3. Both arrangements count the same 18 lamps. This is an array.",
    },
  },
  trade: {
    title: "Trade ten for one",
    teaser: "Build a big sum with bundles, then hunt for secret number pairs.",
    why: "Ten single sticks can become one bundle of ten. The amount stays the same, even when your drawing looks different.",
    example: {
      prompt:
        "The craft cart has 68 blue sticks and 57 gold sticks. How many sticks are there?",
      steps: [
        "Draw 68 as 6 bundles of ten and 8 singles. Draw 57 as 5 bundles and 7 singles.",
        "The singles make 8 + 7 = 15. Circle 10 singles to make one NEW bundle. Leave 5 singles out.",
        "Count the bundles. Six blue bundles + five gold bundles + one new bundle = 12 tens. That is 120. Add the 5 singles to get 125.",
        "Check a second way. Move 2 from 57 to 68 to make 70 + 55. That is also 125.",
      ],
      takeaway:
        "A new bundle belongs with the tens. If you trade ten bundles for a hundred, 12 tens and 5 ones become 1 hundred, 2 tens and 5 ones.",
    },
    guide: [
      {
        prompt:
          "The shell museum receives 36 shells and 27 shells. The singles make 6 + 7 = 13. What should the keeper do with those 13?",
        choices: [
          "Keep 1 single and make 3 tens.",
          "Keep 3 singles and make 1 ten.",
          "Keep 3 singles and add no ten.",
        ],
        correct: 1,
        hint: "Circle a group of ten inside the thirteen. Count what sits outside the circle.",
        explain:
          "Thirteen is one ten and three ones. The total is 3 + 2 + 1 tens and 3 ones, or 63.",
        miss: [
          "Three tens would take thirty singles. How many groups of ten fit in thirteen?",
          "",
          "Ten singles went inside your circle. Count them as a new ten.",
        ],
      },
      {
        prompt:
          "Add 47 + 38. The ones give you 15, so you make a new ten. How many tens do you have now?",
        choices: ["7 tens", "9 tens", "8 tens"],
        correct: 2,
        hint: "Count 4 original tens, 3 original tens, and 1 ten made from singles.",
        explain:
          "4 + 3 + 1 makes 8 tens. Five singles remain, so the sum is 85.",
        miss: [
          "Seven counts both original groups of tens. Add the newly made ten too.",
          "Fifteen singles make only one new ten. Try 4 + 3 + 1.",
          "",
        ],
      },
    ],
    solo: [
      {
        prompt:
          "An owl lists 46 treasures on Monday and 28 on Tuesday. How many are on its two lists altogether?",
        choices: ["64", "74", "84"],
        correct: 1,
        hint: "Six ones plus eight ones make fourteen. Trade ten of them.",
        explain:
          "Four tens + two tens + the new ten = seven tens. Four ones remain, so the total is 74.",
        miss: [
          "That counts the original tens and the leftover ones. Count the new ten as well.",
          "",
          "Fourteen ones make one new ten. Count 4 + 2 + 1 tens.",
        ],
      },
      {
        prompt:
          "Which sum has the same total as 59 + 36 and makes the first number a whole ten?",
        choices: ["60 + 35", "60 + 36", "60 + 37"],
        correct: 0,
        hint: "Where can 59 get the one it needs?",
        explain: "Shift one from 36 to 59. Now 60 + 35 = 95.",
        miss: [
          "",
          "The first group gained one. The second must give it up.",
          "If both groups gain one, the total grows by two. Move the same one across.",
        ],
      },
      {
        prompt:
          "A fossil tray has 58 shell fossils and 47 leaf fossils. How many fossils?",
        choices: ["95", "115", "105"],
        correct: 2,
        hint: "Eight ones plus seven ones make fifteen. Add the new ten to 5 tens and 4 tens.",
        explain:
          "The tens make 5 + 4 + 1 = 10 tens, or 100. Five ones make the total 105.",
        miss: [
          "Nine tens came with the original groups. Count the bundle made from fifteen ones.",
          "Fifteen ones make one new ten. Check 5 + 4 + 1.",
          "",
        ],
      },
      {
        prompt: "A puppet says 67 + 26 = 83. Which clue fixes its answer?",
        choices: [
          "Add 3 more because there are 3 ones.",
          "Count the new ten from 7 + 6. The sum is 93.",
          "Swap 67 and 26. The sum will change.",
        ],
        correct: 1,
        hint: "Seven plus six gives thirteen ones. What else do you have besides three leftover ones?",
        explain:
          "Six tens + two tens + one new ten = nine tens. Add three ones to get 93.",
        miss: [
          "The 3 leftover ones are already in 83. Look for a whole bundle.",
          "",
          "Swapping the groups keeps their total. Look at the ten made by 7 + 6.",
        ],
      },
    ],
    stretch: {
      prompt:
        "A code lock opens for two different two-digit numbers that add to 125. Find three codes. Then try to find EVERY code, counting a reversed pair only once.",
      hints: [
        "The larger number can be at most 99. What must go with 99?",
        "Start at 26 + 99. Add 1 on the left and take 1 on the right each turn. Stop before the pair reverses.",
      ],
      discuss:
        "26 + 99, 27 + 98 and 28 + 97 begin the list. The last pair is 62 + 63. There are 37 pairs because the smaller number takes every value from 26 to 62.",
    },
    preview: {
      prompt:
        "A bead maker puts 125 beads into bags of 10. How many bags can she fill? Can she put the same beads into groups of 5 with none left?",
      hints: [
        "Sketch twelve tens and five singles.",
        "Split every full ten into two fives. Check the five singles.",
      ],
      discuss:
        "She fills 12 bags of ten with 5 left. Each ten becomes 2 groups of five, so 12 tens give 24 fives. The extra 5 makes a 25th group.",
    },
  },
  stories: {
    title: "Solve the missing part",
    teaser:
      "Draw what happened in a tiny mystery before choosing a calculation.",
    why: "A story can hide a starting amount, a change, or an ending amount. A picture shows which number is missing.",
    example: {
      prompt:
        "A fox tucked some acorns in a box. A jay added 8. Now there are 23. How many did the fox put in first?",
      steps: [
        "Draw a long box for all 23 acorns. Mark the jay’s 8 at one end. The rest is the fox’s mystery part.",
        "Write □ + 8 = 23. Count up from 8 to 23. From 8 to 10 is 2, and from 10 to 23 is 13. The two jumps total 15.",
        "Put 15 back into the story. Fifteen fox acorns plus eight jay acorns make 23. The fox started with 15.",
      ],
      takeaway:
        "Name the missing part before you calculate. Read the story again with your number in the blank.",
    },
    guide: [
      {
        prompt:
          "A detective finds 14 tracks. Some more appear. Then she sees 22. Which number sentence fits?",
        choices: ["14 + □ = 22", "14 + 22 = □", "22 + □ = 14"],
        correct: 0,
        hint: "The 14 tracks were already there. The new tracks joined them to make 22.",
        explain:
          "The missing number is the change. Eight new tracks bring 14 up to 22.",
        miss: [
          "",
          "Twenty-two already includes those first fourteen tracks. Draw one box around the total.",
          "New tracks increased the count. Start with the smaller count of fourteen.",
        ],
      },
      {
        prompt:
          "A robot starts with some gears. It gives 6 away and has 17 left. What did it start with?",
        choices: ["11 gears", "17 gears", "23 gears"],
        correct: 2,
        hint: "Put the six gears back next to the seventeen that stayed.",
        explain:
          "The robot started with 17 + 6 = 23. Check the story by taking 6 from 23.",
        miss: [
          "Taking 6 from 17 removes the gears twice. Put the 6 back to rewind the story.",
          "Seventeen tells the ending amount. The robot had more before it gave gears away.",
          "",
        ],
      },
    ],
    solo: [
      {
        prompt:
          "A train has 18 passengers. Seven more get on. How many are aboard now?",
        choices: ["11", "25", "24"],
        correct: 1,
        hint: "Picture all 18 still seated and 7 new people beside them.",
        explain: "18 + 7 = 25. Count two to 20 and five more to 25.",
        miss: [
          "Subtracting would fit people getting off. These seven join the group.",
          "",
          "Split 7 into 2 and 5. After reaching 20, add all 5.",
        ],
      },
      {
        prompt:
          "A bookshelf holds 32 books. Twelve are poems. The rest are stories. How many are stories?",
        choices: ["20", "44", "12"],
        correct: 0,
        hint: "The 32 books include the 12 poetry books. Cover those 12 in your drawing.",
        explain:
          "32 − 12 = 20 storybooks. Twenty storybooks and twelve poetry books fill the shelf.",
        miss: [
          "",
          "Adding counts the poems a second time. Look for the part left after covering the poems.",
          "Twelve counts the poetry books. The question asks for the other part.",
        ],
      },
      {
        prompt:
          "A green tower is 27 cubes tall. A purple tower is 19 cubes tall. How many cubes taller is the green tower?",
        choices: ["46", "7", "8"],
        correct: 2,
        hint: "Line up the towers at their bases. Count from 19 up to 27.",
        explain:
          "One cube takes 19 to 20 and seven more reach 27. The difference is 8 cubes.",
        miss: [
          "Forty-six counts every cube in both towers. Look just at the extra green part.",
          "Seven counts from 20 to 27. Include the cube that takes 19 to 20.",
          "",
        ],
      },
      {
        prompt:
          "Some stickers are in an envelope. After 9 are taken out, 16 remain. How many stickers were inside at first?",
        choices: ["7", "25", "26"],
        correct: 1,
        hint: "Rewind the story by putting the 9 stickers back.",
        explain:
          "16 + 9 = 25. Check by taking the nine from 25 and leaving sixteen.",
        miss: [
          "Nine have already been taken. Taking nine away again tells a different story.",
          "",
          "Sixteen plus ten is 26. You are putting back just nine.",
        ],
      },
    ],
    stretch: {
      prompt:
        "Write two tiny mysteries that both use 14 and 22. Make the answer to one mystery 8 and the answer to the other 36. Give them to a detective to solve.",
      hints: [
        "Use 22 as the whole for one mystery. What could 14 count?",
        "For the next mystery, let 22 and 14 count two separate groups that join.",
      ],
      discuss:
        "One example is 22 footprints with 14 made by ducks, leaving 8 other tracks. Another is a path with 22 duck prints and 14 fox prints, making 36 prints. Explain what 22 means in each story.",
    },
    preview: {
      prompt:
        "Four lunch tables each need 3 cups. There are already 5 cups on the cart. How many MORE cups are needed? Can you make a picture and a two-step number sentence?",
      hints: [
        "Draw four circles and place three dots in each.",
        "Count all the cups needed first. Cross off five you already have.",
      ],
      discuss:
        "Four equal groups of three need 12 cups. Five are ready, so 12 − 5 = 7 more. You used an equal-groups problem and a missing-part problem in one story.",
    },
  },
  science: {
    title: "Run a tiny materials lab",
    teaser:
      "Choose a roof for a toy shelter and design a fair test to find out what works.",
    why: "A material has properties you can observe, such as being bendy or letting water pass. A fair test changes one thing so your result helps answer your question.",
    example: {
      prompt:
        "A paper rabbit needs a little rain roof. Would a paper towel or a piece of foil keep the floor dry?",
      steps: [
        "Predict first. A paper towel soaks up water. Foil usually lets drops sit on top. Which property does the roof need?",
        "Cover two matching cups with equal-size pieces. Give each roof five same-size water drops. Wait the same time. Only the roof material changes.",
        "Imagine this result. A dry floor sits under the foil and a wet spot sits under the towel. For this water test, the foil roof kept the floor drier.",
        "Ask a new question. Which roof holds more toy weight? That would need a new test. The water result answers the water question.",
      ],
      takeaway:
        "Predict, change one thing, observe, then say which result is your evidence. You can also run the whole test in your imagination.",
    },
    guide: [
      {
        prompt:
          "You want to know which cloth absorbs more water. Which plan is fairest?",
        choices: [
          "Use equal pieces, equal drops and the same wait.",
          "Give the larger cloth extra drops.",
          "Test one cloth today and guess the other.",
        ],
        correct: 0,
        hint: "Try to let only the kind of cloth change.",
        explain:
          "Holding size, water and wait time steady makes the cloth the meaningful difference.",
        miss: [
          "",
          "A larger piece and extra drops both change the test. Match the sizes and drops first.",
          "To compare two cloths you need an observation for each one.",
        ],
      },
      {
        prompt:
          "A toy boat test gives this result. Water slips through mesh and pools on plastic. Which claim fits that observation?",
        choices: [
          "Mesh is always the strongest.",
          "Plastic kept the water from passing through in this test.",
          "Plastic must be softer.",
        ],
        correct: 1,
        hint: "What did you actually see the water do?",
        explain:
          "The result tells you about water passing through. You could design another test for strength or softness.",
        miss: [
          "The test showed water moving through holes. Strength would need a different test.",
          "",
          "Softness needs a touch or pressing test. Here you watched the water.",
        ],
      },
    ],
    solo: [
      {
        prompt:
          "A toy drawbridge must bend at its hinge again and again. Which test matches that job?",
        choices: [
          "Count how many colors each strip has.",
          "Drip water on each strip.",
          "Fold each strip the same way five times and look for cracks.",
        ],
        correct: 2,
        hint: "Think about what the hinge has to do whenever the bridge opens.",
        explain:
          "Repeated folds let you observe which material keeps bending without cracking under the same test.",
        miss: [
          "Color would help you decorate. The hinge needs to survive bending.",
          "A drip tests how each strip handles water. The job here is bending.",
          "",
        ],
      },
      {
        prompt:
          "A scientist tests foil and cloth roofs. The foil gets 3 drops and the cloth gets 12. What should change next time?",
        choices: [
          "Give each roof the same number of equal-size drops.",
          "Use a different-size cup for each roof.",
          "Give the cloth even more drops.",
        ],
        correct: 0,
        hint: "A fair roof comparison gives both roofs the same rain.",
        explain:
          "Equal drops and matching cups help you see what the material does.",
        miss: [
          "",
          "Changing cup size adds another difference. Keep the cups alike.",
          "More drops would make the comparison less fair.",
        ],
      },
      {
        prompt:
          "A shelter wall should let its toy owner see outside. Which observation best supports picking a clear sheet?",
        choices: [
          "The sheet makes a crinkly sound.",
          "I could read a big letter through the sheet.",
          "The sheet bent when I rolled it.",
        ],
        correct: 1,
        hint: "Which observation tells you light and a clear image can come through?",
        explain:
          "Seeing the letter through the sheet is direct evidence that the toy owner could see through the wall.",
        miss: [
          "Crinkling is something you hear. Which result describes what you could see?",
          "",
          "Bending tells you about flexibility. Look for evidence about seeing through it.",
        ],
      },
      {
        prompt:
          "Two trays each start with one same-size ice cube. One sits in a warm room and one in a cool room. After ten minutes, only the warm tray has a puddle. What does this show?",
        choices: [
          "Every ice cube melts in exactly ten minutes.",
          "The warm tray made new water from nothing.",
          "The warmer cube melted sooner in this test.",
        ],
        correct: 2,
        hint: "Use only the two cubes you watched as your evidence.",
        explain:
          "The puddle is liquid water from melted ice. One trial tells you what these cubes did. Repeat to see whether the pattern holds.",
        miss: [
          "The cube in the cool room gave a different result. The test did not time every ice cube.",
          "Ice is solid water. The puddle is that water changing to liquid.",
          "",
        ],
      },
    ],
    stretch: {
      prompt:
        "Design a toy shelter that keeps out rain AND lets its owner see a visitor. Choose two materials. Draw where each one goes. How would you test the two jobs separately?",
      hints: [
        "Pick one place for a roof and one for a window. They can use different materials.",
        "A water-drop test can check for leaks. A letter outside the window can check the view.",
      ],
      discuss:
        "One design uses a foil roof and a clear plastic window. A drawing also counts. Point to one observation that would make you keep a material and one that would make you change it.",
    },
    preview: {
      prompt:
        "Be a season detective. A pretend town records these afternoon temperatures. Summer: 28, 30 and 29 degrees Celsius. Winter: 7, 10 and 9. What pattern can you spot? What would you record next?",
      hints: [
        "Find the coolest summer day and the warmest winter day in this small set.",
        "Think of a way to collect many more days at the same place and time.",
      ],
      discuss:
        "Every summer reading here is warmer than every winter reading. Collect more readings across months and years to look for a usual pattern. The pattern can help describe seasons, even though each day can vary.",
    },
  },
};
