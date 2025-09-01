"use client";
import { useState } from "react";
import { Send, User, Package } from "lucide-react";
import FormField from "@/app/components/ui/Formfield";
import { FieldForm } from "@/app/lib/type";
import axios from "axios";
import toast from "react-hot-toast";
import { BaseUrl } from "@/app/components/Baseurl";

interface SendOrderLinkProps {
  phoneNumber: string;
  orderId: string;
  onLinkSent: () => void;
}

const SendOrderLink = ({
  phoneNumber,
  orderId,
  onLinkSent,
}: SendOrderLinkProps) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [sending, setSending] = useState(false);

  const fields: FieldForm[] = [
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

  const handleSendLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("يرجى إدخال اسم العميل");
      return;
    }

    setSending(true);
    try {
      const response = await axios.post(
        `${BaseUrl}direct-payment/send-link`,
        {
          phoneNumber,
          orderId: orderId,
          name: formData.name,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        toast.success("تم إرسال رابط الطلب بنجاح");
        onLinkSent();
        setFormData({ name: "" });
      } else {
        toast.error(response.data.message || "فشل في إرسال رابط الطلب");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إرسال رابط الطلب"
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

      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <User size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">
            رقم الهاتف: {phoneNumber}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Package size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">معرف الطلب: {orderId}</span>
        </div>
      </div>

      <form onSubmit={handleSendLink} className="space-y-4">
        <FormField
          fields={fields}
          data={formData}
          onChange={handleFormChange}
        />

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
        >
          {sending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send size={20} />
              إرسال رابط الدفع
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SendOrderLink;
