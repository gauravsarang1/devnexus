import React from 'react'

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-white animate-pulse">
            <main className="pt-[100px] md:pt-[120px] pb-24 px-4 md:px-6 max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="mb-12">
                    <div className="h-40 bg-slate-200 rounded-[32px] mb-6" />
                    <div className="flex items-center gap-6">
                        <div className="w-28 h-28 bg-slate-300 rounded-[32px] -mt-16 border-4 border-white" />
                        <div className="flex-1">
                            <div className="h-6 w-48 bg-slate-300 rounded mb-2" />
                            <div className="h-4 w-64 bg-slate-200 rounded" />
                        </div>
                    </div>
                </div>

                {/* Mutual banner */}
                <div className="h-28 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-[32px] mb-12" />

                {/* Main grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* About */}
                        <section>
                            <div className="h-6 w-32 bg-slate-300 rounded mb-4" />
                            <div className="bg-slate-100 rounded-3xl p-6">
                                <div className="h-4 w-full bg-slate-200 rounded mb-2" />
                                <div className="h-4 w-5/6 bg-slate-200 rounded mb-2" />
                                <div className="h-4 w-2/3 bg-slate-200 rounded" />
                            </div>
                        </section>

                        {/* Expertise */}
                        <section>
                            <div className="flex justify-between mb-6">
                                <div className="h-6 w-36 bg-slate-300 rounded" />
                                <div className="h-8 w-24 bg-slate-200 rounded-xl" />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-8 w-28 bg-green-100 rounded-xl" />
                                ))}
                            </div>
                        </section>

                        {/* Learning */}
                        <section>
                            <div className="flex justify-between mb-6">
                                <div className="h-6 w-40 bg-slate-300 rounded" />
                                <div className="h-8 w-24 bg-slate-200 rounded-xl" />
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-8 w-28 bg-blue-100 rounded-xl" />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right */}
                    <div className="space-y-8">
                        <div className="h-40 bg-slate-100 rounded-3xl" />
                        <div className="h-40 bg-slate-100 rounded-3xl" />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProfileSkeleton
