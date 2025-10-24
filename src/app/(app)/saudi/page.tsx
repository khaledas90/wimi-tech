"use client";
import React from "react";
import Image from "next/image";
import Container from "@/app/components/Container";
import logo from "../../../../public/asset/images/saudi_logo.png";
import human from "../../../../public/asset/images/موارد بشريه.png";
import ministry from "../../../../public/asset/images/Logo_Ministry_of_Commerce.svg.jpg";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CertificateDetails() {
  return (
    <div className="bg-gradient-to-tr from-[#f2f4f7] to-[#eef1f8] min-h-screen py-14 px-4">
      <Container>
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 px-6 py-6 border-b border-gray-100 bg-[#fafafb]">
            {[logo, human, ministry].map((img, i) => (
              <div
                key={i}
                className="w-40 h-40 md:w-52 md:h-52 flex items-center justify-center rounded-xl shadow-sm overflow-hidden bg-white"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt="شعار"
                    fill
                    sizes="(max-width: 768px) 160px, 208px"
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Title */}
          <div className="text-center py-8 px-6 border-b border-gray-100 bg-white">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
              شهادة توثيق التجارة الإلكترونية
            </h1>
            <p className="text-sm text-gray-500">
              E-Commerce Authentication Certificate
            </p>
          </div>

          {/* Main Info */}
          <div className="grid md:grid-cols-2 gap-8 p-8 bg-white text-right">
            <InfoCard label="نوع الوثيقة" value="سجل تجارى" />
            <InfoCard label="رقم التوثيق" value="0000182376" />
            <InfoCard label="رقم السجل التجارى" value="3450184681" />
            <InfoCard label="تاريخ إصدار الشهاده " value="15 / 07 / 2025" />
            <InfoCard label="تاريخ انتهاءالشهاده " value="19 / 08 / 2025" />
            <InfoCard
              label="حالة التوثيق"
              value={
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  <CheckCircle2 size={16} /> فعال
                </span>
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-8 bg-white text-right">
            <InfoCard label="Document Type" value="Commercial Registration " />
            <InfoCard label=":Commercial Registry Number" value="3450184681" />
            <InfoCard label=":Authentication Number" value="0000182376" />
            <InfoCard label=":License Issue Date" value="15 / 07 / 2025" />
            <InfoCard label=":License Expiry Date" value="19 / 08 / 2025" />
            <InfoCard
              label="حالة التوثيق"
              value={
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  <CheckCircle2 size={16} /> Active
                </span>
              }
            />
          </div>

          <div className="bg-[#f6f6fd] border-t border-b border-purple-100 px-8 py-10">
            <h2 className="text-xl font-bold text-purple-800 mb-6">
              الحسابات البنكية
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white border border-purple-200 rounded-xl p-6 shadow-sm">
              <div>
                <p className="text-sm text-gray-500 mb-1">رقم الآيبان</p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                  <div className="text-base font-semibold text-gray-800 bg-gray-100 p-4 rounded-md">
                    SA4710000001400032350105
                  </div>
                  <div className="text-base font-semibold text-gray-800 bg-gray-100 p-4 rounded-md">
                    SA5580000133608016494809
                  </div>
                  <div className="text-base font-semibold text-gray-800 bg-gray-100 p-4 rounded-md">
                    SA4205000068206466270000
                  </div>
                  <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✅ مطابق
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-10 bg-white">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              معلومات المتجر
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoCard label="اسم المتجر بالعربي" value="مؤسسة ويمي تيك" />
              <InfoCard label="اسم المتجر بالإنجليزي" value="Wemy Tech" />
            </div>
          </div>

          <div className="bg-[#fafafa] text-sm text-gray-600 text-center py-6 px-6 border-t border-gray-100 leading-loose">
            تم إصدار شهادة توثيق التجارة الإلكترونية بعد التحقق من البيانات دون
            أي مسؤولية على المركز السعودي للأعمال الاقتصادية فيما يخص جودة
            المنتجات أو دقة الخدمات.
          </div>
          <div className="flex justify-center items-center">
            <Link
              href="https://drive.google.com/file/d/1wsazlpuIgdPF3Ij6T8DNDJqHUFqbXpEZ/view"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#fafafa] text-sm text-gray-600 text-center py-6 px-6 border-t border-gray-100 leading-loose"
            >
              التحقق من الشهادة عبر وزارة التجارة
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-[#fbfbff] border border-gray-100 rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-base font-medium text-gray-900">{value}</p>
    </div>
  );
}
