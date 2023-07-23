import chroma from 'chroma-js'
import type { PaletteData, PaletteDataThemeItem } from '../utils/types'
import { locals, lang } from '../content/locals'

const updateLocalStyles = (palette: SceneNode, i: number) => {
  palette = figma.currentPage.selection[0] as FrameNode

  const paletteData: PaletteData = JSON.parse(palette.getPluginData('data')),
    localStyles: Array<PaintStyle> = figma.getLocalPaintStyles(),
    workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length == 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme')

  if (palette.children.length == 1) {
    i = 0
    let j = 0

    workingThemes.forEach((theme: PaletteDataThemeItem) => {
      theme.colors.forEach((color) => {
        color.shades.forEach((shade) => {
          const name =
            workingThemes[0].type === 'custom theme'
              ? `${paletteData.name == '' ? '' : paletteData.name + '/'}${
                  theme.name
                }/${color.name}/${shade.name}`
              : `${color.name}/${shade.name}`

          if (
            localStyles.find((localStyle) => localStyle.id === shade.styleId) !=
            undefined
          ) {
            const styleMatch = localStyles.find(
              (localStyle) => localStyle.id === shade.styleId
            )

            if (styleMatch?.name != name) {
              styleMatch!.name = name
              j++
            }

            if (styleMatch?.description != shade.description) {
              styleMatch!.description = shade.description
              j++
            }

            if (
              shade.hex !=
              chroma([
                (styleMatch?.paints[0] as SolidPaint).color.r * 255,
                (styleMatch?.paints[0] as SolidPaint).color.g * 255,
                (styleMatch?.paints[0] as SolidPaint).color.b * 255,
              ]).hex()
            ) {
              styleMatch!.paints = [
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

            j > 0 ? i++ : i
            j = 0
          } else if (
            localStyles.find((localStyle) => localStyle.name === name) !=
            undefined
          ) {
            const styleMatch = localStyles.find(
              (localStyle) => localStyle.name === name
            )
            console.log(styleMatch?.name, name)

            if (styleMatch?.name != name) {
              styleMatch!.name = name
              j++
            }

            if (styleMatch?.description != shade.description) {
              styleMatch!.description = shade.description
              j++
            }

            if (
              shade.hex !=
              chroma([
                (styleMatch?.paints[0] as SolidPaint).color.r * 255,
                (styleMatch?.paints[0] as SolidPaint).color.g * 255,
                (styleMatch?.paints[0] as SolidPaint).color.b * 255,
              ]).hex()
            ) {
              styleMatch!.paints = [
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

            j > 0 ? i++ : i
            j = 0
          }
        })
      })
    })

    if (i > 1) figma.notify(`${i} ${locals[lang].info.updatedLocalStyles}`)
    else if (i == 1) figma.notify(`${i} ${locals[lang].info.updatedLocalStyle}`)
    else figma.notify(locals[lang].warning.cannotUpdateLocalStyles)
  } else figma.notify(locals[lang].error.corruption)
}

export default updateLocalStyles
