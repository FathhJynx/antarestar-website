import React from "react";

const SkeletonCard = ({ list = false }: { list?: boolean }) => (
  <div className={`animate-pulse ${list ? "flex gap-4 p-4 rounded-2xl bg-card border border-border" : ""}`}>
    {list ? (
      <>
        <div className="w-36 aspect-[3/4] rounded-xl bg-muted flex-shrink-0" />
        <div className="flex-1 py-2 space-y-3">
          <div className="h-3 bg-muted rounded w-1/4" />
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/3 mt-auto" />
        </div>
      </>
    ) : (
      <>
        <div className="aspect-[3/4] rounded-xl bg-muted mb-3" />
        <div className="space-y-2 px-0.5">
          <div className="h-2.5 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded-full w-1/2 mt-1" />
        </div>
      </>
    )}
  </div>
);

export default SkeletonCard;
