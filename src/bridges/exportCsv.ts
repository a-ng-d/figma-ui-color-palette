import { PaletteDataItem } from '../utils/types';

const exportCsv = (palette) => {
  palette = figma.currentPage.selection[0]
  const paletteCsv: Array<{ name: string; csv: string }> = [],
    csv: Array<string> = [],
    colors: Array<string> = [],
    lightness: Array<string> = [],
    l: Array<number | string> = [],
    c: Array<number | string> = [],
    h: Array<number | string> = []

  if (palette.children.length == 1) {
    JSON.parse(palette.getPluginData('data')).forEach((color: PaletteDataItem) => {
      color.shades.forEach(shade => {
        lightness.push(shade.name)
        l.push(Math.floor(shade.lch[0]))
        c.push(Math.floor(shade.lch[1]))
        h.push(Math.floor(shade.lch[2]))
      })
      colors.push(color.name)
      csv.push(
        `${color.name},Lightness,Chroma,Hue\n${lightness
          .map((stop, index) => `${stop},${l[index]},${c[index]},${h[index]}`)
          .join('\n')}`
      )
      lightness.splice(0, lightness.length)
      l.splice(0, l.length)
      c.splice(0, c.length)
      h.splice(0, h.length)
    })
    colors.forEach((color, index) =>
      paletteCsv.push({
        name: color,
        csv: csv[index],
      })
    )
    figma.ui.postMessage({
      type: 'export-palette-csv',
      data: paletteCsv,
    })
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default exportCsv
