"use client";
import { useState, useEffect } from "react";
import { Trash2, Send } from "lucide-react";
import { BaseUrl } from "@/app/components/Baseurl";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface Order {
  _id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  order_id: string;
  status?: string;
}

interface OrdersTableProps {
  phoneNumber: string;
  onOrderDeleted: () => void;
  onSendPaymentLink: (orderId: string, quantity: number, price: number) => void;
  refreshTrigger?: number;
}

const OrdersTable = ({
  phoneNumber,
  onOrderDeleted,
  onSendPaymentLink,
  refreshTrigger,
}: OrdersTableProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);

  const token = Cookies.get("token_admin");

  useEffect(() => {
    if (phoneNumber) {
      fetchOrders();
    }
  }, [phoneNumber, refreshTrigger]);

  const fetchOrders = async () => {
    if (!phoneNumber) return;
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${BaseUrl}direct-payment/${phoneNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error(response.data.message || "فشل في جلب الطلبات");
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 404) {
        setOrders([]);
      } else {
        toast.error(error?.response?.data?.message || "خطأ في جلب الطلبات");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    setDeletingOrder(orderId);
    try {
      const response = await axios.delete(
        `${BaseUrl}direct-payment/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("تم حذف الطلب بنجاح");
        onOrderDeleted();
        fetchOrders();
      } else {
        toast.error(response.data.message || "فشل في حذف الطلب");
      }
    } catch (error: any) {
      console.error("Error deleting order:", error);
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء حذف الطلب");
    } finally {
      setDeletingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">جاري تحميل الطلبات...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد طلبات لهذا الرقم حالياً.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
              #
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
              العنوان
            </th>
            <th className="px-3 py-3 text-right text-sm font-medium text-gray-700 border-b">
              الوصف
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
              السعر
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
              الكمية
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
              الحالة
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order, index) => (
            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm text-gray-900 border-b">
                {index + 1}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 border-b font-medium">
                {order.title}
              </td>
              <td className="px-3 py-3 text-sm text-gray-700 border-b max-w-xs truncate">
                {order.description}
              </td>
              <td className="px-4 py-3 text-sm text-green-600 border-b font-semibold">
                {order.price} ريال
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 border-b">
                {order.quantity}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700 border-b">
                {order.status || "قيد المعالجة"}
              </td>
              <td className="px-4 py-3 border-b">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      onSendPaymentLink(
                        order.order_id,
                        order.quantity,
                        order.price
                      )
                    }
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="إرسال رابط الدفع"
                    aria-label="إرسال رابط الدفع"
                  >
                    <Send size={18} />
                  </button>
                  <button
                    onClick={() => deleteOrder(order.order_id)}
                    disabled={deletingOrder === order.order_id}
                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                    title="حذف الطلب"
                    aria-label="حذف الطلب"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
