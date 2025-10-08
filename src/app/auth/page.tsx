"use client";
import { useState } from "react";
import Container from "../components/Container";
import SmartNavbar from "../components/ui/Navbar";
import FormField from "../components/ui/Formfield";
import {
  ApiResponse,
  FieldForm,
  LoginResponse,
  signup_user,
} from "../lib/type";
import { Postresponse } from "../lib/methodes";
import { BaseUrl, ApiKey } from "../components/Baseurl";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import Logo from "../../../public/asset/images/ويمي تك.jpg";
import PhoneVerificationModal from "../components/ui/PhoneVerificationModal";
import TermsModal from "../components/ui/TermsModal";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginData, setLoginData] = useState<Record<string, any>>({});
  const [registerData, setRegisterData] = useState<Record<string, any>>({});
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const router = useRouter();

  // ===== Login Fields =====
  const loginFields: FieldForm[] = [
    {
      name: "phoneNumber",
      label: "رقم الهاتف",
      type: "text",
      requierd: true,
      placeholder: "ادخل رقم هاتفك",
    },
    {
      label: "كلمة المرور",
      name: "password",
      type: "password",
      requierd: true,
    },
  ];

  // ===== Register Fields =====
  const registerFields: FieldForm[] = [
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

  // ===== Handle Login =====
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = `${BaseUrl}users/login`;
      const res: ApiResponse<LoginResponse> = await Postresponse(
        url,
        loginData
      );
      const { token, user } = res.data;

      Cookies.set("token", token, { expires: 1 });
      Cookies.set("phone", user.phoneNumber);

      toast.success("تم تسجيل الدخول بنجاح 🎉");
      router.push("/auth");
    } catch (error) {
      toast.error("فشل في تسجيل الدخول");
      console.log(error);
    }
  };

  // ===== Handle Register =====
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = `${BaseUrl}users/signup`;
      const res: ApiResponse<signup_user> = await Postresponse(
        url,
        registerData
      );
      const { phoneNumber } = res.data as any;
      Cookies.set("phone", phoneNumber);
      toast.success("تم إنشاء الحساب بنجاح 🎉");
      try {
        await Postresponse(
          `${BaseUrl}users/verify-otp`,
          { phoneNumber },
          { api_key: ApiKey }
        );
      } catch (err) {
        console.error("Failed to send OTP after signup:", err);
      }
      setVerifyModalOpen(true);
    } catch (error) {
      toast.error("فشل في التسجيل");
      console.log(error);
    }
  };

  return (
    <>
      <SmartNavbar />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center px-4 py-10">
        <Container>
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-xl space-y-6">
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
                  <h2 className="text-3xl font-bold   text-black">
                    مرحبًا بعودتك
                  </h2>
                  <p className="text-sm text-gray-500">
                    سجّل دخولك للوصول إلى حسابك
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
                <p className="text-sm text-center text-gray-500">
                  لا تمتلك حسابًا؟{" "}
                  <span
                    className="text-purple-700 cursor-pointer font-semibold hover:underline"
                    onClick={() => setActiveTab("register")}
                  >
                    إنشاء حساب جديد
                  </span>
                </p>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="flex flex-col items-center gap-2">
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
                  showVerifyPhone={true}
                  onVerifyPhone={(phone) => setVerifyModalOpen(true)}
                />

                <p className="text-xs text-gray-500 text-right leading-relaxed">
                  بالضغط على الزر، فأنت توافق على{" "}
                  <span
                    className="text-purple-600 underline cursor-pointer hover:text-orange-500 transition"
                    onClick={() => setTermsModalOpen(true)}
                  >
                    شروط الاستخدام
                  </span>{" "}
                  و{" "}
                  <span
                    className="text-purple-600 underline cursor-pointer hover:text-orange-500 transition"
                    onClick={() => setTermsModalOpen(true)}
                  >
                    سياسة الخصوصية
                  </span>
                  .
                </p>

                <button
                  type="submit"
                  className="w-full bg-black text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] transition-all duration-300"
                >
                  إنشاء حساب
                </button>

                <p className="text-sm text-center text-gray-500">
                  لديك حساب بالفعل؟{" "}
                  <span
                    className="text-purple-700 cursor-pointer font-semibold hover:underline"
                    onClick={() => setActiveTab("login")}
                  >
                    تسجيل الدخول
                  </span>
                </p>
              </form>
            )}
          </div>
          {verifyModalOpen && (
            <PhoneVerificationModal
              isOpen={verifyModalOpen}
              onClose={() => setVerifyModalOpen(false)}
              phoneNumber={registerData.phoneNumber}
            />
          )}
        </Container>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
    </>
  );
}
