"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Property } from "@/lib/data";

interface PropertyCardProps {
  property: Property;
  layout?: "grid" | "list";
}

export function PropertyCard({ property, layout = "grid" }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <article className="property-card bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      {/* Property Image Header with Overlays */}
      <div
        className="relative w-full h-56 bg-cover bg-center"
        data-alt={property.imageAlt}
        style={{ backgroundImage: `url('${property.imageUrl}')` }}
      >
        {/* Floating Badges */}
        <div className="absolute top-space-sm right-space-sm flex items-center gap-space-xs">
          {property.badges.map((badge, idx) => (
            <span
              key={idx}
              className={`px-space-sm py-1 font-label-sm text-label-sm rounded-lg shadow-sm ${
                idx === 0
                  ? property.dealType === "sale"
                    ? "bg-primary text-on-primary"
                    : "bg-on-tertiary-fixed text-tertiary-fixed"
                  : "bg-surface-container-lowest/90 backdrop-blur-md text-primary"
              }`}
            >
              {badge}
            </span>
          ))}
          {property.badgeHighlight && (
            <span className="px-space-sm py-1 bg-secondary-container text-on-primary font-label-sm text-label-sm rounded-lg shadow-sm">
              {property.badgeHighlight}
            </span>
          )}
        </div>

        {/* Favorite Action */}
        <button
          aria-label="حفظ في المفضلة"
          onClick={toggleFavorite}
          className="favorite-btn absolute top-space-sm left-space-sm w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface flex items-center justify-center hover:text-secondary-container transition-colors shadow-sm cursor-pointer"
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-colors ${
              isFavorite ? "text-secondary-container" : ""
            }`}
            style={{
              fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            {isFavorite ? "favorite" : "favorite_border"}
          </span>
        </button>

        {/* Price Overlay Bottom Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary/80 to-transparent p-space-sm flex items-end justify-between">
          <div className="text-on-primary">
            <span className="font-label-sm text-label-sm text-tertiary-fixed opacity-90">
              {property.dealType === "rent"
                ? "الإيجار الشهري المطلوب"
                : "السعر الإجمالي المطلوب"}
            </span>
            <div className="font-headline-md text-headline-md leading-tight text-on-primary">
              {property.price}{" "}
              {property.priceNote && (
                <span className="font-body-sm text-body-sm text-surface-variant font-normal">
                  {property.priceNote}
                </span>
              )}
            </div>
          </div>
          {property.isNegotiable && (
            <span className="font-label-sm text-label-sm text-surface-variant bg-primary/40 px-2 py-0.5 rounded backdrop-blur-xs">
              قابل للتفاوض
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-space-md">
        {/* Title & District */}
        <div className="flex items-start justify-between gap-space-sm mb-space-xs">
          <div>
            <Link href={`/properties/${property.id}`}>
              <h3 className="font-title-md text-title-md text-on-surface hover:text-secondary-container transition-colors leading-snug">
                {property.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm mt-1">
              <span className="material-symbols-outlined text-secondary-container text-[16px]">
                location_on
              </span>
              <span>{property.location}</span>
            </div>
          </div>
        </div>

        {/* Meta Specification Bar */}
        <div className="grid grid-cols-4 gap-space-xs py-space-sm my-space-xs bg-surface-container-low rounded-lg text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="font-label-sm text-label-sm text-outline">المساحة</span>
            <span className="font-title-sm text-title-sm text-on-surface">
              {property.area}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-label-sm text-label-sm text-outline">الغرف</span>
            <span className="font-title-sm text-title-sm text-on-surface">
              {property.bedrooms}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-label-sm text-label-sm text-outline">الحمامات</span>
            <span className="font-title-sm text-title-sm text-on-surface">
              {property.bathrooms}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-label-sm text-label-sm text-outline">الطابق</span>
            <span className="font-title-sm text-title-sm text-on-surface">
              {property.floor || "الرابع"}
            </span>
          </div>
        </div>

        {/* Additional Feature Chips & CTA */}
        <div className="flex items-center justify-between pt-space-xs">
          <div className="flex items-center gap-1 text-outline font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>{property.publishedTime}</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <a
              aria-label="اتصال"
              className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary hover:bg-secondary-container hover:text-on-primary transition-colors"
              href="tel:+963900000000"
            >
              <span className="material-symbols-outlined text-[18px]">phone</span>
            </a>
            <Link
              href={`/properties/${property.id}`}
              className="px-space-md h-9 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-secondary-container transition-colors shadow-sm flex items-center gap-1"
            >
              <span>التفاصيل</span>
              <span className="material-symbols-outlined text-[16px] rotate-180">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
