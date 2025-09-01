"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import FormField from "@/app/components/ui/Formfield";
import { BaseUrl } from "@/app/components/Baseurl";
import axios from "axios";
import toast from "react-hot-toast";
import { FieldForm } from "@/app/lib/type";

interface SendPaymentLinkProps {
  phoneNumber: string;
  orderId: string;
  quantity: number;
  price: number;
  onLinkSent: () => void;
}

const SendPaymentLink = ({
  phoneNumber,
  orderId,
  quantity,
  price,
  onLinkSent,
}: SendPaymentLinkProps) => {
  const [formData, setFormData] = useState({
    phoneNumber,
    name: "",
  });
  const [sending, setSending] = useState(false);

  const amount = quantity * price;

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
    setSending(true);

    try {
      const response = await axios.post(
        `${BaseUrl}direct-payment/send-link`,
        {
          phoneNumber: formData.phoneNumber,
          name: formData.name,
          amount,
          orderId: orderId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast.success("تم إرسال رابط الدفع بنجاح 🎉");
        onLinkSent();
      } else {
        toast.error(response.data.message || "فشل في إرسال رابط الدفع");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إرسال رابط الدفع"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="text-center mb-6">
        <Send className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gray-800">
          إرسال رابط الدفع
        </h3>
        <p className="text-gray-600 text-sm">إرسال رابط الدفع للعميل</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          fields={fields}
          data={formData}
          onChange={handleFormChange}
        />

        {/* show calculated amount */}
        <div className="bg-gray-50 p-3 rounded-lg text-center text-gray-700 font-medium">
          المبلغ: {amount.toLocaleString()} ريال
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send size={18} />
              إرسال رابط الدفع
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SendPaymentLink;
