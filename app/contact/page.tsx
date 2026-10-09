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
  title: "تواصل معنا | دعبول العقارية",
  description:
    "تواصل مباشرة مع فريق دعبول العقارية في دمشق وسوريا عبر الهاتف، الواتساب، أو البريد الإلكتروني لحجز موعد أو استشارة عقارية.",
  openGraph: {
    title: "تواصل معنا | دعبول العقارية",
    description:
      "تواصل مباشرة مع فريق دعبول العقارية في دمشق وسوريا عبر الهاتف، الواتساب، أو البريد الإلكتروني.",
    type: "website",
  },
};

export default async function ContactPage() {
  const settings = await getCompanySettings();

  const telLink = formatTelUrl(settings.phone);
  const waLink = formatWhatsAppUrl(
    settings.whatsapp,
    "مرحباً دعبول العقارية، أرغب في الاستفسار عن خدماتكم العقارية."
  );
  const mailLink = `mailto:${settings.email}`;

  return (
    <ToastProvider>
      <Header variant="back" title="تواصل معنا" />

      <main className="flex flex-col relative w-full pt-16 bg-surface" dir="rtl">
        <div className="flex flex-col w-full px-gutter-mobile py-space-md space-y-space-md max-w-3xl mx-auto">
          {/* Header Banner */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs border border-outline-variant/30">
            <div className="flex items-center gap-space-xs text-secondary">
              <span className="material-symbols-outlined text-[24px]">
                support_agent
              </span>
              <span className="font-label-md text-label-md font-semibold">
                خدمة العملاء والاستشارات المعتمدة
              </span>
            </div>
            <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              تواصل مع {settings.company_name_ar}
            </h1>
            <p className="font-body-sm text-body-sm text-outline leading-relaxed">
              {settings.short_description}
            </p>
          </div>

          {/* Quick Direct Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs">
            {/* Phone */}
            <a
              href={telLink}
              className="p-space-sm bg-surface-container-low hover:bg-surface-container rounded-xl flex flex-col items-center text-center gap-1 transition-all border border-outline-variant/20 shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  call
                </span>
              </div>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                اتصال هاتفي
              </span>
              <span className="font-label-sm text-label-sm text-outline font-mono" dir="ltr">
                {settings.phone}
              </span>
            </a>

            {/* WhatsApp */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-space-sm bg-surface-container-low hover:bg-surface-container rounded-xl flex flex-col items-center text-center gap-1 transition-all border border-outline-variant/20 shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  chat
                </span>
              </div>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                واتساب مباشر
              </span>
              <span className="font-label-sm text-label-sm text-outline font-mono" dir="ltr">
                {settings.whatsapp}
              </span>
            </a>

            {/* Email */}
            <a
              href={mailLink}
              className="p-space-sm bg-surface-container-low hover:bg-surface-container rounded-xl flex flex-col items-center text-center gap-1 transition-all border border-outline-variant/20 shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-secondary-container/10 text-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">
                  mail
                </span>
              </div>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                البريد الإلكتروني
              </span>
              <span className="font-label-sm text-label-sm text-outline truncate max-w-full">
                {settings.email}
              </span>
            </a>
          </div>

          {/* Headquarters Information Details */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/30">
            <h2 className="font-title-sm text-title-sm text-on-surface font-bold flex items-center gap-2">
              <span className="w-1.5 h-4 bg-secondary rounded-full" />
              <span>بيانات المقر الرئيسي وساعات العمل</span>
            </h2>

            <div className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-start gap-space-xs p-2 bg-surface-container-low rounded-lg">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                  location_on
                </span>
                <div>
                  <span className="font-label-sm text-label-sm text-outline block">
                    العنوان المعتمد
                  </span>
                  <span className="text-on-surface font-semibold">
                    {settings.address}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-xs p-2 bg-surface-container-low rounded-lg">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                  schedule
                </span>
                <div>
                  <span className="font-label-sm text-label-sm text-outline block">
                    ساعات وأوقات العمل
                  </span>
                  <span className="text-on-surface font-semibold">
                    {settings.working_hours}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-space-xs p-2 bg-surface-container-low rounded-lg">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                  verified
                </span>
                <div>
                  <span className="font-label-sm text-label-sm text-outline block">
                    الترخيص القانوني
                  </span>
                  <span className="text-on-surface">
                    وساطة وتطوير عقاري مرخص أصولاً - الجمهورية العربية السورية
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Inquiry & Message Booking */}
          <InspectionBookingForm />

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
              <Link href="/about" className="hover:text-primary transition-colors">
                من نحن
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
