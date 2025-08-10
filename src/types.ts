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

export type TranslationKey = string; // default without type-safety

export type TranslationSchema = {
   [key: string]: string | TranslationSchema;
};
