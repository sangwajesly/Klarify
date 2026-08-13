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

// --- Saved Programs (Direct Supabase Access) ---

export const saveProgram = async (userId, programId) => {
  const { data, error } = await supabase
    .from("saved_programs")
    .insert([{ user_id: userId, program_id: programId }])
    .select();

  if (error) {
    console.error("Error saving program:", error);
    throw error;
  }
  return data;
};

export const removeSavedProgram = async (userId, programId) => {
  const { data, error } = await supabase
    .from("saved_programs")
    .delete()
    .eq("user_id", userId)
    .eq("program_id", programId);

  if (error) {
    console.error("Error removing saved program:", error);
    throw error;
  }
  return data;
};

export const getSavedPrograms = async (userId) => {
  const { data, error } = await supabase
    .from("saved_programs")
    .select(`
      id,
      created_at,
      programs (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching saved programs:", error);
    throw error;
  }
  
  // Flatten the response so it's easier to use in the UI
  // data is an array of { id, created_at, programs: { ...program details } }
  return data.map((item) => ({
    save_id: item.id,
    saved_at: item.created_at,
    ...item.programs,
  }));
};

// --- Programs Catalog & Details Queries ---

export const fetchAllPrograms = async () => {
  const { data, error } = await supabase
    .from("programs")
    .select(`
      *,
      concours (*)
    `)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching programs:", error);
    throw error;
  }

  // Transform db records to match UI model expected by ProgramCard
  return (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    university: p.university,
    faculty: p.faculty,
    duration: p.durations ? `${p.durations} Years` : "3 Years",
    durationsNum: p.durations || 3,
    requiresConcours: p.requires_concour,
    portalUrl: p.portal_url,
    requiredALSubjects: p.required_al_subjects,
    tags: p.tags || [],
    careers: p.careers || [],
    descriptions: p.descriptions,
    examDetails: p.concours ? {
      id: p.concours.id,
      name: p.concours.name,
      month: p.concours.month,
      deadline: p.concours.deadline,
      fee: p.concours.fee,
      requiredDocuments: p.concours.required_documents,
      procedure: p.concours.registration_procedure,
      portalUrl: p.concours.portal_url,
      whatsappUrl: p.concours.whatsapp_url,
      prerequisites: p.concours.required_subjects,
    } : null
  }));
};

export const fetchProgramById = async (programId) => {
  const { data, error } = await supabase
    .from("programs")
    .select(`
      *,
      concours (*)
    `)
    .eq("id", programId)
    .single();

  if (error) {
    console.error("Error fetching program details:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    university: data.university,
    faculty: data.faculty,
    duration: data.durations ? `${data.durations} Years` : "3 Years",
    durationsNum: data.durations || 3,
    requiresConcours: data.requires_concour,
    portalUrl: data.portal_url,
    requiredALSubjects: data.required_al_subjects,
    tags: data.tags || [],
    careers: data.careers || [],
    descriptions: data.descriptions,
    examDetails: data.concours ? {
      id: data.concours.id,
      name: data.concours.name,
      month: data.concours.month,
      deadline: data.concours.deadline,
      fee: data.concours.fee,
      requiredDocuments: data.concours.required_documents,
      procedure: data.concours.registration_procedure,
      portalUrl: data.concours.portal_url,
      whatsappUrl: data.concours.whatsapp_url,
      prerequisites: data.concours.required_subjects,
    } : null
  };
};

export const fetchAllUniversities = async () => {
  const { data, error } = await supabase
    .from("programs")
    .select("university, faculty, requires_concour");

  if (error) {
    console.error("Error fetching universities list:", error);
    throw error;
  }

  // Aggregate stats per university
  const uniMap = {};
  (data || []).forEach((p) => {
    const u = p.university || "Other State Institution";
    if (!uniMap[u]) {
      uniMap[u] = {
        name: u,
        programCount: 0,
        concoursCount: 0,
        faculties: new Set(),
      };
    }
    uniMap[u].programCount += 1;
    if (p.requires_concour) uniMap[u].concoursCount += 1;
    if (p.faculty) uniMap[u].faculties.add(p.faculty);
  });

  return Object.values(uniMap).map((uni) => ({
    name: uni.name,
    programCount: uni.programCount,
    concoursCount: uni.concoursCount,
    facultiesCount: uni.faculties.size,
    faculties: Array.from(uni.faculties).sort(),
  })).sort((a, b) => b.programCount - a.programCount);
};

export const fetchUniversityDetails = async (uniName) => {
  const { data, error } = await supabase
    .from("programs")
    .select(`
      *,
      concours (*)
    `)
    .eq("university", uniName)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching university details:", error);
    throw error;
  }

  const programs = (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    university: p.university,
    faculty: p.faculty,
    duration: p.durations ? `${p.durations} Years` : "3 Years",
    durationsNum: p.durations || 3,
    requiresConcours: p.requires_concour,
    portalUrl: p.portal_url,
    requiredALSubjects: p.required_al_subjects,
    tags: p.tags || [],
    careers: p.careers || [],
    descriptions: p.descriptions,
    examDetails: p.concours ? {
      id: p.concours.id,
      name: p.concours.name,
      month: p.concours.month,
      deadline: p.concours.deadline,
      fee: p.concours.fee,
      requiredDocuments: p.concours.required_documents,
      procedure: p.concours.registration_procedure,
      portalUrl: p.concours.portal_url,
      whatsappUrl: p.concours.whatsapp_url,
      prerequisites: p.concours.required_subjects,
    } : null
  }));

  const facultiesSet = new Set();
  programs.forEach((p) => {
    if (p.faculty) facultiesSet.add(p.faculty);
  });

  return {
    name: uniName,
    programCount: programs.length,
    concoursCount: programs.filter((p) => p.requiresConcours).length,
    faculties: Array.from(facultiesSet).sort(),
    programs,
  };
};


