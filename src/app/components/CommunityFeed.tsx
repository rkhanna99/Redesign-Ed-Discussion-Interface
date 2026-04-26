import { useEffect, useState } from "react";
import { Eye, MapPin, UserPlus, Sparkles, TrendingUp, Heart, MoreHorizontal, Star, Trash2 } from "lucide-react";

import { CommunityPost } from "../data/communityPosts";
import { filterByCommunityCategory } from "../data/threadFilters";
import { CommentComposer, CommentThread, ThreadComment } from "./Commenting";
import { PeerName, PeerLabels } from "../peer/PeerName";

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
  activeCourse: string;
  activeCategory: string | null;
  posts: CommunityPost[];
  starred: boolean;
  onToggleStar: () => void;
  watched: boolean;
  onToggleWatch: () => void;
  liked: boolean;
  likeCount: number;
  onToggleLike: () => void;
  comments: ThreadComment[];
  onAddComment: (text: string, parentId: string | null) => void;
  onDeleteComment: (commentId: string) => void;
  canDeletePost?: boolean;
  onDeletePost?: () => void;
}

const postActionClass = "flex min-w-12 flex-col items-center gap-0.5 text-gray-400 transition-colors";
const postActionValueClass = "flex h-4 items-center justify-center text-base leading-none";
const postActionLabelClass = "text-xs leading-none";

