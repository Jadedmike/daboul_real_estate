"use client";

import React from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { AdminNavTabs } from "@/components/admin/AdminNavTabs";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminPropertyTable } from "@/components/admin/AdminPropertyTable";
import { ClientInquiryList } from "@/components/admin/ClientInquiryList";
import { RegionalCoverageCard } from "@/components/admin/RegionalCoverageCard";
import { ToastProvider, useToast } from "@/components/ui/Toast";

function AdminDashboardContent() {
  const { showToast } = useToast();

  return (
    <>
      <AdminHeader />

      <main className="flex flex-col relative w-full pt-16 pb-20 bg-surface">
        <div className="flex flex-col w-full px-gutter-mobile py-space-sm space-y-space-md" dir="rtl">
          {/* Admin Sub-Header & Live Status */}
          <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-md">
                  <span className="font-headline-sm text-headline-sm text-secondary-container">
                    D
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-title-sm text-title-sm text-on-surface">
                      بوابة الإدارة المركزية
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-label-sm font-label-sm bg-secondary-fixed text-on-secondary-fixed">
                      DABOUL CMS
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline">
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
                  className="relative w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-secondary-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    notifications
                  </span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container animate-ping" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-secondary-container" />
                </button>
                <button
                  type="button"
                  onClick={() => showToast("فتح إعدادات الفرز المتقدم للمشرف")}
                  aria-label="خيارات الإدارة"
                  className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    tune
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Navigation Horizontal Scroll Tabs */}
            <AdminNavTabs />
          </div>

          {/* Key Statistics Grid */}
          <div className="grid grid-cols-2 gap-space-sm">
            <AdminStatCard
              label="إجمالي العقارات"
              value="142"
              badgeText="+8%"
              progressPercent={85}
              progressColor="primary"
              icon="domain"
            />
            <AdminStatCard
              label="عقارات للبيع"
              value="98"
              badgeText="69% من الإجمالي"
              progressPercent={69}
              progressColor="secondary"
              icon="sell"
            />
            <AdminStatCard
              label="عقارات للإيجار"
              value="44"
              badgeText="31% من الإجمالي"
              progressPercent={31}
              progressColor="neutral"
              icon="key"
            />
            <AdminStatCard
              label="طلبات المعاينة"
              value="27"
              badgeText="نشط اليوم"
              progressPercent={54}
              progressColor="secondary"
              icon="support_agent"
            />
          </div>

          {/* Quick Action Bar */}
          <div className="flex items-center gap-space-xs">
            <button
              type="button"
              onClick={() => showToast("فتح استمارة إضافة عقار جديد")}
              className="flex-1 h-11 bg-primary text-on-primary rounded-lg font-title-sm text-title-sm flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                add_circle
              </span>
              <span>إضافة عقار جديد</span>
            </button>
            <button
              type="button"
              onClick={() => showToast("جاري إعداد تقرير العقارات بصيغة PDF...")}
              className="px-space-md h-11 bg-surface-container-lowest border border-outline-variant/40 text-on-surface rounded-lg font-title-sm text-title-sm flex items-center justify-center gap-1.5 hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                download
              </span>
              <span>تصدير التقرير</span>
            </button>
          </div>

          {/* Properties Management Table */}
          <AdminPropertyTable />

          {/* Client Inquiries Queue */}
          <ClientInquiryList />

          {/* Regional Coverage CMS Card */}
          <RegionalCoverageCard />
        </div>
      </main>

      <BottomNav />
    </>
  );
}

export default function AdminPage() {
  return (
    <ToastProvider>
      <AdminDashboardContent />
    </ToastProvider>
  );
}
