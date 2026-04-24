import { ReactNode } from "react";
import { Bold, Code2, Image as ImageIcon, Italic, Link2, List, MoreHorizontal, Paperclip, Underline } from "lucide-react";

import { CURRENT_USER } from "../data/threads";
import { PeerLabels, PeerName } from "../peer/PeerName";

export interface ThreadComment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  parentId: string | null;
}

interface CommentComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  contextLabel?: string;
  placeholder?: string;
  compact?: boolean;
}

interface CommentThreadProps {
  comments: ThreadComment[];
  emptyState: string;
  activeReplyTargetId: string | null;
  onReply: (comment: ThreadComment) => void;
  onDelete?: (comment: ThreadComment) => void;
  renderReplyComposer: (comment: ThreadComment) => ReactNode;
}

const currentUserAvatar = CURRENT_USER
  .split(/\s+/)
  .map((part) => part[0])
  .filter(Boolean)
  .slice(0, 2)
  .join("")
  .toUpperCase();

const composerTools = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  { icon: Link2, label: "Link" },
  { icon: List, label: "List" },
  { icon: ImageIcon, label: "Insert image" },
  { icon: Paperclip, label: "Attach" },
  { icon: Code2, label: "Code" },
];

const avatarTone = (author: string) => {
  if (author === CURRENT_USER) return "bg-amber-300 text-white";
  if (/^ta\b|teaching assistant/i.test(author)) return "bg-blue-100 text-blue-600";
  return "bg-gray-200 text-gray-600";
};

export function CommentComposer({
  value,
  onChange,
  onSubmit,
  onCancel,
  contextLabel,
  placeholder = "Write a comment...",
  compact = false,
}: CommentComposerProps) {
  const canSubmit = value.trim().length > 0;

  return (
    <div className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-300 text-base text-white">
        {currentUserAvatar}
      </div>
      <div className="min-w-0 flex-1">
        {contextLabel && <p className="mb-2 text-xs text-gray-400">{contextLabel}</p>}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-2 text-gray-500">
            <span className="mr-2 text-sm text-gray-600">Paragraph</span>
            {composerTools.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                className="rounded p-1 transition-colors hover:bg-white hover:text-gray-700"
                aria-label={label}
              >
                <Icon size={15} />
              </button>
            ))}
            <button
              type="button"
              className="rounded p-1 transition-colors hover:bg-white hover:text-gray-700"
              aria-label="More"
            >
              <MoreHorizontal size={15} />
            </button>
          </div>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className={`w-full resize-none px-4 py-3 text-sm text-gray-700 outline-none placeholder:text-gray-300 ${compact ? "h-28" : "h-40"}`}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300" disabled />
            <span>Anonymous</span>
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-200"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CommentThread({
  comments,
  emptyState,
  activeReplyTargetId,
  onReply,
  onDelete,
  renderReplyComposer,
}: CommentThreadProps) {
  if (comments.length === 0) {
    return <p className="pt-4 text-sm text-gray-400">{emptyState}</p>;
  }

  const childrenByParent = new Map<string, ThreadComment[]>();
  const topLevelComments: ThreadComment[] = [];

  for (const comment of comments) {
    if (!comment.parentId) {
      topLevelComments.push(comment);
      continue;
    }

    const group = childrenByParent.get(comment.parentId) || [];
    group.push(comment);
    childrenByParent.set(comment.parentId, group);
  }

  const renderComment = (comment: ThreadComment, depth = 0): ReactNode => {
    const children = childrenByParent.get(comment.id) || [];

    return (
      <div key={comment.id} className={depth > 0 ? "ml-6 border-l border-gray-100 pl-4" : ""}>
        <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          <div className="mb-2 flex items-start gap-2">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs ${avatarTone(comment.author)}`}>
              {comment.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <PeerName name={comment.author} className="text-sm text-blue-600" showLabelsInline={false} />
                <span className="text-xs text-gray-400">{comment.time}</span>
              </div>
              <PeerLabels name={comment.author} className="mt-0.5" />
            </div>
          </div>
          <p className="whitespace-pre-wrap text-gray-700">{comment.text}</p>
          <div className="mt-3 flex items-center gap-4">
            <button
              type="button"
              onClick={() => onReply(comment)}
              className="text-xs text-gray-500 transition-colors hover:text-blue-600"
            >
              Comment
            </button>
            {comment.author === CURRENT_USER && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(comment)}
                className="text-xs text-gray-400 transition-colors hover:text-red-500"
              >
                Delete
              </button>
            )}
          </div>
        </div>
        {activeReplyTargetId === comment.id && <div className="mt-3">{renderReplyComposer(comment)}</div>}
        {children.length > 0 && <div className="mt-3 space-y-3">{children.map((child) => renderComment(child, depth + 1))}</div>}
      </div>
    );
  };

  return <div className="space-y-3 pt-4">{topLevelComments.map((comment) => renderComment(comment))}</div>;
}
