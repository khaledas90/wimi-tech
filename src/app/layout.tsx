import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { TraderProvider } from "./contexts/TraderContext";
import { UserProvider } from "./contexts/UserContext";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ويمى تك",
  description: "أفضل تجربة عربية بخط جميل",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <TraderProvider>
          <UserProvider>
            <Toaster position="top-right" />
            {children}
          </UserProvider>
        </TraderProvider>
      </body>
    </html>
  );
}
