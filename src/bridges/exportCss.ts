const exportCss = (msg, palette) => {
  palette = figma.currentPage.selection[0]
  const css: Array<string> = []

  if (palette.children.length == 1) {
    palette.children[0].children.forEach((row) => {
      const rowCss: Array<string> = []
      if (row.name != '_header' && row.name != '_title') {
        row.children.forEach((sample, index) => {
          if (index != 0) {
            const color = sample.fills[0].color
            rowCss.unshift(
              `--${row.name.toLowerCase().split(' ').join('-')}-${
                sample.name
              }: rgb(${Math.floor(color.r * 255)}, ${Math.floor(
                color.g * 255
              )}, ${Math.floor(color.b * 255)})`
            )
          }
        })
        rowCss.forEach((sampleCss) => css.push(sampleCss))
      }
    })
    figma.ui.postMessage({
      type: 'export-palette-css',
      data: css,
    })
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default exportCss
