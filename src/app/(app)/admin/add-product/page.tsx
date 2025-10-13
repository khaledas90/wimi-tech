"use client";

import { useRef, useState } from "react";
import Container from "@/app/components/Container";
import { Button } from "@/app/components/ui/Button";
import FormField from "@/app/components/ui/Formfield";
import { ApiResponse, Creatproduct, FieldForm } from "@/app/lib/type";
import {
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import InputField from "@/app/components/ui/Input";
import { CallApi } from "@/app/lib/utilits";
import { BaseUrl } from "@/app/components/Baseurl";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function AddProductPage() {
  const [data, setData] = useState<Creatproduct>({
    title: "",
    description: "",
    stockQuantity: "",
    price: "",
    category: "",
    images: "",
    phoneNumber: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const url = `${BaseUrl}products/`;

  const fields: FieldForm[] = [
    {
      name: "title",
      label: "عنوان المنتج",
      type: "text",
      placeholder: "مثلاً: ساعة نسائية أنيقة",
    },
    {
      name: "description",
      label: "الوصف",
      type: "text",
      placeholder: "أكتب وصفاً مختصراً للمنتج...",
    },
    {
      name: "stockQuantity",
      label: "الكمية في المخزون",
      type: "number",
      placeholder: "مثلاً: 25",
    },
    {
      name: "price",
      label: "السعر",
      type: "number",
      placeholder: "مثلاً: 150.00",
    },
    {
      name: "category",
      label: "القسم",
      type: "text",
      placeholder: "مثلاً: ساعات",
    },
  ];

  const handleChange = (updatedData: Record<string, any>) => {
    setData((prev) => ({ ...prev, ...updatedData }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      // Validate file types
      const validFiles = files.filter(
        (file) =>
          file.type.startsWith("image/") &&
          ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          )
      );

      if (validFiles.length !== files.length) {
        setUploadError("يرجى اختيار ملفات صور صحيحة (JPG, PNG, WebP)");
        toast.error("يرجى اختيار ملفات صور صحيحة (JPG, PNG, WebP)");
      }

      if (validFiles.length > 0) {
        // Simulate upload delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newFiles = [...imageFiles, ...validFiles];
        setImageFiles(newFiles);

        // Create previews
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);

        setUploadSuccess(true);
        toast.success(`تم إضافة ${validFiles.length} صورة بنجاح`);

        // Clear success state after 2 seconds
        setTimeout(() => setUploadSuccess(false), 2000);
      }
    } catch (error) {
      setUploadError("حدث خطأ أثناء رفع الصور");
      toast.error("حدث خطأ أثناء رفع الصور");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);

    toast.success("تم حذف الصورة");
  };

  const clearAllImages = () => {
    // Revoke all object URLs
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));

    setImageFiles([]);
    setImagePreviews([]);
    setUploadError(null);
    setUploadSuccess(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.success("تم حذف جميع الصور");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      toast.error("يرجى إضافة صورة واحدة على الأقل للمنتج");
      return;
    }

    const token = Cookies.get("token_admin");

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("stockQuantity", data.stockQuantity || "0");
    formData.append("category", data.category);

    // Append all images to FormData
    imageFiles.forEach((file, index) => {
      formData.append("images", file);
    });

    try {
      const res: ApiResponse<Creatproduct> = await CallApi(
        "post",
        url,
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      toast.success("تم إضافة المنتج بنجاح 🎉");
      console.log("Response:", res);

      // Reset form
      setData({
        title: "",
        description: "",
        stockQuantity: "",
        price: "",
        category: "",
        images: "",
        phoneNumber: "",
      });

      // Clear all images
      clearAllImages();
    } catch (error) {
      console.log(error);
      toast.error("فشل في إضافة المنتج ❌");
    }
  };

  return (
    <Container>
      <div className="min-h-screen bg-gradient-to-br from-[#faf0ff] via-[#fef8f5] to-[#fff] flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md border border-purple-100 rounded-3xl shadow-2xl p-6 sm:p-10 md:p-12 space-y-8 mx-auto">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2 truncate">
              🚀 إضافة منتج جديد
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              قم بملء التفاصيل التالية لإضافة منتجك إلى المتجر
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* صور المنتج */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <ImageIcon size={20} className="text-white" />
                  </div>
                  <div>
                    <label className="font-bold text-[#6B2B7A] text-lg">
                      صور المنتج
                    </label>
                    <p className="text-sm text-gray-500">
                      {imageFiles.length > 0
                        ? `${imageFiles.length} صورة مختارة`
                        : "اختر صور المنتج"}
                    </p>
                  </div>
                </div>
                {imageFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllImages}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <X size={16} />
                    حذف الكل
                  </button>
                )}
              </div>

              {/* Upload Area */}
              <div className="relative">
                <div
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                    isUploading
                      ? "bg-blue-50 border-blue-300"
                      : uploadError
                      ? "bg-red-50 border-red-300"
                      : uploadSuccess
                      ? "bg-green-50 border-green-300"
                      : "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:border-purple-300 hover:shadow-lg"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isUploading
                        ? "bg-blue-500"
                        : uploadError
                        ? "bg-red-500"
                        : uploadSuccess
                        ? "bg-green-500"
                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                    }`}
                  >
                    {isUploading ? (
                      <Loader2 size={20} className="text-white animate-spin" />
                    ) : uploadError ? (
                      <AlertCircle size={20} className="text-white" />
                    ) : uploadSuccess ? (
                      <CheckCircle size={20} className="text-white" />
                    ) : (
                      <Upload size={20} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <InputField
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      name="images"
                      type="file"
                      multiple
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      disabled={isUploading}
                      className="w-full text-sm focus:outline-none bg-transparent cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <div className="mt-2">
                      {isUploading ? (
                        <p className="text-blue-700 font-medium text-sm">
                          جاري رفع الصور...
                        </p>
                      ) : uploadError ? (
                        <p className="text-red-700 font-medium text-sm">
                          {uploadError}
                        </p>
                      ) : uploadSuccess ? (
                        <p className="text-green-700 font-medium text-sm">
                          تم رفع الصور بنجاح!
                        </p>
                      ) : (
                        <>
                          <p className="text-purple-700 font-medium text-sm">
                            اضغط لاختيار الصور أو اسحبها هنا
                          </p>
                          <p className="text-gray-500 text-xs">
                            يدعم: JPG, PNG, WebP (بدون حد أقصى)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {uploadError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-500" />
                      <p className="text-red-700 text-sm font-medium">
                        خطأ في رفع الصور
                      </p>
                    </div>
                    <p className="text-red-600 text-xs mt-1">
                      تأكد من أن الملفات المختارة هي صور صحيحة
                    </p>
                  </div>
                )}
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">
                        {imagePreviews.length}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-700">
                      معاينة الصور
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-300">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg hover:scale-110"
                        >
                          <X size={12} />
                        </button>

                        {/* Image Number Badge */}
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          {index + 1}
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <div className="text-white text-xs font-medium">
                            اضغط للحذف
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {imagePreviews.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 hover:border-purple-300 transition-colors">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-gray-600 font-semibold text-lg mb-2">
                    لا توجد صور مختارة
                  </h3>
                  <p className="text-gray-500 text-sm text-center max-w-sm">
                    اختر صور المنتج من الأعلى لعرضها هنا ومعاينتها قبل الإرسال
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    <span>بدون حد أقصى للصور</span>
                    <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                    <span>JPG, PNG, WebP</span>
                  </div>
                </div>
              )}
            </div>

            <FormField fields={fields} data={data} onChange={handleChange} />

            <Button
              type="submit"
              classname="w-full bg-gradient-to-r from-black/50 to-black/65 hover:from-[#170a1a] hover:to-[#0e090f] text-white font-bold py-3 text-lg rounded-xl transition duration-300 shadow-md hover:shadow-lg"
            >
              🎉 إضافة المنتج
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}
