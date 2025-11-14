import Sidebar_admin from "@/app/components/dashboard/Sidebar_admin";
import Topbar_admin from "@/app/components/dashboard/Topbar_admin";
import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import AuthWrapper from "./_components/AuthWrapper";
import ConditionalDashboard from "./_components/ConditionalDashboard";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ويمى تك ",
  description: "أفضل تجربة عربية بخط جميل",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthWrapper>
      <ConditionalDashboard
        dashboardContent={
          <div className={`${tajawal.variable} font-tajawal min-h-screen`}>
            <Sidebar_admin />
            <div className="lg:mr-80 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
              <Topbar_admin />
              <main className="pt-16 w-full">{children}</main>
            </div>
          </div>
        }
      >
        {children}
      </ConditionalDashboard>
    </AuthWrapper>
  );
}
