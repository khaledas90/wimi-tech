'use client';

import { BaseUrl } from '@/app/components/Baseurl';
import Container from '@/app/components/Container';
import { main_screen_Product, Pagination } from '@/app/lib/type';
import debounce from 'lodash.debounce';
import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SmartNavbar from '@/app/components/ui/Navbar'; // تأكد إن عندك كمبوننت النافبار

export default function SearchPagination() {
  const searchEndpoint = `${BaseUrl}main/search`;
  const [text, setText] = useState('');
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<main_screen_Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async (textValue: string, pageNumber: number) => {
    if (!textValue.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(
        searchEndpoint,
        { text: textValue, page: pageNumber },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        if (pageNumber === 1) {
          setProducts(response.data.data.products || []);
        } else {
          setProducts((prev) => [...prev, ...(response.data.data.products || [])]);
        }
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const debouncedFetch = useCallback(
    debounce((value: string, pageNum: number) => {
      fetchData(value, pageNum);
    }, 500),
    []
  );

  useEffect(() => {
    if (text.trim()) {
      debouncedFetch(text, page);
    } else {
      setProducts([]);
      setPagination(null);
    }
  }, [text, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && pagination && page < pagination.totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [pagination, page]);

  return (
    <>
      <SmartNavbar />

      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-yellow-100 py-12 px-4 mt-6 md:mt-12 ">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto rounded-2xl bg-white/40 backdrop-blur-lg p-6 shadow-2xl mt-20"
        >
          {/* 🔽 حقل البحث */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 ">
            <input
              type="text"
              placeholder="ابحث بكلمة..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-2/3 px-5 py-3 rounded-xl text-black bg-white/90 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-400 shadow-md"
            />
          </div>

          {/* ✅ نتائج البحث */}
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {products.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/70 border border-white/30 backdrop-blur-lg p-6 rounded-xl shadow-xl overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={item.images?.[0]}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="mt-2 text-purple-700 font-semibold">{item.price} ريال سعودى</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ⏳ تحميل */}
          {loading && (
            <div className="text-center text-gray-700 py-4 animate-pulse">
              جاري التحميل...
            </div>
          )}

          {/* ❌ لا يوجد نتائج */}
          {!loading && products.length === 0 && text.trim() && (
            <div className="text-center text-gray-600 py-4">لا يوجد نتائج.</div>
          )}

          <div ref={observerRef} className="h-10"></div>
        </motion.div>
      </div>
    </>
  );
}
