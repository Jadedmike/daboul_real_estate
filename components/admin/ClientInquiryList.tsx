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
    badgeClass: "bg-secondary-fixed text-on-secondary-fixed border border-secondary-container/30",
    icon: "mark_chat_unread",
  },
  contacted: {
    label: "تم التواصل",
    badgeClass: "bg-blue-100 text-blue-800 border border-blue-200",
    icon: "call",
  },
  interested: {
    label: "مهتم وجاد",
    badgeClass: "bg-amber-100 text-amber-800 border border-amber-200",
    icon: "thumb_up",
  },
  viewing: {
    label: "معاينة ميدانية",
    badgeClass: "bg-purple-100 text-purple-800 border border-purple-200",
    icon: "calendar_month",
  },
  deal_completed: {
    label: "تمت الصفقة",
    badgeClass: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    icon: "handshake",
  },
  closed: {
    label: "مغلق",
    badgeClass: "bg-surface-container-high text-outline border border-outline-variant/40",
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
    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col space-y-space-sm border border-outline-variant/30">
      {/* Header with Title and Real Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-secondary-container text-[22px]">
            mark_chat_unread
          </span>
          <h2 className="font-title-sm text-title-sm text-on-surface font-bold">
            أحدث طلبات واستفسارات العملاء
          </h2>
        </div>
        <span className="font-label-sm text-label-sm text-secondary-container bg-secondary-fixed px-2.5 py-0.5 rounded-full font-bold">
          {newCount} جديد
        </span>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-space-xs pt-1">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="بحث بالاسم، رقم الهاتف، أو اسم العقار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low pr-8 pl-3 py-1.5 rounded-lg text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary-container"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors whitespace-nowrap cursor-pointer ${
              statusFilter === "all"
                ? "bg-primary text-on-primary font-bold shadow-xs"
                : "bg-surface-container-low text-on-surface hover:bg-surface-container"
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
                className={`px-2.5 py-1.5 rounded-lg font-label-sm text-label-sm transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? "bg-secondary-container text-on-primary font-bold shadow-xs"
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container"
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
          <div className="p-space-lg bg-surface-container-low/50 rounded-lg text-center flex flex-col items-center justify-center gap-space-xs text-outline">
            <span className="material-symbols-outlined text-[36px] text-outline-variant">
              inbox
            </span>
            <span className="font-body-sm text-body-sm">
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
                className={`p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs transition-opacity ${
                  isRowUpdating ? "opacity-60" : "opacity-100"
                }`}
              >
                {/* Top Row: Customer Info + Status Badge */}
                <div className="flex items-center justify-between gap-space-xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md font-bold shrink-0">
                      {getInitials(inq.customer_name)}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                        {inq.customer_name}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline font-mono" dir="ltr">
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
                <div className="bg-surface-container-lowest p-space-xs rounded text-body-sm font-body-sm text-on-surface-variant flex items-center justify-between gap-space-xs">
                  {inq.properties ? (
                    <Link
                      href={`/properties/${inq.properties.id}`}
                      target="_blank"
                      className="truncate hover:text-primary transition-colors flex items-center gap-1 font-semibold"
                    >
                      <span className="material-symbols-outlined text-[16px] text-secondary">
                        home
                      </span>
                      <span className="truncate">{inq.properties.title_ar}</span>
                      <span className="text-outline text-label-sm font-normal">
                        ({inq.properties.governorates?.name_ar || ""})
                      </span>
                    </Link>
                  ) : inq.property_id ? (
                    <span className="text-outline italic text-label-sm">
                      عقار مرتبط سابقاً (تمت إزالته من السجل)
                    </span>
                  ) : (
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-outline">
                        chat_bubble_outline
                      </span>
                      <span>استفسار عام / طلب مخصص</span>
                    </span>
                  )}

                  <span className="font-label-sm text-label-sm text-outline shrink-0 whitespace-nowrap">
                    {formatDate(inq.created_at)}
                  </span>
                </div>

                {/* Message Snippet */}
                {inq.message && (
                  <p className="font-body-sm text-body-sm text-on-surface/80 bg-surface-container-lowest/60 p-2 rounded line-clamp-2">
                    {inq.message}
                  </p>
                )}

                {/* Action Bar: Direct Contacts, Status Selector, and Details Modal Trigger */}
                <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
                  <div className="flex items-center gap-1">
                    {/* Phone Call */}
                    <a
                      href={`tel:${inq.phone.replace(/\s+/g, "")}`}
                      aria-label="اتصال هاتفي"
                      title="اتصال هاتفي"
                      className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-primary hover:text-secondary-container transition-colors"
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
                      className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">chat</span>
                    </a>
                    {/* Email if available */}
                    {inq.email && (
                      <a
                        href={`mailto:${inq.email}`}
                        aria-label="إرسال بريد"
                        title={`إرسال بريد إلى ${inq.email}`}
                        className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-primary hover:text-secondary-container transition-colors"
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
                      className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
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
                      className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-1.5">
                    <label className="text-label-sm font-label-sm text-outline hidden sm:inline">
                      الحالة:
                    </label>
                    <select
                      value={inq.status}
                      disabled={isRowUpdating}
                      onChange={(e) =>
                        handleStatusChange(inq.id, e.target.value as InquiryStatus)
                      }
                      className="bg-surface-container-lowest text-on-surface text-label-sm font-label-sm rounded-md px-2 py-1 border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary-container cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div
            className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-space-lg shadow-xl flex flex-col gap-space-md border border-outline-variant/40 animate-in fade-in zoom-in-95 duration-150"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                  {getInitials(selectedInquiry.customer_name)}
                </span>
                <div>
                  <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                    {selectedInquiry.customer_name}
                  </h3>
                  <span className="font-label-sm text-label-sm text-outline">
                    تاريخ الطلب: {formatDate(selectedInquiry.created_at)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-space-sm">
              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-2 bg-surface-container-low p-space-sm rounded-lg">
                <div>
                  <span className="font-label-sm text-label-sm text-outline block">
                    رقم الهاتف
                  </span>
                  <a
                    href={`tel:${selectedInquiry.phone.replace(/\s+/g, "")}`}
                    className="font-body-sm text-body-sm font-semibold text-primary hover:underline font-mono"
                    dir="ltr"
                  >
                    {selectedInquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-outline block">
                    واتساب
                  </span>
                  <a
                    href={`https://wa.me/${(selectedInquiry.whatsapp || selectedInquiry.phone).replace(/\D+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body-sm text-body-sm font-semibold text-emerald-600 hover:underline font-mono"
                    dir="ltr"
                  >
                    {selectedInquiry.whatsapp || selectedInquiry.phone}
                  </a>
                </div>
                {selectedInquiry.email && (
                  <div className="col-span-2">
                    <span className="font-label-sm text-label-sm text-outline block">
                      البريد الإلكتروني
                    </span>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="font-body-sm text-body-sm text-on-surface hover:underline font-mono"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Related Property Block */}
              {selectedInquiry.properties && (
                <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm text-outline">
                    العقار المرتبط بالطلب
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                      {selectedInquiry.properties.title_ar}
                    </span>
                    <span className="font-label-md text-label-md font-bold text-secondary">
                      ${Number(selectedInquiry.properties.price).toLocaleString()}
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-outline">
                    {selectedInquiry.properties.governorates?.name_ar} -{" "}
                    {selectedInquiry.properties.districts?.name_ar ||
                      selectedInquiry.properties.address}
                  </span>
                  <Link
                    href={`/properties/${selectedInquiry.properties.id}`}
                    target="_blank"
                    className="text-secondary text-label-sm font-label-sm hover:underline mt-1 flex items-center gap-1"
                  >
                    <span>فتح صفحة تفاصيل العقار في نافذة جديدة</span>
                    <span className="material-symbols-outlined text-[14px]">
                      open_in_new
                    </span>
                  </Link>
                </div>
              )}

              {/* Inquiry Message / Details */}
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-outline">
                  نص الرسالة والملاحظات
                </span>
                <p className="font-body-sm text-body-sm text-on-surface whitespace-pre-wrap leading-relaxed">
                  {selectedInquiry.message}
                </p>
              </div>

              {/* Status Update in Modal */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-label-md text-label-md text-on-surface font-bold">
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
                  className="bg-surface-container-low text-on-surface text-label-sm font-label-sm rounded-lg px-3 py-1.5 border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary-container"
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
            <div className="flex items-center justify-end gap-2 border-t border-outline-variant/30 pt-space-sm">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-space-md py-2 bg-surface-container text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
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
