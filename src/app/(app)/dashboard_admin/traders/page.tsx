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
  Eye,
  User,
  CreditCard,
  FileText,
  Globe,
  Copy,
  Check,
  DollarSign,
  Edit,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function TradersManagementPage() {
  const [data, setData] = useState<ResponseData>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTraderModal, setShowTraderModal] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<any>(null);
  const [traderDetails, setTraderDetails] = useState<any>(null);
  const [loadingTraderDetails, setLoadingTraderDetails] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedTraderForWallet, setSelectedTraderForWallet] =
    useState<any>(null);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
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

  const fetchTraderDetails = async (traderId: string) => {
    setLoadingTraderDetails(true);
    try {
      const response = await axios.get(
        `${BaseUrl}admin/get-trader/${traderId}`
      );
      if (response.data.success) {
        setTraderDetails(response.data.data);
      } else {
        toast.error("فشل في جلب تفاصيل التاجر");
      }
    } catch (error) {
      console.error("Error fetching trader details:", error);
      toast.error("حدث خطأ أثناء جلب تفاصيل التاجر");
    } finally {
      setLoadingTraderDetails(false);
    }
  };

  const handleViewTrader = (trader: any) => {
    setSelectedTrader(trader);
    setShowTraderModal(true);
    fetchTraderDetails(trader._id);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      toast.success("تم نسخ الرابط بنجاح");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      toast.error("فشل في نسخ الرابط");
    }
  };

  const handleUpdateWallet = (trader: any) => {
    setSelectedTraderForWallet(trader);
    setWalletAmount((trader as any).wallet?.toString() || "0");
    setShowWalletModal(true);
  };

  const updateWalletAmount = async () => {
    if (!selectedTraderForWallet || !walletAmount) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }

    const amount = parseFloat(walletAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("يرجى إدخال مبلغ صحيح أكبر من أو يساوي صفر");
      return;
    }

    setWalletLoading(true);
    try {
      const response = await fetch(`${BaseUrl}admin/update-wallet`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount,
          traderId: selectedTraderForWallet._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("تم تحديث المحفظة بنجاح");
        setShowWalletModal(false);
        setSelectedTraderForWallet(null);
        setWalletAmount("");
        fetchData(); // Refresh the data
      } else {
        toast.error(data.message || "فشل في تحديث المحفظة");
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      toast.error("حدث خطأ أثناء تحديث المحفظة");
    } finally {
      setWalletLoading(false);
    }
  };

  const extractGoogleMapsEmbedUrl = (googleMapLink: string) => {
    try {
      const url = new URL(googleMapLink);

      // Check if it's a Google Maps search URL
      if (
        url.hostname.includes("google.com") &&
        url.pathname.includes("/search")
      ) {
        // Extract search query
        const searchQuery = url.searchParams.get("q");
        if (searchQuery) {
          return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
            searchQuery
          )}`;
        }
      }

      // For other Google Maps URLs, return a generic embed URL
      return `https://www.google.com/maps/embed/v1/search?key=YOUR_API_KEY&q=${encodeURIComponent(
        googleMapLink
      )}`;
    } catch (error) {
      console.error("Error parsing Google Maps URL:", error);
      return null;
    }
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
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-green-600">
            {((trader as any).wallet || 0).toLocaleString()} ر.س
          </span>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        <button
          title="عرض التفاصيل"
          onClick={() => handleViewTrader(trader)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          <Eye className="w-4 h-4" />
          <span>عرض</span>
        </button>
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
            <div className="overflow-x-auto">
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
                <table className="min-w-full overflow-x-auto">
                  <TableHeader
                    headers={[
                      "الاسم",
                      "الإيميل",
                      "رقم الهاتف",
                      "العنوان",
                      "المحفظة",
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
                                <div className="text-sm text-gray-500">
                                  تاجر
                                </div>
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
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-green-600">
                              {((trader as any).wallet || 0).toLocaleString()}{" "}
                              ر.س
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              title="عرض التفاصيل"
                              onClick={() => handleViewTrader(trader)}
                              className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
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

        {/* Trader Details Modal */}
        {showTraderModal && selectedTrader && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                      <Store className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        تفاصيل التاجر
                      </h3>
                      <p className="text-gray-600">
                        {selectedTrader.firstName} {selectedTrader.lastName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowTraderModal(false);
                      setSelectedTrader(null);
                      setTraderDetails(null);
                      setCopiedLink(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {loadingTraderDetails ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">جاري تحميل التفاصيل...</p>
                  </div>
                ) : traderDetails ? (
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-green-600" />
                        المعلومات الأساسية
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">
                              البريد الإلكتروني
                            </p>
                            <p className="font-medium text-gray-900">
                              {traderDetails.email || "غير محدد"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">رقم الهاتف</p>
                            <p className="font-medium text-gray-900">
                              {traderDetails.phoneNumber || "غير محدد"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">العنوان</p>
                            <p className="font-medium text-gray-900">
                              {traderDetails.address || "غير محدد"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">
                              تاريخ التسجيل
                            </p>
                            <p className="font-medium text-gray-900">
                              {moment(traderDetails.createdAt).format(
                                "YYYY/MM/DD HH:mm"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    {(traderDetails.nationalId ||
                      traderDetails.Iban ||
                      traderDetails.nameOfbank) && (
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          المعلومات التجارية
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {traderDetails.nationalId && (
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">
                                  الهوية الوطنية
                                </p>
                                <p className="font-medium text-gray-900">
                                  {traderDetails.nationalId}
                                </p>
                              </div>
                            </div>
                          )}
                          {traderDetails.Iban && (
                            <div className="flex items-center gap-3">
                              <CreditCard className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">
                                  رقم الآيبان
                                </p>
                                <p className="font-medium text-gray-900">
                                  {traderDetails.Iban}
                                </p>
                              </div>
                            </div>
                          )}
                          {traderDetails.nameOfbank && (
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">
                                  اسم البنك
                                </p>
                                <p className="font-medium text-gray-900">
                                  {traderDetails.nameOfbank}
                                </p>
                              </div>
                            </div>
                          )}
                          {traderDetails.nameOfperson && (
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">
                                  اسم صاحب الحساب
                                </p>
                                <p className="font-medium text-gray-900">
                                  {traderDetails.nameOfperson}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status Information */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-600" />
                        حالة الحساب
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              traderDetails.verify
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm text-gray-500">حالة التحقق</p>
                            <p
                              className={`font-medium ${
                                traderDetails.verify
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {traderDetails.verify ? "محقق" : "غير محقق"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              traderDetails.block
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm text-gray-500">حالة الحظر</p>
                            <p
                              className={`font-medium ${
                                traderDetails.block
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {traderDetails.block ? "محظور" : "نشط"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              traderDetails.waiting
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm text-gray-500">
                              قائمة الانتظار
                            </p>
                            <p
                              className={`font-medium ${
                                traderDetails.waiting
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                            >
                              {traderDetails.waiting ? "في الانتظار" : "مقبول"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Google Map Link */}
                    {traderDetails.googleMapLink && (
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Globe className="w-5 h-5 text-purple-600" />
                          موقع التاجر على الخريطة
                        </h4>

                        {/* Copy Link Section */}
                        <div className="mb-4">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-500 mb-1">
                                رابط الخريطة
                              </p>
                              <p
                                className="text-sm text-gray-700 truncate"
                                title={traderDetails.googleMapLink}
                              >
                                {traderDetails.googleMapLink}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                copyToClipboard(traderDetails.googleMapLink)
                              }
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                copiedLink
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                              }`}
                            >
                              {copiedLink ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>تم النسخ</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span>نسخ الرابط</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Map Display */}
                        <div className="space-y-4">
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                              <h5 className="font-medium text-gray-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500" />
                                عرض الموقع على الخريطة
                              </h5>
                            </div>
                            <div className="h-64 bg-gray-100 flex items-center justify-center">
                              <div className="text-center">
                                <Globe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 mb-2">
                                  عرض الخريطة
                                </p>
                                <a
                                  href={traderDetails.googleMapLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                  <Globe className="w-4 h-4" />
                                  فتح في خرائط جوجل
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Alternative: Simple iframe approach (if you have Google Maps API key) */}
                          {/* Uncomment and add your API key if you want to show embedded map */}
                          {/*
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                              <h5 className="font-medium text-gray-900">الموقع على الخريطة</h5>
                            </div>
                            <iframe
                              src={extractGoogleMapsEmbedUrl(traderDetails.googleMapLink) || traderDetails.googleMapLink}
                              width="100%"
                              height="250"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              className="w-full h-64"
                            />
                          </div>
                          */}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      فشل في تحميل تفاصيل التاجر
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wallet Update Modal */}
        {showWalletModal && selectedTraderForWallet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        تحديث المحفظة
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedTraderForWallet.firstName}{" "}
                        {selectedTraderForWallet.lastName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowWalletModal(false);
                      setSelectedTraderForWallet(null);
                      setWalletAmount("");
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المبلغ الحالي
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="font-semibold text-green-600">
                        {(
                          (selectedTraderForWallet as any).wallet || 0
                        ).toLocaleString()}{" "}
                        ر.س
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المبلغ الجديد
                    </label>
                    <input
                      type="number"
                      value={walletAmount}
                      onChange={(e) => setWalletAmount(e.target.value)}
                      placeholder="أدخل المبلغ الجديد"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <button
                    onClick={() => {
                      setShowWalletModal(false);
                      setSelectedTraderForWallet(null);
                      setWalletAmount("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={updateWalletAmount}
                    disabled={walletLoading}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {walletLoading ? "جاري التحديث..." : "تحديث المحفظة"}
                  </button>
                </div>
              </div>
            </div>
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
