"use client";
import { useState, useEffect } from "react";
import { Trash2, RefreshCw, Package, Edit } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  createdAt: string;
}

interface ProductsTableProps {
  onProductDeleted: () => void;
}

const ProductsTable = ({ onProductDeleted }: ProductsTableProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const productsJson = Cookies.get("direct_payment_products");
      const products = productsJson ? JSON.parse(productsJson) : [];
      // Sort products by createdAt in descending order (newest first)
      const sortedProducts = products.sort((a: Product, b: Product) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setProducts(sortedProducts);
    } catch (error: any) {
      console.error(error);
      toast.error("خطأ في جلب المنتجات");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    setDeletingProduct(productId);
    try {
      // Get products from cookies
      const productsJson = Cookies.get("direct_payment_products");
      let products = productsJson ? JSON.parse(productsJson) : [];

      // Remove the product
      products = products.filter(
        (product: Product) => product._id !== productId
      );

      // Save updated products back to cookies
      Cookies.set("direct_payment_products", JSON.stringify(products), {
        expires: 30,
      });

      toast.success("تم حذف المنتج بنجاح");
      onProductDeleted();
      fetchProducts();
    } catch (error: any) {
      console.error(error);
      toast.error("حدث خطأ أثناء حذف المنتج");
    } finally {
      setDeletingProduct(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          المنتجات المتاحة
        </h3>
        <button
          onClick={fetchProducts}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md disabled:opacity-50"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          تحديث
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-2">جاري التحميل...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          لا توجد منتجات حالياً. قم بإضافة منتج جديد للبدء.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                  #
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                  العنوان
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                  الوصف
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                  السعر
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                  تاريخ الإنشاء
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 border-b">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900 border-b">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 border-b font-medium">
                    {product.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-b max-w-xs truncate">
                    {product.description}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-600 border-b font-semibold">
                    {product.price} ريال
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 border-b">
                    {new Date(product.createdAt).toLocaleDateString("ar-SA")}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteProduct(product._id)}
                        disabled={deletingProduct === product._id}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                        title="حذف المنتج"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;
