"use client";
import { BaseUrl } from "@/app/components/Baseurl";
import PaginationComp from "@/app/components/Pagination";
import { ResponseData } from "@/app/lib/type";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Bell,
  Users,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function UsersManagementPage() {
  const [data, setData] = useState<ResponseData>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const urlUsers = `${BaseUrl}admin/users`;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${urlUsers}?page=${page}`);
      setData({
        users: res.data.data.users,
        traders: [],
        pagination: {
          totalUserPages: res.data.data.pagination.totalUserPages,
          totalTraderPages: 0,
          totalUsers: res.data.data.pagination.totalUsers,
          totalTraders: 0,
          page: res.data.data.pagination.page,
          limit: res.data.data.pagination.limit,
        },
      });
    } catch (err) {
      toast.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const filteredUsers =
    data?.users?.filter(
      (user) =>
        (user.username?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) || (user.phoneNumber || "").includes(searchTerm)
    ) || [];

  const UserCard = ({ user }: { user: any }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            {user.username || "غير محدد"}
          </h3>
          <p className="text-sm text-gray-500">مستخدم</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {user.phoneNumber || "غير محدد"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {moment(user.createdAt).format("YYYY/MM/DD HH:mm")}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`w-2 h-2 rounded-full ${
              user.verify ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-gray-600">
            {user.verify ? "مُتحقق" : "غير مُتحقق"}
          </span>
        </div>
        {user.UID && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">UID:</span>
            <span className="text-gray-600 font-mono">{user.UID}</span>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Link
          href={`/dashboard_admin/notification/${user._id}`}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          <Bell className="w-4 h-4" />
          <span>إرسال إشعار</span>
        </Link>
      </div>
    </div>
  );

  const TableHeader = ({ headers }: { headers: string[] }) => (
    <thead>
      <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-sm">
        {headers.map((h, i) => (
          <th
            key={i}
            className="p-4 text-right whitespace-nowrap font-semibold"
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  إدارة المستخدمين
                </h1>
                <p className="text-gray-600 mt-1">
                  إدارة جميع المستخدمين المسجلين في النظام
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {data?.pagination.totalUsers || 0}
              </div>
              <div className="text-sm text-gray-500">إجمالي المستخدمين</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="البحث عن المستخدمين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors duration-200">
              <Filter className="w-5 h-5" />
              <span>تصفية</span>
            </button>
          </div>
        </div>

        {/* Users Section */}
        <section>
          {/* Cards View (mobile + tablet) */}
          <div className="space-y-4 lg:hidden">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">جاري التحميل...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  لا يوجد مستخدمين في هذه الصفحة
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <UserCard key={user._id} user={user} />
              ))
            )}
          </div>

          {/* Table View (desktop only) */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">جاري التحميل...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  لا يوجد مستخدمين في هذه الصفحة
                </p>
              </div>
            ) : (
              <table className="min-w-full">
                <TableHeader
                  headers={[
                    "اسم المستخدم",
                    "رقم الهاتف",
                    "تاريخ التسجيل",
                    "حالة التحقق",
                    "الإجراءات",
                  ]}
                />
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {user.username || "غير محدد"}
                            </div>
                            <div className="text-sm text-gray-500">مستخدم</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {user.phoneNumber || "غير محدد"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {moment(user.createdAt).format("YYYY/MM/DD HH:mm")}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                user.verify ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></div>
                            <span className="text-gray-600">
                              {user.verify ? "مُتحقق" : "غير مُتحقق"}
                            </span>
                          </div>
                          {user.UID && (
                            <div className="text-xs text-gray-500 font-mono">
                              UID: {user.UID}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/dashboard_admin/notification/${user._id}`}
                          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        >
                          <Bell className="w-4 h-4" />
                          <span>إشعار</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Pagination */}
        {data?.pagination.totalUserPages &&
          data.pagination.totalUserPages > 1 && (
            <div className="flex justify-center">
              <PaginationComp
                page={page}
                totalPages={data.pagination.totalUserPages}
                onPageChange={setPage}
              />
            </div>
          )}
      </div>
    </div>
  );
}
