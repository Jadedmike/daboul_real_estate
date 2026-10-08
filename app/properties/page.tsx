import React, { Suspense } from "react";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toast";
import { PropertiesCatalogContent } from "@/components/catalog/PropertiesCatalogContent";
import {
  getPublicLocations,
  getPublicProperties,
} from "@/lib/actions/properties";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "سجل العقارات المتاحة للبيع والإيجار | دعبول العقارية",
  description:
    "تصفح كافة العقارات المتاحة للبيع والإيجار في دمشق وحلب وريف دمشق والساحل. شقق، فلل، مكاتب، ومقرات تجارية موثقة.",
  openGraph: {
    title: "سجل العقارات المتاحة للبيع والإيجار | دعبول العقارية",
    description:
      "تصفح كافة العقارات المتاحة للبيع والإيجار في دمشق وحلب وريف دمشق والساحل.",
    type: "website",
  },
};

export default async function PropertiesPage() {
  const [locations, initialProperties] = await Promise.all([
    getPublicLocations(),
    getPublicProperties(),
  ]);

  return (
    <ToastProvider>
      <Suspense fallback={<div className="p-space-xl text-center font-body-md text-on-surface">جاري تحميل العقارات المتاحة...</div>}>
        <PropertiesCatalogContent
          initialLocations={locations}
          initialProperties={initialProperties}
        />
      </Suspense>
    </ToastProvider>
  );
}
