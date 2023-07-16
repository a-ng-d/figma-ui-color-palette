import chroma from 'chroma-js'
import type { PaletteData, PaletteDataThemeItem } from '../utils/types'
import { locals, lang } from '../content/locals'

const updateLocalStyles = (palette, i: number) => {
  palette = figma.currentPage.selection[0]
  const localStyles: Array<PaintStyle> = figma.getLocalPaintStyles(),
  paletteData: PaletteData = JSON.parse(palette.getPluginData('data'))
  let target: PaintStyle

  if (palette.children.length == 1) {
    i = 0
    let j = 0

    paletteData.themes.forEach(
      (theme: PaletteDataThemeItem) => {
        theme.colors.forEach((color) => {
          color.shades.forEach((shade) => {
            const name = paletteData.themes.length > 1
              ? `${paletteData.name == '' ? '' : paletteData.name + '/'}${theme.name}/${color.name}/${shade.name}`
              : `${color.name}/${shade.name}`
            target = localStyles.find(
              (localStyle) => localStyle.name === name
            )
            if (target != undefined) {
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
                j++
              }
              if (color.description != '')
                if (target.description.split('﹒')[0] != color.description) {
                  target.description =
                    color.description != ''
                      ? color.description.concat('﹒', shade.description)
                      : shade.description
                  j++
                }

              j > 0 ? i++ : i
              j = 0
            }
          })
        })
      }
    )

    if (i > 1) figma.notify(`${i} ${locals[lang].info.updatedLocalStyles}`)
    else if (i == 1) figma.notify(`${i} ${locals[lang].info.updatedLocalStyle}`)
    else figma.notify(locals[lang].warning.cannotUpdateLocalStyles)
  } else figma.notify(locals[lang].error.corruption)
}

export default updateLocalStyles
