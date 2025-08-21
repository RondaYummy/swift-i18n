import { EventEmitter } from "events";
import { resolveInitialLang, persistLang, detectLanguage } from "./language";
import { BundlesMap, LocaleBundle, Options, TranslationKey } from "./types";
import { createVueI18n } from "./plugins/vue-plugin";

export class SwiftI18n extends EventEmitter {
  private bundles: BundlesMap = {};
  private currentLang: string;
  private fallback?: string;
  private supportedLangs: string[] = [];
  private loader: (lang: string) => Promise<LocaleBundle>;

  constructor(options?: Options) {
    super();
    if (!options?.loader) throw new Error("No loader provided for SwiftI18n");

    this.loader = options?.loader;
    if (options.supportedLangs?.length) {
      this.supportedLangs = options.supportedLangs;
      this.currentLang = detectLanguage(
        this.supportedLangs,
        options.defaultLang
      );
    } else {
      this.currentLang = resolveInitialLang(options.defaultLang);
    }
    this.fallback = options?.fallbackLang;
  }

  get lang() {
    return this.currentLang;
  }

  get fallbackLang() {
    return this.fallback;
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
    if (this.fallback) {
      const bundle = await this.loader(this.fallback);
      this.bundles[this.fallback] = bundle;
    }
  }

  async load(lang: string) {
    const bundle = await this.loader(lang);
    this.bundles[lang] = bundle;
    this.currentLang = lang;
    persistLang(lang);
    this.emit("languageChanged", lang);
  }

  async changeLanguage(lang: string) {
    if (lang === this.currentLang) return;

    if (this.supportedLangs.length && !this.supportedLangs.includes(lang)) {
      console.warn(
        `Language "${lang}" is not in supportedLangs: [${this.supportedLangs.join(
          ", "
        )}]`
      );
      return;
    }

    this.emit("languageChanging", lang);
    await this.load(lang);
  }

  resolveKey(bundle: any, parts: string[]): string | undefined {
    let cur = bundle;
    for (const p of parts) {
      if (cur && p in cur) {
        cur = cur[p];
      } else {
        return undefined;
      }
    }
    return typeof cur === "string" ? cur : undefined;
  }

  t(key: TranslationKey, vars?: Record<string, any>): string; // type-safe
  t(key: string, vars?: Record<string, any>): string {
    const parts = key.split(".");
    let result =
    this.resolveKey(this.bundles[this.currentLang], parts) ??
    (this.fallback ? this.resolveKey(this.bundles[this.fallback], parts) : undefined);
  if (!result) return key;
  
    // linked keys (@:something)
    result = result.replace(/@:([\w.]+)/g, (_, refKey) => this.t(refKey, vars));

    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        let val = String(v);

        val = val.replace(/@:([\w.]+)/g, (_, refKey) => this.t(refKey, vars));
        if (result !== undefined) {
          result = result.replace(new RegExp(`\\{${k}\\}`, "g"), val);
        }
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
