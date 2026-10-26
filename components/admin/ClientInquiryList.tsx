"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
  AdminInquiryWithProperty,
  updateInquiryStatus,
  deleteAdminInquiry,
} from "@/lib/actions/inquiries";
import { InquiryStatus } from "@/lib/supabase/types";
import { useToast } from "@/components/ui/Toast";

interface ClientInquiryListProps {
  initialInquiries?: AdminInquiryWithProperty[];
}

const STATUS_CONFIG: Record<
  InquiryStatus,
  { label: string; badgeClass: string; icon: string }
> = {
  new: {
    label: "جديد",
    badgeClass: "bg-[#A0BDDB] text-[#34211B] border border-[#A0BDDB]/40 font-bold",
    icon: "mark_chat_unread",
  },
  contacted: {
    label: "تم التواصل",
    badgeClass: "bg-[#34211B] text-[#F8F6F0] font-bold",
    icon: "call",
  },
  interested: {
    label: "مهتم وجاد",
    badgeClass: "bg-[#A0BDDB]/30 text-[#34211B] border border-[#A0BDDB]/50 font-bold",
    icon: "thumb_up",
  },
  viewing: {
    label: "معاينة ميدانية",
    badgeClass: "bg-[#EDE7DC] text-[#34211B] border border-[#A0BDDB]/40 font-bold",
    icon: "calendar_month",
  },
  deal_completed: {
    label: "تمت الصفقة",
    badgeClass: "bg-[#34211B] text-[#F8F6F0] font-bold",
    icon: "handshake",
  },
  closed: {
    label: "مغلق",
    badgeClass: "bg-[#EDE7DC]/70 text-[#34211B]/60 border border-[#A0BDDB]/30",
    icon: "archive",
  },
};

const ALL_STATUSES: InquiryStatus[] = [
  "new",
  "contacted",
  "interested",
  "viewing",
  "deal_completed",
  "closed",
];

