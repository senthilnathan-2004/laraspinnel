import React from "react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export default function EmptyState({
  title = "No results found",
  description = "Try adjusting your search filters to find what you are looking for.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="p-12 text-center text-brand-gray border border-brand-border bg-white rounded-2xl max-w-md mx-auto space-y-4">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-brand-light-gray flex items-center justify-center mx-auto border border-brand-border">
        <SearchX size={28} className="text-brand-gray" />
      </div>

      {/* Text */}
      <div className="space-y-1">
        <h3 className="font-semibold text-brand-black text-base">{title}</h3>
        <p className="text-xs leading-relaxed">{description}</p>
      </div>

      {/* Action */}
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center border border-brand-border hover:bg-brand-light-gray text-brand-black text-xs font-semibold h-9 px-4 rounded-xl transition-all"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
