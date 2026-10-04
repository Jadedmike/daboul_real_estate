import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mkgvkimtbsvegmqlbsnu.supabase.co";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_HocxBE2eAOB9NLEnAh_QhA_77WXjcNk";
const adminEmail = "mhgwad161@gmail.com";
const adminPassword = "Qwer1234vxwGwad662003";

async function verify() {
  console.log("=== PHASE 9 BACKEND & INTEGRATION TEST ===");

  const anonClient = createClient(supabaseUrl, anonKey);

  // 1. Check anonymous read on homepage_sections
  console.log("\n[1] Testing public read on homepage_sections (company_contact)...");
  const { data: initialData, error: readErr } = await anonClient
    .from("homepage_sections")
    .select("*")
    .eq("section_key", "company_contact")
    .maybeSingle();

  if (readErr) {
    console.error("Failed to read settings anonymously:", readErr.message);
  } else {
    console.log("Initial section record exists:", !!initialData);
    if (initialData) {
      console.log("Initial configuration:", JSON.stringify(initialData.configuration));
    }
  }

  // 2. Test anonymous write (should fail due to RLS)
  console.log("\n[2] Testing anonymous write protection (RLS)...");
  const { error: anonWriteErr } = await anonClient
    .from("homepage_sections")
    .upsert({
      section_key: "company_contact",
      title_ar: "اختراق مجهول",
      configuration: { phone: "0000" }
    });

  if (anonWriteErr) {
    console.log("PASS: Anonymous write correctly blocked by RLS:", anonWriteErr.message);
  } else {
    console.error("FAIL: Anonymous write was NOT blocked!");
  }

  // 3. Authenticate as Admin
  console.log("\n[3] Authenticating as Admin (" + adminEmail + ")...");
  const adminClient = createClient(supabaseUrl, anonKey);
  const { data: authData, error: authErr } = await adminClient.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });

  if (authErr || !authData.session) {
    console.error("FAIL: Admin authentication failed:", authErr?.message);
    return;
  }
  console.log("PASS: Admin authenticated successfully. User ID:", authData.user.id);

  // 4. Test admin update of company settings
  console.log("\n[4] Testing admin update of company settings...");
  const testSettings = {
    company_name_ar: "دعبول العقارية - فحص",
    company_name_en: "Daboul Real Estate Test",
    phone: "+963 11 214 9999",
    whatsapp: "+963 944 999 999",
    email: "test@daboul-realestate.sy",
    address: "دمشق - المزة فيلات غربية - فحص",
    short_description: "وصف اختباري للشركة العقارية للتأكد من حفظ الإعدادات.",
    working_hours: "السبت - الخميس: 8:00 ص - 7:00 م",
  };

  const { error: updateErr } = await adminClient
    .from("homepage_sections")
    .upsert(
      {
        section_key: "company_contact",
        title_ar: testSettings.company_name_ar,
        description_ar: testSettings.short_description,
        is_enabled: true,
        sort_order: 99,
        configuration: testSettings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "section_key" }
    );

  if (updateErr) {
    console.error("FAIL: Admin update failed:", updateErr.message);
  } else {
    console.log("PASS: Admin updated company settings successfully.");
  }

  // 5. Verify public read now sees updated settings
  console.log("\n[5] Verifying public read receives updated settings...");
  const { data: updatedData, error: readUpdatedErr } = await anonClient
    .from("homepage_sections")
    .select("*")
    .eq("section_key", "company_contact")
    .single();

  if (readUpdatedErr || !updatedData) {
    console.error("FAIL: Reading updated settings failed:", readUpdatedErr?.message);
  } else {
    const config = updatedData.configuration as any;
    console.log("Read phone:", config?.phone);
    console.log("Read email:", config?.email);
    console.log("Read company_name_ar:", config?.company_name_ar);
    if (config?.phone === testSettings.phone && config?.email === testSettings.email) {
      console.log("PASS: Public read matches test settings!");
    } else {
      console.error("FAIL: Read values do not match test values.");
    }
  }

  // 6. Restore original / production defaults to maintain database integrity
  console.log("\n[6] Restoring clean production default company settings...");
  const cleanSettings = {
    company_name_ar: "دعبول العقارية",
    company_name_en: "Daboul Real Estate",
    phone: "+963 11 214 0000",
    whatsapp: "+963 944 000 000",
    email: "info@daboul-realestate.sy",
    address: "دمشق - المزة فيلات غربية / شارع دعبول الرئيسي",
    short_description: "الشركة السورية الرائدة في الوساطة والاستثمار والتطوير العقاري. دمشق، ريف دمشق، حلب، والساحل السوري.",
    working_hours: "السبت - الخميس: 9:00 ص - 8:00 م",
  };

  const { error: restoreErr } = await adminClient
    .from("homepage_sections")
    .upsert(
      {
        section_key: "company_contact",
        title_ar: cleanSettings.company_name_ar,
        description_ar: cleanSettings.short_description,
        is_enabled: true,
        sort_order: 99,
        configuration: cleanSettings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "section_key" }
    );

  if (restoreErr) {
    console.error("FAIL: Restoring defaults failed:", restoreErr.message);
  } else {
    console.log("PASS: Production default settings cleanly restored.");
  }

  // 7. Test Public HTTP endpoints and SEO tags
  console.log("\n[7] Testing public routes and SEO tags...");
  const routes = ["/", "/properties", "/about", "/contact", "/robots.txt", "/sitemap.xml"];
  for (const r of routes) {
    const res = await fetch(`http://localhost:3000${r}`);
    console.log(`Route ${r.padEnd(16)} -> Status: ${res.status}`);
    if (r === "/robots.txt") {
      const text = await res.text();
      const hasDisallowAdmin = text.includes("Disallow: /admin");
      console.log(`  robots.txt disallows /admin: ${hasDisallowAdmin}`);
    } else if (r === "/sitemap.xml") {
      const text = await res.text();
      const hasUrlset = text.includes("<urlset");
      const hasAbout = text.includes("/about");
      const hasContact = text.includes("/contact");
      const hasAdmin = text.includes("/admin");
      console.log(`  sitemap.xml valid urlset: ${hasUrlset}, contains /about: ${hasAbout}, contains /contact: ${hasContact}, excludes /admin: ${!hasAdmin}`);
    } else {
      const text = await res.text();
      const titleMatch = text.match(/<title>([^<]*)<\/title>/);
      const descMatch = text.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/);
      console.log(`  Title: ${titleMatch ? titleMatch[1] : "N/A"}`);
      console.log(`  Desc:  ${descMatch ? descMatch[1].slice(0, 60) + "..." : "N/A"}`);
    }
  }

  // 8. Test dynamic property details page
  console.log("\n[8] Testing real property details page...");
  const { data: propData } = await anonClient.from("properties").select("id, title_ar").eq("status", "available").limit(1);
  if (propData && propData[0]) {
    const pId = propData[0].id;
    const res = await fetch(`http://localhost:3000/properties/${pId}`);
    console.log(`Property [${pId}] -> Status: ${res.status}`);
    const html = await res.text();
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    console.log(`  Property Title tag: ${titleMatch ? titleMatch[1] : "N/A"}`);
    const hasWhatsAppBtn = html.includes("wa.me");
    const hasTelBtn = html.includes("tel:");
    console.log(`  Contains wa.me link: ${hasWhatsAppBtn}, contains tel: link: ${hasTelBtn}`);
  }

  console.log("\n=== VERIFICATION COMPLETE ===");
}

verify().catch(console.error);
