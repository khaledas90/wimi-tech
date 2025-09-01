'use client'
import { Bell, User2, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import logo from '../../../../public/asset/images/ويمي تك.jpg'
import Link from 'next/link'
import Cookies from 'js-cookie';
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { BaseUrl } from '../Baseurl'
export default function Topbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router=useRouter();

    const get_user_notification = `${BaseUrl}users/getMyNotification`;
      const [allnotificatio, setAllnotificatio] = useState(0);
    
    const token = Cookies.get("token_admin");

  const logout = () => {
    Cookies.remove('token_admin');
        setTimeout(() => {
      window.location.href = "/";

}, 500);
    setOpenMenu(false);
  }


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(get_user_notification, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllnotificatio(res.data.data.length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      dir="rtl"
      className="
        fixed top-0 left-0 right-0 z-30 h-16
         bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] 
         rounded-md
        shadow-sm
        flex items-center justify-between
        px-4 sm:px-6 lg:px-6
        backdrop-blur-md border-b border-purple-100
        lg:right-64
      "
    >
      {/* الشعار والترحيب */}
      <div className="flex items-center gap-3">
        <Link href={'/'}>
          <Image
            src={logo}
            alt="لوجو"
            width={36}
            height={36}
            className="rounded-full shadow-md"
            unoptimized
          />
        </Link>
        <h1 className="text-sm sm:text-base font-bold text-border-icon truncate max-w-xs sm:max-w-md">
          أهلاً بك في لوحة التحكم 👋
        </h1>
      </div>

      {/* الإشعارات واليوزر */}
      <div className="relative flex items-center gap-3 text-border-icon" ref={menuRef}>
     

        {/* زر اليوزر لفتح القائمة */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-[#EEDCFB] transition-colors"
          aria-label="حساب المستخدم"
          onClick={() => setOpenMenu((prev) => !prev)}
        >
          <User2 size={20} />
        </motion.button>
<motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
  className="relative p-2 rounded-full hover:bg-[#EEDCFB] transition-colors"
  aria-label="حساب المستخدم"
>
  <Link href="/admin/notification" className="relative flex items-center justify-center">
    <Bell size={20} />
    {allnotificatio > 0 && (
      <span className="absolute -top-1 -right-3 bg-[#f0a136] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
        {allnotificatio}
      </span>
    )}
  </Link>
</motion.button>


        {/* منيو منسدلة */}
        <AnimatePresence>
          {openMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 left-0 bg-white border border-purple-200 shadow-lg rounded-xl w-44 p-2 z-50"
            >
              <button
                onClick={logout}
                className="flex items-center  gap-2 text-sm text-gray-700 hover:text-red-500 hover:bg-purple-50 p-2 rounded-lg w-full transition-colors"
              >
                <LogOut size={16} />
                تسجيل الخروج
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
