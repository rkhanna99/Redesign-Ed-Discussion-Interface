export interface CommunityReply {
  author: string;
  avatar: string;
  time: string;
  text: string;
}

export interface CommunityPost {
  id: number;
  author: string;
  avatar: string;
  time: string;
  title: string;
  body: string[];
  tag: string;
  tagColor: string;
  likes: number;
  views?: number;
  comments: number;
  replies: CommunityReply[];
  createdByCurrentUser?: boolean;
}

function buildCommunityPost(post: Omit<CommunityPost, "comments">): CommunityPost {
  return {
    ...post,
    comments: post.replies.length,
  };
}

function welcomePost(id: number, course: string, emoji: string, time: string, likes: number, replies: CommunityReply[]): CommunityPost {
  return buildCommunityPost({
    id,
    author: "Community Bot",
    avatar: "CB",
    time,
    title: `Introduce yourself! ${course} Spring 2026 ${emoji}`,
    body: [
      "Welcome! Share a bit about yourself - your background, where you're based, and what drew you to this class.",
      "No format needed. A sentence or two is plenty, and feel free to ask questions of classmates too.",
    ],
    tag: "Introductions",
    tagColor: "bg-emerald-100 text-emerald-700",
    likes,
    views: likes * 8 + replies.length * 3,
    replies,
  });
}

