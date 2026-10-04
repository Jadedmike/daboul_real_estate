"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { Inquiry, InquiryStatus } from "@/lib/supabase/types";

export interface PublicInquiryInput {
  customer_name: string;
  phone: string;
  whatsapp?: string | null;
  email?: string | null;
  message: string;
  property_id?: string | null;
}

export interface InquiryActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AdminInquiryWithProperty extends Inquiry {
  properties: {
    id: string;
    title_ar: string;
    price: number;
    currency: string;
    address: string;
    governorates: { name_ar: string } | null;
    districts: { name_ar: string } | null;
  } | null;
}

export interface AdminInquiryFilters {
  status?: InquiryStatus | "all";
  property_id?: string;
  search?: string;
}

const VALID_STATUSES: InquiryStatus[] = [
  "new",
  "contacted",
  "interested",
  "viewing",
  "deal_completed",
  "closed",
];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates public inquiry submission input.
 */
function validateInquiryInput(data: PublicInquiryInput): string | null {
  const name = data.customer_name?.trim();
  if (!name || name.length < 2) {
    return "يرجى إدخال اسم العميل بالكامل (حرفان على الأقل).";
  }

  const phone = data.phone?.trim();
  if (!phone || phone.length < 6) {
    return "يرجى إدخال رقم هاتف صالح للتواصل (6 أرقام على الأقل).";
  }

  if (data.email && data.email.trim().length > 0) {
    const email = data.email.trim();
    if (!EMAIL_REGEX.test(email)) {
      return "يرجى إدخال بريد إلكتروني بصيغة صحيحة (مثال: name@domain.com).";
    }
  }

  const message = data.message?.trim();
  if (!message || message.length < 2) {
    return "يرجى إدخال نص الرسالة أو تحديد تفاصيل المعاينة المطلوبة.";
  }
  if (message.length > 2000) {
    return "نص الرسالة طويل جداً، يرجى اختصارها بما لا يتجاوز 2000 حرف.";
  }

  return null;
}

/**
 * Submits a public inquiry or inspection booking from website visitors.
 * Respects Supabase RLS and never exposes database internals to public visitors.
 */
export async function submitPublicInquiry(
  input: PublicInquiryInput
): Promise<InquiryActionResult<{ id?: string }>> {
  try {
    // 1. Validate form fields
    const validationError = validateInquiryInput(input);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const supabase = await createClient();

    // 2. Validate property existence & availability when property_id is supplied
    let cleanPropertyId: string | null = null;
    if (input.property_id && input.property_id.trim().length > 0) {
      const pid = input.property_id.trim();
      if (!UUID_REGEX.test(pid)) {
        return {
          success: false,
          error: "معرف العقار المرفق غير صالح.",
        };
      }

      // Check if property exists and is available for public inquiry
      const { data: prop, error: propErr } = await supabase
        .from("properties")
        .select("id, status")
        .eq("id", pid)
        .maybeSingle();

      if (propErr || !prop || prop.status !== "available") {
        return {
          success: false,
          error: "عفواً، العقار المطلوب غير متاح حالياً لاستقبال الطلبات والمعاينات.",
        };
      }

      cleanPropertyId = prop.id;
    }

    // 3. Prepare payload matching schema
    const payload = {
      customer_name: input.customer_name.trim(),
      phone: input.phone.trim(),
      whatsapp: input.whatsapp?.trim() || null,
      email: input.email?.trim() || null,
      message: input.message.trim(),
      property_id: cleanPropertyId,
      status: "new" as InquiryStatus,
    };

    // 4. Insert row into Supabase public.inquiries (without .select() to preserve anon privacy)
    const { error: insertError } = await supabase
      .from("inquiries")
      .insert(payload);

    if (insertError) {
      console.error("Public inquiry insert error:", insertError.message);
      return {
        success: false,
        error: "حدث خطأ أثناء إرسال طلبكم، يرجى المحاولة مرة أخرى لاحقاً.",
      };
    }

    // Revalidate admin dashboard so admin sees the new lead
    revalidatePath("/admin");

    return {
      success: true,
      message:
        "تم استلام طلبكم بنجاح! سيتواصل معكم مستشار دعبول العقاري في أقرب وقت.",
    };
  } catch (error) {
    console.error("Exception submitting public inquiry:", error);
    return {
      success: false,
      error: "تعذر إرسال الطلب في الوقت الحالي، يرجى التحقق من اتصالك بالإنترنت.",
    };
  }
}

