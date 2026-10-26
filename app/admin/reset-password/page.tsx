"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const urlCode = searchParams.get("code");
  const urlError = searchParams.get("error");
  const urlErrorDesc = searchParams.get("error_description");

  const [hasValidSession, setHasValidSession] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // 1. Check if Supabase returned an error in the query parameters
    if (urlError || urlErrorDesc) {
      if (isMounted) {
        setSessionError(
          urlErrorDesc?.includes("expired") || urlError?.includes("otp_expired")
            ? "انتهت صلاحية رابط استعادة كلمة المرور. يرجى طلب رابط جديد."
            : `تعذر التحقق من رابط الاستعادة: ${urlErrorDesc || urlError}`
        );
        setIsVerifying(false);
      }
      return;
    }

    // 2. Also inspect URL hash for errors (implicit flow)
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const hashError = params.get("error_description") || params.get("error");
      if (hashError) {
        if (isMounted) {
          setSessionError(
            hashError.includes("expired")
              ? "انتهت صلاحية رابط استعادة كلمة المرور. يرجى طلب رابط جديد."
              : `تعذر التحقق من رابط الاستعادة: ${hashError}`
          );
          setIsVerifying(false);
        }
        return;
      }
    }

    // 3. Set up auth state change listener for PASSWORD_RECOVERY event
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        if (isMounted) {
          setHasValidSession(true);
          setSessionError(null);
          setIsVerifying(false);
        }
      }
    });

    // 4. If PKCE code is provided in URL, exchange it for a session
    const checkAuth = async () => {
      if (urlCode) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(urlCode);
        if (error) {
          if (isMounted) {
            setSessionError(
              "رمز استعادة كلمة المرور غير صالح أو منتهي الصلاحية. يرجى طلب رابط جديد."
            );
            setIsVerifying(false);
          }
          return;
        }
        if (data.session && isMounted) {
          setHasValidSession(true);
          setSessionError(null);
          setIsVerifying(false);
          return;
        }
      }

      // 5. Check if an active session already exists in client
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session && isMounted) {
        setHasValidSession(true);
        setSessionError(null);
        setIsVerifying(false);
        return;
      }

      // If no code, no session, and timer expires, display invalid session state
      const timer = setTimeout(() => {
        if (isMounted && !hasValidSession) {
          setIsVerifying(false);
          setSessionError(
            "لم يتم العثور على جلسة استعادة صالحة. يرجى استخدام الرابط المرسل إلى بريدك الإلكتروني أو طلب رابط جديد."
          );
        }
      }, 1200);

      return () => clearTimeout(timer);
    };

    checkAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [urlCode, urlError, urlErrorDesc]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!password || !confirmPassword) {
      setFormError("يرجى ملء جميع حقول كلمة المرور.");
      return;
    }

    if (password.length < 8) {
      setFormError("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("كلمتا المرور غير متطابقتين. يرجى التأكد وإعادة المحاولة.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setFormError(
          error.message?.includes("should be different")
            ? "كلمة المرور الجديدة يجب أن تكون مختلفة عن كلمة المرور السابقة."
            : `حدث خطأ أثناء تحديث كلمة المرور: ${error.message}`
        );
        setIsSubmitting(false);
        return;
      }

      // Password updated successfully!
      // Sign out recovery session to ensure fresh login
      await supabase.auth.signOut();
      setIsSuccess(true);
      setIsSubmitting(false);
    } catch {
      setFormError("حدث خطأ غير متوقع أثناء حفظ كلمة المرور. يرجى المحاولة لاحقاً.");
      setIsSubmitting(false);
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
            password
          </span>
          <span>تعيين كلمة المرور الجديدة</span>
        </div>
        <h1 className="text-2xl font-bold text-[#34211B] tracking-tight">
          كلمة مرور المشرف
        </h1>
        <p className="font-body-sm text-body-sm text-[#34211B]/60 mt-1">
          قم بتعيين كلمة مرور قوية لحماية لوحة إدارة المنصة
        </p>
      </div>

      {/* Loading Verifying State */}
      {isVerifying && (
        <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-9 h-9 border-3 border-[#34211B] border-t-transparent rounded-full animate-spin" />
          <p className="font-body-md text-[#34211B]/70 font-medium">
            جاري التحقق من صلاحية رابط الاستعادة...
          </p>
        </div>
      )}

      {/* Invalid Session Error State */}
      {!isVerifying && sessionError && !hasValidSession && (
        <div className="space-y-4">
          <div
            role="alert"
            className="p-3.5 rounded-2xl bg-red-50/80 border border-red-200/80 text-red-700 flex items-start gap-2.5 text-xs font-medium animate-in fade-in duration-200"
          >
            <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5">
              error
            </span>
            <div className="flex-1">
              <p className="font-bold mb-1">تعذر المتابعة</p>
              <p className="leading-relaxed">{sessionError}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/admin/forgot-password"
              className="w-full h-12 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-2xl font-title-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all border border-[#A0BDDB]/25"
            >
              <span className="material-symbols-outlined text-[20px]">
                refresh
              </span>
              <span>طلب رابط استعادة جديد</span>
            </Link>

            <Link
              href="/admin/login"
              className="w-full h-11 bg-[#F8F6F0]/80 text-[#34211B] rounded-2xl font-label-lg flex items-center justify-center gap-1.5 border border-[#A0BDDB]/35 hover:bg-[#EDE7DC] transition-colors font-medium text-xs"
            >
              <span>العودة لصفحة تسجيل الدخول</span>
            </Link>
          </div>
        </div>
      )}

      {/* Success State */}
      {!isVerifying && isSuccess && (
        <div className="space-y-5 text-center py-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#A0BDDB]/20 text-[#34211B] flex items-center justify-center border-2 border-[#A0BDDB]/40">
            <span className="material-symbols-outlined text-[36px]">
              check_circle
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="font-title-lg text-title-lg font-bold text-[#34211B]">
              تم تعيين كلمة المرور بنجاح!
            </h2>
            <p className="font-body-sm text-[#34211B]/60">
              تم تحديث كلمة المرور الخاصة بحساب المشرف. يمكنك الآن المتابعة وتسجيل الدخول.
            </p>
          </div>

          <Link
            href="/admin/login"
            className="w-full h-12 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-2xl font-title-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all border border-[#A0BDDB]/25"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            <span>الانتقال لتسجيل الدخول</span>
          </Link>
        </div>
      )}

      {/* Valid Recovery Form */}
      {!isVerifying && hasValidSession && !isSuccess && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div
              role="alert"
              className="mb-3 p-3.5 rounded-2xl bg-red-50/80 border border-red-200/80 text-red-700 flex items-start gap-2.5 text-xs font-medium animate-in fade-in duration-200"
            >
              <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">
                error
              </span>
              <p className="flex-1 font-medium">{formError}</p>
            </div>
          )}

          {/* New Password Field Floating Container */}
          <div className="relative rounded-2xl bg-[#F8F6F0]/90 border border-[#A0BDDB]/40 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 transition-all px-4 pt-2.5 pb-2 shadow-xs group">
            <label
              htmlFor="new-admin-password"
              className="block text-[11px] font-semibold text-[#34211B]/70 tracking-wide"
            >
              كلمة المرور الجديدة
            </label>
            <div className="relative flex items-center mt-0.5">
              <input
                id="new-admin-password"
                type={showPassword ? "text" : "password"}
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 أحرف على الأقل"
                required
                disabled={isSubmitting}
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

          {/* Confirm Password Field Floating Container */}
          <div className="relative rounded-2xl bg-[#F8F6F0]/90 border border-[#A0BDDB]/40 focus-within:border-[#A0BDDB] focus-within:ring-2 focus-within:ring-[#A0BDDB]/30 transition-all px-4 pt-2.5 pb-2 shadow-xs group">
            <label
              htmlFor="confirm-admin-password"
              className="block text-[11px] font-semibold text-[#34211B]/70 tracking-wide"
            >
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative flex items-center mt-0.5">
              <input
                id="confirm-admin-password"
                type={showConfirmPassword ? "text" : "password"}
                dir="ltr"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="أعد إدخال كلمة المرور"
                required
                disabled={isSubmitting}
                className="w-full bg-transparent text-sm font-medium text-[#34211B] placeholder:text-[#34211B]/35 focus:outline-none text-left disabled:opacity-60"
              />
              <div className="flex items-center gap-1.5 mr-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }
                  className="text-[#34211B]/50 hover:text-[#34211B] transition-colors cursor-pointer flex items-center justify-center p-0.5"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
                <span className="material-symbols-outlined text-[18px] text-[#34211B]/50 group-focus-within:text-[#34211B] transition-colors">
                  lock_clock
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            id="updatePasswordBtn"
            disabled={isSubmitting}
            className="w-full h-12 mt-2 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-2xl font-title-sm text-title-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(52,33,27,0.20)] hover:shadow-[0_6px_20px_rgba(52,33,27,0.30)] active:scale-[0.99] border border-[#A0BDDB]/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-[#F8F6F0] border-t-transparent rounded-full animate-spin" />
                <span>جاري حفظ كلمة المرور...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  save
                </span>
                <span>حفظ كلمة المرور الجديدة</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Return link */}
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

export default function AdminResetPasswordPage() {
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
        <ResetPasswordForm />
      </Suspense>

      <div className="mt-6 text-center text-label-sm text-[#34211B]/60 font-medium relative z-10">
        <span>منصة Axion Digital • جلسة استعادة مشفرة وآمنة</span>
      </div>
    </div>
  );
}
