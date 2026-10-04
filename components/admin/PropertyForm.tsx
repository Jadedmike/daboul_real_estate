"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Property,
  PropertyStatus,
  TransactionType,
  Governorate,
  District,
  PropertyImage,
} from "@/lib/supabase/types";
import {
  createProperty,
  updateProperty,
  uploadPropertyImage,
  PropertyFormData,
} from "@/lib/actions/properties";
import {
  PropertyImageManager,
  PreviewImage,
} from "@/components/admin/PropertyImageManager";

interface PropertyFormProps {
  initialData?: Property;
  initialImages?: PropertyImage[];
  governorates: Governorate[];
  districts: District[];
  isEditing?: boolean;
}

const PROPERTY_TYPES = [
  { value: "apartment", label: "شقة سكنية" },
  { value: "villa", label: "فيلا مستقلة / قصر" },
  { value: "penthouse", label: "بنتهاوس فاخر" },
  { value: "office", label: "مكتب إداري / مقر شركة" },
  { value: "shop", label: "محل / مساحة تجارية" },
  { value: "land", label: "أرض استثمارية / بناء" },
  { value: "chalet", label: "شاليه / مصيف" },
  { value: "building", label: "مبنى تجاري / سكني بالكامل" },
];

const STATUS_OPTIONS: { value: PropertyStatus; label: string; desc: string }[] = [
  { value: "available", label: "متاح للعرض", desc: "ظاهر في قوائم البحث والموقع العام" },
  { value: "draft", label: "مسودة غير منشورة", desc: "محفوظ للإدارة فقط ولا يظهر للجمهور" },
  { value: "reserved", label: "محجوز للعميل", desc: "قيد إجراءات التعاقد أو المعاينة" },
  { value: "sold", label: "تم البيع بنجاح", desc: "صفقة مكتملة من خلال المكتب" },
  { value: "rented", label: "تم التأجير", desc: "مؤجر حالياً" },
  { value: "hidden", label: "مخفي ومؤرشف", desc: "تم إيقاف ظهوره مؤقتاً" },
];

