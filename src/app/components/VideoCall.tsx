import { useState, useEffect } from "react";
import { Mic, MicOff, Video, VideoOff, Monitor, Hand, MessageSquare, PhoneOff, Users, Settings, Maximize2, MoreHorizontal } from "lucide-react";

interface VideoCallProps {
  roomName: string;
  roomType: "social";
  onLeave: () => void;
}

const participantPool = [
  { name: "Sarah Chen", avatar: "SC", color: "bg-blue-600" },
  { name: "Marcus Williams", avatar: "MW", color: "bg-emerald-600" },
  { name: "Priya Sharma", avatar: "PS", color: "bg-purple-600" },
  { name: "James Rodriguez", avatar: "JR", color: "bg-amber-600" },
  { name: "Emily Park", avatar: "EP", color: "bg-rose-600" },
  { name: "Alex Thompson", avatar: "AT", color: "bg-cyan-600" },
  { name: "Lin Zhang", avatar: "LZ", color: "bg-indigo-600" },
  { name: "David Kim", avatar: "DK", color: "bg-teal-600" },
  { name: "Fatima Al-Rashid", avatar: "FA", color: "bg-orange-600" },
  { name: "Chris Brooks", avatar: "CB", color: "bg-sky-600" },
  { name: "Nadia Rossi", avatar: "NR", color: "bg-pink-600" },
];

export function VideoCall({ roomName, roomType, onLeave }: VideoCallProps) {
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showChat, setShowChat] = useState(false);

  const participants = participantPool.slice(0, 6);
  const accentColor = "#ec4899";

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1a1a2e] overflow-hidden">
      {/* Top bar */}
      <div className="h-12 flex items-center justify-between px-4 bg-[#16162a] border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-white text-sm" style={{ fontWeight: 600 }}>{roomName}</span>
          <span className="text-white/30 text-xs">|</span>
          <span className="text-white/40 text-xs flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {formatTime(elapsed)}
          </span>
          <span className="text-white/30 text-xs flex items-center gap-1">
            <Users size={12} />
            {participants.length + 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="text-white/40 hover:text-white/70 transition-colors">
            <Settings size={16} />
          </button>
          <button className="text-white/40 hover:text-white/70 transition-colors">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Video grid */}
      <div className="flex-1 p-4 overflow-hidden flex">
        <div className={`flex-1 grid gap-2 ${showChat ? "mr-[280px]" : ""}`} style={{
          gridTemplateColumns: `repeat(${Math.min(participants.length + 1, 4)}, 1fr)`,
          gridTemplateRows: `repeat(${Math.ceil((participants.length + 1) / 4)}, 1fr)`,
        }}>
          {/* You */}
          <div className="relative bg-[#252547] rounded-lg overflow-hidden flex items-center justify-center min-h-0">
            {videoOn ? (
              <div className="w-full h-full bg-gradient-to-br from-[#2a2a4a] to-[#1a1a3a] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl" style={{ fontWeight: 600 }}>RK</div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl" style={{ fontWeight: 600 }}>RK</div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <span className="bg-black/60 text-white text-[11px] px-2 py-0.5 rounded">You</span>
              {!micOn && <span className="bg-red-500/80 p-0.5 rounded"><MicOff size={10} className="text-white" /></span>}
              {handRaised && <span className="text-base">✋</span>}
            </div>
          </div>

          {/* Participants */}
          {participants.map((p, i) => (
            <div key={p.name} className="relative bg-[#252547] rounded-lg overflow-hidden flex items-center justify-center min-h-0">
              <div className={`w-16 h-16 rounded-full ${p.color} flex items-center justify-center text-white text-lg`} style={{ fontWeight: 600 }}>
                {p.avatar}
              </div>
              {/* Simulate some with video "on" via gradient */}
              {i % 3 === 0 && (
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/[0.02]" />
              )}
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                <span className="bg-black/60 text-white text-[11px] px-2 py-0.5 rounded">{p.name.split(" ")[0]}</span>
                {i % 2 === 0 && <span className="bg-red-500/80 p-0.5 rounded"><MicOff size={10} className="text-white" /></span>}
              </div>
              {/* Speaking indicator for some */}
              {i % 4 === 1 && (
                <div className="absolute inset-0 rounded-lg border-2 border-green-400/60 pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        {/* Chat panel */}
        {showChat && (
          <div className="absolute right-0 top-12 bottom-0 w-[280px] bg-[#16162a] border-l border-white/5 flex flex-col">
            <div className="p-3 border-b border-white/5 text-white text-sm" style={{ fontWeight: 500 }}>Room Chat</div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {[
                { user: "Sarah", msg: "Hey everyone! Working on HW3 right now", time: "2m ago" },
                { user: "Marcus", msg: "Same here. Anyone stuck on Q4?", time: "1m ago" },
                { user: "Emily", msg: "Q4 is tricky — check the lecture 7 slides", time: "45s ago" },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-white/80 text-xs" style={{ fontWeight: 500 }}>{m.user}</span>
                    <span className="text-white/20 text-[10px]">{m.time}</span>
                  </div>
                  <p className="text-white/50 text-xs" style={{ lineHeight: 1.4 }}>{m.msg}</p>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-white/5">
              <input className="w-full bg-white/5 text-white/80 text-xs rounded px-3 py-2 outline-none placeholder-white/20" placeholder="Type a message..." />
            </div>
          </div>
        )}
      </div>

      {/* Controls bar */}
      <div className="h-16 bg-[#16162a] border-t border-white/5 flex items-center justify-center gap-3 px-6">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            micOn ? "bg-white/10 text-white hover:bg-white/15" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
          }`}
        >
          {micOn ? <Mic size={18} /> : <MicOff size={18} />}
        </button>
        <button
          onClick={() => setVideoOn(!videoOn)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            videoOn ? "bg-white/10 text-white hover:bg-white/15" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
          }`}
        >
          {videoOn ? <Video size={18} /> : <VideoOff size={18} />}
        </button>
        <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/15 transition-colors">
          <Monitor size={18} />
        </button>
        <button
          onClick={() => setHandRaised(!handRaised)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            handRaised ? "bg-amber-500/20 text-amber-400" : "bg-white/10 text-white hover:bg-white/15"
          }`}
        >
          <Hand size={18} />
        </button>
        <button
          onClick={() => setShowChat(!showChat)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
            showChat ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-white hover:bg-white/15"
          }`}
        >
          <MessageSquare size={18} />
        </button>
        <button className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/15 transition-colors">
          <MoreHorizontal size={18} />
        </button>
        <div className="w-px h-6 bg-white/10 mx-1" />
        <button
          onClick={onLeave}
          className="h-10 px-5 rounded-full bg-red-600 text-white text-sm flex items-center gap-2 hover:bg-red-700 transition-colors"
        >
          <PhoneOff size={16} />
          Leave
        </button>
      </div>
    </div>
  );
}
