import Style from './../canvas/Style'

const createLocalStyles = (palette, i: number) => {
  palette = figma.currentPage.selection[0] as FrameNode

  if (palette.children.length == 1) {
    const localStyles = figma.getLocalPaintStyles()
    i = 0
    let source

    palette.children[0].children.forEach((row) => {
      if (row.name != '_header' && row.name != '_title')
        row.children.forEach((sample, index) => {
          if (
            localStyles.filter(
              (e) =>
                e.name ===
                `${row.name}/${sample.name.replace(row.name + '-', '')}`
            ).length == 0 &&
            localStyles.filter((e) => e.name === `${row.name}/source`).length ==
              0
          ) {
            const style = new Style(
              `${row.name}/${
                index === 0 ? 'source' : sample.name.replace(row.name + '-', '')
              }`,
              sample.fills[0].color
            ).makeNode()
            index === 0
              ? (source = style)
              : figma.moveLocalPaintStyleAfter(style, source)
            i++
          }
        })
    })

    if (i > 1) figma.notify(`${i} local color styles have been created`)
    else if (i == 1) figma.notify(`${i} local color style has been created`)
    else figma.notify(`Local color styles already exist and cannot be created twice`)
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default createLocalStyles
