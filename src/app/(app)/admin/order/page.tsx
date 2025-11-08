"use client";
import { useState, useEffect } from "react";
import { BaseUrl } from "@/app/components/Baseurl";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Container from "@/app/components/Container";

interface OrderItem {
  title: string;
  phoneNumber: string;
  description: string;
  price: number;
  status: string;
  _id: string;
  order_id: string;
}

interface Order {
  _id: string;
  traderId: string;
  orders: OrderItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const token = Cookies.get("token_admin");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}traders/get-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Orders API Response:", response.data);

      if (response.data.success) {
        // Sort orders by createdAt in descending order (newest first)
        const sortedOrders = (response.data.data || []).sort(
          (a: Order, b: Order) => {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
        );
        setOrders(sortedOrders);
      } else {
        toast.error(response.data.message || "فشل في جلب الطلبات");
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      console.log("Error response:", error.response?.data);
      toast.error(error?.response?.data?.message || "خطأ في جلب الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const handleRefundRequest = async (orderId: string, amount: number) => {
    try {
      const res = await axios.post(
        `${BaseUrl}traders/add-req`,
        {
          orderId: orderId,
          type: "2",
          amount: amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success("تم إرسال طلب الاسترجاع بنجاح");
        setRefundModalOpen(false);
        setRefundOrderId(null);
        setRefundAmount(0);
      } else {
        toast.error("فشل في إرسال طلب الاسترجاع");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال طلب الاسترجاع");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="min-h-screen bg-gradient-to-br from-[#F7F3FF] via-[#FCFAFD] to-[#FFFDFE] p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4 text-lg">
                جاري تحميل الطلبات...
              </p>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div
        className="min-h-screen bg-gradient-to-br from-[#F7F3FF] via-[#FCFAFD] to-[#FFFDFE] p-4 sm:p-6 md:p-8"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-gray-100">
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent mb-2">
                عرض الطلبات
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                جميع الطلبات في النظام
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                لا توجد طلبات متاحة
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 border-b">
                          #
                        </th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 border-b">
                          رقم الطلب
                        </th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 border-b">
                          العنوان
                        </th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 border-b">
                          الهاتف
                        </th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 border-b">
                          السعر
                        </th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 border-b">
                          الحالة
                        </th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 border-b">
                          التاريخ
                        </th>
                        <th className="px-3 py-3 text-right text-xs font-medium text-gray-700 border-b">
                          استرجاع
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((orderGroup, groupIndex) =>
                        orderGroup.orders.map((orderItem, itemIndex) => (
                          <tr
                            key={`${orderGroup._id}-${orderItem._id}`}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-3 py-3 text-xs text-gray-900 border-b">
                              {orderItem._id.slice(-8)}
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-900 border-b font-medium">
                              {orderItem._id.slice(-8)}
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-700 border-b">
                              <div
                                className="font-medium max-w-40 truncate"
                                title={orderItem.title}
                              >
                                {orderItem.title}
                              </div>
                              <div
                                className="text-gray-500 max-w-40 truncate"
                                title={orderItem.description}
                              >
                                {orderItem.description}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-700 border-b">
                              <div className="text-blue-600 font-medium">
                                {orderItem.phoneNumber}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-xs text-green-600 border-b font-semibold">
                              {orderItem.price} ريال
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-700 border-b">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  orderItem.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : orderItem.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : orderItem.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {orderItem.status === "completed"
                                  ? "مكتمل"
                                  : orderItem.status === "pending"
                                  ? "قيد الانتظار"
                                  : orderItem.status === "cancelled"
                                  ? "ملغي"
                                  : orderItem.status}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-700 border-b">
                              {new Date(
                                orderGroup.createdAt
                              ).toLocaleDateString("ar-SA")}
                            </td>
                            <td className="px-3 py-3 text-xs text-gray-700 border-b">
                              <button
                                onClick={() => {
                                  setRefundOrderId(orderGroup._id);
                                  setRefundAmount(orderItem.price);
                                  setRefundModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                💰 استرجاع
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Tablet Table */}
                <div className="hidden md:block lg:hidden overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 border-b">
                          #
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 border-b">
                          رقم الطلب
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 border-b">
                          العنوان
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 border-b">
                          الهاتف
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 border-b">
                          السعر
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 border-b">
                          الحالة
                        </th>
                        <th className="px-2 py-2 text-right text-xs font-medium text-gray-700 border-b">
                          استرجاع
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((orderGroup, groupIndex) =>
                        orderGroup.orders.map((orderItem, itemIndex) => (
                          <tr
                            key={`${orderGroup._id}-${orderItem._id}`}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-2 py-2 text-xs text-gray-900 border-b">
                              {groupIndex * orderGroup.orders.length +
                                itemIndex +
                                1}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-900 border-b font-medium">
                              {orderItem._id.slice(-8)}
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-700 border-b">
                              <div
                                className="font-medium max-w-24 truncate"
                                title={orderItem.title}
                              >
                                {orderItem.title}
                              </div>
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-700 border-b">
                              <div className="text-blue-600 font-medium">
                                {orderItem.phoneNumber}
                              </div>
                            </td>
                            <td className="px-2 py-2 text-xs text-green-600 border-b font-semibold">
                              {orderItem.price} ريال
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-700 border-b">
                              <span
                                className={`px-1 py-0.5 rounded-full text-xs ${
                                  orderItem.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : orderItem.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : orderItem.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {orderItem.status === "completed"
                                  ? "مكتمل"
                                  : orderItem.status === "pending"
                                  ? "قيد الانتظار"
                                  : orderItem.status === "cancelled"
                                  ? "ملغي"
                                  : orderItem.status}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-xs text-gray-700 border-b">
                              <button
                                onClick={() => {
                                  setRefundOrderId(orderGroup._id);
                                  setRefundAmount(orderItem.price);
                                  setRefundModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                💰
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="block md:hidden space-y-3">
                  {orders.map((orderGroup, groupIndex) =>
                    orderGroup.orders.map((orderItem, itemIndex) => (
                      <div
                        key={`${orderGroup._id}-${orderItem._id}`}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-xs text-gray-500">
                            #
                            {groupIndex * orderGroup.orders.length +
                              itemIndex +
                              1}
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              orderItem.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : orderItem.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : orderItem.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {orderItem.status === "completed"
                              ? "مكتمل"
                              : orderItem.status === "pending"
                              ? "قيد الانتظار"
                              : orderItem.status === "cancelled"
                              ? "ملغي"
                              : orderItem.status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">رقم الطلب:</span>
                            <span className="font-medium text-gray-900">
                              {orderItem.order_id}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">العنوان:</span>
                            <span
                              className="font-medium text-gray-900 text-right max-w-32 truncate"
                              title={orderItem.title}
                            >
                              {orderItem.title}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">الهاتف:</span>
                            <span className="text-blue-600 font-medium">
                              {orderItem.phoneNumber}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">السعر:</span>
                            <span className="text-green-600 font-semibold">
                              {orderItem.price} ريال
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">التاريخ:</span>
                            <span className="text-gray-700">
                              {new Date(
                                orderGroup.createdAt
                              ).toLocaleDateString("ar-SA")}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => {
                              setRefundOrderId(orderGroup._id);
                              setRefundAmount(orderItem.price);
                              setRefundModalOpen(true);
                            }}
                            className="w-full text-red-600 hover:text-red-800 text-sm font-medium py-2 px-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            💰 طلب استرجاع
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Refund Modal */}
        {refundModalOpen && refundOrderId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80 text-black">
              <h4 className="text-lg font-semibold mb-4">
                تأكيد طلب الاسترجاع
              </h4>
              <p className="text-gray-600 mb-4">
                المبلغ:{" "}
                <span className="font-medium text-green-600">
                  {refundAmount} ريال
                </span>
              </p>
              <p className="text-gray-600 mb-4">
                هل أنت متأكد من إرسال طلب استرجاع لهذا الطلب؟
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setRefundModalOpen(false);
                    setRefundOrderId(null);
                    setRefundAmount(0);
                  }}
                  className="px-3 py-1 rounded border border-gray-300"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => {
                    handleRefundRequest(refundOrderId, refundAmount);
                  }}
                  className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                >
                  تأكيد الاسترجاع
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
