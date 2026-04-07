const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="bg-background pt-[30px]">

      {/* Breadcrumb Skeleton */}
      <div className="pt-24 pb-2 section-padding">
        <div className="section-container">
          <div className="h-4 w-48 bg-muted animate-pulse rounded-md" />
        </div>
      </div>

      <main className="section-padding pb-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* Left: Image Skeleton */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <div className="aspect-[4/5] bg-muted animate-pulse rounded-[2.5rem]" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-muted animate-pulse rounded-2xl" />
                ))}
              </div>
            </div>

            {/* Right: Content Skeleton */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-8">
              <div className="space-y-4">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-10 w-full bg-muted animate-pulse rounded-xl" />
                <div className="h-10 w-2/3 bg-muted animate-pulse rounded-xl" />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-8 w-32 bg-muted animate-pulse rounded-full" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>

              <div className="space-y-6 py-6 border-y border-border">
                <div className="space-y-3">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="flex gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-12 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  <div className="flex gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex gap-4">
                  <div className="h-14 flex-1 bg-muted animate-pulse rounded-2xl" />
                  <div className="h-14 w-14 bg-muted animate-pulse rounded-2xl" />
                </div>
                <div className="h-14 w-full bg-muted animate-pulse rounded-2xl" />
              </div>

              <div className="space-y-4 pt-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-full bg-muted/50 animate-pulse rounded-lg" />
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
};

export default ProductDetailSkeleton;
