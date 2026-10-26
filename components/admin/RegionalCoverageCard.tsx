"use client";

import React from "react";
import { useToast } from "@/components/ui/Toast";

export function RegionalCoverageCard() {
  const { showToast } = useToast();

  const regions = [
    { name: "دمشق (المالكي، الروضة)", count: "64 عقار" },
    { name: "ريف دمشق (يعفور، الصبورة)", count: "38 عقار" },
    { name: "حمص (الإنشاءات، المحطة)", count: "22 عقار" },
    { name: "اللاذقية وطرطوس (الساحل)", count: "18 عقار" },
  ];

  return (
    <div className="bg-[#F8F6F0]/80 backdrop-blur-xl rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.08)] flex flex-col space-y-space-sm border border-[#A0BDDB]/35">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-[#34211B] text-[20px]">
            map
          </span>
          <h2 className="font-title-sm text-title-sm text-[#34211B] font-bold">
            إدارة المحافظات والمناطق (CMS)
          </h2>
        </div>
        <button
          type="button"
          onClick={() => showToast("فتح نافذة إضافة منطقة عقارية")}
          className="text-label-sm font-label-sm text-[#34211B] hover:text-[#34211B]/80 font-bold underline cursor-pointer"
        >
          + إضافة منطقة
        </button>
      </div>

      <div className="grid grid-cols-2 gap-space-xs text-body-sm font-body-sm">
        {regions.map((reg) => (
          <div
            key={reg.name}
            className="p-space-xs bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl flex items-center justify-between shadow-xs hover:border-[#A0BDDB]/60 transition-colors"
          >
            <span className="text-[#34211B] font-semibold">{reg.name}</span>
            <span className="font-label-sm text-label-sm text-[#34211B]/60 font-medium">
              {reg.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
