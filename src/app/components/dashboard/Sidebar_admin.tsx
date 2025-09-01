'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, TrendingUp , Settings,  Menu, UserCog, User } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard_admin', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/dashboard_admin/main_users', label: 'اداره المستخدمين', icon: UserCog },
  { href: '/dashboard_admin/user_waiting', label: 'قائمه الانتظار', icon: User },
  { href: '/dashboard_admin/profits', label: 'الارباح', icon: TrendingUp  },
]

export default function Sidebar_admin() {
  const path = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* زر الهامبرجر للهواتف */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#372740] text-white p-4 rounded-full shadow-lg hover:bg-[#2b1d4e] transition"
        aria-label="فتح القائمة"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
  <aside
  dir="rtl"
  className={`
    fixed top-0 right-0 h-screen w-64  bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155]  text-white shadow-xl rounded-l-lg z-40 flex flex-col transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
    lg:translate-x-0
    overflow-y-auto
  `}
>

      
        <div className="p-6 text-center font-bold text-xl border-b border-white/10">
          لوحة التحكم
        </div>

        <nav className="flex flex-col p-4 gap-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = path === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200
                  ${
                    isActive
                      ? 'bg-white/10 text-yellow-300 border-b-4 border-yellow-300'
                      : 'hover:bg-white/20 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* الخلفية السوداء عند فتح القائمة في الموبايل */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}
    </>
  )
}
