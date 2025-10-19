"use client";
import { useState, useEffect } from "react";
import { Trash2, Send } from "lucide-react";
import { BaseUrl } from "@/app/components/Baseurl";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface Order {
  _id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  order_id?: string; // Made optional since AddProductModal doesn't create this
  status?: string;
  phoneNumber?: string;
}

interface OrdersTableProps {
  phoneNumber: string;
  onOrderDeleted: () => void;
  onSendBulkPaymentLinks: (selectedOrders: Order[]) => void;
  refreshTrigger?: number;
}

const OrdersTable = ({
  phoneNumber,
  onOrderDeleted,
  onSendBulkPaymentLinks,
  refreshTrigger,
}: OrdersTableProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sendingBulk, setSendingBulk] = useState(false);

  const token = Cookies.get("token_admin");

  // Debug function to check cookie
  const verifyCookie = () => {
    const cookieData = Cookies.get("direct_payment_products");
    console.log("=== COOKIE VERIFICATION ===");
    console.log("Raw cookie data:", cookieData);

    if (cookieData) {
      try {
        const parsedData = JSON.parse(cookieData);
        console.log("Parsed cookie data:", parsedData);
        console.log("Number of products:", parsedData.length);
        console.log(
          "Products for current phone:",
          parsedData.filter((p: any) => p.phoneNumber === phoneNumber)
        );
      } catch (error) {
        console.error("Error parsing cookie:", error);
      }
    } else {
      console.log("No cookie data found");
    }
    console.log("=== END VERIFICATION ===");
  };

  useEffect(() => {
    if (phoneNumber) {
      // Verify cookie first
      verifyCookie();

      // Read cookie data fresh each time
      const cookieData = Cookies.get("direct_payment_products");
      console.log("OrdersTable - Cookie data:", cookieData);

      const Allorders = cookieData ? JSON.parse(cookieData) : [];
      console.log("OrdersTable - Parsed orders:", Allorders);

      // Filter orders by phone number
      const filteredOrders = Allorders.filter(
        (order: Order) => order.phoneNumber === phoneNumber
      );
      console.log(
        "OrdersTable - Filtered orders for phone:",
        phoneNumber,
        filteredOrders
      );

      setOrders(filteredOrders);
    }
  }, [phoneNumber, refreshTrigger]);

  useEffect(() => {
    // Clear selections when orders change
    setSelectedOrders([]);
  }, [orders]);

  // Debug useEffect - runs on every render
  useEffect(() => {
    console.log("OrdersTable render - Current state:", {
      phoneNumber,
      ordersCount: orders.length,
      orders,
      refreshTrigger,
    });
  });

  // const fetchOrders = async () => {
  //   if (!phoneNumber) return;
  //   if (!token) {
  //     toast.error("يرجى تسجيل الدخول أولاً");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await axios.get(
  //       `${BaseUrl}direct-payment/${phoneNumber}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.data.success) {
  //       setOrders(response.data.data || []);
  //     } else {
  //       toast.error(response.data.message || "فشل في جلب الطلبات");
  //     }
  //   } catch (error: any) {
  //     console.error("Error fetching orders:", error);
  //     if (error.response?.status === 404) {
  //       setOrders([]);
  //     } else {
  //       toast.error(error?.response?.data?.message || "خطأ في جلب الطلبات");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const deleteOrder = async (orderId: string) => {
    console.log("Deleting order with ID:", orderId);

    // Get all orders from cookie
    const cookieData = Cookies.get("direct_payment_products");
    const allOrders = cookieData ? JSON.parse(cookieData) : [];

    // Filter out the order to delete
    const updatedAllOrders = allOrders.filter(
      (order: Order) => order._id !== orderId
    );

    console.log("Updated orders after deletion:", updatedAllOrders);

    // Update cookie
    Cookies.set("direct_payment_products", JSON.stringify(updatedAllOrders), {
      expires: 30,
      path: "/",
      secure: false,
      sameSite: "lax",
    });

    // Update local state
    setOrders((prevOrders) =>
      prevOrders.filter((order) => order._id !== orderId)
    );

    toast.success("تم حذف الطلب بنجاح");
    onOrderDeleted();
    // if (!token) {
    //   toast.error("يرجى تسجيل الدخول أولاً");
    //   return;
    // }
    // setDeletingOrder(orderId);
    // try {
    //   const response = await axios.delete(
    //     `${BaseUrl}direct-payment/${orderId}`,
    //     { headers: { Authorization: `Bearer ${token}` } }
    //   );
    //   if (response.data.success) {
    //     toast.success("تم حذف الطلب بنجاح");
    //     onOrderDeleted();
    //     // fetchOrders();
    //   } else {
    //     toast.error(response.data.message || "فشل في حذف الطلب");
    //   }
    // } catch (error: any) {
    //   console.error("Error deleting order:", error);
    //   toast.error(error?.response?.data?.message || "حدث خطأ أثناء حذف الطلب");
    // } finally {
    //   setDeletingOrder(null);
    // }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(
        orders
          .filter((or) => or.phoneNumber === phoneNumber)
          .map((order) => order._id)
      );
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSendSelected = () => {
    const selectedOrdersData = orders.filter((order) =>
      selectedOrders.includes(order._id)
    );
    onSendBulkPaymentLinks(selectedOrdersData);
  };

  const isAllSelected =
    orders.length > 0 && selectedOrders.length === orders.length;
  const isIndeterminate =
    selectedOrders.length > 0 && selectedOrders.length < orders.length;

  if (loading) {
    return (
      <div className="text-center py-6 sm:py-8">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          جاري تحميل الطلبات...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
        لا توجد طلبات لهذا الرقم حالياً.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Debug Section - Remove this after testing */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-bold text-yellow-800 mb-2">Debug Info:</h4>
        <p className="text-sm text-yellow-700">Phone Number: {phoneNumber}</p>
        <p className="text-sm text-yellow-700">Orders Count: {orders.length}</p>
        <p className="text-sm text-yellow-700">
          Refresh Trigger: {refreshTrigger}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              console.log("=== MANUAL DEBUG ===");
              const cookieData = Cookies.get("direct_payment_products");
              console.log("Manual cookie check:", cookieData);
              if (cookieData) {
                const parsed = JSON.parse(cookieData);
                console.log("Manual parsed data:", parsed);
                console.log("All products:", parsed);
                console.log(
                  "Products for this phone:",
                  parsed.filter((p: any) => p.phoneNumber === phoneNumber)
                );
              }
              verifyCookie();
            }}
            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm"
          >
            Check Cookie
          </button>
          <button
            onClick={() => {
              console.log("=== ADDING TEST PRODUCT ===");
              const testProduct = {
                _id: `test_${Date.now()}`,
                title: "Test Product",
                description: "This is a test product",
                price: 100,
                quantity: 1,
                phoneNumber: phoneNumber,
              };

              const existingData = Cookies.get("direct_payment_products");
              const existingProducts = existingData
                ? JSON.parse(existingData)
                : [];
              const updatedProducts = [...existingProducts, testProduct];

              console.log("Adding test product:", testProduct);
              console.log("Updated products:", updatedProducts);

              Cookies.set(
                "direct_payment_products",
                JSON.stringify(updatedProducts),
                {
                  expires: 30,
                  path: "/",
                  secure: false,
                  sameSite: "lax",
                }
              );

              // Force refresh
              window.location.reload();
            }}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
          >
            Add Test Product
          </button>
        </div>
      </div>

      {orders.filter((or) => or.phoneNumber === phoneNumber).length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />

                <span className="text-sm font-medium text-gray-700">
                  تحديد الكل ({selectedOrders.length}/
                  {orders.filter((or) => or.phoneNumber === phoneNumber).length}
                  )
                </span>
              </label>
            </div>
            {selectedOrders.length > 0 && (
              <button
                onClick={handleSendSelected}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
              >
                <Send size={16} />
                إرسال المحدد ({selectedOrders.length})
              </button>
            )}
          </div>
        </div>
      )}

      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-700 border-b">
                #
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-700 border-b">
                العنوان
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-700 border-b">
                الوصف
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-700 border-b">
                السعر
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-700 border-b">
                الكمية
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-700 border-b">
                الحالة
              </th>
              <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-gray-700 border-b">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders
              .filter((or) => or.phoneNumber === phoneNumber)
              .map((order, index) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 border-b">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={(e) =>
                          handleSelectOrder(order._id, e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span>{index + 1}</span>
                    </label>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 border-b font-medium">
                    {order.title}
                  </td>
                  <td className="px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 border-b max-w-xs truncate">
                    {order.description}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-green-600 border-b font-semibold">
                    {order.price} ريال
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 border-b">
                    {order.quantity}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 border-b">
                    {order.status || "قيد المعالجة"}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 border-b">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      disabled={deletingOrder === order._id}
                      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      title="حذف الطلب"
                      aria-label="حذف الطلب"
                    >
                      <Trash2 size={16} className="sm:w-5 sm:h-5" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="block sm:hidden space-y-4">
        {orders
          .filter((or) => or.phoneNumber === phoneNumber)
          .map((order, index) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order._id)}
                    onChange={(e) =>
                      handleSelectOrder(order._id, e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    #{index + 1}
                  </span>
                </label>
                <button
                  onClick={() => deleteOrder(order._id)}
                  disabled={deletingOrder === order._id}
                  className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                  title="حذف الطلب"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">العنوان</span>
                  <span className="font-medium text-gray-700">
                    {order.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الوصف</span>
                  <span className="text-gray-700 truncate">
                    {order.description}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">السعر</span>
                  <span className="text-green-600 font-semibold">
                    {order.price} ريال
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الكمية</span>
                  <span className="text-gray-700">{order.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الحالة</span>
                  <span className="text-gray-700">
                    {order.status || "قيد المعالجة"}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrdersTable;
