"use client";

import { Card } from "./components/ui/Card";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Slider } from "./components/ui/Slider";
import { useEffect, useState } from "react";
import SliderSkeleton from "./components/ui/SliderSkeleton";
import LogoImageAnimation from "./components/ui/Loader";
import "swiper/css";
import "swiper/css/navigation";
import SmartNavbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import {
  ApiResponse,
  gethome,
  ProductSliderItem,
  main_screen_Product,
  AddFavorit,
} from "./lib/type";
import { BaseUrl } from "./components/Baseurl";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { useFavorites } from "./contexts/FavoritesContext";
import { LoginRequiredModal } from "./components/ui/Pop-up-login";
import { CallApi } from "./lib/utilits";
export default function HomePage() {
  const [showLogo, setShowLogo] = useState(true);
  const [products, setProducts] = useState<main_screen_Product[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [add, setadd] = useState<boolean>(true);
  const [register, setregister] = useState<boolean>(false);

  const urlfav = `${BaseUrl}users/favorites`;
  const token = Cookies.get("token");
  const { incrementFavoritesCount, decrementFavoritesCount } = useFavorites();

  const productSliderItems: ProductSliderItem[] = [
    {
      id: 1,
      title: "عنوان 1",
      image: "/asset/images/slide1.jpeg",
      product_id: 101,
    },
    {
      id: 2,
      title: "عنوان 2",
      image: "/asset/images/slide2.jpeg",
      product_id: 102,
    },
    {
      id: 3,
      title: "عنوان 2",
      image: "/asset/images/slide3.jpeg",
      product_id: 102,
    },
  ];

  // Show logo once
  useEffect(() => {
    const hasShownLogo = sessionStorage.getItem("hasShownLogo");
    if (hasShownLogo) {
      setShowLogo(false);
    } else {
      setTimeout(() => {
        setShowLogo(false);
        sessionStorage.setItem("hasShownLogo", "true");
      }, 2000);
    }
  }, []);

  const fetchProducts = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const res: ApiResponse<gethome> = await CallApi(
        "get",
        `${BaseUrl}main/main-screen?page=${page}&limit=10`
      );
      const newProducts = res.data.products;

      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const filteredNew = newProducts.filter((p) => !existingIds.has(p._id));
        return [...prev, ...filteredNew];
      });

      setPage((prev) => prev + 1);

      if (newProducts.length === 0 || page >= res.data.pagination.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !loadingMore &&
        hasMore
      ) {
        fetchProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  if (showLogo) return <LogoImageAnimation />;
  if (products.length === 0 && !loadingMore) return <SliderSkeleton />;

  const handelfavorit = async (id: string) => {
    try {
      if (!token) {
        setregister(true);
        return;
      }

      const product = products.find((p) => p._id === id);
      if (product) {
        setadd(!add);
      }
    } catch (error) {
      console.error("Error in favorite handler:", error);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FAF5FF] via-white to-[#F5F0FF]">
      <SmartNavbar />

      {/* Hero Section with Slider */}
      <div className="w-full pt-2 sm:pt-4 mt-28 lg:mt-16">
        <div className="mx-auto p-2 sm:p-3 md:p-4 lg:p-5 text-black z-[10000]">
          {productSliderItems.length > 0 && (
            <div className="relative">
              <Slider
                items={productSliderItems}
                height="aspect-[16/9]"
                objectFit="cover"
                showNavigation={true}
                showPagination={true}
                autoPlayDelay={3000}
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-xl"></div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="w-full mt-8 sm:mt-12 md:mt-16 lg:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] bg-clip-text text-transparent">
                الأكثر مبيعاً
              </h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              اكتشف أفضل المنتجات الأكثر طلباً من عملائنا الكرام
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="transition-all duration-500 hover:scale-105 hover:z-10"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <Card
                  {...product}
                  handellove={() => handelfavorit(String(product._id))}
                />
              </div>
            ))}
          </div>

          {/* Loading State */}
          {loadingMore && (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
                <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-700">
                  جاري تحميل المزيد من المنتجات...
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {products.length === 0 && !loadingMore && (
            <div className="text-center py-16 sm:py-20">
              <div className="text-6xl mb-6">🛍️</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                لا توجد منتجات متاحة حالياً
              </h3>
              <p className="text-gray-500">سيتم إضافة منتجات جديدة قريباً</p>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="mt-16 sm:mt-20 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] rounded-2xl mx-4 sm:mx-6 lg:mx-8 p-8 sm:p-12 text-center text-white">
        <h3 className="text-2xl sm:text-3xl font-bold mb-4">
          تسوق الآن واحصل على أفضل العروض
        </h3>
        <p className="text-lg mb-6 opacity-90">
          اكتشف آلاف المنتجات بأسعار تنافسية وجودة عالية
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/search"
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            تصفح المنتجات
          </a>
          <a
            href="/view_carts"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors"
          >
            عرض السلة
          </a>
        </div>
      </div>

      <LoginRequiredModal show={register} />
      <Footer />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
