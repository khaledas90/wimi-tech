"use client";
import { BaseUrl } from "@/app/components/Baseurl";
import Container from "@/app/components/Container";
import { ApiResponse, getproduct, updateproduct } from "@/app/lib/type";
import { CallApi } from "@/app/lib/utilits";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Image from "next/image";

export default function Update() {
  const pathname = usePathname();
  const productid = pathname.split("/").pop();
  const [data, setData] = useState<getproduct>();
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("token_admin");
  const url = `${BaseUrl}products/${productid}`;

  const [form, setForm] = useState<updateproduct>({
    title: "",
    description: "",
    price: 0,
    category: "",
    stockQuantity: 1,
  });

  useEffect(() => {
    const getproductdetails = async () => {
      try {
        const res: ApiResponse<getproduct> = await CallApi("get", url, {
          Authorization: `Bearer ${token}`,
        });
        setData(res.data);
        setForm({
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          category: res.data.category,
          stockQuantity: res.data.stockQuantity,
        });
      } catch (error) {
        toast.error("فشل تحميل بيانات المنتج");
        console.log(error);
      }
    };
    getproductdetails();
  }, []);

  const handleChange = (field: keyof updateproduct, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await CallApi("put", url, form, {
        Authorization: `Bearer ${token}`,
      });
      toast.success("✅ تم تحديث المنتج بنجاح");
    } catch (error) {
      console.error(error);
      toast.error("❌ حصل خطأ أثناء التحديث");
    } finally {
      setLoading(false);
    }
  };

  if (!data)
    return (
      <div className="text-center py-10 text-lg text-gray-600">
        ...جاري تحميل بيانات المنتج
      </div>
    );

  return (
    <Container>
      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md text-black mt-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          تعديل بيانات المنتج
        </h2>
<div className="relative w-full max-w-sm sm:max-w-md h-72 mx-auto rounded-lg overflow-hidden shadow-md border">
  <Image
    src={data.images?.[0]}
    alt={form.title}
    fill
    className="object-contain"
    unoptimized // تقدر تشيله لو بتستخدم domains في next.config
  />
</div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block font-semibold mb-1 text-sm text-gray-700">الاسم:</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-purple-300"
            />

            <label className="block font-semibold mt-4 mb-1 text-sm text-gray-700">الوصف:</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border px-3 py-2 rounded h-24 resize-none focus:outline-none focus:ring focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-sm text-gray-700">السعر:</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", +e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-purple-300"
            />

            <label className="block font-semibold mt-4 mb-1 text-sm text-gray-700">الكمية:</label>
            <select
              value={form.stockQuantity}
              onChange={(e) => handleChange("stockQuantity", +e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-purple-300"
            >
              {[...Array(data.stockQuantity)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} قطعة
                </option>
              ))}
            </select>

            <label className="block font-semibold mt-4 mb-1 text-sm text-gray-700">التصنيف:</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring focus:ring-purple-300"
            />
          </div>
        </div>

        <div className="border-t mt-6 pt-4 text-gray-700 text-sm space-y-1 text-center">
          <p>
            <span className="font-semibold">اسم التاجر:</span>{" "}
            {data.traderId.firstName} {data.traderId.lastName || ""}
          </p>
          <p>
            <span className="font-semibold">البريد:</span> {data.traderId.email}
          </p>
          <p>
            <span className="font-semibold">الهاتف:</span> {data.traderId.phoneNumber}
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 text-white font-semibold px-6 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "جارٍ الحفظ..." : "💾 حفظ التعديلات"}
          </button>
        </div>
      </div>
    </Container>
  );
}
