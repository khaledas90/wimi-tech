"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Settings,
  Menu,
  Users,
  Store,
  Clock,
  BarChart3,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard_admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/dashboard_admin/users", label: "إدارة المستخدمين", icon: Users },
  { href: "/dashboard_admin/traders", label: "إدارة التجار", icon: Store },
  {
    href: "/dashboard_admin/user_waiting",
    label: "قائمة الانتظار",
    icon: Clock,
  },
  {
    href: "/dashboard_admin/profits",
    label: "تقارير الأرباح",
    icon: TrendingUp,
  },
];

export default function Sidebar_admin() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* زر الهامبرجر للهواتف */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
        aria-label="فتح القائمة"
      >
        <Menu size={24} />
      </button>

      <aside
        dir="rtl"
        className={`
    fixed top-0 right-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl   z-40 flex flex-col transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "translate-x-full"}
    lg:translate-x-0
    overflow-y-auto
  `}
      >
        <div className="p-8 text-center border-b border-white/10">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-gray-300 mt-1">نظام الإدارة المتقدم</p>
        </div>

        <nav className="flex flex-col p-6 gap-3">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = path === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                      : "hover:bg-white/10 hover:text-white hover:transform hover:scale-105 text-gray-300"
                  }
                `}
              >
                <Icon
                  size={22}
                  className={`${
                    isActive
                      ? "text-white"
                      : "text-gray-400 group-hover:text-white"
                  } transition-colors duration-300`}
                />
                <span className="text-base font-medium">{label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full ml-auto"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto p-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-sm text-gray-400">الإصدار 2.0</p>
            <p className="text-xs text-gray-500 mt-1">
              © 2024 جميع الحقوق محفوظة
            </p>
          </div>
        </div>
      </aside>

      {/* الخلفية السوداء عند فتح القائمة في الموبايل */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}
    </>
  );
}
