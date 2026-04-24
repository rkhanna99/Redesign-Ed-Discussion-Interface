import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, HelpCircle, Megaphone, MessageCircle, ChevronDown, Check, User, MessageSquare, Reply, Star, Eye, Heart } from "lucide-react";

import { PeerName, PeerLabels } from "../peer/PeerName";
import { courseThreads, Thread, CURRENT_USER } from "../data/threads";
import { filterByCommunityCategory, filterByDiscussionCategory } from "../data/threadFilters";

type ParticipationFilter = "all" | "my_posts" | "replies_to_me" | "commented" | "starred" | "watched" | "liked";

const filterLabels: Record<ParticipationFilter, string> = {
  all: "All threads",
  my_posts: "Only my posts",
  replies_to_me: "Only replies to me",
  commented: "Posts I commented on",
  starred: "Starred",
  watched: "Watched",
  liked: "Liked",
};

const communityThreadsByC: Record<string, Thread[]> = {
  CS6750: [
    { id: 3001, title: "Introduce yourself! CS6750 Spring 2026", category: "Introductions", author: "Community Bot", time: "2h", comments: 47, likes: 32 },
    { id: 3002, title: "Atlanta HCI students - coffee meetup?", category: "Meetups", author: "Sarah Chen", time: "5h", comments: 12, likes: 8 },
    { id: 3003, title: "UX internships - who's hiring for summer?", category: "Career & Jobs", author: "Marcus Williams", time: "8h", comments: 23, likes: 15 },
    { id: 3004, title: "Balancing CS6750 with full-time design work", category: "Class Life", author: "James Rodriguez", time: "1d", comments: 34, likes: 28 },
    { id: 3005, title: "Favorite design books and podcasts?", category: "Hobbies & Interests", author: "Emily Park", time: "2d", comments: 14, likes: 19 },
  ],
  CS7646: [
    { id: 3101, title: "Introduce yourself! CS7646 Spring 2026", category: "Introductions", author: "Community Bot", time: "1h", comments: 63, likes: 41 },
    { id: 3102, title: "Quantitative finance career paths", category: "Career & Jobs", author: "Kevin Tran", time: "4h", comments: 31, likes: 22 },
    { id: 3103, title: "Paper trading competitions - interested?", category: "Activities", author: "Rachel Moore", time: "6h", comments: 18, likes: 35 },
    { id: 3104, title: "Best Python libraries for financial analysis?", category: "Class Life", author: "Sanjay Gupta", time: "1d", comments: 24, likes: 17 },
    { id: 3105, title: "NYC ML4T students - study + networking dinner?", category: "Meetups", author: "Maria Gonzalez", time: "2d", comments: 9, likes: 12 },
  ],
  CS6200: [
    { id: 3201, title: "Introduce yourself! CS6200 Spring 2026", category: "Introductions", author: "Community Bot", time: "3h", comments: 38, likes: 27 },
    { id: 3202, title: "Systems engineering roles - interview prep", category: "Career & Jobs", author: "Chris Brooks", time: "5h", comments: 27, likes: 19 },
    { id: 3203, title: "Virtual Linux setup - what's your dev environment?", category: "Class Life", author: "Fatima Al-Rashid", time: "10h", comments: 22, likes: 14 },
    { id: 3204, title: "C programming - resources that helped you?", category: "Hobbies & Interests", author: "Lin Zhang", time: "1d", comments: 19, likes: 31 },
    { id: 3205, title: "Bay Area GIOS students - weekend hike + study?", category: "Meetups", author: "Nadia Rossi", time: "3d", comments: 7, likes: 9 },
  ],
};

interface ThreadListProps {
  activeTab: "discussion" | "community";
  activeCategory: string | null;
  selectedThread: number;
  onSelectThread: (id: number) => void;
  activeCourse: string;
  hasCommented: (id: number) => boolean;
  getCommentCount: (id: number, baseCount: number) => number;
  getLikeCount: (id: number, baseCount: number) => number;
  isStarred: (id: number) => boolean;
  isWatched: (id: number) => boolean;
  isLiked: (id: number) => boolean;
  width?: number;
}

