import { LANG_KEY } from '../constants';

export function lsSetLang(lang: string) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch(error) {
    console.error(error);
  }
}

export function lsGetLanguage(): string | null {
  try {
    return localStorage.getItem(LANG_KEY);
  } catch {
    return null;
  }
}
