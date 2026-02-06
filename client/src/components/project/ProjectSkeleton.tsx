
import React from 'react';

export const ProjectSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-2 w-16 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-gray-200 rounded" />
        <div className="h-3 w-5/6 bg-gray-200 rounded" />
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-16 bg-gray-200 rounded" />
        <div className="h-6 w-16 bg-gray-200 rounded" />
      </div>
      <div className="flex justify-between items-center border-t border-gray-100 pt-4">
        <div className="flex gap-4">
          <div className="h-4 w-12 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
};

export const ProjectGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <ProjectSkeleton key={i} />
      ))}
    </div>
  );
};
