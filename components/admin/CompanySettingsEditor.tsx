"use client";

import React, { useState } from "react";
import type { CompanySettings } from "@/lib/types/settings";
import { updateCompanySettings } from "@/lib/actions/settings";
import { useToast } from "@/components/ui/Toast";

interface CompanySettingsEditorProps {
  initialSettings: CompanySettings;
}

export function CompanySettingsEditor({
  initialSettings,
}: CompanySettingsEditorProps) {
  const [formData, setFormData] = useState<CompanySettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { showToast } = useToast();

  const handleChange = (
    field: keyof CompanySettings,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setErrorMessage(null);
    setIsSaving(true);

    try {
      const res = await updateCompanySettings(formData);
      if (!res.success) {
        const err = res.error || "فشل حفظ إعدادات الشركة.";
        setErrorMessage(err);
        showToast(err);
      } else {
        showToast(res.message || "تم حفظ إعدادات الشركة بنجاح.");
      }
    } catch (err) {
      console.error("Save error:", err);
      const fallback = "حدث خطأ غير متوقع أثناء حفظ الإعدادات.";
      setErrorMessage(fallback);
      showToast(fallback);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary-container text-[24px]">
            storefront
          </span>
          <div>
            <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
              بيانات وإعدادات الشركة والتواصل العام
            </h2>
            <span className="font-label-sm text-label-sm text-outline">
              المعلومات المعروضة في ترويسة وتذييل الموقع، صفحات التواصل، وواتساب
            </span>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-label-sm font-label-sm bg-secondary-fixed text-on-secondary-fixed font-bold">
          إعدادات حية
        </span>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg font-body-sm text-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-space-md">
        {/* Row 1: Company Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
              اسم الشركة باللغة العربية
            </label>
            <input
              type="text"
              required
              value={formData.company_name_ar}
              onChange={(e) => handleChange("company_name_ar", e.target.value)}
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
              اسم الشركة باللغة الإنجليزية
            </label>
            <input
              type="text"
              required
              value={formData.company_name_en}
              onChange={(e) => handleChange("company_name_en", e.target.value)}
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container"
              dir="ltr"
            />
          </div>
        </div>

        {/* Row 2: Phone & WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
              رقم الهاتف المباشر (tel:)
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+963 11 214 0000"
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container font-mono"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
              رقم واتساب المعتمد للمحادثات (wa.me)
            </label>
            <input
              type="text"
              required
              value={formData.whatsapp}
              onChange={(e) => handleChange("whatsapp", e.target.value)}
              placeholder="+963 944 000 000"
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container font-mono"
              dir="ltr"
            />
          </div>
        </div>

        {/* Row 3: Email & Working Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
              البريد الإلكتروني الرسمي
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="info@daboul-realestate.sy"
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
              أوقات وساعات العمل
            </label>
            <input
              type="text"
              required
              value={formData.working_hours}
              onChange={(e) => handleChange("working_hours", e.target.value)}
              placeholder="السبت - الخميس: 9:00 ص - 8:00 م"
              className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container"
            />
          </div>
        </div>

        {/* Row 4: Address */}
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
            العنوان والمقر الرئيسي
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="دمشق - المزة فيلات غربية / شارع دعبول الرئيسي"
            className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container"
          />
        </div>

        {/* Row 5: Short Description */}
        <div>
          <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">
            نبذة مختصرة عن الشركة (تظهر في التذييل وصفحة من نحن ومحركات البحث)
          </label>
          <textarea
            rows={3}
            required
            value={formData.short_description}
            onChange={(e) => handleChange("short_description", e.target.value)}
            className="w-full bg-surface-container-low px-space-sm py-2 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-space-xs flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="h-11 px-space-lg bg-primary hover:bg-primary-container text-on-primary font-title-sm text-title-sm rounded-lg flex items-center justify-center gap-space-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>جاري الحفظ...</span>
              </span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  save
                </span>
                <span>حفظ إعدادات الشركة</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
