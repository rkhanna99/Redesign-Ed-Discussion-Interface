import { Star, Eye, Heart, MoreHorizontal } from "lucide-react";
import { PeerName, PeerLabels } from "../peer/PeerName";
import { courseThreads } from "../data/threads";
import { filterByDiscussionCategory } from "../data/threadFilters";

interface ThreadContentProps {
  activeCourse: string;
  activeCategory: string | null;
  selectedThread: number;
}

const threadActionClass = "flex min-w-12 flex-col items-center gap-0.5 text-gray-400 transition-colors";
const threadActionValueClass = "flex h-4 items-center justify-center text-base leading-none text-gray-400";
const threadActionLabelClass = "text-xs leading-none text-gray-400";

export function ThreadContent({ activeCourse, activeCategory, selectedThread }: ThreadContentProps) {
  const threads = filterByDiscussionCategory(courseThreads[activeCourse] || courseThreads.CS6750, activeCategory);
  if (threads.length === 0) {
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

  const thread = threads.find((t) => t.id === selectedThread) || threads[0];
  const body = thread.body && thread.body.length > 0
    ? thread.body
    : ["No further details have been posted for this thread yet."];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl">
        <div className="flex items-start justify-between mb-6">
          <h1 className="text-gray-900" style={{ fontSize: 24 }}>
            {thread.title} <span className="text-gray-400" style={{ fontSize: 16, fontWeight: 400 }}>#{thread.id}</span>
          </h1>
          <div className="mt-1 flex shrink-0 items-start gap-5">
            <button className={`${threadActionClass} hover:text-gray-600`}>
              <span className={threadActionValueClass}><Star size={16} /></span>
              <span className={threadActionLabelClass}>STAR</span>
            </button>
            <button className={`${threadActionClass} hover:text-gray-600`}>
              <span className={threadActionValueClass}><Eye size={16} /></span>
              <span className={threadActionLabelClass}>WATCH</span>
            </button>
            <div className={threadActionClass}>
              <span className={threadActionValueClass} style={{ fontWeight: 500 }}>{thread.views ?? 0}</span>
              <span className={threadActionLabelClass}>VIEWS</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm shrink-0">{thread.avatar}</div>
          <div className="min-w-0">
            <PeerName name={thread.author} className="text-blue-600 text-sm" showLabelsInline={false} />
            <p className="text-xs text-gray-400">{thread.timeLong || thread.time} in <span className="text-blue-600">{thread.category}</span></p>
            <PeerLabels name={thread.author} className="mt-1" />
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button className="text-gray-300 hover:text-red-400 mt-1"><Heart size={20} /></button>
          <div className="text-sm text-gray-700" style={{ lineHeight: 1.7 }}>
            {body.map((p, i) => (
              <p key={i} className="mb-4">{p}</p>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500 mb-8">
          <button className="hover:text-blue-600">Comment</button>
          <button className="hover:text-gray-700"><MoreHorizontal size={16} /></button>
        </div>

        {thread.answer && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-gray-700" style={{ fontSize: 18 }}>1 Answer</h2>
            <div className="mt-4 bg-gray-50 rounded-lg p-4 text-sm text-gray-600" style={{ lineHeight: 1.6 }}>
              <div className="flex items-start gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs shrink-0">{thread.answer.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <PeerName name={thread.answer.author} className="text-blue-600 text-sm" showLabelsInline={false} />
                    <span className="text-gray-400 text-xs">{thread.answer.time}</span>
                  </div>
                  <PeerLabels name={thread.answer.author} className="mt-0.5" />
                </div>
              </div>
              <p>{thread.answer.text}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
