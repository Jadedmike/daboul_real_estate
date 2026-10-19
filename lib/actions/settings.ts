"use server";

import { revalidatePath } from "next/cache";
import { cache } from "react";
import { createClient, createPublicClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import type { Json } from "@/lib/supabase/types";
import {
  type CompanySettings,
  type SettingsActionResult,
  DEFAULT_COMPANY_SETTINGS,
} from "@/lib/types/settings";

export type { CompanySettings, SettingsActionResult };

const SECTION_KEY = "company_contact";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Fetches the central company settings from Supabase.
 * Reuses public.homepage_sections configuration JSONB.
 * Safe fallback to DEFAULT_COMPANY_SETTINGS if no record is found.
 * Cached with React cache().
 */
export const getCompanySettings = cache(async (): Promise<CompanySettings> => {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("homepage_sections")
      .select("configuration")
      .eq("section_key", SECTION_KEY)
      .maybeSingle();

    if (error || !data || !data.configuration) {
      return DEFAULT_COMPANY_SETTINGS;
    }

    const config = data.configuration as Record<string, unknown>;

    const sanitizeText = (val: unknown, fallback: string) => {
      if (typeof val !== "string" || !val.trim()) return fallback;
      const trimmed = val.trim();
      if (/دعبول|daboul/i.test(trimmed)) {
        return fallback;
      }
      return trimmed;
    };

    const sanitizeEmail = (val: unknown, fallback: string) => {
      if (typeof val !== "string" || !val.trim()) return fallback;
      const trimmed = val.trim();
      if (/daboul/i.test(trimmed)) return fallback;
      return trimmed;
    };

    const sanitizeAddress = (val: unknown, fallback: string) => {
      if (typeof val !== "string" || !val.trim()) return fallback;
      const trimmed = val.trim();
      if (/دعبول|daboul/i.test(trimmed)) {
        return trimmed.replace(/شارع\s*دعبول\s*الرئيسي/g, "الشارع الرئيسي").replace(/دعبول/gi, "Example");
      }
      return trimmed;
    };

    return {
      company_name_ar: sanitizeText(config.company_name_ar, DEFAULT_COMPANY_SETTINGS.company_name_ar),
      company_name_en: sanitizeText(config.company_name_en, DEFAULT_COMPANY_SETTINGS.company_name_en),
      phone:
        typeof config.phone === "string" && config.phone.trim()
          ? config.phone.trim()
          : DEFAULT_COMPANY_SETTINGS.phone,
      whatsapp:
        typeof config.whatsapp === "string" && config.whatsapp.trim()
          ? config.whatsapp.trim()
          : DEFAULT_COMPANY_SETTINGS.whatsapp,
      email: sanitizeEmail(config.email, DEFAULT_COMPANY_SETTINGS.email),
      address: sanitizeAddress(config.address, DEFAULT_COMPANY_SETTINGS.address),
      short_description:
        typeof config.short_description === "string" && config.short_description.trim()
          ? config.short_description.trim()
          : DEFAULT_COMPANY_SETTINGS.short_description,
      working_hours:
        typeof config.working_hours === "string" && config.working_hours.trim()
          ? config.working_hours.trim()
          : DEFAULT_COMPANY_SETTINGS.working_hours,
    };
  } catch (error) {
    console.error("Exception fetching company settings:", error);
    return DEFAULT_COMPANY_SETTINGS;
  }
});

/**
 * Updates company settings.
 * Enforces admin authorization and persists to public.homepage_sections.
 */
export async function updateCompanySettings(
  data: Partial<CompanySettings>
): Promise<SettingsActionResult<CompanySettings>> {
  try {
    // 1. Authorize active admin
    await requireAdmin();

    // 2. Validate fields
    if (data.email && data.email.trim().length > 0) {
      if (!EMAIL_REGEX.test(data.email.trim())) {
        return {
          success: false,
          error: "يرجى إدخال بريد إلكتروني صالح للشركة (مثال: info@domain.com).",
        };
      }
    }

    if (data.phone && data.phone.trim().length > 0 && data.phone.trim().length < 6) {
      return {
        success: false,
        error: "يرجى إدخال رقم هاتف صالح للشركة.",
      };
    }

    if (data.whatsapp && data.whatsapp.trim().length > 0 && data.whatsapp.trim().length < 6) {
      return {
        success: false,
        error: "يرجى إدخال رقم واتساب صالح للشركة.",
      };
    }

    // 3. Merge with existing settings
    const current = await getCompanySettings();
    const updated: CompanySettings = {
      company_name_ar: data.company_name_ar?.trim() || current.company_name_ar,
      company_name_en: data.company_name_en?.trim() || current.company_name_en,
      phone: data.phone?.trim() || current.phone,
      whatsapp: data.whatsapp?.trim() || current.whatsapp,
      email: data.email?.trim() || current.email,
      address: data.address?.trim() || current.address,
      short_description: data.short_description?.trim() || current.short_description,
      working_hours: data.working_hours?.trim() || current.working_hours,
    };

    const supabase = await createClient();

    // 4. Upsert into public.homepage_sections
    const { error } = await supabase.from("homepage_sections").upsert(
      {
        section_key: SECTION_KEY,
        title_ar: updated.company_name_ar,
        description_ar: updated.short_description,
        is_enabled: true,
        sort_order: 99,
        configuration: updated as unknown as Json,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "section_key" }
    );

    if (error) {
      console.error("Error upserting company settings:", error.message);
      return {
        success: false,
        error: "فشل حفظ إعدادات الشركة في قاعدة البيانات.",
      };
    }

    // 5. Revalidate public and admin paths
    revalidatePath("/");
    revalidatePath("/properties");
    revalidatePath("/contact");
    revalidatePath("/about");
    revalidatePath("/admin");

    return {
      success: true,
      data: updated,
      message: "تم حفظ إعدادات الشركة بنجاح.",
    };
  } catch (error) {
    console.error("Exception updating company settings:", error);
    return {
      success: false,
      error: "حدث خطأ أثناء حفظ إعدادات الشركة.",
    };
  }
}
