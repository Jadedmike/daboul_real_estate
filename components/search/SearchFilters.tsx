"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Governorate, District } from "@/lib/supabase/types";
import { getPublicLocations } from "@/lib/actions/properties";

interface SearchFiltersProps {
  initialGovernorates?: Governorate[];
  initialDistricts?: District[];
}

export function SearchFilters({
  initialGovernorates = [],
  initialDistricts = [],
}: SearchFiltersProps) {
  const router = useRouter();
  const [dealType, setDealType] = useState<"sale" | "rent">("sale");
  const [governorates, setGovernorates] = useState<Governorate[]>(initialGovernorates);
  const [districts, setDistricts] = useState<District[]>(initialDistricts);
  const [governorate, setGovernorate] = useState<string>(
    initialGovernorates[0]?.id || ""
  );
  const [district, setDistrict] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  const [priceCategory, setPriceCategory] = useState("متوسط راقٍ");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (governorates.length === 0) {
      getPublicLocations().then((locs) => {
        setGovernorates(locs.governorates);
        setDistricts(locs.districts);
        if (!governorate && locs.governorates.length > 0) {
          setGovernorate(locs.governorates[0].id);
        }
      });
    } else if (!governorate && governorates.length > 0) {
      setGovernorate(governorates[0].id);
    }
  }, [governorates, governorate]);

  const priceLabels: Record<string, string> = {
    اقتصادي: "$20,000 - $80,000",
    "متوسط راقٍ": "$80,000 - $250,000",
    "VIP فاخر": "$250,000 - $1,500,000+",
  };

  const filteredDistricts = useMemo(() => {
    if (!governorate || governorate === "all") return districts;
    return districts.filter((d) => d.governorate_id === governorate);
  }, [governorate, districts]);

  const handleGovernorateChange = (newGovId: string) => {
    setGovernorate(newGovId);
    const matchingDistricts = districts.filter((d) => d.governorate_id === newGovId);
    if (!matchingDistricts.some((d) => d.id === district)) {
      setDistrict("all");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const params = new URLSearchParams();
      params.set("deal", dealType);
      if (governorate && governorate !== "all") params.set("gov", governorate);
      if (district && district !== "all") params.set("district", district);
      if (propertyType && propertyType !== "all") params.set("type", propertyType);
      if (bedrooms && bedrooms !== "all") params.set("bedrooms", bedrooms);
      router.push(`/properties?${params.toString()}`);
    }, 450);
  };

  return (
    <section
      className="relative z-20 w-full max-w-5xl lg:max-w-6xl mx-auto px-4 -mt-16 md:-mt-20"
      id="search-engine"
    >
      <div className="bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 shadow-[0_8px_32px_0_rgba(52,33,27,0.08)] rounded-2xl p-6 flex flex-col gap-4">
        {/* Deal Type Tabs */}
        <div
          className="flex bg-[#EDE7DC]/70 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl p-1 max-w-xs sm:max-w-sm mx-auto w-full"
          id="deal-type-tabs"
        >
          <button
            type="button"
            onClick={() => setDealType("sale")}
            className={`deal-tab-btn flex-1 py-2 rounded-lg font-title-sm text-title-sm flex items-center justify-center gap-space-xs transition-all cursor-pointer ${
              dealType === "sale"
                ? "bg-[#34211B] text-[#F8F6F0] border border-[#A0BDDB]/40 shadow-sm font-bold"
                : "text-[#34211B]/75 hover:text-[#34211B] hover:bg-[#F8F6F0]/60"
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
                ? "bg-[#34211B] text-[#F8F6F0] border border-[#A0BDDB]/40 shadow-sm font-bold"
                : "text-[#34211B]/75 hover:text-[#34211B] hover:bg-[#F8F6F0]/60"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">key</span>
            <span>عقارات للإيجار</span>
          </button>
        </div>

        {/* Filters Form */}
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          {/* Responsive 4-Column Grid: المحافظة، المنطقة، النوع، نطاق السعر */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* 1. Governorate Select */}
            <div className="flex flex-col gap-1 w-full">
              <label
                className="font-label-md text-label-md text-[#34211B] flex items-center gap-1 font-semibold"
                htmlFor="gov-select"
              >
                <span className="material-symbols-outlined text-[16px] text-[#34211B]">
                  location_city
                </span>
                المحافظة
              </label>
              <div className="relative bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus-within:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 rounded-xl shadow-xs transition-all">
                <select
                  id="gov-select"
                  value={governorate}
                  onChange={(e) => handleGovernorateChange(e.target.value)}
                  className="w-full h-11 bg-transparent px-3 text-[#34211B] font-body-md text-body-md appearance-none focus:outline-none cursor-pointer"
                >
                  {governorates.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name_ar}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute left-3 top-3 text-[#34211B]/60 pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* 2. District Dynamic Select */}
            <div className="flex flex-col gap-1 w-full">
              <label
                className="font-label-md text-label-md text-[#34211B] flex items-center gap-1 font-semibold"
                htmlFor="district-select"
              >
                <span className="material-symbols-outlined text-[16px] text-[#34211B]">
                  map
                </span>
                المنطقة أو الحي
              </label>
              <div className="relative bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus-within:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 rounded-xl shadow-xs transition-all">
                <select
                  id="district-select"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-11 bg-transparent px-3 text-[#34211B] font-body-md text-body-md appearance-none focus:outline-none cursor-pointer"
                >
                  <option value="all">كافة المناطق والأحياء</option>
                  {filteredDistricts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name_ar}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute left-3 top-3 text-[#34211B]/60 pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* 3. Property Type & Bedrooms Select */}
            <div className="flex flex-col gap-1 w-full">
              <label
                className="font-label-md text-label-md text-[#34211B] flex items-center justify-between font-semibold"
                htmlFor="type-select"
              >
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#34211B]">
                    apartment
                  </span>
                  النوع
                </span>
                <span className="text-[#34211B]/70 text-label-sm font-normal">
                  {bedrooms !== "all" ? `${bedrooms} غرف` : "كل الغرف"}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="relative bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus-within:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 rounded-xl shadow-xs transition-all">
                  <select
                    id="type-select"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full h-11 bg-transparent px-2 text-[#34211B] font-body-md text-body-md appearance-none focus:outline-none cursor-pointer"
                  >
                    <option value="all">الكل</option>
                    <option value="apartment">شقق</option>
                    <option value="villa">فلل</option>
                    <option value="office">مكاتب</option>
                    <option value="shop">محلات</option>
                    <option value="land">أراضٍ</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-1 top-3 text-[#34211B]/60 pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
                <div className="relative bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus-within:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 rounded-xl shadow-xs transition-all">
                  <select
                    id="rooms-select"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full h-11 bg-transparent px-2 text-[#34211B] font-body-md text-body-md appearance-none focus:outline-none cursor-pointer"
                  >
                    <option value="all">الغرف</option>
                    <option value="1">1 نوم</option>
                    <option value="2">2 نوم</option>
                    <option value="3">3 نوم</option>
                    <option value="4">4 نوم</option>
                    <option value="5+">5+ نوم</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-1 top-3 text-[#34211B]/60 pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Price Range Selector with Chips */}
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between items-center text-label-md font-label-md">
                <span className="text-[#34211B] flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-[#34211B]">
                    payments
                  </span>
                  نطاق السعر
                </span>
                <span className="text-[#34211B] font-bold text-label-sm" id="price-display">
                  {priceLabels[priceCategory]}
                </span>
              </div>
              <div className="flex items-center gap-1 h-11">
                {["اقتصادي", "متوسط راقٍ", "VIP فاخر"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPriceCategory(cat)}
                    className={`price-chip flex-1 h-11 px-1 rounded-xl text-[12px] font-medium transition-all cursor-pointer flex items-center justify-center text-center leading-tight ${
                      priceCategory === cat
                        ? "bg-[#34211B] text-[#F8F6F0] border border-[#A0BDDB]/40 shadow-sm font-bold"
                        : "bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/95 backdrop-blur-sm border border-[#A0BDDB]/30 text-[#34211B]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Search Trigger CTA Button */}
          <button
            type="submit"
            id="execute-search-btn"
            disabled={isSearching}
            className="w-full py-3 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-xl flex items-center justify-center gap-space-xs font-title-sm text-title-sm border border-[#A0BDDB]/20 shadow-[0_8px_24px_rgba(52,33,27,0.18)] transition-all active:scale-[0.99] cursor-pointer"
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
