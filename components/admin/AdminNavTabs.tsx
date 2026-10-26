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
              className="cms-nav-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#A0BDDB] text-[#34211B] whitespace-nowrap shadow-sm hover:bg-[#8faecf] border border-[#A0BDDB]/50 font-bold transition-all cursor-pointer"
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
            className={`cms-nav-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? "bg-[#34211B] text-[#F8F6F0] shadow-sm border border-[#A0BDDB]/40 font-bold"
                : "bg-[#F8F6F0]/70 backdrop-blur-md border border-[#A0BDDB]/30 text-[#34211B] hover:bg-[#F8F6F0]/95"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                isActive ? "text-[#A0BDDB]" : "text-[#34211B]/70"
              }`}
            >
              {tab.icon}
            </span>
            <span>{tab.name}</span>
            {tab.badge && (
              <span className="px-1.5 py-0.2 bg-[#A0BDDB]/30 text-[#34211B] border border-[#A0BDDB]/50 rounded-full text-label-sm font-label-sm font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
