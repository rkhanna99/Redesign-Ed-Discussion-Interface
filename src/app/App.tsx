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
import { courseThreads, CURRENT_USER } from "./data/threads";
import { filterByCommunityCategory, filterByDiscussionCategory } from "./data/threadFilters";
import { ThreadComment } from "./components/Commenting";

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
  const [starredPosts, setStarredPosts] = useState<Record<string, boolean>>({});
  const [watchedPosts, setWatchedPosts] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [discussionComments, setDiscussionComments] = useState<Record<number, ThreadComment[]>>({});
  const [communityComments, setCommunityComments] = useState<Record<number, ThreadComment[]>>({});
  const [inCall, setInCall] = useState<null | "social">(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(200);
  const [middleWidth, setMiddleWidth] = useState(380);

  const currentUserAvatar = CURRENT_USER
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

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

  const isStarred = (scope: "discussion" | "community", id: number) => !!starredPosts[`${scope}:${id}`];
  const toggleStarred = (scope: "discussion" | "community", id: number) => {
    const key = `${scope}:${id}`;
    setStarredPosts((current) => ({ ...current, [key]: !current[key] }));
  };
  const isWatched = (scope: "discussion" | "community", id: number) => !!watchedPosts[`${scope}:${id}`];
  const toggleWatched = (scope: "discussion" | "community", id: number) => {
    const key = `${scope}:${id}`;
    setWatchedPosts((current) => ({ ...current, [key]: !current[key] }));
  };
  const isLiked = (scope: "discussion" | "community", id: number) => !!likedPosts[`${scope}:${id}`];
  const toggleLiked = (scope: "discussion" | "community", id: number) => {
    const key = `${scope}:${id}`;
    setLikedPosts((current) => ({ ...current, [key]: !current[key] }));
  };
  const getLikeCount = (scope: "discussion" | "community", id: number, baseCount: number) =>
    baseCount + (isLiked(scope, id) ? 1 : 0);
  const getComments = (scope: "discussion" | "community", id: number) =>
    scope === "discussion" ? (discussionComments[id] || []) : (communityComments[id] || []);
  const hasCommented = (scope: "discussion" | "community", id: number) =>
    getComments(scope, id).some((comment) => comment.author === CURRENT_USER);
  const getCommentCount = (scope: "discussion" | "community", id: number, baseCount: number) =>
    baseCount + getComments(scope, id).length;
  const addComment = (scope: "discussion" | "community", id: number, text: string, parentId: string | null) => {
    const comment: ThreadComment = {
      id: `${scope}-${id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      author: CURRENT_USER,
      avatar: currentUserAvatar,
      time: "Just now",
      text,
      parentId,
    };

    if (scope === "discussion") {
      setDiscussionComments((current) => ({ ...current, [id]: [...(current[id] || []), comment] }));
      return;
    }

    setCommunityComments((current) => ({ ...current, [id]: [...(current[id] || []), comment] }));
  };
  const deleteComment = (scope: "discussion" | "community", id: number, commentId: string) => {
    const removeCommentTree = (commentList: ThreadComment[]) => {
      const idsToDelete = new Set<string>([commentId]);
      let changed = true;

      while (changed) {
        changed = false;
        for (const comment of commentList) {
          if (comment.parentId && idsToDelete.has(comment.parentId) && !idsToDelete.has(comment.id)) {
            idsToDelete.add(comment.id);
            changed = true;
          }
        }
      }

      return commentList.filter((comment) => !idsToDelete.has(comment.id));
    };

    if (scope === "discussion") {
      setDiscussionComments((current) => ({ ...current, [id]: removeCommentTree(current[id] || []) }));
      return;
    }

    setCommunityComments((current) => ({ ...current, [id]: removeCommentTree(current[id] || []) }));
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
            <ThreadList
              activeTab={activeTab}
              activeCategory={activeCategory}
              selectedThread={selectedThread}
              onSelectThread={setSelectedThread}
              activeCourse={activeCourse}
              hasCommented={(id) => hasCommented("discussion", id)}
              getCommentCount={(id, baseCount) => getCommentCount("discussion", id, baseCount)}
              getLikeCount={(id, baseCount) => getLikeCount("discussion", id, baseCount)}
              isStarred={(id) => isStarred("discussion", id)}
              isWatched={(id) => isWatched("discussion", id)}
              isLiked={(id) => isLiked("discussion", id)}
              width={middleWidth}
            />
            <ResizeHandle onResize={resizeMiddle} />
            <ThreadContent
              activeCourse={activeCourse}
              activeCategory={activeCategory}
              selectedThread={selectedThread}
              starred={isStarred("discussion", selectedThread)}
              onToggleStar={() => toggleStarred("discussion", selectedThread)}
              watched={isWatched("discussion", selectedThread)}
              onToggleWatch={() => toggleWatched("discussion", selectedThread)}
              liked={isLiked("discussion", selectedThread)}
              likeCount={getLikeCount("discussion", selectedThread, (courseThreads[activeCourse] || courseThreads.CS6750).find((thread) => thread.id === selectedThread)?.likes ?? 0)}
              onToggleLike={() => toggleLiked("discussion", selectedThread)}
              comments={getComments("discussion", selectedThread)}
              onAddComment={(text, parentId) => addComment("discussion", selectedThread, text, parentId)}
              onDeleteComment={(commentId) => deleteComment("discussion", selectedThread, commentId)}
            />
          </>
        )}
        {isSocialRoom && <SocialRoom onJoin={() => setInCall("social")} />}
        {isCommunityFeed && (
          <>
            <ThreadList
              activeTab="community"
              activeCategory={activeCategory}
              selectedThread={selectedThread}
              onSelectThread={setSelectedThread}
              activeCourse={activeCourse}
              hasCommented={(id) => hasCommented("community", id)}
              getCommentCount={(id, baseCount) => getCommentCount("community", id, baseCount)}
              getLikeCount={(id, baseCount) => getLikeCount("community", id, baseCount)}
              isStarred={(id) => isStarred("community", id)}
              isWatched={(id) => isWatched("community", id)}
              isLiked={(id) => isLiked("community", id)}
              width={middleWidth}
            />
            <ResizeHandle onResize={resizeMiddle} />
            <CommunityContent
              selectedThread={selectedThread}
              activeCourse={activeCourse}
              activeCategory={activeCategory}
              starred={isStarred("community", selectedThread)}
              onToggleStar={() => toggleStarred("community", selectedThread)}
              watched={isWatched("community", selectedThread)}
              onToggleWatch={() => toggleWatched("community", selectedThread)}
              liked={isLiked("community", selectedThread)}
              likeCount={getLikeCount("community", selectedThread, (communityPosts[activeCourse] || communityPosts.CS6750).find((post) => post.id === selectedThread)?.likes ?? 0)}
              onToggleLike={() => toggleLiked("community", selectedThread)}
              comments={getComments("community", selectedThread)}
              onAddComment={(text, parentId) => addComment("community", selectedThread, text, parentId)}
              onDeleteComment={(commentId) => deleteComment("community", selectedThread, commentId)}
            />
          </>
        )}
          </div>
        )}
        <PeerVisibilitySettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </PeerVisibilityProvider>
  );
}
