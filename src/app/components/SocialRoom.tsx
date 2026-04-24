import { useState } from "react";
import { ArrowUpRight, Coffee, Hash, LogIn, MessageSquareText, Search, Smile, Sparkles, Users } from "lucide-react";

import { CURRENT_USER } from "../data/threads";
import { PeerLabels, PeerName } from "../peer/PeerName";

const socialUsers = [
  { name: "Alex T.", topic: "Career talk", avatar: "AT" },
  { name: "Priya S.", topic: "Casual chat", avatar: "PS" },
  { name: "Marcus W.", topic: "Weekend plans", avatar: "MW" },
  { name: "Lin Z.", topic: "OMSCS life", avatar: "LZ" },
  { name: "Fatima A.", topic: "Casual chat", avatar: "FA" },
  { name: "Tom H.", topic: "Career talk", avatar: "TH" },
  { name: "Nadia R.", topic: "Casual chat", avatar: "NR" },
  { name: "Chris B.", topic: "Weekend plans", avatar: "CB" },
];

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

const channels: ChannelData[] = [
  {
    name: "general",
    desc: "Anything and everything",
    active: 14,
    summary: "Live discussion about class pacing, good campus coffee, and how everyone is balancing work with OMSCS.",
    prompt: "Drop in with quick updates, schedule questions, or anything happening this week.",
    pinned: ["Reading schedule swap thread", "Friday virtual coffee at 7 PM ET"],
    focus: ["Balancing work and class", "Lecture note strategies", "Weekly check-ins"],
    messages: [
      { author: "Priya S.", avatar: "PS", time: "10:18 AM", text: "Is anyone else planning to knock out readings early this weekend? Trying to avoid the usual Sunday crunch." },
      { author: "Rahul Khanna", avatar: "RK", time: "10:23 AM", text: "I am. I started blocking Friday evenings for discussion posts and it has made the rest of the week much calmer." },
      { author: "Alex T.", avatar: "AT", time: "10:27 AM", text: "Same here. Also, the CS6750 lecture notes are way easier to get through in one pass if I watch at 1.25x first and revisit only the tricky parts." },
      { author: "Fatima A.", avatar: "FA", time: "10:32 AM", text: "Appreciate the tip. I keep over-indexing on perfect notes instead of just getting a first pass done." },
      { author: "Lin Z.", avatar: "LZ", time: "10:40 AM", text: "We should probably pin a thread with everyone's time-management patterns because that question comes up every week." },
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
      { author: "Tom H.", avatar: "TH", time: "9:11 AM", text: "I have a systems design interview next Thursday for a product role. If anyone has a good way to frame HCI coursework as relevant, I would love advice." },
      { author: "Alex T.", avatar: "AT", time: "9:15 AM", text: "I would anchor on tradeoff thinking. CS6750 gives you a clean story around user goals, constraints, iteration, and why design decisions were made." },
      { author: "Rahul Khanna", avatar: "RK", time: "9:21 AM", text: "For behavioral rounds, I have had better luck talking about team projects than assignments. Interviewers seem to respond better when the story includes collaboration friction and how you resolved it." },
      { author: "Tom H.", avatar: "TH", time: "9:26 AM", text: "That helps. I was struggling to decide whether to lead with class projects or work examples. I will probably do one of each." },
      { author: "Priya S.", avatar: "PS", time: "9:35 AM", text: "If you want, drop your current answer draft in here. A few of us can redline it before your interview." },
    ],
  },
  {
    name: "off-topic",
    desc: "Memes, hobbies, random",
    active: 9,
    summary: "Mostly playlists, game recommendations, and the usual OMSCS venting about too many tabs open at once.",
    prompt: "No coursework required. If it is fun or random, it fits here.",
    pinned: ["Weekend plans poll", "Current TV recs"],
    focus: ["Show recommendations", "Gaming", "Decompressing after work"],
    messages: [
      { author: "Nadia R.", avatar: "NR", time: "8:42 AM", text: "Need a low-brain evening plan after work and readings. Movie, game, or show recommendation?" },
      { author: "Marcus W.", avatar: "MW", time: "8:49 AM", text: "If you want something light, the new season of Taskmaster has been perfect background chaos." },
      { author: "Lin Z.", avatar: "LZ", time: "8:54 AM", text: "I have been alternating between that and Hades runs, which is probably not helping my sleep schedule." },
      { author: "Priya S.", avatar: "PS", time: "9:02 AM", text: "That sounds exactly correct for this program, honestly." },
      { author: "Chris B.", avatar: "CB", time: "9:05 AM", text: "Also recommending a short walk before opening Ed. That tiny reset has been doing more for me than caffeine." },
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
      { author: "Chris B.", avatar: "CB", time: "Yesterday", text: "Hey everyone, I am based in Seattle and work in cloud infrastructure. Taking this class to round out the design side of my background." },
      { author: "Emily Park", avatar: "EP", time: "Yesterday", text: "Welcome. I came from product design into OMSCS and the mix of technical + UX perspectives has been worth it." },
      { author: "Rahul Khanna", avatar: "RK", time: "Yesterday", text: "I am in Herndon, Virginia and balancing the program with full-time work. Always happy to compare time-management strategies if that would help." },
      { author: "Fatima A.", avatar: "FA", time: "Yesterday", text: "I am in Toronto and usually online late evenings. Hoping to meet a few people in roughly the same schedule." },
    ],
  },
];

interface SocialRoomProps {
  onJoin: () => void;
}

const currentUserAvatar = CURRENT_USER
  .split(/\s+/)
  .map((part) => part[0])
  .filter(Boolean)
  .slice(0, 2)
  .join("")
  .toUpperCase();

const initialMessagesByChannel = channels.reduce<Record<ChannelName, ChannelMessage[]>>((acc, channel) => {
  acc[channel.name] = channel.messages;
  return acc;
}, {} as Record<ChannelName, ChannelMessage[]>);

export function SocialRoom({ onJoin }: SocialRoomProps) {
  const [selectedChannel, setSelectedChannel] = useState<ChannelName>("general");
  const [messagesByChannel, setMessagesByChannel] = useState<Record<ChannelName, ChannelMessage[]>>(() => initialMessagesByChannel);
  const [draftsByChannel, setDraftsByChannel] = useState<Record<ChannelName, string>>({
    general: "",
    "career-talk": "",
    "off-topic": "",
    introductions: "",
  });
  const activeChannel = channels.find((channel) => channel.name === selectedChannel) || channels[0];
  const activeMessages = messagesByChannel[selectedChannel] || activeChannel.messages;
  const activeDraft = draftsByChannel[selectedChannel] || "";
  const canSend = activeDraft.trim().length > 0;
  const channelMembers = socialUsers.filter((user) => {
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

    setMessagesByChannel((current) => ({
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
                <h2 className="text-gray-800" style={{ fontSize: 19 }}>Social Room</h2>
              </div>
              <p className="text-sm text-gray-500">A lighter-weight space for chats, intros, career advice, and meeting classmates outside class threads.</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
                  8 students hanging out
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
                  {channels.map((channel) => {
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
                  {socialUsers.map((user) => (
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
