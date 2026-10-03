"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GOVERNORATES } from "@/lib/data";

export function SearchFilters() {
  const router = useRouter();
  const [dealType, setDealType] = useState<"sale" | "rent">("sale");
  const [governorate, setGovernorate] = useState("damascus");
  const [district, setDistrict] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  const [priceCategory, setPriceCategory] = useState("متوسط راقٍ");
  const [isSearching, setIsSearching] = useState(false);

  const priceLabels: Record<string, string> = {
    اقتصادي: "$20,000 - $80,000",
    "متوسط راقٍ": "$80,000 - $250,000",
    "VIP فاخر": "$250,000 - $1,500,000+",
  };

  const currentGovernorateData =
    GOVERNORATES.find((g) => g.id === governorate) || GOVERNORATES[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      router.push(
        `/properties?deal=${dealType}&gov=${governorate}&district=${district}&type=${propertyType}`
      );
    }, 450);
  };

  return (
    <section className="px-gutter-mobile -mt-6 relative z-20 w-full" id="search-engine">
      <div className="bg-surface-container-lowest rounded-xl shadow-xl p-space-md flex flex-col gap-space-md">
        {/* Deal Type Tabs */}
        <div className="flex bg-surface-container rounded-lg p-1" id="deal-type-tabs">
          <button
            type="button"
            onClick={() => setDealType("sale")}
            className={`deal-tab-btn flex-1 py-2 rounded-lg font-title-sm text-title-sm flex items-center justify-center gap-space-xs transition-all cursor-pointer ${
              dealType === "sale"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">sell</span>
            <span>عقارات للبيع</span>
          </button>
          <button
            type="button"
            onClick={() => setDealType("rent")}
            className={`deal-tab-btn flex-1 py-2 rounded-lg font-title-sm text-title-sm flex items-center justify-center gap-space-xs transition-all cursor-pointer ${
              dealType === "rent"
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            <span>عقارات للإيجار</span>
          </button>
        </div>

        {/* Filters Grid */}
        <form onSubmit={handleSearch} className="flex flex-col gap-space-sm">
          {/* Governorate Select */}
          <div className="flex flex-col gap-1">
            <label
              className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1"
              htmlFor="gov-select"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary-container">
                location_city
              </span>
              المحافظة
            </label>
            <div className="relative bg-surface-container-low rounded-lg">
              <select
                id="gov-select"
                value={governorate}
                onChange={(e) => {
                  setGovernorate(e.target.value);
                  setDistrict("all");
                }}
                className="w-full h-11 bg-transparent px-space-sm text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:bg-surface-container cursor-pointer"
              >
                {GOVERNORATES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* District Dynamic Select */}
          <div className="flex flex-col gap-1">
            <label
              className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1"
              htmlFor="district-select"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary-container">
                map
              </span>
              المنطقة أو الحي
            </label>
            <div className="relative bg-surface-container-low rounded-lg">
              <select
                id="district-select"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full h-11 bg-transparent px-space-sm text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:bg-surface-container cursor-pointer"
              >
                {currentGovernorateData.districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Property Type & Bedrooms Row */}
          <div className="grid grid-cols-2 gap-space-sm">
            <div className="flex flex-col gap-1">
              <label
                className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1"
                htmlFor="type-select"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary-container">
                  apartment
                </span>
                النوع
              </label>
              <div className="relative bg-surface-container-low rounded-lg">
                <select
                  id="type-select"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full h-11 bg-transparent px-space-sm text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:bg-surface-container cursor-pointer"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="apartment">شقق سكنية</option>
                  <option value="villa">فلل وقصور</option>
                  <option value="office">مكاتب وشركات</option>
                  <option value="shop">محلات تجارية</option>
                  <option value="land">أراضٍ وعقارات</option>
                </select>
                <span className="material-symbols-outlined absolute left-2 top-3 text-on-surface-variant pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1"
                htmlFor="rooms-select"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary-container">
                  bed
                </span>
                غرف النوم
              </label>
              <div className="relative bg-surface-container-low rounded-lg">
                <select
                  id="rooms-select"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full h-11 bg-transparent px-space-sm text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:bg-surface-container cursor-pointer"
                >
                  <option value="all">الكل</option>
                  <option value="1">1 غرفة نوم</option>
                  <option value="2">2 غرف نوم</option>
                  <option value="3">3 غرف نوم</option>
                  <option value="4">4 غرف نوم</option>
                  <option value="5+">5+ غرف نوم</option>
                </select>
                <span className="material-symbols-outlined absolute left-2 top-3 text-on-surface-variant pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Price Range Selector with Chips */}
          <div className="flex flex-col gap-space-xs pt-1">
            <div className="flex justify-between items-center text-label-md font-label-md">
              <span className="text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary-container">
                  payments
                </span>
                نطاق السعر المستهدف
              </span>
              <span className="text-secondary-container font-semibold" id="price-display">
                {priceLabels[priceCategory]}
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              {["اقتصادي", "متوسط راقٍ", "VIP فاخر"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPriceCategory(cat)}
                  className={`price-chip flex-1 py-1.5 rounded-lg text-label-sm font-label-sm transition-all cursor-pointer ${
                    priceCategory === cat
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Trigger CTA Button */}
          <button
            type="submit"
            id="execute-search-btn"
            disabled={isSearching}
            className="w-full h-12 mt-space-xs bg-primary hover:bg-primary-container text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            {isSearching ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">
                  refresh
                </span>
                <span>جاري جلب العقارات...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
                <span>بحث فوري عن العقارات المتاحة</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
