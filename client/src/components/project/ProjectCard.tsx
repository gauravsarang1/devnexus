
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageCircle, Share2, Bookmark, Layout, User } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-100 transition-all group flex flex-col h-full">
      <div className="p-6 flex-1">
        {/* Project Hero Section - Primary Focus */}
        <div className="flex gap-5 mb-5">
          <div className="flex-shrink-0">
            {project.logo ? (
              <img 
                src={project.logo} 
                alt={project.title} 
                className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400 border border-gray-100">
                <Layout className="w-8 h-8 opacity-50" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <Link to={`/projects/${project.slug}`} className="block truncate">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {project.title}
                </h2>
              </Link>
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 rounded-lg flex-shrink-0">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-bold">{project._count.reviews}</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm mt-1 line-clamp-2 leading-snug">
              {project.tagline || project.description}
            </p>
          </div>
        </div>

        {/* Skills/Stack Section */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techs.slice(0, 4).map(({skill}) => (
            <span
              key={skill.id}
              className="px-2.5 py-1 bg-blue-50/50 text-blue-600 rounded-md text-[11px] font-bold tracking-tight uppercase"
            >
              {skill.name}
            </span>
          ))}
          {project.techs.length > 4 && (
            <span className="text-[11px] text-gray-400 font-bold self-center">
              +{project.techs.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Footer Section - Secondary Information */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={project.user.avatar}
            alt={project.user.name}
            className="w-7 h-7 rounded-full border border-white ring-1 ring-gray-100"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-700 leading-none mb-0.5">
              {project.user.name}
            </span>
            <span className="text-[10px] text-gray-400">
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-400 hover:text-blue-600 transition-colors group/stat cursor-pointer">
            <MessageCircle className="w-4 h-4 group-hover/stat:fill-blue-50" />
            <span className="text-xs font-bold">{project._count.reviews}</span>
          </div>
          <button className="text-gray-400 hover:text-blue-600 transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
