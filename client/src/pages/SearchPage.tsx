import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  Loader2,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import MobileNav from "../components/MobileNav";
import Footer from "../components/Footer";
import UserCard from "../components/Search/UserCard";
import { skillService } from "../services/skillService";
import { Skill } from "../types";
import { userService } from "../services/userService";
import { matchService } from "../services/matchService";
import { aiService } from "../services/aiService";
import { toast } from "sonner";

const SearchPage: React.FC<{ navigate: (to: string) => void }> = ({
  navigate,
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const isSuggestionMode = urlParams.get("type") === "suggestions";

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(
    isSuggestionMode ? "People" : "All"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // AI Suggestions State
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiDropdown, setShowAiDropdown] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingMore, hasMore]
  );

  useEffect(() => {
    skillService
      .getAllSkills()
      .then((res) => {
        if (res && res.skills) setAllSkills(res.skills);
      })
      .catch(console.error);
  }, []);

  // Fetch AI Suggestions (Debounced)
  useEffect(() => {
    if (query.length < 2) {
      setAiSuggestions([]);
      setShowAiDropdown(false);
      return;
    }

    const fetchAi = async () => {
      setIsAiLoading(true);
      try {
        const res = await aiService.suggestSearch(query);
        if (res.success) {
          setAiSuggestions(res.data);
          setShowAiDropdown(res.data.length > 0);
        }
      } catch (err) {
        console.error("AI Suggest error", err);
      } finally {
        setIsAiLoading(false);
      }
    };

    const timer = setTimeout(fetchAi, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset search state when query or mode changes
  useEffect(() => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
  }, [query, isSuggestionMode]);

  useEffect(() => {
    const performSearch = async () => {
      if (page === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      try {
        let res;
        if (isSuggestionMode && !query) {
          res = await userService.getSuggestions(page, 10);
        } else {
          res = await userService.searchUsers({ query, page, limit: 10 });
        }

        if (res) {
          setUsers((prev) =>
            page === 1 ? res.users : [...prev, ...res.users]
          );
          setHasMore(res.pagination.hasNextPage);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    };

    const timer = setTimeout(performSearch, page === 1 ? 500 : 0);
    return () => clearTimeout(timer);
  }, [query, isSuggestionMode, page]);

  const filteredSkills = useMemo(() => {
    if (isSuggestionMode) return [];
    return allSkills
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
  }, [query, allSkills, isSuggestionMode]);

  const handleConnect = async (userId: string) => {
    try {
      await matchService.sendRequest(userId);
      toast.success("Swap request sent!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  const handleAiSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowAiDropdown(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="hidden md:flex">
        <Navbar navigate={navigate} />
      </div>
      <div className="pt-5 md:pt-36 pb-6 bg-white sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="relative w-full">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
              size={22}
            />
            <input
              autoFocus={!isSuggestionMode}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowAiDropdown(true)}
              placeholder={
                isSuggestionMode
                  ? "Search recommendations..."
                  : "Search by skill or name..."
              }
              className="w-full bg-slate-100 rounded-[24px] py-4 pl-16 pr-12 text-lg focus:bg-white focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* AI Suggestions Dropdown */}
          <AnimatePresence>
            {showAiDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-2 mx-4 md:mx-6 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-4 z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Smart Recommendations
                    </span>
                  </div>
                  {isAiLoading && (
                    <Loader2 size={12} className="animate-spin text-blue-600" />
                  )}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {aiSuggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAiSuggestionClick(s)}
                      className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-blue-50 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                          <Zap size={14} />
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-900">
                          {s}
                        </span>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-slate-200 group-hover:text-blue-300 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
                      />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-8 mt-6">
            {!isSuggestionMode ? (
              ["All", "Skills", "People"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-bold relative ${
                    activeTab === tab ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="searchTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"
                    />
                  )}
                </button>
              ))
            ) : (
              <div className="flex items-center gap-2 pb-3 text-blue-600 text-sm font-bold border-b-2 border-blue-600">
                <Sparkles size={16} /> Recommended Partners
              </div>
            )}
          </div>
        </div>
      </div>

      <main
        className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-12 flex gap-12 w-full"
        onClick={() => setShowAiDropdown(false)}
      >
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-72 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Filter size={16} /> Filters
            </h4>
            {["Technology", "Design", "Marketing", "Business"].map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </aside>

        <div className="flex-grow">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-blue-600" size={40} />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                {!isSuggestionMode &&
                  (activeTab === "All" || activeTab === "Skills") &&
                  filteredSkills.length > 0 &&
                  page === 1 && (
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-6">
                        Trending Skills
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSkills.map((s, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                          >
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 font-bold group-hover:scale-110 transition-transform">
                              {s.name.charAt(0)}
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 mb-1">
                              {s.name}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {s.popularity} members
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {(activeTab === "All" || activeTab === "People") && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {users.map((u, idx) => (
                        <UserCard
                          key={u.id + idx}
                          user={u}
                          onConnect={handleConnect}
                          onNavigate={navigate}
                        />
                      ))}
                    </div>

                    {/* Infinite Scroll Trigger */}
                    <div
                      ref={lastElementRef}
                      className="h-10 flex items-center justify-center mt-8"
                    >
                      {isFetchingMore && (
                        <Loader2
                          className="animate-spin text-blue-600"
                          size={24}
                        />
                      )}
                      {!hasMore && users.length > 0 && (
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          You've reached the end of the community
                        </p>
                      )}
                    </div>
                  </>
                )}

                {users.length === 0 && !isLoading && (
                  <div className="py-20 text-center">
                    <p className="text-slate-500 font-medium">
                      No results found for your search.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <MobileNav navigate={navigate} />
      <Footer />
    </div>
  );
};

export default SearchPage;
