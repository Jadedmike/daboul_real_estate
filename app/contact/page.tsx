import React from "react";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { InspectionBookingForm } from "@/components/property/InspectionBookingForm";
import { ToastProvider } from "@/components/ui/Toast";
import { getCompanySettings } from "@/lib/actions/settings";
import { formatTelUrl, formatWhatsAppUrl } from "@/lib/utils/format";
import Link from "next/link";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "تواصل معنا | Axion Digital",
  description:
    "تواصل مباشرة مع فريق Axion Digital في دمشق وسوريا عبر الهاتف، الواتساب، أو البريد الإلكتروني لحجز موعد أو استشارة عقارية.",
  openGraph: {
    title: "تواصل معنا | Axion Digital",
    description:
      "تواصل مباشرة مع فريق Axion Digital في دمشق وسوريا عبر الهاتف، الواتساب، أو البريد الإلكتروني.",
    type: "website",
  },
};

export default async function ContactPage() {
  const settings = await getCompanySettings();

  const telLink = formatTelUrl(settings.phone);
  const waLink = formatWhatsAppUrl(
    settings.whatsapp,
    "مرحباً Axion Digital، أرغب في الاستفسار عن خدماتكم العقارية."
  );
  const mailLink = `mailto:${settings.email}`;

  return (
    <ToastProvider>
      <Header variant="back" title="تواصل معنا" />

      <main className="flex flex-col relative w-full pt-16 bg-transparent" dir="rtl">
        <div className="flex flex-col w-full px-4 py-space-md space-y-space-md max-w-5xl lg:max-w-6xl mx-auto">
          {/* Header Banner */}
          <div className="bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs text-[#34211B]">
              <span className="material-symbols-outlined text-[24px]">
                support_agent
              </span>
              <span className="font-label-md text-label-md font-bold">
                خدمة العملاء والاستشارات المعتمدة
              </span>
            </div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-[#34211B]">
              تواصل مع {settings.company_name_ar}
            </h1>
            <p className="font-body-sm text-body-sm text-[#34211B]/75 leading-relaxed">
              {settings.short_description}
            </p>
          </div>

          {/* Quick Direct Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs">
            {/* Phone */}
            <a
              href={telLink}
              className="p-space-sm bg-[#EDE7DC]/55 hover:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/30 rounded-2xl flex flex-col items-center text-center gap-1 transition-all shadow-[0_4px_16px_rgba(52,33,27,0.04)]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#A0BDDB]/25 text-[#34211B] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  call
                </span>
              </div>
              <span className="font-title-sm text-title-sm text-[#34211B] font-bold">
                اتصال هاتفي
              </span>
              <span className="font-label-sm text-label-sm text-[#34211B]/70 font-mono" dir="ltr">
                {settings.phone}
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-space-sm bg-[#EDE7DC]/55 hover:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/30 rounded-2xl flex flex-col items-center text-center gap-1 transition-all shadow-[0_4px_16px_rgba(52,33,27,0.04)]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#A0BDDB]/25 text-[#34211B] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  chat
                </span>
              </div>
              <span className="font-title-sm text-title-sm text-[#34211B] font-bold">
                واتساب مباشر
              </span>
              <span className="font-label-sm text-label-sm text-[#34211B]/70 font-mono" dir="ltr">
                {settings.whatsapp}
              </span>
            </a>

            {/* Email */}
            <a
              href={mailLink}
              className="p-space-sm bg-[#EDE7DC]/55 hover:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/30 rounded-2xl flex flex-col items-center text-center gap-1 transition-all shadow-[0_4px_16px_rgba(52,33,27,0.04)]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#A0BDDB]/25 text-[#34211B] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  mail
                </span>
              </div>
              <span className="font-title-sm text-title-sm text-[#34211B] font-bold">
                البريد الإلكتروني
              </span>
              <span className="font-label-sm text-label-sm text-[#34211B]/70 truncate max-w-full">
                {settings.email}
              </span>
            </a>
          </div>

          {/* Headquarters Information Details */}
          <div className="bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] flex flex-col gap-space-sm">
            <h2 className="font-title-sm text-title-sm text-[#34211B] font-bold flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#A0BDDB] rounded-full" />
              <span>بيانات المقر الرئيسي وساعات العمل</span>
            </h2>

            <div className="space-y-space-xs font-body-sm text-body-sm text-[#34211B]/80">
              <div className="flex items-start gap-space-xs p-2.5 bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl">
                <span className="material-symbols-outlined text-[#34211B] text-[20px] shrink-0 mt-0.5">
                  location_on
                </span>
                <div>
                  <span className="font-label-sm text-label-sm text-[#34211B]/70 block font-medium">
                    العنوان المعتمد
                  </span>
                  <span className="text-[#34211B] font-semibold">
                    {settings.address}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-xs p-2.5 bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl">
                <span className="material-symbols-outlined text-[#34211B] text-[20px] shrink-0 mt-0.5">
                  schedule
                </span>
                <div>
                  <span className="font-label-sm text-label-sm text-[#34211B]/70 block font-medium">
                    ساعات وأوقات العمل
                  </span>
                  <span className="text-[#34211B] font-semibold">
                    {settings.working_hours}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-xs p-2.5 bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 rounded-xl">
                <span className="material-symbols-outlined text-[#34211B] text-[20px] shrink-0 mt-0.5">
                  verified
                </span>
                <div>
                  <span className="font-label-sm text-label-sm text-[#34211B]/70 block font-medium">
                    الترخيص القانوني
                  </span>
                  <span className="text-[#34211B] font-medium">
                    وساطة وتطوير عقاري مرخص أصولاً - الجمهورية العربية السورية
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Inquiry & Message Booking */}
          <InspectionBookingForm />

          {/* Syrian Real Estate Footer */}
          <footer className="mt-space-lg bg-[#F8F6F0]/85 backdrop-blur-xl border border-[#A0BDDB]/35 p-space-md rounded-2xl flex flex-col gap-space-sm text-[#34211B] shadow-xs">
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
              <Link href="/about" className="hover:text-[#34211B] font-medium transition-colors">
                من نحن
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
