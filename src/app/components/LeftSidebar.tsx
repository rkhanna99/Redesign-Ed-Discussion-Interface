import { Plus, X, Coffee } from "lucide-react";

interface LeftSidebarProps {
  activeTab: "discussion" | "community";
  activeCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  activeCourse: string;
  onCourseChange: (course: string) => void;
  width?: number;
}

const courses = [
  { id: "CS6750", name: "CS6750", count: 900 },
  { id: "CS7646", name: "CS7646", count: 1247 },
  { id: "CS6200", name: "CS6200", count: 683 },
];

const academicCategories = [
  { name: "Class Discussion", color: "#4a2e8a" },
  { name: "Announcements", color: "#e67e22" },
  { name: "Lectures", color: "#3498db" },
  { name: "Homework", color: "#e74c3c" },
  { name: "Exam", color: "#e74c3c" },
  { name: "Quiz", color: "#95a5a6" },
  { name: "Individual Project", color: "#9b59b6" },
  { name: "Team Project", color: "#2ecc71" },
  { name: "Participant Recruitment", color: "#9b59b6" },
  { name: "Articles", color: "#e74c3c" },
  { name: "Feedback Box", color: "#9b59b6" },
  { name: "Resources", color: "#e74c3c" },
  { name: "Peer Review", color: "#e74c3c" },
];

const communityCategories = [
  { name: "Introductions", color: "#10b981" },
  { name: "Career & Jobs", color: "#f59e0b" },
  { name: "Meetups", color: "#ec4899" },
  { name: "OMSCS Life", color: "#8b5cf6" },
  { name: "Hobbies & Interests", color: "#06b6d4" },
  { name: "Study Groups", color: "#3b82f6" },
];

export function LeftSidebar({ activeTab, activeCategory, onCategoryChange, activeCourse, onCourseChange, width }: LeftSidebarProps) {
  const categories = activeTab === "discussion" ? academicCategories : communityCategories;

  return (
    <div className="border-r border-gray-200 flex flex-col bg-[#fafafa] shrink-0 overflow-y-auto" style={{ width: width ?? 200 }}>
      <div className="p-3">
        <button className="w-full bg-[#4a2e8a] text-white rounded px-4 py-2 text-sm flex items-center justify-center gap-2 hover:bg-[#3d2574] transition-colors">
          <Plus size={15} />
          New Thread
        </button>
      </div>

      <div className="px-3 pb-2">
        <p className="text-[10px] text-gray-400 tracking-wider mb-1.5" style={{ fontWeight: 600 }}>COURSES</p>
        {courses.map((c) => (
          <div
            key={c.id}
            onClick={() => onCourseChange(c.id)}
            className={`flex items-center justify-between py-1 px-1 text-sm rounded cursor-pointer transition-colors ${
              activeCourse === c.id ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="truncate" style={{ fontWeight: activeCourse === c.id ? 500 : 400 }}>{c.name}</span>
            <span className="text-[11px] text-blue-600">{c.count}</span>
          </div>
        ))}
      </div>

      <div className="px-3 pb-2">
        <p className="text-[10px] text-gray-400 tracking-wider mb-1.5" style={{ fontWeight: 600 }}>
          CATEGORIES
        </p>
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => onCategoryChange(cat.name)}
            className={`flex items-center gap-2 py-1 px-1 text-sm rounded cursor-pointer ${
              activeCategory === cat.name ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: cat.color }} />
            <span className="truncate">{cat.name}</span>
            {activeCategory === cat.name && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onCategoryChange(null);
                }}
                className="ml-auto rounded p-0.5 text-gray-400 hover:bg-blue-100 hover:text-gray-600"
                title={`Clear ${cat.name} filter`}
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {activeTab === "community" && (
        <div className="px-3 pb-2 mt-1">
          <p className="text-[10px] text-gray-400 tracking-wider mb-1.5" style={{ fontWeight: 600 }}>SPACES</p>
          <div
            onClick={() => onCategoryChange("Social Room")}
            className={`flex items-center gap-2 py-1.5 px-1 text-sm rounded cursor-pointer ${
              activeCategory === "Social Room" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Coffee size={14} className="text-pink-500" />
            <span>Social Room</span>
            {activeCategory === "Social Room" ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onCategoryChange(null);
                }}
                className="ml-auto rounded p-0.5 text-gray-400 hover:bg-blue-100 hover:text-gray-600"
                title="Clear Social Room"
              >
                <X size={12} />
              </button>
            ) : (
              <span className="ml-auto text-[10px] bg-pink-100 text-pink-700 px-1.5 rounded-full">8 in</span>
            )}
          </div>
        </div>
      )}

      <div className="mt-auto p-3 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green-400" />
        184 others online
      </div>
    </div>
  );
}
