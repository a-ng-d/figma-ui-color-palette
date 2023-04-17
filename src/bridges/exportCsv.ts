import chroma from 'chroma-js'

const exportCsv = (msg, palette) => {
  palette = figma.currentPage.selection[0]
  const paletteCsv: Array<{ name: string; csv: string }> = [],
    csv: Array<string> = [],
    colors: Array<string> = [],
    lightness: Array<string> = [],
    l: Array<number | string> = [],
    c: Array<number | string> = [],
    h: Array<number | string> = []

  if (palette.children.length == 1) {
    palette.children[0].children.forEach((row) => {
      if (row.name === '_header') {
        row.children.forEach((sample, index) => {
          if (index != 0) lightness.push(sample.name)
        })
      } else if (row.name != '_title') {
        row.children.forEach((sample, index) => {
          if (index != 0) {
            const color = sample.fills[0].color,
              lch = chroma([
                Math.floor(color.r * 255),
                Math.floor(color.g * 255),
                Math.floor(color.b * 255),
              ]).lch()
            l.push(Math.round(lch[0]))
            c.push(Math.round(lch[1]))
            h.push(Math.round(lch[2]))
          }
        })
        colors.push(row.name)
        csv.push(
          `${row.name},Lightness,Chroma,Hue\n${lightness
            .map((stop, index) => `${stop},${l[index]},${c[index]},${h[index]}`)
            .join('\n')}`
        )
      }
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
