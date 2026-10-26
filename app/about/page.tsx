import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ToastProvider } from "@/components/ui/Toast";
import { getCompanySettings } from "@/lib/actions/settings";
import { formatWhatsAppUrl } from "@/lib/utils/format";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "من نحن | Axion Digital",
  description:
    "تعرف على شركة Axion Digital، الشريك العقاري المعتمد والموثق للوساطة والاستثمار والتطوير العقاري في سوريا.",
  openGraph: {
    title: "من نحن | Axion Digital",
    description:
      "الشركة السورية الرائدة في الوساطة والاستثمار والتطوير العقاري في دمشق والمحافظات السورية.",
    type: "website",
  },
};

export default async function AboutPage() {
  const settings = await getCompanySettings();
  const waUrl = formatWhatsAppUrl(
    settings.whatsapp,
    "مرحباً Axion Digital، أود الاستفسار عن خدماتكم."
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

      <main className="flex flex-col relative w-full pt-16 bg-transparent" dir="rtl">
        <div className="flex flex-col w-full px-4 py-space-md space-y-space-md max-w-5xl lg:max-w-6xl mx-auto">
          {/* Company Hero Card */}
          <div className="bg-[#F8F6F0]/80 backdrop-blur-xl p-space-md rounded-2xl shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] flex flex-col gap-space-xs border border-[#A0BDDB]/35">
            <div className="flex flex-col">
              <h1 className="font-title-md text-title-md font-bold text-[#34211B] leading-tight">
                {settings.company_name_ar}
              </h1>
              <span className="font-label-sm text-label-sm text-[#34211B]/70">
                {settings.company_name_en}
              </span>
            </div>

            <p className="font-body-md text-body-md text-[#34211B]/85 leading-relaxed pt-2">
              {settings.short_description}
            </p>
          </div>

          {/* Pillars of Trust */}
          <div className="bg-[#F8F6F0]/80 backdrop-blur-xl p-space-md rounded-2xl shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] flex flex-col gap-space-sm border border-[#A0BDDB]/35">
            <h2 className="font-title-sm text-title-sm text-[#34211B] font-bold flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#A0BDDB] rounded-full" />
              <span>أعمدة الثقة والمصداقية في Axion Digital</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs pt-1">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="p-space-sm bg-[#EDE7DC]/55 backdrop-blur-md rounded-xl border border-[#A0BDDB]/30 flex items-start gap-space-xs hover:bg-[#F8F6F0] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#A0BDDB]/25 text-[#34211B] border border-[#A0BDDB]/45 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">
                      {pillar.icon}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-[#34211B] font-semibold">
                      {pillar.title}
                    </span>
                    <span className="font-body-sm text-body-sm text-[#34211B]/70 leading-normal mt-0.5">
                      {pillar.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Presence */}
          <div className="bg-[#F8F6F0]/80 backdrop-blur-xl p-space-md rounded-2xl shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] flex flex-col gap-space-xs border border-[#A0BDDB]/35">
            <h2 className="font-title-sm text-title-sm text-[#34211B] font-bold flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#A0BDDB] rounded-full" />
              <span>نطاق التغطية والاستثمار</span>
            </h2>
            <p className="font-body-sm text-body-sm text-[#34211B]/80 leading-relaxed">
              تغطي خدماتنا الاستشارية والتسويقية أرقى المناطق السكنية والمراكز التجارية والاستثمارية في:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-label-md text-label-md">
              <div className="p-2.5 bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl text-center font-semibold text-[#34211B] hover:bg-[#F8F6F0] transition-colors">
                دمشق العاصمة
              </div>
              <div className="p-2.5 bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl text-center font-semibold text-[#34211B] hover:bg-[#F8F6F0] transition-colors">
                ريف دمشق ويعفور
              </div>
              <div className="p-2.5 bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl text-center font-semibold text-[#34211B] hover:bg-[#F8F6F0] transition-colors">
                حلب والشهباء
              </div>
              <div className="p-2.5 bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl text-center font-semibold text-[#34211B] hover:bg-[#F8F6F0] transition-colors">
                اللاذقية والساحل
              </div>
              <div className="p-2.5 bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl text-center font-semibold text-[#34211B] hover:bg-[#F8F6F0] transition-colors">
                طرطوس والكورنيش
              </div>
              <div className="p-2.5 bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl text-center font-semibold text-[#34211B] hover:bg-[#F8F6F0] transition-colors">
                حمص والمراكز الحيوية
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="p-space-md bg-[#34211B]/90 backdrop-blur-xl text-[#F8F6F0] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-space-sm shadow-[0_8px_32px_0_rgba(52,33,27,0.18)] border border-[#A0BDDB]/35">
            <div className="flex flex-col text-center sm:text-right">
              <span className="font-title-sm text-title-sm font-bold text-[#F8F6F0]">
                هل تبحث عن فرصة استثمارية أو ترغب ببيع عقارك؟
              </span>
              <span className="font-body-sm text-body-sm text-[#F8F6F0]/80">
                فريقنا بانتظارك لتقديم الاستشارة الأنسب وتنسيق المعاينة الميدانية.
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                href="/contact"
                className="flex-1 sm:flex-none px-space-md py-2.5 bg-[#A0BDDB] text-[#34211B] rounded-xl font-title-sm text-title-sm text-center shadow-md hover:bg-[#8faecf] transition-colors font-bold"
              >
                تواصل معنا
              </Link>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-space-md py-2.5 bg-[#F8F6F0]/15 hover:bg-[#F8F6F0]/25 border border-[#A0BDDB]/35 text-[#F8F6F0] rounded-xl font-title-sm text-title-sm text-center backdrop-blur-md transition-colors font-medium"
              >
                واتساب
              </a>
            </div>
          </div>

          {/* Syrian Real Estate Footer */}
          <footer className="mt-space-lg bg-[#F8F6F0]/85 backdrop-blur-xl p-space-md rounded-2xl flex flex-col gap-space-sm text-[#34211B] border border-[#A0BDDB]/35 shadow-[0_8px_32px_0_rgba(52,33,27,0.06)]">
            <div className="flex items-center justify-between">
              <span className="font-title-sm text-title-sm font-bold text-[#34211B]">
                {settings.company_name_ar}
              </span>
              <span className="font-label-sm text-label-sm text-[#34211B]/70">
                {settings.company_name_en}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-label-md text-label-md text-[#34211B]/75">
              <Link href="/" className="hover:text-[#34211B] font-medium transition-colors">
                الرئيسية
              </Link>
              <Link href="/properties" className="hover:text-[#34211B] font-medium transition-colors">
                العقارات
              </Link>
              <Link href="/contact" className="hover:text-[#34211B] font-medium transition-colors">
                تواصل معنا
              </Link>
              <Link href="/admin" className="hover:text-[#34211B] font-medium transition-colors">
                بوابة الإدارة
              </Link>
            </div>
            <div className="pt-2 border-t border-[#A0BDDB]/25 text-center font-label-sm text-label-sm text-[#34211B]/70">
              جميع الحقوق محفوظة © 2026 {settings.company_name_ar}
            </div>
          </footer>
        </div>
      </main>
    </ToastProvider>
  );
}
