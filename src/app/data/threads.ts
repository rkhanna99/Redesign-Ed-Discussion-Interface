export interface Thread {
  id: number;
  title: string;
  category: string;
  author: string;
  avatar?: string;
  time: string;
  timeLong?: string;
  comments: number;
  likes?: number;
  views?: number;
  resolved?: boolean;
  unread?: boolean;
  isAnnouncement?: boolean;
  newComments?: number;
  body?: string[];
  answer?: { author: string; avatar: string; role: string; time: string; text: string };
  iCommented?: boolean;
  repliedToMe?: boolean;
}

export const CURRENT_USER = "Rahul Khanna";

const initials = (name: string) =>
  name
    .replace(/^Anonymous\s+/i, "A ")
    .replace(/^Prof\.\s+/i, "")
    .replace(/^TA\s*-\s*/i, "")
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const courseThreads: Record<string, Thread[]> = {
  CS6750: [
    {
      id: 2697, title: "Anonymous Posting Redesign", category: "Class Discussion",
      author: "Anonymous Stork", time: "20h", timeLong: "20 hours ago", comments: 4, views: 69, resolved: true, iCommented: true,
      body: [
        "I've been thinking about the anonymous feature on Ed Discussion because I use it most of the time. I just default to posting anonymously because for whatever reason makes me feel more comfortable, regardless of what I'm posting or commenting. But the way it's designed causes me problems, especially in classes like CS 7637/Knowledge-Based AI where I post pretty frequently on a regular thread for ARC-AGI daily challenges.",
        "I think the issue isn't anonymity itself, it's the lack of feedback and visibility for the user. From an HCI perspective, this is a visibility of system status problem.",
      ],
      answer: { author: "Teaching Assistant", avatar: "TA", role: "TA", time: "18 hours ago", text: "Great observation! This is exactly the kind of usability analysis we look for. You might also consider how recognition vs recall plays into this." },
    },
    {
      id: 2696, title: "Book Club Participation Points", category: "Class Discussion",
      author: "Travis A Greenlee", time: "1d", timeLong: "1 day ago", comments: 4, views: 54, resolved: true, unread: true, iCommented: true,
      body: [
        "Quick clarification — do book club meetings count toward the participation rubric even if we hold them outside of Ed? Our group has been meeting over Zoom and posting notes afterward.",
      ],
      answer: { author: "TA - Priya Shah", avatar: "PS", role: "TA", time: "22 hours ago", text: "Yes — external meetings count as long as you post a brief recap in the Book Club thread." },
    },
    {
      id: 2695, title: "participation points -- candidate exam questions", category: "Class Discussion",
      author: "Rahul Khanna", time: "3d", timeLong: "3 days ago", comments: 4, views: 41, resolved: true, newComments: 1, repliedToMe: true,
      body: [
        "For the candidate exam question activity: are we supposed to submit one question per person, or one per group? The instructions reference both.",
      ],
      answer: { author: "TA - Priya Shah", avatar: "PS", role: "TA", time: "2 days ago", text: "One per person, with a suggested answer." },
    },
    {
      id: 2694, title: "Help with our survey", category: "Class Discussion",
      author: "Rolando Raynes Punongbayan Jr.", time: "3d", timeLong: "3 days ago", comments: 4, views: 38, resolved: true, iCommented: true,
      body: [
        "Our team project is studying how students use discussion forums across classes. If anyone has a few minutes, we'd love your input — the survey is 8 questions and all responses are anonymous.",
      ],
    },
    {
      id: 2693, title: "Fall 2026 Class Registration Dates", category: "Announcements",
      author: "Max Ho", time: "4d", timeLong: "4 days ago", comments: 23, likes: 22, views: 412, isAnnouncement: true,
      body: [
        "Registration for Fall 2026 opens on May 18. OMSCS students enrolled in 2+ semesters get priority access starting May 16.",
      ],
    },
    {
      id: 2692, title: "Team Project Peer Review", category: "Class Discussion",
      author: "Anonymous Chicken", time: "4d", timeLong: "4 days ago", comments: 6, likes: 1, views: 72, resolved: true,
      body: [
        "Is the peer review form submitted individually or as a team? And is it visible to teammates?",
      ],
      answer: { author: "TA - Priya Shah", avatar: "PS", role: "TA", time: "3 days ago", text: "Individual, and responses are confidential." },
    },
    {
      id: 2691, title: "Distributed Cognition in Practice", category: "Lectures",
      author: "Emediong Francis Boniface", time: "5d", timeLong: "5 days ago", comments: 9, views: 118, isAnnouncement: true, unread: true,
      body: [
        "Sharing a short write-up applying distributed cognition to an air traffic control case study I read last week. Curious whether others thought the Hutchins framing held up in more modern, UI-heavy examples.",
      ],
    },
    {
      id: 2690, title: "Can we go back to old reviews and surveys?", category: "Class Discussion",
      author: "Oluwademilade Bolatimi", time: "5d", timeLong: "5 days ago", comments: 4, views: 29, resolved: true,
      body: [
        "Once I submit a survey or peer review, the link disappears from my dashboard. Is there a way to view what I submitted?",
      ],
      answer: { author: "TA - Priya Shah", avatar: "PS", role: "TA", time: "4 days ago", text: "Not currently — we're tracking it as a feature request." },
    },
  ],
  CS7646: [
    {
      id: 4001, title: "Project 6: Indicator Evaluation debugging", category: "Homework",
      author: "Kevin Tran", time: "3h", timeLong: "3 hours ago", comments: 12, views: 134, unread: true, iCommented: true,
      body: [
        "I'm running into an issue with my indicator evaluation for Project 6. My Bollinger Bands implementation seems to match the expected output for the sample data, but when I run it against the full dataset, my values drift significantly after the first 50 trading days.",
      ],
      answer: { author: "TA - Rahul Menon", avatar: "RM", role: "TA", time: "1 hour ago", text: "Check whether you're normalizing against the first day's price before or after computing your indicators." },
    },
    {
      id: 4002, title: "Clarification on Marketsim expected output", category: "Homework",
      author: "Anonymous Falcon", time: "8h", timeLong: "8 hours ago", comments: 7, views: 61, resolved: true,
      body: ["The Marketsim instructions say to output portfolio values on trading days only, but the sample output seems to include a row for the start date even when no trades occurred. Which is correct?"],
      answer: { author: "TA - Rahul Menon", avatar: "RM", role: "TA", time: "6 hours ago", text: "Include the start date row with the starting cash value." },
    },
    {
      id: 4003, title: "Q-learning convergence issues in Project 7", category: "Class Discussion",
      author: "Rachel Moore", time: "12h", timeLong: "12 hours ago", comments: 15, likes: 8, views: 98,
      body: ["My Q-learner is converging on the sample navigation problem but oscillating on the trading problem. I've tuned alpha and gamma pretty aggressively. Curious what state representation others settled on."],
    },
    {
      id: 4004, title: "Midterm study guide — collaborative doc", category: "Exam",
      author: "David Kim", time: "1d", timeLong: "1 day ago", comments: 31, likes: 27, views: 502, isAnnouncement: true,
      body: ["Starting a shared study doc for the midterm. Linked in the comments. Feel free to add your own notes, practice questions, and explanations."],
    },
    {
      id: 4005, title: "Pandas vs NumPy performance for large datasets", category: "Class Discussion",
      author: "Sanjay Gupta", time: "1d", timeLong: "1 day ago", comments: 9, views: 74, resolved: true,
      body: ["On a dataset of ~10M rows I'm seeing pandas rolling operations run ~3x slower than an equivalent NumPy implementation. Is this expected?"],
      answer: { author: "TA - Rahul Menon", avatar: "RM", role: "TA", time: "20 hours ago", text: "Expected. pandas has per-window overhead that adds up." },
    },
    {
      id: 4006, title: "Random forest vs decision tree for strategy learner", category: "Class Discussion",
      author: "Anonymous Penguin", time: "2d", timeLong: "2 days ago", comments: 6, views: 51,
      body: ["Anyone compared the two learners head-to-head on the strategy problem? My random forest is slightly better on in-sample but much worse out-of-sample."],
    },
    {
      id: 4007, title: "Lecture 14: Reinforcement Learning recap", category: "Lectures",
      author: "Prof. Tucker Balch", time: "3d", timeLong: "3 days ago", comments: 4, views: 203, isAnnouncement: true, unread: true,
      body: ["Quick recap of Lecture 14 and the key framing for how RL maps onto the trading problem. Slides attached."],
    },
    {
      id: 4008, title: "Autograder timeout — anyone else?", category: "Homework",
      author: "Maria Gonzalez", time: "3d", timeLong: "3 days ago", comments: 18, likes: 12, views: 166, resolved: true,
      body: ["My submission is timing out on the autograder for Project 5, but runs in under a minute locally. Anyone else seeing this today?"],
      answer: { author: "TA - Rahul Menon", avatar: "RM", role: "TA", time: "2 days ago", text: "We had a Gradescope queue spike earlier today. Resubmitting now should work." },
    },
    {
      id: 4009, title: "Sharing my Project 7 experiment setup", category: "Class Discussion",
      author: "Rahul Khanna", time: "18h", timeLong: "18 hours ago", comments: 3, likes: 2, views: 57,
      body: [
        "I ended up building a small harness to compare state representations side by side before tuning the learner. It made it much easier to see whether a change was actually improving the policy or just overfitting noise.",
        "If helpful, I can post a short write-up on how I structured the experiment logs and evaluation plots.",
      ],
    },
  ],
  CS6200: [
    {
      id: 5001, title: "Project 3: GRPC segfault on submit", category: "Homework",
      author: "Anonymous Tiger", time: "2h", timeLong: "2 hours ago", comments: 8, views: 87, unread: true,
      body: ["Getting a segfault when submitting Project 3 (GRPC file transfer) to Gradescope, but it runs fine locally on my Ubuntu 22.04 VM."],
      answer: { author: "TA - Jessica Liu", avatar: "JL", role: "TA", time: "45 minutes ago", text: "The Gradescope container has fewer resources than your local VM. Check stack-allocated buffers inside thread functions." },
    },
    {
      id: 5002, title: "Barrier synchronization — pthreads approach", category: "Class Discussion",
      author: "Chris Brooks", time: "6h", timeLong: "6 hours ago", comments: 5, views: 58, resolved: true,
      body: ["For the barrier question in PS2, I implemented it with a condition variable and a counter. It works but feels clunky. Is there a cleaner idiomatic pthreads approach?"],
      answer: { author: "TA - Jessica Liu", avatar: "JL", role: "TA", time: "4 hours ago", text: "Your approach is fine and idiomatic." },
    },
    {
      id: 5003, title: "Clarification on IPC shared memory project", category: "Homework",
      author: "Fatima Al-Rashid", time: "10h", timeLong: "10 hours ago", comments: 11, likes: 4, views: 92, repliedToMe: true,
      body: ["The project spec mentions both SysV and POSIX shared memory APIs as acceptable. Is there a preference from a grading standpoint?"],
    },
    {
      id: 5004, title: "Midterm 1 results posted", category: "Announcements",
      author: "Prof. Ada Gavrilovska", time: "1d", timeLong: "1 day ago", comments: 42, likes: 18, views: 874, isAnnouncement: true,
      body: ["Midterm 1 grades are live. Regrade requests open Monday and close Friday."],
    },
    {
      id: 5005, title: "Recommended C debugging tools?", category: "Class Discussion",
      author: "Lin Zhang", time: "2d", timeLong: "2 days ago", comments: 14, likes: 9, views: 137, resolved: true,
      body: ["Coming back to C after years of higher-level work. Besides gdb and Valgrind, what do folks use day to day?"],
    },
    {
      id: 5006, title: "Virtual memory page table walkthrough", category: "Lectures",
      author: "Anonymous Owl", time: "2d", timeLong: "2 days ago", comments: 7, views: 82, unread: true,
      body: ["Putting together a walkthrough diagram for the multi-level page table example from lecture. Posting a draft — feedback welcome."],
    },
    {
      id: 5007, title: "Project 2 retrospective and tips", category: "Class Discussion",
      author: "Nadia Rossi", time: "4d", timeLong: "4 days ago", comments: 19, likes: 15, views: 211,
      body: ["Now that Project 2 is graded, sharing a short retrospective on what worked and what didn't."],
    },
    {
      id: 5008, title: "Thread pool implementation patterns", category: "Class Discussion",
      author: "Tom Henderson", time: "5d", timeLong: "5 days ago", comments: 6, views: 64, resolved: true,
      body: ["Comparing a few thread pool patterns — bounded queue vs. unbounded, blocking vs. non-blocking submit. Curious what others ended up with for Project 1."],
      answer: { author: "TA - Jessica Liu", avatar: "JL", role: "TA", time: "4 days ago", text: "Bounded blocking queue is the safest default for the workload in P1." },
    },
    {
      id: 5009, title: "My notes on debugging Project 3 concurrency issues", category: "Class Discussion",
      author: "Rahul Khanna", time: "14h", timeLong: "14 hours ago", comments: 2, likes: 1, views: 44,
      body: [
        "I kept hitting intermittent failures while stress-testing my file transfer implementation, so I started logging thread lifecycle events and request timing in a separate debug mode.",
        "That made it much easier to spot where I was reusing buffers too aggressively. Posting in case a lightweight logging approach helps anyone else.",
      ],
    },
  ],
};

for (const list of Object.values(courseThreads)) {
  for (const t of list) {
    if (!t.avatar) t.avatar = initials(t.author);
  }
}
