import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Mic, MessageCircle, BookOpen, Map as MapIcon, Send, Flame, Award,
  ChevronRight, ChevronDown, Check, X, Volume2, RotateCcw, Repeat,
  Eye, Users, PenTool, Headphones, Sparkles, Square, Loader2, Star,
  RefreshCw, GraduationCap, AlertCircle, PhoneCall, PhoneOff, Keyboard, Zap
} from "lucide-react";

/* ---------------------------------- DATA ---------------------------------- */

const ROADMAP = [
  {
    month: 1,
    title: "Foundation",
    subtitle: "Sounds, confidence, and your first real sentences",
    color: "teal",
    weeks: [
      { name: "Sounds & Rhythm", focus: "Vowel/consonant drills, word stress, syllable timing", tasks: ["10 min shadowing a native clip", "Record yourself saying 10 sentences", "Tongue twister of the day"] },
      { name: "Greetings & Small Talk", focus: "Everyday openers, introducing yourself, weather talk", tasks: ["Roleplay meeting a stranger", "Learn 10 small-talk phrases", "Practice with AI tutor for 5 min"] },
      { name: "Present-Tense Conversations", focus: "Talking about routines, habits, likes/dislikes", tasks: ["Describe your day out loud", "Shadow a podcast clip", "Vocabulary: 15 daily-life words"] },
      { name: "Storytelling Basics", focus: "Past tense, sequencing words, simple narratives", tasks: ["Tell a 1-minute story about your weekend", "Read a short story aloud", "AI tutor roleplay: recounting an event"] },
    ],
  },
  {
    month: 2,
    title: "Fluency Building",
    subtitle: "Real-world scenarios and thinking on your feet",
    color: "amber",
    weeks: [
      { name: "Opinions & Reactions", focus: "Agreeing, disagreeing, giving reasons naturally", tasks: ["Debate a light topic with the AI tutor", "Practice linking words (however, so, actually)", "Reduce filler words drill"] },
      { name: "Travel & Directions", focus: "Airports, hotels, asking/giving directions", tasks: ["Roleplay: checking into a hotel", "Shadow an airport announcement", "Vocabulary: 15 travel words"] },
      { name: "Work & Interviews", focus: "Meetings, emails read aloud, interview answers", tasks: ["Mock interview with AI tutor", "Practice 'tell me about yourself'", "Read a work email aloud, fluently"] },
      { name: "Phone Calls & Listening", focus: "Understanding fast speech, call etiquette", tasks: ["Listen-and-repeat a phone dialogue", "Roleplay booking a reservation by phone", "No-subtitles listening challenge"] },
    ],
  },
  {
    month: 3,
    title: "Confidence & Mastery",
    subtitle: "Natural flow, idioms, and speaking without hesitation",
    color: "rose",
    weeks: [
      { name: "Idioms & Expressions", focus: "Everyday idioms, phrasal verbs, sounding natural", tasks: ["Use 5 new idioms in a conversation", "Watch a clip and spot 3 idioms", "AI tutor: casual free-talk"] },
      { name: "Debate & Persuasion", focus: "Structuring arguments, persuasive speaking", tasks: ["2-minute persuasive mini-speech", "Debate with AI tutor on a topic", "Practice rebuttals out loud"] },
      { name: "Presentations", focus: "Public-speaking structure, clarity under pressure", tasks: ["Record a 2-minute self-intro talk", "Practice pacing and pauses", "Present a topic to the AI tutor"] },
      { name: "Free Conversation Mastery", focus: "Spontaneous, unscripted, real-time conversation", tasks: ["10-minute free chat with AI tutor", "Talk to a stranger/exchange partner", "Reflect: record + review your growth"] },
    ],
  },
];

const METHODS = [
  { icon: Repeat, title: "Shadowing", desc: "Play native audio and repeat it almost simultaneously, copying rhythm and intonation, not just words." },
  { icon: Headphones, title: "Immersion", desc: "Switch your phone and apps to English, watch shows in English, and surround yourself with the language daily." },
  { icon: MessageCircle, title: "Think in English", desc: "Narrate your day silently in your head in English instead of your native language — builds instant recall." },
  { icon: Mic, title: "Record & Review", desc: "Record yourself speaking, then listen back to catch pronunciation and grammar patterns you can't hear live." },
  { icon: PenTool, title: "Tongue Twisters", desc: "Short daily drills that train your mouth muscles for tricky English sounds like 'th', 'r', and 'v'." },
  { icon: Users, title: "Language Exchange", desc: "Trade conversation time with a native speaker learning your language — real stakes, real feedback." },
  { icon: Eye, title: "Subtitled Media", desc: "Watch with English subtitles first, then rewatch without them to test real comprehension." },
  { icon: BookOpen, title: "Read Aloud", desc: "Read articles, books, or news aloud daily to build fluency, pacing, and pronunciation together." },
  { icon: Star, title: "Roleplay Scenarios", desc: "Simulate real situations — ordering food, job interviews, small talk — before you need them in real life." },
  { icon: RotateCcw, title: "Mirror Practice", desc: "Talk to yourself in a mirror. It sounds odd, but it builds mouth-movement awareness and confidence." },
];

