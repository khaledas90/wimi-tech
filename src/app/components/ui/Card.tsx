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
    <div className="group relative w-full h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
      {/* Heart Button - Top Left */}
      <button
        onClick={handleLoveToggle}
        disabled={isAddingToFavorites}
        className={`absolute top-2 left-2 z-20 p-1.5 rounded-full transition-all duration-200 ${
          loveit
            ? "bg-pink-500 text-white shadow-md"
            : "bg-white/90 text-gray-600 hover:bg-pink-50 hover:text-pink-500"
        } ${isAddingToFavorites ? "opacity-50 cursor-not-allowed" : ""}`}
        title={loveit ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      >
        {isAddingToFavorites ? (
          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Heart
            size={14}
            className={loveit ? "fill-current" : ""}
            fill={loveit ? "currentColor" : "none"}
          />
        )}
      </button>

      {/* Stock Badge - Top Right */}
      {stockQuantity <= 4 && stockQuantity > 0 && (
        <div className="absolute top-2 right-2 z-20 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
          متبقي {stockQuantity}
        </div>
      )}

      {stockQuantity === 0 && (
        <div className="absolute top-2 right-2 z-20 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
          غير متوفر
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full aspect-[3/2] sm:aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <Image
          src={images?.[0] || "/no-image.png"}
          alt={title}
          fill
          className="object-contain p-2 sm:p-3 lg:p-4 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          unoptimized
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-1.5">
              <Link href={`/packet/${_id}`}>
                <button className="bg-white text-gray-800 px-2 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 transition-colors flex items-center gap-1">
                  <Eye size={12} />
                  عرض
                </button>
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || stockQuantity === 0}
                className={`px-2 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                  isAddingToCart || stockQuantity === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isAddingToCart ? (
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ShoppingCart size={12} />
                )}
                {isAddingToCart ? "جاري..." : "إضافة"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors leading-tight">
          {title}
        </h3>

        {/* Price Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900">
              {price} ر.س
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {originalPrice} ر.س
              </span>
            )}
          </div>
          {discount && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              خصم {discount}%
            </span>
          )}
        </div>

        {/* Stock and Rating */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              stockQuantity === 0
                ? "bg-red-100 text-red-600"
                : stockQuantity <= 4
                ? "bg-orange-100 text-orange-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {stockQuantity === 0
              ? "غير متوفر"
              : stockQuantity <= 4
              ? `متبقى ${stockQuantity}`
              : `متوفر`}
          </span>

          {reviews_avg && (
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-xs text-gray-600">{reviews_avg}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Link href={`/packet/${_id}`} className="flex-1">
            <button className="w-full bg-gray-100 text-gray-700 py-1.5 px-2 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
              <Eye size={12} />
              <span className="hidden sm:inline">عرض</span>
            </button>
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || stockQuantity === 0}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
              isAddingToCart || stockQuantity === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isAddingToCart ? (
              <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ShoppingCart size={12} />
            )}
            <span className="hidden sm:inline">
              {isAddingToCart
                ? "جاري..."
                : stockQuantity === 0
                ? "غير متوفر"
                : "إضافة"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
