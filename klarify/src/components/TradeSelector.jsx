import React from "react";
import { Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const TRADES = [
  "building_construction",
  "design_and_architecture",
  "survey",
  "electrical_installation",
  "electrical_and_electronics",
  "pharmacology",
  "clothing_industry",
  "home_economics",
  "plumbing_and_hydraulic",
  "accounting_and_secretaryship",
  "wood_work",
  "automobile_vehicles",
  "mechanical_design",
  "sheet_metal_works",
];

const TradeSelector = ({ selected, onChange }) => {
  const { t } = useLanguage();

  const toggleTrade = (trade) => {
    if (selected.includes(trade)) {
      onChange([]);
    } else {
      onChange([trade]); 
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 min-h-40">
        {TRADES.map((tradeKey) => {
          const isSelected = selected.includes(tradeKey);
          return (
            <button
              key={tradeKey}
              onClick={() => toggleTrade(tradeKey)}
              className={`
                flex items-center gap-3 px-4 py-3.5 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left
                ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-md transform scale-[1.01]"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-950"
                }
              `}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${isSelected ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                {isSelected && <Check size={12} />}
              </div>
              {t(`trades.${tradeKey}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TradeSelector;
