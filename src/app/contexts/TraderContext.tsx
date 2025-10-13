"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { BaseUrl } from "@/app/components/Baseurl";
import Cookies from "js-cookie";

interface TraderProfile {
  UID: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  verify: boolean;
  address: string;
  googleMapLink: string;
  block: boolean;
  waiting: boolean;
  nationalId: string;
  imageOftrading: string;
  nationalId2: string;
  imageOfnationalId: string;
  Iban: string;
  nameOfbank: string;
  nameOfperson: string;
  imageOfiban: string;
  imageOffront: string;
  otp: string;
  createdAt: string;
}

interface TraderContextType {
  trader: TraderProfile | null;
  loading: boolean;
  error: string | null;
  refreshTraderData: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const TraderContext = createContext<TraderContextType | undefined>(undefined);

export const useTrader = () => {
  const context = useContext(TraderContext);
  if (context === undefined) {
    // Return a default context instead of throwing an error
    return {
      trader: null,
      loading: false,
      error: null,
      refreshTraderData: async () => {},
      logout: () => {},
      isAuthenticated: false,
    };
  }
  return context;
};

interface TraderProviderProps {
  children: ReactNode;
}

export const TraderProvider: React.FC<TraderProviderProps> = ({ children }) => {
  const [trader, setTrader] = useState<TraderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTraderData = async () => {
    const token = Cookies.get("token_admin");
    if (!token) {
      setTrader(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BaseUrl}traders/get-trader`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setTrader(response.data.data);
      } else {
        setError("Failed to fetch trader data");
        setTrader(null);
      }
    } catch (error: any) {
      console.error("Failed to fetch trader data:", error);
      setError(error.response?.data?.message || "Failed to fetch trader data");
      setTrader(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshTraderData = async () => {
    await fetchTraderData();
  };

  const logout = () => {
    // Clear all cookies
    Cookies.remove("token");
    Cookies.remove("token_admin");
    Cookies.remove("phone");
    Cookies.remove("uid");
    Cookies.remove("username");
    Cookies.remove("isBlocked");
    Cookies.remove("isWaiting");
    Cookies.remove("traderData");
    Cookies.remove("firstName");
    Cookies.remove("lastName");
    Cookies.remove("email");
    Cookies.remove("address");
    Cookies.remove("googleMapLink");
    Cookies.remove("nationalId");
    Cookies.remove("nationalId2");
    Cookies.remove("Iban");
    Cookies.remove("nameOfbank");
    Cookies.remove("nameOfperson");
    Cookies.remove("verify");
    Cookies.remove("createdAt");

    // Clear context state
    setTrader(null);
    setError(null);
  };

  const isAuthenticated = !!Cookies.get("token_admin") && !!trader;

  useEffect(() => {
    fetchTraderData();
  }, []);

  const value: TraderContextType = {
    trader,
    loading,
    error,
    refreshTraderData,
    logout,
    isAuthenticated,
  };

  return (
    <TraderContext.Provider value={value}>{children}</TraderContext.Provider>
  );
};
