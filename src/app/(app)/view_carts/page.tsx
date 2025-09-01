"use client";
import { BaseUrl } from "@/app/components/Baseurl";
import Container from "@/app/components/Container";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import SmartNavbar from "@/app/components/ui/Navbar";
import Image from "next/image";
import { ShoppingCart, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { LoginRequiredModal } from "@/app/components/ui/Pop-up-login";
import Link from "next/link";
import mayser from "../../../../public/asset/images/ميسر.png";
interface ProductWithType {
  _id: string;
  title: string;
  traderId: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  createdAt: string;
  __v: number;
  type: "cart" | "order";
  totalPrice?: number;
  status: string;
  paymentState: string;
  quantity?: number;
  orderId?: string;
}

interface Product {
  _id: string;
  title: string;
  traderId: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  images: string[];
  createdAt: string;
  __v: number;
}

interface Ordershoping {
  _id: string;
  userId: string;
  productId: Product | null;
  traderId: string;
  quantity: number;
  totalPrice: number;
  status?: string;
  paymentState?: string;
  orderDate: string;
  __v: number;
}

interface CartAndOrdersResponseshoping {
  cart: Product[];
  orders: Ordershoping[];
}

export default function Favorite() {
  const [allProducts, setAllProducts] = useState<ProductWithType[]>([]);
  const [register, setRegister] = useState<boolean>(false);
  const url = `${BaseUrl}users/shopping`;
  const deleteorder = `${BaseUrl}users/cancelled-order/`;
  const urlcreate = `${BaseUrl}fatora/create-payment`;
  const token = Cookies.get("token");

  useEffect(() => {
    const getCart = async () => {
      try {
        if (!token) {
          setRegister(true);
          return;
        }

        const res = await axios.get<{ data: CartAndOrdersResponseshoping }>(
          url,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const cartWithType: ProductWithType[] = res.data.data.cart.map(
          (item) => ({
            ...item,
            type: "cart",
            quantity: 1,
            totalPrice: item.price,
            status: "",
            paymentState: "",
          })
        );

        const ordersWithType: ProductWithType[] = res.data.data.orders
          .filter((order) => order.productId)
          .map((order) => ({
            ...order.productId!,
            type: "order",
            quantity: order.quantity,
            totalPrice: order.totalPrice,
            orderId: order._id,
            status: "",
            paymentState: "",
          }));

        setAllProducts([...cartWithType, ...ordersWithType]);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    getCart();
  }, []);

  const handlePayment = async (
    productId: string,
    quantity: number,
    unitPrice: number
  ) => {
    try {
      if (!token) {
        setRegister(true);
        return;
      }

      const totalPrice = unitPrice * quantity;

      const res = await axios.post(
        urlcreate,
        {
          amount: totalPrice,
          phoneNumber: Cookies.get("phone"),
          productId: productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            api_key: "E4B73FEE-F492-4607-A38D-852B0EBC91C9",
          },
        }
      );

      if (res.data.data.result) {
        window.open(res.data.data.result.checkout_url, "_blank");
      } else {
        toast.error(res.data.data.message);
      }

      setAllProducts((prev) =>
        prev.filter((p) => !(p._id === productId && p.type === "cart"))
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الشراء ❌");
    }
  };

  const handleRemoveFromCart = async (
    productId: string,
    quantity?: number,
    totalPrice?: number
  ) => {
    try {
      if (!token) {
        setRegister(true);
        return;
      }

      await axios.delete(url, {
        data: { productId, quantity, totalPrice },
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("تم حذف المنتج من السلة 🗑️");
      setAllProducts((prev) =>
        prev.filter((p) => !(p._id === productId && p.type === "cart"))
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل حذف المنتج ❌");
    }
  };

  const handleIncreaseQuantity = (productId: string) => {
    setAllProducts((prev) =>
      prev.map((p) => {
        if (p._id === productId && p.type === "cart") {
          return {
            ...p,
            quantity: (p?.quantity ?? 0) + 1,
            totalPrice: p.price * ((p?.quantity ?? 0) + 1),
          };
        }
        return p;
      })
    );
  };

  const handleDecreaseQuantity = (productId: string) => {
    setAllProducts((prev) =>
      prev.map((p) => {
        if (p._id === productId && p.type === "cart") {
          return {
            ...p,
            quantity: (p?.quantity ?? 0) - 1,
            totalPrice: p.price * ((p?.quantity ?? 0) - 1),
          };
        }
        return p;
      })
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5FF] via-white to-[#F5F0FF] p-6 mt-12">
      <SmartNavbar />
      <Container>
        <h2 className="text-4xl font-bold text-center text-[#4C1D95] my-10">
          🛍️ مشترياتي
        </h2>

        <section className="mb-16">
          <div className="bg-[#FDF9FF] rounded-xl shadow p-6 border border-purple-200">
            <h3 className="text-2xl font-semibold text-[#4C1D95] border-[#EDE9FE] border-b  pb-2 mb-6">
              🛒 سلة المشتريات
            </h3>

            {allProducts.filter((p) => p.type === "cart").length === 0 ? (
              <p className="text-gray-500">لا توجد منتجات في السلة.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-purple-100 text-[#3F0F59]">
                    <tr>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        الصورة
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        المنتج
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        الكمية
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        سعر الوحدة
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        الإجمالي
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        الدفع
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {allProducts
                      .filter((p) => p.type === "cart")
                      .map((product, index) => (
                        <tr
                          key={`${product._id}-${index}`}
                          className="hover:bg-purple-50 transition"
                        >
                          {/* صورة المنتج */}
                          <td className="px-4 py-3 border-b">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover border border-gray-200"
                                unoptimized
                              />
                            ) : (
                              <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                                لا صورة
                              </div>
                            )}
                          </td>

                          {/* الاسم */}
                          <td className="px-4 py-3 border-b font-bold">
                            {product.title}
                          </td>

                          {/* الكمية + أزرار */}
                          <td className="px-4 py-3 border-b">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleDecreaseQuantity(product._id)
                                }
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                -
                              </button>
                              <span>{product.quantity}</span>
                              <button
                                onClick={() =>
                                  handleIncreaseQuantity(product._id)
                                }
                                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          {/* سعر الوحدة */}
                          <td className="px-4 py-3 border-b text-sm">
                            {product.price} ر.س
                          </td>

                          {/* الإجمالي */}
                          <td className="px-4 py-3 border-b font-semibold text-[#5B21B6]">
                            {product.price * (product?.quantity ?? 1)} ر.س
                          </td>

                          {/* الدفع */}
                          <td className=" py-3 border-b flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handlePayment(
                                  product._id,
                                  product.quantity ?? 1,
                                  product.price
                                )
                              }
                              className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition duration-200"
                            >
                              <ShoppingCart size={16} />
                              <span>الدفع</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(product._id)}
                              className="bg-red-500 text-white px-5 py-3 rounded-full text-xs hover:bg-red-600 transition"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="bg-[#FDF9FF] rounded-xl shadow p-6 border border-purple-200">
            <h3 className="text-2xl font-semibold text-[#6B2B7A] border-b border-purple-100 pb-2 mb-6">
              ✅ الطلبات
            </h3>

            {allProducts.filter((p) => p.type === "order").length === 0 ? (
              <p className="text-gray-500">لا توجد طلبات سابقة.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-purple-100 text-[#3F0F59]">
                    <tr>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        الصورة
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        المنتج
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        الوصف
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        الكمية
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        السعر
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        الحالة
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-semibold border-b">
                        حالة الدفع
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {allProducts
                      .filter((p) => p.type === "order")
                      .map((product, index) => (
                        <tr
                          key={`${product._id}-${index}`}
                          className="hover:bg-purple-50 transition"
                        >
                          <td className="px-4 py-3 border-b">
                            {product.images?.[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                width={60}
                                height={60}
                                className="rounded-lg object-cover border border-gray-200"
                                unoptimized
                              />
                            ) : (
                              <div className="w-[60px] h-[60px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                                لا صورة
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 border-b font-bold">
                            {product.title}
                          </td>
                          <td className="px-4 py-3 border-b text-sm text-gray-500 line-clamp-2">
                            {product.description}
                          </td>
                          <td className="px-4 py-3 border-b">
                            {product.quantity}
                          </td>
                          <td className="px-4 py-3 border-b font-semibold text-[#5B21B6]">
                            {product.price} ر.س
                          </td>
                          <td className="px-4 py-3 border-b">
                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                              {product.status === "Pending"
                                ? "قيد المعالجة"
                                : "مكتمل"}
                            </span>
                          </td>
                          <td className="px-4 py-3 border-b">
                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                              {product.paymentState === "Pending"
                                ? "في انتظار الدفع"
                                : "مدفوع"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <LoginRequiredModal show={register} />
      </Container>
    </div>
  );
}
