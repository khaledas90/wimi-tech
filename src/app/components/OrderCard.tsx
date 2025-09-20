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
  return (
    <div className="bg-gradient-to-br from-card to-surface rounded-2xl p-6 border border-border shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-foreground leading-tight">
              {order.title}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            {order.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-surface/50 rounded-lg p-3">
              <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">رقم الهاتف</p>
                <p className="font-semibold text-foreground">
                  {order.phoneNumber || "غير متوفر"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-surface/50 rounded-lg p-3">
              <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center">
                <Receipt className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">رقم الطلب</p>
                <p className="font-semibold text-foreground">
                  {order.order_id}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-32 flex flex-row lg:flex-col  items-center justify-around bg-gradient-to-br from-primary-light to-primary-light/50 rounded-xl p-4">
          <div className="">
            <span>سعر القطعه</span>
            <div className="flex">
              <div className="text-2xl font-bold text-primary mb-1">
                {order.price}
              </div>
              <div className="text-sm text-primary/70">ر.س</div>
            </div>
          </div>
          <div className="">
            <span>الكميه</span>
            <div className="flex">
              <div className="text-2xl font-bold text-primary mb-1">
                {order.quantity}
              </div>
              <div className="text-sm text-primary/70">قطعه</div>
            </div>
          </div>
          <div className="">
            <span>الاجمالي</span>
            <div className="flex">
              <div className="text-2xl font-bold text-primary mb-1">
                {order.quantity * order.price}
              </div>
              <div className="text-sm text-primary/70">ر.س</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
