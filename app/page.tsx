import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { SearchFilters } from "@/components/search/SearchFilters";
import { PropertyCard } from "@/components/property/PropertyCard";
import { ToastProvider } from "@/components/ui/Toast";
import {
  getPublicLocations,
  getPublicFeaturedProperties,
  getPublicOfferProperties,
  getPublicLatestProperties,
} from "@/lib/actions/properties";
import { getHomepageConfig } from "@/lib/actions/cms";
import { getCompanySettings } from "@/lib/actions/settings";
import { formatTelUrl, formatWhatsAppUrl } from "@/lib/utils/format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "دعبول العقارية | البوابة العقارية الأولى في سوريا",
  description:
    "استكشف أرقى العقارات للبيع والإيجار في دمشق والمحافظات السورية. شقق فاخرة، فلل ومزارع، مكاتب ومقرات تجارية موثقة قانونياً.",
  openGraph: {
    title: "دعبول العقارية | البوابة العقارية الأولى في سوريا",
    description:
      "الرائد الأول للعقارات الفاخرة في دمشق وسوريا. شقق، فلل، وقصور للبيع والإيجار بأعلى معايير المصداقية المعمارية.",
    type: "website",
  },
};

export default async function HomePage() {
  // 1. Fetch CMS configuration, public data, and company settings in parallel
  const [
    cmsConfig,
    locations,
    featuredProperties,
    offerProperties,
    latestProperties,
    companySettings,
  ] = await Promise.all([
    getHomepageConfig(),
    getPublicLocations(),
    getPublicFeaturedProperties(6),
    getPublicOfferProperties(6),
    getPublicLatestProperties(6),
    getCompanySettings(),
  ]);

  const { sections, settings } = cmsConfig;

  // 2. Filter enabled sections and sort by configured order
  const enabledSections = [...sections]
    .filter((s) => s.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Section configs lookup
  const sectionMap = new Map(sections.map((s) => [s.section_key, s]));

  // Fallback defaults for Hero
  const heroTitle = settings?.hero_title_ar || "اكتشف عقارك القادم في سوريا";
  const heroDescription =
    settings?.hero_description_ar ||
    "مجموعة مميزة من العقارات للبيع والإيجار في مختلف المحافظات السورية بأعلى معايير المصداقية والاحترافية المعمارية.";
  const heroImage =
    settings?.hero_image ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBRp9VHpaEzBhXGu9i0azr_4wkfPjiMzoaQPN8F9wYrPwbf4MV51pqa9aXipNm0V5ObCsB4WGQoYMYEXrRQsprhZXp21TYOcuJI3esK6Vh8HVIavldJCNwilqbNw3Bqj6BUmLcXUHZ05lN0PptDAYnTk_rOd5-_rkNY_cZ6eyRg67knWkoNNMBK7q7xPRwR0ZjCxFsgSCWQNImR6y84Xr7haOamoQpc4OAHxj5zXj7Y9fOmiO-5h9Te";
  const heroCtaText = settings?.hero_cta_text || "استكشف العقارات";
  const heroCtaLink = settings?.hero_cta_link || "#search-engine";

  // Section 1: Hero Renderer
  const renderHero = () => (
    <div key="hero-group" className="flex flex-col w-full">
      <section className="relative w-full overflow-hidden bg-primary-container text-on-primary">
        <div className="relative w-full h-[460px] flex items-end">
          <div
            className="absolute inset-0 bg-cover bg-center"
            data-alt={heroTitle}
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-transparent" />
          <div className="relative z-10 w-full px-gutter-mobile pb-space-lg flex flex-col gap-space-sm">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-secondary-container/90 text-on-primary w-fit shadow-md">
              <span className="material-symbols-outlined text-[16px]">
                verified
              </span>
              <span className="font-label-sm text-label-sm">
                الرائد الأول للعقارات الفاخرة في سوريا
              </span>
            </div>
            <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-primary tracking-tight">
              {heroTitle}
            </h1>
            <p className="font-body-md text-body-md text-surface-container-high max-w-xl">
              {heroDescription}
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <a
                className="flex-1 h-12 bg-secondary-container hover:bg-secondary text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm shadow-md transition-all active:scale-[0.98]"
                href={heroCtaLink}
              >
                <span className="material-symbols-outlined text-[20px]">
                  travel_explore
                </span>
                <span>{heroCtaText}</span>
              </a>
              <a
                href={formatWhatsAppUrl(
                  companySettings.whatsapp,
                  "مرحباً دعبول العقارية، أرغب في إضافة عقاري للبيع أو الإيجار."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-space-md bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm backdrop-blur-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add_business
                </span>
                <span>أضف عقارك</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Search Box */}
      <SearchFilters
        initialGovernorates={locations.governorates}
        initialDistricts={locations.districts}
      />
    </div>
  );

  // Section 2: Special Offers Renderer
  const renderOffers = () => {
    // Critical Rule: If there are no public offers, hide section regardless of CMS state
    if (offerProperties.length === 0) return null;

    const section = sectionMap.get("special_offers");
    const title = section?.title_ar || "عروض حصرية مميزة";
    const desc = section?.description_ar || "فرص عقارية مختارة لفترة محدودة";

    return (
      <section
        key="special_offers"
        className="mt-space-xl px-gutter-mobile flex flex-col gap-space-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-1 text-secondary-container font-label-sm text-label-sm mb-1">
              <span className="material-symbols-outlined text-[14px]">
                local_fire_department
              </span>
              <span>{desc}</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {title}
            </h2>
          </div>
          <span className="px-space-sm py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
            CMS حي
          </span>
        </div>

        {/* Offer Cards */}
        <div className="flex flex-col gap-space-md">
          {offerProperties.map((prop) => {
            const coverImg =
              prop.property_images?.find((img) => img.is_cover) ||
              (prop.property_images && prop.property_images.length > 0
                ? prop.property_images[0]
                : null);
            const imageUrl =
              coverImg?.public_url ||
              "https://lh3.googleusercontent.com/aida-public/AB6AXuBMGmm4qtC2dvjUR_npq9bAEe4o2ZSCyikfREqeDiiNkQy5GRDP8liZnD8mJXrWqiNe8wouKW59UqCqQwCgg5pOduzZ8yPKxB8r01u3EwUa9vE6oZjkkLHrPv7Q3R7UHrQ44sihgHA02v8PqRCR30ooWw61YN9Ipc_E0jwk1GBmxuWMt4GejzDSIuKYP0q4FnoqdppyyLC3TmR1nUg_KIBqcO20ZZfb02UmkS7Azr0OAmRrml6hPNEH";
            const locationText = [
              prop.governorates?.name_ar,
              prop.districts?.name_ar || prop.address,
            ]
              .filter(Boolean)
              .join(" - ");

            return (
              <article
                key={prop.id}
                className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col group"
              >
                <Link
                  href={`/properties/${prop.id}`}
                  className="relative w-full h-52 overflow-hidden block cursor-pointer"
                >
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    data-alt={coverImg?.alt_text || prop.title_ar}
                    style={{ backgroundImage: `url('${imageUrl}')` }}
                  />
                  <div className="absolute top-3 right-3 bg-secondary-container text-on-primary px-space-sm py-1 rounded font-label-sm text-label-sm shadow-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      campaign
                    </span>
                    <span>عرض خاص للمشتري الجاد</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-md text-on-primary px-space-sm py-0.5 rounded font-label-sm text-label-sm">
                    {prop.transaction_type === "sale"
                      ? "للبيع نقداً أو بالتقسيط"
                      : "للإيجار"}
                  </div>
                </Link>
                <div className="p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">
                        pin_drop
                      </span>
                      {locationText}
                    </span>
                    <span className="font-title-sm text-title-sm text-secondary-container font-bold">
                      ${Number(prop.price).toLocaleString()}
                    </span>
                  </div>
                  <Link href={`/properties/${prop.id}`}>
                    <h3 className="font-title-md text-title-md text-on-surface font-bold hover:text-secondary-container transition-colors">
                      {prop.title_ar}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-label-md text-label-md">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        square_foot
                      </span>{" "}
                      {prop.area} م²
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        bed
                      </span>{" "}
                      {prop.bedrooms} غرف
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        bathtub
                      </span>{" "}
                      {prop.bathrooms} حمامات
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  };

  // Section 3: Featured Properties Renderer
  const renderFeatured = () => {
    const section = sectionMap.get("featured_properties");
    const title = section?.title_ar || "عقارات مميزة مختارة";
    const desc =
      section?.description_ar || "تم تدقيق ملكيتها وتوثيقها قانونياً من فريق دعبول";

    return (
      <section
        key="featured_properties"
        className="mt-space-xl px-gutter-mobile flex flex-col gap-space-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {title}
            </h2>
            <p className="font-body-sm text-body-sm text-outline">{desc}</p>
          </div>
          <Link
            className="text-secondary-container font-label-md text-label-md flex items-center gap-0.5 hover:underline"
            href="/properties"
          >
            <span>عرض الكل</span>
            <span className="material-symbols-outlined text-[16px] transform scale-x-[-1]">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="flex flex-col gap-space-md">
          {featuredProperties.length > 0 ? (
            featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))
          ) : (
            <div className="p-space-xl bg-surface-container-lowest rounded-xl text-center flex flex-col items-center gap-space-sm shadow-sm">
              <span className="material-symbols-outlined text-outline text-[40px]">
                apartment
              </span>
              <span className="font-title-sm text-title-sm text-on-surface">
                لا توجد عقارات مميزة معروضة حالياً
              </span>
              <Link
                href="/properties"
                className="mt-2 px-space-md py-1.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md"
              >
                تصفح كافة العقارات
              </Link>
            </div>
          )}
        </div>
      </section>
    );
  };

  // Section 4: Locations Renderer
  const renderLocations = () => {
    const section = sectionMap.get("locations");
    const title = section?.title_ar || "استكشف العقارات حسب المحافظة";
    const desc =
      section?.description_ar ||
      "تغطية شاملة لأهم المدن والمراكز الاستثمارية السورية";

    return (
      <section
        key="locations"
        className="mt-space-xl px-gutter-mobile flex flex-col gap-space-md"
        id="regions"
      >
        <div className="flex flex-col">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            {title}
          </h2>
          <p className="font-body-sm text-body-sm text-outline">{desc}</p>
        </div>
        <div className="grid grid-cols-2 gap-space-sm">
          {/* Damascus */}
          <Link
            className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
            href={`/properties?gov=${locations.governorates.find((g) => g.name_ar === "دمشق")?.id || "damascus"}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              data-alt="Iconic view of Damascus city center."
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFQYG4BTZluS4TaZqyfRyrGm0Ezw1iApdzRKuek-yN8rQy8XOvRf6BWEYC9RJoIhbv9RkkUnOYz7DYFDfROwfql_xW9tIb8oBf1QOx0FoZj3Z-vTa3pcCcfe1qL2qUAJolRwJl1ERQxd1saUkg8ml1MUSZPA7mee4kK_3qapAcmWPl_RQsU-W-AtUCdunEFRrLfuTfAKr45PA3t73cABbORCtEVEFJbKnDOtRLOQRZH68BYntxIgTk')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
            <div className="relative z-10 flex flex-col text-on-primary">
              <span className="font-title-sm text-title-sm font-bold">دمشق</span>
              <span className="font-label-sm text-label-sm text-surface-container-high">
                العاصمة والمراكز الراقية
              </span>
            </div>
          </Link>

          {/* Rif Damascus */}
          <Link
            className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
            href={`/properties?gov=${locations.governorates.find((g) => g.name_ar === "ريف دمشق")?.id || "rif-damascus"}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              data-alt="Scenic landscape of Damascus countryside."
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAm1OZt1K0arjDT6UzsXxH8j0B7f8jy0_kHgjVOw8VVC2ZWmOYzYpqChiGcqW4apXa0xY_vHe-emyfsU9sVz_AwCGA7s9_cN8cymoy_72wEqFdsB5buhcg4GGn7lWaiG3khXpIH0zNL7zFykfDNAhXw2YPZC2_5Gq-rrxrBWQW7UMSsioX1cCGNJtb6asH8ejhrWciaN8YHorL0MCZ0XP9dOcSyDFOaO4DHEYpaEuIGeOQMkf3GE9kq')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
            <div className="relative z-10 flex flex-col text-on-primary">
              <span className="font-title-sm text-title-sm font-bold">
                ريف دمشق
              </span>
              <span className="font-label-sm text-label-sm text-surface-container-high">
                فلل ومزارع يعفور وقرى الأسد
              </span>
            </div>
          </Link>

          {/* Aleppo */}
          <Link
            className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
            href={`/properties?gov=${locations.governorates.find((g) => g.name_ar === "حلب")?.id || "aleppo"}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              data-alt="Panoramic cityscape of Aleppo."
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJ0DpF7Rz4wUNMIeOlIx3v6A3NPu6E6kKPkoKv0ynDqv-_Wx_nEdvILDffGbQiJRkUmNobeM6dYWME4PIkGR6vZkjpx3FbH1wN-SUKpdfSVe_4q38rsrCJtro5UJ3MYeTcwwYY3xipu4ZivJmh7DOTcq1uSMOZAhO23hwEn2M9QqFX-teIrAk7C1-mSk1yHs8P1RTpCZVgmrz_wYf0DnMoBnngVEK2NhDOUM3crUuH0tU24ay0Gu5O')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
            <div className="relative z-10 flex flex-col text-on-primary">
              <span className="font-title-sm text-title-sm font-bold">حلب</span>
              <span className="font-label-sm text-label-sm text-surface-container-high">
                الشهباء وحلب الجديدة
              </span>
            </div>
          </Link>

          {/* Latakia */}
          <Link
            className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
            href={`/properties?gov=${locations.governorates.find((g) => g.name_ar === "اللاذقية")?.id || "latakia"}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              data-alt="Picturesque Mediterranean coastal view of Latakia."
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAj4IXggFGoGw_tB46ZyFEZccI8zUWxj1WrSQrgbUJR0_qaseQGnBnKnASlR-_tpU2KR3HV-RN2nwAm6KgmTlM0EnwJRz4JnTElnmzy-6FAbR2IGrDtqhH_aOAS4j8CVXv04XvrvGwOeJfAkoKI-LYk_s9aqK4jHOirCbdcID_TVFebXFn6MVLNYIWyGSEEfdbHh0t18nCCvu0r6V0uXdJCZU9JCq-a3EAonPPGzV_gzbxA205Cjo6h')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
            <div className="relative z-10 flex flex-col text-on-primary">
              <span className="font-title-sm text-title-sm font-bold">
                اللاذقية
              </span>
              <span className="font-label-sm text-label-sm text-surface-container-high">
                الكورنيش والشواطئ الزرقاء
              </span>
            </div>
          </Link>

          {/* Tartus */}
          <Link
            className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
            href={`/properties?gov=${locations.governorates.find((g) => g.name_ar === "طرطوس")?.id || "tartus"}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              data-alt="Tartus coastal boulevard."
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAI24vv5UxO0dmajMRHJy52xvuOdTjwwOoKkkfTUVuzTv1VhrQAxNLKEnvc9zMBYJeu6ml9jIApYCbmkoaThebUcTJbRcF_E2MAKr93FwSu6N-gs8nvbB-pc6k1ZnXJNEKuO1VRDrC5zjkn6AgglRbg40luQ6xoqx8tlR56p5NpIatephMDpDQueQFvMNqMz-UKMlMgfps_hVsIAheeXcs5d175zHIcqWBrI3EP7_UiER8nFCCgnCdj')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
            <div className="relative z-10 flex flex-col text-on-primary">
              <span className="font-title-sm text-title-sm font-bold">طرطوس</span>
              <span className="font-label-sm text-label-sm text-surface-container-high">
                إطلالات بحرية وعقارات ساحلية
              </span>
            </div>
          </Link>

          {/* Homs */}
          <Link
            className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
            href={`/properties?gov=${locations.governorates.find((g) => g.name_ar === "حمص")?.id || "homs"}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              data-alt="Modern residential districts in Homs city."
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqL69wBkVsmcoCjbSvhxgKAUMe9Kp1KE4bBtGCxrLUnTqVqwwpY_ULm_M1fp0B_XLOujLKybQ2PGScEAzGuSIN3OkcY_BDrYODd2NNOUEhfmGylKdzNbX7f5MILo-cpduLzoosfbfdIxQKrKpU1LIuLNFLmfGPsWdKHb5xOW2SSBNw7VSg0rGXrHqLezGnN_o83oh1miwa6nFqnKe0PayDMiapcS0ku7pnH5fwvt2e1u3sffJjuP2T')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
            <div className="relative z-10 flex flex-col text-on-primary">
              <span className="font-title-sm text-title-sm font-bold">حمص</span>
              <span className="font-label-sm text-label-sm text-surface-container-high">
                قلب سوريا ومواقع حيوية
              </span>
            </div>
          </Link>
        </div>
      </section>
    );
  };

  // Section 5: Property Types Renderer
  const renderPropertyTypes = () => {
    const section = sectionMap.get("property_types");
    const title = section?.title_ar || "تصفح حسب نوع العقار";
    const desc =
      section?.description_ar ||
      "خيارات متنوعة تلبي تطلعات السكن والاستثمار التجاري";

    return (
      <section
        key="property_types"
        className="mt-space-xl px-gutter-mobile flex flex-col gap-space-md"
      >
        <div className="flex flex-col">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">
            {title}
          </h2>
          <p className="font-body-sm text-body-sm text-outline">{desc}</p>
        </div>
        <div className="flex gap-space-sm overflow-x-auto pb-2 -mx-gutter-mobile px-gutter-mobile no-scrollbar">
          {[
            { title: "شقق سكنية", icon: "apartment", type: "apartment" },
            { title: "فلل وقصور", icon: "villa", type: "villa" },
            { title: "مكاتب إدارية", icon: "corporate_fare", type: "office" },
            { title: "محلات تجارية", icon: "storefront", type: "shop" },
            { title: "أراضٍ ومزارع", icon: "landscape", type: "land" },
          ].map((pt) => (
            <Link
              key={pt.title}
              href={`/properties?type=${pt.type}`}
              className="flex flex-col items-center justify-center min-w-[100px] h-28 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-shadow gap-2 text-center p-2"
            >
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-secondary-container">
                <span className="material-symbols-outlined text-[26px]">
                  {pt.icon}
                </span>
              </div>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                {pt.title}
              </span>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  // Section 6: Why DABOUL Renderer
  const renderWhyDaboul = () => {
    const section = sectionMap.get("why_daboul");
    const title = section?.title_ar || "لماذا تختار دعبول العقارية؟";
    const subtitle = section?.description_ar || "ثقة ومصداقية تتوارثها الأجيال";

    return (
      <section
        key="why_daboul"
        className="mt-space-xl px-gutter-mobile flex flex-col gap-space-md"
        id="about-us"
      >
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
          <div className="flex flex-col gap-1 text-center">
            <span className="font-label-sm text-label-sm text-secondary-container font-semibold">
              {subtitle}
            </span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              {title}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-space-md">
            <div className="flex items-start gap-space-sm">
              <div className="w-11 h-11 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[24px]">
                  verified_user
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                  خبرة وتوثيق قانوني 100%
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  دراسة دقيقة لسجلات الطابو والوكالات والتنظيم العقاري لحماية استثمارك بالكامل.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-space-sm">
              <div className="w-11 h-11 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[24px]">
                  real_estate_agent
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                  خيارات عقارية حصرية
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  عقارات نوعية لا تُعرض في السوق المفتوح، محفوظة لعملاء دعبول VIP حصرياً.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-space-sm">
              <div className="w-11 h-11 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[24px]">
                  touch_app
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                  تجربة بحث رقمية سهلة
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  نظام بحث هرمي دقيق ومواكب لأحدث تقنيات تصفح العقار بجولات واقعية.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-space-sm">
              <div className="w-11 h-11 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[24px]">
                  support_agent
                </span>
              </div>
              <div className="flex flex-col">
                <h3 className="font-title-sm text-title-sm text-on-surface font-bold">
                  تواصل مباشر وسريع
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  فريق استشاري متاح على مدار الساعة عبر الواتساب والمكالمات في دمشق وحلب والساحل.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Section 7: Latest Properties Renderer
  const renderLatestProperties = () => {
    const section = sectionMap.get("latest_properties");
    const title = section?.title_ar || "أحدث العقارات المضافة";
    const desc =
      section?.description_ar || "أحدث العروض المسجلة في السجل اليومي";

    return (
      <section
        key="latest_properties"
        className="mt-space-xl px-gutter-mobile flex flex-col gap-space-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {title}
            </h2>
            <p className="font-body-sm text-body-sm text-outline">{desc}</p>
          </div>
          <Link
            className="text-secondary-container font-label-md text-label-md flex items-center gap-0.5 hover:underline"
            href="/properties"
          >
            <span>عرض الكل</span>
            <span className="material-symbols-outlined text-[16px] transform scale-x-[-1]">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="flex flex-col gap-space-md">
          {latestProperties.length > 0 ? (
            latestProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))
          ) : (
            <div className="p-space-xl bg-surface-container-lowest rounded-xl text-center flex flex-col items-center gap-space-sm shadow-sm">
              <span className="material-symbols-outlined text-outline text-[40px]">
                domain
              </span>
              <span className="font-title-sm text-title-sm text-on-surface">
                لا توجد عقارات مضافة حديثاً حالياً
              </span>
            </div>
          )}
        </div>
      </section>
    );
  };

  // Section 8: CTA Banner Renderer
  const renderCtaBanner = () => {
    const section = sectionMap.get("cta_banner");
    const config = (section?.configuration as Record<string, any>) || {};
    const title =
      section?.title_ar || "هل ترغب ببيع أو تأجير عقارك في سوريا؟";
    const desc =
      section?.description_ar ||
      "نضع عقارك أمام آلاف المستثمرين والمشترين الجادين داخل وخارج سوريا مع تسويق احترافي عالي المستوى.";
    const btnText = config.button_text || "أضف عقارك الآن عبر واتساب دعبول";
    const btnLink =
      config.button_link ||
      formatWhatsAppUrl(
        companySettings.whatsapp,
        "مرحباً دعبول العقارية، أرغب في إضافة عقار جديد للتسويق."
      );

    return (
      <section key="cta_banner" className="mt-space-xl px-gutter-mobile">
        <div className="bg-primary text-on-primary rounded-xl p-space-lg flex flex-col gap-space-sm relative overflow-hidden shadow-lg">
          <div className="absolute -left-12 -top-12 w-44 h-44 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />
          <span className="material-symbols-outlined text-secondary-container text-[36px]">
            real_estate_agent
          </span>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-primary">
            {title}
          </h2>
          <p className="font-body-sm text-body-sm text-surface-container-high">
            {desc}
          </p>
          <div className="flex flex-col gap-space-xs pt-space-xs">
            <a
              className="h-11 bg-secondary-container hover:bg-secondary text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm shadow-md transition-transform active:scale-[0.98] cursor-pointer"
              href={btnLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-[18px]">
                add_circle
              </span>
              <span>{btnText}</span>
            </a>
            <a
              className="h-11 bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm backdrop-blur-md transition-colors"
              href={formatTelUrl(companySettings.phone)}
            >
              <span className="material-symbols-outlined text-[18px]">
                phone
              </span>
              <span>اتصال مباشر مع الإدارة</span>
            </a>
          </div>
        </div>
      </section>
    );
  };

  // Map of section renderers
  const sectionRenderers: Record<string, () => React.ReactNode> = {
    hero: renderHero,
    special_offers: renderOffers,
    featured_properties: renderFeatured,
    locations: renderLocations,
    property_types: renderPropertyTypes,
    why_daboul: renderWhyDaboul,
    latest_properties: renderLatestProperties,
    cta_banner: renderCtaBanner,
  };

  return (
    <ToastProvider>
      <Header />

      <main className="flex flex-col relative w-full pt-16 pb-20 bg-surface">
        <div className="flex flex-col w-full">
          {/* Render all enabled CMS sections in configured order */}
          {enabledSections.map((section) => {
            const renderer = sectionRenderers[section.section_key];
            if (!renderer) return null;
            return renderer();
          })}

          {/* Syrian Real Estate Footer (Always persistent) */}
          <footer className="mt-space-xl bg-surface-container-low px-gutter-mobile py-space-lg flex flex-col gap-space-lg text-on-surface">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded bg-secondary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    domain
                  </span>
                </div>
                <span className="font-title-md text-title-md font-bold text-primary">
                  {companySettings.company_name_ar}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-outline">
                {companySettings.short_description}
              </p>
            </div>

            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-[18px]">
                  location_on
                </span>
                <span>{companySettings.address}</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-[18px]">
                  phone
                </span>
                <a
                  href={formatTelUrl(companySettings.phone)}
                  className="hover:underline font-mono"
                  dir="ltr"
                >
                  {companySettings.phone}
                </a>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-[18px]">
                  mail
                </span>
                <a
                  href={`mailto:${companySettings.email}`}
                  className="hover:underline"
                >
                  {companySettings.email}
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-space-xs font-label-md text-label-md text-outline">
              <Link className="hover:text-primary transition-colors" href="/properties?gov=damascus">
                عقارات دمشق الفاخرة
              </Link>
              <Link className="hover:text-primary transition-colors" href="/properties?gov=aleppo">
                شقق للبيع في حلب
              </Link>
              <Link className="hover:text-primary transition-colors" href="/about">
                من نحن
              </Link>
              <Link className="hover:text-primary transition-colors" href="/contact">
                تواصل معنا
              </Link>
              <Link className="hover:text-primary transition-colors" href="/properties">
                الاستشارات والتوثيق القانوني
              </Link>
              <Link className="hover:text-primary transition-colors" href="/admin">
                بوابة الإدارة
              </Link>
            </div>

            <div className="pt-space-sm flex flex-col items-center justify-center gap-1 text-center font-label-sm text-label-sm text-outline">
              <span>جميع الحقوق محفوظة © 2026 {companySettings.company_name_ar} {companySettings.company_name_en}</span>
              <span className="text-on-surface-variant">الجمهورية العربية السورية</span>
            </div>
          </footer>
        </div>
      </main>

      <BottomNav />
    </ToastProvider>
  );
}
