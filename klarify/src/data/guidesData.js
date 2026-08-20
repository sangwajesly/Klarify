// Centralized mock database for Klarify educational guides
export const guidesData = [
  {
    id: "failed-concours-what-next",
    title: "Failed a Concours? Here's What to Do Next",
    slug: "failed-concours-what-next",
    description: "Not making it into your dream professional school this year does not mean your future is over. Learn alternative university options and our 12-month reset strategy.",
    category: "Concours",
    author: "Sangwa Jesly",
    date: "Aug 20, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
    published: true,
    content: [
      { type: "p", text: "You prepared. You studied past papers. You sat for the entrance exam. You imagined yourself wearing the uniform, walking through the campus, or finally joining the school you had always wanted." },
      { type: "p", text: "Then the results came out." },
      { type: "p", text: "Your name wasn't there.", fontStyle: "bold text-slate-900" },
      { type: "p", text: "Suddenly, you feel lost. You don't know what to tell your parents, you don't know what to tell your friends, and worse, you don't know what you're going to do next." },
      { type: "p", text: "If this is you, take a deep breath." },
      { type: "blockquote", text: "You failed a concours. You did not fail at life." },
      { type: "p", text: "A concours determines whether you enter a particular school at a particular time. It does not determine your intelligence, your potential, or the rest of your life." },
      {
        type: "callout",
        text: "I know this feeling because I've been there. When I didn't make it, I felt completely lost. I thought the only door had closed. But I learned that other pathways exist, and often, they lead to even better opportunities."
      },
      { type: "h2", text: "What a Concours Actually Means" },
      { type: "p", text: "Look, a concours is just a competition where they pick a few people because there are too many students and not enough desks." },
      { type: "p", text: "Sometimes, 10,000 candidates apply for only 100 places in engineering or medical schools. The school has to reject thousands of qualified students simply because they lack space. Your performance on that particular day doesn't define you." },
      { type: "h2", text: "Option 1: Look for a Related Direct-Entry Program" },
      { type: "p", text: "If you wanted to study Engineering at Polytech but didn't pass, you do not have to give up on technology. You can study related direct-entry programs (programs where you don't need a concours to get in) at public or private universities:" },
      {
        type: "list",
        items: [
          "If you wanted Engineering, you can study Computer Science, Mathematics, Physics, or an HND in ICT.",
          "If you wanted Medicine, you can study Nursing, Medical Lab Sciences, Biochemistry, or Microbiology.",
          "If you wanted ENS (Teaching), you can study standard Letters, History, or Science and apply for the concours again later."
        ]
      },
      { type: "widget", widgetType: "flowCta", text: "Not sure what courses you can do with your A-Levels?", subtext: "Enter your A-Level subjects and interests into Klarify to instantly discover Cameroonian university programs that fit your combination." },
      { type: "h2", text: "Option 2: Start a Related Course and Try Again" },
      { type: "p", text: "Many students register for a standard degree (like Physics or Chemistry) at a state university, attend lectures, and study to sit for the concours again next year." },
      { type: "p", text: "This keeps you in the academic loop and builds a strong foundation. However, check the admission rules of the specific school first to make sure you still meet the age and registration requirements for the next attempt." },
      { type: "h2", text: "Option 3: Take a Gap Year, But Make It Productive" },
      { type: "p", text: "If you choose to stay home for a year and prepare, do not let the year pass you by. You should use the time to:" },
      {
        type: "list",
        ordered: true,
        items: [
          "Learn a practical skill: Master coding, graphic design, copywriting, tailoring, or mechanics.",
          "Analyze your exam preparation: Identify exactly where you lost marks in the concours and practice past questions daily.",
          "Build yourself: Read, volunteer, and learn basic communication skills."
        ]
      },
      { type: "h2", text: "Don't Make Decisions While You are Devastated" },
      { type: "p", text: "Do not compare yourself to peers who passed. Give yourself a few days to process the result, talk to a teacher or orientator, and then make a plan." },
      { type: "p", text: "Remember: There is always a next path. What matters is that you keep moving forward." }
    ]
  },
  {
    id: "what-to-study-after-alevel",
    title: "What Can I Study After A-Level in Cameroon?",
    slug: "what-to-study-after-alevel",
    description: "A complete guide on how to choose university courses based on your specific A-Level subject combination, from Science to Arts.",
    category: "Orientation",
    author: "Sangwa Jesly",
    date: "Aug 20, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
    published: true,
    content: [
      { type: "p", text: "You just passed your Advanced Level. Congrats! You worked hard for those grades, and now you have your GCE slip in hand." },
      { type: "p", text: "But now comes the real questions: \"Where do I apply? What course should I study?\"" },
      { type: "p", text: "In Cameroon, it's easy to just follow what your friends are doing or choose a course because the name sounds fancy. But your A-Level subject combination is actually a map. If you follow it, it tells you exactly where you can go." },
      { type: "h2", text: "1. Every Faculty Has Its Own Keys" },
      { type: "p", text: "Universities in Cameroon have clear rules for who they accept. You can't just apply for any course. Your Advanced Level passes are like keycards:" },
      {
        type: "list",
        items: [
          "To study Engineering, you need Math and Physics.",
          "To study Medicine or Nursing, you need Biology and Chemistry.",
          "To study Management or Economics, you need Economics or Mathematics.",
          "To study Law, you usually need Literature in English."
        ]
      },
      { type: "h2", text: "2. Match Your Combinations" },
      { type: "p", text: "Let's see what your stream qualifies you to study. Use our interactive widget below to select your stream:" },
      { type: "widget", widgetType: "streamMatcher" },
      { type: "h2", text: "3. Three Things to Check Before Choosing" },
      { type: "p", text: "Before you submit your admission papers, ask yourself these three basic questions:" },
      {
        type: "list",
        items: [
          "Is it a Concours or Direct Entry? Some schools require a separate entrance exam (concours) which is highly competitive. Always have a 'direct entry' backup plan so you don't waste a year.",
          "Can we afford the tuition? Public state universities cost 50,000 XAF a year, but private colleges and professional HND programs are more expensive. Talk to your family about the budget early.",
          "Are there jobs? Don't just choose a course because it sounds prestigious. Research if companies in Cameroon are actually hiring for that role, or if you can use the degree to start your own business."
        ]
      },
      { type: "widget", widgetType: "flowCta", text: "Unsure about your GCE combinations?", subtext: "Use Klarify's free Academic Recommender to match your subjects and grades to suitable courses in Buea, Bamenda, Douala, and Yaounde." },
      { type: "p", text: "Remember: Your A-Level results are just the starting block. It doesn't matter if you got 5 A's or 2 E's, what matters is that you choose a path where you can actually grow, learn, and build a career." }
    ]
  }
];
