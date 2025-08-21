import { EventEmitter } from 'events';
import { resolveInitialLang, persistLang, detectLanguage } from './language';
import { BundlesMap, LocaleBundle, Options, TranslationKey } from './types';
import { createVueI18n } from './plugins/vue-plugin';

export class SwiftI18n extends EventEmitter {
  private bundles: BundlesMap = {};
  private currentLang: string;
  private supportedLangs: string[] = [];
  private loader: (lang: string) => Promise<LocaleBundle>;

  constructor(options?: Options) {
    super();
    if (!options?.loader) {
      console.warn('SwiftI18n requires a loader function to fetch locale bundles.');
      throw new Error('No loader provided for SwiftI18n');
    }
    this.loader = options?.loader;

    if (options.supportedLangs?.length) {
      this.supportedLangs = options.supportedLangs;
      this.currentLang = detectLanguage(this.supportedLangs, options.defaultLang);
    } else {
      this.currentLang = resolveInitialLang(options.defaultLang);
    }
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



  async load(lang: string) {
    const bundle = await this.loader(lang);
    this.bundles[lang] = bundle;
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

    this.emit('languageChanging', lang);
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

    let result = cur;
    // linked keys (@:something)
    result = result.replace(/@:([\w.]+)/g, (_, refKey) => this.t(refKey, vars));

    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        let val = String(v);
  
        val = val.replace(/@:([\w.]+)/g, (_, refKey) => this.t(refKey, vars));
        result = result.replace(new RegExp(`\\{${k}\\}`, "g"), val);
      });
    }

    return result;
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
}
