import { useEffect, useState } from "react";
import { ArrowUpRight, Coffee, Hash, LogIn, MessageSquareText, Search, Smile, Sparkles, Users } from "lucide-react";

import { CURRENT_USER } from "../data/threads";
import { PeerLabels, PeerName } from "../peer/PeerName";

const topicColors: Record<string, string> = {
  "Casual chat": "bg-pink-100 text-pink-700",
  "Career talk": "bg-amber-100 text-amber-700",
  "Weekend plans": "bg-cyan-100 text-cyan-700",
  "OMSCS life": "bg-purple-100 text-purple-700",
};

const channelAccent: Record<string, string> = {
  general: "from-violet-50 to-fuchsia-50 border-violet-100",
  "career-talk": "from-amber-50 to-orange-50 border-amber-100",
  "off-topic": "from-cyan-50 to-sky-50 border-cyan-100",
  introductions: "from-emerald-50 to-teal-50 border-emerald-100",
};

type ChannelName = "general" | "career-talk" | "off-topic" | "introductions";

interface ChannelMessage {
  author: string;
  avatar: string;
  time: string;
  text: string;
}

interface ChannelData {
  name: ChannelName;
  desc: string;
  active: number;
  summary: string;
  prompt: string;
  pinned: string[];
  focus: string[];
  messages: ChannelMessage[];
}

interface SocialUser {
  name: string;
  topic: string;
  avatar: string;
}

interface SocialRoomCourseData {
  users: SocialUser[];
  channels: ChannelData[];
}

