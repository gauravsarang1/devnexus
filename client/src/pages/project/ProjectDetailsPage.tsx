
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Github,
  ExternalLink,
  ArrowLeft,
  Star,
  Calendar,
  Share2,
  MessageCircle,
  MoreVertical,
  Edit2,
  Layout
} from 'lucide-react';
import { ReviewList } from '../../components/project/ReviewList';
import { ReviewForm } from '../../components/project/ReviewForm';
import { ProjectSkeleton } from '../../components/project/ProjectSkeleton';
import { CreateProjectModal } from '../../components/project/CreateProjectModal';
import { Project, Review } from '../../types/index';
import { projectService } from '@/src/services/projectService';
import { reviewService } from '../../services/reviewService';

const ProjectDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  console.log("slug", slug)
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'comments'>('details');

  const fetchProject = async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      setIsError(false);

      const result = await projectService.getProjectBySlug(slug);
      console.log("result", result)
      setProject(result);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Fetch Reviews ---------------- */

  const fetchReviews = async () => {
    if (!slug) return;

    try {
      setIsReviewsLoading(true);
      const res = await reviewService.getReviews({
        projectId: project?.id,
        page: "1",
        limit: "10",
      });
      setReviews(res.reviews);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [slug]);

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab, slug]);

  /* ---------------- Review Submit ---------------- */

  const handleReviewSubmit = async (rating: number, content: string) => {
    if (!slug) return;

    await reviewService.createReview({
      projectId: project?.id,
      rating,
      comment: content,
    });

    await Promise.all([fetchReviews(), fetchProject()]);
  };

  /* ---------------- Guards ---------------- */

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <ProjectSkeleton />
      </div>
    );

  if (isError || !project)
    return <div className="text-center py-20">Project not found.</div>;

  /* ---------------- Derived ---------------- */

  const reviewCount = project._count?.reviews ?? 0;
  const avgRating =
    reviews.length > 0
      ? (
        reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      ).toFixed(1)
      : "0.0";


                    {console.log(project)}


  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/projects"
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-8 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to projects
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-shrink-0">
              {project.logo ? (
                <img
                  src={project.logo}
                  alt={project.title}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400 border-4 border-white shadow-xl">
                  <Layout className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">{project.title}</h1>
                  <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-2xl">
                    {project.tagline}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors"
                    title="Edit Project"
                  >
                    <Edit2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-full font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{project?.avgRating ?? 0} / 5 ({project?._count?.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Published {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 py-6 border-y border-gray-50 mb-8">
            <div className="flex items-center gap-3">
              <img src={project.user?.avatar} alt={project.user.name} className="w-10 h-10 rounded-full ring-2 ring-gray-50" />
              <div>
                <p className="text-sm font-bold text-gray-900">{project.user.name}</p>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Creator</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block"></div>
            <div className="hidden sm:flex flex-wrap gap-2">
              {project.techs.slice(0, 4).map(({ skill }) => (
                <span key={skill.id} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            {project.previewUrl && (
              <a
                href={project.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
              >
                <ExternalLink className="w-5 h-5" />
                Launch Project
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all active:scale-[0.98]"
              >
                <Github className="w-5 h-5" />
                View Source
              </a>
            )}
          </div>

          <div className="prose prose-blue max-w-none">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Overview</h3>
            <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Technologies & Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techs.map(({ skill }) => (
                <span
                  key={skill.id}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold border border-blue-100"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold transition-all ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <Star className="w-5 h-5" />
            Reviews ({project?._count?.reviews ?? 0})
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 flex items-center justify-center gap-2 py-5 font-bold transition-all ${activeTab === 'comments' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <MessageCircle className="w-5 h-5" />
            Comments ({project?._count?.comments ?? 0})
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Community Reviews</h3>
                <button
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-6 py-2 bg-yellow-400 text-yellow-900 rounded-xl font-bold hover:bg-yellow-500 transition-all active:scale-95 shadow-lg shadow-yellow-200"
                >
                  Write Review
                </button>
              </div>

              {isReviewsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-gray-100 rounded-xl" />
                  <div className="h-20 bg-gray-100 rounded-xl" />
                </div>
              ) : (
                <ReviewList reviews={reviews} />
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="text-center py-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Discussion</h3>
              <p className="text-gray-500 mb-8">Integrated with project-wide comment system</p>
              <div className="bg-gray-50 rounded-2xl p-6 text-left">
                <div className="flex gap-4 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <textarea
                      className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Add to the discussion..."
                    />
                    <div className="mt-2 text-right">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm">Post Comment</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ReviewForm
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />

      <CreateProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={project}
        onSuccess={fetchProject}
      />
    </div>
  );
};

export default ProjectDetailsPage