import React from "react";
import { Globe, Building2, Zap, MapPin, Compass, Award, Briefcase, GraduationCap } from "lucide-react";

const CITIES = ["Douala", "Yaoundé", "Buea", "Bafoussam", "Bamenda", "Garoua", "Other"];

const CAREER_DIRECTIONS = [
  { id: "all", label: "All In-Demand Pathways", desc: "Evaluate full Cameroon & remote market" },
  { id: "Software & Web", label: "Software, Web & Mobile Dev", desc: "Frontend, Backend, Flutter, React" },
  { id: "Data & AI", label: "Data & Business Intelligence", desc: "Excel, SQL, Power BI, Python" },
  { id: "Business & Finance", label: "Finance & OHADA Accounting", desc: "Corporate accounting, Sage Saari, Audit" },
  { id: "Design & Creative", label: "UI/UX & Digital Design", desc: "Figma, Graphic Design, Brand Content" },
  { id: "Vocational & TVEE", label: "TVEE, Solar & Electrical", desc: "Solar PV, Domestic wiring, Maintenance" },
];

const OPPORTUNITY_TYPES = [
  { id: "all", icon: Compass, label: "All Opportunities", desc: "Bootcamps, internships & degrees" },
  { id: "bootcamp", icon: Award, label: "Tech Bootcamps & Hubs", desc: "Seven Academy, ActivSpaces, ALX" },
  { id: "internship", icon: Briefcase, label: "Internship Placements", desc: "Local Cameroon & remote junior roles" },
  { id: "degree", icon: GraduationCap, label: "Academic Degree Programs", desc: "University bachelor's & master's" },
];

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Starting From Scratch", desc: "Looking for structured foundation" },
  { id: "self_taught", label: "Self-Taught Builder", desc: "Built personal projects or tutorials" },
  { id: "student", label: "University Student / Graduate", desc: "Academic background, building skills" },
  { id: "freelancer", label: "Practical Work / Freelancer", desc: "Completed client or family business work" },
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
    <div className="space-y-7">
      {/* 1. Target Direction / Career Ambition */}
      <div>
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
          1. What Career Direction Do You Want to Target?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {CAREER_DIRECTIONS.map((dir) => {
            const isSelected = targetDirection === dir.id;
            return (
              <button
                key={dir.id}
                type="button"
                onClick={() => setField("targetDirection", dir.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary-500/10 dark:bg-secondary-500/15 border-primary-500 dark:border-secondary-500 text-slate-900 dark:text-white ring-1 ring-primary-500/30"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">{dir.label}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {dir.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Target Opportunity Type */}
      <div>
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
          2. What Type of Opportunity Are You Seeking?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {OPPORTUNITY_TYPES.map((opp) => {
            const isSelected = opportunityGoal === opp.id;
            const Icon = opp.icon;
            return (
              <button
                key={opp.id}
                type="button"
                onClick={() => setField("opportunityGoal", opp.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-primary-500/10 dark:bg-secondary-500/15 border-primary-500 dark:border-secondary-500 text-slate-900 dark:text-white ring-1 ring-primary-500/30"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary-500 dark:text-secondary-400 flex items-center justify-center mb-2">
                  <Icon size={14} />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{opp.label}</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {opp.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Practical Experience / Background */}
      <div>
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
          3. What Is Your Practical Background?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {EXPERIENCE_LEVELS.map((exp) => {
            const isSelected = experienceLevel === exp.id;
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => setField("experienceLevel", exp.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary-500/10 dark:bg-secondary-500/15 border-primary-500 dark:border-secondary-500 text-slate-900 dark:text-white ring-1 ring-primary-500/30"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">{exp.label}</div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {exp.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Opportunity Mode (Jobs & Internships) */}
      <div>
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5">
          4. Work & Location Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setField("workMode", "all")}
            className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              workMode === "all"
                ? "bg-primary-500/10 dark:bg-secondary-500/15 border-primary-500 dark:border-secondary-500 text-slate-900 dark:text-white ring-1 ring-primary-500/30"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-slate-800 text-primary-600 dark:text-secondary-400 flex items-center justify-center shrink-0">
              <Zap size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Flexible / All</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Both remote & onsite roles in Cameroon
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setField("workMode", "remote")}
            className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              workMode === "remote"
                ? "bg-primary-500/10 dark:bg-secondary-500/15 border-primary-500 dark:border-secondary-500 text-slate-900 dark:text-white ring-1 ring-primary-500/30"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Globe size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Remote Contracts</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Work from anywhere in USD / EUR
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setField("workMode", "onsite")}
            className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
              workMode === "onsite"
                ? "bg-primary-500/10 dark:bg-secondary-500/15 border-primary-500 dark:border-secondary-500 text-slate-900 dark:text-white ring-1 ring-primary-500/30"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Building2 size={16} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Onsite Cameroon</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Physical companies & tech hubs in Cameroon
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* City Selection (for Onsite & Flexible) */}
      {workMode !== "remote" && (
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <MapPin size={13} className="text-primary-500 dark:text-secondary-400" />
            Preferred Cameroonian City
          </label>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setField("preferredCity", city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  preferredCity === city
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Learning Budget Preference */}
      <div>
        <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
          Upskilling Preference (Courses & Bootcamps)
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setField("budgetType", "all")}
            className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
              budgetType === "all"
                ? "border-primary-500 dark:border-secondary-500 bg-primary-500/5 dark:bg-secondary-500/10 font-bold text-slate-900 dark:text-white"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
            }`}
          >
            Show All Resources
            <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
              Free audit courses + certified bootcamps
            </span>
          </button>

          <button
            type="button"
            onClick={() => setField("budgetType", "free_only")}
            className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
              budgetType === "free_only"
                ? "border-primary-500 dark:border-secondary-500 bg-primary-500/5 dark:bg-secondary-500/10 font-bold text-slate-900 dark:text-white"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400"
            }`}
          >
            Prioritize Free / Sponsored
            <span className="block text-[11px] font-normal text-slate-500 mt-0.5">
              Free audit courses & fellowships
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillPreferenceSelector;
