"use client";

import { useEffect } from "react";

export function AuthRedirectWatcher() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    const search = window.location.search;
    const pathname = window.location.pathname;

    // Detect recovery token in URL hash (implicit flow from email)
    if (hash.includes("type=recovery") && !pathname.startsWith("/admin/reset-password")) {
      window.location.replace(`/admin/reset-password${search}${hash}`);
      return;
    }

    // Detect recovery code or auth error arriving on root homepage
    if (pathname === "/" && (search.includes("code=") || (search.includes("error=") && (search.includes("recovery") || search.includes("otp"))))) {
      window.location.replace(`/admin/reset-password${search}${hash}`);
      return;
    }
  }, []);

  return null;
}
