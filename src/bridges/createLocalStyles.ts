import type { PaletteData, PaletteDataThemeItem } from '../utils/types'
import LocalStyle from './../canvas/LocalStyle'
import { locals, lang } from '../content/locals'

const createLocalStyles = (palette, i: number) => {
  palette = figma.currentPage.selection[0] as FrameNode
  const localStyles: Array<PaintStyle> = figma.getLocalPaintStyles(),
  paletteData: PaletteData = JSON.parse(palette.getPluginData('data'))

  if (palette.children.length == 1) {
    i = 0

    paletteData.themes.forEach(
      (theme: PaletteDataThemeItem) => {
        theme.colors.forEach((color) => {
          color.shades.forEach((shade) => {
            const name = paletteData.themes.length > 1
              ? `${paletteData.name == '' ? '' : paletteData.name + '/'}${theme.name}/${color.name}/${shade.name}`
              : `${color.name}/${shade.name}`
            if (
              paletteData.themes.length > 1 &&
              theme.type == 'custom theme' &&
              localStyles.find(
                (localStyle) => localStyle.name === name
              ) == undefined
            ) {
              new LocalStyle(
                name,
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
            else if (
              paletteData.themes.length == 1 &&
              localStyles.find(
                (localStyle) => localStyle.name === name
              ) == undefined
            ) {
              new LocalStyle(
                name,
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
        })
      }
    )

    if (i > 1) figma.notify(`${i} ${locals[lang].info.createdLocalStyles}`)
    else if (i == 1) figma.notify(`${i} ${locals[lang].info.createdLocalStyle}`)
    else figma.notify(locals[lang].warning.cannotCreateLocalStyles)
  } else figma.notify(locals[lang].error.corruption)
}

export default createLocalStyles
