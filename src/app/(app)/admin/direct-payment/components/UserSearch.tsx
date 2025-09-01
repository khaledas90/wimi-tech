"use client";
import { useState } from "react";
import { Search, User, Check } from "lucide-react";
import FormField from "@/app/components/ui/Formfield";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { BaseUrl } from "@/app/components/Baseurl";
import { toArabicFullDate } from "@/app/lib/fun";

interface UserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  favourites: [];
  createdAt: string;
  __v: number;
}

interface UserSearchProps {
  onUserFound: (user: UserInfo) => void;
  onUserNotFound: (phoneNumber: string) => void;
}

const UserSearch = ({ onUserFound, onUserNotFound }: UserSearchProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token_admin");

  const checkUser = async () => {
    if (!phoneNumber.trim()) {
      toast.error("يرجى إدخال رقم الهاتف");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BaseUrl}traders/checkFoundUser`,
        {
          phoneNumber,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("تم العثور على المستخدم");
        onUserFound(response.data.data.userId);
      } else {
        onUserNotFound(phoneNumber);
      }
    } catch (error: any) {
      if (
        error.response?.status === 404 ||
        error.response?.data?.message?.includes("User not found") ||
        error.response?.data?.message?.includes("not found")
      ) {
        onUserNotFound(phoneNumber);
      } else {
        toast.error("خطأ في البحث عن المستخدم");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="text-center mb-6">
        <User className="w-16 h-16 text-gray-700 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] bg-clip-text text-transparent">
          البحث عن العميل
        </h2>
        <p className="text-gray-600 mt-2">ادخل رقم هاتف العميل للبحث</p>
      </div>

      <div className="max-w-md mx-auto">
        <FormField
          fields={[
            {
              name: "phoneNumber",
              label: "رقم الهاتف",
              type: "phoneNumber" as any,
              placeholder: "01xxxxxxxxx",
              requierd: true,
            },
          ]}
          data={{ phoneNumber }}
          onChange={(data) => setPhoneNumber(data.phoneNumber || "")}
        />
        <button
          onClick={checkUser}
          disabled={loading}
          className="w-full mt-4 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? "جاري البحث..." : "بحث"}
        </button>
      </div>
    </div>
  );
};

export default UserSearch;
