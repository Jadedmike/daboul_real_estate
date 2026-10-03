"use client";

import React, { useState } from "react";
import { PropertyImage } from "@/lib/data";
import { useToast } from "@/components/ui/Toast";

interface PropertyGalleryProps {
  images: PropertyImage[];
  dealType?: string;
  badgeHighlight?: string;
}

export function PropertyGallery({
  images,
  dealType = "للبيع",
  badgeHighlight = "حصري لدى دعبول",
}: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const { showToast } = useToast();

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "شقة فاخرة في المالكي - دعبول العقارية",
          text: "شقة 280 م² في أرقى أحياء دمشق، طابو أخضر 2400 سهم مع إطلالة مفتوحة",
          url: window.location.href,
        })
        .catch(() => {});
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("تم نسخ رابط العقار إلى الحافظة بنجاح");
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    showToast(
      !isSaved
        ? "تمت إضافة العقار إلى قائمتك المفضلة"
        : "تمت إزالة العقار من المفضلة"
    );
  };

  const currentImg = images[currentIndex] || images[0];

  return (
    <div className="relative w-full bg-surface-container-high overflow-hidden" id="galleryContainer">
      {/* Main Display Frame (16:10 Ratio) */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <div className="relative w-full h-full" id="gallerySlide">
          <img
            id="mainImage"
            src={currentImg.url}
            alt={currentImg.alt}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        </div>

        {/* Gradient Scrim for Top Badges & Bottom Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-primary/40 pointer-events-none"></div>

        {/* Status Badges Overlay */}
        <div className="absolute top-4 right-4 left-4 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-space-xs">
            <span className="bg-primary text-on-primary font-label-md text-label-md px-3 py-1 rounded-full shadow-md backdrop-blur-md">
              {dealType}
            </span>
            <span className="bg-secondary-container text-on-secondary font-label-md text-label-md px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                verified
              </span>
              {badgeHighlight}
            </span>
          </div>

          {/* Image Counter Pill */}
          <span
            className="bg-primary-container/80 backdrop-blur-md text-on-tertiary font-label-sm text-label-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm"
            id="imageCounter"
          >
            <span className="material-symbols-outlined text-[13px]">
              photo_camera
            </span>
            <span>
              {currentIndex + 1} / {images.length}
            </span>
          </span>
        </div>

        {/* Quick Action Floating Buttons */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2 pointer-events-auto">
          <button
            aria-label="حفظ في المفضلة"
            onClick={toggleSave}
            className={`w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer ${
              isSaved ? "text-secondary-container" : "text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {isSaved ? "favorite" : "favorite_border"}
            </span>
          </button>
          <button
            aria-label="مشاركة العقار"
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </div>

      {/* Thumbnails Scroller */}
      <div className="px-gutter-mobile py-space-sm flex items-center gap-space-sm overflow-x-auto no-scrollbar bg-surface-container-lowest shadow-sm">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`thumbnail-btn shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
              currentIndex === idx
                ? "opacity-100 ring-2 ring-secondary-container"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={img.url}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
