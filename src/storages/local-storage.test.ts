import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { lsSetLang, lsGetLanguage } from './local-storage';
import { LANG_KEY } from '../constants';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('LocalStorage Utility Functions', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('lsSetLang', () => {
    it('should set the language key with the provided value', () => {
      const lang = 'en';
      lsSetLang(lang);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(LANG_KEY, lang);
    });

    it('should handle different language codes', () => {
      const lang = 'uk';
      lsSetLang(lang);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(LANG_KEY, lang);
    });

    it('should silently fail on error', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Test Error');
      });
      expect(() => lsSetLang('fr')).not.toThrow();
    });
  });

  describe('lsGetLanguage', () => {
    it('should retrieve the language from localStorage', () => {
      localStorageMock.setItem(LANG_KEY, 'es');
      const lang = lsGetLanguage();
      expect(lang).toBe('es');
    });

    it('should return null if the language key does not exist', () => {
      const lang = lsGetLanguage();
      expect(lang).toBeNull();
    });

    it('should return null on any error', () => {
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error('Test Error');
      });
      const lang = lsGetLanguage();
      expect(lang).toBeNull();
    });
  });
});