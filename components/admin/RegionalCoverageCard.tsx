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
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col space-y-space-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary-container text-[20px]">
            map
          </span>
          <h2 className="font-title-sm text-title-sm text-on-surface">
            إدارة المحافظات والمناطق (CMS)
          </h2>
        </div>
        <button
          type="button"
          onClick={() => showToast("فتح نافذة إضافة منطقة عقارية")}
          className="text-label-sm font-label-sm text-secondary-container hover:underline cursor-pointer"
        >
          + إضافة منطقة
        </button>
      </div>

      <div className="grid grid-cols-2 gap-space-xs text-body-sm font-body-sm">
        {regions.map((reg) => (
          <div
            key={reg.name}
            className="p-space-xs bg-surface-container-low rounded flex items-center justify-between"
          >
            <span className="text-on-surface">{reg.name}</span>
            <span className="font-label-sm text-label-sm text-outline">
              {reg.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
