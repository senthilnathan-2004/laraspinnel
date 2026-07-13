import React from "react";

export default function SkeletonCard() {
  return (
    <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-card animate-pulse flex flex-col">
      {/* Image skeleton */}
      <div className="relative aspect-square bg-neutral-200"></div>

      {/* Details skeleton */}
      <div className="p-3 md:p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Title */}
          <div className="h-5 bg-neutral-200 rounded-md w-3/4"></div>
          {/* Price */}
          <div className="h-6 bg-neutral-200 rounded-md w-1/2"></div>
        </div>

        {/* Button */}
        <div className="h-10 bg-neutral-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
}
