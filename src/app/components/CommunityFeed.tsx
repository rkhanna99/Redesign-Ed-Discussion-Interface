import { MapPin, UserPlus, Sparkles, TrendingUp, Heart, MessageCircle } from "lucide-react";
import { PeerName, PeerLabels } from "../peer/PeerName";
import { communityPosts } from "../data/communityPosts";
import { filterByCommunityCategory } from "../data/threadFilters";

const courseNames: Record<string, string> = {
  CS6750: "CS6750 Human-Computer Interaction",
  CS7646: "CS7646 Machine Learning for Trading",
  CS6200: "CS6200 Graduate Intro to OS",
};

const courseEnrolled: Record<string, number> = {
  CS6750: 312,
  CS7646: 487,
  CS6200: 258,
};

const prompts = [
  { icon: <UserPlus size={16} />, label: "Introduce yourself", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { icon: <MapPin size={16} />, label: "Find classmates nearby", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { icon: <Sparkles size={16} />, label: "See who's active", color: "bg-purple-50 text-purple-600 border-purple-100" },
  { icon: <TrendingUp size={16} />, label: "Trending in class", color: "bg-amber-50 text-amber-600 border-amber-100" },
];

interface CommunityFeedProps {
  selectedThread: number;
  onSelectThread: (id: number) => void;
  activeCourse: string;
  activeCategory: string | null;
}

export function CommunityContent({ selectedThread, activeCourse, activeCategory }: CommunityFeedProps) {
  const posts = filterByCommunityCategory(communityPosts[activeCourse] || communityPosts.CS6750, activeCategory);
  const post = posts.find((p) => p.id === selectedThread) || posts[0];
  const enrolled = courseEnrolled[activeCourse] || 0;
  const name = courseNames[activeCourse] || activeCourse;

  if (!post) {
    return (
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">
            {activeCategory ? `No ${activeCategory} community posts have been shared in ${activeCourse} yet.` : `No community posts have been shared in ${activeCourse} yet.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 border border-indigo-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-gray-800 mb-1" style={{ fontSize: 18 }}>{activeCourse} Community</h2>
              <p className="text-sm text-gray-500">Connect with fellow {name} students beyond coursework. Introductions, meetups, career talk, and more — just for your class.</p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-2xl text-[#4a2e8a]" style={{ fontWeight: 700 }}>{enrolled}</p>
              <p className="text-[10px] text-gray-400" style={{ fontWeight: 500 }}>classmates enrolled</p>
            </div>
          </div>
        </div>

        {/* Quick action prompts */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {prompts.map((p) => (
            <button key={p.label} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors hover:shadow-sm ${p.color}`}>
              {p.icon}
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Selected post (expanded) */}
        <div className="bg-white border border-gray-100 rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-gray-900" style={{ fontSize: 20 }}>
              {post.title} <span className="text-gray-400" style={{ fontSize: 14, fontWeight: 400 }}>#{post.id}</span>
            </h1>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${post.tagColor} shrink-0 ml-3`}>{post.tag}</span>
          </div>

          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm shrink-0">{post.avatar}</div>
            <div className="flex-1 min-w-0">
              <PeerName name={post.author} className="text-sm text-gray-800" showLabelsInline={false} />
              <p className="text-xs text-gray-400">{post.time}</p>
              <PeerLabels name={post.author} className="mt-1" />
            </div>
          </div>

          <div className="text-sm text-gray-700 mb-5" style={{ lineHeight: 1.7 }}>
            {post.body.map((p, i) => (
              <p key={i} className="mb-3">{p}</p>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400 pb-4 border-b border-gray-100">
            <span className="flex items-center gap-1"><Heart size={12} /> {post.likes}</span>
            <span className="flex items-center gap-1"><MessageCircle size={12} /> {post.comments}</span>
          </div>

          {post.replies.length > 0 ? (
            <div className="pt-4">
              <h2 className="text-gray-700 mb-3" style={{ fontSize: 14 }}>{post.replies.length} {post.replies.length === 1 ? "reply" : "replies"}</h2>
              <div className="space-y-3">
                {post.replies.map((r, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3.5 text-sm text-gray-600" style={{ lineHeight: 1.6 }}>
                    <div className="flex items-start gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs shrink-0">{r.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <PeerName name={r.author} className="text-sm text-gray-800" showLabelsInline={false} />
                          <span className="text-gray-400 text-xs">{r.time}</span>
                        </div>
                        <PeerLabels name={r.author} className="mt-0.5" />
                      </div>
                    </div>
                    <p>{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-4 text-sm text-gray-400">Be the first to reply.</div>
          )}
        </div>
      </div>
    </div>
  );
}
