"use client";
import Container from "../components/Container";
import { ApiResponse, FieldForm, SignIn, LoginResponse } from "../lib/type";
import { useState } from "react";
import FormField from "../components/ui/Formfield";
import SmartNavbar from "../components/ui/Navbar";
import Link from "next/link";
import { Postresponse } from "../lib/methodes";
import { BaseUrl } from "../components/Baseurl";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function LoginPage() {
  const [login, setLogin] = useState<Record<string, any>>({});
  const url = `${BaseUrl}users/login`;
  const router = useRouter();
  const fields: FieldForm[] = [
    {
      label: "الايميل",
      name: "email",
      type: "email",
      requierd: true,
    },
    {
      label: "كلمة المرور",
      name: "password",
      type: "password",
      requierd: true,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res: ApiResponse<LoginResponse> = await Postresponse(url, login);
      console.log(res.message);
      console.log(res.data);

      const { token, user } = res.data;
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("email", user.email);
      toast.success("تم تسجيل الدخول بنجاح 🎉");
      router.push("/");
    } catch (error) {
      toast.error("فشل في تسجيل الدخول");
      console.log(error);
    }
  };
  return (
    <>
      <SmartNavbar />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center px-4">
        <Container>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md space-y-6"
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <h2 className="text-3xl font-bold bg-text-gradient bg-clip-text text-transparent">
                مرحبًا بعودتك
              </h2>
              <p className="text-sm text-gray-500">
                سجّل دخولك للوصول إلى حسابك
              </p>
            </div>

            <FormField fields={fields} data={login} onChange={setLogin} />

            <button
              type="submit"
              className="w-full mt-2 bg-black  text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition"
            >
              تسجيل الدخول
            </button>

            <div className="relative flex items-center justify-center text-gray-400">
              <div className="absolute left-0 right-0 h-px bg-gray-200" />
              <span className="bg-white px-3 z-10 text-sm">أو</span>
            </div>

            <div>
              <p className="text-sm text-center mt-4 ">
                لا تمتلك حسابًا؟{" "}
                <Link
                  href="/register"
                  className="text-purple-700 hover:underline font-semibold flex justify-center items-center"
                >
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          </form>
        </Container>
      </div>
    </>
  );
}
