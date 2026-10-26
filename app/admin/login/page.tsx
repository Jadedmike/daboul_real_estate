"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    urlError === "unauthorized"
      ? "الحساب المدخل غير مصرح له بالوصول إلى لوحة الإدارة."
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني وكلمة المرور.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError || !data.user) {
        // Generic error message to prevent user enumeration
        setErrorMessage("بيانات الدخول غير صحيحة. يرجى التحقق والمحاولة مجدداً.");
        setIsLoading(false);
        return;
      }

      // 2. Verify admin identity in admin_users table
      const { data: adminRecord, error: adminCheckError } = await supabase
        .from("admin_users")
        .select("id, is_active")
        .eq("user_id", data.user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (adminCheckError || !adminRecord) {
        // If not the authorized active admin, sign out immediately
        await supabase.auth.signOut();
        setErrorMessage("الحساب المدخل غير مصرح له بالوصول إلى لوحة الإدارة.");
        setIsLoading(false);
        return;
      }

      // 3. Authorized admin: redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("حدث خطأ غير متوقع أثناء تسجيل الدخول. يرجى المحاولة لاحقاً.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto bg-[#F8F6F0]/70 backdrop-blur-2xl rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(52,33,27,0.12)] border border-[#A0BDDB]/40 transition-all">
      {/* Brand & Badge */}
      <div className="flex flex-col items-center text-center mb-6">
        <Link href="/" className="inline-flex items-center mb-3 group transition-transform active:scale-95">
          <span className="font-headline-sm text-headline-sm text-[#34211B] font-bold tracking-tight">
            Axion Digital
          </span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A0BDDB]/20 text-[#34211B] text-label-sm font-label-sm font-bold border border-[#A0BDDB]/40 mb-2.5 shadow-xs">
          <span className="material-symbols-outlined text-[16px] text-[#34211B]">
            shield_lock
          </span>
          <span>بوابة الدخول الآمن للمشرف</span>
        </div>
        <h1 className="text-2xl font-bold text-[#34211B] tracking-tight">
          تسجيل دخول المشرف
        </h1>
        <p className="font-body-sm text-body-sm text-[#34211B]/60 mt-1">
          لوحة الإدارة المركزية لمنصة Axion Digital
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-5 p-3.5 rounded-2xl bg-red-50/80 border border-red-200/80 text-red-700 flex items-start gap-2.5 text-xs font-medium animate-in fade-in duration-200"
        >
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
            error
          </span>
          <p className="flex-1 leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field Floating Container */}
        <div className="relative rounded-2xl bg-[#F8F6F0]/90 border border-[#A0BDDB]/40 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 transition-all px-4 pt-2.5 pb-2 shadow-xs group">
          <label
            htmlFor="admin-email"
            className="block text-[11px] font-semibold text-[#34211B]/70 tracking-wide"
          >
            البريد الإلكتروني للمشرف
          </label>
          <div className="relative flex items-center mt-0.5">
            <input
              id="admin-email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@axiondigital.com"
              required
              autoComplete="email"
              disabled={isLoading}
              className="w-full bg-transparent text-sm font-medium text-[#34211B] placeholder:text-[#34211B]/35 focus:outline-none text-left disabled:opacity-60"
            />
            <span className="material-symbols-outlined text-[18px] text-[#34211B]/50 mr-2 shrink-0 group-focus-within:text-[#34211B] transition-colors">
              mail
            </span>
          </div>
        </div>

        {/* Password Field Floating Container */}
        <div className="relative rounded-2xl bg-[#F8F6F0]/90 border border-[#A0BDDB]/40 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 transition-all px-4 pt-2.5 pb-2 shadow-xs group">
          <div className="flex items-center justify-between">
            <label
              htmlFor="admin-password"
              className="block text-[11px] font-semibold text-[#34211B]/70 tracking-wide"
            >
              كلمة المرور
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-[11px] font-semibold text-[#34211B] hover:text-[#34211B]/80 hover:underline transition-colors"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
          <div className="relative flex items-center mt-0.5">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              disabled={isLoading}
              className="w-full bg-transparent text-sm font-medium text-[#34211B] placeholder:text-[#34211B]/35 focus:outline-none text-left disabled:opacity-60"
            />
            <div className="flex items-center gap-1.5 mr-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                className="text-[#34211B]/50 hover:text-[#34211B] transition-colors cursor-pointer flex items-center justify-center p-0.5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
              <span className="material-symbols-outlined text-[18px] text-[#34211B]/50 group-focus-within:text-[#34211B] transition-colors">
                lock
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="adminLoginBtn"
          disabled={isLoading}
          className="w-full h-12 mt-2 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-2xl font-title-sm text-title-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(52,33,27,0.20)] hover:shadow-[0_6px_20px_rgba(52,33,27,0.30)] active:scale-[0.99] border border-[#A0BDDB]/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-[#F8F6F0] border-t-transparent rounded-full animate-spin" />
              <span>جاري التحقق من الهوية...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">login</span>
              <span>تسجيل الدخول</span>
            </>
          )}
        </button>
      </form>

      {/* Return to website */}
      <div className="mt-6 pt-5 border-t border-[#A0BDDB]/30 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#34211B]/80 hover:text-[#34211B] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">
            arrow_forward
          </span>
          <span>العودة إلى الموقع الرئيسي</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-[#F8F6F0] flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden"
    >
      {/* Ambient background soft light glows for frosted glass depth */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#A0BDDB]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#EDE7DC]/80 rounded-full blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-[420px] bg-[#F8F6F0]/70 backdrop-blur-2xl rounded-3xl p-8 flex justify-center items-center shadow-lg border border-[#A0BDDB]/40">
            <div className="w-8 h-8 border-3 border-[#34211B] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>

      <div className="mt-6 text-center text-label-sm text-[#34211B]/60 font-medium relative z-10">
        <span>منصة Axion Digital • جلسة مشفرة عبر Supabase Auth SSL</span>
      </div>
    </div>
  );
}
