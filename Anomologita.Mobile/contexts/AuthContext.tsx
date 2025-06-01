import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuthData, storeAuthData, clearAuthData } from "@/utils/authStorage";

type AuthData = {
  accessToken: string;
  accessTokenExpiry: string;
  refreshToken: string;
  refreshTokenExpiry: string;
  userId: string;
  username: string;
  isAdmin: boolean;
  isStudent: boolean;
  universityId: string;
};

type AuthContextType = {
  authData: AuthData | null;
  setAuthData: (data: AuthData | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  authData: null,
  setAuthData: () => {},
  isAuthenticated: false,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authData, setAuthDataState] = useState<AuthData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load auth data on mount
  useEffect(() => {
    const load = async () => {
      const stored = await getAuthData();
      if (stored) setAuthDataState(stored);
      setLoading(false);
    };
    load();
  }, []);

  // Save auth data to Secure Store whenever it changes
  const setAuthData = async (data: AuthData | null) => {
    setAuthDataState(data);
    if (data) {
      await storeAuthData(data);
    } else {
      await clearAuthData();
    }
  };

  const isAuthenticated =
    !!authData &&
    !!authData.refreshToken &&
    new Date(authData.refreshTokenExpiry) > new Date();

  return (
    <AuthContext.Provider
      value={{ authData, setAuthData, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
