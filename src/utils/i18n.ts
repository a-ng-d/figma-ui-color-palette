// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = Record<string, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslationParams = Record<string, any>

const interpolate = (str: string, params?: TranslationParams): string => {
  if (!params || typeof str !== 'string') return str
  return str.replace(/\{(\w+)\}/g, (match, key) =>
    params[key] !== undefined ? params[key] : match
  )
}

const pluralize = (str: string, count: number): string => {
  if (!str || typeof str !== 'string' || !str.includes('{')) return str

  const pluralRegex =
    /\{(\w+),\s*plural,\s*((?:(?:zero|one|few|many|other|=\d+)\s*\{[^}]*\}\s*)+)\}/g

  return str.replace(pluralRegex, (match, variable, forms) => {
    const n = count !== undefined ? count : 0
    const formRegex = /(zero|one|few|many|other|=\d+)\s*\{([^}]*)\}/g
    const formMap: Record<string, string> = {}
    let formMatch

    while ((formMatch = formRegex.exec(forms)) !== null)
      formMap[formMatch[1]] = formMatch[2]

    let selected: string | undefined

    if (formMap[`=${n}`]) selected = formMap[`=${n}`]
    else if (n === 0 && formMap.zero) selected = formMap.zero
    else if (n === 1 && formMap.one) selected = formMap.one
    else if (n > 1 && n < 5 && formMap.few) selected = formMap.few
    else if (n >= 5 && formMap.many) selected = formMap.many
    else if (formMap.other) selected = formMap.other

    return selected ? selected.replace(/#/g, String(n)) : match
  })
}

export const createI18n = (
  translations: Record<string, Translations>,
  defaultLang: string
) => {
  let currentLang = defaultLang
  let currentTranslations =
    translations[currentLang] || translations['en-US'] || {}

  return {
    t: (key: string, params?: TranslationParams): string => {
      const keys = key.split('.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let rawTranslation: any = currentTranslations

      for (const k of keys)
        if (rawTranslation && typeof rawTranslation === 'object')
          rawTranslation = rawTranslation[k]
        else {
          rawTranslation = undefined
          break
        }

      if (!rawTranslation) {
        console.warn(`Translation key not found: ${key}`)
        return key
      }

      let translation: string = rawTranslation

      if (
        params &&
        (params.count !== undefined || params.value !== undefined)
      ) {
        const count = params.count !== undefined ? params.count : params.value
        translation = pluralize(translation, count)

        if (typeof translation === 'string')
          translation = translation.replace(/#/g, String(count))
      }

      translation = interpolate(translation, params)

      return translation
    },

    changeLanguage: (lang: string): void => {
      currentLang = lang
      currentTranslations = translations[lang] || translations['en-US'] || {}
    },

    getLanguage: (): string => currentLang,
  }
}
