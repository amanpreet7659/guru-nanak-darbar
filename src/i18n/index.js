import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import en from "./locales/en";
import pa from "./locales/pa";

const LANG_KEY = "gnd_language";

const dictionaries = {
  en,
  pa,
};

const LanguageContext = createContext({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  languages: [],
});

const getNested = (obj, path) => {
  return path.split(".").reduce((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return acc[part];
    }
    return undefined;
  }, obj);
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "en" || saved === "pa") return saved;
    } catch {
      // ignore
    }
    return "en";
  });

  useEffect(() => {
    document.documentElement.lang = language === "pa" ? "pa" : "en";
    try {
      localStorage.setItem(LANG_KEY, language);
    } catch {
      // ignore
    }
  }, [language]);

  const setLanguage = useCallback((next) => {
    if (next === "en" || next === "pa") {
      setLanguageState(next);
    }
  }, []);

  const t = useCallback(
    (key, fallback) => {
      const value =
        getNested(dictionaries[language], key) ??
        getNested(dictionaries.en, key);
      return value ?? fallback ?? key;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: [
        { code: "en", labelKey: "common.english" },
        { code: "pa", labelKey: "common.punjabi" },
      ],
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export const useTranslation = () => {
  const { t, language, setLanguage, languages } = useLanguage();
  return { t, language, setLanguage, languages };
};

export default LanguageContext;
