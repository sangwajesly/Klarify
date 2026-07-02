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

/**
 * Send an OTP to a phone number (sign-up or login via phone).
 * @param {string} phone  - E.164 or local Cameroonian number
 * @param {string} fullName - User's full name (used for sign-up)
 */
export const sendOTP = async (phone, fullName = "") => {
  const response = await axios.post(`${API_URL}/auth/send-otp`, {
    phone,
    full_name: fullName,
  });
  return response.data;
};

/**
 * Verify the OTP the user received via SMS.
 * @param {string} phone - Same phone used in sendOTP
 * @param {string} code  - 6-digit code entered by user
 */
export const verifyOTP = async (phone, code) => {
  const response = await axios.post(`${API_URL}/auth/verify-otp`, {
    phone,
    code,
  });
  return response.data;
};

