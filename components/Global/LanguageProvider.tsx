"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext({
  language: "EN",
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("EN");

  // Charger le thème sauvegardé
  useEffect(() => {
    const saved = localStorage.getItem("language");
    if (saved) setLanguage(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  function toggleLanguage() {
    setLanguage((prev) => (prev === "JP" ? "EN" : "JP"));
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
