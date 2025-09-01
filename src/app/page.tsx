"use client";

import { Card } from "./components/ui/Card";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Slider } from "./components/ui/Slider";
import { useEffect, useState } from "react";
import SliderSkeleton from "./components/ui/SliderSkeleton";
import LogoImageAnimation from "./components/ui/Loader";
import 'swiper/css';
import 'swiper/css/navigation';
import SmartNavbar from "./components/ui/Navbar";
import Footer from "./components/ui/Footer";
import { ApiResponse, gethome, ProductSliderItem, main_screen_Product, AddFavorit } from "./lib/type";
import { BaseUrl } from "./components/Baseurl";
import Cookies from 'js-cookie'
import axios from "axios";
import toast from "react-hot-toast";
import { LoginRequiredModal } from "./components/ui/Pop-up-login";
import { CallApi } from "./lib/utilits";
export default function HomePage() {
  const [showLogo, setShowLogo] = useState(true);
  const [products, setProducts] = useState<main_screen_Product[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [add, setadd] = useState<boolean>(true);
  const [register, setregister] = useState<boolean>(false)



  const urlfav = `${BaseUrl}users/favorites`;
  const token = Cookies.get("token");

  const productSliderItems: ProductSliderItem[] = [
    {
      id: 1,
      title: "عنوان 1",
      image: '/asset/images/slide1.jpeg',
      product_id: 101,
    },
    {
      id: 2,
      title: "عنوان 2",
      image: '/asset/images/slide2.jpeg',
      product_id: 102,
    },
    {
      id: 3,
      title: "عنوان 2",
      image: '/asset/images/slide3.jpeg',
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
      const res: ApiResponse<gethome> = await CallApi("get", `${BaseUrl}main/main-screen?page=${page}&limit=10`);
      const newProducts = res.data.products;

      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const filteredNew = newProducts.filter(p => !existingIds.has(p._id));
        return [...prev, ...filteredNew];
      });

      setPage(prev => prev + 1);

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
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
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
      else {
        setregister(false);
      }
      // The actual favorite handling is now done in the Card component
      // This function is just for state management
      setadd(true);
    } catch (error) {
      console.error("Error in favorite handler:", error);
    }
  };

  return (
    <section className="bg-white">
      <SmartNavbar />
        {/* Header SVG */}
        {/* Slider Section */}
        <div className="w-full bg-white pt-2 sm:pt-4 mt-28 lg:mt-16">
          <div className="mx-auto p-2 sm:p-3 md:p-4 lg:p-5 text-black z-[10000]">
            {productSliderItems.length > 0 && (
              <Slider
                items={productSliderItems}
                height="aspect-[16/9]"
                objectFit="cover"
                showNavigation={true}
                showPagination={true}
                autoPlayDelay={3000}
              />
            )}
          </div>
        </div>

        {/* Best Selling Products */}
        {/* Best Selling Products */}
        <div className="w-full bg-white mt-4 sm:mt-6 md:mt-8 lg:mt-10">
          <div className="flex justify-center items-center text-2xl mb-3 sm:mb-4 md:mb-6">
            <h2 className="text-[#1f2f5c] font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-3 sm:mb-4 md:mb-6 tracking-tight">الأكثر مبيعاً</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {products.map((product, index) => (
              <div key={index} className="transition-all duration-300">
                <Card {...product} handellove={() => { handelfavorit(String(product._id)); setadd(true); }} />
              </div>
            ))}
          </div>

          {loadingMore && (
            <div className="text-center py-4 sm:py-6 md:py-8">
              <p className="text-sm text-gray-500">جاري تحميل المزيد من المنتجات...</p>
            </div>
          )}
        </div>
        <LoginRequiredModal show={register} />
      <Footer />
    </section>
  );
}
