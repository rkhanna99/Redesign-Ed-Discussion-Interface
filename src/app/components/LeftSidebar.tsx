import { useState } from "react";
import { Minus, Plus, X, Coffee } from "lucide-react";

import { communityCategoryOptions, discussionCategoryOptions } from "../data/forumCategories";

interface LeftSidebarProps {
  activeTab: "discussion" | "community";
  activeCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  activeCourse: string;
  onCourseChange: (course: string) => void;
  onNewThread: () => void;
  width?: number;
}

const courses = [
  { id: "CS6750", name: "CS6750", count: 900, archived: false },
  { id: "CS7646", name: "CS7646", count: 1247, archived: true },
  { id: "CS6200", name: "CS6200", count: 683, archived: true },
];

export function LeftSidebar({ activeTab, activeCategory, onCategoryChange, activeCourse, onCourseChange, onNewThread, width }: LeftSidebarProps) {
  const categories = activeTab === "discussion" ? discussionCategoryOptions : communityCategoryOptions;
  const currentCourses = courses.filter((course) => !course.archived);
  const archivedCourses = courses.filter((course) => course.archived);
  const [archivedOpen, setArchivedOpen] = useState(true);

  const renderCourse = (course: typeof courses[number]) => (
    <div
      key={course.id}
      onClick={() => onCourseChange(course.id)}
      className={`flex items-center justify-between py-1 px-1 text-sm rounded cursor-pointer transition-colors ${
        activeCourse === course.id ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className="min-w-0">
        <span className="truncate" style={{ fontWeight: activeCourse === course.id ? 500 : 400 }}>{course.name}</span>
        {course.archived && (
          <span className="ml-2 rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-gray-500">
            Archived
          </span>
        )}
      </div>
      <span className="text-[11px] text-blue-600">{course.count}</span>
    </div>
  );

  return (
    <div className="border-r border-gray-200 flex flex-col bg-[#fafafa] shrink-0 overflow-y-auto" style={{ width: width ?? 200 }}>
      <div className="p-3">
        <button
          type="button"
          onClick={onNewThread}
          className="w-full bg-[#4a2e8a] text-white rounded px-4 py-2 text-sm flex items-center justify-center gap-2 hover:bg-[#3d2574] transition-colors"
        >
          <Plus size={15} />
          New Thread
        </button>
      </div>

      <div className="px-3 pb-2">
        <div className="space-y-1">
          <p className="text-[10px] text-gray-400 tracking-wider mb-1.5" style={{ fontWeight: 600 }}>
            CURRENT COURSES
          </p>
          {currentCourses.map(renderCourse)}
        </div>
        {archivedCourses.length > 0 && (
          <div className="mt-3 space-y-1">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 tracking-wider" style={{ fontWeight: 600 }}>
                ARCHIVED COURSES
              </p>
              <button
                type="button"
                onClick={() => setArchivedOpen((open) => !open)}
                className="rounded p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label={archivedOpen ? "Collapse archived courses" : "Expand archived courses"}
                title={archivedOpen ? "Collapse archived courses" : "Expand archived courses"}
              >
                {archivedOpen ? <Minus size={12} /> : <Plus size={12} />}
              </button>
            </div>
            {archivedOpen && archivedCourses.map(renderCourse)}
          </div>
        )}
      </div>

      <div className="px-3 pb-2">
        <p className="text-[10px] text-gray-400 tracking-wider mb-1.5" style={{ fontWeight: 600 }}>
          CATEGORIES
        </p>
        {categories.map((cat) => (
          <div
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`flex items-center gap-2 py-1 px-1 text-sm rounded cursor-pointer ${
              activeCategory === cat.value ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: cat.color }} />
            <span className="truncate">{cat.value}</span>
            {activeCategory === cat.value && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onCategoryChange(null);
                }}
                className="ml-auto rounded p-0.5 text-gray-400 hover:bg-blue-100 hover:text-gray-600"
                title={`Clear ${cat.value} filter`}
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
