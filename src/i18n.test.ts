import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SwiftI18n } from './i18n';
import * as language from './language';

vi.mock('./language', () => ({
  resolveInitialLang: vi.fn(),
  persistLang: vi.fn(),
  detectLanguage: vi.fn(),
}));

const mockDefaultLang = 'en';
const mockSupportedLangs = ['en', 'uk'];
const mockLoader = vi.fn((lang: string) => Promise.resolve({
  greeting: 'Hello',
  nested: {
    message: 'Nested message',
  },
  'greeting-with-var': 'Hello, {name}!',
  'cats_one': 'one cat',
  'cats_other': '{count} cats',
  'dogs': 'no dogs',
}));

describe('SwiftI18n', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(language.resolveInitialLang).mockReturnValue(mockDefaultLang);
    vi.mocked(language.detectLanguage).mockReturnValue(mockDefaultLang);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should initialize with default options and resolve initial language', () => {
    const i18n = new SwiftI18n({ defaultLang: mockDefaultLang, loader: mockLoader });
    expect(i18n.lang).toBe(mockDefaultLang);
    expect(language.resolveInitialLang).toHaveBeenCalledWith(mockDefaultLang);
    expect(i18n.locales.length).toBe(0);
  });

  it('should initialize with supported languages and detect language', () => {
    vi.mocked(language.detectLanguage).mockReturnValue('uk');
    const i18n = new SwiftI18n({
      defaultLang: mockDefaultLang,
      supportedLangs: mockSupportedLangs,
      loader: mockLoader,
    });
    expect(i18n.lang).toBe('uk');
    expect(language.detectLanguage).toHaveBeenCalledWith(
      mockSupportedLangs,
      mockDefaultLang,
    );
    expect(i18n.locales).toEqual(mockSupportedLangs);
  });

  it('should throw an error if no loader is provided', () => {
    expect(() => new SwiftI18n({ defaultLang: 'en' } as any)).toThrow(
      'No loader provided for SwiftI18n',
    );
  });

  describe('load method', () => {
    it('should load a bundle from the loader and update bundles', async () => {
      const i18n = new SwiftI18n({ defaultLang: mockDefaultLang, loader: mockLoader });
      await i18n.load('uk');
      expect(mockLoader).toHaveBeenCalledWith('uk');
      expect(i18n.allBundles.uk).toBeDefined();
    });

    it('should emit languageChanged event after loading', async () => {
      const i18n = new SwiftI18n({ defaultLang: mockDefaultLang, loader: mockLoader });
      const emitSpy = vi.spyOn(i18n, 'emit');
      await i18n.load('uk');
      expect(emitSpy).toHaveBeenCalledWith('languageChanged', 'uk');
    });
  });

  describe('changeLanguage method', () => {
    let i18n: SwiftI18n;
    beforeEach(() => {
      vi.clearAllMocks();
      i18n = new SwiftI18n({
        defaultLang: mockDefaultLang,
        supportedLangs: mockSupportedLangs,
        loader: mockLoader,
      });
    });

    it('should not change language if new language is the same as current', async () => {
      const loadSpy = vi.spyOn(i18n, 'load');
      await i18n.changeLanguage(mockDefaultLang);
      expect(loadSpy).not.toHaveBeenCalled();
    });

    it('should warn and not change language if not supported', async () => {
      const warnSpy = vi.spyOn(console, 'warn');
      const loadSpy = vi.spyOn(i18n, 'load');
      await i18n.changeLanguage('de');
      expect(warnSpy).toHaveBeenCalled();
      expect(loadSpy).not.toHaveBeenCalled();
    });

    it('should change language if supported', async () => {
      const loadSpy = vi.spyOn(i18n, 'load');
      await i18n.changeLanguage('uk');
      expect(loadSpy).toHaveBeenCalledWith('uk');
    });
  });

  describe('t method - initial state', () => {
    it('should return the key if bundle is not yet loaded', () => {
        const i18n = new SwiftI18n({ defaultLang: mockDefaultLang, loader: mockLoader });
        expect(i18n.t('greeting')).toBe('greeting');
    });
});

  describe('t method', () => {
    const i18n = new SwiftI18n({ defaultLang: mockDefaultLang, loader: mockLoader });
    i18n.allBundles[i18n.lang] = {
      greeting: 'Hello',
      'greeting-with-var': 'Hello, {name}!',
      nested: {
        message: 'Nested message',
      },
    };

    it('should return a simple translation', () => {
      const translated = i18n.t('greeting');
      expect(translated).toBe('Hello');
    });

    it('should return a nested translation', () => {
      const translated = i18n.t('nested.message');
      expect(translated).toBe('Nested message');
    });

    it('should replace variables in a translation', () => {
      const translated = i18n.t('greeting-with-var', { name: 'World' });
      expect(translated).toBe('Hello, World!');
    });

    it('should return the key if translation is not a string', () => {
      const translated = i18n.t('nested');
      expect(translated).toBe('nested');
    });

    it('should return the key if it does not exist', () => {
      const translated = i18n.t('non-existent-key');
      expect(translated).toBe('non-existent-key');
    });
  });

  describe('plural method', () => {
    const i18n = new SwiftI18n({ defaultLang: mockDefaultLang, loader: mockLoader });
    i18n.allBundles[i18n.lang] = {
      'cats_one': 'one cat',
      'cats_other': '{count} cats',
      'dogs': 'no dogs',
    };

    it('should return correct plural form for one', () => {
      const result = i18n.plural('cats', 1, { count: 1 });
      expect(result).toBe('one cat');
    });

    it('should return correct plural form for other', () => {
      const result = i18n.plural('cats', 5, { count: 5 });
      expect(result).toBe('5 cats');
    });

    it('should fallback to base key if plural form does not exist', () => {
      const i18nWithDogs = new SwiftI18n({ defaultLang: mockDefaultLang, loader: mockLoader });
      i18nWithDogs.allBundles[i18nWithDogs.lang] = {
          'dogs': 'no dogs',
      };
      const result = i18nWithDogs.plural('dogs', 2);
      expect(result).toBe('no dogs');
    });
  });

  describe('getters and helper methods', () => {
    let i18n: SwiftI18n;
    beforeEach(() => {
      i18n = new SwiftI18n({ defaultLang: mockDefaultLang, loader: mockLoader, supportedLangs: mockSupportedLangs });
    });

    it('should return the current language', () => {
      expect(i18n.lang).toBe(i18n['currentLang']);
    });

    it('should return supported locales', () => {
      expect(i18n.locales).toEqual(mockSupportedLangs);
    });

    it('should return all bundles', () => {
      expect(i18n.allBundles).toEqual(i18n['bundles']);
    });

    it('should return available locales', async () => {
      const i18nInstance = new SwiftI18n({ defaultLang: 'en', loader: mockLoader });
      await i18nInstance.load('en');
      await i18nInstance.load('uk');
      expect(i18nInstance.availableLocales()).toEqual(['en', 'uk']);
    });
  });
});