const socialRoomDataByCourse: Record<string, SocialRoomCourseData> = {
  CS6750: {
    users: [
      { name: "Sarah Chen", topic: "Career talk", avatar: "SC" },
      { name: "Marcus Williams", topic: "Casual chat", avatar: "MW" },
      { name: "James Rodriguez", topic: "Weekend plans", avatar: "JR" },
      { name: "Emily Park", topic: "OMSCS life", avatar: "EP" },
      { name: "Travis A Greenlee", topic: "Casual chat", avatar: "TG" },
      { name: "Rolando Raynes Punongbayan Jr.", topic: "Career talk", avatar: "RP" },
      { name: "Emediong Francis Boniface", topic: "OMSCS life", avatar: "EB" },
      { name: "Oluwademilade Bolatimi", topic: "Weekend plans", avatar: "OB" },
    ],
    channels: [
      {
        name: "general",
        desc: "Anything and everything",
        active: 14,
        summary: "Live discussion about class pacing, good campus coffee, and how everyone is balancing work with OMSCS.",
        prompt: "Drop in with quick updates, schedule questions, or anything happening this week.",
        pinned: ["Reading schedule swap thread", "Friday virtual coffee at 7 PM ET"],
        focus: ["Balancing work and class", "Lecture note strategies", "Weekly check-ins"],
        messages: [
          { author: "Marcus Williams", avatar: "MW", time: "10:18 AM", text: "Is anyone else planning to knock out readings early this weekend? Trying to avoid the usual Sunday crunch." },
          { author: "Rahul Khanna", avatar: "RK", time: "10:23 AM", text: "I am. I started blocking Friday evenings for discussion posts and it has made the rest of the week much calmer." },
          { author: "Sarah Chen", avatar: "SC", time: "10:27 AM", text: "Same here. The CS6750 lecture notes are easier for me if I do one quick watch-through first and only annotate the second pass." },
          { author: "Emily Park", avatar: "EP", time: "10:32 AM", text: "That has been the big shift for me too. I waste less time trying to create perfect notes on the first run." },
          { author: "Travis A Greenlee", avatar: "TG", time: "10:40 AM", text: "We should pin a thread with everyone's pacing strategies because new people keep asking for that exact advice." },
        ],
      },
      {
        name: "career-talk",
        desc: "Jobs, interviews, networking",
        active: 6,
        summary: "People are comparing interview prep plans, internship timelines, and how to talk about OMSCS work in recruiter screens.",
        prompt: "Ask for resume feedback, interview advice, or referrals. Career questions are fair game here.",
        pinned: ["Spring interview tracker", "Behavioral story examples thread"],
        focus: ["Interview framing", "Resume review", "Networking leads"],
        messages: [
          { author: "Rolando Raynes Punongbayan Jr.", avatar: "RP", time: "9:11 AM", text: "I have a product interview next week and I am trying to decide which HCI project story lands best with recruiters." },
          { author: "Sarah Chen", avatar: "SC", time: "9:15 AM", text: "I would anchor on tradeoff thinking. CS6750 gives you a clean story around user goals, constraints, iteration, and evidence." },
          { author: "Rahul Khanna", avatar: "RK", time: "9:21 AM", text: "For behavioral rounds, I have had better luck talking about team project friction and how we resolved it than walking through assignments." },
          { author: "Marcus Williams", avatar: "MW", time: "9:26 AM", text: "That is the angle I used too. Interviewers seemed to care more about collaboration decisions than the artifact itself." },
          { author: "James Rodriguez", avatar: "JR", time: "9:35 AM", text: "If anyone wants a second pass on a case-study deck, drop it in here. I can review it tonight." },
        ],
      },
      {
        name: "off-topic",
        desc: "Memes, hobbies, random",
        active: 9,
        summary: "Mostly playlists, game recommendations, and the standard OMSCS venting about too many tabs open at once.",
        prompt: "No coursework required. If it is fun or random, it fits here.",
        pinned: ["Weekend plans poll", "Current TV recs"],
        focus: ["Show recommendations", "Gaming", "Decompressing after work"],
        messages: [
          { author: "James Rodriguez", avatar: "JR", time: "8:42 AM", text: "Need a low-brain evening plan after work and readings. Movie, game, or show recommendation?" },
          { author: "Marcus Williams", avatar: "MW", time: "8:49 AM", text: "Taskmaster has been perfect background chaos for this exact situation." },
          { author: "Emily Park", avatar: "EP", time: "8:54 AM", text: "I alternate between that and a long walk before opening Ed. It is weirdly effective." },
          { author: "Travis A Greenlee", avatar: "TG", time: "9:02 AM", text: "That is the most OMSCS answer possible and I fully support it." },
          { author: "Oluwademilade Bolatimi", avatar: "OB", time: "9:05 AM", text: "Also recommending a tab-close ritual. It sounds fake until it works." },
        ],
      },
      {
        name: "introductions",
        desc: "Say hi to new faces",
        active: 3,
        summary: "New classmates are sharing backgrounds, time zones, and what they want from the program this semester.",
        prompt: "Say where you are based, what you do, and what brought you to the course.",
        pinned: ["Spring cohort intro prompt", "Study buddy request form"],
        focus: ["Time zones", "Backgrounds", "Why this course"],
        messages: [
          { author: "Emediong Francis Boniface", avatar: "EB", time: "Yesterday", text: "Hi everyone, I am based in Lagos and work in design research. I joined CS6750 because I wanted a stronger theory base for work I am already doing." },
          { author: "Emily Park", avatar: "EP", time: "Yesterday", text: "Welcome. The mix of technical and UX perspectives in this class has been worth it for me." },
          { author: "Rahul Khanna", avatar: "RK", time: "Yesterday", text: "I am in Herndon, Virginia and balancing the program with full-time work. Always happy to compare time-management strategies if that would help." },
          { author: "Sarah Chen", avatar: "SC", time: "Yesterday", text: "I am in San Francisco and mostly online later in the evening. Looking forward to meeting more people in HCI this term." },
        ],
      },
    ],
  },
  CS7646: {
    users: [
      { name: "Kevin Tran", topic: "Career talk", avatar: "KT" },
      { name: "Rachel Moore", topic: "Casual chat", avatar: "RM" },
      { name: "Sanjay Gupta", topic: "OMSCS life", avatar: "SG" },
      { name: "Maria Gonzalez", topic: "Weekend plans", avatar: "MG" },
      { name: "David Kim", topic: "Career talk", avatar: "DK" },
      { name: "Rahul Khanna", topic: "Casual chat", avatar: "RK" },
    ],
    channels: [
      {
        name: "general",
        desc: "Anything and everything",
        active: 11,
        summary: "People are comparing project pacing, debugging habits, and what is actually worth revisiting before the next ML4T deliverable.",
        prompt: "Share project progress, study tactics, or quick questions about how you are approaching the course this week.",
        pinned: ["Project 7 experiment log thread", "Midterm recap notes"],
        focus: ["Project pacing", "Debugging workflows", "Lecture review"],
        messages: [
          { author: "Kevin Tran", avatar: "KT", time: "10:05 AM", text: "How are people pacing Project 7? I am trying not to leave all the learner tuning for one weekend." },
          { author: "Rahul Khanna", avatar: "RK", time: "10:12 AM", text: "I ended up separating state representation experiments from tuning. It made it easier to tell whether a change was real or just noise." },
          { author: "Sanjay Gupta", avatar: "SG", time: "10:18 AM", text: "Same. I keep a small harness for repeatable runs because otherwise I convince myself every fluctuation is insight." },
          { author: "Rachel Moore", avatar: "RM", time: "10:24 AM", text: "That is exactly what happened to me last project. Logging the benchmark runs in one place helped a lot." },
          { author: "Maria Gonzalez", avatar: "MG", time: "10:31 AM", text: "I would happily use a shared template for experiment notes if someone wants to post one." },
        ],
      },
      {
        name: "career-talk",
        desc: "Jobs, interviews, networking",
        active: 7,
        summary: "The room is heavy on quant-adjacent recruiting talk, with people comparing projects, market intuition stories, and Python-heavy resumes.",
        prompt: "Talk through recruiter screens, quant prep, or how you are framing ML4T work in interviews.",
        pinned: ["Quant recruiting spreadsheet", "Python portfolio examples"],
        focus: ["Quant roles", "Technical screening", "Project framing"],
        messages: [
          { author: "David Kim", avatar: "DK", time: "9:03 AM", text: "Anyone have a clean way to explain the strategy learner project to a recruiter without making it sound like a class toy?" },
          { author: "Kevin Tran", avatar: "KT", time: "9:08 AM", text: "I frame it as an experiment design story first, not a trading alpha story. That seems to land better." },
          { author: "Rahul Khanna", avatar: "RK", time: "9:14 AM", text: "I have had more success describing what I measured, how I controlled comparisons, and why the results changed with different representations." },
          { author: "Rachel Moore", avatar: "RM", time: "9:20 AM", text: "That is smart. A lot of interviewers care more about process rigor than pretending we built a hedge fund in class." },
          { author: "Maria Gonzalez", avatar: "MG", time: "9:27 AM", text: "If anyone wants, I can share the bullet points I used for a recent data role screen." },
        ],
      },
      {
        name: "off-topic",
        desc: "Memes, hobbies, random",
        active: 8,
        summary: "It is mostly market jokes, coffee talk, and people trying to decompress after staring at pandas output for too long.",
        prompt: "Take a break from charts and code. Random conversation belongs here.",
        pinned: ["Paper trading side quests", "Best focus playlists"],
        focus: ["Market memes", "Coffee", "End-of-week reset"],
        messages: [
          { author: "Rachel Moore", avatar: "RM", time: "8:41 AM", text: "Need a non-screen hobby recommendation before I start seeing DataFrames in my sleep." },
          { author: "Maria Gonzalez", avatar: "MG", time: "8:47 AM", text: "Cooking has been my reset lately. Hard to overfit a soup." },
          { author: "Sanjay Gupta", avatar: "SG", time: "8:53 AM", text: "Counterpoint: I absolutely overfit my coffee routine every week." },
          { author: "Rahul Khanna", avatar: "RK", time: "8:58 AM", text: "That still sounds healthier than refreshing charts while waiting for an experiment to finish." },
          { author: "David Kim", avatar: "DK", time: "9:04 AM", text: "Strong support for a no-markets hour after 8 PM policy." },
        ],
      },
      {
        name: "introductions",
        desc: "Say hi to new faces",
        active: 4,
        summary: "New ML4T classmates are sharing their backgrounds in finance, data science, and software engineering.",
        prompt: "Introduce yourself, where you are based, and what drew you to Machine Learning for Trading.",
        pinned: ["Spring intro prompt", "Study group matching sheet"],
        focus: ["Finance background", "Python experience", "Study groups"],
        messages: [
          { author: "Kevin Tran", avatar: "KT", time: "Yesterday", text: "Hi all, I am based in Boston and work in backend engineering. Taking ML4T because I wanted a more applied way into markets and reinforcement learning." },
          { author: "Rachel Moore", avatar: "RM", time: "Yesterday", text: "I am in New York and come from data science. Mostly here for the strategy design and experiment side of the class." },
          { author: "Rahul Khanna", avatar: "RK", time: "Yesterday", text: "I am in Herndon, Virginia and I am especially interested in building more disciplined experiment workflows for the projects." },
          { author: "Maria Gonzalez", avatar: "MG", time: "Yesterday", text: "I am in NYC and hoping to find a few people to compare project pacing with before deadlines get close." },
        ],
      },
    ],
  },
  CS6200: {
    users: [
      { name: "Chris Brooks", topic: "Career talk", avatar: "CB" },
      { name: "Fatima Al-Rashid", topic: "Casual chat", avatar: "FA" },
      { name: "Lin Zhang", topic: "OMSCS life", avatar: "LZ" },
      { name: "Tom Henderson", topic: "Career talk", avatar: "TH" },
      { name: "Nadia Rossi", topic: "Weekend plans", avatar: "NR" },
      { name: "Rahul Khanna", topic: "Casual chat", avatar: "RK" },
    ],
    channels: [
      {
        name: "general",
        desc: "Anything and everything",
        active: 10,
        summary: "Conversation is centered on project pacing, debugging habits, and how everyone is surviving concurrency and systems workloads.",
        prompt: "Share what you are working on, what is blocking you, or what is helping you stay sane this week.",
        pinned: ["Project 3 debugging checklist", "Midterm review office-hours notes"],
        focus: ["Concurrency bugs", "Project pacing", "Systems study habits"],
        messages: [
          { author: "Fatima Al-Rashid", avatar: "FA", time: "10:09 AM", text: "Has anyone found a good rhythm for project work this week? I keep underestimating how long the debugging pass will take." },
          { author: "Rahul Khanna", avatar: "RK", time: "10:15 AM", text: "I have been separating implementation and stress-test time on my calendar. Otherwise I end up treating debugging as an afterthought." },
          { author: "Chris Brooks", avatar: "CB", time: "10:21 AM", text: "That is smart. For systems projects the second half is usually where the real work starts." },
          { author: "Lin Zhang", avatar: "LZ", time: "10:27 AM", text: "I have started keeping a short bug journal because the same category of issue keeps repeating." },
          { author: "Tom Henderson", avatar: "TH", time: "10:34 AM", text: "Posting that template would probably save a lot of us time." },
        ],
      },
      {
        name: "career-talk",
        desc: "Jobs, interviews, networking",
        active: 5,
        summary: "People are trading notes on systems interviews, infrastructure roles, and how to make course projects legible on a resume.",
        prompt: "Ask about systems interviews, resume wording, or roles adjacent to OS and infrastructure.",
        pinned: ["Systems interview prep list", "Infrastructure resume bullets"],
        focus: ["Systems interviews", "Infra roles", "Resume bullets"],
        messages: [
          { author: "Tom Henderson", avatar: "TH", time: "9:06 AM", text: "How are people describing the GRPC file transfer project on resumes without making it sound too academic?" },
          { author: "Chris Brooks", avatar: "CB", time: "9:11 AM", text: "I focus on concurrency, fault handling, and how I validated behavior under load rather than naming the class directly." },
          { author: "Rahul Khanna", avatar: "RK", time: "9:17 AM", text: "Same. The implementation details matter less than showing that you reasoned about thread safety and performance tradeoffs." },
          { author: "Fatima Al-Rashid", avatar: "FA", time: "9:24 AM", text: "I have also had better luck talking about debugging strategy than just listing technologies." },
          { author: "Nadia Rossi", avatar: "NR", time: "9:30 AM", text: "If anyone wants resume wording feedback, I can review a few bullets later tonight." },
        ],
      },
      {
        name: "off-topic",
        desc: "Memes, hobbies, random",
        active: 7,
        summary: "Mostly recovery chat after long debugging sessions, plus the usual mix of hikes, playlists, and systems jokes.",
        prompt: "Anything not directly about the course goes here.",
        pinned: ["Weekend hike check-in", "What is on your focus playlist?"],
        focus: ["Reset routines", "Outdoors", "Music"],
        messages: [
          { author: "Nadia Rossi", avatar: "NR", time: "8:39 AM", text: "Anyone else need a full mental reset after staring at concurrency traces all night?" },
          { author: "Lin Zhang", avatar: "LZ", time: "8:45 AM", text: "Yes. I went for a walk before opening the project again and it helped more than coffee." },
          { author: "Rahul Khanna", avatar: "RK", time: "8:50 AM", text: "That has become my default move too. Otherwise I just keep re-reading the same logs." },
          { author: "Chris Brooks", avatar: "CB", time: "8:57 AM", text: "I am convinced half of systems debugging is figuring out when to stop looking at it for twenty minutes." },
          { author: "Fatima Al-Rashid", avatar: "FA", time: "9:01 AM", text: "Correct. The other half is admitting the bug is still your own fault." },
        ],
      },
      {
        name: "introductions",
        desc: "Say hi to new faces",
        active: 4,
        summary: "New students are sharing where they are based, what systems background they have, and what they hope to get from GIOS.",
        prompt: "Share your background, timezone, and why you signed up for Graduate Intro to OS.",
        pinned: ["Intro prompt", "Find a project buddy"],
        focus: ["Systems background", "Time zones", "Project buddies"],
        messages: [
          { author: "Chris Brooks", avatar: "CB", time: "Yesterday", text: "Hi everyone, I am in Chicago and work in infrastructure. Taking GIOS to tighten up the lower-level systems parts of my background." },
          { author: "Fatima Al-Rashid", avatar: "FA", time: "Yesterday", text: "I am in Atlanta and spend most of my time on platform engineering. Looking forward to meeting more people doing similar work." },
          { author: "Rahul Khanna", avatar: "RK", time: "Yesterday", text: "I am in Herndon, Virginia and balancing the program with full-time work. Always interested in comparing debugging workflows." },
          { author: "Lin Zhang", avatar: "LZ", time: "Yesterday", text: "I am in Portland and coming back to systems after a long break, so I am glad this room exists." },
        ],
      },
    ],
  },
};

