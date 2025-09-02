"use client";
import { useState, useEffect } from "react";
import {
  Search,
  User,
  Package,
  ShoppingCart,
  UserPlus,
  Check,
  Plus,
} from "lucide-react";
import Container from "@/app/components/Container";
import { BaseUrl } from "@/app/components/Baseurl";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import FormField from "@/app/components/ui/Formfield";
import Image from "next/image";
import Logo from "../../../../../public/asset/images/ويمي تك.jpg";
import { toArabicFullDate } from "@/app/lib/fun";
import ProductForm from "./components/ProductForm";
import OrdersTable from "./components/OrdersTable";
import SendPaymentLink from "./components/SendPaymentLink";

interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  favourites: [];
  createdAt: string;
  __v: number;
}

const DirectPaymentPage = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userFound, setUserFound] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataUser, setDataUser] = useState<UserInfo>();
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showSendLinkModal, setShowSendLinkModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const token = Cookies.get("token_admin");

  const checkUser = async () => {
    if (!phoneNumber.trim()) {
      toast.error("يرجى إدخال رقم الهاتف");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BaseUrl}traders/checkFoundUser`,
        { phoneNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUserFound(true);
        setUserId(response.data.data.userId._id);
        setStep(2);
        toast.success("تم العثور على المستخدم");
        setDataUser(response.data.data.userId);
      } else {
        setUserFound(false);
        setStep(3);
        toast("المستخدم غير موجود، يرجى إكمال بيانات التسجيل", { icon: "ℹ️" });
      }
    } catch (error: any) {
      if (
        error.response?.status === 404 ||
        error.response?.data?.message?.includes("User not found") ||
        error.response?.data?.message?.includes("not found")
      ) {
        setUserFound(false);
        setStep(3);
        toast("المستخدم غير موجود، يرجى إكمال بيانات التسجيل", { icon: "ℹ️" });
      } else {
        toast.error("خطأ في البحث عن المستخدم");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setPhoneNumber("");
    setUserFound(false);
    setUserId("");
    setDataUser(undefined);
    setRefreshTrigger(0);
  };

  const handleProductAdded = () => {
    toast.success("تم إضافة المنتج بنجاح");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleOrderDeleted = () => {
    toast.success("تم حذف الطلب بنجاح");
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLinkSent = () => {
    setShowSendLinkModal(false);
    toast.success("تم إرسال رابط الدفع بنجاح");
  };

  const openSendLinkModal = (orderId: string, quantity: number, price: number) => {
    setSelectedOrderId(orderId);
    setSelectedQuantity(quantity);
    setSelectedPrice(price);
    setShowSendLinkModal(true);
  };

  return (
    <Container>
      <div
        className="min-h-screen bg-gradient-to-br from-[#F7F3FF] via-[#FCFAFD] to-[#FFFDFE] p-4 sm:p-6 md:p-8"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-gray-100">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-gray-200 shadow-md w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
                  unoptimized
                />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent mb-2">
                المدفوعات المباشرة
              </h1>
              <p className="text-sm sm:text-base text-gray-600">إدارة الطلبات والمدفوعات المباشرة</p>
            </div>

            <div className="flex justify-center mt-4 sm:mt-6">
              <div className="flex items-center space-x-2 sm:space-x-4 rtl:space-x-reverse">
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
                    step >= 1
                      ? "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white shadow-md"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Search size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div
                  className={`h-1 w-8 sm:w-16 rounded-full transition-all duration-300 ${
                    step >= 2
                      ? "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155]"
                      : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
                    step >= 2
                      ? "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white shadow-md"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Package size={16} className="sm:w-5 sm:h-5" />
                </div>
                <div
                  className={`h-1 w-8 sm:w-16 rounded-full transition-all duration-300 ${
                    step >= 3
                      ? "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155]"
                      : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 ${
                    step >= 3
                      ? "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white shadow-md"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <ShoppingCart size={16} className="sm:w-5 sm:h-5" />
                </div>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
              <div className="text-center mb-4 sm:mb-6">
                <User className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-700 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent">
                  البحث عن العميل
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">ادخل رقم هاتف العميل للبحث</p>
              </div>

              <div className="max-w-md mx-auto">
                <FormField
                  fields={[
                    {
                      name: "phoneNumber",
                      label: "رقم الهاتف",
                      type: "phoneNumber" as any,
                      placeholder: "01xxxxxxxxx",
                      requierd: true,
                    },
                  ]}
                  data={{ phoneNumber }}
                  onChange={(data) => setPhoneNumber(data.phoneNumber || "")}
                />
                <button
                  onClick={checkUser}
                  disabled={loading}
                  className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white py-2 sm:py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base"
                >
                  {loading ? "جاري البحث..." : "بحث"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && userFound && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
              <div className="text-center mb-4 sm:mb-6">
                <section dir="rtl" className="w-full max-w-md mx-auto">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-500 mx-auto mb-2 sm:mb-3" />
                    <h2 className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-5 font-semibold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent">
                      تم العثور على العميل
                    </h2>

                    <dl className="grid grid-cols-1 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <dt className="text-gray-500">اسم العميل</dt>
                        <dd className="text-gray-900 font-medium truncate">
                          {dataUser?.firstName || "—"}{" "}
                          {dataUser?.lastName || "—"}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <dt className="text-gray-500">البريد الإلكتروني</dt>
                        <dd className="text-gray-900 font-medium truncate">
                          {dataUser?.email}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <dt className="text-gray-500">رقم الهاتف</dt>
                        <dd className="text-gray-900 font-medium">
                          {dataUser?.phoneNumber}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <dt className="text-gray-500">تاريخ الإنشاء</dt>
                        <dd className="text-gray-900 font-medium">
                          {toArabicFullDate(dataUser?.createdAt ?? "")}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </section>
              </div>

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    إدارة الطلبات
                  </h3>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md text-sm sm:text-base"
                    >
                      <Plus size={16} className="sm:w-5 sm:h-5" />
                      إضافة منتج جديد
                    </button>
                  </div>
                </div>

                <OrdersTable
                  phoneNumber={dataUser?.phoneNumber || ""}
                  onOrderDeleted={handleOrderDeleted}
                  onSendPaymentLink={openSendLinkModal}
                  refreshTrigger={refreshTrigger}
                />
              </div>

              <div className="flex space-x-3 sm:space-x-4 rtl:space-x-reverse mt-4 sm:mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-500 text-white py-2 sm:py-3 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
                >
                  رجوع
                </button>
              </div>
            </div>
          )}

          {step === 3 && !userFound && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-100">
              <div className="text-center mb-4 sm:mb-6">
                <UserPlus className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-orange-500 mx-auto mb-3 sm:mb-4" />
                <h2 className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent">
                  تسجيل عميل جديد
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                  أكمل بيانات العميل لإنشاء حساب جديد
                </p>
              </div>

              <div className="mb-4 sm:mb-6">
                <FormField
                  fields={[
                    {
                      name: "phoneNumber",
                      label: "رقم الهاتف",
                      type: "phoneNumber" as any,
                      requierd: true,
                    },
                  ]}
                  data={{ phoneNumber }}
                  onChange={(data) => setPhoneNumber(data.phoneNumber || "")}
                />
              </div>

              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    إدارة الطلبات
                  </h3>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md text-sm sm:text-base"
                    >
                      <Plus size={16} className="sm:w-5 sm:h-5" />
                      إضافة منتج جديد
                    </button>
                  </div>
                </div>

                <OrdersTable
                  phoneNumber={phoneNumber}
                  onOrderDeleted={handleOrderDeleted}
                  onSendPaymentLink={openSendLinkModal}
                  refreshTrigger={refreshTrigger}
                />
              </div>

              <div className="flex space-x-3 sm:space-x-4 rtl:space-x-reverse mt-4 sm:mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-500 text-white py-2 sm:py-3 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base"
                >
                  رجوع
                </button>
              </div>
            </div>
          )}

          {step > 1 && (
            <div className="text-center mt-4 sm:mt-6">
              <button
                onClick={resetForm}
                className="text-blue-500 hover:text-blue-700 underline transition duration-200 text-sm sm:text-base"
              >
                بدء عملية جديدة
              </button>
            </div>
          )}
        </div>

        {showAddProductModal && (
          <ProductForm
            onProductAdded={handleProductAdded}
            onClose={() => setShowAddProductModal(false)}
            phoneNumber={dataUser?.phoneNumber || phoneNumber}
          />
        )}

        {showSendLinkModal && (
          <SendPaymentLink
            phoneNumber={dataUser?.phoneNumber || phoneNumber}
            orderId={selectedOrderId}
            quantity={selectedQuantity}
            price={selectedPrice}
            onLinkSent={handleLinkSent}
          />
        )}
      </div>
    </Container>
  );
};

export default DirectPaymentPage;