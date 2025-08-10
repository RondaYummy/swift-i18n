import { EventEmitter } from 'events';
import { defaultLocaleLoader, LocaleBundle } from './locale-loader';
import { resolveInitialLang, persistLang } from './language';
import { lsGet, lsSet } from './storage';
import { reactive } from 'vue';
import { TranslationKey } from './types';

type BundlesMap = Record<string, LocaleBundle>;

const CACHE_KEY_PREFIX = 'swift-i18n.bundle:';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export class SwiftI18n extends EventEmitter {
   private state = reactive({
      bundles: {} as BundlesMap,
      currentLang: '',
   });

   private loader: (lang: string) => Promise<LocaleBundle>;

   constructor(options?: { defaultLang?: string; loader?: (lang: string) => Promise<LocaleBundle>; }) {
      super();
      this.loader = options?.loader ?? defaultLocaleLoader;
      this.state.currentLang = resolveInitialLang(options?.defaultLang);
   }

   get lang() {
      return this.state.currentLang;
   }

   get bundles() {
      return this.state.bundles;
   }

   async init(lang?: string) {
      if (lang) this.state.currentLang = lang;
      await this.load(this.state.currentLang);
   }

   async load(lang: string, force = false) {
      if (!force) {
         const cached = this.readCache(lang);
         if (cached) {
            this.state.bundles[lang] = cached;
            this.state.currentLang = lang;
            persistLang(lang);
            this.emit('languageChanged', lang);
            return;
         }
      }

      const bundle = await this.loader(lang);
      this.state.bundles[lang] = bundle;
      this.writeCache(lang, bundle);
      this.state.currentLang = lang;
      persistLang(lang);
      this.emit('languageChanged', lang);
   }

   async changeLanguage(lang: string) {
      if (lang === this.state.currentLang) return;
      await this.load(lang);
   }

   t(key: TranslationKey, vars?: Record<string, any>): string {
      const bundle = this.state.bundles[this.state.currentLang];
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
         if (Date.now() - raw.ts > CACHE_TTL_MS) {
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

   plural(baseKey: string, count: number, vars?: Record<string, any>) {
      const pr = new Intl.PluralRules(this.state.currentLang);
      const form = pr.select(count); // 'one', 'other', 'few', ...
      // common pattern: baseKey_one, baseKey_other etc.
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
}

export const i18n = new SwiftI18n();
export type I18n = SwiftI18n;
