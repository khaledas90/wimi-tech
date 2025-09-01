"use client";

import { BaseUrl } from "@/app/components/Baseurl";
import { useEffect, useState } from "react";
import { Trader, Ordershoping } from "@/app/lib/type"; // تأكد إن Order معرف في types
import Cookies from "js-cookie";
import axios from "axios";
import Container from "@/app/components/Container";
import {
  UserCircle,
  PackageSearch,
  Mail,
  Phone,
  CalendarCheck,
  BadgeDollarSign,
  ReceiptText,
} from "lucide-react";
import Link from "next/link";

export default function Traders() {
  const token = Cookies.get("token_admin");
  const [trader, setTrader] = useState<Trader | null>(null);
  const [orders, setOrders] = useState<Ordershoping[]>([]);
  const url = `${BaseUrl}traders`;

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrader(res.data.data.trader);
        setOrders(res.data.data.orders);
      } catch (error) {
        console.error("فشل في تحميل البيانات:", error);
      }
    };
    fetchTraders();
  }, []);

  return (
    <Container>
      <div className="min-h-screen py-12 px-4 flex justify-center  ">
        {trader ? (
          <div className="max-w-4xl   bg-white shadow-2xl rounded-3xl p-8 md:p-10 space-y-10 border border-purple-200 transition-all duration-300 animate-fadeIn">
            {/* Header */}
            <div className="text-center">
              <UserCircle className="w-24 h-24 text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-purple-800">ملف التاجر</h2>
              <p className="text-gray-500 text-sm">معلومات التاجر والطلبات</p>
            </div>

            {/* بيانات التاجر */}
            <div className="space-y-2 bg-purple-50 p-6 rounded-xl border border-purple-200 shadow-sm">
              <h3 className="text-xl font-semibold text-purple-700 mb-2">
                👤 بيانات التاجر
              </h3>
              <p className="flex items-center gap-2 text-black">
                <Mail className="w-5 h-5 text-purple-500" />
                {trader.email}
              </p>
              <p className="flex items-center gap-2 text-black">
                <Phone className="w-5 h-5 text-purple-500" />
                {trader.phoneNumber}
              </p>
              
              <p className="flex items-center gap-2 text-black">
                <ReceiptText className="w-5 h-5 text-purple-500" />
                ID: {trader._id}
              </p>
            </div>

            {/* الطلبات */}
            <div>
              <h3 className="text-xl font-bold text-purple-800 mb-6 flex items-center gap-2">
                <PackageSearch className="w-6 h-6 text-purple-600" />
                الطلبات ({orders.length})
              </h3>

              {orders.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  {orders.map((order) => (
                    <Link
                    href={`/admin/update/${order.productId}`}
                      key={order._id}
                      className="bg-white border border-purple-200 rounded-xl p-5 shadow hover:shadow-lg transition"
                    >
                      <p className="text-sm mb-2 text-gray-500">
                        <span className="font-semibold text-purple-700">رقم الطلب:</span>{" "}
                        {order._id}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold text-purple-700">المنتج:</span>{" "}
                        {typeof order.productId === "string"
                          ? order.productId
                          : order.productId?._id || "غير متوفر"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-purple-700">الكمية:</span>{" "}
                        {order.quantity}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-purple-700">السعر:</span>{" "}
                        <span className="text-gray-700">{order.totalPrice} جنيه</span>
                      </p>
                      <p className="text-sm text-yellow-300">
                        <span className="font-semibold text-purple-700">الحالة:</span>{" "}
                        {order.status}
                      </p>
                      <p className="text-sm text-green-600">
                        <span className="font-semibold text-purple-700">الدفع:</span>{" "}
                        <BadgeDollarSign className="inline w-4 h-4 text-green-600" />{" "}
                        {order.paymentState}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(order.orderDate).toLocaleDateString("ar-EG")}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-4">
                  لا توجد طلبات حاليًا.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-lg text-gray-700 mt-10">جاري تحميل البيانات...</p>
        )}
      </div>
    </Container>
  );
}
