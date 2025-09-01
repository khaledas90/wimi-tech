"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Sparkles, Phone, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Logo from "../../../../public/asset/images/ويمي تك.jpg";
import { BaseUrl, ApiKey } from "../Baseurl";
import { Postresponse } from "../../lib/methodes";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  userId?: string;
  endpointPath?: string;
  redirectTo?: string;
}

const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({
  isOpen,
  onClose,
  phoneNumber,
  userId,
  endpointPath = "users/verify-otp",
  redirectTo = "/",
}) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      const nextInput = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (isOpen) {
      setResendTimer(60);
      setCanResend(false);
    }
  }, [isOpen]);

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      toast.error("يرجى إدخال رمز التحقق المكون من 4 أرقام");
      return;
    }

    setIsLoading(true);
    try {
      const verificationData = { phoneNumber, otp: otpString, userId };
      const url = `${BaseUrl}${endpointPath}`;
      await Postresponse(url, verificationData, { api_key: ApiKey });

      toast.success("تم التحقق من رقم الهاتف بنجاح! 🎉");
      router.push(redirectTo);
      onClose();
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("رمز التحقق غير صحيح، يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      const resendData = { phoneNumber, userId };
      const url = `${BaseUrl}${endpointPath}`;
      await Postresponse(url, resendData, { api_key: ApiKey });

      toast.success("تم إرسال رمز تحقق جديد");
      setResendTimer(60);
      setCanResend(false);
      setOtp(["", "", "", ""]);
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("فشل في إرسال رمز التحقق، يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen px-4 relative">
        <div
          className="fixed inset-0 bg-black bg-opacity-40"
          aria-hidden="true"
        />

        <Dialog.Panel className="bg-white rounded-2xl p-6 max-w-md w-full z-10 shadow-xl text-center">
          <div className="flex flex-col items-center space-y-3 mb-6">
            <Image
              src={Logo}
              alt="شعار الموقع"
              width={50}
              height={50}
              className="rounded-full shadow-md"
              unoptimized
            />
            <h2 className="text-xl font-bold text-black bg-text-gradient bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-400" />
              تأكيد رقم الهاتف
            </h2>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Phone className="w-4 h-4" />
              <span className="font-medium">{phoneNumber}</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              تم إرسال رمز التحقق إلى رقم هاتفك
            </p>
          </div>

          <div className="space-y-4" dir="ltr">
            <label className="block text-sm font-medium text-gray-700 text-right">
              أدخل رمز التحقق المكون من 4 أرقام
            </label>

            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-black text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  dir="ltr"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={isLoading || otp.join("").length !== 4}
            className="w-full bg-black text-white font-bold py-3 rounded-lg shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? "جاري التحقق..." : "تأكيد الرمز"}
          </button>

          <div className="mt-4 text-center">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-600">
                إعادة الإرسال خلال {resendTimer} ثانية
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={!canResend || isLoading}
                className="text-sm text-purple-600 hover:text-purple-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إعادة إرسال رمز التحقق
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="mt-4 text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PhoneVerificationModal;
