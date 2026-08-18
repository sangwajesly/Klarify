import axios from "axios";
import { supabase } from "./supabase";

let rawUrl = import.meta.env.VITE_API_URL;
if (
  rawUrl &&
  !rawUrl.startsWith("http://") &&
  !rawUrl.startsWith("https://") &&
  !rawUrl.startsWith("/")
) {
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

    const response = await axios.post(`${API_URL}/recommend/al-student`, data, {
      headers,
      // If auth is missing/expired, backend may return 401.
      // We keep it so the UI can decide what to do.
    });
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
    .select(
      `
      id,
      created_at,
      programs (*)
    `,
    )
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

import fallbackPrograms from "../data/programs.json";
import fallbackConcours from "../data/concours.json";

// Map fallback concours by ID for quick lookup
const fallbackConcoursMap = (fallbackConcours || []).reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

const formatProgramRecord = (p, cMap = {}) => {
  const concourObj =
    p.concours ||
    cMap[p.concours_id] ||
    (p.concours_id ? fallbackConcoursMap[p.concours_id] : null);
  const requiresConc = p.requires_concour ?? strToBool(p.requiresConcour);

  return {
    id: p.id,
    name: p.name,
    university: p.university,
    faculty: p.faculty,
    duration: p.durations ? `${p.durations} Years` : "3 Years",
    durationsNum: p.durations || 3,
    requiresConcours: requiresConc,
    portalUrl: p.portal_url || p.portalUrl,
    requiredALSubjects: p.required_al_subjects,
    degreeObtained: p.degree_obtained || p.degreeObtained,
    tags: p.tags || [],
    careers: p.careers || p.Careers || [],
    descriptions: p.descriptions,
    examDetails: concourObj
      ? {
          id: concourObj.id,
          name: concourObj.name,
          month: concourObj.month,
          deadline: concourObj.deadline,
          fee: concourObj.fee,
          requiredDocuments: concourObj.required_documents,
          procedure: concourObj.registration_procedure,
          portalUrl: concourObj.portal_url || concourObj.portalUrl,
          whatsappUrl: concourObj.whatsapp_url,
          prerequisites: concourObj.required_subjects,
        }
      : null,
  };
};

function strToBool(val) {
  if (typeof val === "boolean") return val;
  return String(val).toLowerCase() === "true";
}

// Fallback loader if Supabase query returns empty array
const getFallbackPrograms = () => {
  return (fallbackPrograms || []).map((p) =>
    formatProgramRecord(p, fallbackConcoursMap),
  );
};

export const fetchAllPrograms = async () => {
  try {
    const { data, error } = await supabase
      .from("programs")
      .select(
        `
        *,
        concours:concours_id (*)
      `,
      )
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn(
        "Supabase returned empty or error, using local dataset fallback:",
        error,
      );
      return getFallbackPrograms();
    }

    return data.map((p) => formatProgramRecord(p));
  } catch (err) {
    console.warn("Failed fetching from Supabase, using local fallback:", err);
    return getFallbackPrograms();
  }
};

export const fetchProgramById = async (programId) => {
  try {
    const { data, error } = await supabase
      .from("programs")
      .select(
        `
        *,
        concours:concours_id (*)
      `,
      )
      .eq("id", programId)
      .maybeSingle();

    if (error || !data) {
      const fallback = (fallbackPrograms || []).find((p) => p.id === programId);
      if (fallback) return formatProgramRecord(fallback, fallbackConcoursMap);
      throw new Error("Program not found");
    }

    return formatProgramRecord(data);
  } catch (err) {
    const fallback = (fallbackPrograms || []).find((p) => p.id === programId);
    if (fallback) return formatProgramRecord(fallback, fallbackConcoursMap);
    throw err;
  }
};

