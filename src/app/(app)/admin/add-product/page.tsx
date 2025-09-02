"use client";

import { useRef, useState } from "react";
import Container from "@/app/components/Container";
import { Button } from "@/app/components/ui/Button";
import FormField from "@/app/components/ui/Formfield";
import { ApiResponse, Creatproduct, FieldForm } from "@/app/lib/type";
import { Upload } from "lucide-react";
import InputField from "@/app/components/ui/Input";
import { CallApi } from "@/app/lib/utilits";
import { BaseUrl } from "@/app/components/Baseurl";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function AddProductPage() {
  const [data, setData] = useState<Creatproduct>({
    title: "",
    description: "",
    stockQuantity: "",
    price: "",
    category: "",
    images: "",
    phoneNumber: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const url = `${BaseUrl}products/`;

  const fields: FieldForm[] = [
    {
      name: "title",
      label: "عنوان المنتج",
      type: "text",
      placeholder: "مثلاً: ساعة نسائية أنيقة",
    },
    {
      name: "description",
      label: "الوصف",
      type: "text",
      placeholder: "أكتب وصفاً مختصراً للمنتج...",
    },
    {
      name: "stockQuantity",
      label: "الكمية في المخزون",
      type: "number",
      placeholder: "مثلاً: 25",
    },
    {
      name: "price",
      label: "السعر",
      type: "number",
      placeholder: "مثلاً: 150.00",
    },
    {
      name: "category",
      label: "القسم",
      type: "text",
      placeholder: "مثلاً: ساعات",
    },
  ];

  const handleChange = (updatedData: Record<string, any>) => {
    setData((prev) => ({ ...prev, ...updatedData }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = Cookies.get("token_admin");

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stockQuantity", data.stockQuantity || "0");
    formData.append("category", data.category);

    if (imageFile) {
      formData.append("images", imageFile);
    }

    try {
      const res: ApiResponse<Creatproduct> = await CallApi(
        "post",
        url,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      toast.success("تم إضافة المنتج بنجاح 🎉");
      console.log("Response:", res);

      setData({
        title: "",
        description: "",
        stockQuantity: "",
        price: "",
        category: "",
        images: "",
        phoneNumber: "",
      });
      setImageFile(null);

      // ✅ reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
      toast.error("فشل في إضافة المنتج ❌");
    }
  };

  return (
    <Container>
      <div className="min-h-screen bg-gradient-to-br from-[#faf0ff] via-[#fef8f5] to-[#fff] flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md border border-purple-100 rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 space-y-8 mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2 truncate">
              🚀 إضافة منتج جديد
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              قم بملء التفاصيل التالية لإضافة منتجك إلى المتجر
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* صورة المنتج */}
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-[#6B2B7A]">
                صورة المنتج
              </label>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-purple-200 focus-within:ring-2 focus-within:ring-purple-300">
                <Upload size={18} className="text-purple-500 shrink-0" />
                <InputField
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImageFile(file);
                  }}
                  name="images"
                  type="file"
                  className="flex-1 text-sm focus:outline-none text-purple-800 bg-white"
                />
              </div>
            </div>

            <FormField fields={fields} data={data} onChange={handleChange} />

            <Button
              type="submit"
              classname="w-full bg-gradient-to-r from-black/50 to-black/65 hover:from-[#170a1a] hover:to-[#0e090f] text-white font-bold py-3 text-lg rounded-xl transition duration-300 shadow-md hover:shadow-lg"
            >
              🎉 إضافة المنتج
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}
