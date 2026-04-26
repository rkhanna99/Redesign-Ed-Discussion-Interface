export interface ForumCategoryOption {
  value: string;
  color: string;
  chipClassName: string;
  tagClassName: string;
}

export const discussionCategoryOptions: ForumCategoryOption[] = [
  { value: "Class Discussion", color: "#4a2e8a", chipClassName: "border-[#4a2e8a]/20 bg-[#f4effd] text-[#4a2e8a]", tagClassName: "bg-[#f4effd] text-[#4a2e8a]" },
  { value: "Announcements", color: "#e67e22", chipClassName: "border-orange-200 bg-orange-50 text-orange-700", tagClassName: "bg-orange-50 text-orange-700" },
  { value: "Lectures", color: "#3498db", chipClassName: "border-sky-200 bg-sky-50 text-sky-700", tagClassName: "bg-sky-50 text-sky-700" },
  { value: "Homework", color: "#e74c3c", chipClassName: "border-rose-200 bg-rose-50 text-rose-700", tagClassName: "bg-rose-50 text-rose-700" },
  { value: "Exam", color: "#dc2626", chipClassName: "border-red-200 bg-red-50 text-red-700", tagClassName: "bg-red-50 text-red-700" },
  { value: "Quiz", color: "#95a5a6", chipClassName: "border-slate-200 bg-slate-50 text-slate-700", tagClassName: "bg-slate-50 text-slate-700" },
  { value: "Individual Project", color: "#9b59b6", chipClassName: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700", tagClassName: "bg-fuchsia-50 text-fuchsia-700" },
  { value: "Team Project", color: "#2ecc71", chipClassName: "border-emerald-200 bg-emerald-50 text-emerald-700", tagClassName: "bg-emerald-50 text-emerald-700" },
  { value: "Participant Recruitment", color: "#7c3aed", chipClassName: "border-violet-200 bg-violet-50 text-violet-700", tagClassName: "bg-violet-50 text-violet-700" },
  { value: "Articles", color: "#f97316", chipClassName: "border-orange-200 bg-orange-50 text-orange-700", tagClassName: "bg-orange-50 text-orange-700" },
  { value: "Feedback Box", color: "#8b5cf6", chipClassName: "border-purple-200 bg-purple-50 text-purple-700", tagClassName: "bg-purple-50 text-purple-700" },
  { value: "Resources", color: "#14b8a6", chipClassName: "border-teal-200 bg-teal-50 text-teal-700", tagClassName: "bg-teal-50 text-teal-700" },
  { value: "Peer Review", color: "#2563eb", chipClassName: "border-blue-200 bg-blue-50 text-blue-700", tagClassName: "bg-blue-50 text-blue-700" },
];

export const communityCategoryOptions: ForumCategoryOption[] = [
  { value: "Introductions", color: "#10b981", chipClassName: "border-emerald-200 bg-emerald-50 text-emerald-700", tagClassName: "bg-emerald-100 text-emerald-700" },
  { value: "Career & Jobs", color: "#f59e0b", chipClassName: "border-amber-200 bg-amber-50 text-amber-700", tagClassName: "bg-amber-100 text-amber-700" },
  { value: "Meetups", color: "#ec4899", chipClassName: "border-pink-200 bg-pink-50 text-pink-700", tagClassName: "bg-pink-100 text-pink-700" },
  { value: "OMSCS Life", color: "#8b5cf6", chipClassName: "border-purple-200 bg-purple-50 text-purple-700", tagClassName: "bg-purple-100 text-purple-700" },
  { value: "Hobbies & Interests", color: "#06b6d4", chipClassName: "border-cyan-200 bg-cyan-50 text-cyan-700", tagClassName: "bg-cyan-100 text-cyan-700" },
  { value: "Study Groups", color: "#3b82f6", chipClassName: "border-blue-200 bg-blue-50 text-blue-700", tagClassName: "bg-blue-100 text-blue-700" },
];

export function getCategoryOptions(tab: "discussion" | "community") {
  return tab === "discussion" ? discussionCategoryOptions : communityCategoryOptions;
}

export function getCategoryOption(
  tab: "discussion" | "community",
  value: string,
) {
  const normalizedValue = tab === "community" && value === "Class Life" ? "OMSCS Life" : value;
  return getCategoryOptions(tab).find((option) => option.value === normalizedValue);
}