export const fetchAllUniversities = async () => {
  const allProgs = await fetchAllPrograms();
  const uniMap = {};

  allProgs.forEach((p) => {
    const u = p.university || "Other State Institution";
    if (!uniMap[u]) {
      uniMap[u] = {
        name: u,
        programCount: 0,
        concoursCount: 0,
        faculties: new Set(),
        hasPrivatePrograms: false,
      };
    }
    uniMap[u].programCount += 1;
    if (p.requiresConcours) uniMap[u].concoursCount += 1;
    if (p.faculty) uniMap[u].faculties.add(p.faculty);
    // If the program has an institution_id it likely comes from a private partner
    if (p.institution_id) uniMap[u].hasPrivatePrograms = true;
  });

  return Object.values(uniMap)
    .map((uni) => ({
      name: uni.name,
      programCount: uni.programCount,
      concoursCount: uni.concoursCount,
      facultiesCount: uni.faculties.size,
      faculties: Array.from(uni.faculties).sort(),
    }))
    .sort((a, b) => b.programCount - a.programCount);
};

export const fetchUniversityDetails = async (uniName) => {
  const allProgs = await fetchAllPrograms();
  const programs = allProgs.filter((p) => p.university === uniName);

  const facultiesSet = new Set();
  programs.forEach((p) => {
    if (p.faculty) facultiesSet.add(p.faculty);
  });

  return {
    name: uniName,
    programCount: programs.length,
    concoursCount: programs.filter((p) => p.requiresConcours).length,
    faculties: Array.from(facultiesSet).sort(),
    isPrivate: programs.some((p) => p.institution_id),
  };
};

// --- Partner Portal API Queries ---

export const registerPartnerAccount = async ({
  email,
  password,
  fullName,
  institutionName,
  city,
  campus,
  whatsappNumber,
  websiteUrl,
}) => {
  // 1. Sign up Supabase user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_type: "INSTITUTION_ADMIN",
      },
    },
  });

  if (authError) throw authError;

  const user = authData.user;
  if (!user) throw new Error("Registration failed.");

  const slug = institutionName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Generate UUID on client to avoid RLS .select() 403 failures
  const institutionId = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

  const institutionRecord = {
    id: institutionId,
    name: institutionName,
    slug,
    type: "PRIVATE_IPES",
    city: city || "Douala / Yaounde",
    campus: campus || "Main Campus",
    whatsapp_number: whatsappNumber,
    website_url: websiteUrl || "",
    verification_status: "PENDING",
  };

  // 2. Create Institution Record
  const { error: instError } = await supabase
    .from("institutions")
    .insert([institutionRecord]);

  if (instError) {
    console.error("Institution creation error:", instError);
    throw instError;
  }

  // 3. Link user to institution
  const { error: memberError } = await supabase
    .from("institution_members")
    .insert([
      {
        user_id: user.id,
        institution_id: institutionId,
        role: "INSTITUTION_ADMIN",
      },
    ]);

  if (memberError) {
    console.error("Membership linkage error:", memberError);
    throw memberError;
  }

  return {
    user,
    institution: institutionRecord,
  };
};

export const getPartnerProfile = async (userId) => {
    try {
    const { data, error } = await supabase
      .from("institution_members")
      .select(
        `
        role,
        institutions (*)
      `,
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data || !data.institutions) {
      return null;
    }
    // Return institution with subscription_tier (added to DB)
    return data.institutions;
  } catch (err) {
    console.error("Failed to load partner profile:", err);
    return null;
  }
};

