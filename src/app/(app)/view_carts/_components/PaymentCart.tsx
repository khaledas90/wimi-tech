import React, { useState } from "react";

import { CheckCircle, CreditCard } from "lucide-react";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { Card } from "../../checkout-payment/_components/Card";
import Image from "next/image";
import EmkanIcon from "../../../assets/emkan.png";
import FatoraIcon from "../../../assets/fatora.jpg";
import TamaraIcon from "../../../assets/tamara.png";

interface PaymentCardProps {
  orderData?: {
    _id: string;
    orders: Array<{
      phoneNumber: string;
      price: number;
      _id: string;
      quantity: number;
      title: string;
    }>;
  };
}

export default function PaymentCard({ orderData }: PaymentCardProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "tamara" | "invoice" | "emkan" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const token = Cookies.get("token_admin");
  const phone = Cookies.get("phone");
  const router = useRouter();

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

  
  // console.log(calculateMainPrice());   // 4304.347826086957
  // console.log(calculateAddedValue());   // 719.902173913043
  // console.log(calculateTenValue());   // 495
  // console.log(calculateVal());   // 74.25
  // console.log(calculateOnePointFiveValue());   // 645.652173913043
  // console.log(calculateTotal());   // 5519.25

  const handlePayment = (method: "tamara" | "invoice" | "emkan") => {
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

        const totalAmount = calculateTotal(); // Now includes taxes
        const orderDescription = orderData.orders
          .map((order) => order.title)
          .join(", ");

        if (method === "invoice") {
          const response = await axios.post(
            `https://backendb2b.kadinabiye.com/payment-order/create-payment`,
            {
              phoneNumber: phone,
              productId: orderData._id,
              amount: totalAmount,
              total: totalAmount,
            },
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Accept-Language": "ar",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            console.log(response.data.result);
            setSuccess("تم إنشاء  بنجاح");
            if (response.data.data?.result?.checkout_url) {
              window.open(response.data.data.result.checkout_url, "_blank");
              setSuccess("تم إنشاء رابط الدفع بنجاح");
            } else {
              setError("لم يتم العثور على رابط الدفع");
            }
          } else {
            setError(response.data.message || "فشل في إنشاء الفاتورة");
          }
        } else if (method === "tamara") {
          const response = await axios.post(
            `https://backendb2b.kadinabiye.com/payment-order/tamara`,
            {
              orderId: orderData._id,
              total: totalAmount.toString(),
              disription: orderDescription,
            },
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Accept-Language": "ar",
                Authorization: `Bearer ${token}`,
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
        } else if (method === "emkan") {
          const response = await axios.post(
            `https://backendb2b.kadinabiye.com/payment-order/emkan`,
            {
              phoneNumber: phone,
              total: totalAmount,
              orderId: orderData._id,
            },
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Accept-Language": "ar",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            setSuccess("تم إنشاء رابط الدفع عبر إمكان بنجاح");
            console.log(response.data.data.data.paymentURL);
            if (response.data.data.data.paymentURL) {
              window.open(response.data.data.data.paymentURL, "_blank");
            } else if (response.data.data.data.paymentURL) {
              window.open(response.data.data.data.paymentURL, "_blank");
            }
          } else {
            // Handle Emkan specific error structure
            let errorMessage = "فشل في إنشاء رابط الدفع عبر إمكان";

            if (response.data.message) {
              if (typeof response.data.message === "string") {
                errorMessage = response.data.message;
              } else if (response.data.message.message) {
                errorMessage = response.data.message.message;

                // Handle specific Emkan error codes
                if (response.data.message.details?.code === "BNPLO-2001") {
                  errorMessage =
                    "المبلغ أقل من 400 ريال. الحد الأدنى للدفع عبر إمكان هو 400 ريال.";
                }
              }
            }

            setError(errorMessage);
          }
        }
      } catch (err: any) {
        console.error(`Error creating ${method} payment:`, err);

        let errorMessage = `حدث خطأ أثناء إنشاء ${
          method === "tamara"
            ? "رابط الدفع عبر تمارا"
            : method === "emkan"
            ? "رابط الدفع عبر إمكان"
            : "الفاتورة"
        }`;

        if (err.response?.data?.message) {
          if (typeof err.response.data.message === "string") {
            errorMessage = err.response.data.message;
          } else if (err.response.data.message.message) {
            errorMessage = err.response.data.message.message;

            // Handle specific Emkan error codes
            if (err.response.data.message.details?.code === "BNPLO-2001") {
              errorMessage =
                "المبلغ أقل من 400 ريال. الحد الأدنى للدفع عبر إمكان هو 400 ريال.";
            }
          }
        }

        setError(errorMessage);
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

        {/* Pricing Breakdown */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            تفاصيل الفاتورة
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-700 font-medium">السعر:</span>
              <span className="text-gray-900 font-semibold">
                {calculateMainPrice().toFixed(2)} ر.س
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-700 font-medium">ضريبة القيمة المضافة (15%):</span>
              <span className="text-blue-600 font-semibold">
                +{calculateAddedValue().toFixed(2)} ر.س
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-700 font-medium">رسوم ادارية (10%):</span>
              <span className="text-orange-600 font-semibold">
                +{calculateTenValue().toFixed(2)} ر.س
              </span>
            </div>

            <div className="flex justify-between items-center py-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg px-3 border-2 border-green-200">
              <span className="text-lg font-bold text-gray-900">
                المجموع الكلي:
              </span>
              <span className="text-xl font-bold text-green-600">
                {calculateTotal().toFixed(2)} ر.س
              </span>
            </div>
          </div>
        </div>

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
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-gray-200">
                <Image
                  src={TamaraIcon}
                  alt="تمارا"
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
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
            onClick={() => handlePayment("emkan")}
            disabled={loading}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
              selectedPaymentMethod === "emkan"
                ? "border-purple-500 bg-purple-50 shadow-lg"
                : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-gray-200">
                <Image
                  src={EmkanIcon}
                  alt="إمكان"
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex-1 text-right">
                <h3 className="font-bold text-gray-900">إمكان</h3>
                <p className="text-sm text-gray-600">دفع آمن وسريع عبر إمكان</p>
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
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-gray-200">
                <Image
                  src={FatoraIcon}
                  alt="فاتورة"
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
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
                : selectedPaymentMethod === "emkan"
                ? "تم اختيار الدفع عبر إمكان. دفع آمن وسريع."
                : "تم اختيار الدفع عبر الفاتورة. يمكنك الدفع فوراً أو لاحقاً."}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
