import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { verifyAdminOrRedirect } from "@/lib/auth/admin";
import {
  getPropertyById,
  getPropertyImages,
  getLocationsData,
} from "@/lib/actions/properties";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { PropertyForm } from "@/components/admin/PropertyForm";

export const dynamic = "force-dynamic";

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  // Server-side authentication and admin authorization check
  await verifyAdminOrRedirect();

  const { id } = await params;

  // Load existing property data from Supabase
  const property = await getPropertyById(id);
  if (!property) {
    notFound();
  }

  // Load existing images from Supabase
  const images = await getPropertyImages(id);

  // Load governorates and districts
  const { governorates, districts } = await getLocationsData();

  return (
    <>
      <AdminHeader />

      <main className="flex flex-col relative w-full pt-16 pb-20 bg-surface">
        <div className="flex flex-col w-full max-w-4xl mx-auto px-gutter-mobile py-space-sm space-y-space-md" dir="rtl">
          {/* Top Breadcrumb & Page Title */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-md">
                <span className="material-symbols-outlined text-[24px] text-secondary-container">
                  edit
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-label-sm text-outline">
                  <Link href="/admin" className="hover:text-primary transition-colors">
                    لوحة التحكم
                  </Link>
                  <span>/</span>
                  <span className="text-on-surface">تعديل بيانات العقار</span>
                </div>
                <h1 className="font-headline-sm text-headline-sm text-primary font-bold mt-0.5">
                  تعديل: {property.title_ar}
                </h1>
              </div>
            </div>

            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-primary text-label-md font-label-md transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
              <span>العودة</span>
            </Link>
          </div>

          {/* Edit Form */}
          <PropertyForm
            initialData={property}
            initialImages={images}
            governorates={governorates}
            districts={districts}
            isEditing={true}
          />
        </div>
      </main>

      <BottomNav />
    </>
  );
}
