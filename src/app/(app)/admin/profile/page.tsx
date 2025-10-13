"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useTrader } from "@/app/contexts/TraderContext";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Shield,
  RefreshCw,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Banknote,
  Home,
  Globe,
  IdCard,
  Image as ImageIcon,
} from "lucide-react";

interface TraderProfile {
  UID: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  verify: boolean;
  address: string;
  googleMapLink: string;
  describtion?: string;
  nameOfbussinessActor?: string;
  block: boolean;
  waiting: boolean;
  nationalId: string;
  imageOftrading: string;
  specialNumber?: string;
  imageOfcertificate?: string;
  nationalId2: string;
  imageOfnationalId: string;
  Iban: string;
  nameOfbank: string;
  nameOfperson: string;
  imageOfiban: string;
  logo?: string;
  imageOffront: string;
  billImage?: string;
  otp: string;
  createdAt: string;
}

export default function TraderProfilePage() {
  const router = useRouter();
  const { trader, loading, error, refreshTraderData } = useTrader();

  useEffect(() => {
    const token = Cookies.get("token_admin");
    if (!token) {
      router.push("/trade/auth");
      return;
    }
  }, [router]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "غير متوفر";
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  const getStatusColor = (trader: TraderProfile) => {
    if (trader.block) return "red";
    if (trader.waiting) return "yellow";
    if (trader.verify) return "green";
    return "gray";
  };

  const getStatusText = (trader: TraderProfile) => {
    if (trader.block) return "محظور";
    if (trader.waiting) return "في انتظار الموافقة";
    if (trader.verify) return "مفعل";
    return "غير مفعل";
  };

  const getStatusIcon = (trader: TraderProfile) => {
    if (trader.block) return <AlertCircle className="w-5 h-5" />;
    if (trader.waiting) return <Clock className="w-5 h-5" />;
    if (trader.verify) return <CheckCircle className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            خطأ في تحميل البيانات
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => refreshTraderData()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition mr-2"
          >
            إعادة المحاولة
          </button>
          <button
            onClick={() => router.push("/trade/auth")}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  if (!trader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            لم يتم العثور على البيانات
          </h2>
          <button
            onClick={() => router.push("/trade/auth")}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            العودة لتسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 mx-2 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {trader.firstName?.charAt(0) ||
                        trader.lastName?.charAt(0) ||
                        "ت"}
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {trader.firstName} {trader.lastName}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">تاجر مسجل</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-sm text-gray-500">
                      ID: {trader.UID}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      عضو منذ {formatDate(trader.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getStatusColor(trader) === "red"
                      ? "bg-red-100 text-red-800"
                      : getStatusColor(trader) === "yellow"
                      ? "bg-yellow-100 text-yellow-800"
                      : getStatusColor(trader) === "green"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {getStatusText(trader)}
                </div>
                <button
                  onClick={() => refreshTraderData()}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 mx-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <RefreshCw size={16} className="mr-2" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الأول
                  </label>
                  <div className="text-sm text-gray-900 font-medium">
                    {trader.firstName || "غير محدد"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الاسم الأخير
                  </label>
                  <div className="text-sm text-gray-900 font-medium">
                    {trader.lastName || "غير محدد"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البريد الإلكتروني
                  </label>
                  <div className="text-sm text-gray-900 font-medium flex items-center">
                    <Mail size={14} className="text-gray-400 mr-1" />
                    {trader.email || "غير محدد"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهاتف
                  </label>
                  <div className="text-sm text-gray-900 font-medium flex items-center">
                    <Phone size={14} className="text-gray-400 mr-1" />
                    {trader.phoneNumber || "غير محدد"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="text-green-600 mx-2" size={20} />
                معلومات العنوان
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العنوان
                  </label>
                  <div className="text-sm text-gray-900 font-medium flex items-start">
                    <Home size={14} className="text-gray-400 mr-1 mt-0.5" />
                    {trader.address || "غير محدد"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رابط خرائط جوجل
                  </label>
                  <div className="text-sm text-gray-900 font-medium flex items-center">
                    <Globe size={14} className="text-gray-400 mr-1" />
                    <span className="truncate">
                      {trader.googleMapLink || "غير محدد"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="text-purple-600 mx-2" size={20} />
                معلومات العمل
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم السجل التجاري
                  </label>
                  <div className="text-sm text-gray-900 font-medium flex items-center">
                    <FileText size={14} className="text-gray-400 mr-1" />
                    {trader.nationalId || "غير محدد"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الهوية الوطنية
                  </label>
                  <div className="text-sm text-gray-900 font-medium flex items-center">
                    <IdCard size={14} className="text-gray-400 mr-1" />
                    {trader.nationalId2 || "غير محدد"}
                  </div>
                </div>
              </div>

              {trader.describtion && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وصف النشاط التجاري
                  </label>
                  <div className="text-sm text-gray-900 font-medium bg-gray-50 p-3 rounded-lg">
                    {trader.describtion}
                  </div>
                </div>
              )}

              {trader.nameOfbussinessActor && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم ممثل الكيان
                  </label>
                  <div className="text-sm text-gray-900 font-medium">
                    {trader.nameOfbussinessActor}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tax Information Section */}
          {(trader.specialNumber || trader.imageOfcertificate) && (
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="text-orange-600 mx-2" size={20} />
                  المعلومات الضريبية
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trader.specialNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رقم التسجيل الضريبي
                      </label>
                      <div className="text-sm text-gray-900 font-medium flex items-center">
                        <FileText size={14} className="text-gray-400 mr-1" />
                        {trader.specialNumber}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <CreditCard className="text-orange-600 mx-2" size={20} />
                معلومات البنك
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الآيبان
                  </label>
                  <div className="text-sm text-gray-900 font-medium flex items-center">
                    <Banknote size={14} className="text-gray-400 mr-1" />
                    {trader.Iban || "غير محدد"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم البنك
                  </label>
                  <div className="text-sm text-gray-900 font-medium">
                    {trader.nameOfbank || "غير محدد"}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم المستفيد
                  </label>
                  <div className="text-sm text-gray-900 font-medium">
                    {trader.nameOfperson || "غير محدد"}
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
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      getStatusColor(trader) === "red"
                        ? "bg-red-100 text-red-600"
                        : getStatusColor(trader) === "yellow"
                        ? "bg-yellow-100 text-yellow-600"
                        : getStatusColor(trader) === "green"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getStatusIcon(trader)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {getStatusText(trader)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {trader.block
                        ? "حسابك محظور حالياً. يرجى التواصل مع الدعم الفني."
                        : trader.waiting
                        ? "حسابك قيد المراجعة. سيتم إشعارك عند الموافقة."
                        : trader.verify
                        ? "حسابك نشط ويمكنك استخدام جميع الميزات."
                        : "حسابك غير مفعل. يرجى التواصل مع الدعم الفني."}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    تاريخ التسجيل
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(trader.createdAt)}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">آخر نشاط</div>
                  <div className="text-sm font-medium text-gray-900">الآن</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">
                    التحقق من الهاتف
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      trader.verify ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {trader.verify ? "متحقق" : "غير متحقق"}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">معرف التاجر</div>
                  <div className="text-sm font-medium text-gray-900">
                    {trader.UID}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <ImageIcon className="text-indigo-600 mx-2" size={20} />
                المستندات
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    صورة السجل التجاري
                  </h4>
                  {trader.imageOftrading ? (
                    <div className="aspect-square">
                      <img
                        src={trader.imageOftrading}
                        alt="صورة السجل التجاري"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <ImageIcon
                          size={24}
                          className="text-gray-400 mx-auto mb-1"
                        />
                        <p className="text-xs text-gray-500">
                          لم يتم رفع الصورة
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    صورة الهوية
                  </h4>
                  {trader.imageOfnationalId ? (
                    <div className="aspect-square">
                      <img
                        src={trader.imageOfnationalId}
                        alt="صورة الهوية"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <ImageIcon
                          size={24}
                          className="text-gray-400 mx-auto mb-1"
                        />
                        <p className="text-xs text-gray-500">
                          لم يتم رفع الصورة
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    وثائق الآيبان
                  </h4>
                  {trader.imageOfiban ? (
                    <div className="aspect-square">
                      <img
                        src={trader.imageOfiban}
                        alt="وثائق الآيبان"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <ImageIcon
                          size={24}
                          className="text-gray-400 mx-auto mb-1"
                        />
                        <p className="text-xs text-gray-500">
                          لم يتم رفع الوثائق
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    صورة واجهة المحل
                  </h4>
                  {trader.imageOffront ? (
                    <div className="aspect-square">
                      <img
                        src={trader.imageOffront}
                        alt="صورة واجهة المحل"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <ImageIcon
                          size={24}
                          className="text-gray-400 mx-auto mb-1"
                        />
                        <p className="text-xs text-gray-500">
                          لم يتم رفع الصورة
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tax Certificate */}
                {trader.imageOfcertificate && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      صورة البطاقة الضريبية
                    </h4>
                    <div className="aspect-square">
                      <img
                        src={trader.imageOfcertificate}
                        alt="صورة البطاقة الضريبية"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* Store Logo */}
                {trader.logo && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      شعار المتجر
                    </h4>
                    <div className="aspect-square">
                      <img
                        src={trader.logo}
                        alt="شعار المتجر"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                )}

                {/* Bill Image */}
                {trader.billImage && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      صورة فاتورة حديثة
                    </h4>
                    <div className="aspect-square">
                      <img
                        src={trader.billImage}
                        alt="صورة فاتورة حديثة"
                        className="w-full h-full object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
