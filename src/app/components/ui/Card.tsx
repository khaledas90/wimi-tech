import { type CardProps } from "@/app/lib/type";
import React, { useState } from "react";
import Image from "next/image";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import Logo from "../../../../public/asset/images/ويمي تك.jpg";
import Link from "next/link";
import { BaseUrl } from "../Baseurl";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useCart } from "@/app/contexts/CartContext";
import { useFavorites } from "@/app/contexts/FavoritesContext";

export const Card: React.FC<CardProps> = ({
  _id,
  title,
  description,
  images,
  category,
  price,
  discount,
  originalPrice,
  stockQuantity,
  soldOut = false,
  love = false,
  handellove = () => {},
  packet_pieces,
  packet_price,
  piece_price_after_offer,
  packet_price_after_offer,
  reviews_avg,
}) => {
  const [loveit, setLove] = useState<boolean>(love);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [isAddingToFavorites, setIsAddingToFavorites] =
    useState<boolean>(false);

  const token = Cookies.get("token");
  const { updateCartCount } = useCart();
  const {
    updateFavoritesCount,
    incrementFavoritesCount,
    decrementFavoritesCount,
  } = useFavorites();

  const handleLoveToggle = async () => {
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    setIsAddingToFavorites(true);
    try {
      const urlfav = `${BaseUrl}users/favorites`;
      const res = await axios.post(
        urlfav,
        { productId: _id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Toggle the love state
      const newLoveState = !loveit;
      setLove(newLoveState);
      handellove();

      // Update favorites count
      if (newLoveState) {
        incrementFavoritesCount();
      } else {
        decrementFavoritesCount();
      }

      toast.success(
        newLoveState ? "تم الإضافة للمفضلة" : "تم الإزالة من المفضلة"
      );
    } catch (error: any) {
      console.error("Error updating favorites:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تحديث المفضلة"
      );
    } finally {
      setIsAddingToFavorites(false);
    }
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }

    if (stockQuantity === 0) {
      toast.error("المنتج غير متوفر");
      return;
    }

    setIsAddingToCart(true);
    try {
      // Using the correct cart API endpoint based on the packet page
      const cartUrl = `${BaseUrl}users/shopping`;
      const res = await axios.post(
        cartUrl,
        {
          productId: _id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("تم إضافة المنتج إلى السلة");
      // Update cart count after successful addition
      await updateCartCount();
    } catch (error: any) {
      console.error("Error adding to cart:", error);
      if (error.response?.status === 401) {
        toast.error("يرجى تسجيل الدخول أولاً");
      } else {
        toast.error(
          error.response?.data?.message || "حدث خطأ أثناء إضافة المنتج للسلة"
        );
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 group border border-gray-100 hover:border-gray-200">
      {/* زر القلب المحسن */}
      <div
        className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-full cursor-pointer z-40 hover:bg-pink-50 hover:scale-110 transition-all duration-300 shadow-lg border border-pink-200 hover:border-pink-300"
        onClick={handleLoveToggle}
        title={loveit ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      >
        {isAddingToFavorites ? (
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        ) : loveit ? (
          <Heart
            size={20}
            className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 animate-pulse"
            fill="#ec4899"
            stroke="#ec4899"
          />
        ) : (
          <Heart
            size={20}
            className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-pink-400 transition-colors"
            fill="none"
            stroke="#6b7280"
          />
        )}
      </div>

      {/* Stock Badge */}
      {stockQuantity <= 4 && stockQuantity > 0 && (
        <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-40 shadow-lg">
          متبقي {stockQuantity}
        </div>
      )}

      {stockQuantity === 0 && (
        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-40 shadow-lg">
          غير متوفر
        </div>
      )}

      {/* الصورة */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        <Image
          src={images?.[0] || "/no-image.png"}
          alt={title}
          fill
          className="object-contain p-3 sm:p-4 md:p-6 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          unoptimized
        />

        {/* Enhanced Overlay with better animations */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <div className="absolute bottom-0 left-0 right-0 p-4 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
            {/* Brand Logo */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={16}
                  height={16}
                  className="object-contain rounded-full"
                  unoptimized
                />
              </div>
              <div className="text-white text-sm font-medium">ويمي تك</div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Link href={`/packet/${_id}`} className="flex-1">
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white  font-semibold px-2 py-1.5 text-base rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                    <Eye size={16} />
                    عرض التفاصيل
                  </button>
                </Link>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || stockQuantity === 0}
                  className={`flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white  font-semibold px-2 py-1.5 text-base rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg ${
                    isAddingToCart || stockQuantity === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isAddingToCart ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ShoppingCart size={16} />
                  )}
                  {isAddingToCart
                    ? "جاري الإضافة..."
                    : stockQuantity === 0
                    ? "غير متوفر"
                    : "إضافة للسلة"}
                </button>
              </div>

              {/* Favorite Button */}
              <button
                onClick={handleLoveToggle}
                disabled={isAddingToFavorites}
                className={`w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white  font-semibold px-2 py-1.5 text-base rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg ${
                  isAddingToFavorites ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isAddingToFavorites ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : loveit ? (
                  <Heart size={16} fill="white" stroke="white" />
                ) : (
                  <Heart size={16} fill="none" stroke="white" />
                )}
                {isAddingToFavorites
                  ? "جاري التحديث..."
                  : loveit
                  ? "إزالة من المفضلة"
                  : "إضافة للمفضلة"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div
        className="p-4 sm:p-5 flex flex-col justify-start flex-grow gap-y-2 text-right bg-white"
        dir="rtl"
      >
        <h2 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-sm sm:text-base text-gray-900">
            {price} ر.س
          </span>
          {originalPrice && (
            <span className="text-gray-400 line-through text-xs">
              {originalPrice} ر.س
            </span>
          )}
          {discount && (
            <span className="bg-gradient-to-r from-pink-400 to-rose-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
              خصم {discount}%
            </span>
          )}
        </div>

        {packet_price && packet_pieces !== undefined && (
          <p className="text-xs text-gray-600 mt-1">
            بالكرتونة: {packet_price_after_offer ?? packet_price} ر.س (
            {packet_pieces} قطعة)
          </p>
        )}

        {typeof stockQuantity === "number" && (
          <div className="mt-2 flex items-center justify-between">
            <p
              className={`text-xs font-semibold ${
                stockQuantity === 0
                  ? "text-red-500"
                  : stockQuantity <= 4
                  ? "text-orange-500"
                  : "text-green-600"
              }`}
            >
              {stockQuantity === 0
                ? "غير متوفر"
                : stockQuantity <= 4
                ? `متبقى ${stockQuantity}`
                : `متوفر: ${stockQuantity}`}
            </p>

            {reviews_avg && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-sm">★</span>
                <span className="text-xs text-gray-600">{reviews_avg}</span>
              </div>
            )}
          </div>
        )}

        {soldOut && (
          <span className="text-red-600 font-bold text-xs mt-1">
            نفذت الكمية
          </span>
        )}
      </div>
    </div>
  );
};
