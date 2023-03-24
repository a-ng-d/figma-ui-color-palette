import chroma from 'chroma-js'

const exportCsv = (msg, palette) => {
  palette = figma.currentPage.selection[0]
  let csv: string = '',
      header: Array<string> = [palette.name]
  const l: Array<number | string> = ['L'],
        c: Array<number | string> = ['C'],
        h: Array<number | string> = ['H']

  if (palette.children.length == 1) {
    palette.children[0].children.forEach((row) => {
      if (row.name === '_header') {
        row.children.forEach((sample, index) => {
          if (index != 0)
            header.push(sample.name)
        })      
      } else {
        row.children.forEach((sample, index) => {
          if (index != 0) {
            const color = sample.fills[0].color,
                  lch = chroma([Math.floor(color.r * 255), Math.floor(color.g * 255), Math.floor(color.b * 255)]).lch()
            l.push(Math.round(lch[0]))
            c.push(Math.round(lch[1]))
            h.push(Math.round(lch[2]))
          }
        })
      }
    })
    header.forEach((item, index) => {
      csv = csv + `${header[index]},"${l[index]}","${c[index]}","${h[index]}"\n`
    })
    figma.ui.postMessage({
      type: 'export-palette-csv',
      data: csv,
    })
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default exportCsv
