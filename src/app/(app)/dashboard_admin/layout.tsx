import Sidebar_admin from "@/app/components/dashboard/Sidebar_admin";
import Topbar_admin from "@/app/components/dashboard/Topbar_admin";
import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
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
    <div
      className={`${tajawal.variable} font-tajawal flex flex-row-reverse min-h-screen`}
    >
      <div className="flex-1 ml-0 lg:mr-72 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
        <Topbar_admin />
        <main className="pt-20 w-full">{children}</main>
      </div>
      <Sidebar_admin />
    </div>
  );
}
