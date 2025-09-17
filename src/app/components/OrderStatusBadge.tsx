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
          className: "bg-pending-light text-pending border-pending/20",
        };
      case "confirmed":
        return {
          label: "مؤكد",
          icon: CheckCircle,
          className: "bg-primary-light text-primary border-primary/20",
        };
      case "shipped":
        return {
          label: "تم الشحن",
          icon: Truck,
          className: "bg-warning-light text-warning border-warning/20",
        };
      case "delivered":
        return {
          label: "تم التسليم",
          icon: Package,
          className: "bg-success-light text-success border-success/20",
        };
      case "cancelled":
        return {
          label: "ملغي",
          icon: XCircle,
          className: "bg-error-light text-error border-error/20",
        };
      default:
        return {
          label: status,
          icon: Clock,
          className: "bg-muted text-muted-foreground border-border",
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
