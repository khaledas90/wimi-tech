"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { BaseUrl } from "../components/Baseurl";
import Cookies from "js-cookie";

interface CartContextType {
  cartCount: number;
  updateCartCount: () => Promise<void>;
  incrementCartCount: () => void;
  decrementCartCount: () => void;
  resetCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const token = Cookies.get("token");

  const fetchCartCount = async () => {
    try {
      if (!token) {
        setCartCount(0);
        return;
      }

      const res = await axios.get(`${BaseUrl}users/shopping`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(res.data.data.cartLength || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  const updateCartCount = async () => {
    await fetchCartCount();
  };

  const incrementCartCount = () => {
    setCartCount((prev) => prev + 1);
  };

  const decrementCartCount = () => {
    setCartCount((prev) => Math.max(0, prev - 1));
  };

  const resetCartCount = () => {
    setCartCount(0);
  };

  useEffect(() => {
    fetchCartCount();
  }, [token]);

  const value: CartContextType = {
    cartCount,
    updateCartCount,
    incrementCartCount,
    decrementCartCount,
    resetCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
