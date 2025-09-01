"use client"

import { BaseUrl } from "@/app/components/Baseurl";
import { AddFavorit, ApiResponse, main_screen_Product } from "@/app/lib/type"
import axios from "axios";
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import Container from "@/app/components/Container";
import SmartNavbar from "@/app/components/ui/Navbar";
import toast from "react-hot-toast";
import { LoginRequiredModal } from "@/app/components/ui/Pop-up-login";
import React from "react";

const urlfav = `${BaseUrl}users/favorites`;

export default function Favorite() {
  const url = `${BaseUrl}users/favorites`;
  const [favorite, setFavorite] = useState<main_screen_Product[]>([]);
  const token = Cookies.get("token");
  const [register, setRegister] = useState<boolean>(false);

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorite(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavorite();
  }, []);

  const handelfavorit = async (id: string) => {
    if (!token) {
      setRegister(true);
      return;
    }

    try {
      setRegister(false);

      const res: ApiResponse<AddFavorit> = await axios.post(urlfav, { productId: id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // إزالة المنتج من الواجهة
      setFavorite(prev => prev.filter(product => product._id !== id));
      toast.success("تم الحذف من المفضلة");

    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <>
      <SmartNavbar />
      <Container>
        <LoginRequiredModal show={register} />

        {favorite.length === 0 ? (
          <div className="flex justify-center items-center mt-32">
            <p className="text-center text-gray-500 text-lg">لم تضف أي منتج إلى المفضلة بعد.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-32">
            {favorite.map(product => (
              <div
                key={product._id}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
              >
                {/* زر القلب الأحمر */}
                <button
                  onClick={() => handelfavorit(product._id)}
                  className="absolute top-3 right-3 z-10 text-red-600 hover:scale-110 transition-transform duration-200 text-2xl"
                  title="إزالة من المفضلة"
                >
                  ❤️
                </button>

                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden mb-2">
  <img
    src={product.images[0]}
    alt={product.title}
    className="object-contain max-h-full max-w-full transition-transform duration-500 hover:scale-110"
  />
</div>

  <div className="p-5 flex flex-col justify-between mt-4">
  <div>
    <h3 className="text-xl font-semibold mb-1 text-gray-800 dark:text-gray-200">{product.title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-3">{product.description}</p>
  </div>
  <div className="mt-4">
    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mb-1">
      السعر: <span className="text-indigo-800 dark:text-indigo-300">{product.price}ر.س</span>
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">التصنيف: {product.category}</p>
    <p className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
      {product.stockQuantity > 0 ? `متوفر: ${product.stockQuantity}` : 'غير متوفر'}
    </p>
  </div>
</div>

              </div>
            ))}
          </div>
        )}

      </Container>
    </>
  );
}
