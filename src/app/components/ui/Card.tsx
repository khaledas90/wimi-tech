import { type CardProps } from '@/app/lib/type'
import React, { useState } from 'react'
import Image from 'next/image'
import { Heart, Eye, ShoppingCart } from 'lucide-react'
import Logo from '../../../../public/asset/images/ويمي تك.jpg';
import Link from 'next/link'
import { BaseUrl } from '../Baseurl'
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

export const Card: React.FC<CardProps> = ({
  _id, title, description, images, category,
  price, discount, originalPrice,
  stockQuantity, soldOut = false, love = false, handellove = () => {},
  packet_pieces, packet_price, piece_price_after_offer,
  packet_price_after_offer, reviews_avg
}) => {
  const [loveit, setLove] = useState<boolean>(love)
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
  const [isAddingToFavorites, setIsAddingToFavorites] = useState<boolean>(false)

  const token = Cookies.get("token")

  const handleLoveToggle = async () => {
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً")
      return
    }

    setIsAddingToFavorites(true)
    try {
      const urlfav = `${BaseUrl}users/favorites`
      const res = await axios.post(urlfav, { productId: _id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      // Toggle the love state
      const newLoveState = !loveit
      setLove(newLoveState)
      handellove()
      toast.success(newLoveState ? "تم الإضافة للمفضلة" : "تم الإزالة من المفضلة")
    } catch (error: any) {
      console.error("Error updating favorites:", error)
      toast.error(error.response?.data?.message || "حدث خطأ أثناء تحديث المفضلة")
    } finally {
      setIsAddingToFavorites(false)
    }
  }

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً")
      return
    }

    if (stockQuantity === 0) {
      toast.error("المنتج غير متوفر")
      return
    }

    setIsAddingToCart(true)
    try {
      // Using the correct cart API endpoint based on the packet page
      const cartUrl = `${BaseUrl}users/shopping`
      const res = await axios.post(cartUrl, { 
        productId: _id
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      toast.success("تم إضافة المنتج إلى السلة")
    } catch (error: any) {
      console.error("Error adding to cart:", error)
      if (error.response?.status === 401) {
        toast.error("يرجى تسجيل الدخول أولاً")
      } else {
        toast.error(error.response?.data?.message || "حدث خطأ أثناء إضافة المنتج للسلة")
      }
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-between rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 group">
      
      {/* زر القلب المحسن */}
      <div 
        className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-2 rounded-full cursor-pointer z-40 hover:bg-pink-100 hover:scale-110 transition-all duration-300 shadow-lg border border-pink-200" 
        onClick={handleLoveToggle}
        title={loveit ? "إزالة من المفضلة" : "إضافة للمفضلة"}
      >
        {isAddingToFavorites ? (
          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        ) : loveit ? (
          <Heart size={20} className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 animate-pulse" fill="#ec4899" stroke="#ec4899" />
        ) : (
          <Heart size={20} className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 hover:text-pink-400 transition-colors" fill="none" stroke="#6b7280" />
        )}
      </div>

      {/* الصورة */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[4/3] md:aspect-[4/3] lg:aspect-[4/3] bg-white flex items-center justify-center overflow-hidden">
        <Image
          src={images?.[0] || '/no-image.png'}
          alt={title}
          fill
          className="object-contain p-2 sm:p-3 md:p-4 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          unoptimized
        />
        
        {/* Creative Overlay - Slides from bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="p-2 sm:p-3 md:p-4 text-center">
            <div className="flex items-center justify-center gap-x-1 sm:gap-x-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Image src={Logo} alt="Logo" width={20} height={20} className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 object-contain rounded-full" unoptimized />
              </div>
              <div className="text-white text-xs sm:text-sm md:text-base font-medium">
                ويمي تك
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
              <Link href={`/packet/${_id}`} className="flex-1">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1 sm:gap-2">
                  <Eye size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                  عرض التفاصيل
                </button>
              </Link>
              
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart || stockQuantity === 0}
                className={`bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1 sm:gap-2 ${
                  isAddingToCart || stockQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isAddingToCart ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ShoppingCart size={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
                {isAddingToCart ? 'جاري الإضافة...' : stockQuantity === 0 ? 'غير متوفر' : 'إضافة للسلة'}
              </button>
            </div>
            
            {/* زر المفضلة في الـ Overlay */}
            <div className="mt-2 sm:mt-3">
              <button 
                onClick={handleLoveToggle}
                disabled={isAddingToFavorites}
                className={`w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-1 sm:gap-2 ${
                  isAddingToFavorites ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isAddingToFavorites ? (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : loveit ? (
                  <Heart size={14} className="w-3 h-3 sm:w-4 sm:h-4" fill="white" stroke="white" />
                ) : (
                  <Heart size={14} className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="white" />
                )}
                {isAddingToFavorites ? 'جاري التحديث...' : loveit ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المحتوى */}
      <div className="p-2 sm:p-3 md:p-4 flex flex-col justify-start flex-grow gap-y-1 sm:gap-y-1.5 text-right" dir="rtl">
        <h2 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{description}</p>

        <div className="mt-1 sm:mt-1.5">
          <span className="font-bold text-xs sm:text-sm md:text-base text-black">
ر.س         {price}  
</span>
          {originalPrice && (
            <span className="text-gray-400 line-through text-xs ml-1 sm:ml-2">{originalPrice} ر.س</span>
          )}
        </div>

        {discount && (
          <div className="mt-0.5 sm:mt-1">
            <span className="bg-gradient-to-r from-pink-400 to-rose-500 text-white px-1 sm:px-1.5 py-0.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm">
              خصم {discount}%
            </span>
          </div>
        )}

        {packet_price && packet_pieces !== undefined && (
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-1.5">
            بالكرتونة: {packet_price_after_offer ?? packet_price} ر.س({packet_pieces} قطعة)
          </p>
        )}

        {typeof stockQuantity === 'number' && (
          <p className={`text-xs sm:text-sm font-bold mt-1 sm:mt-1.5 ${
            stockQuantity === 0 ? 'text-red-500' :
            stockQuantity <= 4 ? 'text-orange-300' :
            'text-gray-600'
          }`}>
            {stockQuantity === 0
              ? 'غير متوفر'
              : stockQuantity <= 4
              ? `متبقى ${stockQuantity}`
              : `الكمية: ${stockQuantity}`}
          </p>
        )}

        {soldOut && (
          <span className="text-red-600 font-bold text-xs sm:text-sm mt-1 sm:mt-1.5">نفذت الكمية</span>
        )}
      </div>
    </div>
  )
}
