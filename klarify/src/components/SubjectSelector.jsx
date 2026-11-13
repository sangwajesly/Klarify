import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";

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
      selected.includes(subject),
    ).length;
  };

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto gap-1 mb-6 border-b border-slate-200 dark:border-slate-800 hide-scrollbar">
        {allowedCategories.map((category) => {
          const count = getCategoryCount(category);
          return (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                activeTab === category
                  ? "border-secondary-500 text-slate-900 dark:text-white bg-secondary-50/70 dark:bg-secondary-950/40"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40"
              }`}
            >
              {category}
              {count > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary-500 text-slate-950 text-[10px] font-black shadow-xs">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3 min-h-40 content-start">
        {SUBJECT_CATEGORIES[activeTab]?.map((subject) => {
          const isSelected = selected.includes(subject);
          return (
            <button
              key={subject}
              onClick={() => toggleSubject(subject)}
              className={`
                flex items-center gap-2 px-4 py-3 md:py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "bg-secondary-500 text-slate-950 font-black border-2 border-secondary-500 shadow-md shadow-secondary-500/25 transform scale-[1.02]"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-secondary-400 dark:hover:border-secondary-500 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }
              `}
            >
              {isSelected && <Check size={14} className="shrink-0 text-slate-950 stroke-[3]" />}
              {subject}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelector;
