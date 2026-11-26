// Original passages for the four language trails. Choice feedback follows choice order.
const TRAIL_WORDS = {
  project: {
    title: "Tell a myth",
    teaser: "Turn five clues into a story you can tell aloud.",
    why: "A listener needs to picture the place, follow what the characters do, and hear how their actions explain something.",
    example: {
      prompt:
        "Listen to a made-up practice myth, “How Shells Got Their Swirls.” Long ago at the edge of the sea, a tiny Tide Weaver found that every shell was plain. She dipped her ribbon in blue ink and twirled it across each shell. That is why some shells wear swirls today.",
      steps: [
        "Name the title, “How Shells Got Their Swirls.” Who acts? The Tide Weaver is the invented mythical being. Where is she? At the edge of the sea.",
        "Touch three fingers as you retell the events. First the Weaver finds plain shells. Next she dips her ribbon in ink. Then she twirls it across the shells.",
        "Listen to the ending. The Weaver’s swirling ribbon leaves a shape. That action explains the swirls in the world of the myth.",
        "Close the model. For your own December 1 project, say your title, characters or mythical beings, setting, events, and what your myth explains. On paper, tell it your way.",
      ],
      takeaway:
        "A listener can ask five questions. What is it called? Who acts? Where does it happen? What happens in order? What does the myth explain?",
    },
    guide: [
      {
        prompt:
          "In “The Drum in the Hill,” a giant taps a hollow hill whenever a storm comes. Travelers hear the sound far away. Which detail tells the setting?",
        choices: ["A giant", "A hollow hill", "A faraway drumming sound"],
        correct: 1,
        hint: "Ask where the tapping takes place.",
        explain:
          "The hollow hill is the place where the giant acts. That makes it the setting.",
        miss: [
          "The giant answers who. Look for the place the giant taps.",
          "",
          "The drumming answers what travelers hear. Where does it begin?",
        ],
      },
      {
        prompt:
          "In another practice myth, a frost sprite presses fern leaves against cold windows. The leaves lift away. Which ending grows from that action?",
        choices: [
          "That is why frost sometimes looks like leaves on glass.",
          "That is why bears sleep in winter.",
          "That is why it is fun to visit the sprite.",
        ],
        correct: 0,
        hint: "Picture the mark a leaf could leave on glass.",
        explain:
          "The leaf shape connects the sprite’s action to the frost pattern the myth explains.",
        miss: [
          "",
          "Bears belong to a different winter story. Which ending mentions a shape made by the sprite?",
          "A feeling about the sprite leaves the leaf marks unexplained. Follow the marks.",
        ],
      },
    ],
    solo: [
      {
        prompt:
          "A speaker says, “My myth is called ‘The Moon Mender.’ A little moth stitches up a tear in the moon with silver thread. That is why the moon has a bright line.” Which question would help the speaker supply the missing setting?",
        choices: [
          "What is the moth called?",
          "What does the thread look like?",
          "Where does the moth do the stitching?",
        ],
        correct: 2,
        hint: "Setting tells where a scene takes place.",
        explain:
          "The speaker could add a place, such as a cloud beside the moon, so the listener knows where to imagine the moth.",
        miss: [
          "Moth is already the character. Listen for the missing place.",
          "Silver tells us something about the thread. Ask about the place the moth works.",
          "",
        ],
      },
      {
        prompt:
          "A cloud fox wants its cotton cloud to travel. Finally the cloud sails away. Which middle event helps explain that ending?",
        choices: [
          "The fox asks Wind to give the cloud a push.",
          "The fox counts its toes.",
          "The fox brushes a stone.",
        ],
        correct: 0,
        hint: "Choose the action that could make the cloud move.",
        explain:
          "Wind’s push gives the cloud a reason to move. Now one event leads to the next.",
        miss: [
          "",
          "Counting toes keeps the fox busy. What could set a cloud moving?",
          "Brushing changes the stone. The middle needs to change what happens to the cloud.",
        ],
      },
      {
        prompt:
          "“At dawn beside a marsh, the Bell Frog struck a reed with his golden toe. The reed made a low hum. That is why reeds seem to sing in this myth.” Which detail names a mythical being?",
        choices: [
          "At dawn",
          "The Bell Frog with a golden toe",
          "Beside a marsh",
        ],
        correct: 1,
        hint: "Look for the imagined character who can act.",
        explain:
          "The Bell Frog acts. Dawn gives the time and the marsh gives the place.",
        miss: [
          "Dawn tells when the action happens. Who strikes the reed?",
          "",
          "The marsh tells where the action happens. Who makes the hum begin?",
        ],
      },
      {
        prompt:
          "In “How the Stars Learned to Wink,” a sky mouse hangs tiny lanterns overhead. A breeze makes the flames flicker. What does this myth explain?",
        choices: [
          "Why the mouse owns a ladder",
          "Why the mouse likes quiet nights",
          "Why stars seem to wink",
        ],
        correct: 2,
        hint: "What sight in the night sky looks like a flickering light?",
        explain:
          "Flickering flames look like winking stars, so the ending answers the question in the title.",
        miss: [
          "A ladder could help the mouse climb, but the story never gives a reason for owning one. Look at the lights.",
          "The story gives no clue about liking quiet. What does the breeze do to the lanterns?",
          "",
        ],
      },
    ],
    stretch: {
      prompt:
        "Invite someone to be your audience. Tell your own myth from memory in about a minute. Ask them to draw the moment that makes the ending happen. Does their picture show what you meant?",
      hints: [
        "Put five little marks on a card for title, characters, setting, events, and explanation.",
        "If the drawing surprises you, try a more exact action word and tell that part again.",
      ],
      discuss:
        "Ask your listener to name one detail that helped them picture the story. Choose one part you want to keep and one you want to practice again.",
    },
    preview: {
      prompt:
        "Be a story engineer. Invent two different myth endings for the stripes on a pebble. One involves a paintbrush and one involves a shadow. Give each ending a beginning that fits.",
      hints: [
        "Work backward. What would have to happen just before the stripe appears?",
        "Try the word because to test whether the ending follows from the action.",
      ],
      discuss:
        "Swap the beginnings. Which ending stops making sense, and which sentence could repair it? This is a Grade 3 peek at cause and effect.",
    },
  },
  evidence: {
    title: "Read like a detective",
    teaser: "Catch the small detail that gives a character away.",
    why: "A writer may leave a feeling unnamed. A reader can combine what the words say with something they know, then test the idea against the story.",
    example: {
      prompt:
        "“Before the curtain opened, Ora rubbed her damp palms on her skirt. ‘What if I forget my line?’ she whispered. When her friend squeezed her hand, Ora took a slow breath.” What might Ora be feeling?",
      steps: [
        "Spot a detail you could point to. Ora’s palms are damp, and she asks about forgetting a line.",
        "Add what you know. People sometimes worry about mistakes before speaking on stage. Try the idea that Ora feels nervous.",
        "Test it. Damp hands alone could mean a hot room. The question about forgetting her line makes worry a stronger fit.",
      ],
      takeaway:
        "Try saying, “I think ___ because the story says ___.” Use the smallest piece of the story that really helps.",
    },
    guide: [
      {
        prompt:
          "“Bea slid a bookmark into a book about owls. She put binoculars by the door and set her alarm for dusk.” What does Bea probably plan to do?",
        choices: ["Watch for owls", "Cook supper", "Paint the door"],
        correct: 0,
        hint: "Think of a plan that uses the book, the binoculars, and the time of day.",
        explain:
          "Binoculars help Bea see far away. The owl book and dusk give us a likely animal and time.",
        miss: [
          "",
          "Dusk might be suppertime, but what job would the owl book and binoculars have?",
          "The door is where she leaves something. What does she leave there, and what is it for?",
        ],
      },
      {
        prompt:
          "“Max came back for the third time to try the wobbly bridge. Each time he fell on the mat, he climbed up again.” Which exact words best support the idea that Max keeps trying?",
        choices: ["the wobbly bridge", "on the mat", "he climbed up again"],
        correct: 2,
        hint: "Which words show Max’s response after a fall?",
        explain:
          "“He climbed up again” shows a repeated choice. It directly supports the idea that Max keeps trying.",
        miss: [
          "The wobbly bridge shows the challenge. Find Max’s action after a fall.",
          "The mat tells where he lands. Find what he chooses to do next.",
          "",
        ],
      },
    ],
    solo: [
      {
        prompt:
          "“Jules held a finger to her lips. She tucked the wrapped box under a chair just before Dad opened the door.” What is most likely?",
        choices: [
          "Jules wants Dad to sit outside.",
          "Jules wants to surprise Dad.",
          "Jules has lost the box.",
        ],
        correct: 1,
        hint: "Put the quiet gesture together with the hidden wrapped box.",
        explain:
          "Keeping quiet and hiding the wrapped box both fit preparing a surprise.",
        miss: [
          "The chair is the hiding place. Nothing asks Dad to stay outside.",
          "",
          "Jules knows exactly where she put the box. Why hide it as Dad approaches?",
        ],
      },
      {
        prompt:
          "“The class planted beans on Monday. On Friday, Liv grinned and called everyone to the pot. A green hook poked through the soil.” Which words best show why Liv calls everyone over?",
        choices: [
          "The class planted beans",
          "on Monday",
          "A green hook poked through the soil",
        ],
        correct: 2,
        hint: "Find the new thing there is to see on Friday.",
        explain:
          "The green hook is a newly visible sprout. That new sight explains why Liv calls the class.",
        miss: [
          "Planting tells how the story starts. Find what changes on Friday.",
          "Monday gives a time. Which detail would be exciting to look at?",
          "",
        ],
      },
      {
        prompt:
          "“Rain tapped the roof. Eli put three towels by the door. His dog dashed in, leaving wet paw prints. Eli reached for a towel.” Why did Eli set towels out?",
        choices: [
          "He expected to dry his wet dog.",
          "He hoped to wash the roof.",
          "He wanted softer shoes.",
        ],
        correct: 0,
        hint: "Who comes through the door, and what marks do they leave?",
        explain:
          "The rain, wet paw prints, and reaching for the towel point to drying the dog.",
        miss: [
          "",
          "Rain hits the roof, but the towels are by the door. Who needs one there?",
          "No shoes appear in the story. What evidence does the dog leave?",
        ],
      },
      {
        prompt:
          "“Nora usually raced to the front at swimming lessons. Today she stopped at the deep pool and held the rail with both hands.” Which idea has the strongest support?",
        choices: [
          "Nora never likes to swim.",
          "Nora feels unsure about the deep pool today.",
          "Nora has forgotten her swimsuit.",
        ],
        correct: 1,
        hint: "Compare what she usually does with what changes today.",
        explain:
          "Stopping and holding the rail at the deep pool support uncertainty today. The word usually helps us notice the change.",
        miss: [
          "“Usually raced to the front” makes never too strong. What is different today?",
          "",
          "There is no detail about her swimsuit. Look at what she does near the deep water.",
        ],
      },
    ],
    stretch: {
      prompt:
        "“Min stood by the window holding two tickets. Every time a bus went past, Min looked at the clock.” Invent two possible explanations. Add one sentence that helps a reader decide between them.",
      hints: [
        "The tickets could be for a show, a trip, or something else. Which clues fit both ideas?",
        "Add a detail that fits only one idea, such as a message from someone running late.",
      ],
      discuss:
        "Let a listener pick an explanation before and after your new sentence. Which exact words changed their mind?",
    },
    preview: {
      prompt:
        "“I hid the last berry so we could plant its seeds,” says Mouse. “I thought you hid our snack,” says Wren. Tell the moment twice, first as Mouse and then as Wren.",
      hints: [
        "Each character sees the same berry disappear. Only Mouse knows the plan at first.",
        "Give each narrator one sentence beginning with I thought.",
      ],
      discuss:
        "Which fact would change Wren’s mind? This is a Grade 3 peek at how a character’s point of view changes a story.",
    },
  },
  words: {
    title: "Crack the word code",
    teaser: "Play with sounds, spelling patterns, and word meanings.",
    why: "A word detective listens to the sounds, notices the letters that spell them, and checks that the meaning fits the sentence.",
    example: {
      prompt:
        "Say “brave,” “road,” and “foe.” Which words share a vowel sound even though their spellings look different?",
      steps: [
        "Stretch brave. The a says its name and the final e is silent. Cute also has a silent final e, and its vowel sounds like the name of the letter u.",
        "Say road, foe, and the first part of open. All three have long o. Notice oa in road, oe in foe, and the o at the end of the first spoken part of o-pen.",
        "Say noise. The oi makes the sound you hear in coin. Clap un-der, mi-nus, and rob-ber. Each has two beats. Robber keeps two b’s.",
        "Try meaning as a clue. A foe is an enemy. A robber is someone who steals. Minus means taking away in a sum. In last, listen all the way to the final st.",
      ],
      takeaway:
        "Look at a word, say it, cover it, and write it. Uncover it and check the tricky part. Pick two words to use in a silly sentence.",
    },
    guide: [
      {
        prompt:
          "“We walked along the ___ to the farm.” Say the missing word aloud. Which spelling names a path you can travel?",
        choices: ["rode", "road", "rod"],
        correct: 1,
        hint: "You need the name of a place. Remember the long o spelled oa.",
        explain:
          "Road names the path. Rode sounds the same but tells what someone did, as in “I rode a bike.”",
        miss: [
          "Rode is an action in the past. Find the spelling for the path.",
          "",
          "Rod has a short o. Say road slowly and listen for long o.",
        ],
      },
      {
        prompt:
          "“When a tray fell, we heard a loud ___.” Which word both fits the meaning and spells the oi sound?",
        choices: ["nose", "noisy", "noise"],
        correct: 2,
        hint: "You need the name of a sound. Say the oi as in coin.",
        explain:
          "Noise names a sound. Noisy describes something that makes noise.",
        miss: [
          "Nose has a long o sound. Say the middle of coin, then look for the same letters.",
          "Noisy describes a place or a thing. Which word names the sound itself?",
          "",
        ],
      },
    ],
    solo: [
      {
        prompt:
          "During a pretend game, two teams face each other. “You are my foe this round,” says Sam. What does foe mean here?",
        choices: ["My helper", "My opponent", "My coach"],
        correct: 1,
        hint: "Picture a player on the team facing Sam.",
        explain:
          "Foe means enemy or opponent. In a pretend game, the players can be friends playing opposite roles.",
        miss: [
          "A helper would usually be on Sam’s side. Foe points to the opposite side.",
          "",
          "A coach teaches a player. What do you call the player facing you?",
        ],
      },
      {
        prompt:
          "Build the word for a person who robs. Which spelling keeps the short o sound in rob and adds er?",
        choices: ["rober", "robbre", "robber"],
        correct: 2,
        hint: "In this word, double the final b of rob before adding er.",
        explain:
          "Rob + b + er gives robber. Tap the two spoken parts, rob-ber.",
        miss: [
          "You have one b. Check what happens to the final b before er in this word.",
          "The b’s are there. Say the ending er and check the order of its letters.",
          "",
        ],
      },
      {
        prompt:
          "Say the first vowel in open and minus. Which description fits both words?",
        choices: [
          "The first vowel sounds like its letter name.",
          "Both first vowels sound like short a.",
          "Both words end in a silent e.",
        ],
        correct: 0,
        hint: "Say o-pen and mi-nus slowly. Listen to o and i.",
        explain:
          "The first vowel in open says O. The first vowel in minus says I. Each comes at the end of the first spoken part.",
        miss: [
          "",
          "Listen once more. Neither first vowel sounds like the a in cat.",
          "Look at the last letters, n and s. The clue is in the first spoken part.",
        ],
      },
      {
        prompt:
          "“The ___ pup crawled ___ the bench and took the ___ biscuit.” Choose the words that mean sweet-looking, below, and final, in that order.",
        choices: [
          "brave, last, under",
          "cute, under, last",
          "last, cute, brave",
        ],
        correct: 1,
        hint: "Try the middle of the sentence first. Where could the pup crawl?",
        explain:
          "Cute describes the pup, under tells where it crawled, and last names the final biscuit.",
        miss: [
          "Brave means showing courage. Check the word for below in the second spot.",
          "",
          "Try reading “crawled cute the bench.” Which word tells where?",
        ],
      },
    ],
    stretch: {
      prompt:
        "Make a ten-word treasure hunt. Write under, noise, open, brave, cute, minus, last, foe, robber, and road on scraps. Invent two different ways to sort all ten, then let someone guess your rules.",
      hints: [
        "Try one spoken beat or two. For a second sort, inspect the last letter or hide a spelling pattern in your rule.",
        "Then have someone dictate three shuffled words. Cover your cards and spell each from sound and memory.",
      ],
      discuss:
        "Which sorting rule helped you remember a tricky spelling? Explain it, then use that word in a sentence.",
    },
    preview: {
      prompt:
        "Build two tiny word families. Change rob to robbed and robber. Change brave to braver and bravest. Circle the letters that stay and describe what changes.",
      hints: [
        "Trace the b in rob. There are two b’s before the ending in robbed and robber.",
        "Find brave inside braver and bravest. Count how many e’s appear in each finished word.",
      ],
      discuss:
        "Try your discovery on hop and hope. Write hopper and hoping. Which base word lives in each? Explain how you can tell. This is a Grade 3 peek at word building.",
    },
  },
  writing: {
    title: "Make a sentence glow",
    teaser: "Give a reader one detail they can see, hear, or feel.",
    why: "Revising lets you choose a stronger action or a more exact detail. Reading it aloud helps you hear whether the sentence still says what you meant.",
    example: {
      prompt:
        "Original — “The bird went to the tree.” Revised — “The sparrow darted into the oak with a blue thread in its beak.” Picture each version. Which details change your picture?",
      steps: [
        "Keep the main idea. Both sentences show a bird moving to a tree.",
        "Choose an exact noun and verb. Sparrow names the bird. Darted shows quick movement. Oak names the tree.",
        "Add one detail the reader can picture. A blue thread in the beak gives the reader something to wonder about.",
        "Read the revised sentence aloud. If a detail gets in the way of your picture, take it out. Check the capital and end mark.",
      ],
      takeaway:
        "On paper, put your original on the left and your revision on the right. Ask a listener what they can picture in the new version.",
    },
    guide: [
      {
        prompt:
          "Original — “The mouse went behind the pot.” You want readers to picture a quick, quiet movement. Which revision does that?",
        choices: [
          "The mouse was a mouse behind the pot.",
          "The enormous pot was blue.",
          "The mouse slipped behind the pot.",
        ],
        correct: 2,
        hint: "Find the action word that shows how the mouse went.",
        explain:
          "Slipped keeps the action and gives it a quiet, quick feeling.",
        miss: [
          "Repeating mouse adds no movement. Look for a new verb.",
          "A blue pot is easy to picture. Which sentence also keeps the mouse moving?",
          "",
        ],
      },
      {
        prompt:
          "Original — “Rae felt proud.” Which next sentence gives a clue a reader can see?",
        choices: [
          "She held up her finished kite with a grin.",
          "Proud is a feeling.",
          "Rae was very, very proud.",
        ],
        correct: 0,
        hint: "Imagine filming the scene. What could the camera catch?",
        explain:
          "A held-up kite and a grin are visible actions that help a reader infer pride.",
        miss: [
          "",
          "A definition explains a word. Look for something Rae does in the scene.",
          "Very repeats the feeling. What would a camera actually see Rae do?",
        ],
      },
    ],
    solo: [
      {
        prompt:
          "Original — “Water came from the tap.” You watch one drop fall at a time. Which verb gives a reader that picture?",
        choices: ["roared", "dripped", "flooded"],
        correct: 1,
        hint: "Imagine the sound of one small drop, then another.",
        explain: "Dripped shows small separate drops, just as you observed.",
        miss: [
          "Roared suggests a loud rush. Picture just one drop at a time.",
          "",
          "Flooded suggests lots of water spreading around. Choose the verb for small drops.",
        ],
      },
      {
        prompt:
          "“We made a paper boat.” Which added sentence helps the reader picture this particular boat?",
        choices: [
          "Boats are things.",
          "My cousin likes noodles.",
          "Its red sail leaned over a deck the size of my palm.",
        ],
        correct: 2,
        hint: "Look for a detail you could draw on the boat.",
        explain:
          "The red sail and palm-sized deck add color and size to the same boat.",
        miss: [
          "That could be said about every boat. Which sentence could guide a drawing?",
          "Noodles give a detail about someone else. Keep your reader’s eyes on the boat.",
          "",
        ],
      },
      {
        prompt:
          "Original — “The box rattled.” A kitten inside scratches the lid. Which revision adds the sound and keeps the same event?",
        choices: [
          "The box rattled as tiny claws scraped its lid.",
          "The box flew over a lake.",
          "There was a box and it was a box.",
        ],
        correct: 0,
        hint: "Listen for both the original rattle and the cause of the sound.",
        explain:
          "The first sound stays. The scraping claws help the reader hear what makes the lid move.",
        miss: [
          "",
          "Flying changes the event. Which sentence still includes the rattle?",
          "Repeating box adds no sound. Find a verb for claws moving across the lid.",
        ],
      },
      {
        prompt:
          "A reader has to stop for breath here. “The owl landed it folded its wings.” Which edit makes two complete sentences and keeps the events in order?",
        choices: [
          "The owl. Landed it folded its wings.",
          "The owl landed. It folded its wings.",
          "The owl landed it. Folded its wings.",
        ],
        correct: 1,
        hint: "Say the two actions separately. Who landed? Who folded its wings?",
        explain:
          "Each sentence now has someone doing something. The capital I starts the second sentence.",
        miss: [
          "“The owl” names someone but gives that someone no action yet. Keep owl and landed together.",
          "",
          "“Folded its wings” needs someone doing the folding. Keep it with that second action.",
        ],
      },
    ],
    stretch: {
      prompt:
        "On paper, write one sentence about something you saw. Leave the original on the left. On the right, try two revisions, one for a reader with eyes closed who is listening and one for an artist who is drawing.",
      hints: [
        "For the listener, choose a sound or an action they can hear. For the artist, choose a shape, color, or position.",
        "A tiny, true detail often does more than three adjectives.",
      ],
      discuss:
        "Ask a grown-up to read both versions aloud and say what each made them imagine. Decide which version sounds like you. Several answers can work.",
    },
    preview: {
      prompt:
        "Write a three-sentence scene that begins, “The lunchbox moved.” Give the middle sentence one quiet clue. Make the last sentence reveal the cause. Try two different middle sentences.",
      hints: [
        "Choose the cause before planting your clue. Is something alive inside, or is the table tilted?",
        "Read the first two sentences to a listener and ask what they predict.",
      ],
      discuss:
        "Which clue makes the reveal feel earned while keeping it a surprise? This is a Grade 3 peek at linking details across a paragraph.",
    },
  },
};
