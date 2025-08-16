import type { SwiftI18n } from '../i18n';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: SwiftI18n['t'];
    $plural: SwiftI18n['plural'];
    $changeLanguage: SwiftI18n['changeLanguage'];
  }
}
