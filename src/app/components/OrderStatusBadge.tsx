import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";
import { cn } from "../lib/utilits";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          label: "في الانتظار",
          icon: Clock,
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "confirmed":
        return {
          label: "مؤكد",
          icon: CheckCircle,
          className: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "shipped":
        return {
          label: "تم الشحن",
          icon: Truck,
          className: "bg-orange-100 text-orange-800 border-orange-200",
        };
      case "delivered":
        return {
          label: "تم التسليم",
          icon: Package,
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "cancelled":
        return {
          label: "ملغي",
          icon: XCircle,
          className: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          label: status,
          icon: Clock,
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-semibold text-sm",
        config.className,
        className
      )}
    >
      <Icon className="w-4 h-4" />
      {config.label}
    </div>
  );
}
