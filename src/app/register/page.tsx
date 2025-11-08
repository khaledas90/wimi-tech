"use client";
import { useState } from "react";
import Container from "../components/Container";
import FormField from "../components/ui/Formfield";
import { ApiResponse, FieldForm, signup_user } from "../lib/type";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SmartNavbar from "../components/ui/Navbar";
import Logo from "../../../public/asset/images/ويمي تك.jpg";
import { Postresponse } from "../lib/methodes";
import { BaseUrl, ApiKey } from "../components/Baseurl";
import toast from "react-hot-toast";
import PhoneVerificationModal from "../components/ui/PhoneVerificationModal";

export default function RegisterPage() {
  const fields: FieldForm[] = [
    {
      name: "username",
      label: "اسم المستخدم",
      type: "text",
      placeholder: "ادخل اسم المستخدم",
    },
    {
      name: "phoneNumber",
      label: "رقم الهاتف",
      type: "text",
      placeholder: "ادخل رقم هاتفك",
    },
    {
      name: "password",
      label: "الرقم السري",
      type: "password",
      placeholder: "ادخل الرقم السري",
    },
  ];

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const url = `${BaseUrl}users/signup`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: ApiResponse<signup_user> = await Postresponse(url, formData);
      console.log(res.data);
      toast.success("تم تسجيل حسابك بنجاح 🎉");
      // Send OTP via unified endpoint, then open verification modal
      try {
        await Postresponse(
          `${BaseUrl}users/verify-otp`,
          { phoneNumber: formData.phoneNumber },
          { api_key: ApiKey }
        );
      } catch (err) {
        // Even if sending OTP fails, allow user to try resend from modal
        console.error("Failed to send OTP after signup:", err);
      }
      setVerifyModalOpen(true);
    } catch (error) {
      console.log(error);
      toast.error("خطأ فى تسجيل الدخول");
    }
  };

  return (
    <>
      <SmartNavbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-orange-100 flex items-center justify-center py-10 px-4 ">
        <Container>
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md space-y-6 border border-purple-100 mt-5"
          >
            {/* شعار */}
            <div className="flex flex-col items-center space-y-2">
              <Image
                src={Logo}
                alt="شعار الموقع"
                width={60}
                height={60}
                className="rounded-full shadow-md"
                unoptimized
              />
              <h2 className="text-2xl font-bold bg-text-gradient bg-clip-text text-white p-2 text-center flex items-center gap-1">
                <Sparkles className="w-5 h-5 text-orange-400 animate-bounce" />
                إنشاء حساب جديد
              </h2>
            </div>

            <FormField
              fields={fields}
              data={formData}
              onChange={setFormData}
              showVerifyPhone={true}
              onVerifyPhone={(phone) => setVerifyModalOpen(true)}
            />

            <p className="text-xs text-gray-600 text-right leading-relaxed">
              بالضغط على الزر، فأنت توافق على{" "}
              <span className="text-purple-600 underline cursor-pointer hover:text-orange-500 transition">
                شروط الاستخدام
              </span>{" "}
              و{" "}
              <span className="text-purple-600 underline cursor-pointer hover:text-orange-500 transition">
                سياسة الخصوصية
              </span>
              .
            </p>

            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-2 rounded-lg shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              إنشاء حساب جديد
            </button>

            <p className="text-center text-sm text-gray-700">
              لديك حساب بالفعل؟{" "}
              <Link href="/auth">
                <span className="bg-text-gradient bg-clip-text text-transparent font-semibold underline cursor-pointer text-white transition">
                  تسجيل الدخول
                </span>
              </Link>
            </p>
          </form>
          {verifyModalOpen && (
            <PhoneVerificationModal
              isOpen={verifyModalOpen}
              onClose={() => setVerifyModalOpen(false)}
              phoneNumber={formData.phoneNumber}
            />
          )}
        </Container>
      </div>
    </>
  );
}
