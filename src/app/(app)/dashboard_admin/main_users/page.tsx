'use client'
import { BaseUrl } from '@/app/components/Baseurl'
import PaginationComp from '@/app/components/Pagination'
import { ResponseData } from '@/app/lib/type'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Trash2, Ban, Bell } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function UsersAndTradersPage() {
  const [data, setData] = useState<ResponseData>()
  const [page, setPage] = useState(1)

  const urlUsers_Trader = `${BaseUrl}admin/users`

  const fetchData = async () => {
    try {
      const res = await axios.get(`${urlUsers_Trader}?page=${page}`)
    setData({
    users: res.data.data.users,
    traders: res.data.data.traders,
    pagination: {
    totalUserPages: res.data.data.pagination.totalUserPages,
    totalTraderPages: res.data.data.pagination.totalTraderPages,
    totalUsers: res.data.data.pagination.totalUsers,
    totalTraders: res.data.data.pagination.totalTraders,
    page: res.data.data.pagination.page,
    limit: res.data.data.pagination.limit,
  }
})

    } catch (err) {
      toast.error('حدث خطأ أثناء جلب البيانات')
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

const performAction = async (id: string, type: 'del' | 'block', role: 'user' | 'trader') => {
  try {
    await axios.post(`${urlUsers_Trader}/${id}/${type}`, {}, {
      params: { role }, 
      });
    fetchData();
  } catch (error) {
    toast.error('حدث خطأ أثناء تنفيذ العملية');
  }
};


  const handleDelete = (id: string, role: 'user' | 'trader') => {
    if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      performAction(id, 'del', role)
      toast.success('تم حذف الحساب بنجاح')
    } else {
      toast.error('تم إلغاء عملية الحذف')
    }
  }

  const handleBlock = (id: string, role: 'user' | 'trader') => {
    if (confirm('هل أنت متأكد من حظر هذا الحساب؟')) {
      performAction(id, 'block', role)
      toast.success('تم حظر الحساب بنجاح')
    } else {
      toast.error('تم إلغاء عملية الحظر')
    }
  }

  const UserCard = ({ user, role }: { user: any, role: 'user' | 'trader' }) => (
    <div className="bg-white border rounded-xl shadow-sm p-4 space-y-2 text-sm">
      <p><span className="font-semibold">👤 الاسم:</span> {user.firstName} {user.lastName}</p>
      <p><span className="font-semibold">📧 الإيميل:</span> {user.email}</p>
      <p><span className="font-semibold">📱 الهاتف:</span> {user.phoneNumber}</p>
      {role === 'trader' && <p><span className="font-semibold">📍 العنوان:</span> {user.address}</p>}
      <p><span className="font-semibold">🕓 التسجيل:</span> {moment(user.createdAt).format('YYYY/MM/DD HH:mm')}</p>
      <div className="flex gap-2 justify-end pt-2">
{role === 'trader' ? (
  <>
    <button title="حظر" onClick={() => handleBlock(user._id, role)} className="text-red-500 hover:text-red-700 transition">
      <Ban className="w-5 h-5" />
    </button>
    <button title="حذف" onClick={() => handleDelete(user._id, role)} className="text-gray-600 hover:text-black transition">
      <Trash2 className="w-5 h-5" />
    </button>
    <Link href={`/dashboard_admin/notification/${user._id}`} className="text-gray-600 hover:text-black">
      <Bell className="w-5 h-5" />
    </Link>
  </>
) : (
  <Link href={`/dashboard_admin/notification/${user._id}`} className="text-gray-600 hover:text-black">
    <Bell className="w-5 h-5" />
  </Link>
)}
      </div>
      </div>
  )

  const TableHeader = ({ headers }: { headers: string[] }) => (
    <thead>
      <tr className="bg-gray-100 text-gray-700 text-sm">
        {headers.map((h, i) => (
          <th key={i} className="p-3 text-right whitespace-nowrap">{h}</th>
        ))}
      </tr>
    </thead>
  )
return (
  <div className="p-4 md:p-6 space-y-12 max-w-7xl mx-auto">
       {/* Traders Section */}
    <section>
      <h2 className="text-xl font-bold mb-4">🛒 التجّار</h2>

      {/* Cards View (mobile + tablet) */}
      <div className="space-y-4 lg:hidden">
        {data?.traders.length === 0 ? (
          <p className="text-center text-gray-500">لا يوجد تجّار في هذه الصفحة.</p>
        ) : (
          data?.traders.map((trader) => (
            <UserCard key={trader._id} user={trader} role="trader" />
          ))
        )}
      </div>

      {/* Table View (desktop only) */}
      <div className="hidden lg:block overflow-x-auto shadow rounded-lg border border-gray-200">
        {data?.traders.length === 0 ? (
          <p className="text-center text-gray-500 p-4">لا يوجد تجّار في هذه الصفحة.</p>
        ) : (
          <table className="min-w-full bg-white text-sm">
            <TableHeader headers={['الاسم', 'الإيميل', 'رقم الهاتف', 'العنوان', 'تاريخ التسجيل', 'التحكم']} />
            <tbody>
              {data?.traders.map((trader) => (
                <tr key={trader._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">{trader.firstName} {trader.lastName}</td>
                  <td className="p-3 whitespace-nowrap">{trader.email}</td>
                  <td className="p-3 whitespace-nowrap">{trader.phoneNumber}</td>
                  <td className="p-3 whitespace-nowrap">{trader.address}</td>
                  <td className="p-3 whitespace-nowrap">{moment(trader.createdAt).format('YYYY/MM/DD HH:mm')}</td>
                  <td className="p-3">
                    <div className="flex text-center items-center pb-4 whitespace-nowrap gap-2">
                      <button title="حظر" onClick={() => handleBlock(trader._id, 'trader')} className="text-red-500 hover:text-red-700">
                        <Ban className="w-5 h-5" />
                      </button>
                      <button title="حذف" onClick={() => handleDelete(trader._id, 'trader')} className="text-gray-600 hover:text-black">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <Link href={`/dashboard_admin/notification/${trader._id}`} className="text-gray-600 hover:text-black">
                        <Bell className="w-5 h-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
    {/* Users Section */}
    <section>
      <h2 className="text-xl font-bold mb-4">📋 المستخدمين</h2>

      {/* Cards View (mobile + tablet) */}
      <div className="space-y-4 lg:hidden">
        {data?.users.length === 0 ? (
          <p className="text-center text-gray-500">لا يوجد مستخدمين في هذه الصفحة.</p>
        ) : (
          data?.users.map((user) => (
            <UserCard key={user._id} user={user} role="user" />
          ))
        )}
      </div>

      {/* Table View (desktop only) */}
      <div className="hidden lg:block overflow-x-auto shadow rounded-lg border border-gray-200">
        {data?.users.length === 0 ? (
          <p className="text-center text-gray-500 p-4">لا يوجد مستخدمين في هذه الصفحة.</p>
        ) : (
          <table className="min-w-full bg-white text-sm">
            <TableHeader headers={['الاسم', 'الإيميل', 'رقم الهاتف', 'تاريخ التسجيل', 'التحكم']} />
            <tbody>
              {data?.users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">{user.firstName} {user.lastName}</td>
                  <td className="p-3 whitespace-nowrap">{user.email}</td>
                  <td className="p-3 whitespace-nowrap">{user.phoneNumber}</td>
                  <td className="p-3 whitespace-nowrap">{moment(user.createdAt).format('YYYY/MM/DD HH:mm')}</td>
                  <td className="p-3">
                    <div className="flex  text-center items-center p-3 whitespace-nowrap gap-2">
                       <Link href={`/dashboard_admin/notification/${user._id}`} className="text-gray-600 hover:text-black">
                        <Bell className="w-5 h-5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>

 

    {/* Shared Pagination */}
    <PaginationComp
      page={page}
      totalPages={
        Math.max(
          data?.pagination.totalUserPages || 1,
          data?.pagination.totalTraderPages || 1
        )
      }
      onPageChange={setPage}
    />
  </div>
)

}
