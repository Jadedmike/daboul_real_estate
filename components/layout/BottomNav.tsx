"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "الرئيسية",
      href: "/",
      icon: "roofing",
      isActive: pathname === "/",
    },
    {
      label: "العقارات",
      href: "/properties",
      icon: "apartment",
      isActive: pathname === "/properties",
    },
    {
      label: "للبيع",
      href: "/properties?deal=sale",
      icon: "sell",
      isActive: false,
    },
    {
      label: "للإيجار",
      href: "/properties?deal=rent",
      icon: "key",
      isActive: false,
    },
    {
      label: "المناطق",
      href: "/#regions",
      icon: "map",
      isActive: false,
    },
    {
      label: "من نحن",
      href: "/about",
      icon: "domain",
      isActive: pathname === "/about",
    },
    {
      label: "تواصل",
      href: "/contact",
      icon: "chat",
      isActive: pathname === "/contact",
    },
    {
      label: "الأدمن",
      href: "/admin",
      icon: "admin_panel_settings",
      isActive: pathname.startsWith("/admin"),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      data-active-classes="text-secondary-container font-semibold"
    >
      <div className="flex justify-between items-center h-16 px-space-xs overflow-x-auto no-scrollbar">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-[56px] h-14 transition-colors ${
              item.isActive
                ? "text-secondary-container font-semibold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">
              {item.icon}
            </span>
            <span className="font-label-sm text-label-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
