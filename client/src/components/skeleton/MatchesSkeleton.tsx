import React from 'react'

function MatchesSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-white border border-slate-100 rounded-[32px] p-6"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
                            <div className="flex-1">
                                <div className="h-4 w-32 bg-slate-300 rounded mb-2" />
                                <div className="h-3 w-48 bg-slate-200 rounded" />
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="h-4 w-24 bg-slate-200 rounded" />
                            <div className="h-4 w-36 bg-slate-200 rounded" />
                        </div>

                        <div className="flex gap-2">
                            <div className="h-10 flex-1 bg-blue-400/80 rounded-xl" />
                            <div className="h-10 w-10 bg-slate-200 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MatchesSkeleton
