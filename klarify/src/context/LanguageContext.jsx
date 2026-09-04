import React, { createContext, useContext, useState, useCallback } from "react";
import en from "../locales/en.json";
import fr from "../locales/fr.json";

const dictionaries = { en, fr };

const getSystemLanguage = () => {
  try {
    const saved = localStorage.getItem("klarify_lang");
    if (saved === "en" || saved === "fr") return saved;
    const browser = (
      navigator.language ||
      navigator.userLanguage ||
      "en"
    ).toLowerCase();
    return browser.startsWith("fr") ? "fr" : "en";
  } catch {
    return "en";
  }
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getSystemLanguage);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("klarify_lang", lang);
      document.documentElement.lang = lang;
    } catch {}
  }, []);

  const t = useCallback(
    (keyPath, params = {}) => {
      const keys = keyPath.split(".");
      const dict = dictionaries[language] ?? dictionaries.en;

      const applyParams = (value) => {
        if (typeof value === "string") {
          return value.replace(
            /\{(\w+)\}/g,
            (_, k) => params[k] ?? "{" + k + "}",
          );
        }
        if (Array.isArray(value)) {
          return value.map((item) => applyParams(item));
        }
        if (value && typeof value === "object") {
          return Object.fromEntries(
            Object.entries(value).map(([k, v]) => [k, applyParams(v)]),
          );
        }
        return value;
      };

      let val = dict;
      for (const k of keys) {
        val = val?.[k];
        if (val === undefined) break;
      }
      if (val === undefined) {
        let fallback = dictionaries.en;
        for (const k of keys) {
          fallback = fallback?.[k];
          if (fallback === undefined) break;
        }
        val = fallback ?? keyPath;
      }

      if (typeof val === "string") return applyParams(val);
      if (Array.isArray(val) || (val && typeof val === "object"))
        return applyParams(val);
      return keyPath;
    },
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
