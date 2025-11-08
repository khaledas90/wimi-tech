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
  Package,
  Calendar,
  CreditCard,
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  DollarSign,
} from "lucide-react";

interface Trader {
  _id: string;
  UID?: string;
  firstName?: string;
  lastName?: string;
  nameOfbussinessActor?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  googleMapLink?: string;
  nationalId?: string;
  nationalId2?: string;
  Iban?: string;
  nameOfbank?: string;
  nameOfperson?: string;
  verify?: boolean;
  block?: boolean;
  waiting?: boolean;
  wallet?: number;
  createdAt?: string;
  [key: string]: any;
}

interface Product {
  productId: {
    _id: string;
    title: string;
    traderId: string;
    description: string;
    price: number;
    category: string;
    stockQuantity: number;
    images: string[];
    createdAt: string;
    __v: number;
    verify: boolean;
  };
  traderId: string | Trader | null;
  price: number;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  userId: string;
  products: Product[];
  status: "Pending" | "Delivered" | "Cancelled";
  paymentState: "Pending" | "Paid" | "Failed";
  orderDate: string;
  tamaraId: string | null;
  __v: number;
}

interface OrdersResponse {
  success: boolean;
  message: string;
  data: Order[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<Order | null>(null);
  const token = Cookies.get("token_admin");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Orders API Response:", response.data);

      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        toast.error(response.data.message || "فشل في جلب الطلبات");
      }
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      toast.error(error?.response?.data?.message || "خطأ في جلب الطلبات");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const calculateTotalAmount = (order: Order): number => {
    return order.products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrderDetails(order);
    setShowOrderDetails(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" ||
      order.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some((product) =>
        product.productId.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "قيد الانتظار",
      },
      Delivered: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "تم التسليم",
      },
      Cancelled: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "ملغي",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.Pending;
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

  const getPaymentStateBadge = (paymentState: string) => {
    const paymentConfig = {
      Pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: "قيد الانتظار",
      },
      Paid: {
        color: "bg-green-100 text-green-800",
        text: "مدفوع",
      },
      Failed: {
        color: "bg-red-100 text-red-800",
        text: "فشل",
      },
    };

    const config =
      paymentConfig[paymentState as keyof typeof paymentConfig] ||
      paymentConfig.Pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getTraderId = (traderId: string | Trader | null): string => {
    if (!traderId) return "غير متوفر";
    if (typeof traderId === "string") return traderId.slice(-8);
    if (typeof traderId === "object" && traderId._id) {
      return traderId._id.slice(-8);
    }
    return "غير متوفر";
  };

  const getTraderDisplayName = (traderId: string | Trader | null): string => {
    if (!traderId) return "غير متوفر";
    if (typeof traderId === "string") return traderId.slice(-8);
    if (typeof traderId === "object") {
      if (traderId.firstName && traderId.lastName) {
        return `${traderId.firstName} ${traderId.lastName}`;
      }
      if (traderId._id) return traderId._id.slice(-8);
    }
    return "غير متوفر";
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
                <option value="all">جميع الطلبات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="delivered">تم التسليم</option>
                <option value="cancelled">ملغي</option>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  إجمالي الطلبات
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {orders.length}
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
                  {orders.filter((o) => o.status === "Pending").length}
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
                  {orders.filter((o) => o.status === "Delivered").length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  إجمالي المبيعات
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {orders
                    .reduce(
                      (total, order) => total + calculateTotalAmount(order),
                      0
                    )
                    .toLocaleString()}{" "}
                  ر.س
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">قائمة الطلبات</h2>
          </div>

          {filteredOrders.length === 0 ? (
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
                      المنتجات
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المبلغ الإجمالي
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ الطلب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      حالة الطلب
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      حالة الدفع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      معرف تمارا
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="space-y-1">
                          {order.products.slice(0, 2).map((product) => (
                            <div
                              key={product._id}
                              className="flex items-center gap-2"
                            >
                              <Package className="w-4 h-4 text-gray-400" />
                              <span className="truncate max-w-xs">
                                {product.productId.title} (×{product.quantity})
                              </span>
                            </div>
                          ))}
                          {order.products.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{order.products.length - 2} منتجات أخرى
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {calculateTotalAmount(order).toLocaleString()} ر.س
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(order.orderDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getPaymentStateBadge(order.paymentState)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.tamaraId ? (
                          <span className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {order.tamaraId}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">
                            غير متوفر
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
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

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">تفاصيل الطلب</h3>
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrderDetails(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    معلومات الطلب
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">رقم الطلب:</span>{" "}
                      {selectedOrderDetails._id}
                    </p>
                    <p>
                      <span className="font-medium">معرف المستخدم:</span>{" "}
                      {selectedOrderDetails.userId}
                    </p>
                    <p>
                      <span className="font-medium">تاريخ الطلب:</span>{" "}
                      {formatDate(selectedOrderDetails.orderDate)}
                    </p>
                    <p>
                      <span className="font-medium">حالة الطلب:</span>{" "}
                      {getStatusBadge(selectedOrderDetails.status)}
                    </p>
                    <p>
                      <span className="font-medium">حالة الدفع:</span>{" "}
                      {getPaymentStateBadge(selectedOrderDetails.paymentState)}
                    </p>
                    {selectedOrderDetails.tamaraId && (
                      <p>
                        <span className="font-medium">معرف تمارا:</span>{" "}
                        {selectedOrderDetails.tamaraId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    ملخص المبلغ
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">عدد المنتجات:</span>{" "}
                      {selectedOrderDetails.products.length}
                    </p>
                    <p>
                      <span className="font-medium">الكمية الإجمالية:</span>{" "}
                      {selectedOrderDetails.products.reduce(
                        (sum, p) => sum + p.quantity,
                        0
                      )}
                    </p>
                    <p className="text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                      <span className="font-medium">المبلغ الإجمالي:</span>{" "}
                      {calculateTotalAmount(
                        selectedOrderDetails
                      ).toLocaleString()}{" "}
                      ر.س
                    </p>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">المنتجات</h4>
                <div className="space-y-4">
                  {selectedOrderDetails.products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex gap-4">
                        {product.productId.images &&
                          product.productId.images[0] && (
                            <img
                              src={product.productId.images[0]}
                              alt={product.productId.title}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-2">
                            {product.productId.title}
                          </h5>
                          <p className="text-sm text-gray-600 mb-2">
                            {product.productId.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">السعر:</span>{" "}
                              <span className="font-medium">
                                {product.price.toLocaleString()} ر.س
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">الكمية:</span>{" "}
                              <span className="font-medium">
                                {product.quantity}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">
                                {typeof product.traderId === "object" &&
                                product.traderId
                                  ? "التاجر:"
                                  : "معرف التاجر:"}
                              </span>{" "}
                              <span className="font-medium">
                                {typeof product.traderId === "object" &&
                                product.traderId
                                  ? getTraderDisplayName(product.traderId)
                                  : getTraderId(product.traderId)}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">المجموع:</span>{" "}
                              <span className="font-semibold text-green-600">
                                {(
                                  product.price * product.quantity
                                ).toLocaleString()}{" "}
                                ر.س
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Trader Details Section */}
                      {typeof product.traderId === "object" &&
                        product.traderId && (
                          <div className="mt-4 pt-4 border-t border-gray-300">
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                              <div className="flex items-center gap-3 mb-4">
                                <Store className="w-5 h-5 text-green-600" />
                                <h5 className="text-lg font-bold text-gray-900">
                                  معلومات التاجر
                                </h5>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                {product.traderId.UID && (
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      UID:
                                    </span>
                                    <p className="text-gray-900 font-semibold">
                                      {product.traderId.UID}
                                    </p>
                                  </div>
                                )}
                                {product.traderId.nameOfbussinessActor && (
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      اسم النشاط التجاري:
                                    </span>
                                    <p className="text-gray-900 font-semibold">
                                      {product.traderId.nameOfbussinessActor}
                                    </p>
                                  </div>
                                )}
                                {product.traderId.firstName && (
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      الاسم الأول:
                                    </span>
                                    <p className="text-gray-900">
                                      {product.traderId.firstName}
                                    </p>
                                  </div>
                                )}
                                {product.traderId.lastName && (
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      اسم العائلة:
                                    </span>
                                    <p className="text-gray-900">
                                      {product.traderId.lastName}
                                    </p>
                                  </div>
                                )}
                                {product.traderId.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <div>
                                      <span className="text-gray-600 font-medium">
                                        البريد الإلكتروني:
                                      </span>
                                      <p className="text-gray-900">
                                        {product.traderId.email}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {product.traderId.phoneNumber && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <div>
                                      <span className="text-gray-600 font-medium">
                                        رقم الهاتف:
                                      </span>
                                      <p className="text-gray-900">
                                        {product.traderId.phoneNumber}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {product.traderId.nationalId && (
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      رقم الهوية الوطنية:
                                    </span>
                                    <p className="text-gray-900">
                                      {product.traderId.nationalId}
                                    </p>
                                  </div>
                                )}
                                {product.traderId.nationalId2 && (
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      رقم الهوية الوطنية 2:
                                    </span>
                                    <p className="text-gray-900">
                                      {product.traderId.nationalId2}
                                    </p>
                                  </div>
                                )}
                                {product.traderId.address && (
                                  <div className="flex items-start gap-2 md:col-span-2">
                                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                                    <div className="flex-1">
                                      <span className="text-gray-600 font-medium">
                                        العنوان:
                                      </span>
                                      <p className="text-gray-900 break-words">
                                        {product.traderId.address}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {product.traderId.googleMapLink && (
                                  <div className="flex items-start gap-2 md:col-span-2">
                                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                                    <div className="flex-1">
                                      <span className="text-gray-600 font-medium">
                                        رابط خرائط جوجل:
                                      </span>
                                      <a
                                        href={product.traderId.googleMapLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all block"
                                      >
                                        {product.traderId.googleMapLink}
                                      </a>
                                    </div>
                                  </div>
                                )}
                                {product.traderId.Iban && (
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-500" />
                                    <div>
                                      <span className="text-gray-600 font-medium">
                                        رقم الآيبان:
                                      </span>
                                      <p className="text-gray-900">
                                        {product.traderId.Iban}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {product.traderId.nameOfbank && (
                                  <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-gray-500" />
                                    <div>
                                      <span className="text-gray-600 font-medium">
                                        اسم البنك:
                                      </span>
                                      <p className="text-gray-900">
                                        {product.traderId.nameOfbank}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {product.traderId.nameOfperson && (
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      اسم المستفيد:
                                    </span>
                                    <p className="text-gray-900">
                                      {product.traderId.nameOfperson}
                                    </p>
                                  </div>
                                )}
                                {product.traderId.wallet !== undefined && (
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-gray-500" />
                                    <div>
                                      <span className="text-gray-600 font-medium">
                                        رصيد المحفظة:
                                      </span>
                                      <p
                                        className={`font-semibold ${
                                          product.traderId.wallet < 0
                                            ? "text-red-600"
                                            : "text-green-600"
                                        }`}
                                      >
                                        {product.traderId.wallet.toLocaleString()}{" "}
                                        ر.س
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {product.traderId.verify !== undefined && (
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      حالة التحقق:
                                    </span>
                                    <span
                                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        product.traderId.verify
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {product.traderId.verify
                                        ? "متحقق"
                                        : "غير متحقق"}
                                    </span>
                                  </div>
                                )}
                                {product.traderId.block !== undefined && (
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      حالة الحظر:
                                    </span>
                                    <span
                                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        product.traderId.block
                                          ? "bg-red-100 text-red-800"
                                          : "bg-green-100 text-green-800"
                                      }`}
                                    >
                                      {product.traderId.block ? "محظور" : "نشط"}
                                    </span>
                                  </div>
                                )}
                                {product.traderId.waiting !== undefined && (
                                  <div>
                                    <span className="text-gray-600 font-medium">
                                      قائمة الانتظار:
                                    </span>
                                    <span
                                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                        product.traderId.waiting
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-green-100 text-green-800"
                                      }`}
                                    >
                                      {product.traderId.waiting
                                        ? "في الانتظار"
                                        : "مقبول"}
                                    </span>
                                  </div>
                                )}
                                {product.traderId.createdAt && (
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <div>
                                      <span className="text-gray-600 font-medium">
                                        تاريخ الإنشاء:
                                      </span>
                                      <p className="text-gray-900">
                                        {formatDate(product.traderId.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowOrderDetails(false);
                  setSelectedOrderDetails(null);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
