
import React from 'react';

const PostSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-4 space-y-4 w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-1/4 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="space-y-2 py-2">
        <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-slate-100 rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
      </div>
      <div className="flex gap-4 pt-2">
        <div className="h-8 w-16 bg-slate-100 rounded-full animate-pulse" />
        <div className="h-8 w-16 bg-slate-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default PostSkeleton;
