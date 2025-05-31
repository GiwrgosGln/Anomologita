import * as SecureStore from 'expo-secure-store';

export const AUTH_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  ACCESS_TOKEN_EXPIRY: 'accessTokenExpiry',
  REFRESH_TOKEN: 'refreshToken',
  REFRESH_TOKEN_EXPIRY: 'refreshTokenExpiry',
  USER_ID: 'userId',
  USERNAME: 'username',
  UNIVERSITY_ID: 'universityId',
};

// Store auth data
export const storeAuthData = async (authData: any) => {
  try {
    await SecureStore.setItemAsync(AUTH_KEYS.ACCESS_TOKEN, authData.accessToken);
    await SecureStore.setItemAsync(AUTH_KEYS.ACCESS_TOKEN_EXPIRY, authData.accessTokenExpiry);
    await SecureStore.setItemAsync(AUTH_KEYS.REFRESH_TOKEN, authData.refreshToken);
    await SecureStore.setItemAsync(AUTH_KEYS.REFRESH_TOKEN_EXPIRY, authData.refreshTokenExpiry);
    await SecureStore.setItemAsync(AUTH_KEYS.USER_ID, authData.userId);
    await SecureStore.setItemAsync(AUTH_KEYS.USERNAME, authData.username);
    
    if (authData.universityId) {
      await SecureStore.setItemAsync(AUTH_KEYS.UNIVERSITY_ID, authData.universityId);
    }
    
    return true;
  } catch (error) {
    console.error('Error storing auth data:', error);
    return false;
  }
};

// Get a specific auth value
export const getAuthItem = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
};

// Clear all auth data
export const clearAuthData = async () => {
  try {
    await Promise.all(
      Object.values(AUTH_KEYS).map(key => SecureStore.deleteItemAsync(key))
    );
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

export const isRefreshTokenValid = async (): Promise<boolean> => {
  try {
    const refreshTokenExpiry = await getAuthItem(AUTH_KEYS.REFRESH_TOKEN_EXPIRY);
    
    // If no expiry date exists, token is invalid
    if (!refreshTokenExpiry) {
      return false;
    }
    
    // Parse expiry date and compare with current time
    const expiryDate = new Date(refreshTokenExpiry);
    const currentDate = new Date();
    
    return expiryDate > currentDate;
  } catch (error) {
    console.error('Error checking refresh token validity:', error);
    return false;
  }
};

export const isAccessTokenValid = async (): Promise<boolean> => {
  try {
    const accessTokenExpiry = await getAuthItem(AUTH_KEYS.ACCESS_TOKEN_EXPIRY);
    
    // If no expiry date exists, token is invalid
    if (!accessTokenExpiry) {
      return false;
    }
    
    // Parse expiry date and compare with current time
    const expiryDate = new Date(accessTokenExpiry);
    const currentDate = new Date();
    
    return expiryDate > currentDate;
  } catch (error) {
    console.error('Error checking access token validity:', error);
    return false;
  }
};

// Get all auth data at once
export const getAllAuthData = async () => {
  try {
    const [
      accessToken,
      accessTokenExpiry,
      refreshToken,
      refreshTokenExpiry,
      userId,
      username,
      universityId,
    ] = await Promise.all([
      getAuthItem(AUTH_KEYS.ACCESS_TOKEN),
      getAuthItem(AUTH_KEYS.ACCESS_TOKEN_EXPIRY),
      getAuthItem(AUTH_KEYS.REFRESH_TOKEN),
      getAuthItem(AUTH_KEYS.REFRESH_TOKEN_EXPIRY),
      getAuthItem(AUTH_KEYS.USER_ID),
      getAuthItem(AUTH_KEYS.USERNAME),
      getAuthItem(AUTH_KEYS.UNIVERSITY_ID),
    ]);

    return {
      accessToken: accessToken || "",
      accessTokenExpiry: accessTokenExpiry || "",
      refreshToken: refreshToken || "",
      refreshTokenExpiry: refreshTokenExpiry || "",
      userId: userId || "",
      username: username || "",
      universityId: universityId || "",
    };
  } catch (error) {
    console.error("Error fetching all auth data:", error);
    return {
      accessToken: "",
      accessTokenExpiry: "",
      refreshToken: "",
      refreshTokenExpiry: "",
      userId: "",
      username: "",
      universityId: "",
    };
  }
};

export const setUniversityId = async (universityId: string) => {
  try {
    await SecureStore.setItemAsync(AUTH_KEYS.UNIVERSITY_ID, universityId);
    return true;
  } catch (error) {
    console.error('Error storing universityId:', error);
    return false;
  }
};