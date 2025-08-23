import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createSwiftI18n, createVueI18n, I18N_SYMBOL, useI18n } from './vue-plugin';
import type { SwiftI18n } from '../i18n';
import {
  inject,
} from 'vue';

vi.mock('vue', async (importOriginal) => {
  const mod = await importOriginal<typeof import('vue')>();
  return {
    ...mod,
    reactive: vi.fn((state) => state),
    readonly: vi.fn((state) => state),
    inject: vi.fn(),
    computed: vi.fn((fn) => ({
      get value() {
        return fn();
      },
    })),
  };
});

const mockI18n = {
  lang: 'en',
  allBundles: {},
  on: vi.fn(),
  t: vi.fn(),
  plural: vi.fn(),
  changeLanguage: vi.fn(),
} as unknown as SwiftI18n;

describe('createVueI18n', () => {
  let mockApp: any;

  beforeEach(() => {
    mockApp = {
      provide: vi.fn(),
      config: {
        globalProperties: {},
      },
    };
    vi.clearAllMocks();
  });

  it('should return a plugin object with an install method', () => {
    const plugin = createVueI18n(mockI18n);
    expect(plugin).toBeDefined();
    expect(plugin.install).toBeInstanceOf(Function);
  });

  it('should install global properties on the Vue app', () => {
    const plugin = createVueI18n(mockI18n);
    plugin.install(mockApp);
    expect(mockApp.config.globalProperties.$t).toBeDefined();
    expect(mockApp.config.globalProperties.$plural).toBeDefined();
    expect(mockApp.config.globalProperties.$changeLanguage).toBeDefined();
  });

  it('should provide the i18n instance and reactive state', () => {
    const plugin = createVueI18n(mockI18n);
    plugin.install(mockApp);
    expect(mockApp.provide).toHaveBeenCalledWith(I18N_SYMBOL, {
      i18n: mockI18n,
      state: { lang: 'en', bundles: {} },
    });
  });

  it('should react to language changes', () => {
    createVueI18n(mockI18n);
    const mockCallback = vi.mocked(mockI18n.on).mock.calls[0][1] as (
      lang: string
    ) => void;
    mockCallback('uk');
    expect(mockI18n.on).toHaveBeenCalledWith('languageChanged', expect.any(Function));
    expect(mockI18n.lang).toBe('en');
  });
});

describe('useI18n', () => {
  const mockContext = {
    i18n: mockI18n,
    state: { lang: 'en', bundles: {} },
  };

  it('should return the i18n methods and lang when injected', () => {
    vi.mocked(inject).mockReturnValue(mockContext);
    
    const { lang, t, plural, changeLanguage } = useI18n();
    expect(lang.value).toBe('en');
    expect(t).toBeDefined();
    expect(plural).toBeDefined();
    expect(changeLanguage).toBeDefined();
  });

  it('should throw an error if not used within a Vue app with createVueI18n', () => {
    vi.mocked(inject).mockReturnValue(null);
    
    expect(() => useI18n()).toThrow(
      'useI18n must be used within Vue app with createVueI18n'
    );
  });

  it('createSwiftI18n returns a plugin with installed i18n', async () => {
    const loader = vi.fn(async (lang: string) => {
      if (lang === 'en') return { hello: 'Hello' };
      return { hello: '' };
    });
  
    const plugin = await createSwiftI18n({ loader, defaultLang: 'en' });
    expect(plugin.install).toBeInstanceOf(Function);
  });
});