const TRAIL_INTERESTS = {
  mystery: {
    title: "Mysteries",
    sample:
      "Crack a number lock and read the clues left by a very muddy visitor.",
    project: {
      prompt:
        "Turn one scene from your myth into a mystery envelope. Pick three clues you could draw inside. Can a listener name the scene and tell where it belongs in the story?",
      nudge:
        "Choose one clue for the place, one for a character and one for something that changed.",
      discuss:
        "Ask which clue gave the scene away. If two scenes fit, invite your listener to name one extra clue that would settle it.",
    },
    mental: {
      prompt:
        "A lock opens when three different number cards add to 20. Your cards are 2, 4, 6, 8 and 10. Find two ways to open it.",
      nudge:
        "Keep the 10 card and look for two different pairs that make 10 more. Could you open the lock without the 10?",
      discuss:
        "2 + 8 + 10 and 4 + 6 + 10 both work. Without 10, the three biggest cards add to only 18. What does that tell you about every solution?",
    },
    trade: {
      prompt:
        "A safe holds 73 coins. You can tie ten coins in a bag or leave them loose. Show 73 using exactly six bags. Can you show it using five?",
      nudge:
        "Start with seven bags and three loose coins. Untie one bag at a time.",
      discuss:
        "Six bags and 13 loose coins still make 73. Five bags and 23 loose coins do too. Ask how the loose pile changes each time a bag opens.",
    },
    stories: {
      prompt:
        "A detective found some keys on Monday, 8 more on Tuesday and 7 more on Wednesday. She has 31 keys now. How many did she find on Monday?",
      nudge:
        "Draw three boxes for the days. Which two boxes can you fill already?",
      discuss:
        "Tuesday and Wednesday account for 15 keys. Monday must have 16 because 16 + 15 = 31. Ask how to solve it by working backward one day at a time.",
    },
    evidence: {
      prompt:
        "The cookie tin was shut. Floury paw prints crossed the floor. A cat slept by the oven. What can you tell from the prints? Can you tell who opened the tin?",
      nudge:
        "Say one thing the story shows for sure. Say one question you would still ask.",
      discuss:
        "Something with flour on its paws crossed the floor. The prints make the cat a possible visitor. No clue shows that anyone opened the tin.",
    },
    words: {
      prompt:
        "Make two clue cards. The answer to one must be road. The answer to the other must be robber. Let someone guess, then teach the tricky letters.",
      nudge:
        "Which word names a way to travel? Which names a person who steals? Look at the middle of each word.",
      discuss:
        "In road, the letters oa work together to spell the long o sound. In robber, both b letters stay in the spelling even though we hear one b sound.",
    },
    writing: {
      prompt:
        "A witness wrote, “It went over there.” You know the kite sailed above the gate. Rewrite the note so a detective could draw what happened.",
      nudge:
        "Replace it with the thing that moved. Replace there with a place. Pick a verb that shows the movement.",
      discuss:
        "“The kite sailed above the gate” gives a reader an object, a movement and a place. Ask the listener to draw from your sentence, then compare pictures.",
    },
    science: {
      prompt:
        "A wet handprint vanishes from a window. One detective says the water soaked into the glass. Another says it went into the air. How could you collect a clue?",
      nudge:
        "Imagine one drop on a glass plate and one on a paper towel. Where would you look for water right away? What might change over time?",
      discuss:
        "Water soaks into the towel. On clean glass it sits on the surface. Over time it can evaporate into the air. Ask which observations you can see and which explanation you infer.",
    },
  },
  art: {
    title: "Art & making",
    sample:
      "Build a tiny gallery, trade tiles and make a scene a reader can picture.",
    project: {
      prompt:
        "Make two tiny sketches for one myth scene. Tell the same event in both. In one, show the whole place. In the other, zoom in on a single detail. Which would help your audience?",
      nudge:
        "Pretend your hands make a picture frame. Move it closer to one detail, then farther back.",
      discuss:
        "A wide view might show where the characters are. A close view might show what a character just did. Ask your viewer what each sketch helped them notice.",
    },
    mental: {
      prompt:
        "Make a paint palette with exactly 24 dots, using two colors. One color must have 4 more dots than the other. How many dots of each? Can you solve it without drawing all 24?",
      nudge:
        "Start with 12 dots of each color. Change one dot's color. How much does the gap change?",
      discuss:
        "Changing two dots from blue to red makes 10 blue and 14 red. The total stays 24. Each switch grows the gap by two because one group loses a dot and the other gains one.",
    },
    trade: {
      prompt:
        "An artist has 48 blue tiles and 27 gold tiles. Slide just enough gold tiles into the blue pile to help you count all the tiles. What are your two new pile sizes?",
      nudge:
        "How many does 48 need to make 50? Keep track of the tiles left in the gold pile.",
      discuss:
        "Moving 2 gives piles of 50 and 25, so the total is 75. Ask whether moving 3 the other way could also help. It makes 45 and 30.",
    },
    stories: {
      prompt:
        "A gallery hangs 4 rows of 5 small pictures. Then it lends 6 pictures to a school. How many stay? Draw a second layout for the pictures that stay.",
      nudge:
        "Sketch the four rows. Cross out a whole row and one more picture.",
      discuss:
        "There were 20 pictures. Fourteen stay. They could hang in two rows of seven or seven rows of two. Ask how the new layout proves the count.",
    },
    evidence: {
      prompt:
        "Ivo held a clean brush above the page. He looked at his sketch twice. Then he tested blue on a scrap. What makes you think he was planning his next mark?",
      nudge:
        "Find two actions that happened before any paint touched the drawing.",
      discuss:
        "Checking the sketch and trying paint on a scrap both support careful planning. Invite another idea about Ivo, then ask which words support it.",
    },
    words: {
      prompt:
        "Design labels for three doodles using brave, cute and foe. Say each word slowly. Which two labels use the same spelling trick for their long vowel?",
      nudge:
        "Cover the last letter of brave and cute. Look for a vowel, a consonant and a quiet e.",
      discuss:
        "Brave and cute have a quiet final e after a consonant. In foe, o and e sit side by side and spell the long o sound. Ask the artist to underline each pattern.",
    },
    writing: {
      prompt:
        "A museum label says, “This is my boat.” Imagine a paper boat with a crooked red sail. Write a new label that helps someone pick your boat from a shelf of five.",
      nudge:
        "Describe the detail a visitor should look for. Read your label aloud to hear whether it is clear.",
      discuss:
        "“Look for the paper boat with a crooked red sail” points to something visible. Have the visitor repeat the detail that helped them find the right boat.",
    },
    science: {
      prompt:
        "Can folding change how much a paper bridge holds? Imagine two equal paper strips across the same gap. Leave one flat and fold the other like a fan. Plan a fair test.",
      nudge:
        "Change only the folds. Think about the paper, the gap and the little counters you would add.",
      discuss:
        "Use equal strips, the same gap and matching counters placed in the same spot. Count how many each holds before it sags. Ask what you would do if two tries gave different results.",
    },
  },
  nature: {
    title: "Animals & nature",
    sample:
      "Follow a pond clue, puzzle over animal legs and watch a seed change.",
    project: {
      prompt:
        "Choose two moments in your myth when nature looks different. Sketch the same patch of ground in each moment. Give a visitor a one-sentence tour of each sketch.",
      nudge:
        "Use the same tree or rock in both pictures so the visitor can spot what changed.",
      discuss:
        "Ask what change the visitor noticed and which event in the myth explains it. A listener should be able to connect the two pictures to the story.",
    },
    mental: {
      prompt:
        "Five animals are at a pond. Each is a duck with 2 legs or a frog with 4 legs. You count 14 legs. How many ducks and frogs are there?",
      nudge:
        "Pretend all five are ducks. When you swap one duck for a frog, how many more legs do you get?",
      discuss:
        "Five ducks would have 10 legs. Two swaps add 4 legs. Three ducks and two frogs have 6 + 8 = 14 legs. Ask whether a third swap could still work.",
    },
    trade: {
      prompt:
        "A ranger draws 56 leaves in one notebook and 39 in another. Find their total by pretending there are 40 in the second book. How do you fix the pretend leaf?",
      nudge:
        "Add 4 tens to 56. Did your pretend count use one extra leaf or one too few?",
      discuss:
        "56 + 40 = 96. Take away the one pretend leaf to get 95. Another way is to move one real leaf from the first group to make 55 + 40.",
    },
    stories: {
      prompt:
        "A nest camera sees 12 birds at dawn. Some fly away. Then 5 land. There are 9 birds at the end. How many flew away?",
      nudge:
        "Work backward from 9. How many were at the nest just before the five landed?",
      discuss:
        "There were 4 birds just before the five landed. Starting with 12 and leaving 4 means 8 flew away. Check the whole story with 12 − 8 + 5 = 9.",
    },
    evidence: {
      prompt:
        "At the pond, Jo saw circles spreading across the water. A brown frog sat still on a rock. A pebble slid from the bank and splashed. Which clue best explains the new circles?",
      nudge: "Find the action that touched the water. What was the frog doing?",
      discuss:
        "The pebble splashed, which gives a reason for the ripples. The frog is nearby, but the story describes it sitting still. Ask what extra clue would support a frog splash.",
    },
    words: {
      prompt:
        "Hide the words under, open and last in a three-sentence treasure hunt for an acorn. Tell someone the clues. Then spell the word that begins with the long o sound.",
      nudge:
        "Try a clue about a leaf, a box or a final step. Say the start of each word slowly.",
      discuss:
        "Open begins with long o. In one hunt, you might say, “Look under a leaf. Open the tiny box. Read the last clue.” Invite a different set of directions.",
    },
    writing: {
      prompt:
        "A nature journal says, “The bird did a thing.” Imagine a robin tugging a worm from wet grass. Write what a field scientist could have seen.",
      nudge:
        "Name the bird, choose one exact action and say where it happened.",
      discuss:
        "“A robin tugged a worm from the wet grass” lets a reader picture the action. Invite the writer to explain which word helps the most and why.",
    },
    science: {
      prompt:
        "Two bean seeds on damp towels sprout. One root measures 2 finger-widths on Monday and 5 on Friday. The other goes from 4 to 6. Which root grew more? What would you record next?",
      nudge:
        "For each root, compare Friday with its own Monday length. Use the same person's finger as your unit each time.",
      discuss:
        "The first root grew 3 units and the second grew 2. The longest root at the end had the smaller change. A ruler and dated drawings would make the next measurements easier to compare.",
    },
  },
  space: {
    title: "Space",
    sample: "Run a moon-post office, pack a rover and track a moving shadow.",
    project: {
      prompt:
        "Pretend a visitor from space has never heard your myth. Make three little tour stops for your visitor. What must they know first so the ending makes sense?",
      nudge:
        "At the first stop introduce the beings and place. At the next stop show what changed. At the last stop explain what the myth helps people picture.",
      discuss:
        "Let the visitor retell the story after the tour. If they miss why something happened, ask which stop could use one more clue.",
    },
    mental: {
      prompt:
        "The moon-post office sells 2-star and 5-star stamps. Find three ways to pay exactly 20 stars. Which way needs the fewest stamps?",
      nudge:
        "Start with only 2-star stamps. Trade five of them for two 5-star stamps.",
      discuss:
        "Ten 2-star stamps, five 2-star plus two 5-star stamps, or four 5-star stamps all pay 20. Four is the fewest because even three of the biggest stamps pay only 15.",
    },
    trade: {
      prompt:
        "A rover packs 125 sample chips. One bin holds 64. Find the other bin's count. Then move 4 chips from the first bin to the other. What pair do you have now?",
      nudge:
        "Count up from 64 to 100 and then to 125. Check that moving chips keeps the same total.",
      discuss:
        "64 needs 36 to reach 100 and 25 more to reach 125, so the other bin holds 61. Moving four makes 60 and 65. Can you make one bin hold 70?",
    },
    stories: {
      prompt:
        "A robot has 3 boxes of 6 star stickers. It puts 2 stickers on each of 7 postcards. Are there enough stickers? How many are left?",
      nudge:
        "Draw three groups of six. Pair off two stickers for each postcard.",
      discuss:
        "Three sixes make 18. Seven pairs use 14. Four stickers are left, enough for two more postcards. Ask the mail carrier to show it with a picture.",
    },
    evidence: {
      prompt:
        "Inside the pretend spaceship, Luz heard a hiss. The air pump was off. A balloon beside her shoe slowly shrank. What probably made the hiss? Point to the best clue.",
      nudge:
        "Which object changed while Luz listened? Which object was switched off?",
      discuss:
        "Air escaping from the shrinking balloon could make the hiss. The quiet pump makes that other idea less likely. Ask what Luz could look or listen for next.",
    },
    words: {
      prompt:
        "Write a tiny message from a rover with the word noise. Then send a number report with the word minus. Circle the letters that spell the oy sound in noise.",
      nudge:
        "Say noise, then say coin. Listen to the middle and look for the two letters the words share.",
      discuss:
        "Oi spells the sound in noise and coin. “I heard a noise by the wheel” and “Ten minus two leaves eight rocks” each give the word a job. Let the rover invent its own reports.",
    },
    writing: {
      prompt:
        "Mission control receives, “We found it.” The rover actually found a shiny pebble beside a wheel. Send a clearer message of ten words or fewer.",
      nudge:
        "Keep the object and its location. Read the message to someone who cannot see the picture in your mind.",
      discuss:
        "“We found a shiny pebble beside the wheel” uses eight words. Plenty of other messages work. Ask the listener to tell you what was found and where.",
    },
    science: {
      prompt:
        "Imagine a pencil standing on a sunny step. Its shadow points one way in the morning and another way later. How could you track the change without moving the pencil?",
      nudge:
        "Think about what to mark each time and what should stay in the same place.",
      discuss:
        "Trace the shadow and write the time beside each tracing while keeping the pencil fixed. The Sun appears in different parts of the sky as Earth turns. Ask what you could compare on a second sunny day.",
    },
  },
};
