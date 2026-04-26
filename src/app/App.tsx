import { useState } from "react";

import { Header } from "./components/Header";
import { LeftSidebar } from "./components/LeftSidebar";
import { NewThreadComposer, type NewThreadDraft } from "./components/NewThreadComposer";
import { ThreadList } from "./components/ThreadList";
import { ThreadContent } from "./components/ThreadContent";
import { CommunityContent } from "./components/CommunityFeed";
import { SocialRoom } from "./components/SocialRoom";
import { VideoCall } from "./components/VideoCall";
import { ResizeHandle } from "./components/ResizeHandle";
import { Dashboard } from "./components/Dashboard";
import { getCategoryOption } from "./data/forumCategories";
import { PeerProfilesProvider, usePeerProfiles } from "./peer/PeerProfilesContext";
import { PeerVisibilityProvider } from "./peer/PeerVisibilityContext";
import { PeerVisibilitySettings } from "./peer/PeerVisibilitySettings";
import { communityPosts, type CommunityPost } from "./data/communityPosts";
import { courseThreads, CURRENT_USER, type Thread } from "./data/threads";
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

const anonymousAliases = [
  "Anonymous Falcon",
  "Anonymous Owl",
  "Anonymous Tiger",
  "Anonymous Penguin",
  "Anonymous Stork",
  "Anonymous Fox",
];

function nextItemId<T extends { id: number }>(items: T[]) {
  return items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
}

function anonymousIdentity(id: number) {
  return {
    author: anonymousAliases[id % anonymousAliases.length],
    avatar: "A",
  };
}

function mapCommunityPostToThread(post: CommunityPost): Thread {
  return {
    id: post.id,
    title: post.title,
    category: post.tag,
    author: post.author,
    avatar: post.avatar,
    time: post.time,
    comments: post.comments,
    likes: post.likes,
    views: post.views,
    body: post.body,
    createdByCurrentUser: post.createdByCurrentUser,
  };
}

