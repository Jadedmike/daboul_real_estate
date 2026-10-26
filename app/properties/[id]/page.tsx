import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { PropertyGallery } from "@/components/gallery/PropertyGallery";
import { InspectionBookingForm } from "@/components/property/InspectionBookingForm";
import { FloatingContactBar } from "@/components/ui/FloatingContactBar";
import { ToastProvider } from "@/components/ui/Toast";
import { getPublicPropertyById, getPublicProperties } from "@/lib/actions/properties";
import { getCompanySettings } from "@/lib/actions/settings";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const properties = await getPublicProperties();
    return properties.map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getPublicPropertyById(id);

  if (!property) {
    return {
      title: "العقار غير موجود | Axion Digital",
      description: "لم يتم العثور على العقار المطلوب في قاعدة بيانات Axion Digital.",
    };
  }

  const coverImg =
    property.property_images?.find((img) => img.is_cover)?.public_url ||
    property.property_images?.[0]?.public_url;

  const loc = [
    property.governorates?.name_ar,
    property.districts?.name_ar || property.address,
  ]
    .filter(Boolean)
    .join(" - ");

  const title = `${property.title_ar} - ${loc}`;
  const desc = property.description_ar
    ? property.description_ar.slice(0, 160)
    : `عقار ${property.transaction_type === "sale" ? "للبيع" : "للإيجار"} في ${loc}. السعر: $${Number(property.price).toLocaleString()}.`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "article",
      images: coverImg ? [{ url: coverImg, alt: property.title_ar }] : undefined,
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property, companySettings] = await Promise.all([
    getPublicPropertyById(id),
    getCompanySettings(),
  ]);

  if (!property) {
    notFound();
  }

  const galleryImages =
    property.property_images && property.property_images.length > 0
      ? property.property_images.map((img, idx) => ({
          url: img.public_url,
          alt: img.alt_text || `${property.title_ar} - صورة ${idx + 1}`,
          label: img.is_cover ? "الصورة الرئيسية" : `صورة ${idx + 1}`,
        }))
      : [
          {
            url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7aAx2vp5ePFd3Hlsml2oaqk3vubiw8VIo3LkImNS9JIQVERgN2SeVP46enNTLaZc9hOOSPHeaFdc4ntQA3XcjPj22WLYnrFDNmN8L4IafPfSf-zBXCyxPqT7KhxYSYhpQIA0z-9wjpOU0X_Oczi8WUa1QYesf7yt_qpCv1lo2DbyAxHScQ2NVFd-WjfY6EpuXeI1rWmzC44xQ-49uA3xk5oztTAcUdeS9Hr8Ra5QFQsKPeu4UDkij",
            alt: property.title_ar,
            label: "الصورة الرئيسية",
          },
        ];

  const locationText = [
    property.governorates?.name_ar,
    property.districts?.name_ar || property.address,
  ]
    .filter(Boolean)
    .join(" - ");

  let floorText = "غير محدد";
  if (property.floor !== null && property.floor !== undefined) {
    floorText = property.floor === 0 ? "طابق أرضي" : `الطابق ${property.floor}`;
    if (property.total_floors) {
      floorText += ` من ${property.total_floors}`;
    }
  }

  const descriptionParagraphs = property.description_ar
    ? property.description_ar.split("\n").filter((p) => p.trim().length > 0)
    : [];

  return (
    <ToastProvider>
      <Header variant="back" title="تفاصيل العقار" />

      <main className="flex flex-col relative w-full pt-16 bg-transparent pb-28">
        <div className="flex flex-col w-full pb-safe">
          {/* Interactive Gallery Section */}
          <PropertyGallery
            images={galleryImages}
            dealType={property.transaction_type === "sale" ? "للبيع" : "للإيجار"}
            badgeHighlight={
              property.is_offer
                ? "عرض خاص وحصري"
                : property.is_featured
                ? "حصري لدى Axion Digital"
                : "عقار معتمد وموثق"
            }
          />

          {/* Main Body Content */}
          <div className="max-w-5xl lg:max-w-6xl mx-auto w-full px-4 py-space-lg flex flex-col gap-space-lg">
            {/* Pricing & Title Block */}
            <div className="bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] flex flex-col gap-space-xs">
              <div className="flex items-center gap-1 text-[#34211B] font-label-md text-label-md font-semibold">
                <span className="material-symbols-outlined text-[16px]">
                  location_on
                </span>
                <span>{locationText}</span>
              </div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-[#34211B] font-bold tracking-tight">
                {property.title_ar}
              </h2>
              <div className="flex items-baseline justify-between mt-2 pt-2 bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 p-3 rounded-xl">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-[#34211B]/70">
                    السعر المطلوب
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-xl-mobile text-headline-xl-mobile text-[#34211B] font-bold">
                      ${Number(property.price).toLocaleString()}
                    </span>
                    <span className="font-label-sm text-label-sm text-[#34211B]/80 font-medium">
                      {property.currency === "USD" ? "دولار أمريكي" : property.currency}
                    </span>
                  </div>
                </div>
                <div className="text-left flex flex-col items-end">
                  <span className="font-label-sm text-label-sm text-[#34211B]/70">
                    شروط الدفع
                  </span>
                  <span className="font-label-md text-label-md text-[#34211B] font-semibold bg-[#F8F6F0]/85 backdrop-blur-xs border border-[#A0BDDB]/35 px-2.5 py-1 rounded-lg">
                    {property.transaction_type === "rent"
                      ? "دفع شهري / سنوي"
                      : "تحويل بنكي / نقداً"}
                  </span>
                </div>
              </div>
            </div>

            {/* Rapid Specs Bento Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-xs bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 p-space-sm rounded-2xl shadow-[0_8px_32px_0_rgba(52,33,27,0.06)]">
              <div className="bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#34211B] text-[24px] mb-1">
                  straighten
                </span>
                <span className="font-headline-sm text-headline-sm text-[#34211B] font-bold">
                  {property.area} م²
                </span>
                <span className="font-label-sm text-label-sm text-[#34211B]/70">
                  المساحة الإجمالية
                </span>
              </div>
              <div className="bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#34211B] text-[24px] mb-1">
                  bed
                </span>
                <span className="font-headline-sm text-headline-sm text-[#34211B] font-bold">
                  {property.bedrooms}
                </span>
                <span className="font-label-sm text-label-sm text-[#34211B]/70">
                  غرف النوم
                </span>
              </div>
              <div className="bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#34211B] text-[24px] mb-1">
                  bathtub
                </span>
                <span className="font-headline-sm text-headline-sm text-[#34211B] font-bold">
                  {property.bathrooms}
                </span>
                <span className="font-label-sm text-label-sm text-[#34211B]/70">
                  حمامات بتشطيب رخام
                </span>
              </div>
              <div className="bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#34211B] text-[24px] mb-1">
                  layers
                </span>
                <span className="font-headline-sm text-headline-sm text-[#34211B] font-bold">
                  {floorText}
                </span>
                <span className="font-label-sm text-label-sm text-[#34211B]/70">
                  الطابق
                </span>
              </div>
              <div className="bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#34211B] text-[24px] mb-1">
                  explore
                </span>
                <span className="font-headline-sm text-headline-sm text-[#34211B] font-bold">
                  {property.orientation || "قبلي غربي"}
                </span>
                <span className="font-label-sm text-label-sm text-[#34211B]/70">
                  الاتجاه المشمس
                </span>
              </div>
              <div className="bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#34211B] text-[24px] mb-1">
                  verified_user
                </span>
                <span className="font-headline-sm text-headline-sm text-[#34211B] font-bold">
                  {property.legal_status || "طابو أخضر"}
                </span>
                <span className="font-label-sm text-label-sm text-[#34211B]/70">
                  الوضع القانوني
                </span>
              </div>
            </div>

            {/* Property Description */}
            <div className="bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] flex flex-col gap-space-sm">
              <h3 className="font-title-md text-title-md text-[#34211B] font-bold flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#A0BDDB] rounded-full" />
                الوصف المعماري للعقار
              </h3>
              {descriptionParagraphs.length > 0 ? (
                descriptionParagraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className="font-body-md text-body-md text-[#34211B]/80 leading-relaxed text-justify"
                  >
                    {para}
                  </p>
                ))
              ) : (
                <p className="font-body-md text-body-md text-[#34211B]/80 leading-relaxed text-justify">
                  {property.description_ar}
                </p>
              )}
            </div>

            {/* Feature Grid / Key Amenities */}
            <div className="bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h3 className="font-title-md text-title-md text-[#34211B] font-bold flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#A0BDDB] rounded-full" />
                  المواصفات والتجهيزات
                </h3>
                <span className="font-label-sm text-label-sm text-[#34211B]/70 font-semibold">
                  ميزات العقار
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xs">
                {[
                  {
                    icon: "local_parking",
                    title: "موقف سيارات مخصص",
                    desc: "موقف مسقوف تحت البناء مخصص للشقة ومزود بنظام أمان",
                  },
                  {
                    icon: "ac_unit",
                    title: "تدفئة وتكييف متطور",
                    desc: "نظام تحكم حراري منفصل لكل غرفة",
                  },
                  {
                    icon: "elevator",
                    title: "مصعد مع طاقة بديلة",
                    desc: "منظومة طاقة شمسية ومولدة صامتة مخصصة للمصعد والإنارة 24/7",
                  },
                  {
                    icon: "balcony",
                    title: "شرفة وإطلالة مفتوحة",
                    desc: "إطلالة هادئة ومفتوحة على المنطقة المحيطة",
                  },
                  {
                    icon: "shield",
                    title: "أمن وحراسة ونظام مراقبة",
                    desc: "بوابة إلكترونية، حارس مقيم، وكاميرات مراقبة محيطية",
                  },
                  {
                    icon: "diamond",
                    title: "إكساء عالي الجودة وتصميم عصري",
                    desc: "أطقم صحية ممتازة وأبواب أمان مصفحة",
                  },
                  {
                    icon: "gavel",
                    title: property.legal_status || "طابو أخضر نظامي",
                    desc: "سجل عقاري بريء الذمة وجاهز للتنازل الفوري",
                  },
                ].map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-space-md p-space-sm bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#A0BDDB]/25 backdrop-blur-md border border-[#A0BDDB]/45 text-[#34211B] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        {feat.icon}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-sm text-title-sm text-[#34211B] font-semibold truncate">
                        {feat.title}
                      </span>
                      <span className="font-body-sm text-body-sm text-[#34211B]/70 truncate">
                        {feat.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Nearby Map Section */}
            <div className="bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h3 className="font-title-md text-title-md text-[#34211B] font-bold flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#A0BDDB] rounded-full" />
                  الموقع ومحيط الحي
                </h3>
                <span className="font-label-md text-label-md text-[#34211B] font-semibold">
                  {property.districts?.name_ar || property.governorates?.name_ar || "موقع مميز"}
                </span>
              </div>
              <div
                className="w-full h-48 rounded-xl bg-cover bg-center relative overflow-hidden shadow-inner flex items-end p-3 border border-[#A0BDDB]/35"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFQYG4BTZluS4TaZqyfRyrGm0Ezw1iApdzRKuek-yN8rQy8XOvRf6BWEYC9RJoIhbv9RkkUnOYz7DYFDfROwfql_xW9tIb8oBf1QOx0FoZj3Z-vTa3pcCcfe1qL2qUAJolRwJl1ERQxd1saUkg8ml1MUSZPA7mee4kK_3qapAcmWPl_RQsU-W-AtUCdunEFRrLfuTfAKr45PA3t73cABbORCtEVEFJbKnDOtRLOQRZH68BYntxIgTk')",
                }}
              >
                <div className="bg-[#F8F6F0]/90 backdrop-blur-md border border-[#A0BDDB]/40 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow">
                  <span className="material-symbols-outlined text-[#34211B] text-[18px]">
                    near_me
                  </span>
                  <span className="font-label-md text-label-md text-[#34211B] font-semibold">
                    {locationText}: {property.address}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-space-xs">
                <div className="p-space-sm bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#34211B] text-[18px]">
                    park
                  </span>
                  <span className="font-body-sm text-body-sm text-[#34211B] font-medium">
                    قريب من المساحات الخضراء
                  </span>
                </div>
                <div className="p-space-sm bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#34211B] text-[18px]">
                    local_cafe
                  </span>
                  <span className="font-body-sm text-body-sm text-[#34211B] font-medium">
                    قريب من المطاعم والمقاهي
                  </span>
                </div>
                <div className="p-space-sm bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#34211B] text-[18px]">
                    local_hospital
                  </span>
                  <span className="font-body-sm text-body-sm text-[#34211B] font-medium">
                    قريب من المراكز الطبية
                  </span>
                </div>
                <div className="p-space-sm bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#34211B] text-[18px]">
                    school
                  </span>
                  <span className="font-body-sm text-body-sm text-[#34211B] font-medium">
                    قريب من المدارس المعتمدة
                  </span>
                </div>
              </div>
            </div>

            {/* Inspection Booking Form */}
            <InspectionBookingForm
              propertyId={property.id}
              propertyTitle={property.title_ar}
            />
          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <FloatingContactBar
        phone={companySettings.phone}
        whatsapp={companySettings.whatsapp}
        propertyTitle={property.title_ar}
      />
    </ToastProvider>
  );
}
