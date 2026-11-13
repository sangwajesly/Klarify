import React, { useState, useEffect } from "react";
import { Check, Sparkles } from "lucide-react";

const SUBJECT_CATEGORIES = {
  Science: [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "ICT",
    "Geology",
  ],
  Arts: [
    "Economics",
    "Literature in English",
    "French",
    "History",
    "Geography",
    "Philosophy",
    "Religious Studies",
  ],
  Commercial: ["Economics", "Accounting", "Business Management", "Commerce"],
};

const SubjectSelector = ({
  selected = [],
  onChange,
  maxSubjects = 5,
  minSubjects = 2,
  track = "grammar",
}) => {
  const allowedCategories =
    track === "commercial" ? ["Commercial"] : ["Science", "Arts"];

  const [activeTab, setActiveTab] = useState(allowedCategories[0]);

  useEffect(() => {
    setActiveTab(allowedCategories[0]);
  }, [track]);

  const toggleSubject = (subject) => {
    if (selected.includes(subject)) {
      onChange(selected.filter((s) => s !== subject));
    } else {
      if (selected.length >= maxSubjects) return;
      onChange([...selected, subject]);
    }
  };

  const getCategoryCount = (category) => {
    return (SUBJECT_CATEGORIES[category] || []).filter((subject) =>
      selected.includes(subject)
    ).length;
  };

  return (
    <div className="w-full">
      {/* Category Tabs */}
      {allowedCategories.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 hide-scrollbar">
          {allowedCategories.map((category) => {
            const count = getCategoryCount(category);
            const isActive = activeTab === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveTab(category)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/20"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{category} Series</span>
                {count > 0 && (
                  <span
                    className={`flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-black ${
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

      {/* Helper Guidance Banner */}
      <div className="flex items-center justify-between mb-4 px-1 text-xs sm:text-sm">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          Select between{" "}
          <strong className="text-slate-900 dark:text-white font-bold">
            {minSubjects}
          </strong>{" "}
          and{" "}
          <strong className="text-slate-900 dark:text-white font-bold">
            {maxSubjects}
          </strong>{" "}
          subjects you studied:
        </span>
        <span
          className={`font-bold ${
            selected.length >= minSubjects
              ? "text-secondary-600 dark:text-secondary-400"
              : "text-amber-500"
          }`}
        >
          {selected.length} / {maxSubjects} selected
        </span>
      </div>

      {/* Subject Chips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SUBJECT_CATEGORIES[activeTab]?.map((subject) => {
          const isSelected = selected.includes(subject);
          return (
            <button
              key={subject}
              type="button"
              onClick={() => toggleSubject(subject)}
              className={`
                flex items-center justify-between gap-3 p-4 sm:p-4.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer text-left border min-h-[56px]
                ${
                  isSelected
                    ? "bg-secondary-500/15 dark:bg-secondary-500/20 border-secondary-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-secondary-500"
                    : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }
              `}
            >
              <span className="font-bold">{subject}</span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                  isSelected
                    ? "bg-secondary-500 text-slate-950 border-secondary-500 shadow-xs"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {isSelected && <Check size={14} className="stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Subjects Tray */}
      {selected.length > 0 && (
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Selected A-Level Subjects
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
            {selected.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary-500 text-slate-950 text-xs font-bold shadow-xs"
              >
                {item}
                <button
                  type="button"
                  onClick={() => toggleSubject(item)}
                  className="hover:opacity-75 cursor-pointer ml-0.5"
                  aria-label={`Remove ${item}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectSelector;
