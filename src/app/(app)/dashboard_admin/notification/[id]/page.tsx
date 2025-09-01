"use client"

import { BaseUrl } from "@/app/components/Baseurl";
import Container from "@/app/components/Container"
import { Send_Notification } from "@/app/lib/type";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Notigicatio() {
  const pathname = usePathname();
  const productid = pathname.split("/").pop();

  const [send, setsend] = useState<Send_Notification>({
    type: "user",
    text: "",
    userId: String(productid),
  });

  const handelchange = (field: keyof Send_Notification, value: string) => {
    setsend((prev) => ({ ...prev, [field]: value }));
  };

  const sendNotification = async () => {
    try {
        setsend((prev) => ({ ...prev, userId: String(productid) })); // تحديث userId
      const response = await axios.post(`${BaseUrl}admin/send-notification`, send);
      if (response.data.success) {
        toast.success("تم إرسال الإشعار بنجاح");
        setsend((prev) => ({ ...prev, text: "" })); 
      } else {
        toast.error("فشل إرسال الإشعار");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء الإرسال");
      console.error("Error sending notification:", error);
    }
  };

  return (
    <Container>
      <div className="max-w-md mx-auto mt-20 space-y-6 p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="text-xl font-semibold text-gray-800 text-center">إرسال إشعار</h2>

        {/* اختيار النوع */}
        <div>
          <label className="block  mb-1 text-sm text-gray-600">نوع المستلم</label>
          <select
            value={send.type}
            onChange={(e) => handelchange("type", e.target.value)}
            className="w-full text-black border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="user" className="text-black">User</option>
            <option value="trader" className="text-black">Trader</option>
          </select>
        </div>

        {/* نص الإشعار */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">نص الإشعار</label>
          <textarea
            value={send.text}
            onChange={(e) => handelchange("text", e.target.value)}
            rows={4}
            className="w-full text-black border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="اكتب نص الإشعار هنا..."
          />
        </div>

        {/* زر الإرسال */}
        <div className="text-center">
          <button
            onClick={sendNotification}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition"
          >
            إرسال
          </button>
        </div>
      </div>
    </Container>
  );
}
