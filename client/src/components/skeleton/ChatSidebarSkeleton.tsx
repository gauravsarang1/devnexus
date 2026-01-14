import React from 'react'

function ChatSidebarSkeleton() {
    return (
        <div className="w-full lg:w-95 flex flex-col border-r border-slate-100 bg-white animate-pulse">
            {/* Header */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <div className="h-7 w-32 bg-slate-300/80 rounded-lg mb-2" />
                        <div className="h-3 w-40 bg-blue-100 rounded" />
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-2xl" />
                </div>

                {/* Search */}
                <div className="h-12 bg-slate-100 rounded-2xl" />
            </div>

            {/* Chat list */}
            <div className="grow overflow-y-hidden px-2 pb-6 space-y-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="w-full flex items-center gap-4 p-4 rounded-3xl"
                    >
                        {/* Avatar */}
                        <div className="w-14 h-14 bg-slate-200 rounded-2xl shrink-0" />

                        {/* Text */}
                        <div className="grow">
                            <div className="flex justify-between items-center mb-2">
                                <div className="h-4 w-32 bg-slate-300/80 rounded" />
                                <div className="h-3 w-10 bg-slate-200 rounded" />
                            </div>
                            <div className="h-3 w-48 bg-slate-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default ChatSidebarSkeleton
