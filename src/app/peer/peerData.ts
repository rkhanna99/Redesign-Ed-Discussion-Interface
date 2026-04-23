export type PeerLabelType =
  | "team_project"
  | "shared_course"
  | "book_club"
  | "shared_location"
  | "previously_interacted";

export interface PeerLabel {
  type: PeerLabelType;
  text: string;
}

export interface PeerProfile {
  name: string;
  avatar: string;
  avatarColor: string;
  bio: string;
  location?: string;
  coursesTaken?: string[];
  sharedContext?: string[];
  background?: string;
  timezone?: string;
  interests?: string[];
  labels: PeerLabel[];
}

export const peerProfiles: Record<string, PeerProfile> = {
  "Sarah Chen": {
    name: "Sarah Chen",
    avatar: "SC",
    avatarColor: "bg-blue-500",
    bio: "Product designer exploring HCI research methods. Usually studying in the evenings PT.",
    location: "San Francisco, CA",
    coursesTaken: ["CS6750", "CS6460", "CSE6242"],
    sharedContext: [
      "Both enrolled in CS6750 - Spring 2026",
      "Previously in CSE6242 - Fall 2025",
      "Both joined an HCI career thread this month",
    ],
    background: "Product Designer",
    timezone: "PT (San Francisco)",
    interests: ["HCI", "accessibility", "coffee"],
    labels: [
      { type: "team_project", text: "Team project partner" },
      { type: "shared_course", text: "CS6750 Spring 2026" },
      { type: "shared_location", text: "Bay Area" },
    ],
  },
  "Marcus Williams": {
    name: "Marcus Williams",
    avatar: "MW",
    avatarColor: "bg-emerald-600",
    bio: "UX researcher pivoting into product. Keeps a running list of HCI papers worth a second read.",
    location: "Atlanta, GA",
    coursesTaken: ["CS6750", "CS6460", "CS7637"],
    sharedContext: [
      "Both enrolled in CS6750 - Spring 2026",
      "Commented on your participation question",
      "Both active in career and UX research discussions",
    ],
    background: "UX Researcher",
    timezone: "ET",
    interests: ["research methods", "writing"],
    labels: [
      { type: "shared_course", text: "CS6750 Spring 2026" },
      { type: "previously_interacted", text: "Replied to your thread" },
    ],
  },
  "James Rodriguez": {
    name: "James Rodriguez",
    avatar: "JR",
    avatarColor: "bg-amber-600",
    bio: "Full-time product designer at a startup. Interested in HCI, travel, and applying coursework to real work.",
    location: "Austin, TX",
    coursesTaken: ["CS6750", "CS7641", "CS6601"],
    sharedContext: [
      "Both enrolled in CS6750 - Spring 2026",
      "Previously in CS7641 - Fall 2025",
      "Replied in the Atlanta meetup thread",
    ],
    background: "Product Designer",
    timezone: "CT",
    interests: ["design systems", "travel"],
    labels: [
      { type: "shared_course", text: "CS6750 Spring 2026" },
      { type: "book_club", text: "Book club" },
    ],
  },
  "Emily Park": {
    name: "Emily Park",
    avatar: "EP",
    avatarColor: "bg-rose-500",
    bio: "Software engineer interested in HCI, travel, and machine learning. Usually studying in the evenings.",
    location: "Seattle, WA",
    coursesTaken: ["CS6750", "CS7641", "CS6250"],
    sharedContext: [
      "Both enrolled in CS6750 - Spring 2026",
      "Previously in CS7641 - Fall 2025",
      "Both saved design book recommendations",
    ],
    background: "Software Engineer",
    timezone: "PT",
    interests: ["HCI", "ML", "travel"],
    labels: [
      { type: "shared_course", text: "CS6750 Spring 2026" },
      { type: "book_club", text: "Book club" },
    ],
  },
  "Kevin Tran": {
    name: "Kevin Tran",
    avatar: "KT",
    avatarColor: "bg-indigo-600",
    bio: "Backend engineer eyeing quant roles. Enjoys pair-debugging and long market-data rabbit holes.",
    location: "Boston, MA",
    coursesTaken: ["CS7646", "CS6601", "CS6200"],
    sharedContext: [
      "Both enrolled in CS7646 - Spring 2026",
      "Previously in CS6200 - Fall 2025",
      "Team project partner this semester",
    ],
    background: "Backend Engineer",
    timezone: "ET",
    interests: ["quant finance", "Python"],
    labels: [
      { type: "team_project", text: "Team project partner" },
      { type: "shared_course", text: "CS7646 Spring 2026" },
    ],
  },
  "Rachel Moore": {
    name: "Rachel Moore",
    avatar: "RM",
    avatarColor: "bg-purple-600",
    bio: "Data scientist curious about systematic trading. Organizes low-stakes paper trading competitions.",
    location: "New York, NY",
    coursesTaken: ["CS7646", "CSE6242", "ISYE6501"],
    sharedContext: [
      "Both enrolled in CS7646 - Spring 2026",
      "Previously in CSE6242 - Fall 2025",
      "Liked your reply in the Q-learning thread",
    ],
    background: "Data Scientist",
    timezone: "ET",
    interests: ["time series", "running"],
    labels: [
      { type: "shared_course", text: "CS7646 Spring 2026" },
      { type: "previously_interacted", text: "Liked your reply" },
    ],
  },
  "Sanjay Gupta": {
    name: "Sanjay Gupta",
    avatar: "SG",
    avatarColor: "bg-teal-600",
    bio: "SWE who reads the docs cover-to-cover. Happy to share Python library notes.",
    location: "San Jose, CA",
    coursesTaken: ["CS7646", "CS6601", "CS6475"],
    sharedContext: [
      "Both enrolled in CS7646 - Spring 2026",
      "Both bookmarked the midterm study guide",
      "Active in Python library discussions",
    ],
    background: "Software Engineer",
    timezone: "PT",
    interests: ["Python", "finance"],
    labels: [
      { type: "shared_course", text: "CS7646 Spring 2026" },
    ],
  },
  "Maria Gonzalez": {
    name: "Maria Gonzalez",
    avatar: "MG",
    avatarColor: "bg-pink-600",
    bio: "Full-stack dev in NYC. Likes small dinners and bigger market debates.",
    location: "New York, NY",
    coursesTaken: ["CS7646", "CS6400", "CSE6242"],
    sharedContext: [
      "Both enrolled in CS7646 - Spring 2026",
      "Previously in CSE6242 - Fall 2025",
      "Both active in local meetup posts",
    ],
    background: "Full-stack Engineer",
    timezone: "ET (NYC)",
    interests: ["markets", "cooking"],
    labels: [
      { type: "shared_course", text: "CS7646 Spring 2026" },
      { type: "shared_location", text: "NYC" },
    ],
  },
  "Chris Brooks": {
    name: "Chris Brooks",
    avatar: "CB",
    avatarColor: "bg-sky-600",
    bio: "Infra engineer prepping for systems interviews. Runs a tiny homelab on the side.",
    location: "Chicago, IL",
    coursesTaken: ["CS6200", "CS6250", "CS6290"],
    sharedContext: [
      "Both enrolled in CS6200 - Spring 2026",
      "Answered your thread pool question",
      "Both viewed the midterm review thread",
    ],
    background: "Infrastructure Engineer",
    timezone: "CT",
    interests: ["systems", "homelab"],
    labels: [
      { type: "shared_course", text: "CS6200 Spring 2026" },
      { type: "previously_interacted", text: "Answered your question" },
    ],
  },
  "Fatima Al-Rashid": {
    name: "Fatima Al-Rashid",
    avatar: "FA",
    avatarColor: "bg-orange-600",
    bio: "Platform engineer tinkering with dev environments. Patient C debugger.",
    location: "Atlanta, GA",
    coursesTaken: ["CS6200", "CS6210", "CS6250"],
    sharedContext: [
      "Both enrolled in CS6200 - Spring 2026",
      "Team project partner this semester",
      "Both active in virtual Linux setup discussions",
    ],
    background: "Platform Engineer",
    timezone: "ET",
    interests: ["C", "Linux"],
    labels: [
      { type: "team_project", text: "Team project partner" },
      { type: "shared_course", text: "CS6200 Spring 2026" },
    ],
  },
  "Lin Zhang": {
    name: "Lin Zhang",
    avatar: "LZ",
    avatarColor: "bg-indigo-500",
    bio: "Returning to C after a long break. Collects concise learning resources.",
    location: "Portland, OR",
    coursesTaken: ["CS6200", "CS6250", "CS6300"],
    sharedContext: [
      "Both enrolled in CS6200 - Spring 2026",
      "Both joined the systems book club",
      "Previously discussed C resources this semester",
    ],
    background: "Software Engineer",
    timezone: "PT",
    interests: ["systems", "reading"],
    labels: [
      { type: "shared_course", text: "CS6200 Spring 2026" },
      { type: "book_club", text: "Book club" },
    ],
  },
  "Travis A Greenlee": {
    name: "Travis A Greenlee",
    avatar: "TG",
    avatarColor: "bg-violet-600",
    bio: "HCI student and part-time tech writer. Runs the CS6750 book club on Zoom.",
    location: "Nashville, TN",
    coursesTaken: ["CS6750", "CS6460", "CS6310"],
    sharedContext: [
      "Both enrolled in CS6750 - Spring 2026",
      "Both joined the book club study room",
      "Previously interacted on participation points",
    ],
    background: "Technical Writer",
    timezone: "CT",
    interests: ["design writing", "book club"],
    labels: [
      { type: "book_club", text: "Book club" },
      { type: "shared_course", text: "CS6750 Spring 2026" },
    ],
  },
  "Nethmin Liyanage": {
    name: "Nethmin Liyanage",
    avatar: "NL",
    avatarColor: "bg-cyan-600",
    bio: "Software engineer thinking about UX research as a next step. Asks the questions everyone else is wondering about.",
    location: "Atlanta, GA",
    coursesTaken: ["CS6750", "CS7637", "CSE6242"],
    sharedContext: [
      "This is your visible student profile",
      "Currently enrolled in CS6750 - Spring 2026",
      "Previously in CSE6242 - Fall 2025",
    ],
    background: "Software Engineer",
    timezone: "ET",
    interests: ["UX research", "assessment design"],
    labels: [
      { type: "shared_course", text: "CS6750 Spring 2026" },
      { type: "previously_interacted", text: "Commented on your post" },
    ],
  },
  "Rolando Raynes Punongbayan Jr.": {
    name: "Rolando Raynes Punongbayan Jr.",
    avatar: "RP",
    avatarColor: "bg-emerald-700",
    bio: "Engineering manager researching how forums scaffold learning. Team project lead this semester.",
    location: "San Diego, CA",
    coursesTaken: ["CS6750", "CS6460", "CS6601"],
    sharedContext: [
      "Both enrolled in CS6750 - Spring 2026",
      "Team project partner this semester",
      "Previously commented on your anonymous posting redesign",
    ],
    background: "Engineering Manager",
    timezone: "PT",
    interests: ["education research", "management"],
    labels: [
      { type: "team_project", text: "Team project partner" },
      { type: "shared_course", text: "CS6750 Spring 2026" },
    ],
  },
  "Max Ho": {
    name: "Max Ho",
    avatar: "MH",
    avatarColor: "bg-slate-600",
    bio: "OMSCS program office. Posts registration and scheduling updates for the class.",
    location: "Atlanta, GA",
    coursesTaken: ["CS6750"],
    sharedContext: [
      "Posted an announcement in your current course",
      "Shared registration information for Fall 2026",
    ],
    background: "Program Staff",
    timezone: "ET",
    interests: ["student ops"],
    labels: [
      { type: "shared_course", text: "CS6750 Spring 2026" },
    ],
  },
  "Emediong Francis Boniface": {
    name: "Emediong Francis Boniface",
    avatar: "EB",
    avatarColor: "bg-amber-700",
    bio: "Design researcher with an interest in distributed cognition. Reads more case studies than anyone should.",
    location: "Lagos, Nigeria",
    coursesTaken: ["CS6750", "CS6460", "CS6475"],
    sharedContext: [
      "Both enrolled in CS6750 - Spring 2026",
      "Both joined the book club study room",
      "Previously discussed distributed cognition examples",
    ],
    background: "Design Researcher",
    timezone: "WAT",
    interests: ["distributed cognition", "case studies"],
    labels: [
      { type: "shared_course", text: "CS6750 Spring 2026" },
      { type: "book_club", text: "Book club" },
    ],
  },
  "Oluwademilade Bolatimi": {
    name: "Oluwademilade Bolatimi",
    avatar: "OB",
    avatarColor: "bg-teal-700",
    bio: "Full-stack developer. Keeps a tidy archive of submitted assignments and wishes Ed did too.",
    location: "London, UK",
    coursesTaken: ["CS6750", "CS6300", "CS6400"],
    sharedContext: [
      "Both enrolled in CS6750 - Spring 2026",
      "Both viewed the survey archive feature request",
      "Previously active in assignment workflow threads",
    ],
    background: "Full-stack Engineer",
    timezone: "GMT",
    interests: ["archiving", "productivity"],
    labels: [
      { type: "shared_course", text: "CS6750 Spring 2026" },
    ],
  },
  "David Kim": {
    name: "David Kim",
    avatar: "DK",
    avatarColor: "bg-blue-700",
    bio: "Quant researcher. Starts the collaborative study docs the class ends up depending on.",
    location: "New York, NY",
    coursesTaken: ["CS7646", "ISYE6501", "CSE6242"],
    sharedContext: [
      "Both enrolled in CS7646 - Spring 2026",
      "Previously in CSE6242 - Fall 2025",
      "Co-authored a shared study guide",
    ],
    background: "Quant Researcher",
    timezone: "ET",
    interests: ["statistics", "study groups"],
    labels: [
      { type: "shared_course", text: "CS7646 Spring 2026" },
      { type: "previously_interacted", text: "Co-authored study guide" },
    ],
  },
  "Tom Henderson": {
    name: "Tom Henderson",
    avatar: "TH",
    avatarColor: "bg-gray-700",
    bio: "Backend engineer with a soft spot for concurrency primitives. Will draw a diagram unprompted.",
    location: "Denver, CO",
    coursesTaken: ["CS6200", "CS6290", "CS6210"],
    sharedContext: [
      "Both enrolled in CS6200 - Spring 2026",
      "Both joined the systems book club",
      "Answered a concurrency discussion you viewed",
    ],
    background: "Backend Engineer",
    timezone: "CT",
    interests: ["concurrency", "diagrams"],
    labels: [
      { type: "shared_course", text: "CS6200 Spring 2026" },
      { type: "book_club", text: "Book club" },
    ],
  },
  "Nadia Rossi": {
    name: "Nadia Rossi",
    avatar: "NR",
    avatarColor: "bg-pink-500",
    bio: "SRE who studies best outdoors. Organizes Bay Area hike-and-study weekends.",
    location: "Oakland, CA",
    coursesTaken: ["CS6200", "CS6250", "CS6290"],
    sharedContext: [
      "Both enrolled in CS6200 - Spring 2026",
      "Previously active in Bay Area study posts",
      "Both viewed the project retrospective thread",
    ],
    background: "Site Reliability Engineer",
    timezone: "PT (Bay Area)",
    interests: ["hiking", "distributed systems"],
    labels: [
      { type: "shared_course", text: "CS6200 Spring 2026" },
      { type: "shared_location", text: "Bay Area" },
    ],
  },
};

export const labelStyles: Record<PeerLabelType, string> = {
  team_project: "bg-slate-100 text-slate-600",
  shared_course: "bg-slate-100 text-slate-600",
  book_club: "bg-amber-50 text-amber-700",
  shared_location: "bg-slate-100 text-slate-600",
  previously_interacted: "bg-slate-100 text-slate-600",
};

export const labelDescriptions: Record<PeerLabelType, string> = {
  team_project: "Team project partner",
  shared_course: "Shared course",
  book_club: "Book club",
  shared_location: "Shared location",
  previously_interacted: "Previously interacted with",
};
