"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderDetailsResponse, OrderDetails } from "@/app/lib/type";
import { ApiCall } from "@/app/utils/ApiCall";
import {
  Package,
  Calendar,
  Phone,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  User,
  ShoppingBag,
  Receipt,
  Download,
  ArrowRight,
  Star,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Cookies from "js-cookie";
import axios from "axios";
import { Button } from "../_components/Button";
import { OrderCard } from "@/app/components/OrderCard";
import { OrderStatusBadge } from "@/app/components/OrderStatusBadge";
import { Card } from "../_components/Card";
import PaymentCard from "../_components/PaymentCart";
export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("token_admin");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://backendb2b.kadinabiye.com/direct-payment/order/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setOrderData(response.data.data);
        } else {
          setError("فشل في تحميل تفاصيل الطلب");
        }
      } catch (err: any) {
        if (err.response.status === 401) {
          setError("يرجى تسجيل الدخول أولاً");
          router.push("/auth");
          return;
        }
        setError(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const calculateTotal = () => {
    if (!orderData) return 0;
    return orderData.orders.reduce(
      (total, order) => total + order.price * order.quantity,
      0
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل تفاصيل الطلب...</p>
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            خطأ في تحميل الطلب
          </h2>
          <p className="text-gray-600">{error || "لم يتم العثور على الطلب"}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      dir="rtl"
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">تفاصيل الطلب</h1>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <OrderStatusBadge
                  status={orderData.orders[0]?.status || "pending"}
                  className="bg-white text-blue-600 border-white/20"
                />
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  رجوع
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  معلومات الطلب
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      تاريخ الإنشاء
                    </span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {formatDate(orderData.createdAt)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-600">
                      آخر تحديث
                    </span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {formatDate(orderData.updatedAt)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  المنتجات ({orderData.orders.length})
                </h2>
              </div>

              <div className="space-y-4">
                {orderData.orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">ملخص الطلب</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">عدد المنتجات:</span>
                  <span className="font-semibold text-gray-900">
                    {orderData.orders.length}
                  </span>
                </div>

                <div className="flex justify-between items-center py-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl px-4">
                  <span className="text-lg font-bold text-gray-900">
                    المجموع الكلي:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {calculateTotal()} ر.س
                  </span>
                </div>
              </div>
            </Card>
            <PaymentCard orderData={orderData} />
          </div>
        </div>
      </div>
    </div>
  );
}
