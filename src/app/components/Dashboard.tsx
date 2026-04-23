import { HelpCircle, Keyboard, MessageCircle } from "lucide-react";

interface DashboardProps {
  onOpenCourse: (course: string) => void;
}

interface CourseCard {
  title: string;
  subtitle: string;
  accent: string;
  unread?: string;
  courseId?: string;
}

const currentCourses: CourseCard[] = [
  {
    title: "CS6750",
    subtitle: "CS6750: Human-Computer Interaction (SP26)",
    accent: "#10d98a",
    unread: "99+",
    courseId: "CS6750",
  },
  {
    title: "HCI Test Board Please Ignore",
    subtitle: "HCI Test Board",
    accent: "#f5c400",
    unread: "99+",
  },
  {
    title: "Spring 2026 HCI Survey Recruitment",
    subtitle: "Spring 2026 HCI Survey Recruitment",
    accent: "#22c55e",
    unread: "99+",
  },
];

const archivedCourses: Array<{ term: string; courses: CourseCard[] }> = [
  {
    term: "2025 Fall",
    courses: [
      {
        title: "CS 7641 O01",
        subtitle: "CS7641: Machine Learning",
        accent: "#ef4444",
      },
    ],
  },
  {
    term: "2025 Summer",
    courses: [
      {
        title: "CS7646 (SU25)",
        subtitle: "CS7646: Machine Learning for Trading (SU25)",
        accent: "#10d98a",
        unread: "99+",
        courseId: "CS7646",
      },
    ],
  },
  {
    term: "2025 Spring",
    courses: [
      {
        title: "Spring 2025 New Students",
        subtitle: "Spring 2025 Student Onboarding Course & Forum",
        accent: "#0ea5e9",
      },
      {
        title: "CS6200",
        subtitle: "CS6200: Graduate Introduction to Operating Systems",
        accent: "#10d98a",
        unread: "99+",
        courseId: "CS6200",
      },
    ],
  },
];

const currentHeadingClass = "text-[26px] font-medium leading-[1.5] text-gray-900";
const archivedHeadingClass = "text-[21px] font-medium leading-[1.5] text-gray-900";

function CourseTile({ course, onOpenCourse }: { course: CourseCard; onOpenCourse: (course: string) => void }) {
  const interactive = Boolean(course.courseId);

  return (
    <button
      type="button"
      disabled={!interactive}
      onClick={() => course.courseId && onOpenCourse(course.courseId)}
      className={`relative h-[7.25rem] w-full rounded-md border border-gray-200 bg-[#fbfbfc] py-3.5 pl-4 pr-12 text-left shadow-sm transition-all ${
        interactive ? "hover:-translate-y-0.5 hover:border-[#4a2e8a]/30 hover:shadow-md" : "cursor-default"
      }`}
    >
      <span className="absolute inset-y-0 left-0 w-1.5 rounded-l-md" style={{ backgroundColor: course.accent }} />
      {course.unread && (
        <span className="absolute right-3 top-3 rounded bg-blue-600 px-1.5 py-0.5 text-[9px] text-white" style={{ fontWeight: 800, lineHeight: 1 }}>
          {course.unread}
        </span>
      )}
      <span className="flex h-full flex-col">
        <span className="block min-h-[2.5rem] overflow-hidden text-base text-gray-900" style={{ fontWeight: 500, lineHeight: 1.25 }}>
          {course.title}
        </span>
        <span className="mt-1 block min-h-[2.25rem] overflow-hidden text-xs text-gray-700" style={{ lineHeight: 1.45 }}>
          {course.subtitle}
        </span>
        <span
          className={`mt-auto inline-flex h-4 items-center gap-1 text-[11px] text-[#4a2e8a] transition-opacity ${
            interactive ? "opacity-0 group-hover:opacity-100" : "invisible"
          }`}
        >
          <MessageCircle size={11} />
          Open discussion
        </span>
      </span>
    </button>
  );
}

export function Dashboard({ onOpenCourse }: DashboardProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-white">
      <div className="mx-auto w-full max-w-[760px] px-6 py-14">
        <div className="mb-8 flex items-center justify-between">
          <div className={currentHeadingClass} role="heading" aria-level={1}>
            Current Courses
          </div>
          <div className="flex items-center gap-3">
            <Keyboard size={19} className="text-gray-500" />
            <button className="rounded border border-blue-600 px-3 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-50">
              Help Docs
            </button>
          </div>
        </div>

        <p className="mb-4 text-xs uppercase tracking-wide text-gray-800">
          <span style={{ fontWeight: 800 }}>2026</span>{" "}
          <span className="text-[10px] text-gray-500">Spring</span>
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {currentCourses.map((course) => (
            <div key={course.title} className="group">
              <CourseTile course={course} onOpenCourse={onOpenCourse} />
            </div>
          ))}
        </div>

        <section className="mt-12">
          <div className="mb-7 flex items-center gap-2">
            <div className={archivedHeadingClass} role="heading" aria-level={2}>
              Archived Courses
            </div>
            <span className="group relative inline-flex h-5 w-5 items-center justify-center self-center rounded-full border border-gray-300 bg-gray-100 text-gray-600">
              <HelpCircle size={13} />
              <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-72 -translate-x-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs normal-case tracking-normal text-gray-600 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                Inactive courses and courses from previous sessions will appear in this section.
              </span>
            </span>
          </div>

          <div className="space-y-8">
            {archivedCourses.map((group) => (
              <div key={group.term}>
                <p className="mb-4 text-xs uppercase tracking-wide text-gray-800">
                  <span style={{ fontWeight: 800 }}>{group.term.split(" ")[0]}</span>{" "}
                  <span className="text-[10px] text-gray-500">{group.term.split(" ")[1]}</span>
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {group.courses.map((course) => (
                    <div key={course.title} className="group">
                      <CourseTile course={course} onOpenCourse={onOpenCourse} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
