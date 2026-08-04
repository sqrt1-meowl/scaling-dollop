const q = (stem, correct, ...distractors) => ({
  stem,
  options: [correct, ...distractors],
  answer: 0,
});

const listen = (task, topic, transcript, questions) => ({
  task,
  topic,
  intro: "You will hear the recording only once.",
  transcript,
  qs: questions,
});

const read = (task, topic, passage, questions) => ({
  task,
  topic,
  passage,
  qs: questions.map((question) => question.options.length >= 4 ? question : ({
    ...question,
    options: [...question.options, "The passage does not support this statement"],
  })),
});

const speak = (task, topic, prompt, points, checks, scene) => ({
  task,
  topic,
  prompt,
  points,
  checks,
  ...(scene ? { scene } : {}),
});

const write = (task, topic, stem, points, hint, scene) => ({
  task,
  topic,
  kind: "frame",
  stem,
  points,
  hint,
  ...(scene ? { scene } : {}),
});

const set1 = {
  listening: [
    listen("Listen to a Short Exchange", "Internship Deadline",
      "Student: I thought the internship application was due Friday. Counselor: The form is due Friday, but your recommendation must arrive by Wednesday so the committee can verify it.", [
        q("What must arrive by Wednesday?", "The recommendation", "The application form", "The interview schedule"),
      ]),
    listen("Listen to a Short Exchange", "Laboratory Reservation",
      "Student: Can our group use the chemistry lab after school? Teacher: Yes, but reserve it online first. Another class has priority unless your reservation is confirmed.", [
        q("What should the student do first?", "Reserve the laboratory online", "Ask the other class to leave", "Begin the experiment during lunch"),
      ]),
    listen("Listen to a Short Exchange", "Revised Citation",
      "Student: Why did you return my paper without a grade? Teacher: Your analysis is complete, but one quotation has no source. Add the citation and resubmit it; I will not deduct points if it is in by tomorrow.", [
        q("Why was the paper returned?", "A quotation needs a citation", "The analysis is unfinished", "The paper was submitted late"),
      ]),
    listen("Listen to a Classroom Conversation", "Capstone Presentation",
      "Teacher: Your capstone presentations are next week. Each group has twelve minutes, including questions. Maya: Does the bibliography count as a slide? Teacher: Yes, but you do not need to read it aloud. Luis: Can we show a two-minute video? Teacher: You may, as long as the entire presentation stays within twelve minutes. Maya: Then we should shorten our introduction.", [
        q("What is included in the twelve-minute limit?", "Questions from the audience", "Only the student speech", "Time used to set up the room"),
        q("What does the teacher say about the bibliography?", "It should appear but need not be read aloud", "It must be submitted separately", "It does not count as a slide"),
        q("Why does Maya suggest shortening the introduction?", "The video and questions must fit the time limit", "The bibliography is too long", "The teacher rejected their topic"),
      ]),
    listen("Listen to an Oral Presentation", "Mangrove Restoration",
      "Mangrove forests grow where tropical coastlines meet the sea. Their tangled roots slow waves, trap sediment, and create protected nurseries for young fish. For decades, many mangroves were removed for roads and development. Restoration once meant planting rows of seedlings, but many plantings failed because planners ignored water flow. Current projects first restore natural tides and sediment movement. When the physical conditions return, mangroves often recolonize the shore with less planting and greater long-term survival.", [
        q("What is one benefit of mangrove roots?", "They reduce wave energy", "They increase ocean salinity", "They prevent all coastal development"),
        q("Why did many early restoration projects fail?", "They ignored natural water flow", "They used too many native plants", "They protected too much sediment"),
        q("What do current projects restore first?", "Tides and sediment movement", "Road access", "Commercial fishing"),
        q("What is the presentation's central idea?", "Restoring ecological conditions can be more effective than planting alone", "Mangroves grow best in straight rows", "Coastal forests require constant replacement"),
      ]),
    listen("Listen to an Oral Presentation", "Quantum Sensors",
      "Quantum sensors use the behavior of atoms and particles to measure extremely small changes in motion, gravity, or magnetic fields. A conventional sensor may miss a tiny underground variation, while a quantum gravimeter can detect how local gravity changes above a tunnel or buried pipe. Researchers are testing these instruments in navigation, medicine, and geology. Their sensitivity is valuable, but it also creates a challenge: vibration, temperature, and nearby equipment can distort a reading. Engineers therefore combine shielding, calibration, and repeated measurements before interpreting the data.", [
        q("What can a quantum gravimeter detect?", "Small changes in local gravity", "The chemical age of a pipe", "The exact color of underground rock"),
        q("Why is extreme sensitivity also a challenge?", "Environmental conditions can distort readings", "The sensors cannot be calibrated", "The sensors produce no numerical data"),
        q("How do engineers improve confidence in the data?", "They shield, calibrate, and repeat measurements", "They use a single reading", "They remove all conventional equipment"),
        q("Which statement best summarizes the presentation?", "Quantum sensors offer powerful measurements but require careful control", "Quantum sensors have replaced every conventional sensor", "Quantum sensors work only in medical settings"),
      ]),
    listen("Listen to a Speaker Support an Opinion", "Financial Literacy Requirement",
      "A personal-finance course should be required for graduation. Students routinely sign phone contracts, compare college aid, and begin earning wages before they understand interest or taxes. A required course would let students practice with realistic budgets and loan offers before mistakes carry serious costs. Some people argue that the schedule is already crowded. However, financial decisions affect every graduate, so schools should integrate the course with mathematics or social studies rather than leave the subject optional.", [
        q("What change does the speaker support?", "Requiring a personal-finance course", "Eliminating mathematics requirements", "Allowing students to avoid graduation planning"),
        q("Which evidence supports the speaker's position?", "Students make financial decisions before fully understanding them", "Most students already work as accountants", "Phone contracts contain no financial risk"),
        q("How does the speaker address the crowded schedule?", "Integrate financial literacy with existing subjects", "Extend high school by another year", "Remove all elective courses"),
        q("Why does the speaker mention realistic budgets and loans?", "To illustrate practical preparation", "To criticize college applications", "To prove every student has the same income"),
      ]),
    listen("Listen to a Speaker Support an Opinion", "Public Transit Passes",
      "The city should provide discounted transit passes to high school students. Reliable transportation would help students reach internships, libraries, and after-school programs, especially when family transportation is unavailable. Critics point to the cost of the discount. Yet fuller buses can reduce traffic around schools, and the city could begin with a one-year pilot to measure ridership and attendance. A limited pilot would produce evidence before officials decide whether to expand the program.", [
        q("What is the speaker's main proposal?", "Discounted transit passes for high school students", "Free cars for student drivers", "Fewer after-school activities"),
        q("Which students would especially benefit?", "Students without dependable family transportation", "Only students who already own cars", "Students who never leave campus"),
        q("What counterargument does the speaker acknowledge?", "The discount would cost money", "Buses cannot reach schools", "Libraries do not accept students"),
        q("Why does the speaker recommend a pilot?", "It would provide evidence before expansion", "It would permanently eliminate fares", "It would prevent officials from reviewing results"),
      ]),
  ],
  reading: [
    read("Read a Short Informational Passage", "Data Visualization",
      "A graph can be factually accurate and still create a misleading impression. If a vertical axis begins at 90 rather than zero, a change from 94 to 96 appears dramatic even though it is small. Designers sometimes use a shortened axis to make subtle differences visible, but responsible graphs label the scale clearly and explain why it was chosen. Readers should therefore inspect units, intervals, and omitted values before accepting the visual message.", [
        q("How can an accurate graph still mislead?", "Its scale can exaggerate a small difference", "Its labels can contain only numbers", "Its data can come from more than one year"),
        q("When may a shortened axis be useful?", "When subtle differences need to be visible", "When the designer wants to hide all units", "When no comparison is being made"),
        q("What does the author advise readers to examine?", "Units, intervals, and omitted values", "Only the graph's colors", "The designer's job title"),
      ]),
    read("Read a Short Informational Passage", "Zero-Trust Security",
      "Traditional computer security often treated everyone inside an organization's network as trustworthy. Zero-trust security assumes instead that no user or device should receive automatic access. Each request is verified, and access is limited to the information needed for a particular task. The model cannot prevent every attack, but it can reduce the damage caused by a stolen password because one account does not automatically unlock the entire system.", [
        q("What assumption defines zero-trust security?", "Every access request should be verified", "All internal users are automatically safe", "Passwords are no longer necessary"),
        q("Why is access limited by task?", "To reduce unnecessary exposure of information", "To give every user administrator control", "To eliminate verification"),
        q("How can zero-trust security reduce damage from a stolen password?", "One account does not open the whole system", "It reveals the attacker's location immediately", "It makes the stolen password permanent"),
      ]),
    read("Read a Student Essay", "Community Service Credit",
      "Our district should allow students to earn elective credit for sustained community service. Volunteering can develop skills that classrooms sometimes simulate but cannot fully reproduce, such as communicating with unfamiliar adults, managing a real schedule, and adapting when a plan fails. The program would not award credit merely for collecting hours. Students would submit a supervisor evaluation and a reflection connecting their work to a learning goal. Some critics worry that transportation would make participation unequal. This concern is valid, so the district should include on-campus and remote service options. When a program sets clear expectations and removes barriers, community service can become rigorous learning rather than an extra activity available only to some students.", [
        q("What is the essay's central claim?", "Sustained community service should qualify for elective credit", "Every student should volunteer off campus", "Community service should replace required courses"),
        q("Which skill does the writer say service can develop?", "Adapting when a real plan fails", "Avoiding communication with adults", "Completing work without a schedule"),
        q("Why does the writer mention supervisor evaluations?", "To show that credit would require documented learning", "To eliminate student reflection", "To let supervisors assign graduation grades"),
        q("What concern does the writer acknowledge?", "Transportation could create unequal access", "Students would receive no academic credit", "Schools have too many remote options"),
        q("How does the writer respond to that concern?", "Offer on-campus and remote opportunities", "Require every student to drive", "Limit service to weekends"),
        q("What does 'This concern is valid' accomplish?", "It concedes a reasonable opposing point", "It introduces an unrelated example", "It withdraws the essay's claim"),
        q("Which phrase best signals a condition for success?", "When a program sets clear expectations and removes barriers", "sometimes simulate", "available only to some students"),
        q("What organizational pattern does the final paragraph use?", "Counterargument, response, and conclusion", "Chronological narration", "Definition followed by a list of dates"),
      ]),
    read("Read a Literary Passage", "Night at the Observatory",
      "Nina had expected the observatory internship to feel important. Instead, her first three nights consisted of checking cables and entering weather numbers while Dr. Imani studied images without speaking. On the fourth night, clouds erased the sky entirely. Nina assumed they would go home, but Dr. Imani opened an old folder of failed observations. 'Clouds give us time to understand our mistakes,' she said. Together they found that a temperature sensor had drifted during the previous month. Nina corrected the records until dawn. When the sky finally cleared the next evening, the telescope seemed no more impressive than before, but the quiet work beneath it did. Nina understood that discovery depended as much on noticing flawed data as on capturing a perfect image.", [
        q("Why is Nina initially disappointed?", "Her work feels routine and unimportant", "The telescope is permanently broken", "Dr. Imani sends her home"),
        q("What opportunity do the clouds create?", "Time to examine earlier mistakes", "A chance to photograph the sun", "Permission to avoid the data"),
        q("What problem do Nina and Dr. Imani discover?", "A drifting temperature sensor", "A missing telescope lens", "An incorrect weather forecast"),
        q("How does Nina's understanding change?", "She recognizes that careful correction supports discovery", "She decides observation requires no preparation", "She concludes that images are never useful"),
        q("What does 'the quiet work beneath it did' refer to?", "The behind-the-scenes analysis becoming meaningful", "The building making a loud sound", "The telescope moving underground"),
        q("Which theme is best supported?", "Scientific progress depends on patience and scrutiny", "Important work is always immediately exciting", "Mistakes should be hidden from colleagues"),
      ]),
    read("Read an Informational Passage", "Coral Nurseries",
      "Coral restoration teams sometimes grow fragments in underwater nurseries before attaching them to damaged reefs. The method can quickly increase the amount of living coral, but scale alone does not guarantee recovery. If every fragment has nearly identical genetics, a single disease or heat event may threaten the entire planting. Researchers therefore collect fragments from many parent colonies and test which survive different temperatures. They also study the reef itself: water quality, grazing fish, storms, and local currents all influence survival. Restoration is most effective when it increases both coral cover and resilience while the causes of reef decline are addressed.", [
        q("What is one advantage of underwater nurseries?", "They can rapidly increase living coral", "They remove the need to study reefs", "They prevent every heat event"),
        q("Why can low genetic diversity be dangerous?", "One threat may affect the entire planting", "Fragments will grow into different species", "Currents will stop moving"),
        q("Why do researchers test fragments at different temperatures?", "To identify differences in heat survival", "To make every fragment genetically identical", "To eliminate grazing fish"),
        q("Which reef conditions are mentioned?", "Water quality, fish, storms, and currents", "Only depth and color", "Tourism and shipping prices only"),
        q("What does the final sentence emphasize?", "Restoration must address resilience and underlying causes", "Planting speed is the only measure of success", "Damaged reefs recover without environmental change"),
        q("How is the passage organized?", "A method, its limitation, and a more complete approach", "A fictional problem and surprise ending", "A list of unrelated inventions"),
      ]),
  ],
  speaking: [
    speak("Talk about a Scene (1 of 4)", "Research Center", "Look at the scene. What is happening?", 1, ["Relevant description"], "library"),
    speak("Talk about a Scene (2 of 4)", "Research Center", "Describe two people in the scene and what each appears to be doing.", 1, ["Two people", "Clear actions"], "library"),
    speak("Talk about a Scene (3 of 4)", "Research Center", "What is one reasonable conclusion you can draw from the scene? Explain the visual evidence.", 2, ["Inference", "Visual evidence"], "library"),
    speak("Talk about a Scene (4 of 4)", "Research Center", "Describe a time you had to locate reliable information. What did you do?", 2, ["Past experience", "Specific process"], "library"),
    speak("Speech Functions", "Recommendation Request", "Ask a teacher for a college or scholarship recommendation. Explain what you are requesting and when it is due.", 2, ["Appropriate register", "Specific request"]),
    speak("Speech Functions", "Schedule Conflict", "Tell a supervisor that an exam conflicts with your work schedule and propose a solution.", 2, ["Clear explanation", "Proposed solution"]),
    speak("Support an Opinion", "Gap Year", "Should graduates consider a structured gap year before college? State and support your position.", 3, ["Position", "Developed reason"]),
    speak("Support an Opinion", "AI Study Tools", "Should students be allowed to use AI study tools for independent practice? State your position, a reason, and an appropriate limit.", 3, ["Position", "Reason", "Limitation"]),
    speak("Present and Discuss Information", "Program Enrollment", "Describe the enrollment trend in the graph and evaluate whether the final year is more than double the first year.", 3, ["Accurate trend", "Evidence-based judgment"], "linegraph"),
    speak("Present and Discuss Information", "Program Enrollment", "Compare the two largest changes shown in the graph and explain one reasonable implication.", 3, ["Accurate comparison", "Reasonable implication"], "linegraph"),
    speak("Summarize an Academic Presentation", "Carbon Capture", "Summarize how carbon capture separates carbon dioxide, transports it, and stores or uses it.", 4, ["Main stages", "Connected explanation"]),
    speak("Summarize an Academic Presentation", "Public-Key Encryption", "Summarize the different roles of a public key and a private key and explain why the private key must remain secret.", 4, ["Both key roles", "Security explanation"]),
  ],
  writing: [
    write("Describe a Picture (Question 1)", "Research Center", "Write one complete sentence describing a person in the scene, using a precise verb.", 2, "Describe what is visibly happening.", "library"),
    write("Describe a Picture (Question 2)", "Research Center", "Write one complete sentence explaining what might happen next and include a visual detail that supports the prediction.", 2, "Prediction plus evidence from the scene.", "library"),
    write("Write About an Experience", "A Difficult Decision", "Write about a time you had to make a difficult decision. Explain the alternatives, what you chose, and what you learned.", 4, "Develop the experience with relevant details and a clear sequence."),
    write("Write About Academic Information (Question 4)", "Energy Sources", "A chart shows that solar power costs fell while its share of local electricity increased. Summarize both trends using at least two details from the chart.", 2, "State both trends accurately.", "energy-sources-chart"),
    write("Write About Academic Information (Question 5)", "Energy Sources", "A speaker claims falling cost was the only reason solar use increased. Explain whether the chart alone is sufficient to support that claim.", 3, "Evaluate the limits of the evidence.", "energy-sources-chart"),
    write("Justify an Opinion", "Required Financial Literacy", "Should a personal-finance course be required for graduation? State your position, support it with developed reasons, and address one counterargument.", 4, "Use an appropriate academic register and connected reasoning."),
  ],
};

export const G1112_BANKS = { 1: set1 };
