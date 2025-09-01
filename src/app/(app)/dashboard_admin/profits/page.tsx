"use client"

import { BaseUrl } from "@/app/components/Baseurl"
import Container from "@/app/components/Container"
import { Total_Profits, Traderprofits } from "@/app/lib/type"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaPhoneAlt, FaMoneyBillWave } from "react-icons/fa"

export default function Profits() {
    const [profits, setProfits] = useState<Traderprofits[]>([])
    const [total,settotal]=useState<Total_Profits>();
    const get_traders_profits = `${BaseUrl}admin/getTradersProfits`;
    const get_total_profits = `${BaseUrl}admin/getPlatformProfit`;

    useEffect(() => {
        const getprofits = async () => {
            try {
                const res = await axios.get(get_traders_profits)
                setProfits(res.data.data)
                console.log(res.data.data)
            } catch (error) {
                toast.error("حدث خطأ أثناء جلب البيانات")
                console.log(error)
            }
        }
        getprofits()
    }, [])


    useEffect(() => {
        const getprofits = async () => {
            try {
                const res = await axios.get(get_total_profits)
                settotal(res.data.data)
            } catch (error) {
                toast.error("حدث خطأ أثناء جلب البيانات")
                console.log(error)
            }
        }
        getprofits()
    }, [])
    return (
        <Container>
            <div className="py-10 px-4 md:px-12 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-[#1e293b]">📈 أرباح التجّار</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

  <div className="bg-white p-4 rounded-xl shadow text-center">
    <h3 className="text-gray-500 text-xm">أعلى ربح</h3>
    <p className="text-xl font-bold text-green-600">
      {Math.max(...profits.map((p) => p.totalProfit)).toFixed(2)} ر.س
    </p>
  </div>
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <h3 className="text-gray-500 text-xm">إجمالي الأرباح</h3>
    <p className="text-xl font-bold text-blue-600">
      {total?.platformProfit} ر.س
    </p>
  </div>
</div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {profits.map((profit) => (
    <div
      key={profit.traderId}
      className="bg-white p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300 relative"
    >
      <div className="absolute -top-3 -left-3 bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-full text-white shadow">
        {profit.traderName === "Unknown" ? "🚫" : profit.totalProfit > 10000 ? "📈" : "📉"}
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-2">
        {profit.traderName !== "Unknown" ? profit.traderName : "غير معروف"}
      </h2>

      <div className="text-green-600 text-2xl font-extrabold flex items-center gap-1 mb-1">
        {profit.totalProfit.toFixed(2) } ر.س
        <span className="text-sm">💵</span>
      </div>

      {profit.phoneNumber ? (
        <div className="text-gray-500 text-sm flex items-center gap-2">
          <span>📞</span>
          <span>{profit.phoneNumber}</span>
        </div>
      ) : (
        <div className="text-red-400 text-sm">لا يوجد رقم هاتف</div>
      )}
    </div>
  ))}
</div>

            </div>
        </Container>
    )
}
