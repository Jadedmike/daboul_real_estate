"use client";

import React, { useState, useRef, useEffect } from "react";
import { PropertyImage } from "@/lib/supabase/types";
import {
  uploadPropertyImage,
  deletePropertyImage,
  setPrimaryPropertyImage,
  reorderPropertyImages,
} from "@/lib/actions/properties";

export interface PreviewImage {
  id: string;
  file: File;
  previewUrl: string;
  is_cover: boolean;
  sort_order: number;
}

interface PropertyImageManagerProps {
  propertyId?: string;
  isEditing?: boolean;
  initialImages?: PropertyImage[];
  // Callback for New Property flow to communicate selected files to parent form
  onPreviewImagesChange?: (previews: PreviewImage[]) => void;
  // External loading state from parent form
  disabled?: boolean;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function PropertyImageManager({
  propertyId,
  isEditing = false,
  initialImages = [],
  onPreviewImagesChange,
  disabled = false,
}: PropertyImageManagerProps) {
  // Existing images state (in edit mode)
  const [images, setImages] = useState<PropertyImage[]>(initialImages);
  // Preview images state (in creation mode)
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

  // Action status states
  const [isUploading, setIsUploading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Delete confirmation modal state
  const [imageToDelete, setImageToDelete] = useState<PropertyImage | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initialImages when prop changes
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setImages(initialImages);
    }
  }, [initialImages]);

  // Notify parent of preview changes in create mode
  useEffect(() => {
    if (!isEditing && onPreviewImagesChange) {
      onPreviewImagesChange(previewImages);
    }
  }, [previewImages, isEditing, onPreviewImagesChange]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      previewImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, [previewImages]);

  /**
   * Client-side file validation
   */
  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `الملف "${file.name}" يتجاوز الحد الأقصى المسموح به (10 ميغابايت).`;
    }

    const mime = file.type.toLowerCase();
    const parts = file.name.split(".");
    const ext = parts.length > 1 ? parts.pop()!.toLowerCase() : "";

    if (!ALLOWED_MIME_TYPES.includes(mime) || !ALLOWED_EXTENSIONS.includes(ext)) {
      return `الملف "${file.name}" بصيغة غير مدعومة. يرجى اختيار ملفات JPG أو PNG أو WebP فقط.`;
    }

    return null;
  };

  /**
   * Handle file selection from input or drop
   */
  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    const files = Array.from(fileList);
    const validFiles: File[] = [];

    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        setErrorMessage(error);
        return;
      }
      validFiles.push(file);
    }

    // A. EDIT MODE: Upload immediately to Supabase Storage
    if (isEditing && propertyId) {
      setIsUploading(true);
      try {
        let uploadedCount = 0;
        for (const file of validFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const result = await uploadPropertyImage(propertyId, formData);
          if (!result.success || !result.data) {
            setErrorMessage(result.error || "تعذر رفع بعض الصور.");
            break;
          }

          const newImg = result.data;
          setImages((prev) => {
            // If new image became cover, unset other covers
            if (newImg.is_cover) {
              return [...prev.map((img) => ({ ...img, is_cover: false })), newImg];
            }
            return [...prev, newImg];
          });
          uploadedCount++;
        }

        if (uploadedCount > 0) {
          setSuccessMessage(
            uploadedCount === 1
              ? "تم رفع الصورة بنجاح وحفظها في مساحة التخزين."
              : `تم رفع ${uploadedCount} صور بنجاح وحفظها في مساحة التخزين.`
          );
        }
      } catch {
        setErrorMessage("حدث خطأ غير متوقع أثناء رفع الصور.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
      return;
    }

    // B. CREATE MODE: Add to preview list for uploading upon property creation
    const newPreviews: PreviewImage[] = validFiles.map((file, idx) => {
      const totalCount = previewImages.length + idx;
      return {
        id: `preview-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        is_cover: totalCount === 0, // First image is cover by default
        sort_order: totalCount,
      };
    });

    setPreviewImages((prev) => {
      const combined = [...prev, ...newPreviews];
      // Ensure at least one image is cover
      const hasCover = combined.some((img) => img.is_cover);
      if (!hasCover && combined.length > 0) {
        combined[0].is_cover = true;
      }
      return combined;
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /**
   * Set primary cover image
   */
  const handleSetPrimary = async (targetId: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Edit Mode: Call Server Action
    if (isEditing && propertyId) {
      setActionLoadingId(targetId);
      try {
        const result = await setPrimaryPropertyImage(targetId, propertyId);
        if (!result.success) {
          setErrorMessage(result.error || "تعذر تحديث الصورة الرئيسية.");
        } else {
          setImages((prev) =>
            prev.map((img) => ({
              ...img,
              is_cover: img.id === targetId,
            }))
          );
          setSuccessMessage("تم تعيين الصورة كصورة رئيسية للعقار.");
        }
      } catch {
        setErrorMessage("حدث خطأ غير متوقع أثناء تعيين الصورة الرئيسية.");
      } finally {
        setActionLoadingId(null);
      }
      return;
    }

    // Create Mode: Update local previews
    setPreviewImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_cover: img.id === targetId,
      }))
    );
  };

  /**
   * Reorder image (move left/right in RTL)
   */
  const handleMoveImage = async (index: number, direction: "prev" | "next") => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Edit Mode
    if (isEditing && propertyId) {
      const targetIndex = direction === "prev" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= images.length) return;

      const newImages = [...images];
      const temp = newImages[index];
      newImages[index] = newImages[targetIndex];
      newImages[targetIndex] = temp;

      // Update local state immediately for instant feedback
      setImages(newImages);

      // Persist to database
      setActionLoadingId(images[index].id);
      try {
        const orderedIds = newImages.map((img) => img.id);
        const result = await reorderPropertyImages(propertyId, orderedIds);
        if (!result.success) {
          setErrorMessage(result.error || "تعذر حفظ الترتيب الجديد.");
          // Revert on error
          setImages(images);
        } else {
          setSuccessMessage("تم تحديث ترتيب الصور بنجاح.");
        }
      } catch {
        setErrorMessage("حدث خطأ أثناء حفظ ترتيب الصور.");
        setImages(images);
      } finally {
        setActionLoadingId(null);
      }
      return;
    }

    // Create Mode
    const targetIndex = direction === "prev" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= previewImages.length) return;

    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      const temp = newPreviews[index];
      newPreviews[index] = newPreviews[targetIndex];
      newPreviews[targetIndex] = temp;
      return newPreviews.map((item, idx) => ({ ...item, sort_order: idx }));
    });
  };

  /**
   * Remove image from preview (Create Mode)
   */
  const handleRemovePreview = (id: string) => {
    setPreviewImages((prev) => {
      const filtered = prev.filter((img) => {
        if (img.id === id) {
          URL.revokeObjectURL(img.previewUrl);
          return false;
        }
        return true;
      });

      // If removed image was cover, promote the first remaining
      const hasCover = filtered.some((img) => img.is_cover);
      if (!hasCover && filtered.length > 0) {
        filtered[0].is_cover = true;
      }

      return filtered.map((item, idx) => ({ ...item, sort_order: idx }));
    });
  };

  /**
   * Delete image permanently (Edit Mode)
   */
  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    const target = imageToDelete;
    setImageToDelete(null);
    setErrorMessage(null);
    setSuccessMessage(null);

    setActionLoadingId(target.id);
    try {
      const result = await deletePropertyImage(target.id);
      if (!result.success) {
        setErrorMessage(result.error || "تعذر حذف الصورة.");
      } else {
        setImages((prev) => {
          const filtered = prev.filter((img) => img.id !== target.id);
          // If deleted image was cover, promote first remaining image
          if (target.is_cover && filtered.length > 0) {
            filtered[0].is_cover = true;
          }
          return filtered;
        });
        setSuccessMessage("تم حذف الصورة بنجاح من مساحة التخزين وقاعدة البيانات.");
      }
    } catch {
      setErrorMessage("حدث خطأ غير متوقع أثناء حذف الصورة.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const totalImageCount = isEditing ? images.length : previewImages.length;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30 space-y-space-md">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
        <div className="flex items-center gap-space-xs">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-label-md">
            <span className="material-symbols-outlined text-[20px]">
              photo_library
            </span>
          </span>
          <div>
            <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
              معرض صور العقار
            </h2>
            <p className="text-label-sm text-outline">
              ارفع صوراً عالية الدقة لإبراز تفاصيل العقار وتعيين الصورة الرئيسية
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-sm font-label-sm font-medium">
          {totalImageCount} {totalImageCount === 1 ? "صورة" : "صور"}
        </span>
      </div>

      {/* Status Alerts */}
      {errorMessage && (
        <div
          role="alert"
          className="p-space-sm rounded-xl bg-error-container/20 border border-error/30 text-error flex items-start gap-2 text-body-sm shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
            error
          </span>
          <p className="flex-1 font-medium">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div
          role="alert"
          className="p-space-sm rounded-xl bg-secondary-fixed/30 border border-secondary/40 text-on-secondary-fixed flex items-start gap-2 text-body-sm shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px] text-secondary shrink-0 mt-0.5">
            check_circle
          </span>
          <p className="flex-1 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled && !isUploading && e.dataTransfer.files) {
            handleFilesSelected(e.dataTransfer.files);
          }
        }}
        className={`border-2 border-dashed rounded-xl p-space-md sm:p-space-lg text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
          disabled || isUploading
            ? "border-outline-variant/30 bg-surface-container-low opacity-60 cursor-not-allowed"
            : "border-primary/40 bg-surface-container-low hover:border-primary hover:bg-surface-container-low/80"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          disabled={disabled || isUploading}
          onChange={(e) => handleFilesSelected(e.target.files)}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="font-title-sm text-title-sm text-primary font-bold">
              جاري رفع الصور إلى Supabase Storage...
            </span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">
                add_photo_alternate
              </span>
            </div>
            <div>
              <p className="font-title-sm text-title-sm text-on-surface font-bold">
                انقر لاختيار الصور أو اسحبها وأفلتها هنا
              </p>
              <p className="font-label-sm text-label-sm text-outline mt-0.5">
                الصيغ المدعومة: JPG، PNG، WebP • الحد الأقصى: 10 ميغابايت لكل صورة
              </p>
            </div>
            <button
              type="button"
              disabled={disabled || isUploading}
              className="mt-1 px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">
                file_upload
              </span>
              <span>استعراض الملفات</span>
            </button>
          </>
        )}
      </div>

      {/* Image Gallery Grid */}
      {totalImageCount > 0 ? (
        <div className="space-y-space-sm pt-space-xs">
          <div className="flex items-center justify-between text-label-sm text-outline">
            <span>
              انقر على أيقونة النجمة ⭐ لتعيين الصورة الرئيسية، واستخدم الأسهم لإعادة الترتيب.
            </span>
            <span className="text-primary font-medium">
              الصورة الرئيسية تظهر كغلاف في البحث والموقع
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-sm">
            {/* A. EDIT MODE IMAGES */}
            {isEditing &&
              images.map((img, index) => {
                const isLoadingCurrent = actionLoadingId === img.id;
                return (
                  <div
                    key={img.id}
                    className={`relative rounded-xl overflow-hidden border transition-all bg-surface-container-low group ${
                      img.is_cover
                        ? "border-secondary-container shadow-md ring-2 ring-secondary-container/50"
                        : "border-outline-variant/40 hover:border-outline"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="aspect-[4/3] w-full relative bg-surface-container overflow-hidden">
                      <img
                        src={img.public_url}
                        alt={img.alt_text || "صورة العقار"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Cover Badge */}
                      {img.is_cover && (
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-md">
                          <span className="material-symbols-outlined text-[16px] text-secondary-container">
                            star
                          </span>
                          <span>الصورة الرئيسية</span>
                        </div>
                      )}

                      {/* Loading Overlay */}
                      {isLoadingCurrent && (
                        <div className="absolute inset-0 bg-surface/70 backdrop-blur-xs flex items-center justify-center z-10">
                          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Controls Footer */}
                    <div className="p-2.5 flex items-center justify-between gap-1 bg-surface-container-lowest border-t border-outline-variant/20">
                      {/* Set Primary Button */}
                      {!img.is_cover ? (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(img.id)}
                          disabled={disabled || isLoadingCurrent}
                          className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high text-label-sm font-label-sm transition-colors flex items-center gap-1 cursor-pointer"
                          title="تعيين كصورة رئيسية للعقار"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            star_border
                          </span>
                          <span>تعيين كرئيسية</span>
                        </button>
                      ) : (
                        <div className="text-label-sm font-label-sm text-secondary font-bold flex items-center gap-1 px-1">
                          <span className="material-symbols-outlined text-[16px]">
                            check_circle
                          </span>
                          <span>الغلاف الرئيسي</span>
                        </div>
                      )}

                      {/* Order and Delete Controls */}
                      <div className="flex items-center gap-1">
                        {/* Move Right (Previous in RTL) */}
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, "prev")}
                          disabled={disabled || index === 0 || isLoadingCurrent}
                          className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="تحريك للأمام"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                          </span>
                        </button>

                        {/* Move Left (Next in RTL) */}
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, "next")}
                          disabled={
                            disabled ||
                            index === images.length - 1 ||
                            isLoadingCurrent
                          }
                          className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="تحريك للخلف"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_back
                          </span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => setImageToDelete(img)}
                          disabled={disabled || isLoadingCurrent}
                          className="p-1 rounded-lg text-error/80 hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                          title="حذف الصورة نهائياً"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* B. CREATE MODE PREVIEW IMAGES */}
            {!isEditing &&
              previewImages.map((img, index) => {
                return (
                  <div
                    key={img.id}
                    className={`relative rounded-xl overflow-hidden border transition-all bg-surface-container-low group ${
                      img.is_cover
                        ? "border-secondary-container shadow-md ring-2 ring-secondary-container/50"
                        : "border-outline-variant/40 hover:border-outline"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="aspect-[4/3] w-full relative bg-surface-container overflow-hidden">
                      <img
                        src={img.previewUrl}
                        alt="معاينة الصورة"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Cover Badge */}
                      {img.is_cover && (
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-secondary text-on-secondary font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-md">
                          <span className="material-symbols-outlined text-[16px] text-secondary-container">
                            star
                          </span>
                          <span>الصورة الرئيسية</span>
                        </div>
                      )}
                    </div>

                    {/* Controls Footer */}
                    <div className="p-2.5 flex items-center justify-between gap-1 bg-surface-container-lowest border-t border-outline-variant/20">
                      {/* Set Primary Button */}
                      {!img.is_cover ? (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(img.id)}
                          disabled={disabled}
                          className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high text-label-sm font-label-sm transition-colors flex items-center gap-1 cursor-pointer"
                          title="تعيين كصورة رئيسية للعقار"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            star_border
                          </span>
                          <span>تعيين كرئيسية</span>
                        </button>
                      ) : (
                        <div className="text-label-sm font-label-sm text-secondary font-bold flex items-center gap-1 px-1">
                          <span className="material-symbols-outlined text-[16px]">
                            check_circle
                          </span>
                          <span>الغلاف الرئيسي</span>
                        </div>
                      )}

                      {/* Order and Remove Controls */}
                      <div className="flex items-center gap-1">
                        {/* Move Right (Previous in RTL) */}
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, "prev")}
                          disabled={disabled || index === 0}
                          className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="تحريك للأمام"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                          </span>
                        </button>

                        {/* Move Left (Next in RTL) */}
                        <button
                          type="button"
                          onClick={() => handleMoveImage(index, "next")}
                          disabled={disabled || index === previewImages.length - 1}
                          className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="تحريك للخلف"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_back
                          </span>
                        </button>

                        {/* Remove Preview Button */}
                        <button
                          type="button"
                          onClick={() => handleRemovePreview(img.id)}
                          disabled={disabled}
                          className="p-1 rounded-lg text-error/80 hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                          title="إلغاء اختيار الصورة"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            close
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {imageToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-space-md sm:p-space-lg shadow-xl border border-outline-variant/30 space-y-4">
            <div className="flex items-center gap-3 text-error">
              <div className="w-10 h-10 rounded-xl bg-error-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px]">
                  warning
                </span>
              </div>
              <div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  تأكيد حذف الصورة
                </h3>
                <p className="text-label-sm text-outline">
                  إجراء دائم لا يمكن التراجع عنه
                </p>
              </div>
            </div>

            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذه الصورة نهائياً؟ سيتم مسح ملف الصورة من مساحة التخزين السحابية (Supabase Storage) وسجلها من قاعدة البيانات.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setImageToDelete(null)}
                className="px-4 py-2 rounded-xl border border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-error text-white hover:bg-error/90 font-label-md text-label-md shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  delete
                </span>
                <span>تأكيد الحذف النهائي</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
