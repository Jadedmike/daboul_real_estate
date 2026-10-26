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
  why_daboul: { label: "لماذا تختار Axion Digital؟ (Why Axion Digital)", icon: "verified_user" },
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
    ctaConfig?.button_text || "أضف عقارك الآن عبر واتساب Axion Digital"
  );
  const [ctaBtnLink, setCtaBtnLink] = useState(
    ctaConfig?.button_link || "https://wa.me/963900000000"
  );

  // State for Why Axion Digital section content
  const whySection = sections.find((s) => s.section_key === "why_daboul");
  const [whyTitle, setWhyTitle] = useState(
    whySection?.title_ar || "لماذا تختار Axion Digital؟"
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

  // Save Content Sections (CTA & Why Axion Digital)
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
      <div className="bg-[#F8F6F0]/80 backdrop-blur-xl rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.08)] border border-[#A0BDDB]/35 flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-xl bg-[#A0BDDB]/25 text-[#34211B] flex items-center justify-center border border-[#A0BDDB]/40">
            <span className="material-symbols-outlined text-[24px]">
              view_quilt
            </span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-title-md text-title-md text-[#34211B] font-bold">
              محرر الصفحة الرئيسية (Homepage CMS)
            </h2>
            <p className="font-body-sm text-body-sm text-[#34211B]/60">
              تحكم كامل في ترتيب الأقسام، حالة الظهور، ونصوص الواجهة العامة
            </p>
          </div>
        </div>
        <span className="px-space-sm py-1 rounded-full bg-[#A0BDDB] text-[#34211B] font-label-sm text-label-sm font-bold border border-[#A0BDDB]/40">
          مباشر ومحمي
        </span>
      </div>

      {/* 1. Sections Order & Visibility Management */}
      <div className="bg-[#F8F6F0]/80 backdrop-blur-xl rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.08)] border border-[#A0BDDB]/35 flex flex-col gap-space-md">
        <div className="flex items-center justify-between pb-space-xs border-b border-[#A0BDDB]/30">
          <div className="flex flex-col">
            <h3 className="font-title-sm text-title-sm text-[#34211B] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#34211B] text-[20px]">
                reorder
              </span>
              ترتيب وحالة ظهور الأقسام على الموقع
            </h3>
            <span className="font-body-sm text-body-sm text-[#34211B]/60">
              استخدم الأسهم لتغيير ترتيب ظهور الأقسام، وبدّل زر التفعيل لإظهار أو إخفاء أي قسم
            </span>
          </div>
          <button
            type="button"
            onClick={handleSaveSections}
            disabled={isSavingSections}
            className="px-space-md h-10 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-xl font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50 border border-[#A0BDDB]/20"
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
                className={`flex items-center justify-between p-space-sm rounded-xl border transition-colors ${
                  section.is_enabled
                    ? "bg-[#EDE7DC]/55 border-[#A0BDDB]/30"
                    : "bg-[#EDE7DC]/20 border-[#A0BDDB]/20 opacity-60"
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  {/* Order Badge */}
                  <span className="w-7 h-7 rounded-full bg-[#F8F6F0] text-[#34211B] border border-[#A0BDDB]/30 font-label-sm text-label-sm flex items-center justify-center font-bold shadow-xs">
                    {index + 1}
                  </span>

                  <span className="material-symbols-outlined text-[#34211B] text-[20px]">
                    {meta.icon}
                  </span>

                  <div className="flex flex-col">
                    <span className="font-title-sm text-title-sm text-[#34211B] font-semibold">
                      {meta.label}
                    </span>
                    <span className="font-body-sm text-body-sm text-[#34211B]/60">
                      {section.description_ar || "قسم رئيسي في الصفحة"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-space-sm">
                  {/* Reorder Up/Down Buttons */}
                  <div className="flex items-center bg-[#F8F6F0]/80 border border-[#A0BDDB]/30 rounded-lg p-0.5 shadow-xs">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      aria-label="تقديم القسم للأعلى"
                      className="p-1 text-[#34211B]/80 hover:text-[#34211B] disabled:opacity-30 transition-colors cursor-pointer"
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
                      className="p-1 text-[#34211B]/80 hover:text-[#34211B] disabled:opacity-30 transition-colors cursor-pointer"
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
                        ? "bg-[#A0BDDB] text-[#34211B] font-bold border border-[#A0BDDB]/40"
                        : "bg-[#EDE7DC] text-[#34211B]/60 border border-[#A0BDDB]/30"
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
        className="bg-[#F8F6F0]/80 backdrop-blur-xl rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.08)] border border-[#A0BDDB]/35 flex flex-col gap-space-md"
      >
        <div className="flex items-center justify-between pb-space-xs border-b border-[#A0BDDB]/30">
          <div className="flex flex-col">
            <h3 className="font-title-sm text-title-sm text-[#34211B] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#34211B] text-[20px]">
                flag
              </span>
              محتوى واجهة البانر الرئيسية (Hero Section)
            </h3>
            <span className="font-body-sm text-body-sm text-[#34211B]/60">
              تعديل العنوان الرئيسي، الوصف، صورة الخلفية، ورابط الاستكشاف
            </span>
          </div>
          <button
            type="submit"
            disabled={isSavingHero}
            className="px-space-md h-10 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-xl font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50 border border-[#A0BDDB]/20"
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
            <label className="font-label-md text-label-md text-[#34211B] font-semibold">
              العنوان الرئيسي للبانر (Hero Title)
            </label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full h-11 px-space-sm bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 rounded-xl text-[#34211B] font-body-md text-body-md focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Hero Description */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-label-md text-[#34211B] font-semibold">
              الوصف التوضيحي للبانر (Hero Description)
            </label>
            <textarea
              rows={2}
              required
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="w-full p-space-sm bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 rounded-xl text-[#34211B] font-body-md text-body-md focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Hero Image URL */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-label-md text-[#34211B] font-semibold">
              رابط صورة خلفية البانر (Image URL)
            </label>
            <input
              type="text"
              value={heroImage}
              onChange={(e) => setHeroImage(e.target.value)}
              placeholder="https://... (اتركه فارغاً لاستخدام الصورة الافتراضية)"
              className="w-full h-11 px-space-sm bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 rounded-xl text-[#34211B] font-body-md text-body-md focus:outline-none transition-all shadow-inner placeholder:text-[#34211B]/40 text-left"
              dir="ltr"
            />
          </div>

          {/* Hero CTA Button Text */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-[#34211B] font-semibold">
              نص زر الاستكشاف (CTA Label)
            </label>
            <input
              type="text"
              value={heroCtaText}
              onChange={(e) => setHeroCtaText(e.target.value)}
              className="w-full h-11 px-space-sm bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 rounded-xl text-[#34211B] font-body-md text-body-md focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Hero CTA Link */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-[#34211B] font-semibold">
              وجهة زر الاستكشاف (CTA Link)
            </label>
            <input
              type="text"
              value={heroCtaLink}
              onChange={(e) => setHeroCtaLink(e.target.value)}
              className="w-full h-11 px-space-sm bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 rounded-xl text-[#34211B] font-body-md text-body-md focus:outline-none transition-all shadow-inner text-left"
              dir="ltr"
            />
          </div>
        </div>
      </form>

      {/* 3. Promotional Content Sections (CTA Banner & Why Axion Digital) */}
      <form
        onSubmit={handleSaveContent}
        className="bg-[#F8F6F0]/80 backdrop-blur-xl rounded-2xl p-space-md shadow-[0_8px_32px_0_rgba(52,33,27,0.08)] border border-[#A0BDDB]/35 flex flex-col gap-space-md"
      >
        <div className="flex items-center justify-between pb-space-xs border-b border-[#A0BDDB]/30">
          <div className="flex flex-col">
            <h3 className="font-title-sm text-title-sm text-[#34211B] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-[#34211B] text-[20px]">
                campaign
              </span>
              نصوص الأقسام الترويجية (بانر الإضافة + لماذا Axion Digital)
            </h3>
            <span className="font-body-sm text-body-sm text-[#34211B]/60">
              تعديل العناوين ونصوص أزرار التواصل المباشر
            </span>
          </div>
          <button
            type="submit"
            disabled={isSavingContent}
            className="px-space-md h-10 bg-[#34211B] hover:bg-[#4A332B] text-[#F8F6F0] rounded-xl font-label-md text-label-md flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50 border border-[#A0BDDB]/20"
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
            <label className="font-label-md text-label-md text-[#34211B] font-semibold">
              عنوان بانر إضافة عقار (CTA Title)
            </label>
            <input
              type="text"
              value={ctaTitle}
              onChange={(e) => setCtaTitle(e.target.value)}
              className="w-full h-11 px-space-sm bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 rounded-xl text-[#34211B] font-body-md text-body-md focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* CTA Button Label */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-[#34211B] font-semibold">
              نص زر الواتساب في البانر (Button Label)
            </label>
            <input
              type="text"
              value={ctaBtnText}
              onChange={(e) => setCtaBtnText(e.target.value)}
              className="w-full h-11 px-space-sm bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 rounded-xl text-[#34211B] font-body-md text-body-md focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* CTA Description */}
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="font-label-md text-label-md text-[#34211B] font-semibold">
              نص بانر إضافة عقار (CTA Text)
            </label>
            <textarea
              rows={2}
              value={ctaDesc}
              onChange={(e) => setCtaDesc(e.target.value)}
              className="w-full p-space-sm bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 rounded-xl text-[#34211B] font-body-md text-body-md focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Why Axion Digital Heading */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-[#34211B] font-semibold">
              عنوان قسم لماذا Axion Digital؟ (Heading)
            </label>
            <input
              type="text"
              value={whyTitle}
              onChange={(e) => setWhyTitle(e.target.value)}
              className="w-full h-11 px-space-sm bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 rounded-xl text-[#34211B] font-body-md text-body-md focus:outline-none transition-all shadow-inner"
            />
          </div>

          {/* Why Axion Digital Subtitle */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-[#34211B] font-semibold">
              الشعار الفرعي لقسم لماذا Axion Digital؟ (Subtitle)
            </label>
            <input
              type="text"
              value={whySubtitle}
              onChange={(e) => setWhySubtitle(e.target.value)}
              className="w-full h-11 px-space-sm bg-[#F8F6F0]/70 hover:bg-[#F8F6F0]/90 focus:bg-[#F8F6F0] border border-[#A0BDDB]/35 focus:border-[#A0BDDB] focus:ring-2 focus:ring-[#A0BDDB]/30 rounded-xl text-[#34211B] font-body-md text-body-md focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