const GRAMMAR = {
  Basics: [
    { title: "Verb 'to be'", rule: "Use am/is/are to describe identity, feelings, or states.", examples: ["I am a student.", "She is happy.", "They are at home."], mistake: "Don't drop the verb: say \"She is happy\", not \"She happy\"." },
    { title: "Present Simple", rule: "Use for habits, routines, and facts. Add -s/-es for he/she/it.", examples: ["I work every day.", "She works in a bank.", "Water boils at 100°C."], mistake: "Don't forget the -s: \"She work\" → \"She works\"." },
    { title: "Articles: a / an / the", rule: "Use a/an for a non-specific singular noun, 'the' for something specific or already mentioned.", examples: ["I saw a dog. The dog was brown.", "She's an engineer."], mistake: "Don't use 'the' for general ideas: \"I like music\", not \"I like the music\"." },
    { title: "Plural Nouns", rule: "Add -s for most nouns; some nouns are irregular.", examples: ["one book, two books", "one child, two children"], mistake: "Irregular plurals don't take -s: \"childs\" is wrong, use \"children\"." },
    { title: "Subject & Object Pronouns", rule: "I/me, you/you, he/him, she/her, we/us, they/them — subject does the action, object receives it.", examples: ["She called me.", "We saw them at the park."], mistake: "\"Me called her\" is wrong — use \"I called her\"." },
    { title: "Basic Questions", rule: "Use Do/Does + subject + base verb for yes/no questions; Wh- words for information questions.", examples: ["Do you live here?", "Where do you work?"], mistake: "Don't double the verb ending: \"Does she works?\" → \"Does she work?\"." },
    { title: "Prepositions of Time & Place", rule: "Use at for exact times/points, on for days/dates, in for months/years/enclosed spaces.", examples: ["at 5pm", "on Monday", "in July, in the room"], mistake: "\"In Monday\" is wrong — say \"on Monday\"." },
    { title: "There is / There are", rule: "Use to say something exists. 'There is' for singular, 'there are' for plural.", examples: ["There is a book on the table.", "There are three chairs."], mistake: "Don't say \"It has\" for existence in English — use \"There is/are\"." },
  ],
  Intermediate: [
    { title: "Past Simple", rule: "Use for finished actions at a specific past time. Regular verbs add -ed; many common verbs are irregular.", examples: ["I visited Paris last year.", "I went to Paris in June."], mistake: "Don't say \"goed\" — the correct irregular form is \"went\"." },
    { title: "Present Continuous", rule: "Use am/is/are + verb-ing for actions happening now or temporary situations.", examples: ["I am studying right now.", "She is living in Madrid this year."], mistake: "Some verbs (like/know/want) aren't usually continuous: say \"I want\", not \"I am wanting\"." },
    { title: "Present Perfect", rule: "Use have/has + past participle to connect the past to now, or for experiences without a specific time.", examples: ["I have lived here for 5 years.", "Have you ever tried sushi?"], mistake: "Don't mix with a specific past time: \"I have visited it yesterday\" → \"I visited it yesterday\"." },
    { title: "Future: will vs going to", rule: "Use 'will' for quick decisions/predictions, 'going to' for plans already made.", examples: ["I will call you later.", "I'm going to travel next month."], mistake: "For a plan already decided, avoid \"will\": use \"I'm going to...\"." },
    { title: "Modal Verbs", rule: "can (ability), should (advice), must (obligation), may/might (possibility).", examples: ["You should rest.", "I must finish this today.", "It might rain."], mistake: "Modals are followed by the base verb: \"She can to swim\" → \"She can swim\"." },
    { title: "Comparatives & Superlatives", rule: "Add -er/-est for short adjectives, use more/most for longer ones.", examples: ["This is bigger than that.", "This is the most important step."], mistake: "Don't combine both: \"more bigger\" is wrong — just \"bigger\"." },
    { title: "Zero & First Conditional", rule: "Zero: general truths (if + present, present). First: real future possibility (if + present, will).", examples: ["If it rains, the ground gets wet.", "If it rains, I will stay home."], mistake: "Don't use \"will\" after \"if\": \"If it will rain\" → \"If it rains\"." },
    { title: "Countable & Uncountable Nouns", rule: "Countable nouns have plurals (books); uncountable nouns don't (water, advice). Use much/many/some/any accordingly.", examples: ["How many books do you have?", "How much water do you drink?"], mistake: "Don't pluralize uncountable nouns: \"advices\" is wrong — use \"advice\"." },
  ],
  Advanced: [
    { title: "Past Continuous & Past Perfect", rule: "Past continuous shows an action in progress; past perfect shows an action before another past action.", examples: ["I was cooking when she called.", "I had already left when he arrived."], mistake: "Don't use past perfect for the more recent action — it always marks the earlier one." },
    { title: "Present Perfect Continuous", rule: "Use have/has been + verb-ing for actions that started in the past and continue, emphasizing duration.", examples: ["I have been working here since 2020.", "She's been studying all day."], mistake: "Use 'since' with a starting point, 'for' with a duration: \"since 3 years\" → \"for 3 years\"." },
    { title: "Second & Third Conditional", rule: "Second: unreal present/future (if + past, would). Third: unreal past (if + past perfect, would have).", examples: ["If I were rich, I would travel more.", "If I had known, I would have come."], mistake: "Don't mix tenses: \"If I would know\" → \"If I knew\"." },
    { title: "Passive Voice", rule: "Use be + past participle when the focus is on the action or receiver, not who did it.", examples: ["The cake was baked by my mother.", "The report will be finished tomorrow."], mistake: "Match the auxiliary to the tense: \"The cake is baked yesterday\" → \"was baked\"." },
    { title: "Reported Speech", rule: "When reporting what someone said, tenses usually shift one step back into the past.", examples: ["She said, \"I'm tired.\" → She said (that) she was tired.", "He said he would call."], mistake: "Don't keep the original tense: \"She said she is tired\" → \"she was tired\"." },
    { title: "Relative Clauses", rule: "Use who/which/that/whose to add extra information about a noun without starting a new sentence.", examples: ["The man who called is my uncle.", "The book that I read was great."], mistake: "Don't add a duplicate pronoun: \"The man who he called\" is wrong." },
    { title: "Phrasal Verbs", rule: "Verb + preposition/particle combinations that often carry idiomatic meaning different from the individual words.", examples: ["I need to give up sugar.", "She's looking forward to the trip."], mistake: "Word order matters with some: \"give up it\" → \"give it up\"." },
    { title: "Wish & Advanced Modals", rule: "Use 'wish' + past for present regrets, 'wish' + past perfect for past regrets.", examples: ["I wish I studied English earlier.", "I wish I had studied harder."], mistake: "Don't use 'wish' with 'would' for your own actions — that's for wanting others to change." },
  ],
};

