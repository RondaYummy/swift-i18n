import React, { createContext, useContext, useEffect, useState } from "react";
import type { SwiftI18n } from "../i18n";

interface I18nContextValue {
  i18n: SwiftI18n;
  lang: string;
  bundles: any;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function createReactI18n(i18n: SwiftI18n) {
  return function I18nProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState(i18n.lang);
    const [bundles, setBundles] = useState(i18n.allBundles);

    useEffect(() => {
      const handler = (newLang: string) => {
        setLang(newLang);
        setBundles(i18n.allBundles);
      };

      i18n.on("languageChanged", handler);

      return () => {
        i18n.removeListener("languageChanged", handler);
      };
    }, []);

    return (
      <I18nContext.Provider value={{ i18n, lang, bundles }}>
        {children}
      </I18nContext.Provider>
    );
  };
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
