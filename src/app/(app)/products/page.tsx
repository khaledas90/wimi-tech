"use client";

import { Card } from "../../components/ui/Card";
import { useEffect, useState } from "react";
import SmartNavbar from "../../components/ui/Navbar";
import Footer from "../../components/ui/Footer";
import { ApiResponse, gethome, main_screen_Product } from "../../lib/type";
import { BaseUrl } from "../../components/Baseurl";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useFavorites } from "../../contexts/FavoritesContext";
import { LoginRequiredModal } from "../../components/ui/Pop-up-login";
import { CallApi } from "../../lib/utilits";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Star,
  TrendingUp,
  Clock,
  Eye,
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<main_screen_Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [register, setRegister] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterPage, setFilterPage] = useState(1);
  const [filterHasMore, setFilterHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "price-high" | "price-low" | "popular"
  >("newest");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 10000,
  });

  const token = Cookies.get("token");
  const { incrementFavoritesCount, decrementFavoritesCount } = useFavorites();

  const categories = [
    "الكل",
    "الموضة والجمال",
    "المنزل والمطبخ",
    "الأطفال والألعاب",
    "الإلكترونيات والإكسسوارات",
    "الخدمات الصحية",
    "الخدمات الغذائية",
    "الضيافة والسكن",
    "الصيانة والمقاولات",
    "السيارات والنقل",
    "الزراعة",
    "المراكز التعليمية والتدريبية",
    "العروض والتخفيضات",
  ];

  const fetchProducts = async (isFilter = false, resetProducts = false) => {
    if (loadingMore || (!hasMore && !isFilter)) return;
    setLoadingMore(true);

    try {
      let res: ApiResponse<gethome>;

      if (
        isFilter &&
        selectedCategory &&
        selectedCategory !== "الكل" &&
        selectedCategory !== ""
      ) {
        res = await CallApi("post", `${BaseUrl}main/filter`, {
          category: selectedCategory,
        });

        const products = res.data?.products || [];
        // Sort products by createdAt in descending order (newest first)
        const sortedProducts = products.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        const pagination = res.data?.pagination || { totalPages: 0 };

        if (resetProducts) {
          setProducts(sortedProducts);
        } else {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p._id));
            const filteredNew = sortedProducts.filter(
              (p) => !existingIds.has(p._id)
            );
            return [...prev, ...filteredNew];
          });
        }

        setFilterPage((prev) => prev + 1);

        if (products.length === 0 || filterPage >= pagination.totalPages) {
          setFilterHasMore(false);
        }
      } else {
        res = await CallApi(
          "get",
          `${BaseUrl}main/main-screen?page=${page}&limit=12`
        );
        const newProducts = res.data?.products || [];
        // Sort products by createdAt in descending order (newest first)
        const sortedNewProducts = newProducts.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        const pagination = res.data?.pagination || { totalPages: 0 };

        if (resetProducts) {
          setProducts(sortedNewProducts);
        } else {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p._id));
            const filteredNew = sortedNewProducts.filter(
              (p) => !existingIds.has(p._id)
            );
            return [...prev, ...filteredNew];
          });
        }

        setPage((prev) => prev + 1);

        if (newProducts.length === 0 || page >= pagination.totalPages) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("حدث خطأ أثناء جلب المنتجات");
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category: string) => {
    setSelectedCategory(category);
    setIsFiltering(true);

    if (category === "الكل") {
      setPage(1);
      setHasMore(true);
      setFilterPage(1);
      setFilterHasMore(true);
      await fetchProducts(false, true);
    } else {
      setFilterPage(1);
      setFilterHasMore(true);
      setPage(1);
      setHasMore(true);
      await fetchProducts(true, true);
    }

    setIsFiltering(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const res: ApiResponse<gethome> = await CallApi(
        "post",
        `${BaseUrl}main/search`,
        {
          text: searchQuery,
          page: 1,
        }
      );

      const searchResults = res.data?.products || [];
      // Sort search results by createdAt in descending order (newest first)
      const sortedSearchResults = searchResults.sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setProducts(sortedSearchResults);
      setHasMore(false);
      setFilterHasMore(false);
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("حدث خطأ أثناء البحث");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = async () => {
    setSelectedCategory("");
    setSearchQuery("");
    setPage(1);
    setHasMore(true);
    setFilterPage(1);
    setFilterHasMore(true);
    setProducts([]);
    await fetchProducts(false, true);
  };

  const sortProducts = (products: main_screen_Product[]) => {
    const sorted = [...products];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "popular":
        return sorted.sort(
          (a, b) =>
            ((b as any).reviews_avg || 0) - ((a as any).reviews_avg || 0)
        );
      default:
        return sorted;
    }
  };

  const filterByPrice = (products: main_screen_Product[]) => {
    return products.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );
  };

  const filteredProducts = filterByPrice(sortProducts(products));

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !loadingMore &&
        !searchQuery.trim()
      ) {
        if (
          selectedCategory &&
          selectedCategory !== "الكل" &&
          selectedCategory !== ""
        ) {
          if (filterHasMore) {
            fetchProducts(true, false);
          }
        } else {
          if (hasMore) {
            fetchProducts(false, false);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, hasMore, filterHasMore, selectedCategory, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handelfavorit = async (id: string) => {
    try {
      if (!token) {
        setRegister(true);
        return;
      }

      const product = products.find((p) => p._id === id);
      if (product) {
        // Handle favorite logic here
      }
    } catch (error) {
      console.error("Error in favorite handler:", error);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#FAF5FF] via-white to-[#F5F0FF]">
      <SmartNavbar />

      {/* Header Section */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-[#4C1D95] to-[#7C3AED] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              جميع المنتجات
            </h1>
            <p className="text-lg sm:text-xl opacity-90 max-w-2xl mx-auto">
              اكتشف آلاف المنتجات المتنوعة بأسعار تنافسية وجودة عالية
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right bg-white min-w-[150px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right bg-white min-w-[120px]"
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="price-high">الأعلى سعراً</option>
                <option value="price-low">الأقل سعراً</option>
                <option value="popular">الأكثر شعبية</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                  showFilters
                    ? "bg-purple-100 text-purple-600 border border-purple-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <SlidersHorizontal size={20} />
                <span className="hidden sm:inline">فلتر متقدم</span>
              </button>

              {/* Clear Filters */}
              {(selectedCategory || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                >
                  <X size={20} />
                  <span className="hidden sm:inline">مسح الفلاتر</span>
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    نطاق السعر (ر.س)
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="number"
                      placeholder="من"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
                    />
                    <span className="text-gray-500">إلى</span>
                    <input
                      type="number"
                      placeholder="إلى"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right"
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    إحصائيات سريعة
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {filteredProducts.length}
                      </div>
                      <div className="text-sm text-blue-600">منتج متاح</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(
                          filteredProducts.reduce(
                            (sum, p) => sum + p.price,
                            0
                          ) / filteredProducts.length
                        ) || 0}
                      </div>
                      <div className="text-sm text-green-600">متوسط السعر</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {searchQuery
                ? `نتائج البحث عن "${searchQuery}"`
                : selectedCategory && selectedCategory !== "الكل"
                ? `منتجات ${selectedCategory}`
                : "جميع المنتجات"}
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredProducts.length} منتج متاح
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp size={16} />
            <span>
              ترتيب حسب:{" "}
              {sortBy === "newest"
                ? "الأحدث"
                : sortBy === "oldest"
                ? "الأقدم"
                : sortBy === "price-high"
                ? "الأعلى سعراً"
                : sortBy === "price-low"
                ? "الأقل سعراً"
                : "الأكثر شعبية"}
            </span>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 animate-pulse"
              >
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              لا توجد منتجات متاحة
            </h3>
            <p className="text-gray-500 mb-6">
              جرب تغيير الفلاتر أو البحث بكلمات مختلفة
            </p>
            <button
              onClick={clearFilters}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              مسح جميع الفلاتر
            </button>
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                : "space-y-4"
            }`}
          >
            {filteredProducts.map((product, index) => (
              <div
                key={product._id}
                className={`transition-all duration-500 hover:scale-105 hover:z-10 ${
                  viewMode === "list"
                    ? "flex gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    : ""
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeInUp 0.6s ease-out forwards",
                }}
              >
                <Card
                  {...product}
                  handellove={() => handelfavorit(String(product._id))}
                />
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!searchQuery && (hasMore || filterHasMore) && (
          <div className="text-center mt-12">
            <button
              onClick={() => {
                if (
                  selectedCategory &&
                  selectedCategory !== "الكل" &&
                  selectedCategory !== ""
                ) {
                  if (filterHasMore) fetchProducts(true, false);
                } else {
                  if (hasMore) fetchProducts(false, false);
                }
              }}
              disabled={loadingMore}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري التحميل...
                </div>
              ) : (
                "تحميل المزيد"
              )}
            </button>
          </div>
        )}

        {/* Loading More Indicator */}
        {loadingMore && (
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg border border-gray-200">
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-gray-700">
                جاري تحميل المزيد من المنتجات...
              </p>
            </div>
          </div>
        )}
      </div>

      <LoginRequiredModal show={register} />
      <Footer />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
