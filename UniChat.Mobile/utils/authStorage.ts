import * as SecureStore from 'expo-secure-store';

export const AUTH_KEYS = {
  ACCESS_TOKEN: 'accessToken',
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