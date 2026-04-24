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
}

function welcomePost(id: number, course: string, emoji: string, time: string, likes: number, comments: number): CommunityPost {
  return {
    id,
    author: "Community Bot",
    avatar: "🤖",
    time,
    title: `Introduce yourself! ${course} Spring 2026 ${emoji}`,
    body: [
      "Welcome! Share a bit about yourself — your background, where you're based, and what drew you to this class.",
      "No format needed. A sentence or two is plenty, and feel free to ask questions of classmates too.",
    ],
    tag: "Introductions",
    tagColor: "bg-emerald-100 text-emerald-700",
    likes,
    views: likes * 8 + comments * 3,
    comments,
    replies: [],
  };
}

export const communityPosts: Record<string, CommunityPost[]> = {
  CS6750: [
    welcomePost(3001, "CS6750", "👋", "2h ago", 32, 47),
    {
      id: 3002, author: "Sarah Chen", avatar: "SC", time: "5h ago",
      title: "Atlanta HCI students — coffee meetup?",
      body: [
        "Would love to organize a casual meetup for CS6750 students in the Atlanta area. Thinking Saturday afternoon at Octane Coffee in Midtown.",
        "No agenda — just an excuse to put faces to Ed usernames. Reply if you'd be interested and I'll send out a time.",
      ],
      tag: "Meetups", tagColor: "bg-pink-100 text-pink-700",
      likes: 8, comments: 12,
      replies: [
        { author: "James Rodriguez", avatar: "JR", time: "3h ago", text: "I'm in. Octane is a solid pick — let's aim for the weekend after the midterm so nobody bails." },
        { author: "Emily Park", avatar: "EP", time: "2h ago", text: "Would love to come. Happy to help coordinate if you want an extra set of hands." },
      ],
    },
    {
      id: 3003, author: "Marcus Williams", avatar: "MW", time: "8h ago",
      title: "UX internships — who's hiring for summer?",
      body: [
        "Anyone landed a UX research or design internship recently? Sharing leads or experiences would help — especially roles that value the HCI coursework.",
      ],
      tag: "Career & Jobs", tagColor: "bg-amber-100 text-amber-700",
      likes: 15, comments: 23,
      replies: [
        { author: "Sarah Chen", avatar: "SC", time: "6h ago", text: "A few healthtech startups in the Bay are hiring UXR interns through the summer. Happy to DM names." },
      ],
    },
    {
      id: 3004, author: "James Rodriguez", avatar: "JR", time: "1d ago",
      title: "Balancing CS6750 with full-time design work",
      body: [
        "I'm a product designer at a startup and the overlap with this course is wild. Anyone else applying class concepts directly to their day job?",
      ],
      tag: "Class Life", tagColor: "bg-purple-100 text-purple-700",
      likes: 28, comments: 34,
      replies: [
        { author: "Emily Park", avatar: "EP", time: "22h ago", text: "I block a single 2-hour session mid-week for readings and do problem sets on Saturday mornings. Keeps it from bleeding everywhere." },
      ],
    },
    {
      id: 3005, author: "Emily Park", avatar: "EP", time: "2d ago",
      title: "Favorite design books and podcasts?",
      body: [
        "Looking for recommendations beyond the syllabus. What design thinking or HCI books have made a real impact on you?",
      ],
      tag: "Hobbies & Interests", tagColor: "bg-cyan-100 text-cyan-700",
      likes: 19, comments: 14,
      replies: [
        { author: "Marcus Williams", avatar: "MW", time: "1d ago", text: "\"Designing for the Digital Age\" is still my most-recommended. Dense but worth it." },
      ],
    },
  ],
  CS7646: [
    welcomePost(3101, "CS7646", "📈", "1h ago", 41, 63),
    {
      id: 3102, author: "Kevin Tran", avatar: "KT", time: "4h ago",
      title: "Quantitative finance career paths — what's realistic?",
      body: ["For those working in or aiming for quant roles: how much of ML4T actually applies? Is this course a stepping stone or more academic?"],
      tag: "Career & Jobs", tagColor: "bg-amber-100 text-amber-700",
      likes: 22, comments: 31,
      replies: [
        { author: "David Kim", avatar: "DK", time: "2h ago", text: "ML4T is a great primer but quant interviews drill deeper stats and coding. Use the course to build intuition, prep separately for interviews." },
      ],
    },
    {
      id: 3103, author: "Rachel Moore", avatar: "RM", time: "6h ago",
      title: "Paper trading competitions — anyone interested?",
      body: ["Thinking about organizing a friendly paper trading competition among ML4T students using Alpaca or similar. Low stakes, fun way to apply what we learn."],
      tag: "Activities", tagColor: "bg-pink-100 text-pink-700",
      likes: 35, comments: 18,
      replies: [
        { author: "Sanjay Gupta", avatar: "SG", time: "5h ago", text: "Count me in. Happy to help wire up the leaderboard." },
        { author: "Maria Gonzalez", avatar: "MG", time: "3h ago", text: "In. Can we keep strategies private until the end? Makes the reveal more fun." },
      ],
    },
    {
      id: 3104, author: "Sanjay Gupta", avatar: "SG", time: "1d ago",
      title: "Best Python libraries for financial analysis?",
      body: ["Beyond pandas and numpy — what libraries do you find most useful? I've been exploring zipline and backtrader but curious what others use."],
      tag: "Class Life", tagColor: "bg-purple-100 text-purple-700",
      likes: 17, comments: 24,
      replies: [
        { author: "Kevin Tran", avatar: "KT", time: "20h ago", text: "vectorbt has been great for quick backtests. Less boilerplate than backtrader once you get past the docs." },
      ],
    },
    {
      id: 3105, author: "Maria Gonzalez", avatar: "MG", time: "2d ago",
      title: "NYC ML4T students — study + networking dinner?",
      body: ["Any ML4T students in the NYC area? Would be great to meet up, talk markets, and maybe study for the midterm together over dinner."],
      tag: "Meetups", tagColor: "bg-pink-100 text-pink-700",
      likes: 12, comments: 9,
      replies: [
        { author: "Rachel Moore", avatar: "RM", time: "1d ago", text: "Yes please. I'll bring midterm notes." },
      ],
    },
  ],
  CS6200: [
    welcomePost(3201, "CS6200", "🖥️", "3h ago", 27, 38),
    {
      id: 3202, author: "Chris Brooks", avatar: "CB", time: "5h ago",
      title: "Systems engineering roles — interview prep tips?",
      body: ["For those who've interviewed for systems/infra roles: how much OS-level knowledge actually comes up? Preparing for a few interviews next month."],
      tag: "Career & Jobs", tagColor: "bg-amber-100 text-amber-700",
      likes: 19, comments: 27,
      replies: [
        { author: "Tom Henderson", avatar: "TH", time: "3h ago", text: "Systems rounds at the big infra shops absolutely ask about paging, scheduling, and locks. Don't skip lectures 5–9." },
      ],
    },
    {
      id: 3203, author: "Fatima Al-Rashid", avatar: "FA", time: "10h ago",
      title: "Virtual Linux setup — what's your dev environment?",
      body: ["Curious what everyone's using for projects. VM? Docker? WSL2? Native Linux? I've been on WSL2 but thinking about switching to a proper VM."],
      tag: "Class Life", tagColor: "bg-purple-100 text-purple-700",
      likes: 14, comments: 22,
      replies: [
        { author: "Lin Zhang", avatar: "LZ", time: "8h ago", text: "Native Linux on a spare laptop has been the least frustrating for me. WSL2 was fine until threading got weird." },
      ],
    },
    {
      id: 3204, author: "Lin Zhang", avatar: "LZ", time: "1d ago",
      title: "C programming — resources that actually helped you?",
      body: ["If you came into GIOS rusty on C (like me), what resources helped the most? Books, videos, practice sites? Looking for efficient ways to level up."],
      tag: "Hobbies & Interests", tagColor: "bg-cyan-100 text-cyan-700",
      likes: 31, comments: 19,
      replies: [
        { author: "Tom Henderson", avatar: "TH", time: "20h ago", text: "Beej's Guide for a quick refresher, then \"Expert C Programming\" once the basics stick." },
      ],
    },
    {
      id: 3205, author: "Nadia Rossi", avatar: "NR", time: "3d ago",
      title: "Bay Area GIOS students — weekend hike + study?",
      body: ["Anyone near SF/Bay Area want to combine a weekend hike with some study time? Fresh air + operating systems = a good combo."],
      tag: "Meetups", tagColor: "bg-pink-100 text-pink-700",
      likes: 9, comments: 7,
      replies: [
        { author: "Chris Brooks", avatar: "CB", time: "2d ago", text: "In. I'll bring coffee and a thermos of questions." },
      ],
    },
  ],
};
