import { useState, useEffect } from "react";
import { 
  getAllAuthData, 
  isAccessTokenValid, 
  isRefreshTokenValid, 
  storeAuthData, 
  clearAuthData 
} from "@/utils/authStorage";
import { refresh as refreshTokenApi } from "@/services/auth.service";
import { useRouter } from "expo-router";

export function useAuthToken() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    accessToken: "",
    refreshToken: "",
    refreshTokenExpiry: "",
    userId: "",
    username: "",
    universityId: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log("[useAuthToken] Hook is running (mount or deps change)");
    const checkTokens = async () => {
      try {
        console.log("[useAuthToken] Fetching auth data...");
        const authData = await getAllAuthData();
        setUserData(authData);

        if (await isAccessTokenValid()) {
          console.log("[useAuthToken] Access token is valid.");
          setIsLoading(false);
          return;
        } else {
          console.log("[useAuthToken] Access token is NOT valid.");
        }

        if (await isRefreshTokenValid()) {
          console.log("[useAuthToken] Refresh token is valid. Attempting refresh...");
          try {
            const refreshed = await refreshTokenApi({
              refreshToken: authData.refreshToken,
            });
            console.log("[useAuthToken] Token refresh successful:", refreshed);
            await storeAuthData({ ...authData, ...refreshed });
            setUserData({ ...authData, ...refreshed });
            setIsLoading(false);
            return;
          } catch (refreshError) {
            console.error("[useAuthToken] Token refresh failed:", refreshError);
          }
        } else {
          console.log("[useAuthToken] Refresh token is NOT valid.");
        }

        console.log("[useAuthToken] Clearing auth data and redirecting to login.");
        await clearAuthData();
        router.replace("/login");
      } catch (error) {
        console.error("[useAuthToken] Error in checkTokens:", error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    checkTokens();
  }, []);

  return { userData, setUserData, isLoading, hasError };
}