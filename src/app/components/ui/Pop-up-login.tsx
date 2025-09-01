import { AlertCircle } from "lucide-react";
import Link from "next/link";

export const LoginRequiredModal = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl p-6 md:p-8 text-center space-y-5">
        <div className="flex flex-col items-center justify-center">
          <AlertCircle className="text-red-500 w-14 h-14 mb-2" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            رجاء تسجيل الدخول
          </h2>
        </div>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          لا يمكنك الوصول إلى هذه العملية بدون تسجيل الدخول.
        </p>
        <Link
          href="/login"
          className="inline-block bg-btn-color text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition text-sm md:text-base"
        >
          تسجيل الدخول الآن
        </Link>
      </div>
    </div>
  );
};
