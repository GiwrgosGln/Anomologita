import { useAuth } from "@/contexts/AuthContext";
import { refresh } from "@/services/auth.service";
import { useRef } from "react";

let refreshPromise: Promise<string | null> | null = null;

export function useValidAccessToken() {
  const { authData, setAuthData } = useAuth();
  const latestAuthDataRef = useRef(authData);
  latestAuthDataRef.current = authData;

  const getValidAccessToken = async () => {
    const latestAuthData = latestAuthDataRef.current;
    if (!latestAuthData) return null;

    const now = new Date();
    const accessTokenExpiry = new Date(latestAuthData.accessTokenExpiry);
    const refreshTokenExpiry = new Date(latestAuthData.refreshTokenExpiry);

    if (accessTokenExpiry > now) {
      return latestAuthData.accessToken;
    }

    if (refreshTokenExpiry <= now) {
      setAuthData(null);
      return null;
    }

    // If a refresh is already in progress, wait for it
    if (refreshPromise) {
      return refreshPromise;
    }

    // Start a new refresh
    refreshPromise = (async () => {
      try {
        const refreshed = await refresh({
          refreshToken: latestAuthData.refreshToken,
        });

        const newAuthData = {
          ...latestAuthData,
          accessToken: refreshed.accessToken,
          accessTokenExpiry: refreshed.accessTokenExpiry,
          refreshToken: refreshed.refreshToken,
          refreshTokenExpiry: refreshed.refreshTokenExpiry,
        };

        setAuthData(newAuthData);
        console.log("Access token refreshed successfully");
        return refreshed.accessToken;
      } catch (err) {
        setAuthData(null);
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  };

  return getValidAccessToken;
}
