"use client";
import React, { useEffect, useState } from "react";
import { BaseUrl } from "@/app/components/Baseurl";
import Container from "@/app/components/Container";
import { getproduct } from "@/app/lib/type";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ViewTable() {
  const [products, setProducts] = useState<getproduct[]>([]);
  const token = Cookies.get("token_admin");
  const url = `${BaseUrl}traders/products`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data.data);
      } catch (error) {
        toast.error("حدث خطأ أثناء جلب المنتجات");
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = confirm("هل أنت متأكد من حذف هذا المنتج؟");
    if (!confirmed) return;

    try {
      await axios.delete(`${BaseUrl}products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((item) => String(item._id) !== id));
      toast.success("تم حذف المنتج بنجاح");
    } catch (error) {
      toast.error("فشل في حذف المنتج");
      console.log(error);
    }
  };

  return (
<Container>
  <div className="lg:pr-72 pr-4 pl-4 mt-10">

    <h1 className="text-3xl font-extrabold text-[#4C1D95] mb-6 text-center">
      🛒 قائمة المنتجات
    </h1>

    {/* ✅ جدول للشاشات الكبيرة */}
    <div className="hidden lg:block overflow-x-auto rounded-2xl shadow-lg border border-gray-200 bg-[#FDF8FF]">
      <table className="min-w-full text-sm text-center">
        <thead className="bg-[#3B1B66] text-white font-semibold text-sm uppercase">
          <tr>
            <th className="px-4 py-3">الصورة</th>
            <th className="px-4 py-3">الاسم</th>
            <th className="px-4 py-3">الفئة</th>
            <th className="px-4 py-3">التاجر</th>
            <th className="px-4 py-3">السعر</th>
            <th className="px-4 py-3">الكمية</th>
            <th className="px-4 py-3">تاريخ الإضافة</th>
            <th className="px-4 py-3">التحكم</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {products.length > 0 ? (
            products.map((product) => (
              <tr
                key={product._id}
                className="border-t hover:bg-[#EEE1FF] transition duration-150"
              >
                <td className="px-4 py-3">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt="product"
                      width={60}
                      height={60}
                      className="rounded-full border object-cover mx-auto"
                      unoptimized
                    />
                  ) : (
                    <span className="text-gray-400">لا يوجد</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{product.title}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/view_traders/${product.traderId}`}
                    className="text-purple-600 hover:underline"
                  >
                    التاجر
                  </Link>
                </td>
                <td className="px-4 py-3">{product.price} ر.س</td>
                <td className="px-4 py-3">{product.stockQuantity}</td>
                <td className="px-4 py-3">
                  {new Date(product.createdAt).toLocaleDateString("ar-EG")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-center">
                    <Link href={`/admin/update/${product._id}`}>
                      <button className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white px-3 py-1.5 rounded-lg text-sm shadow">
                        تعديل
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(String(product._id))}
                      className="bg-[#D926A9] hover:bg-[#AD1B87] text-white px-3 py-1.5 rounded-lg text-sm shadow"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-gray-500 py-6 text-center">
                لا توجد منتجات حالياً.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* ✅ بطاقات موبايل */}
    <div className="lg:hidden space-y-4 mt-6">
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-xl p-4 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-3">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt="product"
                  width={60}
                  height={60}
                  className="rounded-full border object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-gray-400">لا يوجد صورة</span>
              )}
              <div>
                <h2 className="text-base font-bold text-purple-700">{product.title}</h2>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-semibold">السعر:</span> {product.price} ر.س</p>
              <p><span className="font-semibold">الكمية:</span> {product.stockQuantity}</p>
              <p>
                <span className="font-semibold">تاريخ الإضافة:</span>{" "}
                {new Date(product.createdAt).toLocaleDateString("ar-EG")}
              </p>
              <p>
                <span className="font-semibold">التاجر: </span>
                <Link
                  href={`/admin/view_traders/${product.traderId}`}
                  className="text-purple-600 hover:underline"
                >
                  التاجر
                </Link>
              </p>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Link href={`/admin/update/${product._id}`}>
                <button className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white px-3 py-1.5 rounded-md text-sm">
                  تعديل
                </button>
              </Link>
              <button
                onClick={() => handleDelete(String(product._id))}
                className="bg-[#D926A9] hover:bg-[#AD1B87] text-white px-3 py-1.5 rounded-md text-sm"
              >
                حذف
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center mt-6">لا توجد منتجات حالياً.</p>
      )}
    </div>
  </div>
</Container>


  );
}
