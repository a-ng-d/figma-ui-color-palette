import chroma from 'chroma-js'
import type { PaletteDataItem } from '../utils/types'
import { locals, lang } from '../content/locals'

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
          if (target != undefined)
            if (
              shade.hex !=
              chroma([
                target.paints[0]['color'].r * 255,
                target.paints[0]['color'].g * 255,
                target.paints[0]['color'].b * 255,
              ]).hex() || shade.description != target.description
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
              target.description = shade.description
              i++
            }
        })
      }
    )

    if (i > 1) figma.notify(`${i} ${locals[lang].info.updatedlocalStyles}`)
    else if (i == 1) figma.notify(`${i} ${locals[lang].info.updatedlocalStyle}`)
    else figma.notify(locals[lang].warning.updateLocalStyles)
  } else figma.notify(locals[lang].error.corruption)
}

export default updateLocalStyles
