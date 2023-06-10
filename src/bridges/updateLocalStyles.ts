import chroma from 'chroma-js'
import type { PaletteDataItem } from '../utils/types'

const updateLocalStyles = (palette, i: number) => {
  palette = figma.currentPage.selection[0]
  const localStyles: Array<PaintStyle> = figma.getLocalPaintStyles()
  let target: PaintStyle

  if (palette.children.length == 1) {
    i = 0

    JSON.parse(palette.getPluginData('data')).forEach(
      (color: PaletteDataItem) => {
        color.shades.forEach((shade) => {
          target = localStyles.filter(
            (localStyle) => localStyle.name === `${color.name}/${shade.name}`
          )[0]

          if (
            shade.hex !=
            chroma([
              target.paints[0]['color'].r * 255,
              target.paints[0]['color'].g * 255,
              target.paints[0]['color'].b * 255,
            ]).hex()
          ) {
            target.paints = [
              {
                type: 'SOLID',
                color: {
                  r: shade.gl[0],
                  g: shade.gl[1],
                  b: shade.gl[2],
                },
              },
            ]
            i++
          }
        })
      }
    )

    if (i > 1) figma.notify(`${i} local color styles have been updated`)
    else if (i == 1) figma.notify(`${i} local color style has been updated`)
    else
      figma.notify(
        `No color has been updated because the palette has not been edited`
      )
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default updateLocalStyles
