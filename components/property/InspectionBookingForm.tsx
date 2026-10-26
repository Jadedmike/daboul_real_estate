"use client";

import React, { useState } from "react";
import { submitPublicInquiry } from "@/lib/actions/inquiries";
import { useToast } from "@/components/ui/Toast";

interface InspectionBookingFormProps {
  propertyId?: string;
  propertyTitle?: string;
}

export function InspectionBookingForm({
  propertyId,
  propertyTitle,
}: InspectionBookingFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // Assemble structured message combining date & customer notes
      const messageParts: string[] = [];
      if (date.trim()) {
        messageParts.push(`الموعد المقترح للمعاينة: ${date.trim()}`);
      }
      if (notes.trim()) {
        messageParts.push(`الملاحظات: ${notes.trim()}`);
      }
      const finalMessage =
        messageParts.length > 0
          ? messageParts.join("\n")
          : "طلب معاينة ميدانية واستفسار حول تفاصيل العقار.";

      const result = await submitPublicInquiry({
        customer_name: name,
        phone: phone,
        whatsapp: phone, // Default WhatsApp to contact phone
        email: email.trim() ? email.trim() : null,
        message: finalMessage,
        property_id: propertyId || null,
      });

      if (!result.success) {
        const errText = result.error || "تعذر إرسال الطلب، يرجى المحاولة لاحقاً.";
        setErrorMessage(errText);
        showToast(errText);
        setIsSubmitting(false);
        return;
      }

      // Success
      setIsSuccess(true);
      showToast(result.message || "تم استلام طلبكم بنجاح!");
      // Reset fields
      setName("");
      setPhone("");
      setEmail("");
      setDate("");
      setNotes("");
    } catch (err) {
      console.error("Submission error:", err);
      const fallbackErr = "حدث خطأ غير متوقع أثناء إرسال الطلب.";
      setErrorMessage(fallbackErr);
      showToast(fallbackErr);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <div className="bg-[#F8F6F0]/80 backdrop-blur-xl border border-[#A0BDDB]/35 rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.06)] flex flex-col gap-space-sm">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[#34211B] text-[22px]">
          calendar_month
        </span>
        <h3 className="font-title-sm text-title-sm text-[#34211B] font-bold">
          حجز موعد معاينة ميدانية للعقار
        </h3>
      </div>
      <p className="font-body-sm text-body-sm text-[#34211B]/70">
        يرجى إدخال بياناتك وسيقوم مستشارنا العقاري المعتمد بتنسيق الزيارة الميدانية وتزويدك بكافة المخططات الهندسية
        {propertyTitle ? ` الخاصة بـ "${propertyTitle}".` : "."}
      </p>

      {isSuccess ? (
        <div
          id="formSuccessMessage"
          className="p-space-md bg-[#A0BDDB]/20 backdrop-blur-md border border-[#A0BDDB]/40 rounded-2xl text-center flex flex-col items-center gap-space-xs mt-2"
        >
          <span className="material-symbols-outlined text-[#34211B] text-[36px]">
            check_circle
          </span>
          <span className="font-title-sm text-title-sm text-[#34211B] font-bold">
            تم استلام طلب المعاينة بنجاح
          </span>
          <span className="font-body-sm text-body-sm text-[#34211B]/80">
            سيتواصل معك مستشار Axion Digital العقاري في أقرب وقت لتأكيد موعد الزيارة.
          </span>
          <button
            type="button"
            onClick={handleResetForm}
            className="mt-2 px-space-md py-1.5 bg-[#F8F6F0]/85 backdrop-blur-md text-[#34211B] border border-[#A0BDDB]/35 rounded-xl font-label-md text-label-md hover:bg-[#F8F6F0] transition-colors cursor-pointer shadow-xs font-semibold"
          >
            إرسال طلب آخر
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} id="inspectionForm" className="space-y-space-sm pt-2">
          {errorMessage && (
            <div className="p-3 bg-red-50/90 backdrop-blur-md border border-red-200 text-red-700 rounded-xl font-body-sm text-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block font-label-sm text-label-sm text-[#34211B]/80 mb-1 font-semibold">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: المهندس عمار الحلبي"
              disabled={isSubmitting}
              className="w-full bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 px-space-sm py-2 rounded-xl text-[#34211B] font-body-sm text-body-sm focus:outline-none transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-[#34211B]/80 mb-1 font-semibold">
              رقم الهاتف المحمول (واتساب) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+963 9xx xxx xxx"
              disabled={isSubmitting}
              className="w-full bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 px-space-sm py-2 rounded-xl text-[#34211B] font-body-sm text-body-sm focus:outline-none text-right transition-all disabled:opacity-50"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-[#34211B]/80 mb-1 font-semibold">
              البريد الإلكتروني (اختياري)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              disabled={isSubmitting}
              className="w-full bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 px-space-sm py-2 rounded-xl text-[#34211B] font-body-sm text-body-sm focus:outline-none text-right transition-all disabled:opacity-50"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-[#34211B]/80 mb-1 font-semibold">
              التاريخ والوقت المناسب للمعاينة
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="مثال: غداً بعد الساعة 4 عصراً"
              disabled={isSubmitting}
              className="w-full bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 px-space-sm py-2 rounded-xl text-[#34211B] font-body-sm text-body-sm focus:outline-none transition-all disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-[#34211B]/80 mb-1 font-semibold">
              ملاحظات أو استفسارات خاصة
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="هل ترغب بالاطلاع على المخطط التنظيمي أو سند الملكية؟"
              disabled={isSubmitting}
              className="w-full bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] backdrop-blur-md border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 px-space-sm py-2 rounded-xl text-[#34211B] font-body-sm text-body-sm focus:outline-none resize-none transition-all disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            id="submitBtn"
            disabled={isSubmitting}
            className="w-full h-11 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] font-title-sm text-title-sm rounded-xl flex items-center justify-center gap-space-xs transition-all border border-[#A0BDDB]/20 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed font-bold"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>جاري الإرسال...</span>
              </span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  send
                </span>
                <span>تأكيد طلب المعاينة الميدانية</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
