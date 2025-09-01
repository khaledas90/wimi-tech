'use client';

import React, { useEffect, useState } from 'react';
import { BaseUrl } from '@/app/components/Baseurl';
import { User_waiting, Pagination } from '@/app/lib/type';
import toast from 'react-hot-toast';
import axios from 'axios';
import Container from '@/app/components/Container';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import PaginationComp from '@/app/components/Pagination';

export default function User_cog() {
  const User_waiting_URL = `${BaseUrl}admin/waiting`;
  const [page, setPage] = useState(1);

  const [data, setData] = useState<{
    users: User_waiting[];
    pagination: Pagination;
  }>({
    users: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    }
  });

  const fetchUsers = async () => {
    try {
      const response = await axios.get(User_waiting_URL, {
        params: { page }
      });

   setData({
  users: response.data.data.data, // ← users array
  pagination: response.data.data.pagination
});

    } catch (error) {
      toast.error('فشل في تحميل المستخدمين');
    }
  };
const handleBlockUser = async (userId: string) => {
  try {
    await axios.post(`${User_waiting_URL}/${userId}`);

    toast.success('✅ تم قفل المستخدم');
    fetchUsers(); // لتحديث البيانات بعد القفل
  } catch (error) {
    toast.error('❌ فشل في قفل المستخدم');
    console.error(error);
  }
};



  useEffect(() => {
    fetchUsers();
  }, [page]);
return (
<Container>
  <section className="mt-10">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center md:text-right">
      📋 قائمة المستخدمين في الانتظار
    </h1>

    {data.users.length === 0 ? (
      <p className="text-gray-500 text-center">لا يوجد مستخدمين حاليًا.</p>
    ) : (
      <>
        {/* 📱 موبايل + تابلت: عرض بالكروت */}
        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
          {data.users.map((user) => (
            <div key={user._id} className="bg-white p-5 rounded-xl shadow border">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  👤 {user.firstName} {user.lastName}
                </h2>
                <button
                  onClick={() => handleBlockUser(user._id)}
                  className="text-red-600 hover:text-red-800"
                  title="قفل المستخدم"
                >
                  <Lock size={20} />
                </button>
              </div>
              <p><span className="font-semibold">📧 البريد:</span> {user.email}</p>
              <p><span className="font-semibold">📞 الهاتف:</span> {user.phoneNumber}</p>
              <p><span className="font-semibold">🏠 العنوان:</span> {user.address}</p>
              <p>
                <span className="font-semibold">🔒 الحالة:</span>{" "}
                {user.verify ? (
                  <span className="text-green-600 font-medium">✅ مفعل</span>
                ) : (
                  <span className="text-red-500 font-medium">❌ غير مفعل</span>
                )}
              </p>
              <p>
                <Link
                  href={user.googleMapLink}
                  target="_blank"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  🗺️ عرض على الخريطة
                </Link>
              </p>
            </div>
          ))}
        </div>

        {/* 💻 ديسكتوب: جدول فقط */}
        <div className="hidden lg:block w-full overflow-x-auto mt-6">
          <table className="w-full min-w-[900px] bg-white rounded-xl shadow-md border border-gray-200 text-sm md:text-base">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-3 text-right whitespace-nowrap">الاسم</th>
                <th className="p-3 text-right whitespace-nowrap">البريد</th>
                <th className="p-3 text-right whitespace-nowrap">الهاتف</th>
                <th className="p-3 text-right whitespace-nowrap">العنوان</th>
                <th className="p-3 text-right whitespace-nowrap">الحالة</th>
                <th className="p-3 text-right whitespace-nowrap">الخريطة</th>
                <th className="p-3 text-center whitespace-nowrap">إجراء</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {data.users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t hover:bg-slate-50 transition duration-200"
                >
                  <td className="p-3 whitespace-nowrap">{user.firstName} {user.lastName}</td>
                  <td className="p-3 break-words max-w-[200px]">{user.email}</td>
                  <td className="p-3 whitespace-nowrap">{user.phoneNumber}</td>
                  <td className="p-3 break-words max-w-[200px]">{user.address}</td>
                  <td className="p-3 whitespace-nowrap">
                    {user.verify ? (
                      <span className="text-green-600 font-semibold">✅ مفعل</span>
                    ) : (
                      <span className="text-red-500 font-semibold">❌ غير مفعل</span>
                    )}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <Link
                      href={user.googleMapLink}
                      target="_blank"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      عرض
                    </Link>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleBlockUser(user._id)}
                      className="text-red-600 hover:text-red-800 transition"
                      title="قفل المستخدم"
                    >
                      <Lock size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}

    <div className="mt-6 flex justify-center">
      <PaginationComp
        page={page}
        totalPages={data.pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  </section>
</Container>

);



}
