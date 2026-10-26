"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Governorate, District } from "@/lib/supabase/types";
import { getPublicLocations } from "@/lib/actions/properties";

interface AdvancedFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialGovernorates?: Governorate[];
  initialDistricts?: District[];
}

export interface FilterState {
  dealType: "sale" | "rent";
  governorate: string;
  district: string;
  propertyType: string;
  maxPrice: number;
  features: string[];
}

export function AdvancedFilterDrawer({
  isOpen,
  onClose,
  onApply,
  initialGovernorates = [],
  initialDistricts = [],
}: AdvancedFilterDrawerProps) {
  const [dealType, setDealType] = useState<"sale" | "rent">("sale");
  const [governorates, setGovernorates] = useState<Governorate[]>(initialGovernorates);
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [governorate, setGovernorate] = useState<string>("all");
  const [district, setDistrict] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1800000);
  const [features, setFeatures] = useState<string[]>([]);

  useEffect(() => {
    if (governorates.length === 0) {
      getPublicLocations().then((locs) => {
        setGovernorates(locs.governorates);
        setDistricts(locs.districts);
      });
    }
  }, [governorates.length]);

  const filteredDistricts = useMemo(() => {
    if (!governorate || governorate === "all") return districts;
    return districts.filter((d) => d.governorate_id === governorate);
  }, [governorate, districts]);

  const handleReset = () => {
    setDealType("sale");
    setGovernorate("all");
    setDistrict("all");
    setPropertyType("all");
    setMaxPrice(1800000);
    setFeatures([]);
  };

  const handleGovernorateChange = (newGovId: string) => {
    setGovernorate(newGovId);
    const matchingDistricts = districts.filter((d) => d.governorate_id === newGovId);
    if (!matchingDistricts.some((d) => d.id === district)) {
      setDistrict("all");
    }
  };

  const toggleFeature = (feat: string) => {
    if (features.includes(feat)) {
      setFeatures(features.filter((f) => f !== feat));
    } else {
      setFeatures([...features, feat]);
    }
  };

  if (!isOpen) return null;

  return (
    <section
      className="px-gutter-mobile py-space-md bg-[#F8F6F0]/85 backdrop-blur-2xl border-b border-[#A0BDDB]/35 shadow-[0_12px_36px_rgba(52,33,27,0.08)] transition-all duration-300"
      id="filterDrawer"
    >
      <div className="flex items-center justify-between pb-space-sm border-b border-[#A0BDDB]/30">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-[#34211B] text-[20px]">
            filter_alt
          </span>
          <h2 className="font-title-sm text-title-sm text-[#34211B] font-bold">
            الفلترة المتقدمة والدقيقة
          </h2>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="font-label-sm text-label-sm text-[#34211B] hover:text-[#4A332B] hover:underline cursor-pointer font-bold"
        >
          إعادة تعيين
        </button>
      </div>

      <div className="space-y-space-md pt-space-xs">
        {/* Operation Type */}
        <div>
          <label className="block font-label-md text-label-md text-[#34211B] mb-1 font-semibold">
            نوع العملية العقارية
          </label>
          <div className="grid grid-cols-2 gap-space-xs">
            <button
              type="button"
              onClick={() => setDealType("sale")}
              className={`flex items-center justify-center gap-space-xs p-space-sm rounded-xl font-label-md text-label-md cursor-pointer transition-all ${
                dealType === "sale"
                  ? "bg-[#34211B] text-[#F8F6F0] border border-[#A0BDDB]/40 shadow-xs font-bold"
                  : "bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/95 backdrop-blur-sm border border-[#A0BDDB]/30 text-[#34211B]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">sell</span>
              <span>للبيع (تمليك)</span>
            </button>
            <button
              type="button"
              onClick={() => setDealType("rent")}
              className={`flex items-center justify-center gap-space-xs p-space-sm rounded-xl font-label-md text-label-md cursor-pointer transition-all ${
                dealType === "rent"
                  ? "bg-[#34211B] text-[#F8F6F0] border border-[#A0BDDB]/40 shadow-xs font-bold"
                  : "bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/95 backdrop-blur-sm border border-[#A0BDDB]/30 text-[#34211B]"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>للإيجار (سنوي/شهري)</span>
            </button>
          </div>
        </div>

        {/* Syrian Governorate & Region Selection */}
        <div className="grid grid-cols-2 gap-space-sm">
          <div>
            <label className="block font-label-sm text-label-sm text-[#34211B]/80 mb-1 font-medium">
              المحافظة
            </label>
            <div className="relative bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus-within:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 rounded-xl px-space-sm py-2 shadow-xs transition-all">
              <select
                value={governorate}
                onChange={(e) => handleGovernorateChange(e.target.value)}
                className="w-full bg-transparent text-[#34211B] font-body-sm text-body-sm focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">كافة المحافظات</option>
                {governorates.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name_ar}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute left-2 top-2.5 text-[#34211B]/60 text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
          <div>
            <label className="block font-label-sm text-label-sm text-[#34211B]/80 mb-1 font-medium">
              المنطقة والحي
            </label>
            <div className="relative bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus-within:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 rounded-xl px-space-sm py-2 shadow-xs transition-all">
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-transparent text-[#34211B] font-body-sm text-body-sm focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">كافة المناطق والأحياء</option>
                {filteredDistricts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name_ar}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute left-2 top-2.5 text-[#34211B]/60 text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Property Type Selection */}
        <div>
          <label className="block font-label-sm text-label-sm text-[#34211B]/80 mb-1 font-medium">
            نوع العقار
          </label>
          <div className="relative bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus-within:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 rounded-xl px-space-sm py-2 shadow-xs transition-all">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-transparent text-[#34211B] font-body-sm text-body-sm focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">كافة أنواع العقارات</option>
              <option value="apartment">شقق سكنية وبنتهاوس</option>
              <option value="villa">فلل وقصور مستقلة</option>
              <option value="office">مكاتب ومقار شركات</option>
              <option value="shop">محلات وصالات تجارية</option>
              <option value="land">أراضٍ ومقاسم تنظيمية</option>
            </select>
            <span className="material-symbols-outlined absolute left-2 top-2.5 text-[#34211B]/60 text-[18px] pointer-events-none">
              expand_more
            </span>
          </div>
        </div>

        {/* Price Range Metric */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="font-label-sm text-label-sm text-[#34211B]/80 font-medium">
              نطاق الميزانية التقديرية
            </label>
            <span className="font-label-sm text-label-sm text-[#34211B] font-bold">
              حتى ${(maxPrice / 1000000).toFixed(1)} مليون $ (أو ما يعادله)
            </span>
          </div>
          <input
            className="w-full accent-[#34211B] bg-[#EDE7DC] h-2 rounded-lg cursor-pointer"
            max="3000000"
            min="100000"
            step="50000"
            type="range"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        {/* Features Checkboxes */}
        <div>
          <label className="block font-label-sm text-label-sm text-[#34211B]/80 mb-2 font-medium">
            المواصفات والتجهيزات
          </label>
          <div className="grid grid-cols-2 gap-space-xs text-body-sm font-body-sm">
            {[
              "طاقة شمسية 24/7",
              "مولدة بناء ATS",
              "مصعد أوتوماتيكي",
              "كراج / موقف خاص",
              "مسبح خاص",
              "طابو أخضر نظامي",
            ].map((feat) => (
              <label
                key={feat}
                onClick={() => toggleFeature(feat)}
                className="flex items-center gap-2 p-2 bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/95 backdrop-blur-sm border border-[#A0BDDB]/30 rounded-xl cursor-pointer transition-all shadow-xs"
              >
                <input
                  type="checkbox"
                  checked={features.includes(feat)}
                  onChange={() => {}}
                  className="rounded text-[#34211B] focus:ring-0 accent-[#34211B] cursor-pointer"
                />
                <span className="text-[#34211B] font-medium">{feat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Apply Action */}
        <button
          type="button"
          onClick={() => {
            onApply({
              dealType,
              governorate,
              district,
              propertyType,
              maxPrice,
              features,
            });
            onClose();
          }}
          className="w-full h-11 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] font-title-sm text-title-sm rounded-xl flex items-center justify-center gap-space-xs border border-[#A0BDDB]/20 transition-all shadow-sm cursor-pointer font-bold"
        >
          <span className="material-symbols-outlined text-[20px]">
            check_circle
          </span>
          <span>تطبيق الفلاتر وعرض النتائج</span>
        </button>
      </div>
    </section>
  );
}
