"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("يرجى إدخال البريد الإلكتروني الخاص بالمشرف.");
      return;
    }

    setIsLoading(true);

    try {
      // Determine origin dynamically to support both production domain and local dev
      const origin =
        typeof window !== "undefined" && window.location.origin
          ? window.location.origin
          : "https://daboul-real-estate.vercel.app";

      const redirectTo = `${origin}/admin/reset-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo,
      });

      if (error) {
        if (error.message?.includes("rate limit") || error.code === "over_email_send_rate_limit") {
          setErrorMessage(
            "تم إرسال طلب استعادة مؤخراً. يرجى الانتظار دقيقة واحدة قبل المحاولة مجدداً."
          );
        } else {
          setErrorMessage(
            "تعذر إرسال رابط الاستعادة حالياً. يرجى التحقق من صحة البريد الإلكتروني أو المحاولة لاحقاً."
          );
        }
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح. يرجى مراجعة صندوق الوارد (أو مجلد الرسائل غير المرغوب فيها Spam) والنقر على الرابط لتعيين كلمة مرور جديدة."
      );
      setIsLoading(false);
    } catch {
      setErrorMessage("حدث خطأ غير متوقع أثناء معالجة الطلب. يرجى المحاولة لاحقاً.");
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
            lock_reset
          </span>
          <span>استعادة حساب المشرف</span>
        </div>
        <h1 className="text-2xl font-bold text-[#34211B] tracking-tight">
          استعادة كلمة المرور
        </h1>
        <p className="font-body-sm text-body-sm text-[#34211B]/60 mt-1">
          أدخل البريد الإلكتروني المعتمد لتلقي رابط تعيين كلمة المرور
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

      {/* Success Alert */}
      {successMessage && (
        <div
          role="status"
          className="mb-5 p-3.5 rounded-2xl bg-[#A0BDDB]/20 border border-[#A0BDDB]/40 text-[#34211B] flex items-start gap-2.5 text-xs font-medium animate-in fade-in duration-200"
        >
          <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5 text-[#34211B]">
            check_circle
          </span>
          <p className="flex-1 leading-relaxed">{successMessage}</p>
        </div>
      )}

      {/* Forgot Password Form */}
      {!successMessage ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative rounded-2xl bg-[#F8F6F0]/90 border border-[#A0BDDB]/40 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 transition-all px-4 pt-2.5 pb-2 shadow-xs group">
            <label
              htmlFor="admin-recovery-email"
              className="block text-[11px] font-semibold text-[#34211B]/70 tracking-wide"
            >
              البريد الإلكتروني للمشرف
            </label>
            <div className="relative flex items-center mt-0.5">
              <input
                id="admin-recovery-email"
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

          <button
            type="submit"
            id="sendRecoveryBtn"
            disabled={isLoading}
            className="w-full h-12 mt-2 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-2xl font-title-sm text-title-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(52,33,27,0.20)] hover:shadow-[0_6px_20px_rgba(52,33,27,0.30)] active:scale-[0.99] border border-[#A0BDDB]/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-[#F8F6F0] border-t-transparent rounded-full animate-spin" />
                <span>جاري إرسال الرابط...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>إرسال رابط استعادة كلمة المرور</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center pt-2">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-2xl font-title-sm font-bold shadow-md transition-all border border-[#A0BDDB]/25"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>العودة لصفحة تسجيل الدخول</span>
          </Link>
        </div>
      )}

      {/* Navigation links */}
      <div className="mt-6 pt-5 border-t border-[#A0BDDB]/30 flex flex-col items-center gap-2 text-center">
        <Link
          href="/admin/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#34211B]/80 hover:text-[#34211B] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          <span>العودة إلى تسجيل الدخول</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#34211B]/60 hover:text-[#34211B] transition-colors"
        >
          <span>الموقع الرئيسي</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminForgotPasswordPage() {
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
        <ForgotPasswordForm />
      </Suspense>

      <div className="mt-6 text-center text-label-sm text-[#34211B]/60 font-medium relative z-10">
        <span>منصة Axion Digital • استعادة الحساب الآمنة</span>
      </div>
    </div>
  );
}
