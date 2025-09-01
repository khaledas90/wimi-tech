"use client";

import Container from "@/app/components/Container";
import FormField from "@/app/components/ui/Formfield";
import SmartNavbar from "@/app/components/ui/Navbar";
import { FieldForm } from "@/app/lib/type";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { BaseUrl } from "@/app/components/Baseurl";
import toast from "react-hot-toast";

export default function Paymen() {
  const [pay, setpay] = useState<Record<string, any>>({});
  const params = useParams();
  const searchParams = useSearchParams();
  const token = Cookies.get("token");
  const orderId = searchParams.get("orderId");
  const quantity = searchParams.get("quantity");

  const fields: FieldForm[] = [
    {
      label: "رقم البطاقة",
      name: "number",
      type: "text",
      requierd: true,
      placeholder: "1234 5678 9012 3456",
      maxLength: 19,
      inputMode: "numeric",
    },
    {
      label: "الاسم على البطاقة",
      name: "name",
      type: "text",
      requierd: true,
      placeholder: "محمد علي",
    },
    {
      label: " شهر الانتهاء ",
      name: "month",
      type: "text",
      requierd: true,
      placeholder: "MM",
      maxLength: 5,
    },
    {
      label: "سنه الانتهاء",
      name: "year",
      type: "text",
      requierd: true,
      placeholder: "2030",
    },
    {
      label: "CVC",
      name: "cvc",
      type: "password",
      requierd: true,
      placeholder: "123",
      maxLength: 4,
    },
    {
      label: "email",
      name: "email",
      type: "email",
      requierd: true,
      placeholder: "XXXX@gmail.com",
    },
  ];

  const handelsupmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = Number(quantity) * 1000;

    if (!token) {
      console.error("❌ لا يوجد توكن");
      return;
    }

    try {
      const payload = {
        ...pay,
        amount,
        orderId,
        customerId: token,
      };

      console.log("📦 Payload:", payload);

      const res = await axios.post(`${BaseUrl}payment/pay`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Payment is Successful");
      if (res.data?.source?.transaction_url) {
        window.location.href = res.data.source.transaction_url;
      }
    } catch (error: any) {
      console.error("❌ Payment error:", error.response?.data || error.message);
      toast.error(" Payment error");
    }
  };

  return (
    <Container>
      <section className="pb-20 md:pb-20">
        <SmartNavbar />
      </section>
      <section className="payment p-6 max-w-md mx-auto bg-white rounded-2xl shadow-md space-y-6 text-black border-[1px] border-purple-300 ">
        <h2 className="text-2xl font-semibold text-center ">معلومات الدفع</h2>

        <form className="space-y-4">
          <FormField fields={fields} data={pay} onChange={setpay} />

          {/* Submit Button */}
          <button
            type="submit"
            name="verify"
            onClick={handelsupmit}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            ادفع الآن
          </button>
        </form>
      </section>
    </Container>
  );
}
