import { useEffect, useState } from "react";
import { HelpCircle, MessageSquare, Sparkles, X } from "lucide-react";

import { getCategoryOptions } from "../data/forumCategories";

export interface NewThreadDraft {
  title: string;
  body: string[];
  category: string;
  anonymous: boolean;
  privateToStaff: boolean;
}

interface NewThreadComposerProps {
  activeTab: "discussion" | "community";
  activeCourse: string;
  initialCategory: string | null;
  onCancel: () => void;
  onSubmit: (draft: NewThreadDraft) => void;
}

const inputClassName = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors focus:border-[#4a2e8a] focus:ring-2 focus:ring-[#4a2e8a]/10";

export function NewThreadComposer({
  activeTab,
  activeCourse,
  initialCategory,
  onCancel,
  onSubmit,
}: NewThreadComposerProps) {
  const categoryOptions = getCategoryOptions(activeTab);
  const safeInitialCategory = categoryOptions.some((option) => option.value === initialCategory)
    ? initialCategory
    : categoryOptions[0]?.value || "";
  const [entryMode, setEntryMode] = useState<"question" | "post">(activeTab === "discussion" ? "question" : "post");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(safeInitialCategory);
  const [anonymous, setAnonymous] = useState(false);
  const [privateToStaff, setPrivateToStaff] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    setEntryMode(activeTab === "discussion" ? "question" : "post");
    setTitle("");
    setBody("");
    setCategory(safeInitialCategory);
    setAnonymous(false);
    setPrivateToStaff(false);
    setShowValidation(false);
  }, [activeTab, activeCourse, safeInitialCategory]);

  const parsedBody = body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const canSubmit = title.trim().length > 0 && parsedBody.length > 0 && category.length > 0;

  const submit = () => {
    if (!canSubmit) {
      setShowValidation(true);
      return;
    }

    onSubmit({
      title: title.trim(),
      body: parsedBody,
      category,
      anonymous,
      privateToStaff,
    });
  };

  const screenTitle = entryMode === "question" ? "New Question" : "New Post";
  const helperCopy = activeTab === "discussion"
    ? "Ask a clear question or share context with the class. New threads appear at the top as the most recent activity."
    : "Start a community conversation for this course. Meetups, intros, and lightweight class-life posts all belong here.";

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#fcfbff]">
      <div className="flex items-center justify-between border-b border-[#e6def5] bg-white px-6 py-4">
        <button type="button" onClick={onCancel} className="text-sm text-[#4a2e8a] transition-colors hover:text-[#3d2574]">
          Cancel
        </button>
        <div className="text-center">
          <p className="text-lg text-gray-900" style={{ fontWeight: 600 }}>{screenTitle}</p>
          <p className="text-xs text-gray-400">{activeCourse} {activeTab === "discussion" ? "Class Discussion" : "Community"}</p>
        </div>
        <button
          type="button"
          onClick={submit}
          className="rounded-lg bg-[#4a2e8a] px-4 py-2 text-sm text-white transition-colors hover:bg-[#3d2574]"
        >
          Post
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="mx-auto grid w-full max-w-6xl gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="rounded-2xl border border-[#e8def7] bg-white shadow-sm">
            <div className="border-b border-[#f0e9fb] px-6 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setEntryMode("question")}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    entryMode === "question"
                      ? "border-[#8fb3ff] bg-[#dce9ff] text-[#245cd6]"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <HelpCircle size={16} />
                  Question
                </button>
                <button
                  type="button"
                  onClick={() => setEntryMode("post")}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    entryMode === "post"
                      ? "border-[#d8c9f7] bg-[#f4effd] text-[#4a2e8a]"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <MessageSquare size={16} />
                  Post
                </button>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
                  Title
                </span>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={entryMode === "question" ? "Summarize your question" : "Give your post a clear title"}
                  className={inputClassName}
                />
              </label>

              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
                    Category
                  </span>
                  <span className="text-xs text-gray-400">Use the categories for this page</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((option) => {
                    const selected = category === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setCategory(option.value)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                          selected
                            ? `${option.chipClassName} ring-2 ring-offset-1 ring-[#4a2e8a]/20`
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {option.value}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.12em] text-gray-400" style={{ fontWeight: 700 }}>
                  Body
                </span>
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder={activeTab === "discussion"
                    ? "Add enough context so classmates can understand what you are asking or sharing."
                    : "Write the post you want other students in this course community to see."}
                  className={`${inputClassName} min-h-[18rem] resize-y`}
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-[#fcfbff] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={privateToStaff}
                    onChange={(event) => setPrivateToStaff(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#4a2e8a] focus:ring-[#4a2e8a]"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm text-gray-800" style={{ fontWeight: 500 }}>Private</span>
                    <span className="block text-xs text-gray-500">Visible only to you and course staff. Displayed here for now; visibility is not enforced yet.</span>
                  </span>
                </label>
                <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-[#fcfbff] px-4 py-3">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(event) => setAnonymous(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-[#4a2e8a] focus:ring-[#4a2e8a]"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm text-gray-800" style={{ fontWeight: 500 }}>Anonymous</span>
                    <span className="block text-xs text-gray-500">Hide your name from other students on the posted thread.</span>
                  </span>
                </label>
              </div>

              {showValidation && !canSubmit && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  Add a title, choose a category, and write at least one paragraph before posting.
                </div>
              )}

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={submit}
                  className="rounded-lg bg-[#4a2e8a] px-4 py-2 text-sm text-white transition-colors hover:bg-[#3d2574]"
                >
                  Post to {category || (activeTab === "discussion" ? "Class Discussion" : "Community")}
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#e8def7] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-[#4a2e8a]">
                <Sparkles size={16} />
                <p className="text-sm" style={{ fontWeight: 600 }}>Posting Tips</p>
              </div>
              <p className="text-sm text-gray-600" style={{ lineHeight: 1.65 }}>
                {helperCopy}
              </p>
            </div>

            <div className="rounded-2xl border border-[#e8def7] bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-gray-900" style={{ fontWeight: 600 }}>What Happens Next</p>
                <X size={14} className="text-gray-300" />
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Your post will appear at the top of the thread list as the newest activity.</p>
                <p>The expanded post view will use the same layout as the rest of the course.</p>
                <p>You can delete posts you create from the post view later.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
