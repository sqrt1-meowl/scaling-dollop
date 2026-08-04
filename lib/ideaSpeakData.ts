export type Question = {
  prompt: string;
  choices: string[];
  answer: string;
};

export type Scenario = {
  slug: string;
  title: string;
  description: string;
  situation: string;
  conversation: string[];
  usefulSentence: string;
  usefulPhrases: string[];
  checkMeaning: Question;
  bestResponse: Question;
  yourTurnPrompt: string;
};

export type ScenarioCategory = {
  slug: string;
  title: string;
  description: string;
  scenarios: Scenario[];
};

function makeScenario(input: Scenario): Scenario {
  return input;
}

export const categories: ScenarioCategory[] = [
  {
    slug: "talk-to-teachers",
    title: "Talk to Teachers",
    description: "Ask for help, explain confusion, and talk after class.",
    scenarios: [
      makeScenario({
        slug: "ask-teacher-for-help",
        title: "Ask a teacher for help",
        description: "Ask when classwork or homework feels confusing.",
        situation: "You are in math class. You do not understand the homework. You want to ask your teacher for help.",
        conversation: [
          "Student: Excuse me, could you help me with this question?",
          "Teacher: Sure. Which part is confusing?",
          "Student: I understand the first step, but I do not know what to do next."
        ],
        usefulSentence: "I do not understand this part. Could you explain it again?",
        usefulPhrases: ["Excuse me.", "Could you help me?", "I do not understand this part.", "Could you explain it again?"],
        checkMeaning: {
          prompt: "What does the student need?",
          choices: ["Help with homework", "A lunch table", "A ride home"],
          answer: "Help with homework"
        },
        bestResponse: {
          prompt: "Your teacher explains too fast. What should you say?",
          choices: ["Could you say that again more slowly?", "I hate this class.", "Never mind."],
          answer: "Could you say that again more slowly?"
        },
        yourTurnPrompt: "You do not understand a homework problem. What would you say to your teacher?"
      }),
      makeScenario({
        slug: "tell-teacher-you-do-not-understand",
        title: "Tell a teacher you do not understand",
        description: "Use clear words when directions are hard.",
        situation: "Your teacher gives directions for an assignment. You are not sure what to do first.",
        conversation: [
          "Student: I am sorry. I do not understand the directions.",
          "Teacher: That is okay. First, read the paragraph.",
          "Student: Thank you. Then do I answer the questions?"
        ],
        usefulSentence: "I do not understand the directions. What do I do first?",
        usefulPhrases: ["I do not understand.", "What do I do first?", "Can you say that again?", "Thank you."],
        checkMeaning: {
          prompt: "What does the student not understand?",
          choices: ["The directions", "The lunch menu", "The bus route"],
          answer: "The directions"
        },
        bestResponse: {
          prompt: "You missed the first direction. What should you say?",
          choices: ["What do I do first?", "This is boring.", "I am leaving."],
          answer: "What do I do first?"
        },
        yourTurnPrompt: "Your teacher gives directions too quickly. What would you say?"
      }),
      makeScenario({
        slug: "ask-for-more-time",
        title: "Ask for more time",
        description: "Ask politely when you need a little longer.",
        situation: "You are finishing a short writing assignment. The teacher says time is almost over.",
        conversation: [
          "Student: Could I have two more minutes, please?",
          "Teacher: Yes, two more minutes.",
          "Student: Thank you. I want to finish my last sentence."
        ],
        usefulSentence: "Could I have a little more time, please?",
        usefulPhrases: ["Could I have more time?", "I am almost finished.", "Two more minutes, please.", "Thank you for waiting."],
        checkMeaning: {
          prompt: "What does the student ask for?",
          choices: ["More time", "More food", "A new seat"],
          answer: "More time"
        },
        bestResponse: {
          prompt: "You are not done yet. What is polite to say?",
          choices: ["Could I have a little more time, please?", "Wait. I am busy.", "Do not talk to me."],
          answer: "Could I have a little more time, please?"
        },
        yourTurnPrompt: "You need more time on a class assignment. What would you say?"
      }),
      makeScenario({
        slug: "talk-after-class",
        title: "Talk to a teacher after class",
        description: "Ask a short question when class is over.",
        situation: "Class just ended. You want to ask your teacher one question before going to lunch.",
        conversation: [
          "Student: Excuse me, do you have one minute?",
          "Teacher: Yes. What do you need?",
          "Student: I have a question about the homework."
        ],
        usefulSentence: "Do you have one minute? I have a question.",
        usefulPhrases: ["Do you have one minute?", "I have a question.", "Is now a good time?", "Thank you for helping me."],
        checkMeaning: {
          prompt: "When does the student talk to the teacher?",
          choices: ["After class", "At midnight", "During lunch only"],
          answer: "After class"
        },
        bestResponse: {
          prompt: "Your teacher looks busy. What should you ask first?",
          choices: ["Do you have one minute?", "Listen to me now.", "You must help me."],
          answer: "Do you have one minute?"
        },
        yourTurnPrompt: "You need to ask your teacher something after class. What would you say?"
      })
    ]
  },
  {
    slug: "talk-to-classmates",
    title: "Talk to Classmates",
    description: "Start conversations, ask about homework, and work in groups.",
    scenarios: [
      makeScenario({
        slug: "ask-about-homework",
        title: "Ask about homework",
        description: "Ask a classmate what the homework is.",
        situation: "You missed the homework directions. A classmate is packing their backpack.",
        conversation: [
          "Student: Hi, do you know what the homework is?",
          "Classmate: Yes. We need to finish page 42.",
          "Student: Thank you. Page 42?"
        ],
        usefulSentence: "Do you know what the homework is?",
        usefulPhrases: ["What is the homework?", "What page is it?", "When is it due?", "Thank you."],
        checkMeaning: {
          prompt: "What does the student ask about?",
          choices: ["Homework", "Lunch", "Sports"],
          answer: "Homework"
        },
        bestResponse: {
          prompt: "You forgot the page number. What should you say?",
          choices: ["What page is it?", "I do not care.", "Give me yours."],
          answer: "What page is it?"
        },
        yourTurnPrompt: "You are not sure about tonight's homework. What would you ask?"
      }),
      makeScenario({
        slug: "work-with-a-partner",
        title: "Work with a partner",
        description: "Plan simple work with another student.",
        situation: "Your teacher says to work with a partner. You need to decide who will do each part.",
        conversation: [
          "Student: Do you want to read first?",
          "Partner: Sure. Can you write our answers?",
          "Student: Yes, I can write them."
        ],
        usefulSentence: "Do you want to read first? I can write our answers.",
        usefulPhrases: ["Do you want to read first?", "I can write.", "Can you help with this part?", "Let's work together."],
        checkMeaning: {
          prompt: "What are the students doing?",
          choices: ["Working with a partner", "Ordering lunch", "Calling home"],
          answer: "Working with a partner"
        },
        bestResponse: {
          prompt: "Your partner asks you to write. What is a good response?",
          choices: ["Yes, I can write.", "No, you are wrong.", "Stop talking."],
          answer: "Yes, I can write."
        },
        yourTurnPrompt: "You need to work with a partner. What would you say first?"
      }),
      makeScenario({
        slug: "join-a-group-project",
        title: "Join a group project",
        description: "Ask how you can help your group.",
        situation: "Your group already started a project. You want to join and help.",
        conversation: [
          "Student: Hi, how can I help?",
          "Classmate: We need someone to draw the poster.",
          "Student: I can do that."
        ],
        usefulSentence: "How can I help? I can do that.",
        usefulPhrases: ["How can I help?", "What should I do?", "I can do that.", "Can I join this part?"],
        checkMeaning: {
          prompt: "What does the student want to do?",
          choices: ["Help the group", "Leave school", "Buy food"],
          answer: "Help the group"
        },
        bestResponse: {
          prompt: "Your group needs someone to draw. What should you say?",
          choices: ["I can do that.", "That is your problem.", "I will not help."],
          answer: "I can do that."
        },
        yourTurnPrompt: "You join a group project late. What would you say?"
      }),
      makeScenario({
        slug: "ask-what-page",
        title: "Ask what page the class is on",
        description: "Ask quietly when you lose your place.",
        situation: "The class is reading. You lost the page number.",
        conversation: [
          "Student: Sorry, what page are we on?",
          "Classmate: Page 18.",
          "Student: Thanks."
        ],
        usefulSentence: "Sorry, what page are we on?",
        usefulPhrases: ["What page are we on?", "Where are we?", "Thank you.", "I found it."],
        checkMeaning: {
          prompt: "What does the student need?",
          choices: ["The page number", "A phone", "A pencil case"],
          answer: "The page number"
        },
        bestResponse: {
          prompt: "You lose your place during reading. What should you ask?",
          choices: ["What page are we on?", "Why are you reading?", "Close the book."],
          answer: "What page are we on?"
        },
        yourTurnPrompt: "You do not know what page the class is on. What would you say?"
      })
    ]
  },
  {
    slug: "make-friends",
    title: "Make Friends",
    description: "Practice greetings, lunch conversations, and small talk.",
    scenarios: [
      makeScenario({
        slug: "say-hi-to-someone-new",
        title: "Say hi to someone new",
        description: "Start with a simple friendly greeting.",
        situation: "You see a student from your class in the hallway. You want to say hi.",
        conversation: [
          "Student: Hi, I am new here. My name is Ana.",
          "Classmate: Hi Ana, I am Luis.",
          "Student: Nice to meet you."
        ],
        usefulSentence: "Hi, I am new here. My name is ___.",
        usefulPhrases: ["Hi.", "My name is ___.", "I am new here.", "Nice to meet you."],
        checkMeaning: {
          prompt: "What does the student say first?",
          choices: ["Hi", "Go away", "I forgot"],
          answer: "Hi"
        },
        bestResponse: {
          prompt: "A classmate says, 'Hi, I am Luis.' What should you say?",
          choices: ["Nice to meet you.", "Why?", "Stop."],
          answer: "Nice to meet you."
        },
        yourTurnPrompt: "You meet someone new at school. What would you say?"
      }),
      makeScenario({
        slug: "join-a-lunch-table",
        title: "Join a lunch table",
        description: "Ask if you can sit with classmates.",
        situation: "You are in the cafeteria. You want to sit with students from your class.",
        conversation: [
          "Student: Hi, is anyone sitting here?",
          "Classmate: No, you can sit here.",
          "Student: Thank you. Can I sit with you?"
        ],
        usefulSentence: "Hi, can I sit with you?",
        usefulPhrases: ["Is anyone sitting here?", "Can I sit with you?", "Thank you.", "What are you talking about?"],
        checkMeaning: {
          prompt: "Where is the student?",
          choices: ["Cafeteria", "Library", "Office"],
          answer: "Cafeteria"
        },
        bestResponse: {
          prompt: "You want to sit at a table. What is polite to ask?",
          choices: ["Can I sit with you?", "Move over now.", "This is my table."],
          answer: "Can I sit with you?"
        },
        yourTurnPrompt: "You want to join a lunch table. What would you say?"
      }),
      makeScenario({
        slug: "ask-about-weekend",
        title: "Ask about someone's weekend",
        description: "Use small talk to start a conversation.",
        situation: "It is Monday. You want to talk to a classmate before class starts.",
        conversation: [
          "Student: How was your weekend?",
          "Classmate: It was good. I went to the park.",
          "Student: That sounds fun."
        ],
        usefulSentence: "How was your weekend?",
        usefulPhrases: ["How was your weekend?", "That sounds fun.", "What did you do?", "My weekend was okay."],
        checkMeaning: {
          prompt: "What does the student ask about?",
          choices: ["The weekend", "A test score", "A bus ticket"],
          answer: "The weekend"
        },
        bestResponse: {
          prompt: "Your classmate says they went to the park. What can you say?",
          choices: ["That sounds fun.", "Why did you go?", "Be quiet."],
          answer: "That sounds fun."
        },
        yourTurnPrompt: "You want to start small talk on Monday. What would you ask?"
      }),
      makeScenario({
        slug: "start-conversation-after-class",
        title: "Start a conversation after class",
        description: "Talk for a short moment after class ends.",
        situation: "Class is over. You want to say something friendly to a classmate.",
        conversation: [
          "Student: That assignment was hard for me.",
          "Classmate: Same. I need to study tonight.",
          "Student: Maybe we can study together."
        ],
        usefulSentence: "Maybe we can study together.",
        usefulPhrases: ["That assignment was hard.", "How did you do it?", "Maybe we can study together.", "See you tomorrow."],
        checkMeaning: {
          prompt: "When does this conversation happen?",
          choices: ["After class", "At the store", "On the phone with the office"],
          answer: "After class"
        },
        bestResponse: {
          prompt: "A classmate says the assignment was hard. What is friendly?",
          choices: ["Maybe we can study together.", "That is your fault.", "Do not talk."],
          answer: "Maybe we can study together."
        },
        yourTurnPrompt: "You want to talk to a classmate after class. What would you say?"
      })
    ]
  },
  {
    slug: "speak-in-class",
    title: "Speak in Class",
    description: "Ask questions, share opinions, and give short answers.",
    scenarios: [
      makeScenario({
        slug: "raise-your-hand",
        title: "Raise your hand",
        description: "Ask to speak before answering.",
        situation: "The teacher asks a question. You think you know the answer.",
        conversation: [
          "Teacher: Who wants to try?",
          "Student: Can I try?",
          "Teacher: Yes, go ahead."
        ],
        usefulSentence: "Can I try?",
        usefulPhrases: ["Can I try?", "I think the answer is...", "I am not sure, but...", "May I answer?"],
        checkMeaning: {
          prompt: "What does the student want to do?",
          choices: ["Answer a question", "Order food", "Go home"],
          answer: "Answer a question"
        },
        bestResponse: {
          prompt: "You want to answer but you are not 100 percent sure. What can you say?",
          choices: ["I am not sure, but...", "This is easy for everyone.", "No."],
          answer: "I am not sure, but..."
        },
        yourTurnPrompt: "You want to try answering in class. What would you say?"
      }),
      makeScenario({
        slug: "ask-a-question-in-class",
        title: "Ask a question in class",
        description: "Ask when you need one detail repeated.",
        situation: "The teacher is explaining the homework. You missed the due date.",
        conversation: [
          "Student: Could you repeat the due date?",
          "Teacher: Yes. It is due Friday.",
          "Student: Thank you."
        ],
        usefulSentence: "Could you repeat the due date?",
        usefulPhrases: ["Could you repeat that?", "When is it due?", "Can you give an example?", "Thank you."],
        checkMeaning: {
          prompt: "What did the student miss?",
          choices: ["The due date", "The lunch menu", "The bus stop"],
          answer: "The due date"
        },
        bestResponse: {
          prompt: "You need the teacher to repeat something. What should you say?",
          choices: ["Could you repeat that?", "You talk too much.", "Forget it."],
          answer: "Could you repeat that?"
        },
        yourTurnPrompt: "You missed a detail in class. What question would you ask?"
      }),
      makeScenario({
        slug: "share-your-opinion",
        title: "Share your opinion",
        description: "Say what you think with one reason.",
        situation: "Your group is discussing a story. You want to share your idea.",
        conversation: [
          "Student: I think the character was brave.",
          "Classmate: Why do you think that?",
          "Student: Because she told the truth."
        ],
        usefulSentence: "I think ___ because ___.",
        usefulPhrases: ["I think...", "In my opinion...", "One reason is...", "I agree with that."],
        checkMeaning: {
          prompt: "What does the student share?",
          choices: ["An opinion", "A lunch order", "A phone number"],
          answer: "An opinion"
        },
        bestResponse: {
          prompt: "You want to explain your opinion. What helps?",
          choices: ["One reason is...", "Stop asking.", "I do not care."],
          answer: "One reason is..."
        },
        yourTurnPrompt: "You have an opinion in group discussion. What would you say?"
      }),
      makeScenario({
        slug: "give-a-short-answer",
        title: "Give a short answer",
        description: "Answer in one clear sentence.",
        situation: "The teacher asks you a question about the reading.",
        conversation: [
          "Teacher: Why did the character leave home?",
          "Student: She left because she wanted to help her family.",
          "Teacher: Good answer."
        ],
        usefulSentence: "She left because she wanted to help her family.",
        usefulPhrases: ["The answer is...", "I think...", "Because...", "Can I say it another way?"],
        checkMeaning: {
          prompt: "How does the student answer?",
          choices: ["With one clear sentence", "By leaving the room", "By ordering food"],
          answer: "With one clear sentence"
        },
        bestResponse: {
          prompt: "You need to answer why. What word can help?",
          choices: ["Because", "Whatever", "Never"],
          answer: "Because"
        },
        yourTurnPrompt: "The teacher asks you a reading question. What short answer could you give?"
      })
    ]
  },
  {
    slug: "daily-life-english",
    title: "Daily Life English",
    description: "Order food, ask for help, and talk to staff.",
    scenarios: [
      makeScenario({
        slug: "order-food-or-drink",
        title: "Order food or a drink",
        description: "Order politely and clearly.",
        situation: "You are at a cafe. You want to order a drink.",
        conversation: [
          "Student: Hi, can I have a small iced tea, please?",
          "Cashier: Sure. Anything else?",
          "Student: No, thank you."
        ],
        usefulSentence: "Can I have a small iced tea, please?",
        usefulPhrases: ["Can I have...?", "Please.", "Anything else?", "No, thank you."],
        checkMeaning: {
          prompt: "What does the student order?",
          choices: ["Iced tea", "A notebook", "A bus pass"],
          answer: "Iced tea"
        },
        bestResponse: {
          prompt: "The cashier asks, 'Anything else?' What can you say?",
          choices: ["No, thank you.", "Go away.", "I do not know you."],
          answer: "No, thank you."
        },
        yourTurnPrompt: "You want to order a drink. What would you say?"
      }),
      makeScenario({
        slug: "ask-where-something-is",
        title: "Ask where something is",
        description: "Ask for help finding an item.",
        situation: "You are in a store. You need to find notebooks for school.",
        conversation: [
          "Student: Excuse me, where are the notebooks?",
          "Worker: They are in aisle three.",
          "Student: Thank you."
        ],
        usefulSentence: "Excuse me, where are the notebooks?",
        usefulPhrases: ["Excuse me.", "Where are...?", "Which aisle?", "Thank you."],
        checkMeaning: {
          prompt: "What is the student looking for?",
          choices: ["Notebooks", "Pizza", "A ride home"],
          answer: "Notebooks"
        },
        bestResponse: {
          prompt: "You need help in a store. How should you start?",
          choices: ["Excuse me.", "Move.", "Hey, you."],
          answer: "Excuse me."
        },
        yourTurnPrompt: "You need to find something in a store. What would you ask?"
      }),
      makeScenario({
        slug: "talk-to-a-cashier",
        title: "Talk to a cashier",
        description: "Ask a simple payment question.",
        situation: "You are buying a snack. You want to know if you can pay with a card.",
        conversation: [
          "Student: How much is this?",
          "Cashier: It is four dollars.",
          "Student: Can I pay with a card?"
        ],
        usefulSentence: "Can I pay with a card?",
        usefulPhrases: ["How much is this?", "Can I pay with a card?", "Do you take cash?", "Can I have a receipt?"],
        checkMeaning: {
          prompt: "What does the student ask about?",
          choices: ["Paying", "Homework", "A club meeting"],
          answer: "Paying"
        },
        bestResponse: {
          prompt: "You want to know the price. What should you ask?",
          choices: ["How much is this?", "Give it free.", "I am taking this."],
          answer: "How much is this?"
        },
        yourTurnPrompt: "You are buying something. What would you ask the cashier?"
      }),
      makeScenario({
        slug: "make-a-simple-phone-call",
        title: "Make a simple phone call",
        description: "Say who you are and why you are calling.",
        situation: "You need to call the school office about an appointment.",
        conversation: [
          "Student: Hello, my name is Ana Lopez.",
          "Office: Hi Ana. How can I help you?",
          "Student: I am calling about my appointment today."
        ],
        usefulSentence: "Hello, my name is ___. I am calling about my appointment.",
        usefulPhrases: ["Hello, my name is...", "I am calling about...", "Can you help me?", "Thank you. Goodbye."],
        checkMeaning: {
          prompt: "Why is the student calling?",
          choices: ["An appointment", "A movie", "A game"],
          answer: "An appointment"
        },
        bestResponse: {
          prompt: "You call the school office. What should you say first?",
          choices: ["Hello, my name is...", "Who are you?", "Nothing."],
          answer: "Hello, my name is..."
        },
        yourTurnPrompt: "You need to call the school office. What would you say first?"
      })
    ]
  },
  {
    slug: "difficult-moments",
    title: "Difficult Moments",
    description: "Practice what to say when you feel confused, nervous, or left out.",
    scenarios: [
      makeScenario({
        slug: "ask-someone-to-repeat",
        title: "Ask someone to repeat",
        description: "Ask politely when you did not hear.",
        situation: "A classmate says something, but you did not hear all the words.",
        conversation: [
          "Student: Sorry, could you repeat that?",
          "Classmate: Sure. The meeting is after school.",
          "Student: Thanks. After school."
        ],
        usefulSentence: "Sorry, could you repeat that?",
        usefulPhrases: ["Sorry.", "Could you repeat that?", "Could you say it slower?", "Thanks."],
        checkMeaning: {
          prompt: "What does the student ask?",
          choices: ["Repeat that", "Buy lunch", "Leave now"],
          answer: "Repeat that"
        },
        bestResponse: {
          prompt: "You did not hear the last words. What should you say?",
          choices: ["Sorry, could you repeat that?", "Talk better.", "No."],
          answer: "Sorry, could you repeat that?"
        },
        yourTurnPrompt: "You did not hear your classmate. What would you say?"
      }),
      makeScenario({
        slug: "say-you-need-more-time",
        title: "Say you need more time",
        description: "Ask for a moment to think.",
        situation: "Someone asks you a question. You know your idea, but you need time to say it in English.",
        conversation: [
          "Student: Can I have a moment to think?",
          "Teacher: Of course.",
          "Student: Thank you. I want to say it clearly."
        ],
        usefulSentence: "Can I have a moment to think?",
        usefulPhrases: ["Can I have a moment?", "I need more time.", "I want to say it clearly.", "Thank you for waiting."],
        checkMeaning: {
          prompt: "What does the student need?",
          choices: ["More time", "More lunch", "A new phone"],
          answer: "More time"
        },
        bestResponse: {
          prompt: "You need time to answer. What is a good sentence?",
          choices: ["Can I have a moment to think?", "Do not ask me.", "This is bad."],
          answer: "Can I have a moment to think?"
        },
        yourTurnPrompt: "You need more time to answer in English. What would you say?"
      }),
      makeScenario({
        slug: "say-you-are-confused",
        title: "Say you are confused",
        description: "Use calm words when something is not clear.",
        situation: "People are talking fast in a group. You are confused and need help.",
        conversation: [
          "Student: I am a little confused.",
          "Classmate: Which part?",
          "Student: Can you explain the last part again?"
        ],
        usefulSentence: "I am a little confused. Can you explain that again?",
        usefulPhrases: ["I am a little confused.", "Which part?", "Can you explain that again?", "Thank you for helping."],
        checkMeaning: {
          prompt: "How does the student feel?",
          choices: ["Confused", "Hungry", "Late"],
          answer: "Confused"
        },
        bestResponse: {
          prompt: "The group is talking fast. What can you say?",
          choices: ["I am a little confused.", "Go away.", "Never mind forever."],
          answer: "I am a little confused."
        },
        yourTurnPrompt: "You feel confused in a group. What would you say?"
      }),
      makeScenario({
        slug: "respond-when-left-out",
        title: "Respond when you feel left out",
        description: "Join respectfully when you feel outside the group.",
        situation: "Your group is talking, but you do not know how to join.",
        conversation: [
          "Student: Can I join the conversation?",
          "Classmate: Yes, we are talking about the project.",
          "Student: Okay. I have one idea."
        ],
        usefulSentence: "Can I join the conversation?",
        usefulPhrases: ["Can I join?", "What are you talking about?", "I have one idea.", "Can I help?"],
        checkMeaning: {
          prompt: "What does the student want to join?",
          choices: ["A conversation", "A bus", "A store"],
          answer: "A conversation"
        },
        bestResponse: {
          prompt: "You want to join a group conversation. What is respectful?",
          choices: ["Can I join the conversation?", "Stop talking without me.", "This is bad."],
          answer: "Can I join the conversation?"
        },
        yourTurnPrompt: "You feel left out of a group conversation. What would you say?"
      })
    ]
  }
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getScenario(categorySlug: string, scenarioSlug: string) {
  return getCategory(categorySlug)?.scenarios.find((scenario) => scenario.slug === scenarioSlug);
}
