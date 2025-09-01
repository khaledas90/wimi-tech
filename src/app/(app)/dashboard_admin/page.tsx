'use client'
import { BaseUrl } from '@/app/components/Baseurl'
import Container from '@/app/components/Container'
import { ApiResponse, Main_Admin_pannel } from '@/app/lib/type'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Admin_Dash() {
  const url_main_admin_pannel = `${BaseUrl}admin/main`
  const [admin, setadmin] = useState<Main_Admin_pannel>()

  useEffect(() => {
    const getmainpannel = async () => {
      const res = await axios.get(url_main_admin_pannel)
      setadmin(res.data.data)
      console.log(res.data.data)
    }
    getmainpannel()
  }, [])

  const stats = [
    {
      title: 'إجمالي المستخدمين',
      value: admin?.totalUsers,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      title: 'التجار قيد الانتظار',
      value: admin?.waitingTraders,
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      title: 'إجمالي الطلبات',
      value: admin?.totalOrders,
      color: 'from-green-400 to-emerald-600',
    },
    {
      title: 'إجمالي الأرباح',
      value: `${admin?.totalEarnings} ر.س`,
      color: 'from-cyan-500 to-sky-700',
    },
    {
      title: 'أرباح الإدارة',
      value: `${admin?.adminEarnings} ر.س`,
      color: 'from-pink-500 to-rose-600',
    },
    {
      title: 'أرباح التجار',
      value: `${admin?.tradersEarnings} ر.س`,
      color: 'from-orange-400 to-red-500',
    },
  ]

  return (
    <Container>
      <div className="text-black py-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#1e293b] dark:text-white">
          لوحة تحكم الإدارة
        </h1>

        {/* كروت الاحصائيات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-6 shadow-lg transition-transform hover:scale-[1.03]`}
            >
              <h2 className="text-xl font-semibold mb-2">{stat.title}</h2>
              <p className="text-3xl font-bold">{stat.value ?? '...'}</p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
