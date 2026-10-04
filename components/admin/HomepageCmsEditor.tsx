"use client";

import React, { useState } from "react";
import { HomepageSection, HomepageSettings } from "@/lib/supabase/types";
import {
  toggleSectionEnabled,
  reorderSections,
  updateHeroSettings,
  updateSectionDetails,
} from "@/lib/actions/cms";
import { useToast } from "@/components/ui/Toast";

interface HomepageCmsEditorProps {
  initialSections: HomepageSection[];
  initialSettings: HomepageSettings | null;
}

const SECTION_DISPLAY_NAMES: Record<string, { label: string; icon: string }> = {
  hero: { label: "الواجهة الرئيسية والبحث (Hero)", icon: "view_carousel" },
  special_offers: { label: "العروض الحصرية (Special Offers)", icon: "local_fire_department" },
  featured_properties: { label: "العقارات المميزة (Featured Properties)", icon: "star" },
  locations: { label: "استكشف حسب المحافظة (Locations)", icon: "location_city" },
  property_types: { label: "تصفح حسب نوع العقار (Property Types)", icon: "category" },
  why_daboul: { label: "لماذا تختار دعبول؟ (Why DABOUL)", icon: "verified_user" },
  latest_properties: { label: "أحدث العقارات المضافة (Latest Properties)", icon: "schedule" },
  cta_banner: { label: "بانر إضافة وتسويق العقار (CTA Banner)", icon: "campaign" },
};

