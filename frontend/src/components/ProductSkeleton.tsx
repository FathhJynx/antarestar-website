import React from "react";

interface ProductSkeletonProps {
  list?: boolean;
  isLarge?: boolean;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ list = false, isLarge = false }) => {
  if (list) {
    return (
      <div className="animate-pulse flex gap-8 p-8 rounded-none bg-white/[0.02] border border-white/5">
        <div className="w-48 aspect-square rounded-none bg-white/[0.03] flex-shrink-0" />
        <div className="flex-1 py-1 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
             <div className="h-3 bg-white/[0.05] rounded-none w-1/4" />
             <div className="h-8 bg-white/[0.05] rounded-none w-3/4" />
             <div className="h-4 bg-white/[0.05] rounded-none w-1/3" />
          </div>
          <div className="h-8 bg-white/[0.05] rounded-none w-1/3 mt-auto border-t border-white/5 pt-6" />
        </div>
      </div>
    );
  }

  return (
    <div className={`animate-pulse group flex flex-col h-full bg-transparent rounded-none ${isLarge ? "md:col-span-2 md:row-span-2" : ""}`}>
      <div className={`rounded-none bg-white/[0.03] mb-4 ${isLarge ? "aspect-square lg:aspect-auto h-full" : "aspect-[3/4]"}`} />
      <div className="flex-1 px-1 flex flex-col justify-between space-y-3">
        <div className="space-y-3">
          <div className="h-2 bg-white/[0.05] rounded-none w-1/3 mb-1" />
          <div className={`bg-white/[0.05] rounded-none w-full mb-1 ${isLarge ? "h-12" : "h-4"}`} />
          <div className={`bg-white/[0.05] rounded-none w-2/3 ${isLarge ? "h-10" : "h-4"}`} />
        </div>
        <div className="h-6 bg-white/[0.05] rounded-none w-1/2 mt-4 pt-4 border-t border-white/5" />
      </div>
    </div>
  );
};

export const BentoSkeleton = () => {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
         {[1, 2, 3, 4, 5, 6, 7, 8].map((i, idx) => {
            const isLarge = idx === 0 || (idx % 7 === 0 && idx !== 0);
            return <ProductSkeleton key={i} isLarge={isLarge} />;
         })}
      </div>
   );
};

export default ProductSkeleton;
