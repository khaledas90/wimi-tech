"use client";
import { useTrader } from "@/app/contexts/TraderContext";
import DashboardOverlay from "@/app/components/ui/DashboardOverlay";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({
  children,
}: ClientLayoutWrapperProps) {
  const { trader } = useTrader();

  const traderStatus = trader?.block
    ? "blocked"
    : trader?.waiting
    ? "waiting"
    : null;

  return (
    <>
      {children}
      {/* Show overlay if trader is blocked or waiting */}
      {traderStatus && <DashboardOverlay status={traderStatus} />}
    </>
  );
}
