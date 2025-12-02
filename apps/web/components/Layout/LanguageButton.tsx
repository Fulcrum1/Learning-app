"use client";

import { useLanguage } from "../Global/LanguageProvider";
import { Button } from "../ui/button";

export default function LanguageButton() {
  const { toggleLanguage, language } = useLanguage();

  return (
    <Button onClick={toggleLanguage} className="p-0 w-10 h-10 overflow-hidden">
      {language && (
        <img
          alt={language === "JP" ? "Japanese" : "English"}
          src={`https://purecatamphetamine.github.io/country-flag-icons/1x1/${language}.svg`}
          className="w-full h-full object-cover"
        />
      )}
    </Button>
  );
}
