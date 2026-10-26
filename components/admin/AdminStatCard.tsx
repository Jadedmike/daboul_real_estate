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
    if (progressColor === "secondary") return "bg-[#A0BDDB]";
    if (progressColor === "neutral") return "bg-[#34211B]/60";
    return "bg-[#34211B]";
  };

  return (
    <div className="bg-[#F8F6F0]/80 backdrop-blur-xl rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] border border-[#A0BDDB]/35 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm text-[#34211B]/70 font-medium">{label}</span>
        <span className="w-8 h-8 rounded-xl bg-[#A0BDDB]/25 backdrop-blur-md border border-[#A0BDDB]/45 flex items-center justify-center text-[#34211B] shadow-xs">
          <span className="material-symbols-outlined text-[16px]">{icon}</span>
        </span>
      </div>
      <div className="mt-space-sm flex items-baseline justify-between">
        <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-[#34211B] tracking-tight">
          {value}
        </span>
        <span className="font-label-sm text-label-sm text-[#34211B] font-bold flex items-center gap-0.5">
          {badgeText}
        </span>
      </div>
      <div className="w-full bg-[#EDE7DC] h-1.5 rounded-full mt-space-xs overflow-hidden">
        <div
          className={`${getProgressBg()} h-full rounded-full transition-all duration-500`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
