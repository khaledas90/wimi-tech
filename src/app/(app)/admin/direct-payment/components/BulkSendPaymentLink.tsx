"use client";
import { useState } from "react";
import { Send, X } from "lucide-react";
import FormField from "@/app/components/ui/Formfield";
import { BaseUrl } from "@/app/components/Baseurl";
import axios from "axios";
import toast from "react-hot-toast";
import { FieldForm } from "@/app/lib/type";
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

interface BulkSendPaymentLinkProps {
  phoneNumber: string;
  orders: Order[];
  onLinkSent: () => void;
  onClose: () => void;
}

const BulkSendPaymentLink = ({
  phoneNumber,
  orders,
  onLinkSent,
  onClose,
}: BulkSendPaymentLinkProps) => {
  const [formData, setFormData] = useState({
    phoneNumber,
    name: "",
  });
  const [sending, setSending] = useState(false);
  const [orderId, setOrderId] = useState("");
  // Calculate total amount for all orders
  const totalAmount = orders.reduce(
    (sum, order) => sum + order.price * order.quantity,
    0
  );

  const fields: FieldForm[] = [
    {
      name: "phoneNumber",
      label: "رقم الهاتف",
      type: "text",
      placeholder: "مثلاً: +966500000000",
      requierd: true,
    },
    {
      name: "name",
      label: "اسم العميل",
      type: "text",
      placeholder: "مثلاً: أحمد علي",
      requierd: true,
    },
  ];

  const handleFormChange = (updatedData: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...updatedData }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("يرجى إدخال اسم العميل");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error("يرجى إدخال رقم الهاتف");
      return;
    }

    setSending(true);

    try {
      const token = Cookies.get("token_admin");
      const ordersData = orders.map((order) => ({
        orderId: order.order_id,
        amount: order.price * order.quantity,
        description: order.description,
        title: order.title,
        quantity: order.quantity,
        price: order.price,
        status: "pending",
      }));

      const response = await axios.post(
        `${BaseUrl}direct-payment/orders`,
        JSON.stringify({
          orders: ordersData,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      // (response.data._id);
      if (response.data.success) {
        toast.success(`تم إرسال ${orders.length} رابط دفع بنجاح 🎉`);
        await axios.post(
          `${BaseUrl}direct-payment/send-link`,
          {
            orderId: response.data.data._id,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        onLinkSent();
        onClose();
      } else {
        toast.error(response.data.message || "فشل في إرسال روابط الدفع");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إرسال روابط الدفع"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="text-center flex-1">
            <Send className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mx-auto mb-2 sm:mb-3" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              إرسال روابط الدفع المجمعة
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              إرسال {orders.length} رابط دفع للعميل
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Orders Summary */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            ملخص الطلبات:
          </h4>
          <div className="space-y-1 text-xs text-gray-600">
            {orders.map((order, index) => (
              <div key={order._id} className="flex justify-between">
                <span>
                  {index + 1}. {order.title}
                </span>
                <span className="font-medium">
                  {(order.price * order.quantity).toLocaleString()} ريال
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-300">
            <div className="flex justify-between text-sm font-semibold text-gray-800">
              <span>المجموع:</span>
              <span>{totalAmount.toLocaleString()} ريال</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <FormField
            fields={fields}
            data={formData}
            onChange={handleFormChange}
          />

          <div className="bg-blue-50 p-3 rounded-lg text-center text-blue-700 font-medium text-sm sm:text-base">
            المبلغ الإجمالي: {totalAmount.toLocaleString()} ريال
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 sm:py-3 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={sending}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 sm:py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              {sending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <Send size={16} className="sm:w-5 sm:h-5" />
                  إرسال ({orders.length})
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkSendPaymentLink;
