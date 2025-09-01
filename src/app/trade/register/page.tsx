"use client";
import { useState } from "react";
import Container from "@/app/components/Container";
import FormField from "@/app/components/ui/Formfield";
import { ApiResponse, FieldForm, signup_user } from "@/app/lib/type";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SmartNavbar from "@/app/components/ui/Navbar";
import Logo from "../../../../public/asset/images/ويمي تك.jpg";
import { BaseUrl, ApiKey } from "@/app/components/Baseurl";
import toast from "react-hot-toast";
import axios from "axios";
import { TermsModal } from "@/app/components/ui/TermsModal";
import PhoneVerificationModal from "@/app/components/ui/PhoneVerificationModal";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  const fields: FieldForm[] = [
    {
      name: "firstName",
      label: "الاسم الاول",
      type: "text",
      placeholder: "ادخل اسمك الاول",
      requierd: true,
    },
    {
      name: "lastName",
      label: "الاسم الاخير",
      type: "text",
      placeholder: "ادخل اسمك الاخير",
      requierd: true,
    },
    {
      name: "email",
      label: "البريد الإلكتروني",
      type: "email",
      placeholder: "ادخل بريدك الالكتروني",
      requierd: true,
    },
    {
      name: "phoneNumber",
      label: "رقم الهاتف",
      type: "text",
      placeholder: "ادخل رقم هاتفك",
      requierd: true,
    },
    {
      name: "password",
      label: "الرقم السري",
      type: "password",
      placeholder: "ادخل الرقم السري",
      requierd: true,
    },
    {
      name: "address",
      label: "العنوان",
      type: "text",
      placeholder: "ادخل العنوان",
      requierd: true,
    },
    {
      name: "googleMapLink",
      label: "جوجل ماب",
      type: "url",
      placeholder: "ادخل العنوان",
      requierd: true,
    },
    {
      name: "nationalId",
      label: "رقم السجل التجاري او الرقم الوطني الموحد للمنشأة",
      type: "text",
      placeholder: "الرقم الوطنى",
      requierd: true,
    },
    {
      name: "imageOftrading",
      label: "صورة من السجل التجاري",
      type: "file",
      placeholder: "ادخل لينك  الموقع",
      requierd: true,
    },
    {
      name: "nationalId2",
      label: "رقم الهوية الوطنية / الاقامة",
      type: "text",
      placeholder: "ادخل لينك  الموقع",
      requierd: true,
    },
    {
      name: "imageOfnationalId",
      label: "صورة من الهوية الوطنية الرقمية",
      type: "file",
      placeholder: "ادخل لينك  الموقع",
      requierd: true,
    },
    {
      name: "Iban",
      label: "رقم الايبان البنكي",
      type: "text",
      placeholder: "ادخل لينك  الموقع",
      requierd: true,
    },
    {
      name: "nameOfbank",
      label: "اسم البنك",
      type: "text",
      placeholder: "ادخل لينك  الموقع",
      requierd: true,
    },
    {
      name: "nameOfperson",
      label: "اسم المستفيد بالغة الانجليزية او العربية",
      type: "text",
      placeholder: "ادخل لينك  الموقع",
      requierd: true,
    },
    {
      name: "imageOfiban",
      label: "وثائق داعمة للايبان صورة من بطاقة الحساب او خطاب الايبان",
      type: "file",
      placeholder: "ادخل لينك  الموقع",
      requierd: true,
    },
    {
      name: "imageOffront",
      label: "صورة من واجهة المحل",
      type: "file",
      placeholder: "ادخل لينك  الموقع",
      requierd: true,
    },
  ];

  const url = `${BaseUrl}traders/signup`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // ضيف كل المدخلات في formData
      for (const [key, value] of Object.entries(formData)) {
        if (value instanceof File) {
          formDataToSend.append(key, value); // فايل عادي
        } else {
          formDataToSend.append(key, value);
        }
      }

      const response = await axios.post<ApiResponse<signup_user>>(
        url,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // optional, axios بيضبطه تلقائي
          },
          validateStatus: () => true,
        }
      );

      const status = response.status;
      const message = response.data.message;

      if (status === 200 || status === 201) {
        toast.success("تم إنشاء الحساب بنجاح 🎉");
        try {
          await axios.post(
            `${BaseUrl}traders/verify-otp`,
            { phoneNumber: formData.phoneNumber },
            { headers: { "Content-Type": "application/json", api_key: ApiKey } }
          );
        } catch (err) {
          console.error("Failed to send trader OTP after signup:", err);
        }
        setVerifyModalOpen(true);
      } else if (status === 400 || status === 401 || status === 409) {
        toast.error(message);
      } else if (status === 500) {
        toast.error("خطأ في السيرفر، حاول لاحقًا");
      } else {
        toast.error(`خطأ غير معروف: ${status}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ في عملية التسجيل");
    }
  };



  return (
    <>
      <SmartNavbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-orange-100 flex items-center justify-center py-10 px-4">
        <Container>
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-2xl rounded-3xl p-8 w-full  space-y-6 border border-purple-100 mt-5"
          >
            <div className="flex flex-col items-center space-y-2">
              <Image
                src={Logo}
                alt="شعار الموقع"
                width={60}
                height={60}
                className="rounded-full shadow-md"
                unoptimized
              />
              <h2 className="text-2xl font-bold bg-text-gradient bg-clip-text text-transparent text-center flex items-center gap-1">
                <Sparkles className="w-5 h-5 text-orange-400 animate-bounce" />
                إنشاء حساب جديد
              </h2>
            </div>

            <FormField fields={fields} data={formData} onChange={setFormData} />

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                بالضغط على "إنشاء حساب جديد" أنت توافق على{" "}
                <span
                  className="text-purple-600 underline cursor-pointer hover:text-orange-500 transition-colors font-medium"
                  onClick={() => setIsModalOpen(true)}
                >
                  الشروط والأحكام
                </span>{" "}
                و{" "}
                <span
                  className="text-purple-600 underline cursor-pointer hover:text-orange-500 transition-colors font-medium"
                  onClick={() => setIsModalOpen(true)}
                >
                  سياسة الخصوصية
                </span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-2 rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.02] hover:opacity-90"
            >
              إنشاء حساب جديد
            </button>

            <p className="text-center text-sm text-gray-700">
              لديك حساب بالفعل؟{" "}
              <Link href="/trade/login_trade">
                <span className="text-purple-700 font-semibold underline cursor-pointer hover:text-orange-500 transition">
                  تسجيل الدخول
                </span>
              </Link>
            </p>
          </form>
        </Container>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {verifyModalOpen && (
        <PhoneVerificationModal
          isOpen={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          phoneNumber={formData.phoneNumber}
          endpointPath="traders/verify-otp"
          redirectTo="/admin"
        />
      )}
    </>
  );
}
