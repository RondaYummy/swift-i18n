import { vi, describe, it, expect, beforeEach } from 'vitest';
import { detectLanguage, resolveInitialLang, persistLang } from './language';
import { LANG_KEY } from './constants';
import { getCookie, setCookie } from './storages/cookie';
import { lsGetLanguage, lsSetLang } from './storages/local-storage';

vi.mock('./storages/cookie', () => ({
  getCookie: vi.fn(),
  setCookie: vi.fn(),
}));

vi.mock('./storages/local-storage', () => ({
  lsGetLanguage: vi.fn(),
  lsSetLang: vi.fn(),
}));

describe('detectLanguage', () => {
  const supportedLangs = ['en', 'uk', 'de'];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the language from the cookie if it exists', () => {
    vi.mocked(getCookie).mockReturnValue('de');
    const result = detectLanguage(supportedLangs);
    expect(result).toBe('de');
    expect(getCookie).toHaveBeenCalledWith(LANG_KEY);
  });

  it('should return the language from local storage if it exists and is supported', () => {
    vi.mocked(getCookie).mockReturnValue(null);
    vi.mocked(lsGetLanguage).mockReturnValue('uk');
    const result = detectLanguage(supportedLangs);
    expect(result).toBe('uk');
    expect(lsGetLanguage).toHaveBeenCalled();
  });

  it('should return the browser language if it is supported and no cookie or local storage language is found', () => {
    vi.mocked(getCookie).mockReturnValue(null);
    vi.mocked(lsGetLanguage).mockReturnValue(null);
    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
    const result = detectLanguage(supportedLangs);
    expect(result).toBe('en');
  });

  it('should return the fallback language if no other language is detected', () => {
    vi.mocked(getCookie).mockReturnValue(null);
    vi.mocked(lsGetLanguage).mockReturnValue(null);
    Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true });
    const result = detectLanguage(supportedLangs, 'en');
    expect(result).toBe('en');
  });

  it('should return the default fallback language if none is provided and no other language is detected', () => {
    vi.mocked(getCookie).mockReturnValue(null);
    vi.mocked(lsGetLanguage).mockReturnValue(null);
    Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true });
    const result = detectLanguage(supportedLangs);
    expect(result).toBe('en');
  });
});

describe('resolveInitialLang', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the language from local storage if it exists', () => {
    vi.mocked(lsGetLanguage).mockReturnValue('uk');
    const result = resolveInitialLang('en');
    expect(result).toBe('uk');
  });

  it('should return the browser language if no local storage language is found', () => {
    vi.mocked(lsGetLanguage).mockReturnValue(null);
    Object.defineProperty(navigator, 'language', { value: 'de-DE', configurable: true });
    const result = resolveInitialLang('en');
    expect(result).toBe('de');
  });

  it('should return the default language if no local storage or browser language is found', () => {
    vi.mocked(lsGetLanguage).mockReturnValue(null);
    Object.defineProperty(navigator, 'language', { value: undefined, configurable: true });
    const result = resolveInitialLang('en');
    expect(result).toBe('en');
  });

  it('should return the default language if an error occurs while accessing navigator.language', () => {
    vi.mocked(lsGetLanguage).mockReturnValue(null);
    Object.defineProperty(navigator, 'language', {
      get: () => {
        throw new Error('Some error');
      },
    });
    const result = resolveInitialLang('en');
    expect(result).toBe('en');
  });
});

describe('persistLang', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    document.documentElement.lang = '';
  });

  it('should persist the language correctly to local storage, cookie, and the document element', () => {
    const lang = 'uk';
    persistLang(lang);
    expect(lsSetLang).toHaveBeenCalledWith(lang);
    expect(setCookie).toHaveBeenCalledWith(LANG_KEY, lang, 30);
    expect(document.documentElement.lang).toBe(lang);
  });
});