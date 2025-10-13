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

interface UserProfile {
  UID: string;
  username: string;
  phoneNumber: string;
  verify: boolean;
  favourites: string[];
  createdAt: string;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // Return a default context instead of throwing an error
    return {
      user: null,
      loading: false,
      error: null,
      refreshUserData: async () => {},
      logout: () => {},
      isAuthenticated: false,
    };
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${BaseUrl}users/get-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUser(response.data.data);
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err: any) {
      console.error("Error fetching user data:", err);
      setError(err.response?.data?.message || "Failed to fetch user data");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    await fetchUserData();
  };

  const logout = () => {
    // Clear all user-related cookies
    Cookies.remove("token");
    Cookies.remove("phone");
    
    // Reset state
    setUser(null);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const value: UserContextType = {
    user,
    loading,
    error,
    refreshUserData,
    logout,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
