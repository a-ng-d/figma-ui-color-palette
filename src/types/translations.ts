import enUS from '../content/translations/en-US.json'

type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & string]: TObj[TKey] extends object
    ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
    : `${TKey}`
}[keyof TObj & string]

export type TranslationKeys = RecursiveKeyOf<typeof enUS>

export type Translations = typeof enUS

export type Language = 'en-US'
