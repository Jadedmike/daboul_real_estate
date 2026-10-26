"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
  variant?: "standard" | "back";
  title?: string;
}

export function Header({ variant = "standard", title = "Property Details" }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "الرئيسية", href: "/", icon: "roofing" },
    { label: "العقارات", href: "/properties", icon: "apartment" },
    { label: "من نحن", href: "/about", icon: "domain" },
    { label: "تواصل معنا", href: "/contact", icon: "chat" },
  ];

  const fullNavLinks = [
    { label: "الرئيسية", href: "/", icon: "roofing" },
    { label: "العقارات", href: "/properties", icon: "apartment" },
    { label: "عقارات للبيع", href: "/properties?deal=sale", icon: "sell" },
    { label: "عقارات للإيجار", href: "/properties?deal=rent", icon: "key" },
    { label: "استكشف المناطق", href: "/#regions", icon: "map" },
    { label: "من نحن", href: "/about", icon: "domain" },
    { label: "تواصل معنا", href: "/contact", icon: "chat" },
    { label: "بوابة الإدارة", href: "/admin", icon: "admin_panel_settings" },
  ];

  if (variant === "back") {
    return (
      <header className="fixed top-0 w-full z-50 bg-[#F8F6F0]/85 backdrop-blur-xl border-b border-[#A0BDDB]/35 shadow-[0_4px_24px_rgba(52,33,27,0.06)] pt-safe">
        <div className="h-16 px-gutter-mobile flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-space-xs">
            <button
              aria-label="رجوع"
              className="w-11 h-11 rounded-xl flex items-center justify-center text-on-surface hover:text-primary hover:bg-[#A0BDDB]/15 transition-colors cursor-pointer"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/");
                }
              }}
            >
              <span className="material-symbols-outlined text-[24px] scale-x-[-1]">
                arrow_back
              </span>
            </button>
            <h1 className="font-title-md text-title-md text-primary tracking-tight font-bold">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-label-md text-label-md text-outline hidden sm:inline">
              Axion Digital
            </span>
            <Link href="/" className="flex items-center">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#A0BDDB]/50 shadow-sm"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VjHL3Xf69kKeZ2xN9LEEp_CJhkGWahcs3SdbNz42Ho-ZCUl-VOAx1aanObqYHxHP1_oTyp_HspbW7HxAHwqJdeGxsZC-V6YN40OqTxm2COSTX7mGTh2OJHy4NjVTDleOUQ15RMMkM1RWE7DPUo4pH8LQNXBKrIE3Pyk2AN1JKybTOfOCHqqTokQfbfnbllNHxUyuNa8AeYaGz12yu3TjDQPZUYmdo95LVgkxIw2T6HTgMfUyaHzeGDRqied-_JBDYl_cGvXdxR"
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#F8F6F0]/85 backdrop-blur-xl border-b border-[#A0BDDB]/35 shadow-[0_4px_24px_rgba(52,33,27,0.06)] pt-safe">
        <div className="h-16 px-gutter-mobile flex items-center justify-between gap-space-sm max-w-7xl mx-auto">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              aria-label="القائمة"
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-on-surface hover:text-primary hover:bg-[#A0BDDB]/15 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          </div>

          {/* Brand Identity */}
          <Link className="flex items-center justify-center" href="/">
            <span className="font-title-md text-title-md text-primary font-bold tracking-tight leading-none">
              Axion Digital
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-space-md">
            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-space-sm py-1.5 rounded-xl font-title-sm text-title-sm transition-all ${
                    isActive
                      ? "text-primary font-bold bg-[#A0BDDB]/25 backdrop-blur-md border border-[#A0BDDB]/50 shadow-xs"
                      : "text-on-surface-variant hover:text-primary hover:bg-[#A0BDDB]/15 hover:backdrop-blur-md"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Contact & Support Action */}
          <div className="flex items-center justify-end gap-space-xs">
            <Link
              aria-label="اتصال وتواصل"
              className="w-11 h-11 rounded-xl flex items-center justify-center text-on-surface hover:text-secondary-container hover:bg-[#A0BDDB]/15 transition-all"
              href="/contact"
            >
              <span className="material-symbols-outlined text-[22px]">
                support_agent
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer & Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <aside className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#F8F6F0]/95 backdrop-blur-2xl border-l border-[#A0BDDB]/40 shadow-[-10px_0_40px_rgba(52,33,27,0.14)] z-50 flex flex-col justify-between p-space-md overflow-y-auto">
            <div className="flex flex-col gap-space-md">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-[#A0BDDB]/35 pb-space-sm">
                <div className="flex flex-col text-right">
                  <span className="font-title-sm text-title-sm font-bold text-primary">
                    Axion Digital
                  </span>
                  <span className="font-label-sm text-[10px] text-outline">
                    القائمة الرئيسية
                  </span>
                </div>
                <button
                  aria-label="إغلاق القائمة"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface hover:bg-[#A0BDDB]/20 transition-colors cursor-pointer border border-[#A0BDDB]/30"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    close
                  </span>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-1">
                {fullNavLinks.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-space-sm px-space-sm py-3 rounded-xl font-title-sm text-title-sm transition-all ${
                        isActive
                          ? "bg-[#A0BDDB]/25 backdrop-blur-md text-primary font-bold border border-[#A0BDDB]/50 shadow-xs"
                          : "text-on-surface hover:bg-[#A0BDDB]/15 hover:text-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px] text-secondary-container">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Quick Contact Footer in Drawer */}
            <div className="pt-space-md border-t border-[#A0BDDB]/35 flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm text-[#34211B]/60 font-medium">
                تواصل مباشر على مدار الساعة
              </span>
              <div className="grid grid-cols-2 gap-space-xs pt-1">
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 bg-[#34211B] text-[#F8F6F0] rounded-xl flex items-center justify-center gap-1 font-label-md text-label-md hover:bg-[#4A332B] shadow-sm transition-colors border border-[#A0BDDB]/20"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    mail
                  </span>
                  <span>اتصل بنا</span>
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 bg-[#F8F6F0]/80 backdrop-blur-md border border-[#A0BDDB]/35 text-[#34211B] rounded-xl flex items-center justify-center gap-1 font-label-md text-label-md hover:bg-[#EDE7DC] transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    admin_panel_settings
                  </span>
                  <span>الإدارة</span>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

