"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalStore } from "@/store/useGlobalStore";
import "@/lib/i18n/config";

interface TranslationContextType {
  t: (key: string, options?: any) => string;
  language: string;
  changeLanguage: (lng: string) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const { language } = useGlobalStore();

  useEffect(() => {
    if (language.code && i18n.language !== language.code) {
      i18n.changeLanguage(language.code);
    }
  }, [language.code, i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <TranslationContext.Provider value={{ t, language: i18n.language, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslationContext must be used within a TranslationProvider");
  }
  return context;
}
