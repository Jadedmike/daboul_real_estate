import { redirect } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { AdminUser } from "@/lib/supabase/types";

export interface AdminSession {
  user: User | null;
  isAdmin: boolean;
  adminRecord: AdminUser | null;
}

/**
 * Retrieves the current authenticated user and verifies if they are
 * the single authorized active administrator in the admin_users table.
 */
export async function getAdminSession(): Promise<AdminSession> {
  if (!isSupabaseConfigured) {
    return { user: null, isAdmin: false, adminRecord: null };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { user: null, isAdmin: false, adminRecord: null };
    }

    const { data: adminRecord, error: dbError } = await supabase
      .from("admin_users")
      .select("id, user_id, email, is_active, created_at, updated_at")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (dbError || !adminRecord) {
      return { user, isAdmin: false, adminRecord: null };
    }

    return {
      user,
      isAdmin: true,
      adminRecord: adminRecord as AdminUser,
    };
  } catch (error) {
    console.error("Error verifying admin session:", error);
    return { user: null, isAdmin: false, adminRecord: null };
  }
}

/**
 * Enforces admin authorization for Server Actions and backend mutations.
 * Throws an Error if the user is not authenticated or not the active admin.
 */
export async function requireAdmin(): Promise<{
  user: User;
  isAdmin: true;
  adminRecord: AdminUser;
}> {
  const session = await getAdminSession();

  if (!session.user || !session.isAdmin || !session.adminRecord) {
    throw new Error("Unauthorized: Active administrator credentials required.");
  }

  return {
    user: session.user,
    isAdmin: true,
    adminRecord: session.adminRecord,
  };
}

/**
 * Server-side route authorization check.
 * Redirects to /admin/login if the user is unauthenticated or not an active admin.
 */
export async function verifyAdminOrRedirect(): Promise<{
  user: User;
  isAdmin: true;
  adminRecord: AdminUser;
}> {
  const session = await getAdminSession();

  if (!session.user) {
    redirect("/admin/login");
  }

  if (!session.isAdmin || !session.adminRecord) {
    redirect("/admin/login?error=unauthorized");
  }

  return {
    user: session.user,
    isAdmin: true,
    adminRecord: session.adminRecord,
  };
}
