import React from 'react';
import { Check } from 'lucide-react';

const INTERESTS = [
  'Engineering & Technology',
  'Medicine & Healthcare',
  'Business & Finance',
  'Arts & Humanities',
  'Law & Public Policy',
  'Sciences & Research',
  'Agriculture & Environment',
  'Education & Teaching',
  'Media & Communication',
  'Computer Science & IT',
  'Architecture & Design'
];

const InterestSelector = ({ selected, onChange }) => {
  const toggleInterest = (interest) => {
    if (selected.includes(interest)) {
      onChange(selected.filter(i => i !== interest));
    } else {
      onChange([...selected, interest]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {INTERESTS.map(interest => {
        const isSelected = selected.includes(interest);
        return (
          <button
            key={interest}
            onClick={() => toggleInterest(interest)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isSelected 
                ? 'bg-orange-500 text-white shadow-md transform scale-[1.02]' 
                : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-300 hover:bg-orange-50'}
            `}
          >
            {isSelected && <Check size={16} />}
            {interest}
          </button>
        );
      })}
    </div>
  );
};

export default InterestSelector;
