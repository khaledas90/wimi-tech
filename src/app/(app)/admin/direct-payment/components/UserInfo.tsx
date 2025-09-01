"use client";
import { Check } from "lucide-react";
import { toArabicFullDate } from "@/app/lib/fun";

interface UserInfoProps {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    favourites: [];
    createdAt: string;
    __v: number;
  };
}

const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="text-center mb-6">
        <Check className="w-10 h-10 text-green-500 mx-auto mb-2" />
        <h2 className="text-2xl mb-5 font-semibold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent">
          تم العثور على العميل
        </h2>
        <p className="text-gray-600 mt-2">معلومات العميل</p>
      </div>

      <section dir="rtl" className={`w-full max-w-md mx-auto`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <dl className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">اسم العميل</dt>
              <dd className="text-gray-900 font-medium truncate">
                {user?.firstName || "—"}{" "}
                {user?.lastName || "—"}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">البريد الإلكتروني</dt>
              <dd className="text-gray-900 font-medium truncate">
                {user?.email}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">رقم الهاتف</dt>
              <dd className="text-gray-900 font-medium">
                {user?.phoneNumber}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">تاريخ الإنشاء</dt>
              <dd className="text-gray-900 font-medium">
                {toArabicFullDate(user?.createdAt ?? "")}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">المفضلات</dt>
              <dd className="text-gray-900 font-medium">
                {user?.favourites?.length
                  ? `${user?.favourites.length} عنصر`
                  : "لا توجد عناصر"}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">الإصدار</dt>
              <dd className="text-gray-900 font-medium">
                {user?.__v}
              </dd>
            </div>

            <div className="flex items-start justify-between gap-4">
              <dt className="text-gray-500">كلمة المرور</dt>
              <dd className="text-gray-900 font-medium">
                — مخفية (آمنة) —
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
};

export default UserInfo;
