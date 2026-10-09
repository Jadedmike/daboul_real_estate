import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/reset-password";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  if (error || errorDescription) {
    const targetUrl = new URL("/admin/reset-password", origin);
    targetUrl.searchParams.set("error", error || "recovery_error");
    if (errorDescription) {
      targetUrl.searchParams.set("error_description", errorDescription);
    }
    return NextResponse.redirect(targetUrl);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      return NextResponse.redirect(new URL(next, origin));
    }
    const targetUrl = new URL("/admin/reset-password", origin);
    targetUrl.searchParams.set("error", "exchange_error");
    targetUrl.searchParams.set("error_description", exchangeError.message);
    return NextResponse.redirect(targetUrl);
  }

  return NextResponse.redirect(new URL(next, origin));
}
