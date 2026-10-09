import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui/Toast";
import { getCompanySettings } from "@/lib/actions/settings";
import { formatWhatsAppUrl } from "@/lib/utils/format";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "من نحن | دعبول العقارية",
  description:
    "تعرف على شركة دعبول العقارية، الشريك العقاري المعتمد والموثق للوساطة والاستثمار والتطوير العقاري في سوريا.",
  openGraph: {
    title: "من نحن | دعبول العقارية",
    description:
      "الشركة السورية الرائدة في الوساطة والاستثمار والتطوير العقاري في دمشق والمحافظات السورية.",
    type: "website",
  },
};

export default async function AboutPage() {
  const settings = await getCompanySettings();
  const waUrl = formatWhatsAppUrl(
    settings.whatsapp,
    "مرحباً دعبول العقارية، أود الاستفسار عن خدماتكم."
  );

  const pillars = [
    {
      title: "خبرة عقارية راسخة",
      desc: "فهم عميق ودقيق لحركة السوق العقاري السوري والتطورات العمرانية في دمشق والمحافظات.",
      icon: "history_edu",
    },
    {
      title: "توثيق قانوني معتمد",
      desc: "تدقيق شامل لسندات الملكية والبيانات المالية وضمان صحة العقود والمعاملات الرسمية.",
      icon: "verified_user",
    },
    {
      title: "تقييم هندسي دقيق",
      desc: "فريق هندسي متخصص لتقييم العقارات فنياً ومعمارياً لضمان السعر العادل والفرص الحقيقية.",
      icon: "architecture",
    },
    {
      title: "سرية واحترافية تامة",
      desc: "حماية تامة لخصوصية العملاء وسرية الصفقات الاستثمارية بأعلى معايير الأمانة والمصداقية.",
      icon: "security",
    },
  ];

  return (
    <ToastProvider>
      <Header variant="back" title="من نحن" />

      <main className="flex flex-col relative w-full pt-16 bg-surface" dir="rtl">
        <div className="flex flex-col w-full px-gutter-mobile py-space-md space-y-space-md max-w-3xl mx-auto">
          {/* Company Hero Card */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
            <div className="flex items-center gap-space-xs">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
                <span className="font-headline-sm text-headline-sm text-secondary-container">
                  D
                </span>
              </div>
              <div className="flex flex-col">
                <h1 className="font-title-md text-title-md font-bold text-primary leading-tight">
                  {settings.company_name_ar}
                </h1>
                <span className="font-label-sm text-label-sm text-outline">
                  {settings.company_name_en}
                </span>
              </div>
            </div>

            <p className="font-body-md text-body-md text-on-surface leading-relaxed pt-2">
              {settings.short_description}
            </p>
          </div>

          {/* Pillars of Trust */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
            <h2 className="font-title-sm text-title-sm text-on-surface font-bold flex items-center gap-2">
              <span className="w-1.5 h-4 bg-secondary rounded-full" />
              <span>أعمدة الثقة والمصداقية في دعبول العقارية</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs pt-1">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-space-sm bg-surface-container-low rounded-lg flex items-start gap-space-xs"
                >
                  <div className="w-9 h-9 rounded-lg bg-secondary-container/15 text-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">
                      {pillar.icon}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                      {pillar.title}
                    </span>
                    <span className="font-body-sm text-body-sm text-outline leading-normal mt-0.5">
                      {pillar.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Presence */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
            <h2 className="font-title-sm text-title-sm text-on-surface font-bold flex items-center gap-2">
              <span className="w-1.5 h-4 bg-secondary rounded-full" />
              <span>نطاق التغطية والاستثمار</span>
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              تغطي خدماتنا الاستشارية والتسويقية أرقى المناطق السكنية والمراكز التجارية والاستثمارية في:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-label-md text-label-md">
              <div className="p-2 bg-surface-container-low rounded-lg text-center font-semibold text-primary">
                دمشق العاصمة
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg text-center font-semibold text-primary">
                ريف دمشق ويعفور
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg text-center font-semibold text-primary">
                حلب والشهباء
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg text-center font-semibold text-primary">
                اللاذقية والساحل
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg text-center font-semibold text-primary">
                طرطوس والكورنيش
              </div>
              <div className="p-2 bg-surface-container-low rounded-lg text-center font-semibold text-primary">
                حمص والمراكز الحيوية
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="p-space-md bg-primary text-on-primary rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-sm shadow-md">
            <div className="flex flex-col text-center sm:text-right">
              <span className="font-title-sm text-title-sm font-bold">
                هل تبحث عن فرصة استثمارية أو ترغب ببيع عقارك؟
              </span>
              <span className="font-body-sm text-body-sm text-surface-container-high">
                فريقنا بانتظارك لتقديم الاستشارة الأنسب وتنسيق المعاينة الميدانية.
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/contact"
                className="flex-1 sm:flex-none px-space-md py-2 bg-secondary-container text-on-primary rounded-lg font-title-sm text-title-sm text-center shadow-xs hover:bg-secondary transition-colors"
              >
                تواصل معنا
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-space-md py-2 bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-on-primary rounded-lg font-title-sm text-title-sm text-center backdrop-blur-md transition-colors"
              >
                واتساب
              </a>
            </div>
          </div>

          {/* Syrian Real Estate Footer */}
          <footer className="mt-space-lg bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-sm text-on-surface border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-title-sm text-title-sm font-bold text-primary">
                {settings.company_name_ar}
              </span>
              <span className="font-label-sm text-label-sm text-outline">
                {settings.company_name_en}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-label-md text-label-md text-outline">
              <Link href="/" className="hover:text-primary transition-colors">
                الرئيسية
              </Link>
              <Link href="/properties" className="hover:text-primary transition-colors">
                العقارات
              </Link>
              <Link href="/contact" className="hover:text-primary transition-colors">
                تواصل معنا
              </Link>
              <Link href="/admin" className="hover:text-primary transition-colors">
                بوابة الإدارة
              </Link>
            </div>
            <div className="pt-2 border-t border-outline-variant/20 text-center font-label-sm text-label-sm text-outline">
              جميع الحقوق محفوظة © 2026 {settings.company_name_ar}
            </div>
          </footer>
        </div>
      </main>
    </ToastProvider>
  );
}