function getInitials(name: string): string {
  if (!name) return "ع";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0].charAt(0)}.${parts[1].charAt(0)}`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-SY", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function ClientInquiryList({
  initialInquiries = [],
}: ClientInquiryListProps) {
  const [inquiries, setInquiries] =
    useState<AdminInquiryWithProperty[]>(initialInquiries);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInquiry, setSelectedInquiry] =
    useState<AdminInquiryWithProperty | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const { showToast } = useToast();

  // Status counts
  const newCount = inquiries.filter((inq) => inq.status === "new").length;

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    // Status filter
    if (statusFilter !== "all" && inq.status !== statusFilter) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = inq.customer_name?.toLowerCase().includes(q);
      const matchPhone = inq.phone?.toLowerCase().includes(q);
      const matchEmail = inq.email?.toLowerCase().includes(q);
      const matchProperty = inq.properties?.title_ar?.toLowerCase().includes(q);
      const matchMessage = inq.message?.toLowerCase().includes(q);
      return (
        matchName || matchPhone || matchEmail || matchProperty || matchMessage
      );
    }
    return true;
  });

  const handleStatusChange = async (
    inquiryId: string,
    newStatus: InquiryStatus
  ) => {
    setUpdatingId(inquiryId);
    // Optimistic update
    const previousInquiries = [...inquiries];
    setInquiries((prev) =>
      prev.map((item) =>
        item.id === inquiryId ? { ...item, status: newStatus } : item
      )
    );

    startTransition(async () => {
      const res = await updateInquiryStatus(inquiryId, newStatus);
      setUpdatingId(null);
      if (!res.success) {
        // Rollback
        setInquiries(previousInquiries);
        showToast(res.error || "فشل تحديث الحالة");
      } else {
        showToast(`تم تحديث حالة الطلب إلى "${STATUS_CONFIG[newStatus].label}"`);
        if (selectedInquiry && selectedInquiry.id === inquiryId) {
          setSelectedInquiry((prev) =>
            prev ? { ...prev, status: newStatus } : null
          );
        }
      }
    });
  };

  const handleDelete = async (inquiryId: string) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟")) {
      return;
    }

    setUpdatingId(inquiryId);
    const previousInquiries = [...inquiries];
    setInquiries((prev) => prev.filter((item) => item.id !== inquiryId));

    startTransition(async () => {
      const res = await deleteAdminInquiry(inquiryId);
      setUpdatingId(null);
      if (!res.success) {
        setInquiries(previousInquiries);
        showToast(res.error || "فشل حذف الطلب");
      } else {
        showToast("تم حذف الطلب بنجاح");
        if (selectedInquiry && selectedInquiry.id === inquiryId) {
          setSelectedInquiry(null);
        }
      }
    });
  };

  return (
    <div className="bg-[#F8F6F0]/80 backdrop-blur-xl rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.08)] flex flex-col space-y-space-sm border border-[#A0BDDB]/35">
      {/* Header with Title and Real Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-[#34211B] text-[22px]">
            mark_chat_unread
          </span>
          <h2 className="font-title-sm text-title-sm text-[#34211B] font-bold">
            أحدث طلبات واستفسارات العملاء
          </h2>
        </div>
        <span className="font-label-sm text-label-sm text-[#34211B] bg-[#A0BDDB] border border-[#A0BDDB]/40 px-2.5 py-0.5 rounded-full font-bold">
          {newCount} جديد
        </span>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-space-xs pt-1">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-[#34211B]/60 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="بحث بالاسم، رقم الهاتف، أو اسم العقار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] backdrop-blur-md pr-9 pl-3 py-2 rounded-xl text-[#34211B] font-body-sm text-body-sm focus:outline-none border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 shadow-inner transition-all placeholder:text-[#34211B]/40"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl font-label-sm text-label-sm transition-all whitespace-nowrap cursor-pointer ${
              statusFilter === "all"
                ? "bg-[#34211B] text-[#F8F6F0] font-bold shadow-sm border border-[#A0BDDB]/20"
                : "bg-[#F8F6F0]/70 backdrop-blur-md border border-[#A0BDDB]/30 text-[#34211B] hover:bg-[#F8F6F0]"
            }`}
          >
            الكل ({inquiries.length})
          </button>
          {ALL_STATUSES.map((st) => {
            const count = inquiries.filter((i) => i.status === st).length;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 rounded-xl font-label-sm text-label-sm transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#34211B] text-[#F8F6F0] font-bold shadow-sm border border-[#A0BDDB]/20"
                    : "bg-[#F8F6F0]/70 backdrop-blur-md border border-[#A0BDDB]/30 text-[#34211B] hover:bg-[#F8F6F0]"
                }`}
              >
                {STATUS_CONFIG[st].label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Inquiries Cards Stack */}
      <div className="space-y-space-sm mt-2" id="inquiriesContainer">
        {filteredInquiries.length === 0 ? (
          <div className="p-space-lg bg-[#EDE7DC]/40 backdrop-blur-md rounded-2xl text-center flex flex-col items-center justify-center gap-space-xs text-[#34211B]/60 border border-dashed border-[#A0BDDB]/50">
            <span className="material-symbols-outlined text-[36px] text-[#34211B]/40">
              inbox
            </span>
            <span className="font-body-sm text-body-sm text-[#34211B]">
              لا توجد طلبات واردة مطابقة لمعايير البحث الحالية.
            </span>
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const statusMeta = STATUS_CONFIG[inq.status] || STATUS_CONFIG.new;
            const isRowUpdating = updatingId === inq.id;

            return (
              <div
                key={inq.id}
                className={`p-space-sm rounded-xl bg-[#EDE7DC]/55 backdrop-blur-md border border-[#A0BDDB]/30 flex flex-col gap-space-xs transition-opacity shadow-xs ${
                  isRowUpdating ? "opacity-60" : "opacity-100"
                }`}
              >
                {/* Top Row: Customer Info + Status Badge */}
                <div className="flex items-center justify-between gap-space-xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-8 h-8 rounded-full bg-[#34211B] text-[#F8F6F0] flex items-center justify-center font-label-md font-bold shrink-0">
                      {getInitials(inq.customer_name)}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-title-sm text-title-sm text-[#34211B] font-semibold">
                        {inq.customer_name}
                      </span>
                      <span className="font-label-sm text-label-sm text-[#34211B]/70 font-mono" dir="ltr">
                        {inq.phone}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-label-sm font-label-sm font-semibold whitespace-nowrap ${statusMeta.badgeClass}`}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                {/* Property Association Row */}
                <div className="bg-[#F8F6F0]/80 backdrop-blur-md p-space-xs rounded-xl border border-[#A0BDDB]/35 text-body-sm font-body-sm text-[#34211B] flex items-center justify-between gap-space-xs">
                  {inq.properties ? (
                    <Link
                      href={`/properties/${inq.properties.id}`}
                      target="_blank"
                      className="truncate text-[#34211B] hover:text-[#34211B]/80 transition-colors flex items-center gap-1 font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px] text-[#34211B]">
                        home
                      </span>
                      <span className="truncate">{inq.properties.title_ar}</span>
                      <span className="text-[#34211B]/60 text-label-sm font-normal">
                        ({inq.properties.governorates?.name_ar || ""})
                      </span>
                    </Link>
                  ) : inq.property_id ? (
                    <span className="text-[#34211B]/60 italic text-label-sm">
                      عقار مرتبط سابقاً (تمت إزالته من السجل)
                    </span>
                  ) : (
                    <span className="text-[#34211B] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#34211B]/60">
                        chat_bubble_outline
                      </span>
                      <span>استفسار عام / طلب مخصص</span>
                    </span>
                  )}

                  <span className="font-label-sm text-label-sm text-[#34211B]/60 shrink-0 whitespace-nowrap">
                    {formatDate(inq.created_at)}
                  </span>
                </div>

                {/* Message Snippet */}
                {inq.message && (
                  <p className="font-body-sm text-body-sm text-[#34211B]/85 bg-[#F8F6F0]/70 border border-[#A0BDDB]/25 p-2 rounded-lg line-clamp-2">
                    {inq.message}
                  </p>
                )}

                {/* Action Bar: Direct Contacts, Status Selector, and Details Modal Trigger */}
                <div className="flex items-center justify-between pt-1 border-t border-[#A0BDDB]/25">
                  <div className="flex items-center gap-1">
                    {/* Phone Call */}
                    <a
                      href={`tel:${inq.phone.replace(/\s+/g, "")}`}
                      aria-label="اتصال هاتفي"
                      title="اتصال هاتفي"
                      className="w-8 h-8 rounded-lg bg-[#F8F6F0]/80 border border-[#A0BDDB]/30 flex items-center justify-center text-[#34211B] hover:bg-[#34211B] hover:text-[#F8F6F0] transition-colors shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                    </a>
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/${(inq.whatsapp || inq.phone).replace(/\D+/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="مراسلة واتساب"
                      title="مراسلة عبر واتساب"
                      className="w-8 h-8 rounded-lg bg-[#A0BDDB]/25 border border-[#A0BDDB]/40 flex items-center justify-center text-[#34211B] hover:bg-[#A0BDDB] transition-colors shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                    </a>
                    {/* Email if available */}
                    {inq.email && (
                      <a
                        href={`mailto:${inq.email}`}
                        aria-label="إرسال بريد"
                        title={`إرسال بريد إلى ${inq.email}`}
                        className="w-8 h-8 rounded-lg bg-[#F8F6F0]/80 border border-[#A0BDDB]/30 flex items-center justify-center text-[#34211B] hover:bg-[#34211B] hover:text-[#F8F6F0] transition-colors shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                      </a>
                    )}
                    {/* Inspection Modal */}
                    <button
                      type="button"
                      onClick={() => setSelectedInquiry(inq)}
                      aria-label="عرض التفاصيل الكاملة"
                      title="عرض التفاصيل الكاملة"
                      className="w-8 h-8 rounded-lg bg-[#F8F6F0]/80 border border-[#A0BDDB]/30 flex items-center justify-center text-[#34211B] hover:bg-[#34211B] hover:text-[#F8F6F0] transition-colors cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                    </button>
                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleDelete(inq.id)}
                      disabled={isRowUpdating}
                      aria-label="حذف الطلب"
                      title="حذف الطلب"
                      className="w-8 h-8 rounded-lg bg-[#F8F6F0]/80 border border-[#A0BDDB]/30 flex items-center justify-center text-red-600 hover:text-white hover:bg-red-600 transition-colors cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-label-sm font-label-sm text-[#34211B]/70 hidden sm:inline font-medium">
                      الحالة:
                    </label>
                    <select
                      value={inq.status}
                      disabled={isRowUpdating}
                      onChange={(e) =>
                        handleStatusChange(inq.id, e.target.value as InquiryStatus)
                      }
                      className="bg-[#F8F6F0] text-[#34211B] text-label-sm font-label-sm rounded-lg px-2 py-1 border border-[#A0BDDB]/35 focus:outline-none focus:ring-1 focus:ring-[#A0BDDB] cursor-pointer"
                    >
                      {ALL_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {STATUS_CONFIG[st].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#34211B]/40 p-4 backdrop-blur-md">
          <div
            className="bg-[#F8F6F0]/95 backdrop-blur-2xl rounded-2xl max-w-lg w-full p-space-lg shadow-[0_16px_48px_rgba(52,33,27,0.25)] flex flex-col gap-space-md border border-[#A0BDDB]/45 animate-in fade-in zoom-in-95 duration-150"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#A0BDDB]/30 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-[#34211B] text-[#F8F6F0] flex items-center justify-center font-bold">
                  {getInitials(selectedInquiry.customer_name)}
                </span>
                <div>
                  <h3 className="font-title-sm text-title-sm text-[#34211B] font-bold">
                    {selectedInquiry.customer_name}
                  </h3>
                  <span className="font-label-sm text-label-sm text-[#34211B]/60">
                    تاريخ الطلب: {formatDate(selectedInquiry.created_at)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="w-8 h-8 rounded-lg bg-[#EDE7DC] flex items-center justify-center text-[#34211B] hover:bg-[#EDE7DC]/80 transition-colors cursor-pointer border border-[#A0BDDB]/30"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-space-sm">
              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-2 bg-[#EDE7DC]/55 p-space-sm rounded-xl border border-[#A0BDDB]/30">
                <div>
                  <span className="font-label-sm text-label-sm text-[#34211B]/60 block">
                    رقم الهاتف
                  </span>
                  <a
                    href={`tel:${selectedInquiry.phone.replace(/\s+/g, "")}`}
                    className="font-body-sm text-body-sm font-semibold text-[#34211B] hover:underline font-mono"
                    dir="ltr"
                  >
                    {selectedInquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-[#34211B]/60 block">
                    واتساب
                  </span>
                  <a
                    href={`https://wa.me/${(selectedInquiry.whatsapp || selectedInquiry.phone).replace(/\D+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body-sm text-body-sm font-semibold text-[#34211B] hover:underline font-mono"
                    dir="ltr"
                  >
                    {selectedInquiry.whatsapp || selectedInquiry.phone}
                  </a>
                </div>
                {selectedInquiry.email && (
                  <div className="col-span-2">
                    <span className="font-label-sm text-label-sm text-[#34211B]/60 block">
                      البريد الإلكتروني
                    </span>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="font-body-sm text-body-sm text-[#34211B] hover:underline font-mono"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Related Property Block */}
              {selectedInquiry.properties && (
                <div className="bg-[#EDE7DC]/55 p-space-sm rounded-xl border border-[#A0BDDB]/30 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-[#34211B]/60">
                    العقار المرتبط بالطلب
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-title-sm text-title-sm text-[#34211B] font-semibold">
                      {selectedInquiry.properties.title_ar}
                    </span>
                    <span className="font-label-md text-label-md font-bold text-[#34211B]">
                      ${Number(selectedInquiry.properties.price).toLocaleString()}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-[#34211B]/60">
                    {selectedInquiry.properties.governorates?.name_ar} -{" "}
                    {selectedInquiry.properties.districts?.name_ar ||
                      selectedInquiry.properties.address}
                  </span>
                  <Link
                    href={`/properties/${selectedInquiry.properties.id}`}
                    target="_blank"
                    className="text-[#34211B] text-label-sm font-label-sm hover:underline mt-1 flex items-center gap-1 font-bold"
                  >
                    <span>فتح صفحة تفاصيل العقار في نافذة جديدة</span>
                    <span className="material-symbols-outlined text-[14px]">
                      open_in_new
                    </span>
                  </Link>
                </div>
              )}

              {/* Inquiry Message / Details */}
              <div className="bg-[#EDE7DC]/55 p-space-sm rounded-xl border border-[#A0BDDB]/30 flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-[#34211B]/60">
                  نص الرسالة والملاحظات
                </span>
                <p className="font-body-sm text-body-sm text-[#34211B] whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Status Update in Modal */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-label-md text-label-md text-[#34211B] font-bold">
                  تغيير حالة الطلب:
                </span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedInquiry.id,
                      e.target.value as InquiryStatus
                    )
                  }
                  className="bg-[#F8F6F0] text-[#34211B] text-label-sm font-label-sm rounded-xl px-3 py-1.5 border border-[#A0BDDB]/35 focus:outline-none focus:ring-1 focus:ring-[#A0BDDB]"
                >
                  {ALL_STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {STATUS_CONFIG[st].label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 border-t border-[#A0BDDB]/30 pt-space-sm">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-space-md py-2 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-xl font-label-md text-label-md transition-colors cursor-pointer border border-[#A0BDDB]/20"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
