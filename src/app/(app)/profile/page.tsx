"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUser } from "@/app/contexts/UserContext";
import {
  User,
  Phone,
  RefreshCw,
  Calendar,
  CheckCircle,
  AlertCircle,
  Heart,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import Logo from "../../../../public/asset/images/ويمي تك.jpg";
import SmartNavbar from "../../components/ui/Navbar";
import Footer from "../../components/ui/Footer";

interface UserProfile {
  _id: string;
  UID: string;
  username: string;
  phoneNumber: string;
  password: string;
  verify: boolean;
  favourites: string[];
  otp: string;
  createdAt: string;
  __v: number;
}

export default function UserProfilePage() {
  const router = useRouter();
  const { user, loading, error, refreshUserData } = useUser();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth");
      return;
    }
  }, [router]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "غير متوفر";
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  const getStatusColor = (user: UserProfile) => {
    if (user.verify) return "green";
    return "yellow";
  };

  const getStatusText = (user: UserProfile) => {
    if (user.verify) return "متحقق";
    return "غير متحقق";
  };

  const getStatusIcon = (user: UserProfile) => {
    if (user.verify) return <CheckCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            خطأ في تحميل البيانات
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => refreshUserData()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition mr-2"
          >
            إعادة المحاولة
          </button>
          <button
            onClick={() => router.push("/auth")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            لم يتم العثور على البيانات
          </h2>
          <button
            onClick={() => router.push("/auth")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SmartNavbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 mx-2 rounded-full flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {user.username?.charAt(0) || "م"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user.username}
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">مستخدم مسجل</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <span className="text-sm text-gray-500">
                        ID: {user.UID}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        عضو منذ {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`px-3 mx-3 py-1 rounded-full text-sm font-medium ${
                      getStatusColor(user) === "green"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {getStatusText(user)}
                  </div>
                  <button
                    onClick={() => refreshUserData()}
                    className="inline-flex items-center px-4 py-2 mx-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <RefreshCw size={16} className="mx-2" />
                    تحديث البيانات
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="text-blue-600 mx-2" size={20} />
                  المعلومات الشخصية
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المستخدم
                    </label>
                    <div className="text-sm text-gray-900 font-medium">
                      {user.username || "غير محدد"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رقم الهاتف
                    </label>
                    <div className="text-sm text-gray-900 font-medium flex items-center">
                      <Phone size={14} className="text-gray-400 mr-1" />
                      {user.phoneNumber || "غير محدد"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      معرف المستخدم
                    </label>
                    <div className="text-sm text-gray-900 font-medium">
                      {user.UID || "غير محدد"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="text-green-600 mx-2" size={20} />
                  حالة الحساب
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full mx-2 flex items-center justify-center ${
                        getStatusColor(user) === "green"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {getStatusIcon(user)}
                    </div>
                    <div className="mx-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {getStatusText(user)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {user.verify
                          ? "حسابك نشط ويمكنك استخدام جميع الميزات."
                          : "حسابك غير متحقق. يرجى التحقق من رقم الهاتف."}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">
                      تاريخ التسجيل
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">آخر نشاط</div>
                    <div className="text-sm font-medium text-gray-900">
                      الآن
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">
                      التحقق من الهاتف
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        user.verify ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.verify ? "متحقق" : "غير متحقق"}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">المفضلة</div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.favourites?.length || 0} عنصر
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Heart className="text-red-600 mx-2" size={20} />
                  المفضلة
                </h2>
              </div>
              <div className="p-6">
                {user.favourites && user.favourites.length > 0 ? (
                  <div className="text-center py-8">
                    <Heart size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      لديك {user.favourites.length} عنصر في المفضلة
                    </h3>
                    <p className="text-gray-600 mb-4">
                      يمكنك عرض مفضلاتك من صفحة المفضلة
                    </p>
                    <button
                      onClick={() => router.push("/favorit")}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      عرض المفضلة
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart size={48} className="text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      لا توجد عناصر في المفضلة
                    </h3>
                    <p className="text-gray-600 mb-4">
                      ابدأ بإضافة المنتجات إلى مفضلاتك
                    </p>
                    <button
                      onClick={() => router.push("/")}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      تصفح المنتجات
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
