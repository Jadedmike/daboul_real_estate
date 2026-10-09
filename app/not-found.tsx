import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-gutter-mobile pt-20 pb-8 text-center bg-surface">
        <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center text-secondary-container mb-space-md shadow-inner">
          <span className="material-symbols-outlined text-[42px]">
            real_estate_agent
          </span>
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface font-bold mb-space-xs">
          العقار غير موجود أو غير متاح
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-space-lg">
          عذراً، العقار الذي تبحث عنه قد تم بيعه أو إيقاف عرضه العام، أو أن الرابط غير صحيح.
        </p>
        <div className="flex items-center gap-space-sm">
          <Link
            href="/properties"
            className="px-space-lg h-12 bg-primary hover:bg-primary-container text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm shadow-md transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              travel_explore
            </span>
            <span>تصفح كافة العقارات</span>
          </Link>
          <Link
            href="/"
            className="px-space-md h-12 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm transition-colors"
          >
            <span>الصفحة الرئيسية</span>
          </Link>
        </div>
      </main>
    </>
  );
}
