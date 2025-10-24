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

interface FavoritesContextType {
  favoritesCount: number;
  updateFavoritesCount: () => Promise<void>;
  incrementFavoritesCount: () => void;
  decrementFavoritesCount: () => void;
  resetFavoritesCount: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const token = Cookies.get("token");

  const fetchFavoritesCount = async () => {
    try {
      if (!token) {
        setFavoritesCount(0);
        return;
      }

      const res = await axios.get(`${BaseUrl}users/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoritesCount(res.data.data.length || 0);
    } catch (error) {
      console.error("Error fetching favorites count:", error);
      setFavoritesCount(0);
    }
  };

  const updateFavoritesCount = async () => {
    await fetchFavoritesCount();
  };

  const incrementFavoritesCount = () => {
    setFavoritesCount((prev) => prev + 1);
  };

  const decrementFavoritesCount = () => {
    setFavoritesCount((prev) => Math.max(0, prev - 1));
  };

  const resetFavoritesCount = () => {
    setFavoritesCount(0);
  };

  useEffect(() => {
    fetchFavoritesCount();
  }, [token]);

  const value: FavoritesContextType = {
    favoritesCount,
    updateFavoritesCount,
    incrementFavoritesCount,
    decrementFavoritesCount,
    resetFavoritesCount,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
