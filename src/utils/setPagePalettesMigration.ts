import {
  ColorConfiguration,
  FullConfiguration,
  normalizeShift,
} from '@yelbolt/engine-ui-color-palette'
import globalConfig from '../global.config'

const setPagePalettesMigration = async () => {
  const dataKeys = figma.currentPage.getSharedPluginDataKeys('uicp')

  dataKeys
    .filter((key) => key.startsWith('palette_'))
    .forEach((key) => {
      const raw = figma.currentPage.getSharedPluginData('uicp', key)
      if (!raw) return

      let palette: FullConfiguration
      try {
        palette = JSON.parse(raw)
      } catch (error) {
        console.warn(
          `[setPagePalettesMigration] Failed to parse stored palette data for key "${key}"`,
          error
        )
        return
      }

      if (palette.type !== 'UI_COLOR_PALETTE') return

      palette.base.shift.chroma = normalizeShift(
        palette.base.shift?.chroma,
        'CHROMA'
      )
      palette.base.shift.hue = normalizeShift(palette.base.shift?.hue, 'HUE')

      palette.base.colors = palette.base.colors.map(
        (
          color: ColorConfiguration & {
            hueShifting?: number
            chromaShifting?: number
          }
        ) => ({
          ...color,
          hue: {
            shift: normalizeShift(color.hue?.shift ?? color.hueShifting, 'HUE'),
            isLocked: color.hue?.isLocked || false,
          },
          chroma: {
            shift: normalizeShift(
              color.chroma?.shift ?? color.chromaShifting,
              'CHROMA'
            ),
            isLocked: color.chroma?.isLocked || false,
          },
        })
      )

      palette.version = globalConfig.versions.paletteVersion

      const migrated = JSON.stringify(palette)
      if (migrated === raw) return

      figma.currentPage.setSharedPluginData('uicp', key, migrated)
    })
}

export default setPagePalettesMigration
