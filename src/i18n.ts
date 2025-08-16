import { EventEmitter } from 'events';
import { resolveInitialLang, persistLang, detectLanguage } from './language';
import { lsGet, lsSet } from './storage';
import { BundlesMap, LocaleBundle, TranslationKey } from './types';
import { CACHE_KEY_PREFIX, CACHE_TTL_MS } from './constants';

export class SwiftI18n extends EventEmitter {
  private bundles: BundlesMap = {};
  private currentLang: string;
  private supportedLangs: string[] = [];
  private loader: (lang: string) => Promise<LocaleBundle>;
  private cacheTtlMs: number;

  constructor(options?: {
    defaultLang: string;
    supportedLangs?: string[];
    loader?: (lang: string) => Promise<LocaleBundle>;
    cacheTtlMs?: number;
  }) {
    super();
    if (!options?.loader) {
      console.warn('SwiftI18n requires a loader function to fetch locale bundles.');
      throw new Error('No loader provided for SwiftI18n');
    }
    this.loader = options?.loader;
    this.cacheTtlMs = options.cacheTtlMs ?? CACHE_TTL_MS;

    if (options.supportedLangs?.length) {
      this.supportedLangs = options.supportedLangs;
      this.currentLang = detectLanguage(this.supportedLangs, options.defaultLang);
    } else {
      this.currentLang = resolveInitialLang(options.defaultLang);
    }
    this.init(this.currentLang).catch(err => {
      console.error('Failed to initialize SwiftI18n:', err);
    });
  }

  get lang() {
    return this.currentLang;
  }

  get locales() {
    return this.supportedLangs;
  }

  get allBundles() {
    return this.bundles;
  }

  async init(lang?: string) {
    if (lang) this.currentLang = lang;
    await this.load(this.currentLang);
  }

  async load(lang: string, force = false) {
    if (!force) {
      const cached = this.readCache(lang);
      if (cached) {
        this.bundles[lang] = cached;
        this.currentLang = lang;
        persistLang(lang);
        this.emit('languageChanged', lang);
        return;
      }
    }

    const bundle = await this.loader(lang);
    this.bundles[lang] = bundle;
    this.writeCache(lang, bundle);
    this.currentLang = lang;
    persistLang(lang);
    this.emit('languageChanged', lang);
  }

  async changeLanguage(lang: string) {
    if (lang === this.currentLang) return;

    if (this.supportedLangs.length && !this.supportedLangs.includes(lang)) {
      console.warn(`Language "${lang}" is not in supportedLangs: [${this.supportedLangs.join(', ')}]`);
      return;
    }

    await this.load(lang);
  }

  t(key: TranslationKey, vars?: Record<string, any>): string; // type-safe
  t(key: string, vars?: Record<string, any>): string {
    const bundle = this.bundles[this.currentLang];
    if (!bundle) return key;

    const parts = key.split('.');
    let cur: any = bundle;
    for (const p of parts) {
      if (cur && p in cur) cur = cur[p];
      else return key;
    }
    if (typeof cur !== 'string') return key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        cur = cur.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return cur;
  }

  plural(baseKey: string, count: number, vars?: Record<string, any>) {
    const pr = new Intl.PluralRules(this.currentLang);
    const form = pr.select(count); // 'one', 'other', 'few', ...
    const tryKey = `${baseKey}_${form}`;
    const res = this.t(tryKey, { ...(vars || {}), count });
    if (res === tryKey) {
      return this.t(baseKey, { ...(vars || {}), count });
    }
    return res;
  }

  availableLocales() {
    return Object.keys(this.bundles);
  }

  setLoader(loader: (lang: string) => Promise<LocaleBundle>) {
    this.loader = loader;
  }

  private cacheKey(lang: string) {
    return CACHE_KEY_PREFIX + lang;
  }

  private readCache(lang: string): LocaleBundle | null {
    try {
      const raw = lsGet<{ bundle: LocaleBundle; ts: number; }>(this.cacheKey(lang));
      if (!raw) return null;
      if (Date.now() - raw.ts > this.cacheTtlMs) {
        lsSet(this.cacheKey(lang), null);
        return null;
      }
      return raw.bundle;
    } catch {
      return null;
    }
  }

  private writeCache(lang: string, bundle: LocaleBundle) {
    try {
      lsSet(this.cacheKey(lang), { bundle, ts: Date.now() });
    } catch { }
  }
}

// export const i18n = new SwiftI18n();
export type I18n = SwiftI18n;
