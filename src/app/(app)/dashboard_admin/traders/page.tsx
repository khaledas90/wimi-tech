"use client";
import { BaseUrl } from "@/app/components/Baseurl";
import PaginationComp from "@/app/components/Pagination";
import { ResponseData } from "@/app/lib/type";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Trash2,
  Ban,
  Bell,
  Clock,
  Store,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Search,
  Filter,
  X,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function TradersManagementPage() {
  const [data, setData] = useState<ResponseData>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    type: "block" | "unblock" | "delete";
    trader: any;
  } | null>(null);

  const urlTraders = `${BaseUrl}admin/users`;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${urlTraders}?page=${page}`);
      setData({
        users: [],
        traders: res.data.data.traders,
        pagination: {
          totalUserPages: 0,
          totalTraderPages: res.data.data.pagination.totalTraderPages,
          totalUsers: 0,
          totalTraders: res.data.data.pagination.totalTraders,
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

  const performAction = async (
    id: string,
    type: "del" | "block",
    role: "trader"
  ) => {
    try {
      await axios.post(
        `${urlTraders}/${id}/${type}`,
        {},
        {
          params: { role },
        }
      );
      fetchData();
    } catch (error) {
      toast.error("حدث خطأ أثناء تنفيذ العملية");
    }
  };

  const handleDelete = (trader: any) => {
    setModalData({ type: "delete", trader });
    setShowModal(true);
  };

  const handleTraderBlock = (trader: any) => {
    const actionType = trader.block ? "unblock" : "block";
    setModalData({ type: actionType, trader });
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!modalData) return;

    const { type, trader } = modalData;

    try {
      if (type === "delete") {
        await performAction(trader._id, "del", "trader");
        toast.success("تم حذف التاجر بنجاح");
      } else if (type === "block") {
        await axios.post(
          `${BaseUrl}admin/users/${trader._id}/block`,
          {},
          {
            params: { role: "trader" },
          }
        );
        toast.success("تم حظر التاجر بنجاح");
      } else if (type === "unblock") {
        await axios.post(
          `${BaseUrl}admin/users/${trader._id}/block`,
          {},
          {
            params: { role: "trader" },
          }
        );
        toast.success("تم فك حظر التاجر بنجاح");
      }

      fetchData();
      setShowModal(false);
      setModalData(null);
    } catch (error) {
      toast.error("حدث خطأ أثناء تنفيذ العملية");
    }
  };

  const filteredTraders =
    data?.traders?.filter(
      (trader) =>
        (trader.firstName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (trader.lastName?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (trader.email?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (trader.phoneNumber || "").includes(searchTerm) ||
        (trader.address?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    ) || [];

  const TraderCard = ({ trader }: { trader: any }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Store className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            {trader.firstName || "غير محدد"} {trader.lastName || "غير محدد"}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">تاجر</p>
            {trader.block && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                محظور
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{trader.email || "غير محدد"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {trader.phoneNumber || "غير محدد"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">{trader.address || "غير محدد"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {moment(trader.createdAt).format("YYYY/MM/DD HH:mm")}
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button
          title={trader.block ? "فك الحظر" : "حظر"}
          onClick={() => handleTraderBlock(trader)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
            trader.block
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          <Ban className="w-4 h-4" />
          <span>{trader.block ? "فك الحظر" : "حظر"}</span>
        </button>
        <button
          title="حذف"
          onClick={() => handleDelete(trader)}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          <Trash2 className="w-4 h-4" />
          <span>حذف</span>
        </button>

        <Link
          href={`/dashboard_admin/notification/${trader._id}`}
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          <Bell className="w-4 h-4" />
          <span>إشعار</span>
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
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  إدارة التجار
                </h1>
                <p className="text-gray-600 mt-1">
                  إدارة جميع التجار المسجلين في النظام
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {data?.pagination.totalTraders || 0}
              </div>
              <div className="text-sm text-gray-500">إجمالي التجار</div>
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
                placeholder="البحث عن التجار..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors duration-200">
              <Filter className="w-5 h-5" />
              <span>تصفية</span>
            </button>
          </div>
        </div>

        <section>
          <div className="space-y-4 lg:hidden">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">جاري التحميل...</p>
              </div>
            ) : filteredTraders.length === 0 ? (
              <div className="text-center py-12">
                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  لا يوجد تجار في هذه الصفحة
                </p>
              </div>
            ) : (
              filteredTraders.map((trader) => (
                <TraderCard key={trader._id} trader={trader} />
              ))
            )}
          </div>

          {/* Table View (desktop only) */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-500 mt-4">جاري التحميل...</p>
              </div>
            ) : filteredTraders.length === 0 ? (
              <div className="text-center py-12">
                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  لا يوجد تجار في هذه الصفحة
                </p>
              </div>
            ) : (
              <table className="min-w-full">
                <TableHeader
                  headers={[
                    "الاسم",
                    "الإيميل",
                    "رقم الهاتف",
                    "العنوان",
                    "الإجراءات",
                  ]}
                />
                <tbody>
                  {filteredTraders.map((trader) => (
                    <tr
                      key={trader._id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <Store className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {trader.firstName || "غير محدد"}{" "}
                              {trader.lastName || "غير محدد"}
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm text-gray-500">تاجر</div>
                              {trader.block && (
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                                  محظور
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {trader.email || "غير محدد"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {trader.phoneNumber || "غير محدد"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {trader.address || "غير محدد"}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            title={trader.block ? "فك الحظر" : "حظر"}
                            onClick={() => handleTraderBlock(trader)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              trader.block
                                ? "text-green-500 hover:text-green-700 hover:bg-green-50"
                                : "text-red-500 hover:text-red-700 hover:bg-red-50"
                            }`}
                          >
                            <Ban className="w-5 h-5" />
                          </button>
                          <button
                            title="حذف"
                            onClick={() => handleDelete(trader)}
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>

                          <Link
                            href={`/dashboard_admin/notification/${trader._id}`}
                            className="text-purple-500 hover:text-purple-700 p-2 rounded-lg hover:bg-purple-50 transition-colors duration-200"
                          >
                            <Bell className="w-5 h-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Pagination */}
        {data?.pagination.totalTraderPages &&
          data.pagination.totalTraderPages > 1 && (
            <div className="flex justify-center">
              <PaginationComp
                page={page}
                totalPages={data.pagination.totalTraderPages}
                onPageChange={setPage}
              />
            </div>
          )}

        {/* Confirmation Modal */}
        {showModal && modalData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        modalData.type === "delete"
                          ? "bg-red-100"
                          : modalData.type === "block"
                          ? "bg-red-100"
                          : "bg-green-100"
                      }`}
                    >
                      {modalData.type === "delete" ? (
                        <Trash2 className="w-6 h-6 text-red-600" />
                      ) : modalData.type === "block" ? (
                        <Ban className="w-6 h-6 text-red-600" />
                      ) : (
                        <Ban className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {modalData.type === "delete" && "تأكيد الحذف"}
                        {modalData.type === "block" && "تأكيد الحظر"}
                        {modalData.type === "unblock" && "تأكيد فك الحظر"}
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <Store className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {modalData.trader.firstName || "غير محدد"}{" "}
                          {modalData.trader.lastName || "غير محدد"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {modalData.trader.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-700">
                      {modalData.type === "delete" && (
                        <p>
                          هل أنت متأكد من حذف هذا التاجر؟ لا يمكن التراجع عن هذا
                          الإجراء.
                        </p>
                      )}
                      {modalData.type === "block" && (
                        <p>
                          هل أنت متأكد من حظر هذا التاجر؟ سيتم منعه من استخدام
                          النظام.
                        </p>
                      )}
                      {modalData.type === "unblock" && (
                        <p>
                          هل أنت متأكد من فك حظر هذا التاجر؟ سيتمكن من استخدام
                          النظام مرة أخرى.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={confirmAction}
                    className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                      modalData.type === "delete"
                        ? "bg-red-500 hover:bg-red-600"
                        : modalData.type === "block"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {modalData.type === "delete" && "حذف"}
                    {modalData.type === "block" && "حظر"}
                    {modalData.type === "unblock" && "فك الحظر"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
