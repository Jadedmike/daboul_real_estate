import React from "react";
import Link from "next/link";
import { verifyAdminOrRedirect } from "@/lib/auth/admin";
import { getLocationsData } from "@/lib/actions/properties";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  // Server-side authentication and admin authorization check
  await verifyAdminOrRedirect();

  // Load real governorates and districts from Supabase
  const { governorates, districts } = await getLocationsData();

  return (
    <>
      <AdminHeader />

      <main className="flex flex-col relative w-full pt-16 bg-[#F8F6F0] min-h-screen">
        <div className="flex flex-col w-full max-w-4xl mx-auto px-gutter-mobile py-space-sm space-y-space-md" dir="rtl">
          {/* Top Breadcrumb & Page Title */}
          <div className="bg-[#F8F6F0]/80 backdrop-blur-xl rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.08)] border border-[#A0BDDB]/35 flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-xl bg-[#34211B] flex items-center justify-center text-[#F8F6F0] font-bold shadow-md border border-[#A0BDDB]/20">
                <span className="material-symbols-outlined text-[24px] text-[#A0BDDB]">
                  add_home
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-label-sm text-[#34211B]/60">
                  <Link href="/admin" className="hover:text-[#34211B] transition-colors">
                    لوحة التحكم
                  </Link>
                  <span>/</span>
                  <span className="text-[#34211B] font-semibold">إضافة عقار جديد</span>
                </div>
                <h1 className="font-headline-sm text-headline-sm text-[#34211B] font-bold mt-0.5">
                  إضافة عقار جديد إلى المنصة
                </h1>
              </div>
            </div>

            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-xl bg-[#EDE7DC] text-[#34211B] hover:bg-[#EDE7DC]/80 text-label-md font-label-md transition-colors flex items-center gap-1 border border-[#A0BDDB]/30 font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
              <span>العودة</span>
            </Link>
          </div>

          {/* Creation Form */}
          <PropertyForm
            governorates={governorates}
            districts={districts}
            isEditing={false}
          />
        </div>
      </main>
    </>
  );
}
