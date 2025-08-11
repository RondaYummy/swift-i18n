import type { TranslationSchema } from './types';
export type LocaleBundle = TranslationSchema;

// export async function defaultLocaleLoader(lang: string = 'en'): Promise<TranslationSchema> {
//   const module = await import(`../locales/${lang}.json`);
//   return module.default as LocaleBundle;
// }
