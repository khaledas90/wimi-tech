"use client";
import { BaseUrl } from "@/app/components/Baseurl";
import { Main_Admin_pannel } from "@/app/lib/type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import moment from "moment";

export default function Admin_Dash() {
  const url_main_admin_pannel = `${BaseUrl}admin/main`;
  const [admin, setadmin] = useState<Main_Admin_pannel>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getmainpannel = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url_main_admin_pannel);
        setadmin(res.data.data);
        console.log(res.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    getmainpannel();
  }, []);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    href,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    href?: string;
  }) => {
    const CardContent = () => (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value ?? "..."}</p>
          </div>
          <div
            className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    );

    if (href) {
      return (
        <Link href={href} className="block">
          <CardContent />
        </Link>
      );
    }

    return <CardContent />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                مرحباً بك في لوحة التحكم
              </h1>
              <p className="text-blue-100 text-lg">
                إدارة شاملة لجميع جوانب النظام
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">آخر تحديث</div>
              <div className="text-lg font-semibold">
                {moment().format("YYYY/MM/DD HH:mm")}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="إجمالي المستخدمين"
            value={admin?.totalUsers || 0}
            icon={Users}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            href="/dashboard_admin/users"
          />
          <StatCard
            title="التجار قيد الانتظار"
            value={admin?.waitingTraders || 0}
            icon={Clock}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
            href="/dashboard_admin/user_waiting"
          />
          <StatCard
            title="إجمالي الطلبات"
            value={admin?.totalOrders || 0}
            icon={ShoppingCart}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            title="إجمالي الأرباح"
            value={`${Number(admin?.totalEarnings || 0).toLocaleString()} ر.س`}
            icon={DollarSign}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <StatCard
            title="أرباح الإدارة"
            value={`${Number(admin?.adminEarnings || 0).toLocaleString()} ر.س`}
            icon={TrendingUp}
            color="bg-gradient-to-r from-pink-500 to-pink-600"
          />
          <StatCard
            title="أرباح التجار"
            value={`${Number(
              admin?.tradersEarnings || 0
            ).toLocaleString()} ر.س`}
            icon={Store}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            href="/dashboard_admin/profits"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            الإجراءات السريعة
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/dashboard_admin/users"
              className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200"
            >
              <Users className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-blue-900">
                إدارة المستخدمين
              </span>
            </Link>
            <Link
              href="/dashboard_admin/traders"
              className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200"
            >
              <Store className="w-6 h-6 text-green-600" />
              <span className="font-medium text-green-900">إدارة التجار</span>
            </Link>
            <Link
              href="/dashboard_admin/user_waiting"
              className="flex items-center gap-3 p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors duration-200"
            >
              <Clock className="w-6 h-6 text-orange-600" />
              <span className="font-medium text-orange-900">
                قائمة الانتظار
              </span>
            </Link>
            <Link
              href="/dashboard_admin/requests"
              className="flex items-center gap-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors duration-200"
            >
              <FileText className="w-6 h-6 text-indigo-600" />
              <span className="font-medium text-indigo-900">
                إدارة الطلبات
              </span>
            </Link>
            <Link
              href="/dashboard_admin/wallets"
              className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors duration-200"
            >
              <Wallet className="w-6 h-6 text-emerald-600" />
              <span className="font-medium text-emerald-900">
                إدارة المحافظ
              </span>
            </Link>
            <Link
              href="/dashboard_admin/profits"
              className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200"
            >
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-purple-900">
                تقارير الأرباح
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
