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
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Add refresh trigger state
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
        {
          phoneNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
    setRefreshTrigger(0); // Reset refresh trigger
  };

  const handleProductAdded = () => {
    toast.success("تم إضافة المنتج بنجاح");
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh by incrementing
  };

  const handleOrderDeleted = () => {
    toast.success("تم حذف الطلب بنجاح");
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh by incrementing
  };

  const handleLinkSent = () => {
    setShowSendLinkModal(false);
    toast.success("تم إرسال رابط الدفع بنجاح");
  };

  const openSendLinkModal = (
    orderId: string,
    quantity: number,
    price: number
  ) => {
    setSelectedOrderId(orderId);
    setSelectedQuantity(quantity);
    setSelectedPrice(price);
    setShowSendLinkModal(true);
  };

  return (
    <Container>
      <div
        className="min-h-screen bg-gradient-to-br from-[#F7F3FF] via-[#FCFAFD] to-[#FFFDFE] p-4 md:p-6"
        dir="rtl"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-100">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-gray-200 shadow-md"
                  unoptimized
                />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent mb-2">
                المدفوعات المباشرة
              </h1>
              <p className="text-gray-600">إدارة الطلبات والمدفوعات المباشرة</p>
            </div>

            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    step >= 1
                      ? "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white shadow-md"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Search size={20} />
                </div>
                <div
                  className={`h-1 w-16 rounded-full transition-all duration-300 ${
                    step >= 2
                      ? "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155]"
                      : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    step >= 2
                      ? "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white shadow-md"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <Package size={20} />
                </div>
                <div
                  className={`h-1 w-16 rounded-full transition-all duration-300 ${
                    step >= 3
                      ? "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155]"
                      : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    step >= 3
                      ? "bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white shadow-md"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <ShoppingCart size={20} />
                </div>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-6">
                <User className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent">
                  البحث عن العميل
                </h2>
                <p className="text-gray-600 mt-2">ادخل رقم هاتف العميل للبحث</p>
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
                  className="w-full mt-4 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? "جاري البحث..." : "بحث"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && userFound && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-6">
                <section dir="rtl" className={`w-full max-w-md mx-auto`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <Check className="w-10 h-10 text-green-500 mx-auto mb-2" />
                    <h2 className="text-2xl mb-5 font-semibold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent">
                      تم العثور على العميل
                    </h2>

                    <dl className="grid grid-cols-1 gap-3 text-sm">
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-gray-500">اسم العميل</dt>
                        <dd className="text-gray-900 font-medium truncate">
                          {dataUser?.firstName || "—"}{" "}
                          {dataUser?.lastName || "—"}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-gray-500">البريد الإلكتروني</dt>
                        <dd className="text-gray-900 font-medium truncate">
                          {dataUser?.email}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-gray-500">رقم الهاتف</dt>
                        <dd className="text-gray-900 font-medium">
                          {dataUser?.phoneNumber}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-gray-500">تاريخ الإنشاء</dt>
                        <dd className="text-gray-900 font-medium">
                          {toArabicFullDate(dataUser?.createdAt ?? "")}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </section>
              </div>

              {/* Orders Management Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    إدارة الطلبات
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md"
                    >
                      <Plus size={20} />
                      إضافة منتج جديد
                    </button>
                  </div>
                </div>

                {/* Orders Table */}
                <OrdersTable
                  phoneNumber={dataUser?.phoneNumber || ""}
                  onOrderDeleted={handleOrderDeleted}
                  onSendPaymentLink={openSendLinkModal}
                  refreshTrigger={refreshTrigger} // Pass the refresh trigger
                />
              </div>

              <div className="flex space-x-4 rtl:space-x-reverse mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  رجوع
                </button>
              </div>
            </div>
          )}

          {step === 3 && !userFound && (
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-6">
                <UserPlus className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent">
                  تسجيل عميل جديد
                </h2>
                <p className="text-gray-600 mt-2">
                  أكمل بيانات العميل لإنشاء حساب جديد
                </p>
              </div>

              <div className="mb-6">
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

              {/* Orders Management Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    إدارة الطلبات
                  </h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddProductModal(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-300 shadow-md"
                    >
                      <Plus size={20} />
                      إضافة منتج جديد
                    </button>
                  </div>
                </div>

                {/* Orders Table */}
                <OrdersTable
                  phoneNumber={phoneNumber}
                  onOrderDeleted={handleOrderDeleted}
                  onSendPaymentLink={openSendLinkModal}
                  refreshTrigger={refreshTrigger} // Pass the refresh trigger
                />
              </div>

              <div className="flex space-x-4 rtl:space-x-reverse mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
                >
                  رجوع
                </button>
              </div>
            </div>
          )}

          {step > 1 && (
            <div className="text-center mt-6">
              <button
                onClick={resetForm}
                className="text-blue-500 hover:text-blue-700 underline transition duration-200"
              >
                بدء عملية جديدة
              </button>
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        {showAddProductModal && (
          <ProductForm
            onProductAdded={handleProductAdded}
            onClose={() => setShowAddProductModal(false)}
            phoneNumber={dataUser?.phoneNumber || phoneNumber}
          />
        )}

        {/* Send Payment Link Modal */}
        {showSendLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    إرسال رابط الدفع
                  </h3>
                  <button
                    onClick={() => setShowSendLinkModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
              <SendPaymentLink
                phoneNumber={dataUser?.phoneNumber || phoneNumber}
                orderId={selectedOrderId}
                quantity={selectedQuantity}
                price={selectedPrice}
                onLinkSent={handleLinkSent}
              />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default DirectPaymentPage;
