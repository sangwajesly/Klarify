import axios from "axios";
import { supabase } from "./supabase";

let rawUrl = import.meta.env.VITE_API_URL;
if (rawUrl && !rawUrl.startsWith("http://") && !rawUrl.startsWith("https://") && !rawUrl.startsWith("/")) {
  if (rawUrl.includes("localhost") || rawUrl.includes("127.0.0.1")) {
    rawUrl = `http://${rawUrl}`;
  } else {
    rawUrl = `https://${rawUrl}`;
  }
}

export const API_URL =
  rawUrl ||
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
      {
        headers,
        // If auth is missing/expired, backend may return 401.
        // We keep it so the UI can decide what to do.
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw error;
  }
};