export function ThreadList({
  activeTab,
  activeCategory,
  selectedThread,
  onSelectThread,
  activeCourse,
  hasCommented,
  getCommentCount,
  getLikeCount,
  isStarred,
  isWatched,
  isLiked,
  width,
}: ThreadListProps) {
  const courseThreadSource = activeTab === "discussion" ? (courseThreads[activeCourse] || courseThreads.CS6750) : (communityThreadsByC[activeCourse] || communityThreadsByC.CS6750);
  const allThreads = activeTab === "discussion"
    ? filterByDiscussionCategory(courseThreadSource, activeCategory)
    : filterByCommunityCategory(courseThreadSource, activeCategory);
  const [filter, setFilter] = useState<ParticipationFilter>("all");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const threads = allThreads.filter((thread) => {
    if (filter === "all") return true;
    if (filter === "my_posts") return thread.author === CURRENT_USER;
    if (filter === "replies_to_me") return !!thread.repliedToMe;
    if (filter === "commented") return hasCommented(thread.id);
    if (filter === "starred") return isStarred(thread.id);
    if (filter === "watched") return isWatched(thread.id);
    if (filter === "liked") return isLiked(thread.id);
    return true;
  });
  const listLabel = activeCategory ? activeCategory.toUpperCase() : (activeTab === "discussion" ? "THIS WEEK" : "RECENT");

  const filterIcon = (f: ParticipationFilter) => {
    if (f === "my_posts") return <User size={12} />;
    if (f === "replies_to_me") return <Reply size={12} />;
    if (f === "commented") return <MessageSquare size={12} />;
    if (f === "starred") return <Star size={12} />;
    if (f === "watched") return <Eye size={12} />;
    if (f === "liked") return <Heart size={12} />;
    return <SlidersHorizontal size={12} />;
  };

  return (
    <div className="border-r border-gray-200 flex flex-col shrink-0 bg-white overflow-hidden" style={{ width: width ?? 340 }}>
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded px-3 py-1.5">
          <Search size={14} className="text-gray-400" />
          <input type="text" placeholder="Search" className="bg-transparent text-sm outline-none flex-1 placeholder-gray-400" />
        </div>
        <div className="flex justify-between items-center mt-2 relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            className={`text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors ${
              filter === "all" ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100" : "bg-[#4a2e8a] text-white hover:bg-[#3d2574]"
            }`}
          >
            {filterIcon(filter)}
            <span>{filterLabels[filter]}</span>
            <ChevronDown size={11} />
          </button>
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="text-[11px] text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
          {menuOpen && (
            <div className="absolute left-0 top-full mt-1 w-60 bg-white rounded-md shadow-lg border border-gray-200 z-20 py-1">
              <div className="px-3 py-1.5 text-[10px] text-gray-400 tracking-wider" style={{ fontWeight: 600 }}>
                MY ACTIVITY
              </div>
              {(["all", "my_posts", "replies_to_me", "commented", "starred", "watched", "liked"] as ParticipationFilter[]).map((item) => (
                <button
                  key={item}
                  onClick={() => { setFilter(item); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 text-left"
                >
                  <span className="text-gray-500">{filterIcon(item)}</span>
                  <span className="flex-1">{filterLabels[item]}</span>
                  {filter === item && <Check size={13} className="text-[#4a2e8a]" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] text-gray-400 tracking-wider flex items-center justify-between" style={{ fontWeight: 600 }}>
          <span>{filter === "all" ? listLabel : filterLabels[filter].toUpperCase()}</span>
          <span className="text-gray-300">{threads.length}</span>
        </div>
        {threads.length === 0 && (
          <div className="px-4 py-8 text-center text-xs text-gray-400">
            {activeCategory ? `No threads match ${activeCategory} in ${activeCourse}.` : `No threads found in ${activeCourse}.`}
          </div>
        )}
        {threads.map((thread) => {
          const userCommented = hasCommented(thread.id);
          const commentCount = getCommentCount(thread.id, thread.comments);
          const likeCount = getLikeCount(thread.id, thread.likes ?? 0);

          return (
            <div
              key={thread.id}
              onClick={() => onSelectThread(thread.id)}
              className={`border-b border-gray-200/70 px-3 py-2.5 cursor-pointer transition-colors ${
                selectedThread === thread.id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="grid grid-cols-[8px_18px_minmax(0,1fr)_auto] items-start gap-2">
                <span className="mt-[7px] flex h-2 w-2 items-center justify-center">
                  {thread.unread && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                </span>
                <span className="mt-[3px] flex h-[18px] w-[18px] items-center justify-center text-gray-400">
                  {thread.isAnnouncement ? (
                    <Megaphone size={14} />
                  ) : (
                    <HelpCircle size={14} />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 truncate">{thread.title}</span>
                    {thread.resolved && <span className="text-green-500 shrink-0">✓</span>}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 min-w-0">
                    <PeerName name={thread.author} className="text-[11px] text-gray-600 truncate" showLabelsInline={false} />
                    {thread.author === CURRENT_USER && (
                      <span className="text-[10px] px-1 rounded bg-[#4a2e8a]/10 text-[#4a2e8a]" style={{ fontWeight: 500 }}>You</span>
                    )}
                    {thread.repliedToMe && thread.author !== CURRENT_USER && (
                      <span className="text-[10px] px-1 rounded bg-emerald-50 text-emerald-700" style={{ fontWeight: 500 }}>Reply to you</span>
                    )}
                    {userCommented && thread.author !== CURRENT_USER && !thread.repliedToMe && (
                      <span className="text-[10px] px-1 rounded bg-gray-100 text-gray-500" style={{ fontWeight: 500 }}>Commented</span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                    {thread.time}{/ago$/i.test(thread.time) ? "" : " ago"} in <span className="text-blue-600" style={{ fontWeight: 500 }}>{thread.category}</span>
                  </div>
                  <PeerLabels name={thread.author} className="mt-1" />
                </div>
                <div className="flex items-center gap-2 shrink-0 text-[11px] text-gray-400">
                  <span className="flex items-center gap-0.5">
                    <MessageCircle size={11} />
                    {commentCount}
                    {thread.newComments && <span className="text-blue-600">({thread.newComments} new)</span>}
                  </span>
                  <span>♥ {likeCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
