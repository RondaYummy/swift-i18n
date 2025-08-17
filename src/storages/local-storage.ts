import { LANG_KEY, LS_PREFIX } from '../constants';

export function lsSet(key: string, value: unknown) {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    // ignore errors
  }
}

export function lsGet<T = any>(key: string): T | null {
  try {
    const v = localStorage.getItem(LS_PREFIX + key);
    if (!v) return null;
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}

export function lsRemove(key: string) {
  try {
    localStorage.removeItem(LS_PREFIX + key);
  } catch {
    // ignore errors
  }
}

export function lsSetLang(lang: string) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore errors
  }
}

export function lsGetLanguage(): string | null {
  try {
    return localStorage.getItem(LANG_KEY);
  } catch {
    return null;
  }
}
