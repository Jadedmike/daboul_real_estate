"use client";

import React, { useState } from "react";
import { ADMIN_PROPERTIES, AdminProperty } from "@/lib/data";
import { useToast } from "@/components/ui/Toast";

export function AdminPropertyTable() {
  const [properties, setProperties] = useState<AdminProperty[]>(ADMIN_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();

  const handleStatusChange = (
    id: string,
    newStatus: "متاح" | "محجوز" | "مباع"
  ) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
    showToast(`تم تغيير حالة العقار إلى: ${newStatus}`);
  };

  const filteredProperties = properties.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary-container text-[20px]">
            apartment
          </span>
          <h2 className="font-title-sm text-title-sm text-on-surface">
            إدارة العقارات المعروضة
          </h2>
        </div>
        <button
          type="button"
          onClick={() => showToast("فتح نموذج إضافة عقار جديد")}
          className="text-label-sm font-label-sm text-secondary-container hover:underline cursor-pointer"
        >
          + عقار جديد
        </button>
      </div>

      {/* Quick Search Input */}
      <div className="relative">
        <input
          type="text"
          id="propSearchInput"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="بحث في العقارات المسجلة بالاسم أو الرمز..."
          className="w-full bg-surface-container-low px-space-sm py-2 pr-9 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container"
        />
        <span className="material-symbols-outlined absolute right-2.5 top-2 text-outline text-[18px]">
          search
        </span>
      </div>

      {/* Properties List */}
      <div className="space-y-space-xs mt-1" id="propertiesList">
        {filteredProperties.map((prop) => (
          <div
            key={prop.id}
            className="p-space-xs bg-surface-container-low rounded-lg flex items-center justify-between gap-space-xs hover:bg-surface-container transition-colors"
          >
            <div className="flex items-center gap-space-xs">
              <img
                src={prop.thumbnail}
                alt={prop.title}
                className="w-12 h-12 rounded object-cover shrink-0"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-label-sm text-label-sm font-bold text-primary">
                    {prop.code}
                  </span>
                  <span className="text-on-surface font-title-sm text-title-sm line-clamp-1">
                    {prop.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-label-sm text-outline">
                  <span>{prop.location}</span>
                  <span>•</span>
                  <span>{prop.price}</span>
                  <span className="px-1 py-0.2 rounded bg-surface-container-high text-on-surface text-[10px]">
                    {prop.deal}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Selector Dropdown */}
            <div className="flex items-center gap-1 shrink-0">
              <select
                value={prop.status}
                onChange={(e) =>
                  handleStatusChange(
                    prop.id,
                    e.target.value as "متاح" | "محجوز" | "مباع"
                  )
                }
                className={`px-2 py-1 rounded text-label-sm font-label-sm cursor-pointer border-0 focus:outline-none ${
                  prop.status === "متاح"
                    ? "bg-primary text-on-primary"
                    : prop.status === "محجوز"
                    ? "bg-secondary-container text-on-primary"
                    : "bg-on-surface-variant text-on-primary"
                }`}
              >
                <option value="متاح" className="bg-white text-black">
                  متاح
                </option>
                <option value="محجوز" className="bg-white text-black">
                  محجوز
                </option>
                <option value="مباع" className="bg-white text-black">
                  مباع
                </option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
