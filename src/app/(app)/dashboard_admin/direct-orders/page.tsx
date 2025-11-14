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
  Mail,
  Phone,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
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

interface DirectOrderItem {
  title: string;
  phoneNumber?: string;
  description: string;
  price: number;
  quantity?: number;
  status: string;
  _id: string;
  order_id: string;
}

interface DirectOrder {
  _id: string;
  traderId: string | Trader | null;
  orders: DirectOrderItem[];
  createdAt: string;
  updatedAt: string;
  tamaraId: string | null;
  paymentState?: "Pending" | "Paid" | "Completed" | "Failed";
  __v: number;
}

interface AllOrderProduct {
  productId:
    | string
    | {
        _id: string;
        title?: string;
        [key: string]: any;
      };
  traderId: string | Trader | null;
  price: number;
  quantity: number;
  _id: string;
}

interface AllOrder {
  _id: string;
  userId: string;
  products: AllOrderProduct[];
  status: "Pending" | "Delivered" | "Cancelled";
  paymentState: "Pending" | "Paid" | "Completed" | "Failed";
  orderDate: string;
  tamaraId: string | null;
  __v: number;
}

interface DirectOrdersResponse {
  success: boolean;
  message: string;
  data: {
    allOrders: AllOrder[];
    directOrders: DirectOrder[];
  };
}

type UnifiedOrder = DirectOrder | AllOrder;
type OrderType = "direct" | "all";

