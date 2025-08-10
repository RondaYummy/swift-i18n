const LANG_KEY = 'swift_i18n_lang';

export function detectLanguage(supported: string[], fallback = 'en'): string {
   const storedLang = localStorage.getItem(LANG_KEY);
   if (storedLang && supported.includes(storedLang)) {
      return storedLang;
   }

   const browserLang = navigator.language.split('-')[0];
   if (supported.includes(browserLang)) {
      return browserLang;
   }

   return fallback;
}

export function setLanguage(lang: string) {
   localStorage.setItem(LANG_KEY, lang);
   document.documentElement.lang = lang;
}

export function getLanguage(): string {
   return localStorage.getItem(LANG_KEY) || 'en';
}

export function resolveInitialLang(defaultLang = 'en'): string {
   try {
      const storedLang = localStorage.getItem(LANG_KEY);
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
   try {
      localStorage.setItem(LANG_KEY, lang);
      document.documentElement.lang = lang;
   } catch {
   }
}