export const communityPosts: Record<string, CommunityPost[]> = {
  CS6750: [
    welcomePost(3001, "CS6750", "👋", "2h ago", 32, [
      { author: "Sarah Chen", avatar: "SC", time: "1h ago", text: "Hi everyone, I am in San Francisco and work in product design. Excited to meet more people taking HCI this term." },
      { author: "Rahul Khanna", avatar: "RK", time: "58m ago", text: "I am based in Herndon, Virginia and especially interested in how class communities can feel more human." },
      { author: "Marcus Williams", avatar: "MW", time: "42m ago", text: "I am in Virginia too and come from UX research. Looking forward to swapping notes with this group." },
    ]),
    buildCommunityPost({
      id: 3002,
      author: "Sarah Chen",
      avatar: "SC",
      time: "5h ago",
      title: "Atlanta HCI students - coffee meetup?",
      body: [
        "Would love to organize a casual meetup for CS6750 students in the Atlanta area. Thinking Saturday afternoon at Octane Coffee in Midtown.",
        "No agenda - just an excuse to put faces to Ed usernames. Reply if you'd be interested and I'll send out a time.",
      ],
      tag: "Meetups",
      tagColor: "bg-pink-100 text-pink-700",
      likes: 8,
      replies: [
        { author: "James Rodriguez", avatar: "JR", time: "3h ago", text: "I'm in. Octane is a solid pick - let's aim for the weekend after the midterm so nobody bails." },
        { author: "Emily Park", avatar: "EP", time: "2h ago", text: "Would love to come. Happy to help coordinate if you want an extra set of hands." },
        { author: "Travis A Greenlee", avatar: "TG", time: "90m ago", text: "I can make it if we settle on Saturday afternoon. Midtown is easy for me." },
      ],
    }),
    buildCommunityPost({
      id: 3003,
      author: "Marcus Williams",
      avatar: "MW",
      time: "8h ago",
      title: "UX internships - who's hiring for summer?",
      body: [
        "Anyone landed a UX research or design internship recently? Sharing leads or experiences would help - especially roles that value the HCI coursework.",
      ],
      tag: "Career & Jobs",
      tagColor: "bg-amber-100 text-amber-700",
      likes: 15,
      replies: [
        { author: "Sarah Chen", avatar: "SC", time: "6h ago", text: "A few healthtech startups in the Bay are hiring UXR interns through the summer. Happy to DM names." },
        { author: "Emily Park", avatar: "EP", time: "5h ago", text: "I saw a couple of remote design internship openings through the ACM mailing list this week too." },
      ],
    }),
    buildCommunityPost({
      id: 3004,
      author: "James Rodriguez",
      avatar: "JR",
      time: "1d ago",
      title: "Balancing CS6750 with full-time design work",
      body: [
        "I'm a product designer at a startup and the overlap with this course is wild. Anyone else applying class concepts directly to their day job?",
      ],
      tag: "Class Life",
      tagColor: "bg-purple-100 text-purple-700",
      likes: 28,
      replies: [
        { author: "Emily Park", avatar: "EP", time: "22h ago", text: "I block a single 2-hour session mid-week for readings and do problem sets on Saturday mornings. Keeps it from bleeding everywhere." },
        { author: "Rahul Khanna", avatar: "RK", time: "19h ago", text: "Same here. The hardest part is not letting discussion threads steal time from the rest of the week." },
      ],
    }),
    buildCommunityPost({
      id: 3005,
      author: "Emily Park",
      avatar: "EP",
      time: "2d ago",
      title: "Favorite design books and podcasts?",
      body: [
        "Looking for recommendations beyond the syllabus. What design thinking or HCI books have made a real impact on you?",
      ],
      tag: "Hobbies & Interests",
      tagColor: "bg-cyan-100 text-cyan-700",
      likes: 19,
      replies: [
        { author: "Marcus Williams", avatar: "MW", time: "1d ago", text: "\"Designing for the Digital Age\" is still my most-recommended. Dense but worth it." },
        { author: "Sarah Chen", avatar: "SC", time: "20h ago", text: "I keep coming back to the 99% Invisible podcast whenever I want something adjacent but still practical." },
      ],
    }),
  ],
  CS7646: [
    welcomePost(3101, "CS7646", "📈", "1h ago", 41, [
      { author: "Kevin Tran", avatar: "KT", time: "49m ago", text: "Hi all, I am in Boston and work in backend engineering. Taking ML4T to get more hands-on with markets and reinforcement learning." },
      { author: "Rachel Moore", avatar: "RM", time: "38m ago", text: "I am based in New York and come from data science. Looking forward to the strategy learner projects." },
      { author: "Rahul Khanna", avatar: "RK", time: "33m ago", text: "I am in Herndon, Virginia and mostly here to build more disciplined experiment workflows for the course projects." },
      { author: "Maria Gonzalez", avatar: "MG", time: "24m ago", text: "NYC here. Hoping to find a few classmates to compare project pacing with before deadlines get close." },
    ]),
    buildCommunityPost({
      id: 3102,
      author: "Kevin Tran",
      avatar: "KT",
      time: "4h ago",
      title: "Quantitative finance career paths - what's realistic?",
      body: ["For those working in or aiming for quant roles: how much of ML4T actually applies? Is this course a stepping stone or more academic?"],
      tag: "Career & Jobs",
      tagColor: "bg-amber-100 text-amber-700",
      likes: 22,
      replies: [
        { author: "David Kim", avatar: "DK", time: "2h ago", text: "ML4T is a great primer but quant interviews drill deeper stats and coding. Use the course to build intuition, prep separately for interviews." },
        { author: "Rachel Moore", avatar: "RM", time: "90m ago", text: "It helps most with project framing and experiment rigor, not as a direct quant substitute on its own." },
      ],
    }),
    buildCommunityPost({
      id: 3103,
      author: "Rachel Moore",
      avatar: "RM",
      time: "6h ago",
      title: "Paper trading competitions - anyone interested?",
      body: ["Thinking about organizing a friendly paper trading competition among ML4T students using Alpaca or similar. Low stakes, fun way to apply what we learn."],
      tag: "Activities",
      tagColor: "bg-pink-100 text-pink-700",
      likes: 35,
      replies: [
        { author: "Sanjay Gupta", avatar: "SG", time: "5h ago", text: "Count me in. Happy to help wire up the leaderboard." },
        { author: "Maria Gonzalez", avatar: "MG", time: "3h ago", text: "In. Can we keep strategies private until the end? Makes the reveal more fun." },
        { author: "Kevin Tran", avatar: "KT", time: "2h ago", text: "I would join. A short competition window would make it easier to manage around project deadlines." },
      ],
    }),
    buildCommunityPost({
      id: 3104,
      author: "Sanjay Gupta",
      avatar: "SG",
      time: "1d ago",
      title: "Best Python libraries for financial analysis?",
      body: ["Beyond pandas and numpy - what libraries do you find most useful? I've been exploring zipline and backtrader but curious what others use."],
      tag: "Class Life",
      tagColor: "bg-purple-100 text-purple-700",
      likes: 17,
      replies: [
        { author: "Kevin Tran", avatar: "KT", time: "20h ago", text: "vectorbt has been great for quick backtests. Less boilerplate than backtrader once you get past the docs." },
        { author: "David Kim", avatar: "DK", time: "18h ago", text: "I still reach for pandas first, but pyfolio-style tooling is useful once I want a cleaner performance summary." },
      ],
    }),
    buildCommunityPost({
      id: 3105,
      author: "Maria Gonzalez",
      avatar: "MG",
      time: "2d ago",
      title: "NYC ML4T students - study + networking dinner?",
      body: ["Any ML4T students in the NYC area? Would be great to meet up, talk markets, and maybe study for the midterm together over dinner."],
      tag: "Meetups",
      tagColor: "bg-pink-100 text-pink-700",
      likes: 12,
      replies: [
        { author: "Rachel Moore", avatar: "RM", time: "1d ago", text: "Yes please. I'll bring midterm notes." },
        { author: "David Kim", avatar: "DK", time: "22h ago", text: "I am interested too. Midtown would probably be easiest for me after work." },
      ],
    }),
  ],
  CS6200: [
    welcomePost(3201, "CS6200", "🖥️", "3h ago", 27, [
      { author: "Chris Brooks", avatar: "CB", time: "2h ago", text: "Hi everyone, I am in Chicago and work in infrastructure. Taking GIOS to tighten up the lower-level systems side of my background." },
      { author: "Fatima Al-Rashid", avatar: "FA", time: "95m ago", text: "I am in Atlanta and mostly do platform engineering. Looking forward to meeting more people doing systems work." },
      { author: "Rahul Khanna", avatar: "RK", time: "68m ago", text: "I am based in Herndon, Virginia and usually end up learning best by comparing debugging workflows with other people." },
    ]),
    buildCommunityPost({
      id: 3202,
      author: "Chris Brooks",
      avatar: "CB",
      time: "5h ago",
      title: "Systems engineering roles - interview prep tips?",
      body: ["For those who've interviewed for systems or infrastructure roles: how much OS-level knowledge actually comes up? Preparing for a few interviews next month."],
      tag: "Career & Jobs",
      tagColor: "bg-amber-100 text-amber-700",
      likes: 19,
      replies: [
        { author: "Tom Henderson", avatar: "TH", time: "3h ago", text: "Systems rounds at the big infra shops absolutely ask about paging, scheduling, and locks. Don't skip lectures 5-9." },
        { author: "Nadia Rossi", avatar: "NR", time: "2h ago", text: "I have also seen a lot of questions about debugging tradeoffs and how you validate concurrent code under load." },
      ],
    }),
    buildCommunityPost({
      id: 3203,
      author: "Fatima Al-Rashid",
      avatar: "FA",
      time: "10h ago",
      title: "Virtual Linux setup - what's your dev environment?",
      body: ["Curious what everyone's using for projects. VM? Docker? WSL2? Native Linux? I've been on WSL2 but thinking about switching to a proper VM."],
      tag: "Class Life",
      tagColor: "bg-purple-100 text-purple-700",
      likes: 14,
      replies: [
        { author: "Lin Zhang", avatar: "LZ", time: "8h ago", text: "Native Linux on a spare laptop has been the least frustrating for me. WSL2 was fine until threading got weird." },
        { author: "Rahul Khanna", avatar: "RK", time: "6h ago", text: "I have been using a VM mostly for parity with the environment I want to test against. Less convenient, fewer surprises." },
      ],
    }),
    buildCommunityPost({
      id: 3204,
      author: "Lin Zhang",
      avatar: "LZ",
      time: "1d ago",
      title: "C programming - resources that actually helped you?",
      body: ["If you came into GIOS rusty on C, what resources helped the most? Books, videos, practice sites? Looking for efficient ways to level up."],
      tag: "Hobbies & Interests",
      tagColor: "bg-cyan-100 text-cyan-700",
      likes: 31,
      replies: [
        { author: "Tom Henderson", avatar: "TH", time: "20h ago", text: "Beej's Guide for a quick refresher, then \"Expert C Programming\" once the basics stick." },
        { author: "Chris Brooks", avatar: "CB", time: "17h ago", text: "I also found small focused exercises more useful than long tutorials once I had the syntax back." },
      ],
    }),
    buildCommunityPost({
      id: 3205,
      author: "Nadia Rossi",
      avatar: "NR",
      time: "3d ago",
      title: "Bay Area GIOS students - weekend hike + study?",
      body: ["Anyone near SF or the Bay Area want to combine a weekend hike with some study time? Fresh air plus operating systems feels like a good combo."],
      tag: "Meetups",
      tagColor: "bg-pink-100 text-pink-700",
      likes: 9,
      replies: [
        { author: "Chris Brooks", avatar: "CB", time: "2d ago", text: "In. I'll bring coffee and a thermos of questions." },
        { author: "Tom Henderson", avatar: "TH", time: "2d ago", text: "Wish I were local for this. Outdoor study sessions sound a lot better than another day inside with gdb." },
      ],
    }),
  ],
};
