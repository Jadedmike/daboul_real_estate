"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminPropertyTable } from "@/components/admin/AdminPropertyTable";
import { ClientInquiryList } from "@/components/admin/ClientInquiryList";
import { RegionalCoverageCard } from "@/components/admin/RegionalCoverageCard";
import { HomepageCmsEditor } from "@/components/admin/HomepageCmsEditor";
import { CompanySettingsEditor } from "@/components/admin/CompanySettingsEditor";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { PropertyWithLocation } from "@/lib/actions/properties";
import { HomepageConfig } from "@/lib/actions/cms";
import { AdminInquiryWithProperty } from "@/lib/actions/inquiries";
import { CompanySettings, DEFAULT_COMPANY_SETTINGS } from "@/lib/types/settings";

interface AdminDashboardClientProps {
  initialProperties: PropertyWithLocation[];
  initialCmsConfig: HomepageConfig;
  initialInquiries?: AdminInquiryWithProperty[];
  initialCompanySettings?: CompanySettings;
}

function AdminDashboardContent({
  initialProperties,
  initialCmsConfig,
  initialInquiries = [],
  initialCompanySettings,
}: AdminDashboardClientProps) {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("نظرة عامة");

  const totalCount = initialProperties.length;
  const saleCount = initialProperties.filter((p) => p.transaction_type === "sale").length;
  const rentCount = initialProperties.filter((p) => p.transaction_type === "rent").length;
  const availableCount = initialProperties.filter((p) => p.status === "available").length;

  const salePercentage = totalCount > 0 ? Math.round((saleCount / totalCount) * 100) : 0;
  const rentPercentage = totalCount > 0 ? Math.round((rentCount / totalCount) * 100) : 0;

  const totalInquiries = initialInquiries.length;
  const newInquiriesCount = initialInquiries.filter((i) => i.status === "new").length;

  return (
    <>
      <AdminHeader />

      <main className="flex flex-col relative w-full pt-16 bg-transparent">
        <div className="flex flex-col w-full max-w-7xl mx-auto px-4 py-space-sm space-y-space-md" dir="rtl">
          {/* Admin Sub-Header & Live Status */}
          <div className="w-full bg-[#F8F6F0]/80 backdrop-blur-xl rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] flex flex-col gap-space-sm border border-[#A0BDDB]/35">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-title-sm text-title-sm text-[#34211B] font-bold">
                      بوابة الإدارة المركزية
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-label-sm bg-[#A0BDDB]/25 backdrop-blur-md text-[#34211B] border border-[#A0BDDB]/45 font-bold">
                      Axion Digital CMS
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-[#34211B]/70">
                    جلسة مشفرة ومباشرة • دمشق، سوريا
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  type="button"
                  id="alertBellBtn"
                  onClick={() => showToast("لديك 3 تنبيهات جديدة حول طلبات المعاينة")}
                  aria-label="الإشعارات"
                  className="relative w-9 h-9 rounded-xl bg-[#F8F6F0]/70 hover:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 flex items-center justify-center text-[#34211B] transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    notifications
                  </span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A0BDDB] animate-ping" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A0BDDB]" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("محرر الواجهة (CMS)")}
                  aria-label="خيارات الإدارة"
                  className="w-9 h-9 rounded-xl bg-[#F8F6F0]/70 hover:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 flex items-center justify-center text-[#34211B] transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    tune
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Navigation Horizontal Scroll Tabs */}
            <AdminNavTabs
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                showToast(`عرض قسم: ${tab}`);
              }}
            />
          </div>

          {/* Conditional Rendering Based on Active Tab */}
          {activeTab === "محرر الواجهة (CMS)" && (
            <HomepageCmsEditor
              initialSections={initialCmsConfig.sections}
              initialSettings={initialCmsConfig.settings}
            />
          )}

          {activeTab === "إدارة العقارات" && (
            <div className="space-y-space-md">
              <div className="flex items-center justify-between">
                <h2 className="font-title-md text-title-md text-[#34211B] font-bold">
                  سجل العقارات المتاح في قاعدة البيانات
                </h2>
                <Link
                  href="/admin/properties/new"
                  className="px-space-md h-10 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] border border-[#A0BDDB]/20 rounded-xl font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add_circle
                  </span>
                  <span>إضافة عقار جديد</span>
                </Link>
              </div>
              <AdminPropertyTable initialProperties={initialProperties} />
            </div>
          )}

          {activeTab === "طلبات العملاء" && (
            <div className="space-y-space-md">
              <ClientInquiryList initialInquiries={initialInquiries} />
            </div>
          )}

          {activeTab === "المحافظات والمناطق" && (
            <div className="space-y-space-md">
              <RegionalCoverageCard />
            </div>
          )}

          {activeTab === "الإعدادات" && (
            <div className="space-y-space-md">
              <CompanySettingsEditor
                initialSettings={initialCompanySettings || DEFAULT_COMPANY_SETTINGS}
              />
            </div>
          )}

          {activeTab === "نظرة عامة" && (
            <>
              {/* Key Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm">
                <AdminStatCard
                  label="إجمالي العقارات"
                  value={totalCount.toString()}
                  badgeText={`${availableCount} متاح`}
                  progressPercent={totalCount > 0 ? 100 : 0}
                  progressColor="primary"
                  icon="domain"
                />
                <AdminStatCard
                  label="عقارات للبيع"
                  value={saleCount.toString()}
                  badgeText={`${salePercentage}% من الإجمالي`}
                  progressPercent={salePercentage}
                  progressColor="secondary"
                  icon="sell"
                />
                <AdminStatCard
                  label="عقارات للإيجار"
                  value={rentCount.toString()}
                  badgeText={`${rentPercentage}% من الإجمالي`}
                  progressPercent={rentPercentage}
                  progressColor="neutral"
                  icon="key"
                />
                <AdminStatCard
                  label="طلبات واستفسارات العملاء"
                  value={totalInquiries.toString()}
                  badgeText={`${newInquiriesCount} جديد`}
                  progressPercent={
                    totalInquiries > 0
                      ? Math.min(100, Math.round((newInquiriesCount / totalInquiries) * 100))
                      : 0
                  }
                  progressColor="secondary"
                  icon="support_agent"
                />
              </div>

              {/* Quick Action Bar */}
              <div className="flex items-center gap-space-xs">
                <Link
                  href="/admin/properties/new"
                  className="flex-1 h-11 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-xl font-title-sm text-title-sm flex items-center justify-center gap-1.5 shadow-md border border-[#A0BDDB]/20 font-bold transition-all active:scale-[0.99]"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add_circle
                  </span>
                  <span>إضافة عقار جديد</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setActiveTab("محرر الواجهة (CMS)")}
                  className="px-space-md h-11 bg-[#F8F6F0]/80 hover:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 text-[#34211B] rounded-xl font-title-sm text-title-sm flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    view_quilt
                  </span>
                  <span>تعديل واجهة CMS</span>
                </button>
              </div>

              {/* Real Supabase Properties Management Table */}
              <AdminPropertyTable initialProperties={initialProperties} />

              {/* Client Inquiries Queue */}
              <ClientInquiryList initialInquiries={initialInquiries} />

              {/* Regional Coverage CMS Card */}
              <RegionalCoverageCard />
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default function AdminDashboardClient({
  initialProperties,
  initialCmsConfig,
  initialInquiries = [],
  initialCompanySettings,
}: AdminDashboardClientProps) {
  return (
    <ToastProvider>
      <AdminDashboardContent
        initialProperties={initialProperties}
        initialCmsConfig={initialCmsConfig}
        initialInquiries={initialInquiries}
        initialCompanySettings={initialCompanySettings}
      />
    </ToastProvider>
  );
}
