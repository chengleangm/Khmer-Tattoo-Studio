"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

export type Lang = "en" | "km";

const LanguageContext = createContext<{ lang: Lang; toggle: () => void }>({
  lang: "en",
  toggle: () => {},
});

const listeners = new Set<() => void>();

function getStoredLang(): Lang {
  if (typeof window === "undefined") return "en";
  return localStorage.getItem("lang") === "km" ? "km" : "en";
}

function getServerLang(): Lang {
  return "en";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function setStoredLang(lang: Lang) {
  localStorage.setItem("lang", lang);
  listeners.forEach((listener) => listener());
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getStoredLang, getServerLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => setStoredLang(lang === "en" ? "km" : "en");

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