export function PropertyForm({
  initialData,
  initialImages = [],
  governorates,
  districts,
  isEditing = false,
}: PropertyFormProps) {
  const router = useRouter();

  // Selected preview images for property creation flow
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

  // Form state
  const [formData, setFormData] = useState<PropertyFormData>({
    title_ar: initialData?.title_ar || "",
    title_en: initialData?.title_en || "",
    description_ar: initialData?.description_ar || "",
    description_en: initialData?.description_en || "",
    property_type: initialData?.property_type || "apartment",
    transaction_type: initialData?.transaction_type || "sale",
    governorate_id: initialData?.governorate_id || (governorates[0]?.id || ""),
    district_id: initialData?.district_id || "",
    address: initialData?.address || "",
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
    price: initialData?.price || 0,
    currency: initialData?.currency || "USD",
    area: initialData?.area || 0,
    bedrooms: initialData?.bedrooms || 0,
    bathrooms: initialData?.bathrooms || 0,
    floor: initialData?.floor ?? null,
    total_floors: initialData?.total_floors ?? null,
    orientation: initialData?.orientation || "",
    legal_status: initialData?.legal_status || "طابو أخضر 2400 سهم",
    status: initialData?.status || "available",
    is_featured: initialData?.is_featured ?? false,
    is_offer: initialData?.is_offer ?? false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter districts based on currently selected governorate (CRITICAL DEPENDENCY)
  const availableDistricts = useMemo(() => {
    if (!formData.governorate_id) return [];
    return districts.filter((d) => d.governorate_id === formData.governorate_id);
  }, [districts, formData.governorate_id]);

  // Handle governorate change: resets district selection
  const handleGovernorateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGovId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      governorate_id: newGovId,
      district_id: "", // Reset district selection when governorate changes
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic frontend validations
    if (!formData.title_ar.trim()) {
      setErrorMessage("يرجى إدخال عنوان العقار باللغة العربية.");
      return;
    }
    if (!formData.description_ar.trim()) {
      setErrorMessage("يرجى إدخال وصف العقار باللغة العربية.");
      return;
    }
    if (!formData.governorate_id) {
      setErrorMessage("يرجى اختيار المحافظة.");
      return;
    }
    if (!formData.district_id) {
      setErrorMessage("يرجى اختيار المنطقة أو الحي.");
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage("يرجى إدخال العنوان التفصيلي.");
      return;
    }
    if (formData.price <= 0) {
      setErrorMessage("يرجى تحديد السعر بشكل صحيح أكبر من الصفر.");
      return;
    }
    if (formData.area <= 0) {
      setErrorMessage("يرجى تحديد المساحة بالمتر المربع بشكل صحيح.");
      return;
    }

    setIsLoading(true);

    try {
      if (isEditing && initialData?.id) {
        const result = await updateProperty(initialData.id, formData);
        if (!result.success) {
          setErrorMessage(result.error || "تعذر تحديث بيانات العقار.");
          setIsLoading(false);
          return;
        }
        setSuccessMessage("تم حفظ وتحديث بيانات العقار بنجاح في قاعدة البيانات.");
      } else {
        const result = await createProperty(formData);
        if (!result.success || !result.data) {
          setErrorMessage(result.error || "تعذر إضافة العقار.");
          setIsLoading(false);
          return;
        }

        const newPropertyId = result.data.id;

        // Upload any selected preview images sequentially
        if (previewImages.length > 0) {
          for (let i = 0; i < previewImages.length; i++) {
            const pImg = previewImages[i];
            const imgFormData = new FormData();
            imgFormData.append("file", pImg.file);
            imgFormData.append("is_cover", String(pImg.is_cover));
            imgFormData.append("sort_order", String(i));
            await uploadPropertyImage(newPropertyId, imgFormData);
          }
        }

        setSuccessMessage(
          previewImages.length > 0
            ? "تمت إضافة العقار الجديد ورفع الصور بنجاح."
            : "تمت إضافة العقار الجديد بنجاح إلى قاعدة البيانات."
        );
      }

      // Smooth redirect back to admin properties table
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1200);
    } catch {
      setErrorMessage("حدث خطأ غير متوقع أثناء معالجة الطلب.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-space-md" dir="rtl">
      {/* Notifications */}
      {errorMessage && (
        <div
          role="alert"
          className="p-space-md rounded-xl bg-error-container/20 border border-error/30 text-error flex items-start gap-2.5 text-body-sm shadow-sm"
        >
          <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5">
            error
          </span>
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {successMessage && (
        <div
          role="alert"
          className="p-space-md rounded-xl bg-secondary-fixed/30 border border-secondary/40 text-on-secondary-fixed flex items-start gap-2.5 text-body-sm shadow-sm"
        >
          <span className="material-symbols-outlined text-[22px] text-secondary shrink-0 mt-0.5">
            check_circle
          </span>
          <div className="flex-1 font-medium">
            {successMessage}
            <span className="block text-label-sm text-outline mt-1">
              جاري الانتقال إلى لوحة إدارة العقارات...
            </span>
          </div>
        </div>
      )}

      {/* 1. Basic Information Section */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 space-y-space-sm">
        <div className="flex items-center gap-space-xs border-b border-outline-variant/20 pb-2">
          <span className="material-symbols-outlined text-secondary-container text-[22px]">
            edit_document
          </span>
          <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
            1. المعلومات الأساسية والتعريفية
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
          {/* Title AR */}
          <div className="md:col-span-2">
            <label
              htmlFor="title_ar"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              عنوان العقار (بالعربية) <span className="text-error">*</span>
            </label>
            <input
              id="title_ar"
              type="text"
              required
              value={formData.title_ar}
              onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
              placeholder="مثال: بنتهاوس فاخر بإطلالة بانورامية على جبل قاسيون"
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Title EN */}
          <div className="md:col-span-2">
            <label
              htmlFor="title_en"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              عنوان العقار (بالإنجليزية - اختياري)
            </label>
            <input
              id="title_en"
              type="text"
              dir="ltr"
              value={formData.title_en || ""}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              placeholder="e.g. Luxury Penthouse with Panoramic Qasioun View"
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-left"
            />
          </div>

          {/* Description AR */}
          <div className="md:col-span-2">
            <label
              htmlFor="description_ar"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              الوصف التفصيلي (بالعربية) <span className="text-error">*</span>
            </label>
            <textarea
              id="description_ar"
              required
              rows={4}
              value={formData.description_ar}
              onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
              placeholder="تفاصيل الشقة، التجهيزات، الإكساء الديلوكس، خدمات المبنى وموقع العقار..."
              className="w-full p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Description EN */}
          <div className="md:col-span-2">
            <label
              htmlFor="description_en"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              الوصف التفصيلي (بالإنجليزية - اختياري)
            </label>
            <textarea
              id="description_en"
              dir="ltr"
              rows={3}
              value={formData.description_en || ""}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              placeholder="Detailed description of features, finishes, and building amenities..."
              className="w-full p-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-left"
            />
          </div>
        </div>
      </div>

      {/* 2. Transaction & Property Type */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 space-y-space-sm">
        <div className="flex items-center gap-space-xs border-b border-outline-variant/20 pb-2">
          <span className="material-symbols-outlined text-secondary-container text-[22px]">
            swap_horiz
          </span>
          <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
            2. نوع العرض وتصنيف العقار
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
          {/* Transaction Type: Sale / Rent */}
          <div>
            <label className="block font-title-sm text-title-sm text-on-surface mb-1.5">
              نوع المعاملة <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, transaction_type: "sale" })}
                className={`h-11 rounded-lg font-title-sm text-title-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  formData.transaction_type === "sale"
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface border-outline-variant/40 hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">sell</span>
                <span>عقار للبيع</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, transaction_type: "rent" })}
                className={`h-11 rounded-lg font-title-sm text-title-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  formData.transaction_type === "rent"
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface-container-low text-on-surface border-outline-variant/40 hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">key</span>
                <span>عقار للإيجار</span>
              </button>
            </div>
          </div>

          {/* Property Type Dropdown */}
          <div>
            <label
              htmlFor="property_type"
              className="block font-title-sm text-title-sm text-on-surface mb-1.5"
            >
              نوع وتصنيف العقار <span className="text-error">*</span>
            </label>
            <select
              id="property_type"
              value={formData.property_type}
              onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
              className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {PROPERTY_TYPES.map((pt) => (
                <option key={pt.value} value={pt.value}>
                  {pt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Location: Governorate -> District (CRITICAL DEPENDENCY) */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 space-y-space-sm">
        <div className="flex items-center gap-space-xs border-b border-outline-variant/20 pb-2">
          <span className="material-symbols-outlined text-secondary-container text-[22px]">
            location_on
          </span>
          <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
            3. الموقع الجغرافي (المحافظة والمنطقة)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
          {/* Governorate */}
          <div>
            <label
              htmlFor="governorate_id"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              المحافظة <span className="text-error">*</span>
            </label>
            <select
              id="governorate_id"
              required
              value={formData.governorate_id}
              onChange={handleGovernorateChange}
              className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">-- اختر المحافظة --</option>
              {governorates.map((gov) => (
                <option key={gov.id} value={gov.id}>
                  {gov.name_ar} ({gov.name_en})
                </option>
              ))}
            </select>
          </div>

          {/* District (Dependent on Governorate) */}
          <div>
            <label
              htmlFor="district_id"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              المنطقة / الحي <span className="text-error">*</span>
            </label>
            <select
              id="district_id"
              required
              disabled={!formData.governorate_id || availableDistricts.length === 0}
              value={formData.district_id}
              onChange={(e) => setFormData({ ...formData, district_id: e.target.value })}
              className="w-full h-11 px-3 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">
                {!formData.governorate_id
                  ? "-- يرجى اختيار المحافظة أولاً --"
                  : availableDistricts.length === 0
                  ? "-- لا توجد مناطق مضافة لهذه المحافظة --"
                  : "-- اختر المنطقة أو الحي --"}
              </option>
              {availableDistricts.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.name_ar} ({dist.name_en})
                </option>
              ))}
            </select>
          </div>

          {/* Detailed Address */}
          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              العنوان التفصيلي <span className="text-error">*</span>
            </label>
            <input
              id="address"
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="مثال: دمشق - المالكي - قرب حديقة الجاحظ - بناء النخيل"
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Latitude & Longitude */}
          <div>
            <label
              htmlFor="latitude"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              خط العرض (Latitude - اختياري)
            </label>
            <input
              id="latitude"
              type="number"
              step="0.000001"
              dir="ltr"
              value={formData.latitude !== null && formData.latitude !== undefined ? formData.latitude : ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  latitude: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              placeholder="33.5186"
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-left"
            />
          </div>

          <div>
            <label
              htmlFor="longitude"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              خط الطول (Longitude - اختياري)
            </label>
            <input
              id="longitude"
              type="number"
              step="0.000001"
              dir="ltr"
              value={formData.longitude !== null && formData.longitude !== undefined ? formData.longitude : ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  longitude: e.target.value ? parseFloat(e.target.value) : null,
                })
              }
              placeholder="36.2783"
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-left"
            />
          </div>
        </div>
      </div>

      {/* 4. Specifications & Pricing */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 space-y-space-sm">
        <div className="flex items-center gap-space-xs border-b border-outline-variant/20 pb-2">
          <span className="material-symbols-outlined text-secondary-container text-[22px]">
            payments
          </span>
          <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
            4. السعر والمواصفات الفنية
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm">
          {/* Price */}
          <div className="col-span-2 md:col-span-2">
            <label
              htmlFor="price"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              السعر المطلوب <span className="text-error">*</span>
            </label>
            <div className="flex gap-2">
              <input
                id="price"
                type="number"
                min="1"
                step="any"
                required
                dir="ltr"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : 0 })
                }
                placeholder="450000"
                className="flex-1 h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-left"
              />
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-24 h-11 px-2 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="SYP">SYP (ل.س)</option>
              </select>
            </div>
          </div>

          {/* Area */}
          <div className="col-span-2 md:col-span-2">
            <label
              htmlFor="area"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              المساحة الإجمالية (م²) <span className="text-error">*</span>
            </label>
            <input
              id="area"
              type="number"
              min="1"
              step="any"
              required
              dir="ltr"
              value={formData.area || ""}
              onChange={(e) =>
                setFormData({ ...formData, area: e.target.value ? parseFloat(e.target.value) : 0 })
              }
              placeholder="320"
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-left"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label
              htmlFor="bedrooms"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              غرف النوم
            </label>
            <input
              id="bedrooms"
              type="number"
              min="0"
              dir="ltr"
              value={formData.bedrooms}
              onChange={(e) =>
                setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })
              }
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary text-left"
            />
          </div>

          {/* Bathrooms */}
          <div>
            <label
              htmlFor="bathrooms"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              الحمامات
            </label>
            <input
              id="bathrooms"
              type="number"
              min="0"
              dir="ltr"
              value={formData.bathrooms}
              onChange={(e) =>
                setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })
              }
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary text-left"
            />
          </div>

          {/* Floor */}
          <div>
            <label
              htmlFor="floor"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              رقم الطابق
            </label>
            <input
              id="floor"
              type="number"
              dir="ltr"
              value={formData.floor !== null && formData.floor !== undefined ? formData.floor : ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  floor: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              placeholder="مثال: 5"
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary text-left"
            />
          </div>

          {/* Total Floors */}
          <div>
            <label
              htmlFor="total_floors"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              إجمالي طوابق المبنى
            </label>
            <input
              id="total_floors"
              type="number"
              min="1"
              dir="ltr"
              value={formData.total_floors !== null && formData.total_floors !== undefined ? formData.total_floors : ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  total_floors: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              placeholder="مثال: 8"
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary text-left"
            />
          </div>

          {/* Orientation */}
          <div className="col-span-2">
            <label
              htmlFor="orientation"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              الاتجاه والكسوة (الواجهة)
            </label>
            <input
              id="orientation"
              type="text"
              value={formData.orientation || ""}
              onChange={(e) => setFormData({ ...formData, orientation: e.target.value })}
              placeholder="مثال: قبلي شرقي، إكساء سوبر ديلوكس"
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary"
            />
          </div>

          {/* Legal Status */}
          <div className="col-span-2">
            <label
              htmlFor="legal_status"
              className="block font-title-sm text-title-sm text-on-surface mb-1"
            >
              الوضع القانوني والملكية
            </label>
            <input
              id="legal_status"
              type="text"
              value={formData.legal_status || ""}
              onChange={(e) => setFormData({ ...formData, legal_status: e.target.value })}
              placeholder="مثال: طابو أخضر 2400 سهم نظامي، حكم محكمة"
              className="w-full h-11 px-3.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* 5. Property Images Management */}
      <PropertyImageManager
        propertyId={initialData?.id}
        isEditing={isEditing}
        initialImages={initialImages}
        onPreviewImagesChange={setPreviewImages}
        disabled={isLoading}
      />

      {/* 6. Status & Featured Flags */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 space-y-space-sm">
        <div className="flex items-center gap-space-xs border-b border-outline-variant/20 pb-2">
          <span className="material-symbols-outlined text-secondary-container text-[22px]">
            verified
          </span>
          <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
            6. حالة النشر والتمييز
          </h2>
        </div>

        <div className="space-y-4">
          {/* Status Selection */}
          <div>
            <label
              htmlFor="status"
              className="block font-title-sm text-title-sm text-on-surface mb-1.5"
            >
              حالة العقار في المنصة <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = formData.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, status: opt.value })}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary text-on-primary border-primary shadow-sm"
                        : "bg-surface-container-low text-on-surface border-outline-variant/40 hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-title-sm text-title-sm font-bold">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-[18px] text-secondary-container">
                          check_circle
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-label-sm block mt-1 ${
                        isSelected ? "text-on-primary/80" : "text-outline"
                      }`}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured & Special Offer Checkboxes */}
          <div className="pt-2 border-t border-outline-variant/20 grid grid-cols-1 md:grid-cols-2 gap-space-sm">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 cursor-pointer hover:bg-surface-container transition-colors">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="font-title-sm text-title-sm text-on-surface font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary-container text-[18px]">
                    star
                  </span>
                  عقار مميز (Featured)
                </span>
                <span className="text-label-sm text-outline">
                  يظهر في قسم العقارات المميزة بالصفحة الرئيسية
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40 cursor-pointer hover:bg-surface-container transition-colors">
              <input
                type="checkbox"
                checked={formData.is_offer}
                onChange={(e) => setFormData({ ...formData, is_offer: e.target.checked })}
                className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="font-title-sm text-title-sm text-on-surface font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary-container text-[18px]">
                    local_offer
                  </span>
                  عرض حصري (Special Offer)
                </span>
                <span className="text-label-sm text-outline">
                  يظهر في قسم العروض والفرص الحصرية الخاصة
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-space-sm pt-2">
        <Link
          href="/admin"
          className="h-12 px-6 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface font-title-sm text-title-sm flex items-center justify-center gap-2 hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          <span>إلغاء والعودة للوحة التحكم</span>
        </Link>

        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 max-w-xs h-12 bg-primary text-on-primary rounded-xl font-title-md text-title-md flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              <span>جاري الحفظ في Supabase...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">
                {isEditing ? "save" : "add_circle"}
              </span>
              <span>{isEditing ? "تحديث بيانات العقار" : "حفظ العقار ونشره"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
