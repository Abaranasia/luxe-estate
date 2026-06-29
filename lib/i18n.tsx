"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { setCookie, getCookie } from "./cookies";

export type Locale = "en" | "es" | "fr";

const translations: Record<Locale, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import("../lang/en.json"),
  es: () => import("../lang/es.json"),
  fr: () => import("../lang/fr.json"),
};

type TranslationKey = string;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LanguageProvider({ children, initialLocale = "en" }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadMessages = async () => {
      const mod = await translations[locale]();
      if (isMounted) {
        setMessages(mod.default);
        setIsLoading(false);
      }
    };
    loadMessages();
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie("NEXT_LOCALE", newLocale, 365);
  };

  const t = (key: TranslationKey): string => {
    if (isLoading) return key;
    const keys = key.split(".");
    let value: unknown = messages;

    for (const k of keys) {
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return context;
}

export function getLanguageFromCookie(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }
  const cookieLocale = getCookie("NEXT_LOCALE");
  if (cookieLocale === "es" || cookieLocale === "fr") {
    return cookieLocale;
  }
  return "en";
}

export const availableLocales: { code: Locale; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
];