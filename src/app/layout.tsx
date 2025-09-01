import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import  { Toaster } from 'react-hot-toast';
import Head from 'next/head'


const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ويمى تك",
  description: "أفضل تجربة عربية بخط جميل",
 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
  <Head>
    <link rel="icon" href="/favicon.ico" />
  </Head>
      <body className={`${tajawal.variable} font-sans antialiased`}>
      <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
