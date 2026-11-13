import React from "react";
import { Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const TVEE_TRADE_KEYS = [
  "civil_engineering",
  "electrical_power_systems",
  "electronics",
  "mechanical_manufacturing",
  "automobile_mechanics",
  "accounting_management",
  "marketing",
  "secretarial_administration",
  "home_economics",
  "clothing_industry",
  "woodwork_carpentry",
  "welding_fabrication",
  "surveying_topography",
  "computer_science_telecom",
];

const TradeSelector = ({
  selected = [],
  onChange,
  maxTrades = 2,
}) => {
  const { t } = useLanguage();

  const toggleTrade = (tradeKey) => {
    if (selected.includes(tradeKey)) {
      onChange(selected.filter((item) => item !== tradeKey));
    } else {
      if (selected.length >= maxTrades) {
        onChange([tradeKey]);
      } else {
        onChange([...selected, tradeKey]);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {TVEE_TRADE_KEYS.map((tradeKey) => {
          const isSelected = selected.includes(tradeKey);
          return (
            <button
              key={tradeKey}
              onClick={() => toggleTrade(tradeKey)}
              className={`
                flex items-center gap-3 px-4 py-3.5 md:py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left cursor-pointer
                ${
                  isSelected
                    ? "bg-secondary-500 text-slate-950 font-black border-2 border-secondary-500 shadow-md shadow-secondary-500/25 transform scale-[1.01]"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-secondary-400 dark:hover:border-secondary-500 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }
              `}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-colors ${isSelected ? 'bg-slate-950 text-secondary-500 border-slate-950' : 'border-slate-300 dark:border-slate-600'}`}>
                {isSelected && <Check size={12} className="stroke-[3]" />}
              </div>
              <span>{t(`trades.${tradeKey}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TradeSelector;
