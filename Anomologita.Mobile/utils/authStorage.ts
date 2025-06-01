import * as SecureStore from "expo-secure-store";

const AUTH_KEY = "authData";

export async function storeAuthData(data: any) {
  try {
    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export async function getAuthData() {
  try {
    const data = await SecureStore.getItemAsync(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function clearAuthData() {
  try {
    await SecureStore.deleteItemAsync(AUTH_KEY);
    return true;
  } catch {
    return false;
  }
}