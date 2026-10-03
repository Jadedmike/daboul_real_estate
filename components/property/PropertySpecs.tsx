import React from "react";
import { PropertySpec } from "@/lib/data";

interface PropertySpecsProps {
  specs?: PropertySpec[];
  cadastralStatus?: string;
  features?: string[];
}

export function PropertySpecs({
  specs,
  cadastralStatus,
  features,
}: PropertySpecsProps) {
  const defaultSpecs: PropertySpec[] = [
    { label: "المساحة الإجمالية", value: "280 م²", icon: "straighten" },
    { label: "غرف النوم", value: "4 (ماستر 2)", icon: "bed" },
    { label: "الحمامات والتواليت", value: "3 ماستر", icon: "bathtub" },
    { label: "الطابق والارتفاع", value: "الرابع (بناء 6 طوابق)", icon: "layers" },
    { label: "الوضع القانوني", value: "طابو أخضر 2400 سهم", icon: "verified_user" },
    { label: "المرآب والمواقف", value: "موقفين في القبو", icon: "garage" },
  ];

  const items = specs && specs.length > 0 ? specs : defaultSpecs;

  return (
    <div className="flex flex-col gap-space-md">
      {/* Rapid Specs Bento Matrix */}
      <div className="grid grid-cols-3 gap-space-xs bg-surface-container-lowest p-space-sm rounded-xl shadow-sm">
        {items.map((spec, idx) => (
          <div
            key={idx}
            className="bg-surface-container-low p-3 rounded-lg flex flex-col items-center justify-center text-center"
          >
            <span className="material-symbols-outlined text-secondary text-[24px] mb-1">
              {spec.icon}
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              {spec.value}
            </span>
            <span className="font-label-sm text-label-sm text-outline">
              {spec.label}
            </span>
          </div>
        ))}
      </div>

      {/* Cadastral Legal Status */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container text-[22px]">
            verified_user
          </span>
          <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
            الوضع القانوني والملكية العقارية
          </h3>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          {cadastralStatus ||
            "طابو أخضر نظامي 2400 سهم بريء الذمة وجاهز للفراغ المباشر في أمانة السجل العقاري بدمشق دون أي إشارات أو رهونات."}
        </p>
      </div>

      {/* Architectural Features */}
      {features && features.length > 0 && (
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container text-[22px]">
              architecture
            </span>
            <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
              المواصفات والتجهيزات المعمارية
            </h3>
          </div>
          <ul className="space-y-2">
            {features.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface"
              >
                <span className="material-symbols-outlined text-secondary-container text-[18px]">
                  check_circle
                </span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