export function CommunityContent({
  selectedThread,
  activeCourse,
  activeCategory,
  posts,
  starred,
  onToggleStar,
  watched,
  onToggleWatch,
  liked,
  likeCount,
  onToggleLike,
  comments,
  onAddComment,
  onDeleteComment,
  canDeletePost = false,
  onDeletePost,
}: CommunityFeedProps) {
  const visiblePosts = filterByCommunityCategory(posts, activeCategory);
  const post = visiblePosts.find((item) => item.id === selectedThread) || visiblePosts[0];
  const enrolled = courseEnrolled[activeCourse] || 0;
  const name = courseNames[activeCourse] || activeCourse;
  const [composerTarget, setComposerTarget] = useState<"post" | string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setComposerTarget(null);
    setDraft("");
  }, [activeCourse, activeCategory, selectedThread]);

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

  const views = post.views ?? (post.likes * 8 + post.comments * 3);
  const seededComments: ThreadComment[] = post.replies.map((reply, index) => ({
    id: `community-seed-${post.id}-${index}`,
    author: reply.author,
    avatar: reply.avatar,
    time: reply.time,
    text: reply.text,
    parentId: null,
  }));
  const renderedComments = [...seededComments, ...comments];
  const commentCount = renderedComments.length;
  const topLevelCount = renderedComments.filter((comment) => !comment.parentId).length;

  const openComposer = (target: "post" | string) => {
    setComposerTarget(target);
    setDraft("");
  };

  const closeComposer = () => {
    setComposerTarget(null);
    setDraft("");
  };
  const deleteComment = (commentId: string) => {
    if (composerTarget === commentId) closeComposer();
    onDeleteComment(commentId);
  };

  const submitComment = () => {
    const text = draft.trim();
    if (!text || !composerTarget) return;
    onAddComment(text, composerTarget === "post" ? null : composerTarget);
    closeComposer();
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 mb-6 border border-indigo-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-gray-800 mb-1" style={{ fontSize: 18 }}>{activeCourse} Community</h2>
              <p className="text-sm text-gray-500">Connect with fellow {name} students beyond coursework. Introductions, meetups, career talk, and more - just for your class.</p>
            </div>
            <div className="text-right shrink-0 ml-4">
              <p className="text-2xl text-[#4a2e8a]" style={{ fontWeight: 700 }}>{enrolled}</p>
              <p className="text-[10px] text-gray-400" style={{ fontWeight: 500 }}>classmates enrolled</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {prompts.map((prompt) => (
            <button key={prompt.label} type="button" className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-colors hover:shadow-sm ${prompt.color}`}>
              {prompt.icon}
              <span>{prompt.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-lg p-5">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-gray-900" style={{ fontSize: 20 }}>
              {post.title} <span className="text-gray-400" style={{ fontSize: 14, fontWeight: 400 }}>#{post.id}</span>
            </h1>
            <div className="mt-1 ml-3 flex shrink-0 items-start gap-5">
              <button
                type="button"
                onClick={onToggleStar}
                className={`${postActionClass} ${starred ? "text-yellow-500 hover:text-yellow-600" : "hover:text-gray-600"}`}
              >
                <span className={`${postActionValueClass} ${starred ? "text-yellow-500" : ""}`}>
                  <Star size={16} fill={starred ? "currentColor" : "none"} />
                </span>
                <span className={`${postActionLabelClass} ${starred ? "text-yellow-500" : ""}`}>STAR</span>
              </button>
              <button
                type="button"
                onClick={onToggleWatch}
                className={`${postActionClass} ${watched ? "text-blue-500 hover:text-blue-600" : "hover:text-gray-600"}`}
              >
                <span className={`${postActionValueClass} ${watched ? "text-blue-500" : ""}`}>
                  <Eye size={16} />
                </span>
                <span className={`${postActionLabelClass} ${watched ? "text-blue-500" : ""}`}>WATCH</span>
              </button>
              <div className={postActionClass}>
                <span className={postActionValueClass} style={{ fontWeight: 500 }}>{views}</span>
                <span className={postActionLabelClass}>VIEWS</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm shrink-0">{post.avatar}</div>
            <div className="flex-1 min-w-0">
              <PeerName name={post.author} className="text-sm text-gray-800" showLabelsInline={false} />
              <p className="text-xs text-gray-400">{post.time}</p>
              <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] ${post.tagColor}`}>{post.tag}</span>
              <PeerLabels name={post.author} className="mt-1" />
            </div>
          </div>

          <div className="mb-8 grid grid-cols-[52px_minmax(0,1fr)] items-start gap-x-4">
            <div className="flex flex-col items-center pt-1">
              <button
                type="button"
                onClick={onToggleLike}
                className={liked ? "text-red-500 hover:text-red-600" : "text-gray-300 hover:text-red-400"}
              >
                <Heart size={20} fill={liked ? "currentColor" : "none"} />
              </button>
              <span className={`mt-1 text-xs ${liked ? "text-red-500" : "text-gray-400"}`}>{likeCount}</span>
            </div>
            <div className="text-sm text-gray-700" style={{ lineHeight: 1.7 }}>
              {post.body.map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-5">
            <button type="button" onClick={() => openComposer("post")} className="hover:text-blue-600">Comment</button>
            {canDeletePost && onDeletePost && (
              <button type="button" onClick={onDeletePost} className="inline-flex items-center gap-1 hover:text-rose-600">
                <Trash2 size={15} />
                Delete
              </button>
            )}
            <button type="button" className="hover:text-gray-700"><MoreHorizontal size={16} /></button>
          </div>

          {composerTarget === "post" && (
            <CommentComposer
              value={draft}
              onChange={setDraft}
              onSubmit={submitComment}
              onCancel={closeComposer}
              placeholder="Share your reply with the community..."
            />
          )}

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-gray-700" style={{ fontSize: 18 }}>
              {commentCount === 0 ? "Comments" : `${commentCount} ${commentCount === 1 ? "Comment" : "Comments"}`}
            </h2>
            <CommentThread
              comments={renderedComments}
              emptyState="No comments yet. Be the first to respond."
              activeReplyTargetId={composerTarget === "post" ? null : composerTarget}
              onReply={(comment) => openComposer(comment.id)}
              onDelete={(comment) => deleteComment(comment.id)}
              renderReplyComposer={(comment) => (
                <CommentComposer
                  value={draft}
                  onChange={setDraft}
                  onSubmit={submitComment}
                  onCancel={closeComposer}
                  contextLabel={`Replying to ${comment.author}`}
                  placeholder="Write a reply..."
                  compact
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
