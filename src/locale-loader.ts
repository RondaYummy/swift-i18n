import type { TranslationSchema } from './types';

export type LocaleBundle = TranslationSchema;

export async function defaultLocaleLoader(lang: string): Promise<LocaleBundle> {
   try {
      const module = await import(`./locales/${lang}.json`);
      return module.default as LocaleBundle;
   } catch (e) {
      throw new Error(`Locale ${lang} not found`);
   }
}