const IDIOMS = {
  Basics: [
    { phrase: "Piece of cake", meaning: "Something very easy to do.", example: "Don't worry about the test — it'll be a piece of cake." },
    { phrase: "Break the ice", meaning: "To do or say something that eases tension in a new situation.", example: "He told a joke to break the ice at the meeting." },
    { phrase: "Get the hang of it", meaning: "To learn how to do something.", example: "Speaking English felt hard at first, but I'm getting the hang of it." },
    { phrase: "Sounds good", meaning: "Used to agree with a plan or suggestion.", example: "\"Let's meet at 6.\" \"Sounds good!\"" },
    { phrase: "No worries", meaning: "A casual way to say it's fine, or you're welcome.", example: "\"Sorry I'm late!\" \"No worries.\"" },
    { phrase: "Time flies", meaning: "Time passes very quickly.", example: "Time flies when you're having fun." },
  ],
  Intermediate: [
    { phrase: "Hit the books", meaning: "To start studying seriously.", example: "I have an exam tomorrow, so I need to hit the books." },
    { phrase: "On the same page", meaning: "In agreement or understanding something the same way.", example: "Let's talk it through so we're on the same page." },
    { phrase: "Under the weather", meaning: "Feeling slightly ill.", example: "I'm feeling a bit under the weather today." },
    { phrase: "Bite the bullet", meaning: "To face a difficult situation with courage.", example: "I hate calling people, but I'll just bite the bullet." },
    { phrase: "Cut corners", meaning: "To do something poorly to save time or money.", example: "The company cut corners and the product broke fast." },
    { phrase: "Once in a blue moon", meaning: "Something that happens very rarely.", example: "We only eat out once in a blue moon." },
  ],
  Advanced: [
    { phrase: "Read between the lines", meaning: "To understand a hidden or implied meaning.", example: "She didn't say she was upset, but I read between the lines." },
    { phrase: "Throw in the towel", meaning: "To give up on something.", example: "After three failed attempts, he threw in the towel." },
    { phrase: "Beat around the bush", meaning: "To avoid saying something directly.", example: "Stop beating around the bush and tell me what happened." },
    { phrase: "A blessing in disguise", meaning: "Something that seems bad at first but turns out well.", example: "Losing that job was a blessing in disguise." },
    { phrase: "Get the ball rolling", meaning: "To start a process or task.", example: "Let's get the ball rolling on the new project." },
    { phrase: "Speak of the devil", meaning: "Said when someone appears right after being mentioned.", example: "Speak of the devil — I was just talking about you!" },
  ],
};

const LISTENING = [
  {
    level: "Basics",
    title: "Ordering Coffee",
    lines: [
      { speaker: "Barista", text: "Hi there, what can I get for you today?" },
      { speaker: "Customer", text: "Can I get a medium latte, please?" },
      { speaker: "Barista", text: "Sure, for here or to go?" },
      { speaker: "Customer", text: "To go, thanks." },
      { speaker: "Barista", text: "That'll be four fifty. Name for the order?" },
      { speaker: "Customer", text: "It's Sam." },
    ],
    questions: [
      { q: "What did the customer order?", options: ["A small latte", "A medium latte", "A large coffee"], correct: 1 },
      { q: "Is the order for here or to go?", options: ["For here", "To go", "It's not mentioned"], correct: 1 },
      { q: "What name did the customer give?", options: ["Sam", "Tom", "Pam"], correct: 0 },
    ],
  },
  {
    level: "Intermediate",
    title: "Planning a Weekend Trip",
    lines: [
      { speaker: "Alex", text: "Hey, are we still on for the weekend trip?" },
      { speaker: "Jamie", text: "Yeah, definitely. I was thinking we could leave Saturday morning." },
      { speaker: "Alex", text: "Sounds good. Should we book a hotel, or just camp?" },
      { speaker: "Jamie", text: "Let's camp — it's cheaper and the weather looks nice." },
      { speaker: "Alex", text: "Good idea. I'll bring the tent if you handle the food." },
      { speaker: "Jamie", text: "Deal. Let's leave around 8am so we beat the traffic." },
    ],
    questions: [
      { q: "When are they leaving?", options: ["Friday night", "Saturday morning", "Sunday afternoon"], correct: 1 },
      { q: "Where will they stay?", options: ["A hotel", "With friends", "Camping"], correct: 2 },
      { q: "Who is bringing the food?", options: ["Alex", "Jamie", "Neither"], correct: 1 },
    ],
  },
  {
    level: "Advanced",
    title: "A Job Performance Review",
    lines: [
      { speaker: "Manager", text: "Overall, you've had a strong quarter, but I want to talk about a couple of areas for growth." },
      { speaker: "Employee", text: "Sure, I appreciate the feedback. What did you have in mind?" },
      { speaker: "Manager", text: "Your project delivery has been excellent, but communication with the team could be more proactive." },
      { speaker: "Employee", text: "That's fair. I'll admit I sometimes wait too long to flag issues." },
      { speaker: "Manager", text: "Exactly. If you loop people in earlier, it'll prevent last-minute surprises." },
      { speaker: "Employee", text: "Understood. I'll set up a weekly check-in so nothing falls through the cracks." },
    ],
    questions: [
      { q: "What is the employee praised for?", options: ["Communication", "Project delivery", "Punctuality"], correct: 1 },
      { q: "What area needs improvement?", options: ["Being more proactive in communication", "Working faster", "Taking more vacation"], correct: 0 },
      { q: "What does the employee decide to do?", options: ["Quit the project", "Set up a weekly check-in", "Ask for a raise"], correct: 1 },
    ],
  },
];