export const fetchPartnerInstitutionPrograms = async (
  institutionId,
  uniName,
) => {
  try {
    let query = supabase.from("programs").select("*");
    if (institutionId) {
      query = query.eq("institution_id", institutionId);
    } else if (uniName) {
      query = query.eq("university", uniName);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn("Falling back for partner programs:", err);
    return (fallbackPrograms || []).filter(
      (p) => p.institution_id === institutionId || p.university === uniName,
    );
  }
};

export const createPartnerProgram = async (programData) => {
  const newProgram = {
    id: `IPES-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    name: programData.name,
    university: programData.university,
    faculty: programData.faculty,
    campus: programData.campus || "Main Campus",
    durations: parseInt(programData.durations || 3, 10),
    tuition_fee_xaf: programData.tuitionFee
      ? parseFloat(programData.tuitionFee)
      : null,
    requires_concour:
      programData.requiresConcour === true ||
      programData.requiresConcour === "true",
    portal_url: programData.portalUrl || "",
    required_al_subjects: programData.requiredALSubjects || "",
    tags: Array.isArray(programData.tags)
      ? programData.tags
      : (programData.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    degree_obtained: programData.degreeObtained || "",
    careers: Array.isArray(programData.careers)
      ? programData.careers
      : (programData.careers || "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
    descriptions: programData.descriptions || "",
    institution_id: programData.institutionId || null,
    is_approved: false,
  };

  const { data, error } = await supabase
    .from("programs")
    .insert([newProgram])
    .select();
  if (error) {
    console.error("Error creating program:", error);
    // Append to local fallback if DB write blocked
    fallbackPrograms.unshift(newProgram);
    return [newProgram];
  }
  return data;
};

export const createPartnerProgramsBulk = async (programsArray = []) => {
  if (!Array.isArray(programsArray) || programsArray.length === 0) return [];
  // Normalize records similar to single-create helper
  const normalized = programsArray.map((programData) => ({
    id:
      programData.id ||
      `IPES-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    name: programData.name,
    university: programData.university,
    faculty: programData.faculty,
    campus: programData.campus || "Main Campus",
    durations: parseInt(programData.durations || 3, 10),
    tuition_fee_xaf: programData.tuition_fee_xaf
      ? parseFloat(programData.tuition_fee_xaf)
      : programData.tuitionFee
        ? parseFloat(programData.tuitionFee)
        : null,
    requires_concour:
      programData.requires_concour === true ||
      String(programData.requires_concour).toLowerCase() === "true" ||
      programData.requiresConcour === "true",
    portal_url: programData.portal_url || programData.portalUrl || "",
    required_al_subjects:
      programData.required_al_subjects || programData.requiredALSubjects || "",
    tags: Array.isArray(programData.tags)
      ? programData.tags
      : (programData.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    degree_obtained: programData.degree_obtained || programData.degreeObtained || "",
    careers: Array.isArray(programData.careers)
      ? programData.careers
      : (programData.careers || "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
    descriptions: programData.descriptions || "",
    institution_id:
      programData.institutionId || programData.institution_id || null,
    is_approved: false,
  }));

  try {
    const { data, error } = await supabase
      .from("programs")
      .insert(normalized)
      .select();
    if (error) {
      console.error("Bulk insert error:", error);
      // Fallback: prepend to local fallback data
      normalized.reverse().forEach((p) => fallbackPrograms.unshift(p));
      return normalized;
    }
    return data || normalized;
  } catch (err) {
    console.error("Bulk create failed:", err);
    normalized.reverse().forEach((p) => fallbackPrograms.unshift(p));
    return normalized;
  }
};

export const updatePartnerProgram = async (programId, programData) => {
  const payload = {
    name: programData.name,
    university: programData.university,
    faculty: programData.faculty,
    campus: programData.campus,
    durations: parseInt(programData.durations || 3, 10),
    tuition_fee_xaf: programData.tuitionFee
      ? parseFloat(programData.tuitionFee)
      : null,
    requires_concour:
      programData.requiresConcour === true ||
      programData.requiresConcour === "true",
    portal_url: programData.portalUrl,
    required_al_subjects: programData.requiredALSubjects,
    tags: Array.isArray(programData.tags)
      ? programData.tags
      : (programData.tags || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
    degree_obtained: programData.degreeObtained,
    careers: Array.isArray(programData.careers)
      ? programData.careers
      : (programData.careers || "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
    descriptions: programData.descriptions,
  };

  const { data, error } = await supabase
    .from("programs")
    .update(payload)
    .eq("id", programId)
    .select();
  if (error) {
    console.error("Error updating program:", error);
    throw error;
  }
  return data;
};

export const deletePartnerProgram = async (programId) => {
  const { data, error } = await supabase
    .from("programs")
    .delete()
    .eq("id", programId);
  if (error) {
    console.error("Error deleting program:", error);
    throw error;
  }
  return data;
};

// --- Payments API ---
export const initiateSubscriptionPayment = async (institutionId, amount, description) => {
  const headers = await getAuthHeaders();
  const response = await axios.post(
    `${API_URL}/create-intent`,
    {
      institution_id: institutionId,
      amount: parseFloat(amount),
      description: description,
    },
    { headers }
  );
  return response.data;
};
