"use client";
import { useState } from "react";
import { UserPlus } from "lucide-react";
import FormField from "@/app/components/ui/Formfield";
import { FieldForm } from "@/app/lib/type";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { BaseUrl } from "@/app/components/Baseurl";

interface NewUserRegistrationProps {
  phoneNumber: string;
  onUserRegistered: (userId: string) => void;
}

const NewUserRegistration = ({ phoneNumber, onUserRegistered }: NewUserRegistrationProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [registering, setRegistering] = useState(false);

  const fields: FieldForm[] = [
    {
      name: "firstName",
      label: "الاسم الأول",
      type: "text",
      placeholder: "مثلاً: أحمد",
      requierd: true,
    },
    {
      name: "lastName",
      label: "اسم العائلة",
      type: "text",
      placeholder: "مثلاً: علي",
      requierd: true,
    },
    {
      name: "email",
      label: "البريد الإلكتروني",
      type: "email",
      placeholder: "مثلاً: ahmed@example.com",
      requierd: true,
    },
    {
      name: "password",
      label: "كلمة المرور",
      type: "password",
      placeholder: "أدخل كلمة مرور قوية",
      requierd: true,
    },
  ];

  const handleFormChange = (updatedData: Record<string, any>) => {
    setFormData((prev) => ({ ...prev, ...updatedData }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error("يرجى إكمال جميع البيانات المطلوبة");
      return;
    }

    setRegistering(true);
    try {
      const response = await axios.post(
        `${BaseUrl}traders/directPayment`,
        {
          ...formData,
          phoneNumber,
        },
        {
          headers: { Authorization: `Bearer ${Cookies.get("token_admin")}` },
        }
      );

      if (response.data.success) {
        toast.success("تم تسجيل المستخدم بنجاح");
        onUserRegistered(response.data.data.userId);
      } else {
        toast.error(response.data.message || "فشل في تسجيل المستخدم");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء تسجيل المستخدم");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="text-center mb-6">
        <UserPlus className="w-16 h-16 text-orange-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent">
          تسجيل عميل جديد
        </h2>
        <p className="text-gray-600 mt-2">
          أكمل بيانات العميل لإنشاء حساب جديد
        </p>
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            رقم الهاتف: <span className="font-semibold">{phoneNumber}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleRegister} className="max-w-md mx-auto space-y-4">
        <FormField
          fields={fields}
          data={formData}
          onChange={handleFormChange}
        />

        <button
          type="submit"
          disabled={registering}
          className="w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 shadow-lg"
        >
          {registering ? "جاري التسجيل..." : "تسجيل المستخدم"}
        </button>
      </form>
    </div>
  );
};

export default NewUserRegistration;
