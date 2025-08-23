import { SwiftI18n } from '../i18n';

type Prev = [never, 0, 1, 2, 3, 4, 5];

export type NestedKeyOf<
  ObjectType extends object,
  Depth extends number = 5
> = [Depth] extends [never]
  ? never
  : {
    [Key in keyof ObjectType & string]:
    ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key], Prev[Depth]>}`
    : `${Key}`;
  }[keyof ObjectType & string];


export interface Translations { }

// Keys are calculated from the merged interface; until the user adds their keys, this will be `never`.
export type TranslationKey = NestedKeyOf<Translations> extends never
  ? string
  : NestedKeyOf<Translations>;

export type TranslationSchema = {
  [key: string]: string | TranslationSchema;
};

export type LocaleBundle = TranslationSchema;

export type BundlesMap = Record<string, LocaleBundle>;

export type I18n = SwiftI18n;

export interface Options {
  defaultLang: string;
  fallbackLang?: string;
  supportedLangs?: string[];
  escapeParameter?: boolean;
  warnOnMissing?: boolean;
  loader?: (lang: string) => Promise<LocaleBundle>;
}