const VOCAB_SETS = {
  "Daily Life": [
    { w: "commute", d: "to travel regularly between home and work", ex: "I commute by train every morning." },
    { w: "errand", d: "a short trip to do a specific task", ex: "I need to run a few errands after lunch." },
    { w: "leftovers", d: "food remaining after a meal", ex: "We had the leftovers for dinner." },
    { w: "chores", d: "routine household tasks", ex: "Saturday is when I do my chores." },
    { w: "exhausted", d: "extremely tired", ex: "I'm exhausted after that long shift." },
    { w: "grab a bite", d: "to eat something quickly", ex: "Want to grab a bite before the movie?" },
  ],
  "Work & Career": [
    { w: "deadline", d: "the time by which something must be finished", ex: "The deadline for the report is Friday." },
    { w: "colleague", d: "a person you work with", ex: "My colleague helped me finish the project." },
    { w: "brainstorm", d: "to generate ideas in a group", ex: "Let's brainstorm some solutions." },
    { w: "follow up", d: "to check on progress after an initial action", ex: "I'll follow up with you next week." },
    { w: "workload", d: "the amount of work to be done", ex: "My workload doubled this month." },
    { w: "promotion", d: "advancement to a higher position", ex: "She got a promotion last quarter." },
  ],
  "Travel": [
    { w: "itinerary", d: "a planned route or schedule for a trip", ex: "Can you send me the itinerary?" },
    { w: "layover", d: "a stop between flights", ex: "We have a 3-hour layover in Dubai." },
    { w: "accommodation", d: "a place to stay", ex: "The accommodation was close to the beach." },
    { w: "customs", d: "the border checkpoint for goods", ex: "It took an hour to get through customs." },
    { w: "sightseeing", d: "visiting interesting places as a tourist", ex: "We spent the day sightseeing downtown." },
    { w: "jet lag", d: "tiredness from crossing time zones", ex: "I'm still fighting jet lag." },
  ],
  "Emotions & Opinions": [
    { w: "overwhelmed", d: "having more than you can handle", ex: "I felt overwhelmed by all the choices." },
    { w: "reckon", d: "(informal) to think or believe", ex: "I reckon it'll rain later." },
    { w: "on the fence", d: "undecided about something", ex: "I'm on the fence about the new plan." },
    { w: "thrilled", d: "extremely happy or excited", ex: "She was thrilled with the news." },
    { w: "frustrated", d: "annoyed because of being unable to change something", ex: "He got frustrated with the delay." },
    { w: "spot on", d: "exactly correct", ex: "Your guess was spot on." },
  ],
};

const SPEAK_SENTENCES = {
  Beginner: [
    "Hello, my name is Sarah and I live in London.",
    "I usually wake up at seven in the morning.",
    "Could you tell me where the nearest station is?",
    "I would like a coffee with milk, please.",
  ],
  Intermediate: [
    "I've been learning English for about six months now.",
    "Although it was raining, we still went for a walk.",
    "Could you possibly send me that file before noon?",
    "I think the meeting could have gone a lot better.",
  ],
  Advanced: [
    "Had I known about the traffic, I would have left earlier.",
    "The proposal, while ambitious, overlooks a few key risks.",
    "It's not that I disagree, it's more that I'd like more data.",
    "By the time we arrive, the conference will have already started.",
  ],
};

const COLOR_MAP = {
  teal: { ring: "ring-teal-500/40", text: "text-teal-400", bg: "bg-teal-500", bgSoft: "bg-teal-500/10", border: "border-teal-500/30" },
  amber: { ring: "ring-amber-500/40", text: "text-amber-400", bg: "bg-amber-500", bgSoft: "bg-amber-500/10", border: "border-amber-500/30" },
  rose: { ring: "ring-rose-500/40", text: "text-rose-400", bg: "bg-rose-500", bgSoft: "bg-rose-500/10", border: "border-rose-500/30" },
};

/* ------------------------------- PERSISTENCE ------------------------------- */

const DEFAULT_PROGRESS = {
  streak: 0,
  xp: 0,
  completedTasks: [],
  knownWords: [],
  lastTab: "roadmap",
  grammarLevel: "Basics",
  idiomsLevel: "Basics",
  listeningScores: {},
  speakProgress: {},
  tutorHistory: [],
};

function useProgress() {
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);
  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("speakpath-progress", false);
        if (res && res.value) setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(res.value) });
      } catch (e) {
        /* no saved progress yet */
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    try {
      await window.storage.set("speakpath-progress", JSON.stringify(next), false);
    } catch (e) {
      /* best effort */
    }
  }, []);

  // Accepts either a full next-state object or an updater function(prev) -> patch/next.
  const save = useCallback((next) => {
    const resolved = typeof next === "function" ? next(progressRef.current) : next;
    const merged = { ...progressRef.current, ...resolved };
    progressRef.current = merged;
    setProgress(merged);
    persist(merged);
  }, [persist]);

  return { progress, save, loaded };
}

/* --------------------------------- HEADER --------------------------------- */

