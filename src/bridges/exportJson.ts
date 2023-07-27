import type { PaletteData, PaletteDataShadeItem } from '../utils/types'
import { locals, lang } from '../content/locals'

const exportJson = (palette: SceneNode) => {
  palette = figma.currentPage.selection[0] as FrameNode

  const paletteData: PaletteData = JSON.parse(palette.getPluginData('data')),
    workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length == 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    json: { [key: string]: any } = {}

  const model = (shade: PaletteDataShadeItem) => {
    return {
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
      description: shade.description,
      type: 'color shade',
    }
  }

  if (palette.children.length == 1) {
    if (workingThemes[0].type === 'custom theme')
      workingThemes.forEach((theme) => {
        json[theme.name] = {}
        theme.colors.forEach((color) => {
          json[theme.name][color.name] = {}
          color.shades.reverse().forEach((shade) => {
            json[theme.name][color.name][shade.name] = model(shade)
          })
          json[theme.name][color.name]['description'] = color.description
          json[theme.name][color.name]['type'] = 'color'
        })
        json[theme.name]['description'] = theme.description
        json[theme.name]['type'] = 'color theme'
      })
    else
      workingThemes.forEach((theme) => {
        theme.colors.forEach((color) => {
          json[color.name] = {}
          color.shades.sort().forEach((shade) => {
            json[color.name][shade.name] = model(shade)
          })
          json[color.name]['description'] = color.description
          json[color.name]['type'] = 'color'
        })
      })

    json['type'] = 'color palette'

    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_JSON',
      data: json,
    })
  } else figma.notify(locals[lang].error.corruption)
}

export default exportJson
