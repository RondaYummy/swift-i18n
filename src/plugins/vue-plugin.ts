import { reactive, readonly, inject, App, computed } from 'vue';
import { SwiftI18n } from '../i18n';
import { Options } from '../types';

export const I18N_SYMBOL = Symbol('SwiftI18n');

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: SwiftI18n['t'];
    $plural: SwiftI18n['plural'];
    $changeLanguage: SwiftI18n['changeLanguage'];
  }
}

export function createVueI18n(i18n: SwiftI18n) {
  const state = reactive({
    lang: i18n.lang,
    bundles: i18n.allBundles
  });

  i18n.on('languageChanged', (newLang: string) => {
    state.lang = newLang;
    state.bundles = i18n.allBundles;
  });

  return {
    install(app: App) {
      app.provide(I18N_SYMBOL, { i18n, state: readonly(state) });

      // Add to global properties ($t etc.)
      app.config.globalProperties.$t = i18n.t.bind(i18n);
      app.config.globalProperties.$plural = i18n.plural.bind(i18n);
      app.config.globalProperties.$changeLanguage = i18n.changeLanguage.bind(i18n);
    }
  };
}

export function useI18n() {
  const ctx = inject<{ i18n: SwiftI18n; state: { lang: string; bundles: any; }; }>(I18N_SYMBOL);
  if (!ctx) throw new Error('useI18n must be used within Vue app with createVueI18n');

  const lang = computed(() => ctx.state.lang);

  return {
    lang,
    t: ctx.i18n.t.bind(ctx.i18n),
    plural: ctx.i18n.plural.bind(ctx.i18n),
    changeLanguage: ctx.i18n.changeLanguage.bind(ctx.i18n),
  };
}

export async function createSwiftI18n(options?: Options) {
  const i18n = new SwiftI18n({
    defaultLang: options?.defaultLang ?? 'en',
    supportedLangs: options?.supportedLangs ?? ['en'],
    loader: options?.loader,
  })
  await i18n.init()
  return createVueI18n(i18n)
}