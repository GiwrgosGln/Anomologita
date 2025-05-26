import { API_BASE_URL} from "@/config/api";
import { University } from "@/types";

export const fetchUniversities = async (accessToken: string): Promise<University[]> => {
  const response = await fetch(`${API_BASE_URL}/universities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch universities");
  }

  const result = await response.json();
  return result;
};