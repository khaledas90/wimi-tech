"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Package } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface Order {
  _id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
}

interface CreateOrderProps {
  userId: string;
  phoneNumber: string;
  onOrderCreated: () => void;
}

const CreateOrder = ({ userId, phoneNumber, onOrderCreated }: CreateOrderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingOrders, setFetchingOrders] = useState(false);

  const fetchOrders = async () => {
    setFetchingOrders(true);
    try {
      // Get products from cookies
      const productsJson = Cookies.get('direct_payment_products');
      const products = productsJson ? JSON.parse(productsJson) : [];
      setOrders(products);
    } catch (error: any) {
      console.error(error);
      toast.error("خطأ في جلب المنتجات");
    } finally {
      setFetchingOrders(false);
    }
  };

  const createOrder = async () => {
    if (!selectedOrder) {
      toast.error("يرجى اختيار منتج");
      return;
    }

    setLoading(true);
    try {
      // Create new order
      const newOrder = {
        _id: `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: selectedOrder.title,
        description: selectedOrder.description,
        price: selectedOrder.price * quantity,
        quantity: quantity,
        userId: userId,
        phoneNumber: phoneNumber,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      // Get existing orders from cookies for this phone number
      const existingOrdersJson = Cookies.get(`direct_payment_orders_${phoneNumber}`);
      const existingOrders = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];

      // Add new order
      const updatedOrders = [...existingOrders, newOrder];

      // Save to cookies
      Cookies.set(`direct_payment_orders_${phoneNumber}`, JSON.stringify(updatedOrders), { expires: 30 });

      toast.success("تم إنشاء الطلب بنجاح");
      onOrderCreated();
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedOrder(null);
    setQuantity(1);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="text-center mb-6">
        <ShoppingCart className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent">
          إنشاء طلب جديد
        </h2>
        <p className="text-gray-600 mt-2">اختر المنتج وحدد الكمية</p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            المنتجات المتاحة:
          </h3>
          <button
            onClick={fetchOrders}
            disabled={fetchingOrders}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md disabled:opacity-50"
          >
            <Package size={20} className={fetchingOrders ? "animate-spin" : ""} />
            {fetchingOrders ? "جاري التحميل..." : "تحديث المنتجات"}
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            لا توجد منتجات متاحة حالياً. قم بإضافة منتج جديد أولاً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                  selectedOrder?._id === order._id
                    ? "border-blue-500 bg-blue-50 shadow-lg transform scale-105"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="bg-gray-100 rounded-lg p-3 mb-3 flex items-center justify-center">
                  <Package size={32} className="text-gray-600" />
                </div>
                <h4 className="font-medium text-sm text-gray-800 mb-2">
                  {order.title}
                </h4>
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                  {order.description}
                </p>
                <p className="text-blue-600 font-semibold">
                  {order.price} ريال
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="mb-6 bg-gray-50 rounded-xl p-4">
          <label className="block text-lg font-semibold mb-2 text-gray-800">
            الكمية:
          </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24 px-3 py-2 border text-black border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-gray-600 mt-2 text-lg">
            الإجمالي:{" "}
            <span className="font-bold text-blue-600">
              {(selectedOrder.price * quantity).toLocaleString()} ريال
            </span>
          </p>
        </div>
      )}

      <div className="flex space-x-4 rtl:space-x-reverse">
        <button
          onClick={resetForm}
          className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition"
        >
          إعادة تعيين
        </button>
        <button
          onClick={createOrder}
          disabled={!selectedOrder || loading}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition disabled:opacity-50 shadow-lg"
        >
          {loading ? "جاري إنشاء الطلب..." : "إنشاء الطلب"}
        </button>
      </div>
    </div>
  );
};

export default CreateOrder;
