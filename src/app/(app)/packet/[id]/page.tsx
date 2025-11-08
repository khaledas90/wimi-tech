"use client";
import { BaseUrl } from "@/app/components/Baseurl";
import Container from "@/app/components/Container";
import SmartNavbar from "@/app/components/ui/Navbar";
import { LoginRequiredModal } from "@/app/components/ui/Pop-up-login";
import { ApiResponse, CreateOrder, Product } from "@/app/lib/type";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { CallApi } from "@/app/lib/utilits";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
interface reeoeAdd {
  success: boolean;
  message: string;
}

export default function ProductDetailsPage() {
  const pathname = usePathname();
  const productid = pathname.split("/").pop();
  const url = `${BaseUrl}products/${productid}`;
  const takeorder = `${BaseUrl}users/shopping`;
  const [details, setDetails] = useState<Product | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const token = Cookies.get("token");

  const [order, setorder] = useState<CreateOrder>({
    productId: String(productid),
    quantity: 1,
    totalPrice: 0,
  });

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res: ApiResponse<Product> = await CallApi("get", url);
        setDetails(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getProduct();
  }, []);

  useEffect(() => {
    const configScript = document.createElement("script");
    configScript.innerHTML = `
      window.tamaraWidgetConfig = {
        lang: "ar",
        country: "SA",
        publicKey: "dbfb085b-258c-4c4c-b9ff-1cb8501ca531"
      };
    `;
    document.head.appendChild(configScript);

    const tamaraScript = document.createElement("script");
    tamaraScript.src = "https://cdn.tamara.co/widget-v2/tamara-widget.js";
    tamaraScript.defer = true;
    document.body.appendChild(tamaraScript);

    return () => {
      document.head.removeChild(configScript);
      document.body.removeChild(tamaraScript);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).TamaraWidgetV2) {
      (window as any).TamaraWidgetV2.refresh();
    }
  }, [details?.price]);

  if (!details) {
    return (
      <Container>
        <div className="flex items-center justify-center h-screen text-lg font-medium">
          جاري تحميل المنتج...
        </div>
      </Container>
    );
  }

  const handelchange = (field: keyof CreateOrder, value: string | number) => {
    setorder((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (productId: string) => {
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    try {
      if (order.quantity >= 1) {
        order.totalPrice = order.quantity * details.price;
      }

      const res: ApiResponse<CreateOrder> = await CallApi(
        "post",
        takeorder,
        { productId },
        token ? { Authorization: `Bearer ${token}` } : undefined
      );
      console.log(res, order);
      toast.success("تم اضافه المنتج الى السله");
    } catch (error: reeoeAdd | any) {
      console.error(error);

      let errorMessage = "حدث خطأ أثناء إضافة المنتج إلى السلة. حاول مرة أخرى.";

      if (error?.message) {
        const errorStr = error.message;
        const jsonMatch = errorStr.match(/\{.*\}/);

        if (jsonMatch) {
          try {
            const errorData = JSON.parse(jsonMatch[0]);
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            errorMessage = errorStr;
          }
        } else {
          errorMessage = errorStr;
        }
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    }
  };

  return (
    <>
      <SmartNavbar />
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 py-12 px-6 sm:px-12 max-w-7xl mx-auto ">
          {/* Images Section */}
          <div className="w-full relative rounded-2xl shadow-xl overflow-hidden pt-8 mt-24">
            {details.images && details.images.length > 1 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{ clickable: true }}
                className="w-full rounded-xl"
              >
                {details.images.map((img: string, i: number) => (
                  <SwiperSlide key={i}>
                    <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden rounded-xl mt-6 sm:mt-10 md:mt-28">
                      <Image
                        src={img}
                        alt={`Product image ${i + 1}`}
                        fill
                        className="object-contain  rounded-xl transition-all duration-300"
                        unoptimized
                        priority
                      />
                    </div>
                  </SwiperSlide>
                ))}

                {/* Navigation Buttons */}
                <div className="swiper-button-prev-custom absolute top-1/2 -translate-y-1/2 left-3 z-10 bg-white text-purple-700 p-2 rounded-full shadow-md cursor-pointer hover:bg-purple-100 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M15 6l-6 6 6 6" />
                  </svg>
                </div>
                <div className="swiper-button-next-custom absolute top-1/2 -translate-y-1/2 right-3 z-10 bg-white text-purple-700 p-2 rounded-full shadow-md cursor-pointer hover:bg-purple-100 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </div>
              </Swiper>
            ) : details.images && details.images.length === 1 ? (
              <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden rounded-xl shadow-md mt-6 sm:mt-10 md:mt-28">
                <Image
                  src={details.images[0]}
                  alt="Product"
                  fill
                  className="object-contain  rounded-xl"
                  unoptimized
                  priority
                />
              </div>
            ) : (
              <div className="text-center text-gray-500 text-lg font-medium">
                لا توجد صور لهذا المنتج
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="w-full space-y-6 pt-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
              <h2 className="text-3xl font-bold text-[#1e293b] mb-4">
                📦 تفاصيل المنتج
              </h2>
              <ul className="space-y-3 text-gray-800 text-base sm:text-lg">
                <li>
                  <span className="font-semibold text-gray-600">
                    اسم المنتج:
                  </span>{" "}
                  {details.title}
                </li>
                <li>
                  <span className="font-semibold text-gray-600">السعر:</span>{" "}
                  <span className="text-green-700 font-bold">
                    {details.price} ريال سعودى
                  </span>
                </li>

                <li>
                  <span className="font-semibold text-gray-600">القسم:</span>{" "}
                  {details.category}
                </li>
                <li>
                  <span className="font-semibold text-gray-600">
                    الكمية المتاحة:
                  </span>{" "}
                  {details.stockQuantity}
                </li>
                <li>
                  <span className="font-semibold text-gray-600">الوصف:</span>{" "}
                  {details.description}
                </li>
              </ul>
            </div>

            {/* Trader Info */}
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border">
              <h3 className="text-xl font-bold text-[#1e293b] mb-3">
                👨‍💼 بيانات التاجر
              </h3>
              <ul className="space-y-2 text-gray-700 text-base sm:text-lg">
                <li>
                  <span className="font-semibold text-gray-600">الاسم:</span>{" "}
                  {details.traderId.firstName}
                </li>
                <li>
                  <span className="font-semibold text-gray-600">البريد:</span>{" "}
                  {details.traderId.email}
                </li>
                <li>
                  <span className="font-semibold text-gray-600">الهاتف:</span>{" "}
                  {details.traderId.phoneNumber}
                </li>
              </ul>
            </div>
            <div className="mt-4 bg-[#f5f0ff] rounded-xl px-4 py-3 flex items-center justify-between shadow-sm border border-purple-100">
              <div
                className="flex-1 text-right text-gray-700 text-sm sm:text-base leading-relaxed"
                dir="rtl"
              >
                <tamara-widget
                  type="tamara-summary"
                  amount={details.price.toString()}
                  inline-type="2"
                  inline-variant="text"
                  config='{"theme":"light","badgePosition":"right","showExtraContent":"","hidePayInX":false}'
                ></tamara-widget>
              </div>
            </div>
            {/* Add to Cart Button */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-purple-100 space-y-4">
              <button
                onClick={() => handleSubmit(String(productid))}
                className="w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] hover:opacity-95 text-white font-bold py-3 rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2"
              >
                🛒 أضف إلى السلة الآن
              </button>
            </div>
          </div>
        </div>
      </Container>

      <LoginRequiredModal show={showLoginModal} />

      {/* Modal Overlay to close */}
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/80 z-40"
          onClick={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
}
