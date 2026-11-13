import React from "react";
import {
  Globe,
  Building2,
  Zap,
  MapPin,
  Compass,
  Award,
  Briefcase,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const CITIES = [
  "Douala",
  "Yaoundé",
  "Buea",
  "Bafoussam",
  "Bamenda",
  "Garoua",
  "Other",
];

const CAREER_DIRECTIONS = [
  {
    id: "all",
    label: "All In-Demand Pathways",
    desc: "Evaluate full Cameroon & remote global tech market",
  },
  {
    id: "Software & Web",
    label: "Software, Web & Mobile Dev",
    desc: "Frontend, Backend, Flutter, React, APIs",
  },
  {
    id: "Data & AI",
    label: "Data & Business Intelligence",
    desc: "Excel, SQL, Power BI, Python, Data Analytics",
  },
  {
    id: "Business & Finance",
    label: "Finance & OHADA Accounting",
    desc: "Corporate accounting, Sage Saari, Tax & Audit",
  },
  {
    id: "Design & Creative",
    label: "UI/UX & Digital Design",
    desc: "Figma, UX Research, Brand Strategy, Media",
  },
  {
    id: "Vocational & TVEE",
    label: "TVEE, Solar & Electrical",
    desc: "Solar PV, Domestic wiring, Maintenance trades",
  },
];

const OPPORTUNITY_TYPES = [
  {
    id: "all",
    icon: Compass,
    label: "All Opportunities",
    desc: "Bootcamps, internships & degree programs",
  },
  {
    id: "bootcamp",
    icon: Award,
    label: "Tech Bootcamps & Hubs",
    desc: "Seven Academy, ActivSpaces, ALX & fast cohorts",
  },
  {
    id: "internship",
    icon: Briefcase,
    label: "Internship Placements",
    desc: "Local Cameroon companies & remote junior roles",
  },
  {
    id: "degree",
    icon: GraduationCap,
    label: "Academic Degree Programs",
    desc: "Accredited bachelor's & professional master's",
  },
];

const EXPERIENCE_LEVELS = [
  {
    id: "beginner",
    label: "Starting From Scratch",
    desc: "Looking for structured foundations and starter mentorship",
  },
  {
    id: "self_taught",
    label: "Self-Taught Builder",
    desc: "Built personal projects, tutorials, or open source repos",
  },
  {
    id: "student",
    label: "University Student / Graduate",
    desc: "Strong academic background, actively converting to market skills",
  },
  {
    id: "freelancer",
    label: "Practical Work / Freelancer",
    desc: "Completed client projects, local gigs, or family business systems",
  },
];

const SkillPreferenceSelector = ({ preferences, onChange }) => {
  const {
    targetDirection = "all",
    opportunityGoal = "all",
    experienceLevel = "self_taught",
    workMode = "all",
    preferredCity = "Douala",
    budgetType = "all",
  } = preferences;

  const setField = (field, value) => {
    onChange({ ...preferences, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* 1. Target Direction */}
      <div>
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
          1. What Career Direction Do You Want to Target?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CAREER_DIRECTIONS.map((dir) => {
            const isSelected = targetDirection === dir.id;
            return (
              <button
                key={dir.id}
                type="button"
                onClick={() => setField("targetDirection", dir.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[90px] ${
                  isSelected
                    ? "bg-secondary-500/15 dark:bg-secondary-500/20 border-secondary-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-secondary-500"
                    : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {dir.label}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {dir.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Opportunity Type */}
      <div>
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
          2. What Type of Opportunity Are You Seeking?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {OPPORTUNITY_TYPES.map((opp) => {
            const isSelected = opportunityGoal === opp.id;
            const Icon = opp.icon;
            return (
              <button
                key={opp.id}
                type="button"
                onClick={() => setField("opportunityGoal", opp.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                  isSelected
                    ? "bg-secondary-500/15 dark:bg-secondary-500/20 border-secondary-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-secondary-500"
                    : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-secondary-600 dark:text-secondary-400 flex items-center justify-center mb-2 shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    {opp.label}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {opp.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Practical Experience Level */}
      <div>
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
          3. What Best Describes Your Practical Experience?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXPERIENCE_LEVELS.map((lvl) => {
            const isSelected = experienceLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setField("experienceLevel", lvl.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer min-h-[75px] ${
                  isSelected
                    ? "bg-secondary-500/15 dark:bg-secondary-500/20 border-secondary-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-secondary-500"
                    : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="font-bold text-sm text-slate-900 dark:text-white">
                  {lvl.label}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {lvl.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Work Mode & City in 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Work Mode */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            4. Preferred Work Mode
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "all", label: "Any / All" },
              { id: "remote", label: "Remote Only" },
              { id: "physical", label: "On-site" },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setField("workMode", mode.id)}
                className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold border transition-all text-center cursor-pointer ${
                  workMode === mode.id
                    ? "bg-secondary-500 text-slate-950 border-secondary-500 shadow-xs"
                    : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Cameroon Base City */}
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-3">
            5. Preferred Location in Cameroon
          </label>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setField("preferredCity", city)}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                  preferredCity === city
                    ? "bg-secondary-500 text-slate-950 border-secondary-500 font-bold shadow-xs"
                    : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillPreferenceSelector;