interface SocialRoomProps {
  activeCourse: string;
  onJoin: () => void;
}

const currentUserAvatar = CURRENT_USER
  .split(/\s+/)
  .map((part) => part[0])
  .filter(Boolean)
  .slice(0, 2)
  .join("")
  .toUpperCase();

function messagesByChannel(channels: ChannelData[]) {
  return channels.reduce<Record<ChannelName, ChannelMessage[]>>((acc, channel) => {
    acc[channel.name] = channel.messages;
    return acc;
  }, {} as Record<ChannelName, ChannelMessage[]>);
}

function emptyDrafts() {
  return {
    general: "",
    "career-talk": "",
    "off-topic": "",
    introductions: "",
  };
}

export function SocialRoom({ activeCourse, onJoin }: SocialRoomProps) {
  const roomData = socialRoomDataByCourse[activeCourse] || socialRoomDataByCourse.CS6750;
  const [selectedChannel, setSelectedChannel] = useState<ChannelName>("general");
  const [messagesByChannelState, setMessagesByChannelState] = useState<Record<ChannelName, ChannelMessage[]>>(() =>
    messagesByChannel(roomData.channels),
  );
  const [draftsByChannel, setDraftsByChannel] = useState<Record<ChannelName, string>>(emptyDrafts);

  useEffect(() => {
    setSelectedChannel("general");
    setMessagesByChannelState(messagesByChannel(roomData.channels));
    setDraftsByChannel(emptyDrafts());
  }, [activeCourse, roomData]);

  const activeChannel = roomData.channels.find((channel) => channel.name === selectedChannel) || roomData.channels[0];
  const activeMessages = messagesByChannelState[selectedChannel] || activeChannel.messages;
  const activeDraft = draftsByChannel[selectedChannel] || "";
  const canSend = activeDraft.trim().length > 0;

  const channelMembers = roomData.users.filter((user) => {
    if (activeChannel.name === "general") return true;
    if (activeChannel.name === "career-talk") return user.topic === "Career talk";
    if (activeChannel.name === "off-topic") return user.topic === "Casual chat" || user.topic === "Weekend plans";
    return user.topic === "OMSCS life" || user.topic === "Casual chat";
  });

  const updateDraft = (value: string) => {
    setDraftsByChannel((current) => ({ ...current, [selectedChannel]: value }));
  };

  const sendMessage = () => {
    const text = activeDraft.trim();
    if (!text) return;

    const time = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());

    const message: ChannelMessage = {
      author: CURRENT_USER,
      avatar: currentUserAvatar,
      time,
      text,
    };

    setMessagesByChannelState((current) => ({
      ...current,
      [selectedChannel]: [...(current[selectedChannel] || []), message],
    }));
    setDraftsByChannel((current) => ({ ...current, [selectedChannel]: "" }));
  };

  return (
    <div className="flex-1 overflow-hidden bg-[#fbfaff]">
      <div className="flex h-full flex-col xl:flex-row">
        <aside className="w-full shrink-0 border-b border-[#e9e3f6] bg-white xl:h-full xl:w-[350px] xl:border-b-0 xl:border-r">
          <div className="flex h-full flex-col">
            <div className="border-b border-[#eee7f9] bg-gradient-to-r from-pink-50 to-orange-50 px-5 py-5">
              <div className="mb-2 flex items-center gap-2">
                <Coffee size={18} className="text-pink-500" />
                <h2 className="text-gray-800" style={{ fontSize: 19 }}>{activeCourse} Social Room</h2>
              </div>
              <p className="text-sm text-gray-500">A lighter-weight space for chats, intros, career advice, and meeting classmates outside class threads.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
                  {roomData.users.length} students hanging out
                </span>
                <button
                  onClick={onJoin}
                  className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-sm text-white transition-colors hover:bg-pink-600"
                >
                  <LogIn size={14} />
                  Join Room
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-4 flex flex-wrap gap-2">
                {["Casual chat", "Career talk", "Weekend plans", "OMSCS life"].map((topic) => (
                  <span key={topic} className={`rounded-full px-2.5 py-1 text-[11px] ${topicColors[topic]}`}>{topic}</span>
                ))}
              </div>

              <div className="mb-5">
                <p className="mb-2 text-xs text-gray-400" style={{ fontWeight: 600 }}>CHANNELS</p>
                <div className="space-y-1.5">
                  {roomData.channels.map((channel) => {
                    const isSelected = channel.name === selectedChannel;

                    return (
                      <button
                        key={channel.name}
                        type="button"
                        onClick={() => setSelectedChannel(channel.name)}
                        className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${
                          isSelected ? "bg-[#4a2e8a] text-white shadow-sm" : "bg-[#faf8fd] text-gray-700 hover:bg-[#f3eefc]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Hash size={14} className={isSelected ? "text-white/85" : "text-gray-400"} />
                          <span className="text-sm" style={{ fontWeight: 500 }}>{channel.name}</span>
                          <span className={`ml-auto text-[10px] ${isSelected ? "text-white/75" : "text-gray-400"}`}>{channel.active} active</span>
                        </div>
                        <p className={`mt-1 text-xs ${isSelected ? "text-white/75" : "text-gray-400"}`}>{channel.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs text-gray-400" style={{ fontWeight: 600 }}>WHO'S HERE</p>
                  <span className="text-[11px] text-[#4a2e8a]">{channelMembers.length} in channel</span>
                </div>
                <div className="space-y-2">
                  {channelMembers.map((user) => (
                    <div key={user.name} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-3 py-2.5">
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500">{user.avatar}</div>
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-gray-800">{user.name}</p>
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] ${topicColors[user.topic]}`}>{user.topic}</span>
                      </div>
                      <button type="button" className="text-xs text-gray-400 hover:text-pink-500">
                        <Smile size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-[#faf8fd]">
          <div className="flex h-full flex-col 2xl:flex-row">
            <section className="min-h-0 flex-1 border-r border-[#ebe5f6] bg-white">
              <div className={`border-b bg-gradient-to-r px-6 py-5 ${channelAccent[activeChannel.name]}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-[#4a2e8a]">
                      <Hash size={16} />
                      <h3 className="text-lg text-gray-900" style={{ fontWeight: 600 }}>{activeChannel.name}</h3>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{activeChannel.desc}</p>
                    <p className="mt-2 max-w-2xl text-sm text-gray-600">{activeChannel.summary}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-[11px] text-gray-500">
                      <Users size={12} />
                      {activeChannel.active} active
                    </span>
                    <button
                      type="button"
                      className="rounded-md border border-white/60 bg-white/80 p-2 text-gray-500 transition-colors hover:text-[#4a2e8a]"
                    >
                      <Search size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-4 flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="h-px flex-1 bg-[#ece6f7]" />
                  <span>Today</span>
                  <span className="h-px flex-1 bg-[#ece6f7]" />
                </div>

                <div className="space-y-4">
                  {activeMessages.map((message, index) => (
                    <div key={`${message.author}-${index}`} className="rounded-xl border border-[#ede8f7] bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f3eefc] text-xs text-[#4a2e8a]">
                          {message.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <PeerName name={message.author} className="text-sm text-[#2251ff]" showLabelsInline={false} />
                            <span className="text-xs text-gray-400">{message.time}</span>
                          </div>
                          <PeerLabels name={message.author} className="mt-0.5" />
                          <p className="mt-2 text-sm leading-6 text-gray-700">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#ebe5f6] bg-white px-6 py-4">
                <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                  <MessageSquareText size={14} className="text-[#4a2e8a]" />
                  <span>{activeChannel.prompt}</span>
                </div>
                <div className="rounded-xl border border-[#ddd4ef] bg-[#fcfbff] px-4 py-3 shadow-sm">
                  <textarea
                    value={activeDraft}
                    onChange={(event) => updateDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={`Message #${activeChannel.name}`}
                    className="min-h-16 w-full resize-none bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      <span className="rounded-md bg-white px-2 py-1">Thread</span>
                      <span className="rounded-md bg-white px-2 py-1">Emoji</span>
                      <span className="rounded-md bg-white px-2 py-1">Attach</span>
                    </div>
                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={!canSend}
                      className="inline-flex items-center gap-1 rounded-md bg-[#4a2e8a] px-3 py-2 text-sm text-white transition-colors hover:bg-[#3d2574] disabled:cursor-not-allowed disabled:bg-[#c8bcdf]"
                    >
                      <Sparkles size={14} />
                      Send
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <aside className="w-full shrink-0 border-t border-[#ebe5f6] bg-[#fcfbff] 2xl:w-[290px] 2xl:border-t-0">
              <div className="h-full overflow-y-auto px-5 py-5">
                <div className="mb-4 rounded-2xl border border-[#e8def7] bg-white p-4 shadow-sm">
                  <p className="text-xs text-gray-400" style={{ fontWeight: 600 }}>CHANNEL FOCUS</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeChannel.focus.map((item) => (
                      <span key={item} className="rounded-full bg-[#f4effd] px-2.5 py-1 text-[11px] text-[#4a2e8a]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4 rounded-2xl border border-[#e8def7] bg-white p-4 shadow-sm">
                  <p className="text-xs text-gray-400" style={{ fontWeight: 600 }}>PINNED</p>
                  <div className="mt-3 space-y-2">
                    {activeChannel.pinned.map((item) => (
                      <div key={item} className="rounded-lg bg-[#faf8fd] px-3 py-2 text-sm text-gray-600">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e8def7] bg-white p-4 shadow-sm">
                  <p className="text-xs text-gray-400" style={{ fontWeight: 600 }}>ACTIVE NOW</p>
                  <div className="mt-3 space-y-2">
                    {channelMembers.map((user) => (
                      <div key={user.name} className="flex items-center gap-3 rounded-lg bg-[#faf8fd] px-3 py-2.5">
                        <div className="relative">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs text-[#4a2e8a] shadow-sm">
                            {user.avatar}
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm text-gray-800">{user.name}</p>
                          <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] ${topicColors[user.topic]}`}>{user.topic}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
