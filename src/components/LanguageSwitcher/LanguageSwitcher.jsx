import React from "react";
import { useTranslation } from "../../i18n";
import "./LanguageSwitcher.css";

const LanguageSwitcher = ({ variant = "nav" }) => {
  const { language, setLanguage, t } = useTranslation();

  return (
    <div
      className={`lang-switcher lang-switcher--${variant}`}
      role="group"
      aria-label={t("common.language")}
    >
      <button
        type="button"
        className={`lang-switcher__btn ${language === "en" ? "is-active" : ""}`}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-switcher__btn ${language === "pa" ? "is-active" : ""}`}
        onClick={() => setLanguage("pa")}
      >
        ਪੰ
      </button>
    </div>
  );
};

export default LanguageSwitcher;
