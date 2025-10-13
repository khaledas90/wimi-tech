"use client";
import {
  AlertTriangle,
  Clock,
  Phone,
  Shield,
  Mail,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import Logo from "../../../../public/asset/images/ويمي تك.jpg";

interface DashboardOverlayProps {
  status: "blocked" | "waiting";
}

const DashboardOverlay: React.FC<DashboardOverlayProps> = ({ status }) => {
  const isBlocked = status === "blocked";
  const isWaiting = status === "waiting";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl text-center my-8">
        <div className="flex flex-col items-center space-y-6 mb-8">
          <div className="relative">
            <Image
              src={Logo}
              alt="شعار الموقع"
              width={70}
              height={70}
              className="rounded-full shadow-2xl border-4 border-white"
              unoptimized
            />
          </div>

          <h1
            className={`text-3xl font-bold ${
              isBlocked ? "text-red-600" : "text-yellow-600"
            }`}
          >
            {isBlocked ? "🚫 حسابك محظور" : "⏳ في انتظار الموافقة"}
          </h1>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 text-right border-2 border-gray-200">
          <div className="space-y-6">
            {isBlocked ? (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 border-2 border-red-200">
                  <h2 className="text-2xl font-bold text-red-700 mb-4">
                    🚫 حسابك محظور مؤقتاً
                  </h2>
                  <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                    <p>
                      عذراً، حسابك محظور حالياً من قبل فريق الدعم الفني. يرجى
                      التواصل معنا لحل هذه المشكلة.
                    </p>
                    <p className="font-semibold text-red-600">
                      سنقوم بمراجعة حالتك وإعادة تفعيل حسابك فور حل المشكلة.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
                  <h2 className="text-2xl font-bold text-green-700 mb-4">
                    🌟 شكرًا لانضمامكم إلى Wimi
                  </h2>
                  <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                    <p>
                      حسابكم حاليًا قيد المراجعة من قبل فريقنا، وسنقوم بتفعيل
                      جميع خدماتكم فور صدور موافقة الإدارة.
                    </p>
                    <p className="font-semibold text-green-600">
                      سنبلغكم مباشرة عند اكتمال التفعيل.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <p className="text-purple-700 font-semibold text-lg">
            {isBlocked
              ? "نحن هنا لمساعدتك في حل هذه المشكلة"
              : "نشكرك لصبرك وسنوافيك بالنتيجة قريباً"}
          </p>
          <p className="text-purple-600 text-sm mt-2">
            فريق الدعم الفني يعمل على مدار الساعة لخدمتك
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverlay;