function Waveform() {
  const bars = [10, 18, 26, 16, 30, 20, 12, 24, 14, 22, 10, 18, 28, 16, 20];
  return (
    <div className="flex items-end gap-[3px] h-8" aria-hidden="true">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-teal-400/80"
          style={{
            height: `${h}px`,
            animation: `wave 1.2s ease-in-out ${i * 0.06}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------------------------- TABS ----------------------------------- */

const TABS = [
  { id: "roadmap", label: "Roadmap", icon: MapIcon },
  { id: "grammar", label: "Grammar", icon: GraduationCap },
  { id: "idioms", label: "Idioms", icon: Zap },
  { id: "tutor", label: "AI Tutor", icon: MessageCircle },
  { id: "speak", label: "Speak Practice", icon: Mic },
  { id: "listening", label: "Listening", icon: Headphones },
  { id: "vocab", label: "Vocabulary", icon: BookOpen },
  { id: "methods", label: "Methods", icon: Sparkles },
];

/* -------------------------------- ROADMAP TAB ------------------------------- */

function RoadmapTab({ progress, save }) {
  const [openWeek, setOpenWeek] = useState("1-0");

  const toggleTask = (key) => {
    const has = progress.completedTasks.includes(key);
    const completedTasks = has
      ? progress.completedTasks.filter((k) => k !== key)
      : [...progress.completedTasks, key];
    const xp = completedTasks.length * 10;
    save({ ...progress, completedTasks, xp, streak: has ? progress.streak : progress.streak + (progress.streak === 0 ? 1 : 0) });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
        <div className="flex items-center gap-2 text-amber-400">
          <Flame size={20} />
          <span className="font-semibold">{progress.streak} day streak</span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <div className="flex items-center gap-2 text-teal-400">
          <Award size={20} />
          <span className="font-semibold">{progress.xp} XP</span>
        </div>
        <div className="h-4 w-px bg-slate-700" />
        <span className="text-slate-400 text-sm">{progress.completedTasks.length} tasks completed</span>
      </div>

      {ROADMAP.map((m) => {
        const c = COLOR_MAP[m.color];
        return (
          <div key={m.month}>
            <div className="flex items-baseline gap-3 mb-4">
              <span className={`font-mono text-sm ${c.text}`}>MONTH {m.month}</span>
              <h3 className="text-xl font-semibold text-slate-100">{m.title}</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4">{m.subtitle}</p>
            <div className="space-y-3">
              {m.weeks.map((wk, wi) => {
                const key = `${m.month}-${wi}`;
                const isOpen = openWeek === key;
                return (
                  <div key={key} className={`rounded-xl border ${c.border} ${c.bgSoft} overflow-hidden`}>
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 text-left"
                      onClick={() => setOpenWeek(isOpen ? null : key)}
                    >
                      <div>
                        <span className="text-xs text-slate-400 font-mono">WEEK {wi + 1}</span>
                        <p className="font-medium text-slate-100">{wk.name}</p>
                      </div>
                      <ChevronDown className={`transition-transform text-slate-400 ${isOpen ? "rotate-180" : ""}`} size={18} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 space-y-3">
                        <p className="text-sm text-slate-400">{wk.focus}</p>
                        <div className="space-y-2">
                          {wk.tasks.map((t, ti) => {
                            const tKey = `${key}-${ti}`;
                            const done = progress.completedTasks.includes(tKey);
                            return (
                              <button
                                key={tKey}
                                onClick={() => toggleTask(tKey)}
                                className="w-full flex items-center gap-3 text-left bg-slate-950/40 hover:bg-slate-950/70 rounded-lg px-3 py-2 transition-colors"
                              >
                                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${done ? `${c.bg} border-transparent` : "border-slate-600"}`}>
                                  {done && <Check size={12} className="text-slate-950" />}
                                </span>
                                <span className={`text-sm ${done ? "text-slate-500 line-through" : "text-slate-200"}`}>{t}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------- GRAMMAR TAB -------------------------------- */

const GRAMMAR_COLORS = { Basics: COLOR_MAP.teal, Intermediate: COLOR_MAP.amber, Advanced: COLOR_MAP.rose };

function GrammarTab({ progress, save }) {
  const [level, setLevel] = useState(progress?.grammarLevel || "Basics");
  const topics = GRAMMAR[level];
  const c = GRAMMAR_COLORS[level];

  const selectLevel = (lvl) => {
    setLevel(lvl);
    save?.({ grammarLevel: lvl });
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-slate-100">Basics to Fluent: English Grammar</h2>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">Every rule you need for speaking, from your very first sentence to natural, fluent conversation — grouped by level so you always know what to learn next.</p>
      </div>

      <div className="flex gap-2">
        {Object.keys(GRAMMAR).map((lvl) => {
          const lc = GRAMMAR_COLORS[lvl];
          return (
            <button
              key={lvl}
              onClick={() => selectLevel(lvl)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                level === lvl ? `${lc.bg} text-slate-950` : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {lvl}
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {topics.map((t) => (
          <div key={t.title} className={`rounded-xl border ${c.border} ${c.bgSoft} p-5 space-y-3`}>
            <p className="font-medium text-slate-100">{t.title}</p>
            <p className="text-sm text-slate-300">{t.rule}</p>
            <div className="space-y-1.5">
              {t.examples.map((ex) => (
                <div key={ex} className="flex items-center justify-between gap-2 bg-slate-950/40 rounded-lg px-3 py-2">
                  <span className="text-sm text-slate-200">{ex}</span>
                  <button onClick={() => speak(ex)} className="shrink-0 text-slate-400 hover:text-teal-400 transition-colors">
                    <Volume2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-2 pt-1 text-xs text-amber-400/90">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{t.mistake}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- IDIOMS TAB -------------------------------- */

function IdiomsTab({ progress, save }) {
  const [level, setLevel] = useState(progress?.idiomsLevel || "Basics");
  const items = IDIOMS[level];
  const c = GRAMMAR_COLORS[level];

  const selectLevel = (lvl) => {
    setLevel(lvl);
    save?.({ idiomsLevel: lvl });
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-slate-100">Idioms & Everyday Expressions</h2>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">Sound natural, not textbook. Learn the phrases native speakers actually use, from casual chats to advanced conversation.</p>
      </div>

      <div className="flex gap-2">
        {Object.keys(IDIOMS).map((lvl) => {
          const lc = GRAMMAR_COLORS[lvl];
          return (
            <button
              key={lvl}
              onClick={() => selectLevel(lvl)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                level === lvl ? `${lc.bg} text-slate-950` : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {lvl}
            </button>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((it) => (
          <div key={it.phrase} className={`rounded-xl border ${c.border} ${c.bgSoft} p-5 space-y-2`}>
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-slate-100">{it.phrase}</p>
              <button onClick={() => speak(it.phrase)} className="shrink-0 text-slate-400 hover:text-teal-400 transition-colors">
                <Volume2 size={14} />
              </button>
            </div>
            <p className="text-sm text-slate-300">{it.meaning}</p>
            <p className="text-sm text-slate-400 italic">"{it.example}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- LISTENING TAB ------------------------------ */

function ListeningTab({ progress, save }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const ex = LISTENING[i];
  const c = GRAMMAR_COLORS[ex.level];
  const scores = progress?.listeningScores || {};

  const playDialogue = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setPlaying(true);
    let idx = 0;
    const speakNext = () => {
      if (idx >= ex.lines.length) { setPlaying(false); return; }
      const line = ex.lines[idx];
      const u = new SpeechSynthesisUtterance(line.text);
      u.lang = "en-US";
      u.rate = 0.95;
      u.pitch = idx % 2 === 0 ? 1 : 0.85;
      u.onend = () => { idx += 1; speakNext(); };
      window.speechSynthesis.speak(u);
    };
    speakNext();
  };

  const selectExercise = (idx) => {
    setI(idx);
    setShowQuestions(false);
    setAnswers({});
    setSubmitted(false);
    window.speechSynthesis?.cancel();
    setPlaying(false);
  };

  const score = ex.questions.reduce((s, q, qi) => s + (answers[qi] === q.correct ? 1 : 0), 0);

  const checkAnswers = () => {
    setSubmitted(true);
    const prevBest = scores[ex.title]?.best ?? -1;
    save?.((prev) => ({
      listeningScores: {
        ...(prev.listeningScores || {}),
        [ex.title]: { best: Math.max(prevBest, score), total: ex.questions.length },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-slate-100">Listening Practice</h2>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">Listen to real-style dialogues, then test your comprehension — from simple everyday chats to advanced workplace conversations.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {LISTENING.map((l, idx) => (
          <button
            key={l.title}
            onClick={() => selectExercise(idx)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              i === idx ? `${GRAMMAR_COLORS[l.level].bg} text-slate-950` : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {l.level}: {l.title}{scores[l.title] ? ` · ${scores[l.title].best}/${scores[l.title].total}` : ""}
          </button>
        ))}
      </div>

      <div className={`rounded-xl border ${c.border} ${c.bgSoft} p-5 space-y-4`}>
        <div className="flex items-center justify-between">
          <p className="font-medium text-slate-100">{ex.title}</p>
          <button
            onClick={playDialogue}
            disabled={playing}
            className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 text-xs font-medium rounded-full px-3 py-1.5 transition-colors"
          >
            {playing ? <Loader2 size={13} className="animate-spin" /> : <Volume2 size={13} />}
            {playing ? "Playing…" : "Play dialogue"}
          </button>
        </div>

        <div className="space-y-1.5">
          {ex.lines.map((l, li) => (
            <p key={li} className="text-sm text-slate-400"><span className="text-slate-200 font-medium">{l.speaker}:</span> {l.text}</p>
          ))}
        </div>

        {!showQuestions ? (
          <button
            onClick={() => setShowQuestions(true)}
            className="text-sm text-teal-400 hover:text-teal-300 font-medium"
          >
            Answer comprehension questions →
          </button>
        ) : (
          <div className="space-y-4 pt-2 border-t border-slate-800/60">
            {ex.questions.map((q, qi) => (
              <div key={qi} className="space-y-2">
                <p className="text-sm text-slate-200">{qi + 1}. {q.q}</p>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt, oi) => {
                    const chosen = answers[qi] === oi;
                    const isCorrect = submitted && oi === q.correct;
                    const isWrong = submitted && chosen && oi !== q.correct;
                    return (
                      <button
                        key={opt}
                        onClick={() => !submitted && setAnswers((a) => ({ ...a, [qi]: oi }))}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          isCorrect ? "border-teal-500 bg-teal-500/20 text-teal-300" :
                          isWrong ? "border-rose-500 bg-rose-500/20 text-rose-300" :
                          chosen ? "border-teal-500 bg-teal-500/10 text-teal-300" : "border-slate-700 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            {!submitted ? (
              <button
                onClick={checkAnswers}
                disabled={Object.keys(answers).length < ex.questions.length}
                className="bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 text-sm font-medium rounded-full px-4 py-2 transition-colors"
              >
                Check answers
              </button>
            ) : (
              <p className="text-sm text-slate-300">You scored {score} / {ex.questions.length} 🎉</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- TUTOR TAB -------------------------------- */

const STARTER_PROMPTS = [
  "Let's talk about my weekend plans",
  "Help me practice a job interview",
  "Correct my grammar as we chat",
  "Let's debate: cities vs. small towns",
];

const TUTOR_SYSTEM_PROMPT =
  "You are a warm, encouraging live English speaking tutor for a learner aiming for conversational fluency in 3 months. You are having a real spoken conversation with them — your reply will be read aloud, so keep it natural, conversational, and fairly short (1-4 sentences), ending with a follow-up question to keep them talking. Carefully check what the learner just said for any grammar, word-choice, verb tense, or phrasing mistakes. Respond with ONLY a valid JSON object (no markdown, no code fences, no text outside the JSON) with exactly these fields: " +
  '{"reply": "your natural spoken conversational reply", "correction": "a short correction note in the form \'you said X → say: Y\' if the learner made a mistake, otherwise null", "correctedSentence": "the corrected version of what they said, otherwise null"}';

function parseTutorResponse(raw) {
  try {
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return {
      reply: parsed.reply || raw,
      correction: parsed.correction || null,
      correctedSentence: parsed.correctedSentence || null,
    };
  } catch (e) {
    return { reply: raw, correction: null, correctedSentence: null };
  }
}

function TutorTab({ progress, save }) {
  const [mode, setMode] = useState("voice"); // "voice" | "text"
  const [messages, setMessages] = useState(() =>
    progress?.tutorHistory?.length
      ? progress.tutorHistory
      : [{ role: "assistant", content: "Hi! I'm your live English speaking tutor. Start the conversation and just talk naturally — if you make a mistake, I'll correct it gently and we'll keep talking." }]
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationOn, setConversationOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(true);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const conversationOnRef = useRef(false);
  const messagesRef = useRef(messages);

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { conversationOnRef.current = conversationOn; }, [conversationOn]);

  useEffect(() => {
    save?.({ tutorHistory: messages.slice(-40) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR || !window.speechSynthesis) {
      setVoiceSupported(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setLiveTranscript(interim);
      if (final.trim()) {
        setLiveTranscript("");
        handleUserSpeech(final.trim());
      }
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    return () => rec.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speakReply = (text) =>
    new Promise((resolve) => {
      if (!window.speechSynthesis) return resolve();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.98;
      setSpeaking(true);
      u.onend = () => { setSpeaking(false); resolve(); };
      u.onerror = () => { setSpeaking(false); resolve(); };
      window.speechSynthesis.speak(u);
    });

  const getApiKey = () => {
    let key = localStorage.getItem("speakpath-anthropic-key");
    if (!key) {
      key = window.prompt(
        "This AI Tutor calls the Anthropic API directly from your browser.\nPaste your Anthropic API key (from console.anthropic.com) to enable it:"
      );
      if (key) localStorage.setItem("speakpath-anthropic-key", key.trim());
    }
    return key ? key.trim() : null;
  };

  const callTutor = async (nextMessages) => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("No API key provided");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: TUTOR_SYSTEM_PROMPT,
        messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await response.json();
    const raw = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).filter(Boolean).join("\n");
    return parseTutorResponse(raw || "");
  };

  const handleUserSpeech = async (text) => {
    if (!text) return;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setListening(false);
    const nextMessages = [...messagesRef.current, { role: "user", content: text }];
    setMessages(nextMessages);
    setLoading(true);
    try {
      const parsed = await callTutor(nextMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: parsed.reply, correction: parsed.correction, correctedSentence: parsed.correctedSentence }]);
      setLoading(false);
      await speakReply(parsed.reply);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "I had trouble responding just now — let's try again." }]);
      setLoading(false);
    }
    if (conversationOnRef.current) startListening();
  };

  const startListening = () => {
    if (!recognitionRef.current || listening || speaking) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (e) {}
  };

  const startConversation = () => {
    setConversationOn(true);
    startListening();
  };

  const endConversation = () => {
    setConversationOn(false);
    setLiveTranscript("");
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setListening(false);
    setSpeaking(false);
  };

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const parsed = await callTutor(nextMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: parsed.reply, correction: parsed.correction, correctedSentence: parsed.correctedSentence }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: "assistant", content: "I had trouble responding just now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`h-9 w-9 rounded-full flex items-center justify-center ${speaking ? "bg-teal-500/30" : "bg-teal-500/20"}`}>
            <Sparkles size={16} className="text-teal-400" />
          </div>
          <div>
            <p className="font-medium text-slate-100">Your AI Speaking Tutor</p>
            <p className="text-xs text-slate-500">
              {mode === "voice" ? (conversationOn ? (speaking ? "Speaking…" : listening ? "Listening…" : "Live conversation on") : "Live voice conversation") : "Text mode"}
            </p>
          </div>
        </div>
        <div className="flex bg-slate-800 rounded-full p-1">
          <button
            onClick={() => { setMode("voice"); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${mode === "voice" ? "bg-teal-500 text-slate-950" : "text-slate-400"}`}
          >
            <Mic size={13} /> Voice
          </button>
          <button
            onClick={() => { endConversation(); setMode("text"); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${mode === "text" ? "bg-teal-500 text-slate-950" : "text-slate-400"}`}
          >
            <Keyboard size={13} /> Text
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] space-y-1.5`}>
              <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user" ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-slate-100"
              }`}>
                {m.content}
              </div>
              {m.correction && (
                <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-300">
                  <AlertCircle size={13} className="shrink-0 mt-0.5" />
                  <div>
                    <p>{m.correction}</p>
                    {m.correctedSentence && <p className="mt-1 text-amber-200 font-medium">"{m.correctedSentence}"</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {liveTranscript && (
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm bg-teal-500/30 text-teal-100 italic">{liveTranscript}…</div>
          </div>
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-2 text-slate-400 text-sm">
              <Loader2 size={14} className="animate-spin" /> thinking…
            </div>
          </div>
        )}
      </div>

      {mode === "text" && messages.length === 1 && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {STARTER_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full px-3 py-1.5 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {mode === "voice" ? (
        <div className="p-4 border-t border-slate-800 flex flex-col items-center gap-2">
          {!voiceSupported ? (
            <p className="text-sm text-amber-400/90 text-center max-w-sm">
              Live voice needs a browser with speech recognition and speech synthesis (Chrome on desktop or Android works best). Switch to Text mode to keep practicing.
            </p>
          ) : (
            <>
              <button
                onClick={conversationOn ? endConversation : startConversation}
                disabled={loading}
                className={`flex items-center gap-2 rounded-full px-6 py-3 font-medium transition-colors disabled:opacity-50 ${
                  conversationOn ? "bg-rose-500 hover:bg-rose-400 text-white" : "bg-teal-500 hover:bg-teal-400 text-slate-950"
                }`}
              >
                {conversationOn ? <PhoneOff size={18} /> : <PhoneCall size={18} />}
                {conversationOn ? "End conversation" : "Start voice conversation"}
              </button>
              <p className="text-xs text-slate-500">
                {conversationOn ? "Just talk naturally — the tutor listens, replies out loud, and corrects mistakes live." : "Tap to start a live spoken conversation with your tutor."}
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="p-4 border-t border-slate-800 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type what you'd like to say…"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
          <button
            onClick={() => send()}
            disabled={loading}
            className="h-10 w-10 shrink-0 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 flex items-center justify-center transition-colors"
          >
            <Send size={16} className="text-slate-950" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- SPEAK PRACTICE ----------------------------- */

function similarity(target, spoken) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s']/g, "").trim().split(/\s+/);
  const t = norm(target);
  const s = norm(spoken);
  const sSet = new Set(s);
  const matched = t.filter((w) => sSet.has(w)).length;
  return Math.round((matched / t.length) * 100);
}

function SpeakTab({ progress, save }) {
  const [level, setLevel] = useState("Beginner");
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [score, setScore] = useState(null);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const speakProgress = progress?.speakProgress || {};

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      const acc = similarity(SPEAK_SENTENCES[level][index], text);
      setScore(acc);
      const key = `${level}-${index}`;
      save?.((prev) => {
        const prevBest = prev.speakProgress?.[key] ?? -1;
        return { speakProgress: { ...(prev.speakProgress || {}), [key]: Math.max(prevBest, acc) } };
      });
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
  }, [level, index]);

  const target = SPEAK_SENTENCES[level][index];

  const toggleListen = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setTranscript("");
      setScore(null);
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const speakTarget = () => {
    if (!window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(target);
    u.lang = "en-US";
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
  };

  const next = () => {
    setIndex((i) => (i + 1) % SPEAK_SENTENCES[level].length);
    setTranscript("");
    setScore(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {Object.keys(SPEAK_SENTENCES).map((lvl) => (
          <button
            key={lvl}
            onClick={() => { setLevel(lvl); setIndex(0); setTranscript(""); setScore(null); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              level === lvl ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center space-y-6">
        <p className="text-xs uppercase tracking-wide text-slate-500 font-mono">Say this sentence out loud</p>
        <p className="text-2xl font-medium text-slate-100 leading-snug">{target}</p>
        {speakProgress[`${level}-${index}`] != null && (
          <p className="text-xs text-slate-500">Best so far: {speakProgress[`${level}-${index}`]}%</p>
        )}

        <div className="flex items-center justify-center gap-3">
          <button onClick={speakTarget} className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full px-4 py-2 transition-colors">
            <Volume2 size={16} /> Hear it
          </button>
          {supported ? (
            <button
              onClick={toggleListen}
              className={`flex items-center gap-2 text-sm font-medium rounded-full px-5 py-2 transition-colors ${
                listening ? "bg-rose-500 text-white" : "bg-teal-500 text-slate-950 hover:bg-teal-400"
              }`}
            >
              {listening ? <Square size={16} /> : <Mic size={16} />}
              {listening ? "Stop" : "Speak it"}
            </button>
          ) : null}
          <button onClick={next} className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full px-4 py-2 transition-colors">
            <RefreshCw size={16} /> Next
          </button>
        </div>

        {!supported && (
          <p className="text-sm text-amber-400/90 max-w-md mx-auto">
            Live speech scoring needs a browser with speech recognition (like Chrome on desktop or Android). You can still use "Hear it" and practice by shadowing.
          </p>
        )}

        {transcript && (
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-sm text-slate-500">You said:</p>
            <p className="text-slate-200">"{transcript}"</p>
            {score !== null && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="w-40 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${score >= 80 ? "bg-teal-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500"}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className="text-sm font-mono text-slate-300">{score}% match</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------------- VOCAB TAB -------------------------------- */

function VocabTab({ progress, save }) {
  const [category, setCategory] = useState("Daily Life");
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const words = VOCAB_SETS[category];
  const card = words[i];
  const known = progress.knownWords.includes(`${category}-${card.w}`);

  const mark = (isKnown) => {
    const key = `${category}-${card.w}`;
    const knownWords = isKnown
      ? [...new Set([...progress.knownWords, key])]
      : progress.knownWords.filter((k) => k !== key);
    save({ ...progress, knownWords });
    setFlipped(false);
    setI((prev) => (prev + 1) % words.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {Object.keys(VOCAB_SETS).map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setI(0); setFlipped(false); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === cat ? "bg-teal-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => setFlipped((f) => !f)}
          className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-10 text-center min-h-[220px] flex flex-col items-center justify-center gap-3 hover:border-teal-500/40 transition-colors"
        >
          {!flipped ? (
            <>
              <p className="text-3xl font-semibold text-slate-100">{card.w}</p>
              {known && <span className="text-xs text-teal-400 font-mono">✓ marked known</span>}
              <p className="text-xs text-slate-500 mt-2">Tap to reveal meaning</p>
            </>
          ) : (
            <>
              <p className="text-slate-200">{card.d}</p>
              <p className="text-sm text-slate-500 italic">"{card.ex}"</p>
            </>
          )}
        </button>

        <div className="flex gap-3">
          <button onClick={() => mark(false)} className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-full px-4 py-2 transition-colors">
            <X size={16} /> Still learning
          </button>
          <button onClick={() => mark(true)} className="flex items-center gap-2 text-sm text-slate-950 bg-teal-500 hover:bg-teal-400 rounded-full px-4 py-2 transition-colors font-medium">
            <Check size={16} /> I know this
          </button>
        </div>

        <p className="text-xs text-slate-500 font-mono">{i + 1} / {words.length} · {progress.knownWords.filter((k) => k.startsWith(category)).length} known in this set</p>
      </div>
    </div>
  );
}

/* -------------------------------- METHODS TAB -------------------------------- */

function MethodsTab() {
  return (
    <div className="space-y-6">
      <p className="text-slate-400 max-w-2xl">
        Fluency comes from combining methods, not relying on one. Mix a few of these into your week alongside your roadmap and AI tutor sessions.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {METHODS.map((m) => (
          <div key={m.title} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <m.icon size={18} className="text-teal-400" />
            </div>
            <div>
              <p className="font-medium text-slate-100">{m.title}</p>
              <p className="text-sm text-slate-400 mt-1">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------- APP ------------------------------------ */

export default function App() {
  const [tab, setTab] = useState("roadmap");
  const { progress, save, loaded } = useProgress();
  const restoredTab = useRef(false);

  useEffect(() => {
    if (loaded && !restoredTab.current) {
      restoredTab.current = true;
      if (progress.lastTab) setTab(progress.lastTab);
    }
  }, [loaded, progress.lastTab]);

  const changeTab = (id) => {
    setTab(id);
    save({ lastTab: id });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes wave {
          0%, 100% { transform: scaleY(0.4); }
          50% { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
        .font-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <header className="border-b border-slate-800 sticky top-0 bg-slate-950/90 backdrop-blur z-10">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Waveform />
            <div>
              <h1 className="font-display text-lg font-semibold leading-none">SpeakPath</h1>
              <p className="text-[11px] text-slate-500 mt-0.5">Fluent in 3 months, one conversation at a time</p>
            </div>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-5 flex gap-1 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTab(t.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.id ? "bg-teal-500 text-slate-950" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        {tab === "roadmap" && <RoadmapTab progress={progress} save={save} />}
        {tab === "grammar" && <GrammarTab progress={progress} save={save} />}
        {tab === "idioms" && <IdiomsTab progress={progress} save={save} />}
        {tab === "tutor" && <TutorTab progress={progress} save={save} />}
        {tab === "speak" && <SpeakTab progress={progress} save={save} />}
        {tab === "listening" && <ListeningTab progress={progress} save={save} />}
        {tab === "vocab" && <VocabTab progress={progress} save={save} />}
        {tab === "methods" && <MethodsTab />}
      </main>
    </div>
  );
}

import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")).render(<App />);
