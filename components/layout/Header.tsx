"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  variant?: "standard" | "back";
  title?: string;
}

export function Header({ variant = "standard", title = "Property Details" }: HeaderProps) {
  const router = useRouter();

  if (variant === "back") {
    return (
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-gutter-mobile flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <button
              aria-label="رجوع"
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer"
              onClick={() => router.back()}
            >
              <span className="material-symbols-outlined text-[24px] scale-x-[-1]">
                arrow_back
              </span>
            </button>
            <h1 className="font-title-md text-title-md text-primary tracking-tight">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="font-label-md text-label-md text-outline hidden sm:inline">
              دعبول العقارية
            </span>
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VjHL3Xf69kKeZ2xN9LEEp_CJhkGWahcs3SdbNz42Ho-ZCUl-VOAx1aanObqYHxHP1_oTyp_HspbW7HxAHwqJdeGxsZC-V6YN40OqTxm2COSTX7mGTh2OJHy4NjVTDleOUQ15RMMkM1RWE7DPUo4pH8LQNXBKrIE3Pyk2AN1JKybTOfOCHqqTokQfbfnbllNHxUyuNa8AeYaGz12yu3TjDQPZUYmdo95LVgkxIw2T6HTgMfUyaHzeGDRqied-_JBDYl_cGvXdxR"
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-gutter-mobile flex items-center justify-between gap-space-sm">
        <div className="flex items-center">
          <button
            aria-label="القائمة"
            className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
        <Link className="flex items-center justify-center gap-space-xs" href="/">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBogQeqPeWECJg-Z1KK7VpIvNDymecnrkeCPlnknKAQgYlqFBHgnZjEKO3KCnvav3WiokbypcNrtgX_zw2rcw9cLTMdEhfMvdpaPphbIudilzKOkgOwX86Dp-VhmjE4lHZI02-4uDeqTmRZ4SUe2aUJw4qiOGH19d8jkpAUfnc2xjHMJOfKuUfyzKBePeFQfHw6YBhJPewVy_xqhmqxmh0Gg1umtuA5uDs52zUDrAcShVkeALob9RMtUKrqzyeJ__pHg"
            alt="Daboul Real Estate"
            className="h-9 w-auto object-contain"
          />
          <div className="flex flex-col text-right leading-none">
            <span className="font-title-sm text-title-sm text-primary font-bold tracking-tight">
              دعبول العقارية
            </span>
            <span className="font-label-sm text-[10px] text-outline font-semibold tracking-wider uppercase">
              Daboul Real Estate
            </span>
          </div>
        </Link>
        <div className="flex items-center justify-end">
          <Link
            aria-label="اتصال وتواصل"
            className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-secondary-container transition-colors"
            href="/contact"
          >
            <span className="material-symbols-outlined text-[22px]">
              support_agent
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
