"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PropertyStatus } from "@/lib/supabase/types";
import {
  PropertyWithLocation,
  updatePropertyStatus,
  togglePropertyFlag,
  deleteProperty,
} from "@/lib/actions/properties";
import { useToast } from "@/components/ui/Toast";

interface AdminPropertyTableProps {
  initialProperties: PropertyWithLocation[];
}

const STATUS_LABELS: Record<
  PropertyStatus,
  { label: string; bg: string; text: string }
> = {
  available: { label: "متاح", bg: "bg-[#34211B]", text: "text-[#F8F6F0]" },
  draft: { label: "مسودة", bg: "bg-[#EDE7DC]", text: "text-[#34211B]" },
  reserved: { label: "محجوز", bg: "bg-[#A0BDDB]", text: "text-[#34211B]" },
  sold: { label: "مباع", bg: "bg-[#34211B]/80", text: "text-[#F8F6F0]" },
  rented: { label: "مؤجر", bg: "bg-[#A0BDDB]/70", text: "text-[#34211B]" },
  hidden: { label: "مخفي", bg: "bg-red-800/80", text: "text-[#F8F6F0]" },
};

export function AdminPropertyTable({ initialProperties }: AdminPropertyTableProps) {
  const [properties, setProperties] = useState<PropertyWithLocation[]>(initialProperties);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [propertyToDelete, setPropertyToDelete] = useState<PropertyWithLocation | null>(null);
  const { showToast } = useToast();

  const handleStatusChange = async (id: string, newStatus: PropertyStatus) => {
    // Optimistic update
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    const res = await updatePropertyStatus(id, newStatus);
    if (res.success) {
      showToast(`تم تغيير حالة العقار إلى: ${STATUS_LABELS[newStatus].label}`);
    } else {
      showToast(res.error || "تعذر تعديل الحالة");
      // Revert if error
      setProperties(initialProperties);
    }
  };

  const handleToggleFlag = async (
    id: string,
    field: "is_featured" | "is_offer",
    currentVal: boolean
  ) => {
    const newVal = !currentVal;
    // Optimistic update
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: newVal } : p))
    );

    const res = await togglePropertyFlag(id, field, newVal);
    if (res.success) {
      showToast(
        field === "is_featured"
          ? newVal
            ? "تم تمييز العقار في الصفحة الرئيسية"
            : "تمت إزالة تمييز العقار"
          : newVal
          ? "تمت إضافة العقار إلى العروض الحصرية"
          : "تمت إزالة العقار من العروض"
      );
    } else {
      showToast(res.error || "تعذر تعديل التمييز");
      setProperties(initialProperties);
    }
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    const id = propertyToDelete.id;
    setDeletingId(id);

    try {
      const res = await deleteProperty(id);
      if (res.success) {
        setProperties((prev) => prev.filter((p) => p.id !== id));
        showToast("تم حذف العقار نهائياً من قاعدة البيانات");
      } else {
        showToast(res.error || "فشل حذف العقار");
      }
    } catch {
      showToast("حدث خطأ غير متوقع أثناء الحذف");
    } finally {
      setDeletingId(null);
      setPropertyToDelete(null);
    }
  };

  const filteredProperties = properties.filter((p) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = p.title_ar?.toLowerCase().includes(q) || false;
    const govMatch = p.governorates?.name_ar?.toLowerCase().includes(q) || false;
    const distMatch = p.districts?.name_ar?.toLowerCase().includes(q) || false;
    const addressMatch = p.address?.toLowerCase().includes(q) || false;
    const idMatch = p.id.toLowerCase().includes(q);
    return titleMatch || govMatch || distMatch || addressMatch || idMatch;
  });

  return (
    <>
      <div className="bg-[#F8F6F0]/80 backdrop-blur-xl rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.08)] flex flex-col gap-space-sm border border-[#A0BDDB]/35">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[#34211B] text-[20px]">
              apartment
            </span>
            <h2 className="font-title-sm text-title-sm text-[#34211B] font-bold">
              إدارة العقارات المعروضة ({properties.length})
            </h2>
          </div>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-1 text-label-sm font-label-sm text-[#34211B] hover:text-[#34211B]/80 font-bold underline cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ عقار جديد</span>
          </Link>
        </div>

        {/* Quick Search Input */}
        <div className="relative">
          <input
            type="text"
            id="propSearchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في العقارات المسجلة بالاسم، المحافظة، الحي..."
            className="w-full bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] backdrop-blur-md px-space-sm py-2 pr-9 rounded-xl text-[#34211B] font-body-sm text-body-sm focus:outline-none border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 shadow-inner transition-all placeholder:text-[#34211B]/40"
          />
          <span className="material-symbols-outlined absolute right-2.5 top-2 text-[#34211B]/60 text-[18px]">
            search
          </span>
        </div>

        {/* Properties List */}
        <div className="space-y-space-xs mt-1" id="propertiesList">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-8 px-4 bg-[#EDE7DC]/40 backdrop-blur-md rounded-2xl border border-dashed border-[#A0BDDB]/50">
              <span className="material-symbols-outlined text-[36px] text-[#34211B]/40 mb-2">
                home_work
              </span>
              <p className="font-title-sm text-title-sm text-[#34211B] font-bold">
                {properties.length === 0
                  ? "لا توجد عقارات مسجلة بعد في قاعدة البيانات."
                  : "لا توجد عقارات مطابقة لكلمة البحث."}
              </p>
              <p className="font-body-sm text-body-sm text-[#34211B]/60 mt-1">
                {properties.length === 0
                  ? "يمكنك البدء بإضافة العقار الأول بالنقر على الزر أدناه."
                  : "جرب البحث باسم محافظة أخرى أو جزء من اسم العقار."}
              </p>
              {properties.length === 0 && (
                <Link
                  href="/admin/properties/new"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-xl font-title-sm text-title-sm shadow-sm transition-colors border border-[#A0BDDB]/20"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>إضافة أول عقار للمنصة</span>
                </Link>
              )}
            </div>
          ) : (
            filteredProperties.map((prop) => {
              const currentStatus = STATUS_LABELS[prop.status] || STATUS_LABELS.available;
              const locationStr = [
                prop.governorates?.name_ar,
                prop.districts?.name_ar,
              ]
                .filter(Boolean)
                .join(" - ");

              return (
                <div
                  key={prop.id}
                  className="p-space-xs bg-[#EDE7DC]/55 backdrop-blur-md rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs hover:bg-[#F8F6F0]/90 transition-colors border border-[#A0BDDB]/30 shadow-xs"
                >
                  {/* Property Info */}
                  <div className="flex items-center gap-space-xs flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-[#F8F6F0]/85 backdrop-blur-md border border-[#A0BDDB]/35 flex items-center justify-center shrink-0 text-[#34211B] shadow-xs">
                      <span className="material-symbols-outlined text-[24px]">
                        {prop.property_type === "villa"
                          ? "villa"
                          : prop.property_type === "office"
                          ? "desk"
                          : prop.property_type === "land"
                          ? "landscape"
                          : "apartment"}
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-label-sm text-label-sm font-bold text-[#34211B]">
                          #{prop.id.substring(0, 6)}
                        </span>
                        <span className="text-[#34211B] font-title-sm text-title-sm font-bold line-clamp-1">
                          {prop.title_ar}
                        </span>
                        {prop.is_featured && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-[#A0BDDB] text-[#34211B] text-[10px] font-bold border border-[#A0BDDB]/40">
                            ★ مميز
                          </span>
                        )}
                        {prop.is_offer && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-[#34211B] text-[#F8F6F0] text-[10px] font-bold">
                            عرض خاص
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-label-sm text-[#34211B]/60 flex-wrap mt-0.5 font-medium">
                        <span>{locationStr || prop.address}</span>
                        <span>•</span>
                        <span className="font-bold text-[#34211B]">
                          {Number(prop.price).toLocaleString("en-US")} {prop.currency}
                        </span>
                        <span>•</span>
                        <span>{prop.area} م²</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#A0BDDB]/25 text-[#34211B] text-[10px] font-bold border border-[#A0BDDB]/40">
                          {prop.transaction_type === "sale" ? "للبيع" : "للإيجار"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Controls */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    {/* Featured Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleFlag(prop.id, "is_featured", prop.is_featured)}
                      title={prop.is_featured ? "إلغاء التمييز" : "تمييز في الرئيسية"}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        prop.is_featured
                          ? "bg-[#A0BDDB] text-[#34211B] shadow-sm font-bold"
                          : "bg-[#F8F6F0]/80 border border-[#A0BDDB]/30 text-[#34211B]/60 hover:text-[#34211B]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        star
                      </span>
                    </button>

                    {/* Offer Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleFlag(prop.id, "is_offer", prop.is_offer)}
                      title={prop.is_offer ? "إلغاء العرض الخاص" : "إضافة للعروض الحصرية"}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        prop.is_offer
                          ? "bg-[#34211B] text-[#F8F6F0] shadow-sm"
                          : "bg-[#F8F6F0]/80 border border-[#A0BDDB]/30 text-[#34211B]/60 hover:text-[#34211B]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        local_offer
                      </span>
                    </button>

                    {/* Status Selector Dropdown */}
                    <select
                      value={prop.status}
                      onChange={(e) =>
                        handleStatusChange(prop.id, e.target.value as PropertyStatus)
                      }
                      className={`px-2 py-1 rounded-lg text-label-sm font-label-sm cursor-pointer border border-[#A0BDDB]/30 focus:outline-none ${currentStatus.bg} ${currentStatus.text}`}
                    >
                      <option value="available" className="bg-[#F8F6F0] text-[#34211B]">
                        متاح للعرض
                      </option>
                      <option value="reserved" className="bg-[#F8F6F0] text-[#34211B]">
                        محجوز
                      </option>
                      <option value="sold" className="bg-[#F8F6F0] text-[#34211B]">
                        تم البيع
                      </option>
                      <option value="rented" className="bg-[#F8F6F0] text-[#34211B]">
                        تم التأجير
                      </option>
                      <option value="draft" className="bg-[#F8F6F0] text-[#34211B]">
                        مسودة
                      </option>
                      <option value="hidden" className="bg-[#F8F6F0] text-[#34211B]">
                        مخفي
                      </option>
                    </select>

                    {/* Edit Button */}
                    <Link
                      href={`/admin/properties/${prop.id}/edit`}
                      title="تعديل بيانات العقار"
                      className="w-8 h-8 rounded-lg bg-[#F8F6F0]/80 border border-[#A0BDDB]/30 hover:bg-[#34211B] hover:text-[#F8F6F0] flex items-center justify-center text-[#34211B]/80 transition-colors shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </Link>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setPropertyToDelete(prop)}
                      title="حذف العقار"
                      className="w-8 h-8 rounded-lg bg-[#F8F6F0]/80 border border-[#A0BDDB]/30 hover:bg-red-600 hover:text-white flex items-center justify-center text-[#34211B]/80 transition-colors cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (Step 8) */}
      {propertyToDelete && (
        <div
          dir="rtl"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#34211B]/40 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-[#F8F6F0]/95 backdrop-blur-2xl rounded-2xl p-space-md shadow-[0_16px_48px_rgba(52,33,27,0.25)] border border-[#A0BDDB]/45 space-y-space-sm">
            <div className="flex items-center gap-space-xs text-red-600">
              <span className="material-symbols-outlined text-[28px]">
                warning
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-[#34211B]">
                تأكيد حذف العقار
              </h3>
            </div>

            <p className="font-body-sm text-body-sm text-[#34211B]">
              هل أنت متأكد من رغبتك في حذف العقار:
              <strong className="block font-title-sm text-[#34211B] mt-1 font-bold">
                &quot;{propertyToDelete.title_ar}&quot;
              </strong>
            </p>

            <div className="p-space-xs rounded-xl bg-red-50/80 border border-red-200 text-red-700 text-label-md">
              <span className="material-symbols-outlined text-[16px] inline-block align-middle ml-1">
                info
              </span>
              تحذير: لا يمكن التراجع عن هذا الإجراء وسيتم حذف بيانات العقار نهائياً من قاعدة بيانات المنصة.
            </div>

            <div className="flex items-center justify-end gap-space-xs pt-2">
              <button
                type="button"
                onClick={() => setPropertyToDelete(null)}
                disabled={Boolean(deletingId)}
                className="px-4 h-10 rounded-xl bg-[#EDE7DC] text-[#34211B] font-title-sm text-title-sm hover:bg-[#EDE7DC]/80 transition-colors cursor-pointer disabled:opacity-50 border border-[#A0BDDB]/30"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
                className="px-5 h-10 rounded-xl bg-red-700 text-[#F8F6F0] font-title-sm text-title-sm flex items-center gap-1.5 hover:opacity-90 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري الحذف...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      delete_forever
                    </span>
                    <span>تأكيد الحذف النهائي</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
