"use client";
import React, { useEffect, useState } from "react";
import { BaseUrl } from "@/app/components/Baseurl";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import {
  FileText,
  Clock,
  CheckCircle,
  RefreshCw,
  Filter,
  Search,
  X,
  Eye,
  User,
  Store,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  Image as ImageIcon,
} from "lucide-react";

// Define the request type based on the actual API response
interface Trader {
  _id: string;
  UID?: string;
  nameOfbussinessActor?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  [key: string]: any;
}

interface User {
  _id: string;
  UID?: string;
  username?: string;
  phoneNumber?: string;
  [key: string]: any;
}

interface Request {
  _id: string;
  traderId: Trader | null;
  userId: User;
  amount: number;
  status: "pending" | "Delivered";
  __v: number;
}

interface RequestsResponse {
  success: boolean;
  message: string;
  data: Request[];
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [confirmAmount, setConfirmAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = Cookies.get("token_admin");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}admin/req`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Requests API Response:", response.data);

      if (response.data.success) {
        setRequests(response.data.data || []);
      } else {
        toast.error(response.data.message || "فشل في جلب طلبات الاسترجاع");
      }
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast.error(
        error?.response?.data?.message || "خطأ في جلب طلبات الاسترجاع"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const handleConfirmDelivery = (request: Request) => {
    setSelectedRequest(request);
    setConfirmAmount(request.amount);
    setShowConfirmModal(true);
  };

  const handleViewDetails = (request: Request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleStatusUpdate = async (requestId: string) => {
    try {
      const currentRequest = requests.find((r) => r._id === requestId);
      if (!currentRequest) {
        toast.error("لم يتم العثور على الطلب");
        return;
      }

      const newStatus =
        currentRequest.status === "pending" ? "Delivered" : "pending";

      const response = await axios.patch(
        `${BaseUrl}admin/update-status`,
        {
          orderId: requestId,
          amount: currentRequest.amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const statusText =
          newStatus === "Delivered" ? "تم التسليم" : "قيد الانتظار";
        toast.success(`تم تحديث حالة الطلب إلى ${statusText}`);
        fetchRequests(); // Refresh the list
      } else {
        toast.error(response.data.message || "فشل في تحديث حالة الطلب");
      }
    } catch (error: any) {
      console.error("Error updating request status:", error);
      toast.error(error?.response?.data?.message || "خطأ في تحديث حالة الطلب");
    }
  };

  const handleConfirmDeliverySubmit = async () => {
    if (!selectedRequest) return;

    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `${BaseUrl}admin/update-status`,
        {
          orderId: selectedRequest._id,
          amount: confirmAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(
          `تم تأكيد التسليم بالمبلغ ${confirmAmount.toLocaleString()} ر.س`
        );
        setShowConfirmModal(false);
        setSelectedRequest(null);
        fetchRequests(); // Refresh the list
      } else {
        toast.error(response.data.message || "فشل في تأكيد التسليم");
      }
    } catch (error: any) {
      console.error("Error confirming delivery:", error);
      toast.error(error?.response?.data?.message || "خطأ في تأكيد التسليم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      filterStatus === "all" || request.status === filterStatus;

    if (!searchTerm) {
      return matchesStatus;
    }

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      request._id.toLowerCase().includes(searchLower) ||
      (request.traderId &&
        (request.traderId._id?.toLowerCase().includes(searchLower) ||
          request.traderId.UID?.toLowerCase().includes(searchLower) ||
          request.traderId.nameOfbussinessActor
            ?.toLowerCase()
            .includes(searchLower) ||
          request.traderId.firstName?.toLowerCase().includes(searchLower) ||
          request.traderId.lastName?.toLowerCase().includes(searchLower) ||
          request.traderId.phoneNumber?.includes(searchTerm))) ||
      (request.userId &&
        (request.userId._id?.toLowerCase().includes(searchLower) ||
          request.userId.UID?.toLowerCase().includes(searchLower) ||
          request.userId.username?.toLowerCase().includes(searchLower) ||
          request.userId.phoneNumber?.includes(searchTerm)));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "قيد الانتظار",
      },
      Delivered: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "تم التسليم",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <Icon className="w-4 h-4" />
        {config.text}
      </span>
    );
  };

  // Helper functions to get display names
  const getTraderDisplayName = (trader: Trader | null): string => {
    if (!trader) return "لا يوجد تاجر";
    if (trader.nameOfbussinessActor) return trader.nameOfbussinessActor;
    if (trader.firstName && trader.lastName) {
      return `${trader.firstName} ${trader.lastName}`;
    }
    if (trader.UID) return `T${trader.UID}`;
    return trader._id.slice(-8);
  };

  const getUserDisplayName = (user: User): string => {
    if (user.username) return user.username;
    if (user.UID) return `U${user.UID}`;
    return user._id.slice(-8);
  };

  const getTraderId = (trader: Trader | null): string => {
    if (!trader) return "N/A";
    return trader._id.slice(-8);
  };

  const getUserId = (user: User): string => {
    return user._id.slice(-8);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل طلبات الاسترجاع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  إدارة طلبات الاسترجاع
                </h1>
                <p className="text-blue-100 text-lg">
                  عرض وإدارة جميع طلبات المستخدمين والتجار
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              />
              تحديث
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  فلترة حسب الحالة:
                </span>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع طلبات الاسترجاع</option>
                <option value="pending">قيد الانتظار</option>
                <option value="Delivered">تم التسليم</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في طلبات الاسترجاع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  إجمالي طلبات الاسترجاع
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {requests.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  قيد الانتظار
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {requests.filter((r) => r.status === "pending").length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  تم التسليم
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {requests.filter((r) => r.status === "Delivered").length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              قائمة طلبات الاسترجاع
            </h2>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا توجد طلبات</p>
              <p className="text-gray-400 text-sm">
                لم يتم العثور على أي طلبات تطابق المعايير المحددة
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الطلب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      التاجر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستخدم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr
                      key={request._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {getTraderDisplayName(request.traderId)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ID: {request.traderId?.UID || "----"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {getUserDisplayName(request.userId)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ID: {request.userId?.UID || "----"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.amount.toLocaleString()} ر.س
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(request)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {request.status === "pending" ? (
                            <button
                              onClick={() => handleConfirmDelivery(request)}
                              className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors duration-200"
                              title="تأكيد التسليم"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusUpdate(request._id)}
                              className="text-orange-600 hover:text-orange-900 p-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                              title="إرجاع للانتظار"
                            >
                              <Clock className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                تفاصيل الطلب الكاملة
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Request Information */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <h4 className="text-xl font-bold text-gray-900">
                    معلومات الطلب
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">
                      رقم الطلب:
                    </span>
                    <span className="text-gray-900 font-mono">
                      {selectedRequest._id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">المبلغ:</span>
                    <span className="text-gray-900 font-bold text-lg">
                      {selectedRequest.amount.toLocaleString()} ر.س
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">الحالة:</span>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
              </div>

              {/* Trader Information */}
              {selectedRequest.traderId ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Store className="w-6 h-6 text-green-600" />
                    <h4 className="text-xl font-bold text-gray-900">
                      معلومات التاجر
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRequest.traderId.UID && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          UID:
                        </span>
                        <p className="text-gray-900 font-semibold">
                          {selectedRequest.traderId.UID}
                        </p>
                      </div>
                    )}
                    {selectedRequest.traderId.nameOfbussinessActor && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          اسم النشاط التجاري:
                        </span>
                        <p className="text-gray-900 font-semibold">
                          {selectedRequest.traderId.nameOfbussinessActor}
                        </p>
                      </div>
                    )}
                    {selectedRequest.traderId.firstName && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          الاسم الأول:
                        </span>
                        <p className="text-gray-900">
                          {selectedRequest.traderId.firstName}
                        </p>
                      </div>
                    )}
                    {selectedRequest.traderId.lastName && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          اسم العائلة:
                        </span>
                        <p className="text-gray-900">
                          {selectedRequest.traderId.lastName}
                        </p>
                      </div>
                    )}
                    {selectedRequest.traderId.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            البريد الإلكتروني:
                          </span>
                          <p className="text-gray-900">
                            {selectedRequest.traderId.email}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedRequest.traderId.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            رقم الهاتف:
                          </span>
                          <p className="text-gray-900">
                            {selectedRequest.traderId.phoneNumber}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedRequest.traderId.specialNumber && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          الرقم الخاص:
                        </span>
                        <p className="text-gray-900">
                          {selectedRequest.traderId.specialNumber}
                        </p>
                      </div>
                    )}
                    {selectedRequest.traderId.nationalId && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          رقم الهوية الوطنية:
                        </span>
                        <p className="text-gray-900">
                          {selectedRequest.traderId.nationalId}
                        </p>
                      </div>
                    )}
                    {selectedRequest.traderId.nationalId2 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          رقم الهوية الوطنية 2:
                        </span>
                        <p className="text-gray-900">
                          {selectedRequest.traderId.nationalId2}
                        </p>
                      </div>
                    )}
                    {selectedRequest.traderId.address && (
                      <div className="flex items-start gap-2 md:col-span-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-600">
                            العنوان:
                          </span>
                          <p className="text-gray-900 break-words">
                            {selectedRequest.traderId.address}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedRequest.traderId.googleMapLink && (
                      <div className="flex items-start gap-2 md:col-span-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-600">
                            رابط خرائط جوجل:
                          </span>
                          <a
                            href={selectedRequest.traderId.googleMapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {selectedRequest.traderId.googleMapLink}
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedRequest.traderId.Iban && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            رقم الآيبان:
                          </span>
                          <p className="text-gray-900">
                            {selectedRequest.traderId.Iban}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedRequest.traderId.nameOfbank && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            اسم البنك:
                          </span>
                          <p className="text-gray-900">
                            {selectedRequest.traderId.nameOfbank}
                          </p>
                        </div>
                      </div>
                    )}
                    {selectedRequest.traderId.nameOfperson && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          اسم المستفيد:
                        </span>
                        <p className="text-gray-900">
                          {selectedRequest.traderId.nameOfperson}
                        </p>
                      </div>
                    )}
                    {selectedRequest.traderId.wallet !== undefined && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          رصيد المحفظة:
                        </span>
                        <p
                          className={`font-semibold ${
                            selectedRequest.traderId.wallet < 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {selectedRequest.traderId.wallet.toLocaleString()} ر.س
                        </p>
                      </div>
                    )}
                    {selectedRequest.traderId.verify !== undefined && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          حالة التحقق:
                        </span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            selectedRequest.traderId.verify
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedRequest.traderId.verify
                            ? "متحقق"
                            : "غير متحقق"}
                        </span>
                      </div>
                    )}
                    {selectedRequest.traderId.createdAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            تاريخ الإنشاء:
                          </span>
                          <p className="text-gray-900">
                            {new Date(
                              selectedRequest.traderId.createdAt
                            ).toLocaleDateString("ar-SA", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trader Images */}
                  {(selectedRequest.traderId.logo ||
                    selectedRequest.traderId.billImage ||
                    selectedRequest.traderId.imageOfcertificate ||
                    selectedRequest.traderId.imageOftrading ||
                    selectedRequest.traderId.imageOfnationalId ||
                    selectedRequest.traderId.imageOfiban ||
                    selectedRequest.traderId.imageOffront) && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <h5 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        الصور والمستندات
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedRequest.traderId.logo && (
                          <div>
                            <span className="text-xs font-medium text-gray-600 block mb-1">
                              الشعار:
                            </span>
                            <a
                              href={selectedRequest.traderId.logo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={selectedRequest.traderId.logo}
                                alt="Logo"
                                className="w-full h-24 object-cover rounded-lg border border-gray-300 hover:opacity-80 transition-opacity"
                              />
                            </a>
                          </div>
                        )}
                        {selectedRequest.traderId.billImage && (
                          <div>
                            <span className="text-xs font-medium text-gray-600 block mb-1">
                              صورة الفاتورة:
                            </span>
                            <a
                              href={selectedRequest.traderId.billImage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={selectedRequest.traderId.billImage}
                                alt="Bill"
                                className="w-full h-24 object-cover rounded-lg border border-gray-300 hover:opacity-80 transition-opacity"
                              />
                            </a>
                          </div>
                        )}
                        {selectedRequest.traderId.imageOfcertificate && (
                          <div>
                            <span className="text-xs font-medium text-gray-600 block mb-1">
                              شهادة:
                            </span>
                            <a
                              href={selectedRequest.traderId.imageOfcertificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={
                                  selectedRequest.traderId.imageOfcertificate
                                }
                                alt="Certificate"
                                className="w-full h-24 object-cover rounded-lg border border-gray-300 hover:opacity-80 transition-opacity"
                              />
                            </a>
                          </div>
                        )}
                        {selectedRequest.traderId.imageOftrading && (
                          <div>
                            <span className="text-xs font-medium text-gray-600 block mb-1">
                              صورة التداول:
                            </span>
                            <a
                              href={selectedRequest.traderId.imageOftrading}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={selectedRequest.traderId.imageOftrading}
                                alt="Trading"
                                className="w-full h-24 object-cover rounded-lg border border-gray-300 hover:opacity-80 transition-opacity"
                              />
                            </a>
                          </div>
                        )}
                        {selectedRequest.traderId.imageOfnationalId && (
                          <div>
                            <span className="text-xs font-medium text-gray-600 block mb-1">
                              صورة الهوية:
                            </span>
                            <a
                              href={selectedRequest.traderId.imageOfnationalId}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={selectedRequest.traderId.imageOfnationalId}
                                alt="National ID"
                                className="w-full h-24 object-cover rounded-lg border border-gray-300 hover:opacity-80 transition-opacity"
                              />
                            </a>
                          </div>
                        )}
                        {selectedRequest.traderId.imageOfiban && (
                          <div>
                            <span className="text-xs font-medium text-gray-600 block mb-1">
                              صورة الآيبان:
                            </span>
                            <a
                              href={selectedRequest.traderId.imageOfiban}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={selectedRequest.traderId.imageOfiban}
                                alt="IBAN"
                                className="w-full h-24 object-cover rounded-lg border border-gray-300 hover:opacity-80 transition-opacity"
                              />
                            </a>
                          </div>
                        )}
                        {selectedRequest.traderId.imageOffront && (
                          <div>
                            <span className="text-xs font-medium text-gray-600 block mb-1">
                              واجهة المحل:
                            </span>
                            <a
                              href={selectedRequest.traderId.imageOffront}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={selectedRequest.traderId.imageOffront}
                                alt="Front"
                                className="w-full h-24 object-cover rounded-lg border border-gray-300 hover:opacity-80 transition-opacity"
                              />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Store className="w-6 h-6 text-gray-400" />
                    <h4 className="text-xl font-bold text-gray-900">
                      معلومات التاجر
                    </h4>
                  </div>
                  <p className="text-gray-500">لا يوجد تاجر مرتبط بهذا الطلب</p>
                </div>
              )}

              {/* User Information */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-purple-600" />
                  <h4 className="text-xl font-bold text-gray-900">
                    معلومات المستخدم
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      معرف المستخدم:
                    </span>
                    <p className="text-gray-900 font-mono text-sm">
                      {selectedRequest.userId._id}
                    </p>
                  </div>
                  {selectedRequest.userId.UID && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        UID:
                      </span>
                      <p className="text-gray-900 font-semibold">
                        {selectedRequest.userId.UID}
                      </p>
                    </div>
                  )}
                  {selectedRequest.userId.username && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        اسم المستخدم:
                      </span>
                      <p className="text-gray-900 font-semibold">
                        {selectedRequest.userId.username}
                      </p>
                    </div>
                  )}
                  {selectedRequest.userId.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          رقم الهاتف:
                        </span>
                        <p className="text-gray-900">
                          {selectedRequest.userId.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedRequest.userId.verify !== undefined && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        حالة التحقق:
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedRequest.userId.verify
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedRequest.userId.verify ? "متحقق" : "غير متحقق"}
                      </span>
                    </div>
                  )}
                  {selectedRequest.userId.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          تاريخ الإنشاء:
                        </span>
                        <p className="text-gray-900">
                          {new Date(
                            selectedRequest.userId.createdAt
                          ).toLocaleDateString("ar-SA", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedRequest(null);
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delivery Modal */}
      {showConfirmModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">تأكيد التسليم</h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-2">تفاصيل الطلب</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">رقم الطلب:</span>{" "}
                    {selectedRequest._id.slice(-8)}
                  </p>
                  <p>
                    <span className="font-medium">التاجر:</span>{" "}
                    {getTraderDisplayName(selectedRequest.traderId)} (
                    {getTraderId(selectedRequest.traderId)})
                  </p>
                  <p>
                    <span className="font-medium">المستخدم:</span>{" "}
                    {getUserDisplayName(selectedRequest.userId)} (
                    {getUserId(selectedRequest.userId)})
                  </p>
                  <p>
                    <span className="font-medium">المبلغ الحالي:</span>{" "}
                    {selectedRequest.amount.toLocaleString()} ر.س
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المبلغ المراد تأكيده
                </label>
                <input
                  type="number"
                  value={confirmAmount}
                  onChange={(e) => setConfirmAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg text-black"
                  placeholder="أدخل المبلغ"
                  min="0"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">
                  المبلغ الحالي: {selectedRequest.amount.toLocaleString()} ر.س
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                disabled={isSubmitting}
              >
                إلغاء
              </button>
              <button
                onClick={handleConfirmDeliverySubmit}
                disabled={isSubmitting || confirmAmount <= 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    جاري التأكيد...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    تأكيد التسليم
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
