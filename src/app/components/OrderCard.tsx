import { Phone, Receipt } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface Order {
  _id: string;
  title: string;
  description: string;
  price: number;
  phoneNumber: string;
  quantity: number;
  order_id: string;
  status: string;
}

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  // Calculate discounted price (15% discount)
  const calculateDiscountedPrice = () => {
    return order.price * 0.85;
  };

  // Calculate total after discount
  const calculateTotalAfterDiscount = () => {
    return calculateDiscountedPrice() * order.quantity;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">
                {order.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {order.description}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">رقم الهاتف</p>
                <p className="font-semibold text-gray-900">
                  {order.phoneNumber || "غير متوفر"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">رقم الطلب</p>
                <p className="font-semibold text-gray-900">
                  {order.order_id}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-48 flex flex-row lg:flex-col items-center justify-between bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 border border-gray-200">
          <div className="text-center mb-2 lg:mb-4">
            <span className="text-xs text-gray-600 mb-1 block">السعر بعد الخصم</span>
            <div className="flex items-center justify-center">
              <div className="text-xl font-bold text-blue-600">
                {calculateDiscountedPrice().toFixed(2)}
              </div>
              <div className="text-sm text-blue-500 mr-1">ر.س</div>
            </div>
          </div>
          <div className="text-center mb-2 lg:mb-4">
            <span className="text-xs text-gray-600 mb-1 block">الكميه</span>
            <div className="flex items-center justify-center">
              <div className="text-xl font-bold text-green-600">
                {order.quantity}
              </div>
              <div className="text-sm text-green-500 mr-1">قطعه</div>
            </div>
          </div>
          <div className="text-center">
            <span className="text-xs text-gray-600 mb-1 block">الاجمالي</span>
            <div className="flex items-center justify-center">
              <div className="text-2xl font-bold text-green-600">
                {calculateTotalAfterDiscount().toFixed(2)}
              </div>
              <div className="text-sm text-green-500 mr-1">ر.س</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

