import type { PaletteDataItem } from '../utils/types'
import { locals } from '../content/locals'

const exportJson = (palette) => {
  palette = figma.currentPage.selection[0]
  const json = {}
  if (palette.children.length == 1) {
    JSON.parse(palette.getPluginData('data')).forEach(
      (color: PaletteDataItem) => {
        json[color.name] = []
        color.shades.forEach((shade) => {
          json[color.name].push({
            name: shade.name,
            rgb: {
              r: Math.floor(shade.rgb[0]),
              g: Math.floor(shade.rgb[1]),
              b: Math.floor(shade.rgb[2]),
            },
            lch: {
              l: Math.floor(shade.lch[0]),
              c: Math.floor(shade.lch[1]),
              h: Math.floor(shade.lch[2]),
            },
            hex: shade.hex,
            type: 'color',
          })
        })
      }
    )
    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_JSON',
      data: json,
    })
  } else figma.notify(locals.en.error.corruption)
}

export default exportJson
