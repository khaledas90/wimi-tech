"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingCart, Heart, User2, Bell } from "lucide-react";
import Logo from "../../../../public/asset/images/ويمي تك.jpg";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BaseUrl } from "../Baseurl";
import { useTrader } from "@/app/contexts/TraderContext";
import { useUser } from "@/app/contexts/UserContext";

const SmartNavbar = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const token = Cookies.get("token");
  const token_admin = Cookies.get("token_admin");
  const [allProducts, setAllProducts] = useState(0);
  const [allnotificatio, setAllnotificatio] = useState(0);

  // Use trader and user contexts
  const { trader, logout: traderLogout } = useTrader();
  const { user, logout: userLogout } = useUser();
  const url = `${BaseUrl}users/shopping`;
  const get_user_notification = `${BaseUrl}users/getMyNotification`;
  const controlNavbar = () => {
    const currentScrollY = window.scrollY;
    setVisible(currentScrollY < lastScrollY || currentScrollY < 80);
    setLastScrollY(currentScrollY);
  };

  const handleLogout = () => {
    if (token_admin) {
      traderLogout();
    } else if (token) {
      userLogout();
    }
    setShowModal(false);
    router.push("/");
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllProducts(res.data.data.cartLength);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);
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
  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        } bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] shadow-md border-b-2 border-[#f59e0b]`}
      >
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* الشعار */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={Logo}
              alt="شعار"
              className="w-[30px] md:w-[46px]  h-[30px] md:h-[46px] rounded-full border-2 border-border-icon shadow-[0_0_12px_#10b981] transition-transform hover:scale-110"
              unoptimized
            />
          </Link>

          {/* شريط البحث */}
          <Link
            href={"/search"}
            className="hidden md:flex flex-1 max-w-lg items-center bg-white/90 backdrop-blur rounded-full px-4 py-1 shadow-inner focus-within:ring-2 focus-within:ring-yellow-400 transition"
          >
            <Search className="text-gray-500 ml-2" size={18} />
            <input
              type="text"
              placeholder="إبحث عن منتج..."
              className="bg-transparent flex-1 text-sm focus:outline-none text-gray-800 placeholder:text-gray-400"
            />
          </Link>

          {/* الأيقونات */}
          <div className="flex items-center gap-4 text-white text-xs sm:text-sm">
            <button
              onClick={() => setShowModal(true)}
              className="flex flex-col items-center hover:text-yellow-400 transition transform hover:scale-110"
              name="btn"
            >
              <div className="p-2 rounded-full bg-white/10 hover:bg-yellow-400/20 transition border-[2px] border-border-icon">
                <User2 size={18} />
              </div>
            </button>

            <div className="border-l border-white/30 h-6 mx-1" />

            <Link
              href="/favorit"
              className="flex flex-col items-center hover:text-pink-300 transition transform hover:scale-110"
            >
              <div className="p-2 rounded-full bg-white/10 hover:bg-pink-300/20 transition border-[2px] border-border-icon">
                <Heart size={18} />
              </div>
            </Link>

            <div className="border-l border-white/30 h-6 mx-1" />

            <Link
              href="/view_carts"
              className="flex flex-col items-center hover:text-yellow-400 transition transform hover:scale-110"
            >
              <div className="relative">
                <div className="p-2 rounded-full bg-white/10 hover:bg-yellow-400/20 transition border-[2px] border-border-icon">
                  <ShoppingCart size={18} />
                </div>
                <span className="absolute -top-1 -right-1 bg-[#f0a136] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                  {allProducts}
                </span>
              </div>
            </Link>

            <div className="border-l border-white/30 h-6 mx-1" />

            <Link
              href="/user_notification"
              className="flex flex-col items-center hover:text-yellow-400 transition transform hover:scale-110"
            >
              <div className="relative">
                <div className="p-2 rounded-full bg-white/10 hover:bg-yellow-400/20 transition border-[2px] border-border-icon">
                  <Bell size={18} />
                </div>
                <span className="absolute -top-1 -right-1 bg-[#f0a136] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                  {allnotificatio}
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div className="md:hidden px-4 pb-3">
          <Link
            href={"/search"}
            className="flex items-center bg-white/90 rounded-full px-4 py-2 shadow-inner focus-within:ring-2 focus-within:ring-yellow-400 transition"
          >
            <Search className="text-gray-500 ml-2" size={18} />
            <input
              type="text"
              placeholder="إبحث عن منتج..."
              className="bg-transparent flex-1 text-sm focus:outline-none text-gray-700 placeholder:text-gray-400"
            />
          </Link>
        </div>
      </header>

      <AnimatePresence>
        {showModal && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 shadow-xl w-[90%] max-w-sm text-center"
            >
              <h2 className="text-xl font-bold text-[#f0a136] mb-4">
                {token_admin
                  ? "مرحباً بالتاجر 👋"
                  : token
                  ? "مرحباً بالمستخدم 👋"
                  : "اختر نوع التسجيل"}
              </h2>

              {token_admin && trader ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
                    <div className="text-center space-y-2">
                      <h3 className="font-bold text-gray-800 text-lg">
                        {trader.firstName} {trader.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {trader.UID}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href="/admin/profile"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <User2 size={16} />
                      الملف الشخصي
                    </Link>
                    <Link
                      href="/admin"
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-full hover:from-green-600 hover:to-green-700 transition flex items-center justify-center gap-2"
                    >
                      لوحة التحكم
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-full hover:from-red-600 hover:to-red-700 transition"
                    >
                      تسجيل الخروج
                    </button>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="text-sm text-gray-500 mt-2 hover:underline"
                  >
                    إلغاء
                  </button>
                </div>
              ) : token && user ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white font-bold text-lg">
                          {user.username?.charAt(0) || "م"}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {user.username}
                      </h3>
                      <p className="text-sm text-gray-600">ID: {user.UID}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <User2 size={16} />
                      الملف الشخصي
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-full hover:from-red-600 hover:to-red-700 transition"
                    >
                      تسجيل الخروج
                    </button>
                  </div>

                  <button
                    onClick={() => setShowModal(false)}
                    className="text-sm text-gray-500 mt-2 hover:underline"
                  >
                    إلغاء
                  </button>
                </div>
              ) : token ? (
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition"
                  >
                    تسجيل الخروج
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-sm text-gray-500 mt-2 hover:underline"
                  >
                    إلغاء
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    href="/auth"
                    className="bg-[#2ecc71] text-white py-2 rounded-full hover:bg-[#27ae60] transition"
                  >
                    التسجيل كمستخدم
                  </Link>
                  <Link
                    href="/trade/auth"
                    className="bg-[#f0a136] text-white py-2 rounded-full hover:bg-[#e08b10] transition"
                  >
                    التسجيل كتاجر
                  </Link>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-sm text-gray-500 mt-2 hover:underline"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartNavbar;
