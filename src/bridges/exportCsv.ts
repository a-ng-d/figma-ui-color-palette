import type { PaletteData } from '../utils/types'
import { locals, lang } from '../content/locals'

interface colorCsv {
  name: string
  csv: string
}

interface themeCsv {
  name: string
  colors: Array<colorCsv>
  type: string
}

const exportCsv = (palette: SceneNode) => {
  palette = figma.currentPage.selection[0] as FrameNode

  const paletteData: PaletteData = JSON.parse(palette.getPluginData('data')),
    workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length == 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    colorCsv: Array<colorCsv> = [],
    themeCsv: Array<themeCsv> = [],
    lightness: Array<string> = [],
    l: Array<number | string> = [],
    c: Array<number | string> = [],
    h: Array<number | string> = []

  if (palette.children.length == 1) {
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        color.shades.forEach((shade) => {
          lightness.push(shade.name)
          l.push(Math.floor(shade.lch[0]))
          c.push(Math.floor(shade.lch[1]))
          h.push(Math.floor(shade.lch[2]))
        })
        colorCsv.push({
          name: color.name,
          csv: `${color.name},Lightness,Chroma,Hue\n${lightness
            .map((stop, index) => `${stop},${l[index]},${c[index]},${h[index]}`)
            .join('\n')}`,
        })
        lightness.splice(0, lightness.length)
        l.splice(0, l.length)
        c.splice(0, c.length)
        h.splice(0, h.length)
      })
      themeCsv.push({
        name: theme.name,
        colors: colorCsv.map((c) => {
          return c
        }),
        type: theme.type,
      })
      colorCsv.splice(0, colorCsv.length)
    })

    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_CSV',
      data:
        paletteData.themes[0].colors.length == 0
          ? [
              {
                name: 'empty',
                colors: [{ csv: locals[lang].warning.emptySourceColors }],
              },
            ]
          : themeCsv,
    })
  } else figma.notify(locals[lang].error.corruption)
}

export default exportCsv
