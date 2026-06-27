export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light font-sans antialiased">
      <div className="sticky top-0 z-50 bg-clear-day/95 backdrop-blur-md border-b border-nordic-dark/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-nordic-dark/20 animate-pulse" />
              <div className="h-6 w-32 bg-nordic-dark/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="aspect-[16/10] rounded-xl bg-nordic-dark/5 animate-pulse" />
            <div className="h-6 w-3/4 bg-nordic-dark/5 rounded animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-nordic-dark/5 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="h-64 rounded-xl bg-nordic-dark/5 animate-pulse" />
              <div className="h-48 rounded-xl bg-nordic-dark/5 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}