import type { PaletteDataItem } from '../utils/types'
import { locals, lang } from '../content/locals'

const exportJson = (palette) => {
  palette = figma.currentPage.selection[0]
  const json = {}
  if (palette.children.length == 1) {
    JSON.parse(palette.getPluginData('data')).forEach(
      (color: PaletteDataItem) => {
        json[color.name] = {}
        color.shades.forEach((shade) => {
          json[color.name][shade.name] = {
            rgb: {
              r: Math.floor(shade.rgb[0]),
              g: Math.floor(shade.rgb[1]),
              b: Math.floor(shade.rgb[2]),
            },
            gl: {
              r: parseFloat(shade.gl[0].toFixed(3)),
              g: parseFloat(shade.gl[1].toFixed(3)),
              b: parseFloat(shade.gl[2].toFixed(3)),
            },
            lch: {
              l: Math.floor(shade.lch[0]),
              c: Math.floor(shade.lch[1]),
              h: Math.floor(shade.lch[2]),
            },
            oklch: {
              l: parseFloat(shade.oklch[0].toFixed(3)),
              c: parseFloat(shade.oklch[1].toFixed(3)),
              h: Math.floor(shade.oklch[2]),
            },
            lab: {
              l: Math.floor(shade.lab[0]),
              a: Math.floor(shade.lab[1]),
              b: Math.floor(shade.lab[2]),
            },
            oklab: {
              l: parseFloat(shade.oklab[0].toFixed(3)),
              a: parseFloat(shade.oklab[1].toFixed(3)),
              b: parseFloat(shade.oklab[2].toFixed(3)),
            },
            hsl: {
              h: Math.floor(shade.hsl[0]),
              s: Math.floor(shade.hsl[1] * 100),
              l: Math.floor(shade.hsl[2] * 100),
            },
            hex: shade.hex,
            type: 'color',
          }
        })
      }
    )
    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_JSON',
      data: json,
    })
  } else figma.notify(locals[lang].error.corruption)
}

export default exportJson
