import type { PaletteDataItem } from '../utils/types'
import Style from './../canvas/Style'
import { locals, lang } from '../content/locals'

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
            const style: PaintStyle = new Style(
              `${color.name}/${shade.name}`,
              color.description,
              {
                r: shade.gl[0],
                g: shade.gl[1],
                b: shade.gl[2],
              }
            ).makeNode()
            i++
          }
        })
      }
    )

    if (i > 1) figma.notify(`${i} ${locals[lang].info.createdlocalStyles}`)
    else if (i == 1) figma.notify(`${i} ${locals[lang].info.createdlocalStyle}`)
    else figma.notify(locals[lang].warning.createLocalStyles)
  } else figma.notify(locals[lang].error.corruption)
}

export default createLocalStyles
