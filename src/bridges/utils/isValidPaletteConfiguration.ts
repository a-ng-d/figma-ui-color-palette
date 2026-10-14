import { FullConfiguration } from '@yelbolt/engine-ui-color-palette'

const isValidPaletteConfiguration = (
  data: unknown
): data is FullConfiguration => {
  if (typeof data !== 'object' || data === null) return false

  const candidate = data as Partial<FullConfiguration>

  if (candidate.type !== 'UI_COLOR_PALETTE') return false

  if (typeof candidate.meta?.id !== 'string' || candidate.meta.id.length === 0)
    return false

  if (!Array.isArray(candidate.themes) || candidate.themes.length === 0)
    return false

  if (typeof candidate.base !== 'object' || candidate.base === null)
    return false

  return true
}

export default isValidPaletteConfiguration
