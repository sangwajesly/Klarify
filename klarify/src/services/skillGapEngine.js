import { CAREER_ROLES, FULFILLMENT_RESOURCES } from "../data/skillsData";
import programsData from "../data/programs.json";

// Map role IDs to relevant degree keywords in Cameroon universities
const ROLE_DEGREE_KEYWORDS = {
  data_analyst: ["computer", "mathematics", "economics", "statistic", "information"],
  frontend_developer: ["computer", "software", "information technology"],
  accounting_assistant: ["accounting", "finance", "banking", "management", "economics"],
  virtual_assistant: ["management", "communication", "administration", "bilingual"],
  ui_ux_designer: ["computer", "multimedia", "arts", "communication"],
  digital_marketer: ["marketing", "communication", "management", "business"],
  solar_technician: ["electrical", "electronic", "physics", "energy", "mechanical"],
};

function getMatchingDegreePrograms(roleId) {
  const keywords = ROLE_DEGREE_KEYWORDS[roleId] || ["computer"];
  const matches = (programsData || []).filter((p) => {
    const name = (p.name || "").toLowerCase();
    const tags = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : "";
    return keywords.some((k) => name.includes(k) || tags.includes(k));
  });
  // Return top 4 distinct programs
  return matches.slice(0, 4).map((p) => ({
    id: p.id,
    title: p.name,
    university: p.university,
    faculty: p.faculty,
    duration: p.durations ? `${p.durations} Years` : "3 Years",
    requiresConcour: p.requiresConcour === "true" || p.requiresConcour === true,
    url: `/programs/${p.id}`,
    description: p.descriptions || `Accredited degree program offered at ${p.university}.`,
  }));
}

/**
 * Evaluates user's skill set against market roles and returns prioritized
 * career trajectories, skill gaps, and multi-modal fulfillment resources.
 * 
 * @param {Array<string|{id: string, level?: string}>} userSkills - User's selected skills
 * @param {Object} preferences - { workMode, targetDirection, opportunityGoal, city }
 * @returns {Array<Object>} Ranked career pathways with exact gaps and learning resources
 */
export function evaluateSkillGaps(userSkills = [], preferences = { workMode: "all" }) {
  // Normalize user skills to a set of IDs
  const userSkillIds = new Set(
    userSkills.map((s) => (typeof s === "string" ? s : s.id))
  );

  // Filter or prioritize candidate roles by targetDirection if chosen
  let candidateRoles = CAREER_ROLES;
  if (preferences.targetDirection && preferences.targetDirection !== "all") {
    const matchedDomainRoles = CAREER_ROLES.filter(
      (r) => r.domain === preferences.targetDirection
    );
    if (matchedDomainRoles.length > 0) {
      candidateRoles = matchedDomainRoles;
    }
  }

  const matchedRoles = candidateRoles.map((role) => {
    const required = role.requiredSkills || [];
    const optional = role.optionalSkills || [];

    // Filter skills user already possesses
    const acquiredSkills = required.filter((s) => userSkillIds.has(s.id));
    
    // Skills the user is missing
    const missingSkills = required.filter((s) => !userSkillIds.has(s.id));

    // Optional bonus skills possessed
    const acquiredOptional = optional.filter((sId) => userSkillIds.has(sId));

    // Match calculation: base percentage on required skills
    const baseMatch = required.length > 0
      ? Math.round((acquiredSkills.length / required.length) * 100)
      : 0;

    // Small bonus for optional skills (up to +10%)
    const bonus = Math.min(10, acquiredOptional.length * 5);
    const finalMatchScore = Math.min(100, baseMatch + bonus);

    // Map fulfillment resources for the missing skills
    const missingSkillIds = new Set(missingSkills.map((s) => s.id));
    
    let resources = FULFILLMENT_RESOURCES.filter((res) =>
      missingSkillIds.has(res.skillId)
    );

    // Filter resources by work mode preference if specified
    if (preferences.workMode && preferences.workMode !== "all") {
      resources = resources.filter((res) => {
        if (preferences.workMode === "remote") {
          return res.deliveryMode === "remote";
        }
        if (preferences.workMode === "onsite") {
          return res.deliveryMode === "onsite";
        }
        return true;
      });
    }

    // Filter by budgetType if requested
    if (preferences.budgetType === "free_only") {
      resources = resources.filter((res) => {
        const costStr = (res.cost || "").toLowerCase();
        return costStr.includes("free") || costStr.includes("stipend") || costStr.includes("paid intern");
      });
    }

    // Attach real matching Cameroon degree programs from programs.json
    const matchingDegrees = getMatchingDegreePrograms(role.id);

    // Group resources by type
    const groupedFulfillment = {
      courses: resources.filter((r) => r.type === "course"),
      bootcamps: resources.filter((r) => r.type === "bootcamp" || r.type === "vocational_training"),
      internships: resources.filter((r) => r.type === "internship"),
      degreePrograms: matchingDegrees,
      books: resources.filter((r) => r.type === "book"),
    };

    const totalFulfillmentCount =
      groupedFulfillment.courses.length +
      groupedFulfillment.bootcamps.length +
      groupedFulfillment.internships.length +
      groupedFulfillment.degreePrograms.length;

    return {
      role,
      matchScore: finalMatchScore,
      acquiredCount: acquiredSkills.length,
      missingCount: missingSkills.length,
      acquiredSkills,
      missingSkills,
      fulfillment: groupedFulfillment,
      totalResourcesFound: totalFulfillmentCount,
      workModes: role.workModes,
      isCompatibleWorkMode:
        preferences.workMode === "all" ||
        role.workModes.includes(preferences.workMode),
    };
  });

  // Sort by highest match score, then prioritize compatible work modes
  matchedRoles.sort((a, b) => {
    if (a.isCompatibleWorkMode !== b.isCompatibleWorkMode) {
      return a.isCompatibleWorkMode ? -1 : 1;
    }
    return b.matchScore - a.matchScore;
  });

  return matchedRoles;
}
