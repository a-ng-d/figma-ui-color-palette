import chroma from 'chroma-js'

const exportCsv = (msg, palette) => {
  palette = figma.currentPage.selection[0]
  let csv: string,
      header: Array<string> = [palette.name]
  const l: Array<string> = ['l'],
        c: Array<string> = ['c'],
        h: Array<string> = ['h']

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
            l.push(lch[0].toFixed(1))
            c.push(lch[1].toFixed(1))
            h.push(lch[2].toFixed(1))
          }
        })
      }
    })
    csv = `${header.join(',')}\n${l.join(',')}\n${c.join(',')}\n${h.join(',')}`
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
