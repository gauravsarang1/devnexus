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
import MobileNav from "../components/MobileNav";
import UserCard from "../components/Search/UserCard";
import { skillService } from "../services/skillService";
import { Skill } from "../types";
import { userService } from "../services/userService";
import { matchService } from "../services/matchService";
import { aiService } from "../services/aiService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import SearchSkeleton from "../components/skeleton/SearchSkeleton";

const SearchPage: React.FC<{ navigate: (to: string) => void }> = ({
  navigate,
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const isSuggestionMode = urlParams.get("type") === "suggestions";

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(
    isSuggestionMode ? "People" : "All",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const currentUser = useSelector((state: RootState) => state.auth.user);

  // AI Suggestions
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
          setPage((p) => p + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingMore, hasMore],
  );

  /* ---------------- FETCH SKILLS ---------------- */

  useEffect(() => {
    skillService
      .getAllSkills()
      .then((res) => setAllSkills(res.skills || []))
      .catch(console.error);
  }, []);

  /* ---------------- AI SUGGESTIONS ---------------- */

  useEffect(() => {
    if (query.length < 2) {
      setAiSuggestions([]);
      setShowAiDropdown(false);
      return;
    }

    const fetchAi = async () => {
      setIsAiLoading(true);
      try {
        const data = await aiService.suggestSearch(query);

        setAiSuggestions(data);
        setShowAiDropdown(data.length > 0);
      } finally {
        setIsAiLoading(false);
      }
    };

    const t = setTimeout(fetchAi, 400);
    return () => clearTimeout(t);
  }, [query]);

  /* ---------------- RESET ON QUERY ---------------- */

  useEffect(() => {
    setUsers([]);
    setPage(1);
    setHasMore(true);
  }, [query, isSuggestionMode]);

  /* ---------------- SEARCH ---------------- */

  useEffect(() => {
    const performSearch = async () => {
      page === 1 ? setIsLoading(true) : setIsFetchingMore(true);

      try {
        const res =
          isSuggestionMode && !query
            ? await userService.getSuggestions(page, 10)
            : await userService.searchUsers({ query, page, limit: 10 });

        setUsers((prev) => (page === 1 ? res.users : [...prev, ...res.users]));
        console.log(res);
        setHasMore(res.pagination.hasNextPage);
      } finally {
        setIsLoading(false);
        setIsFetchingMore(false);
      }
    };

    const t = setTimeout(performSearch, page === 1 ? 400 : 0);
    return () => clearTimeout(t);
  }, [query, isSuggestionMode, page]);

  /* ---------------- HELPERS ---------------- */

  const filteredSkills = useMemo(() => {
    if (isSuggestionMode) return [];
    return allSkills
      .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6);
  }, [query, allSkills, isSuggestionMode]);

  const handleConnect = async (userId: string) => {
    await matchService.sendRequest(userId);
    toast.success("Swap request sent!");
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* SEARCH BAR */}
      <div className="pt-5 md:pt-36 pb-6 sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="relative">
            <Search
              className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
              size={22}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowAiDropdown(true)}
              placeholder={
                isSuggestionMode
                  ? "Search recommendations..."
                  : "Search by skill or name..."
              }
              className="w-full bg-slate-100 rounded-[24px] py-4 pl-16 pr-12 text-lg focus:bg-white outline-none"
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

          {/* AI DROPDOWN */}
          <AnimatePresence>
            {showAiDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 right-0 mt-2 mx-4 md:mx-6 bg-white rounded-[32px] shadow-2xl border border-slate-100 p-4 z-50"
              >
                <div className="flex items-center justify-between px-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-600" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Smart Recommendations
                    </span>
                  </div>
                  {isAiLoading && (
                    <Loader2 size={12} className="animate-spin text-blue-600" />
                  )}

                  <button
                    onClick={() => setShowAiDropdown(false)}
                    className="p-1 rounded-full hover:bg-slate-100"
                  >
                    <X size={14} />
                  </button>
                </div>

                {aiSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(s);
                      setShowAiDropdown(false);
                    }}
                    className="flex justify-between items-center p-3 rounded-2xl hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-3">
                      <Zap size={14} className="text-blue-600" />
                      <span className="font-bold text-slate-700">{s}</span>
                    </div>
                    <ArrowRight size={14} className="text-slate-300" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* CONTENT */}
      <main
        className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-12"
        onClick={() => setShowAiDropdown(false)}
      >
        {isLoading ? (
          <SearchSkeleton />
        ) : (
          <>
            {!isSuggestionMode && filteredSkills.length > 0 && page === 1 && (
              <div className="mb-12">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">
                  Trending Skills
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {filteredSkills.map((s) => (
                    <button
                      key={s.id}
                      className="
              flex items-center justify-center
              px-3 py-2
              rounded-xl
              bg-slate-50
              border border-slate-200
              text-xs sm:text-sm font-bold
              text-slate-700
              hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700
              transition
            "
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.map((u, idx) => (
                <UserCard
                  key={u.id + idx}
                  user={u}
                  currentUser={currentUser}
                  onConnect={handleConnect}
                  onNavigate={navigate}
                />
              ))}
            </div>

            <div
              ref={lastElementRef}
              className="h-10 flex items-center justify-center mt-10"
            >
              {isFetchingMore && (
                <Loader2 className="animate-spin text-blue-600" size={24} />
              )}
              {!hasMore && users.length > 0 && (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  End of results
                </p>
              )}
            </div>

            {users.length === 0 && !isLoading && (
              <div className="py-20 text-center text-slate-500">
                No results found.
              </div>
            )}
          </>
        )}
      </main>

      <MobileNav navigate={navigate} />
    </div>
  );
};

export default SearchPage;
