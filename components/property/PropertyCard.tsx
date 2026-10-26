"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Property } from "@/lib/data";
import { PublicProperty } from "@/lib/actions/properties";

const FALLBACK_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB7aAx2vp5ePFd3Hlsml2oaqk3vubiw8VIo3LkImNS9JIQVERgN2SeVP46enNTLaZc9hOOSPHeaFdc4ntQA3XcjPj22WLYnrFDNmN8L4IafPfSf-zBXCyxPqT7KhxYSYhpQIA0z-9wjpOU0X_Oczi8WUa1QYesf7yt_qpCv1lo2DbyAxHScQ2NVFd-WjfY6EpuXeI1rWmzC44xQ-49uA3xk5oztTAcUdeS9Hr8Ra5QFQsKPeu4UDkij";

function formatArabicDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 24) return "اليوم";
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "أمس";
    if (diffDays <= 10) return `منذ ${diffDays} أيام`;
    return `منذ ${diffDays} يوم`;
  } catch {
    return "متاح الآن";
  }
}

interface NormalizedCardData {
  id: string;
  title: string;
  location: string;
  dealType: "sale" | "rent";
  price: string;
  priceNote?: string;
  isNegotiable?: boolean;
  badges: string[];
  badgeHighlight?: string;
  area: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  publishedTime: string;
  imageUrl: string;
  imageAlt: string;
}

function normalizeProperty(p: PublicProperty | Property): NormalizedCardData {
  // Check if this is a PublicProperty from Supabase
  if ("title_ar" in p) {
    const pub = p as PublicProperty;
    const coverImg =
      pub.property_images?.find((img) => img.is_cover) ||
      (pub.property_images && pub.property_images.length > 0 ? pub.property_images[0] : null);

    const imageUrl = coverImg?.public_url || FALLBACK_IMAGE_URL;
    const imageAlt = coverImg?.alt_text || pub.title_ar;

    const badges: string[] = [pub.transaction_type === "sale" ? "للبيع" : "للإيجار"];
    if (pub.is_featured) badges.push("مميز");
    if (pub.is_offer) badges.push("عرض خاص");

    const badgeHighlight = pub.is_offer
      ? "فرصة حصرية"
      : pub.is_featured
      ? "اختيار Axion Digital"
      : undefined;

    const govName = pub.governorates?.name_ar;
    const distName = pub.districts?.name_ar;
    const location = [govName, distName || pub.address].filter(Boolean).join(" - ") || pub.address;

    let floorText = "طابق أرضي";
    if (pub.floor !== null && pub.floor !== undefined) {
      floorText = pub.floor === 0 ? "طابق أرضي" : `الطابق ${pub.floor}`;
    }

    return {
      id: pub.id,
      title: pub.title_ar,
      location,
      dealType: pub.transaction_type,
      price: `$${Number(pub.price).toLocaleString()}`,
      priceNote: pub.currency === "USD" ? "دولار أمريكي" : pub.currency,
      isNegotiable: false,
      badges,
      badgeHighlight,
      area: `${pub.area} م²`,
      bedrooms: `${pub.bedrooms}`,
      bathrooms: `${pub.bathrooms}`,
      floor: floorText,
      publishedTime: formatArabicDate(pub.created_at),
      imageUrl,
      imageAlt,
    };
  }

  // Legacy Property object
  const leg = p as Property;
  return {
    id: leg.id,
    title: leg.title,
    location: leg.location,
    dealType: leg.dealType,
    price: leg.price,
    priceNote: leg.priceNote,
    isNegotiable: leg.isNegotiable,
    badges: leg.badges,
    badgeHighlight: leg.badgeHighlight,
    area: leg.area,
    bedrooms: leg.bedrooms,
    bathrooms: leg.bathrooms,
    floor: leg.floor || "الرابع",
    publishedTime: leg.publishedTime,
    imageUrl: leg.imageUrl || FALLBACK_IMAGE_URL,
    imageAlt: leg.imageAlt || leg.title,
  };
}

interface PropertyCardProps {
  property: PublicProperty | Property;
  layout?: "grid" | "list";
}

