"use client";
import React, { useEffect, useState } from "react";
import { BaseUrl } from "@/app/components/Baseurl";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import {
  Wallet,
  DollarSign,
  User,
  Phone,
  Mail,
  RefreshCw,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Edit,
  X,
} from "lucide-react";

// Define the wallet type based on the actual API response
interface WalletData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  googleMapLink: string;
  wallet?: number;
  nationalId?: string;
  Iban?: string;
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBalance, setFilterBalance] = useState<string>("all");
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletData | null>(null);
  const [walletAmount, setWalletAmount] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);
  const token = Cookies.get("token_admin");

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BaseUrl}admin/get-wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Wallets API Response:", response.data);

      if (response.data.success) {
        setWallets(response.data.data || []);
      } else {
        toast.error(response.data.message || "فشل في جلب المحافظ");
      }
    } catch (error: any) {
      console.error("Error fetching wallets:", error);
      toast.error(error?.response?.data?.message || "خطأ في جلب المحافظ");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWallets();
    setRefreshing(false);
  };

  const handleUpdateWallet = (wallet: WalletData) => {
    setSelectedWallet(wallet);
    setWalletAmount((wallet.wallet || 0).toString());
    setShowWalletModal(true);
  };

  const updateWalletAmount = async () => {
    if (!selectedWallet || !walletAmount) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }

    const amount = parseFloat(walletAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("يرجى إدخال مبلغ صحيح أكبر من أو يساوي صفر");
      return;
    }

    setWalletLoading(true);
    try {
      const response = await fetch(`${BaseUrl}admin/update-wallet`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount,
          traderId: selectedWallet._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("تم تحديث المحفظة بنجاح");
        setShowWalletModal(false);
        setSelectedWallet(null);
        setWalletAmount("");
        fetchWallets(); // Refresh the wallets data
      } else {
        toast.error(data.message || "فشل في تحديث المحفظة");
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      toast.error("حدث خطأ أثناء تحديث المحفظة");
    } finally {
      setWalletLoading(false);
    }
  };

  const filteredWallets = wallets.filter((wallet) => {
    const matchesSearch =
      wallet._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wallet.phoneNumber.includes(searchTerm);

    const walletBalance = wallet.wallet ?? 0;
    const matchesBalance =
      filterBalance === "all" ||
      (filterBalance === "positive" && walletBalance > 0) ||
      (filterBalance === "zero" && walletBalance === 0) ||
      (filterBalance === "negative" && walletBalance < 0);

    return matchesSearch && matchesBalance;
  });

  const getBalanceColor = (balance: number | undefined | null) => {
    const safeBalance = balance ?? 0;
    if (safeBalance > 0) return "text-green-600";
    if (safeBalance < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getBalanceIcon = (balance: number | undefined | null) => {
    const safeBalance = balance ?? 0;
    if (safeBalance > 0) return TrendingUp;
    if (safeBalance < 0) return TrendingDown;
    return Wallet;
  };

  const formatBalance = (balance: number | undefined | null) => {
    const safeBalance = balance ?? 0;
    return `${safeBalance.toLocaleString()} ر.س`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل المحافظ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">إدارة المحافظ</h1>
                <p className="text-blue-100 text-lg">
                  عرض وإدارة محافظ المستخدمين والتجار
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              />
              تحديث
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  فلترة حسب الرصيد:
                </span>
              </div>
              <select
                value={filterBalance}
                onChange={(e) => setFilterBalance(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع المحافظ</option>
                <option value="positive">رصيد موجب</option>
                <option value="zero">رصيد صفر</option>
                <option value="negative">رصيد سالب</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="البحث في المحافظ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  إجمالي المحافظ
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {wallets.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  إجمالي الرصيد
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {wallets
                    .reduce((sum, wallet) => sum + (wallet.wallet ?? 0), 0)
                    .toLocaleString()}{" "}
                  ر.س
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  محافظ موجبة
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {wallets.filter((w) => (w.wallet ?? 0) > 0).length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  محافظ سالبة
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {wallets.filter((w) => (w.wallet ?? 0) < 0).length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Wallets Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">قائمة المحافظ</h2>
          </div>

          {filteredWallets.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">لا توجد محافظ</p>
              <p className="text-gray-400 text-sm">
                لم يتم العثور على أي محافظ تطابق المعايير المحددة
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      معرف المستخدم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      اسم المستخدم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      البريد الإلكتروني
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم الهاتف
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العنوان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الرصيد
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWallets.map((wallet) => {
                    const BalanceIcon = getBalanceIcon(wallet.wallet);
                    return (
                      <tr
                        key={wallet._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {wallet._id.slice(-8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {wallet.firstName} {wallet.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {wallet.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {wallet.phoneNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span
                              className="max-w-32 truncate"
                              title={wallet.address}
                            >
                              {wallet.address}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <BalanceIcon
                              className={`w-4 h-4 ${getBalanceColor(
                                wallet.wallet
                              )}`}
                            />
                            <span
                              className={`font-semibold ${getBalanceColor(
                                wallet.wallet
                              )}`}
                            >
                              {formatBalance(wallet.wallet)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateWallet(wallet)}
                              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                              title="تحديث المحفظة"
                            >
                              <Edit className="w-4 h-4" />
                              <span>تحديث</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Update Modal */}
      {showWalletModal && selectedWallet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      تحديث المحفظة
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedWallet.firstName} {selectedWallet.lastName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowWalletModal(false);
                    setSelectedWallet(null);
                    setWalletAmount("");
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المبلغ الحالي
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-green-600">
                      {(selectedWallet.wallet || 0).toLocaleString()} ر.س
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المبلغ الجديد
                  </label>
                  <input
                    type="number"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                    placeholder="أدخل المبلغ الجديد"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => {
                    setShowWalletModal(false);
                    setSelectedWallet(null);
                    setWalletAmount("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={updateWalletAmount}
                  disabled={walletLoading}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {walletLoading ? "جاري التحديث..." : "تحديث المحفظة"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
