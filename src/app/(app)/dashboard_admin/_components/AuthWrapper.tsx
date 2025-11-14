"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/dashboard_admin/login";

  useEffect(() => {
    const token = Cookies.get("token_admin");
    // Only redirect if not on login page and no token
    if (!token && !isLoginPage) {
      router.push("/dashboard_admin/login");
    }
  }, [router, isLoginPage]);

  const token = Cookies.get("token_admin");
  // If no token and not on login page, show nothing (redirecting)
  if (!token && !isLoginPage) {
    return null;
  }

  return <>{children}</>;
}

