"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { PropertyCard } from "@/components/property/PropertyCard";
import {
  AdvancedFilterDrawer,
  FilterState,
} from "@/components/search/AdvancedFilterDrawer";
import { PROPERTIES, Property } from "@/lib/data";
import { ToastProvider, useToast } from "@/components/ui/Toast";

function PropertiesCatalogContent() {
  const searchParams = useSearchParams();
  const initialGov = searchParams.get("gov") || "all";
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
    { label: "الكل (24)", key: "الكل" },
    { label: "دمشق الفاخرة", key: "دمشق" },
    { label: "فلل يعفور", key: "يعفور" },
    { label: "مكاتب تجارية", key: "تجاري" },
  ];

  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter((prop) => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          prop.title.toLowerCase().includes(q) ||
          prop.location.toLowerCase().includes(q) ||
          prop.district.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Quick category pill filter
      if (activeCategory === "دمشق" && prop.governorate !== "damascus") {
        return false;
      }
      if (activeCategory === "يعفور" && prop.district !== "yaafour") {
        return false;
      }
      if (activeCategory === "تجاري" && prop.propertyType !== "office" && prop.propertyType !== "shop") {
        return false;
      }

      // URL query params
      if (initialGov !== "all" && prop.governorate !== initialGov) {
        return false;
      }
      if (initialDeal !== "all" && prop.dealType !== initialDeal) {
        return false;
      }
      if (initialType !== "all" && prop.propertyType !== initialType) {
        return false;
      }

      // Advanced filters from drawer
      if (advancedFilters) {
        if (prop.dealType !== advancedFilters.dealType) return false;
        if (
          advancedFilters.governorate !== "all" &&
          prop.governorate !== advancedFilters.governorate
        ) {
          return false;
        }
        if (
          advancedFilters.district !== "all" &&
          prop.district !== advancedFilters.district
        ) {
          return false;
        }
        if (
          advancedFilters.propertyType !== "all" &&
          prop.propertyType !== advancedFilters.propertyType
        ) {
          return false;
        }
        if (prop.priceNumeric > advancedFilters.maxPrice) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.priceNumeric - b.priceNumeric;
      if (sortBy === "price-desc") return b.priceNumeric - a.priceNumeric;
      return 0;
    });
  }, [searchQuery, activeCategory, initialGov, initialDeal, initialType, advancedFilters, sortBy]);

  return (
    <>
      <Header />

      <main className="flex flex-col relative w-full pt-16 pb-20 bg-surface">
        <div className="flex flex-col w-full">
          {/* Search & Fast Filter Ribbon */}
          <section className="px-gutter-mobile py-space-sm bg-surface-container-lowest shadow-sm">
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded-xl">
              <span className="material-symbols-outlined text-outline text-[22px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الحي، الرمز العقاري، أو المواصفات..."
                className="w-full bg-transparent text-on-surface font-body-md text-body-md focus:outline-none placeholder:text-outline"
              />
              <button
                type="button"
                id="toggleFilterBtn"
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                aria-label="فتح الفلاتر"
                className={`flex items-center justify-center p-space-xs rounded-lg transition-transform active:scale-95 shadow-sm cursor-pointer ${
                  isFilterDrawerOpen
                    ? "bg-secondary-container text-on-primary"
                    : "bg-primary text-on-primary"
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
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-surface-container p-0.5 rounded-lg shrink-0">
                <button
                  type="button"
                  id="viewGridBtn"
                  onClick={() => setViewMode("grid")}
                  aria-label="عرض شبكي"
                  className={`p-1 rounded transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-outline"
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
                  className={`p-1 rounded transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-outline"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    view_agenda
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Collapsible Comprehensive Filter Drawer */}
          <AdvancedFilterDrawer
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            onApply={(filters) => {
              setAdvancedFilters(filters);
              showToast("تم تطبيق الفلاتر بنجاح");
            }}
          />

          {/* Control & Sorting Bar */}
          <section className="px-gutter-mobile py-space-sm flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              <span className="font-label-md text-label-md text-on-surface-variant">
                عرض {filteredProperties.length} عقار متاح في سوريا
              </span>
            </div>

            {/* Sorter */}
            <div className="relative bg-surface-container-low rounded-lg px-space-sm py-1 flex items-center gap-1">
              <span className="font-label-sm text-label-sm text-outline">
                الترتيب:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-primary font-label-md text-label-md focus:outline-none appearance-none pl-4 cursor-pointer"
              >
                <option value="newest">الأحدث وصولاً</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="area-desc">المساحة الأكبر أولاً</option>
              </select>
              <span className="material-symbols-outlined absolute left-1 top-1.5 text-on-surface-variant text-[16px] pointer-events-none">
                unfold_more
              </span>
            </div>
          </section>

          {/* Properties Main Catalog Grid */}
          <section
            className={`px-gutter-mobile pb-space-lg ${
              viewMode === "grid" ? "space-y-space-md" : "space-y-space-sm"
            }`}
            id="propertiesContainer"
          >
            {filteredProperties.length > 0 ? (
              filteredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} layout={viewMode} />
              ))
            ) : (
              <div className="p-space-xl bg-surface-container-lowest rounded-xl text-center flex flex-col items-center gap-space-sm">
                <span className="material-symbols-outlined text-outline text-[48px]">
                  search_off
                </span>
                <span className="font-title-md text-title-md text-on-surface">
                  لا توجد نتائج مطابقة لبحثك
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("الكل");
                    setAdvancedFilters(null);
                  }}
                  className="px-space-md py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md cursor-pointer"
                >
                  إعادة ضبط البحث
                </button>
              </div>
            )}

            {/* Load More Button */}
            {filteredProperties.length > 0 && (
              <div className="pt-space-md flex justify-center">
                <button
                  type="button"
                  onClick={() => showToast("تم تحميل جميع العقارات المسجلة حالياً")}
                  className="w-full max-w-sm h-11 bg-surface-container-low hover:bg-surface-container text-on-surface font-title-sm text-title-sm rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer"
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

      <BottomNav />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <ToastProvider>
      <Suspense fallback={<div className="p-4 text-center">جاري التحميل...</div>}>
        <PropertiesCatalogContent />
      </Suspense>
    </ToastProvider>
  );
}
