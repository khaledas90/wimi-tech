"use client";
import { useState } from "react";
import Container from "@/app/components/Container";
import SmartNavbar from "@/app/components/ui/Navbar";
import FormField from "@/app/components/ui/Formfield";
import { ApiResponse, FieldForm, signup_user } from "@/app/lib/type";
import { BaseUrl, ApiKey } from "@/app/components/Baseurl";
import { Sparkles } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import Logo from "../../../../public/asset/images/ويمي تك.jpg";
import TermsModal from "@/app/components/ui/TermsModal";
import PhoneVerificationModal from "@/app/components/ui/PhoneVerificationModal";

export default function AuthTrader() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // login state
  const [loginData, setLoginData] = useState<Record<string, any>>({});

  // register state
  const [registerData, setRegisterData] = useState<Record<string, any>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  // ===== Login Fields =====
  const loginFields: FieldForm[] = [
    { label: "رقم الهاتف", name: "phoneNumber", type: "text", requierd: true },
    {
      label: "كلمة المرور",
      name: "password",
      type: "password",
      requierd: true,
    },
  ];

  // ===== Register Fields =====
  const registerFields: FieldForm[] = [
    { name: "firstName", label: "الاسم الاول", type: "text", requierd: true },
    { name: "lastName", label: "الاسم الاخير", type: "text", requierd: true },
    {
      name: "email",
      label: "البريد الإلكتروني",
      type: "email",
      requierd: true,
    },
    { name: "phoneNumber", label: "رقم الهاتف", type: "text", requierd: true },
    {
      name: "password",
      label: "الرقم السري",
      type: "password",
      requierd: true,
    },
    { name: "address", label: "العنوان", type: "text", requierd: true },
    { name: "googleMapLink", label: "جوجل ماب", type: "url", requierd: true },
    {
      name: "nationalId",
      label: "رقم السجل التجاري",
      type: "text",
      requierd: true,
    },
    {
      name: "imageOftrading",
      label: "صورة من السجل التجاري",
      type: "file",
      requierd: true,
    },
    {
      name: "nationalId2",
      label: "رقم الهوية الوطنية / الاقامة",
      type: "text",
      requierd: true,
    },
    {
      name: "imageOfnationalId",
      label: "صورة من الهوية",
      type: "file",
      requierd: true,
    },
    { name: "Iban", label: "رقم الايبان", type: "text", requierd: true },
    { name: "nameOfbank", label: "اسم البنك", type: "text", requierd: true },
    {
      name: "nameOfperson",
      label: "اسم المستفيد",
      type: "text",
      requierd: true,
    },
    {
      name: "imageOfiban",
      label: "وثائق داعمة للايبان",
      type: "file",
      requierd: true,
    },
    {
      name: "imageOffront",
      label: "صورة من واجهة المحل",
      type: "file",
      requierd: true,
    },
  ];

  // ===== Handle Login =====
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = `${BaseUrl}traders/login`;
      const res = await axios.post(url, loginData);

      if (res.status === 200 || res.status === 201) {
        const { token } = res.data.data;
        Cookies.set("token_admin", token, { expires: 1 });
        Cookies.set("phone", loginData.phoneNumber);
        toast.success("تم تسجيل الدخول بنجاح 🎉");
        setTimeout(() => {
          window.location.href = "/admin";
        }, 100);
      } else if (res.status === 401) {
        toast.error("بيانات الدخول غير صحيحة ❌");
      } else {
        toast.error(`خطأ: ${res.status}`);
      }
    } catch (error: any) {
      console.error("Trader login error:", error);

      if (
        error?.response?.data?.message ===
        "Phone number not verified. OTP sent."
      ) {
        toast.error("رقم الهاتف غير محقق. تم إرسال رمز التحقق.");
        // Automatically send OTP for verification
        try {
          await axios.post(
            `${BaseUrl}traders/verify-otp`,
            { phoneNumber: loginData.phoneNumber },
            { headers: { "Content-Type": "application/json", api_key: ApiKey } }
          );
          toast.success("تم إرسال رمز التحقق إلى رقم هاتفك");
        } catch (otpError) {
          console.error("Failed to send OTP:", otpError);
          toast.error("فشل في إرسال رمز التحقق");
        }
        setVerifyModalOpen(true);
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.response?.status === 401) {
        toast.error("بيانات الدخول غير صحيحة ❌");
      } else {
        toast.error("فشل في تسجيل الدخول");
      }
    }
  };

  // ===== Handle Register =====
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      for (const [key, value] of Object.entries(registerData)) {
        formDataToSend.append(key, value);
      }

      const url = `${BaseUrl}traders/signup`;
      const res = await axios.post<ApiResponse<signup_user>>(
        url,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("تم إنشاء الحساب بنجاح 🎉");
        // Send OTP to trader and open verification modal
        Cookies.set("phone", registerData.phoneNumber);
        try {
          await axios.post(
            `${BaseUrl}traders/verify-otp`,
            { phoneNumber: registerData.phoneNumber },
            { headers: { "Content-Type": "application/json", api_key: ApiKey } }
          );
        } catch (err) {
          console.error("Failed to send trader OTP after signup:", err);
        }
        setVerifyModalOpen(true);
      } else {
        toast.error(res.data.message || "خطأ أثناء التسجيل");
      }
    } catch (error: any) {
      console.error("Trader register error:", error);

      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("حدث خطأ في عملية التسجيل");
      }
    }
  };

  return (
    <>
      <SmartNavbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center py-10 px-4">
        <Container>
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-3xl space-y-6 border border-purple-100">
            {/* Tabs */}
            <div className="flex justify-center mb-6 gap-2">
              <button
                onClick={() => setActiveTab("login")}
                className={`px-6 py-2 text-sm font-semibold rounded-t-xl transition ${
                  activeTab === "login"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`px-6 py-2 text-sm font-semibold rounded-t-xl transition ${
                  activeTab === "register"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <h2 className="text-3xl font-bold bg-text-gradient bg-clip-text text-transparent">
                    مرحبًا بعودتك
                  </h2>
                  <p className="text-sm text-gray-500">
                    سجّل دخولك للوصول إلى حسابك كتاجر
                  </p>
                </div>
                <FormField
                  fields={loginFields}
                  data={loginData}
                  onChange={setLoginData}
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition"
                >
                  تسجيل الدخول
                </button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="flex flex-col items-center space-y-2">
                  <Image
                    src={Logo}
                    alt="شعار الموقع"
                    width={60}
                    height={60}
                    className="rounded-full shadow-md"
                    unoptimized
                  />
                  <h2 className="text-2xl font-bold text-[#3F0F59] flex items-center gap-1">
                    <Sparkles className="w-5 h-5 text-orange-400 animate-bounce" />
                    إنشاء حساب جديد
                  </h2>
                </div>

                <FormField
                  fields={registerFields}
                  data={registerData}
                  onChange={setRegisterData}
                />

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    بالضغط على "إنشاء حساب" أنت توافق على{" "}
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
                  إنشاء حساب
                </button>
              </form>
            )}
          </div>
        </Container>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {verifyModalOpen && (
        <PhoneVerificationModal
          isOpen={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          phoneNumber={registerData.phoneNumber || loginData.phoneNumber}
          endpointPath="traders/verify-otp"
          redirectTo="/admin"
          canClose={false}
        />
      )}
    </>
  );
}
