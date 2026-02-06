import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Plus, Search, X, Loader2 } from 'lucide-react';
import { ProjectFeedTabs } from '../../components/project/ProjectFeedTabs';
import { ProjectCard } from '../../components/project/ProjectCard';
import { ProjectGridSkeleton } from '../../components/project/ProjectSkeleton';
import { CreateProjectModal } from '../../components/project/CreateProjectModal';
import { Project, FeedType as ProjectFeedTab } from '../../types';
import { projectService } from '@/src/services/projectService';

const ProjectFeedPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProjectFeedTab>("global");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Ref for the intersection observer
  const observerTarget = useRef<HTMLDivElement>(null);

  /* ---------------- Fetch Projects ---------------- */

  const fetchProjects = useCallback(async (pageNumber: number, isInitial: boolean = false) => {
    if (isInitial) setIsLoading(true);
    else setIsFetchingNextPage(true);
    
    setIsError(false);

    try {
      const params = { page: pageNumber, limit: 10 };
      let res;

      switch (activeTab) {
        case "personalized":
          res = await projectService.getPersonalizedFeed(params);
          break;
        case "trending":
          res = await projectService.getTrendingProjects(params);
          break;
        default:
          res = await projectService.getAllProjects(params);
      }

      setProjects(prev => isInitial ? res.projects : [...prev, ...res.projects]);
      setHasMore(res.pagination.hasNextPage);
    } catch (err) {
      console.error(err);
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [activeTab]);

  // Reset and fetch when tab changes
  useEffect(() => {
    setPage(1);
    fetchProjects(1, true);
  }, [activeTab, fetchProjects]);

  /* ---------------- Intersection Observer ---------------- */

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isFetchingNextPage && !isLoading && !searchQuery) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProjects(nextPage);
    }
  }, [hasMore, isFetchingNextPage, isLoading, page, fetchProjects, searchQuery]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1, // Trigger when 10% of the target is visible
    });

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [handleObserver]);

  /* ---------------- Search ---------------- */

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter((project) =>
      project.title.toLowerCase().includes(query) ||
      project.tagline?.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  return (
    <div className="max-w-7xl mt-20 mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Showcase</h1>
          <p className="text-gray-500 mt-1">Discover what the developer community is building.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, stack, or tagline..."
              className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full text-gray-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </header>

      <ProjectFeedTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {isLoading ? (
        <ProjectGridSkeleton />
      ) : isError ? (
        <div className="text-center py-20 bg-red-50 rounded-2xl border border-red-100">
          <p className="text-red-600 font-bold">Failed to load projects.</p>
          <button onClick={() => fetchProjects(1, true)} className="mt-4 text-sm font-bold text-red-500 hover:underline">Retry Connection</button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900">No matching projects</h3>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="mt-6 px-6 py-2 bg-gray-100 text-gray-600 rounded-full font-bold">Clear Search</button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Observer Target & Loading State */}
          <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
            {isFetchingNextPage && (
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading more projects...
              </div>
            )}
            {!hasMore && !searchQuery && projects.length > 0 && (
              <p className="text-gray-400 text-sm">You've reached the end of the showcase.</p>
            )}
          </div>
        </>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchProjects(1, true)}
      />
    </div>
  );
};

export default ProjectFeedPage;