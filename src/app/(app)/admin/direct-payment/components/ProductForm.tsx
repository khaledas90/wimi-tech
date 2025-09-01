"use client";
import { useState } from "react";
import FormField from "@/app/components/ui/Formfield";
import { Creatproduct, FieldForm } from "@/app/lib/type";
import { BaseUrl } from "@/app/components/Baseurl";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface ProductFormProps {
  onProductAdded: () => void;
  onClose: () => void;
  phoneNumber: string;
}

const ProductForm = ({
  onProductAdded,
  onClose,
  phoneNumber,
}: ProductFormProps) => {
  const [productFormData, setProductFormData] = useState<Creatproduct>({
    title: "",
    description: "",
    quantity: 0,
    price: "",
    category: "",
    images: "",
    phoneNumber: phoneNumber,
  });
  const [addingProduct, setAddingProduct] = useState(false);

  const token = Cookies.get("token_admin");

  // ====== Fields ======
  const productFields: FieldForm[] = [
    {
      name: "title",
      label: "اسم المنتج",
      type: "text",
      placeholder: " مثلاً: ساعة نسائية  ",
    },
    {
      name: "description",
      label: "وصف المنتج",
      type: "text",
      placeholder: "مثلاً: ساعة نسائية  ",
    },
    {
      name: "price",
      label: "السعر",
      type: "number",
      placeholder: "مثلاً: 150",
    },
    {
      name: "quantity", // 👈 changed
      label: "الكمية المتاحة",
      type: "number",
      placeholder: "مثلاً: 50",
    },
    {
      name: "phoneNumber",
      label: "رقم الهاتف",
      type: "text",
      placeholder: "أدخل رقم الهاتف",
    },
  ];

  // ====== Handle Changes ======
  const handleProductFormChange = (updatedData: Record<string, any>) => {
    setProductFormData((prev) => ({ ...prev, ...updatedData }));
  };

  // ====== Submit ======
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddingProduct(true);

    try {
      const payload = {
        title: productFormData.title,
        description: productFormData.description,
        price: Number(productFormData.price),
        quantity: Number(productFormData.quantity),
        phoneNumber: productFormData.phoneNumber || phoneNumber,
      };

      console.log("Adding product with data:", payload);

      const response = await axios.post(
        `${BaseUrl}direct-payment/orders`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("تم إضافة المنتج بنجاح 🎉");
        onProductAdded();
        onClose();
        resetProductForm();
      } else {
        toast.error(response.data.message || "فشل في إضافة المنتج");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "حدث خطأ أثناء إضافة المنتج"
      );
    } finally {
      setAddingProduct(false);
    }
  };

  // ====== Reset Form ======
  const resetProductForm = () => {
    setProductFormData({
      title: "",
      description: "",
      quantity: 0,
      price: "",
      category: "",
      images: "",
      phoneNumber: phoneNumber,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-800">
              إضافة منتج جديد
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleAddProduct} className="p-6 space-y-6">
          {/* Product Form Fields */}
          <FormField
            fields={productFields}
            data={productFormData}
            onChange={handleProductFormChange}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-xl hover:bg-gray-600 transition duration-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={addingProduct}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {addingProduct ? "جاري الإضافة..." : "إضافة المنتج"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
