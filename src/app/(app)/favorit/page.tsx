"use client";

import { BaseUrl } from "@/app/components/Baseurl";
import { AddFavorit, ApiResponse, main_screen_Product } from "@/app/lib/type";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Container from "@/app/components/Container";
import SmartNavbar from "@/app/components/ui/Navbar";
import toast from "react-hot-toast";
import { LoginRequiredModal } from "@/app/components/ui/Pop-up-login";
import { Card } from "@/app/components/ui/Card";
import { useCart } from "@/app/contexts/CartContext";
import { useFavorites } from "@/app/contexts/FavoritesContext";
import React from "react";

const urlfav = `${BaseUrl}users/favorites`;

export default function Favorite() {
  const url = `${BaseUrl}users/favorites`;
  const [favorite, setFavorite] = useState<main_screen_Product[]>([]);
  const token = Cookies.get("token");
  const [register, setRegister] = useState<boolean>(false);
  const { updateCartCount } = useCart();
  const { decrementFavoritesCount } = useFavorites();

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

      const res: ApiResponse<AddFavorit> = await axios.post(
        urlfav,
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // إزالة المنتج من الواجهة
      setFavorite((prev) => prev.filter((product) => product._id !== id));

      // Update favorites count
      decrementFavoritesCount();

      toast.success("تم الحذف من المفضلة");
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5FF] via-white to-[#F5F0FF]">
      <SmartNavbar />
      <Container>
        <LoginRequiredModal show={register} />

        {/* Header Section */}
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-[#4C1D95] mt-10 mb-4">
            المفضلة
          </h1>
          <p className="text-gray-600 text-lg">
            المنتجات التي أضفتها إلى قائمة المفضلة
          </p>
        </div>

        {favorite.length === 0 ? (
          <div className="flex flex-col justify-center items-center mt-20 py-20">
            <div className="text-8xl mb-6">💔</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              لا توجد منتجات في المفضلة
            </h2>
            <p className="text-gray-500 text-center max-w-md mb-8">
              لم تضف أي منتج إلى المفضلة بعد. ابدأ بتصفح المنتجات وأضف المفضلة
              لديك!
            </p>
            <a
              href="/"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              تصفح المنتجات
            </a>
          </div>
        ) : (
          <div className="pb-16 mx-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorite.map((product) => (
                <Card
                  key={product._id}
                  _id={product._id}
                  title={product.title}
                  description={product.description}
                  images={product.images}
                  category={product.category}
                  price={product.price}
                  createdAt={product.createdAt}
                  discount={undefined}
                  originalPrice={undefined}
                  stockQuantity={product.stockQuantity}
                  soldOut={product.stockQuantity === 0}
                  love={true}
                  handellove={() => handelfavorit(product._id)}
                  packet_pieces={undefined}
                  packet_price={undefined}
                  piece_price_after_offer={undefined}
                  packet_price_after_offer={undefined}
                  reviews_avg={undefined}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
