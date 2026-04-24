import { useEffect, useState } from "react";
import { Star, Eye, Heart, MoreHorizontal } from "lucide-react";

import { courseThreads } from "../data/threads";
import { filterByDiscussionCategory } from "../data/threadFilters";
import { CommentComposer, CommentThread, ThreadComment } from "./Commenting";
import { PeerName, PeerLabels } from "../peer/PeerName";

interface ThreadContentProps {
  activeCourse: string;
  activeCategory: string | null;
  selectedThread: number;
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
}

const threadActionClass = "flex min-w-12 flex-col items-center gap-0.5 text-gray-400 transition-colors";
const threadActionValueClass = "flex h-4 items-center justify-center text-base leading-none";
const threadActionLabelClass = "text-xs leading-none";

export function ThreadContent({
  activeCourse,
  activeCategory,
  selectedThread,
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
}: ThreadContentProps) {
  const threads = filterByDiscussionCategory(courseThreads[activeCourse] || courseThreads.CS6750, activeCategory);
  const [composerTarget, setComposerTarget] = useState<"post" | string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setComposerTarget(null);
    setDraft("");
  }, [activeCourse, activeCategory, selectedThread]);

  const thread = threads.find((item) => item.id === selectedThread) || threads[0];

  if (!thread) {
    return (
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">
            {activeCategory ? `No ${activeCategory} threads have been posted in ${activeCourse} yet.` : `No threads have been posted in ${activeCourse} yet.`}
          </p>
        </div>
      </div>
    );
  }

  const body = thread.body && thread.body.length > 0
    ? thread.body
    : ["No further details have been posted for this thread yet."];

  const seededComments: ThreadComment[] = thread.answer ? [{
      id: `discussion-seed-${thread.id}`,
      author: thread.answer.author,
      avatar: thread.answer.avatar,
      time: thread.answer.time,
      text: thread.answer.text,
      parentId: null,
    }] : [];

  const renderedComments = [...seededComments, ...comments];
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
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-gray-900" style={{ fontSize: 24 }}>
            {thread.title} <span className="text-gray-400" style={{ fontSize: 16, fontWeight: 400 }}>#{thread.id}</span>
          </h1>
          <div className="mt-1 flex shrink-0 items-start gap-5">
            <button
              type="button"
              onClick={onToggleStar}
              className={`${threadActionClass} ${starred ? "text-yellow-500 hover:text-yellow-600" : "hover:text-gray-600"}`}
            >
              <span className={`${threadActionValueClass} ${starred ? "text-yellow-500" : ""}`}>
                <Star size={16} fill={starred ? "currentColor" : "none"} />
              </span>
              <span className={`${threadActionLabelClass} ${starred ? "text-yellow-500" : ""}`}>STAR</span>
            </button>
            <button
              type="button"
              onClick={onToggleWatch}
              className={`${threadActionClass} ${watched ? "text-blue-500 hover:text-blue-600" : "hover:text-gray-600"}`}
            >
              <span className={`${threadActionValueClass} ${watched ? "text-blue-500" : ""}`}><Eye size={16} /></span>
              <span className={`${threadActionLabelClass} ${watched ? "text-blue-500" : ""}`}>WATCH</span>
            </button>
            <div className={threadActionClass}>
              <span className={threadActionValueClass} style={{ fontWeight: 500 }}>{thread.views ?? 0}</span>
              <span className={threadActionLabelClass}>VIEWS</span>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-[52px_minmax(0,1fr)] items-start gap-x-4">
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm shrink-0">{thread.avatar}</div>
          </div>
          <div className="min-w-0">
            <PeerName name={thread.author} className="text-blue-600 text-sm" showLabelsInline={false} />
            <p className="text-xs text-gray-400">{thread.timeLong || thread.time} in <span className="text-blue-600">{thread.category}</span></p>
            <PeerLabels name={thread.author} className="mt-1" />
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
            {body.map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-5">
          <button type="button" onClick={() => openComposer("post")} className="hover:text-blue-600">Comment</button>
          <button type="button" className="hover:text-gray-700"><MoreHorizontal size={16} /></button>
        </div>

        {composerTarget === "post" && (
          <CommentComposer
            value={draft}
            onChange={setDraft}
            onSubmit={submitComment}
            onCancel={closeComposer}
            placeholder="Share your response with the class..."
          />
        )}

        <div className="border-t border-gray-200 pt-6 mt-6">
          <h2 className="text-gray-700" style={{ fontSize: 18 }}>
            {topLevelCount === 0 ? "Comments" : `${topLevelCount} ${topLevelCount === 1 ? "Comment" : "Comments"}`}
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
  );
}
