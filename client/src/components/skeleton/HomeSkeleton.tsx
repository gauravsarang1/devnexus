const HomeSkeleton: React.FC = () => {
    return (
        <div className="animate-pulse space-y-16">
            {/* HERO */}
            <section className="pt-32 md:pt-40 px-4 md:px-6">
                <div className="max-w-7xl mx-auto bg-slate-100 rounded-[32px] p-8 md:p-12">
                    <div className="h-4 w-40 bg-slate-300 rounded mb-4" />
                    <div className="h-8 w-80 bg-slate-300 rounded mb-4" />
                    <div className="h-4 w-60 bg-slate-200 rounded mb-8" />
                    <div className="h-12 w-44 bg-blue-400/70 rounded-full" />
                </div>
            </section>

            {/* RESUME ACTIVITY */}
            <section className="px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="h-6 w-48 bg-slate-300 rounded mb-6" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white p-4 rounded-2xl border border-slate-100"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                                    <div className="flex-1">
                                        <div className="h-4 w-32 bg-slate-300 rounded mb-2" />
                                        <div className="h-3 w-40 bg-slate-200 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS */}
            <section className="px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="h-6 w-40 bg-slate-300 rounded mb-4" />

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="h-10 bg-slate-200 rounded-xl" />
                        ))}
                    </div>
                </div>
            </section>

            {/* SUGGESTED MATCHES */}
            <section className="px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="h-6 w-52 bg-slate-300 rounded mb-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="bg-white p-6 rounded-[32px] border border-slate-100"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
                                    <div className="flex-1">
                                        <div className="h-4 w-32 bg-slate-300 rounded mb-2" />
                                        <div className="h-3 w-40 bg-slate-200 rounded" />
                                    </div>
                                </div>

                                <div className="h-10 bg-blue-400/70 rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeSkeleton;
