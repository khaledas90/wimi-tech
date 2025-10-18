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
  Eye,
  RefreshCw,
  Filter,
  Search,
  XCircle,
  X,
} from "lucide-react";

// Define the request type based on the actual API response
interface Request {
  _id: string;
  traderId: string;
  userId: string;
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
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [confirmAmount, setConfirmAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = Cookies.get("token_admin");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

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
        toast.error(response.data.message || "فشل في جلب الطلبات");
      }
    } catch (error: any) {
      console.error("Error fetching requests:", error);
      toast.error(error?.response?.data?.message || "خطأ في جلب الطلبات");
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

  const handleStatusUpdate = async (requestId: string) => {
    try {
      const currentRequest = requests.find(r => r._id === requestId);
      if (!currentRequest) {
        toast.error("لم يتم العثور على الطلب");
        return;
      }

      // Toggle between pending and Delivered
      const newStatus = currentRequest.status === "pending" ? "Delivered" : "pending";
      
      const response = await axios.patch(
        `${BaseUrl}admin/update-status`,
        { 
          orderId: requestId,
          amount: currentRequest.amount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const statusText = newStatus === "Delivered" ? "تم التسليم" : "قيد الانتظار";
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
          amount: confirmAmount
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(`تم تأكيد التسليم بالمبلغ ${confirmAmount.toLocaleString()} ر.س`);
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
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesSearch = 
      request._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.traderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, text: "قيد الانتظار" },
      Delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle, text: "تم التسليم" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </span>
    );
  };

  // Since the API doesn't provide a type field, we'll show the request ID
  const getRequestInfo = (request: Request) => {
    return `طلب رقم ${request._id.slice(-6)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل الطلبات...</p>
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
                <h1 className="text-4xl font-bold mb-2">إدارة الطلبات</h1>
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
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
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
                <span className="text-sm font-medium text-gray-700">فلترة حسب الحالة:</span>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الطلبات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="Delivered">تم التسليم</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في الطلبات..."
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
                <p className="text-sm font-medium text-gray-600 mb-1">إجمالي الطلبات</p>
                <p className="text-3xl font-bold text-gray-900">{requests.length}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">قيد الانتظار</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === "pending").length}
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
                <p className="text-sm font-medium text-gray-600 mb-1">تم التسليم</p>
                <p className="text-3xl font-bold text-green-600">
                  {requests.filter(r => r.status === "Delivered").length}
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
            <h2 className="text-xl font-bold text-gray-900">قائمة الطلبات</h2>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا توجد طلبات</p>
              <p className="text-gray-400 text-sm">لم يتم العثور على أي طلبات تطابق المعايير المحددة</p>
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
                      معرف التاجر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      معرف المستخدم
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
                    <tr key={request._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.traderId.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.userId.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.amount.toLocaleString()} ر.س
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(request.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
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
                  <p><span className="font-medium">رقم الطلب:</span> {selectedRequest._id.slice(-8)}</p>
                  <p><span className="font-medium">معرف التاجر:</span> {selectedRequest.traderId.slice(-8)}</p>
                  <p><span className="font-medium">معرف المستخدم:</span> {selectedRequest.userId.slice(-8)}</p>
                  <p><span className="font-medium">المبلغ الحالي:</span> {selectedRequest.amount.toLocaleString()} ر.س</p>
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
