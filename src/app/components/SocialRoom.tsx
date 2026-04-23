import { Coffee, LogIn, Smile, Hash } from "lucide-react";

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

const channels = [
  { name: "general", desc: "Anything and everything", active: 14 },
  { name: "career-talk", desc: "Jobs, interviews, networking", active: 6 },
  { name: "off-topic", desc: "Memes, hobbies, random", active: 9 },
  { name: "introductions", desc: "Say hi to new faces", active: 3 },
];

interface SocialRoomProps {
  onJoin: () => void;
}

export function SocialRoom({ onJoin }: SocialRoomProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl p-6 mb-6 border border-pink-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Coffee size={20} className="text-pink-500" />
                <h2 className="text-gray-800" style={{ fontSize: 20 }}>Social Room</h2>
              </div>
              <p className="text-sm text-gray-500 mb-3">Hang out with fellow OMSCS students. No homework, no deadlines — just good conversation.</p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                  8 students hanging out
                </span>
              </div>
            </div>
            <button
              onClick={onJoin}
              className="bg-pink-500 text-white px-5 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-pink-600 transition-colors"
            >
              <LogIn size={15} />
              Join Room
            </button>
          </div>
        </div>

        {/* Topics */}
        <div className="flex gap-2 mb-6">
          {["Casual chat", "Career talk", "Weekend plans", "OMSCS life"].map((t) => (
            <span key={t} className={`text-xs px-3 py-1.5 rounded-full ${topicColors[t]}`}>{t}</span>
          ))}
        </div>

        {/* Channels */}
        <p className="text-xs text-gray-400 mb-2" style={{ fontWeight: 600 }}>CONVERSATION CHANNELS</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {channels.map((ch) => (
            <div key={ch.name} className="bg-white border border-gray-100 rounded-lg p-3 hover:border-gray-200 transition-colors cursor-pointer">
              <div className="flex items-center gap-1.5 mb-1">
                <Hash size={13} className="text-gray-400" />
                <span className="text-sm text-gray-800" style={{ fontWeight: 500 }}>{ch.name}</span>
                <span className="ml-auto text-[10px] text-gray-400">{ch.active} active</span>
              </div>
              <p className="text-xs text-gray-400">{ch.desc}</p>
            </div>
          ))}
        </div>

        {/* Who's here */}
        <p className="text-xs text-gray-400 mb-2" style={{ fontWeight: 600 }}>WHO'S HERE</p>
        <div className="grid grid-cols-2 gap-2">
          {socialUsers.map((u) => (
            <div key={u.name} className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-3 py-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">{u.avatar}</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{u.name}</p>
                <span className={`text-[10px] inline-block px-1.5 py-0.5 rounded ${topicColors[u.topic]}`}>{u.topic}</span>
              </div>
              <button className="text-xs text-gray-400 hover:text-pink-500">
                <Smile size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Welcoming note */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-500">🎉 This is a low-pressure space. Jump in whenever you'd like!</p>
        </div>
      </div>
    </div>
  );
}