/**
 * Fetches all customer inquiries for the protected admin dashboard.
 * Requires active single admin authentication.
 */
export async function getAdminInquiries(
  filters?: AdminInquiryFilters
): Promise<AdminInquiryWithProperty[]> {
  try {
    // Enforce admin permission
    await requireAdmin();

    const supabase = await createClient();

    let query = supabase
      .from("inquiries")
      .select(
        "*, properties(id, title_ar, price, currency, address, governorates(name_ar), districts(name_ar))"
      )
      .order("created_at", { ascending: false });

    // Filter by status if requested
    if (filters?.status && filters.status !== "all") {
      if (VALID_STATUSES.includes(filters.status)) {
        query = query.eq("status", filters.status);
      }
    }

    // Filter by property if requested
    if (filters?.property_id && filters.property_id !== "all") {
      query = query.eq("property_id", filters.property_id);
    }

    // Search by customer name, phone, or email
    if (filters?.search && filters.search.trim().length > 0) {
      const term = filters.search.trim();
      query = query.or(
        `customer_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error("Admin inquiries fetch error:", error.message);
      return [];
    }

    return (data as unknown as AdminInquiryWithProperty[]) || [];
  } catch (error) {
    console.error("Exception fetching admin inquiries:", error);
    return [];
  }
}

/**
 * Updates the status of an existing inquiry.
 * Requires active single admin authentication and persists to public.inquiries.status.
 */
export async function updateInquiryStatus(
  inquiryId: string,
  newStatus: InquiryStatus
): Promise<InquiryActionResult<{ id: string; status: InquiryStatus }>> {
  try {
    // 1. Enforce admin permission
    await requireAdmin();

    if (!inquiryId || !UUID_REGEX.test(inquiryId)) {
      return { success: false, error: "معرف الطلب غير صالح." };
    }

    if (!VALID_STATUSES.includes(newStatus)) {
      return {
        success: false,
        error: `حالة غير مدعومة. الحالات المسموحة: ${VALID_STATUSES.join(", ")}`,
      };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("inquiries")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", inquiryId)
      .select("id, status")
      .single();

    if (error || !data) {
      console.error("Error updating inquiry status:", error?.message);
      return {
        success: false,
        error: "فشل تحديث حالة الطلب في قاعدة البيانات.",
      };
    }

    revalidatePath("/admin");

    return {
      success: true,
      data: { id: data.id, status: data.status as InquiryStatus },
      message: "تم تحديث حالة الطلب بنجاح.",
    };
  } catch (error) {
    console.error("Exception updating inquiry status:", error);
    return {
      success: false,
      error: "حدث خطأ غير متوقع أثناء تحديث حالة الطلب.",
    };
  }
}

/**
 * Deletes an inquiry from the database.
 * Reserved for active admin management and test cleanups.
 */
export async function deleteAdminInquiry(
  inquiryId: string
): Promise<InquiryActionResult> {
  try {
    await requireAdmin();

    if (!inquiryId || !UUID_REGEX.test(inquiryId)) {
      return { success: false, error: "معرف الطلب غير صالح." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", inquiryId);

    if (error) {
      console.error("Error deleting inquiry:", error.message);
      return { success: false, error: "فشل حذف الطلب من قاعدة البيانات." };
    }

    revalidatePath("/admin");
    return { success: true, message: "تم حذف الطلب بنجاح." };
  } catch (error) {
    console.error("Exception deleting inquiry:", error);
    return { success: false, error: "حدث خطأ أثناء محاولة حذف الطلب." };
  }
}
