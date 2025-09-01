"use client"
import React from 'react'
import {type SwiperSliderProps } from '@/app/lib/type'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Container from '../Container'
import Image from 'next/image'
import { Autoplay, Pagination ,Navigation} from 'swiper/modules'

import clsx from 'clsx'

export const Slider:React.FC<SwiperSliderProps>=({
  items ,
  height = "h-32 sm:h-48 md:h-64 lg:h-80 xl:h-96",
  objectFit = "cover",
  showNavigation = true,
  showPagination = true,
  autoPlayDelay = 3000,
})=>{
    return (
      <div className="relative w-full max-w-screen-xl mx-auto">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={showNavigation}
        pagination={showPagination ? { clickable: true } : false}
        autoplay={{ delay: autoPlayDelay }}
        loop
        className="w-full"
      >
{Array.isArray(items) && items.length > 0 && items.map((src, i) => (
  <SwiperSlide key={i}>
    <div className="block w-full h-full">
      <div className={`relative w-full ${height} aspect-[16/9] sm:aspect-[16/9] md:aspect-[16/9] lg:aspect-[16/9] xl:aspect-[16/9] bg-gray-100 flex items-center justify-center overflow-hidden rounded-xl`}>
     {src.image ? (
  <Image
    src={src.image}
    alt={`Slide ${i + 1}`}
    fill
    className={clsx("rounded-xl transition-all duration-500", {
      "object-cover": objectFit === "cover",
      "object-contain": objectFit === "contain"
    })}
    sizes="100vw"
    priority={i === 0}
    unoptimized
  />
) : (
  <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-xl text-gray-400">
    لا توجد صورة
  </div>
)}

      </div>
    </div>
  </SwiperSlide>
))}

      </Swiper>

      {/* Custom button styling - Hidden on small screens, visible on md+ */}
      <style jsx global>{`
        .swiper-button-prev,
        .swiper-button-next {
          color: white;
          background-color: rgba(0, 0, 0, 0.6);
          padding: 12px;
          border-radius: 9999px;
          width: 40px;
          height: 40px;
          top: 50%;
          transform: translateY(-50%);
          display: none;
        }

        @media (min-width: 768px) {
          .swiper-button-prev,
          .swiper-button-next {
            display: flex;
          }
        }

        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 16px;
          font-weight: bold;
        }

        .swiper-pagination-bullet {
          background-color: white;
          opacity: 0.6;
        }

        .swiper-pagination-bullet-active {
          opacity: 1;
          background-color: #3b82f6;
        }
      `}</style>
    </div>
    )
}