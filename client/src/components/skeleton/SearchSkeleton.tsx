import React from 'react'

function SearchSkeleton() {
    return (
        <div className="space-y-10 animate-pulse">
            {/* Skills Skeleton */}
            <div>
                <div className="h-5 w-36 bg-slate-300 rounded mb-5" />

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-10 rounded-xl bg-slate-200" />
                    ))}
                </div>
            </div>

            {/* Users Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                            <div className="flex-1">
                                <div className="h-4 w-32 bg-slate-300 rounded mb-2" />
                                <div className="h-3 w-40 bg-slate-200 rounded" />
                            </div>
                        </div>
                        <div className="h-9 bg-blue-400/70 rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchSkeleton
