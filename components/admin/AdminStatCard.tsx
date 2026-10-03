import React from "react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  badgeText: string;
  badgeType?: "positive" | "percentage" | "neutral";
  progressPercent: number;
  progressColor?: "primary" | "secondary" | "neutral";
  icon: string;
}

export function AdminStatCard({
  label,
  value,
  badgeText,
  progressPercent,
  progressColor = "primary",
  icon,
}: AdminStatCardProps) {
  const getProgressBg = () => {
    if (progressColor === "secondary") return "bg-secondary-container";
    if (progressColor === "neutral") return "bg-on-surface-variant";
    return "bg-primary";
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-outline">{label}</span>
        <span className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
          <span className="material-symbols-outlined text-[16px]">{icon}</span>
        </span>
      </div>
      <div className="mt-space-sm flex items-baseline justify-between">
        <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">
          {value}
        </span>
        <span className="font-label-sm text-label-sm text-secondary-container flex items-center gap-0.5">
          {badgeText}
        </span>
      </div>
      <div className="w-full bg-surface-container-high h-1 rounded-full mt-space-xs overflow-hidden">
        <div
          className={`${getProgressBg()} h-full rounded-full transition-all duration-500`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
