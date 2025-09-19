import React, { useState } from "react";
import { Card } from "./Card";
import { CheckCircle, CreditCard, Download, FileText } from "lucide-react";
import { Button } from "./Button";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";

interface PaymentCardProps {
  orderData?: {
    _id: string;
    orders: Array<{
      phoneNumber: string;
      price: number;
      _id: string;
      title: string;
    }>;
  };
}

export default function PaymentCard({ orderData }: PaymentCardProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "tamara" | "invoice" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const token = Cookies.get("token_admin");
  const phone = Cookies.get("phone");
  const router = useRouter();

  const calculateTotal = () => {
    if (!orderData) return 0;
    return orderData.orders.reduce((total, order) => total + order.price, 0);
  };

  const handlePayment = (method: "tamara" | "invoice") => {
    setSelectedPaymentMethod(method);
    setError(null);
    setSuccess(null);

    const processPayment = async () => {
      try {
        setLoading(true);

        if (!orderData || !orderData.orders.length) {
          setError("لا توجد بيانات طلب صالحة");
          return;
        }

        const totalAmount = calculateTotal();
        const orderDescription = orderData.orders
          .map((order) => order.title)
          .join(", ");

        if (method === "invoice") {
          const firstOrder = orderData.orders[0];
          console.log(firstOrder);

          const response = await axios.post(
            `https://backendb2b.kadinabiye.com/fatora/create-payment`,
            {
              phoneNumber: phone,
              productId: orderData._id,
              amount: totalAmount,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            setSuccess("تم إنشاء الفاتورة بنجاح");
            window.open(response.data.data.result.checkout_url, "_blank");
          } else {
            setError(response.data.message || "فشل في إنشاء الفاتورة");
          }
        } else if (method === "tamara") {
          const response = await axios.post(
            `https://backendb2b.kadinabiye.com/fatora/tamara`,
            {
              orderId: orderData._id,
              total: totalAmount,
              disription: orderDescription,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            setSuccess("تم إنشاء رابط الدفع عبر تمارا بنجاح");

            if (response.data?.data.checkoutUrl) {
              window.open(response.data.data.checkoutUrl, "_blank");
            }
          } else {
            setError(
              response.data.message || "فشل في إنشاء رابط الدفع عبر تمارا"
            );
          }
        }
      } catch (err: any) {
        console.error(`Error creating ${method} payment:`, err);
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError(
            `حدث خطأ أثناء إنشاء ${
              method === "tamara" ? "رابط الدفع عبر تمارا" : "الفاتورة"
            }`
          );
        }
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  };
  return (
    <div>
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">طرق الدفع</h2>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="text-red-700 font-medium">خطأ:</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium">نجح:</span>
            </div>
            <p className="text-green-600 text-sm mt-1">{success}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => handlePayment("tamara")}
            disabled={loading}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedPaymentMethod === "tamara"
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-bold text-gray-900">تمارا</h3>
                <p className="text-sm text-gray-600">
                  ادفع على أقساط بدون فوائد
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handlePayment("invoice")}
            disabled={loading}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedPaymentMethod === "invoice"
                ? "border-green-500 bg-green-50 shadow-lg"
                : "border-gray-200 hover:border-green-300 hover:bg-green-50"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-bold text-gray-900">
                  دفع بالبطاقه الائتمانيه
                </h3>
                <p className="text-sm text-gray-600">دفع فوري أو لاحق</p>
              </div>
            </div>
          </button>
        </div>

        {selectedPaymentMethod && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-semibold text-gray-900">
                طريقة الدفع المختارة
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {selectedPaymentMethod === "tamara"
                ? "تم اختيار الدفع عبر تمارا. يمكنك تقسيم المبلغ على أقساط بدون فوائد."
                : "تم اختيار الدفع عبر الفاتورة. يمكنك الدفع فوراً أو لاحقاً."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
