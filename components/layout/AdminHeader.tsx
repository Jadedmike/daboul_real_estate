"use client";

import React from "react";
import Link from "next/link";

export function AdminHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-gutter-mobile flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs">
          <button
            aria-label="القائمة"
            className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
          <a
            aria-label="اتصال وتواصل"
            className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-secondary-container transition-colors"
            href="tel:+963900000000"
          >
            <span className="material-symbols-outlined text-[22px]">
              support_agent
            </span>
          </a>
        </div>
        <Link className="flex items-center gap-space-xs" href="/">
          <img
            alt="Daboul Real Estate Logo"
            className="h-9 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb_RHzG3bw0UpDH7USvnF4lD89zw4R5IiAup9DZUbfAS_QX_bciTHi9Ctffq6lYEEwO9-ZC8dc3JaT3xd3q5V4Zg4U7p-8-37aD_oIfFyWSZLrpf6bHiMYOX3en1dN-iVwXZ3x1GavkMrS00Oala4UMnqnZM1gTXsKp3Ce8JBht3f-U569u5baAsAexqwuRK2UCyes9ygWO9vv0JbvdV7w5mEM5ES6a_-AaJSztf37PBAfvNlxwpEs67WCCH3HQ6Y0mA"
          />
          <div className="flex flex-col text-right">
            <span className="font-title-sm text-title-sm text-primary tracking-tight leading-none">
              دعبول العقارية
            </span>
            <span className="font-label-sm text-label-sm text-outline leading-tight">
              Admin Portal
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-space-xs">
          <button
            aria-label="الإشعارات السريعة"
            className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-secondary-container transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">
              notifications
            </span>
          </button>
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
