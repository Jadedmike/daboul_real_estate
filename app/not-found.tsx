import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-[75vh] px-gutter-mobile pt-24 pb-12 text-center bg-transparent">
        <div className="max-w-md w-full bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 rounded-2xl p-space-lg shadow-[0_8px_32px_0_rgba(52,33,27,0.08)] flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-[#A0BDDB]/25 border border-[#A0BDDB]/40 flex items-center justify-center text-[#34211B] mb-space-md shadow-sm">
            <span className="material-symbols-outlined text-[42px]">
              real_estate_agent
            </span>
          </div>
          <h1 className="font-headline-md text-headline-md text-[#34211B] font-bold mb-space-xs">
            العقار غير موجود أو غير متاح
          </h1>
          <p className="font-body-md text-body-md text-[#34211B]/70 max-w-sm mb-space-lg leading-relaxed">
            عذراً، العقار الذي تبحث عنه قد تم بيعه أو إيقاف عرضه العام، أو أن الرابط غير صحيح.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full">
            <Link
              href="/properties"
              className="w-full sm:flex-1 h-12 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-xl flex items-center justify-center gap-space-xs font-title-sm text-title-sm shadow-md transition-all active:scale-[0.98] border border-[#A0BDDB]/20"
            >
              <span className="material-symbols-outlined text-[20px]">
                travel_explore
              </span>
              <span>تصفح كافة العقارات</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:flex-1 h-12 bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 backdrop-blur-md border border-[#A0BDDB]/35 text-[#34211B] rounded-xl flex items-center justify-center gap-space-xs font-title-sm text-title-sm transition-all active:scale-[0.98]"
            >
              <span>الصفحة الرئيسية</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
