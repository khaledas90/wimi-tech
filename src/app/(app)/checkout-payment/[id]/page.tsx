"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderDetails } from "@/app/lib/type";  
import {
  Package,
  Calendar,
  Clock,
  ShoppingBag,
  Receipt,
  ArrowLeft,
} from "lucide-react";
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
  const [paymentDetails, setPaymentDetails] = useState<{
    totalPrice: number;
    addedValue10: number;
    addedValue1_5: number;
    totalPrice2: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = Cookies.get("token_admin");
  console.log(orderData);

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
          setOrderData(response.data.data.order);
          setPaymentDetails({
            totalPrice: response.data.data.totalPrice,
            addedValue10: response.data.data.addedValue10,
            addedValue1_5: response.data.data.addedValue1_5,
            totalPrice2: response.data.data.totalPrice2,
          });
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

  const calculateSubtotal = () => {
    if (!orderData) return 0;
    return orderData.orders.reduce(
      (total, order) => total + order.price * order.quantity,
      0
    );
  };

  const calculateTenValue = () => {
    return calculateSubtotal() * 0.1; // 10% of subtotal
  };

  const calculateMainPrice = () => {
    return calculateSubtotal() / (15 / 100 + 1); // Base price calculation
  };

  const calculateOnePointFiveValue = () => {
    const totalPrice = calculateSubtotal();
    const mainPrice = calculateMainPrice();
    return totalPrice - mainPrice;
  };

  const calculateVal = () => {
    const tenValue = calculateTenValue();
    return tenValue * 0.15; // 15% of tenValue
  };

  const calculateAddedValue = () => {
    const onePointFiveValue = calculateOnePointFiveValue();
    const val = calculateVal();
    return onePointFiveValue + val;
  };

  const calculateTotal = () => {
    const mainPrice = calculateMainPrice();
    const addedValue = calculateAddedValue();
    const tenValue = calculateTenValue();
    return mainPrice + addedValue + tenValue;
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
      <div className="container mx-auto px-4 py-8 max-w-9xl">
        <Card className="mb-8 overflow-hidden shadow-lg border-0">
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 p-6 text-white">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/25 rounded-2xl flex items-center justify-center backdrop-blur shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-white">تفاصيل الطلب</h1>
                  <p className="text-blue-100 text-sm">مراجعة تفاصيل الطلب والدفع</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <OrderStatusBadge
                  status={orderData.orders[0]?.status || "pending"}
                  className="bg-white text-indigo-600 border-white/30 shadow-md"
                />
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="bg-white/15 border-white/30 text-white hover:bg-white/25 shadow-md backdrop-blur"
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
            <Card className="p-6 shadow-md border border-gray-100 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    معلومات الطلب
                  </h2>
                  <p className="text-gray-500 text-sm">تفاصيل الطلب الأساسية</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">
                      تاريخ الإنشاء
                    </span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg">
                    {formatDate(orderData.createdAt)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">
                      آخر تحديث
                    </span>
                  </div>
                  <p className="text-gray-900 font-bold text-lg">
                    {formatDate(orderData.updatedAt)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-md border border-gray-100 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    المنتجات ({orderData.orders.length})
                  </h2>
                  <p className="text-gray-500 text-sm">قائمة المنتجات المطلوبة</p>
                </div>
              </div>

              <div className="space-y-4">
                {orderData.orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 shadow-md border border-gray-100 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">ملخص الطلب</h2>
                  <p className="text-gray-500 text-sm">تفاصيل الأسعار والرسوم</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200 bg-gray-50 rounded-lg px-4">
                  <span className="text-gray-700 font-semibold">عدد المنتجات:</span>
                  <span className="font-bold text-gray-900 text-lg">
                    {orderData.orders.length}
                  </span>
                </div>

                <div className="space-y-4 bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-xl p-5 border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-bold text-gray-800">
                      السعر:
                    </span>
                    <span className="text-xl font-bold text-gray-900 bg-white px-3 py-1 rounded-lg shadow-sm">
                      {calculateMainPrice().toFixed(2)} ر.س
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-bold text-gray-800">
                      ضريبة القيمة المضافة (15%):
                    </span>
                    <span className="text-xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg shadow-sm">
                      +{calculateAddedValue().toFixed(2)} ر.س
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg font-bold text-gray-800">
                      رسوم ادارية (10%):
                    </span>
                    <span className="text-xl font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg shadow-sm">
                      +{calculateTenValue().toFixed(2)} ر.س
                    </span>
                  </div>

                  <div className="border-t-2 border-gray-300 pt-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg px-4 py-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">
                        المجموع الكلي:
                      </span>
                      <span className="text-2xl font-bold text-green-600 bg-white px-4 py-2 rounded-lg shadow-md">
                        {calculateTotal().toFixed(2)} ر.س
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <PaymentCard
              orderData={orderData}
              paymentDetails={paymentDetails || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
