import React, { useState, useMemo } from "react";
import { Check, Search, X, Sparkles, Plus } from "lucide-react";
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
      onChange([...selectedSkills, { id: skill.id, name: skill.name, level: "Intermediate" }]);
    }
  };

  const handleAddCustomSkill = (customName) => {
    if (!customName.trim()) return;
    const customId = customName.toLowerCase().replace(/[^a-z0-9]/g, "_");
    if (!selectedMap.has(customId)) {
      onChange([...selectedSkills, { id: customId, name: customName.trim(), level: "Intermediate" }]);
    }
    setSearchQuery("");
  };

  const setSkillLevel = (skillId, level, e) => {
    e.stopPropagation();
    const next = selectedSkills.map((s) => {
      const id = typeof s === "string" ? s : s.id;
      if (id === skillId) {
        return typeof s === "string" ? { id: s, level } : { ...s, level };
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
      {/* Search Input */}
      <div className="relative mb-5">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any skill (e.g. Excel, SQL, React, Solar, Figma)..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Domain Category Tabs */}
      {!searchQuery && (
        <div className="flex overflow-x-auto gap-1 mb-5 border-b border-slate-200 dark:border-slate-800 hide-scrollbar pb-1">
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveTab(cat)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === cat
                    ? "bg-primary-500 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
                {count > 0 && (
                  <span
                    className={`flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-black ${
                      activeTab === cat
                        ? "bg-secondary-500 text-slate-950"
                        : "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
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

      {/* Skill Badges Grid */}
      <div className="flex flex-wrap gap-2.5 min-h-[160px] content-start">
        {filteredSkills.map((skill) => {
          const isSelected = selectedMap.has(skill.id);
          const currentLevel = selectedMap.get(skill.id) || "Intermediate";

          return (
            <div
              key={skill.id}
              onClick={() => toggleSkill(skill)}
              className={`group flex flex-col sm:flex-row sm:items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                isSelected
                  ? "bg-primary-500/10 dark:bg-secondary-500/15 border-primary-500 dark:border-secondary-500 text-slate-900 dark:text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-primary-400 dark:hover:border-secondary-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-primary-500 dark:bg-secondary-500 text-white dark:text-slate-950 font-bold"
                      : "border border-slate-300 dark:border-slate-700 group-hover:border-primary-500"
                  }`}
                >
                  {isSelected && <Check size={11} className="stroke-[3]" />}
                </div>
                <span>{skill.name}</span>
                {skill.popular && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-normal">
                    In-demand
                  </span>
                )}
              </div>

              {/* Proficiency Level Toggle (Visible when selected) */}
              {isSelected && (
                <div className="flex items-center gap-1 sm:ml-2 pt-1 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 sm:pl-2">
                  {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={(e) => setSkillLevel(skill.id, lvl, e)}
                      className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                        currentLevel === lvl
                          ? "bg-primary-500 text-white dark:bg-secondary-500 dark:text-slate-950 font-bold"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      {lvl.charAt(0)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredSkills.length === 0 && (
          <div className="w-full py-6 text-center text-slate-400 text-sm">
            No standard catalog skills found for "{searchQuery}".
          </div>
        )}

        {searchQuery.trim().length > 1 && !filteredSkills.some((s) => s.name.toLowerCase() === searchQuery.toLowerCase()) && (
          <div className="w-full pt-1">
            <button
              type="button"
              onClick={() => handleAddCustomSkill(searchQuery.trim())}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-primary-500 text-primary-600 dark:text-secondary-400 font-bold text-xs hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Add "{searchQuery.trim()}" to my skills</span>
            </button>
          </div>
        )}
      </div>

      {/* Selected Counter & Clear Action */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>
          Selected:{" "}
          <strong className="text-slate-900 dark:text-white font-bold">
            {selectedSkills.length} skill{selectedSkills.length !== 1 ? "s" : ""}
          </strong>
        </span>
        {selectedSkills.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-red-500 hover:underline cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
};

export default SkillSelector;
