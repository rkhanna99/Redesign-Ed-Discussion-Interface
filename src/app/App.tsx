import { useState } from "react";

import { Header } from "./components/Header";
import { LeftSidebar } from "./components/LeftSidebar";
import { ThreadList } from "./components/ThreadList";
import { ThreadContent } from "./components/ThreadContent";
import { CommunityContent } from "./components/CommunityFeed";
import { SocialRoom } from "./components/SocialRoom";
import { VideoCall } from "./components/VideoCall";
import { ResizeHandle } from "./components/ResizeHandle";
import { Dashboard } from "./components/Dashboard";
import { PeerVisibilityProvider } from "./peer/PeerVisibilityContext";
import { PeerVisibilitySettings } from "./peer/PeerVisibilitySettings";
import { communityPosts } from "./data/communityPosts";
import { courseThreads } from "./data/threads";
import { filterByCommunityCategory, filterByDiscussionCategory } from "./data/threadFilters";

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const defaultThreads: Record<string, number> = {
  CS6750: 2697,
  CS7646: 4003,
  CS6200: 5002,
};

const defaultCommunityThreads: Record<string, number> = {
  CS6750: 3001,
  CS7646: 3101,
  CS6200: 3201,
};

export default function App() {
  const [view, setView] = useState<"course" | "dashboard">("course");
  const [activeTab, setActiveTab] = useState<"discussion" | "community">("discussion");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState("CS6750");
  const [selectedThread, setSelectedThread] = useState(2697);
  const [inCall, setInCall] = useState<null | "social">(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(200);
  const [middleWidth, setMiddleWidth] = useState(380);

  const resizeLeft = (dx: number) => setLeftWidth((w) => clamp(w + dx, 160, 400));
  const resizeMiddle = (dx: number) => setMiddleWidth((w) => clamp(w + dx, 260, 640));

  const handleTabChange = (tab: "discussion" | "community") => {
    setView("course");
    setActiveTab(tab);
    if (tab === "discussion") {
      setActiveCategory(null);
      setSelectedThread(defaultThreads[activeCourse] || 2697);
    } else {
      setActiveCategory(null);
      setSelectedThread(defaultCommunityThreads[activeCourse] || 3001);
    }
  };

  const handleCourseChange = (course: string) => {
    setView("course");
    setActiveCourse(course);
    setSelectedThread(defaultThreads[course] || 2697);
    setActiveCategory(null);
    setActiveTab("discussion");
  };

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
    if (!cat) {
      setSelectedThread(activeTab === "discussion" ? (defaultThreads[activeCourse] || 2697) : (defaultCommunityThreads[activeCourse] || 3001));
      return;
    }

    if (activeTab === "discussion") {
      const threads = filterByDiscussionCategory(courseThreads[activeCourse] || courseThreads.CS6750, cat);
      if (threads[0]) setSelectedThread(threads[0].id);
    } else if (cat !== "Social Room") {
      const posts = filterByCommunityCategory(communityPosts[activeCourse] || communityPosts.CS6750, cat);
      if (posts[0]) setSelectedThread(posts[0].id);
    }
  };

  const handleHome = () => {
    setInCall(null);
    setView("dashboard");
  };

  const handleDashboardCourseOpen = (course: string) => {
    setView("course");
    handleCourseChange(course);
  };

  const isSocialRoom = activeTab === "community" && activeCategory === "Social Room";
  const isCommunityFeed = activeTab === "community" && activeCategory !== "Social Room";

  if (inCall) {
    const roomName = `${activeCourse} Social Room`;
    return (
      <PeerVisibilityProvider>
        <div className="h-screen flex flex-col bg-white overflow-hidden">
          <Header view={view} activeTab={activeTab} onTabChange={handleTabChange} activeCourse={activeCourse} onHome={handleHome} onOpenSettings={() => setSettingsOpen(true)} />
          <div className="flex flex-1 overflow-hidden">
            <VideoCall roomName={roomName} roomType={inCall} onLeave={() => setInCall(null)} />
          </div>
          <PeerVisibilitySettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </div>
      </PeerVisibilityProvider>
    );
  }

  return (
    <PeerVisibilityProvider>
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        <Header view={view} activeTab={activeTab} onTabChange={handleTabChange} activeCourse={activeCourse} onHome={handleHome} onOpenSettings={() => setSettingsOpen(true)} />
        {view === "dashboard" ? (
          <Dashboard onOpenCourse={handleDashboardCourseOpen} />
        ) : (
          <div className="flex flex-1 overflow-hidden">
        <LeftSidebar
          activeTab={activeTab}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          activeCourse={activeCourse}
          onCourseChange={handleCourseChange}
          width={leftWidth}
        />
        <ResizeHandle onResize={resizeLeft} />
        {!isSocialRoom && !isCommunityFeed && (
          <>
            <ThreadList activeTab={activeTab} activeCategory={activeCategory} selectedThread={selectedThread} onSelectThread={setSelectedThread} activeCourse={activeCourse} width={middleWidth} />
            <ResizeHandle onResize={resizeMiddle} />
            <ThreadContent activeCourse={activeCourse} activeCategory={activeCategory} selectedThread={selectedThread} />
          </>
        )}
        {isSocialRoom && <SocialRoom onJoin={() => setInCall("social")} />}
        {isCommunityFeed && (
          <>
            <ThreadList activeTab="community" activeCategory={activeCategory} selectedThread={selectedThread} onSelectThread={setSelectedThread} activeCourse={activeCourse} width={middleWidth} />
            <ResizeHandle onResize={resizeMiddle} />
            <CommunityContent selectedThread={selectedThread} onSelectThread={setSelectedThread} activeCourse={activeCourse} activeCategory={activeCategory} />
          </>
        )}
          </div>
        )}
        <PeerVisibilitySettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </PeerVisibilityProvider>
  );
}
