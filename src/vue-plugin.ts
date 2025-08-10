import { App, computed, inject, reactive, readonly } from 'vue';
import { I18n, SwiftI18n } from './i18n';
import { detectLanguage, setLanguage } from './language';
import { TranslationKey } from './types';

export const SWIFT_I18N_KEY = Symbol('swift-i18n');

export function createSwiftI18n(options?: {
   defaultLang?: string;
   supportedLangs?: string[];
   loader?: (lang: string) => Promise<any>;
}) {
   const inst = new SwiftI18n({
      loader: options?.loader,
      defaultLang: options?.defaultLang,
   });

   const state = reactive({ lang: inst.lang });

   let initialized = false;

   async function initAsync() {
      if (initialized) return;
      initialized = true;

      const supported = options?.supportedLangs || ['en'];
      const defaultLang = options?.defaultLang || 'en';

      const initialLang = detectLanguage(supported, defaultLang);

      inst.on('languageChanged', (lang) => {
         state.lang = lang;
         setLanguage(lang);
      });
      console.log(`Initializing SwiftI18n with language: ${initialLang}`);
      await inst.init(initialLang);
   }

   function install(app: App) {
      app.provide(SWIFT_I18N_KEY, { i18n: inst, state: readonly(state) });

      app.config.globalProperties.$t = (key: string, vars?: Record<string, any>) => inst.t(key, vars);
      app.config.globalProperties.$i18n = inst;

      initAsync();
   }

   return { install };
}

export function useI18n() {
   const injected = inject<{ i18n: I18n; state: any; }>(SWIFT_I18N_KEY);

   if (injected) {
      return {
         t: (k: TranslationKey, v?: Record<string, any>) => injected.i18n.t(k, v),
         plural: (k: string, c: number, v?: Record<string, any>) => injected.i18n.plural(k, c, v),
         changeLanguage: (l: string) => injected.i18n.changeLanguage(l),
         lang: computed(() => injected.i18n.lang),
         i18n: injected.i18n,
      };
   } else {
      return {
         t: (k: TranslationKey) => k,
         plural: (k: string, c: number) => k,
         changeLanguage: async () => { },
         lang: computed(() => 'en'),
         i18n: null,
      };
   }
}
