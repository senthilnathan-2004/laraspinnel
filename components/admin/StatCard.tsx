import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: "amber" | "green" | "blue" | "gray";
  };
}

export default function StatCard({ title, value, icon, badge }: StatCardProps) {
  const getBadgeClasses = (variant: string) => {
    switch (variant) {
      case "amber":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "green":
        return "bg-green-100 text-green-800 border-green-200";
      case "blue":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white p-3 md:p-6 rounded-2xl border border-brand-border shadow-card flex items-center justify-between gap-3 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="space-y-2 min-w-0 flex-1">
        <p className="text-sm font-medium text-brand-gray truncate">{title}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-2xl md:text-3xl font-bold tracking-tight text-brand-black">
            {value}
          </span>
          {badge && (
            <span
              className={`whitespace-nowrap text-xs px-2 py-0.5 rounded-full font-semibold border ${getBadgeClasses(
                badge.variant
              )}`}
            >
              {badge.text}
            </span>
          )}
        </div>
      </div>
      <div className="shrink-0 p-3 bg-brand-light-gray rounded-xl text-brand-gray border border-brand-border">
        {icon}
      </div>
    </div>
  );
}
