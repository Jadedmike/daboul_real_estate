"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PropertyCard } from "@/components/property/PropertyCard";
import {
  AdvancedFilterDrawer,
  FilterState,
} from "@/components/search/AdvancedFilterDrawer";
import { PublicProperty } from "@/lib/actions/properties";
import { Governorate, District } from "@/lib/supabase/types";
import { useToast } from "@/components/ui/Toast";

interface PropertiesCatalogContentProps {
  initialLocations: {
    governorates: Governorate[];
    districts: District[];
  };
  initialProperties: PublicProperty[];
}

export function PropertiesCatalogContent({
  initialLocations,
  initialProperties,
}: PropertiesCatalogContentProps) {
  const searchParams = useSearchParams();
  const initialGov = searchParams.get("gov") || "all";
  const initialDistrict = searchParams.get("district") || "all";
  const initialDeal = searchParams.get("deal") || "all";
  const initialType = searchParams.get("type") || "all";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [advancedFilters, setAdvancedFilters] = useState<FilterState | null>(null);

  const { showToast } = useToast();

  const categories = [
    { label: `الكل (${initialProperties.length})`, key: "الكل" },
    { label: "دمشق الفاخرة", key: "دمشق" },
    { label: "فلل يعفور", key: "يعفور" },
    { label: "مكاتب تجارية", key: "تجاري" },
  ];

  const filteredProperties = useMemo(() => {
    return initialProperties
      .filter((prop) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            prop.title_ar.toLowerCase().includes(q) ||
            prop.address.toLowerCase().includes(q) ||
            (prop.description_ar && prop.description_ar.toLowerCase().includes(q)) ||
            (prop.governorates?.name_ar &&
              prop.governorates.name_ar.toLowerCase().includes(q)) ||
            (prop.districts?.name_ar &&
              prop.districts.name_ar.toLowerCase().includes(q));
          if (!matches) return false;
        }

        // Quick category pill filter
        if (activeCategory === "دمشق") {
          if (!prop.governorates?.name_ar.includes("دمشق")) return false;
        }
        if (activeCategory === "يعفور") {
          if (
            !prop.districts?.name_ar.includes("يعفور") &&
            prop.property_type !== "villa"
          )
            return false;
        }
        if (activeCategory === "تجاري") {
          if (prop.property_type !== "office" && prop.property_type !== "shop")
            return false;
        }

        // URL query params
        if (initialGov !== "all") {
          const isUuid =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              initialGov
            );
          if (isUuid) {
            if (prop.governorate_id !== initialGov) return false;
          } else {
            const clean = initialGov.toLowerCase().replace(/-/g, " ");
            const nameEn = prop.governorates?.name_en.toLowerCase() || "";
            const nameAr = prop.governorates?.name_ar.toLowerCase() || "";
            if (!nameEn.includes(clean) && !nameAr.includes(clean)) return false;
          }
        }
        if (initialDistrict !== "all") {
          const isUuid =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              initialDistrict
            );
          if (isUuid) {
            if (prop.district_id !== initialDistrict) return false;
          } else {
            const clean = initialDistrict.toLowerCase().replace(/-/g, " ");
            const nameEn = prop.districts?.name_en.toLowerCase() || "";
            const nameAr = prop.districts?.name_ar.toLowerCase() || "";
            if (!nameEn.includes(clean) && !nameAr.includes(clean)) return false;
          }
        }
        if (initialDeal !== "all" && prop.transaction_type !== initialDeal) {
          return false;
        }
        if (initialType !== "all" && prop.property_type !== initialType) {
          return false;
        }

        // Advanced filters from drawer
        if (advancedFilters) {
          if (prop.transaction_type !== advancedFilters.dealType) return false;
          if (
            advancedFilters.governorate !== "all" &&
            prop.governorate_id !== advancedFilters.governorate
          ) {
            return false;
          }
          if (
            advancedFilters.district !== "all" &&
            prop.district_id !== advancedFilters.district
          ) {
            return false;
          }
          if (
            advancedFilters.propertyType !== "all" &&
            prop.property_type !== advancedFilters.propertyType
          ) {
            return false;
          }
          if (prop.price > advancedFilters.maxPrice) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "area-desc") return b.area - a.area;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
  }, [
    initialProperties,
    searchQuery,
    activeCategory,
    initialGov,
    initialDistrict,
    initialDeal,
    initialType,
    advancedFilters,
    sortBy,
  ]);

  return (
    <>
      <Header />

      <main className="flex flex-col relative w-full pt-16 bg-transparent">
        <div className="flex flex-col w-full">
          {/* Search & Fast Filter Ribbon */}
          <section className="px-4 py-space-sm bg-[#F8F6F0]/85 backdrop-blur-xl border-b border-[#A0BDDB]/35 shadow-xs">
            <div className="max-w-5xl lg:max-w-6xl mx-auto w-full">
              <div className="flex items-center gap-space-xs bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus-within:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 px-space-sm py-space-xs rounded-xl shadow-xs transition-all">
                <span className="material-symbols-outlined text-[#34211B]/60 text-[22px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث باسم الحي، الرمز العقاري، أو المواصفات..."
                  className="w-full bg-transparent text-[#34211B] font-body-md text-body-md focus:outline-none placeholder:text-[#34211B]/50"
                />
                <button
                  type="button"
                  id="toggleFilterBtn"
                  onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                  aria-label="فتح الفلاتر"
                  className={`flex items-center justify-center p-space-xs rounded-xl transition-transform active:scale-95 shadow-sm cursor-pointer ${
                    isFilterDrawerOpen
                      ? "bg-[#A0BDDB] text-[#34211B]"
                      : "bg-[#34211B] text-[#F8F6F0]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    tune
                  </span>
                </button>
              </div>

              {/* Quick Pill Badges & Layout View Switcher */}
              <div className="flex items-center justify-between mt-space-sm gap-space-xs">
                <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar py-space-xs">
                  {categories.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setActiveCategory(cat.key)}
                      className={`px-space-md py-1 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer ${
                        activeCategory === cat.key
                          ? "bg-[#34211B] text-[#F8F6F0] border border-[#A0BDDB]/40 shadow-xs font-bold"
                          : "bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/95 backdrop-blur-sm border border-[#A0BDDB]/30 text-[#34211B]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* View Switcher */}
                <div className="flex items-center bg-[#EDE7DC]/70 backdrop-blur-md border border-[#A0BDDB]/30 p-0.5 rounded-xl shrink-0">
                  <button
                    type="button"
                    id="viewGridBtn"
                    onClick={() => setViewMode("grid")}
                    aria-label="عرض شبكي"
                    className={`p-1 rounded-lg transition-all cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-[#34211B] text-[#F8F6F0] shadow-sm"
                        : "text-[#34211B]/60 hover:text-[#34211B]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      grid_view
                    </span>
                  </button>
                  <button
                    type="button"
                    id="viewListBtn"
                    onClick={() => setViewMode("list")}
                    aria-label="عرض قائمة"
                    className={`p-1 rounded-lg transition-all cursor-pointer ${
                      viewMode === "list"
                        ? "bg-[#34211B] text-[#F8F6F0] shadow-sm"
                        : "text-[#34211B]/60 hover:text-[#34211B]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      view_agenda
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Collapsible Comprehensive Filter Drawer */}
          <AdvancedFilterDrawer
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            initialGovernorates={initialLocations.governorates}
            initialDistricts={initialLocations.districts}
            onApply={(filters) => {
              setAdvancedFilters(filters);
              showToast("تم تطبيق الفلاتر بنجاح");
            }}
          />

          {/* Control & Sorting Bar */}
          <section className="max-w-5xl lg:max-w-6xl mx-auto w-full px-4 py-space-sm flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#A0BDDB]" />
              <span className="font-label-md text-label-md text-[#34211B] font-semibold">
                عرض {filteredProperties.length} عقار متاح في سوريا
              </span>
            </div>

            {/* Sorter */}
            <div className="relative bg-[#F8F6F0]/75 backdrop-blur-md border border-[#A0BDDB]/35 rounded-xl px-space-sm py-1 flex items-center gap-1 shadow-xs">
              <span className="font-label-sm text-label-sm text-[#34211B]/70">
                الترتيب:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[#34211B] font-label-md text-label-md focus:outline-none appearance-none pl-4 cursor-pointer font-bold"
              >
                <option value="newest">الأحدث وصولاً</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="area-desc">المساحة الأكبر أولاً</option>
              </select>
              <span className="material-symbols-outlined absolute left-1 top-1.5 text-[#34211B]/60 text-[16px] pointer-events-none">
                unfold_more
              </span>
            </div>
          </section>

          {/* Properties Main Catalog Grid */}
          <section
            className={`max-w-5xl lg:max-w-6xl mx-auto w-full px-4 pb-space-lg ${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md"
                : "space-y-space-sm"
            }`}
            id="propertiesContainer"
          >
            {filteredProperties.length > 0 ? (
              filteredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} layout={viewMode} />
              ))
            ) : (
              <div className="p-space-xl bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 rounded-2xl text-center flex flex-col items-center gap-space-sm shadow-[0_8px_32px_0_rgba(52,33,27,0.06)]">
                <span className="material-symbols-outlined text-[#34211B]/60 text-[48px]">
                  search_off
                </span>
                <span className="font-title-md text-title-md text-[#34211B] font-bold">
                  لا توجد نتائج مطابقة لبحثك
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("الكل");
                    setAdvancedFilters(null);
                  }}
                  className="px-space-md py-2 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-xl font-label-md text-label-md cursor-pointer shadow-sm border border-[#A0BDDB]/20 transition-colors"
                >
                  إعادة ضبط البحث
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredProperties.length > 0 && (
              <div className="pt-space-md flex justify-center col-span-full">
                <button
                  type="button"
                  onClick={() => showToast("تم تحميل جميع العقارات المسجلة حالياً")}
                  className="w-full max-w-sm h-11 bg-[#F8F6F0]/80 hover:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 text-[#34211B] font-title-sm text-title-sm rounded-xl flex items-center justify-center gap-space-xs transition-colors shadow-xs cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    refresh
                  </span>
                  <span>عرض المزيد من العقارات</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
