"use client";
import { usePathname } from "next/navigation";
import Sidebar_admin from "@/app/components/dashboard/Sidebar_admin";
import Topbar_admin from "@/app/components/dashboard/Topbar_admin";

export default function ConditionalDashboard({
  children,
  dashboardContent,
}: {
  children: React.ReactNode;
  dashboardContent: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/dashboard_admin/login";

  // If it's the login page, render children without dashboard layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Otherwise, render with dashboard layout (sidebar and topbar)
  return <>{dashboardContent}</>;
}

