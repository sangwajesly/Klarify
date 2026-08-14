import React, { useState } from "react";
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
  Technical: [
    "Engineering Science",
    "Electrical Power Systems",
    "Woodwork",
    "Technical Drawing",
    "Food Science",
  ],
};

const SubjectSelector = ({ selected, onChange }) => {
  const [activeTab, setActiveTab] = useState("Science");

  const toggleSubject = (subject) => {
    if (selected.includes(subject)) {
      onChange(selected.filter((s) => s !== subject));
    } else {
      onChange([...selected, subject]);
    }
  };

  const getCategoryCount = (category) => {
    return SUBJECT_CATEGORIES[category].filter((subject) =>
      selected.includes(subject),
    ).length;
  };

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto gap-1 mb-6 border-b border-slate-200 hide-scrollbar">
        {Object.keys(SUBJECT_CATEGORIES).map((category) => {
          const count = getCategoryCount(category);
          return (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                activeTab === category
                  ? "border-orange-500 text-orange-600 bg-orange-50/50"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {category}
              {count > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white text-[10px]">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 md:gap-3 min-h-40 content-start">
        {SUBJECT_CATEGORIES[activeTab].map((subject) => {
          const isSelected = selected.includes(subject);
          return (
            <button
              key={subject}
              onClick={() => toggleSubject(subject)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-md transform scale-[1.02]"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }
              `}
            >
              {isSelected && <Check size={14} className="shrink-0" />}
              {subject}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelector;
