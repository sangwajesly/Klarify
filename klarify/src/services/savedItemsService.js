/**
 * Saved Items Service
 * Manages user bookmarks for Courses, Bootcamps, Internships, and Custom Profile Tracks.
 * Synchronizes resiliently with localStorage and Supabase.
 */

import { supabase } from "./supabase";

const getStorageKey = (prefix, userId) => `${prefix}_${userId || "guest"}`;

// --- Saved Courses & Bootcamps ---
export const getSavedCourses = (userId) => {
  try {
    const raw = localStorage.getItem(getStorageKey("klarify_saved_courses", userId));
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read saved courses:", err);
    return [];
  }
};

export const saveCourse = (userId, course) => {
  try {
    const existing = getSavedCourses(userId);
    const id = course.id || course.title;
    if (existing.some((c) => (c.id || c.title) === id)) {
      return existing; // Already saved
    }
    const updated = [
      {
        ...course,
        id,
        saved_at: new Date().toISOString(),
      },
      ...existing,
    ];
    localStorage.setItem(
      getStorageKey("klarify_saved_courses", userId),
      JSON.stringify(updated)
    );

    // Sync to Supabase in background if authenticated
    if (userId && userId !== "guest") {
      supabase
        .from("saved_resources")
        .upsert(
          {
            user_id: userId,
            resource_id: id,
            resource_type: course.type || "course",
            title: course.title,
            provider: course.provider || "Online",
            cost: course.cost || null,
            duration: course.duration || null,
            url: course.url || null,
          },
          { onConflict: "user_id,resource_id" }
        )
        .then(({ error }) => {
          if (error && error.code !== "42P01") {
            // Ignore if table does not exist yet (42P01)
            console.warn("Background sync for saved_resources:", error.message);
          }
        });
    }

    return updated;
  } catch (err) {
    console.error("Failed to save course:", err);
    return [];
  }
};

export const removeSavedCourse = (userId, courseId) => {
  try {
    const existing = getSavedCourses(userId);
    const updated = existing.filter((c) => (c.id || c.title) !== courseId);
    localStorage.setItem(
      getStorageKey("klarify_saved_courses", userId),
      JSON.stringify(updated)
    );

    // Sync deletion to Supabase
    if (userId && userId !== "guest") {
      supabase
        .from("saved_resources")
        .delete()
        .eq("user_id", userId)
        .eq("resource_id", courseId)
        .then(({ error }) => {
          if (error && error.code !== "42P01") {
            console.warn("Background delete from saved_resources:", error.message);
          }
        });
    }

    return updated;
  } catch (err) {
    console.error("Failed to remove saved course:", err);
    return [];
  }
};

// --- Saved Internships & Opportunities ---
export const getSavedInternships = (userId) => {
  try {
    const raw = localStorage.getItem(getStorageKey("klarify_saved_internships", userId));
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to read saved internships:", err);
    return [];
  }
};

export const saveInternship = (userId, internship) => {
  try {
    const existing = getSavedInternships(userId);
    const id = internship.id || internship.title;
    if (existing.some((item) => (item.id || item.title) === id)) {
      return existing;
    }
    const updated = [
      {
        ...internship,
        id,
        saved_at: new Date().toISOString(),
      },
      ...existing,
    ];
    localStorage.setItem(
      getStorageKey("klarify_saved_internships", userId),
      JSON.stringify(updated)
    );

    // Sync to Supabase
    if (userId && userId !== "guest") {
      supabase
        .from("saved_resources")
        .upsert(
          {
            user_id: userId,
            resource_id: id,
            resource_type: "internship",
            title: internship.title,
            provider: internship.provider || "Partner Hub",
            cost: internship.cost || null,
            duration: internship.duration || null,
            url: internship.url || null,
          },
          { onConflict: "user_id,resource_id" }
        )
        .then(({ error }) => {
          if (error && error.code !== "42P01") {
            console.warn("Background sync for saved internship:", error.message);
          }
        });
    }

    return updated;
  } catch (err) {
    console.error("Failed to save internship:", err);
    return [];
  }
};

export const removeSavedInternship = (userId, internshipId) => {
  try {
    const existing = getSavedInternships(userId);
    const updated = existing.filter((item) => (item.id || item.title) !== internshipId);
    localStorage.setItem(
      getStorageKey("klarify_saved_internships", userId),
      JSON.stringify(updated)
    );

    if (userId && userId !== "guest") {
      supabase
        .from("saved_resources")
        .delete()
        .eq("user_id", userId)
        .eq("resource_id", internshipId)
        .then(({ error }) => {
          if (error && error.code !== "42P01") {
            console.warn("Background delete for saved internship:", error.message);
          }
        });
    }

    return updated;
  } catch (err) {
    console.error("Failed to remove saved internship:", err);
    return [];
  }
};

// --- User Profile Multi-Track & Skill Preferences ---
export const getUserPortfolio = (userId) => {
  try {
    const raw = localStorage.getItem(getStorageKey("klarify_user_portfolio", userId));
    if (raw) return JSON.parse(raw);
    
    // Fallback: check if flow user skills exist in sessionStorage
    const sessionSkills = JSON.parse(sessionStorage.getItem("flow_user_skills") || "[]");
    return {
      academicLevel: "undergraduate",
      targetRoles: ["Junior Frontend Developer"],
      knownSkills: sessionSkills.length > 0 ? sessionSkills : ["html_css", "javascript", "excel"],
      activeTrack: "skills",
      savedNotes: "",
    };
  } catch (err) {
    console.error("Failed to load portfolio:", err);
    return {
      academicLevel: "undergraduate",
      targetRoles: [],
      knownSkills: [],
      activeTrack: "skills",
      savedNotes: "",
    };
  }
};

export const saveUserPortfolio = (userId, portfolio) => {
  try {
    localStorage.setItem(
      getStorageKey("klarify_user_portfolio", userId),
      JSON.stringify(portfolio)
    );
    // Also sync knownSkills to sessionStorage so /flow inherits them
    if (portfolio.knownSkills) {
      sessionStorage.setItem("flow_user_skills", JSON.stringify(portfolio.knownSkills));
    }

    // Sync to Supabase profiles table
    if (userId && userId !== "guest") {
      supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            academic_level: portfolio.academicLevel || "undergraduate",
            target_direction: portfolio.targetDirection || "Software & Web",
            known_skills: portfolio.knownSkills || [],
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .then(({ error }) => {
          if (error && error.code !== "42P01") {
            console.warn("Background sync for profile:", error.message);
          }
        });
    }

    return portfolio;
  } catch (err) {
    console.error("Failed to save portfolio:", err);
    return portfolio;
  }
};
