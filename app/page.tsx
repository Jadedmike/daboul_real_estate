"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { SearchFilters } from "@/components/search/SearchFilters";
import { GOVERNORATES, PROPERTIES } from "@/lib/data";
import { ToastProvider, useToast } from "@/components/ui/Toast";

function HomePageContent() {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    "offer-1": false,
    "offer-2": true,
    "offer-3": false,
    "card-1": false,
    "card-2": true,
    "card-3": false,
    "card-4": false,
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = !prev[id];
      showToast(next ? "تمت إضافة العقار للمفضلة" : "تمت إزالة العقار من المفضلة");
      return { ...prev, [id]: next };
    });
  };

  return (
    <>
      <Header />

      <main className="flex flex-col relative w-full pt-16 pb-20 bg-surface">
        <div className="flex flex-col w-full">
          {/* Hero Section */}
          <section className="relative w-full overflow-hidden bg-primary-container text-on-primary">
            <div className="relative w-full h-[460px] flex items-end">
              <div
                className="absolute inset-0 bg-cover bg-center"
                data-alt="Ultra-luxurious modern penthouse apartment terrace overlooking Damascus city skyline at golden dusk. Floor-to-ceiling glass facades, sleek travertine marble floor, minimalist ambient architectural lighting, warm ember reflections, elegant interior furnishing in muted charcoal and cream tones, serene and prestigious Levantine atmosphere."
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBRp9VHpaEzBhXGu9i0azr_4wkfPjiMzoaQPN8F9wYrPwbf4MV51pqa9aXipNm0V5ObCsB4WGQoYMYEXrRQsprhZXp21TYOcuJI3esK6Vh8HVIavldJCNwilqbNw3Bqj6BUmLcXUHZ05lN0PptDAYnTk_rOd5-_rkNY_cZ6eyRg67knWkoNNMBK7q7xPRwR0ZjCxFsgSCWQNImR6y84Xr7haOamoQpc4OAHxj5zXj7Y9fOmiO-5h9Te')",
                }}
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
                  اكتشف عقارك القادم في سوريا
                </h1>
                <p className="font-body-md text-body-md text-surface-container-high max-w-xl">
                  مجموعة مميزة من العقارات للبيع والإيجار في مختلف المحافظات السورية بأعلى معايير المصداقية والاحترافية المعمارية.
                </p>
                <div className="flex items-center gap-space-sm pt-space-xs">
                  <a
                    className="flex-1 h-12 bg-secondary-container hover:bg-secondary text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm shadow-md transition-all active:scale-[0.98]"
                    href="#search-engine"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      travel_explore
                    </span>
                    <span>استكشف العقارات</span>
                  </a>
                  <button
                    onClick={() => showToast("يرجى التواصل مع الإدارة لإضافة عقار جديد")}
                    className="h-12 px-space-md bg-surface-container-lowest/15 hover:bg-surface-container-lowest/25 text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm backdrop-blur-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      add_business
                    </span>
                    <span>أضف عقارك</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Search Box Section */}
          <SearchFilters />

          {/* Special Offers CMS Section (Limited Time) */}
          <section className="mt-space-xl px-gutter-mobile flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="inline-flex items-center gap-1 text-secondary-container font-label-sm text-label-sm mb-1">
                  <span className="material-symbols-outlined text-[14px]">
                    local_fire_department
                  </span>
                  <span>فرص عقارية مختارة لفترة محدودة</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  عروض حصرية مميزة
                </h2>
              </div>
              <span className="px-space-sm py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm">
                CMS حي
              </span>
            </div>

            {/* 3 Exclusive Offer Cards */}
            <div className="flex flex-col gap-space-md">
              {/* Offer 1 */}
              <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col group">
                <div className="relative w-full h-52 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    data-alt="Grand living hall of a high-end duplex in Abu Roumaneh Damascus."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMGmm4qtC2dvjUR_npq9bAEe4o2ZSCyikfREqeDiiNkQy5GRDP8liZnD8mJXrWqiNe8wouKW59UqCqQwCgg5pOduzZ8yPKxB8r01u3EwUa9vE6oZjkkLHrPv7Q3R7UHrQ44sihgHA02v8PqRCR30ooWw61YN9Ipc_E0jwk1GBmxuWMt4GejzDSIuKYP0q4FnoqdppyyLC3TmR1nUg_KIBqcO20ZZfb02UmkS7Azr0OAmRrml6hPNEH')",
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-secondary-container text-on-primary px-space-sm py-1 rounded font-label-sm text-label-sm shadow-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      campaign
                    </span>
                    <span>خصم خاص 12% للمشتري الجاد</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-md text-on-primary px-space-sm py-0.5 rounded font-label-sm text-label-sm">
                    للبيع نقداً أو بالتقسيط
                  </div>
                </div>
                <div className="p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">
                        pin_drop
                      </span>
                      دمشق - أبو رمانة الراقي
                    </span>
                    <span className="font-title-sm text-title-sm text-secondary-container font-bold">
                      $385,000
                    </span>
                  </div>
                  <Link href="/properties/malki-penthouse-1">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold hover:text-secondary-container transition-colors">
                      دوبلكس فاخر بإطلالة بانورامية وحديقة معلقة
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-label-md text-label-md">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        square_foot
                      </span>{" "}
                      380 م²
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        bed
                      </span>{" "}
                      4 نوم ماستر
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        bathtub
                      </span>{" "}
                      4 حمامات
                    </span>
                  </div>
                </div>
              </article>

              {/* Offer 2 */}
              <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col group">
                <div className="relative w-full h-52 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    data-alt="Luxury private villa in Yaafour Damascus countryside with private swimming pool."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3QHUEJ2MJ55ZB68msw2dCARFVbP2xJyuSv3pg5kR_Nxah3aAJPZO9fXuD4si-JiWDgzJ_2aCiUsf8X0phX_DQyO8l35rTIwkGtmp-FPnGg-CY_knv8d6FrzI9CL-TFsixI-QOtTXxHtsyBIrVZ78CdBZ2MtjgnryLbZU93QTI-Va3jtDqj-OMEbnYiujtJ3HDMLA5gaf3anmsJR5L068Z0oHilUSgbPgrGI7Xg5HxX4doCpMbhVas')",
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-primary text-on-primary px-space-sm py-1 rounded font-label-sm text-label-sm shadow-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      star
                    </span>
                    <span>عرض حصري دعبول VIP</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-md text-on-primary px-space-sm py-0.5 rounded font-label-sm text-label-sm">
                    طاقة شمسية كاملة + بئر ماء
                  </div>
                </div>
                <div className="p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">
                        pin_drop
                      </span>
                      ريف دمشق - يعفور (مجمع القصور)
                    </span>
                    <span className="font-title-sm text-title-sm text-secondary-container font-bold">
                      $720,000
                    </span>
                  </div>
                  <Link href="/properties/yaafour-luxury-palace">
                    <h3 className="font-title-md text-title-md text-on-surface font-bold hover:text-secondary-container transition-colors">
                      فيلا ملكية مستقلة بمسبح خاص وحديقة 1200م²
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-label-md text-label-md">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        square_foot
                      </span>{" "}
                      650 م² بناء
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        bed
                      </span>{" "}
                      5 أجنحة
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        directions_car
                      </span>{" "}
                      كراج 4 سيارات
                    </span>
                  </div>
                </div>
              </article>

              {/* Offer 3 */}
              <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col group">
                <div className="relative w-full h-52 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    data-alt="Modern seaside residential apartment interior in Latakia Corniche."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDYqD0d9Pm2YBOgt4vT64mYJD_OsZlgwYv3tTrdZIuJn7meNKcu7Kkt3lOI5aL-OhBZIfuvUf2Qaz7oRjK5yGeGEygWOdMjq8M6_Z3FkFl859laTEhaTDMjLDSXgSJ5juuHN9Ev_XgQpBIZL-GCxEhUEcJSxVqfzBmGci0tHcjtBd7Roi2oxHlX6MpYvc5ljG7g7JjgSmuAehV7PyIZDMbsm40JgyiWk0z0xk423_Bsoi-dn2YVX_kZ')",
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-secondary-container text-on-primary px-space-sm py-1 rounded font-label-sm text-label-sm shadow-md flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      savings
                    </span>
                    <span>دفعة أولى 40% والباقي ميسّر</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-md text-on-primary px-space-sm py-0.5 rounded font-label-sm text-label-sm">
                    إطلالة بحرية أولى
                  </div>
                </div>
                <div className="p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-outline flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">
                        pin_drop
                      </span>
                      اللاذقية - الكورنيش الغربي
                    </span>
                    <span className="font-title-sm text-title-sm text-secondary-container font-bold">
                      $165,000
                    </span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">
                    شقة بحرية بانورامية تشطيب سوبر ديلوكس
                  </h3>
                  <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-label-md text-label-md">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        square_foot
                      </span>{" "}
                      210 م²
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        bed
                      </span>{" "}
                      3 غرف
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        balcony
                      </span>{" "}
                      شرفة بحرية
                    </span>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Featured Properties Section */}
          <section className="mt-space-xl px-gutter-mobile flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">
                  عقارات مميزة مختارة
                </h2>
                <p className="font-body-sm text-body-sm text-outline">
                  تم تدقيق ملكيتها وتوثيقها قانونياً من فريق دعبول
                </p>
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
              {/* Card 1: Malki Damascus */}
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="relative w-full h-52">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    data-alt="Elegantly renovated historic residential salon in Al-Malki Damascus."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB7aAx2vp5ePFd3Hlsml2oaqk3vubiw8VIo3LkImNS9JIQVERgN2SeVP46enNTLaZc9hOOSPHeaFdc4ntQA3XcjPj22WLYnrFDNmN8L4IafPfSf-zBXCyxPqT7KhxYSYhpQIA0z-9wjpOU0X_Oczi8WUa1QYesf7yt_qpCv1lo2DbyAxHScQ2NVFd-WjfY6EpuXeI1rWmzC44xQ-49uA3xk5oztTAcUdeS9Hr8Ra5QFQsKPeu4UDkij')",
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-primary text-on-primary px-space-sm py-1 rounded font-label-sm text-label-sm">
                    للبيع
                  </div>
                  <button
                    aria-label="أضف للمفضلة"
                    onClick={(e) => toggleFavorite("card-1", e)}
                    className="fav-toggle-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary-container transition-colors cursor-pointer"
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        favorites["card-1"] ? "text-secondary-container" : ""
                      }`}
                      style={{
                        fontVariationSettings: favorites["card-1"]
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      favorite
                    </span>
                  </button>
                </div>
                <div className="p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-container font-title-sm text-title-sm font-bold">
                      $420,000
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      دمشق - المالكي الراقي
                    </span>
                  </div>
                  <Link href="/properties/malki-penthouse-1">
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold hover:text-secondary-container transition-colors">
                      شقة فاخرة ومجددة بالكامل مطلة على حديقة الجاحظ
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-label-md text-label-md">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        square_foot
                      </span>{" "}
                      290 م²
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        bed
                      </span>{" "}
                      4 غرف نوم
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        bathtub
                      </span>{" "}
                      3 حمامات
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Yaafour Villa */}
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="relative w-full h-52">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    data-alt="Architectural modern villa in Yaafour Damascus."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSI3O29LTq-tiWQZdD49shw8mks_nF9w5wExU-FRZY96RyopVzz_D3RUi26zfDWSfzEdJqHsI7_Kvn22eA9hTansinpsUOF39YtmrNoIOjyMUVQOMKia2waupeKaUibSTKbetLPSXL0crQvAEEfmeLG6e2GLOzg4uhEUjT0RX6OaAlFdrllMu7mpZTmb1cjjuvNG6a-gTZwyQgD8PSQik4JdzkB5MzB6ek03cwobhASuBtbPpI46lq')",
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-secondary-container text-on-primary px-space-sm py-1 rounded font-label-sm text-label-sm">
                    للإيجار السنوي
                  </div>
                  <button
                    aria-label="أضف للمفضلة"
                    onClick={(e) => toggleFavorite("card-2", e)}
                    className="fav-toggle-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary-container transition-colors cursor-pointer"
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        favorites["card-2"] ? "text-secondary-container" : ""
                      }`}
                      style={{
                        fontVariationSettings: favorites["card-2"]
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      favorite
                    </span>
                  </button>
                </div>
                <div className="p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-container font-title-sm text-title-sm font-bold">
                      $3,500 / شهر
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      ريف دمشق - يعفور
                    </span>
                  </div>
                  <Link href="/properties/yaafour-luxury-palace">
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold hover:text-secondary-container transition-colors">
                      فيلا مستقلة مؤثثة بالكامل بأحدث التجهيزات الذكية
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-label-md text-label-md">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        square_foot
                      </span>{" "}
                      500 م²
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        bed
                      </span>{" "}
                      5 غرف
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        pool
                      </span>{" "}
                      مسبح خاص
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: New Aleppo */}
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="relative w-full h-52">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    data-alt="Interior of a luxury spacious apartment in New Aleppo district."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrAhAqE0xwp1_Hw_635iw3oGNgZNR8utcylBq4NhSCRSJrrSbJ2QSZa4SpY2waeQcpQfO6yBEz0fdljvNtz1_zQz1I8ODDdMm_L_yCoJmhnWsJKPqdHT3RSOBF8JWOR53RB08d9i1oOGMsdB1kLKywPLmnSS9EkUzA6wcradzH2WIufc3HdkgQqIazrHN6d8EhhO6Sw5ifd_a0MJWxoJd2gO1KDYDE2OhhedZL_6Jh4TfIMc-Pub4b')",
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-primary text-on-primary px-space-sm py-1 rounded font-label-sm text-label-sm">
                    للبيع
                  </div>
                  <button
                    aria-label="أضف للمفضلة"
                    onClick={(e) => toggleFavorite("card-3", e)}
                    className="fav-toggle-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary-container transition-colors cursor-pointer"
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        favorites["card-3"] ? "text-secondary-container" : ""
                      }`}
                      style={{
                        fontVariationSettings: favorites["card-3"]
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      favorite
                    </span>
                  </button>
                </div>
                <div className="p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-container font-title-sm text-title-sm font-bold">
                      $185,000
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      حلب - حلب الجديدة
                    </span>
                  </div>
                  <Link href="/properties/new-aleppo-commercial">
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold hover:text-secondary-container transition-colors">
                      شقة عصرية بطراز حديث في أرقى أحياء حلب الشهباء
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-label-md text-label-md">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        square_foot
                      </span>{" "}
                      240 م²
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        bed
                      </span>{" "}
                      3 غرف ماستر
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        elevator
                      </span>{" "}
                      مصعد ومولد
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 4: Jaramana Family Home */}
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="relative w-full h-52">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    data-alt="Bright, warm family living room in an upscale building in Jaramana Damascus suburb."
                    style={{
                      backgroundImage:
                        "url('https://lh3.googleusercontent.com/aida-public/AB6AXuACMC7FzvaX69vs00sQCMuofplXFX8o3ygTsCefgOo6TbVdIkcjuk07w-JH10INg3qMthyRyF6IN1iDOcQNqDr5-h2WUmNUqFlfpwxL7wAm8l7XGEiT4BT_DrHDK31WSSzwa_HAarasIBMo0c4p9LqHazU5M_bJ81ydy1XNnmiR9jIhse2_aF3Yk0_DNDNv-4qnWuWgnKq426ontO1XMCAtXIDze3KG9pqOi-47RCkP4QyXh4tN_4yv')",
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-primary text-on-primary px-space-sm py-1 rounded font-label-sm text-label-sm">
                    للبيع
                  </div>
                  <button
                    aria-label="أضف للمفضلة"
                    onClick={(e) => toggleFavorite("card-4", e)}
                    className="fav-toggle-btn absolute top-3 left-3 w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary-container transition-colors cursor-pointer"
                    type="button"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        favorites["card-4"] ? "text-secondary-container" : ""
                      }`}
                      style={{
                        fontVariationSettings: favorites["card-4"]
                          ? "'FILL' 1"
                          : "'FILL' 0",
                      }}
                    >
                      favorite
                    </span>
                  </button>
                </div>
                <div className="p-space-md flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-container font-title-sm text-title-sm font-bold">
                      $95,000
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      ريف دمشق - جرمانا (الروضة)
                    </span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                    منزل عائلي فسيح وجاهز للسكن في موقع حيوي وهادئ
                  </h3>
                  <div className="flex items-center justify-between pt-space-xs text-on-surface-variant font-label-md text-label-md">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        square_foot
                      </span>{" "}
                      165 م²
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        bed
                      </span>{" "}
                      3 غرف
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">
                        solar_power
                      </span>{" "}
                      طاقة شمسية
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Governorates Visual Discovery Section */}
          <section className="mt-space-xl px-gutter-mobile flex flex-col gap-space-md" id="regions">
            <div className="flex flex-col">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                استكشف العقارات حسب المحافظة
              </h2>
              <p className="font-body-sm text-body-sm text-outline">
                تغطية شاملة لأهم المدن والمراكز الاستثمارية السورية
              </p>
            </div>
            <div className="grid grid-cols-2 gap-space-sm">
              {/* Damascus */}
              <Link
                className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
                href="/properties?gov=damascus"
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
                    340+ عقار نشط
                  </span>
                </div>
              </Link>

              {/* Rif Damascus */}
              <Link
                className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
                href="/properties?gov=rif-damascus"
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
                  <span className="font-title-sm text-title-sm font-bold">ريف دمشق</span>
                  <span className="font-label-sm text-label-sm text-surface-container-high">
                    210+ عقار ومزرعة
                  </span>
                </div>
              </Link>

              {/* Aleppo */}
              <Link
                className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
                href="/properties?gov=aleppo"
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
                    180+ عقار
                  </span>
                </div>
              </Link>

              {/* Latakia */}
              <Link
                className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
                href="/properties?gov=latakia"
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
                  <span className="font-title-sm text-title-sm font-bold">اللاذقية</span>
                  <span className="font-label-sm text-label-sm text-surface-container-high">
                    125+ شاليه وشقة
                  </span>
                </div>
              </Link>

              {/* Tartus */}
              <Link
                className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
                href="/properties?gov=tartus"
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
                    90+ عقار ساحلي
                  </span>
                </div>
              </Link>

              {/* Homs */}
              <Link
                className="relative h-36 rounded-xl overflow-hidden group shadow-sm flex items-end p-space-sm"
                href="/properties?gov=homs"
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
                    75+ عقار
                  </span>
                </div>
              </Link>
            </div>
          </section>

          {/* Property Types Section */}
          <section className="mt-space-xl px-gutter-mobile flex flex-col gap-space-md">
            <div className="flex flex-col">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                تصفح حسب نوع العقار
              </h2>
              <p className="font-body-sm text-body-sm text-outline">
                خيارات متنوعة تلبي تطلعات السكن والاستثمار التجاري
              </p>
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

          {/* Why DABOUL Section */}
          <section className="mt-space-xl px-gutter-mobile flex flex-col gap-space-md" id="about-us">
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-col gap-1 text-center">
                <span className="font-label-sm text-label-sm text-secondary-container font-semibold">
                  ثقة ومصداقية تتوارثها الأجيال
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  لماذا تختار دعبول العقارية؟
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

          {/* Final CTA Banner */}
          <section className="mt-space-xl px-gutter-mobile">
            <div className="bg-primary text-on-primary rounded-xl p-space-lg flex flex-col gap-space-sm relative overflow-hidden shadow-lg">
              <div className="absolute -left-12 -top-12 w-44 h-44 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />
              <span className="material-symbols-outlined text-secondary-container text-[36px]">
                real_estate_agent
              </span>
              <h2 className="font-headline-sm text-headline-sm font-bold text-on-primary">
                هل ترغب ببيع أو تأجير عقارك في سوريا؟
              </h2>
              <p className="font-body-sm text-body-sm text-surface-container-high">
                نضع عقارك أمام آلاف المستثمرين والمشترين الجادين داخل وخارج سوريا مع تسويق احترافي عالي المستوى.
              </p>
              <div className="flex flex-col gap-space-xs pt-space-xs">
                <button
                  type="button"
                  onClick={() => showToast("يرجى التواصل المباشر عبر الواتساب لتقديم تفاصيل عقارك")}
                  className="h-11 bg-secondary-container hover:bg-secondary text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm shadow-md transition-transform active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add_circle
                  </span>
                  <span>أضف عقارك الآن مجاناً</span>
                </button>
                <a
                  className="h-11 bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 text-on-primary rounded-lg flex items-center justify-center gap-space-xs font-title-sm text-title-sm backdrop-blur-md transition-colors"
                  href="https://wa.me/963900000000"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chat
                  </span>
                  <span>تواصل مع مستشار عقاري</span>
                </a>
              </div>
            </div>
          </section>

          {/* Syrian Real Estate Footer */}
          <footer className="mt-space-xl bg-surface-container-low px-gutter-mobile py-space-lg flex flex-col gap-space-lg text-on-surface">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs">
                <div className="w-8 h-8 rounded bg-secondary-container text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">
                    domain
                  </span>
                </div>
                <span className="font-title-md text-title-md font-bold text-primary">
                  دعبول العقارية
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-outline">
                الشركة السورية الرائدة في الوساطة والاستثمار والتطوير العقاري. دمشق، ريف دمشق، حلب، والساحل السوري.
              </p>
            </div>

            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-[18px]">
                  location_on
                </span>
                <span>دمشق - المزة فيلات غربية / شارع دعبول الرئيسي</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-[18px]">
                  phone
                </span>
                <span dir="ltr">+963 11 214 0000 / +963 944 000 000</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary-container text-[18px]">
                  mail
                </span>
                <span>info@daboul-realestate.sy</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-space-xs font-label-md text-label-md text-outline">
              <Link className="hover:text-primary transition-colors" href="/properties?gov=damascus">
                عقارات دمشق الفاخرة
              </Link>
              <Link className="hover:text-primary transition-colors" href="/properties?gov=aleppo">
                شقق للبيع في حلب
              </Link>
              <Link className="hover:text-primary transition-colors" href="/properties?gov=rif-damascus">
                فلل ومزارع يعفور
              </Link>
              <Link className="hover:text-primary transition-colors" href="/properties?gov=latakia">
                شاليهات اللاذقية وطرطوس
              </Link>
              <Link className="hover:text-primary transition-colors" href="/properties">
                الاستشارات والتوثيق القانوني
              </Link>
              <Link className="hover:text-primary transition-colors" href="/#about-us">
                سياسة الخصوصية والشروط
              </Link>
            </div>

            <div className="pt-space-sm flex flex-col items-center justify-center gap-1 text-center font-label-sm text-label-sm text-outline">
              <span>جميع الحقوق محفوظة © 2026 شركة دعبول العقارية DABOUL REAL ESTATE</span>
              <span className="text-on-surface-variant">الجمهورية العربية السورية</span>
            </div>
          </footer>
        </div>
      </main>

      <BottomNav />
    </>
  );
}

export default function HomePage() {
  return (
    <ToastProvider>
      <HomePageContent />
    </ToastProvider>
  );
}
