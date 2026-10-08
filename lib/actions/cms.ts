"use server";

import { revalidatePath } from "next/cache";
import { cache } from "react";
import { createClient, createPublicClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/admin";
import { HomepageSection, HomepageSettings, Json } from "@/lib/supabase/types";

export interface HomepageConfig {
  sections: HomepageSection[];
  settings: HomepageSettings | null;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

const DEFAULT_SECTIONS: Omit<HomepageSection, "id" | "created_at" | "updated_at">[] = [
  {
    section_key: "hero",
    title_ar: "الواجهة الرئيسية والبحث",
    description_ar: "بنر العاصمة مع محرك الفلترة والبحث",
    is_enabled: true,
    sort_order: 1,
    configuration: { show_deal_tabs: true, show_price_chips: true },
  },
  {
    section_key: "special_offers",
    title_ar: "عروض حصرية مميزة",
    description_ar: "فرص عقارية مختارة لفترة محدودة (CMS حي)",
    is_enabled: true,
    sort_order: 2,
    configuration: { badge: "CMS حي", limit: 3 },
  },
  {
    section_key: "featured_properties",
    title_ar: "عقارات مميزة مختارة",
    description_ar: "عقارات مدققة وموثقة قانونياً من فريق دعبول",
    is_enabled: true,
    sort_order: 3,
    configuration: { limit: 4, show_specs: true },
  },
  {
    section_key: "locations",
    title_ar: "استكشف حسب المحافظة",
    description_ar: "تغطية شاملة لأهم المدن والمراكز الاستثمارية السورية",
    is_enabled: true,
    sort_order: 4,
    configuration: { columns: 2 },
  },
  {
    section_key: "property_types",
    title_ar: "تصفح حسب نوع العقار",
    description_ar: "شقق، فلل، مكاتب، محلات، أراضٍ",
    is_enabled: true,
    sort_order: 5,
    configuration: { horizontal_scroll: true },
  },
  {
    section_key: "why_daboul",
    title_ar: "لماذا تختار دعبول العقارية؟",
    description_ar: "أعمدة الثقة، المصداقية، والتوثيق القانوني",
    is_enabled: true,
    sort_order: 6,
    configuration: { subtitle: "ثقة ومصداقية تتوارثها الأجيال" },
  },
  {
    section_key: "latest_properties",
    title_ar: "أحدث العقارات المضافة",
    description_ar: "أحدث العروض المسجلة في السجل اليومي",
    is_enabled: true,
    sort_order: 7,
    configuration: { limit: 6 },
  },
  {
    section_key: "cta_banner",
    title_ar: "بانر إضافة عقار",
    description_ar: "دعوة الملاك لإضافة وتأجير عقاراتهم",
    is_enabled: true,
    sort_order: 8,
    configuration: {
      button_text: "أضف عقارك الآن عبر واتساب دعبول",
      button_link: "https://wa.me/963900000000",
    },
  },
];

/**
 * Fetches the homepage CMS configuration (public read).
 * Returns sections sorted by sort_order ASC and settings.
 * Includes graceful fallbacks if database read encounters an issue.
 * Cached with React cache().
 */
export const getHomepageConfig = cache(async (): Promise<HomepageConfig> => {
  try {
    const supabase = createPublicClient();
    const [sectionsRes, settingsRes] = await Promise.all([
      supabase
        .from("homepage_sections")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase.from("homepage_settings").select("*").limit(1).maybeSingle(),
    ]);

    const sections = (sectionsRes.data as HomepageSection[]) || [];
    const settings = (settingsRes.data as HomepageSettings) || null;

    if (sections.length === 0) {
      // Return safe defaults if table is empty
      return {
        sections: DEFAULT_SECTIONS.map((s, idx) => ({
          ...s,
          id: `default-${idx}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })),
        settings,
      };
    }

    return {
      sections,
      settings,
    };
  } catch (error) {
    console.error("Exception in getHomepageConfig:", error);
    return {
      sections: DEFAULT_SECTIONS.map((s, idx) => ({
        ...s,
        id: `fallback-${idx}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })),
      settings: null,
    };
  }
});

/**
 * Toggles a homepage section enabled/disabled state. Requires active admin.
 */
export async function toggleSectionEnabled(
  sectionKey: string,
  isEnabled: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from("homepage_sections")
      .update({
        is_enabled: isEnabled,
        updated_at: new Date().toISOString(),
      })
      .eq("section_key", sectionKey);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل تعديل حالة القسم";
    return { success: false, error: msg };
  }
}

/**
 * Reorders homepage sections based on an ordered array of section_keys.
 * Requires active admin.
 */
export async function reorderSections(
  orderedSectionKeys: string[]
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const updates = orderedSectionKeys.map((key, index) =>
      supabase
        .from("homepage_sections")
        .update({
          sort_order: index + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("section_key", key)
    );

    const results = await Promise.all(updates);
    const firstErr = results.find((r) => r.error);
    if (firstErr?.error) {
      return { success: false, error: firstErr.error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل إعادة ترتيب الأقسام";
    return { success: false, error: msg };
  }
}

/**
 * Updates the hero settings in homepage_settings. Requires active admin.
 */
export async function updateHeroSettings(data: {
  hero_title_ar: string;
  hero_description_ar: string;
  hero_image?: string | null;
  hero_cta_text?: string | null;
  hero_cta_link?: string | null;
}): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createClient();

    // Fetch existing settings ID
    const { data: existing } = await supabase
      .from("homepage_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (!data.hero_title_ar || data.hero_title_ar.trim().length === 0) {
      return { success: false, error: "يرجى إدخال عنوان رئيسي للواجهة." };
    }

    let error;
    if (existing?.id) {
      const res = await supabase
        .from("homepage_settings")
        .update({
          hero_title_ar: data.hero_title_ar.trim(),
          hero_description_ar: data.hero_description_ar.trim(),
          hero_image: data.hero_image?.trim() || null,
          hero_cta_text: data.hero_cta_text?.trim() || null,
          hero_cta_link: data.hero_cta_link?.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      error = res.error;
    } else {
      const res = await supabase.from("homepage_settings").insert({
        hero_title_ar: data.hero_title_ar.trim(),
        hero_description_ar: data.hero_description_ar.trim(),
        hero_image: data.hero_image?.trim() || null,
        hero_cta_text: data.hero_cta_text?.trim() || null,
        hero_cta_link: data.hero_cta_link?.trim() || null,
      });
      error = res.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل حفظ إعدادات الواجهة";
    return { success: false, error: msg };
  }
}

/**
 * Updates a specific section's metadata and configuration. Requires active admin.
 */
export async function updateSectionDetails(
  sectionKey: string,
  data: {
    title_ar?: string;
    description_ar?: string | null;
    configuration?: Json;
  }
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const updatePayload: Partial<HomepageSection> = {
      updated_at: new Date().toISOString(),
    };
    if (data.title_ar !== undefined) updatePayload.title_ar = data.title_ar.trim();
    if (data.description_ar !== undefined)
      updatePayload.description_ar = data.description_ar ? data.description_ar.trim() : null;
    if (data.configuration !== undefined) updatePayload.configuration = data.configuration;

    const { error } = await supabase
      .from("homepage_sections")
      .update(updatePayload)
      .eq("section_key", sectionKey);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "فشل تحديث بيانات القسم";
    return { success: false, error: msg };
  }
}
