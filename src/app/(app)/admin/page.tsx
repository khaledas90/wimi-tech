"use client";
import React, { useEffect, useState } from "react";
import Container from "@/app/components/Container";
import { Orderreport } from "@/app/lib/type";
import toast from "react-hot-toast";
import { BaseUrl } from "@/app/components/Baseurl";
import axios from "axios";
import Cookies from "js-cookie";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Image from "next/image";

const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#6366F1",
  "#E879F9",
];

export default function Admin() {
  const [orders, setOrders] = useState<Orderreport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState<Orderreport[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundOrderId, setRefundOrderId] = useState<string | null>(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const token = Cookies.get("token_admin");
  const getOrdersUrl = `${BaseUrl}reports/reports`;

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(getOrdersUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          // Sort orders by orderDate in descending order (newest first)
          const sortedOrders = (res.data.data.orders || []).sort(
            (a: Orderreport, b: Orderreport) => {
              return (
                new Date(b.orderDate).getTime() -
                new Date(a.orderDate).getTime()
              );
            }
          );
          setOrders(sortedOrders);
          toast.success("تم تحميل الطلبات بنجاح");
        }
      } catch (err) {
        toast.error("حدث خطأ أثناء تحميل الطلبات");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getOrders();
  }, []);

  const handleRefundRequest = async (orderId: string, amount: number) => {
    try {
      const res = await axios.post(
        `${BaseUrl}traders/add-req`,
        {
          orderId: orderId,
          type: "1",
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
      } else {
        toast.error("فشل في إرسال طلب الاسترجاع");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال طلب الاسترجاع");
      console.error(error);
    }
  };

  const handleWalletRequest = async () => {
    setWalletLoading(true);
    try {
      const res = await axios.get(`${BaseUrl}traders/get-wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setWalletData(res.data);
        setWalletModalOpen(true);
        toast.success("تم تحميل بيانات المحفظة بنجاح");
      } else {
        toast.error("فشل في تحميل بيانات المحفظة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل بيانات المحفظة");
      console.error(error);
    } finally {
      setWalletLoading(false);
    }
  };

  const currentOrders = filterState ? filteredOrders : orders;

  const statusCounts = currentOrders.reduce<Record<string, number>>(
    (acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const paymentCounts = currentOrders.reduce<Record<string, number>>(
    (acc, order) => {
      acc[order.paymentState] = (acc[order.paymentState] || 0) + 1;
      return acc;
    },
    {}
  );

  // --- FIXED userOrders reducer ---
  const userOrders = currentOrders.reduce<
    Record<string, { name: string; count: number }>
  >((acc, order) => {
    const user = order.userId;

    if (user && user._id) {
      const name =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.phoneNumber || "مستخدم مجهول";

      if (acc[user._id]) {
        acc[user._id].count += 1;
      } else {
        acc[user._id] = { name, count: 1 };
      }
    } else {
      // guest order
      const guestKey = "guest";
      if (acc[guestKey]) {
        acc[guestKey].count += 1;
      } else {
        acc[guestKey] = { name: "زائر", count: 1 };
      }
    }
    return acc;
  }, {});

  const formatChartData = (data: Record<string, number>) =>
    Object.entries(data).map(([key, value]) => ({ name: key, value }));

  return (
    <Container>
      <div className="p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
          تقرير المبيعات الأسبوعي
        </h2>

        {loading ? (
          <div className="text-center text-indigo-600 font-semibold py-10 animate-pulse">
            جارٍ تحميل البيانات...
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
                <h3 className="text-base font-semibold mb-4 text-gray-700 border-b pb-2">
                  حالات الطلبات
                </h3>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatChartData(statusCounts)}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                        stroke="#fff"
                        animationDuration={800}
                        labelLine={false}
                      >
                        {Object.keys(statusCounts).map((_, i) => (
                          <Cell
                            key={`cell-${i}`}
                            fill={COLORS[i % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
                <h3 className="text-base font-semibold mb-4 text-gray-700 border-b pb-2">
                  حالات الدفع
                </h3>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formatChartData(paymentCounts)}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label
                        stroke="#fff"
                        animationDuration={800}
                        labelLine={false}
                      >
                        {Object.keys(paymentCounts).map((_, i) => (
                          <Cell
                            key={`cell-${i}`}
                            fill={COLORS[i % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-4 sm:p-6 col-span-1 sm:col-span-2 xl:col-span-1">
                <h3 className="text-base font-semibold mb-4 text-gray-700 border-b pb-2">
                  المستخدمين الأكثر طلبًا
                </h3>
                <div className="w-full h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.values(userOrders)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#374151", fontSize: 11 }}
                      />
                      <YAxis tick={{ fill: "#374151", fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="count"
                        fill="#4F46E5"
                        radius={[10, 10, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-10 mb-4 flex-wrap gap-3">
              <h3 className="text-base font-semibold text-gray-700 border-b pb-2">
                كل بيانات الطلبات
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={handleWalletRequest}
                  disabled={walletLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {walletLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري التحميل...
                    </>
                  ) : (
                    <>💰 عرض المحفظة</>
                  )}
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  فلتر حسب الحالة
                </button>
              </div>
            </div>

            {!loading &&
              currentOrders.length === 0 &&
              (filteredOrders.length > 0 || filterState) && (
                <div className="text-center text-gray-600 font-medium py-10">
                  لا توجد نتائج لهذا الفلتر
                </div>
              )}

            {/* --- Mobile Orders List --- */}
            <div className="sm:hidden mt-8">
              {currentOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white shadow rounded-xl p-4 mb-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-indigo-600">
                      {order.userId
                        ? `${order.userId.firstName || ""} ${
                            order.userId.lastName || ""
                          }`.trim() ||
                          order.userId.phoneNumber ||
                          "مستخدم مجهول"
                        : "زائر"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    {typeof order.productId === "object" &&
                    order.productId?.title
                      ? order.productId.title
                      : "منتج غير معروف"}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {typeof order.productId === "object" &&
                      order.productId?.images?.[0] && (
                        <Image
                          src={order.productId.images[0]}
                          alt="Product"
                          width={40}
                          height={40}
                          className="rounded"
                          unoptimized
                        />
                      )}
                    <span>{order.totalPrice} EGP</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    الحالة: <strong>{order.status}</strong> | الدفع:{" "}
                    <strong>{order.paymentState}</strong>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrderId(order._id);
                        setNewStatus(order.status);
                        setEditModalOpen(true);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      ✏️ تعديل الحالة
                    </button>
                    <button
                      onClick={() => {
                        setRefundOrderId(order._id);
                        setRefundModalOpen(true);
                      }}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      💰 استرجاع
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* --- Desktop Orders Table --- */}
            <div className="hidden sm:block mt-2 bg-white rounded-2xl shadow overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm text-gray-700 whitespace-nowrap">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-right">#</th>
                    <th className="p-3 text-right">الاسم</th>
                    <th className="p-3 text-right">البريد</th>
                    <th className="p-3 text-right">الهاتف</th>
                    <th className="p-3 text-right">المنتج</th>
                    <th className="p-3 text-right">الصورة</th>
                    <th className="p-3 text-right">السعر</th>
                    <th className="p-3 text-right">الكمية</th>
                    <th className="p-3 text-right">الإجمالي</th>
                    <th className="p-3 text-right">الحالة</th>
                    <th className="p-3 text-right">الدفع</th>
                    <th className="p-3 text-right">التاريخ</th>
                    <th className="p-3 text-right">تعديل</th>
                    <th className="p-3 text-right">استرجاع</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentOrders.map((order, index) => (
                    <tr key={order._id}>
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        {order.userId
                          ? `${order.userId.firstName || ""} ${
                              order.userId.lastName || ""
                            }`.trim() ||
                            order.userId.phoneNumber ||
                            "مستخدم مجهول"
                          : "زائر"}
                      </td>
                      <td className="p-3">
                        {order.userId?.email || "لا يوجد"}
                      </td>
                      <td className="p-3">
                        {order.userId?.phoneNumber || "لا يوجد"}
                      </td>
                      <td className="p-3">
                        {typeof order.productId === "object" &&
                        order.productId?.title
                          ? order.productId.title
                          : "بدون منتج"}
                      </td>
                      <td className="p-3">
                        {typeof order.productId === "object" &&
                        order.productId?.images?.[0] ? (
                          <Image
                            src={order.productId.images[0]}
                            alt="Product"
                            className="h-10 w-10 object-cover rounded"
                            width={40}
                            height={40}
                            unoptimized
                          />
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="p-3">
                        {typeof order.productId === "object" &&
                        order.productId?.price
                          ? `${order.productId.price} EGP`
                          : "—"}
                      </td>
                      <td className="p-3">{order.quantity}</td>
                      <td className="p-3">{order.totalPrice} EGP</td>
                      <td className="p-3">{order.status}</td>
                      <td className="p-3">{order.paymentState}</td>
                      <td className="p-3">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setSelectedOrderId(order._id);
                            setNewStatus(order.status);
                            setEditModalOpen(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          ✏️
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => {
                            setRefundOrderId(order._id);
                            setRefundModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          💰 استرجاع
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* --- Wallet Modal --- */}
            {walletModalOpen && walletData && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-96 text-black max-h-[80vh] overflow-y-auto">
                  <h4 className="text-lg font-semibold mb-4 text-center">
                    💰 بيانات المحفظة
                  </h4>
                  <div className="space-y-3">
                    {"wallet" in (walletData.data || {}) ? (
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 font-medium">
                          المحفظة
                        </span>
                        <span className="text-green-600 font-semibold">
                          {walletData.data.wallet} ريال
                        </span>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        لا توجد بيانات محفظة متاحة
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => {
                        setWalletModalOpen(false);
                        setWalletData(null);
                      }}
                      className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- Refund Modal --- */}
            {refundModalOpen && refundOrderId && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-80 text-black">
                  <h4 className="text-lg font-semibold mb-4">
                    تأكيد طلب الاسترجاع
                  </h4>
                  {(() => {
                    const order = orders.find((o) => o._id === refundOrderId);
                    return order ? (
                      <>
                        <p className="text-gray-600 mb-2">
                          العميل:{" "}
                          <span className="font-medium">
                            {order.userId
                              ? `${order.userId.firstName || ""} ${
                                  order.userId.lastName || ""
                                }`.trim() ||
                                order.userId.phoneNumber ||
                                "مستخدم مجهول"
                              : "زائر"}
                          </span>
                        </p>
                        <p className="text-gray-600 mb-2">
                          المنتج:{" "}
                          <span className="font-medium">
                            {typeof order.productId === "object" &&
                            order.productId?.title
                              ? order.productId.title
                              : "منتج غير معروف"}
                          </span>
                        </p>
                        <p className="text-gray-600 mb-4">
                          المبلغ:{" "}
                          <span className="font-medium text-green-600">
                            {order.totalPrice} EGP
                          </span>
                        </p>
                        <p className="text-gray-600 mb-4">
                          هل أنت متأكد من إرسال طلب استرجاع لهذا الطلب؟
                        </p>
                      </>
                    ) : null;
                  })()}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setRefundModalOpen(false);
                        setRefundOrderId(null);
                      }}
                      className="px-3 py-1 rounded border border-gray-300"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => {
                        const order = orders.find(
                          (o) => o._id === refundOrderId
                        );
                        if (order) {
                          handleRefundRequest(refundOrderId, order.totalPrice);
                        }
                      }}
                      className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                    >
                      تأكيد الاسترجاع
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- Edit Modal --- */}
            {editModalOpen && selectedOrderId && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-80 text-black">
                  <h4 className="text-lg font-semibold mb-4">
                    تعديل حالة الطلب
                  </h4>
                  <select
                    className="w-full border rounded p-2 mb-4"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setEditModalOpen(false);
                        setSelectedOrderId(null);
                        setNewStatus("");
                      }}
                      className="px-3 py-1 rounded border border-gray-300"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const res = await axios.put(
                            `${BaseUrl}reports/orders`,
                            { orderId: selectedOrderId, status: newStatus },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          if (res.status === 200) {
                            toast.success("تم تحديث الحالة بنجاح");
                            setOrders((prev) =>
                              prev.map((order) =>
                                order._id === selectedOrderId
                                  ? {
                                      ...order,
                                      status:
                                        newStatus as Orderreport["status"],
                                    }
                                  : order
                              )
                            );
                          } else {
                            toast.error("فشل في تحديث الطلب");
                          }
                        } catch (error) {
                          toast.error("حدث خطأ أثناء تحديث الطلب");
                          console.error(error);
                        }
                        setEditModalOpen(false);
                        setSelectedOrderId(null);
                      }}
                      className="px-3 py-1 rounded text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      تأكيد
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