export function PropertyCard({ property: rawProperty, layout = "grid" }: PropertyCardProps) {
  const property = normalizeProperty(rawProperty);
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <article className="property-card bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 hover:border-[#A0BDDB]/70 rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] hover:shadow-[0_12px_40px_0_rgba(52,33,27,0.12)] hover:-translate-y-0.5 transition-all duration-300">
      {/* Property Image Header with Overlays */}
      <div
        className="relative w-full h-56 bg-surface-container-high overflow-hidden"
        data-alt={property.imageAlt}
      >
        <Image
          src={property.imageUrl}
          alt={property.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
        {/* Full Image Clickable Link */}
        <Link
          href={`/properties/${property.id}`}
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={property.title}
        />

        {/* Floating Badges */}
        <div className="absolute top-space-sm right-space-sm flex items-center gap-space-xs z-20 pointer-events-none">
          {property.badges.map((badge, idx) => (
            <span
              key={idx}
              className={`px-space-sm py-1 font-label-sm text-label-sm rounded-xl shadow-xs border ${
                idx === 0
                  ? "bg-[#34211B] text-[#F8F6F0] border-[#A0BDDB]/40 backdrop-blur-md font-semibold"
                  : "bg-[#A0BDDB]/25 backdrop-blur-md text-[#34211B] border-[#A0BDDB]/45 font-semibold"
              }`}
            >
              {badge}
            </span>
          ))}
          {property.badgeHighlight && (
            <span className="px-space-sm py-1 bg-[#A0BDDB] text-[#34211B] font-label-sm text-label-sm rounded-xl shadow-xs border border-[#A0BDDB]/60 backdrop-blur-md font-bold">
              {property.badgeHighlight}
            </span>
          )}
        </div>

        {/* Favorite Action */}
        <button
          aria-label="حفظ في المفضلة"
          onClick={toggleFavorite}
          className="favorite-btn absolute top-space-sm left-space-sm w-9 h-9 rounded-full bg-[#F8F6F0]/85 backdrop-blur-md border border-[#A0BDDB]/40 text-[#34211B] flex items-center justify-center hover:bg-[#F8F6F0] transition-colors shadow-sm cursor-pointer z-30 pointer-events-auto"
        >
          <span
            className="material-symbols-outlined text-[20px] transition-colors"
            style={{
              fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            {isFavorite ? "favorite" : "favorite_border"}
          </span>
        </button>

        {/* Price Overlay Bottom Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#34211B]/95 via-[#34211B]/60 to-transparent p-space-sm flex items-end justify-between pointer-events-none z-20">
          <div className="text-[#F8F6F0]">
            <span className="font-label-sm text-label-sm text-[#A0BDDB] opacity-95">
              {property.dealType === "rent"
                ? "الإيجار الشهري المطلوب"
                : "السعر الإجمالي المطلوب"}
            </span>
            <div className="font-headline-md text-headline-md leading-tight text-[#F8F6F0]">
              {property.price}{" "}
              {property.priceNote && (
                <span className="font-body-sm text-body-sm text-[#F8F6F0]/75 font-normal">
                  {property.priceNote}
                </span>
              )}
            </div>
          </div>
          {property.isNegotiable && (
            <span className="font-label-sm text-label-sm text-[#F8F6F0] bg-[#A0BDDB]/25 border border-[#A0BDDB]/45 px-2 py-0.5 rounded-lg backdrop-blur-md">
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
              <h3 className="font-title-md text-title-md text-[#34211B] hover:text-[#4A332B] transition-colors leading-snug font-bold">
                {property.title}
              </h3>
            </Link>
            <div className="flex items-center gap-1 text-[#34211B]/80 font-body-sm text-body-sm mt-1">
              <span className="material-symbols-outlined text-[#34211B] text-[16px]">
                location_on
              </span>
              <span>{property.location}</span>
            </div>
          </div>
        </div>

        {/* Meta Specification Bar */}
        <div className="grid grid-cols-4 gap-space-xs py-space-sm my-space-xs bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="font-label-sm text-label-sm text-[#34211B]/70">المساحة</span>
            <span className="font-title-sm text-title-sm text-[#34211B] font-semibold">
              {property.area}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-label-sm text-label-sm text-[#34211B]/70">الغرف</span>
            <span className="font-title-sm text-title-sm text-[#34211B] font-semibold">
              {property.bedrooms}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-label-sm text-label-sm text-[#34211B]/70">الحمامات</span>
            <span className="font-title-sm text-title-sm text-[#34211B] font-semibold">
              {property.bathrooms}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="font-label-sm text-label-sm text-[#34211B]/70">الطابق</span>
            <span className="font-title-sm text-title-sm text-[#34211B] font-semibold">
              {property.floor || "الرابع"}
            </span>
          </div>
        </div>

        {/* Additional Feature Chips & CTA */}
        <div className="flex items-center justify-between pt-space-xs">
          <div className="flex items-center gap-1 text-[#34211B]/70 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>{property.publishedTime}</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <a
              aria-label="اتصال"
              className="w-9 h-9 rounded-xl bg-[#F8F6F0]/80 hover:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/40 flex items-center justify-center text-[#34211B] hover:text-[#34211B] transition-all shadow-xs"
              href="tel:+963900000000"
            >
              <span className="material-symbols-outlined text-[18px]">phone</span>
            </a>
            <Link
              href={`/properties/${property.id}`}
              className="px-space-md h-9 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] font-label-md text-label-md rounded-xl transition-all border border-[#A0BDDB]/20 shadow-sm flex items-center gap-1"
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
