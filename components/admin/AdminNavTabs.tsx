"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

interface AdminNavTabsProps {
  activeTab?: string;
  onTabChange?: (tabName: string) => void;
}

export function AdminNavTabs({
  activeTab: controlledTab,
  onTabChange,
}: AdminNavTabsProps = {}) {
  const [internalTab, setInternalTab] = useState("نظرة عامة");
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const { showToast } = useToast();

  const tabs = [
    { name: "نظرة عامة", icon: "dashboard", isAction: false },
    { name: "إدارة العقارات", icon: "apartment", isAction: false },
    { name: "محرر الواجهة (CMS)", icon: "view_quilt", isAction: false },
    { name: "إضافة عقار جديد", icon: "add_box", isAction: true },
    { name: "طلبات العملاء", icon: "support_agent", badge: "18", isAction: false },
    { name: "المحافظات والمناطق", icon: "explore", isAction: false },
    { name: "الإعدادات", icon: "settings", isAction: false },
  ];

  const handleTabClick = (tabName: string, isAction: boolean) => {
    if (!isAction) {
      if (onTabChange) {
        onTabChange(tabName);
      } else {
        setInternalTab(tabName);
      }
    }
  };

  return (
    <div className="flex items-center gap-space-xs overflow-x-auto no-scrollbar pb-1 pt-1 text-label-md font-label-md">
      {tabs.map((tab) => {
        if (tab.isAction) {
          return (
            <Link
              key={tab.name}
              href="/admin/properties/new"
              className="cms-nav-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-container text-on-primary whitespace-nowrap shadow-sm hover:bg-secondary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">
                {tab.icon}
              </span>
              <span>{tab.name}</span>
            </Link>
          );
        }

        const isActive = activeTab === tab.name;

        return (
          <button
            key={tab.name}
            type="button"
            onClick={() => handleTabClick(tab.name, false)}
            className={`cms-nav-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              isActive
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:text-primary"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                isActive ? "text-secondary-container" : ""
              }`}
            >
              {tab.icon}
            </span>
            <span>{tab.name}</span>
            {tab.badge && (
              <span className="px-1.5 py-0.2 bg-secondary-fixed text-on-secondary-fixed rounded-full text-label-sm font-label-sm">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
