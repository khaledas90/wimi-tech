"use client";
"use client";

import { BaseUrl } from "@/app/components/Baseurl";
import { Send_Notification } from "@/app/lib/type";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  Send,
  User,
  Store,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default function Notigicatio() {
  const pathname = usePathname();
  const productid = pathname.split("/").pop();

  const [send, setsend] = useState<Send_Notification>({
    type: "user",
    text: "",
    userId: String(productid),
  });
  const [loading, setLoading] = useState(false);

  const handelchange = (field: keyof Send_Notification, value: string) => {
    setsend((prev) => ({ ...prev, [field]: value }));
  };

  const sendNotification = async () => {
    if (!send.text.trim()) {
      toast.error("يرجى كتابة نص الإشعار");
      return;
    }

    setLoading(true);
    try {
      setsend((prev) => ({ ...prev, userId: String(productid) }));
      const response = await axios.post(
        `${BaseUrl}admin/send-notification`,
        send
      );
      if (response.data.success) {
        toast.success("تم إرسال الإشعار بنجاح");
        setsend((prev) => ({ ...prev, text: "" }));
      } else {
        toast.error("فشل إرسال الإشعار");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرسال");
      console.error("Error sending notification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-6 space-y-8 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  إرسال إشعار
                </h1>
                <p className="text-gray-600 mt-1">
                  إرسال إشعار للمستخدم أو التاجر
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                نوع المستلم
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handelchange("type", "user")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                    send.type === "user"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <User className="w-6 h-6" />
                  <div className="text-right">
                    <div className="font-medium">مستخدم</div>
                    <div className="text-sm opacity-75">إرسال للمستخدمين</div>
                  </div>
                </button>
                <button
                  onClick={() => handelchange("type", "trader")}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                    send.type === "trader"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <Store className="w-6 h-6" />
                  <div className="text-right">
                    <div className="font-medium">تاجر</div>
                    <div className="text-sm opacity-75">إرسال للتجار</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Notification Text */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                نص الإشعار
              </label>
              <div className="relative">
                <MessageSquare className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={send.text}
                  onChange={(e) => handelchange("text", e.target.value)}
                  rows={6}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="اكتب نص الإشعار هنا..."
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-1">
                  {send.text.length}/500
                </div>
              </div>
            </div>

            {/* Send Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={sendNotification}
                disabled={loading || !send.text.trim()}
                className={`flex items-center gap-3 px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                  loading || !send.text.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>إرسال الإشعار</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <Bell className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">معلومات مهمة</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• سيتم إرسال الإشعار فوراً للمستخدم المحدد</li>
                <li>• تأكد من صحة نص الإشعار قبل الإرسال</li>
                <li>• يمكن إرسال إشعارات للمستخدمين أو التجار</li>
                <li>• الحد الأقصى لطول النص هو 500 حرف</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
