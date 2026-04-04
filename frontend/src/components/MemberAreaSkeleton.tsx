const MemberAreaSkeleton: React.FC = () => {
  return (
    <div className="bg-background pt-[30px]">

      <main className="section-padding section-container max-w-6xl mx-auto py-10">
        {/* Header Skeleton */}
        <div className="py-16 md:py-24 text-center max-w-3xl mx-auto space-y-4">
          <div className="h-12 w-3/4 mx-auto bg-muted animate-pulse rounded-2xl" />
          <div className="h-4 w-5/6 mx-auto bg-muted animate-pulse rounded" />
          <div className="h-4 w-2/3 mx-auto bg-muted animate-pulse rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COL: Profile Card Skeleton */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-8">
            <div className="bg-card border border-border p-8 rounded-[2.5rem] space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-muted animate-pulse rounded-full" />
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-3 pt-6 border-t border-border">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-20 w-full bg-muted animate-pulse rounded-xl" />
              </div>
              <div className="h-10 w-full bg-muted animate-pulse rounded-xl" />
            </div>

            <div className="bg-card border border-border p-8 rounded-[2.5rem] space-y-4">
              <div className="h-6 w-40 bg-muted animate-pulse rounded" />
              <div className="h-12 w-full bg-muted animate-pulse rounded-xl" />
            </div>
          </div>

          {/* RIGHT COL: Content Skeletons */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-8">
            {/* Points & Progress Skeleton */}
            <div className="bg-card border border-border p-8 rounded-[2.5rem] space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-4 w-full bg-muted animate-pulse rounded-full" />
              </div>
            </div>

            {/* History Table Skeleton */}
            <div className="bg-card border border-border p-8 rounded-[2.5rem] space-y-6">
              <div className="h-6 w-48 bg-muted animate-pulse rounded" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center py-4 border-b border-border last:border-0">
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-5 w-16 bg-muted animate-pulse rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};

export default MemberAreaSkeleton;
