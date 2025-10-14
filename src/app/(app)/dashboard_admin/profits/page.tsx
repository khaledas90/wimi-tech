"use client";

import { BaseUrl } from "@/app/components/Baseurl";
import { Total_Profits, Traderprofits } from "@/app/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  TrendingUp,
  DollarSign,
  Users,
  Phone,
  Store,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function Profits() {
  const [profits, setProfits] = useState<Traderprofits[]>([]);
  const [total, settotal] = useState<Total_Profits>();
  const [loading, setLoading] = useState(true);
  const get_traders_profits = `${BaseUrl}admin/getTradersProfits`;
  const get_total_profits = `${BaseUrl}admin/getPlatformProfit`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tradersRes, totalRes] = await Promise.all([
          axios.get(get_traders_profits),
          axios.get(get_total_profits),
        ]);

        setProfits(tradersRes.data.data);
        settotal(totalRes.data.data);
      } catch (error) {
        toast.error("حدث خطأ أثناء جلب البيانات");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    growth,
    isCurrency = false,
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    growth?: number;
    isCurrency?: boolean;
  }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {isCurrency
              ? `${Number(value).toLocaleString()} ر.س`
              : value.toLocaleString()}
          </p>
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              {growth > 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  growth > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {Math.abs(growth)}%
              </span>
              <span className="text-sm text-gray-500 mr-2">
                من الشهر الماضي
              </span>
            </div>
          )}
        </div>
        <div
          className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  const TraderCard = ({
    trader,
    index,
  }: {
    trader: Traderprofits;
    index: number;
  }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <Store className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            {trader.traderName !== "Unknown" ? trader.traderName : "غير معروف"}
          </h3>
          <p className="text-sm text-gray-500">تاجر</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            الربح: {trader.totalProfit.toLocaleString()} ر.س
          </span>
        </div>
        {trader.phoneNumber && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{trader.phoneNumber}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              trader.totalProfit > 10000 ? "bg-green-500" : "bg-orange-500"
            }`}
          ></div>
          <span className="text-sm text-gray-600">
            {trader.totalProfit > 10000 ? "أداء ممتاز" : "أداء جيد"}
          </span>
        </div>
        <div className="text-xs text-gray-500">#{index + 1}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل تقارير الأرباح...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  تقارير الأرباح
                </h1>
                <p className="text-gray-600 mt-1">
                  تحليل شامل لأرباح التجار والإيرادات
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {profits.length}
              </div>
              <div className="text-sm text-gray-500">إجمالي التجار</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="إجمالي أرباح المنصة"
            value={total?.platformProfit || 0}
            icon={DollarSign}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            isCurrency={true}
          />
          <StatCard
            title="أعلى ربح للتاجر"
            value={
              profits.length > 0
                ? Math.max(...profits.map((p) => p.totalProfit))
                : 0
            }
            icon={TrendingUp}
            color="bg-gradient-to-r from-green-500 to-green-600"
            isCurrency={true}
          />
          <StatCard
            title="متوسط الربح"
            value={
              profits.length > 0
                ? profits.reduce((sum, p) => sum + p.totalProfit, 0) /
                  profits.length
                : 0
            }
            icon={Users}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            isCurrency={true}
          />
        </div>

        {/* Traders Section */}
        <section>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Store className="w-6 h-6 text-green-500" />
              أرباح التجار
            </h2>

            {profits.length === 0 ? (
              <div className="text-center py-12">
                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  لا توجد بيانات أرباح متاحة
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profits
                  .sort((a, b) => b.totalProfit - a.totalProfit)
                  .map((trader, index) => (
                    <TraderCard
                      key={trader.traderId}
                      trader={trader}
                      index={index}
                    />
                  ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
