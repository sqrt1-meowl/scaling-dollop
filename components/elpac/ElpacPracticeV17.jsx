"use client";

import React, { useState, useRef, useEffect } from "react";
import { G1112_BANKS } from "./g1112Banks";

// ── Real scene photos (website asset URLs). Add another by pasting a new
// entry keyed by the scene name used in BANK (e.g. mathclass, linegraph).
// If a scene has a photo here, it is shown instead of the SVG fallback. ──
const SCENE_PHOTOS = {
  "s1-68-dp-bus": "/elpac/media/s1-68-dp-bus.jpg",
  "s1-68-sp-photography": "/elpac/media/s1-68-sp-photography.jpg",
  "s2-68-sp-robotics": "/elpac/media/s2-68-sp-robotics.jpg",
  "s3-68-sp-garden": "/elpac/media/s3-68-sp-garden.jpg",
  "s1-35-rc-living-room": "/elpac/media/s1-35-rc-living-room.jpg",
  "s1-35-rc-recess-play": "/elpac/media/s1-35-rc-recess-play.jpg",
  "s1-35-dp-map": "/elpac/media/s1-35-dp-map.jpg",
  "s1-35-sp-paper-animals": "/elpac/media/s1-35-sp-paper-animals.jpg",
  "s2-35-rc-kitchen": "/elpac/media/s2-35-rc-kitchen.jpg",
  "s2-35-rc-bus-stop": "/elpac/media/s2-35-rc-bus-stop.jpg",
  "s2-35-sp-garden": "/elpac/media/s2-35-sp-garden.jpg",
  "s3-35-rc-art-class": "/elpac/media/s3-35-rc-art-class.jpg",
  "s3-35-rc-rainy-window": "/elpac/media/s3-35-rc-rainy-window.jpg",
  "s3-35-sp-market": "/elpac/media/s3-35-sp-market.jpg",
  library: "/elpac/media/library.jpg",
  mathclass: "/elpac/media/mathclass.webp",
  map: "/elpac/media/map.webp",
  sciencefair: "/elpac/media/sciencefair.webp",
  "three-rs-organizer": "/elpac/media/three-rs-organizer.webp",
  "playground-survey-chart": "/elpac/media/playground-survey-chart.webp",
  "weather-chart": "/elpac/media/weather-chart.webp",
  "race-preparation-organizer": "/elpac/media/race-preparation-organizer.webp",
  "plant-experiment-chart": "/elpac/media/plant-experiment-chart.webp",
  "two-jobs-comparison": "/elpac/media/two-jobs-comparison.webp",
  "mikhail-timeline": "/elpac/media/mikhail-timeline.webp",
  "club-budget-chart": "/elpac/media/club-budget-chart.webp",
  "energy-sources-chart": "/elpac/media/energy-sources-chart.webp",
};

const SCENE_ALTS = {
  "s1-68-dp-bus": "Students waiting beside a school bus",
  "s1-68-sp-photography": "A student taking a photograph outdoors",
  "s2-68-sp-robotics": "Students working together on a robotics project",
  "s3-68-sp-garden": "Students caring for a school garden",
  "s1-35-rc-living-room": "A family spending time together in a living room",
  "s1-35-rc-recess-play": "Students playing together during recess",
  "s1-35-dp-map": "A student pointing to a map while classmates watch",
  "s1-35-sp-paper-animals": "Students making animal crafts from paper",
  "s2-35-rc-kitchen": "A family preparing food in a kitchen",
  "s2-35-rc-bus-stop": "Students waiting at a bus stop",
  "s2-35-sp-garden": "Students working in a garden",
  "s3-35-rc-art-class": "Students creating artwork in class",
  "s3-35-rc-rainy-window": "A student looking through a rainy window",
  "s3-35-sp-market": "People shopping at an outdoor market",
  mathclass: "A teacher explaining an algebra problem to students in a math classroom",
  map: "A student pointing to a world map while classmates and a teacher watch",
  sciencefair: "Students presenting projects to a judge at a school science fair",
  library: "Students reading and studying in a library",
  "three-rs-organizer": "The Three Rs organizer with examples of reduce, reuse, and recycle",
  "playground-survey-chart": "Bar chart showing student votes for new playground equipment",
  "weather-chart": "Bar chart showing the number of sunny, cloudy, and rainy days last month",
  "race-preparation-organizer": "Four-step sequence showing how Blake prepared for and won a race",
  "plant-experiment-chart": "Comparison of plant growth on a windowsill and in a dark closet",
  "two-jobs-comparison": "Comparison of pay, travel time, and experience for two summer jobs",
  "mikhail-timeline": "Timeline of five important events in Mikhail's life from 1903 to 1952",
  "club-budget-chart": "Table of club funding requests and the amount over budget",
  "energy-sources-chart": "Two line charts showing solar power cost and local solar electricity share",
};

function sceneAlt(name) {
  return SCENE_ALTS[name] || String(name || "Practice illustration").replace(/[-_]+/g, " ");
}

// ════════════════════════════════════════════════════════════════
//  ELPAC PRACTICE HUB
//  Modeled directly on the official Grade 9–10 Practice Test
//  Scoring Guide (task types, topics, item counts, answer format).
//  Flow: Grade → Practice Set → Listening / Speaking / Reading / Writing
//  Mixed difficulty, predicts a level (1–4) at the end.
//
//  ██ EDIT QUESTIONS HERE ██  All content is in BANK below.
//  Each grade → 4 domains → list of task blocks.
//   MC block:   { task, topic, intro?, transcript?, passage?, qs:[{stem,options,answer}] }
//                 answer = index of correct option (0 = first).
//   Reading:    same, with `passage`.
//   Writing:    { task, topic, kind:"choice"|"frame", ... }
//   Speaking:   { task, topic, scene?, prompt, points, checks:[...] }  (records audio)
//  `scene` names a built-in illustration (see SCENES) shown above the prompt.
// ════════════════════════════════════════════════════════════════

const BANK = {
  g910: {
    listening: [
      { task: "Listen to a Short Exchange", topic: "Notebook",
        intro: "You will hear two students talk. You will hear it only once.",
        transcript: "Girl: Did Mr. Ruiz post the lab groups yet?\nBoy: Yeah, but check the second page — half the class missed that there are two lists.",
        qs: [ { stem: "What did many students miss?", options: ["The lab date", "The second page of groups", "Mr. Ruiz's room number"], answer: 1 } ] },
      { task: "Listen to a Short Exchange", topic: "Stir Experiment",
        intro: "You will hear two students in science class. Only once.",
        transcript: "Boy: Should I keep stirring, or stop now?\nGirl: Keep going until the powder completely dissolves — otherwise the measurement won't be accurate.",
        qs: [ { stem: "Why should the boy keep stirring?", options: ["To warm the liquid", "So the powder fully dissolves", "To make bubbles"], answer: 1 } ] },
      { task: "Listen to a Short Exchange", topic: "Spilled Drink",
        intro: "You will hear it only once.",
        transcript: "Boy: Oh no — I knocked my juice over, and it's running toward the laptops!\nGirl: Grab the paper towels from the back counter. I'll move the laptops out of the way.",
        qs: [ { stem: "What will the girl do?", options: ["Get paper towels", "Move the laptops", "Call the teacher"], answer: 1 } ] },
      { task: "Listen to a Classroom Conversation", topic: "Colored Pencils",
        intro: "You will hear a teacher and a student. Only once.",
        transcript: "Teacher: For the poster, you can borrow colored pencils, but sign them out first.\nStudent: Where do I sign?\nTeacher: On the clipboard by the supply shelf. Return them by the end of class so the next period has a full set.\nStudent: Got it. Can I take the fine-tip markers too?\nTeacher: Those stay — they dried out last time someone borrowed them.",
        qs: [
          { stem: "What must the student do before borrowing pencils?", options: ["Ask a friend", "Sign them out on the clipboard", "Pay a deposit"], answer: 1 },
          { stem: "Why must the pencils be returned by end of class?", options: ["They are expensive", "The next period needs a full set", "They must be washed"], answer: 1 },
          { stem: "Why won't the teacher lend the markers?", options: ["They are new", "They dried out last time", "They are the wrong color"], answer: 1 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Eclipses",
        intro: "You will hear part of a science presentation. Only once.",
        transcript: "Student: A solar eclipse happens when the Moon passes directly between the Sun and Earth, casting a shadow on us. It seems like it should happen every month, but it doesn't — the Moon's orbit is tilted about five degrees, so usually its shadow misses Earth entirely. Only when the Moon crosses Earth's orbital plane at the right moment do we get an eclipse. That alignment is why total solar eclipses at any given spot are so rare.",
        qs: [
          { stem: "What causes a solar eclipse?", options: ["Earth blocks the Sun", "The Moon passes between the Sun and Earth", "Clouds cover the Sun"], answer: 1 },
          { stem: "Why doesn't an eclipse happen every month?", options: ["The Moon is too small", "The Moon's orbit is tilted, so its shadow usually misses", "Earth spins too fast"], answer: 1 },
          { stem: "The presentation is mainly meant to…", options: ["persuade you to watch an eclipse", "explain why eclipses are rare", "describe the Moon's surface"], answer: 1 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Library of Alexandria",
        intro: "You will hear part of a history presentation. Only once.",
        transcript: "Student: The ancient Library of Alexandria had an ambition no library had tried before: to collect every book in the world. Rulers sent agents to buy scrolls from every land, and by law, ships entering the harbor had to hand over any books on board so scribes could copy them. Contrary to legend, the library didn't vanish in a single fire. It declined slowly over centuries — funding dried up, scholars left, and collections scattered — until one of history's greatest storehouses of knowledge simply faded away.",
        qs: [
          { stem: "What was the library's ambition?", options: ["To collect every book in the world", "To train sailors", "To build the tallest building"], answer: 0 },
          { stem: "What happened to books on ships entering the harbor?", options: ["They were burned", "They were copied by scribes", "They were sold"], answer: 1 },
          { stem: "According to the speaker, how was the library lost?", options: ["In one great fire", "It declined slowly over centuries", "It was stolen"], answer: 1 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "Suburbs",
        intro: "You will hear a student give an opinion. Only once.",
        transcript: "Student: I believe our suburb should allow small corner stores in neighborhoods. Right now, buying milk means a fifteen-minute drive, which is hard on families with one car and on older residents who don't drive at all. A walkable corner store gives neighbors a place to run into each other, too. People worry about traffic and noise, and that's reasonable — but a small store draws foot traffic from nearby streets, not cars from across town. Towns near us that allowed them saw no rise in traffic complaints.",
        qs: [
          { stem: "What is the speaker's opinion?", options: ["Suburbs need wider roads", "Neighborhoods should allow small corner stores", "Stores should close earlier"], answer: 1 },
          { stem: "Who does the speaker say the long drive is hardest on?", options: ["Families with one car and older residents", "Store owners", "Bus drivers"], answer: 0 },
          { stem: "How does the speaker answer the traffic worry?", options: ["Says traffic doesn't matter", "Small stores draw foot traffic, and nearby towns saw no rise in complaints", "Suggests building parking lots"], answer: 1 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "Walkable Spaces",
        intro: "You will hear a student give an opinion. Only once.",
        transcript: "Student: I think our city should build more walkable spaces. Right now you have to drive everywhere, even for small errands, which adds traffic and pollution. Walkable neighborhoods let people reach shops and parks on foot, which is healthier and builds community. Critics say it's expensive to redesign streets, and that's true. But cities that added protected walkways saw local businesses grow, so the cost pays itself back over time.",
        qs: [
          { stem: "What is the speaker's opinion?", options: ["Build more parking", "Build more walkable spaces", "Add more buses"], answer: 1 },
          { stem: "Which reason does the speaker give?", options: ["Walking is cheaper than driving", "Walkable areas are healthier and build community", "Sidewalks look nicer"], answer: 1 },
          { stem: "How does the speaker respond to the cost objection?", options: ["Denies it costs money", "Says businesses grow, so it pays back", "Ignores it"], answer: 1 },
        ] },
    ],
    reading: [
      { task: "Read a Short Informational Passage", topic: "Glaciers",
        passage: "Glaciers are often called rivers of ice, and the name fits: they flow. Under their own enormous weight, the ice deep inside a glacier behaves less like a solid and more like a slow, thick liquid, creeping downhill a few centimeters a day. As a glacier moves, it grinds the rock beneath it, carving valleys and carrying boulders far from where they began. When the climate warms and a glacier melts faster than new snow can replace it, the glacier retreats — not by sliding backward, but by melting at its lower end faster than it flows forward.",
        qs: [
          { stem: "The phrase 'rivers of ice' fits because glaciers…", options: ["are cold", "flow slowly downhill", "are blue", "hold water"], answer: 1 },
          { stem: "How does a glacier carve valleys?", options: ["By freezing water", "By grinding rock as it moves", "By cracking in winter", "By reflecting sunlight"], answer: 1 },
          { stem: "When a glacier 'retreats,' it actually…", options: ["slides backward", "melts at its lower end faster than it advances", "stops moving", "splits in two"], answer: 1 },
        ] },
      { task: "Read a Short Informational Passage", topic: "Terminal Velocity",
        passage: "When an object falls, gravity pulls it faster and faster — but not forever. As it speeds up, air pushes back harder against it. Eventually the upward push of air resistance exactly balances the downward pull of gravity, and the object stops accelerating. It keeps falling, but at a steady speed called terminal velocity. This is why a skydiver and a feather don't fall the same way: the skydiver's terminal velocity is high, while the feather's is so low that it drifts gently to the ground.",
        qs: [
          { stem: "What stops a falling object from speeding up forever?", options: ["Gravity weakens", "Air resistance balances gravity", "It gets tired", "The ground pulls it"], answer: 1 },
          { stem: "At terminal velocity, the object…", options: ["stops falling", "falls at a steady speed", "speeds up", "floats upward"], answer: 1 },
          { stem: "Why does a feather drift while a skydiver drops fast?", options: ["Feathers are magic", "The feather's terminal velocity is much lower", "Gravity ignores feathers", "The skydiver pushes down"], answer: 1 },
        ] },
      { task: "Read a Student Essay", topic: "Art Education For Everyone",
        passage: "(Read a classmate's draft and answer the questions.) “Our school should require an art class for every student. First, art teaches creative problem-solving, a skill that helps in science and business too. Second, many students has never had the chance to try painting or design. Some argue that art takes time away from core subjects, however studies show students who take art often do better in those subjects, not worse. For these reason, art should be part of every student's education.”",
        qs: [
          { stem: "What is the writer's main claim?", options: ["Art is fun", "Every student should take an art class", "Science is hard", "Schools need more time"], answer: 1 },
          { stem: "Which sentence contains a grammar error?", options: ["“Art teaches creative problem-solving…”", "“Many students has never had the chance…”", "“Studies show students who take art…”", "“Our school should require…”"], answer: 1 },
          { stem: "“For these reason” should be corrected to…", options: ["For these reasons", "For this reasons", "For those reason", "For these reasoning"], answer: 0 },
          { stem: "How does the writer answer the 'takes time from core subjects' objection?", options: ["Ignores it", "Cites studies that art students do better", "Says core subjects are boring", "Agrees and gives up"], answer: 1 },
          { stem: "The words 'First' and 'Second' are used to…", options: ["organize the writer's reasons", "show time passing", "list art supplies", "quote a study"], answer: 0 },
          { stem: "Which detail supports the claim that art helps beyond art class?", options: ["Creative problem-solving helps in science and business", "Painting is fun", "Design is popular", "Students like electives"], answer: 0 },
          { stem: "The word 'require' shows the writer wants art to be…", options: ["optional", "mandatory", "canceled", "graded"], answer: 1 },
          { stem: "The sentence with 'however' would be BEST fixed by…", options: ["'…core subjects; however, studies show…'", "removing the word 'studies'", "starting the essay with 'however'", "deleting the whole sentence"], answer: 0 },
        ] },
      { task: "Read a Literary Passage", topic: "Drama Friends",
        passage: "Nadia had signed up for drama to be with her friends, not to act. So when Mr. Okafor cast her as the lead, she nearly dropped the class. Her friends, cast as background villagers, teased that she'd 'abandoned' them for stardom. For a week she rehearsed alone, miserable. Then, on opening night, she spotted them in the wings — holding cue cards they'd made her, mouthing her lines along with her. She realized they hadn't been jealous at all; they'd been waiting for her to stop apologizing and let them help.",
        qs: [
          { stem: "Why did Nadia originally join drama?", options: ["To become an actor", "To be with her friends", "For extra credit", "Her parents made her"], answer: 1 },
          { stem: "How did Nadia feel during the week of rehearsing alone?", options: ["Excited", "Miserable", "Proud", "Relaxed"], answer: 1 },
          { stem: "What did Nadia realize on opening night?", options: ["Her friends were jealous", "Her friends wanted to help, not compete", "She should quit", "The play was canceled"], answer: 1 },
          { stem: "Why did the friends make cue cards?", options: ["To support Nadia", "For their own lines", "The teacher required it", "To sell them"], answer: 0 },
          { stem: "The word 'abandoned' is in quotes because the friends were…", options: ["teasing, not serious", "angry", "quoting the play", "whispering"], answer: 0 },
          { stem: "A theme of the passage is…", options: ["let the people who care about you help you", "acting is easy", "leads matter more than villagers", "never join clubs with friends"], answer: 0 },
        ] },
      { task: "Read an Informational Passage", topic: "Andrew Carnegie",
        passage: "Andrew Carnegie arrived in America as a poor immigrant and became one of the richest men in history through the steel industry. But he is remembered less for making his fortune than for giving it away. Believing that the wealthy had a duty to use their money for public good, Carnegie funded more than 2,500 libraries across the world, open to anyone regardless of income. He argued that a library helped people help themselves — unlike simple charity, which he thought could create dependence. By the time he died, he had given away almost his entire fortune.",
        qs: [
          { stem: "Carnegie is most remembered for…", options: ["making steel", "giving away his fortune", "arriving poor", "building factories"], answer: 1 },
          { stem: "Why did Carnegie favor libraries over simple charity?", options: ["Libraries were cheaper", "Libraries help people help themselves", "He liked books", "Charity was illegal"], answer: 1 },
          { stem: "The passage's main idea is that Carnegie…", options: ["was the richest man ever", "believed the wealthy should serve the public good", "disliked immigrants", "invented the library"], answer: 1 },
          { stem: "'Open to anyone regardless of income' emphasizes that the libraries were…", options: ["free and open to all", "expensive", "only for scholars", "only in cities"], answer: 0 },
          { stem: "Why did Carnegie think libraries beat simple charity?", options: ["They let people improve themselves", "They were cheaper to run", "Books last longer than money", "Charity was against the law"], answer: 0 },
          { stem: "The passage is organized by…", options: ["his life, then his beliefs, then his legacy", "problem and solution", "question and answer", "a list of libraries"], answer: 0 },
        ] },
    ],
    speaking: [
      { task: "Talk about a Scene (1 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "Look at the picture. What is the student at the counter doing?",
        points: 1, checks: ["I described the action in a full sentence"] },
      { task: "Talk about a Scene (2 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "Look at the picture again. Describe two other people in the picture and what they are doing.",
        points: 1, checks: ["I described two other people", "I used action words"] },
      { task: "Talk about a Scene (3 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "Where do you think this is? Give two clues from the picture that tell you.",
        points: 1, checks: ["I named the place", "I gave two clues"] },
      { task: "Talk about a Scene (4 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "Tell about a time you borrowed something from school or from a friend. What was it, and why did you need it?",
        points: 1, checks: ["I said what I borrowed and why", "Past tense"] },
      { task: "Speech Functions", topic: "Permission Stay Out Late",
        prompt: "You want to ask a parent for permission to stay out late with friends this Friday. What would you say to them?",
        points: 1, checks: ["I asked politely and clearly", "A listener would understand with no effort"] },
      { task: "Speech Functions", topic: "Play Start",
        prompt: "You want to find out what time the school play starts. Ask someone appropriately.",
        points: 1, checks: ["I asked a clear question", "It fits the situation"] },
      { task: "Support an Opinion", topic: "PE or Art",
        prompt: "Your school can add one new class: PE or Art. Which should it choose? State your opinion and justify it with at least one relevant reason and explanation.",
        points: 2, checks: ["I stated an opinion", "I gave a reason WITH explanation"] },
      { task: "Support an Opinion", topic: "Community Pool or Park",
        prompt: "Your city has money to build one thing: a community pool or a new park. Which should it build? State your opinion and justify it with a reason and explanation.",
        points: 2, checks: ["Clear opinion", "Reason with explanation"] },
      { task: "Present and Discuss Information", topic: "Geometry", scene: "linegraph",
        prompt: "Look at the line graph of geometry enrollment over five years. Point 1: Describe what the graph shows. Point 2: A student claims 'more students enrolled in year one than year three.' Using the graph, is that claim supported? Explain.",
        points: 3, checks: ["I described the trend accurately", "I judged the claim using real data from the graph"] },
      { task: "Summarize an Academic Presentation", topic: "Regelation",
        prompt: "A science presentation explained regelation: ice melts under strong pressure and refreezes when the pressure is released. That's why a thin weighted wire can pass slowly through a block of ice while the ice refreezes behind it, leaving the block whole. Summarize the idea in your own words: what regelation is, what causes it, and the wire example.",
        points: 4, checks: ["I explained the idea and cause", "I included the example", "Connected sentences, my own words"] },
      { task: "Summarize an Academic Presentation", topic: "How a Bill Becomes Law",
        prompt: "Summarize, in your own words, how a bill becomes a law: (1) it starts as an idea/bill, (2) it must be approved by both houses of the legislature, (3) the governor signs or vetoes it, (4) if signed, it becomes law. Give a clear, connected summary.",
        points: 4, checks: ["I covered the main steps in order", "Ideas were connected", "I used my own words"] },
    ],
    writing: [
      { task: "Describe a Picture", topic: "Math class", scene: "mathclass", kind: "frame",
        stem: "Look at the picture of a math class. Write one complete sentence describing what the teacher is doing.",
        frame: "", accept: ["teacher", "explaining", "helping", "showing", "student", "problem", "solve", "teaching", "board"], minWords: 5,
        hint: "A full sentence, e.g. “The teacher is explaining how to solve a problem.”" },
      { task: "Describe a Picture", topic: "Math class", scene: "mathclass", kind: "frame",
        stem: "Look at the same picture. Write one complete sentence about what might happen next.",
        frame: "", accept: ["will", "student", "answer", "finish", "solve", "understand", "soon", "find", "learn", "they"], minWords: 4,
        hint: "Predict the future, e.g. “They will soon find the answer.”" },
      { task: "Write About an Experience", topic: "New Activity", kind: "frame",
        stem: "Write about a time you tried a new activity for the first time. What did you do, and how did it go? Write a full paragraph.",
        frame: "", accept: ["first", "time", "tried", "went", "was", "learned", "hard", "fun", "finally", "because", "when", "friend"], minWords: 15,
        hint: "Aim for 3+ sentences: what, when, how it felt, how it ended." },
      { task: "Write About Academic Information (2 of 2)", topic: "Mikhail Timeline", scene: "mikhail-timeline", kind: "frame",
        stem: "Look at the same timeline. Based on the events, explain why 1948 may have been an important year for Mikhail's career. Use at least one detail from the timeline.",
        frame: "", accept: ["1948", "california", "moved", "film", "directed", "career", "because", "closer", "movies"], minWords: 10,
        hint: "Connect the move to what happened after it." },
      { task: "Write About Academic Information (1 of 2)", topic: "Mikhail Timeline", scene: "mikhail-timeline", kind: "frame",
        stem: "A timeline shows: 1903 born in Russia · 1912 moved to New York · 1930 wrote first book · 1948 moved to California · 1952 directed a film. Using at least three details, write about the important events in Mikhail's life.",
        frame: "", accept: ["1903", "1912", "1930", "1948", "1952", "born", "russia", "moved", "york", "book", "california", "film", "directed", "wrote"], minWords: 12,
        hint: "Use at least three dates/events in complete sentences." },
      { task: "Writing — Justify an Opinion", topic: "Fall Break", kind: "frame",
        stem: "Your school is considering a two-week break in October. Do you think this is a good idea? State your position and support it with at least two reasons. (Grades 9–12: aim for six or more sentences, appropriate register.)",
        frame: "", accept: ["think", "position", "because", "first", "second", "also", "however", "students", "break", "school", "would", "reason", "although"], minWords: 25,
        hint: "Position + two developed reasons; formal tone; 6+ sentences." },
    ],
  },

  // Other grades exist in the real test too; these are stubs to be built
  // out with each grade's authentic topics (K uses Read-Along + Label a
  // Picture; 3–5 and 6–8 shift task types). Marked "coming soon" in the UI.
  k: null, g1: null, g2: null, g35: {
    listening: [
      { task: "Listen to a Short Exchange", topic: "Showed Computer Game",
        intro: "You will hear two students talk. You will hear it only once.",
        transcript: "Boy: Look — I made this computer game in club yesterday. The cat has to catch the falling stars.\nGirl: You made that yourself? Can you show me how to start one?",
        qs: [ { stem: "What did the boy show the girl?", options: ["A game he made", "A new cat", "His homework"], answer: 0 } ] },
      { task: "Listen to a Short Exchange", topic: "Read New Book",
        intro: "You will hear it only once.",
        transcript: "Girl: I finished that new mystery book last night. I could not stop reading — I had to know who took the trophy.\nBoy: Okay, okay, don't tell me the ending! I'm only on chapter two.",
        qs: [ { stem: "Why did the girl keep reading?", options: ["The book was short", "She wanted to know the ending", "Her teacher said to"], answer: 1 } ] },
      { task: "Listen to a Short Exchange", topic: "Rode Bikes and Rained",
        intro: "You will hear it only once.",
        transcript: "Boy: We rode our bikes to the park, but then it started raining hard, so we went inside the library until it stopped.\nGirl: Good idea — you would have been soaked!",
        qs: [ { stem: "Why did they go inside the library?", options: ["To get books", "Because it rained", "Because they were tired"], answer: 1 } ] },
      { task: "Listen to a Classroom Conversation", topic: "Join Computer Club",
        intro: "You will hear a teacher and a student. Only once.",
        transcript: "Student: Mr. Diaz, can I still join the computer club?\nTeacher: Of course. We meet on Wednesdays in the computer lab, right after school.\nStudent: Do I need to know how to code already?\nTeacher: Not at all — beginners are welcome. Just bring the signed permission form from the office before Wednesday.\nStudent: I will get it at lunch today!",
        qs: [
          { stem: "When does the computer club meet?", options: ["Mondays", "Wednesdays", "Fridays"], answer: 1 },
          { stem: "What must the student bring?", options: ["A laptop", "A signed permission form", "A snack"], answer: 1 },
          { stem: "Does the student need to know coding already?", options: ["Yes, a lot", "No, beginners are welcome", "Only a little"], answer: 1 },
        ] },
      { task: "Listen to a Story", topic: "Dog Trick Contest",
        intro: "Listen to a story. You will hear it only once.",
        transcript: "Ana wanted her dog Rico to win the trick contest. Every day after school, she practiced the spin trick with him, but Rico only sat and wagged his tail. The day before the contest, Ana dropped her tennis ball, and Rico spun in a happy circle chasing it. Ana laughed. At the contest, she held the ball up high — and Rico spun perfectly. The judges clapped, and Rico got a blue ribbon and a big treat.",
        qs: [
          { stem: "What trick did Ana want Rico to learn?", options: ["To spin", "To jump", "To bark"], answer: 0 },
          { stem: "What made Rico finally spin?", options: ["A treat", "Chasing the ball", "The judges"], answer: 1 },
          { stem: "How did the story end?", options: ["Rico ran away", "Rico won a ribbon", "Ana lost the ball"], answer: 1 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Evaporation",
        intro: "Listen to a teacher talk about science. Only once.",
        transcript: "Teacher: Have you noticed that puddles disappear after the rain stops? The water does not vanish — it evaporates. The sun heats the puddle, and the water turns into an invisible gas called water vapor that rises into the air. Later, high in the sky, the vapor cools and can turn into clouds. So the puddle is not gone. It is on a journey back to the sky.",
        qs: [
          { stem: "What happens to a puddle in the sun?", options: ["It freezes", "It evaporates", "It gets bigger"], answer: 1 },
          { stem: "What is water vapor?", options: ["An invisible gas", "A kind of cloud", "Cold rain"], answer: 0 },
          { stem: "What can the vapor become high in the sky?", options: ["Snowmen", "Clouds", "Wind"], answer: 1 },
        ] },
      { task: "Listen to a Story", topic: "The Bake Sale",
        intro: "Listen to a story. You will hear it only once.",
        transcript: "Room 12 wanted to visit the science center, but the bus cost money. So the class held a bake sale on Friday. Sam's dad baked lemon bars, and Tia brought banana bread. By the last bell, every single treat was gone. When Ms. Ortiz counted the money, the jar held eighty-four dollars — more than enough for the bus. The class cheered, and Tia said the banana bread sold out first.",
        qs: [
          { stem: "Why did the class hold a bake sale?", options: ["To pay for the bus", "To celebrate a birthday", "To decorate the room"], answer: 0 },
          { stem: "How much money did the class raise?", options: ["Forty-eight dollars", "Eighty-four dollars", "Twenty dollars"], answer: 1 },
          { stem: "Which treat sold out first?", options: ["Lemon bars", "Banana bread", "Cookies"], answer: 1 },
        ] },
    ],
    reading: [
      { task: "Read and Choose a Sentence", topic: "Watering Plants",
        passage: "Look at the picture: a girl is watering plants in the class garden.",
        qs: [ { stem: "Choose the sentence that matches the picture.", options: ["The girl is watering the plants.", "The girl is reading a book.", "The girl is eating lunch.", "The plants are inside a box."], answer: 0 } ] },
      { task: "Read and Choose a Sentence", topic: "Feeding Fish",
        passage: "Look at the picture: a boy is feeding the class fish one small pinch of food.",
        qs: [ { stem: "Choose the sentence that matches the picture.", options: ["The boy is feeding the fish.", "The boy is cleaning the tank.", "The fish is sleeping.", "The boy is drawing a fish."], answer: 0 } ] },
      { task: "Read a Short Informational Passage", topic: "Class Jobs",
        passage: "Our class has jobs that change every Monday. The line leader stands first when we walk to lunch. The plant helper waters the class garden. The paper monitor passes out worksheets. If you are absent on Monday, check the job chart by the door when you return.",
        qs: [
          { stem: "When do class jobs change?", options: ["Every day", "Every Monday", "Every month", "Never"], answer: 1 },
          { stem: "What does the plant helper do?", options: ["Passes out papers", "Waters the garden", "Leads the line", "Cleans the board"], answer: 1 },
          { stem: "Where can you check your job if you were absent?", options: ["The office", "The job chart by the door", "The library", "Online"], answer: 1 },
        ] },
      { task: "Read a Student Essay", topic: "Computer Club",
        passage: "(A student wrote this for class. Read it and answer the questions.) “Our school should start a computer club. First, many students want to learn to make games, but there is no place to learn together. Second, the computer lab are empty every day after school, so the room is already there. Some people say clubs cost money, but our teacher said she would volunteer her time. A computer club would help students learn something new for free.”",
        qs: [
          { stem: "What does the writer want?", options: ["New computers", "A computer club", "Less homework", "A bigger lab"], answer: 1 },
          { stem: "Which sentence has a grammar error?", options: ["“The computer lab are empty every day…”", "“Our school should start…”", "“Our teacher said she would volunteer…”", "“A computer club would help…”"], answer: 0 },
          { stem: "How does the writer answer people who say clubs cost money?", options: ["Ignores them", "Says the teacher will volunteer", "Says money doesn't matter", "Asks for donations"], answer: 1 },
          { stem: "Which sentence states the writer's opinion?", options: ["'Our school should start a computer club.'", "'The room is already there.'", "'Many students want to learn.'", "'Our teacher said she would volunteer.'"], answer: 0 },
          { stem: "'The room is already there' supports the idea that the club would be…", options: ["easy to start", "very loud", "far away", "expensive"], answer: 0 },
          { stem: "The BEST fix for 'the computer lab are empty' is…", options: ["the computer lab is empty", "the computer labs is empty", "the computer lab were empty", "the computers lab are empty"], answer: 0 },
        ] },
      { task: "Read a Literary Passage", topic: "Dumpling Day",
        passage: "Every New Year, Mei's grandmother made dumplings, and every year Mei's dumplings fell apart in the pot. “Too much filling,” Grandma would say, smiling. This year, Mei watched Grandma's hands closely — a small spoonful, a gentle fold, a firm pinch. Mei's first three dumplings still opened in the water. But the fourth one held. Grandma lifted it out and put it in Mei's bowl. “The first one that holds,” she said, “always tastes the best.”",
        qs: [
          { stem: "What problem did Mei have every year?", options: ["Her dumplings fell apart", "She was late", "She disliked dumplings", "Grandma forgot the recipe"], answer: 0 },
          { stem: "How did Mei learn to do it right?", options: ["From a book", "By watching Grandma's hands", "By guessing", "From a video"], answer: 1 },
          { stem: "What does Grandma's last line mean?", options: ["The fourth dumpling was biggest", "Success after trying feels special", "Mei should stop cooking", "Dumplings taste better cold"], answer: 1 },
          { stem: "Why did Grandma smile when the dumplings fell apart?", options: ["She was patient and kind", "She liked broken dumplings", "She was laughing at Mei", "She wasn't paying attention"], answer: 0 },
          { stem: "'Mei watched Grandma's hands closely' shows that Mei…", options: ["was learning carefully", "was bored", "was hungry", "was scared"], answer: 0 },
          { stem: "What lesson does the story teach?", options: ["Keep trying and learn from others", "Never cook with family", "Fillings don't matter", "New Year is the best holiday"], answer: 0 },
        ] },
      { task: "Read an Informational Passage", topic: "The Three Rs",
        passage: "You can help the Earth with the three Rs: reduce, reuse, and recycle. Reduce means using less — like taking shorter showers or turning off lights you don't need. Reuse means using things again — a water bottle can be refilled many times, and a jar can hold pencils. Recycle means turning old things into new things — paper, cans, and plastic bottles can be made into new products instead of going to a landfill. Small choices, made every day, add up to a big difference.",
        qs: [
          { stem: "What does ‘reduce’ mean?", options: ["Using less", "Buying more", "Throwing away", "Washing things"], answer: 0 },
          { stem: "Which is an example of reusing?", options: ["Refilling a water bottle", "Taking long showers", "Buying new jars", "Using more paper"], answer: 0 },
          { stem: "The passage says small choices…", options: ["do not matter", "add up to a big difference", "are only for adults", "cost a lot"], answer: 1 },
          { stem: "Which R means turning old things into new things?", options: ["Recycle", "Reduce", "Reuse", "Return"], answer: 0 },
          { stem: "A jar holding pencils is an example of…", options: ["reusing", "reducing", "recycling", "wasting"], answer: 0 },
        ] },
    ],
    speaking: [
      { task: "Talk about a Scene (1 of 4)", topic: "Looking at a Map", scene: "map",
        prompt: "Look at the picture. What is the boy doing?",
        points: 1, checks: ["A full sentence about the boy"] },
      { task: "Talk about a Scene (2 of 4)", topic: "Looking at a Map", scene: "map",
        prompt: "What else do you see in the picture? Name two things.",
        points: 1, checks: ["I named two things"] },
      { task: "Talk about a Scene (3 of 4)", topic: "Looking at a Map", scene: "map",
        prompt: "What do you think the class will do next?",
        points: 1, checks: ["I used 'will' to predict"] },
      { task: "Talk about a Scene (4 of 4)", topic: "Looking at a Map", scene: "map",
        prompt: "Tell about a time you used a map or found a new place. What happened?",
        points: 1, checks: ["Past tense", "What happened"] },
      { task: "Speech Functions", topic: "Repeat Directions",
        prompt: "You did not hear the directions for the worksheet. What would you say to your teacher?",
        points: 1, checks: ["I asked politely", "My question was clear"] },
      { task: "Speech Functions", topic: "Join a Game",
        prompt: "At recess, some kids are playing a game you want to join. What do you say to them?",
        points: 1, checks: ["Friendly and clear"] },
      { task: "Support an Opinion", topic: "Class Reward",
        prompt: "Your class earned a reward: extra recess or a movie afternoon. Which should the class choose? Say your opinion and give a reason.",
        points: 2, checks: ["I gave a clear opinion", "I gave a reason with ‘because’", "I spoke in full sentences"] },
      { task: "Support an Opinion", topic: "Fish or Bird",
        prompt: "Should the class pet be a fish or a bird? Say your opinion and give one reason.",
        points: 2, checks: ["A clear choice", "A reason with 'because'"] },
      { task: "Retell a Narrative", topic: "Dog Trick Contest",
        prompt: "Retell the story about Ana and her dog Rico. Tell what happened first, next, and last.",
        points: 4, checks: ["Beginning, middle, and end", "Events in order", "Full sentences"] },
      { task: "Summarize an Academic Presentation", topic: "Evaporation",
        prompt: "Tell a friend what you learned about evaporation: what happens to a puddle, and where the water goes.",
        points: 4, checks: ["I explained evaporation", "I said where the water goes", "My own words"] },
    ],
    writing: [
      { task: "Describe a Picture", topic: "Looking at a Map", scene: "map", kind: "frame",
        stem: "Look at the picture of students at the map. Write one complete sentence about what the boy is doing.",
        frame: "", accept: ["boy", "points", "pointing", "map", "looking", "shows", "showing", "touches"], minWords: 4,
        hint: "One full sentence, e.g. about the boy and the map." },
      { task: "Describe a Picture", topic: "Looking at a Map", scene: "map", kind: "frame",
        stem: "Look at the same picture. Write one complete sentence about what might happen next.",
        frame: "", accept: ["will", "next", "class", "students", "teacher", "then", "go", "learn", "find"], minWords: 4,
        hint: "Use ‘will’ to tell the future." },
      { task: "Write About an Experience", topic: "Favorite Celebration", kind: "frame",
        stem: "Write about a favorite celebration you remember — a birthday, a holiday, or a special day. What happened, and why was it special? Write at least two sentences.",
        frame: "", accept: ["birthday", "holiday", "family", "celebrated", "went", "ate", "played", "because", "special", "favorite", "happy", "year"], minWords: 12,
        hint: "Past tense; say what happened AND why it was special." },
      { task: "Write About Academic Information (2 of 2)", topic: "Three Rs", kind: "frame",
        stem: "Pick ONE way from the chart and write one sentence explaining how it helps the Earth.",
        frame: "", accept: ["showers", "bags", "lights", "bottles", "water", "energy", "trash", "helps", "saves", "because"], minWords: 6,
        hint: "'Taking short showers helps because…'" },
      { task: "Write About Academic Information (1 of 2)", topic: "Three Rs", kind: "frame",
        stem: "A chart lists ways to use fewer resources: take short showers · bring bags to the store · turn off lights · refill water bottles. Using details from the chart, write about how people can use fewer resources. Write at least one sentence.",
        frame: "", accept: ["showers", "bags", "lights", "bottles", "short", "turn", "off", "refill", "fewer", "resources", "reuse", "reduce"], minWords: 8,
        hint: "Use at least two details from the chart." },
      { task: "Justify an Opinion", topic: "Homework Every Day", kind: "frame",
        stem: "Some people think students should have homework every day. Others disagree. What do you think? State your opinion and support it with at least one reason.",
        frame: "", accept: ["homework", "think", "because", "students", "learn", "practice", "time", "play", "family", "should", "every", "tired"], minWords: 12,
        hint: "Opinion + ‘because…’ + a detail." },
    ],
  }, g68: {
    listening: [
      { task: "Listen to a Short Exchange", topic: "Study Group",
        intro: "You will hear two students talk. You will hear it only once.",
        transcript: "Girl: A few of us are starting a study group for the science test — we're meeting in the library after school on Thursday.\nBoy: Count me in. Should I bring my notes from the cells unit?\nGirl: Yes — especially the diagram Ms. Park drew. Nobody else copied it down.",
        qs: [ { stem: "Why should the boy bring his notes?", options: ["He has the diagram nobody else copied", "The library requires notes", "The girl lost her backpack"], answer: 0 } ] },
      { task: "Listen to a Short Exchange", topic: "History Project",
        intro: "You will hear it only once.",
        transcript: "Boy: I finished the timeline for our history project, but it looks plain — just dates and lines.\nGirl: I found old photos from the library database last night. If you send me the file, I can add them tonight.",
        qs: [ { stem: "What will the girl add to the timeline?", options: ["More dates", "Old photos", "A new title"], answer: 1 } ] },
      { task: "Listen to a Short Exchange", topic: "Fraction Homework",
        intro: "You will hear it only once.",
        transcript: "Boy: I'm stuck on the fraction homework. Number four wants me to add one-third and one-fourth, and I keep getting different answers.\nGirl: You can't add them until the bottoms match. Find a common denominator first — twelve works for both.",
        qs: [ { stem: "What does the girl say to do first?", options: ["Find a common denominator", "Add the top numbers", "Skip number four"], answer: 0 } ] },
      { task: "Listen to a Classroom Conversation", topic: "Soccer Practice",
        intro: "You will hear a coach and a student. Only once.",
        transcript: "Student: Coach, is practice still on today? It rained all morning.\nCoach: Yes, but we're moving to the gym — the field is too muddy.\nStudent: Should I still bring my cleats?\nCoach: No cleats indoors; they scratch the floor. Wear regular sneakers today. And remind everyone the scrimmage is still Friday, on the field if it dries out.\nStudent: Got it. I'll tell the group chat.",
        qs: [
          { stem: "Why is practice moving to the gym?", options: ["The field is muddy", "The gym is closer", "The coach is late"], answer: 0 },
          { stem: "What should players wear today?", options: ["Cleats", "Regular sneakers", "Boots"], answer: 1 },
          { stem: "What is happening on Friday?", options: ["A scrimmage", "No practice", "A test"], answer: 0 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Echolocation",
        intro: "You will hear part of a student presentation. Only once.",
        transcript: "Student: Bats can hunt in total darkness, and it's not because they see well. They use echolocation. A bat sends out a very high sound — too high for us to hear — and the sound bounces off objects and returns as an echo. From how long the echo takes and how it changed, the bat's brain builds a picture of what's around it: a wall, a branch, or a moth to catch. In a way, bats see with sound.",
        qs: [
          { stem: "How does a bat find objects in the dark?", options: ["With sharp eyes", "By sending sounds and hearing echoes", "By smelling them"], answer: 1 },
          { stem: "Why can't humans hear the bat's sound?", options: ["It is too quiet", "It is too high", "It is too fast"], answer: 1 },
          { stem: "‘Bats see with sound’ means…", options: ["bats have sound-shaped eyes", "echoes give bats a picture of their surroundings", "bats are blind and lost"], answer: 1 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "School Garden",
        intro: "You will hear one student supporting an opinion. Only once.",
        transcript: "Student: I believe our school should build a garden in the empty courtyard. Science classes could run real experiments there instead of only reading about plants, and the cafeteria could serve what we grow. Some say we don't have anyone to care for it over the summer — that's a fair concern. But the community center next door already runs a summer program, and they've offered to water it. The space is sitting empty. Let's grow something in it.",
        qs: [
          { stem: "What does the speaker want?", options: ["A bigger cafeteria", "A school garden in the courtyard", "A new science lab"], answer: 1 },
          { stem: "Which reason does the speaker give?", options: ["Science classes could do real experiments", "Gardens are cheap", "Teachers want it"], answer: 0 },
          { stem: "How does the speaker answer the summer-care problem?", options: ["Says it isn't real", "The community center offered to water it", "Students will come in summer"], answer: 1 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Monarch Migration",
        intro: "You will hear part of a science presentation. Only once.",
        transcript: "Student: Every fall, monarch butterflies fly up to three thousand miles from Canada and the United States to the same forests in Mexico. Here's the astonishing part: no single butterfly makes the round trip. The monarchs that fly south have never been to Mexico — yet they find the exact same groves their great-grandparents used. Scientists believe they navigate using the position of the sun, guided by instructions written in their genes rather than memory.",
        qs: [
          { stem: "How far can monarchs fly in the fall?", options: ["Three hundred miles", "Up to three thousand miles", "Thirty miles"], answer: 1 },
          { stem: "What is astonishing about the trip?", options: ["No single butterfly makes the round trip", "The butterflies fly at night", "They stop in every state"], answer: 0 },
          { stem: "How do scientists think monarchs navigate?", options: ["By memory of past trips", "By the sun and instructions in their genes", "By following birds"], answer: 1 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "Homework-Free Weekends",
        intro: "You will hear one student supporting an opinion. Only once.",
        transcript: "Student: I think our school should try homework-free weekends. Students need real rest to learn well, and weekends are the only time many of us see family or play sports. I know teachers worry we'll fall behind on practice — that's a fair point. But practice could be assigned Monday through Thursday instead, so nothing is lost. A middle school nearby tried this, and homework completion during the week actually went up.",
        qs: [
          { stem: "What does the speaker want?", options: ["No homework ever", "Homework-free weekends", "Longer weekends"], answer: 1 },
          { stem: "What fair point does the speaker admit?", options: ["Teachers worry students will fall behind on practice", "Weekends are boring", "Homework is easy"], answer: 0 },
          { stem: "What happened at the nearby school?", options: ["Grades dropped", "Weekday homework completion went up", "Students slept in class"], answer: 1 },
        ] },
    ],
    reading: [
      { task: "Read a Short Informational Passage", topic: "Club Fair",
        passage: "The fall club fair is next Tuesday during both lunch periods in the main hallway. Every club will have a table with a sign-up sheet, and many will have demonstrations — the robotics club is bringing last year's competition robot. You may join as many clubs as you like, but most clubs begin meeting the following week, so check for schedule conflicts before signing up for two clubs that meet on the same day.",
        qs: [
          { stem: "When is the club fair?", options: ["Next Tuesday at lunch", "Friday after school", "Next month", "Tonight"], answer: 0 },
          { stem: "What is the robotics club bringing?", options: ["Free snacks", "Last year's competition robot", "A movie", "New members"], answer: 1 },
          { stem: "Why should students check schedules before signing up?", options: ["Clubs cost money", "Two clubs might meet the same day", "The fair is short", "Sign-ups close early"], answer: 1 },
        ] },
      { task: "Read a Short Informational Passage", topic: "Locker Cleanout",
        passage: "All lockers must be emptied by Friday at 3:00 p.m. for summer cleaning. Take home everything, including locks — any lock still on a locker Friday afternoon will be cut off and thrown away. Items left inside go to the lost and found, and anything unclaimed after two weeks will be donated.",
        qs: [
          { stem: "What happens to locks left on Friday afternoon?", options: ["They are stored", "They are cut off and thrown away", "They are sold", "They are mailed home"], answer: 1 },
          { stem: "What happens to unclaimed items after two weeks?", options: ["They are donated", "They are thrown away", "They are returned", "They are auctioned"], answer: 0 },
        ] },
      { task: "Read a Student Essay", topic: "Recycling Program",
        passage: "(Read a classmate's draft and answer the questions.) “Our school should start a real recycling program. Right now, everything go into the same trash bins, even paper and bottles that could be recycled. Other schools in our district has cut their trash in half with simple labeled bins. Some students say nobody will sort their trash correctly, however clear signs with pictures would solve most mistakes. Starting a program would be cheap, easy, and good for our community.”",
        qs: [
          { stem: "What is the writer proposing?", options: ["New trash cans", "A recycling program", "Cleaning the halls", "A district contest"], answer: 1 },
          { stem: "Which phrase contains a subject-verb error?", options: ["“everything go into the same trash bins”", "“clear signs with pictures”", "“good for our community”", "“starting a program would be cheap”"], answer: 0 },
          { stem: "“Other schools in our district has cut…” should read…", options: ["have cut", "has cutted", "is cutting", "cut has"], answer: 0 },
          { stem: "How does the writer answer the sorting objection?", options: ["Clear signs with pictures", "Hiring workers", "Ignoring it", "Fining students"], answer: 0 },
          { stem: "The sentence with 'however' would be BEST fixed by…", options: ["'…their trash correctly; however, clear signs…'", "deleting 'clear signs'", "moving 'however' to the start of the essay", "changing 'however' to 'and'"], answer: 0 },
          { stem: "Why does the writer mention other schools in the district?", options: ["To show the idea already works nearby", "To criticize them", "To ask for money", "To describe their mascots"], answer: 0 },
          { stem: "The word 'real' in the first sentence suggests…", options: ["the current effort isn't a true program", "recycling is imaginary", "the school is fake", "bins are expensive"], answer: 0 },
          { stem: "The final sentence mainly works to…", options: ["sum up the benefits memorably", "add a brand-new argument", "quote an expert", "list the costs"], answer: 0 },
        ] },
      { task: "Read a Literary Passage", topic: "The Relay",
        passage: "Dev was the fastest runner on the relay team, so nobody understood why Coach put him third instead of last. “The anchor gets the glory,” his teammate said. At the meet, their second runner stumbled on the exchange and fell behind by ten meters. Dev took the baton in fifth place and ran the race of his life — not to finish, but to give their anchor a fighting chance. They won by half a step. Afterward, Coach clapped Dev's shoulder. “Now you know why you ran third. The anchor finishes the race. The third leg saves it.”",
        qs: [
          { stem: "Why was everyone surprised by Coach's decision?", options: ["Dev was slow", "The fastest runner usually runs last", "Dev was injured", "The team was new"], answer: 1 },
          { stem: "What happened during the race?", options: ["Dev dropped the baton", "The second runner fell behind", "The meet was canceled", "Dev ran last"], answer: 1 },
          { stem: "What does Coach's final line mean?", options: ["Anchors are unimportant", "The third runner's job is to rescue the race", "Dev should run anchor next time", "Glory matters most"], answer: 1 },
          { stem: "'Ran the race of his life' means Dev…", options: ["ran his very best", "ran for a long life", "was running from danger", "jogged slowly"], answer: 0 },
          { stem: "'Not to finish, but to give their anchor a fighting chance' shows Dev ran…", options: ["for the team, not for glory", "to break a record", "because Coach yelled", "to tire out the anchor"], answer: 0 },
          { stem: "The story suggests Coach put Dev third because Coach…", options: ["planned for things going wrong", "disliked Dev", "forgot the order", "lost a bet"], answer: 0 },
        ] },
      { task: "Read an Informational Passage", topic: "Roman Aqueducts",
        passage: "Ancient Rome grew far larger than its local wells could support, so Roman engineers built aqueducts — channels that carried water from distant hills into the city. The remarkable part is what powered them: nothing but gravity. Engineers designed each channel to drop only a few centimeters every hundred meters, a slope gentle enough to keep water flowing smoothly for dozens of kilometers without pumps. Some aqueducts ran underground; the famous arched bridges appeared only where a valley had to be crossed. Parts of the system worked so well that a few sections still carry water today, two thousand years later.",
        qs: [
          { stem: "Why did Rome need aqueducts?", options: ["Wells could not support the growing city", "Rivers were dangerous", "Romans liked bridges", "Rain was illegal"], answer: 0 },
          { stem: "What powered the water's movement?", options: ["Pumps", "Gravity", "Slaves", "Wind"], answer: 1 },
          { stem: "The arched bridges were built…", options: ["everywhere", "only where valleys had to be crossed", "underground", "for decoration"], answer: 1 },
          { stem: "'The remarkable part' signals that the author finds gravity power…", options: ["impressive", "boring", "dangerous", "confusing"], answer: 0 },
          { stem: "Why was the gentle slope important?", options: ["It kept water flowing smoothly for long distances", "It made bridges cheaper", "It stopped floods", "It hid the channels"], answer: 0 },
          { stem: "The fact that some sections still work today supports the idea that…", options: ["Roman engineering was excellent", "Rome still rules", "water was cleaner then", "pumps are useless"], answer: 0 },
        ] },
    ],
    speaking: [
      { task: "Talk about a Scene (1 of 4)", topic: "Science Fair", scene: "sciencefair",
        prompt: "Look at the picture. What is happening at the tables?",
        points: 1, checks: ["I described the tables in full sentences"] },
      { task: "Talk about a Scene (2 of 4)", topic: "Science Fair", scene: "sciencefair",
        prompt: "Describe the person with the clipboard. What is that person probably doing?",
        points: 1, checks: ["I described the person", "I made a reasonable guess"] },
      { task: "Talk about a Scene (3 of 4)", topic: "Science Fair", scene: "sciencefair",
        prompt: "What do you think will happen next at this event? Why?",
        points: 1, checks: ["A prediction", "A reason for it"] },
      { task: "Talk about a Scene (4 of 4)", topic: "Science Fair", scene: "sciencefair",
        prompt: "Tell about a time you showed or presented something you made. What was it, and how did it go?",
        points: 1, checks: ["Past tense", "What it was and how it went"] },
      { task: "Speech Functions", topic: "Library Sources",
        prompt: "You need help finding sources for your history project. What would you say to the librarian?",
        points: 1, checks: ["I asked politely", "I said what I need help with"] },
      { task: "Speech Functions", topic: "Borrow a Calculator",
        prompt: "You forgot your calculator on the day of the math test. What would you say to your teacher?",
        points: 1, checks: ["Polite ask", "Explained the situation briefly"] },
      { task: "Support an Opinion", topic: "Field Trip",
        prompt: "Your grade can take one field trip: a science museum or a historical site. Which should it be? State your opinion and justify it with at least one reason and explanation.",
        points: 2, checks: ["Clear opinion", "Reason WITH explanation", "Fairly smooth speech"] },
      { task: "Support an Opinion", topic: "Music or PE Elective",
        prompt: "Your school can add one elective: music or extra PE. Which should it add? State your opinion with a reason and explanation.",
        points: 2, checks: ["Clear opinion", "Reason with explanation"] },
      { task: "Present and Discuss Information", topic: "Club Membership", scene: "barclubs",
        prompt: "Look at the bar graph of after-school club membership. Point 1: Describe what the graph shows. Point 2: A student claims ‘the art club is the biggest club.’ Using the graph, is that claim supported? Explain.",
        points: 3, checks: ["Accurate description of the bars", "Judged the claim using the data", "Fairly smooth speech"] },
      { task: "Summarize an Academic Presentation", topic: "Echolocation",
        prompt: "Summarize the echolocation presentation in your own words: what bats send out, what comes back, and what their brain does with it.",
        points: 4, checks: ["All three parts covered", "Ideas connected in order", "My own words"] },
      { task: "Summarize an Academic Presentation", topic: "Monarch Migration",
        prompt: "Summarize the monarch presentation: where the butterflies go, why the trip is astonishing, and how scientists think they navigate.",
        points: 4, checks: ["All three parts", "Connected sentences", "Own words"] },
    ],
    writing: [
      { task: "Describe a Picture", topic: "Soccer Practice", kind: "choice",
        stem: "A classmate wrote about a picture of soccer practice: “The players practice in the gym. The field is too wet.” Choose the BEST way to combine the sentences.",
        options: ["The players practice in the gym because the field is too wet.", "The players practice in the gym, the field is too wet.", "Because the players practice in the gym, the field is wet.", "The field practices in the gym because it is wet."], answer: 0 },
      { task: "Write About an Experience", topic: "Prepared for Something", kind: "frame",
        stem: "Write about a time you prepared for something important — a test, a game, a performance. What did you do to prepare, and how did it turn out? Write a paragraph of at least three sentences.",
        frame: "", accept: ["prepared", "practiced", "studied", "before", "every", "finally", "because", "ready", "nervous", "learned", "worked", "result"], minWords: 18,
        hint: "Past tense; steps you took + the result." },
      { task: "Write About Academic Information (2 of 2)", topic: "Race", kind: "frame",
        stem: "Look at the same organizer about Blake. Using at least one detail, write one or two sentences of advice for a runner who wants to win a race.",
        frame: "", accept: ["should", "bed", "early", "breakfast", "warm", "arrive", "prepare", "practice", "advice", "before"], minWords: 10,
        hint: "Turn Blake's steps into advice: 'You should…'" },
      { task: "Write About Academic Information (1 of 2)", topic: "Race", kind: "frame",
        stem: "A graphic organizer about a student named Blake shows: went to bed early the night before · ate a healthy breakfast · arrived early to warm up → result: won first place in the race. A classmate says Blake was just lucky. Using details from the organizer, explain whether Blake was lucky. Write at least three sentences.",
        frame: "", accept: ["blake", "lucky", "prepared", "bed", "early", "breakfast", "warm", "because", "first", "place", "won", "result"], minWords: 18,
        hint: "Use at least two details; connect them with ‘so’ or ‘as a result’." },
      { task: "Justify an Opinion", topic: "Longer School Day", kind: "frame",
        stem: "Some people think the school day should be longer. Others disagree. What is your position? State it and support it with at least two reasons. Write at least three sentences.",
        frame: "", accept: ["school", "day", "longer", "because", "think", "students", "learn", "time", "tired", "also", "however", "believe"], minWords: 20,
        hint: "Position + two reasons; connect with ‘also’ or ‘in addition’." },
    ],
  }, g1112: null,
};


// ██ PICTURE PROMPTS ██ — scenes that still need a real image.
// Generate each with an AI image tool, then send it to Claude to embed.
// Any scene key present in SCENE_PHOTOS above overrides this placeholder.
const SCENE_PROMPTS = {
  // ---- Grades 3–5 ----
  "s1-35-rc-living-room": "A bright family living room. A girl about 9 sits on a couch reading a book. A cat sleeps curled on the rug. A lamp glows on a side table. Simple, clear, illustration style.",
  "s1-35-rc-recess-play": "A school playground at recess. Several children play: two on swings, two kicking a ball, one going down a slide. Sunny day, clear and uncluttered.",
  "s1-35-dp-map": "An elementary classroom. A boy stands pointing at a large world map on the wall. Three other children sit watching. A teacher stands to the side. Clear and simple.",
  "s1-35-sp-paper-animals": "An elementary art table. Four children make paper animals with colored paper and safety scissors. One child holds up a finished paper elephant, smiling.",
  "s2-35-rc-kitchen": "A home kitchen in the morning. A boy about 9 pours cereal from a box into a bowl on the counter. A glass of juice sits nearby. Warm, simple illustration.",
  "s2-35-rc-bus-stop": "Children standing at a school bus stop on a sidewalk with backpacks, waiting. A yellow school bus approaches in the distance. Morning light.",
  "s2-35-sp-garden": "A school garden with raised beds. A girl waters small green plants with a watering can. Two other students kneel planting seedlings. Sunny, cheerful.",
  "s3-35-rc-art-class": "An elementary art classroom. A girl paints a colorful picture at an easel, brush in hand, paint jars beside her. Other students work in the background.",
  "s3-35-rc-rainy-window": "A boy about 10 sits at a window indoors, chin in hand, looking out at heavy rain falling on a schoolyard. Cozy indoor light.",
  "s3-35-sp-market": "An outdoor farmers market stall. A woman behind a table of fresh vegetables and fruit hands a paper bag to a parent while a child points at apples.",
  // ---- Grades 6–8 ----
  "s1-68-dp-bus": "Middle school students boarding a yellow school bus in the morning. One student with a backpack steps up onto the bus. The driver sits at the wheel. Others wait in line.",
  "s1-68-sp-photography": "A middle school photography club. A student adjusts a camera on a tripod. Two other students look at printed photographs spread on a table. Bright classroom.",
  "s2-68-sp-robotics": "A middle school robotics lab. Three students work together on a small wheeled robot on a workbench. One holds a laptop, one holds a screwdriver, parts scattered nearby.",
  "s3-68-sp-garden": "A community garden. Several people of different ages work together among raised vegetable beds. One waters, one kneels planting, one carries a crate of produce.",
};

// Graph/chart scenes drawn in code (no photo needed): linegraph, barclubs,
// s1-68-graph-travel, s2-68-graph-clubs, s3-68-graph-reading

// ██ PRACTICE SET 2 ██ — same task-type structure, all-new topics.
const BANK2 = {
  g910: {
    listening: [
      { task: "Listen to a Short Exchange", topic: "Printer Jam",
        intro: "You will hear two students. Only once.",
        transcript: "Girl: The lab printer says paper jam again, and my essay is due next period.\nBoy: The tray sticks — ask the lab aide, she has the key to open the side panel.",
        qs: [ { stem: "What does the boy suggest?", options: ["Buying a new printer", "Asking the lab aide", "Skipping the essay"], answer: 1 } ] },
      { task: "Listen to a Short Exchange", topic: "Bus Pass",
        intro: "Only once.",
        transcript: "Boy: I left my bus pass at home. Do you think the driver will let me on?\nGirl: Go to the front office first — they print a one-day pass if you ask before last bell.",
        qs: [ { stem: "What should the boy do?", options: ["Walk home", "Get a one-day pass from the office", "Borrow her pass"], answer: 1 } ] },
      { task: "Listen to a Short Exchange", topic: "Group Chat",
        intro: "Only once.",
        transcript: "Girl: Did you see the group chat? Presentation order changed — we go second now, not last.\nBoy: Second?! Okay, I'll print our handouts tonight instead of tomorrow morning.",
        qs: [ { stem: "Why will the boy print tonight?", options: ["The printer breaks mornings", "Their group presents earlier now", "He lost the handouts"], answer: 1 } ] },
      { task: "Listen to a Classroom Conversation", topic: "Yearbook Photos",
        intro: "A teacher and a student. Only once.",
        transcript: "Student: I was absent on picture day. Can I still be in the yearbook?\nTeacher: Yes — retakes are Thursday morning in the gym, before first period.\nStudent: Do I need anything?\nTeacher: Bring the order form your family filled out, and remember: no hats in the photo, school rule.\nStudent: Got it. Thursday, gym, form, no hat.",
        qs: [
          { stem: "When are photo retakes?", options: ["Thursday morning", "Friday at lunch", "Next month"], answer: 0 },
          { stem: "What must the student bring?", options: ["A hat", "The order form", "A pencil"], answer: 1 },
          { stem: "What is not allowed in the photo?", options: ["Smiling", "Hats", "Glasses"], answer: 1 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Anglerfish",
        intro: "Part of a science presentation. Only once.",
        transcript: "Student: Deep-sea anglerfish live where sunlight never reaches, so they bring their own light. A rod on the female's head ends in a glowing lure, lit by bacteria that live inside it. Small fish swim toward the glow, thinking it's food — and become food themselves. The bacteria get a safe home; the anglerfish gets dinner delivered. Scientists call this kind of partnership symbiosis: two species surviving better together than either could alone.",
        qs: [
          { stem: "What makes the lure glow?", options: ["Bacteria living inside it", "Moonlight", "Electricity"], answer: 0 },
          { stem: "Why do small fish approach?", options: ["They think the glow is food", "They are lost", "They like the dark"], answer: 0 },
          { stem: "'Symbiosis' here means…", options: ["two species surviving better together", "a kind of light", "deep-sea pressure"], answer: 0 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "The Dust Bowl",
        intro: "Part of a history presentation. Only once.",
        transcript: "Student: In the 1930s, the southern Great Plains became known as the Dust Bowl. Years of drought met years of over-plowing: farmers had stripped away the native grasses whose roots held the soil down. With nothing anchoring it, the dry earth lifted into the wind. Dust storms buried fences and darkened skies for days, and hundreds of thousands of families abandoned their farms and moved west in search of work.",
        qs: [
          { stem: "What two causes combined to create the Dust Bowl?", options: ["Drought and over-plowing", "Floods and fires", "Insects and disease"], answer: 0 },
          { stem: "What had held the soil down before?", options: ["Fences", "Native grasses' roots", "Snow"], answer: 1 },
          { stem: "What did many families do?", options: ["Built taller fences", "Moved west for work", "Planted more wheat"], answer: 1 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "First Aid Training",
        intro: "A student gives an opinion. Only once.",
        transcript: "Student: Our school should teach basic first aid to every student. Emergencies don't wait for adults — a classmate choking or fainting needs help in seconds, and knowing what to do turns panic into action. Some say there's no room in the schedule, and schedules are genuinely tight. But a nearby school fit the training into two weeks of PE and certified over two hundred students without cutting anything else.",
        qs: [
          { stem: "What is the speaker's opinion?", options: ["PE should be longer", "Every student should learn basic first aid", "Schools need more nurses"], answer: 1 },
          { stem: "Why does the speaker say the training matters?", options: ["Emergencies need help in seconds", "It is fun", "It replaces homework"], answer: 0 },
          { stem: "How is the schedule objection answered?", options: ["A nearby school fit it into two weeks of PE", "By canceling PE", "By ignoring it"], answer: 0 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "Nutrition Info",
        intro: "A student gives an opinion. Only once.",
        transcript: "Student: The cafeteria should post nutrition information next to every menu item. Students with allergies or training diets currently have to guess what's in their food, and guessing is how mistakes happen. Some worry the signs would make lunch feel like a science class — a fair concern. But the signs can be small and optional to read: information for those who need it, invisible to those who don't. One card per dish is all it takes.",
        qs: [
          { stem: "What does the speaker want posted?", options: ["Sports scores", "Nutrition information", "Lunch prices"], answer: 1 },
          { stem: "Who does the speaker say guessing harms?", options: ["Students with allergies or training diets", "The cooks", "Teachers"], answer: 0 },
          { stem: "How is the 'science class' worry answered?", options: ["Signs can be small and optional to read", "Lunch will be canceled", "Science is good"], answer: 0 },
        ] },
    ],
    reading: [
      { task: "Read a Short Informational Passage", topic: "Parking Permits",
        passage: "Student parking permits for next semester go on sale Monday in the front office. Bring your license, proof of insurance, and fifteen dollars. Permits are assigned by lot: seniors may choose any lot, while juniors are limited to Lot C. Cars without a visible permit after the first week will be ticketed.",
        qs: [
          { stem: "Which lot may juniors use?", options: ["Any lot", "Lot C", "The teachers' lot", "The gym lot"], answer: 1 },
          { stem: "What happens to cars without visible permits after week one?", options: ["They are towed instantly", "They are ticketed", "Nothing", "They are washed"], answer: 1 },
        ] },
      { task: "Read a Short Informational Passage", topic: "Photosynthesis",
        passage: "Photosynthesis is how plants make their own food. Inside leaf cells, chlorophyll captures sunlight and uses that energy to combine water from the roots with carbon dioxide from the air. The products are glucose — sugar the plant uses for energy and growth — and oxygen, which the plant releases. Nearly every food chain on Earth begins with this quiet chemistry inside a leaf.",
        qs: [
          { stem: "What captures the sunlight?", options: ["Roots", "Chlorophyll", "Glucose", "Oxygen"], answer: 1 },
          { stem: "Which two ingredients are combined?", options: ["Water and carbon dioxide", "Sugar and oxygen", "Soil and rain", "Light and heat"], answer: 0 },
          { stem: "The last sentence suggests photosynthesis is…", options: ["the foundation of most food chains", "rare", "only in trees", "loud"], answer: 0 },
        ] },
      { task: "Read a Student Essay", topic: "Peer Tutoring",
        passage: "(Read a classmate's draft and answer the questions.) “Our school should launch a peer tutoring program. First, students often explains ideas in ways other students understand, because they just learned the material themselves. Second, tutoring looks strong on college applications, so tutors benefit too. Some argue that peer tutors make mistakes, however teachers could review the tutors' plans once a week. The library sits half-empty every day after school, so the space already exists. For this reasons, peer tutoring deserves a chance.”",
        qs: [
          { stem: "What is the writer proposing?", options: ["A peer tutoring program", "A new library", "Fewer applications", "More teachers"], answer: 0 },
          { stem: "Which phrase has a subject-verb error?", options: ["“students often explains ideas”", "“the space already exists”", "“tutors benefit too”", "“teachers could review”"], answer: 0 },
          { stem: "The sentence with 'however' would be BEST fixed by…", options: ["“…make mistakes; however, teachers could review…”", "deleting 'teachers'", "moving 'however' to the end", "changing it to 'but however'"], answer: 0 },
          { stem: "“For this reasons” should read…", options: ["For these reasons", "For this reason's", "For that reasons", "For a reasons"], answer: 0 },
          { stem: "Why does the writer mention the half-empty library?", options: ["The space for tutoring already exists", "Libraries are boring", "Books are cheap", "To criticize the librarian"], answer: 0 },
          { stem: "How do the tutors themselves benefit?", options: ["Tutoring strengthens college applications", "They skip class", "They get paid", "They avoid homework"], answer: 0 },
          { stem: "'They just learned the material themselves' supports which idea?", options: ["Students explain in ways peers understand", "Teachers forget material", "The material is new", "Tutors are older"], answer: 0 },
          { stem: "The final sentence works as…", options: ["a closing appeal", "a new argument", "a statistic", "a quotation"], answer: 0 },
        ] },
      { task: "Read a Literary Passage", topic: "The Substitute",
        passage: "When Priya's debate partner texted “flu, can't make it,” one hour before the tournament, Priya nearly withdrew. Their case was built for two voices; she had never delivered his half. On the bus she read his notes until the margins blurred, whispering his arguments under her breath. In the round, she stumbled once on his opening — then heard, in her memory, exactly how he always phrased the next line, and followed it home. They took second place. “You memorized me,” he laughed later. “No,” Priya said. “I'd just been listening all along.”",
        qs: [
          { stem: "Why did Priya almost withdraw?", options: ["Her partner was sick and the case needed two voices", "She missed the bus", "She lost her notes", "The tournament was canceled"], answer: 0 },
          { stem: "How did she prepare on the bus?", options: ["Reading his notes and whispering his arguments", "Sleeping", "Writing a new case", "Calling the judge"], answer: 0 },
          { stem: "What helped her recover from the stumble?", options: ["Remembering how he always phrased the next line", "A timeout", "Her coach's signal", "Luck"], answer: 0 },
          { stem: "'Until the margins blurred' suggests she read…", options: ["intensely for a long time", "carelessly", "in the dark", "someone else's notes"], answer: 0 },
          { stem: "Priya's final line means her success came from…", options: ["paying attention to her partner all season", "memorizing overnight", "the judge's kindness", "changing the case"], answer: 0 },
          { stem: "A theme of the passage is…", options: ["deep familiarity comes from listening over time", "debate is unfair", "never trust a partner", "second place is failure"], answer: 0 },
        ] },
      { task: "Read an Informational Passage", topic: "The Printing Press",
        passage: "Before the printing press, every book in Europe was copied by hand, so books were rare and owned mostly by the wealthy. Around 1440, Johannes Gutenberg combined movable metal type with a modified press, and a single shop could suddenly produce hundreds of identical pages a day. Prices fell, literacy spread, and ideas began moving faster than any ruler could control. Printing also standardized spelling and grammar: when thousands of readers see the same printed page, the language on that page starts to become the rule.",
        qs: [
          { stem: "Before the press, books were…", options: ["copied by hand and rare", "printed cheaply", "free in libraries", "banned"], answer: 0 },
          { stem: "Gutenberg's key combination was movable type and…", options: ["a modified press", "a steam engine", "a loom", "a mill"], answer: 0 },
          { stem: "What happened to prices and literacy?", options: ["Prices fell and literacy spread", "Both fell", "Both stayed the same", "Prices rose"], answer: 0 },
          { stem: "'Faster than any ruler could control' implies printing…", options: ["weakened control over ideas", "made kings richer", "was illegal", "printed laws only"], answer: 0 },
          { stem: "How did printing standardize language?", options: ["Thousands saw the same page, so it became the rule", "Printers wrote dictionaries", "Kings ordered it", "Schools closed"], answer: 0 },
          { stem: "The passage is mainly about printing's…", options: ["wide effects on society", "mechanical parts", "cost", "inventor's childhood"], answer: 0 },
        ] },
    ],
    speaking: [
      { task: "Talk about a Scene (1 of 4)", topic: "Math Class", scene: "mathclass",
        prompt: "Look at the picture. What is the teacher doing?",
        points: 1, checks: ["A full sentence about the teacher"] },
      { task: "Talk about a Scene (2 of 4)", topic: "Math Class", scene: "mathclass",
        prompt: "Describe the student in the picture. What is the student probably thinking?",
        points: 1, checks: ["Described the student", "A reasonable guess"] },
      { task: "Talk about a Scene (3 of 4)", topic: "Math Class", scene: "mathclass",
        prompt: "What clues tell you this is a math class? Name two.",
        points: 1, checks: ["Two clues from the picture"] },
      { task: "Talk about a Scene (4 of 4)", topic: "Math Class", scene: "mathclass",
        prompt: "Tell about a time a teacher helped you understand something difficult.",
        points: 1, checks: ["Past tense", "What the help was"] },
      { task: "Speech Functions", topic: "Renew a Book",
        prompt: "Your library book is due today but you haven't finished it. What would you say to the librarian?",
        points: 1, checks: ["Polite request", "Clear situation"] },
      { task: "Speech Functions", topic: "Leave Practice Early",
        prompt: "You have a dentist appointment and need to leave practice thirty minutes early. What would you say to your coach?",
        points: 1, checks: ["Explained why", "Asked, not told"] },
      { task: "Support an Opinion", topic: "Study Alone or in Groups",
        prompt: "Is it better to study alone or in a group? State your opinion and justify it with a reason and explanation.",
        points: 2, checks: ["Clear opinion", "Reason with explanation"] },
      { task: "Support an Opinion", topic: "School Mascot",
        prompt: "Your school is deciding whether to keep its old mascot or design a new one. Which should it do? Give a reason and explanation.",
        points: 2, checks: ["Clear position", "Developed reason"] },
      { task: "Present and Discuss Information", topic: "Club Membership", scene: "barclubs",
        prompt: "Look at the bar graph of club membership. Point 1: Describe what the graph shows. Point 2: A student claims 'Robotics has more members than Drama.' Using the graph, is that supported? Explain.",
        points: 3, checks: ["Accurate description", "Judged the claim with data"] },
      { task: "Summarize an Academic Presentation", topic: "Supply and Demand",
        prompt: "A presentation explained supply and demand: when many people want something scarce, its price rises; when few want something plentiful, its price falls; prices act as signals that guide what gets made. Summarize the idea in your own words with one example.",
        points: 4, checks: ["Both directions explained", "One example", "Own words"] },
      { task: "Summarize an Academic Presentation", topic: "How Vaccines Work",
        prompt: "A presentation explained vaccines: a vaccine shows the immune system a harmless piece or copy of a germ; the body practices fighting it and builds memory cells; if the real germ arrives later, the body responds fast. Summarize the process in order, in your own words.",
        points: 4, checks: ["Steps in order", "Connected sentences", "Own words"] },
    ],
    writing: [
      { task: "Describe a Picture (1 of 2)", topic: "Math Class", scene: "mathclass", kind: "frame",
        stem: "Look at the picture. Write one complete sentence describing what the student is doing.",
        frame: "", accept: ["student", "sitting", "listening", "watching", "desk", "working", "solving", "looking"], minWords: 5,
        hint: "A full sentence about the student." },
      { task: "Describe a Picture (2 of 2)", topic: "Math Class", scene: "mathclass", kind: "frame",
        stem: "Write one complete sentence about what the class will probably do after the teacher finishes explaining.",
        frame: "", accept: ["will", "practice", "solve", "problems", "try", "work", "answer", "homework"], minWords: 5,
        hint: "Use 'will' to predict." },
      { task: "Write About an Experience", topic: "Teaching Someone", kind: "frame",
        stem: "Write about a time you taught or explained something to another person. What was it, how did you explain it, and did they understand? Write a full paragraph.",
        frame: "", accept: ["taught", "explained", "showed", "friend", "sister", "brother", "understood", "finally", "because", "first", "then"], minWords: 15,
        hint: "3+ sentences: what, how, result." },
      { task: "Write About Academic Information (1 of 2)", topic: "Club Budget", scene: "club-budget-chart", kind: "frame",
        stem: "A chart shows club funding requests: Robotics $800 (competition fees) · Art $450 (supplies) · Debate $300 (travel). Total available: $1,200. Write one or two sentences stating what the chart shows about the requests and the budget.",
        frame: "", accept: ["1550", "1,550", "total", "exceed", "over", "1200", "1,200", "budget", "requests", "more"], minWords: 10,
        hint: "Add the requests and compare to $1,200." },
      { task: "Write About Academic Information (2 of 2)", topic: "Club Budget", scene: "club-budget-chart", kind: "frame",
        stem: "Using the same chart, a student says 'just give every club what it asked for.' Respond to that student using a detail from the chart.",
        frame: "", accept: ["cannot", "can't", "exceed", "over", "budget", "cut", "prioritize", "only", "1200", "1,200", "because"], minWords: 10,
        hint: "Explain why full funding is impossible; suggest what to do." },
      { task: "Justify an Opinion", topic: "Volunteer Hours", kind: "frame",
        stem: "Some schools require volunteer hours to graduate. Should yours? State your position and support it with at least two reasons. Aim for six or more sentences with an appropriate register.",
        frame: "", accept: ["volunteer", "hours", "because", "community", "students", "time", "require", "learn", "although", "however", "believe", "first", "second"], minWords: 25,
        hint: "Position + two developed reasons; formal tone." },
    ],
  },
  g68: {
    listening: [
      { task: "Listen to a Short Exchange", topic: "Library Card",
        intro: "Only once.",
        transcript: "Boy: The librarian said I can't check out books until I replace my lost card.\nGirl: Replacements are free this month — just fill out the yellow form at the front desk.",
        qs: [ { stem: "What should the boy do?", options: ["Fill out the yellow form", "Pay a fine", "Wait a month"], answer: 0 } ] },
      { task: "Listen to a Short Exchange", topic: "PE Uniform",
        intro: "Only once.",
        transcript: "Girl: I forgot my PE uniform again. That's the second time this week.\nBoy: Coach keeps loaner shirts in the equipment room — just return it washed tomorrow.",
        qs: [ { stem: "What does the boy suggest?", options: ["Skipping PE", "Borrowing a loaner shirt", "Calling home"], answer: 1 } ] },
      { task: "Listen to a Short Exchange", topic: "Science Notebook",
        intro: "Only once.",
        transcript: "Boy: Ms. Ito checks notebooks tomorrow, and I'm missing Tuesday's lab notes.\nGirl: I'll send you a photo of mine tonight — but copy them in your own words, she can tell.",
        qs: [ { stem: "What is the girl's warning?", options: ["Copy in your own words", "Notebooks are canceled", "The lab was easy"], answer: 0 } ] },
      { task: "Listen to a Classroom Conversation", topic: "Band Practice Room",
        intro: "A teacher and a student. Only once.",
        transcript: "Student: Can I use the practice room at lunch to work on my solo?\nTeacher: Yes — sign up on the sheet by the door. Slots are thirty minutes each.\nStudent: Can I take two slots in a row?\nTeacher: Only if the second one is still empty five minutes in. And put the music stands back — the jazz band lost two last week.\nStudent: One slot, stands back. Got it.",
        qs: [
          { stem: "How long is each slot?", options: ["Fifteen minutes", "Thirty minutes", "One hour"], answer: 1 },
          { stem: "When can the student take a second slot?", options: ["Never", "If it's still empty five minutes in", "By paying"], answer: 1 },
          { stem: "What must be put back?", options: ["The music stands", "The chairs", "The drums"], answer: 0 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Bee Waggle Dance",
        intro: "Part of a science presentation. Only once.",
        transcript: "Student: When a honeybee finds flowers, it flies home and dances. In the waggle dance, the bee runs in a figure eight, waggling along the middle line. The direction of that line, compared to straight up, tells the other bees the direction of the flowers compared to the sun. The longer the waggle, the farther the food. Other bees follow the instructions and fly almost straight to flowers they have never seen.",
        qs: [
          { stem: "What does the direction of the waggle line show?", options: ["The direction of the flowers", "The bee's age", "The time of day"], answer: 0 },
          { stem: "What does a longer waggle mean?", options: ["Closer food", "Farther food", "Sweeter food"], answer: 1 },
          { stem: "The dance lets other bees…", options: ["find flowers they've never seen", "stay warm", "build hives faster"], answer: 0 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "The Pony Express",
        intro: "Part of a history presentation. Only once.",
        transcript: "Student: In 1860, the Pony Express carried mail nearly two thousand miles between Missouri and California in about ten days — lightning speed for the time. Riders galloped between stations, switching to fresh horses every ten to fifteen miles and passing the mail pouch like a baton. But the service lasted only about eighteen months. The telegraph line was completed in 1861, sending messages across the country in minutes, and the fastest horses in America could not compete with electricity.",
        qs: [
          { stem: "How did riders keep up their speed?", options: ["Switching to fresh horses at stations", "Riding at night only", "Using wagons"], answer: 0 },
          { stem: "How long did the Pony Express last?", options: ["Ten years", "About eighteen months", "One week"], answer: 1 },
          { stem: "What ended it?", options: ["The telegraph", "A war", "Bad weather"], answer: 0 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "Longer Passing Periods",
        intro: "One student supports an opinion. Only once.",
        transcript: "Student: Our passing periods should be six minutes instead of four. The math wing and the gym are on opposite ends of campus, and students with those classes back-to-back arrive late through no fault of their own. Teachers say longer passing time means less class time — true, if we change nothing else. But trimming one minute from each of our six periods pays for the change exactly, and students would actually be in their seats when class starts.",
        qs: [
          { stem: "What change does the speaker want?", options: ["Six-minute passing periods", "No passing periods", "A new gym"], answer: 0 },
          { stem: "Who is late through no fault of their own?", options: ["Students crossing campus back-to-back", "Teachers", "Bus riders"], answer: 0 },
          { stem: "How is the lost-class-time objection answered?", options: ["Trim one minute from each period", "Cancel a class", "Ignore it"], answer: 0 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "Compost Lunch Waste",
        intro: "One student supports an opinion. Only once.",
        transcript: "Student: Our cafeteria should compost food waste instead of trashing it. Every lunch, we throw away pounds of fruit peels and leftovers that could become soil for the garden beds out front. People worry compost bins smell — a fair point — but sealed bins emptied daily don't, and the middle school across town has run theirs for two years without a single complaint. We're already paying to haul this waste to a landfill. Composting turns a cost into soil.",
        qs: [
          { stem: "What does the speaker propose?", options: ["Composting cafeteria food waste", "Shorter lunches", "More trash cans"], answer: 0 },
          { stem: "How is the smell concern answered?", options: ["Sealed bins emptied daily", "Air freshener", "Moving lunch outside"], answer: 0 },
          { stem: "'Turns a cost into soil' means composting…", options: ["converts an expense into something useful", "is expensive", "requires new taxes"], answer: 0 },
        ] },
    ],
    reading: [
      { task: "Read a Short Informational Passage", topic: "Picture Day",
        passage: "Picture day is Wednesday. Students will be called by grade over the loudspeaker; bring your order envelope with payment sealed inside, or order online with the code on the flyer. Students who are absent Wednesday will be photographed on makeup day next month.",
        qs: [
          { stem: "How will students know when to go?", options: ["Called by grade over the loudspeaker", "A bell", "Teachers walk them", "A text message"], answer: 0 },
          { stem: "What happens if a student is absent Wednesday?", options: ["No photo this year", "Photographed on makeup day", "Photo taken at home", "A refund"], answer: 1 },
        ] },
      { task: "Read a Short Informational Passage", topic: "Static Electricity",
        passage: "Rub a balloon on your hair and it will stick to a wall. Rubbing transfers tiny negative charges called electrons from your hair to the balloon. The balloon becomes negatively charged, your hair becomes positively charged, and opposite charges attract — which is why your hair rises toward the balloon and the balloon clings to the wall. This buildup of charge in one place is called static electricity.",
        qs: [
          { stem: "What moves from hair to balloon?", options: ["Electrons", "Protons", "Air", "Heat"], answer: 0 },
          { stem: "Why does hair rise toward the balloon?", options: ["Opposite charges attract", "Wind", "The balloon is warm", "Gravity"], answer: 0 },
          { stem: "Static electricity is…", options: ["a buildup of charge in one place", "a kind of battery", "lightning only", "magnetism"], answer: 0 },
        ] },
      { task: "Read a Student Essay", topic: "Homework Help Hour",
        passage: "(Read a classmate's draft and answer the questions.) “Our school should add a homework help hour after school. First, many students has nobody at home who can help with algebra or essays. Second, the buses already leave an hour after the last bell for sports, so rides exist. Some teachers worry it becomes free babysitting, however a simple sign-in sheet with a work requirement would keep it serious. The help hour gives every student the same chance to succeed, not just students with help at home.”",
        qs: [
          { stem: "What is the essay proposing?", options: ["A homework help hour", "Later buses", "Less algebra", "Free babysitting"], answer: 0 },
          { stem: "Which phrase has a subject-verb error?", options: ["“many students has nobody”", "“the buses already leave”", "“rides exist”", "“the help hour gives”"], answer: 0 },
          { stem: "The 'however' sentence is BEST fixed by…", options: ["“…babysitting; however, a simple sign-in sheet…”", "removing 'sign-in'", "starting the essay with however", "changing however to 'and'"], answer: 0 },
          { stem: "Why mention that buses already leave an hour later?", options: ["Transportation for the hour already exists", "Buses are slow", "Sports are canceled", "To complain"], answer: 0 },
          { stem: "How is the babysitting worry answered?", options: ["Sign-in sheet with a work requirement", "Hiring guards", "Charging money", "Ignoring it"], answer: 0 },
          { stem: "The final sentence appeals to…", options: ["fairness for all students", "saving money", "teacher comfort", "school pride"], answer: 0 },
          { stem: "Who does the writer say lacks help at home?", options: ["Many students", "All teachers", "Bus drivers", "Coaches"], answer: 0 },
          { stem: "The words 'First' and 'Second' function to…", options: ["organize the reasons", "count students", "show time", "list rules"], answer: 0 },
        ] },
      { task: "Read a Literary Passage", topic: "Paper Cranes",
        passage: "The new girl, Hana, spoke little English, but every day a folded paper crane appeared on the desk of someone in class — the boy who dropped his tray, the girl who failed the quiz. Nobody knew the cranes were hers until Marco stayed late and saw her folding one from his returned math test, the red marks disappearing into the wings. “For bad days,” she said carefully. Marco taped the crane to his binder. By spring, half the class carried one, and Hana never ate lunch alone again.",
        qs: [
          { stem: "Who received the cranes?", options: ["Students having bad days", "Teachers", "The principal", "Hana's family"], answer: 0 },
          { stem: "How did Marco discover the folder?", options: ["He stayed late and saw her", "She told the class", "A note", "The teacher announced it"], answer: 0 },
          { stem: "What was Marco's crane folded from?", options: ["His returned math test", "A newspaper", "Gift wrap", "A menu"], answer: 0 },
          { stem: "'The red marks disappearing into the wings' suggests the crane…", options: ["turned something painful into something kind", "was poorly made", "was invisible", "was graded"], answer: 0 },
          { stem: "The ending shows that Hana…", options: ["found belonging through kindness", "moved away", "stopped folding", "learned math"], answer: 0 },
          { stem: "A theme of the passage is…", options: ["kindness speaks across language barriers", "tests are unfair", "paper is valuable", "lunch is important"], answer: 0 },
        ] },
      { task: "Read an Informational Passage", topic: "Giant Sequoias",
        passage: "Giant sequoias are among the largest living things on Earth, and fire — usually a forest's enemy — is part of their secret. Their bark grows up to two feet thick and contains almost no flammable resin, so mature trees shrug off flames that kill their competitors. Stranger still, sequoia cones can hang closed on the branch for twenty years, waiting; the heat of a passing fire dries and opens them, releasing seeds onto ground the fire has conveniently cleared of brush and rivals. For sequoias, a burn is not a disaster. It is an invitation.",
        qs: [
          { stem: "Why do mature sequoias survive fires?", options: ["Thick bark with little flammable resin", "They grow near water", "Firefighters protect them", "They are too tall to burn"], answer: 0 },
          { stem: "What opens the cones?", options: ["The heat of fire", "Rain", "Birds", "Wind"], answer: 0 },
          { stem: "Why is freshly burned ground good for seeds?", options: ["It is cleared of brush and rivals", "It is warm", "It is wet", "It is dark"], answer: 0 },
          { stem: "'It is an invitation' means fire…", options: ["creates the sequoia's opportunity", "should be started by hikers", "destroys sequoias", "is polite"], answer: 0 },
          { stem: "How long can cones wait closed?", options: ["Twenty years", "Two days", "One season", "A century"], answer: 0 },
          { stem: "The passage's main idea is that sequoias…", options: ["turned fire into an advantage", "are endangered by rain", "grow fast", "have small cones"], answer: 0 },
        ] },
    ],
    speaking: [
      { task: "Talk about a Scene (1 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "Look at the picture. What is the boy at the counter doing?",
        points: 1, checks: ["A full sentence"] },
      { task: "Talk about a Scene (2 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "Describe what is on the cart at the front of the picture.",
        points: 1, checks: ["Described the cart"] },
      { task: "Talk about a Scene (3 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "How do you know this is a library? Give two clues.",
        points: 1, checks: ["Two clues"] },
      { task: "Talk about a Scene (4 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "Tell about a time you had to wait in line for something. How did you feel?",
        points: 1, checks: ["Past tense", "A feeling"] },
      { task: "Speech Functions", topic: "Late Pass",
        prompt: "Your bus arrived late and you missed the start of first period. What would you say at the front office?",
        points: 1, checks: ["Explained why", "Polite"] },
      { task: "Speech Functions", topic: "Quiet in the Library",
        prompt: "Your friend is talking loudly in the library and people are staring. What do you say to your friend?",
        points: 1, checks: ["Kind but clear"] },
      { task: "Support an Opinion", topic: "Phones: Backpacks or Lockers",
        prompt: "During class, should phones stay in backpacks or be locked in lockers? State your opinion with a reason and explanation.",
        points: 2, checks: ["Clear opinion", "Reason with explanation"] },
      { task: "Support an Opinion", topic: "Field Day Event",
        prompt: "For field day, should your class choose kickball or relay races? Give your opinion with a reason and explanation.",
        points: 2, checks: ["Clear choice", "Developed reason"] },
      { task: "Present and Discuss Information", topic: "Geometry Enrollment", scene: "linegraph",
        prompt: "Look at the line graph. Point 1: Describe the trend across the five years. Point 2: A student claims 'Year 5 had the fewest students.' Is that supported? Explain using the graph.",
        points: 3, checks: ["Described the trend", "Used the data to judge the claim"] },
      { task: "Summarize an Academic Presentation", topic: "Bee Waggle Dance",
        prompt: "Summarize the waggle dance presentation: what the dance looks like, what the direction shows, and what the length shows.",
        points: 4, checks: ["All three parts", "In order", "Own words"] },
      { task: "Summarize an Academic Presentation", topic: "The Pony Express",
        prompt: "Summarize the Pony Express presentation: how it worked, how long it lasted, and what replaced it.",
        points: 4, checks: ["All three parts", "Connected sentences", "Own words"] },
    ],
    writing: [
      { task: "Describe a Picture (1 of 2)", topic: "Band Room", kind: "choice",
        stem: "A classmate wrote about a picture of the band room: “The students practice their instruments. The room is small.” Choose the BEST combination.",
        options: ["The students practice their instruments in the small room.", "The students practice, the room small.", "Small room the students practice instruments.", "The instruments practice the students in the room."], answer: 0 },
      { task: "Describe a Picture (2 of 2)", topic: "Band Room", kind: "frame",
        stem: "Write one complete sentence about what the band will probably do when practice ends.",
        frame: "", accept: ["will", "put", "away", "stands", "pack", "instruments", "leave", "clean"], minWords: 5,
        hint: "Use 'will' — think about the stands." },
      { task: "Write About an Experience", topic: "Helping Someone New", kind: "frame",
        stem: "Write about a time you helped someone who was new — a new student, a new neighbor, or a new teammate. What did you do, and what happened after? Write at least three sentences.",
        frame: "", accept: ["new", "helped", "showed", "school", "first", "friend", "because", "after", "together", "then"], minWords: 18,
        hint: "Past tense; what you did + the result." },
      { task: "Write About Academic Information (1 of 2)", topic: "Plant Experiment", kind: "frame",
        stem: "A graphic organizer shows a plant experiment: Plant A — window, watered daily, grew 12 cm · Plant B — closet, watered daily, grew 3 cm. Write one or two sentences explaining what the experiment shows.",
        frame: "", accept: ["sunlight", "light", "window", "grew", "taller", "12", "3", "closet", "because", "shows"], minWords: 10,
        hint: "Compare the two plants; name the cause." },
      { task: "Write About Academic Information (2 of 2)", topic: "Plant Experiment", kind: "frame",
        stem: "Using the same organizer, a student says Plant A was 'just lucky.' Respond using at least one detail.",
        frame: "", accept: ["not", "lucky", "sunlight", "window", "same", "water", "because", "only", "difference", "light"], minWords: 10,
        hint: "Both were watered — what was the only difference?" },
      { task: "Justify an Opinion", topic: "Assigned Lunch Seats", kind: "frame",
        stem: "Some schools assign lunch seats so nobody eats alone. Should yours? State your position and support it with at least two reasons. Write at least three sentences.",
        frame: "", accept: ["seats", "lunch", "because", "friends", "alone", "assigned", "although", "also", "believe", "choose", "however"], minWords: 20,
        hint: "Position + two reasons; consider the other side." },
    ],
  },
  g35: {
    listening: [
      { task: "Listen to a Short Exchange", topic: "Library Day",
        intro: "You will hear two students. Only once.",
        transcript: "Girl: Don't forget — today is library day. Do you have your book?\nBoy: Oh no, it's in my desk at home! Maybe Ms. Lee will let me return it tomorrow.",
        qs: [ { stem: "What is the boy's problem?", options: ["He lost his shoes", "His book is at home", "He is late"], answer: 1 } ] },
      { task: "Listen to a Short Exchange", topic: "Rainy Recess",
        intro: "Only once.",
        transcript: "Boy: It's raining, so recess is inside today.\nGirl: Yes! Inside recess means board games. I call the checkers set first!",
        qs: [ { stem: "Why is recess inside?", options: ["It is raining", "It is too hot", "The field is closed"], answer: 0 } ] },
      { task: "Listen to a Short Exchange", topic: "New Crayons",
        intro: "Only once.",
        transcript: "Girl: Look, the art bin has brand-new crayons!\nBoy: The teacher said we can use them if we put the old ones in the small box.",
        qs: [ { stem: "What must they do first?", options: ["Put old crayons in the small box", "Wash their hands", "Ask a parent"], answer: 0 } ] },
      { task: "Listen to a Classroom Conversation", topic: "Watering Schedule",
        intro: "A teacher and a student. Only once.",
        transcript: "Student: Ms. Kim, is it my week to water the plants?\nTeacher: Yes — Monday, Wednesday, and Friday, before morning meeting.\nStudent: How much water do they get?\nTeacher: Half a cup each. The cactus is the exception — it only gets water on Fridays.\nStudent: Half a cup, and the cactus only Friday. Easy!",
        qs: [
          { stem: "Which days does the student water the plants?", options: ["Every day", "Monday, Wednesday, Friday", "Weekends"], answer: 1 },
          { stem: "How much water does each plant get?", options: ["A full bottle", "Half a cup", "One drop"], answer: 1 },
          { stem: "What is special about the cactus?", options: ["It gets water only on Fridays", "It gets extra water", "It sits outside"], answer: 0 },
        ] },
      { task: "Listen to a Story", topic: "The Kite",
        intro: "Listen to a story. Only once.",
        transcript: "At recess, Ben's new kite flew higher than the fence — and then dove straight into the big oak tree. Ben pulled the string gently, but the kite would not move. His friends gathered under the tree with ideas. Then Rosa ran to get Mr. Alvarez, the custodian, who came with his long ladder. He climbed up, freed the kite, and handed it down. “Next time,” he winked, “fly it away from my tree.” Everyone laughed, even Ben.",
        qs: [
          { stem: "Where did the kite get stuck?", options: ["In the oak tree", "On the roof", "In the fence"], answer: 0 },
          { stem: "Who got Mr. Alvarez?", options: ["Ben", "Rosa", "The teacher"], answer: 1 },
          { stem: "How did the story end?", options: ["The kite ripped", "Everyone laughed", "Recess was canceled"], answer: 1 },
        ] },
      { task: "Listen to a Story", topic: "Muffin Mix-Up",
        intro: "Listen to a story. Only once.",
        transcript: "For the class party, Leo's dad baked two dozen muffins. But at school, Leo saw the problem: he had grabbed the plain muffins from the counter, not the chocolate chip ones. Leo felt his face turn red. Then Amara took a bite and said, “Hey — these taste like banana bread!” Soon everyone wanted one. The plain muffins were banana, Dad's secret batch, and they were gone before the chocolate chips were even missed.",
        qs: [
          { stem: "What was Leo's mistake?", options: ["He grabbed the wrong muffins", "He forgot the party", "He dropped the box"], answer: 0 },
          { stem: "What did the plain muffins turn out to be?", options: ["Banana", "Blueberry", "Stale"], answer: 0 },
          { stem: "How did the class react?", options: ["Everyone wanted one", "Nobody ate them", "They called Leo's dad"], answer: 0 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Butterfly Life Cycle",
        intro: "Listen to a teacher. Only once.",
        transcript: "Teacher: A butterfly's life has four stages. It begins as a tiny egg on a leaf. The egg hatches into a caterpillar, which eats and eats and grows. Then the caterpillar makes a hard case called a chrysalis and rests inside while its body changes. Finally, the case opens, and out comes a butterfly with wet, folded wings that soon dry and spread. Egg, caterpillar, chrysalis, butterfly — four stages, one amazing change.",
        qs: [
          { stem: "What hatches from the egg?", options: ["A butterfly", "A caterpillar", "A bee"], answer: 1 },
          { stem: "What is the hard case called?", options: ["A shell", "A chrysalis", "A nest"], answer: 1 },
          { stem: "How many stages are there?", options: ["Two", "Three", "Four"], answer: 2 },
        ] },
    ],
    reading: [
      { task: "Read and Choose a Sentence", topic: "Tying Shoes",
        passage: "Look at the picture: a boy is tying his shoe by the classroom door.",
        qs: [ { stem: "Choose the sentence that matches the picture.", options: ["The boy is tying his shoe.", "The boy is opening the door.", "The boy is eating a snack.", "The shoe is on the desk."], answer: 0 } ] },
      { task: "Read and Choose a Sentence", topic: "Painting",
        passage: "Look at the picture: a girl is painting a picture of a rainbow at the art table.",
        qs: [ { stem: "Choose the sentence that matches the picture.", options: ["The girl is painting a rainbow.", "The girl is washing brushes.", "The girl is outside.", "The rainbow is in the sky."], answer: 0 } ] },
      { task: "Read a Short Informational Passage", topic: "Fire Drill Rules",
        passage: "When the fire alarm rings, stop what you are doing right away. Walk — do not run — to the door and line up quietly. Your teacher will lead the line outside to the blacktop. Stay with your class so your teacher can count everyone. When the bell rings three times, it is safe to go back inside.",
        qs: [
          { stem: "What should you do when the alarm rings?", options: ["Stop right away", "Finish your work", "Hide", "Run outside"], answer: 0 },
          { stem: "Why must you stay with your class?", options: ["So the teacher can count everyone", "To play games", "To eat lunch", "To race"], answer: 0 },
          { stem: "What does three bells mean?", options: ["It is safe to go back inside", "Recess starts", "School is over", "Line up again"], answer: 0 },
        ] },
      { task: "Read a Student Essay", topic: "Reading Corner",
        passage: "(A student wrote this. Read it and answer the questions.) “Our class should have a reading corner. First, a soft rug and pillows make reading feel special, so kids will read more. Second, the corner give a quiet spot for finishing work early. Some kids say the corner will be too crowded, but a sign-up list with four spaces would fix that. A reading corner would make our room the best in the school.”",
        qs: [
          { stem: "What does the writer want?", options: ["A reading corner", "New desks", "More recess", "A class pet"], answer: 0 },
          { stem: "Which phrase has an error?", options: ["“the corner give a quiet spot”", "“kids will read more”", "“a sign-up list”", "“the best in the school”"], answer: 0 },
          { stem: "The BEST fix for “the corner give” is…", options: ["the corner gives", "the corners give it", "the corner giving", "give the corner"], answer: 0 },
          { stem: "How does the writer fix the crowding problem?", options: ["A sign-up list with four spaces", "A bigger room", "No fix", "Taking turns by grade"], answer: 0 },
          { stem: "Which sentence states the writer's opinion?", options: ["“Our class should have a reading corner.”", "“Some kids say the corner will be too crowded.”", "“A sign-up list with four spaces would fix that.”", "“First, a soft rug and pillows…”"], answer: 0 },
          { stem: "Why does the writer mention pillows and a rug?", options: ["They make reading feel special", "They are cheap", "They are easy to clean", "The teacher has them"], answer: 0 },
        ] },
      { task: "Read a Literary Passage", topic: "The Blue Ribbon Radish",
        passage: "Everyone in garden club planted something fast — beans, lettuce, sunflowers. Nina planted a radish and waited. And waited. “It's just leaves,” the other kids said, pointing at her little green patch. Nina watered it anyway, every day, even when nothing seemed to happen. On harvest day, she pulled the leaves — and up came a radish as round and red as an apple. It won the blue ribbon. “How did you grow that?” everyone asked. Nina smiled. “Mostly,” she said, “I just didn't stop.”",
        qs: [
          { stem: "What did Nina plant?", options: ["A radish", "Beans", "A sunflower", "Lettuce"], answer: 0 },
          { stem: "What did the other kids see for a long time?", options: ["Just leaves", "A big radish", "Weeds", "Flowers"], answer: 0 },
          { stem: "What did Nina do even when nothing happened?", options: ["Watered it every day", "Dug it up", "Planted beans instead", "Quit the club"], answer: 0 },
          { stem: "What happened on harvest day?", options: ["The radish won the blue ribbon", "The radish was gone", "It rained", "The club ended"], answer: 0 },
          { stem: "“I just didn't stop” shows Nina was…", options: ["patient and steady", "lucky", "fast", "loud"], answer: 0 },
          { stem: "What lesson does the story teach?", options: ["Keep going even when you can't see progress", "Plant fast vegetables", "Ribbons matter most", "Leaves are bad"], answer: 0 },
        ] },
      { task: "Read an Informational Passage", topic: "Ants Work Together",
        passage: "One ant is small, but an ant colony can do big things. Ants share jobs: some hunt for food, some care for the eggs, and some guard the nest. When an ant finds food, it leaves a smell trail on its way home, and other ants follow the trail straight to the food. Working together, ants can carry food many times heavier than one ant could lift alone.",
        qs: [
          { stem: "What do some ants do?", options: ["Guard the nest", "Build webs", "Fly south", "Sleep all day"], answer: 0 },
          { stem: "How do ants find food another ant found?", options: ["They follow a smell trail", "They shout", "They guess", "They watch birds"], answer: 0 },
          { stem: "What can ants do together?", options: ["Carry heavy food", "Swim far", "Change color", "Sing"], answer: 0 },
          { stem: "The passage is mostly about how ants…", options: ["work together", "sleep", "fight", "grow"], answer: 0 },
          { stem: "“One ant is small, but…” sets up the idea that…", options: ["teamwork makes ants strong", "ants are weak", "colonies are small", "food is heavy"], answer: 0 },
        ] },
    ],
    speaking: [
      { task: "Talk about a Scene (1 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "Look at the picture. What is the boy doing?",
        points: 1, checks: ["A full sentence"] },
      { task: "Talk about a Scene (2 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "Name two other things you see in the picture.",
        points: 1, checks: ["Two things named"] },
      { task: "Talk about a Scene (3 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "Where are the students? How do you know?",
        points: 1, checks: ["Named the place", "Gave a clue"] },
      { task: "Talk about a Scene (4 of 4)", topic: "Checking out Laptops", scene: "library",
        prompt: "Tell about a time you borrowed something. What was it?",
        points: 1, checks: ["Past tense"] },
      { task: "Speech Functions", topic: "Borrow a Pencil",
        prompt: "Your pencil broke and the test is starting. What do you say to your neighbor?",
        points: 1, checks: ["Polite and quick"] },
      { task: "Speech Functions", topic: "Feeling Sick",
        prompt: "Your stomach hurts during class. What do you say to your teacher?",
        points: 1, checks: ["Clear and polite"] },
      { task: "Support an Opinion", topic: "Story Time Spot",
        prompt: "Should story time be inside on the rug or outside under the tree? Say your choice and one reason.",
        points: 2, checks: ["A choice", "A because"] },
      { task: "Support an Opinion", topic: "Lunch Drink",
        prompt: "Which is better with lunch: juice or milk? Say your opinion and one reason.",
        points: 2, checks: ["Clear opinion", "One reason"] },
      { task: "Retell a Narrative", topic: "The Kite",
        prompt: "Retell the story about Ben's kite. Use 'first,' 'then,' and 'last.'",
        points: 4, checks: ["First/then/last", "The whole story"] },
      { task: "Summarize an Academic Presentation", topic: "Butterfly Life Cycle",
        prompt: "Tell a friend the four stages of a butterfly's life, in order.",
        points: 4, checks: ["All four stages", "In order"] },
    ],
    writing: [
      { task: "Describe a Picture (1 of 2)", topic: "Math Class", scene: "mathclass", kind: "frame",
        stem: "Look at the picture. Write one sentence about the teacher.",
        frame: "", accept: ["teacher", "is", "pointing", "showing", "helping", "board", "writing", "explaining"], minWords: 4,
        hint: "“The teacher is…”" },
      { task: "Describe a Picture (2 of 2)", topic: "Math Class", scene: "mathclass", kind: "frame",
        stem: "Write one sentence about what the student will do next.",
        frame: "", accept: ["will", "student", "answer", "try", "solve", "write", "raise", "work"], minWords: 4,
        hint: "Use 'will.'" },
      { task: "Write About an Experience", topic: "Trying Something New", kind: "frame",
        stem: "Write about a time you tried something new — a food, a game, or an activity. What was it, and how did it go? Write at least two sentences.",
        frame: "", accept: ["tried", "first", "new", "time", "was", "liked", "scared", "fun", "then", "because"], minWords: 12,
        hint: "Past tense; what + how it went." },
      { task: "Write About Academic Information (1 of 2)", topic: "Class Pet Chart", kind: "frame",
        stem: "A chart shows how to care for the class fish: feed one pinch each morning · clean the tank on Friday · keep the lid closed. Using details from the chart, write about how to care for the fish.",
        frame: "", accept: ["feed", "pinch", "morning", "clean", "tank", "friday", "lid", "closed", "fish"], minWords: 8,
        hint: "Use two or more details." },
      { task: "Write About Academic Information (2 of 2)", topic: "Class Pet Chart", kind: "frame",
        stem: "Pick ONE rule from the chart and write one sentence about why it is important.",
        frame: "", accept: ["because", "healthy", "safe", "clean", "water", "jump", "sick", "food", "important"], minWords: 6,
        hint: "'…is important because…'" },
      { task: "Justify an Opinion", topic: "Longer Recess", kind: "frame",
        stem: "Some kids think recess should be longer. Do you agree? Say your opinion and give at least one reason.",
        frame: "", accept: ["recess", "longer", "because", "play", "friends", "exercise", "tired", "learn", "think", "should"], minWords: 12,
        hint: "Opinion + because + a detail." },
    ],
  },
};

// ██ PRACTICE SET 3 ██ — same task-type structure, all-new topics.
const BANK3 = {
  g910: {
    listening: [
      { task: "Listen to a Short Exchange", topic: "Locked Classroom",
        intro: "You will hear two students. Only once.",
        transcript: "Boy: Room 204 is locked and Ms. Vega isn't here yet.\nGirl: She's on hall duty until the bell — the sub schedule is taped by the office window if you want to check.",
        qs: [ { stem: "Where is Ms. Vega?", options: ["On hall duty", "Absent today", "In room 204"], answer: 0 } ] },
      { task: "Listen to a Short Exchange", topic: "Phone Charger",
        intro: "Only once.",
        transcript: "Girl: My phone is at two percent and I need it for the bus code tonight.\nBoy: The library has chargers at the study tables — you just leave your ID with the front desk.",
        qs: [ { stem: "What must the girl leave at the desk?", options: ["Her phone", "Her ID", "A deposit"], answer: 1 } ] },
      { task: "Listen to a Short Exchange", topic: "Quiz Moved",
        intro: "Only once.",
        transcript: "Boy: Heads up — the chemistry quiz moved from Friday to Monday.\nGirl: Monday? That actually helps. Now I can go to my cousin's game Thursday without cramming after.",
        qs: [ { stem: "Why is the girl relieved?", options: ["The quiz was canceled", "She can attend the game without cramming", "She already took it"], answer: 1 } ] },
      { task: "Listen to a Classroom Conversation", topic: "Counselor Appointment",
        intro: "A counselor and a student. Only once.",
        transcript: "Student: I signed up to talk about my schedule, but I have a test during my appointment time.\nCounselor: We can move you to Thursday at lunch. Bring a copy of your transcript so we can check your credits.\nStudent: Where do I print a transcript?\nCounselor: The registrar's office, before school — it takes about five minutes. And bring your list of colleges if you've started one.\nStudent: Thursday, transcript, list. I'll be there.",
        qs: [
          { stem: "When is the new appointment?", options: ["Thursday at lunch", "Friday morning", "Today after school"], answer: 0 },
          { stem: "What should the student bring?", options: ["A transcript", "A permission slip", "A textbook"], answer: 0 },
          { stem: "Where can a transcript be printed?", options: ["The registrar's office", "The library", "The gym"], answer: 0 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Antibiotic Resistance",
        intro: "Part of a science presentation. Only once.",
        transcript: "Student: Antibiotics kill bacteria, but bacteria fight back — not by choice, but by chance. In any infection, a few bacteria carry random mutations that let them survive the drug. When the antibiotic wipes out the rest, those survivors multiply, and the next infection is harder to treat. This is why doctors say to finish the full prescription: stopping early leaves the toughest bacteria alive and in charge. Resistance isn't the drug getting weaker. It's the bacteria population getting stronger.",
        qs: [
          { stem: "Where does resistance begin?", options: ["Random mutations in a few bacteria", "The drug expiring", "The patient's diet"], answer: 0 },
          { stem: "Why finish the full prescription?", options: ["Stopping early leaves the toughest bacteria alive", "Pills taste better together", "Doctors get paid more"], answer: 0 },
          { stem: "The last line means resistance is about…", options: ["the bacteria population changing", "drugs getting weaker", "hospitals closing"], answer: 0 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Transcontinental Railroad",
        intro: "Part of a history presentation. Only once.",
        transcript: "Student: Before 1869, crossing America took months by wagon or a long voyage by sea. The transcontinental railroad changed that. Two companies built toward each other — one laying track east from California, the other west from Nebraska — through mountains, deserts, and blizzards. When the rails met in Utah, workers drove in a final golden spike, and a trip that had taken up to six months could suddenly be done in about a week. Goods, mail, and people began moving across the country at a speed no one had imagined.",
        qs: [
          { stem: "How was the railroad built?", options: ["Two companies built toward each other", "One company built it alone", "The army built it"], answer: 0 },
          { stem: "What marked the meeting of the rails?", options: ["A golden spike", "A parade", "A treaty"], answer: 0 },
          { stem: "How did travel time change?", options: ["From months to about a week", "From a week to a day", "It stayed the same"], answer: 0 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "Open Gym at Lunch",
        intro: "A student gives an opinion. Only once.",
        transcript: "Student: The gym should be open at lunch. Half the campus has nowhere to burn energy midday, and packed hallways are where most lunch conflicts start. Supervision is the real objection, and it's legitimate — but the PE staff already eats lunch in the gym office, and two rotating teacher volunteers would cover the rest. A school one district over opened its gym at lunch last year and office referrals during lunch dropped by a third.",
        qs: [
          { stem: "What is the speaker's proposal?", options: ["Open the gym at lunch", "Longer lunches", "New gym equipment"], answer: 0 },
          { stem: "What objection does the speaker call legitimate?", options: ["Supervision", "Cost", "Noise"], answer: 0 },
          { stem: "What happened at the nearby school?", options: ["Lunch referrals dropped by a third", "The gym closed", "Grades fell"], answer: 0 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "Later Library Hours",
        intro: "A student gives an opinion. Only once.",
        transcript: "Student: Our library should stay open until five instead of closing at three thirty. Students with younger siblings to watch, or houses without quiet rooms, lose their best study space the moment the bell rings. The staffing cost is real — librarians can't just work free hours. But a paid student-aide program, like the one the front office already runs, would cover the desk for less than the cost of one club, and it gives students a job on top of a study hall.",
        qs: [
          { stem: "What change does the speaker want?", options: ["Library open until five", "A bigger library", "No library fines"], answer: 0 },
          { stem: "Who loses their best study space at the bell?", options: ["Students without quiet rooms at home", "Teachers", "Coaches"], answer: 0 },
          { stem: "How is the staffing cost answered?", options: ["A paid student-aide program", "Volunteers from town", "Closing on Fridays"], answer: 0 },
        ] },
    ],
    reading: [
      { task: "Read a Short Informational Passage", topic: "Final Exam Schedule",
        passage: "Final exams run Tuesday through Thursday on a minimum-day schedule: two exams each morning, dismissal at 12:15. Students take only the exams for their enrolled periods and may leave campus after their last exam with a signed release form on file. Buses run at 12:30 all three days. Make-up exams require a note from the attendance office and will be given the following Monday.",
        qs: [
          { stem: "When are make-up exams given?", options: ["The following Monday", "Friday", "During lunch", "Never"], answer: 0 },
          { stem: "What lets a student leave after their last exam?", options: ["A signed release form on file", "A parent phone call", "A teacher's wave", "Nothing"], answer: 0 },
        ] },
      { task: "Read a Short Informational Passage", topic: "Why Leaves Change Color",
        passage: "Leaves are green because of chlorophyll, the pigment that runs photosynthesis. But yellow and orange pigments are in the leaf all summer, hidden underneath the green. When autumn days shorten, trees stop making chlorophyll, the green fades, and the hidden colors finally show. The brightest reds are different: they are made fresh in the fall by sugars trapped in the leaf, which is why red autumns follow sunny days and cool nights.",
        qs: [
          { stem: "Where are the yellow and orange pigments in summer?", options: ["Hidden under the green", "In the roots", "In the soil", "They don't exist yet"], answer: 0 },
          { stem: "What makes the green fade?", options: ["Trees stop making chlorophyll", "Rain washes it out", "Cold kills the leaf instantly", "Wind"], answer: 0 },
          { stem: "The brightest reds come from…", options: ["sugars trapped in the leaf", "old chlorophyll", "morning frost", "tree bark"], answer: 0 },
        ] },
      { task: "Read a Student Essay", topic: "Water Bottle Stations",
        passage: "(Read a classmate's draft and answer the questions.) “Our school should install water bottle filling stations. First, the old fountains barely trickle, so students buys plastic bottles instead, and the recycling bins overflow by Friday. Second, filling stations count each bottle saved, which turn a habit into a visible goal. Some say the stations cost too much, however the PTA has already offered to fund the first two. Clean water should not be the hardest thing to find at school.”",
        qs: [
          { stem: "What is the writer proposing?", options: ["Water bottle filling stations", "New recycling bins", "Banning bottles", "Longer passing periods"], answer: 0 },
          { stem: "Which phrase has a subject-verb error?", options: ["“students buys plastic bottles”", "“the old fountains barely trickle”", "“the recycling bins overflow”", "“the PTA has already offered”"], answer: 0 },
          { stem: "“which turn a habit” should read…", options: ["which turns a habit", "which turning a habit", "which turn habits it", "who turn a habit"], answer: 0 },
          { stem: "The 'however' sentence is BEST fixed by…", options: ["“…cost too much; however, the PTA has already offered…”", "deleting 'the PTA'", "moving 'however' to the start of the essay", "changing 'however' to 'so'"], answer: 0 },
          { stem: "How is the cost objection answered?", options: ["The PTA offered to fund the first two", "Cutting a club", "Raising lunch prices", "It is ignored"], answer: 0 },
          { stem: "Why mention the overflowing recycling bins?", options: ["To show how many bottles are being bought", "To praise recycling", "To blame custodians", "To count Fridays"], answer: 0 },
          { stem: "The 'visible goal' idea refers to…", options: ["stations counting bottles saved", "posters", "a scoreboard in the gym", "grades"], answer: 0 },
          { stem: "The final sentence works as…", options: ["a memorable closing appeal", "a statistic", "a counterargument", "a new proposal"], answer: 0 },
        ] },
      { task: "Read a Literary Passage", topic: "The Night Shift",
        passage: "Three nights a week, Tomas bused tables at his family's restaurant, and three nights a week his physics homework waited until the kitchen lights went dark. His grandmother noticed him nodding over his textbook at the counter. “Bring it here,” she said, and began quizzing him from the book while she rolled silverware — mispronouncing every term, and remembering every answer he got wrong. On exam day, Tomas heard her voice behind each question. He got the highest score of his life, and that night he rolled silverware beside her, teaching her the words she'd been saying wrong all along.",
        qs: [
          { stem: "Why did Tomas study so late?", options: ["He worked nights at the family restaurant", "He kept losing his book", "He disliked physics", "His school assigned night classes"], answer: 0 },
          { stem: "How did his grandmother help?", options: ["Quizzing him while she worked", "Doing the homework for him", "Calling his teacher", "Paying for a tutor"], answer: 0 },
          { stem: "What detail shows her real attention?", options: ["She remembered every answer he got wrong", "She read the book alone", "She fixed his pencil", "She closed the restaurant"], answer: 0 },
          { stem: "'He heard her voice behind each question' means…", options: ["her quizzing had prepared him", "she was in the exam room", "he was distracted", "he heard the radio"], answer: 0 },
          { stem: "The ending shows Tomas…", options: ["returning the teaching", "quitting the restaurant", "failing again", "hiding his score"], answer: 0 },
          { stem: "A theme of the passage is…", options: ["help flows both ways in a family", "work ruins school", "physics is easy", "restaurants are quiet"], answer: 0 },
        ] },
      { task: "Read an Informational Passage", topic: "The Silk Road",
        passage: "The Silk Road was not a single road but a shifting web of trade routes linking China to the Mediterranean for over a thousand years. Silk moved west, but so did paper, gunpowder, and the compass; gold, glass, and horses moved east. Few merchants traveled the whole distance — goods changed hands at oasis towns along the way, each trader covering one stretch. The routes carried more than cargo: religions, technologies, and even diseases traveled the same paths, which is why historians call the Silk Road one of history's first engines of globalization.",
        qs: [
          { stem: "The Silk Road was actually…", options: ["a web of trade routes", "one paved highway", "a river route", "a single railroad"], answer: 0 },
          { stem: "How did goods usually travel the full distance?", options: ["Changing hands at towns along the way", "One merchant carried them all the way", "By sea only", "By government convoy"], answer: 0 },
          { stem: "Besides goods, the routes carried…", options: ["religions, technologies, and diseases", "only silk", "only soldiers", "nothing else"], answer: 0 },
          { stem: "Which moved west, according to the passage?", options: ["Paper and gunpowder", "Gold and glass", "Horses", "Olive oil"], answer: 0 },
          { stem: "'Engines of globalization' suggests the routes…", options: ["connected distant societies", "used steam power", "were built recently", "only moved money"], answer: 0 },
          { stem: "The passage is mainly about the Silk Road's…", options: ["scope and lasting effects", "exact map", "most famous merchant", "weather"], answer: 0 },
        ] },
    ],
    speaking: [
      { task: "Talk about a Scene (1 of 4)", topic: "Science Fair", scene: "sciencefair",
        prompt: "Look at the picture. What is happening in this scene?",
        points: 1, checks: ["A full-sentence description"] },
      { task: "Talk about a Scene (2 of 4)", topic: "Science Fair", scene: "sciencefair",
        prompt: "Describe one of the projects on the tables. What might it show?",
        points: 1, checks: ["Described a project", "A reasonable guess"] },
      { task: "Talk about a Scene (3 of 4)", topic: "Science Fair", scene: "sciencefair",
        prompt: "What will the person with the clipboard probably do next? Why do you think so?",
        points: 1, checks: ["A prediction", "A reason"] },
      { task: "Talk about a Scene (4 of 4)", topic: "Science Fair", scene: "sciencefair",
        prompt: "Tell about a time you worked hard on a project. What was it, and how did it turn out?",
        points: 1, checks: ["Past tense", "What + outcome"] },
      { task: "Speech Functions", topic: "Wrong Change",
        prompt: "The school store gave you change for a five, but you paid with a ten. What would you say to the cashier?",
        points: 1, checks: ["Polite and clear", "Stated the facts"] },
      { task: "Speech Functions", topic: "Invite a New Student",
        prompt: "A new student is eating alone. Invite them to join your table.",
        points: 1, checks: ["Friendly and welcoming"] },
      { task: "Support an Opinion", topic: "Online or Paper Textbooks",
        prompt: "Should your classes use online textbooks or paper ones? State your opinion and justify it with a reason and explanation.",
        points: 2, checks: ["Clear opinion", "Reason with explanation"] },
      { task: "Support an Opinion", topic: "Swimming or Track",
        prompt: "Your school can add one sport: swimming or track. Which should it add? Give a reason and explanation.",
        points: 2, checks: ["Clear choice", "Developed reason"] },
      { task: "Present and Discuss Information", topic: "Geometry Enrollment", scene: "linegraph",
        prompt: "Look at the line graph. Point 1: Summarize the overall pattern. Point 2: A student claims 'enrollment fell every single year.' Is that supported? Explain using the graph.",
        points: 3, checks: ["Accurate summary", "Judged the claim with the data"] },
      { task: "Summarize an Academic Presentation", topic: "Antibiotic Resistance",
        prompt: "Summarize the antibiotic resistance presentation: where resistance comes from, why patients should finish prescriptions, and what resistance really means.",
        points: 4, checks: ["All three parts", "In order", "Own words"] },
      { task: "Summarize an Academic Presentation", topic: "The Silk Road",
        prompt: "Summarize what you read about the Silk Road: what it was, how goods moved, and what else traveled the routes.",
        points: 4, checks: ["All three parts", "Connected sentences", "Own words"] },
    ],
    writing: [
      { task: "Describe a Picture (1 of 2)", topic: "Checking out Laptops", scene: "library", kind: "frame",
        stem: "Look at the picture. Write one complete sentence describing what the librarian is doing.",
        frame: "", accept: ["librarian", "handing", "giving", "helping", "laptop", "desk", "smiling", "checking"], minWords: 5,
        hint: "A full sentence about the librarian." },
      { task: "Describe a Picture (2 of 2)", topic: "Checking out Laptops", scene: "library", kind: "frame",
        stem: "Write one complete sentence about what the students in line will probably do next.",
        frame: "", accept: ["will", "check", "out", "laptop", "wait", "turn", "next", "receive", "id"], minWords: 5,
        hint: "Use 'will' to predict." },
      { task: "Write About an Experience", topic: "Overcoming with Practice", kind: "frame",
        stem: "Write about something you were bad at until you practiced — a skill, a subject, a sport. What changed, and how do you know you improved? Write a full paragraph.",
        frame: "", accept: ["practiced", "couldn't", "kept", "every", "finally", "better", "improved", "because", "until", "learned", "first"], minWords: 15,
        hint: "Before → practice → proof of improvement." },
      { task: "Write About Academic Information (1 of 2)", topic: "Two Jobs", scene: "two-jobs-comparison", kind: "frame",
        stem: "A graphic organizer compares two after-school jobs: Job A — grocery store, $16/hour, 40 minutes away by bus · Job B — vet clinic, $13/hour, 10 minutes away, related to the student's dream of becoming a veterinarian. Write one or two sentences describing the trade-off.",
        frame: "", accept: ["pays", "more", "closer", "farther", "career", "vet", "trade-off", "but", "however", "experience", "money"], minWords: 10,
        hint: "Name what each job wins on." },
      { task: "Write About Academic Information (2 of 2)", topic: "Two Jobs", scene: "two-jobs-comparison", kind: "frame",
        stem: "A classmate says 'always take the job that pays more.' Using at least one detail from the organizer, respond to that claim.",
        frame: "", accept: ["depends", "career", "vet", "experience", "closer", "bus", "time", "because", "goal", "future", "not"], minWords: 10,
        hint: "Bring in the career goal or the travel time." },
      { task: "Justify an Opinion", topic: "Attendance and Grades", kind: "frame",
        stem: "Some schools lower course grades for too many absences. Should attendance affect grades? State your position and support it with at least two reasons; address one point from the other side. Aim for six or more sentences with an appropriate register.",
        frame: "", accept: ["attendance", "grades", "because", "although", "learning", "absent", "however", "believe", "first", "second", "fair", "sick"], minWords: 25,
        hint: "Position + two reasons + one concession." },
    ],
  },
  g68: {
    listening: [
      { task: "Listen to a Short Exchange", topic: "Lost Jacket",
        intro: "Only once.",
        transcript: "Girl: Have you seen my blue jacket? I left it at PE.\nBoy: Check the lost and found by the gym office — Coach clears the benches into that bin every afternoon.",
        qs: [ { stem: "Where should the girl look?", options: ["The lost and found by the gym office", "Her locker", "The cafeteria"], answer: 0 } ] },
      { task: "Listen to a Short Exchange", topic: "Quiz Retake",
        intro: "Only once.",
        transcript: "Boy: I bombed the vocabulary quiz. Is it true Ms. Rios allows retakes?\nGirl: One retake per unit — but you have to turn in the corrections sheet first, with every mistake fixed.",
        qs: [ { stem: "What must be turned in before a retake?", options: ["The corrections sheet", "A parent note", "Extra credit"], answer: 0 } ] },
      { task: "Listen to a Short Exchange", topic: "Field Trip Form",
        intro: "Only once.",
        transcript: "Girl: Today is the last day for the museum trip form, and mine is on the kitchen table.\nBoy: Call home at lunch — the office lets parents email a photo of the signed form if it gets here by three.",
        qs: [ { stem: "What can the girl's parent do?", options: ["Email a photo of the signed form by three", "Sign it next week", "Come to school at night"], answer: 0 } ] },
      { task: "Listen to a Classroom Conversation", topic: "Art Supplies",
        intro: "A teacher and a student. Only once.",
        transcript: "Student: Ms. Okafor, can we start the clay project today?\nTeacher: Clay is Thursday. Today is glazing — grab an apron from the hooks first, glaze stains everything.\nStudent: Do we wash our own brushes after?\nTeacher: Yes, and stand them bristles-up in the jars, or they dry bent and we lose them.\nStudent: Apron on, brushes up. Got it.",
        qs: [
          { stem: "When is the clay project?", options: ["Thursday", "Today", "Next month"], answer: 0 },
          { stem: "Why wear an apron?", options: ["Glaze stains everything", "It is cold", "It is the uniform"], answer: 0 },
          { stem: "How should brushes be stored?", options: ["Bristles-up in the jars", "Flat in a drawer", "In water overnight"], answer: 0 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Northern Lights",
        intro: "Part of a science presentation. Only once.",
        transcript: "Student: The northern lights begin ninety-three million miles away, on the sun. The sun constantly throws off charged particles, and when a strong burst reaches Earth, our planet's magnetic field funnels the particles toward the poles. There they crash into gases high in the atmosphere, and each collision releases a tiny flash of light — oxygen glows green and red, nitrogen glows blue and purple. Billions of collisions at once paint the curtains of light we call the aurora.",
        qs: [
          { stem: "Where do the particles come from?", options: ["The sun", "The moon", "Volcanoes"], answer: 0 },
          { stem: "What funnels the particles toward the poles?", options: ["Earth's magnetic field", "Ocean currents", "Wind"], answer: 0 },
          { stem: "What makes the different colors?", options: ["Different gases glowing", "Different clouds", "City lights"], answer: 0 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "The Erie Canal",
        intro: "Part of a history presentation. Only once.",
        transcript: "Student: In 1825, the Erie Canal connected the Great Lakes to the Atlantic Ocean through New York. Boats can't climb hills, so engineers built locks — water-filled chambers that raise or lower a boat like a slow elevator, one step at a time, over five hundred feet of elevation. Before the canal, moving a ton of freight from Buffalo to New York City cost about a hundred dollars. After, it cost about ten. Cheap shipping turned New York into the busiest port in America.",
        qs: [
          { stem: "What problem did locks solve?", options: ["Boats can't climb hills", "Boats leak", "Boats are slow"], answer: 0 },
          { stem: "What happened to shipping costs?", options: ["They fell from about $100 to about $10", "They doubled", "They stayed the same"], answer: 0 },
          { stem: "What did cheap shipping do for New York?", options: ["Made it the busiest port in America", "Closed its harbor", "Ended farming"], answer: 0 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "Video Announcements",
        intro: "One student supports an opinion. Only once.",
        transcript: "Student: We should replace the crackly intercom announcements with a short student-made video each morning. Half the school can't understand the intercom, so half the school misses club meetings and schedule changes. Some say making a daily video takes too much time — and a fancy one would. But a two-minute video with a phone and a script takes one class period a week for the media club, which has been asking for a real project all year.",
        qs: [
          { stem: "What is the speaker's proposal?", options: ["Student-made video announcements", "Louder speakers", "No announcements"], answer: 0 },
          { stem: "What problem does the intercom cause?", options: ["Half the school misses information", "It wastes electricity", "It plays music"], answer: 0 },
          { stem: "Who would make the videos?", options: ["The media club", "The principal", "A hired company"], answer: 0 },
        ] },
      { task: "Listen to a Speaker Support an Opinion", topic: "Adopt a Class Pet",
        intro: "One student supports an opinion. Only once.",
        transcript: "Student: Our science class should adopt a class pet from the shelter. Caring for an animal teaches responsibility you can't get from a worksheet — feeding schedules, habitat cleaning, watching for signs of illness. The fair objection is weekends and breaks: someone has to care for it. A sign-up rotation with parent permission solves that, and the shelter said it would even cover the first vet visit for a classroom adoption.",
        qs: [
          { stem: "What does the speaker want?", options: ["To adopt a class pet from the shelter", "A field trip to the zoo", "More worksheets"], answer: 0 },
          { stem: "What is the fair objection?", options: ["Care during weekends and breaks", "Pets are boring", "The room is too big"], answer: 0 },
          { stem: "What did the shelter offer?", options: ["To cover the first vet visit", "Free food forever", "Two pets"], answer: 0 },
        ] },
    ],
    reading: [
      { task: "Read a Short Informational Passage", topic: "Gym Closed",
        passage: "The gym is closed Monday and Tuesday while the floor is refinished. PE classes will meet on the outdoor courts; bring a water bottle and a hat, since shade is limited. If it rains, classes will meet in the cafeteria for health lessons instead. The gym reopens Wednesday, but the new floor cannot be used with street shoes for the first week.",
        qs: [
          { stem: "Where do PE classes meet if it rains?", options: ["The cafeteria", "The library", "The gym anyway", "Home"], answer: 0 },
          { stem: "What is the rule for the new floor's first week?", options: ["No street shoes", "No students", "Socks only", "Teachers only"], answer: 0 },
        ] },
      { task: "Read a Short Informational Passage", topic: "Why We Yawn",
        passage: "Nobody is fully sure why we yawn. One idea says yawning cools the brain: a deep yawn stretches the jaw and pulls in a rush of air, which may lower the brain's temperature slightly. Another idea points to attention — we yawn most when we are bored or tired, as if the body is trying to wake itself up. What scientists do know is that yawns are contagious: seeing, hearing, or even reading about a yawn makes people yawn, and you may be feeling it right now.",
        qs: [
          { stem: "What does the brain-cooling idea say a yawn does?", options: ["Pulls in air that may cool the brain", "Warms the ears", "Stretches the legs", "Cleans the lungs"], answer: 0 },
          { stem: "When do we yawn most, by the second idea?", options: ["When bored or tired", "When eating", "When running", "When cold"], answer: 0 },
          { stem: "What do scientists know for sure?", options: ["Yawns are contagious", "Yawns cool the heart", "Only humans yawn", "Yawning is rare"], answer: 0 },
        ] },
      { task: "Read a Student Essay", topic: "Quiet Study Room",
        passage: "(Read a classmate's draft and answer the questions.) “Our school need a quiet study room during lunch. First, the library allows talking for group projects, so students who wants silence have nowhere to go. Second, an empty classroom already sits unused next to the office every lunch period. Some worry no teacher will supervise, however office staff can see the room through the connecting window. A quiet room costs nothing and gives focused students the one thing the campus doesn't offer: silence.”",
        qs: [
          { stem: "What is the essay proposing?", options: ["A quiet study room at lunch", "Closing the library", "A new office", "Longer lunches"], answer: 0 },
          { stem: "Which phrase has a subject-verb error?", options: ["“Our school need a quiet study room”", "“an empty classroom already sits”", "“office staff can see”", "“A quiet room costs nothing”"], answer: 0 },
          { stem: "“students who wants silence” should read…", options: ["students who want silence", "students who wanting silence", "student who wants silences", "students whom wants silence"], answer: 0 },
          { stem: "The 'however' sentence is BEST fixed by…", options: ["“…will supervise; however, office staff can see…”", "deleting 'office staff'", "starting the essay with 'however'", "changing 'however' to 'because'"], answer: 0 },
          { stem: "How is the supervision worry answered?", options: ["Office staff can see through the connecting window", "Hiring a guard", "Cameras", "It is ignored"], answer: 0 },
          { stem: "Why mention the empty classroom?", options: ["The space already exists at no cost", "Classrooms are small", "The office is loud", "To criticize teachers"], answer: 0 },
          { stem: "Who does the writer say has 'nowhere to go'?", options: ["Students who want silence", "Group projects", "Teachers", "Office staff"], answer: 0 },
          { stem: "The final sentence's effect is to…", options: ["end with a memorable point", "add a cost estimate", "introduce a new problem", "quote the principal"], answer: 0 },
        ] },
      { task: "Read a Literary Passage", topic: "The Trade",
        passage: "Milo's rookie card was the pride of his binder — the one card everyone at the table wanted and Milo never traded. Then his best friend Theo broke his leg and missed the whole tournament season, watching from the bleachers with his crutches stacked beside him. On the last day of school, Milo slid an envelope through the vents of Theo's locker. Inside was the rookie card and a sticky note: 'Worth more to you this summer than to me.' Theo texted one word — 'why' — and Milo wrote back: 'Because you kept showing up to watch us. That's rarer than the card.'",
        qs: [
          { stem: "What made the rookie card special at the start?", options: ["Everyone wanted it and Milo never traded it", "It was broken", "It was new", "Theo owned it"], answer: 0 },
          { stem: "What happened to Theo?", options: ["He broke his leg and missed the season", "He moved away", "He lost his binder", "He won the tournament"], answer: 0 },
          { stem: "How did Milo give the card?", options: ["An envelope through the locker vents", "At a party", "By mail", "He sold it"], answer: 0 },
          { stem: "What did Milo say was 'rarer than the card'?", options: ["Theo showing up to watch the team", "A signed card", "Winning", "Crutches"], answer: 0 },
          { stem: "The sticky note shows Milo valued…", options: ["his friend over his possession", "money", "the tournament", "trading rules"], answer: 0 },
          { stem: "A theme of the passage is…", options: ["loyalty matters more than things", "cards gain value", "injuries end friendships", "never trade"], answer: 0 },
        ] },
      { task: "Read an Informational Passage", topic: "Lighthouses",
        passage: "For centuries, a lighthouse was only as good as its keeper. Keepers lived beside the tower, hauling oil up spiral stairs, trimming wicks through the night, and polishing the great lens each morning — because one smoky pane could dim the beam that ships' lives depended on. In the twentieth century, electric lamps, automatic timers, and finally satellite navigation arrived, and one by one the keepers' houses emptied. Most lighthouses still shine today, but they shine alone: machines tend the light that once demanded a human's whole life.",
        qs: [
          { stem: "Why did keepers polish the lens daily?", options: ["A dim beam could endanger ships", "For contests", "To pass time", "Rules said hourly"], answer: 0 },
          { stem: "What replaced the keepers?", options: ["Electric lamps, timers, and satellite navigation", "Bigger crews", "Ship captains", "Nothing"], answer: 0 },
          { stem: "'They shine alone' means lighthouses today are…", options: ["automated, without keepers", "turned off", "brighter", "for sale"], answer: 0 },
          { stem: "Hauling oil and trimming wicks shows the job was…", options: ["constant physical work", "easy", "seasonal", "optional"], answer: 0 },
          { stem: "The passage is organized by…", options: ["then versus now", "problem and solution", "a list of lighthouses", "question and answer"], answer: 0 },
          { stem: "The tone of the final sentence is best described as…", options: ["a little wistful", "angry", "comic", "confused"], answer: 0 },
        ] },
    ],
    speaking: [
      { task: "Talk about a Scene (1 of 4)", topic: "Looking at a Map", scene: "map",
        prompt: "Look at the picture. What is happening in this classroom?",
        points: 1, checks: ["A full-sentence description"] },
      { task: "Talk about a Scene (2 of 4)", topic: "Looking at a Map", scene: "map",
        prompt: "Describe the student who is pointing. What might that student be saying?",
        points: 1, checks: ["Described the student", "A reasonable guess"] },
      { task: "Talk about a Scene (3 of 4)", topic: "Looking at a Map", scene: "map",
        prompt: "What subject do you think this class is studying? Give a clue from the picture.",
        points: 1, checks: ["Named a subject", "Gave a clue"] },
      { task: "Talk about a Scene (4 of 4)", topic: "Looking at a Map", scene: "map",
        prompt: "Tell about a place you would like to find on a map, and why.",
        points: 1, checks: ["Named a place", "Gave a why"] },
      { task: "Speech Functions", topic: "Bumped Tray",
        prompt: "You accidentally bumped someone's lunch tray and their drink spilled. What do you say?",
        points: 1, checks: ["Apologized", "Offered to help"] },
      { task: "Speech Functions", topic: "Make Up a Quiz",
        prompt: "You were absent yesterday and missed a quiz. Ask your teacher about making it up.",
        points: 1, checks: ["Explained the absence", "Asked clearly"] },
      { task: "Support an Opinion", topic: "Trips or Speakers",
        prompt: "Should your school spend its budget on more field trips or on guest speakers? State your opinion with a reason and explanation.",
        points: 2, checks: ["Clear opinion", "Reason with explanation"] },
      { task: "Support an Opinion", topic: "Class Movie",
        prompt: "For the end-of-unit reward, should the class watch a comedy or a documentary? Give your opinion with a reason and explanation.",
        points: 2, checks: ["Clear choice", "Developed reason"] },
      { task: "Present and Discuss Information", topic: "Club Membership", scene: "barclubs",
        prompt: "Look at the bar graph. Point 1: Which clubs are largest and smallest? Point 2: A student claims 'Art is the smallest club.' Is that supported? Explain using the graph.",
        points: 3, checks: ["Read the bars correctly", "Judged the claim with data"] },
      { task: "Summarize an Academic Presentation", topic: "Northern Lights",
        prompt: "Summarize the northern lights presentation: where the particles come from, what guides them to the poles, and why there are different colors.",
        points: 4, checks: ["All three parts", "In order", "Own words"] },
      { task: "Summarize an Academic Presentation", topic: "The Erie Canal",
        prompt: "Summarize the Erie Canal presentation: what locks do, what happened to shipping costs, and what it meant for New York.",
        points: 4, checks: ["All three parts", "Connected sentences", "Own words"] },
    ],
    writing: [
      { task: "Describe a Picture (1 of 2)", topic: "Looking at a Map", scene: "map", kind: "choice",
        stem: "A classmate wrote about the picture: “The students look at the map. The teacher stands nearby.” Choose the BEST combination.",
        options: ["The students look at the map while the teacher stands nearby.", "The students look, the teacher stands.", "Nearby the map the students teacher stands.", "The map looks at the students nearby."], answer: 0 },
      { task: "Describe a Picture (2 of 2)", topic: "Looking at a Map", scene: "map", kind: "frame",
        stem: "Write one complete sentence about what the class will probably do after looking at the map.",
        frame: "", accept: ["will", "find", "learn", "write", "places", "countries", "draw", "talk", "next"], minWords: 5,
        hint: "Use 'will' to predict." },
      { task: "Write About an Experience", topic: "Working Toward a Goal", kind: "frame",
        stem: "Write about a goal you worked toward — making a team, learning a song, finishing a book series. What steps did you take, and did you reach it? Write at least three sentences.",
        frame: "", accept: ["goal", "worked", "practiced", "every", "finally", "reached", "because", "first", "then", "kept"], minWords: 18,
        hint: "Steps in order + the result." },
      { task: "Write About Academic Information (1 of 2)", topic: "Reading Log", kind: "frame",
        stem: "A graphic organizer shows Maya's reading log: September — 40 minutes a week · October (joined book club) — 90 minutes a week · November — 150 minutes a week. Write one or two sentences describing what the log shows.",
        frame: "", accept: ["increased", "more", "minutes", "week", "club", "reading", "40", "90", "150", "after"], minWords: 10,
        hint: "Describe the change and when it started." },
      { task: "Write About Academic Information (2 of 2)", topic: "Reading Log", kind: "frame",
        stem: "A classmate says Maya 'just got lucky and found good books.' Using at least one detail from the log, respond to that claim.",
        frame: "", accept: ["club", "joined", "because", "after", "increased", "not", "luck", "october", "minutes", "friends"], minWords: 10,
        hint: "Point to the timing of the change." },
      { task: "Justify an Opinion", topic: "Year-Round School", kind: "frame",
        stem: "Some districts use year-round school: shorter summer, more breaks spread through the year. Should your school switch? State your position and support it with at least two reasons. Write at least three sentences.",
        frame: "", accept: ["year-round", "summer", "breaks", "because", "forget", "learning", "although", "also", "believe", "vacation", "however"], minWords: 20,
        hint: "Position + two reasons; consider the other side." },
    ],
  },
  g35: {
    listening: [
      { task: "Listen to a Short Exchange", topic: "Show and Tell",
        intro: "You will hear two students. Only once.",
        transcript: "Boy: Tomorrow is show and tell. I'm bringing my rock collection!\nGirl: Cool! Ms. Park said everything has to fit in your backpack, remember.",
        qs: [ { stem: "What is the rule for show and tell?", options: ["It must fit in your backpack", "It must be a toy", "It must be new"], answer: 0 } ] },
      { task: "Listen to a Short Exchange", topic: "Wet Paint",
        intro: "Only once.",
        transcript: "Girl: Careful — the sign says the fence by the office has wet paint.\nBoy: Whoa, thanks! I almost leaned right on it.",
        qs: [ { stem: "Why should they be careful?", options: ["The fence has wet paint", "The floor is wet", "The office is closed"], answer: 0 } ] },
      { task: "Listen to a Short Exchange", topic: "Extra Chair",
        intro: "Only once.",
        transcript: "Boy: We need one more chair for our reading group.\nGirl: Take the blue one by the window — Ms. Diaz said that one is extra.",
        qs: [ { stem: "Which chair can they take?", options: ["The blue one by the window", "The teacher's chair", "A chair from another room"], answer: 0 } ] },
      { task: "Listen to a Classroom Conversation", topic: "Book Fair Money",
        intro: "A teacher and a student. Only once.",
        transcript: "Student: Ms. Lee, when is our class going to the book fair?\nTeacher: Thursday, right after lunch.\nStudent: Can I bring money?\nTeacher: Yes — put it in an envelope with your name on it, and keep it in your backpack until we go.\nStudent: Envelope, name, backpack. I can't wait!",
        qs: [
          { stem: "When does the class go to the book fair?", options: ["Thursday after lunch", "Friday morning", "Today"], answer: 0 },
          { stem: "Where should the money go?", options: ["In an envelope with your name", "In your pocket", "On the desk"], answer: 0 },
          { stem: "Where does the envelope stay until the fair?", options: ["In the backpack", "With the teacher", "At home"], answer: 0 },
        ] },
      { task: "Listen to a Story", topic: "The Lost Cap",
        intro: "Listen to a story. Only once.",
        transcript: "Zoe's favorite marker was the purple one, but today its cap was missing. Without a cap, the marker would dry out. She looked under her desk. She looked in the art bin. Then her friend Dan pointed at her pencil box. There, hiding between two erasers, was the purple cap. Zoe clicked it on tight. “From now on,” she said, “the cap goes on before the marker goes away!”",
        qs: [
          { stem: "What was Zoe missing?", options: ["A marker cap", "Her pencil box", "An eraser"], answer: 0 },
          { stem: "Who helped her find it?", options: ["Dan", "The teacher", "Her sister"], answer: 0 },
          { stem: "Where was the cap?", options: ["In her pencil box", "Under the desk", "In the art bin"], answer: 0 },
        ] },
      { task: "Listen to a Story", topic: "Grandpa's Tomatoes",
        intro: "Listen to a story. Only once.",
        transcript: "Every Saturday, Kai helped Grandpa in the tomato garden. Kai wanted to pick the tomatoes right away, but Grandpa always said, “Green means wait.” One Saturday, Kai found a tomato as red as a fire truck. He picked it, and Grandpa sliced it for lunch. It was the sweetest tomato Kai had ever tasted. “See?” Grandpa smiled. “Waiting is part of the recipe.”",
        qs: [
          { stem: "What did Grandpa say about green tomatoes?", options: ["Green means wait", "Pick them fast", "Water them twice"], answer: 0 },
          { stem: "What did Kai find one Saturday?", options: ["A red tomato", "A bird nest", "A new shovel"], answer: 0 },
          { stem: "What did Grandpa mean by 'waiting is part of the recipe'?", options: ["Patience makes things better", "Cook slowly", "Recipes are long"], answer: 0 },
        ] },
      { task: "Listen to an Oral Presentation", topic: "Shadows",
        intro: "Listen to a teacher. Only once.",
        transcript: "Teacher: Your shadow changes all day long. In the morning, when the sun is low, your shadow stretches long and thin. At noon, when the sun is high above you, your shadow shrinks small, right under your feet. In the evening, the sun is low again, and your shadow grows long on the other side. The sun's place in the sky decides your shadow's size and direction.",
        qs: [
          { stem: "When is your shadow longest?", options: ["Morning and evening", "At noon", "At night"], answer: 0 },
          { stem: "Where is your shadow at noon?", options: ["Small, under your feet", "Very long", "Behind a tree"], answer: 0 },
          { stem: "What decides your shadow's size?", options: ["The sun's place in the sky", "Your shoes", "The wind"], answer: 0 },
        ] },
    ],
    reading: [
      { task: "Read and Choose a Sentence", topic: "Lining Up",
        passage: "Look at the picture: students are lining up quietly at the classroom door.",
        qs: [ { stem: "Choose the sentence that matches the picture.", options: ["The students are lining up at the door.", "The students are eating lunch.", "The door is closed and locked.", "The students are running outside."], answer: 0 } ] },
      { task: "Read and Choose a Sentence", topic: "Raising a Hand",
        passage: "Look at the picture: a girl is raising her hand to answer a question.",
        qs: [ { stem: "Choose the sentence that matches the picture.", options: ["The girl is raising her hand.", "The girl is drawing a picture.", "The girl is asleep.", "The teacher is raising her hand."], answer: 0 } ] },
      { task: "Read a Short Informational Passage", topic: "Monday Lunch",
        passage: "Monday's lunch is a taco bowl with rice and beans. Students who do not want the taco bowl may choose a cheese sandwich instead. Milk and apple slices come with both meals. Remember to tell the lunch helper your choice at the front of the line.",
        qs: [
          { stem: "What is Monday's main lunch?", options: ["A taco bowl", "Pizza", "Soup", "Spaghetti"], answer: 0 },
          { stem: "What can students choose instead?", options: ["A cheese sandwich", "A burger", "Nothing", "Cereal"], answer: 0 },
          { stem: "What comes with both meals?", options: ["Milk and apple slices", "Juice and cookies", "Soup", "Chips"], answer: 0 },
        ] },
      { task: "Read a Student Essay", topic: "Fire Station Visit",
        passage: "(A student wrote this. Read it and answer the questions.) “Our class should visit the fire station. First, we are learning about community helpers, so the trip match our unit. Second, firefighters can show us the truck and teach us safety rules we can use at home. Some kids say the station is far, but it is only two blocks past the library, and we walk to the library every month. A visit would make our learning real.”",
        qs: [
          { stem: "Where does the writer want to go?", options: ["The fire station", "The zoo", "The museum", "The park"], answer: 0 },
          { stem: "Which phrase has an error?", options: ["“the trip match our unit”", "“we walk to the library”", "“teach us safety rules”", "“make our learning real”"], answer: 0 },
          { stem: "The BEST fix for “the trip match” is…", options: ["the trip matches", "the trips match it", "the trip matching", "match the trip"], answer: 0 },
          { stem: "How does the writer answer 'the station is far'?", options: ["It is only two blocks past the library", "By taking a bus", "By going next year", "It is ignored"], answer: 0 },
          { stem: "What are the students learning about?", options: ["Community helpers", "Weather", "Animals", "Space"], answer: 0 },
          { stem: "“Make our learning real” means the trip would…", options: ["show the unit in real life", "be expensive", "replace tests", "take all day"], answer: 0 },
        ] },
      { task: "Read a Literary Passage", topic: "The Quiet Drum",
        passage: "Marcus got the biggest drum for the spring music show — and the biggest case of nerves. At practice, his hands felt like they belonged to someone else, and his boom came in late every time. His music teacher knelt beside him. “Don't listen for your turn,” she said. “Feel it. Count with your feet.” Marcus tapped his toes inside his shoes: one, two, three, BOOM. At the show, his feet counted, his drum thundered right on time, and the crowd's cheer was almost as loud as he was.",
        qs: [
          { stem: "What was Marcus's problem at practice?", options: ["His drum came in late", "His drum was broken", "He lost his sticks", "He was too loud"], answer: 0 },
          { stem: "What did the teacher tell him to do?", options: ["Count with his feet", "Play softer", "Watch the crowd", "Skip his part"], answer: 0 },
          { stem: "“His hands felt like they belonged to someone else” shows Marcus felt…", options: ["nervous", "sleepy", "angry", "bored"], answer: 0 },
          { stem: "How did the show go?", options: ["His drum came in right on time", "He missed his turn", "The show was canceled", "He dropped the drum"], answer: 0 },
          { stem: "What helped Marcus succeed?", options: ["Counting one-two-three with his toes", "A new drum", "Luck", "Playing first"], answer: 0 },
          { stem: "What lesson does the story teach?", options: ["A small trick and practice can beat nerves", "Drums are easy", "Never play loud", "Shows are scary"], answer: 0 },
        ] },
      { task: "Read an Informational Passage", topic: "Owls at Night",
        passage: "Owls are built for the night. Their huge eyes gather every bit of moonlight, and their heads can turn far around to look behind them without moving their bodies. An owl's ears are hidden at different heights on its head, which helps it tell exactly where a tiny sound is coming from — even a mouse under the snow. Best of all, soft fringes on their wing feathers make owls almost silent when they fly, so dinner never hears them coming.",
        qs: [
          { stem: "What do an owl's big eyes do?", options: ["Gather moonlight", "Change color", "Glow", "Close all day"], answer: 0 },
          { stem: "How do uneven ears help an owl?", options: ["Tell exactly where a sound comes from", "Hear music", "Stay warm", "Balance"], answer: 0 },
          { stem: "Why are owls almost silent when they fly?", options: ["Soft fringes on their wing feathers", "They fly slowly", "They are small", "They glide only"], answer: 0 },
          { stem: "The passage is mostly about how owls…", options: ["are built for the night", "build nests", "raise babies", "migrate"], answer: 0 },
          { stem: "“Dinner never hears them coming” refers to…", options: ["the animals owls hunt", "owl babies", "other owls", "farmers"], answer: 0 },
        ] },
    ],
    speaking: [
      { task: "Talk about a Scene (1 of 4)", topic: "Math Class", scene: "mathclass",
        prompt: "Look at the picture. What is the teacher doing?",
        points: 1, checks: ["A full sentence"] },
      { task: "Talk about a Scene (2 of 4)", topic: "Math Class", scene: "mathclass",
        prompt: "What do you see on the board?",
        points: 1, checks: ["Named what's on the board"] },
      { task: "Talk about a Scene (3 of 4)", topic: "Math Class", scene: "mathclass",
        prompt: "What will the student probably do next?",
        points: 1, checks: ["Used 'will' to predict"] },
      { task: "Talk about a Scene (4 of 4)", topic: "Math Class", scene: "mathclass",
        prompt: "Tell about a time you solved a hard problem. How did you feel?",
        points: 1, checks: ["Past tense", "A feeling"] },
      { task: "Speech Functions", topic: "Bandage",
        prompt: "You got a small paper cut and need a bandage. What do you say to your teacher?",
        points: 1, checks: ["Polite and clear"] },
      { task: "Speech Functions", topic: "Saying Sorry",
        prompt: "You accidentally stepped on a classmate's foot in line. What do you say?",
        points: 1, checks: ["Apologized kindly"] },
      { task: "Support an Opinion", topic: "Draw or Build",
        prompt: "For free time, is it better to draw pictures or build with blocks? Say your choice and one reason.",
        points: 2, checks: ["A choice", "A because"] },
      { task: "Support an Opinion", topic: "Snack Choice",
        prompt: "Which is a better snack: apples or bananas? Say your opinion and one reason.",
        points: 2, checks: ["Clear opinion", "One reason"] },
      { task: "Retell a Narrative", topic: "Grandpa's Tomatoes",
        prompt: "Retell the story about Kai and Grandpa's tomatoes. Use 'first,' 'then,' and 'last.'",
        points: 4, checks: ["First/then/last", "The whole story"] },
      { task: "Summarize an Academic Presentation", topic: "Shadows",
        prompt: "Tell a friend how your shadow changes in the morning, at noon, and in the evening.",
        points: 4, checks: ["All three times of day", "In order"] },
    ],
    writing: [
      { task: "Describe a Picture (1 of 2)", topic: "Science Fair", scene: "sciencefair", kind: "frame",
        stem: "Look at the picture. Write one sentence about what you see at the tables.",
        frame: "", accept: ["projects", "tables", "students", "science", "posters", "standing", "showing", "fair"], minWords: 4,
        hint: "“I see…” or “The students…”" },
      { task: "Describe a Picture (2 of 2)", topic: "Science Fair", scene: "sciencefair", kind: "frame",
        stem: "Write one sentence about what the person with the clipboard will do next.",
        frame: "", accept: ["will", "look", "judge", "write", "walk", "ask", "visit", "next"], minWords: 4,
        hint: "Use 'will.'" },
      { task: "Write About an Experience", topic: "Favorite Game", kind: "frame",
        stem: "Write about your favorite game to play. What is it, and why do you like it? Write at least two sentences.",
        frame: "", accept: ["game", "play", "favorite", "because", "fun", "friends", "like", "win", "outside", "together"], minWords: 12,
        hint: "Name the game + a because." },
      { task: "Write About Academic Information (1 of 2)", topic: "Weather Chart", kind: "frame",
        stem: "A weather chart for last week shows: sunny — 3 days · rainy — 2 days · cloudy — 0 days. Using the chart, write one or two sentences about last week's weather.",
        frame: "", accept: ["sunny", "rainy", "three", "two", "3", "2", "days", "week", "more", "most"], minWords: 8,
        hint: "Use the numbers from the chart." },
      { task: "Write About Academic Information (2 of 2)", topic: "Weather Chart", kind: "frame",
        stem: "Using the same chart, which day type would be best for a class picnic? Write one sentence and say why.",
        frame: "", accept: ["sunny", "because", "picnic", "outside", "dry", "warm", "best", "play"], minWords: 6,
        hint: "'A sunny day is best because…'" },
      { task: "Justify an Opinion", topic: "Class Jobs", kind: "frame",
        stem: "Some teachers give every student a class job, like line leader or plant helper. Should kids have class jobs? Say your opinion and give at least one reason.",
        frame: "", accept: ["jobs", "help", "because", "learn", "responsible", "class", "should", "think", "fair", "turns"], minWords: 12,
        hint: "Opinion + because + a detail." },
    ],
  },
};


// ════════════════════════════════════════════════════════════════
//  GRADES 3–5 — rebuilt to the VERIFIED official blueprint
//  Listening 22 Q · Reading 26 Q · Speaking 12 tasks · Writing 6 tasks
//  Set 1 = real practice-test TOPICS (original wording)
//  Sets 2–3 = original topics, identical structure
// ════════════════════════════════════════════════════════════════

const S1_G35 = {
  listening: [
    { task: "Listen to a Short Exchange", topic: "Showed Computer Game",
      intro: "You will hear two students talk. You will hear it only once.",
      transcript: "Boy: I made this computer game in club yesterday. The cat has to catch the falling stars.\nGirl: You made that yourself? Show me how you start it.",
      qs: [ { stem: "What did the boy make?", options: ["A computer game", "A cat drawing", "A star chart"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "Read New Book",
      intro: "You will hear it only once.",
      transcript: "Girl: I finished the new mystery book last night. I could not stop reading.\nBoy: Don't tell me the ending! I am only on chapter two.",
      qs: [ { stem: "Why doesn't the boy want to hear about the ending?", options: ["He has not finished the book", "He does not like mysteries", "He already knows it"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "Rode Bikes and Rained",
      intro: "You will hear it only once.",
      transcript: "Boy: We rode our bikes to the park, but then it started raining hard, so we went inside the library.\nGirl: Good idea. You would have been soaked.",
      qs: [ { stem: "Why did they go into the library?", options: ["To get books", "Because it started raining", "To meet a friend"], answer: 1 } ] },
    { task: "Listen to a Classroom Conversation", topic: "Join Computer Club",
      intro: "You will hear a teacher and a student. You will hear it only once.",
      transcript: "Student: Mr. Diaz, can I still join the computer club?\nTeacher: Of course. We meet on Wednesdays in the computer lab, right after school.\nStudent: Do I need to know how to code already?\nTeacher: Not at all. Beginners are welcome. Just bring the signed permission form from the office before Wednesday.\nStudent: I will get it at lunch today.",
      qs: [
        { stem: "When does the computer club meet?", options: ["Mondays", "Wednesdays", "Fridays"], answer: 1 },
        { stem: "What must the student bring?", options: ["A laptop", "A signed permission form", "A snack"], answer: 1 },
        { stem: "What does the teacher say about beginners?", options: ["They are welcome", "They must wait a year", "They need a test"], answer: 0 },
      ] },
    { task: "Listen to a Story", topic: "TV Show Ends",
      intro: "Listen to a story. You will hear it only once.",
      transcript: "Every Friday, Mia and her grandmother watched the same cooking show together. When the show announced its last episode, Mia felt sad. On the final Friday, her grandmother turned off the television and pulled out a notebook. Inside were all the recipes she had written down from the show, year after year. “The show is over,” she said, “but we still have every dish.” That Friday, they cooked the very first recipe in the book.",
      qs: [
        { stem: "What did Mia and her grandmother do every Friday?", options: ["Watched a cooking show", "Went to the park", "Baked bread"], answer: 0 },
        { stem: "Why did Mia feel sad?", options: ["The show was ending", "She lost the notebook", "Her grandmother was busy"], answer: 0 },
        { stem: "What was in the notebook?", options: ["Recipes from the show", "Photographs", "Homework"], answer: 0 },
      ] },
    { task: "Listen to a Story", topic: "Riding Rides",
      intro: "Listen to a story. You will hear it only once.",
      transcript: "At the fair, Owen wanted to ride the tall spinning swings, but the line was long and his little sister Ruby was too short to ride. Owen watched Ruby stare at the small train ride instead. He thought for a moment, then took her hand and rode the little train with her twice. Later, Ruby told their mother it was the best day ever. Owen never made it to the swings, and he did not mind at all.",
      qs: [
        { stem: "What ride did Owen want to go on?", options: ["The spinning swings", "The small train", "The slide"], answer: 0 },
        { stem: "Why couldn't Ruby ride it?", options: ["She was too short", "She was afraid", "The line was closed"], answer: 0 },
        { stem: "What did Owen decide to do?", options: ["Ride the train with Ruby", "Wait in the long line", "Go home early"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Denali",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Denali is the tallest mountain in North America. It stands in Alaska and rises more than twenty thousand feet above the sea. The name Denali comes from the Koyukon people who have lived near the mountain for thousands of years, and it means “the tall one.” The weather there is some of the coldest on Earth, so climbers must carry heavy gear and often wait many days for a safe day to climb.",
      qs: [
        { stem: "Where is Denali?", options: ["Alaska", "Canada", "Colorado"], answer: 0 },
        { stem: "What does the name Denali mean?", options: ["The tall one", "The cold place", "The white rock"], answer: 0 },
        { stem: "Why do climbers wait many days?", options: ["To find a safe day to climb", "To buy tickets", "To meet a guide"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Watermills",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Long before electricity, people used watermills to do heavy work. A watermill has a large wheel that sits in a moving stream. As the water pushes the wheel, the wheel turns, and gears inside the mill turn with it. Those gears could grind grain into flour or cut wood into boards. The best part is that the river never got tired, so the mill could work all day without a single person pushing it.",
      qs: [
        { stem: "What makes a watermill's wheel turn?", options: ["Moving water", "Wind", "Horses"], answer: 0 },
        { stem: "What could a watermill do?", options: ["Grind grain into flour", "Cook food", "Carry mail"], answer: 0 },
        { stem: "Why was the river helpful?", options: ["It never got tired", "It was warm", "It was quiet"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Elephant Tools",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Many people think only humans use tools, but elephants use them too. An elephant may pick up a branch with its trunk and use it to scratch an itch it cannot reach. Some elephants drop large rocks onto electric fences to break them. Others chew bark into a ball, drop it into a small water hole, and use it as a plug so the water does not dry up in the sun. Scientists say this shows elephants can plan ahead.",
      qs: [
        { stem: "What does an elephant use a branch for?", options: ["To scratch an itch", "To build a nest", "To carry food"], answer: 0 },
        { stem: "Why do elephants drop rocks on fences?", options: ["To break them", "To sharpen them", "To hide them"], answer: 0 },
        { stem: "What is the chewed bark used for?", options: ["A plug for a water hole", "Food for babies", "A soft bed"], answer: 0 },
        { stem: "What do scientists say this shows?", options: ["Elephants can plan ahead", "Elephants are afraid", "Elephants like games"], answer: 0 },
      ] },
  ],
  reading: [
    { task: "Read and Choose a Sentence", topic: "Living Room", scene: "s1-35-rc-living-room",
      qs: [ { stem: "Choose the sentence that best describes the picture.", options: ["The girl is reading on the couch.", "The girl is washing the dishes.", "The cat is eating dinner.", "The lamp is on the floor."], answer: 0 } ] },
    { task: "Read and Choose a Sentence", topic: "Recess Play", scene: "s1-35-rc-recess-play",
      qs: [ { stem: "Choose the sentence that best describes the picture.", options: ["The children are playing outside.", "The children are taking a test.", "The teacher is reading a story.", "The playground is empty."], answer: 0 } ] },
    { task: "Read a Short Informational Passage", topic: "Cheetahs",
      passage: "A cheetah is the fastest land animal in the world. It can run as fast as a car on the highway, but only for about twenty seconds. After a sprint, a cheetah must rest for half an hour before it can run again. Its long tail works like the rudder of a boat, swinging out to help the cheetah turn quickly without falling over.",
      qs: [
        { stem: "How long can a cheetah run at top speed?", options: ["All day", "About twenty seconds", "Twenty minutes", "One hour"], answer: 1 },
        { stem: "What must a cheetah do after a sprint?", options: ["Eat", "Rest for about half an hour", "Swim", "Climb a tree"], answer: 1 },
        { stem: "How does the tail help the cheetah?", options: ["It keeps it warm", "It helps it turn quickly", "It scares enemies", "It holds food"], answer: 1 },
      ] },
    { task: "Read a Short Informational Passage", topic: "Pinecone Fish",
      passage: "The pinecone fish is named for its scales, which are thick and yellow and overlap like the pieces of a pinecone. It lives in deep, dark ocean water, and it carries its own light: two glowing spots sit on its lower jaw. The glow does not come from the fish itself. It comes from tiny bacteria that live inside those spots and shine in the darkness, helping the fish find small shrimp to eat.",
      qs: [
        { stem: "Why is the fish called a pinecone fish?", options: ["It lives in trees", "Its scales overlap like a pinecone", "It eats pinecones", "It is shaped like a cone"], answer: 1 },
        { stem: "Where are the glowing spots?", options: ["On its lower jaw", "On its tail", "On its back", "In its eyes"], answer: 0 },
        { stem: "What makes the spots glow?", options: ["Tiny bacteria", "Sunlight", "Salt", "Its scales"], answer: 0 },
      ] },
    { task: "Read a Student Essay", topic: "Saturday School",
      passage: "(A student wrote this for class. Read it and answer the questions.) “Our school should offer Saturday classes for students who want them. First, some students needs more time to understand hard subjects, and a quiet Saturday morning is perfect for that. Second, the building sit empty every weekend, so we would not need a new space. Some parents say children should rest on Saturday, however the classes would only last two hours and would be completely optional. Saturday school would help students who want help, without taking anything away from anyone else.”",
      qs: [
        { stem: "What does the writer want?", options: ["Optional Saturday classes", "A longer school day", "A new school building", "Fewer tests"], answer: 0 },
        { stem: "Which phrase has a grammar error?", options: ["“some students needs more time”", "“a quiet Saturday morning”", "“the classes would only last two hours”", "“without taking anything away”"], answer: 0 },
        { stem: "“The building sit empty” should be written as…", options: ["The building sits empty", "The buildings sits empty", "The building sitting empty", "The building sat empties"], answer: 0 },
        { stem: "How does the writer answer parents who want children to rest?", options: ["The classes are short and optional", "Parents are wrong", "Rest is not important", "Students can sleep in class"], answer: 0 },
        { stem: "Why does the writer mention the empty building?", options: ["No new space would be needed", "The building is old", "It is too small", "It should be sold"], answer: 0 },
        { stem: "The words “First” and “Second” are used to…", options: ["organize the writer's reasons", "show what time it is", "name the days", "count the students"], answer: 0 },
      ] },
    { task: "Read a Literary Passage", topic: "Caring for Animals",
      passage: "Nobody wanted the old shelter dog with the gray face. Every family walked past his kennel to see the puppies. Every Saturday, Jonah came to the shelter to read out loud to the animals, and every Saturday he sat by the old dog's door and read a chapter. The dog never barked. He just rested his chin near Jonah's shoe and listened. On the eleventh Saturday, a woman stopped to ask why that particular dog was so calm. “He likes stories,” Jonah said. She stayed for the whole chapter. She took him home that afternoon.",
      qs: [
        { stem: "Why did families walk past the old dog?", options: ["They wanted to see the puppies", "The dog barked", "The kennel was closed", "The dog was sleeping"], answer: 0 },
        { stem: "What did Jonah do every Saturday?", options: ["Read out loud to the animals", "Wash the kennels", "Feed the puppies", "Walk the dogs"], answer: 0 },
        { stem: "How did the dog act while Jonah read?", options: ["He rested his chin and listened", "He barked loudly", "He ran in circles", "He hid in a corner"], answer: 0 },
        { stem: "Why did the woman stop at the kennel?", options: ["She wondered why the dog was calm", "She knew Jonah", "She was lost", "She worked there"], answer: 0 },
        { stem: "What happened at the end?", options: ["The woman adopted the dog", "Jonah adopted the dog", "The dog ran away", "The shelter closed"], answer: 0 },
        { stem: "What is the lesson of this passage?", options: ["Small kindnesses can change things", "Old dogs are difficult", "Reading is hard work", "Puppies are the best pets"], answer: 0 },
      ] },
    { task: "Read an Informational Passage", topic: "Becoming an Astronaut",
      passage: "Becoming an astronaut takes many years. First, most astronauts study science, engineering, or medicine in college, because much of the work in space is scientific research. Next comes experience: many have flown airplanes or worked as doctors or engineers for years before applying. Those who are chosen then train for about two years. They practice spacewalks in a giant swimming pool, because floating in water feels a little like floating in space. They also learn to speak Russian, since astronauts from many countries live and work together on the International Space Station.",
      qs: [
        { stem: "What do most astronauts study in college?", options: ["Science, engineering, or medicine", "Music", "Cooking", "Law"], answer: 0 },
        { stem: "How long does astronaut training take?", options: ["About two years", "One week", "Ten years", "Six months"], answer: 0 },
        { stem: "Why do astronauts train in a swimming pool?", options: ["Floating in water feels like floating in space", "To learn to swim", "To stay cool", "To clean their suits"], answer: 0 },
        { stem: "Why do astronauts learn Russian?", options: ["They work with astronauts from many countries", "It is the easiest language", "The rockets are labeled in Russian", "It is required in college"], answer: 0 },
        { stem: "The passage is mostly about…", options: ["the steps to becoming an astronaut", "life on the space station", "how rockets work", "the history of space travel"], answer: 0 },
        { stem: "The word “Next” in the passage signals…", options: ["another step in order", "a surprise", "an opinion", "a question"], answer: 0 },
      ] },
  ],
  speaking: [
    { task: "Talk about a Scene (1 of 4)", topic: "Paper Animals", scene: "s1-35-sp-paper-animals",
      prompt: "Look at the picture. What are the children doing?", points: 1, checks: ["A full sentence about the children"] },
    { task: "Talk about a Scene (2 of 4)", topic: "Paper Animals", scene: "s1-35-sp-paper-animals",
      prompt: "Name two things you see on the table.", points: 1, checks: ["Two things named"] },
    { task: "Talk about a Scene (3 of 4)", topic: "Paper Animals", scene: "s1-35-sp-paper-animals",
      prompt: "What do you think the children will do with the paper animals?", points: 2, checks: ["A prediction", "A reason"] },
    { task: "Talk about a Scene (4 of 4)", topic: "Paper Animals", scene: "s1-35-sp-paper-animals",
      prompt: "Tell about something you have made with your hands. What was it?", points: 2, checks: ["Past tense", "What it was and how you made it"] },
    { task: "Speech Functions", topic: "Special Event",
      prompt: "You want to invite a friend to a special event at your school. What would you say?", points: 1, checks: ["A clear invitation", "Friendly"] },
    { task: "Speech Functions", topic: "Science Project",
      prompt: "You need help finishing your science project. What would you say to your teacher?", points: 1, checks: ["Polite request", "Said what help is needed"] },
    { task: "Support an Opinion", topic: "Air and Space Museum or Fire Station",
      prompt: "Your class can take one field trip: the air and space museum or the fire station. Which should your class choose? Say your opinion and give a reason.", points: 3, checks: ["A clear choice", "A reason with 'because'", "Full sentences"] },
    { task: "Support an Opinion", topic: "Report or Presentation",
      prompt: "For your next project, is it better to write a report or give a presentation? Say your opinion and give a reason.", points: 3, checks: ["A clear opinion", "A reason", "Full sentences"] },
    { task: "Retell a Narrative", topic: "Learning Guitar",
      prompt: "Listen to this story, then retell it. Nina's uncle gave her an old guitar. Her fingers hurt and the notes sounded wrong, so she almost put it away. Her uncle told her to play only one song, every day, for one month. On the last day of the month, she played that song perfectly for her whole family. Retell the story. Tell what happened first, next, and last.", points: 4, checks: ["Beginning, middle, end", "Events in order", "Full sentences"] },
    { task: "Summarize an Academic Presentation", topic: "Sound Waves",
      prompt: "A teacher explained sound waves: sound travels in waves; changing the size or shape of a sound wave changes the pitch; five empty jars make the same sound, but as you add different amounts of water, each jar makes a different pitch. Summarize what you learned in your own words.", points: 4, checks: ["The main idea", "The jar example", "Your own words"] },
    { task: "Summarize an Academic Presentation", topic: "Women in the Gold Rush",
      prompt: "A teacher explained that during the Gold Rush, most people picture men panning for gold, but women ran the boarding houses, bakeries, and laundries that the miners depended on. Many earned more money than the miners did, because miners needed meals and clean clothes every single day. Summarize this in your own words.", points: 4, checks: ["What women did", "Why they earned well", "Your own words"] },
  ],
  writing: [
    { task: "Describe a Picture (Question 1)", topic: "Looking at a Map", scene: "s1-35-dp-map", kind: "frame",
      stem: "Look at the picture. Write one sentence that tells what the boy is doing. Add details to make your sentence clear.",
      accept: ["boy", "points", "pointing", "map", "shows", "showing", "looking", "touches"], minWords: 4,
      hint: "One complete sentence, for example: “A boy points at the map.”", points: 2 },
    { task: "Describe a Picture (Question 2)", topic: "Looking at a Map", scene: "s1-35-dp-map", kind: "frame",
      stem: "Look at the same picture. Write one sentence about something that might happen next.",
      accept: ["will", "next", "children", "students", "go", "lunch", "learn", "find", "class", "then"], minWords: 4,
      hint: "Use “will”, for example: “The children will go to lunch next.”", points: 2 },
    { task: "Write About an Experience", topic: "Helped Someone", kind: "frame",
      stem: "Write about a time you helped someone. What did you do, and what happened? Write a paragraph of at least three sentences.",
      accept: ["helped", "asked", "showed", "teacher", "friend", "first", "then", "because", "she", "he", "after", "when"], minWords: 20,
      hint: "Past tense. Tell what happened first, then what you did, then how it ended.", points: 4 },
    { task: "Write About Academic Information (Question 4)", topic: "Three Rs", scene: "three-rs-organizer", kind: "frame",
      stem: "A chart titled “Reduce” lists ways to use fewer resources: take short showers · bring bags to stores · turn lights off. Using details from the chart, write about how people can use fewer resources. Write at least one sentence.",
      accept: ["showers", "bags", "stores", "lights", "short", "turn", "off", "bring", "fewer", "resources", "reduce"], minWords: 8,
      hint: "Use two or more details from the chart in a complete sentence.", points: 2 },
    { task: "Write About Academic Information (Question 5)", topic: "Three Rs", scene: "three-rs-organizer", kind: "frame",
      stem: "The chart also shows “Reuse” (use reusable containers · use grocery bags as trash bags · carry the same water bottle) and “Recycle” (make craft projects from old materials · bring glass, aluminum, and paper to recycling centers · use items made from recycled materials). Write about what reuse and recycle mean, using details from the chart. Write at least two sentences.",
      accept: ["reuse", "recycle", "again", "containers", "bags", "bottle", "craft", "glass", "aluminum", "paper", "centers", "materials", "new"], minWords: 18,
      hint: "Two sentences: one about reuse, one about recycle. Use details from the chart.", points: 3 },
    { task: "Justify an Opinion", topic: "No More Homework", kind: "frame",
      stem: "Some teachers are thinking about not giving homework anymore. Do you think this is a good idea? Write your opinion and give at least two reasons. Use three or more sentences.",
      accept: ["think", "homework", "because", "good", "idea", "kids", "students", "time", "play", "learn", "also", "family", "practice"], minWords: 20,
      hint: "Opinion first, then two reasons. Example: “I think… First… Also…”", points: 4 },
  ],
};

const S2_G35 = {
  listening: [
    { task: "Listen to a Short Exchange", topic: "Lost Library Book",
      intro: "You will hear two students talk. You will hear it only once.",
      transcript: "Girl: I cannot find my library book anywhere. It is due today.\nBoy: Did you check the reading corner? People leave books on the beanbag chairs all the time.",
      qs: [ { stem: "Where does the boy say to look?", options: ["The reading corner", "The office", "Her backpack"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "New Shoes",
      intro: "You will hear it only once.",
      transcript: "Boy: Look at my new running shoes. I got them for field day.\nGirl: They look fast! Are you running in the relay race?",
      qs: [ { stem: "Why did the boy get new shoes?", options: ["For field day", "For his birthday", "For the winter"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "Forgot Lunch",
      intro: "You will hear it only once.",
      transcript: "Girl: I left my lunch on the kitchen counter at home.\nBoy: You can get a school lunch today. Just tell the helper at the front of the line.",
      qs: [ { stem: "What should the girl do?", options: ["Tell the lunch helper", "Call her mother", "Wait until dinner"], answer: 0 } ] },
    { task: "Listen to a Classroom Conversation", topic: "Class Garden Job",
      intro: "You will hear a teacher and a student. You will hear it only once.",
      transcript: "Student: Ms. Ortiz, can I take care of the class garden this month?\nTeacher: Yes. The garden helper waters the beds on Tuesday and Friday mornings.\nStudent: How much water do the plants need?\nTeacher: One full can for the whole bed. Do not water the herbs, though. They already get too much rain by the window.\nStudent: Tuesday and Friday, one can, no herbs. I can do that.",
      qs: [
        { stem: "Which days does the garden helper water?", options: ["Every day", "Tuesday and Friday", "Only Monday"], answer: 1 },
        { stem: "How much water does the bed need?", options: ["One full can", "Three cans", "A small cup"], answer: 0 },
        { stem: "Why should the herbs not be watered?", options: ["They already get rain", "They are dead", "They are not plants"], answer: 0 },
      ] },
    { task: "Listen to a Story", topic: "The Broken Swing",
      intro: "Listen to a story. You will hear it only once.",
      transcript: "The swing at the end of the row had been broken all year, and everyone had stopped trying it. One morning, Priya noticed that the chain was not broken at all. It had only come off its hook. She could not reach the hook, so she told the custodian, Mr. Bell. He brought a ladder, lifted the chain back on, and tested the swing himself. By recess, there was a line of children waiting for the swing nobody had used in months.",
      qs: [
        { stem: "What was wrong with the swing?", options: ["The chain had come off its hook", "The seat was missing", "It was too high"], answer: 0 },
        { stem: "Why did Priya tell Mr. Bell?", options: ["She could not reach the hook", "She was afraid", "She wanted a turn"], answer: 0 },
        { stem: "What happened by recess?", options: ["Children lined up for the swing", "The swing broke again", "The playground closed"], answer: 0 },
      ] },
    { task: "Listen to a Story", topic: "Grandma's Song",
      intro: "Listen to a story. You will hear it only once.",
      transcript: "Tomas was nervous about singing in the school show. On the morning of the show, his grandmother taught him a song she had sung as a girl in her village. It was short and easy, and she sang it slowly until he knew every word. That night, when the lights came on and Tomas felt his hands shake, he sang his grandmother's song instead of the one he had practiced. The audience clapped for a long time, and his grandmother clapped the longest.",
      qs: [
        { stem: "Why was Tomas nervous?", options: ["He had to sing in a show", "He forgot his homework", "He was sick"], answer: 0 },
        { stem: "Where did the song come from?", options: ["His grandmother's village", "A music book", "The radio"], answer: 0 },
        { stem: "What did Tomas do on stage?", options: ["Sang his grandmother's song", "Ran off the stage", "Sang nothing"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Honeybee Hives",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "A beehive is one of the busiest places in nature. Inside, thousands of bees each have a job. Young bees clean the cells and feed the babies. Older bees fly out to gather nectar from flowers. Guard bees stand at the door and check every bee that returns. And all summer, the whole hive works to store honey, because honey is the food that keeps them alive through the cold winter when no flowers bloom.",
      qs: [
        { stem: "What do young bees do?", options: ["Clean cells and feed babies", "Guard the door", "Gather nectar"], answer: 0 },
        { stem: "What do guard bees do?", options: ["Check every bee that returns", "Make honey", "Build flowers"], answer: 0 },
        { stem: "Why does the hive store honey?", options: ["It is food for winter", "To sell it", "To make the hive heavy"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "The Water Cycle",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Water on Earth never disappears. It just keeps moving in a circle. The sun heats lakes and oceans, and the water rises into the air as invisible vapor. High in the sky, the vapor cools and gathers into clouds. When the drops in a cloud get heavy enough, they fall back down as rain or snow. That water runs into rivers, the rivers flow to the ocean, and the sun starts the whole trip over again.",
      qs: [
        { stem: "What makes water rise into the air?", options: ["The sun heats it", "The wind pushes it", "Fish move it"], answer: 0 },
        { stem: "What happens when vapor cools?", options: ["It forms clouds", "It disappears", "It turns to sand"], answer: 0 },
        { stem: "Why do drops fall as rain?", options: ["They become heavy", "They get cold", "They are pushed"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Desert Animals",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Deserts are hot and dry, so the animals that live there have clever ways to survive. Many, like the kangaroo rat, sleep underground all day and come out only at night when the air is cool. The fennec fox has enormous ears, not just for hearing, but to let heat escape from its body. Some desert animals almost never drink at all. The kangaroo rat gets nearly all the water it needs from the dry seeds it eats.",
      qs: [
        { stem: "Why do many desert animals come out at night?", options: ["The air is cool", "It is quieter", "They can see better"], answer: 0 },
        { stem: "Why does the fennec fox have big ears?", options: ["To let heat escape", "To dig holes", "To carry food"], answer: 0 },
        { stem: "Where does the kangaroo rat get water?", options: ["From the seeds it eats", "From a river", "From rain"], answer: 0 },
        { stem: "The presentation is mostly about…", options: ["how desert animals survive", "how hot deserts are", "where deserts are found"], answer: 0 },
      ] },
  ],
  reading: [
    { task: "Read and Choose a Sentence", topic: "Kitchen Breakfast", scene: "s2-35-rc-kitchen",
      qs: [ { stem: "Choose the sentence that best describes the picture.", options: ["The boy is pouring cereal into a bowl.", "The boy is sleeping in bed.", "The dog is cooking breakfast.", "The kitchen is empty."], answer: 0 } ] },
    { task: "Read and Choose a Sentence", topic: "Bus Stop", scene: "s2-35-rc-bus-stop",
      qs: [ { stem: "Choose the sentence that best describes the picture.", options: ["The children are waiting for the bus.", "The children are swimming.", "The bus is inside the school.", "The children are asleep."], answer: 0 } ] },
    { task: "Read a Short Informational Passage", topic: "Sea Otters",
      passage: "Sea otters spend almost their whole lives in the ocean, and they have a clever way of keeping from floating apart. Before they sleep, otters wrap themselves in long strands of seaweed so the waves cannot carry them away. Sometimes they hold hands instead, forming a floating group called a raft. Otters also keep a favorite rock tucked in a pocket of loose skin under one arm, and they use it to crack open shells.",
      qs: [
        { stem: "Why do otters wrap themselves in seaweed?", options: ["To stay warm", "So waves do not carry them away", "To hide from fish", "To catch food"], answer: 1 },
        { stem: "What is a group of floating otters called?", options: ["A pack", "A raft", "A school", "A pod"], answer: 1 },
        { stem: "What do otters use their favorite rock for?", options: ["Cracking open shells", "Digging holes", "Sharpening claws", "Building nests"], answer: 0 },
      ] },
    { task: "Read a Short Informational Passage", topic: "How Bridges Stand",
      passage: "A bridge must hold its own weight plus everything that crosses it. Long ago, builders discovered that an arch is one of the strongest shapes for this job. When weight presses down on the top of an arch, the force spreads outward and down along the curve, into the strong ground at each end. That is why some stone arch bridges built two thousand years ago are still standing, and people still walk across them today.",
      qs: [
        { stem: "What must a bridge hold?", options: ["Its own weight and everything crossing it", "Only cars", "Only its own weight", "Only people"], answer: 0 },
        { stem: "Where does the force of an arch go?", options: ["Along the curve into the ground", "Straight up", "Into the water", "Nowhere"], answer: 0 },
        { stem: "What does the last sentence show?", options: ["Arch bridges last a very long time", "Old bridges are unsafe", "Stone is cheap", "Bridges are new"], answer: 0 },
      ] },
    { task: "Read a Student Essay", topic: "School Recycling Bins",
      passage: "(A student wrote this for class. Read it and answer the questions.) “Our school should put recycling bins in every classroom. First, right now every paper and bottle goes into the same trash can, even though most of it could be recycled. Second, the fifth graders has already offered to empty the bins every Friday, so no teacher would have extra work. Some people say the bins cost too much, however our parent group said they would pay for the first ten. A few bins now will save a mountain of trash later.”",
      qs: [
        { stem: "What is the writer asking for?", options: ["Recycling bins in every classroom", "A bigger trash can", "A new parent group", "Less homework"], answer: 0 },
        { stem: "Which phrase has a grammar error?", options: ["“the fifth graders has already offered”", "“every paper and bottle”", "“our parent group said”", "“a mountain of trash”"], answer: 0 },
        { stem: "“The fifth graders has” should be written as…", options: ["The fifth graders have", "The fifth grader have", "The fifth graders is", "The fifth graders having"], answer: 0 },
        { stem: "How does the writer answer people who say bins cost too much?", options: ["The parent group will pay for the first ten", "Bins are free", "Money does not matter", "The school is rich"], answer: 0 },
        { stem: "Why does the writer mention the fifth graders?", options: ["To show teachers would not have extra work", "To praise them", "To ask for volunteers", "To explain the cost"], answer: 0 },
        { stem: "The last sentence is meant to…", options: ["end with a strong picture", "add a new reason", "give a number", "ask a question"], answer: 0 },
      ] },
    { task: "Read a Literary Passage", topic: "The Last Seat",
      passage: "On the first day at her new school, Amara carried her tray around the cafeteria three times. Every table was full, or looked full, and asking felt impossible. She finally sat at the empty end of a table near the window and unwrapped her sandwich very slowly, so she would look busy. Then a boy named Ellis slid his tray down and sat across from her without asking. He did not say anything at first. He just pushed his bag of pretzels into the middle of the table where they could both reach it.",
      qs: [
        { stem: "Why did Amara walk around the cafeteria?", options: ["She could not find a place to sit", "She was looking for a friend", "She forgot her lunch", "She was late"], answer: 0 },
        { stem: "Why did she unwrap her sandwich slowly?", options: ["So she would look busy", "The wrapper was stuck", "She was not hungry", "It was hot"], answer: 0 },
        { stem: "What did Ellis do?", options: ["Sat across from her and shared pretzels", "Asked her many questions", "Moved to another table", "Called the teacher"], answer: 0 },
        { stem: "Why did Ellis push the pretzels to the middle?", options: ["To share without making it a big deal", "He did not like them", "He wanted her sandwich", "To count them"], answer: 0 },
        { stem: "How does Amara most likely feel at the end?", options: ["Less alone", "Angry", "Bored", "Afraid"], answer: 0 },
        { stem: "What is the lesson of this passage?", options: ["A small, quiet act can welcome someone", "New schools are scary", "Always ask before sitting", "Pretzels are a good lunch"], answer: 0 },
      ] },
    { task: "Read an Informational Passage", topic: "How Maps Are Made",
      passage: "Long ago, mapmakers drew what travelers told them, so old maps often show coastlines in the wrong place and sea monsters in the ocean. Today, satellites circle high above Earth and take photographs of the same spot over and over. Computers stitch those photographs together into one enormous picture. But a photograph is not yet a map. A mapmaker must still decide what to leave out, because a map showing every tree and fence would be impossible to read. Choosing what matters is the real work of making a map.",
      qs: [
        { stem: "Why were old maps often wrong?", options: ["They were drawn from travelers' stories", "Paper faded", "Mapmakers were careless", "Earth changed shape"], answer: 0 },
        { stem: "What do satellites do?", options: ["Photograph Earth from above", "Draw maps", "Measure oceans", "Carry mapmakers"], answer: 0 },
        { stem: "Why is a photograph not a map?", options: ["Someone must choose what to leave out", "It is too small", "It has no color", "It is upside down"], answer: 0 },
        { stem: "What does the passage call “the real work”?", options: ["Choosing what matters", "Taking photographs", "Flying satellites", "Drawing coastlines"], answer: 0 },
        { stem: "How is the passage organized?", options: ["Long ago, then today", "A list of maps", "A question and answer", "Steps in a recipe"], answer: 0 },
        { stem: "The passage is mostly about…", options: ["how maps are made and why choices matter", "sea monsters", "how satellites fly", "old travelers"], answer: 0 },
      ] },
  ],
  speaking: [
    { task: "Talk about a Scene (1 of 4)", topic: "School Garden", scene: "s2-35-sp-garden",
      prompt: "Look at the picture. What are the students doing?", points: 1, checks: ["A full sentence"] },
    { task: "Talk about a Scene (2 of 4)", topic: "School Garden", scene: "s2-35-sp-garden",
      prompt: "Name two things you see in the garden.", points: 1, checks: ["Two things named"] },
    { task: "Talk about a Scene (3 of 4)", topic: "School Garden", scene: "s2-35-sp-garden",
      prompt: "What do you think will happen to the plants? Why do you think so?", points: 2, checks: ["A prediction", "A reason"] },
    { task: "Talk about a Scene (4 of 4)", topic: "School Garden", scene: "s2-35-sp-garden",
      prompt: "Tell about a time you helped take care of something living, like a plant or a pet.", points: 2, checks: ["Past tense", "What you did"] },
    { task: "Speech Functions", topic: "Ask to Borrow",
      prompt: "You need to borrow a pair of scissors from a classmate. What would you say?", points: 1, checks: ["Polite request"] },
    { task: "Speech Functions", topic: "Late to Class",
      prompt: "You arrived late to class because you were helping the office. What would you say to your teacher?", points: 1, checks: ["Explained the reason", "Polite"] },
    { task: "Support an Opinion", topic: "Library or Computer Lab",
      prompt: "Your class gets thirty extra minutes each week in one place: the library or the computer lab. Which should your class choose? Say your opinion and give a reason.", points: 3, checks: ["A clear choice", "A reason", "Full sentences"] },
    { task: "Support an Opinion", topic: "Pet Fish or Pet Rabbit",
      prompt: "Should your classroom have a pet fish or a pet rabbit? Say your opinion and give a reason.", points: 3, checks: ["A clear opinion", "A reason", "Full sentences"] },
    { task: "Retell a Narrative", topic: "The Broken Swing",
      prompt: "Retell the story about Priya and the broken swing. Tell what happened first, next, and last.", points: 4, checks: ["Beginning, middle, end", "In order"] },
    { task: "Summarize an Academic Presentation", topic: "Honeybee Hives",
      prompt: "Summarize what you learned about beehives: what the young bees do, what the guard bees do, and why the hive stores honey.", points: 4, checks: ["All three parts", "Your own words"] },
    { task: "Summarize an Academic Presentation", topic: "The Water Cycle",
      prompt: "Summarize the water cycle in your own words: what the sun does, what happens in the sky, and how the water comes back down.", points: 4, checks: ["All three stages", "In order", "Your own words"] },
  ],
  writing: [
    { task: "Describe a Picture (Question 1)", topic: "School Garden", scene: "s2-35-sp-garden", kind: "frame",
      stem: "Look at the picture. Write one sentence that tells what the girl is doing. Add details to make your sentence clear.",
      accept: ["girl", "watering", "planting", "digging", "holding", "plants", "garden", "soil"], minWords: 4,
      hint: "One complete sentence, for example: “A girl is watering the small plants.”", points: 2 },
    { task: "Describe a Picture (Question 2)", topic: "School Garden", scene: "s2-35-sp-garden", kind: "frame",
      stem: "Look at the same picture. Write one sentence about something that might happen next.",
      accept: ["will", "next", "grow", "plants", "students", "water", "pick", "then", "later"], minWords: 4,
      hint: "Use “will”, for example: “The plants will grow tall.”", points: 2 },
    { task: "Write About an Experience", topic: "A Time You Were Surprised", kind: "frame",
      stem: "Write about a time you were surprised. What happened, and how did you feel? Write a paragraph of at least three sentences.",
      accept: ["surprised", "happened", "was", "felt", "first", "then", "because", "when", "suddenly", "after"], minWords: 20,
      hint: "Past tense. What happened, then how you felt, then how it ended.", points: 4 },
    { task: "Write About Academic Information (Question 4)", topic: "Playground Survey", scene: "playground-survey-chart", kind: "frame",
      stem: "A chart shows what students chose for new playground equipment: climbing wall — 14 students · swings — 9 students · basketball hoop — 7 students. Using details from the chart, write about what students chose. Write at least one sentence.",
      accept: ["climbing", "wall", "swings", "basketball", "hoop", "14", "9", "7", "most", "students", "chose", "fewest"], minWords: 8,
      hint: "Use two or more numbers from the chart in a complete sentence.", points: 2 },
    { task: "Write About Academic Information (Question 5)", topic: "Playground Survey", scene: "playground-survey-chart", kind: "frame",
      stem: "Using the same chart, tell which equipment the school should buy and explain why, using details from the chart. Write at least two sentences.",
      accept: ["climbing", "wall", "because", "most", "14", "students", "chose", "should", "buy", "popular", "swings"], minWords: 18,
      hint: "Name your choice, then use a number from the chart to explain why.", points: 3 },
    { task: "Justify an Opinion", topic: "Longer Recess", kind: "frame",
      stem: "Some students think recess should be longer. Do you agree? Write your opinion and give at least two reasons. Use three or more sentences.",
      accept: ["recess", "longer", "think", "because", "play", "friends", "exercise", "learn", "also", "tired", "students"], minWords: 20,
      hint: "Opinion first, then two reasons. Example: “I think… First… Also…”", points: 4 },
  ],
};

const S3_G35 = {
  listening: [
    { task: "Listen to a Short Exchange", topic: "Field Trip Money",
      intro: "You will hear two students talk. You will hear it only once.",
      transcript: "Boy: Did you turn in your money for the aquarium trip?\nGirl: Not yet. My mom put it in an envelope with my name on it. I will give it to Ms. Ruiz this morning.",
      qs: [ { stem: "What is in the envelope?", options: ["Money for the trip", "A permission form", "A letter"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "Fixing a Bike",
      intro: "You will hear it only once.",
      transcript: "Girl: My bike chain came off again on the way to school.\nBoy: My dad showed me how to put it back on. I can show you after school if you want.",
      qs: [ { stem: "What does the boy offer to do?", options: ["Show her how to fix the chain", "Give her a ride", "Buy a new bike"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "Loud Hallway",
      intro: "You will hear it only once.",
      transcript: "Boy: Why is everyone lining up in the hallway?\nGirl: The gym floor is being cleaned, so assembly is in the cafeteria today instead.",
      qs: [ { stem: "Why is assembly in the cafeteria?", options: ["The gym floor is being cleaned", "The cafeteria is bigger", "It is raining"], answer: 0 } ] },
    { task: "Listen to a Classroom Conversation", topic: "Reading Buddy Program",
      intro: "You will hear a teacher and a student. You will hear it only once.",
      transcript: "Student: Ms. Chen, how do I become a reading buddy for the first graders?\nTeacher: You would meet your buddy every Thursday afternoon for twenty minutes.\nStudent: What do we do in twenty minutes?\nTeacher: You read one short book together, and then your buddy tells you their favorite part. Bring the book back to the shelf when you finish.\nStudent: Thursday, twenty minutes, one book, put it back. Got it.",
      qs: [
        { stem: "When do reading buddies meet?", options: ["Thursday afternoon", "Monday morning", "Every day"], answer: 0 },
        { stem: "What does the buddy do after reading?", options: ["Tells their favorite part", "Writes a report", "Draws a picture"], answer: 0 },
        { stem: "What must the student do with the book?", options: ["Put it back on the shelf", "Take it home", "Give it away"], answer: 0 },
      ] },
    { task: "Listen to a Story", topic: "The Missing Puzzle Piece",
      intro: "Listen to a story. You will hear it only once.",
      transcript: "The class spent two weeks building a thousand-piece puzzle of the solar system. On the last day, one piece was missing, right in the middle of Jupiter. Everyone searched the floor and the shelves. Then Dante remembered sweeping under the rug on Monday. He lifted the corner, and there it was. When he pressed the last piece into place, the whole class cheered so loudly that the teacher next door came to see what had happened.",
      qs: [
        { stem: "What was the class building?", options: ["A puzzle of the solar system", "A model rocket", "A poster"], answer: 0 },
        { stem: "Where was the missing piece?", options: ["Under the rug", "In the trash", "In a desk"], answer: 0 },
        { stem: "What happened when Dante placed the piece?", options: ["The class cheered", "The puzzle fell apart", "School ended"], answer: 0 },
      ] },
    { task: "Listen to a Story", topic: "The Rainy Parade",
      intro: "Listen to a story. You will hear it only once.",
      transcript: "Rosa's class spent a month making a giant paper dragon for the spring parade. On parade morning, it began to rain, and everyone knew paper and rain do not mix. Rosa's father, who drove a delivery truck, arrived with a huge roll of clear plastic. The whole class helped wrap the dragon, and it marched down the street shining in the rain. People said it was the best one they had ever seen.",
      qs: [
        { stem: "What did the class make?", options: ["A paper dragon", "A paper boat", "A kite"], answer: 0 },
        { stem: "What was the problem on parade morning?", options: ["It began to rain", "The dragon tore", "The parade was canceled"], answer: 0 },
        { stem: "How was the problem solved?", options: ["They wrapped it in clear plastic", "They stayed home", "They made a new one"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Volcanoes",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Deep under the ground, rock gets so hot that it melts into a thick liquid called magma. Magma is lighter than the solid rock around it, so it slowly pushes upward. When it finds a crack in Earth's surface, it bursts out, and we call it lava. Over many eruptions, the cooled lava piles up layer on layer, and that is how a volcano grows into a mountain, one eruption at a time.",
      qs: [
        { stem: "What is melted rock under the ground called?", options: ["Magma", "Lava", "Ash"], answer: 0 },
        { stem: "Why does magma push upward?", options: ["It is lighter than solid rock", "The wind pulls it", "It is very cold"], answer: 0 },
        { stem: "How does a volcano grow?", options: ["Cooled lava piles up in layers", "It is built by people", "Rain adds to it"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Why We Sleep",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Sleep may look like doing nothing, but your brain is busy the whole time. While you sleep, your brain sorts through everything that happened during the day and stores the important parts in your memory. Your body repairs itself too, which is why doctors say children who get enough sleep grow better and get sick less often. That is also why studying all night usually backfires. Without sleep, your brain never files away what you studied.",
      qs: [
        { stem: "What does the brain do during sleep?", options: ["Sorts and stores memories", "Stops working", "Grows larger"], answer: 0 },
        { stem: "What does the body do during sleep?", options: ["Repairs itself", "Uses more energy", "Gets colder"], answer: 0 },
        { stem: "Why does studying all night usually backfire?", options: ["The brain never files what you studied", "Books are heavy", "Lights are bright"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Bridges of Ice",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "In some cold parts of the world, rivers freeze so solidly in winter that trucks can drive across them. These are called ice roads. Workers measure the ice every single day, because the road is only safe at a certain thickness. Strangely, a truck must drive slowly, not quickly. Driving fast makes a wave under the ice, and that wave can crack the road from below. When spring comes, the road simply melts and disappears until the next winter.",
      qs: [
        { stem: "What is an ice road?", options: ["A frozen river trucks drive on", "A road made of snow", "A bridge made of metal"], answer: 0 },
        { stem: "Why do workers measure the ice daily?", options: ["It is only safe at a certain thickness", "To count the trucks", "To find fish"], answer: 0 },
        { stem: "Why must trucks drive slowly?", options: ["Fast driving makes a wave that can crack the ice", "To save fuel", "The road is narrow"], answer: 0 },
        { stem: "What happens in spring?", options: ["The road melts away", "The road is repaired", "More trucks come"], answer: 0 },
      ] },
  ],
  reading: [
    { task: "Read and Choose a Sentence", topic: "Art Class", scene: "s3-35-rc-art-class",
      qs: [ { stem: "Choose the sentence that best describes the picture.", options: ["The girl is painting a picture.", "The girl is riding a bike.", "The paint is on the ceiling.", "The classroom is dark."], answer: 0 } ] },
    { task: "Read and Choose a Sentence", topic: "Rainy Window", scene: "s3-35-rc-rainy-window",
      qs: [ { stem: "Choose the sentence that best describes the picture.", options: ["The boy is looking out at the rain.", "The boy is swimming.", "The sun is shining brightly.", "The window is broken."], answer: 0 } ] },
    { task: "Read a Short Informational Passage", topic: "Penguin Parents",
      passage: "Emperor penguins are careful parents. The mother lays one egg and then walks many miles to the sea to feed. Before she leaves, she passes the egg to the father, who balances it on his feet under a warm fold of skin. He stands in the freezing wind for about two months without eating anything at all. When the mother returns with food, the chick is ready to hatch, and the tired father finally walks to the sea for his own meal.",
      qs: [
        { stem: "Who holds the egg?", options: ["The father", "The mother", "Both at once", "Another penguin"], answer: 0 },
        { stem: "How long does the father stand with the egg?", options: ["About two months", "Two days", "One week", "All year"], answer: 0 },
        { stem: "What does the father do when the mother returns?", options: ["Walks to the sea to eat", "Lays another egg", "Builds a nest", "Sleeps in the snow"], answer: 0 },
      ] },
    { task: "Read a Short Informational Passage", topic: "The First Pencils",
      passage: "The pencil was invented by accident. In the 1500s, a storm knocked down a large tree in England, and underneath it people found a strange black rock. It was graphite, and it made a darker mark than anything they had used before. The problem was that it broke easily and stained the hands, so people wrapped it in string. Later, someone had the idea to slide a thin stick of graphite into a wooden case, and the modern pencil was born.",
      qs: [
        { stem: "How was graphite found?", options: ["A storm knocked down a tree", "Miners dug for it", "It washed up on a beach", "A farmer plowed it up"], answer: 0 },
        { stem: "What were the problems with graphite?", options: ["It broke easily and stained hands", "It was too light", "It smelled bad", "It was too expensive"], answer: 0 },
        { stem: "What made the modern pencil?", options: ["Putting graphite in a wooden case", "Adding an eraser", "Making it longer", "Painting it yellow"], answer: 0 },
      ] },
    { task: "Read a Student Essay", topic: "Later Start Time",
      passage: "(A student wrote this for class. Read it and answer the questions.) “Our school day should start thirty minutes later. First, many students in my class rides the early bus and arrives too sleepy to think. Second, a study our teacher showed us said children learn better later in the morning. Some teachers worry that a later start means a later ending, however we could shorten our two long passing periods instead of adding time. Thirty minutes is small for a school, but it is huge for a tired student.”",
      qs: [
        { stem: "What change does the writer want?", options: ["A later start time", "A longer lunch", "A shorter school year", "More buses"], answer: 0 },
        { stem: "Which phrase has a grammar error?", options: ["“many students in my class rides the early bus”", "“a study our teacher showed us”", "“we could shorten our two long passing periods”", "“it is huge for a tired student”"], answer: 0 },
        { stem: "“Many students… rides the early bus” should be written as…", options: ["many students ride the early bus", "many student rides the early bus", "many students riding the early bus", "many students rode the early buses"], answer: 0 },
        { stem: "How does the writer answer the worry about a later ending?", options: ["Shorten the passing periods instead", "Ignore the problem", "Start earlier instead", "Cancel a class"], answer: 0 },
        { stem: "Why does the writer mention the study?", options: ["To support the reason with evidence", "To praise the teacher", "To fill space", "To ask a question"], answer: 0 },
        { stem: "The last sentence works by…", options: ["contrasting a small change with a big effect", "listing numbers", "asking the reader a question", "quoting a teacher"], answer: 0 },
      ] },
    { task: "Read a Literary Passage", topic: "The Quiet Runner",
      passage: "Everyone on the team knew that Sam finished last in every race, and everyone knew that Sam never missed a practice. When the coach announced that one runner would carry the team flag at the county meet, the team voted, and they did not vote for the fastest runner. They voted for Sam. At the meet, Sam carried the flag around the whole track before the races began, and the team ran behind, matching Sam's steady pace exactly. Nobody was in a hurry that day.",
      qs: [
        { stem: "What was true about Sam?", options: ["Sam finished last but never missed practice", "Sam was the fastest runner", "Sam had just joined", "Sam disliked running"], answer: 0 },
        { stem: "Who did the team vote for?", options: ["Sam", "The fastest runner", "The coach", "Nobody"], answer: 0 },
        { stem: "What did the team do behind Sam?", options: ["Matched Sam's steady pace", "Raced ahead", "Waited at the finish", "Sat down"], answer: 0 },
        { stem: "“Nobody was in a hurry that day” shows that the team…", options: ["chose to honor Sam over speed", "was tired", "had lost the meet", "forgot the race"], answer: 0 },
        { stem: "Why did the team choose Sam?", options: ["For steady effort, not speed", "Because Sam asked", "Because Sam was oldest", "Because the coach said to"], answer: 0 },
        { stem: "What is the lesson of this passage?", options: ["Showing up matters as much as winning", "Only fast runners are valuable", "Flags are important", "Practice is boring"], answer: 0 },
      ] },
    { task: "Read an Informational Passage", topic: "The Story of Chocolate",
      passage: "Chocolate begins as a bitter seed. Cacao trees grow large pods, and inside each pod are seeds surrounded by white pulp. Farmers scoop the seeds out and leave them covered for several days to ferment, which is what gives chocolate its flavor. Then the seeds are dried in the sun, roasted, and ground into a thick paste. Only at the very end is sugar added. The ancient Maya drank chocolate as a bitter, spicy drink with no sugar at all, and they valued the seeds so highly that they used them as money.",
      qs: [
        { stem: "Where do cacao seeds grow?", options: ["Inside pods on cacao trees", "Underground", "On vines", "In flowers"], answer: 0 },
        { stem: "What gives chocolate its flavor?", options: ["Fermenting the seeds", "Adding water", "Freezing the pods", "Sunlight alone"], answer: 0 },
        { stem: "When is sugar added?", options: ["At the very end", "At the beginning", "Before roasting", "Never"], answer: 0 },
        { stem: "How did the Maya drink chocolate?", options: ["Bitter and spicy, with no sugar", "Cold and sweet", "With milk", "As a solid bar"], answer: 0 },
        { stem: "What shows how much the Maya valued cacao?", options: ["They used the seeds as money", "They planted many trees", "They wrote songs", "They ate it daily"], answer: 0 },
        { stem: "The passage is organized by…", options: ["the steps from seed to chocolate", "a list of countries", "a question and answer", "then versus now only"], answer: 0 },
      ] },
  ],
  speaking: [
    { task: "Talk about a Scene (1 of 4)", topic: "Farmers Market", scene: "s3-35-sp-market",
      prompt: "Look at the picture. What is happening at the market?", points: 1, checks: ["A full sentence"] },
    { task: "Talk about a Scene (2 of 4)", topic: "Farmers Market", scene: "s3-35-sp-market",
      prompt: "Name two things you can buy in this picture.", points: 1, checks: ["Two things named"] },
    { task: "Talk about a Scene (3 of 4)", topic: "Farmers Market", scene: "s3-35-sp-market",
      prompt: "What do you think the family will do next? Why do you think so?", points: 2, checks: ["A prediction", "A reason"] },
    { task: "Talk about a Scene (4 of 4)", topic: "Farmers Market", scene: "s3-35-sp-market",
      prompt: "Tell about a time you went shopping with your family. Where did you go?", points: 2, checks: ["Past tense", "Where and what happened"] },
    { task: "Speech Functions", topic: "Ask for Directions",
      prompt: "You are new at school and cannot find the nurse's office. What would you say to an adult?", points: 1, checks: ["Clear question", "Polite"] },
    { task: "Speech Functions", topic: "Thank a Helper",
      prompt: "A classmate helped you carry a heavy box. What would you say to them?", points: 1, checks: ["Clear thanks", "Friendly"] },
    { task: "Support an Opinion", topic: "Morning or Afternoon Recess",
      prompt: "Is it better to have recess in the morning or in the afternoon? Say your opinion and give a reason.", points: 3, checks: ["A clear choice", "A reason", "Full sentences"] },
    { task: "Support an Opinion", topic: "Class Party or Extra Art",
      prompt: "Your class earned a reward: a class party or an extra art hour. Which should your class choose? Say your opinion and give a reason.", points: 3, checks: ["A clear opinion", "A reason", "Full sentences"] },
    { task: "Retell a Narrative", topic: "The Rainy Parade",
      prompt: "Retell the story about Rosa's class and the paper dragon. Tell what happened first, next, and last.", points: 4, checks: ["Beginning, middle, end", "In order"] },
    { task: "Summarize an Academic Presentation", topic: "Volcanoes",
      prompt: "Summarize what you learned about volcanoes: what magma is, why it rises, and how a volcano grows.", points: 4, checks: ["All three parts", "Your own words"] },
    { task: "Summarize an Academic Presentation", topic: "Why We Sleep",
      prompt: "Summarize what you learned about sleep: what the brain does, what the body does, and why studying all night does not work well.", points: 4, checks: ["All three parts", "Your own words"] },
  ],
  writing: [
    { task: "Describe a Picture (Question 1)", topic: "Farmers Market", scene: "s3-35-sp-market", kind: "frame",
      stem: "Look at the picture. Write one sentence that tells what the woman at the table is doing. Add details to make your sentence clear.",
      accept: ["woman", "selling", "holding", "weighing", "vegetables", "fruit", "table", "market", "giving"], minWords: 4,
      hint: "One complete sentence, for example: “The woman is selling fresh vegetables.”", points: 2 },
    { task: "Describe a Picture (Question 2)", topic: "Farmers Market", scene: "s3-35-sp-market", kind: "frame",
      stem: "Look at the same picture. Write one sentence about something that might happen next.",
      accept: ["will", "next", "buy", "pay", "take", "home", "family", "then", "cook", "eat"], minWords: 4,
      hint: "Use “will”, for example: “The family will buy apples.”", points: 2 },
    { task: "Write About an Experience", topic: "Something You Learned to Do", kind: "frame",
      stem: "Write about something you learned how to do. Who taught you, and how did you learn it? Write a paragraph of at least three sentences.",
      accept: ["learned", "taught", "showed", "first", "then", "because", "practiced", "finally", "hard", "could"], minWords: 20,
      hint: "Past tense. Who taught you, what you did, and how it turned out.", points: 4 },
    { task: "Write About Academic Information (Question 4)", topic: "Weather Chart", scene: "weather-chart", kind: "frame",
      stem: "A chart shows last month's weather: sunny — 16 days · cloudy — 8 days · rainy — 6 days. Using details from the chart, write about last month's weather. Write at least one sentence.",
      accept: ["sunny", "cloudy", "rainy", "16", "8", "6", "days", "most", "month", "fewest"], minWords: 8,
      hint: "Use two or more numbers from the chart in a complete sentence.", points: 2 },
    { task: "Write About Academic Information (Question 5)", topic: "Weather Chart", scene: "weather-chart", kind: "frame",
      stem: "Using the same chart, tell what kind of month this was for playing outside, and explain why using details from the chart. Write at least two sentences.",
      accept: ["sunny", "16", "days", "because", "outside", "play", "good", "rainy", "only", "6", "most"], minWords: 18,
      hint: "Say what kind of month it was, then use numbers from the chart to explain.", points: 3 },
    { task: "Justify an Opinion", topic: "Class Pets", kind: "frame",
      stem: "Some teachers think every classroom should have a class pet. Do you agree? Write your opinion and give at least two reasons. Use three or more sentences.",
      accept: ["pet", "class", "think", "because", "learn", "responsible", "care", "also", "students", "should", "allergies"], minWords: 20,
      hint: "Opinion first, then two reasons. Example: “I think… First… Also…”", points: 4 },
  ],
};


// ════════════════════════════════════════════════════════════════
//  GRADES 6–8 — rebuilt to the VERIFIED official blueprint
//  Listening 22 Q · Reading 26 Q · Speaking 12 tasks · Writing 6 tasks
//  (6–8 has NO "Read and Choose a Sentence" — that task ends at grade 5)
//  Set 1 = real practice-test TOPICS (original wording)
//  Sets 2–3 = original topics, identical structure
// ════════════════════════════════════════════════════════════════

const S1_G68 = {
  listening: [
    { task: "Listen to a Short Exchange", topic: "Study Group",
      intro: "You will hear two students talk. You will hear it only once.",
      transcript: "Girl: A few of us are starting a study group for the science test in the library Thursday.\nBoy: Count me in. Should I bring my notes from the cells unit?\nGirl: Yes, especially the diagram Ms. Park drew. Nobody else copied it down.",
      qs: [ { stem: "Why should the boy bring his notes?", options: ["He has the diagram nobody else copied", "The library requires notes", "He owes the girl a favor"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "History Project",
      intro: "You will hear it only once.",
      transcript: "Boy: I finished the timeline for our history project, but it looks plain. It is just dates and lines.\nGirl: I found old photographs in the library database last night. Send me the file and I will add them tonight.",
      qs: [ { stem: "What will the girl add to the timeline?", options: ["Old photographs", "More dates", "A new title"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "Fraction Homework",
      intro: "You will hear it only once.",
      transcript: "Boy: I am stuck on the fraction homework. Number four wants me to add one-third and one-fourth, and I keep getting different answers.\nGirl: You cannot add them until the bottom numbers match. Find a common denominator first. Twelve works for both.",
      qs: [ { stem: "What does the girl say to do first?", options: ["Find a common denominator", "Add the top numbers", "Skip the problem"], answer: 0 } ] },
    { task: "Listen to a Classroom Conversation", topic: "Soccer Practice",
      intro: "You will hear a coach and a student. You will hear it only once.",
      transcript: "Student: Coach, is practice still on today? It rained all morning.\nCoach: Yes, but we are moving to the gym. The field is too muddy.\nStudent: Should I still bring my cleats?\nCoach: No cleats indoors. They scratch the floor. Wear regular sneakers today. And remind everyone the scrimmage is still Friday, on the field if it dries out.\nStudent: I will tell the group chat.",
      qs: [
        { stem: "Why is practice moving to the gym?", options: ["The field is too muddy", "The gym is closer", "The coach is late"], answer: 0 },
        { stem: "What should players wear today?", options: ["Cleats", "Regular sneakers", "Boots"], answer: 1 },
        { stem: "What is still happening on Friday?", options: ["A scrimmage", "A team meeting", "A test"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Exploration and Sea Travel",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Five hundred years ago, sailing across an ocean was mostly guesswork. Sailors could measure how far north or south they were by the height of the sun, but there was no reliable way to know how far east or west they had traveled. Crews sometimes missed islands entirely and ran out of fresh water. The problem was finally solved by a clock. A clockmaker built a timepiece accurate enough to keep exact time on a rocking ship, and by comparing that time to the local sun, sailors could finally calculate their east-west position.",
      qs: [
        { stem: "What could sailors already measure?", options: ["How far north or south they were", "How deep the water was", "How fast the wind blew"], answer: 0 },
        { stem: "What happened when crews got lost?", options: ["They missed islands and ran out of water", "They turned back immediately", "They sailed faster"], answer: 0 },
        { stem: "What finally solved the problem?", options: ["An accurate clock", "A better map", "A larger ship"], answer: 0 },
        { stem: "How did the clock help?", options: ["Comparing its time to the local sun gave east-west position", "It measured the waves", "It counted the days"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "The Erie Canal",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "In 1825, the Erie Canal connected the Great Lakes to the Atlantic Ocean across New York. Boats cannot climb hills, so engineers built locks, which are water-filled chambers that raise or lower a boat one step at a time, like a slow elevator, over more than five hundred feet of elevation. Before the canal, shipping a ton of goods from Buffalo to New York City cost about one hundred dollars. Afterward, it cost about ten. Cheap shipping turned New York into the busiest port in the country.",
      qs: [
        { stem: "What problem did locks solve?", options: ["Boats cannot climb hills", "Boats leaked", "Boats were too slow"], answer: 0 },
        { stem: "How do locks work?", options: ["They raise or lower a boat one step at a time", "They pull boats with ropes", "They dig new channels"], answer: 0 },
        { stem: "What happened to shipping costs?", options: ["They fell from about one hundred dollars to about ten", "They doubled", "They stayed the same"], answer: 0 },
        { stem: "What was the result for New York?", options: ["It became the busiest port in the country", "It lost its harbor", "It stopped farming"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Cafe Food and Food Safety",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Every restaurant kitchen follows one rule above all others: keep food out of the danger zone. The danger zone is the range of temperatures where bacteria multiply fastest, roughly between forty and one hundred forty degrees Fahrenheit. That is why cold food is kept on ice and hot food is held on warming trays rather than sitting on a counter. Time matters as much as temperature. Food left in the danger zone for more than two hours must be thrown away, even if it looks and smells perfectly fine.",
      qs: [
        { stem: "What is the danger zone?", options: ["The temperature range where bacteria multiply fastest", "The area near the stove", "The back of the freezer"], answer: 0 },
        { stem: "Why is hot food kept on warming trays?", options: ["To stay out of the danger zone", "To look better", "To cook longer"], answer: 0 },
        { stem: "What must happen after two hours in the danger zone?", options: ["The food must be thrown away", "The food must be reheated", "The food must be frozen"], answer: 0 },
        { stem: "Why is “even if it looks and smells fine” important?", options: ["Unsafe food can look normal", "Smell is the best test", "Looks matter most"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "The Do-It-Yourself Movement",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "The do-it-yourself movement is the idea that ordinary people can build, fix, and make things themselves instead of buying them or hiring someone. It grew quickly once video sharing made it possible to watch a stranger repair a bicycle or sew a jacket, step by step, for free. Supporters say it saves money and reduces waste, since a repaired item does not become trash. Critics warn that some repairs, especially electrical ones, are genuinely dangerous for beginners. Most makers agree on a simple rule: learn the limits of what you should attempt.",
      qs: [
        { stem: "What is the do-it-yourself movement?", options: ["People building and fixing things themselves", "A type of store", "A school subject"], answer: 0 },
        { stem: "What helped the movement grow quickly?", options: ["Video sharing of step-by-step repairs", "Cheaper tools", "New laws"], answer: 0 },
        { stem: "What do supporters say?", options: ["It saves money and reduces waste", "It is always easy", "It creates jobs"], answer: 0 },
        { stem: "What do critics warn about?", options: ["Some repairs are dangerous for beginners", "It costs too much", "It takes too long"], answer: 0 },
      ] },
  ],
  reading: [
    { task: "Read a Short Informational Passage", topic: "Pluto",
      passage: "For seventy-six years, Pluto was called the ninth planet. Then astronomers began finding other icy bodies of similar size in the same distant region, and they faced a choice: call all of them planets, or write a clearer definition. The definition they agreed on in 2006 has three parts. A planet must orbit the sun, must be round, and must have cleared other objects out of its orbital path. Pluto meets the first two conditions but not the third, since it shares its neighborhood with many icy objects. It was reclassified as a dwarf planet, which changed the label but not the object.",
      qs: [
        { stem: "Why did astronomers need a clearer definition?", options: ["They found other similar icy bodies", "Pluto moved", "Telescopes broke", "Pluto shrank"], answer: 0 },
        { stem: "Which condition does Pluto fail?", options: ["Clearing objects from its orbital path", "Orbiting the sun", "Being round", "Having a moon"], answer: 0 },
        { stem: "What is Pluto now called?", options: ["A dwarf planet", "A comet", "A moon", "An asteroid"], answer: 0 },
        { stem: "“Changed the label but not the object” means that Pluto…", options: ["is the same as it always was", "became smaller", "moved away", "disappeared"], answer: 0 },
      ] },
    { task: "Read a Short Informational Passage", topic: "The Inner Ear",
      passage: "Your inner ear does two jobs at once. Sound waves enter a coiled tube called the cochlea, where thousands of tiny hair cells bend and turn the vibration into signals your brain reads as sound. Right beside it sit three loops filled with fluid, set at right angles to one another. When your head tilts or spins, the fluid sloshes and tells your brain exactly which way you moved. This is why spinning in a circle makes you dizzy: the fluid keeps moving after you stop, so your brain insists you are still turning even though your eyes say otherwise.",
      qs: [
        { stem: "What does the cochlea do?", options: ["Turns vibration into signals the brain reads as sound", "Balances the head", "Cleans the ear", "Blocks loud noise"], answer: 0 },
        { stem: "What are the three loops filled with?", options: ["Fluid", "Air", "Bone", "Hair"], answer: 0 },
        { stem: "Why does spinning make you dizzy?", options: ["The fluid keeps moving after you stop", "Your eyes get tired", "Sound waves bounce", "The cochlea shakes"], answer: 0 },
        { stem: "The passage's main idea is that the inner ear…", options: ["handles both hearing and balance", "is easily damaged", "is very small", "works only when still"], answer: 0 },
      ] },
    { task: "Read a Student Essay", topic: "Cooking Class",
      passage: "(Read a classmate's draft and answer the questions.) “Our school should offer a cooking class as an elective. First, students who leaves for high school without knowing how to cook end up eating packaged food every night. Second, cooking is really applied math and science: measuring, converting fractions, and watching how heat changes food. Some people argue that a kitchen is too expensive to build, however the family science room already has four working stoves that go unused all year. A cooking class would teach a skill every single student will use, no matter what career they choose.”",
      qs: [
        { stem: "What is the writer proposing?", options: ["A cooking class as an elective", "A new kitchen", "Longer lunches", "A science lab"], answer: 0 },
        { stem: "Which phrase contains a subject-verb error?", options: ["“students who leaves for high school”", "“cooking is really applied math”", "“the family science room already has”", "“every single student will use”"], answer: 0 },
        { stem: "“Students who leaves” should be written as…", options: ["students who leave", "student who leave", "students whom leaves", "students who leaving"], answer: 0 },
        { stem: "The sentence containing “however” would be BEST corrected as…", options: ["“…too expensive to build; however, the family science room already has…”", "“…too expensive to build, and however…”", "moving “however” to the start of the essay", "deleting “the family science room”"], answer: 0 },
        { stem: "How does the writer answer the cost objection?", options: ["Four working stoves already sit unused", "Costs do not matter", "Parents will pay", "The class would be small"], answer: 0 },
        { stem: "Why does the writer call cooking “applied math and science”?", options: ["To show it supports academic learning", "To make it sound difficult", "To describe a recipe", "To criticize math class"], answer: 0 },
      ] },
    { task: "Read a Literary Passage", topic: "Parent-Child Relationships",
      passage: "For most of eighth grade, Daniel and his mother argued about the same thing: she wanted to know everything about his day, and he wanted to be left alone. Then his mother started working night shifts, and their conversations shrank to notes on the kitchen counter. At first Daniel felt relieved. By November he found himself writing longer notes than necessary, adding small details she had not asked for, like what happened at lunch or which teacher had made a joke. One morning he came down and found she had written back on the other side, three full paragraphs, telling him about her night. He kept that note in his backpack for the rest of the year.",
      qs: [
        { stem: "What did Daniel and his mother argue about?", options: ["How much she wanted to know about his day", "His grades", "His curfew", "Household chores"], answer: 0 },
        { stem: "What changed their communication?", options: ["She began working night shifts", "He moved away", "She stopped talking", "He got a phone"], answer: 0 },
        { stem: "What did Daniel begin doing in November?", options: ["Writing longer notes with extra details", "Refusing to write notes", "Calling her at work", "Waking her up"], answer: 0 },
        { stem: "Why did Daniel keep the note all year?", options: ["It mattered deeply to him", "It had homework on it", "It was funny", "He forgot it was there"], answer: 0 },
        { stem: "“Adding small details she had not asked for” suggests Daniel…", options: ["wanted the connection he once resisted", "was being careless", "was following a rule", "was writing too fast"], answer: 0 },
        { stem: "A theme of this passage is that…", options: ["distance can reveal how much a relationship matters", "arguments never end", "night work is difficult", "notes are better than talking"], answer: 0 },
      ] },
    { task: "Read an Informational Passage", topic: "Marie Curie",
      passage: "Marie Curie was told she could not attend university in Poland because she was a woman, so she studied in secret at an underground school before moving to Paris. There she discovered two new elements and developed the theory of radioactivity, a word she invented. She became the first woman to win a Nobel Prize, and then the first person of any gender to win one in two different sciences. During the First World War, she did something few scientists would consider: she designed mobile X-ray units, trained women to operate them, and drove to the front lines herself so wounded soldiers could be examined where they lay. She refused to patent her discoveries, insisting that science belonged to everyone.",
      qs: [
        { stem: "Why did Curie study in secret in Poland?", options: ["Women were not allowed at university", "She was too young", "She had no money", "She was ill"], answer: 0 },
        { stem: "What was unusual about her Nobel Prizes?", options: ["She won in two different sciences", "She won them in one year", "She refused them", "She shared them all"], answer: 0 },
        { stem: "What did she do during the First World War?", options: ["Designed mobile X-ray units and drove them to the front", "Taught in Paris", "Wrote a textbook", "Left science"], answer: 0 },
        { stem: "Why did she refuse to patent her discoveries?", options: ["She believed science belonged to everyone", "Patents were illegal", "She had no time", "Her lab forbade it"], answer: 0 },
        { stem: "“Something few scientists would consider” emphasizes that her wartime work was…", options: ["unusually hands-on and risky", "poorly planned", "widely copied", "required of her"], answer: 0 },
        { stem: "The passage is organized by…", options: ["obstacles, then achievements, then values", "a list of prizes", "a question and answer", "then versus now"], answer: 0 },
      ] },
  ],
  speaking: [
    { task: "Talk about a Scene (1 of 4)", topic: "Photography", scene: "s1-68-sp-photography",
      prompt: "Look at the picture. Describe what is happening in this scene.", points: 1, checks: ["A full-sentence description"] },
    { task: "Talk about a Scene (2 of 4)", topic: "Photography", scene: "s1-68-sp-photography",
      prompt: "Describe two people in the picture and what each one is doing.", points: 1, checks: ["Two people described", "Action words used"] },
    { task: "Talk about a Scene (3 of 4)", topic: "Photography", scene: "s1-68-sp-photography",
      prompt: "Where do you think this is taking place, and what will probably happen next? Explain your thinking.", points: 2, checks: ["Named the place", "Prediction with a reason"] },
    { task: "Talk about a Scene (4 of 4)", topic: "Photography", scene: "s1-68-sp-photography",
      prompt: "Tell about a time you learned to use a new tool or piece of equipment. What was it, and how did you learn?", points: 2, checks: ["Past tense", "What it was and how you learned"] },
    { task: "Speech Functions", topic: "New Student at Lunch",
      prompt: "A new student is standing alone with a lunch tray. What would you say to them?", points: 1, checks: ["Welcoming", "Clear invitation"] },
    { task: "Speech Functions", topic: "Study Help",
      prompt: "You do not understand the directions for a class assignment. What would you say to your teacher?", points: 1, checks: ["Polite request", "Said what is unclear"] },
    { task: "Support an Opinion", topic: "Museum or Stadium",
      prompt: "Your grade can take one field trip: a science museum or a sports stadium tour. Which should your grade choose? State your opinion and justify it with at least one relevant reason and explanation.", points: 3, checks: ["Clear opinion", "Reason WITH explanation", "Fairly smooth speech"] },
    { task: "Support an Opinion", topic: "Wildlife Refuge or Botanical Garden",
      prompt: "Your city has money to protect one place: a wildlife refuge or a botanical garden. Which should the city choose? State your opinion and justify it with a reason and explanation.", points: 3, checks: ["Clear position", "Developed reason"] },
    { task: "Present and Discuss Information", topic: "Travel to School", scene: "s1-68-graph-travel",
      prompt: "Look at the graph showing how students travel to school. Point 1: Describe what the graph shows. Point 2: A student claims that more students walk to school than ride the bus. Using the graph, is that claim supported? Explain.", points: 3, checks: ["Accurate description of the data", "Judged the claim using the graph"] },
    { task: "Summarize an Academic Presentation", topic: "Conductivity",
      prompt: "A presentation explained conductivity: some materials, like copper and other metals, let electricity flow easily because their electrons move freely; other materials, like rubber and glass, hold their electrons tightly and block the flow, which is why wires are made of metal but wrapped in rubber. Summarize this in your own words.", points: 4, checks: ["Both types of material", "The wire example", "Own words, connected sentences"] },
    { task: "Summarize an Academic Presentation", topic: "Branches of Government",
      prompt: "A presentation explained the three branches of government: the legislative branch writes the laws, the executive branch carries them out, and the judicial branch decides what the laws mean when there is a disagreement. Each branch can limit the others so no single branch becomes too powerful. Summarize this in your own words.", points: 4, checks: ["All three branches", "The checking idea", "Own words"] },
  ],
  writing: [
    { task: "Describe a Picture (Question 1)", topic: "Bus", scene: "s1-68-dp-bus", kind: "frame",
      stem: "Look at the picture. A classmate wrote: “The student get on the bus. The student carry a backpack.” Correct the two errors and combine the ideas into one clear sentence.",
      accept: ["gets", "carrying", "carries", "student", "bus", "backpack", "while", "with"], minWords: 6,
      hint: "Fix the verbs, then join with “with” or “while”. Example: “The student gets on the bus carrying a backpack.”", points: 2 },
    { task: "Describe a Picture (Question 2)", topic: "Bus", scene: "s1-68-dp-bus", kind: "frame",
      stem: "Look at the same picture. Write one complete sentence about something that might happen next. Add a detail that makes your prediction clear.",
      accept: ["will", "next", "sit", "ride", "school", "driver", "students", "then", "arrive", "seat"], minWords: 6,
      hint: "Use “will” plus a detail. Example: “The students will find seats before the bus leaves for school.”", points: 2 },
    { task: "Write About an Experience", topic: "Learned Something New", kind: "frame",
      stem: "Write about a time you learned something new that was difficult at first. What did you do to learn it, and how did it turn out? Write a paragraph of at least three sentences.",
      accept: ["learned", "difficult", "hard", "first", "practiced", "kept", "then", "because", "finally", "until", "better", "understood"], minWords: 25,
      hint: "Past tense. What was hard, what you did about it, and the result.", points: 4 },
    { task: "Write About Academic Information (Question 4)", topic: "Race", scene: "race-preparation-organizer", kind: "frame",
      stem: "A graphic organizer about a student named Blake shows: went to bed early the night before · ate a healthy breakfast · arrived early to warm up → Result: won first place in the race. Using details from the organizer, write about what Blake did before the race. Write at least two sentences.",
      accept: ["blake", "bed", "early", "breakfast", "healthy", "warm", "arrived", "before", "race", "first", "place"], minWords: 15,
      hint: "Use at least two details from the organizer in complete sentences.", points: 2 },
    { task: "Write About Academic Information (Question 5)", topic: "Race", scene: "race-preparation-organizer", kind: "frame",
      stem: "A classmate says Blake was just lucky to win. Using details from the same organizer, explain whether you agree. Write at least three sentences.",
      accept: ["lucky", "luck", "not", "prepared", "because", "bed", "breakfast", "warm", "early", "result", "so", "disagree", "agree"], minWords: 25,
      hint: "Take a position, then use the organizer's details to support it. Connect with “so” or “as a result”.", points: 3 },
    { task: "Justify an Opinion", topic: "Four Day School Week", kind: "frame",
      stem: "Some districts are changing to a four-day school week with longer days. Do you think your school should make this change? State your position and support it with at least two reasons. Use six or more sentences.",
      accept: ["think", "position", "because", "four", "day", "week", "longer", "students", "first", "second", "also", "however", "although", "tired", "learn"], minWords: 35,
      hint: "Position, two developed reasons, and a response to the other side. Six or more sentences.", points: 4 },
  ],
};

const S2_G68 = {
  listening: [
    { task: "Listen to a Short Exchange", topic: "Locker Jam",
      intro: "You will hear two students talk. You will hear it only once.",
      transcript: "Girl: My locker will not open again, and my math book is inside.\nBoy: The custodian keeps a master key in the front office. Go before the bell so you are not late.",
      qs: [ { stem: "What does the boy suggest?", options: ["Go to the office before the bell", "Borrow his book", "Skip math class"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "Group Presentation",
      intro: "You will hear it only once.",
      transcript: "Boy: Our group presents on Monday and we still have no slides.\nGirl: I made an outline last night. If you write the opening and closing, I can build the slides this weekend.",
      qs: [ { stem: "What does the girl ask the boy to do?", options: ["Write the opening and closing", "Build the slides", "Cancel the presentation"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "Track Tryouts",
      intro: "You will hear it only once.",
      transcript: "Girl: Tryouts for track are Tuesday, but I have not run all winter.\nBoy: Coach cares more about effort than times at tryouts. Just show up and finish everything she asks for.",
      qs: [ { stem: "What does the boy say the coach values?", options: ["Effort more than times", "Winning every race", "Previous experience"], answer: 0 } ] },
    { task: "Listen to a Classroom Conversation", topic: "Lab Safety Rules",
      intro: "You will hear a teacher and a student. You will hear it only once.",
      transcript: "Student: Ms. Adeyemi, can we start the heating lab today?\nTeacher: Yes, but goggles go on before you light anything, not after.\nStudent: Do we need the aprons too?\nTeacher: Yes. And tie back long hair. Last year a student leaned over a burner and we had a close call.\nStudent: Goggles first, apron on, hair tied back.",
      qs: [
        { stem: "When must goggles be put on?", options: ["Before lighting anything", "After the flame starts", "Only if asked"], answer: 0 },
        { stem: "What else must students do?", options: ["Wear aprons and tie back long hair", "Remove their shoes", "Work alone"], answer: 0 },
        { stem: "Why does the teacher mention last year?", options: ["To explain why the rule exists", "To praise the class", "To assign homework"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "How Vaccines Work",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "A vaccine works by giving your immune system a practice run. It introduces a harmless piece or copy of a germ, something that cannot make you sick. Your body treats it as a real threat and builds defenders called antibodies, along with memory cells that remember exactly what that germ looked like. Later, if the real germ arrives, those memory cells recognize it immediately and the response is fast enough to stop the illness before it takes hold. The soreness some people feel afterward is not the illness. It is the immune system doing its work.",
      qs: [
        { stem: "What does a vaccine introduce?", options: ["A harmless piece or copy of a germ", "A live illness", "A medicine that kills germs"], answer: 0 },
        { stem: "What do memory cells do?", options: ["Remember what the germ looked like", "Destroy the vaccine", "Carry oxygen"], answer: 0 },
        { stem: "Why is the later response fast?", options: ["Memory cells recognize the germ immediately", "The germ is weaker", "The body is warmer"], answer: 0 },
        { stem: "What causes the soreness some people feel?", options: ["The immune system working", "The illness itself", "The needle size"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "The Silk Road",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "The Silk Road was not one road at all. It was a shifting web of trade routes linking China to the Mediterranean for more than a thousand years. Silk traveled west, along with paper and gunpowder; gold, glass, and horses traveled east. Almost no merchant made the entire journey. Instead, goods changed hands at oasis towns, with each trader covering one stretch. What moved along those routes was never only cargo. Religions, technologies, and diseases traveled the same paths, which is why historians call the Silk Road one of the earliest engines of global connection.",
      qs: [
        { stem: "What was the Silk Road?", options: ["A web of trade routes", "A single paved highway", "A river"], answer: 0 },
        { stem: "How did goods travel the whole distance?", options: ["They changed hands at oasis towns", "One merchant carried them", "By ship only"], answer: 0 },
        { stem: "Besides goods, what traveled the routes?", options: ["Religions, technologies, and diseases", "Only silk", "Only soldiers"], answer: 0 },
        { stem: "Why do historians call it an engine of global connection?", options: ["It linked distant societies", "It used engines", "It was recently built"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Sleep and Memory",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Scientists used to think sleep was simply rest. We now know the brain is intensely busy at night. During deep sleep, the brain replays the day's experiences and moves the important ones into long-term storage, a process called consolidation. Sleep also flushes waste products out of brain tissue, something that happens far more slowly when we are awake. This explains a frustrating fact many students discover: studying all night usually produces worse results than studying less and sleeping, because without sleep the material is never properly filed away.",
      qs: [
        { stem: "What is consolidation?", options: ["Moving experiences into long-term storage", "Cleaning the ears", "Slowing the heart"], answer: 0 },
        { stem: "What else does sleep do?", options: ["Flushes waste out of brain tissue", "Raises body temperature", "Stops the brain entirely"], answer: 0 },
        { stem: "Why does studying all night backfire?", options: ["Material is never properly filed away", "Books are heavy", "Lights hurt the eyes"], answer: 0 },
        { stem: "What did scientists once believe?", options: ["Sleep was simply rest", "Sleep was unnecessary", "Sleep caused illness"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Urban Heat Islands",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "On a summer afternoon, a city can be several degrees hotter than the farmland just outside it. This is called an urban heat island. Dark roofs and asphalt absorb sunlight and hold that heat long into the night, while buildings block the breeze that would otherwise carry it away. Countryside soil and plants, by contrast, release water that cools the air as it evaporates. Cities are now fighting back in a simple way: painting roofs white to reflect sunlight, and planting trees whose shade and moisture can lower a street's temperature noticeably.",
      qs: [
        { stem: "What is an urban heat island?", options: ["A city hotter than the land around it", "A park in a city", "A type of building"], answer: 0 },
        { stem: "Why do cities hold heat?", options: ["Dark roofs and asphalt absorb and hold it", "Cars are warm", "People crowd together"], answer: 0 },
        { stem: "How do plants cool the countryside?", options: ["Released water cools the air as it evaporates", "They block the sun entirely", "They absorb wind"], answer: 0 },
        { stem: "What are cities doing about it?", options: ["Painting roofs white and planting trees", "Building taller towers", "Widening roads"], answer: 0 },
      ] },
  ],
  reading: [
    { task: "Read a Short Informational Passage", topic: "Sequoias and Fire",
      passage: "Giant sequoias are among the largest living things on Earth, and fire, usually a forest's enemy, is part of their secret. Their bark grows up to two feet thick and contains almost no flammable resin, so mature trees survive flames that kill their competitors. Stranger still, sequoia cones can hang closed on a branch for twenty years, waiting. The heat of a passing fire dries and opens them, releasing seeds onto ground the fire has just cleared of brush and rivals. For a sequoia, a burn is not a disaster. It is an opening.",
      qs: [
        { stem: "Why do mature sequoias survive fire?", options: ["Thick bark with almost no flammable resin", "They grow beside rivers", "They are too tall to burn", "Firefighters protect them"], answer: 0 },
        { stem: "What opens the cones?", options: ["The heat of a passing fire", "Heavy rain", "Birds", "Strong wind"], answer: 0 },
        { stem: "Why is freshly burned ground good for seeds?", options: ["It is cleared of brush and rivals", "It is softer", "It holds more water", "It is shaded"], answer: 0 },
        { stem: "“It is an opening” means fire…", options: ["creates the sequoia's opportunity", "destroys the forest", "should be prevented", "opens the bark"], answer: 0 },
      ] },
    { task: "Read a Short Informational Passage", topic: "Why Bridges Sway",
      passage: "Engineers design tall bridges and towers to move. A structure that cannot bend at all must absorb every force with its own material, and eventually something cracks. So engineers build in flexibility, allowing a bridge deck to sway measurably in strong wind. The famous failure of the Tacoma Narrows Bridge in 1940 taught them the limit of that idea: wind hit the deck at just the right rhythm to push it higher and higher, a matching of frequencies called resonance. Modern bridges include openings and dampers specifically to break up that rhythm before it builds.",
      qs: [
        { stem: "Why do engineers allow bridges to move?", options: ["A rigid structure absorbs every force until it cracks", "Movement looks impressive", "It saves material", "It reduces traffic"], answer: 0 },
        { stem: "What is resonance, according to the passage?", options: ["A matching of frequencies that builds motion", "A kind of metal", "A wind speed", "A bridge design"], answer: 0 },
        { stem: "What do modern bridges include?", options: ["Openings and dampers to break up the rhythm", "Thicker paint", "Fewer supports", "Lower speed limits"], answer: 0 },
        { stem: "The Tacoma Narrows failure taught engineers…", options: ["the limit of building in flexibility", "to avoid wind entirely", "to build shorter bridges", "to use wood"], answer: 0 },
      ] },
    { task: "Read a Student Essay", topic: "Phone-Free Classrooms",
      passage: "(Read a classmate's draft and answer the questions.) “Our school should collect phones in a caddy at the start of every class. First, students who keeps a phone in their pocket check it constantly, even when they mean not to. Second, a teacher should not have to spend the period policing screens instead of teaching. Some students argue that phones are needed for emergencies, however the front office can reach any classroom in seconds, exactly as it did before phones existed. Nobody is asking students to give up their phones. We are asking for forty-five minutes of attention.”",
      qs: [
        { stem: "What is the writer proposing?", options: ["Collecting phones in a caddy during class", "Banning phones from campus", "Buying new phones", "Ending the school day early"], answer: 0 },
        { stem: "Which phrase has a subject-verb error?", options: ["“students who keeps a phone”", "“a teacher should not have to spend”", "“the front office can reach”", "“we are asking for forty-five minutes”"], answer: 0 },
        { stem: "The sentence containing “however” would be BEST corrected as…", options: ["“…needed for emergencies; however, the front office can reach…”", "“…needed for emergencies and however…”", "starting the essay with “however”", "deleting “front office”"], answer: 0 },
        { stem: "How does the writer answer the emergency argument?", options: ["The office can reach any classroom in seconds", "Emergencies are rare", "Phones do not work at school", "Parents should not call"], answer: 0 },
        { stem: "The final two sentences work mainly to…", options: ["narrow the request so it seems reasonable", "introduce a new reason", "quote a teacher", "list statistics"], answer: 0 },
        { stem: "“Even when they mean not to” suggests that checking a phone is…", options: ["hard to control", "always deliberate", "against the rules", "rare"], answer: 0 },
      ] },
    { task: "Read a Literary Passage", topic: "The Understudy",
      passage: "Ivan had been the understudy for three productions and had never once gone on stage. He learned every line anyway, and he learned them the way the lead said them, matching her pauses and her breathing. When she lost her voice two hours before opening night, the director found Ivan already in costume, sitting calmly in the wings. He did not perform the role the way he would have chosen. He performed it the way the audience had been promised, and afterward, when people congratulated him on his interpretation, he corrected them every time. “That is her interpretation,” he said. “I only kept it safe.”",
      qs: [
        { stem: "How did Ivan learn his lines?", options: ["The way the lead said them, matching her pauses", "From a recording", "In his own style", "From the director"], answer: 0 },
        { stem: "What did the director find two hours before opening?", options: ["Ivan already in costume and calm", "An empty theater", "A canceled show", "A new script"], answer: 0 },
        { stem: "Why did Ivan correct people who praised his interpretation?", options: ["He believed the interpretation was hers", "He disliked compliments", "He had forgotten his lines", "He wanted more praise"], answer: 0 },
        { stem: "“I only kept it safe” shows that Ivan saw his role as…", options: ["protecting someone else's work", "improving the play", "replacing the lead", "avoiding blame"], answer: 0 },
        { stem: "The detail that he had never gone on stage in three productions emphasizes…", options: ["how long he prepared without reward", "how new he was", "how weak the cast was", "how small the theater was"], answer: 0 },
        { stem: "A theme of the passage is…", options: ["quiet preparation is its own kind of devotion", "understudies deserve better roles", "leads are unreliable", "honesty is difficult"], answer: 0 },
      ] },
    { task: "Read an Informational Passage", topic: "The Printing Press",
      passage: "Before the printing press, every book in Europe was copied by hand, which meant books were rare and mostly owned by the wealthy. Around 1440, Johannes Gutenberg combined movable metal type with a modified press, and a single shop could suddenly produce hundreds of identical pages in a day. Prices fell and literacy spread. Ideas began moving faster than any ruler could control them. Printing also quietly standardized language: when thousands of readers see the same spelling on the same printed page, that spelling starts to become the rule. The press did not just spread ideas. It reshaped the language those ideas were written in.",
      qs: [
        { stem: "Why were books rare before the press?", options: ["Each one was copied by hand", "Paper did not exist", "Reading was illegal", "Ink was expensive"], answer: 0 },
        { stem: "What did Gutenberg combine?", options: ["Movable metal type and a modified press", "Paper and ink", "A mill and a wheel", "Glass and metal"], answer: 0 },
        { stem: "What happened to prices and literacy?", options: ["Prices fell and literacy spread", "Both fell", "Both rose sharply", "Neither changed"], answer: 0 },
        { stem: "How did printing standardize language?", options: ["Repeated spellings on printed pages became the rule", "Governments required it", "Dictionaries were banned", "Schools closed"], answer: 0 },
        { stem: "“Faster than any ruler could control them” suggests the press…", options: ["weakened authority over ideas", "was operated by rulers", "was illegal", "printed only laws"], answer: 0 },
        { stem: "The final sentence works to…", options: ["extend the argument beyond the obvious effect", "summarize the dates", "introduce Gutenberg", "quote a historian"], answer: 0 },
      ] },
  ],
  speaking: [
    { task: "Talk about a Scene (1 of 4)", topic: "Robotics Lab", scene: "s2-68-sp-robotics",
      prompt: "Look at the picture. Describe what is happening in this scene.", points: 1, checks: ["A full-sentence description"] },
    { task: "Talk about a Scene (2 of 4)", topic: "Robotics Lab", scene: "s2-68-sp-robotics",
      prompt: "Describe two students in the picture and what each one is doing.", points: 1, checks: ["Two students described"] },
    { task: "Talk about a Scene (3 of 4)", topic: "Robotics Lab", scene: "s2-68-sp-robotics",
      prompt: "What problem do you think the students are solving, and what will they probably do next? Explain.", points: 2, checks: ["An inference", "A prediction with a reason"] },
    { task: "Talk about a Scene (4 of 4)", topic: "Robotics Lab", scene: "s2-68-sp-robotics",
      prompt: "Tell about a time you worked with a team to solve a problem. What was your part?", points: 2, checks: ["Past tense", "Your specific role"] },
    { task: "Speech Functions", topic: "Missed Deadline",
      prompt: "You could not finish an assignment because you were sick. What would you say to your teacher?", points: 1, checks: ["Explained the reason", "Asked appropriately"] },
    { task: "Speech Functions", topic: "Group Disagreement",
      prompt: "Your group wants to take the project in a direction you think will not work. What would you say to them?", points: 1, checks: ["Respectful", "Clear about the concern"] },
    { task: "Support an Opinion", topic: "Electives or Study Hall",
      prompt: "Should your school add more elective classes or a daily study hall? State your opinion and justify it with a reason and explanation.", points: 3, checks: ["Clear opinion", "Reason WITH explanation"] },
    { task: "Support an Opinion", topic: "Uniforms",
      prompt: "Should your school require uniforms? State your position and justify it with a reason and explanation.", points: 3, checks: ["Clear position", "Developed reason"] },
    { task: "Present and Discuss Information", topic: "Club Membership", scene: "s2-68-graph-clubs",
      prompt: "Look at the bar graph of after-school club membership. Point 1: Describe what the graph shows. Point 2: A student claims the art club is the largest club. Using the graph, is that claim supported? Explain.", points: 3, checks: ["Accurate reading of the bars", "Judged the claim with data"] },
    { task: "Summarize an Academic Presentation", topic: "How Vaccines Work",
      prompt: "Summarize the vaccine presentation in your own words: what a vaccine introduces, what the body builds, and what happens if the real germ arrives later.", points: 4, checks: ["All three parts in order", "Own words"] },
    { task: "Summarize an Academic Presentation", topic: "Urban Heat Islands",
      prompt: "Summarize the urban heat island presentation: what it is, why cities hold heat, and what cities are doing about it.", points: 4, checks: ["All three parts", "Connected sentences", "Own words"] },
  ],
  writing: [
    { task: "Describe a Picture (Question 1)", topic: "Robotics Lab", scene: "s2-68-sp-robotics", kind: "frame",
      stem: "Look at the picture. A classmate wrote: “The students builds a robot. The robot have four wheels.” Correct the two errors and combine the ideas into one clear sentence.",
      accept: ["build", "has", "students", "robot", "wheels", "four", "with", "that"], minWords: 6,
      hint: "Fix both verbs, then join with “with” or “that”. Example: “The students build a robot that has four wheels.”", points: 2 },
    { task: "Describe a Picture (Question 2)", topic: "Robotics Lab", scene: "s2-68-sp-robotics", kind: "frame",
      stem: "Look at the same picture. Write one complete sentence about what will probably happen next. Add a detail that makes your prediction clear.",
      accept: ["will", "next", "test", "drive", "program", "robot", "students", "then", "fix", "competition"], minWords: 6,
      hint: "Use “will” plus a detail. Example: “The students will test the robot before the competition.”", points: 2 },
    { task: "Write About an Experience", topic: "Changed Your Mind", kind: "frame",
      stem: "Write about a time you changed your mind about something. What did you think at first, what changed it, and what do you think now? Write a paragraph of at least three sentences.",
      accept: ["thought", "first", "changed", "until", "then", "because", "realized", "now", "different", "after", "mind"], minWords: 25,
      hint: "Before, the turning point, and after. Past tense for the first two.", points: 4 },
    { task: "Write About Academic Information (Question 4)", topic: "Plant Experiment", scene: "plant-experiment-chart", kind: "frame",
      stem: "A graphic organizer shows an experiment: Plant A — on the windowsill, watered daily, grew 12 cm · Plant B — in a dark closet, watered daily, grew 3 cm. Using details from the organizer, write about what the experiment showed. Write at least two sentences.",
      accept: ["plant", "window", "closet", "watered", "grew", "12", "3", "sunlight", "light", "taller", "because"], minWords: 15,
      hint: "Compare both plants using the numbers, then name the cause.", points: 2 },
    { task: "Write About Academic Information (Question 5)", topic: "Plant Experiment", scene: "plant-experiment-chart", kind: "frame",
      stem: "A classmate says Plant A was simply a healthier plant to begin with. Using details from the same organizer, explain whether the experiment supports that claim. Write at least three sentences.",
      accept: ["both", "watered", "daily", "same", "only", "difference", "light", "sunlight", "closet", "because", "not", "healthier", "evidence"], minWords: 25,
      hint: "Point out what was the same for both plants and what was different.", points: 3 },
    { task: "Justify an Opinion", topic: "Year-Round School", kind: "frame",
      stem: "Some districts use a year-round calendar: a shorter summer with more breaks spread through the year. Should your school switch? State your position and support it with at least two reasons. Use six or more sentences.",
      accept: ["think", "position", "because", "year", "round", "summer", "breaks", "students", "forget", "first", "second", "also", "however", "although"], minWords: 35,
      hint: "Position, two developed reasons, and a response to the other side.", points: 4 },
  ],
};

const S3_G68 = {
  listening: [
    { task: "Listen to a Short Exchange", topic: "Late Bus",
      intro: "You will hear two students talk. You will hear it only once.",
      transcript: "Boy: My bus was twenty minutes late and I missed the beginning of first period.\nGirl: Get a pass from the office. If the bus is late, it does not count against your attendance.",
      qs: [ { stem: "Why does the girl say to get a pass?", options: ["A late bus does not count against attendance", "The teacher requires it", "It excuses homework"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "Science Fair Topic",
      intro: "You will hear it only once.",
      transcript: "Girl: I cannot decide on a science fair topic. Everything I think of has been done already.\nBoy: Ms. Vega said the best projects start with something you noticed yourself, not something you looked up.",
      qs: [ { stem: "What does Ms. Vega suggest starting with?", options: ["Something you noticed yourself", "A topic from a website", "Last year's winners"], answer: 0 } ] },
    { task: "Listen to a Short Exchange", topic: "Borrowed Calculator",
      intro: "You will hear it only once.",
      transcript: "Boy: I still have your calculator from the unit test last week.\nGirl: Keep it through Friday. I have my old one, and you have the geometry final before I need it back.",
      qs: [ { stem: "Why can the boy keep the calculator?", options: ["She has another one and he has a final first", "She does not want it", "He bought it"], answer: 0 } ] },
    { task: "Listen to a Classroom Conversation", topic: "Research Sources",
      intro: "You will hear a librarian and a student. You will hear it only once.",
      transcript: "Student: Mr. Bello, are websites allowed for the research paper?\nLibrarian: Yes, but at least two of your five sources must come from the database, not an open search.\nStudent: How do I tell the difference?\nLibrarian: Database articles list an author and a publication date. If you cannot find either, it does not count.\nStudent: Two from the database, and check for author and date.",
      qs: [
        { stem: "How many sources must come from the database?", options: ["At least two of five", "All five", "None"], answer: 0 },
        { stem: "How can the student identify a database article?", options: ["It lists an author and a publication date", "It has pictures", "It is longer"], answer: 0 },
        { stem: "What happens if a source has no author or date?", options: ["It does not count", "It counts as two", "It must be printed"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Antibiotic Resistance",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Antibiotics kill bacteria, but bacteria fight back, not by choice but by chance. In any infection, a few bacteria happen to carry random mutations that let them survive the drug. When the antibiotic wipes out the rest, those survivors are the ones that multiply, and the next infection is harder to treat. This is exactly why doctors insist on finishing a full prescription. Stopping early leaves the toughest bacteria alive and unchallenged. Resistance is not the drug growing weaker. It is the bacterial population growing stronger.",
      qs: [
        { stem: "Where does resistance begin?", options: ["Random mutations in a few bacteria", "The drug expiring", "The patient's diet"], answer: 0 },
        { stem: "Why must patients finish a prescription?", options: ["Stopping early leaves the toughest bacteria alive", "The pills expire", "It costs less"], answer: 0 },
        { stem: "What does the final sentence claim?", options: ["The bacterial population is what changes", "Drugs weaken over time", "Doctors are mistaken"], answer: 0 },
        { stem: "“Not by choice but by chance” means resistance arises from…", options: ["random mutation, not intention", "careful planning", "human error"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "The Transcontinental Railroad",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Before 1869, crossing the United States took months by wagon or a long voyage by sea. The transcontinental railroad changed that. Two companies built toward each other, one laying track east from California and the other west from Nebraska, through mountains, deserts, and blizzards. Much of the most dangerous work was done by Chinese and Irish immigrant crews. When the rails finally met in Utah, a trip that had taken up to six months could be made in about a week, and goods, mail, and people began moving at a speed no one had imagined.",
      qs: [
        { stem: "How was the railroad built?", options: ["Two companies built toward each other", "One company built it alone", "The army built it"], answer: 0 },
        { stem: "Who did much of the most dangerous work?", options: ["Chinese and Irish immigrant crews", "Government engineers", "Local farmers"], answer: 0 },
        { stem: "How did travel time change?", options: ["From up to six months to about a week", "From a week to a day", "It did not change"], answer: 0 },
        { stem: "Where did the rails meet?", options: ["Utah", "California", "Nebraska"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "The Northern Lights",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "The northern lights begin ninety-three million miles away, on the sun. The sun constantly throws off charged particles, and when a strong burst reaches Earth, our planet's magnetic field funnels those particles toward the poles. High in the atmosphere they collide with gases, and each collision releases a tiny flash of light. Oxygen glows green and red; nitrogen glows blue and purple. Billions of collisions happening at once produce the curtains of light we call an aurora, which is why the display shifts and ripples rather than staying still.",
      qs: [
        { stem: "Where do the particles come from?", options: ["The sun", "The moon", "Earth's core"], answer: 0 },
        { stem: "What funnels them toward the poles?", options: ["Earth's magnetic field", "Ocean currents", "High winds"], answer: 0 },
        { stem: "What causes the different colors?", options: ["Different gases glowing", "Different seasons", "Cloud thickness"], answer: 0 },
        { stem: "Why does the display ripple rather than stay still?", options: ["Billions of collisions happen at once", "The sun moves", "The poles shift"], answer: 0 },
      ] },
    { task: "Listen to an Oral Presentation", topic: "Supply and Demand",
      intro: "Listen to a student presentation. You will hear it only once.",
      transcript: "Prices are not just numbers. They are signals. When many people want something that is scarce, sellers can raise the price, and that higher price tells producers to make more of it. When something is plentiful and few people want it, the price falls, and producers shift to making something else. This is supply and demand, and it explains why strawberries cost more in winter than in June. The system is not perfect, but it moves resources without anyone giving orders, which is why economists call price a signal rather than a command.",
      qs: [
        { stem: "What happens when a wanted item is scarce?", options: ["The price rises and producers make more", "The price falls", "Production stops"], answer: 0 },
        { stem: "What happens when something is plentiful and unwanted?", options: ["The price falls and producers shift", "The price rises", "It is destroyed"], answer: 0 },
        { stem: "Why do strawberries cost more in winter?", options: ["They are scarcer then", "They taste better", "Shipping is free"], answer: 0 },
        { stem: "Why do economists call price a signal?", options: ["It moves resources without anyone giving orders", "It is written on a sign", "It never changes"], answer: 0 },
      ] },
  ],
  reading: [
    { task: "Read a Short Informational Passage", topic: "Why Leaves Change Color",
      passage: "Leaves are green because of chlorophyll, the pigment that runs photosynthesis. But yellow and orange pigments sit in the leaf all summer, hidden beneath the green. When autumn days shorten, trees stop producing chlorophyll, the green fades, and those hidden colors finally show. The brightest reds work differently. They are manufactured fresh in the fall from sugars trapped in the leaf, which is why the most brilliant red autumns follow a stretch of sunny days and cool nights.",
      qs: [
        { stem: "Where are yellow and orange pigments during summer?", options: ["Hidden beneath the green", "In the roots", "In the soil", "Not yet formed"], answer: 0 },
        { stem: "What makes the green fade?", options: ["Trees stop producing chlorophyll", "Rain washes it away", "Frost kills the leaf", "Wind removes it"], answer: 0 },
        { stem: "How are the brightest reds different?", options: ["They are made fresh in fall from trapped sugars", "They are the oldest pigment", "They come from the bark", "They appear in spring"], answer: 0 },
        { stem: "Brilliant red autumns follow…", options: ["sunny days and cool nights", "early snow", "heavy rain", "warm nights"], answer: 0 },
      ] },
    { task: "Read a Short Informational Passage", topic: "Lighthouse Keepers",
      passage: "For centuries, a lighthouse was only as reliable as its keeper. Keepers lived beside the tower, hauling oil up spiral stairs, trimming wicks through the night, and polishing the great lens every morning, because a single smoky pane could dim the beam that ships depended on. In the twentieth century, electric lamps, automatic timers, and eventually satellite navigation arrived, and one by one the keepers' houses emptied. Most lighthouses still shine today, but they shine alone. Machines now tend a light that once demanded a person's entire life.",
      qs: [
        { stem: "Why did keepers polish the lens daily?", options: ["A smoky pane could dim the beam ships depended on", "For inspections", "To pass the time", "To prevent rust"], answer: 0 },
        { stem: "What eventually replaced the keepers?", options: ["Electric lamps, timers, and satellite navigation", "Larger crews", "Ship captains", "Nothing"], answer: 0 },
        { stem: "“They shine alone” means lighthouses are now…", options: ["automated, without keepers", "no longer used", "brighter than before", "privately owned"], answer: 0 },
        { stem: "The passage is organized mainly by…", options: ["then versus now", "cause and effect only", "a list of lighthouses", "question and answer"], answer: 0 },
      ] },
    { task: "Read a Student Essay", topic: "Later Start Times",
      passage: "(Read a classmate's draft and answer the questions.) “Our school should push the start time back by forty minutes. First, sleep researchers has shown that teenage bodies naturally fall asleep later, which means an early bell fights biology rather than laziness. Second, students who arrives exhausted do not learn well, so the first period is largely wasted. Some parents worry about work schedules, however a later start also means a later release, which matches many parents' shifts better than the current schedule does. We are not asking for less school. We are asking for school at an hour when we can actually think.”",
      qs: [
        { stem: "What is the writer proposing?", options: ["A start time forty minutes later", "A shorter school day", "More homework time", "A four-day week"], answer: 0 },
        { stem: "Which phrase contains a subject-verb error?", options: ["“sleep researchers has shown”", "“an early bell fights biology”", "“a later start also means”", "“we are not asking for less school”"], answer: 0 },
        { stem: "“Students who arrives exhausted” should be written as…", options: ["students who arrive exhausted", "student who arrives exhausted", "students whom arrives exhausted", "students who arriving exhausted"], answer: 0 },
        { stem: "The sentence containing “however” would be BEST corrected as…", options: ["“…about work schedules; however, a later start also means…”", "“…about work schedules and however…”", "deleting “later release”", "moving “however” to the end"], answer: 0 },
        { stem: "“Fights biology rather than laziness” is used to…", options: ["reject the idea that students are simply lazy", "criticize researchers", "describe a science class", "explain a schedule"], answer: 0 },
        { stem: "The final two sentences mainly serve to…", options: ["reframe the request so it sounds modest", "add a statistic", "introduce a new objection", "quote a parent"], answer: 0 },
      ] },
    { task: "Read a Literary Passage", topic: "The Trade",
      passage: "Milo's rookie card was the pride of his binder, the one card everyone at the table wanted and the one he never traded. Then his best friend Theo broke his leg and missed the entire tournament season, watching from the bleachers with his crutches stacked beside him. On the last day of school, Milo slid an envelope through the vents of Theo's locker. Inside was the rookie card and a note: “Worth more to you this summer than to me.” Theo texted one word, “why,” and Milo wrote back: “Because you kept showing up to watch us. That is rarer than the card.”",
      qs: [
        { stem: "What made the rookie card special?", options: ["Everyone wanted it and Milo never traded it", "It was newly printed", "Theo had given it to him", "It was worth money"], answer: 0 },
        { stem: "What happened to Theo?", options: ["He broke his leg and missed the season", "He moved away", "He quit the team", "He lost his binder"], answer: 0 },
        { stem: "How did Milo deliver the card?", options: ["Through the vents of Theo's locker", "At a team dinner", "By mail", "In class"], answer: 0 },
        { stem: "What did Milo call rarer than the card?", options: ["Theo showing up to watch", "A signed jersey", "Winning a tournament", "A perfect season"], answer: 0 },
        { stem: "The detail about the stacked crutches emphasizes…", options: ["Theo's sidelined season", "the size of the bleachers", "Theo's impatience", "the length of the games"], answer: 0 },
        { stem: "A theme of the passage is…", options: ["loyalty is worth more than possessions", "collections should be shared", "injuries end friendships", "cards lose value"], answer: 0 },
      ] },
    { task: "Read an Informational Passage", topic: "Roman Aqueducts",
      passage: "Ancient Rome grew far larger than its local wells could support, so Roman engineers built aqueducts, channels that carried water from distant hills into the city. The remarkable part is what powered them: nothing but gravity. Engineers designed each channel to drop only a few centimeters every hundred meters, a slope gentle enough to keep water flowing smoothly across dozens of kilometers without a single pump. Most of the system actually ran underground; the famous arched bridges appeared only where a valley had to be crossed. Parts of it worked so well that a few sections still carry water today, two thousand years later.",
      qs: [
        { stem: "Why did Rome need aqueducts?", options: ["Local wells could not support the growing city", "Rivers were polluted", "Rain was scarce", "Wells were illegal"], answer: 0 },
        { stem: "What powered the aqueducts?", options: ["Gravity alone", "Steam pumps", "Wind", "Animal power"], answer: 0 },
        { stem: "Why was the gentle slope important?", options: ["It kept water flowing smoothly over long distances", "It saved stone", "It prevented flooding", "It hid the channel"], answer: 0 },
        { stem: "Where were the arched bridges built?", options: ["Only where a valley had to be crossed", "Throughout the whole system", "Inside the city only", "Nowhere"], answer: 0 },
        { stem: "That some sections still work supports the idea that…", options: ["Roman engineering was exceptional", "the system was simple", "water was cleaner then", "repairs were frequent"], answer: 0 },
        { stem: "“The remarkable part” signals that the author finds gravity power…", options: ["impressive", "dangerous", "ordinary", "confusing"], answer: 0 },
      ] },
  ],
  speaking: [
    { task: "Talk about a Scene (1 of 4)", topic: "Community Garden", scene: "s3-68-sp-garden",
      prompt: "Look at the picture. Describe what is happening in this scene.", points: 1, checks: ["A full-sentence description"] },
    { task: "Talk about a Scene (2 of 4)", topic: "Community Garden", scene: "s3-68-sp-garden",
      prompt: "Describe two people in the picture and what each one is doing.", points: 1, checks: ["Two people described"] },
    { task: "Talk about a Scene (3 of 4)", topic: "Community Garden", scene: "s3-68-sp-garden",
      prompt: "Why do you think these people are working together, and what will they probably do next? Explain your thinking.", points: 2, checks: ["An inference", "A prediction with a reason"] },
    { task: "Talk about a Scene (4 of 4)", topic: "Community Garden", scene: "s3-68-sp-garden",
      prompt: "Tell about a time you volunteered or helped in your community. What did you do?", points: 2, checks: ["Past tense", "Specific actions"] },
    { task: "Speech Functions", topic: "Return a Lost Item",
      prompt: "You found a wallet in the hallway. What would you say when you bring it to the office?", points: 1, checks: ["Clear explanation", "Appropriate"] },
    { task: "Speech Functions", topic: "Request a Recommendation",
      prompt: "You need a teacher to recommend you for a summer program. What would you say?", points: 1, checks: ["Polite", "Specific about the request"] },
    { task: "Support an Opinion", topic: "Sports or Arts Funding",
      prompt: "Your school has money for one program: a new sports team or a new arts program. Which should it fund? State your position and justify it with a reason and explanation.", points: 3, checks: ["Clear position", "Reason WITH explanation"] },
    { task: "Support an Opinion", topic: "Online or Paper Textbooks",
      prompt: "Should your classes use online textbooks or paper ones? State your opinion and justify it with a reason and explanation.", points: 3, checks: ["Clear opinion", "Developed reason"] },
    { task: "Present and Discuss Information", topic: "Reading Minutes", scene: "s3-68-graph-reading",
      prompt: "Look at the line graph showing average reading minutes per week across the school year. Point 1: Describe the trend the graph shows. Point 2: A student claims reading minutes dropped every single month. Using the graph, is that claim supported? Explain.", points: 3, checks: ["Accurate trend description", "Judged the claim with data"] },
    { task: "Summarize an Academic Presentation", topic: "Antibiotic Resistance",
      prompt: "Summarize the antibiotic resistance presentation: where resistance comes from, why finishing a prescription matters, and what resistance actually means.", points: 4, checks: ["All three parts", "Own words"] },
    { task: "Summarize an Academic Presentation", topic: "Supply and Demand",
      prompt: "Summarize the supply and demand presentation: what happens when something scarce is wanted, what happens when something plentiful is not, and why price is called a signal.", points: 4, checks: ["Both directions", "The signal idea", "Own words"] },
  ],
  writing: [
    { task: "Describe a Picture (Question 1)", topic: "Community Garden", scene: "s3-68-sp-garden", kind: "frame",
      stem: "Look at the picture. A classmate wrote: “The volunteers plants vegetables. The garden have many beds.” Correct the two errors and combine the ideas into one clear sentence.",
      accept: ["plant", "has", "volunteers", "vegetables", "garden", "beds", "many", "in", "that", "with"], minWords: 6,
      hint: "Fix both verbs, then join the ideas. Example: “The volunteers plant vegetables in a garden that has many beds.”", points: 2 },
    { task: "Describe a Picture (Question 2)", topic: "Community Garden", scene: "s3-68-sp-garden", kind: "frame",
      stem: "Look at the same picture. Write one complete sentence about what will probably happen next. Add a detail that makes your prediction clear.",
      accept: ["will", "next", "water", "grow", "harvest", "vegetables", "volunteers", "then", "share", "neighbors"], minWords: 6,
      hint: "Use “will” plus a detail. Example: “The volunteers will water the beds before they leave.”", points: 2 },
    { task: "Write About an Experience", topic: "A Responsibility You Were Given", kind: "frame",
      stem: "Write about a time you were given an important responsibility. What was it, how did you handle it, and what did you learn? Write a paragraph of at least three sentences.",
      accept: ["responsibility", "asked", "trusted", "had", "first", "then", "because", "learned", "made", "sure", "finally"], minWords: 25,
      hint: "What the responsibility was, what you did, and what it taught you.", points: 4 },
    { task: "Write About Academic Information (Question 4)", topic: "Two Jobs", scene: "two-jobs-comparison", kind: "frame",
      stem: "A graphic organizer compares two summer jobs: Job A — grocery store, $16 per hour, 40 minutes away by bus · Job B — animal clinic, $13 per hour, 10 minutes away, related to the student's goal of becoming a veterinarian. Using details from the organizer, describe the trade-off between the two jobs. Write at least two sentences.",
      accept: ["job", "pays", "more", "16", "13", "closer", "farther", "bus", "clinic", "veterinarian", "goal", "but", "however"], minWords: 15,
      hint: "Say what each job wins on, using the numbers.", points: 2 },
    { task: "Write About Academic Information (Question 5)", topic: "Two Jobs", scene: "two-jobs-comparison", kind: "frame",
      stem: "A classmate says you should always take the job that pays more. Using details from the same organizer, explain whether you agree. Write at least three sentences.",
      accept: ["depends", "career", "veterinarian", "goal", "experience", "closer", "bus", "time", "because", "future", "pays", "16", "13", "not"], minWords: 25,
      hint: "Take a position, then use the career goal or travel time from the organizer.", points: 3 },
    { task: "Justify an Opinion", topic: "Attendance and Grades", kind: "frame",
      stem: "Some schools lower a student's course grade after too many absences. Should attendance affect grades? State your position and support it with at least two reasons, and respond to one point from the other side. Use six or more sentences.",
      accept: ["attendance", "grades", "because", "although", "however", "absent", "learning", "believe", "first", "second", "sick", "fair", "position"], minWords: 35,
      hint: "Position, two developed reasons, and one concession. Six or more sentences.", points: 4 },
  ],
};

// Grades 3–5 and 6–8 now use the rebuilt, blueprint-accurate banks.
// (Grade 9–10 content is carried over unchanged from the earlier build.)
const RAW_BANKS = {
  1: { ...BANK,  g35: S1_G35, g68: S1_G68, g1112: G1112_BANKS[1] },
  2: { ...BANK2, g35: S2_G35, g68: S2_G68, g1112: BANK2.g910 },
  3: { ...BANK3, g35: S3_G35, g68: S3_G68, g1112: BANK3.g910 },
};

const addedQuestion = (stem, correct, ...distractors) => ({
  stem, options: [correct, ...distractors], answer: 0,
});

const G35_SPEECH_FUNCTIONS = {
  1: ["Clarify Directions", "Your group is unsure which evidence belongs in a science report. What would you ask the teacher?"],
  2: ["Join a Game", "Some classmates are starting a game at recess. What would you say if you wanted to join appropriately?"],
  3: ["Explain a Mistake", "You accidentally took a classmate's notebook. What would you say when you return it?"],
};

const EXTRA_PRESENT_TASKS = {
  g68: {
    1: ["Travel to School", "Compare the two most common ways students travel to school. Then explain one reasonable conclusion supported by the graph.", "s1-68-graph-travel"],
    2: ["Club Membership", "Compare membership in the two smallest clubs. Then explain whether their combined membership is greater than the largest club.", "s2-68-graph-clubs"],
    3: ["Reading Minutes", "Identify the largest month-to-month change in reading time. Then explain what the graph does and does not prove about the cause.", "s3-68-graph-reading"],
  },
  g910: {
    1: ["Geometry", "Compare the largest and smallest changes in geometry enrollment. Use values from the graph to support your comparison.", "linegraph"],
    2: ["Club Membership", "Compare the two largest clubs and explain whether their combined membership is more than half of all students shown.", "barclubs"],
    3: ["Geometry Enrollment", "Identify the strongest change in enrollment and explain one conclusion the graph supports and one it does not support.", "linegraph"],
  },
};

const G68_ESSAY_QUESTIONS = {
  1: [
    addedQuestion("Which sentence most directly acknowledges an opposing view?", "The sentence about the cost of building a kitchen", "The sentence defining applied science", "The final sentence about careers", "The opening proposal"),
    addedQuestion("What revision would most strengthen the conclusion?", "Connect the proposed class to the evidence already presented", "Introduce an unrelated recipe", "Repeat the opening sentence word for word", "Delete the writer's position"),
  ],
  2: [
    addedQuestion("How does the writer respond to a likely objection?", "By acknowledging a concern and proposing a practical limit", "By changing the subject", "By claiming no one disagrees", "By removing all supporting evidence"),
    addedQuestion("Which revision would best strengthen the argument?", "Add relevant evidence showing how the proposal affects learning", "Add a joke unrelated to phones", "Replace the claim with a question", "Delete the conclusion"),
  ],
  3: [
    addedQuestion("What is the purpose of the counterargument in the essay?", "To acknowledge a competing concern before responding", "To introduce a new topic", "To show that the writer has no position", "To summarize a fictional story"),
    addedQuestion("Which additional evidence would be most relevant?", "Research connecting start time with attendance or alertness", "A list of school mascot names", "The price of cafeteria lunches", "A description of the school building"),
  ],
};

const G910_EXTRA_LISTENING = {
  1: {
    Eclipses: addedQuestion("Why are total eclipses uncommon in one location?", "The required alignment happens rarely", "The Moon produces no shadow", "Earth stops moving during an eclipse"),
    "Library of Alexandria": addedQuestion("What broader purpose did the library serve?", "It gathered and preserved knowledge", "It trained only soldiers", "It replaced every local school"),
    Suburbs: addedQuestion("How does the speaker support the position?", "By connecting the proposal to practical consequences", "By avoiding all reasons", "By discussing an unrelated invention"),
    "Walkable Spaces": addedQuestion("What would most weaken the speaker's argument?", "Evidence that the proposed change would not improve access", "Another example of a walkable neighborhood", "A clearer explanation of the proposal"),
  },
  2: {
    Anglerfish: addedQuestion("Which adaptation is emphasized?", "A feature that helps the fish survive in deep water", "The ability to live without water", "A migration across deserts"),
    "The Dust Bowl": addedQuestion("What relationship does the presentation explain?", "How environmental and farming conditions intensified damage", "How ocean tides created farms", "How a single storm ended migration"),
    "First Aid Training": addedQuestion("Which evidence would best strengthen the proposal?", "Data showing trained students respond more effectively in emergencies", "A list of unrelated electives", "A description of the school colors"),
    "Nutrition Info": addedQuestion("How does the speaker address individual choice?", "By explaining how information can support decisions", "By arguing that choices should be hidden", "By claiming nutrition never affects health"),
  },
  3: {
    "Antibiotic Resistance": addedQuestion("What misconception does the presentation correct?", "Bacteria, not a person's body, become resistant", "Antibiotics cure every infection", "Finishing medicine creates viruses"),
    "Transcontinental Railroad": addedQuestion("What major effect does the speaker emphasize?", "The railroad changed movement of people and goods", "The railroad eliminated every other route", "The railroad was completed without labor"),
    "Open Gym at Lunch": addedQuestion("What condition does the speaker include in the proposal?", "Clear supervision and participation rules", "Removing all safety procedures", "Closing the gym after lunch"),
    "Later Library Hours": addedQuestion("What evidence would best support the speaker?", "Usage data showing students need evening access", "A list of novels published last year", "The color of the library walls"),
  },
};

const G910_EXTRA_READING = {
  2: addedQuestion("What is the main purpose of the parking-permit information?", "To explain requirements and procedures", "To narrate a fictional trip", "To advertise a new vehicle", "To compare two sports"),
  3: addedQuestion("Why should students consult the final-exam schedule carefully?", "Different courses may meet at different assigned times", "Every exam begins at the same time", "The schedule applies only to teachers", "No room information is provided"),
};

const G68_OPINION_BLOCKS = {
  1: [
    ["Cafe Food and Food Safety", "A student argues that the school café should prepare more fresh food instead of relying on packaged meals. Fresh choices can include more vegetables and let students see how food is prepared. The change may cost more and could create waste if demand is uncertain. The student proposes beginning with one fresh special each week, tracking how many portions sell, and expanding only if the pilot succeeds.", [
      addedQuestion("What change does the student support?", "Preparing more fresh food", "Closing the school café", "Selling only packaged snacks"),
      addedQuestion("What benefit does the student identify?", "Students could have more fresh choices", "Food would never need refrigeration", "Every meal would cost less immediately"),
      addedQuestion("What concern does the student acknowledge?", "Higher cost and possible waste", "A shortage of tables", "A lack of student interest in lunch"),
      addedQuestion("Why does the student propose a pilot?", "To collect evidence before expanding", "To avoid tracking sales", "To remove fresh food after one day"),
    ]],
    ["The Do-It-Yourself Movement", "A student argues that schools should offer a supervised repair workshop. Learning to mend clothing or fix a bicycle can save money, reduce waste, and build confidence. Critics reasonably worry that some tools and electrical repairs are unsafe for beginners. The student therefore proposes limiting projects to low-risk repairs, requiring safety instruction, and having an adult approve every project.", [
      addedQuestion("What program does the student support?", "A supervised repair workshop", "A ban on student projects", "A required electrical job"),
      addedQuestion("Which benefit is offered?", "Repair skills can reduce waste", "Repairs make products wear out faster", "Tools remove the need for instruction"),
      addedQuestion("What counterargument is acknowledged?", "Some repairs may be unsafe", "Students already know every repair", "Schools have no broken items"),
      addedQuestion("How does the proposal respond to the concern?", "Limit projects and require supervision", "Allow all repairs without approval", "Remove safety instruction"),
    ]],
  ],
  2: [
    ["Sleep and Memory", "A student argues that middle schools should begin slightly later. Research discussed in class shows that sleep supports attention and memory, while many adolescents do not get enough rest. A later start could complicate bus schedules and sports. The student proposes a one-semester pilot at two schools, with attendance, grades, and transportation problems measured before any districtwide decision.", [
      addedQuestion("What change does the student support?", "A slightly later school start", "A shorter school year", "Eliminating after-school sports"),
      addedQuestion("What evidence supports the proposal?", "Sleep supports attention and memory", "Students never feel tired", "Bus schedules are simple"),
      addedQuestion("What difficulty is acknowledged?", "Transportation and activity schedules", "A lack of classrooms", "The absence of teachers"),
      addedQuestion("Why propose a limited pilot?", "To measure effects before expanding", "To avoid collecting any data", "To guarantee immediate districtwide change"),
    ]],
    ["Urban Heat Islands", "A student argues that the city should require more shade trees and reflective roofs in the hottest neighborhoods. Pavement and dark roofs store heat, raising temperatures and energy use. Planting and roof upgrades cost money at first, but cooler buildings can reduce electricity demand and protect residents during heat waves. The student recommends beginning where temperature maps and health data show the greatest risk.", [
      addedQuestion("What action does the student recommend?", "Add shade trees and reflective roofs", "Remove all neighborhood parks", "Use darker roofing materials"),
      addedQuestion("Why do some neighborhoods become hotter?", "Dark surfaces store heat", "Trees produce extra heat", "Electricity cools pavement"),
      addedQuestion("What counterargument is acknowledged?", "The improvements have upfront costs", "Temperature cannot be measured", "Heat waves never affect health"),
      addedQuestion("How should the city choose where to begin?", "Use temperature and health evidence", "Select neighborhoods randomly", "Choose only the newest buildings"),
    ]],
  ],
  3: [
    ["The Northern Lights", "A student argues that towns near popular aurora-viewing areas should reduce unnecessary nighttime light. Shielded fixtures can direct light toward streets while preserving darker skies for research, wildlife, and tourism. Some residents worry that darker skies mean unsafe roads. The student responds that the proposal is not to remove lighting, but to aim it carefully and use only the brightness needed for safety.", [
      addedQuestion("What change does the student support?", "Reducing unnecessary upward light", "Removing every streetlight", "Closing aurora-viewing areas"),
      addedQuestion("Which benefit is mentioned?", "Darker skies can support research and tourism", "Wildlife requires brighter signs", "Roads become longer"),
      addedQuestion("What concern does the student acknowledge?", "Possible effects on road safety", "A lack of electrical power", "Too many daytime visitors"),
      addedQuestion("How does the response address that concern?", "Use shielded, appropriately bright fixtures", "Turn off all lights permanently", "Ignore transportation needs"),
    ]],
    ["Supply and Demand", "A student argues that during emergencies the city should prevent extreme price increases for essential goods while also protecting supply. A strict price cap can make items affordable, but if sellers cannot cover unusual transportation costs, shortages may worsen. The student proposes temporary limits on excessive increases, public reporting of costs, and targeted assistance for families. This approach addresses unfair pricing without pretending that supply costs never change.", [
      addedQuestion("What problem does the student address?", "Extreme emergency prices for essentials", "Normal prices for entertainment", "The design of store signs"),
      addedQuestion("What risk of a strict price cap is acknowledged?", "It may worsen shortages", "It always increases supply", "It eliminates transportation"),
      addedQuestion("What solution is proposed?", "Temporary limits, cost reporting, and targeted aid", "Permanent free goods of every kind", "No oversight during emergencies"),
      addedQuestion("What makes the position qualified rather than absolute?", "It recognizes that genuine supply costs can change", "It claims all price changes are identical", "It ignores the needs of families"),
    ]],
  ],
};

// Presentation scripts for speaking-summary tasks that do not already have a
// matching oral presentation in the listening section. Other summary tasks
// automatically reuse the same-set listening transcript by topic.
const ACADEMIC_PRESENTATIONS = {
  Regelation: "Regelation is a special property of ice. When strong pressure is placed on ice, the melting point drops slightly and a thin layer turns to water. When the pressure is removed, that water freezes again. In a classic experiment, a weighted wire slowly moves through a block of ice. Pressure beneath the wire melts a narrow path, while the water above the wire refreezes. The wire passes all the way through, but the block remains joined together.",
  "How a Bill Becomes Law": "A new law begins as an idea that is written as a bill. The bill is introduced in the legislature, studied, discussed, and sometimes changed. Both houses of the legislature must approve the same version. The bill then goes to the governor, who may sign it or veto it. A signed bill becomes law. If it is vetoed, the legislature may be able to vote again and override the veto if enough members agree.",
  "Sound Waves": "Sound begins when something vibrates and pushes nearby particles back and forth. That movement travels outward as a sound wave. The speed of the vibration affects pitch: faster vibrations make a higher pitch, and slower vibrations make a lower pitch. You can hear this with jars. Identical empty jars sound alike, but adding different amounts of water changes how each jar vibrates, so each one produces a different pitch.",
  "Women in the Gold Rush": "Stories about the California Gold Rush often focus on men searching for gold, but women played an important economic role. They operated boarding houses, restaurants, bakeries, and laundries in rapidly growing mining towns. Miners needed meals, clean clothes, and places to sleep every day, so these businesses had steady customers. Some women earned more by providing these essential services than many miners earned by looking for gold.",
  Conductivity: "Electrical conductivity describes how easily electricity moves through a material. Metals such as copper conduct electricity well because some of their electrons can move freely. Materials such as rubber and glass hold their electrons more tightly and resist the flow, so they are called insulators. An electrical wire uses both kinds of material: metal carries the current, while a rubber coating keeps the current from reaching a person's hand.",
  "Branches of Government": "The United States government is divided into three branches. The legislative branch writes and passes laws. The executive branch carries out those laws. The judicial branch interprets laws and settles disagreements about what they mean. The branches also check one another. For example, a president can veto a bill, legislators can override some vetoes, and courts can decide whether a law follows the Constitution. These checks keep one branch from becoming too powerful.",
  "Carbon Capture": "Carbon capture is a process designed to keep carbon dioxide out of the atmosphere. Equipment separates carbon dioxide from gases produced by a power plant or factory. The captured gas is compressed and transported, often through a pipeline. It can then be injected deep underground into rock formations for long-term storage, or used in products such as building materials. The process can reduce emissions, although it requires energy and careful monitoring to prevent leaks.",
  "Public-Key Encryption": "Public-key encryption uses two related digital keys with different jobs. A public key may be shared openly and can be used to lock, or encrypt, information for its owner. A private key is kept secret and is used to unlock that information. The keys are mathematically connected, but calculating the private key from the public key is designed to be extremely difficult. If the private key is exposed, someone else could read protected messages or pretend to be the key's owner.",
};

const isAcademicSummary = (item) => item?.task === "Summarize an Academic Presentation";

function summaryPrompt(item) {
  if (!isAcademicSummary(item)) return item.prompt;
  if (/^(A (science )?presentation|A teacher) explained/i.test(item.prompt || "")) {
    return `Summarize the presentation about ${item.topic} in your own words. Include the main idea and important supporting details.`;
  }
  return item.prompt;
}

function completeBlueprint(bank, span, setNum) {
  if (!bank) return bank;
  const oralPresentations = new Map(
    (bank.listening || [])
      .filter((item) => item.task === "Listen to an Oral Presentation" && item.transcript)
      .map((item) => [item.topic, item.transcript])
  );
  const completed = {
    ...bank,
    listening: (bank.listening || []).map((item) => ({
      ...item,
      qs: item.qs?.map((question) => ({ ...question, options: [...question.options] })),
    })),
    speaking: (bank.speaking || []).map((item) => ({
      ...item,
      prompt: summaryPrompt(item),
      ...(isAcademicSummary(item) ? {
        presentation: item.presentation || oralPresentations.get(item.topic)
          || ACADEMIC_PRESENTATIONS[item.topic] || item.prompt,
      } : {}),
      checks: [...(item.checks || [])],
    })),
    reading: (bank.reading || []).map((item) => ({
      ...item,
      qs: item.qs?.map((question) => ({ ...question, options: [...question.options] })),
    })),
    writing: (bank.writing || []).map((item) => ({ ...item })),
  };

  if (span === "g35") {
    const [topic, prompt] = G35_SPEECH_FUNCTIONS[setNum];
    const firstSummary = completed.speaking.findIndex((item) => item.task.startsWith("Summarize"));
    completed.speaking.splice(firstSummary, 0, {
      task: "Speech Functions", topic, prompt, points: 2,
      checks: ["Appropriate language for the situation", "Clear meaning"],
    });
  }

  if (span === "g68") {
    const replacements = G68_OPINION_BLOCKS[setNum];
    completed.listening = completed.listening.map((block, index) => index < completed.listening.length - 2 ? block : {
      task: "Listen to a Speaker Support an Opinion",
      topic: replacements[index - (completed.listening.length - 2)][0],
      intro: "You will hear the recording only once.",
      transcript: replacements[index - (completed.listening.length - 2)][1],
      qs: replacements[index - (completed.listening.length - 2)][2],
    });
    const shortBlocks = completed.reading.filter((item) => item.task === "Read a Short Informational Passage");
    shortBlocks.forEach((item) => { item.qs = item.qs.slice(0, 3); });
    const essay = completed.reading.find((item) => item.task === "Read a Student Essay");
    essay.qs = [...essay.qs, ...G68_ESSAY_QUESTIONS[setNum]];
  }

  const structuralSpan = span === "g1112" && setNum > 1 ? "g910" : span;

  if (structuralSpan === "g68" || structuralSpan === "g910") {
    const [topic, prompt, scene] = EXTRA_PRESENT_TASKS[structuralSpan][setNum];
    const insertAt = completed.speaking.findIndex((item) => item.task.startsWith("Summarize"));
    completed.speaking.splice(insertAt, 0, {
      task: "Present and Discuss Information", topic, prompt, scene, points: 3,
      checks: ["Accurate use of the visual", "Evidence-based explanation"],
    });
  }

  if (structuralSpan === "g910") {
    completed.listening = completed.listening.map((block) => {
      const extra = G910_EXTRA_LISTENING[setNum][block.topic];
      return extra ? { ...block, qs: [...block.qs, extra] } : block;
    });
    if (setNum > 1) {
      const firstShort = completed.reading.find((item) => item.task === "Read a Short Informational Passage");
      firstShort.qs = [...firstShort.qs, G910_EXTRA_READING[setNum]];
    }
  }

  if (span === "g1112" && setNum > 1) {
    completed.speaking = completed.speaking.map((item) => ({
      ...item,
      prompt: `${item.prompt} Use precise, grade-appropriate academic language and develop your explanation.`,
      checks: [...(item.checks || []), "Precise academic language"],
    }));
    completed.writing = completed.writing.map((item) => ({
      ...item,
      stem: `${item.stem} Develop your response with precise language and an appropriate academic register.`,
      hint: item.hint || "Use connected reasoning and relevant details.",
    }));
  }

  completed.speaking = completed.speaking.map((item, index) => {
    let points = item.points;
    if (item.task.startsWith("Talk about a Scene")) points = index < 2 ? 1 : 2;
    else if (item.task === "Speech Functions") points = 2;
    else if (item.task === "Support an Opinion") points = 3;
    else if (item.task === "Present and Discuss Information") points = 3;
    else if (item.task.startsWith("Summarize")) points = 4;
    return { ...item, points };
  });
  return completed;
}

// Keep answer positions balanced and deterministic. This prevents students from
// learning a repeated A/B pattern while keeping saved answers stable on reload.
function distributeAnswerPositions(blocks, offset = 0) {
  let ordinal = 0;
  return (blocks || []).map((block) => ({
    ...block,
    qs: block.qs?.map((question) => {
      const options = [...question.options];
      const correct = options.splice(question.answer, 1)[0];
      const answer = (ordinal++ + offset) % (options.length + 1);
      options.splice(answer, 0, correct);
      return { ...question, options, answer };
    }),
  }));
}

const BANKS = Object.fromEntries(Object.entries(RAW_BANKS).map(([setNum, spans]) => [
  setNum,
  Object.fromEntries(Object.entries(spans).map(([span, bank], spanIndex) => [
    span,
    (() => {
      const completed = completeBlueprint(bank, span, Number(setNum));
      return completed ? {
        ...completed,
        listening: distributeAnswerPositions(completed.listening, Number(setNum) + spanIndex),
        reading: distributeAnswerPositions(completed.reading, Number(setNum) * 2 + spanIndex),
      } : completed;
    })(),
  ])),
]));

// ── Built-in scene illustrations (SVG) shown for picture-based tasks ──
function Scene({ name, displayHeight }) {
  const [expanded, setExpanded] = useState(false);
  const [fullSize, setFullSize] = useState(false);
  const sceneWide = useIsWide(700);
  const alt = sceneAlt(name);

  useEffect(() => {
    if (!expanded) return;
    const priorOverflow = document.body.style.overflow;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setExpanded(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = priorOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [expanded]);

  // Prefer a real uploaded photo if one exists for this scene.
  if (SCENE_PHOTOS[name]) {
    return (
      <div>
        <button type="button" onClick={() => {
          setFullSize(!sceneWide);
          setExpanded(true);
        }} aria-label={`Enlarge image: ${alt}`}
          style={{ display: "block", width: "100%", padding: 0, border: 0,
            borderRadius: 10, background: "transparent", cursor: "zoom-in" }}>
          <img src={SCENE_PHOTOS[name]} alt={alt} decoding="async"
            style={{ width: "100%", height: displayHeight || "auto", objectFit: displayHeight ? "cover" : undefined,
              borderRadius: 10, border: `1.5px solid ${C.line}`, display: "block" }} />
        </button>
        <button type="button" onClick={() => {
          setFullSize(!sceneWide);
          setExpanded(true);
        }} style={{ ...ghostBtn, width: "100%", marginTop: 8, marginBottom: 14,
          padding: "8px 12px", cursor: "zoom-in" }}>
          Enlarge image
        </button>
        {expanded && (
          <div role="dialog" aria-modal="true" aria-label={`Enlarged image: ${alt}`}
            onClick={() => setExpanded(false)}
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(20, 24, 20, .88)",
              padding: 14, display: "grid", placeItems: "center" }}>
            <div onClick={(event) => event.stopPropagation()}
              style={{ width: "min(1200px, 96vw)", maxHeight: "94vh", background: C.paper,
                borderRadius: 8, padding: 10, boxShadow: "0 20px 60px rgba(0,0,0,.35)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                gap: 10, padding: "2px 2px 10px" }}>
                <div style={{ fontSize: 13, color: C.mute, lineHeight: 1.35 }}>{alt}</div>
                <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                  <button type="button" onClick={() => setFullSize((value) => !value)} style={ghostBtn}>
                    {fullSize ? "Fit image" : "View full size"}
                  </button>
                  <button type="button" onClick={() => setExpanded(false)} style={smallPrimary}
                    aria-label="Close enlarged image">Close</button>
                </div>
              </div>
              <div style={{ maxHeight: "calc(94vh - 66px)", overflow: "auto", borderRadius: 6,
                background: "#fff", WebkitOverflowScrolling: "touch" }}>
                <img src={SCENE_PHOTOS[name]} alt={alt}
                  style={{ display: "block", width: fullSize ? 1000 : "100%", maxWidth: "none",
                    height: "auto", margin: fullSize ? 0 : "auto" }} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  // If this scene has a written prompt but no photo yet, show the prompt card.
  if (SCENE_PROMPTS[name]) {
    return (
      <div style={{ border: `2px dashed ${C.clay}`, borderRadius: 10, padding: "16px 16px 14px",
        background: "#fffaf6", marginBottom: 14 }}>
        <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 10.5, letterSpacing: 1.6,
          textTransform: "uppercase", color: C.clay, marginBottom: 8 }}>Picture needed — generate and send to Claude</div>
        <div style={{ fontSize: 14.5, lineHeight: 1.5, color: C.ink, marginBottom: 8 }}>
          {SCENE_PROMPTS[name]}
        </div>
        <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, color: C.mute }}>
          scene key: {name}
        </div>
      </div>
    );
  }
  const common = { width: "100%", height: 180, role: "img", "aria-label": alt,
    style: { borderRadius: 10, border: `1.5px solid ${C.line}`, background: "#fff", marginBottom: 14, display: "block" } };
  if (name === "library") {
    return (
      <svg viewBox="0 0 320 180" {...common}>
        <rect x="0" y="0" width="320" height="180" fill="#f7f5ee" />
        {/* shelves */}
        <rect x="10" y="14" width="90" height="60" fill="#e7dcc4" stroke="#c9bda0" />
        {[18,30,42,54,66].map((y,i)=><rect key={i} x="14" y={y} width="82" height="8" fill={["#c2603f","#3a6b4f","#a98b2d","#6f7a6f","#c2603f"][i]} opacity="0.8"/>)}
        {/* desk */}
        <rect x="120" y="110" width="140" height="14" fill="#b98b5e" />
        <rect x="128" y="124" width="10" height="40" fill="#9c7448" />
        <rect x="242" y="124" width="10" height="40" fill="#9c7448" />
        {/* laptop */}
        <rect x="150" y="92" width="34" height="20" rx="2" fill="#3a6b4f" />
        <rect x="146" y="112" width="42" height="4" rx="2" fill="#2c503c" />
        {/* librarian */}
        <circle cx="210" cy="86" r="10" fill="#e0b48c" />
        <rect x="200" y="96" width="20" height="26" rx="6" fill="#c2603f" />
        {/* student */}
        <circle cx="150" cy="70" r="10" fill="#d9a06b" />
        <rect x="140" y="80" width="20" height="26" rx="6" fill="#3a6b4f" />
        <text x="160" y="172" fontSize="11" fill="#6f7a6f" textAnchor="middle" fontFamily="monospace">School library — checking out a laptop</text>
      </svg>
    );
  }
  if (name === "mathclass") {
    return (
      <svg viewBox="0 0 320 180" {...common}>
        <rect x="0" y="0" width="320" height="180" fill="#f7f5ee" />
        {/* board */}
        <rect x="20" y="16" width="150" height="70" fill="#2c503c" rx="3" />
        <text x="34" y="44" fontSize="15" fill="#fff" fontFamily="monospace">2x + 3 = 11</text>
        <text x="34" y="66" fontSize="13" fill="#cfe0d3" fontFamily="monospace">x = ?</text>
        {/* teacher */}
        <circle cx="120" cy="104" r="11" fill="#e0b48c" />
        <rect x="109" y="115" width="22" height="30" rx="6" fill="#a98b2d" />
        <line x1="131" y1="120" x2="150" y2="96" stroke="#a98b2d" strokeWidth="4" strokeLinecap="round" />
        {/* student at desk */}
        <rect x="196" y="120" width="70" height="10" fill="#b98b5e" />
        <circle cx="214" cy="104" r="10" fill="#d9a06b" />
        <rect x="204" y="114" width="20" height="20" rx="5" fill="#3a6b4f" />
        <text x="160" y="172" fontSize="11" fill="#6f7a6f" textAnchor="middle" fontFamily="monospace">Math class — teacher helping a student</text>
      </svg>
    );
  }
  if (name === "linegraph") {
    // geometry enrollment: y1 90, y2 88, y3 85, y4 92, y5 98
    const pts = [[40,40],[100,46],[160,55],[220,32],[280,18]];
    const path = pts.map((p,i)=>(i?"L":"M")+p[0]+" "+p[1]).join(" ");
    return (
      <svg viewBox="0 0 320 180" {...common}>
        <rect x="0" y="0" width="320" height="180" fill="#fff" />
        {/* axes */}
        <line x1="34" y1="14" x2="34" y2="150" stroke="#6f7a6f" strokeWidth="1.5" />
        <line x1="34" y1="150" x2="300" y2="150" stroke="#6f7a6f" strokeWidth="1.5" />
        {/* gridlines + y labels */}
        {[["100",18],["90",46],["80",74],["70",102]].map(([lab,y],i)=>(
          <g key={i}><line x1="34" y1={y} x2="300" y2={y} stroke="#eee" /><text x="30" y={y+4} fontSize="9" fill="#6f7a6f" textAnchor="end" fontFamily="monospace">{lab}</text></g>
        ))}
        {/* x labels */}
        {["Y1","Y2","Y3","Y4","Y5"].map((lab,i)=><text key={i} x={40+i*60} y="164" fontSize="10" fill="#6f7a6f" textAnchor="middle" fontFamily="monospace">{lab}</text>)}
        <path d={path} fill="none" stroke="#c2603f" strokeWidth="2.5" />
        {pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill="#3a6b4f" />)}
        <text x="167" y="12" fontSize="10" fill="#14201c" textAnchor="middle" fontFamily="monospace">Geometry enrollment by year</text>
      </svg>
    );
  }
  if (name === "map") {
    return (
      <svg viewBox="0 0 320 180" {...common}>
        <rect x="0" y="0" width="320" height="180" fill="#f7f5ee" />
        <rect x="70" y="14" width="180" height="100" fill="#dfe9df" stroke="#3a6b4f" strokeWidth="2" rx="4" />
        <path d="M90 90 Q130 40 170 70 T240 44" fill="none" stroke="#3a6b4f" strokeWidth="2.5" />
        <circle cx="120" cy="62" r="5" fill="#c2603f" />
        <circle cx="205" cy="52" r="5" fill="#a98b2d" />
        <circle cx="60" cy="140" r="10" fill="#e0b48c" />
        <rect x="50" y="150" width="20" height="24" rx="6" fill="#3a6b4f" />
        <circle cx="150" cy="140" r="10" fill="#d9a06b" />
        <rect x="140" y="150" width="20" height="24" rx="6" fill="#c2603f" />
        <line x1="160" y1="152" x2="185" y2="105" stroke="#c2603f" strokeWidth="4" strokeLinecap="round" />
        <circle cx="240" cy="140" r="10" fill="#e0b48c" />
        <rect x="230" y="150" width="20" height="24" rx="6" fill="#a98b2d" />
        <text x="160" y="176" fontSize="11" fill="#6f7a6f" textAnchor="middle" fontFamily="monospace">Students looking at a map — one boy points</text>
      </svg>
    );
  }
  if (name === "sciencefair") {
    return (
      <svg viewBox="0 0 320 180" {...common}>
        <rect x="0" y="0" width="320" height="180" fill="#f7f5ee" />
        <rect x="16" y="96" width="90" height="10" fill="#b98b5e" />
        <rect x="120" y="96" width="90" height="10" fill="#b98b5e" />
        <rect x="224" y="96" width="80" height="10" fill="#b98b5e" />
        <rect x="26" y="52" width="70" height="44" fill="#fff" stroke="#d9d4c4" />
        <path d="M40 88 L60 62 L80 88 Z" fill="#c2603f" opacity="0.85" />
        <rect x="130" y="52" width="70" height="44" fill="#fff" stroke="#d9d4c4" />
        <circle cx="165" cy="72" r="14" fill="#3a6b4f" opacity="0.8" />
        <rect x="232" y="52" width="64" height="44" fill="#fff" stroke="#d9d4c4" />
        <rect x="244" y="62" width="10" height="26" fill="#a98b2d" />
        <rect x="258" y="70" width="10" height="18" fill="#a98b2d" />
        <rect x="272" y="58" width="10" height="30" fill="#a98b2d" />
        <circle cx="60" cy="130" r="10" fill="#d9a06b" />
        <rect x="50" y="140" width="20" height="26" rx="6" fill="#3a6b4f" />
        <circle cx="165" cy="130" r="10" fill="#e0b48c" />
        <rect x="155" y="140" width="20" height="26" rx="6" fill="#c2603f" />
        <circle cx="262" cy="130" r="10" fill="#e0b48c" />
        <rect x="252" y="140" width="20" height="26" rx="6" fill="#6f7a6f" />
        <rect x="246" y="146" width="32" height="10" rx="2" fill="#fff" stroke="#6f7a6f" />
        <text x="160" y="176" fontSize="11" fill="#6f7a6f" textAnchor="middle" fontFamily="monospace">Science fair — projects and a judge with a clipboard</text>
      </svg>
    );
  }
  if (name === "barclubs") {
    const bars = [["Art", 62, "#c2603f"], ["Robotics", 34, "#3a6b4f"], ["Chess", 84, "#a98b2d"], ["Drama", 70, "#6f7a6f"]];
    return (
      <svg viewBox="0 0 320 180" {...common}>
        <rect x="0" y="0" width="320" height="180" fill="#fff" />
        <line x1="40" y1="14" x2="40" y2="146" stroke="#6f7a6f" strokeWidth="1.5" />
        <line x1="40" y1="146" x2="300" y2="146" stroke="#6f7a6f" strokeWidth="1.5" />
        {[["40", 26], ["30", 56], ["20", 86], ["10", 116]].map(([lab, y], i) => (
          <g key={i}><line x1="40" y1={y} x2="300" y2={y} stroke="#eee" /><text x="36" y={y + 4} fontSize="9" fill="#6f7a6f" textAnchor="end" fontFamily="monospace">{lab}</text></g>
        ))}
        {bars.map(([lab, h, col], i) => (
          <g key={i}>
            <rect x={58 + i * 62} y={146 - h} width="36" height={h} fill={col} opacity="0.85" />
            <text x={76 + i * 62} y="160" fontSize="10" fill="#6f7a6f" textAnchor="middle" fontFamily="monospace">{lab}</text>
          </g>
        ))}
        <text x="170" y="12" fontSize="10" fill="#14201c" textAnchor="middle" fontFamily="monospace">After-school club membership</text>
      </svg>
    );
  }
  if (name === "s1-68-graph-travel") {
    const bars = [["Bus", 96, "#3a6b4f"], ["Car", 70, "#c2603f"], ["Walk", 52, "#a98b2d"], ["Bike", 24, "#6f7a6f"]];
    return (
      <svg viewBox="0 0 320 180" {...common}>
        <rect x="0" y="0" width="320" height="180" fill="#fff" />
        <line x1="40" y1="14" x2="40" y2="146" stroke="#6f7a6f" strokeWidth="1.5" />
        <line x1="40" y1="146" x2="300" y2="146" stroke="#6f7a6f" strokeWidth="1.5" />
        {[["120",26],["90",56],["60",86],["30",116]].map(([lab,y],i)=>(
          <g key={i}><line x1="40" y1={y} x2="300" y2={y} stroke="#eee" /><text x="36" y={y+4} fontSize="9" fill="#6f7a6f" textAnchor="end" fontFamily="monospace">{lab}</text></g>
        ))}
        {bars.map(([lab,h,col],i)=>(
          <g key={i}>
            <rect x={58+i*62} y={146-h} width="36" height={h} fill={col} opacity="0.85" />
            <text x={76+i*62} y="160" fontSize="10" fill="#6f7a6f" textAnchor="middle" fontFamily="monospace">{lab}</text>
          </g>
        ))}
        <text x="170" y="12" fontSize="10" fill="#14201c" textAnchor="middle" fontFamily="monospace">How students travel to school</text>
      </svg>
    );
  }
  if (name === "s2-68-graph-clubs") {
    const bars = [["Art", 58, "#c2603f"], ["Robotics", 40, "#3a6b4f"], ["Chess", 88, "#a98b2d"], ["Drama", 72, "#6f7a6f"]];
    return (
      <svg viewBox="0 0 320 180" {...common}>
        <rect x="0" y="0" width="320" height="180" fill="#fff" />
        <line x1="40" y1="14" x2="40" y2="146" stroke="#6f7a6f" strokeWidth="1.5" />
        <line x1="40" y1="146" x2="300" y2="146" stroke="#6f7a6f" strokeWidth="1.5" />
        {[["40",26],["30",56],["20",86],["10",116]].map(([lab,y],i)=>(
          <g key={i}><line x1="40" y1={y} x2="300" y2={y} stroke="#eee" /><text x="36" y={y+4} fontSize="9" fill="#6f7a6f" textAnchor="end" fontFamily="monospace">{lab}</text></g>
        ))}
        {bars.map(([lab,h,col],i)=>(
          <g key={i}>
            <rect x={58+i*62} y={146-h} width="36" height={h} fill={col} opacity="0.85" />
            <text x={76+i*62} y="160" fontSize="10" fill="#6f7a6f" textAnchor="middle" fontFamily="monospace">{lab}</text>
          </g>
        ))}
        <text x="170" y="12" fontSize="10" fill="#14201c" textAnchor="middle" fontFamily="monospace">After-school club membership</text>
      </svg>
    );
  }
  if (name === "s3-68-graph-reading") {
    const pts = [[45,110],[95,86],[145,94],[195,54],[245,40],[290,62]];
    const path = pts.map((pt,i)=>(i?"L":"M")+pt[0]+" "+pt[1]).join(" ");
    return (
      <svg viewBox="0 0 320 180" {...common}>
        <rect x="0" y="0" width="320" height="180" fill="#fff" />
        <line x1="34" y1="14" x2="34" y2="150" stroke="#6f7a6f" strokeWidth="1.5" />
        <line x1="34" y1="150" x2="305" y2="150" stroke="#6f7a6f" strokeWidth="1.5" />
        {[["150",26],["120",56],["90",86],["60",116]].map(([lab,y],i)=>(
          <g key={i}><line x1="34" y1={y} x2="305" y2={y} stroke="#eee" /><text x="30" y={y+4} fontSize="9" fill="#6f7a6f" textAnchor="end" fontFamily="monospace">{lab}</text></g>
        ))}
        {["Sep","Oct","Nov","Dec","Jan","Feb"].map((lab,i)=>(
          <text key={i} x={45+i*49} y="164" fontSize="9.5" fill="#6f7a6f" textAnchor="middle" fontFamily="monospace">{lab}</text>
        ))}
        <path d={path} fill="none" stroke="#c2603f" strokeWidth="2.5" />
        {pts.map((pt,i)=><circle key={i} cx={pt[0]} cy={pt[1]} r="3.5" fill="#3a6b4f" />)}
        <text x="170" y="12" fontSize="10" fill="#14201c" textAnchor="middle" fontFamily="monospace">Average reading minutes per week</text>
      </svg>
    );
  }
  return null;
}

// ════════════════════════════════════════════════════════════════
//  UI
// ════════════════════════════════════════════════════════════════

const C = {
  ink:"#14201c", paper:"#f3f0e7", card:"#fbfaf5", moss:"#3a6b4f",
  mossSoft:"#dfe9df", clay:"#c2603f", claySoft:"#f0ddd2", line:"#d9d4c4",
  mute:"#6f7a6f", gold:"#a98b2d", goldSoft:"#ece3c8",
};

const SPANS = [
  { id:"k", label:"Kindergarten" },
  { id:"g1", label:"Grade One" },
  { id:"g2", label:"Grade Two" },
  { id:"g35", label:"Grades 3–5" },
  { id:"g68", label:"Grades 6–8" },
  { id:"g910", label:"Grades 9–10" },
  { id:"g1112", label:"Grades 11–12" },
];

const DOMAINS = [
  { id:"listening", label:"Listening" },
  { id:"speaking", label:"Speaking" },
  { id:"reading", label:"Reading" },
  { id:"writing", label:"Writing" },
];

const SETS = [ {id:1, live:true}, {id:2, live:true}, {id:3, live:true} ];

// ══════════ PERSISTENT STORAGE LAYER ══════════
// Website storage: progress is retained in this browser on this device. IndexedDB
// gives recordings and long practice histories far more room than localStorage.
// Existing localStorage profiles are migrated on first read and remain compatible.
const STORAGE_DB_NAME = "elpac-practice";
const STORAGE_STORE_NAME = "practice-data";
let practiceDBPromise = null;
const pendingStoreWrites = new Map();
let storageWarningSent = false;

function notifyStorageError() {
  if (typeof window === "undefined" || storageWarningSent) return;
  storageWarningSent = true;
  window.dispatchEvent(new CustomEvent("elpac-storage-error"));
}

function openPracticeDB() {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.reject(new Error("IndexedDB unavailable"));
  }
  if (!practiceDBPromise) {
    practiceDBPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(STORAGE_DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORAGE_STORE_NAME)) {
          db.createObjectStore(STORAGE_STORE_NAME);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open practice storage"));
      request.onblocked = () => reject(new Error("Practice storage is blocked"));
    });
  }
  return practiceDBPromise;
}

async function idbRead(key) {
  const db = await openPracticeDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORAGE_STORE_NAME, "readonly")
      .objectStore(STORAGE_STORE_NAME).get(key);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
}

async function idbWrite(key, value) {
  const db = await openPracticeDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORAGE_STORE_NAME, "readwrite")
      .objectStore(STORAGE_STORE_NAME).put(value, key);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

async function idbRemove(key) {
  const db = await openPracticeDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORAGE_STORE_NAME, "readwrite")
      .objectStore(STORAGE_STORE_NAME).delete(key);
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

async function idbKeys() {
  const db = await openPracticeDB();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORAGE_STORE_NAME, "readonly")
      .objectStore(STORAGE_STORE_NAME).getAllKeys();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

async function storeGet(key) {
  if (typeof window === "undefined") return null;
  try {
    const value = await idbRead(key);
    if (value !== null) return value;
  } catch {}
  try {
    const legacy = window.localStorage.getItem(key);
    if (legacy !== null) {
      try {
        await idbWrite(key, legacy);
        window.localStorage.removeItem(key);
      } catch {}
    }
    return legacy;
  } catch { return null; }
}

async function writeStoredValue(key, value) {
  try {
    await idbWrite(key, value);
    try { window.localStorage.removeItem(key); } catch {}
    return true;
  } catch {}
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    notifyStorageError();
    return false;
  }
}

async function storeSet(key, value) {
  if (typeof window === "undefined") return false;
  const previous = pendingStoreWrites.get(key) || Promise.resolve();
  const next = previous.catch(() => {}).then(() => writeStoredValue(key, value));
  pendingStoreWrites.set(key, next);
  const saved = await next;
  if (pendingStoreWrites.get(key) === next) pendingStoreWrites.delete(key);
  return saved;
}

async function storeRemove(key) {
  if (typeof window === "undefined") return;
  const pending = pendingStoreWrites.get(key);
  if (pending) {
    try { await pending; } catch {}
  }
  try { await idbRemove(key); } catch {}
  try { window.localStorage.removeItem(key); } catch {}
}

async function storeList(prefix) {
  if (typeof window === "undefined") return [];
  const keys = new Set();
  try { (await idbKeys()).forEach((key) => keys.add(String(key))); } catch {}
  try {
    Array.from({ length: window.localStorage.length }, (_, index) =>
      window.localStorage.key(index)
    ).forEach((key) => key && keys.add(key));
  } catch {}
  return Array.from(keys).filter((key) => key.startsWith(prefix));
}

const progressKey = (id, span, setNum, domain) =>
  "progress:" + id + ":" + span + ":" + setNum + ":" + domain;
const slug = (name) => name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const userKey = (id) => `user:${id}`;
const attemptKey = (id, ts) => `attempt:${id}:${ts}`;

// ══════════ TEXT-TO-SPEECH (browser speech synthesis) ══════════
const ttsAvailable = typeof window !== "undefined" && "speechSynthesis" in window;
// Windows/Chrome load voices asynchronously; nudge them to populate early so
// pickVoice() sees the natural voices on the first play.
if (ttsAvailable) {
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };
  } catch {}
}
// Pick the best available voice: prefer Windows/Chrome "natural" or "neural"
// voices by name, then any en-US, then any English. Falls back to default.
function pickVoice() {
  const vs = (window.speechSynthesis.getVoices() || []).filter((v) => /^en/i.test(v.lang));
  if (!vs.length) return null;
  const NICE = /natural|neural|online|aria|jenny|guy|michelle|ana|christopher|eric|steffan|roger|libby|sonia|google us english/i;
  const enUS = vs.filter((v) => /en[-_]US/i.test(v.lang));
  const pool = enUS.length ? enUS : vs;
  return pool.find((v) => NICE.test(v.name)) || pool[0];
}

function speak(text, { onEnd, onStart } = {}) {
  if (!ttsAvailable) { onEnd && onEnd(); return null; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/\n+/g, ". "));
  u.rate = 0.92; u.pitch = 1;
  const v = pickVoice();
  if (v) u.voice = v;
  if (onStart) u.onstart = onStart;
  if (onEnd) { u.onend = onEnd; u.onerror = onEnd; }
  window.speechSynthesis.speak(u);
  return u;
}
function stopSpeaking() { if (ttsAvailable) window.speechSynthesis.cancel(); }

// ══════════ REAL AUDIO CLIPS (filled in after batch generation) ══════════
// Keyed by  s{set}-{span}-{topic-slug}  — matching generate_audio.js output.
// When a clip exists here it is used; otherwise the app falls back to the
// browser's speech synthesis so listening always works.
const AUDIO = {
  "s1-g35-denali": "/elpac/media/s1-g35-denali.mp3",
  "s1-g35-elephant-tools": "/elpac/media/s1-g35-elephant-tools.mp3",
  "s1-g35-join-computer-club": "/elpac/media/s1-g35-join-computer-club.mp3",
  "s1-g35-read-new-book": "/elpac/media/s1-g35-read-new-book.mp3",
  "s1-g35-riding-rides": "/elpac/media/s1-g35-riding-rides.mp3",
  "s1-g35-rode-bikes-and-rained": "/elpac/media/s1-g35-rode-bikes-and-rained.mp3",
  "s1-g35-showed-computer-game": "/elpac/media/s1-g35-showed-computer-game.mp3",
  "s1-g35-tv-show-ends": "/elpac/media/s1-g35-tv-show-ends.mp3",
  "s1-g35-watermills": "/elpac/media/s1-g35-watermills.mp3",
  "s1-g68-cafe-food-and-food-safety": "/elpac/media/s1-g68-cafe-food-and-food-safety.mp3",
  "s1-g68-exploration-and-sea-travel": "/elpac/media/s1-g68-exploration-and-sea-travel.mp3",
  "s1-g68-fraction-homework": "/elpac/media/s1-g68-fraction-homework.mp3",
  "s1-g68-history-project": "/elpac/media/s1-g68-history-project.mp3",
  "s1-g68-soccer-practice": "/elpac/media/s1-g68-soccer-practice.mp3",
  "s1-g68-study-group": "/elpac/media/s1-g68-study-group.mp3",
  "s1-g68-the-do-it-yourself-movement": "/elpac/media/s1-g68-the-do-it-yourself-movement.mp3",
  "s1-g68-the-erie-canal": "/elpac/media/s1-g68-the-erie-canal.mp3",
  "s2-g35-class-garden-job": "/elpac/media/s2-g35-class-garden-job.mp3",
  "s2-g35-desert-animals": "/elpac/media/s2-g35-desert-animals.mp3",
  "s2-g35-forgot-lunch": "/elpac/media/s2-g35-forgot-lunch.mp3",
  "s2-g35-grandma-s-song": "/elpac/media/s2-g35-grandma-s-song.mp3",
  "s2-g35-honeybee-hives": "/elpac/media/s2-g35-honeybee-hives.mp3",
  "s2-g35-lost-library-book": "/elpac/media/s2-g35-lost-library-book.mp3",
  "s2-g35-new-shoes": "/elpac/media/s2-g35-new-shoes.mp3",
  "s2-g35-the-broken-swing": "/elpac/media/s2-g35-the-broken-swing.mp3",
  "s2-g35-the-water-cycle": "/elpac/media/s2-g35-the-water-cycle.mp3",
  "s2-g68-group-presentation": "/elpac/media/s2-g68-group-presentation.mp3",
  "s2-g68-how-vaccines-work": "/elpac/media/s2-g68-how-vaccines-work.mp3",
  "s2-g68-lab-safety-rules": "/elpac/media/s2-g68-lab-safety-rules.mp3",
  "s2-g68-locker-jam": "/elpac/media/s2-g68-locker-jam.mp3",
  "s2-g68-sleep-and-memory": "/elpac/media/s2-g68-sleep-and-memory.mp3",
  "s2-g68-the-silk-road": "/elpac/media/s2-g68-the-silk-road.mp3",
  "s2-g68-track-tryouts": "/elpac/media/s2-g68-track-tryouts.mp3",
  "s2-g68-urban-heat-islands": "/elpac/media/s2-g68-urban-heat-islands.mp3",
  "s3-g35-bridges-of-ice": "/elpac/media/s3-g35-bridges-of-ice.mp3",
  "s3-g35-field-trip-money": "/elpac/media/s3-g35-field-trip-money.mp3",
  "s3-g35-fixing-a-bike": "/elpac/media/s3-g35-fixing-a-bike.mp3",
  "s3-g35-loud-hallway": "/elpac/media/s3-g35-loud-hallway.mp3",
  "s3-g35-reading-buddy-program": "/elpac/media/s3-g35-reading-buddy-program.mp3",
  "s3-g35-the-missing-puzzle-piece": "/elpac/media/s3-g35-the-missing-puzzle-piece.mp3",
  "s3-g35-the-rainy-parade": "/elpac/media/s3-g35-the-rainy-parade.mp3",
  "s3-g35-volcanoes": "/elpac/media/s3-g35-volcanoes.mp3",
  "s3-g35-why-we-sleep": "/elpac/media/s3-g35-why-we-sleep.mp3",
  "s3-g68-antibiotic-resistance": "/elpac/media/s3-g68-antibiotic-resistance.mp3",
  "s3-g68-borrowed-calculator": "/elpac/media/s3-g68-borrowed-calculator.mp3",
  "s3-g68-late-bus": "/elpac/media/s3-g68-late-bus.mp3",
  "s3-g68-research-sources": "/elpac/media/s3-g68-research-sources.mp3",
  "s3-g68-science-fair-topic": "/elpac/media/s3-g68-science-fair-topic.mp3",
  "s3-g68-supply-and-demand": "/elpac/media/s3-g68-supply-and-demand.mp3",
  "s3-g68-the-northern-lights": "/elpac/media/s3-g68-the-northern-lights.mp3",
  "s3-g68-the-transcontinental-railroad": "/elpac/media/s3-g68-the-transcontinental-railroad.mp3",
};

const topicSlug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function audioKeyFor(setNum, span, topic) { return `s${setNum}-${span}-${topicSlug(topic)}`; }

// Play a listening item: real clip if we have one, else spoken text.
// Returns a stop() function. Calls onEnd when playback finishes.
function playListening({ setNum, span, topic, transcript }, { onEnd } = {}) {
  const clip = AUDIO[audioKeyFor(setNum, span, topic)];
  if (clip) {
    stopSpeaking();
    const el = new Audio(clip);
    el.onended = () => onEnd && onEnd();
    el.onerror = () => { // fall back to TTS if the clip fails to load
      speak(transcript, { onEnd });
    };
    el.play().catch(() => speak(transcript, { onEnd }));
    return () => { el.pause(); el.currentTime = 0; };
  }
  speak(transcript, { onEnd });
  return () => stopSpeaking();
}

// ══════════ SIGN-IN SCREEN ══════════
function SignIn({ onSignedIn }) {
  const [name, setName] = useState("");
  const [recent, setRecent] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const keys = await storeList("user:");
      const users = [];
      for (const k of keys) {
        const raw = await storeGet(k);
        if (raw) { try { users.push(JSON.parse(raw)); } catch {} }
      }
      users.sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0));
      setRecent(users.slice(0, 6));
    })();
  }, []);

  async function enter(displayName) {
    const clean = displayName.trim();
    if (!clean) return;
    setBusy(true);
    const id = slug(clean);
    const existing = await storeGet(userKey(id));
    let profile;
    if (existing) { profile = JSON.parse(existing); profile.lastSeen = Date.now(); }
    else { profile = { id, name: clean, created: Date.now(), lastSeen: Date.now() }; }
    await storeSet(userKey(id), JSON.stringify(profile));
    setBusy(false);
    onSignedIn(profile);
  }

  return (
    <div style={{ maxWidth: 460, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, textTransform: "uppercase", color: C.moss,
          fontFamily: "ui-monospace, monospace" }}>ELPAC-aligned practice</div>
        <div style={{ fontSize: 27, fontWeight: 700, marginTop: 4 }}>The Practice Hub</div>
      </div>
      <div style={{ ...examPane, padding: "22px 20px" }}>
        <div style={paneLabel}>Sign in to save your progress</div>
        <p style={{ fontSize: 13.5, color: C.mute, lineHeight: 1.5, margin: "0 0 14px" }}>
          Enter your name to start. Your completed tests, answers, and mistakes are saved
          under this name so you can track your progress over time.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enter(name)}
            placeholder="Your name" style={{ ...textInput, flex: 1 }} autoFocus />
          <button onClick={() => enter(name)} disabled={!name.trim() || busy}
            style={{ ...smallPrimary, opacity: name.trim() && !busy ? 1 : 0.4 }}>
            {busy ? "…" : "Enter"}
          </button>
        </div>
        {recent.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 10.5, letterSpacing: 1.4,
              textTransform: "uppercase", color: C.mute, marginBottom: 8 }}>Recent</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {recent.map((u) => (
                <button key={u.id} onClick={() => enter(u.name)} style={{ ...ghostBtn, padding: "6px 12px" }}>
                  {u.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <p style={{ fontSize: 11.5, color: C.mute, lineHeight: 1.45, margin: "16px 0 0",
          fontStyle: "italic" }}>
          This is a name-based profile for tracking practice — not a secure login.
          Anyone using this device can open any profile. Names, answers, and recordings are
          saved only in this browser and are never uploaded. Clearing browser data removes them.
        </p>
      </div>
    </div>
  );
}

function ReadinessCheck({ domain, onReady, onBack }) {
  const needsMicrophone = domain === "speaking";
  const [soundState, setSoundState] = useState("idle");
  const [heardSound, setHeardSound] = useState(false);
  const [recordState, setRecordState] = useState("idle");
  const [recordingURL, setRecordingURL] = useState(null);
  const [microphoneError, setMicrophoneError] = useState("");
  const [skipMicrophone, setSkipMicrophone] = useState(false);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => () => {
    stopSpeaking();
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
    if (recordingURL) URL.revokeObjectURL(recordingURL);
  }, [recordingURL]);

  function playSoundCheck() {
    setHeardSound(false);
    setSoundState("playing");
    speak("This is the sound check. If you can hear this message, your sound is ready.", {
      onEnd: () => setSoundState("played"),
    });
  }

  async function startMicrophoneCheck() {
    setMicrophoneError("");
    setSkipMicrophone(false);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setMicrophoneError("Recording is not supported in this browser. You may continue and practice aloud.");
      return;
    }
    try {
      if (recordingURL) {
        URL.revokeObjectURL(recordingURL);
        setRecordingURL(null);
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setRecordingURL(URL.createObjectURL(blob));
        setRecordState("done");
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };
      recorder.start();
      setRecordState("recording");
    } catch {
      setRecordState("idle");
      setMicrophoneError(
        "Microphone access was blocked. Allow it in the browser address bar, then try again."
      );
    }
  }

  function stopMicrophoneCheck() {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
  }

  const microphoneReady = !needsMicrophone || recordState === "done" || skipMicrophone;
  const ready = heardSound && microphoneReady;

  return (
    <div>
      <Back onClick={onBack} label="practice sets" />
      <h2 style={{ fontSize: 22, margin: "0 0 6px" }}>
        {needsMicrophone ? "Check sound and microphone" : "Check your sound"}
      </h2>
      <p style={{ fontSize: 14.5, color: C.mute, marginTop: 0, marginBottom: 16,
        lineHeight: 1.55 }}>
        Complete this quick check before the section begins. It is not part of your practice history.
      </p>

      <div style={{ ...examPane, marginBottom: 12 }}>
        <div style={paneLabel}>1 · Sound</div>
        <p style={{ fontSize: 14, color: C.ink, margin: "0 0 12px", lineHeight: 1.5 }}>
          Turn up your volume or put on headphones, then play the test message.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" onClick={playSoundCheck} disabled={soundState === "playing"}
            style={{ ...smallPrimary, opacity: soundState === "playing" ? 0.6 : 1 }}>
            {soundState === "playing" ? "Playing…" : soundState === "played" ? "Play again" : "Play test sound"}
          </button>
          {soundState === "played" && !heardSound && (
            <button type="button" onClick={() => setHeardSound(true)} style={ghostBtn}>
              I heard it
            </button>
          )}
          {heardSound && <span style={{ color: C.moss, fontSize: 13.5, fontWeight: 700 }}>Sound ready</span>}
        </div>
      </div>

      {needsMicrophone && (
        <div style={{ ...examPane, marginBottom: 12, opacity: heardSound ? 1 : 0.55 }}>
          <div style={paneLabel}>2 · Microphone</div>
          <p style={{ fontSize: 14, color: C.ink, margin: "0 0 12px", lineHeight: 1.5 }}>
            Record yourself saying, “My microphone is working,” then play it back.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {recordState === "recording" ? (
              <button type="button" onClick={stopMicrophoneCheck} style={{ ...smallPrimary, background: C.clay }}>
                Stop recording
              </button>
            ) : (
              <button type="button" onClick={startMicrophoneCheck} disabled={!heardSound}
                style={{ ...smallPrimary, opacity: heardSound ? 1 : 0.45 }}>
                {recordState === "done" ? "Re-record" : "Record sample"}
              </button>
            )}
            {recordState === "recording" && (
              <span style={{ color: C.clay, fontSize: 13.5, fontWeight: 700 }}>Recording…</span>
            )}
          </div>
          {recordingURL && (
            <audio controls src={recordingURL} style={{ width: "100%", marginTop: 12 }} />
          )}
          {microphoneError && (
            <div style={{ marginTop: 10 }}>
              <Note text={microphoneError} tone="clay" />
              <button type="button" onClick={() => setSkipMicrophone(true)}
                style={{ ...ghostBtn, marginTop: 9 }}>
                Continue without microphone
              </button>
            </div>
          )}
          {skipMicrophone && (
            <div style={{ color: C.mute, fontSize: 12.5, marginTop: 9 }}>
              You can continue, but speaking responses may not be recorded.
            </div>
          )}
        </div>
      )}

      <button type="button" onClick={onReady} disabled={!ready}
        style={{ ...primaryBtn, width: "100%", opacity: ready ? 1 : 0.45,
          cursor: ready ? "pointer" : "default" }}>
        Begin {needsMicrophone ? "speaking" : "listening"} section
      </button>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [span, setSpan] = useState(null);
  const [setNum, setSetNum] = useState(null);
  const [domain, setDomain] = useState(null);
  const [resume, setResume] = useState(null);
  const [readinessComplete, setReadinessComplete] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [storageWarning, setStorageWarning] = useState(false);

  useEffect(() => {
    const showWarning = () => setStorageWarning(true);
    window.addEventListener("elpac-storage-error", showWarning);
    return () => window.removeEventListener("elpac-storage-error", showWarning);
  }, []);

  const reset = () => {
    setSpan(null); setSetNum(null); setDomain(null); setResume(null);
    setReadinessComplete(false); setActivePanel(null);
  };
  const spanObj = SPANS.find((s) => s.id === span);

  // Persist one completed domain attempt to the signed-in user's history.
  async function saveAttempt(dom, payload) {
    if (!user) return false;
    const ts = Date.now();
    const record = {
      ts, user: user.id, span, spanLabel: spanObj?.label, setNum, domain: dom,
      correct: payload.correct ?? null, total: payload.total ?? null,
      items: payload.items || null,          // per-question detail for reading/listening
    };
    const saved = await storeSet(attemptKey(user.id, ts), JSON.stringify(record));
    if (!saved) return false;
    await storeRemove(progressKey(user.id, span, setNum, dom));
    return true;
  }

  if (!user) {
    return (
      <div style={{ background:C.paper, minHeight:"100dvh", color:C.ink, fontFamily:"Georgia, serif" }}>
        <div style={{ width:"100%", maxWidth:1200, boxSizing:"border-box",
          margin:"0 auto", padding:"40px 22px 70px" }}>
          <SignIn onSignedIn={setUser} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ background:C.paper, minHeight:"100dvh", color:C.ink, fontFamily:"Georgia, serif" }}>
      <style>{`@keyframes eq { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }`}</style>
      <div style={{ width:"100%", maxWidth:1200, boxSizing:"border-box",
        margin:"0 auto", padding:"24px 22px 70px" }}>
        <TopBar user={user} onHome={reset} activePanel={activePanel}
          onVocabulary={() => { reset(); setActivePanel("vocabulary"); }}
          onProgress={() => { reset(); setActivePanel("progress"); }}
          onSignOut={() => { reset(); setUser(null); }} />
        {storageWarning && (
          <div role="alert" style={{ ...examPane, borderColor: C.clay, background: C.claySoft,
            color: C.ink, marginBottom: 14, display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", gap: 12 }}>
            <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              <b>Progress is not being saved.</b> This browser has blocked or filled its storage.
              Keep this page open, or free browser storage before continuing.
            </div>
            <button type="button" onClick={() => setStorageWarning(false)} style={ghostBtn}
              aria-label="Dismiss storage warning">Dismiss</button>
          </div>
        )}
        {activePanel === "vocabulary" ? <VocabularyPanel user={user} onBack={reset} />
        : activePanel === "progress" ? <MePanel user={user} onBack={reset} />
        : !span ? <SpanPick onPick={(id) => {
            if (SETS.some((set) => !!BANKS[set.id]?.[id])) setSpan(id);
          }} />
        : !domain ? <DomainPick spanLabel={spanObj.label} onBack={reset}
            onPick={(nextDomain) => { setDomain(nextDomain); setResume(null); }} />
        : !setNum ? <SetPick spanLabel={spanObj.label} domain={domain} onBack={() => setDomain(null)}
            user={user} span={span}
            onPick={(nextSet, nextResume) => {
              setResume(nextResume || null);
              setReadinessComplete(!!nextResume);
              setSetNum(nextSet);
            }} />
        : (domain === "listening" || domain === "speaking") && !resume && !readinessComplete
          ? <ReadinessCheck domain={domain}
              onBack={() => { setSetNum(null); setReadinessComplete(false); }}
              onReady={() => setReadinessComplete(true)} />
        : <DomainRunner key={`${domain}-${setNum}`} blocks={BANKS[setNum][span][domain]} domain={domain}
            user={user} setNum={setNum} span={span} resume={resume}
            onExit={() => { setSetNum(null); setResume(null); setReadinessComplete(false); }}
            onFinish={async (r) => {
              const saved = await saveAttempt(domain, r);
              if (!saved) return false;
              setSetNum(null); setResume(null); setReadinessComplete(false);
              return true;
            }} />}
      </div>
    </div>
  );
}

function TopBar({ user, onHome, activePanel, onVocabulary, onProgress, onSignOut }) {
  return (
    <header style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
      gap:12, flexWrap:"wrap", borderBottom:`2px solid ${C.ink}`, paddingBottom:14, marginBottom:18 }}>
      <button onClick={onHome} style={{ background:"none", border:"none", cursor:"pointer",
        textAlign:"left", padding:0, fontFamily:"inherit" }}>
        <div style={{ fontSize:12, letterSpacing:3, textTransform:"uppercase", color:C.moss,
          fontFamily:"ui-monospace, monospace" }}>ELPAC-aligned practice</div>
        <div style={{ fontSize:24, fontWeight:700, marginTop:2, color:C.ink }}>The Practice Hub</div>
      </button>
      <nav aria-label="Student tools" style={{ display:"flex", alignItems:"center", gap:8,
        flexWrap:"wrap", marginLeft:"auto", justifyContent:"flex-end" }}>
        <button onClick={onVocabulary} aria-current={activePanel === "vocabulary" ? "page" : undefined}
          style={{ ...ghostBtn, padding:"5px 11px", fontSize:11,
            color:activePanel === "vocabulary" ? "#fff" : C.mute,
            background:activePanel === "vocabulary" ? C.moss : "transparent",
            borderColor:activePanel === "vocabulary" ? C.moss : C.line }}>
          vocabulary
        </button>
        <button onClick={onProgress} aria-current={activePanel === "progress" ? "page" : undefined}
          style={{ ...ghostBtn, padding:"5px 11px", fontSize:11,
            color:activePanel === "progress" ? "#fff" : C.mute,
            background:activePanel === "progress" ? C.moss : "transparent",
            borderColor:activePanel === "progress" ? C.moss : C.line }}>
          progress
        </button>
        <button onClick={onSignOut} style={{ ...ghostBtn, padding:"5px 11px", fontSize:11,
          fontFamily:"ui-monospace, monospace" }}>sign out</button>
        <button onClick={onProgress} style={meBtn} title={`${user.name} — open progress`}>
          <span style={{ width:26, height:26, borderRadius:99, background:C.mossSoft, color:C.moss,
            display:"grid", placeItems:"center", fontSize:12, fontWeight:700,
            fontFamily:"ui-monospace, monospace" }}>
            {user.name.slice(0,2).toLowerCase()}
          </span>
        </button>
      </nav>
    </header>
  );
}

const READING_SET_2_ADVANCED_VOCAB = [
  ["photosynthesis", "The process plants use to make food from light, water, and carbon dioxide."],
  ["chlorophyll", "The green pigment in plants that absorbs light."],
  ["glucose", "A simple sugar that plants make and use for energy."],
  ["carbon dioxide", "A gas used by plants during photosynthesis."],
  ["literacy", "The ability to read and write."],
  ["permit", "An official document that gives permission."],
  ["application", "A formal request for something, often made in writing."],
  ["tutoring", "Extra instruction given to help someone learn."],
  ["margin", "The blank space around the edge of a page."],
  ["intensely", "With great focus, strength, or effort."],
  ["argument", "A claim supported by reasons and evidence."],
  ["benefit", "A helpful result or advantage."],
];

const READING_SET_3_ADVANCED_VOCAB = [
  ["globalization", "The growing connection of people, trade, and ideas around the world."],
  ["merchant", "A person who buys and sells goods."],
  ["gunpowder", "An explosive powder historically used in weapons and fireworks."],
  ["pigment", "A substance that gives color to something."],
  ["recycling", "Processing used materials so they can be used again."],
  ["fountain", "A device or structure that supplies or sprays water."],
  ["physics", "The study of matter, energy, motion, and forces."],
  ["disease", "An illness that affects a person, animal, or plant."],
  ["route", "A path used to travel from one place to another."],
  ["assigned", "Given as a task or responsibility."],
  ["overflow", "To spill over the edge because something is too full."],
  ["visible", "Able to be seen."],
];

const READING_VOCAB = {
  g35: {
    1: [
      ["astronaut", "A person trained to travel and work in space."],
      ["engineering", "Using science and math to design or build things."],
      ["bacteria", "Very small living organisms; some can cause illness."],
      ["shelter", "A place that protects people or animals."],
      ["adopted", "Took an animal or child into a new home or family."],
      ["optional", "Available by choice; not required."],
      ["overlap", "To partly cover or happen at the same time as something else."],
      ["country", "A nation with its own land and government."],
      ["medicine", "A substance or treatment used to prevent or treat illness."],
      ["floating", "Staying on or near the surface without sinking."],
      ["chapter", "One main section of a book."],
      ["pinecone", "The seed-bearing cone of a pine tree."],
    ],
    2: [
      ["recycling", "Processing used materials so they can be used again."],
      ["satellite", "An object that moves around a planet or other body in space."],
      ["coastline", "The land along the edge of an ocean or sea."],
      ["mapmaker", "A person who creates maps."],
      ["traveler", "A person who goes from one place to another."],
      ["impossible", "Not able to happen or be done."],
      ["photograph", "A picture made with a camera."],
      ["bridge", "A structure built over a road, river, or other obstacle."],
      ["cafeteria", "A place where people choose and eat prepared food."],
      ["offer", "To say that you are willing to give or do something."],
      ["seaweed", "A plant-like organism that grows in the sea."],
      ["favorite", "Liked more than the others."],
    ],
    3: [
      ["graphite", "A soft, dark form of carbon used in pencils."],
      ["chocolate", "A food made from cacao beans."],
      ["freezing", "At or below the temperature where water becomes ice."],
      ["stained", "Marked or colored by something difficult to remove."],
      ["announce", "To make information publicly known."],
      ["balance", "To keep steady without falling."],
      ["ancient", "Belonging to a time long ago."],
      ["accident", "An unexpected event that causes damage or injury."],
      ["return", "To go or come back."],
      ["practice", "Repeated work done to improve a skill."],
      ["period", "A length or section of time."],
      ["fastest", "Moving or happening more quickly than all others."],
    ],
  },
  g68: {
    1: [
      ["cochlea", "The spiral-shaped part of the inner ear that helps people hear."],
      ["orbital", "Related to the curved path of an object around another object."],
      ["astronomer", "A scientist who studies space, stars, and planets."],
      ["applied", "Put into use for a practical purpose."],
      ["elective", "A class that a student chooses rather than being required to take."],
      ["definition", "A statement explaining the meaning of a word or idea."],
      ["discovery", "Something learned or found for the first time."],
      ["expensive", "Costing a lot of money."],
      ["signal", "A sound, action, or sign that communicates information."],
      ["object", "A thing that can be seen or touched."],
      ["consider", "To think carefully about something."],
      ["relationship", "The way two or more people or things are connected."],
    ],
    2: [
      ["Gutenberg", "Johannes Gutenberg, who developed a movable-type printing system in Europe."],
      ["literacy", "The ability to read and write."],
      ["interpretation", "An explanation of the meaning of something."],
      ["authority", "The power or right to control, decide, or command."],
      ["sequoia", "A type of extremely large and long-lived tree."],
      ["engineer", "A person who designs or builds machines and structures."],
      ["damper", "A device that reduces movement or vibration."],
      ["frequency", "The number of times something happens in a certain period."],
      ["flammable", "Able to catch fire easily."],
      ["emergency", "A dangerous situation requiring immediate action."],
      ["modify", "To change something, usually to improve it."],
      ["evidence", "Facts or details that support an idea or conclusion."],
    ],
    3: [
      ["aqueduct", "A structure or channel built to carry water."],
      ["chlorophyll", "The green pigment in plants that absorbs light."],
      ["pigment", "A substance that gives color to something."],
      ["exhausted", "Extremely tired."],
      ["researcher", "A person who studies a subject to discover information."],
      ["schedule", "A plan showing when activities will happen."],
      ["gravity", "The force that pulls objects toward Earth or another body."],
      ["navigation", "The process of finding and following a route."],
      ["lighthouse", "A tower with a bright light that guides ships."],
      ["keeper", "A person responsible for caring for or protecting something."],
      ["biology", "The study of living things."],
      ["channel", "A passage through which water or information can move."],
    ],
  },
  g910: {
    1: [
      ["glacier", "A large, slow-moving mass of ice."],
      ["gravity", "The force that pulls objects toward Earth or another body."],
      ["velocity", "Speed in a particular direction."],
      ["mandatory", "Required by a rule or law."],
      ["charity", "Help or resources given to people in need."],
      ["dependence", "The state of needing someone or something for support."],
      ["fortune", "A very large amount of wealth."],
      ["abandoned", "Left behind or given up."],
      ["terminal", "A station where a journey begins or ends."],
      ["creative", "Able to produce original ideas or work."],
      ["balance", "A state in which different forces or needs are equal."],
      ["downhill", "Toward the bottom of a slope."],
    ],
    2: READING_SET_2_ADVANCED_VOCAB,
    3: READING_SET_3_ADVANCED_VOCAB,
  },
  g1112: {
    1: [
      ["zero-trust", "A security approach that verifies every user and device before allowing access."],
      ["security", "Protection against danger, damage, or unauthorized access."],
      ["restoration", "The process of returning something damaged to a better condition."],
      ["current", "A continuous movement of water or air in one direction."],
      ["nursery", "A protected place where young plants or animals grow."],
      ["barrier", "Something that blocks movement, access, or progress."],
      ["adapt", "To change in order to fit new conditions."],
      ["eliminate", "To remove or get rid of something."],
      ["telescope", "An instrument used to view distant objects."],
      ["fragment", "A small broken or separated piece."],
      ["password", "A secret set of characters used to enter an account."],
      ["account", "A record or identity that allows someone to use a service."],
    ],
    2: READING_SET_2_ADVANCED_VOCAB,
    3: READING_SET_3_ADVANCED_VOCAB,
  },
};

// California's ELD standards formally distinguish general academic and
// domain-specific vocabulary. "Everyday" is included here only as a study
// support category; the familiar Tier 1/2/3 labels are not ELPAC score bands.
const EVERYDAY_SUPPORT_WORDS = new Set([
  "shelter", "country", "medicine", "floating", "chapter", "traveler",
  "impossible", "photograph", "bridge", "cafeteria", "offer", "favorite",
  "chocolate", "freezing", "stained", "announce", "balance", "ancient",
  "accident", "return", "practice", "period", "fastest", "expensive",
  "signal", "object", "consider", "relationship", "exhausted", "schedule",
  "keeper", "channel", "downhill", "password", "account", "merchant",
  "disease", "route", "assigned", "overflow", "visible", "fountain",
]);

const DOMAIN_SPECIFIC_WORDS = new Set([
  "astronaut", "engineering", "bacteria", "pinecone", "recycling",
  "satellite", "coastline", "mapmaker", "seaweed", "graphite", "cochlea",
  "orbital", "astronomer", "Gutenberg", "sequoia", "engineer", "damper",
  "flammable", "aqueduct", "chlorophyll", "pigment", "gravity", "navigation",
  "lighthouse", "biology", "glacier", "velocity", "zero-trust", "telescope",
  "photosynthesis", "glucose", "carbon dioxide", "globalization", "gunpowder",
  "physics",
]);

const VOCAB_TYPES = {
  all: { label: "All words", short: "All" },
  everyday: { label: "Everyday support", short: "Everyday", tier: "Tier 1 study support" },
  academic: { label: "General academic", short: "Academic", tier: "Tier 2 study term" },
  domain: { label: "Domain-specific", short: "Subject", tier: "Tier 3 study term" },
};

const ELD_STUDY_LEVELS = {
  emerging: {
    label: "Emerging",
    goal: "Learn a focused set of familiar academic and subject words.",
    practice: "Say the word, then explain it in your own words.",
  },
  expanding: {
    label: "Expanding",
    goal: "Build a growing range and use words to add detail and precision.",
    practice: "Use the word in a complete sentence that adds a clear detail.",
  },
  bridging: {
    label: "Bridging",
    goal: "Use a wide range accurately, including precise meanings and word forms.",
    practice: "Use the word precisely, then give a synonym or related word form.",
  },
};

function vocabularyType(word) {
  if (DOMAIN_SPECIFIC_WORDS.has(word)) return "domain";
  if (EVERYDAY_SUPPORT_WORDS.has(word)) return "everyday";
  return "academic";
}

const VOCAB_BANDS = [
  ["g35", "Grades 3–5"],
  ["g68", "Grades 6–8"],
  ["g910", "Grades 9–10"],
  ["g1112", "Grades 11–12"],
];

function VocabularyPanel({ user, onBack }) {
  const [band, setBand] = useState("g35");
  const [studySet, setStudySet] = useState(1);
  const [wordType, setWordType] = useState("all");
  const [studyLevel, setStudyLevel] = useState("emerging");
  const [studyMode, setStudyMode] = useState("cards");
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [recallAnswer, setRecallAnswer] = useState("");
  const [recallChecked, setRecallChecked] = useState(false);
  const [shuffledWords, setShuffledWords] = useState(null);
  const [mastered, setMastered] = useState(null);
  const [reviews, setReviews] = useState(null);
  const storageKey = "reading-vocabulary:" + user.id;
  const reviewStorageKey = "reading-vocabulary-reviews:" + user.id;

  useEffect(() => {
    (async () => {
      const raw = await storeGet(storageKey);
      if (!raw) return setMastered([]);
      try { setMastered(JSON.parse(raw)); } catch { setMastered([]); }
    })();
  }, [storageKey]);

  useEffect(() => {
    (async () => {
      const raw = await storeGet(reviewStorageKey);
      if (!raw) return setReviews({});
      try { setReviews(JSON.parse(raw)); } catch { setReviews({}); }
    })();
  }, [reviewStorageKey]);

  useEffect(() => {
    setCardIndex(0);
    setRevealed(false);
    setRecallAnswer("");
    setRecallChecked(false);
    setShuffledWords(null);
  }, [band, studySet, wordType]);

  useEffect(() => {
    setWordType("all");
  }, [band, studySet]);

  const allWords = READING_VOCAB[band]?.[studySet] || [];
  const availableTypes = new Set(allWords.map(([word]) => vocabularyType(word)));
  const baseWords = wordType === "all"
    ? allWords
    : allWords.filter(([word]) => vocabularyType(word) === wordType);
  const words = shuffledWords || baseWords;
  const current = words[cardIndex] || ["", ""];
  const currentType = vocabularyType(current[0]);
  const masteredSet = new Set(mastered || []);
  const currentId = band + ":" + studySet + ":" + current[0];
  const learnedCount = allWords.filter(([word]) => masteredSet.has(band + ":" + studySet + ":" + word)).length;
  const currentReview = reviews?.[currentId] || { intervalDays:0, reviews:0 };
  const dueCount = allWords.filter(([word]) => {
    const review = reviews?.[band + ":" + studySet + ":" + word];
    return !review || !review.nextReview || review.nextReview <= Date.now();
  }).length;
  const visibleDueCount = baseWords.filter(([word]) => {
    const review = reviews?.[band + ":" + studySet + ":" + word];
    return !review || !review.nextReview || review.nextReview <= Date.now();
  }).length;
  const normalizedRecall = recallAnswer.trim().toLocaleLowerCase();
  const recallCorrect = normalizedRecall === current[0].trim().toLocaleLowerCase();
  const canRate = studyMode === "cards" ? revealed : recallChecked;

  function moveCard(amount) {
    setCardIndex((index) => (index + amount + words.length) % words.length);
    setRevealed(false);
    setRecallAnswer("");
    setRecallChecked(false);
  }

  function shuffleCards() {
    const next = [...baseWords];
    for (let index = next.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
    }
    setShuffledWords(next);
    setCardIndex(0);
    setRevealed(false);
    setRecallAnswer("");
    setRecallChecked(false);
  }

  function startDueReview() {
    const now = Date.now();
    const due = baseWords.filter(([word]) => {
      const review = reviews?.[band + ":" + studySet + ":" + word];
      return !review || !review.nextReview || review.nextReview <= now;
    });
    setShuffledWords(due.length ? due : baseWords);
    setCardIndex(0);
    setRevealed(false);
    setRecallAnswer("");
    setRecallChecked(false);
  }

  function speakCurrent() {
    if (typeof window === "undefined" || !window.speechSynthesis || !current[0]) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(current[0]);
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }

  function reviewIntervals() {
    const prior = currentReview.intervalDays || 0;
    return {
      again: 0,
      hard: Math.max(1, Math.round(prior * 1.2)),
      good: Math.max(3, Math.round(prior * 2.5)),
      easy: Math.max(7, Math.round(prior * 4)),
    };
  }

  async function rateCurrent(rating) {
    if (!reviews || !mastered || !current[0]) return;
    const intervals = reviewIntervals();
    const intervalDays = intervals[rating];
    const nextReviews = {
      ...reviews,
      [currentId]: {
        rating,
        intervalDays,
        reviews:(currentReview.reviews || 0) + 1,
        lastReviewed:Date.now(),
        nextReview:Date.now() + intervalDays * 86400000,
      },
    };
    let nextMastered = mastered;
    if (rating === "good" || rating === "easy") {
      if (!masteredSet.has(currentId)) nextMastered = [...mastered, currentId];
    } else if (rating === "again" && masteredSet.has(currentId)) {
      nextMastered = mastered.filter((item) => item !== currentId);
    }
    setReviews(nextReviews);
    setMastered(nextMastered);
    await Promise.all([
      storeSet(reviewStorageKey, JSON.stringify(nextReviews)),
      storeSet(storageKey, JSON.stringify(nextMastered)),
    ]);
    moveCard(1);
  }

  useEffect(() => {
    function onStudyKeyDown(event) {
      const tag = event.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (event.code === "Space" && studyMode === "cards") {
        event.preventDefault();
        if (revealed) rateCurrent("good");
        else setRevealed(true);
        return;
      }
      if (!canRate) return;
      const rating = { "1":"again", "2":"hard", "3":"good", "4":"easy" }[event.key];
      if (rating) rateCurrent(rating);
    }
    window.addEventListener("keydown", onStudyKeyDown);
    return () => window.removeEventListener("keydown", onStudyKeyDown);
  }, [studyMode, revealed, canRate, currentId, reviews, mastered, cardIndex, words.length]);

  return (
    <div>
      <Back onClick={onBack} label="practice" />
      <div style={{ display:"flex", justifyContent:"space-between", gap:14,
        alignItems:"center", flexWrap:"wrap", marginBottom:12 }}>
        <div>
          <h2 style={{ fontSize:24, margin:"0 0 2px" }}>Vocabulary</h2>
          <div style={{ fontSize:13, color:C.mute }}>Reading-set words organized for California ELD</div>
        </div>
        <div style={{ width:230 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            fontFamily:"ui-monospace, monospace", fontSize:10.5, color:C.mute, marginBottom:5 }}>
            <span>set progress</span><span>{learnedCount}/{allWords.length} learned · {dueCount} due</span>
          </div>
          <div role="progressbar" aria-label="Vocabulary set progress" aria-valuemin="0"
            aria-valuemax={allWords.length} aria-valuenow={learnedCount}
            style={{ height:6, borderRadius:99, background:C.line, overflow:"hidden" }}>
            <div style={{ width:(allWords.length ? learnedCount / allWords.length * 100 : 0) + "%",
              height:"100%", background:C.moss, transition:"width .2s ease" }} />
          </div>
        </div>
      </div>

      <div style={{ display:"flex", justifyContent:"space-between", gap:10,
        flexWrap:"wrap", marginBottom:12 }}>
        <div role="tablist" aria-label="Vocabulary grade bands" style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {VOCAB_BANDS.map(([id, label]) => (
            <button key={id} role="tab" aria-selected={band === id} onClick={() => setBand(id)}
              style={{ ...ghostBtn, fontSize:11.5, color:band === id ? "#fff" : C.mute,
                background:band === id ? C.moss : "transparent",
                borderColor:band === id ? C.moss : C.line }}>{label}</button>
          ))}
        </div>
        <div role="tablist" aria-label="Reading practice sets" style={{ display:"flex", gap:6 }}>
          {[1, 2, 3].map((number) => (
            <button key={number} role="tab" aria-selected={studySet === number}
              onClick={() => setStudySet(number)}
              style={{ ...ghostBtn, fontSize:11.5, color:studySet === number ? "#fff" : C.mute,
                background:studySet === number ? C.ink : "transparent",
                borderColor:studySet === number ? C.ink : C.line }}>Set {number}</button>
          ))}
        </div>
      </div>

      <div style={{ ...examPane, padding:"10px 12px", marginBottom:12,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        gap:12, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <label style={{ fontFamily:"ui-monospace, monospace", fontSize:10.5, color:C.mute }}>
            ELD LEVEL{" "}
            <select value={studyLevel} onChange={(event) => setStudyLevel(event.target.value)}
              style={{ ...ghostBtn, padding:"5px 8px", marginLeft:4, background:C.card, color:C.ink }}>
              {Object.entries(ELD_STUDY_LEVELS).map(([id, level]) => (
                <option key={id} value={id}>{level.label}</option>
              ))}
            </select>
          </label>
          <label style={{ fontFamily:"ui-monospace, monospace", fontSize:10.5, color:C.mute }}>
            WORD TYPE{" "}
            <select value={wordType} onChange={(event) => setWordType(event.target.value)}
              style={{ ...ghostBtn, padding:"5px 8px", marginLeft:4, background:C.card, color:C.ink }}>
              {Object.entries(VOCAB_TYPES).map(([id, type]) => (
                <option key={id} value={id} disabled={id !== "all" && !availableTypes.has(id)}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ maxWidth:420, fontSize:12.5, lineHeight:1.4, color:C.mute }}>
          {ELD_STUDY_LEVELS[studyLevel].goal}
        </div>
      </div>

      {mastered == null || reviews == null ? (
        <div style={{ ...examPane, color:C.mute }}>Loading vocabulary progress…</div>
      ) : (
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            gap:8, flexWrap:"wrap", marginBottom:8 }}>
            <div role="tablist" aria-label="Vocabulary study mode" style={{ display:"flex", gap:6 }}>
              <button type="button" role="tab" aria-selected={studyMode === "cards"}
                onClick={() => { setStudyMode("cards"); setRevealed(false); setRecallChecked(false); }}
                style={{ ...ghostBtn, fontSize:11.5, color:studyMode === "cards" ? "#fff" : C.mute,
                  background:studyMode === "cards" ? C.ink : "transparent",
                  borderColor:studyMode === "cards" ? C.ink : C.line }}>Flashcards</button>
              <button type="button" role="tab" aria-selected={studyMode === "recall"}
                onClick={() => { setStudyMode("recall"); setRevealed(false); setRecallAnswer(""); setRecallChecked(false); }}
                style={{ ...ghostBtn, fontSize:11.5, color:studyMode === "recall" ? "#fff" : C.mute,
                  background:studyMode === "recall" ? C.ink : "transparent",
                  borderColor:studyMode === "recall" ? C.ink : C.line }}>Write answer</button>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button type="button" onClick={startDueReview} style={{ ...ghostBtn, fontSize:11.5,
                color:visibleDueCount ? C.moss : C.mute }}>Review due ({visibleDueCount})</button>
              <button type="button" onClick={shuffleCards} style={{ ...ghostBtn, fontSize:11.5 }}>Shuffle</button>
              <button type="button" onClick={speakCurrent} style={{ ...ghostBtn, fontSize:11.5 }}
                aria-label={"Hear " + current[0]}>Hear word</button>
            </div>
          </div>
          <button type="button" onClick={() => setRevealed((value) => !value)}
            aria-label={revealed ? "Hide definition" : "Reveal definition"}
            aria-hidden={studyMode !== "cards"} tabIndex={studyMode === "cards" ? 0 : -1}
            style={{ ...examPane, width:"100%", minHeight:260, cursor:"pointer", fontFamily:"inherit",
              display:studyMode === "cards" ? "grid" : "none", placeItems:"center", textAlign:"center", padding:"32px 24px",
              borderColor:masteredSet.has(currentId) ? C.moss : C.line,
              background:masteredSet.has(currentId) ? C.mossSoft : C.card }}>
            <div>
              <div style={{ fontFamily:"ui-monospace, monospace", fontSize:10.5,
                letterSpacing:1.4, textTransform:"uppercase", color:C.mute, marginBottom:18 }}>
                Reading Set {studySet} · {cardIndex + 1} of {words.length}
              </div>
              <div style={{ display:"inline-flex", gap:7, alignItems:"center", marginBottom:12,
                padding:"4px 8px", border:"1px solid " + C.line, borderRadius:99,
                fontFamily:"ui-monospace, monospace", fontSize:10, color:C.moss,
                textTransform:"uppercase", letterSpacing:.7 }}>
                <span>{VOCAB_TYPES[currentType].label}</span>
                <span style={{ color:C.mute }}>· {VOCAB_TYPES[currentType].tier}</span>
              </div>
              <div style={{ fontSize:34, fontWeight:700, lineHeight:1.15 }}>{current[0]}</div>
              <div style={{ marginTop:20, fontSize:revealed ? 17 : 12.5,
                lineHeight:1.55, color:revealed ? C.ink : C.mute,
                fontStyle:revealed ? "normal" : "italic" }}>
                {revealed ? current[1] : "Click to reveal the definition"}
              </div>
              {revealed && (
                <div style={{ marginTop:14, paddingTop:12, borderTop:"1px solid " + C.line,
                  fontSize:12.5, lineHeight:1.45, color:C.mute }}>
                  {ELD_STUDY_LEVELS[studyLevel].practice}
                </div>
              )}
            </div>
          </button>

          {studyMode === "recall" && (
            <form onSubmit={(event) => { event.preventDefault(); setRecallChecked(true); }}
              style={{ ...examPane, minHeight:260, display:"grid", placeItems:"center",
                textAlign:"center", padding:"28px 24px",
                borderColor:recallChecked && recallCorrect ? C.moss : C.line,
                background:recallChecked && recallCorrect ? C.mossSoft : C.card }}>
              <div style={{ width:"100%", maxWidth:520 }}>
                <div style={{ fontFamily:"ui-monospace, monospace", fontSize:10.5,
                  letterSpacing:1.2, textTransform:"uppercase", color:C.mute, marginBottom:14 }}>
                  Active recall · Reading Set {studySet} · {cardIndex + 1} of {words.length}
                </div>
                <div style={{ fontSize:18, lineHeight:1.55, marginBottom:18 }}>{current[1]}</div>
                <label style={{ display:"block", fontFamily:"ui-monospace, monospace",
                  fontSize:10.5, color:C.mute, textAlign:"left", marginBottom:6 }}>
                  TYPE THE WORD
                </label>
                <div style={{ display:"flex", gap:8 }}>
                  <input value={recallAnswer}
                    onChange={(event) => { setRecallAnswer(event.target.value); setRecallChecked(false); }}
                    autoCapitalize="none" autoComplete="off" spellCheck="false"
                    aria-label="Type the vocabulary word"
                    style={{ flex:1, minWidth:0, border:"1px solid " + C.line, borderRadius:4,
                      background:C.paper, color:C.ink, padding:"10px 12px", fontFamily:"inherit",
                      fontSize:16, outline:"none" }} />
                  <button type="submit" disabled={!recallAnswer.trim()} style={{ ...smallPrimary,
                    opacity:recallAnswer.trim() ? 1 : .45 }}>Check</button>
                </div>
                {recallChecked && (
                  <div role="status" style={{ marginTop:14, fontSize:14,
                    color:recallCorrect ? C.moss : C.rust }}>
                    {recallCorrect ? "Correct." : <>Not quite. The word is <strong>{current[0]}</strong>.</>}
                  </div>
                )}
              </div>
            </form>
          )}

          {canRate ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(0, 1fr))",
              gap:6, marginTop:10 }}>
              {Object.entries({ again:"Again", hard:"Hard", good:"Good", easy:"Easy" }).map(([id, label]) => {
                const interval = reviewIntervals()[id];
                return (
                  <button key={id} type="button" onClick={() => rateCurrent(id)}
                    style={{ ...ghostBtn, padding:"8px 5px", color:id === "again" ? C.rust : C.moss,
                      borderColor:id === "again" ? C.rust : C.line }}>
                    <span style={{ display:"block", fontWeight:700 }}>{label}</span>
                    <span style={{ display:"block", marginTop:2, fontFamily:"ui-monospace, monospace",
                      fontSize:9.5, color:C.mute }}>{interval === 0 ? "later today" : interval + "d"}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ display:"flex", gap:8, marginTop:10, alignItems:"center" }}>
              <button type="button" onClick={() => moveCard(-1)} style={{ ...ghostBtn, flex:1 }}>Previous</button>
              <button type="button" onClick={() => studyMode === "cards" ? setRevealed(true) : setRecallChecked(true)}
                disabled={studyMode === "recall" && !recallAnswer.trim()}
                style={{ ...smallPrimary, flex:1.15,
                  opacity:studyMode === "recall" && !recallAnswer.trim() ? .45 : 1 }}>
                {studyMode === "cards" ? "Show answer" : "Check answer"}
              </button>
              <button type="button" onClick={() => moveCard(1)} style={{ ...ghostBtn, flex:1 }}>Next</button>
            </div>
          )}

          <div aria-label="Vocabulary cards" style={{ display:"flex", justifyContent:"center",
            gap:6, flexWrap:"wrap", marginTop:14 }}>
            {words.map(([word], index) => {
              const learned = masteredSet.has(band + ":" + studySet + ":" + word);
              return (
                <button key={word} type="button" onClick={() => {
                    setCardIndex(index); setRevealed(false); setRecallAnswer(""); setRecallChecked(false);
                  }}
                  aria-label={"Open " + word} title={word}
                  style={{ width:10, height:10, padding:0, borderRadius:99, cursor:"pointer",
                    border:"1px solid " + (index === cardIndex ? C.ink : learned ? C.moss : C.line),
                    background:index === cardIndex ? C.ink : learned ? C.moss : "transparent" }} />
              );
            })}
          </div>
        </div>
      )}
      <p style={{ textAlign:"center", fontFamily:"ui-monospace, monospace",
        fontSize:10.5, color:C.mute, margin:"12px 0 0" }}>
        Learned words are saved for {user.name} on this device. ELD levels describe growing
        range and precision, not fixed word lists.
      </p>
    </div>
  );
}

function SpanPick({ onPick }) {
  return (
    <div>
      <p style={{ fontSize:15.5, lineHeight:1.55, color:C.mute, marginTop:0, marginBottom:18 }}>
        Choose your grade. Each set follows a clear, test-like order. Reading and listening include
        answer review; speaking and writing save responses without scoring them. Grades 3–5, 6–8,
        9–10, and 11–12 are available.
      </p>
      <div style={{ display:"grid", gap:10 }}>
        {SPANS.map((s) => {
          const ready = SETS.some((set) => !!BANKS[set.id]?.[s.id]);
          return (
            <button key={s.id} onClick={() => onPick(s.id)} disabled={!ready}
              style={{ ...rowCard, opacity:ready ? 1 : 0.5, cursor:ready ? "pointer" : "default" }}>
              <span style={{ fontSize:17, fontWeight:700 }}>{s.label}</span>
              <span style={{ fontFamily:"ui-monospace, monospace", fontSize:12,
                color:ready ? C.moss : C.mute }}>{ready ? "open →" : "coming soon"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Domain-first: pick the skill area, then the practice set inside it.
const DOMAIN_ORDER = [
  { id: "reading",   label: "Reading",   note: "26 questions · passages and student essays" },
  { id: "listening", label: "Listening", note: "22 questions · audio plays once" },
  { id: "speaking",  label: "Speaking",  note: "12 prompts · recordings saved for review" },
  { id: "writing",   label: "Writing",   note: "6 prompts · responses saved for review" },
];

function DomainPick({ spanLabel, onBack, onPick }) {
  return (
    <div>
      <Back onClick={onBack} label="grades" />
      <h2 style={{ fontSize:22, margin:"0 0 6px" }}>{spanLabel}</h2>
      <p style={{ fontSize:14.5, color:C.mute, marginTop:0, marginBottom:16 }}>
        Choose a skill area. Each one has three full-length practice sets.
      </p>
      <div style={{ display:"grid", gap:10 }}>
        {DOMAIN_ORDER.map((d) => (
          <button key={d.id} onClick={() => onPick(d.id)} style={rowCard}>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:17, fontWeight:700 }}>{d.label}</div>
              <div style={{ fontSize:13, color:C.mute, marginTop:2 }}>{d.note}</div>
            </div>
            <span style={{ fontFamily:"ui-monospace, monospace", fontSize:12, color:C.moss }}>open →</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SetPick({ spanLabel, domain, onBack, onPick, user, span }) {
  const dLabel = DOMAIN_ORDER.find((d) => d.id === domain)?.label || "";
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const next = {};
      const completedAt = {};
      const historyKeys = await storeList(`attempt:${user.id}:`);
      for (const key of historyKeys) {
        const rawAttempt = await storeGet(key);
        if (!rawAttempt) continue;
        try {
          const attempt = JSON.parse(rawAttempt);
          if (attempt.span === span && attempt.domain === domain) {
            completedAt[attempt.setNum] = Math.max(completedAt[attempt.setNum] || 0, attempt.ts || 0);
          }
        } catch {}
      }
      for (const st of SETS) {
        const key = progressKey(user.id, span, st.id, domain);
        const raw = await storeGet(key);
        if (raw) {
          try {
            const draft = JSON.parse(raw);
            if ((completedAt[st.id] || 0) >= (draft.updatedAt || 0)) {
              await storeRemove(key);
            } else {
              next[st.id] = draft;
            }
          } catch {}
        }
      }
      if (alive) setDrafts(next);
    })();
    return () => { alive = false; };
  }, [user.id, span, domain]);

  async function restart(st) {
    const confirmed = window.confirm(
      `Restart Practice Set ${st.id}? Your saved progress for this ${dLabel.toLowerCase()} section will be deleted.`
    );
    if (!confirmed) return;
    await storeRemove(progressKey(user.id, span, st.id, domain));
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[st.id];
      return next;
    });
    onPick(st.id, null);
  }

  const draftSets = SETS.filter((st) => drafts[st.id]);

  return (
    <div>
      <Back onClick={onBack} label="skill areas" />
      <h2 style={{ fontSize:22, margin:"0 0 6px" }}>{spanLabel} · {dLabel}</h2>
      <p style={{ fontSize:14.5, color:C.mute, marginTop:0, marginBottom:16 }}>
        Three full-length {dLabel.toLowerCase()} sections. Set 1 mirrors the official practice
        test; Sets 2 and 3 are new content in the same format.
      </p>
      {draftSets.length > 0 && (
        <div style={{ ...examPane, marginBottom: 14 }}>
          <div style={paneLabel}>In progress</div>
          <div style={{ display: "grid", gap: 8 }}>
            {draftSets.map((st) => {
              const draft = drafts[st.id];
              const totalBlocks = BANKS[st.id]?.[span]?.[domain]?.length || 0;
              const currentBlock = Math.min((draft.bIdx || 0) + 1, totalBlocks || 1);
              return (
                <div key={st.id} style={{ display: "flex", alignItems: "center",
                  justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Practice Set {st.id}</div>
                    <div style={{ fontSize: 12, color: C.mute, marginTop: 2 }}>
                      Saved at task {currentBlock} of {totalBlocks || "—"}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 7 }}>
                    <button onClick={() => onPick(st.id, draft)} style={smallPrimary}>
                      Continue
                    </button>
                    <button onClick={() => restart(st)} style={ghostBtn}>
                      Restart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div style={{ display:"grid", gap:10 }}>
        {SETS.map((st) => (
          <button key={st.id}
            onClick={() => st.live && (drafts[st.id] ? onPick(st.id, drafts[st.id]) : onPick(st.id, null))}
            disabled={!st.live}
            style={{ ...rowCard, opacity:st.live ? 1 : 0.5, cursor:st.live ? "pointer" : "default" }}>
            <span style={{ fontSize:17, fontWeight:700 }}>Practice Set {st.id}</span>
            <span style={{ fontFamily:"ui-monospace, monospace", fontSize:12,
              color:st.live ? C.moss : C.mute }}>
              {st.live ? (drafts[st.id] ? "in progress →" : "start →") : "coming soon"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ══════════ FORMAL EXAM INTERFACE ══════════

function useIsWide(breakpoint = 720) {
  const [wide, setWide] = useState(
    typeof window !== "undefined" ? window.innerWidth >= breakpoint : true
  );
  useEffect(() => {
    function onResize() { setWide(window.innerWidth >= breakpoint); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return wide;
}

function ExamBar({ domainLabel, position, total, elapsed, showTime, onToggleTime,
  onBack, onNext, canBack, canNext, nextLabel, onExit }) {
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 4, background: C.card,
      marginBottom: 14, overflow: "hidden" }}>
      {/* row 1 — controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "8px 12px", background: C.paper, borderBottom: `1px solid ${C.line}` }}>
        <button onClick={onExit} style={examBtn}>Suspend</button>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={onBack} disabled={!canBack}
            style={{ ...examBtn, opacity: canBack ? 1 : 0.35,
              cursor: canBack ? "pointer" : "default" }}>Back</button>
          <button onClick={onNext} disabled={!canNext}
            style={{ ...examBtn, background: canNext ? C.moss : "transparent",
              color: canNext ? "#fff" : C.mute, borderColor: canNext ? C.moss : C.line,
              opacity: canNext ? 1 : 0.35, cursor: canNext ? "pointer" : "default" }}>
            {nextLabel || "Next"}
          </button>
        </div>
      </div>
      {/* row 2 — status */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "7px 12px" }}>
        <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, color: C.ink }}>
          <span style={{ color: C.clay }}>&#9654;</span> {domainLabel}: {position} of {total}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onToggleTime} style={{ ...examBtn, padding: "3px 8px", fontSize: 10.5 }}>
            {showTime ? "Hide Time" : "Show Time"}
          </button>
          <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12.5,
            color: showTime ? C.ink : "transparent", minWidth: 46, textAlign: "right" }}>
            {mm}:{ss}
          </span>
        </span>
      </div>
    </div>
  );
}

function DomainRunner({ blocks, domain, user, setNum, span, resume, onFinish, onExit }) {
  const isMC = domain === "listening" || domain === "reading";
  const listening = domain === "listening";
  const wide = useIsWide();

  const [bIdx, setBIdx] = useState(() => Number.isInteger(resume?.bIdx) ? resume.bIdx : 0);
  const [qIdx, setQIdx] = useState(() => Number.isInteger(resume?.qIdx) ? resume.qIdx : 0);
  const [answers, setAnswers] = useState(() => resume?.answers || {});   // "bIdx:qIdx" -> option index (MC only)
  const [phase, setPhase] = useState(() => (
    resume?.phase === "playing" ? "pre" : resume?.phase || (listening ? "pre" : "qs")
  )); // listening playback state
  const [stage, setStage] = useState("run");    // run -> submitted (MC review) / done
  const [tally, setTally] = useState({ correct: 0, total: 0 });
  const [responses, setResponses] = useState(() => resume?.responses || {}); // production response by block index
  const [elapsed, setElapsed] = useState(() => Number.isFinite(resume?.elapsed) ? resume.elapsed : 0);
  const [showTime, setShowTime] = useState(true);
  const [nav, setNav] = useState({});           // production blocks report nav here
  const [heardBlocks, setHeardBlocks] = useState(() => new Set(
    Array.isArray(resume?.heardBlocks) ? resume.heardBlocks
      : (listening && (resume?.phase === "qs" || resume?.phase === "played")
        ? [Number.isInteger(resume?.bIdx) ? resume.bIdx : 0] : [])
  ));
  const [finishing, setFinishing] = useState(false);
  const [finishError, setFinishError] = useState("");
  const finishingRef = useRef(false);

  async function finishSection(payload) {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setFinishing(true);
    setFinishError("");
    try {
      const saved = await onFinish(payload);
      if (saved === false) {
        finishingRef.current = false;
        setFinishing(false);
        setFinishError("This section could not be saved. Your answers are still on this page; free browser storage and try again.");
      }
    } catch {
      finishingRef.current = false;
      setFinishing(false);
      setFinishError("This section could not be saved. Your answers are still on this page; please try again.");
    }
  }

  async function saveProgress() {
    if (!user || stage !== "run") return;
    const snapshot = {
      bIdx, qIdx, answers, phase, responses, elapsed,
      heardBlocks: Array.from(heardBlocks),
      updatedAt: Date.now(),
    };
    await storeSet(progressKey(user.id, span, setNum, domain), JSON.stringify(snapshot));
  }

  useEffect(() => {
    saveProgress();
  }, [bIdx, qIdx, answers, phase, responses, heardBlocks]);

  useEffect(() => {
    if (elapsed % 10 === 0) saveProgress();
  }, [elapsed]);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => () => { stopSpeaking(); if (stopAudioRef.current) stopAudioRef.current(); }, []);

  const DOMAIN_LABEL = { listening: "Listening", reading: "Reading",
    speaking: "Speaking", writing: "Writing" }[domain];
  const block = blocks[bIdx];

  // ---- listening audio control (real clip if available, else browser voice) ----
  const stopAudioRef = useRef(null);
  function playAudio() {
    const playedBlock = bIdx;
    setPhase("playing");
    stopAudioRef.current = playListening(
      { setNum, span, topic: block.topic, transcript: block.transcript },
      { onEnd: () => {
        setHeardBlocks((previous) => {
          const next = new Set(previous);
          next.add(playedBlock);
          return next;
        });
        setPhase("played");
      } }
    );
  }

  // ---- MC navigation (owned here so answers persist across blocks) ----
  const mcTotal = isMC ? blocks.reduce((a, b) => a + b.qs.length, 0) : blocks.length;
  const mcPrior = isMC ? blocks.slice(0, bIdx).reduce((a, b) => a + b.qs.length, 0) : bIdx;
  const mcPosition = Math.min(mcPrior + qIdx + 1, mcTotal);
  const atLastQuestion = isMC && bIdx === blocks.length - 1 && qIdx === block.qs.length - 1;

  function mcNext() {
    if (listening && phase === "pre") { playAudio(); return; }
    if (listening && phase === "playing") return;         // must finish
    if (listening && phase === "played") { setPhase("qs"); return; }
    // advance question / block
    if (qIdx + 1 < block.qs.length) { setQIdx((i) => i + 1); }
    else if (bIdx + 1 < blocks.length) {
      const nextBlock = bIdx + 1;
      setBIdx(nextBlock); setQIdx(0);
      if (listening) setPhase(heardBlocks.has(nextBlock) ? "qs" : "pre");
    } else {
      submitMC();
    }
  }
  function mcBack() {
    if (listening && phase === "playing") return;
    if (phase === "qs" && qIdx > 0) setQIdx((i) => i - 1);
    else if (bIdx > 0) {
      const prev = bIdx - 1;
      setBIdx(prev); setQIdx(blocks[prev].qs.length - 1);
      if (listening) setPhase("qs");  // don't replay when stepping back
    }
  }
  function submitMC() {
    stopSpeaking();
    let correct = 0, total = 0;
    blocks.forEach((b, bi) => b.qs.forEach((q, qi) => {
      total += 1;
      if (answers[`${bi}:${qi}`] === q.answer) correct += 1;
    }));
    setTally({ correct, total });
    setStage("submitted");
  }

  const listeningLockNext = listening && phase === "playing";
  const mcCanNext = !listeningLockNext;
  const mcNextLabel = listening
    ? (phase === "pre" ? "Play" : phase === "playing" ? "Playing…" : phase === "played" ? "Continue" : (atLastQuestion ? "Submit" : "Next"))
    : (atLastQuestion ? "Submit" : "Next");

  // ---- MC REVIEW (after submit) ----
  if (isMC && stage === "submitted") {
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");
    const items = [];
    blocks.forEach((b, bi) => b.qs.forEach((q, qi) => {
      items.push({ task: b.task, topic: b.topic, stem: q.stem,
        picked: answers[`${bi}:${qi}`] ?? null, answer: q.answer,
        correct: answers[`${bi}:${qi}`] === q.answer });
    }));
    return (
      <div>
        <div style={{ ...examPane, textAlign: "center", padding: "28px 24px", marginBottom: 12 }}>
          <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: 2,
            textTransform: "uppercase", color: C.mute, marginBottom: 10 }}>
            {DOMAIN_LABEL} — your score
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.moss,
            fontFamily: "ui-monospace, monospace" }}>{tally.correct} / {tally.total}</div>
          <div style={{ fontSize: 13, color: C.mute, marginTop: 6,
            fontFamily: "ui-monospace, monospace" }}>elapsed {mm}:{ss}</div>
          <button onClick={() => finishSection({ correct: tally.correct, total: tally.total, items })}
            disabled={finishing} style={{ ...primaryBtn, marginTop: 18,
              opacity: finishing ? 0.65 : 1 }}>
            {finishing ? "Saving…" : "Save & continue"}
          </button>
          {finishError && <div style={{ marginTop: 12 }}><Note text={finishError} tone="clay" /></div>}
        </div>
        <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: 1.6,
          textTransform: "uppercase", color: C.mute, margin: "4px 0 8px" }}>Review — mistakes are flagged</div>
        <MCReview blocks={blocks} answers={answers} listening={listening} />
        <button onClick={() => finishSection({ correct: tally.correct, total: tally.total, items })}
          disabled={finishing} style={{ ...primaryBtn, marginTop: 14,
            opacity: finishing ? 0.65 : 1 }}>
          {finishing ? "Saving…" : "Save & continue"}
        </button>
      </div>
    );
  }

  // ---- PRODUCTION completion (speaking / writing) ----
  const prodDone = !isMC && stage === "done";
  if (prodDone) {
    const isSpeak = domain === "speaking";
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const ss = String(elapsed % 60).padStart(2, "0");
    return (
      <div>
        <div style={{ ...examPane, textAlign: "center", padding: "36px 24px" }}>
          <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: 2,
            textTransform: "uppercase", color: C.mute, marginBottom: 14 }}>
            {DOMAIN_LABEL} section complete
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: C.moss,
            fontFamily: "ui-monospace, monospace" }}>
            {isSpeak ? `${blocks.length} tasks recorded` : `${blocks.length} tasks done`}
          </div>
          <div style={{ fontSize: 13, color: C.mute, marginTop: 6,
            fontFamily: "ui-monospace, monospace" }}>elapsed {mm}:{ss}</div>
          <div style={{ fontSize: 13.5, color: C.mute, marginTop: 14, lineHeight: 1.55,
            maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
            {isSpeak ? "Play your recordings back or review them with a teacher. This question bank does not score speaking."
              : "Your writing responses are saved for review. This question bank does not score writing."}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10,
            flexWrap: "wrap", marginTop: 22 }}>
            {!isSpeak && (
              <button type="button" onClick={() => {
                setBIdx(Math.max(0, blocks.length - 1));
                setStage("run");
              }} disabled={finishing} style={ghostBtn}>
                Back to responses
              </button>
            )}
            <button onClick={() => finishSection({
                total: blocks.length,
                items: blocks.map((b, i) => ({
                  task: b.task,
                  topic: b.topic,
                  prompt: b.stem || b.prompt,
                  response: responses[i] || null,
                })),
              })}
                disabled={finishing} style={{ ...primaryBtn,
                  opacity: finishing ? 0.65 : 1 }}>
                {finishing ? "Submitting…" : "Submit section"}
            </button>
          </div>
          {finishError && <div style={{ marginTop: 12 }}><Note text={finishError} tone="clay" /></div>}
        </div>
      </div>
    );
  }

  // ---- production block navigation ----
  const prodPosition = bIdx + 1;
  function prodAdvance() {
    if (bIdx + 1 < blocks.length) setBIdx((i) => i + 1);
    else setStage("done");
  }
  function prodBack() {
    if (domain === "writing" && bIdx > 0) setBIdx((i) => i - 1);
  }

  return (
    <div>
      <ExamBar
        domainLabel={DOMAIN_LABEL}
        position={isMC ? mcPosition : prodPosition}
        total={isMC ? mcTotal : blocks.length}
        elapsed={elapsed}
        showTime={showTime}
        onToggleTime={() => setShowTime((v) => !v)}
        onBack={isMC ? mcBack : () => nav.back && nav.back()}
        onNext={isMC ? mcNext : () => nav.next && nav.next()}
        canBack={isMC ? (!listening || phase !== "playing") && (qIdx > 0 || bIdx > 0) : !!nav.canBack}
        canNext={isMC ? mcCanNext : !!nav.canNext}
        nextLabel={isMC ? mcNextLabel : nav.nextLabel}
        onExit={() => { stopSpeaking(); if (stopAudioRef.current) stopAudioRef.current(); onExit(); }}
      />
      <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: 1.4,
        textTransform: "uppercase", color: C.mute, marginBottom: 8 }}>
        {block.task} <span style={{ color: C.line }}>|</span> {block.topic}
      </div>
      {domain === "speaking"
        ? <SpeakBlock key={bIdx} block={block} onDone={prodAdvance} setNav={setNav}
            setNum={setNum} span={span}
            initialResponse={responses[bIdx]}
            onResponse={(response) => setResponses((prev) => ({ ...prev, [bIdx]: response }))} />
        : domain === "writing"
          ? <WriteBlock key={bIdx} block={block} onDone={prodAdvance} setNav={setNav}
              onBack={prodBack} canBack={bIdx > 0}
              initialResponse={responses[bIdx]}
              onResponse={(response) => setResponses((prev) => ({ ...prev, [bIdx]: response }))} />
          : <MCBlock key={`${bIdx}:${qIdx}`} block={block} listening={listening}
              bIdx={bIdx} qIdx={qIdx} answers={answers} phase={phase} wide={wide}
              onSelect={(k, v) => setAnswers((a) => ({ ...a, [k]: v }))} />}
    </div>
  );
}

// MC section: NO live feedback. Answers are collected silently across all
// blocks and questions, then handed up for the end-of-section review.
// `answers` is keyed "bIdx:qIdx" -> chosen option index, owned by DomainRunner.
function MCBlock({ block, listening, bIdx, qIdx, answers, onSelect, phase, wide }) {
  const key = `${bIdx}:${qIdx}`;
  const picked = answers[key];

  if (listening && phase === "pre") {
    return (
      <div style={examPane}>
        <div style={paneLabel}>Directions</div>
        <p style={{ margin: "0 0 10px", fontSize: 15.5, lineHeight: 1.6 }}>{block.intro}</p>
        <p style={{ margin: 0, fontSize: 13, color: C.mute, lineHeight: 1.55 }}>
          Select <b>Play</b> above to hear the recording. It plays <b>once</b>. When it
          finishes, answer the question. You will not be able to replay it.
        </p>
      </div>
    );
  }
  if (listening && (phase === "playing" || phase === "played")) {
    return (
      <div style={{ ...examPane, borderLeft: `3px solid ${C.gold}` }}>
        <div style={{ ...paneLabel, color: C.gold }}>
          {phase === "playing" ? "Now playing — listen carefully" : "Recording finished"}
        </div>
        {phase === "playing"
          ? <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
              <span style={{ display: "inline-flex", gap: 3 }}>
                {[0,1,2,3].map((i) => (
                  <span key={i} style={{ width: 4, height: 18, borderRadius: 2, background: C.gold,
                    animation: `eq 0.9s ${i * 0.12}s ease-in-out infinite alternate` }} />
                ))}
              </span>
              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, color: C.gold }}>
                Playing audio…
              </span>
            </div>
          : <p style={{ margin: 0, fontSize: 13.5, color: C.mute }}>
              The recording has played. Answer the question below.
            </p>}
      </div>
    );
  }

  const hasSource = !listening && (block.passage || block.scene);

  const questionPane = (
    <div style={{ ...examPane, flex: "1 1 300px", minWidth: 0,
      minHeight: wide && hasSource ? 500 : undefined }}>
      <div style={paneLabel}>Question {qIdx + 1} of {block.qs.length}</div>
      <p style={{ fontSize: 16, lineHeight: 1.5, margin: "0 0 16px", fontWeight: 600 }}>
        {block.qs[qIdx].stem}
      </p>
      <div>
        {block.qs[qIdx].options.map((opt, i) => {
          const isPick = picked === i;
          return (
            <button key={i} onClick={() => onSelect(key, i)}
              style={{ display: "flex", alignItems: "flex-start", gap: 10, width: "100%",
                textAlign: "left", padding: "10px 12px", marginBottom: 6, borderRadius: 3,
                border: `1px solid ${isPick ? C.moss : C.line}`,
                background: isPick ? C.mossSoft : "transparent", cursor: "pointer",
                fontFamily: "inherit", fontSize: 15, color: C.ink, lineHeight: 1.45 }}>
              <span style={{ width: 15, height: 15, borderRadius: 99, flexShrink: 0,
                border: `1.5px solid ${isPick ? C.moss : C.line}`, marginTop: 2,
                display: "grid", placeItems: "center" }}>
                {isPick && <span style={{ width: 7, height: 7, borderRadius: 99, background: C.moss }} />}
              </span>
              <span style={{ flex: 1 }}>
                <b style={{ fontFamily: "ui-monospace, monospace", fontSize: 12.5, marginRight: 6,
                  color: C.mute }}>{String.fromCharCode(65 + i)}</b>
                {opt}
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 10, fontFamily: "ui-monospace, monospace", fontSize: 11,
        color: C.mute }}>
        {picked === undefined ? "Not answered" : "Answer recorded — you can change it before submitting"}
      </div>
    </div>
  );

  if (!hasSource) return questionPane;

  const sourcePane = (
    <div style={{ ...examPane, flex: "1 1 300px", minWidth: 0,
      minHeight: wide ? 500 : undefined, maxHeight: wide ? 600 : 340, overflowY: "auto" }}>
      <div style={paneLabel}>{block.topic}</div>
      {block.scene && <Scene name={block.scene} />}
      {block.passage && (
        <p style={{ fontSize: 15, lineHeight: 1.75, margin: 0 }}>{block.passage}</p>
      )}
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap",
      flexDirection: wide ? "row" : "column" }}>
      {sourcePane}
      {questionPane}
    </div>
  );
}

// End-of-section review: every question, the student's answer, the correct
// answer, and mistakes flagged. Shown only after the whole section is submitted.
// Full review: every block with its passage/picture/transcript, every question
// with all options — the correct one marked, the student's wrong pick flagged.
// Used both after submitting a section and when reopening a test from history.
function MCReview({ blocks, answers, listening }) {
  let n = 0;
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {blocks.map((block, bIdx) => (
        <div key={bIdx} style={examPane}>
          <div style={paneLabel}>{block.task} — {block.topic}</div>

          {block.scene && <Scene name={block.scene} />}
          {block.passage && (
            <p style={{ fontSize: 13.5, lineHeight: 1.65, margin: "0 0 12px", color: C.ink,
              background: C.paper, border: `1px solid ${C.line}`, borderRadius: 3,
              padding: "10px 12px" }}>{block.passage}</p>
          )}
          {listening && block.transcript && (
            <div style={{ margin: "0 0 12px", background: C.paper,
              border: `1px solid ${C.line}`, borderRadius: 3, padding: "10px 12px" }}>
              <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 10, letterSpacing: 1.4,
                textTransform: "uppercase", color: C.mute, marginBottom: 6 }}>
                Transcript (shown for review only)
              </div>
              <p style={{ whiteSpace: "pre-line", fontSize: 13.5, lineHeight: 1.65, margin: 0,
                color: C.ink }}>{block.transcript}</p>
            </div>
          )}

          {block.qs.map((q, qIdx) => {
            n += 1;
            const picked = answers[`${bIdx}:${qIdx}`];
            const correct = picked === q.answer;
            const unanswered = picked === undefined;
            return (
              <div key={qIdx} style={{ padding: "12px 0",
                borderTop: `1px solid ${C.line}` }}>
                <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12,
                    color: unanswered ? C.mute : correct ? C.moss : C.clay, fontWeight: 700,
                    minWidth: 30 }}>
                    {unanswered ? "–" : correct ? "✓" : "✕"} {String(n).padStart(2, " ")}
                  </span>
                  <span style={{ fontSize: 14.5, fontWeight: 600, flex: 1 }}>{q.stem}</span>
                </div>
                <div style={{ marginLeft: 38, display: "grid", gap: 4 }}>
                  {q.options.map((opt, i) => {
                    const isAns = i === q.answer;
                    const isPick = picked === i;
                    const wrongPick = isPick && !isAns;
                    return (
                      <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline",
                        padding: "6px 10px", borderRadius: 3, fontSize: 13.5, lineHeight: 1.45,
                        background: isAns ? C.mossSoft : wrongPick ? C.claySoft : "transparent",
                        border: `1px solid ${isAns ? C.moss : wrongPick ? C.clay : "transparent"}` }}>
                        <b style={{ fontFamily: "ui-monospace, monospace", fontSize: 12,
                          color: isAns ? C.moss : wrongPick ? C.clay : C.mute }}>
                          {String.fromCharCode(65 + i)}
                        </b>
                        <span style={{ flex: 1 }}>{opt}</span>
                        {isAns && <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11,
                          color: C.moss, fontWeight: 700 }}>correct</span>}
                        {wrongPick && <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 11,
                          color: C.clay, fontWeight: 700 }}>your answer</span>}
                      </div>
                    );
                  })}
                  {unanswered && (
                    <div style={{ fontSize: 12, color: C.mute, fontStyle: "italic" }}>Not answered</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function WriteBlock({ block, onDone, onBack, canBack, setNav, onResponse, initialResponse }) {
  const [val, setVal] = useState(() => initialResponse?.text || "");
  const wide = useIsWide();
  useEffect(() => {
    setNav && setNav({ back: onBack, next: onDone,
      canBack, canNext: !!val.trim(), nextLabel: "Next" });
  }, [val, canBack]);

  const answerPane = (
    <div style={{ ...examPane, flex: "1 1 320px", minWidth: 0,
      minHeight: wide ? 520 : undefined, display: "flex", flexDirection: "column" }}>
      <div style={paneLabel}>Response</div>
      <p style={{ fontSize: 16, lineHeight: 1.55, margin: "0 0 14px", fontWeight: 600 }}>{block.stem}</p>
      <textarea value={val} onChange={(e) => {
        const next = e.target.value;
        setVal(next);
        onResponse && onResponse({ type: "writing", text: next });
      }}
        placeholder="Type your response here." rows={block.minWords > 12 ? 8 : 4}
        style={{ ...textInput, resize: "vertical", flex: wide ? "1 1 auto" : undefined,
          minHeight: wide ? (block.minWords > 12 ? 260 : 180) : undefined }} />
      <div style={{ fontSize: 12.5, color: C.mute, margin: "8px 0 0", lineHeight: 1.5 }}>{block.hint}</div>
    </div>
  );

  if (!block.scene) return answerPane;

  const visualPane = (
    <div style={{ ...examPane, flex: "1 1 350px", minWidth: 0,
      minHeight: wide ? 520 : undefined }}>
      <div style={paneLabel}>{block.topic}</div>
      <Scene name={block.scene} displayHeight={wide ? "clamp(340px, 38dvh, 420px)" : undefined} />
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap",
      flexDirection: wide ? "row" : "column" }}>
      {visualPane}{answerPane}
    </div>
  );
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function SpeakBlock({ block, onDone, setNav, onResponse, initialResponse, setNum, span }) {
  const isSummary = block.task === "Summarize an Academic Presentation";
  const [recState, setRecState] = useState(() => initialResponse?.audio ? "done" : "idle");
  const [audioURL, setAudioURL] = useState(() => initialResponse?.audio || null);
  const [errMsg, setErrMsg] = useState("");
  const [presentationState, setPresentationState] = useState(() =>
    !isSummary ? "not-needed"
      : (initialResponse?.presentationPlayed || initialResponse?.audio ? "played" : "ready")
  );
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const stopPresentationRef = useRef(null);

  function playPresentationOnce() {
    if (!isSummary || presentationState !== "ready" || !block.presentation) return;
    setPresentationState("playing");
    stopPresentationRef.current = playListening(
      { setNum, span, topic: block.topic, transcript: block.presentation },
      { onEnd: () => {
        stopPresentationRef.current = null;
        setPresentationState("played");
        onResponse && onResponse({ type: "speaking", presentationPlayed: true });
      } }
    );
  }

  useEffect(() => () => {
    if (stopPresentationRef.current) stopPresentationRef.current();
  }, []);

  async function start() {
    if (isSummary && presentationState !== "played") return;
    if (stopPresentationRef.current) {
      stopPresentationRef.current();
      stopPresentationRef.current = null;
    }
    // Capability checks first — gives a precise reason instead of a generic failure.
    if (typeof navigator === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrMsg("This preview frame blocks microphone access. Open the app in its own browser tab (or the published version) to record. You can still practice aloud and continue.");
      setRecState("error"); return;
    }
    if (typeof MediaRecorder === "undefined") {
      setErrMsg("Audio recording isn't supported in this browser. Practice aloud and continue.");
      setRecState("error"); return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        setAudioURL(URL.createObjectURL(blob));
        const audioData = await blobToDataUrl(blob);
        onResponse && onResponse({ type: "speaking", audio: audioData, mimeType: blob.type,
          ...(isSummary ? { presentationPlayed: true } : {}) });
        stream.getTracks().forEach((t) => t.stop());
        setRecState("done");
      };
      rec.start();
      setRecState("recording");
    } catch (err) {
      const name = err && err.name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setErrMsg("Microphone permission was denied. Allow microphone access in your browser's address bar, then press Record again. (In this chat preview the mic is often blocked — open the app in its own tab to record.)");
      } else if (name === "NotFoundError") {
        setErrMsg("No microphone was found on this device. Practice aloud and continue.");
      } else {
        setErrMsg("Microphone unavailable in this frame. Open the app in its own browser tab to record. You can still practice aloud and continue.");
      }
      setRecState("error");
    }
  }
  function stop() { if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop(); }

  const wide = useIsWide();
  useEffect(() => {
    setNav && setNav({ back: null, next: onDone,
      canBack: false, canNext: recState !== "recording"
        && (!isSummary || presentationState === "played"), nextLabel: "Next" });
  }, [recState, isSummary, presentationState]);

  const taskPane = (
    <div style={{ ...examPane, flex: "1 1 320px", minWidth: 0 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <div style={{ fontFamily:"ui-monospace, monospace", fontSize:11, letterSpacing:1.5,
          textTransform:"uppercase", color:C.clay }}>Spoken response — recorded</div>
        <div style={{ fontFamily:"ui-monospace, monospace", fontSize:11, color:C.mute }}>response practice</div>
      </div>
      <p style={{ fontSize:16.5, lineHeight:1.55, margin:"0 0 14px", fontWeight:600 }}>{block.prompt}</p>
      <div style={{ fontSize:13, color:C.mute, marginBottom:14 }}>
        To score well: {block.checks.join(" · ")}
      </div>

      {isSummary && (
        <div style={{ border: `1px solid ${presentationState === "played" ? C.moss : C.gold}`,
          background: presentationState === "played" ? C.mossSoft : C.goldSoft,
          borderRadius: 4, padding: "14px 15px", marginBottom: 16 }}>
          <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 10.5,
            letterSpacing: 1.5, textTransform: "uppercase", color: C.ink, marginBottom: 7 }}>
            Academic presentation · plays once
          </div>
          {presentationState === "ready" && (
            <div>
              <div style={{ fontSize: 13.5, lineHeight: 1.5, color: C.mute, marginBottom: 10 }}>
                Listen carefully. Recording unlocks after the presentation finishes.
              </div>
              <button type="button" onClick={playPresentationOnce} style={smallPrimary}>
                ▶ Play presentation
              </button>
            </div>
          )}
          {presentationState === "playing" && (
            <div role="status" style={{ display: "flex", alignItems: "center", gap: 10,
              fontSize: 13.5, color: C.ink }}>
              <span style={{ width: 10, height: 10, borderRadius: 99, background: C.gold,
                display: "inline-block" }} />
              Playing presentation… listen until it finishes.
            </div>
          )}
          {presentationState === "played" && (
            <div style={{ fontSize: 13.5, lineHeight: 1.5, color: C.moss, fontWeight: 700 }}>
              ✓ Presentation complete. Record your summary below.
            </div>
          )}
        </div>
      )}

      {recState === "idle" && <button onClick={start}
        disabled={isSummary && presentationState !== "played"}
        style={{ ...smallPrimary, background:C.clay,
          opacity: isSummary && presentationState !== "played" ? 0.42 : 1,
          cursor: isSummary && presentationState !== "played" ? "not-allowed" : "pointer" }}>
        ● Record
      </button>}
      {recState === "recording" && (
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ width:12, height:12, borderRadius:99, background:C.clay, display:"inline-block" }} />
          <span style={{ fontFamily:"ui-monospace, monospace", fontSize:13, color:C.clay }}>Recording…</span>
          <button onClick={stop} style={smallPrimary}>■ Stop</button>
        </div>
      )}
      {recState === "done" && audioURL && (
        <div>
          <audio controls src={audioURL} style={{ width:"100%", marginBottom:10 }} />
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            <a href={audioURL} download={`speaking-${block.topic}.webm`}
              style={{ ...ghostBtn, textDecoration:"none", padding:"9px 14px", display:"inline-block" }}>⤓ Save</a>
            <button onClick={() => {
              setAudioURL(null);
              setRecState("idle");
              onResponse && onResponse({ type: "speaking",
                ...(isSummary ? { presentationPlayed: true } : {}) });
            }}
              style={{ ...ghostBtn, padding:"9px 14px" }}>↺ Re-record</button>
          </div>
          <div style={{ fontSize:12.5, color:C.mute, marginTop:10 }}>
            This recording is saved only in this browser on this device and is never uploaded.
            You can also download a copy to keep or share with your teacher.
          </div>
        </div>
      )}
      {recState === "error" && (
        <div>
          <Note text={errMsg} tone="clay" />
          <button onClick={() => { setErrMsg(""); setRecState("idle"); }}
            style={{ ...ghostBtn, padding: "8px 14px", marginTop: 10 }}>Try microphone again</button>
        </div>
      )}
    </div>
  );

  if (!block.scene) return taskPane;

  const visualPane = (
    <div style={{ ...examPane, flex: "1 1 350px", minWidth: 0 }}>
      <div style={paneLabel}>{block.topic}</div>
      <Scene name={block.scene} />
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap",
      flexDirection: wide ? "row" : "column" }}>
      {visualPane}{taskPane}
    </div>
  );
}

// Opens a saved attempt as a full test-review page. The questions live in the
// app's banks; the attempt supplies the student's answers — so we rebuild the
// whole test view and mark every question.
function AttemptReview({ attempt, onBack }) {
  const DOM_LABEL = { listening: "Listening", reading: "Reading",
    speaking: "Speaking", writing: "Writing" };
  const fmt = (ts) => new Date(ts).toLocaleDateString(undefined,
    { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  const blocks = (BANKS[attempt.setNum] && BANKS[attempt.setNum][attempt.span]
    && BANKS[attempt.setNum][attempt.span][attempt.domain]) || null;
  const items = attempt.items || [];
  const isProduction = attempt.domain === "writing" || attempt.domain === "speaking";

  // Rebuild the answers map by walking blocks in the same order items were saved.
  let usable = false;
  const answers = {};
  if (!isProduction && blocks) {
    const totalQ = blocks.reduce((a, b) => a + (b.qs ? b.qs.length : 0), 0);
    if (totalQ === items.length) {
      usable = true;
      let i = 0;
      blocks.forEach((b, bi) => b.qs.forEach((q, qi) => {
        const it = items[i++];
        if (it && it.picked != null) answers[`${bi}:${qi}`] = it.picked;
      }));
    }
  }

  return (
    <div>
      <Back onClick={onBack} label="history" />
      <div style={{ ...examPane, marginBottom: 12, display: "flex",
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 700 }}>
            {attempt.spanLabel} · Set {attempt.setNum} · {DOM_LABEL[attempt.domain]}
          </div>
          <div style={{ fontSize: 12, color: C.mute, fontFamily: "ui-monospace, monospace",
            marginTop: 3 }}>{fmt(attempt.ts)}</div>
        </div>
        {attempt.correct != null && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: C.moss,
              fontFamily: "ui-monospace, monospace" }}>{attempt.correct}/{attempt.total}</div>
            <div style={{ fontSize: 11, color: C.mute, fontFamily: "ui-monospace, monospace" }}>
              {Math.round((attempt.correct / attempt.total) * 100)}%
            </div>
          </div>
        )}
      </div>

      {isProduction ? (
        <ProductionReview attempt={attempt} blocks={blocks} />
      ) : usable ? (
        <MCReview blocks={blocks} answers={answers} listening={attempt.domain === "listening"} />
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          <div style={{ ...examPane, fontSize: 12.5, color: C.mute, fontStyle: "italic" }}>
            This attempt was taken on an older version of the test content, so the full
            question view isn't available — showing the saved summary instead.
          </div>
          {items.map((it, i) => (
            <div key={i} style={{ ...examPane, padding: "10px 14px" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, fontWeight: 700,
                  color: it.picked === null ? C.mute : it.correct ? C.moss : C.clay }}>
                  {it.picked === null ? "–" : it.correct ? "✓" : "✕"}
                </span>
                <span style={{ fontSize: 14, flex: 1 }}>{it.stem}</span>
              </div>
              {it.picked !== null && !it.correct && (
                <div style={{ marginLeft: 20, fontSize: 12.5, color: C.clay }}>
                  You chose {String.fromCharCode(65 + it.picked)} · correct is {String.fromCharCode(65 + it.answer)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductionReview({ attempt, blocks }) {
  const isSpeaking = attempt.domain === "speaking";
  const items = Array.isArray(attempt.items) ? attempt.items : [];
  const total = Math.max(items.length, blocks ? blocks.length : 0);

  if (!total) {
    return (
      <div style={{ ...examPane, color: C.mute, fontStyle: "italic" }}>
        This section was completed before responses were saved.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.length === 0 && (
        <div style={{ ...examPane, color: C.mute, fontStyle: "italic" }}>
          This section was completed before responses were saved.
        </div>
      )}
      {Array.from({ length: total }).map((_, i) => {
        const block = blocks?.[i] || {};
        const item = items[i] || {};
        const response = item.response || null;
        const text = response && typeof response === "object" ? response.text : null;
        const audio = response && typeof response === "object" ? response.audio : null;
        const prompt = item.prompt || block.stem || block.prompt || "Practice prompt";
        const topic = item.topic || block.topic || "Practice task";
        const taskLabel = item.task || block.task || (attempt.domain + " task " + (i + 1));

        return (
          <div key={i} style={examPane}>
            <div style={paneLabel}>{taskLabel} · {topic}</div>
            <div style={{ fontSize: 15, lineHeight: 1.55, fontWeight: 600, marginBottom: 14 }}>
              {prompt}
            </div>
            <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 10.5,
              letterSpacing: 1.4, textTransform: "uppercase", color: C.mute, marginBottom: 7 }}>
              Your response
            </div>
            {isSpeaking ? (
              audio ? (
                <div>
                  <audio controls src={audio} style={{ width: "100%" }} />
                  <a href={audio} download={"speaking-" + topic + ".webm"}
                    style={{ ...ghostBtn, display: "inline-block", marginTop: 8, textDecoration: "none" }}>
                    ⤓ Save recording
                  </a>
                </div>
              ) : (
                <div style={{ color: C.mute, fontStyle: "italic" }}>
                  No recording was saved for this task.
                </div>
              )
            ) : (
              <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: text ? C.ink : C.mute,
                fontStyle: text ? "normal" : "italic" }}>
                {text || "No written response was saved for this task."}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Line chart of scored-section accuracy over time (reading + listening).
function PerformanceChart({ attempts }) {
  const scored = (attempts || [])
    .filter((a) => a.correct != null && a.total)
    .slice().sort((a, b) => a.ts - b.ts);
  if (!scored.length) return null;

  const W = 640, H = 200, padL = 36, padR = 12, padT = 16, padB = 30;
  const iw = W - padL - padR, ih = H - padT - padB;
  const x = (i) => scored.length === 1 ? padL + iw / 2 : padL + (i / (scored.length - 1)) * iw;
  const y = (pct) => padT + (1 - pct / 100) * ih;
  const pts = scored.map((a, i) => ({
    x: x(i), pct: Math.round((a.correct / a.total) * 100), dom: a.domain, ts: a.ts,
  })).map((p) => ({ ...p, y: y(p.pct) }));
  const path = pts.map((p, i) => (i ? "L" : "M") + p.x.toFixed(1) + " " + p.y.toFixed(1)).join(" ");
  const DCOL = { reading: C.moss, listening: C.gold };
  const fmt = (ts) => new Date(ts).toLocaleDateString(undefined, { month: "numeric", day: "numeric" });
  const showDates = scored.length <= 8;

  return (
    <div style={{ ...examPane, marginBottom: 12 }}>
      <div style={paneLabel}>Performance over time — scored sections</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        {[0, 25, 50, 75, 100].map((g) => (
          <g key={g}>
            <line x1={padL} y1={y(g)} x2={W - padR} y2={y(g)} stroke={C.line} strokeWidth="1" />
            <text x={padL - 7} y={y(g) + 3.5} fontSize="10" fill={C.mute} textAnchor="end"
              fontFamily="monospace">{g}</text>
          </g>
        ))}
        <line x1={padL} y1={y(85)} x2={W - padR} y2={y(85)} stroke={C.moss} strokeWidth="1.2"
          strokeDasharray="5 4" opacity="0.6" />
        <text x={W - padR} y={y(85) - 5} fontSize="9.5" fill={C.moss} textAnchor="end"
          fontFamily="monospace">85% exit-ready</text>
        {pts.length > 1 && (
          <path d={path} fill="none" stroke={C.ink} strokeWidth="1.5" opacity="0.3" />
        )}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5.5" fill={DCOL[p.dom] || C.clay}
              stroke={C.card} strokeWidth="1.5" />
            <text x={p.x} y={p.y - 10} fontSize="10.5" fill={C.ink} textAnchor="middle"
              fontFamily="monospace" fontWeight="700">{p.pct}</text>
            {showDates && (
              <text x={p.x} y={H - 9} fontSize="9.5" fill={C.mute} textAnchor="middle"
                fontFamily="monospace">{fmt(p.ts)}</text>
            )}
          </g>
        ))}
        {!showDates && (
          <g>
            <text x={padL} y={H - 9} fontSize="9.5" fill={C.mute} textAnchor="start"
              fontFamily="monospace">{fmt(scored[0].ts)}</text>
            <text x={W - padR} y={H - 9} fontSize="9.5" fill={C.mute} textAnchor="end"
              fontFamily="monospace">{fmt(scored[scored.length - 1].ts)}</text>
          </g>
        )}
      </svg>
      <div style={{ display: "flex", gap: 16, marginTop: 8, alignItems: "center" }}>
        <LegendDot color={C.moss} label="Reading" />
        <LegendDot color={C.gold} label="Listening" />
        <span style={{ fontSize: 11.5, color: C.mute, fontStyle: "italic" }}>
          Speaking and writing are response-only question banks, so they appear in history without a score.
        </span>
      </div>
      {scored.length === 1 && (
        <div style={{ fontSize: 12.5, color: C.mute, marginTop: 8, fontStyle: "italic" }}>
          One scored section so far — the line appears once there are two or more.
        </div>
      )}
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "ui-monospace, monospace", fontSize: 11.5, color: C.ink }}>
      <span style={{ width: 10, height: 10, borderRadius: 99, background: color }} />
      {label}
    </span>
  );
}

function MePanel({ user, onBack }) {
  const [attempts, setAttempts] = useState(null);
  const [review, setReview] = useState(null);

  useEffect(() => {
    (async () => {
      const keys = await storeList(`attempt:${user.id}:`);
      const list = [];
      for (const k of keys) {
        const raw = await storeGet(k);
        if (raw) { try { list.push(JSON.parse(raw)); } catch {} }
      }
      list.sort((a, b) => b.ts - a.ts);
      setAttempts(list);
    })();
  }, [user.id]);

  const DOM_LABEL = { listening: "Listening", reading: "Reading", speaking: "Speaking", writing: "Writing" };
  const fmtDate = (ts) => new Date(ts).toLocaleDateString(undefined,
    { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  // aggregate stats
  let mcAttempts = 0, mcCorrect = 0, mcTotal = 0;
  const weak = {};   // topic -> misses
  (attempts || []).forEach((a) => {
    if (a.correct != null && a.total != null) { mcAttempts += 1; mcCorrect += a.correct; mcTotal += a.total; }
    (a.items || []).forEach((it) => { if (it.picked !== null && !it.correct) weak[it.topic] = (weak[it.topic] || 0) + 1; });
  });
  const weakList = Object.entries(weak).sort((a, b) => b[1] - a[1]).slice(0, 6);

  if (review) return <AttemptReview attempt={review} onBack={() => setReview(null)} />;

  return (
    <div>
      <Back onClick={onBack} label="back" />
      <div style={{ ...examPane, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 99, background: C.mossSoft, color: C.moss,
            display: "grid", placeItems: "center", fontSize: 15, fontWeight: 700,
            fontFamily: "ui-monospace, monospace" }}>{user.name.slice(0, 2).toLowerCase()}</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: C.mute, fontFamily: "ui-monospace, monospace" }}>
              {attempts == null ? "loading…" : `${attempts.length} section${attempts.length === 1 ? "" : "s"} completed`}
            </div>
          </div>
        </div>
        {mcTotal > 0 && (
          <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
            <Stat label="Reading + Listening" value={`${mcCorrect}/${mcTotal}`} />
            <Stat label="Accuracy" value={`${Math.round((mcCorrect / mcTotal) * 100)}%`} />
            <Stat label="Scored sections" value={String(mcAttempts)} />
          </div>
        )}
      </div>

      <PerformanceChart attempts={attempts} />

      {weakList.length > 0 && (
        <div style={{ ...examPane, marginBottom: 12 }}>
          <div style={paneLabel}>Weak spots — topics missed most</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {weakList.map(([topic, n]) => (
              <span key={topic} style={{ fontFamily: "ui-monospace, monospace", fontSize: 12,
                background: C.claySoft, color: C.clay, padding: "5px 10px", borderRadius: 3 }}>
                {topic} · {n}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={paneLabel}>Test history</div>
      {attempts == null ? (
        <div style={{ ...examPane, color: C.mute, fontStyle: "italic" }}>Loading your history…</div>
      ) : attempts.length === 0 ? (
        <div style={{ ...examPane, color: C.mute }}>
          No completed sections yet. Finish a domain and it will be saved here.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {attempts.map((a) => {
            const hasItems = Array.isArray(a.items) && a.items.length > 0;
            const canReview = hasItems || a.domain === "writing" || a.domain === "speaking";
            return (
              <div key={a.ts} style={examPane}>
                <button onClick={() => canReview && setReview(a)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                    width: "100%", background: "none", border: "none", cursor: canReview ? "pointer" : "default",
                    padding: 0, fontFamily: "inherit", textAlign: "left" }}>
                  <span>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>
                      {a.spanLabel} · Set {a.setNum} · {DOM_LABEL[a.domain]}
                    </span>
                    <span style={{ display: "block", fontSize: 11.5, color: C.mute,
                      fontFamily: "ui-monospace, monospace", marginTop: 2 }}>{fmtDate(a.ts)}</span>
                  </span>
                  <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, color: C.moss }}>
                    {a.correct != null ? `${a.correct}/${a.total}` : "done"}
                    {canReview && <span style={{ color: C.mute, marginLeft: 8 }}>view →</span>}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.moss,
        fontFamily: "ui-monospace, monospace" }}>{value}</div>
      <div style={{ fontSize: 11, color: C.mute, textTransform: "uppercase", letterSpacing: 1,
        fontFamily: "ui-monospace, monospace" }}>{label}</div>
    </div>
  );
}

function Back({ onClick, label }) {
  return <button onClick={onClick} style={{ ...ghostBtn, marginBottom:14 }}>← {label}</button>;
}
function Note({ text, tone }) {
  const c = tone === "moss" ? C.moss : C.clay;
  const bg = tone === "moss" ? C.mossSoft : C.claySoft;
  return <div style={{ marginTop:12, padding:"9px 12px", background:bg, borderRadius:7, color:c,
    fontSize:13.5, fontFamily:"ui-monospace, monospace" }}>{text}</div>;
}

const card = { background:C.card, border:`1px solid ${C.line}`, borderRadius:4,
  padding:"20px", marginBottom:16 };
const examPane = { background:C.card, border:`1px solid ${C.line}`, borderRadius:4,
  padding:"16px 18px" };
const paneLabel = { fontFamily:"ui-monospace, monospace", fontSize:10.5, letterSpacing:1.6,
  textTransform:"uppercase", color:C.mute, marginBottom:10,
  borderBottom:`1px solid ${C.line}`, paddingBottom:7 };
const examBtn = { background:"transparent", border:`1px solid ${C.line}`, color:C.ink,
  padding:"4px 12px", borderRadius:3, cursor:"pointer",
  fontFamily:"ui-monospace, monospace", fontSize:11.5, letterSpacing:0.3 };
const rowCard = { ...card, marginBottom:0, display:"flex", justifyContent:"space-between",
  alignItems:"center", cursor:"pointer", width:"100%", fontFamily:"inherit", textAlign:"left" };
const primaryBtn = { background:C.moss, color:"#fff", border:"none", padding:"12px 22px",
  borderRadius:3, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" };
const smallPrimary = { background:C.moss, color:"#fff", border:"none", padding:"9px 18px",
  borderRadius:3, fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit" };
const ghostBtn = { background:"transparent", border:`1px solid ${C.line}`, color:C.mute,
  padding:"6px 12px", borderRadius:3, cursor:"pointer", fontFamily:"ui-monospace, monospace",
  fontSize:12 };
const meBtn = { background:"transparent", border:`1.5px solid ${C.line}`, borderRadius:99,
  padding:5, cursor:"pointer", display:"grid", placeItems:"center" };
const optBtn = { textAlign:"left", padding:"12px 14px", borderRadius:9, border:"1.5px solid",
  borderColor:C.line, fontSize:15, cursor:"pointer", fontFamily:"inherit", width:"100%",
  color:C.ink, background:C.card };
const textInput = { width:"100%", padding:"11px 13px", borderRadius:3,
  border:`1.5px solid ${C.line}`, fontSize:15, fontFamily:"inherit", background:C.card,
  color:C.ink, boxSizing:"border-box" };
