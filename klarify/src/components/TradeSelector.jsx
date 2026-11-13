import React from "react";
import { Check, Wrench } from "lucide-react";
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
      <div className="flex items-center justify-between mb-4 px-1 text-xs sm:text-sm">
        <span className="text-slate-500 dark:text-slate-400 font-medium">
          Choose your primary TVEE specialty (up to {maxTrades}):
        </span>
        <span
          className={`font-bold ${
            selected.length > 0
              ? "text-secondary-600 dark:text-secondary-400"
              : "text-amber-500"
          }`}
        >
          {selected.length} / {maxTrades} selected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TVEE_TRADE_KEYS.map((tradeKey) => {
          const isSelected = selected.includes(tradeKey);
          return (
            <button
              key={tradeKey}
              type="button"
              onClick={() => toggleTrade(tradeKey)}
              className={`
                flex items-center justify-between gap-3 p-4 rounded-2xl text-sm font-semibold transition-all duration-200 text-left cursor-pointer border min-h-[60px]
                ${
                  isSelected
                    ? "bg-secondary-500/15 dark:bg-secondary-500/20 border-secondary-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-secondary-500"
                    : "bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }
              `}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? "bg-secondary-500 text-slate-950 font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  <Wrench size={16} />
                </div>
                <span className="font-bold text-sm leading-snug">
                  {t(`trades.${tradeKey}`)}
                </span>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border shrink-0 transition-all ${
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
    </div>
  );
};

export default TradeSelector;
