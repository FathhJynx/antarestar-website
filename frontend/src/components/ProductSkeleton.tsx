import React from "react";

interface ProductSkeletonProps {
  list?: boolean;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ list = false }) => {
  if (list) {
    return (
      <div className="animate-pulse flex gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="w-36 aspect-[4/5] rounded-xl bg-muted flex-shrink-0" />
        <div className="flex-1 py-2 space-y-3">
          <div className="h-3 bg-muted rounded w-1/4" />
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/3 mt-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-pulse group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50">
      <div className="aspect-[4/5] rounded-t-2xl bg-muted" />
      <div className="flex-1 p-3 flex flex-col justify-between space-y-2">
        <div>
          <div className="h-2.5 bg-muted rounded w-1/3 mb-2" />
          <div className="h-4 bg-muted rounded w-full mb-1" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="h-5 bg-muted rounded w-1/2 mt-2" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
