import { Bell, Home, MessageSquare, UserCog, Users } from "lucide-react";

interface HeaderProps {
  view: "course" | "dashboard";
  activeTab: "discussion" | "community";
  onTabChange: (tab: "discussion" | "community") => void;
  activeCourse: string;
  onHome: () => void;
  onOpenSettings?: () => void;
}

const courseNames: Record<string, string> = {
  CS6750: "CS6750 - Human-Computer Interaction",
  CS7646: "CS7646 - Machine Learning for Trading",
  CS6200: "CS6200 - Graduate Intro to OS",
};

export function Header({ view, activeTab, onTabChange, activeCourse, onHome, onOpenSettings }: HeaderProps) {
  const isDashboard = view === "dashboard";

  return (
    <header className="h-12 bg-[#4a2e8a] flex items-center px-4 shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-white/90 tracking-wide" style={{ fontSize: 18, fontWeight: 700 }}>ed</span>
        <span className="text-white/70 text-sm">|</span>
        <span className="text-white text-sm" style={{ fontWeight: 500 }}>
          {isDashboard ? "Dashboard" : `${courseNames[activeCourse] || activeCourse} - Ed Discussion`}
        </span>
      </div>

      {!isDashboard && (
        <div className="flex items-center gap-1 ml-10">
          <button
            onClick={() => onTabChange("discussion")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm transition-colors ${
              activeTab === "discussion"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white/80 hover:bg-white/10"
            }`}
          >
            <MessageSquare size={15} />
            Class Discussion
          </button>
          <button
            onClick={() => onTabChange("community")}
            className={`flex items-center gap-2 px-4 py-1.5 rounded text-sm transition-colors ${
              activeTab === "community"
                ? "bg-white/20 text-white"
                : "text-white/60 hover:text-white/80 hover:bg-white/10"
            }`}
          >
            <Users size={15} />
            {activeCourse} Community
            <span className="bg-emerald-400 text-[10px] text-emerald-950 px-1.5 py-0.5 rounded-full" style={{ fontWeight: 600 }}>NEW</span>
          </button>
        </div>
      )}

      <div className="ml-auto flex items-center gap-3">
        {!isDashboard && (
          <button
            onClick={onOpenSettings}
            title="My Peer Visibility Settings"
            className="flex items-center gap-1.5 text-white/70 hover:text-white hover:bg-white/10 px-2 py-1 rounded text-xs transition-colors"
          >
            <UserCog size={15} />
            <span className="hidden md:inline">Peer visibility</span>
          </button>
        )}
        <button className="text-white/60 hover:text-white/90 transition-colors">
          <Bell size={18} />
        </button>
        <button
          onClick={onHome}
          title="Home"
          className={`rounded px-2 py-1 transition-colors ${
            isDashboard ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/10 hover:text-white/90"
          }`}
        >
          <Home size={18} />
        </button>
        <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs" style={{ fontWeight: 600 }}>R</div>
      </div>
    </header>
  );
}
