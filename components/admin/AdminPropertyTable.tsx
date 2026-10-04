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
  available: { label: "متاح", bg: "bg-primary", text: "text-on-primary" },
  draft: { label: "مسودة", bg: "bg-surface-container-high", text: "text-on-surface-variant" },
  reserved: { label: "محجوز", bg: "bg-secondary-container", text: "text-on-primary" },
  sold: { label: "مباع", bg: "bg-on-surface-variant", text: "text-on-primary" },
  rented: { label: "مؤجر", bg: "bg-outline", text: "text-white" },
  hidden: { label: "مخفي", bg: "bg-error/80", text: "text-white" },
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
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary-container text-[20px]">
              apartment
            </span>
            <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
              إدارة العقارات المعروضة ({properties.length})
            </h2>
          </div>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-1 text-label-sm font-label-sm text-secondary-container hover:underline cursor-pointer"
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
            className="w-full bg-surface-container-low px-space-sm py-2 pr-9 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container border border-outline-variant/30"
          />
          <span className="material-symbols-outlined absolute right-2.5 top-2 text-outline text-[18px]">
            search
          </span>
        </div>

        {/* Properties List */}
        <div className="space-y-space-xs mt-1" id="propertiesList">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-8 px-4 bg-surface-container-low rounded-xl border border-dashed border-outline-variant/40">
              <span className="material-symbols-outlined text-[36px] text-outline mb-2">
                home_work
              </span>
              <p className="font-title-sm text-title-sm text-on-surface">
                {properties.length === 0
                  ? "لا توجد عقارات مسجلة بعد في قاعدة البيانات."
                  : "لا توجد عقارات مطابقة لكلمة البحث."}
              </p>
              <p className="font-body-sm text-body-sm text-outline mt-1">
                {properties.length === 0
                  ? "يمكنك البدء بإضافة العقار الأول بالنقر على الزر أدناه."
                  : "جرب البحث باسم محافظة أخرى أو جزء من اسم العقار."}
              </p>
              {properties.length === 0 && (
                <Link
                  href="/admin/properties/new"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-lg font-title-sm text-title-sm shadow-sm hover:bg-primary-container transition-colors"
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
                  className="p-space-xs bg-surface-container-low rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs hover:bg-surface-container transition-colors border border-outline-variant/20"
                >
                  {/* Property Info */}
                  <div className="flex items-center gap-space-xs flex-1 min-w-0">
                    <div className="w-12 h-12 rounded bg-surface-container-highest flex items-center justify-center shrink-0 text-primary">
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
                        <span className="font-label-sm text-label-sm font-bold text-primary">
                          #{prop.id.substring(0, 6)}
                        </span>
                        <span className="text-on-surface font-title-sm text-title-sm font-bold line-clamp-1">
                          {prop.title_ar}
                        </span>
                        {prop.is_featured && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                            ★ مميز
                          </span>
                        )}
                        {prop.is_offer && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-secondary-container text-on-primary text-[10px] font-bold">
                            عرض خاص
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-label-sm text-outline flex-wrap mt-0.5">
                        <span>{locationStr || prop.address}</span>
                        <span>•</span>
                        <span className="font-bold text-on-surface">
                          {Number(prop.price).toLocaleString("en-US")} {prop.currency}
                        </span>
                        <span>•</span>
                        <span>{prop.area} م²</span>
                        <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface text-[10px] font-bold">
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
                          ? "bg-secondary-fixed text-on-secondary-fixed shadow-sm"
                          : "bg-surface-container text-outline hover:text-secondary-container"
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
                          ? "bg-secondary-container text-on-primary shadow-sm"
                          : "bg-surface-container text-outline hover:text-secondary-container"
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
                      className={`px-2 py-1 rounded-lg text-label-sm font-label-sm cursor-pointer border-0 focus:outline-none ${currentStatus.bg} ${currentStatus.text}`}
                    >
                      <option value="available" className="bg-white text-black">
                        متاح للعرض
                      </option>
                      <option value="reserved" className="bg-white text-black">
                        محجوز
                      </option>
                      <option value="sold" className="bg-white text-black">
                        تم البيع
                      </option>
                      <option value="rented" className="bg-white text-black">
                        تم التأجير
                      </option>
                      <option value="draft" className="bg-white text-black">
                        مسودة
                      </option>
                      <option value="hidden" className="bg-white text-black">
                        مخفي
                      </option>
                    </select>

                    {/* Edit Button */}
                    <Link
                      href={`/admin/properties/${prop.id}/edit`}
                      title="تعديل بيانات العقار"
                      className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
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
                      className="w-8 h-8 rounded-lg bg-surface-container hover:bg-error-container/30 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors cursor-pointer"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-space-md shadow-2xl border border-outline-variant/30 space-y-space-sm">
            <div className="flex items-center gap-space-xs text-error">
              <span className="material-symbols-outlined text-[28px]">
                warning
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                تأكيد حذف العقار
              </h3>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface">
              هل أنت متأكد من رغبتك في حذف العقار:
              <strong className="block font-title-sm text-primary mt-1">
                &quot;{propertyToDelete.title_ar}&quot;
              </strong>
            </p>

            <div className="p-space-xs rounded-xl bg-error-container/20 border border-error/30 text-error text-label-md">
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
                className="px-4 h-10 rounded-xl bg-surface-container text-on-surface font-title-sm text-title-sm hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={Boolean(deletingId)}
                className="px-5 h-10 rounded-xl bg-error text-white font-title-sm text-title-sm flex items-center gap-1.5 hover:opacity-90 shadow-md transition-all cursor-pointer disabled:opacity-50"
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
