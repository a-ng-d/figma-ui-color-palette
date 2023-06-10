import type { PaletteDataItem } from '../utils/types'
import Style from './../canvas/Style'

const createLocalStyles = (palette, i: number) => {
  palette = figma.currentPage.selection[0] as FrameNode
  const localStyles: Array<PaintStyle> = figma.getLocalPaintStyles()

  if (palette.children.length == 1) {
    i = 0

    JSON.parse(palette.getPluginData('data')).forEach(
      (color: PaletteDataItem) => {
        color.shades.forEach((shade) => {
          if (
            localStyles.filter((e) => e.name === `${color.name}/${shade.name}`)
              .length == 0
          ) {
            const style: PaintStyle = new Style(`${color.name}/${shade.name}`, {
              r: shade.gl[0],
              g: shade.gl[1],
              b: shade.gl[2],
            }).makeNode()
            i++
          }
        })
      }
    )

    if (i > 1) figma.notify(`${i} local color styles have been created`)
    else if (i == 1) figma.notify(`${i} local color style has been created`)
    else
      figma.notify(
        `Local color styles already exist and cannot be created twice`
      )
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default createLocalStyles
