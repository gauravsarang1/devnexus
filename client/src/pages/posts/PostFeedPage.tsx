import React, { useState, useEffect, useCallback, useRef } from "react";
import { CreatePostBox } from "../../components/create-post";
import { PostCard, PostSkeleton } from "../../components/post";
import { FeedType, Post } from "../../types";
import { postService } from "../../services/postService";
import { AlertCircle, RefreshCw, TrendingUp, Home, User } from "lucide-react";

const PAGE_LIMIT = 10;

const PostFeedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedType>("global");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  /* ---------------- Fetch Logic ---------------- */

  const fetchPosts = async (pageNum: number, initial = false) => {
    initial ? setIsLoading(true) : setIsFetchingMore(true);
    setError(false);

    try {
      const params = { page: pageNum, limit: PAGE_LIMIT };
      let res;

      if (activeTab === "global") {
        res = await postService.getGlobalFeed(params);
      } else if (activeTab === "personalized") {
        res = await postService.getPersonalizedFeed(params);
      } else {
        res = await postService.getTrendingFeed(params);
      }

      setPosts((prev) =>
        pageNum === 1 ? res.posts : [...prev, ...res.posts]
      );
      setHasMore(res.pagination.hasNextPage);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  /* ---------------- Infinite Scroll ---------------- */

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingMore, hasMore]
  );

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    setPage(1);
    setPosts([]);
    fetchPosts(1, true);
  }, [activeTab]);

  useEffect(() => {
    if (page > 1) fetchPosts(page);
  }, [page]);

  /* ---------------- Handlers ---------------- */

  const onPostCreated = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
  };

  /* ---------------- UI Config ---------------- */

  const tabs: { id: FeedType; label: string; icon: any }[] = [
    { id: "global", label: "Global Feed", icon: Home },
    { id: "personalized", label: "For You", icon: User },
    { id: "trending", label: "Trending", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* 1. Mobile Filter Tabs */}
      {/* top-[64px] assumes your global header is 64px (h-16) tall */}
      <div className="lg:hidden sticky top-[64px] z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* 
            LAYOUT GRID 
            - pt-24 (96px) pushes content down to clear your global header 
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[240px_640px_1fr] gap-8 pt-24 pb-12 justify-center">
          
          {/* LEFT SIDEBAR: Navigation */}
          <aside className="hidden lg:block">
            {/* top-28 ensures menu stays visible below header when scrolling */}
            <nav className="sticky top-28 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 mb-4">
                Feed
              </p>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                      : "text-slate-600 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <tab.icon size={18} strokeWidth={2.5} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* CENTER: Feed Content */}
          <main className="flex flex-col gap-6 w-full max-w-[640px] mx-auto lg:mx-0">
            <CreatePostBox onPostCreated={onPostCreated} />

            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <PostSkeleton key={i} />
                ))
              ) : error ? (
                <div className="bg-white rounded-[32px] p-12 text-center border border-slate-100">
                  <AlertCircle className="mx-auto mb-4 text-red-500" size={32} />
                  <p className="font-bold text-slate-800 mb-4">Failed to load feed</p>
                  <button
                    onClick={() => fetchPosts(1, true)}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-700 transition"
                  >
                    Try Again
                  </button>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-medium">
                  No posts yet in this feed.
                </div>
              ) : (
                <>
                  {posts.map((post, index) => {
                    const isLast = index === posts.length - 1;
                    return (
                      <div key={post.id} ref={isLast ? lastPostRef : null}>
                        <PostCard post={post} />
                      </div>
                    );
                  })}

                  {isFetchingMore && (
                    <div className="flex justify-center py-8">
                      <RefreshCw className="animate-spin text-blue-600" />
                    </div>
                  )}

                  {!hasMore && (
                    <div className="text-center py-10 opacity-40">
                      <div className="h-px bg-slate-300 w-full mb-6" />
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                        End of Feed
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </main>

          {/* RIGHT SIDEBAR: Widgets */}
          <aside className="hidden xl:block">
            <div className="sticky top-28 space-y-6">
              {/* Coming Soon Widget */}
              <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm">
                <h3 className="font-black text-[11px] uppercase tracking-wider text-slate-400 mb-4">
                  Community Updates
                </h3>
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                  <p className="text-xs font-bold text-blue-600 mb-1">Coming Soon</p>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    Developer groups and real-time chat integration.
                  </p>
                </div>
              </div>

              {/* Footer Links */}
              <div className="px-6 text-[11px] text-slate-400 font-bold leading-loose">
                <p>© 2024 DevNexus. Built for developers.</p>
                <div className="flex gap-3">
                  <a href="#" className="hover:text-blue-600 transition">Privacy</a>
                  <a href="#" className="hover:text-blue-600 transition">Terms</a>
                  <a href="#" className="hover:text-blue-600 transition">Help</a>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default PostFeedPage;