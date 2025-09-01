"use client";

import { useState } from "react";
import { X } from "lucide-react";
import FormField from "@/app/components/ui/Formfield";
import { Creatproduct, FieldForm } from "@/app/lib/type";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

const AddProductModal = ({
  isOpen,
  onClose,
  onProductAdded,
}: AddProductModalProps) => {
  const [productFormData, setProductFormData] = useState<Creatproduct>({
    title: "",
    description: "",
    quantity: 0, // 👈 موجود
    price: "",
    category: "",
    images: "",
    phoneNumber: "",
  });
  const [addingProduct, setAddingProduct] = useState(false);

  // Form fields configuration
  const productFields: FieldForm[] = [
    {
      name: "title",
      label: "عنوان المنتج",
      type: "text",
      placeholder: "مثلاً: اشتراك شهري",
      requierd: true,
    },
    {
      name: "description",
      label: "الوصف",
      type: "text",
      placeholder: "أكتب وصفاً مختصراً للمنتج...",
      requierd: true,
    },
    {
      name: "price",
      label: "السعر",
      type: "number",
      placeholder: "مثلاً: 150.00",
      requierd: true,
    },
    {
      name: "quantity", // 👈 أضفنا الكمية
      label: "الكمية",
      type: "number",
      placeholder: "مثلاً: 10",
      requierd: true,
    },
    {
      name: "phoneNumber",
      label: "رقم الهاتف",
      type: "text",
      placeholder: "مثلاً: 01012345678",
      requierd: true,
    },
  ];

  // Handle field changes
  const handleProductFormChange = (updatedData: Record<string, any>) => {
    setProductFormData((prev) => ({ ...prev, ...updatedData }));
  };

  // Submit new product
  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddingProduct(true);

    try {
      const newProduct = {
        _id: `PROD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: productFormData.title,
        description: productFormData.description,
        price: Number(productFormData.price),
        quantity: Number(productFormData.quantity),
        phoneNumber: productFormData.phoneNumber,
        createdAt: new Date().toISOString(),
      };

      const existingProductsJson = Cookies.get("direct_payment_products");
      const existingProducts = existingProductsJson
        ? JSON.parse(existingProductsJson)
        : [];

      // Add new product
      const updatedProducts = [...existingProducts, newProduct];

      // Save to cookies (30 days expiry)
      Cookies.set("direct_payment_products", JSON.stringify(updatedProducts), {
        expires: 30,
      });

      toast.success("تم إضافة المنتج بنجاح 🎉");
      onProductAdded();
      resetProductForm();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error("حدث خطأ أثناء إضافة المنتج");
    } finally {
      setAddingProduct(false);
    }
  };

  // Reset form values
  const resetProductForm = () => {
    setProductFormData({
      title: "",
      description: "",
      quantity: 0,
      price: "",
      category: "",
      images: "",
      phoneNumber: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-800">
              إضافة منتج جديد
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAddProduct} className="p-6 space-y-6">
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

export default AddProductModal;
