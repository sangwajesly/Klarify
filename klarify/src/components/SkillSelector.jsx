import React, { useState, useMemo } from "react";
import { Check, Search, X, Plus, Sparkles, Layers } from "lucide-react";
import { SKILL_CATEGORIES } from "../data/skillsData";

const SkillSelector = ({ selectedSkills = [], onChange }) => {
  const categories = Object.keys(SKILL_CATEGORIES);
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [searchQuery, setSearchQuery] = useState("");

  // Map selectedSkills for fast lookup: id -> level
  const selectedMap = useMemo(() => {
    const map = new Map();
    selectedSkills.forEach((s) => {
      if (typeof s === "string") {
        map.set(s, "Intermediate");
      } else {
        map.set(s.id, s.level || "Intermediate");
      }
    });
    return map;
  }, [selectedSkills]);

  // Flattened search filter
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) {
      return SKILL_CATEGORIES[activeTab] || [];
    }
    const q = searchQuery.toLowerCase();
    const results = [];
    Object.values(SKILL_CATEGORIES).forEach((categorySkills) => {
      categorySkills.forEach((skill) => {
        if (skill.name.toLowerCase().includes(q)) {
          results.push(skill);
        }
      });
    });
    return results;
  }, [searchQuery, activeTab]);

  const toggleSkill = (skill) => {
    if (selectedMap.has(skill.id)) {
      const next = selectedSkills.filter(
        (s) => (typeof s === "string" ? s : s.id) !== skill.id
      );
      onChange(next);
    } else {
      onChange([
        ...selectedSkills,
        { id: skill.id, name: skill.name, level: "Intermediate" },
      ]);
    }
  };

  const handleAddCustomSkill = (customName) => {
    if (!customName.trim()) return;
    const customId = customName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    if (!selectedMap.has(customId)) {
      onChange([
        ...selectedSkills,
        { id: customId, name: customName.trim(), level: "Intermediate" },
      ]);
    }
    setSearchQuery("");
  };

  const cycleSkillLevel = (skillId, e) => {
    e.stopPropagation();
    const current = selectedMap.get(skillId) || "Intermediate";
    const levels = ["Beginner", "Intermediate", "Advanced"];
    const nextIdx = (levels.indexOf(current) + 1) % levels.length;
    const nextLevel = levels[nextIdx];

    const next = selectedSkills.map((s) => {
      const id = typeof s === "string" ? s : s.id;
      if (id === skillId) {
        return typeof s === "string" ? { id: s, level: nextLevel } : { ...s, level: nextLevel };
      }
      return s;
    });
    onChange(next);
  };

  const getCategoryCount = (category) => {
    const list = SKILL_CATEGORIES[category] || [];
    return list.filter((s) => selectedMap.has(s.id)).length;
  };

  return (
    <div className="w-full">
      {/* Search Input Bar (Touch-Optimized) */}
      <div className="relative mb-5">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any skill (e.g. Excel, Python, React, Solar, Figma)..."
          className="w-full pl-12 pr-11 py-3.5 sm:py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all font-medium shadow-xs"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Domain Category Tabs (Swipeable on Mobile) */}
      {!searchQuery && (
        <div className="flex overflow-x-auto gap-2 mb-6 pb-2 hide-scrollbar">
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-black ${
                      isActive
                        ? "bg-secondary-500 text-slate-950"
                        : "bg-primary-500 text-white"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Counter & Status Banner */}
      <div className="flex items-center justify-between mb-4 px-1 text-xs sm:text-sm">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : `Skills in ${activeTab}`}
        </span>
        <span
          className={`font-bold ${
            selectedSkills.length > 0
              ? "text-secondary-600 dark:text-secondary-400"
              : "text-amber-500"
          }`}
        >
          {selectedSkills.length} selected (min 1)
        </span>
      </div>

      {/* Skill Chips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filteredSkills.map((skill) => {
          const isSelected = selectedMap.has(skill.id);
          const currentLevel = selectedMap.get(skill.id) || "Intermediate";

          return (
            <div
              key={skill.id}
              onClick={() => toggleSkill(skill)}
              className={`group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer border min-h-[56px] select-none ${
                isSelected
                  ? "bg-secondary-500/15 dark:bg-secondary-500/20 border-secondary-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-secondary-500"
                  : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                    isSelected
                      ? "bg-secondary-500 text-slate-950 border-secondary-500 shadow-xs"
                      : "border-slate-300 dark:border-slate-600 group-hover:border-slate-400"
                  }`}
                >
                  {isSelected && <Check size={14} className="stroke-[3]" />}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-900 dark:text-white truncate">
                    {skill.name}
                  </span>
                  {skill.popular && (
                    <span className="text-[10px] text-primary-600 dark:text-secondary-400 font-medium">
                      High Demand
                    </span>
                  )}
                </div>
              </div>

              {/* Tap-to-cycle Proficiency Level */}
              {isSelected && (
                <button
                  type="button"
                  onClick={(e) => cycleSkillLevel(skill.id, e)}
                  title="Tap to toggle level: Beginner -> Intermediate -> Advanced"
                  className="shrink-0 px-2.5 py-1 rounded-xl bg-secondary-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-xs hover:scale-105 active:scale-95 transition-transform"
                >
                  {currentLevel}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State / Custom Skill Prompt */}
      {filteredSkills.length === 0 && (
        <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 my-4">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            No pre-mapped catalog skills found for "{searchQuery}".
          </p>
          {searchQuery.trim().length > 1 && (
            <button
              type="button"
              onClick={() => handleAddCustomSkill(searchQuery.trim())}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-500 text-white font-bold text-xs sm:text-sm hover:bg-primary-600 transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              <span>Add "{searchQuery.trim()}" as a custom skill</span>
            </button>
          )}
        </div>
      )}

      {/* Custom Add Trigger When Searching */}
      {searchQuery.trim().length > 1 &&
        filteredSkills.length > 0 &&
        !filteredSkills.some(
          (s) => s.name.toLowerCase() === searchQuery.toLowerCase()
        ) && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => handleAddCustomSkill(searchQuery.trim())}
              className="w-full inline-flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-dashed border-secondary-500/70 text-slate-900 dark:text-white font-bold text-xs sm:text-sm hover:bg-secondary-500/10 transition-colors cursor-pointer"
            >
              <Plus size={16} className="text-secondary-500" />
              <span>Add "{searchQuery.trim()}" as a custom skill</span>
            </button>
          </div>
        )}

      {/* Selected Skills Tray */}
      {selectedSkills.length > 0 && (
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Your Selected Skills ({selectedSkills.length})
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-red-500 hover:underline font-medium cursor-pointer"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((s) => {
              const skillName = typeof s === "string" ? s : s.name;
              const skillId = typeof s === "string" ? s : s.id;
              const level = typeof s === "string" ? "Intermediate" : s.level || "Intermediate";

              return (
                <span
                  key={skillId}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold shadow-xs"
                >
                  <span>{skillName}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary-500 text-slate-950 font-black">
                    {level}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(
                        selectedSkills.filter(
                          (item) => (typeof item === "string" ? item : item.id) !== skillId
                        )
                      )
                    }
                    className="text-slate-400 hover:text-red-500 cursor-pointer ml-0.5"
                    aria-label={`Remove ${skillName}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillSelector;