export function HomepageCmsEditor({
  initialSections,
  initialSettings,
}: HomepageCmsEditorProps) {
  const { showToast } = useToast();

  // State for sections order and visibility
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [isSavingSections, setIsSavingSections] = useState(false);

  // State for Hero settings
  const [heroTitle, setHeroTitle] = useState(
    initialSettings?.hero_title_ar || "اكتشف عقارك القادم في سوريا"
  );
  const [heroDescription, setHeroDescription] = useState(
    initialSettings?.hero_description_ar ||
      "مجموعة مميزة من العقارات للبيع والإيجار في مختلف المحافظات السورية بأعلى معايير المصداقية والاحترافية المعمارية."
  );
  const [heroImage, setHeroImage] = useState(
    initialSettings?.hero_image || ""
  );
  const [heroCtaText, setHeroCtaText] = useState(
    initialSettings?.hero_cta_text || "استكشف العقارات"
  );
  const [heroCtaLink, setHeroCtaLink] = useState(
    initialSettings?.hero_cta_link || "#search-engine"
  );
  const [isSavingHero, setIsSavingHero] = useState(false);

  // State for CTA section content
  const ctaSection = sections.find((s) => s.section_key === "cta_banner");
  const ctaConfig = (ctaSection?.configuration as Record<string, any>) || {};
  const [ctaTitle, setCtaTitle] = useState(
    ctaSection?.title_ar || "هل ترغب ببيع أو تأجير عقارك في سوريا؟"
  );
  const [ctaDesc, setCtaDesc] = useState(
    ctaSection?.description_ar ||
      "نضع عقارك أمام آلاف المستثمرين والمشترين الجادين داخل وخارج سوريا مع تسويق احترافي عالي المستوى."
  );
  const [ctaBtnText, setCtaBtnText] = useState(
    ctaConfig?.button_text || "أضف عقارك الآن عبر واتساب دعبول"
  );
  const [ctaBtnLink, setCtaBtnLink] = useState(
    ctaConfig?.button_link || "https://wa.me/963900000000"
  );

  // State for Why DABOUL section content
  const whySection = sections.find((s) => s.section_key === "why_daboul");
  const [whyTitle, setWhyTitle] = useState(
    whySection?.title_ar || "لماذا تختار دعبول العقارية؟"
  );
  const [whySubtitle, setWhySubtitle] = useState(
    whySection?.description_ar || "ثقة ومصداقية تتوارثها الأجيال"
  );
  const [isSavingContent, setIsSavingContent] = useState(false);

  // Move section Up in order
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSections = [...sections];
    const temp = newSections[index - 1];
    newSections[index - 1] = newSections[index];
    newSections[index] = temp;
    // update sort_order locally
    newSections.forEach((s, idx) => {
      s.sort_order = idx + 1;
    });
    setSections(newSections);
  };

  // Move section Down in order
  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    const temp = newSections[index + 1];
    newSections[index + 1] = newSections[index];
    newSections[index] = temp;
    newSections.forEach((s, idx) => {
      s.sort_order = idx + 1;
    });
    setSections(newSections);
  };

  // Toggle section enabled
  const handleToggle = (sectionKey: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.section_key === sectionKey ? { ...s, is_enabled: !s.is_enabled } : s
      )
    );
  };

  // Save Sections Order & Visibility
  const handleSaveSections = async () => {
    setIsSavingSections(true);
    try {
      // 1. Reorder
      const orderedKeys = sections.map((s) => s.section_key);
      const reorderRes = await reorderSections(orderedKeys);
      if (!reorderRes.success) {
        showToast(`خطأ في حفظ الترتيب: ${reorderRes.error}`);
        setIsSavingSections(false);
        return;
      }

      // 2. Toggle enabled states
      for (const s of sections) {
        await toggleSectionEnabled(s.section_key, s.is_enabled);
      }

      showToast("تم حفظ ترتيب وحالة ظهور الأقسام بنجاح!");
    } catch {
      showToast("حدث خطأ أثناء حفظ الأقسام");
    } finally {
      setIsSavingSections(false);
    }
  };

  // Save Hero Settings
  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHero(true);
    try {
      const res = await updateHeroSettings({
        hero_title_ar: heroTitle,
        hero_description_ar: heroDescription,
        hero_image: heroImage,
        hero_cta_text: heroCtaText,
        hero_cta_link: heroCtaLink,
      });

      if (res.success) {
        showToast("تم حفظ إعدادات البانر الرئيسي بنجاح!");
      } else {
        showToast(`خطأ: ${res.error}`);
      }
    } catch {
      showToast("حدث خطأ أثناء حفظ إعدادات البانر");
    } finally {
      setIsSavingHero(false);
    }
  };

  // Save Content Sections (CTA & Why DABOUL)
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    try {
      const [resCta, resWhy] = await Promise.all([
        updateSectionDetails("cta_banner", {
          title_ar: ctaTitle,
          description_ar: ctaDesc,
          configuration: {
            ...ctaConfig,
            button_text: ctaBtnText,
            button_link: ctaBtnLink,
          },
        }),
        updateSectionDetails("why_daboul", {
          title_ar: whyTitle,
          description_ar: whySubtitle,
          configuration: { subtitle: whySubtitle },
        }),
      ]);

      if (resCta.success && resWhy.success) {
        showToast("تم تحديث نصوص الأقسام الترويجية بنجاح!");
      } else {
        showToast(`خطأ: ${resCta.error || resWhy.error}`);
      }
    } catch {
      showToast("حدث خطأ أثناء حفظ النصوص");
    } finally {
      setIsSavingContent(false);
    }
  };

  return (
    <div className="flex flex-col gap-space-md w-full" id="homepage-cms-editor">
      {/* CMS Header Banner */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">
              view_quilt
            </span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-title-md text-title-md text-on-surface font-bold">
              محرر الصفحة الرئيسية (Homepage CMS)
            </h2>
            <p className="font-body-sm text-body-sm text-outline">
              تحكم كامل في ترتيب الأقسام، حالة الظهور، ونصوص الواجهة العامة
            </p>
          </div>
        </div>
        <span className="px-space-sm py-1 rounded bg-secondary-container text-on-primary font-label-sm text-label-sm">
          مباشر ومحمي
        </span>
      </div>

      {/* 1. Sections Order & Visibility Management */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
          <div className="flex flex-col">
            <h3 className="font-title-sm text-title-sm text-on-surface font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-[20px]">
                reorder
              </span>
              ترتيب وحالة ظهور الأقسام على الموقع
            </h3>
            <span className="font-body-sm text-body-sm text-outline">
              استخدم الأسهم لتغيير ترتيب ظهور الأقسام، وبدّل زر التفعيل لإظهار أو إخفاء أي قسم
            </span>
          </div>
          <button
            type="button"
            onClick={handleSaveSections}
            disabled={isSavingSections}
            className="px-space-md h-10 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSavingSections ? "hourglass_empty" : "save"}
            </span>
            <span>{isSavingSections ? "جاري الحفظ..." : "حفظ الترتيب والحالة"}</span>
          </button>
        </div>

        {/* Sections List */}
        <div className="flex flex-col gap-space-xs">
          {sections.map((section, index) => {
            const meta = SECTION_DISPLAY_NAMES[section.section_key] || {
              label: section.title_ar || section.section_key,
              icon: "widgets",
            };

            return (
              <div
                key={section.section_key}
                className={`flex items-center justify-between p-space-sm rounded-lg border transition-colors ${
                  section.is_enabled
                    ? "bg-surface-container-low border-outline-variant/40"
                    : "bg-surface-container-lowest border-outline-variant/20 opacity-60"
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  {/* Order Badge */}
                  <span className="w-7 h-7 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm flex items-center justify-center font-bold">
                    {index + 1}
                  </span>

                  <span className="material-symbols-outlined text-secondary-container text-[20px]">
                    {meta.icon}
                  </span>

                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                      {meta.label}
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      {section.description_ar || "قسم رئيسي في الصفحة"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-sm">
                  {/* Reorder Up/Down Buttons */}
                  <div className="flex items-center bg-surface-container rounded-lg p-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      aria-label="تقديم القسم للأعلى"
                      className="p-1 hover:text-primary disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        arrow_upward
                      </span>
                    </button>
                    <button
                      type="button"
                      disabled={index === sections.length - 1}
                      onClick={() => handleMoveDown(index)}
                      aria-label="تأخير القسم للأسفل"
                      className="p-1 hover:text-primary disabled:opacity-30 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        arrow_downward
                      </span>
                    </button>
                  </div>

                  {/* Enable / Disable Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggle(section.section_key)}
                    className={`px-space-sm py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-1 transition-colors cursor-pointer ${
                      section.is_enabled
                        ? "bg-secondary-container text-on-primary"
                        : "bg-surface-container-high text-outline"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {section.is_enabled ? "visibility" : "visibility_off"}
                    </span>
                    <span>{section.is_enabled ? "مفعّل" : "معطّل"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Hero Section Settings */}
      <form
        onSubmit={handleSaveHero}
        className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-md"
      >
        <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
          <div className="flex flex-col">
            <h3 className="font-title-sm text-title-sm text-on-surface font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-[20px]">
                flag
              </span>
              محتوى واجهة البانر الرئيسية (Hero Section)
            </h3>
            <span className="font-body-sm text-body-sm text-outline">
              تعديل العنوان الرئيسي، الوصف، صورة الخلفية، ورابط الاستكشاف
            </span>
          </div>
          <button
            type="submit"
            disabled={isSavingHero}
            className="px-space-md h-10 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSavingHero ? "hourglass_empty" : "save"}
            </span>
            <span>{isSavingHero ? "جاري الحفظ..." : "حفظ إعدادات البانر"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {/* Hero Title */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-label-md text-on-surface-variant">
              العنوان الرئيسي للبانر (Hero Title)
            </label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full h-11 px-space-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          {/* Hero Description */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-label-md text-on-surface-variant">
              الوصف التوضيحي للبانر (Hero Description)
            </label>
            <textarea
              rows={2}
              required
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="w-full p-space-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          {/* Hero Image URL */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-label-md text-on-surface-variant">
              رابط صورة خلفية البانر (Image URL)
            </label>
            <input
              type="text"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="https://... (اتركه فارغاً لاستخدام الصورة الافتراضية)"
              className="w-full h-11 px-space-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          {/* Hero CTA Button Text */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface-variant">
              نص زر الاستكشاف (CTA Label)
            </label>
            <input
              type="text"
              value={heroCtaText}
              onChange={(e) => setHeroCtaText(e.target.value)}
              className="w-full h-11 px-space-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          {/* Hero CTA Link */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface-variant">
              وجهة زر الاستكشاف (CTA Link)
            </label>
            <input
              type="text"
              value={heroCtaLink}
              onChange={(e) => setHeroCtaLink(e.target.value)}
              className="w-full h-11 px-space-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </form>

      {/* 3. Promotional Content Sections (CTA Banner & Why DABOUL) */}
      <form
        onSubmit={handleSaveContent}
        className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col gap-space-md"
      >
        <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
          <div className="flex flex-col">
            <h3 className="font-title-sm text-title-sm text-on-surface font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container text-[20px]">
                campaign
              </span>
              نصوص الأقسام الترويجية (بانر الإضافة + لماذا دعبول)
            </h3>
            <span className="font-body-sm text-body-sm text-outline">
              تعديل العناوين ونصوص أزرار التواصل المباشر
            </span>
          </div>
          <button
            type="submit"
            disabled={isSavingContent}
            className="px-space-md h-10 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSavingContent ? "hourglass_empty" : "save"}
            </span>
            <span>{isSavingContent ? "جاري الحفظ..." : "حفظ نصوص الأقسام"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {/* CTA Banner Heading */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface-variant">
              عنوان بانر إضافة عقار (CTA Title)
            </label>
            <input
              type="text"
              value={ctaTitle}
              onChange={(e) => setCtaTitle(e.target.value)}
              className="w-full h-11 px-space-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          {/* CTA Button Label */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface-variant">
              نص زر الواتساب في البانر (Button Label)
            </label>
            <input
              type="text"
              value={ctaBtnText}
              onChange={(e) => setCtaBtnText(e.target.value)}
              className="w-full h-11 px-space-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          {/* CTA Description */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-label-md text-on-surface-variant">
              نص بانر إضافة عقار (CTA Text)
            </label>
            <textarea
              rows={2}
              value={ctaDesc}
              onChange={(e) => setCtaDesc(e.target.value)}
              className="w-full p-space-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          {/* Why DABOUL Heading */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface-variant">
              عنوان قسم لماذا دعبول؟ (Heading)
            </label>
            <input
              type="text"
              value={whyTitle}
              onChange={(e) => setWhyTitle(e.target.value)}
              className="w-full h-11 px-space-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            />
          </div>

          {/* Why DABOUL Subtitle */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-on-surface-variant">
              الشعار الفرعي لقسم لماذا دعبول؟ (Subtitle)
            </label>
            <input
              type="text"
              value={whySubtitle}
              onChange={(e) => setWhySubtitle(e.target.value)}
              className="w-full h-11 px-space-sm bg-surface-container-low border border-outline-variant/40 rounded-lg text-on-surface font-body-md text-body-md focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
