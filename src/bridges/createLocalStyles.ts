import type { PaletteDataItem } from '../utils/types'
import LocalStyle from './../canvas/LocalStyle'
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
            localStyles.find(
              (localStyle) => localStyle.name === `${color.name}/${shade.name}`
            ) == undefined
          ) {
            new LocalStyle(
              `${color.name}/${shade.name}`,
              color.description != ''
                ? color.description.concat('﹒', shade.description)
                : shade.description,
              {
                r: shade.gl[0],
                g: shade.gl[1],
                b: shade.gl[2],
              }
            ).makePaintStyle()
            i++
          }
        })
      }
    )

    if (i > 1) figma.notify(`${i} ${locals[lang].info.createdLocalStyles}`)
    else if (i == 1) figma.notify(`${i} ${locals[lang].info.createdLocalStyle}`)
    else figma.notify(locals[lang].warning.cannotCreateLocalStyles)
  } else figma.notify(locals[lang].error.corruption)
}

export default createLocalStyles