export default function DirectOrdersPage() {
  const [directOrders, setDirectOrders] = useState<DirectOrder[]>([]);
  const [allOrders, setAllOrders] = useState<AllOrder[]>([]);
  const [orderType, setOrderType] = useState<OrderType>("direct");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<UnifiedOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const token = Cookies.get("token_admin");

  useEffect(() => {
    fetchDirectOrders();
  }, []);

  const fetchDirectOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}admin/get-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Direct Orders API Response:", response.data);

      if (response.data.success) {
        setDirectOrders(response.data.data?.directOrders || []);
        setAllOrders(response.data.data?.allOrders || []);
      } else {
        toast.error(response.data.message || "فشل في جلب الطلبات المباشرة");
      }
    } catch (error: any) {
      console.error("Error fetching direct orders:", error);
      toast.error(
        error?.response?.data?.message || "خطأ في جلب الطلبات المباشرة"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDirectOrders();
    setRefreshing(false);
  };

  const isDirectOrder = (order: UnifiedOrder): order is DirectOrder => {
    return "orders" in order && Array.isArray((order as DirectOrder).orders);
  };

  const isAllOrder = (order: UnifiedOrder): order is AllOrder => {
    return "products" in order && "status" in order && "orderDate" in order;
  };

  const calculateTotalAmount = (order: UnifiedOrder): number => {
    if (isDirectOrder(order)) {
      return order.orders.reduce((total, item) => {
        return total + item.price * (item.quantity || 1);
      }, 0);
    } else if (isAllOrder(order)) {
      return order.products.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
    }
    return 0;
  };

  const getOrderStatus = (order: UnifiedOrder): string => {
    if (isDirectOrder(order)) {
      return order.orders[0]?.status || "pending";
    } else if (isAllOrder(order)) {
      return order.status || "Pending";
    }
    return "pending";
  };

  const getPaymentState = (order: UnifiedOrder): string => {
    if (isDirectOrder(order)) {
      // For direct orders, derive payment state from tamaraId
      if (order.paymentState) {
        return order.paymentState;
      }
      return order.tamaraId ? "Pending" : "غير متوفر";
    } else if (isAllOrder(order)) {
      return order.paymentState || "Pending";
    }
    return "غير متوفر";
  };

  const handleViewDetails = (order: UnifiedOrder) => {
    setSelectedOrderDetails(order);
    setShowOrderDetails(true);
  };

  const getCurrentOrders = (): UnifiedOrder[] => {
    return orderType === "direct" ? directOrders : allOrders;
  };

  const filteredOrders = getCurrentOrders().filter((order) => {
    const orderStatus = getOrderStatus(order).toLowerCase();
    const matchesStatus =
      filterStatus === "all" ||
      orderStatus === filterStatus.toLowerCase() ||
      orderStatus.includes(filterStatus.toLowerCase());

    let matchesSearch = false;
    if (isDirectOrder(order)) {
      matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orders.some(
          (item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.order_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    } else if (isAllOrder(order)) {
      matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.products.some((product) => {
          const productTitle =
            typeof product.productId === "object" && product.productId?.title
              ? product.productId.title
              : product.productId;
          return String(productTitle)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
    }

    return matchesStatus && matchesSearch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm, orderType]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const statusConfig: Record<
      string,
      { color: string; icon: any; text: string }
    > = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "قيد الانتظار",
      },
      link_sent: {
        color: "bg-blue-100 text-blue-800",
        icon: LinkIcon,
        text: "تم إرسال الرابط",
      },
      delivered: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "تم التسليم",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "ملغي",
      },
    };

    const config = statusConfig[statusLower] || statusConfig.pending;
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

  const getOrderStatusBadge = (order: UnifiedOrder) => {
    const status = getOrderStatus(order);
    return getStatusBadge(status);
  };

  const getPaymentStateBadge = (paymentState: string) => {
    if (!paymentState || paymentState === "غير متوفر") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          غير متوفر
        </span>
      );
    }

    const paymentConfig: Record<string, { color: string; text: string }> = {
      Pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: "قيد الانتظار",
      },
      Paid: {
        color: "bg-green-100 text-green-800",
        text: "مدفوع",
      },
      Completed: {
        color: "bg-green-100 text-green-800",
        text: "تم الدفع",
      },
      Failed: {
        color: "bg-red-100 text-red-800",
        text: "فشل",
      },
    };

    const config = paymentConfig[paymentState] || paymentConfig.Pending;

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
      if (traderId.nameOfbussinessActor) {
        return traderId.nameOfbussinessActor;
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
          <p className="text-gray-600 text-lg">
            جاري تحميل الطلبات المباشرة...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">الطلبات المباشرة</h1>
                <p className="text-indigo-100 text-lg">
                  عرض وإدارة جميع الطلبات المباشرة من التجار
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setOrderType("direct");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                    orderType === "direct"
                      ? "bg-white text-indigo-600 font-semibold"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  الطلبات المباشرة ({directOrders.length})
                </button>
                <button
                  onClick={() => {
                    setOrderType("all");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                    orderType === "all"
                      ? "bg-white text-indigo-600 font-semibold"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  جميع الطلبات ({allOrders.length})
                </button>
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">جميع الطلبات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="link_sent">تم إرسال الرابط</option>
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
                className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  إجمالي الطلبات
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {filteredOrders.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
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
                  {
                    filteredOrders.filter((o) =>
                      getOrderStatus(o).toLowerCase().includes("pending")
                    ).length
                  }
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
                  تم إرسال الرابط
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {
                    filteredOrders.filter((o) =>
                      getOrderStatus(o).toLowerCase().includes("link_sent")
                    ).length
                  }
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <LinkIcon className="w-8 h-8 text-white" />
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
                  {filteredOrders
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

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">قائمة الطلبات</h2>
          </div>

          {paginatedOrders.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا توجد طلبات</p>
              <p className="text-gray-400 text-sm">
                لم يتم العثور على أي طلبات تطابق المعايير المحددة
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        رقم الطلب
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        العناصر
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        التاجر
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        المبلغ الإجمالي
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاريخ الإنشاء
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
                    {paginatedOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order._id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {isDirectOrder(order) ? (
                            <div className="space-y-1">
                              {order.orders.slice(0, 2).map((item) => (
                                <div
                                  key={item._id}
                                  className="flex items-center gap-2"
                                >
                                  <Package className="w-4 h-4 text-gray-400" />
                                  <span className="truncate max-w-xs">
                                    {item.title} (×{item.quantity || 1})
                                  </span>
                                </div>
                              ))}
                              {order.orders.length > 2 && (
                                <p className="text-xs text-gray-500">
                                  +{order.orders.length - 2} عناصر أخرى
                                </p>
                              )}
                            </div>
                          ) : isAllOrder(order) ? (
                            <div className="space-y-1">
                              {order.products.slice(0, 2).map((product) => {
                                const title =
                                  typeof product.productId === "object" &&
                                  product.productId?.title
                                    ? product.productId.title
                                    : "منتج";
                                return (
                                  <div
                                    key={product._id}
                                    className="flex items-center gap-2"
                                  >
                                    <Package className="w-4 h-4 text-gray-400" />
                                    <span className="truncate max-w-xs">
                                      {title} (×{product.quantity})
                                    </span>
                                  </div>
                                );
                              })}
                              {order.products.length > 2 && (
                                <p className="text-xs text-gray-500">
                                  +{order.products.length - 2} عناصر أخرى
                                </p>
                              )}
                            </div>
                          ) : null}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {isDirectOrder(order) ? (
                            typeof order.traderId === "object" &&
                            order.traderId ? (
                              <div className="flex items-center gap-2">
                                <Store className="w-4 h-4 text-gray-400" />
                                <span>
                                  {getTraderDisplayName(order.traderId)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">غير متوفر</span>
                            )
                          ) : isAllOrder(order) ? (
                            order.products[0]?.traderId &&
                            typeof order.products[0].traderId === "object" ? (
                              <div className="flex items-center gap-2">
                                <Store className="w-4 h-4 text-gray-400" />
                                <span>
                                  {getTraderDisplayName(
                                    order.products[0].traderId
                                  )}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">غير متوفر</span>
                            )
                          ) : (
                            <span className="text-gray-400">غير متوفر</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {calculateTotalAmount(order).toLocaleString()} ر.س
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {isDirectOrder(order)
                              ? formatDate(order.createdAt)
                              : isAllOrder(order)
                              ? formatDate(order.orderDate)
                              : ""}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getOrderStatusBadge(order)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPaymentStateBadge(getPaymentState(order))}
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
                              className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-indigo-50 transition-colors duration-200"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">
                        عدد العناصر في الصفحة:
                      </span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1);
                        }}
                        className="px-3 py-1 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">
                        عرض {startIndex + 1} -{" "}
                        {Math.min(endIndex, filteredOrders.length)} من{" "}
                        {filteredOrders.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        title="الصفحة السابقة"
                      >
                        <ChevronRight className="w-5 h-5 text-black" />
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            // Show first page, last page, current page, and pages around current
                            if (
                              page === 1 ||
                              page === totalPages ||
                              (page >= currentPage - 1 &&
                                page <= currentPage + 1)
                            ) {
                              return true;
                            }
                            return false;
                          })
                          .map((page, index, array) => {
                            // Add ellipsis if there's a gap
                            const showEllipsisBefore =
                              index > 0 && array[index - 1] !== page - 1;
                            return (
                              <React.Fragment key={page}>
                                {showEllipsisBefore && (
                                  <span className="px-2 text-gray-500">
                                    ...
                                  </span>
                                )}
                                <button
                                  onClick={() => handlePageChange(page)}
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    currentPage === page
                                      ? "bg-indigo-600 text-white"
                                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                                  }`}
                                >
                                  {page}
                                </button>
                              </React.Fragment>
                            );
                          })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg text-black border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        title="الصفحة التالية"
                      >
                        <ChevronLeft className="w-5 h-5 text-black" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                تفاصيل الطلب المباشر
              </h3>
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
                      <span className="font-medium">تاريخ الإنشاء:</span>{" "}
                      {isDirectOrder(selectedOrderDetails)
                        ? formatDate(selectedOrderDetails.createdAt)
                        : isAllOrder(selectedOrderDetails)
                        ? formatDate(selectedOrderDetails.orderDate)
                        : ""}
                    </p>
                    {isDirectOrder(selectedOrderDetails) && (
                      <p>
                        <span className="font-medium">آخر تحديث:</span>{" "}
                        {formatDate(selectedOrderDetails.updatedAt)}
                      </p>
                    )}
                    {getPaymentState(selectedOrderDetails) && (
                      <p>
                        <span className="font-medium">حالة الدفع:</span>{" "}
                        {getPaymentStateBadge(
                          getPaymentState(selectedOrderDetails)
                        )}
                      </p>
                    )}
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
                      <span className="font-medium">عدد العناصر:</span>{" "}
                      {isDirectOrder(selectedOrderDetails)
                        ? selectedOrderDetails.orders.length
                        : isAllOrder(selectedOrderDetails)
                        ? selectedOrderDetails.products.length
                        : 0}
                    </p>
                    <p>
                      <span className="font-medium">الكمية الإجمالية:</span>{" "}
                      {isDirectOrder(selectedOrderDetails)
                        ? selectedOrderDetails.orders.reduce(
                            (sum: number, item: DirectOrderItem) =>
                              sum + (item.quantity || 1),
                            0
                          )
                        : isAllOrder(selectedOrderDetails)
                        ? selectedOrderDetails.products.reduce(
                            (sum: number, product: AllOrderProduct) =>
                              sum + product.quantity,
                            0
                          )
                        : 0}
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

              {/* Trader Info */}
              {(() => {
                let trader: Trader | null = null;
                if (isDirectOrder(selectedOrderDetails)) {
                  trader =
                    typeof selectedOrderDetails.traderId === "object"
                      ? selectedOrderDetails.traderId
                      : null;
                } else if (isAllOrder(selectedOrderDetails)) {
                  const firstProduct = selectedOrderDetails.products[0];
                  trader =
                    firstProduct?.traderId &&
                    typeof firstProduct.traderId === "object"
                      ? firstProduct.traderId
                      : null;
                }

                return trader ? (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Store className="w-5 h-5 text-green-600" />
                      <h4 className="text-lg font-bold text-gray-900">
                        معلومات التاجر
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {trader.UID && (
                        <div>
                          <span className="text-gray-600 font-medium">
                            UID:
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {trader.UID}
                          </p>
                        </div>
                      )}
                      {trader.nameOfbussinessActor && (
                        <div>
                          <span className="text-gray-600 font-medium">
                            اسم النشاط التجاري:
                          </span>
                          <p className="text-gray-900 font-semibold">
                            {trader.nameOfbussinessActor}
                          </p>
                        </div>
                      )}
                      {trader.firstName && (
                        <div>
                          <span className="text-gray-600 font-medium">
                            الاسم الأول:
                          </span>
                          <p className="text-gray-900">{trader.firstName}</p>
                        </div>
                      )}
                      {trader.lastName && (
                        <div>
                          <span className="text-gray-600 font-medium">
                            اسم العائلة:
                          </span>
                          <p className="text-gray-900">{trader.lastName}</p>
                        </div>
                      )}
                      {trader.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <div>
                            <span className="text-gray-600 font-medium">
                              البريد الإلكتروني:
                            </span>
                            <p className="text-gray-900">{trader.email}</p>
                          </div>
                        </div>
                      )}
                      {trader.phoneNumber && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <div>
                            <span className="text-gray-600 font-medium">
                              رقم الهاتف:
                            </span>
                            <p className="text-gray-900">
                              {trader.phoneNumber}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Order Items List */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">العناصر</h4>
                <div className="space-y-4">
                  {isDirectOrder(selectedOrderDetails) &&
                    selectedOrderDetails.orders.map((item) => (
                      <div
                        key={item._id}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-2">
                              {item.title}
                            </h5>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.description}
                            </p>
                          </div>
                          <div>{getStatusBadge(item.status)}</div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">السعر:</span>{" "}
                            <span className="font-medium text-black">
                              {item.price.toLocaleString()} ر.س
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">الكمية:</span>{" "}
                            <span className="font-medium text-black">
                              {item.quantity || 1}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">المجموع:</span>{" "}
                            <span className="font-semibold text-green-600">
                              {(
                                item.price * (item.quantity || 1)
                              ).toLocaleString()}{" "}
                              ر.س
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">رقم الطلب:</span>{" "}
                            <span className="font-medium font-mono text-xs text-black">
                              {item.order_id}
                            </span>
                          </div>
                          {item.phoneNumber && (
                            <div className="flex items-center gap-2 md:col-span-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <div>
                                <span className="text-gray-500">
                                  رقم الهاتف:
                                </span>{" "}
                                <span className="font-medium">
                                  {item.phoneNumber}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  {isAllOrder(selectedOrderDetails) &&
                    selectedOrderDetails.products.map((product) => {
                      const title =
                        typeof product.productId === "object" &&
                        product.productId?.title
                          ? product.productId.title
                          : "منتج";
                      return (
                        <div
                          key={product._id}
                          className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 mb-2">
                                {title}
                              </h5>
                            </div>
                            <div>
                              {getStatusBadge(selectedOrderDetails.status)}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">السعر:</span>{" "}
                              <span className="font-medium text-black">
                                {product.price.toLocaleString()} ر.س
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">الكمية:</span>{" "}
                              <span className="font-medium text-black">
                                {product.quantity}
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
                      );
                    })}
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
