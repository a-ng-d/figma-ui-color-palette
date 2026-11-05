import { PaletteDataThemeItem } from '@yelbolt/engine-ui-color-palette'
import { MeteredAction, UsageUnit } from '../types/messages'

export const DEFAULT_THEME_MARK = '00000000000'

export const makeDocumentPairs = (
  themes: Array<PaletteDataThemeItem>
): Set<string> => {
  const hasCustomThemes = themes.some((theme) => theme.type === 'custom theme')
  const pairs = new Set<string>()

  themes
    .filter((theme) =>
      hasCustomThemes
        ? theme.type === 'custom theme'
        : theme.type === 'default theme'
    )
    .forEach((theme) =>
      theme.colors.forEach((color) => pairs.add(`${color.id}:${theme.id}`))
    )

  return pairs
}

export const postUsageReport = (
  action: MeteredAction,
  usage: Partial<Record<UsageUnit, number>>
) =>
  figma.ui.postMessage({
    type: 'REPORT_USAGE',
    data: { action, usage },
  })
