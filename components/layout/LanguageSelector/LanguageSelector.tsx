"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation, availableLocales } from "@/lib/i18n";

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLocale = availableLocales.find((l) => l.code === locale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-nordic-dark hover:text-mosque transition-colors"
        aria-label="Select language"
      >
        <span className="material-icons">language</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-nordic-dark/10 z-50">
          {availableLocales.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm font-medium ${
                locale === l.code
                  ? "text-mosque bg-mosque/5"
                  : "text-nordic-dark hover:bg-clear-day"
              } transition-colors ${
                l.code === availableLocales[0].code ? "rounded-t-lg" : ""
              } ${
                l.code === availableLocales[availableLocales.length - 1].code ? "rounded-b-lg" : ""
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}