import axios from "axios";
import { supabase } from "./supabase";

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://klarify-path-be.vercel.app"
    : "http://localhost:8000");

export async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return {};
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export const getRecommendations = async (data) => {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(
      `${API_URL}/recommend/al-student`,
      data,
      { headers },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};
