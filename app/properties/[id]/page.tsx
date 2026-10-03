import React from "react";
import { Header } from "@/components/layout/Header";
import { PropertyGallery } from "@/components/gallery/PropertyGallery";
import { InspectionBookingForm } from "@/components/property/InspectionBookingForm";
import { FloatingContactBar } from "@/components/ui/FloatingContactBar";
import { PROPERTIES } from "@/lib/data";
import { ToastProvider } from "@/components/ui/Toast";

export function generateStaticParams() {
  return PROPERTIES.map((prop) => ({
    id: prop.id,
  }));
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property =
    PROPERTIES.find((p) => p.id === id) || PROPERTIES[0];

  const galleryImages =
    property.images && property.images.length > 0
      ? property.images
      : [
          {
            url: property.imageUrl,
            alt: property.imageAlt,
            label: "الصورة الرئيسية",
          },
        ];

  return (
    <ToastProvider>
      <Header variant="back" title="Property Details" />

      <main className="flex flex-col relative w-full pt-16 bg-surface pb-28">
        <div className="flex flex-col w-full pb-safe">
          {/* Interactive Gallery Section */}
          <PropertyGallery
            images={galleryImages}
            dealType={property.dealType === "sale" ? "للبيع" : "للإيجار"}
            badgeHighlight={property.badgeHighlight || "حصري لدى دعبول"}
          />

          {/* Main Body Content */}
          <div className="px-gutter-mobile py-space-lg flex flex-col gap-space-lg">
            {/* Pricing & Title Block */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
              <div className="flex items-center gap-1 text-secondary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[16px]">
                  location_on
                </span>
                <span>{property.location}</span>
              </div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface font-bold tracking-tight">
                {property.title}
              </h2>
              <div className="flex items-baseline justify-between mt-2 pt-2 bg-surface-container-low p-3 rounded-lg">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-outline">
                    السعر المطلوب
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-xl-mobile text-headline-xl-mobile text-secondary font-bold">
                      {property.price}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {property.priceNote || "دولار أمريكي"}
                    </span>
                  </div>
                </div>
                <div className="text-left flex flex-col items-end">
                  <span className="font-label-sm text-label-sm text-outline">
                    شروط الدفع
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold bg-surface-container-high px-2 py-0.5 rounded">
                    {property.paymentTerms || "تحويل بنكي / نقداً"}
                  </span>
                </div>
              </div>
            </div>

            {/* Rapid Specs Bento Matrix */}
            <div className="grid grid-cols-3 gap-space-xs bg-surface-container-lowest p-space-sm rounded-xl shadow-sm">
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px] mb-1">
                  straighten
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {property.area}
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  المساحة الإجمالية
                </span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px] mb-1">
                  bed
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {property.bedrooms}
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  غرف النوم
                </span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px] mb-1">
                  bathtub
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {property.bathrooms}
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  حمامات بتشطيب رخام
                </span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px] mb-1">
                  layers
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {property.floor || "الرابع"}
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  الطابق
                </span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px] mb-1">
                  explore
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  قبلي غربي
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  الاتجاه المشمس
                </span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-secondary text-[24px] mb-1">
                  verified_user
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  2400
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  سهم طابو أخضر
                </span>
              </div>
            </div>

            {/* Property Description */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
              <h3 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
                <span className="w-1.5 h-4 bg-secondary rounded-full" />
                الوصف المعماري للعقار
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-justify">
                فرصة استثمارية وسكنية نادرة في قلب حي المالكي العريق، أرقى أحياء العاصمة دمشق. تم تصميم الشقة وفق أعلى معايير الحداثة والراحة المعمارية، وتتميز بتوزيع داخلي ذكي يفصل جناح الاستقبال والصالونات البانورامية عن الأجنحة الخاصة للعائلة.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed text-justify">
                تتمتع الشقة بإنارة طبيعية ممتدة طوال النهار بفضل الواجهات الزجاجية المزدوجة العازلة والاتجاه القبلي الغربي المفتوح، مع إطلالة خلابة لا تُحجب على المساحات الخضراء وجبل قاسيون. تم تنفيذ الإكساء بالكامل باستيراد خاص من أفخر أنواع الرخام الإيطالي وخشب الجوز الطبيعي.
              </p>
            </div>

            {/* Feature Grid / Key Amenities */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h3 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-secondary rounded-full" />
                  المواصفات والتجهيزات
                </h3>
                <span className="font-label-sm text-label-sm text-outline">
                  7 ميزات رئيسية
                </span>
              </div>
              <div className="grid grid-cols-1 gap-space-xs">
                {[
                  {
                    icon: "local_parking",
                    title: "موقف سيارات خاص ومستقل",
                    desc: "موقف مسقوف تحت البناء مخصص للشقة ومزود بنظام أمان",
                  },
                  {
                    icon: "ac_unit",
                    title: "تدفئة وتكييف مركزي متطور",
                    desc: "نظام Chiller منفصل مع تحكم رقمي حراري لكل غرفة",
                  },
                  {
                    icon: "elevator",
                    title: "مصعد هيدروليك مع طاقة بديلة",
                    desc: "منظومة طاقة شمسية ومولدة صامتة مخصصة للمصعد والإنارة 24/7",
                  },
                  {
                    icon: "balcony",
                    title: "شرفة بانورامية واسعة (تراس)",
                    desc: "إطلالة هادئة ومفتوحة على الأشجار المحيطة بدون كشف مباشر",
                  },
                  {
                    icon: "shield",
                    title: "أمن وحراسة 24/7 وكاميرات",
                    desc: "بوابة إلكترونية، حارس مقيم، وكاميرات مراقبة محيطية فائقة الدقة",
                  },
                  {
                    icon: "diamond",
                    title: "إكساء سوبر ديلوكس حديث",
                    desc: "أطقم صحية ماركة Villeroy & Boch وأبواب أمان مصفحة",
                  },
                  {
                    icon: "gavel",
                    title: "طابو أخضر نظامي 2400 سهم",
                    desc: "سجل عقاري بريء الذمة وجاهز للتنازل الفوري في دمشق",
                  },
                ].map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-space-md p-space-sm bg-surface-container-low rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">
                        {feat.icon}
                      </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">
                        {feat.title}
                      </span>
                      <span className="font-body-sm text-body-sm text-outline truncate">
                        {feat.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Nearby Map Section */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <h3 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-secondary rounded-full" />
                  الموقع ومحيط الحي
                </h3>
                <span className="font-label-md text-label-md text-secondary font-semibold">
                  حي السفارات والهدوء
                </span>
              </div>
              <div
                className="w-full h-48 rounded-xl bg-cover bg-center relative overflow-hidden shadow-inner flex items-end p-3"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFQYG4BTZluS4TaZqyfRyrGm0Ezw1iApdzRKuek-yN8rQy8XOvRf6BWEYC9RJoIhbv9RkkUnOYz7DYFDfROwfql_xW9tIb8oBf1QOx0FoZj3Z-vTa3pcCcfe1qL2qUAJolRwJl1ERQxd1saUkg8ml1MUSZPA7mee4kK_3qapAcmWPl_RQsU-W-AtUCdunEFRrLfuTfAKr45PA3t73cABbORCtEVEFJbKnDOtRLOQRZH68BYntxIgTk')",
                }}
              >
                <div className="bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    near_me
                  </span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    دمشق - المالكي (بالقرب من السفارة الإيطالية)
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-space-xs">
                <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    park
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    3 دقائق إلى حديقة الجاحظ
                  </span>
                </div>
                <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    local_cafe
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    دقيقتان إلى أرقى المقاهي
                  </span>
                </div>
                <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    local_hospital
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    5 دقائق إلى مشفى الشامي
                  </span>
                </div>
                <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    school
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface">
                    قريب من المدارس المعتمدة
                  </span>
                </div>
              </div>
            </div>

            {/* Inspection Booking Form */}
            <InspectionBookingForm />
          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <FloatingContactBar />
    </ToastProvider>
  );
}
