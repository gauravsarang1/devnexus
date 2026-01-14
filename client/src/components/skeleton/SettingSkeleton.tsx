import React from 'react'

function SettingSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
        <main className="pt-[100px] md:pt-[120px] pb-24 max-w-6xl mx-auto w-full px-4 md:px-6">
          {/* Header */}
          <header className="mb-10">
            <div className="h-10 w-48 bg-slate-300 rounded-lg" />
          </header>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100"
                >
                  <div className="w-6 h-6 bg-slate-300 rounded" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-slate-300 rounded mb-1" />
                    <div className="h-3 w-16 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}
            </aside>

            {/* Main pane */}
            <section className="flex-grow bg-slate-50/50 rounded-[48px] p-8 md:p-12 border border-slate-100 min-h-[600px]">
              {/* Section title */}
              <div className="h-6 w-40 bg-slate-300 rounded mb-8" />

              {/* Form fields */}
              <div className="space-y-6 max-w-xl">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-3 w-24 bg-slate-200 rounded mb-2" />
                    <div className="h-12 bg-white border border-slate-200 rounded-xl" />
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-10 flex gap-4">
                <div className="h-12 w-32 bg-blue-400/80 rounded-xl" />
                <div className="h-12 w-24 bg-slate-200 rounded-xl" />
              </div>
            </section>
          </div>
        </main>
      </div>
  )
}

export default SettingSkeleton
