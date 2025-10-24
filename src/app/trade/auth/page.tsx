"use client";
import { useState } from "react";
import Container from "@/app/components/Container";
import SmartNavbar from "@/app/components/ui/Navbar";
import FormField from "@/app/components/ui/Formfield";
import { ApiResponse, FieldForm, signup_user } from "@/app/lib/type";
import { BaseUrl, ApiKey } from "@/app/components/Baseurl";
import { Sparkles, Loader2 } from "lucide-react";
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
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

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
    // Personal Information Section
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

    // Business Information Section
    { name: "address", label: "العنوان", type: "text", requierd: true },
    {
      name: "googleMapLink",
      label: "رابط جوجل ماب",
      type: "url",
      requierd: true,
    },
    {
      name: "describtion",
      label: "وصف نشاطك التجاري",
      type: "select",
      requierd: true,
      options: [
        "الموضة والجمال",
        "المنزل والمطبخ",
        "الأطفال والألعاب",
        "الإلكترونيات والإكسسوارات",
        "الخدمات الصحية",
        "الخدمات الغذائية",
        "الضيافة والسكن",
        "الصيانة والمقاولات",
        "السيارات والنقل",
        "الزراعة",
        "المراكز التعليمية والتدريبية",
        "العروض والتخفيضات",
      ],
    },
    {
      name: "nameOfbussinessActor",
      label: "اسم ممثل الكيان",
      type: "text",
      requierd: true,
    },

    // Commercial Registration Section
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

    // Tax Information Section
    {
      name: "specialNumber",
      label: "رقم التسجيل الضريبي",
      type: "text",
      requierd: true,
    },
    {
      name: "imageOfcertificate",
      label: "صورة من الشهادة الضريبية",
      type: "file",
      requierd: true,
    },

    // Identity Documents Section
    {
      name: "nationalId2",
      label: "رقم الهوية الوطنية / الاقامة",
      type: "text",
      requierd: true,
    },
    {
      name: "imageOfnationalId",
      label: "صورة من الهوية الوطنية",
      type: "file",
      requierd: true,
    },

    // Banking Information Section
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

    // Store Images Section
    {
      name: "logo",
      label: "الشعار الخاص بالمتجر",
      type: "file",
      requierd: true,
    },
    {
      name: "imageOffront",
      label: "صورة من واجهة المحل",
      type: "file",
      requierd: true,
    },
    {
      name: "billImage",
      label: "صورة فاتورة حديثة",
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
        const { token, isBlocked, isWaiting, phoneNumber, uid, username } =
          res.data.data;

        // Store only essential data in cookies
        Cookies.set("token_admin", token, { expires: 1 });
        Cookies.set("phone", phoneNumber);

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
    setIsRegisterLoading(true);

    try {
      // Validate required fields
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "password",
        "address",
        "googleMapLink",
        "describtion",
        "nameOfbussinessActor",
        "nationalId",
        "imageOftrading",
        "specialNumber",
        "imageOfcertificate",
        "nationalId2",
        "imageOfnationalId",
        "Iban",
        "nameOfbank",
        "nameOfperson",
        "imageOfiban",
        "logo",
        "imageOffront",
        "billImage",
      ];

      const missingFields = requiredFields.filter(
        (field) => !registerData[field]
      );

      if (missingFields.length > 0) {
        toast.error(
          `يرجى ملء جميع الحقول المطلوبة: ${missingFields.join(", ")}`
        );
        setIsRegisterLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      for (const [key, value] of Object.entries(registerData)) {
        if (value) {
          formDataToSend.append(key, value);
        }
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

        // Store only essential registration data
        Cookies.set("phone", registerData.phoneNumber);

        // Send OTP to trader and open verification modal
        try {
          await axios.post(
            `${BaseUrl}traders/verify-otp`,
            { phoneNumber: registerData.phoneNumber },
            { headers: { "Content-Type": "application/json", api_key: ApiKey } }
          );
          toast.success("تم إرسال رمز التحقق إلى رقم هاتفك");
        } catch (err) {
          console.error("Failed to send trader OTP after signup:", err);
          toast.error("تم إنشاء الحساب ولكن فشل في إرسال رمز التحقق");
        }
        setVerifyModalOpen(true);
      } else {
        toast.error(res.data.message || "خطأ أثناء التسجيل");
      }
    } catch (error: any) {
      console.error("Trader register error:", error);

      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.response?.status === 400) {
        toast.error("بيانات غير صحيحة. يرجى التحقق من جميع الحقول");
      } else if (error?.response?.status === 409) {
        toast.error("هذا الحساب موجود بالفعل");
      } else if (error?.response?.status === 413) {
        toast.error("حجم الملفات كبير جداً. يرجى اختيار ملفات أصغر");
      } else if (error?.response?.status === 422) {
        toast.error("بيانات غير صحيحة. يرجى التحقق من جميع الحقول المطلوبة");
      } else if (error?.code === "NETWORK_ERROR") {
        toast.error("خطأ في الاتصال. يرجى المحاولة مرة أخرى");
      } else {
        toast.error("حدث خطأ في عملية التسجيل. يرجى المحاولة مرة أخرى");
      }
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <>
      <SmartNavbar />
      <div className="min-h-screen my-3 bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center py-10 px-4">
        <Container>
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-4xl space-y-6 border border-purple-100">
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
              <form onSubmit={handleRegister} className="space-y-6">
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

                {/* Personal Information Section */}
                <div className="space-y-4 border-y-gray-50 w-full">
                  <div className="flex items-center border-y-gray-50 w-full gap-2 mb-3">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      المعلومات الشخصية
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 border-y-gray-50 w-full">
                    <FormField
                      fields={registerFields.slice(0, 5)}
                      data={registerData}
                      onChange={setRegisterData}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Business Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      معلومات النشاط التجاري
                    </h3>
                  </div>
                  <FormField
                    fields={registerFields.slice(5, 9)}
                    data={registerData}
                    onChange={setRegisterData}
                  />
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      السجل التجاري
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      fields={registerFields.slice(9, 11)}
                      data={registerData}
                      onChange={setRegisterData}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Tax Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      المعلومات الضريبية
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      fields={registerFields.slice(11, 13)}
                      data={registerData}
                      onChange={setRegisterData}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Identity Documents Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">5</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      وثائق الهوية
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      fields={registerFields.slice(13, 15)}
                      data={registerData}
                      onChange={setRegisterData}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Banking Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">6</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      معلومات البنك
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      fields={registerFields.slice(15, 19)}
                      data={registerData}
                      onChange={setRegisterData}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Store Images Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">7</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      صور المتجر
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      fields={registerFields.slice(19, 22)}
                      data={registerData}
                      onChange={setRegisterData}
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="text-center bg-gray-50 rounded-lg p-4">
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
                  disabled={isRegisterLoading}
                  className={`w-full text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.02] hover:opacity-90 flex items-center justify-center gap-2 ${
                    isRegisterLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-black hover:opacity-90"
                  }`}
                >
                  {isRegisterLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      جاري إنشاء الحساب...
                    </>
                  ) : (
                    "إنشاء حساب"
                  )}
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
