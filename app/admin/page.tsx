import { verifyAdminOrRedirect } from "@/lib/auth/admin";
import { getAdminProperties } from "@/lib/actions/properties";
import { getHomepageConfig } from "@/lib/actions/cms";
import { getAdminInquiries } from "@/lib/actions/inquiries";
import { getCompanySettings } from "@/lib/actions/settings";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Server-side identity & admin authorization check
  // Redirects unauthenticated visitors to /admin/login
  // Redirects non-admin authenticated users to /admin/login?error=unauthorized
  await verifyAdminOrRedirect();

  // Load real properties, homepage CMS configuration, inquiries, and company settings from Supabase
  const [properties, cmsConfig, inquiries, companySettings] = await Promise.all([
    getAdminProperties(),
    getHomepageConfig(),
    getAdminInquiries(),
    getCompanySettings(),
  ]);

  return (
    <AdminDashboardClient
      initialProperties={properties}
      initialCmsConfig={cmsConfig}
      initialInquiries={inquiries}
      initialCompanySettings={companySettings}
    />
  );
}
