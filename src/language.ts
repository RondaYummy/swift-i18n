import { LANG_KEY } from './constants';
import { getCookie, setCookie } from './storages/cookie';
import { lsGetLanguage, lsSetLang } from './storages/local-storage';

export function detectLanguage(supported: string[], fallback = 'en'): string {
  // Cookie
  const cookieLang = getCookie(LANG_KEY);
  if (cookieLang) return cookieLang;

  // Local Storage
  const storedLang = lsGetLanguage();
  if (storedLang && supported.includes(storedLang)) {
    return storedLang;
  }

  // Browser
  const browserLang = navigator.language.split('-')[0];
  if (supported.includes(browserLang)) {
    return browserLang;
  }

  return fallback;
}

export function resolveInitialLang(defaultLang: string): string {
  try {
    const storedLang = lsGetLanguage();
    if (storedLang) {
      return storedLang;
    }

    const browserLang = navigator.language.split('-')[0];
    return browserLang || defaultLang;
  } catch {
    return defaultLang;
  }
}

export function persistLang(lang: string) {
  lsSetLang(lang);
  setCookie(LANG_KEY, lang, 30);
  document.documentElement.lang = lang;
}