function AppShell() {
  const { profiles } = usePeerProfiles();
  const [view, setView] = useState<"course" | "dashboard">("course");
  const [activeTab, setActiveTab] = useState<"discussion" | "community">("discussion");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState("CS6750");
  const [selectedThread, setSelectedThread] = useState(2697);
  const [starredPosts, setStarredPosts] = useState<Record<string, boolean>>({});
  const [watchedPosts, setWatchedPosts] = useState<Record<string, boolean>>({});
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [customDiscussionThreads, setCustomDiscussionThreads] = useState<Record<string, Thread[]>>({});
  const [customCommunityPosts, setCustomCommunityPosts] = useState<Record<string, CommunityPost[]>>({});
  const [discussionComments, setDiscussionComments] = useState<Record<number, ThreadComment[]>>({});
  const [communityComments, setCommunityComments] = useState<Record<number, ThreadComment[]>>({});
  const [inCall, setInCall] = useState<null | "social">(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [composerState, setComposerState] = useState<null | { scope: "discussion" | "community"; initialCategory: string | null }>(null);
  const [leftWidth, setLeftWidth] = useState(200);
  const [middleWidth, setMiddleWidth] = useState(380);

  const currentUserAvatar = profiles[CURRENT_USER]?.avatar || CURRENT_USER
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const resizeLeft = (dx: number) => setLeftWidth((w) => clamp(w + dx, 160, 400));
  const resizeMiddle = (dx: number) => setMiddleWidth((w) => clamp(w + dx, 260, 640));
  const getDiscussionThreadsForCourse = (course: string, customOverride?: Thread[]) => [
    ...(customOverride || customDiscussionThreads[course] || []),
    ...(courseThreads[course] || courseThreads.CS6750),
  ];
  const getCommunityPostsForCourse = (course: string, customOverride?: CommunityPost[]) => [
    ...(customOverride || customCommunityPosts[course] || []),
    ...(communityPosts[course] || communityPosts.CS6750),
  ];
  const getCommunityThreadsForCourse = (course: string, customOverride?: CommunityPost[]) =>
    getCommunityPostsForCourse(course, customOverride).map(mapCommunityPostToThread);
  const discussionThreadsForCourse = getDiscussionThreadsForCourse(activeCourse);
  const communityPostsForCourse = getCommunityPostsForCourse(activeCourse);
  const communityThreadsForCourse = getCommunityThreadsForCourse(activeCourse);
  const selectedDiscussionThread = discussionThreadsForCourse.find((thread) => thread.id === selectedThread) || discussionThreadsForCourse[0];
  const selectedCommunityPost = communityPostsForCourse.find((post) => post.id === selectedThread) || communityPostsForCourse[0];

  const clearPostInteractionState = (scope: "discussion" | "community", id: number) => {
    const key = `${scope}:${id}`;
    setStarredPosts((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    setWatchedPosts((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    setLikedPosts((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const handleTabChange = (tab: "discussion" | "community") => {
    setView("course");
    setComposerState(null);
    setActiveTab(tab);
    if (tab === "discussion") {
      setActiveCategory(null);
      setSelectedThread(getDiscussionThreadsForCourse(activeCourse)[0]?.id || defaultThreads[activeCourse] || 2697);
    } else {
      setActiveCategory(null);
      setSelectedThread(getCommunityPostsForCourse(activeCourse)[0]?.id || defaultCommunityThreads[activeCourse] || 3001);
    }
  };

  const handleCourseChange = (course: string) => {
    setView("course");
    setComposerState(null);
    setActiveCourse(course);
    setSelectedThread(getDiscussionThreadsForCourse(course)[0]?.id || defaultThreads[course] || 2697);
    setActiveCategory(null);
    setActiveTab("discussion");
  };

  const handleCategoryChange = (cat: string | null) => {
    setActiveCategory(cat);
    if (!cat) {
      setSelectedThread(
        activeTab === "discussion"
          ? (getDiscussionThreadsForCourse(activeCourse)[0]?.id || defaultThreads[activeCourse] || 2697)
          : (getCommunityPostsForCourse(activeCourse)[0]?.id || defaultCommunityThreads[activeCourse] || 3001),
      );
      return;
    }

    if (activeTab === "discussion") {
      const threads = filterByDiscussionCategory(getDiscussionThreadsForCourse(activeCourse), cat);
      if (threads[0]) setSelectedThread(threads[0].id);
    } else if (cat !== "Social Room") {
      const posts = filterByCommunityCategory(getCommunityPostsForCourse(activeCourse), cat);
      if (posts[0]) setSelectedThread(posts[0].id);
    }
  };

  const handleHome = () => {
    setComposerState(null);
    setInCall(null);
    setView("dashboard");
  };

  const handleDashboardCourseOpen = (course: string) => {
    setView("course");
    handleCourseChange(course);
  };
  const openComposer = () => {
    setComposerState({
      scope: activeTab,
      initialCategory: activeCategory === "Social Room" ? null : activeCategory,
    });
  };
  const closeComposer = () => setComposerState(null);

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
  const handleCreatePost = (draft: NewThreadDraft) => {
    if (!composerState) return;

    if (composerState.scope === "discussion") {
      const nextId = nextItemId(getDiscussionThreadsForCourse(activeCourse));
      const authorIdentity = draft.anonymous
        ? anonymousIdentity(nextId)
        : { author: CURRENT_USER, avatar: currentUserAvatar };
      const nextThread: Thread = {
        id: nextId,
        title: draft.title,
        category: draft.category,
        author: authorIdentity.author,
        avatar: authorIdentity.avatar,
        time: "1m ago",
        timeLong: "Just now",
        comments: 0,
        likes: 0,
        views: 1,
        body: draft.body,
        createdByCurrentUser: true,
      };

      setCustomDiscussionThreads((current) => ({
        ...current,
        [activeCourse]: [nextThread, ...(current[activeCourse] || [])],
      }));
      if (activeCategory && activeCategory !== draft.category) setActiveCategory(draft.category);
      setSelectedThread(nextThread.id);
      setActiveTab("discussion");
      setComposerState(null);
      return;
    }

    const categoryMeta = getCategoryOption("community", draft.category);
    const nextId = nextItemId(getCommunityPostsForCourse(activeCourse));
    const authorIdentity = draft.anonymous
      ? anonymousIdentity(nextId)
      : { author: CURRENT_USER, avatar: currentUserAvatar };
    const nextPost: CommunityPost = {
      id: nextId,
      author: authorIdentity.author,
      avatar: authorIdentity.avatar,
      time: "1m ago",
      title: draft.title,
      body: draft.body,
      tag: draft.category,
      tagColor: categoryMeta?.tagClassName || "bg-blue-100 text-blue-700",
      likes: 0,
      views: 1,
      comments: 0,
      replies: [],
      createdByCurrentUser: true,
    };

    setCustomCommunityPosts((current) => ({
      ...current,
      [activeCourse]: [nextPost, ...(current[activeCourse] || [])],
    }));
    if (activeCategory === "Social Room" || (activeCategory && activeCategory !== draft.category)) {
      setActiveCategory(draft.category);
    }
    setSelectedThread(nextPost.id);
    setActiveTab("community");
    setComposerState(null);
  };
  const handleDeleteDiscussionThread = () => {
    if (!selectedDiscussionThread?.createdByCurrentUser) return;

    const nextCustomThreads = (customDiscussionThreads[activeCourse] || []).filter((thread) => thread.id !== selectedDiscussionThread.id);
    const remainingThreads = getDiscussionThreadsForCourse(activeCourse, nextCustomThreads);
    const nextVisibleThread = filterByDiscussionCategory(remainingThreads, activeCategory)[0];

    setCustomDiscussionThreads((current) => ({
      ...current,
      [activeCourse]: nextCustomThreads,
    }));
    clearPostInteractionState("discussion", selectedDiscussionThread.id);
    setDiscussionComments((current) => {
      const next = { ...current };
      delete next[selectedDiscussionThread.id];
      return next;
    });

    if (!nextVisibleThread && activeCategory) {
      setActiveCategory(null);
      setSelectedThread(remainingThreads[0]?.id || defaultThreads[activeCourse] || 2697);
      return;
    }

    setSelectedThread(nextVisibleThread?.id || remainingThreads[0]?.id || defaultThreads[activeCourse] || 2697);
  };
  const handleDeleteCommunityPost = () => {
    if (!selectedCommunityPost?.createdByCurrentUser) return;

    const nextCustomPosts = (customCommunityPosts[activeCourse] || []).filter((post) => post.id !== selectedCommunityPost.id);
    const remainingPosts = getCommunityPostsForCourse(activeCourse, nextCustomPosts);
    const nextVisiblePost = filterByCommunityCategory(remainingPosts, activeCategory);

    setCustomCommunityPosts((current) => ({
      ...current,
      [activeCourse]: nextCustomPosts,
    }));
    clearPostInteractionState("community", selectedCommunityPost.id);
    setCommunityComments((current) => {
      const next = { ...current };
      delete next[selectedCommunityPost.id];
      return next;
    });

    if ((!nextVisiblePost[0] || activeCategory === "Social Room") && activeCategory) {
      setActiveCategory(null);
      setSelectedThread(remainingPosts[0]?.id || defaultCommunityThreads[activeCourse] || 3001);
      return;
    }

    setSelectedThread(nextVisiblePost[0]?.id || remainingPosts[0]?.id || defaultCommunityThreads[activeCourse] || 3001);
  };

  const isSocialRoom = activeTab === "community" && activeCategory === "Social Room";
  const isCommunityFeed = activeTab === "community" && activeCategory !== "Social Room";

  if (inCall) {
    const roomName = `${activeCourse} Social Room`;
    return (
      <div className="h-screen flex flex-col bg-white overflow-hidden">
        <Header view={view} activeTab={activeTab} onTabChange={handleTabChange} activeCourse={activeCourse} onHome={handleHome} onOpenSettings={() => setSettingsOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <VideoCall roomName={roomName} roomType={inCall} onLeave={() => setInCall(null)} />
        </div>
        <PeerVisibilitySettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    );
  }

  return (
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
          onNewThread={openComposer}
          width={leftWidth}
        />
        <ResizeHandle onResize={resizeLeft} />
        {composerState ? (
          <NewThreadComposer
            activeTab={composerState.scope}
            activeCourse={activeCourse}
            initialCategory={composerState.initialCategory}
            onCancel={closeComposer}
            onSubmit={handleCreatePost}
          />
        ) : !isSocialRoom && !isCommunityFeed ? (
          <>
            <ThreadList
              activeTab={activeTab}
              activeCategory={activeCategory}
              selectedThread={selectedThread}
              onSelectThread={setSelectedThread}
              activeCourse={activeCourse}
              discussionThreads={discussionThreadsForCourse}
              communityThreads={communityThreadsForCourse}
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
              threads={discussionThreadsForCourse}
              selectedThread={selectedThread}
              starred={isStarred("discussion", selectedThread)}
              onToggleStar={() => toggleStarred("discussion", selectedThread)}
              watched={isWatched("discussion", selectedThread)}
              onToggleWatch={() => toggleWatched("discussion", selectedThread)}
              liked={isLiked("discussion", selectedThread)}
              likeCount={getLikeCount("discussion", selectedThread, selectedDiscussionThread?.likes ?? 0)}
              onToggleLike={() => toggleLiked("discussion", selectedThread)}
              comments={getComments("discussion", selectedThread)}
              onAddComment={(text, parentId) => addComment("discussion", selectedThread, text, parentId)}
              onDeleteComment={(commentId) => deleteComment("discussion", selectedThread, commentId)}
              canDeleteThread={!!selectedDiscussionThread?.createdByCurrentUser}
              onDeleteThread={handleDeleteDiscussionThread}
            />
          </>
        ) : isSocialRoom ? (
          <SocialRoom activeCourse={activeCourse} onJoin={() => setInCall("social")} />
        ) : (
          <>
            <ThreadList
              activeTab="community"
              activeCategory={activeCategory}
              selectedThread={selectedThread}
              onSelectThread={setSelectedThread}
              activeCourse={activeCourse}
              discussionThreads={discussionThreadsForCourse}
              communityThreads={communityThreadsForCourse}
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
              posts={communityPostsForCourse}
              starred={isStarred("community", selectedThread)}
              onToggleStar={() => toggleStarred("community", selectedThread)}
              watched={isWatched("community", selectedThread)}
              onToggleWatch={() => toggleWatched("community", selectedThread)}
              liked={isLiked("community", selectedThread)}
              likeCount={getLikeCount("community", selectedThread, selectedCommunityPost?.likes ?? 0)}
              onToggleLike={() => toggleLiked("community", selectedThread)}
              comments={getComments("community", selectedThread)}
              onAddComment={(text, parentId) => addComment("community", selectedThread, text, parentId)}
              onDeleteComment={(commentId) => deleteComment("community", selectedThread, commentId)}
              canDeletePost={!!selectedCommunityPost?.createdByCurrentUser}
              onDeletePost={handleDeleteCommunityPost}
            />
          </>
        )}
        </div>
      )}
      <PeerVisibilitySettings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <PeerProfilesProvider>
      <PeerVisibilityProvider>
        <AppShell />
      </PeerVisibilityProvider>
    </PeerProfilesProvider>
  );
}
