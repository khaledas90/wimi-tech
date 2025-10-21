"use client";
import { BaseUrl } from "@/app/components/Baseurl";
import { 
  ProductForVerification, 
  ProductVerificationResponse, 
  UpdateVerificationRequest 
} from "@/app/lib/type";
import { ApiCall } from "@/app/utils/ApiCall";
import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Eye,
  Package,
  Clock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";

export default function ProductVerificationPage() {
  const [products, setProducts] = useState<ProductForVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // Get authorization token from localStorage
  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || "";
    }
    return "";
  };

  // Fetch products for verification
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const response = await ApiCall(
        `${BaseUrl}admin/get-products`,
        "GET",
        null,
        {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": token,
        }
      );

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalProducts(response.data.data.length);
      } else {
        setError(response.data.message || "فشل في جلب المنتجات");
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError("حدث خطأ في جلب المنتجات");
    } finally {
      setLoading(false);
    }
  };

  // Update product verification status
  const updateVerification = async (productId: string) => {
    setUpdating(productId);
    try {
      const token = getAuthToken();
      const requestData: UpdateVerificationRequest = { productId };
      
      const response = await ApiCall(
        `${BaseUrl}admin/update-verify`,
        "PATCH",
        requestData,
        {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": token,
        }
      );

      if (response.data.success) {
        // Refresh the products list
        await fetchProducts();
      } else {
        setError(response.data.message || "فشل في تحديث حالة المنتج");
      }
    } catch (err: any) {
      console.error("Error updating verification:", err);
      setError("حدث خطأ في تحديث حالة المنتج");
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const ProductTable = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الصورة</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">اسم المنتج</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">السعر</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">التصنيف</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الكمية</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">التاجر</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">تاريخ الإضافة</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الحالة</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors duration-200">
                {/* Product Image */}
                <td className="px-6 py-4">
                  <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-product.jpg";
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                </td>

                {/* Product Name */}
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </td>

                {/* Price */}
                <td className="px-6 py-4">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price.toLocaleString()} ر.س
                  </span>
                </td>

                {/* Category */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </td>

                {/* Stock Quantity */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{product.stockQuantity}</span>
                  </div>
                </td>

                {/* Trader Info */}
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{product.traderId.email}</p>
                    <p className="text-gray-500">{product.traderId.phoneNumber}</p>
                    <p className="text-xs text-gray-400">UID: {product.traderId.UID}</p>
                  </div>
                </td>

                {/* Created Date */}
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">
                    {moment(product.createdAt).format("YYYY/MM/DD")}
                  </span>
                  <br />
                  <span className="text-xs text-gray-400">
                    {moment(product.createdAt).format("HH:mm")}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {product.verify ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3" />
                      معتمد
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="w-3 h-3" />
                      في الانتظار
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateVerification(product._id)}
                      disabled={updating === product._id || product.verify}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                        product.verify
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : updating === product._id
                          ? "bg-blue-100 text-blue-600 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white hover:shadow-md"
                      }`}
                    >
                      {updating === product._id ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          جاري التحديث...
                        </>
                      ) : product.verify ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          معتمد
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          اعتماد
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل المنتجات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Package className="w-10 h-10" />
                اعتماد المنتجات
              </h1>
              <p className="text-blue-100 text-lg">
                مراجعة واعتماد المنتجات قبل نشرها
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">إجمالي المنتجات</div>
              <div className="text-3xl font-bold">{totalProducts}</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 ml-auto"
            >
              ✕
            </button>
          </div>
        )}

        {/* Products Table */}
        {products.length > 0 ? (
          <ProductTable />
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد منتجات للاعتماد
            </h3>
            <p className="text-gray-600">
              جميع المنتجات معتمدة أو لا توجد منتجات جديدة في النظام
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
