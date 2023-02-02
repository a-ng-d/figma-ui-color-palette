const updateLocalStyles = (palette, i) => {
  palette = figma.currentPage.selection[0]

  if (palette.children.length == 1) {
    const localStyles = figma.getLocalPaintStyles()
    i = 0

    palette.children[0].children.forEach((row) => {
      row.children.forEach((sample) => {
        localStyles.forEach((localStyle) => {
          if (`${row.name}/${sample.name}` === localStyle.name) {
            if (
              JSON.stringify(localStyle.paints[0]['color']) !=
              JSON.stringify(sample.fills[0]['color'])
            ) {
              localStyle.paints = sample.fills
              i++
            }
          }
        })
      })
    })
    if (i > 1) figma.notify(`${i} local color styles have been updated 🙌`)
    else if (i == 1) figma.notify(`${i} local color style has been updated 🙌`)
    else figma.notify(`No local color style has been updated`)
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default updateLocalStyles
