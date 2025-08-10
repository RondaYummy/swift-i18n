import { reactive, readonly, inject, App } from 'vue';
import type { SwiftI18n } from './i18n';

const I18N_SYMBOL = Symbol('SwiftI18n');

export function createVueI18n(i18n: SwiftI18n) {
   const state = reactive({
      lang: i18n.lang,
      bundles: i18n.allBundles
   });

   i18n.on('languageChanged', (newLang: string) => {
      state.lang = newLang;
   });

   return {
      install(app: App) {
         app.provide(I18N_SYMBOL, { i18n, state: readonly(state) });
      }
   };
}

export function useI18n() {
   const ctx = inject<{ i18n: SwiftI18n; state: { lang: string; bundles: any; }; }>(I18N_SYMBOL);
   if (!ctx) throw new Error('useI18n must be used within Vue app with createVueI18n');
   return ctx;
}
