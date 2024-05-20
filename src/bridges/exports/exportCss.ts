import { doKebabCase } from '@a-ng-d/figmug.modules.do-kebab-case'

import { lang, locals } from '../../content/locals'
import type {
  ActionsList,
  PaletteData,
  PaletteDataShadeItem,
} from '../../utils/types'

const exportCss = (palette: FrameNode, colorSpace: 'RGB' | 'LCH' | 'P3') => {
  const paletteData: PaletteData = JSON.parse(palette.getPluginData('data')),
    workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    css: Array<string> = []

  const setValueAccordingToColorSpace = (shade: PaletteDataShadeItem) => {
    const actions: ActionsList = {
      RGB: () =>
        `rgb(${Math.floor(shade.rgb[0])}, ${Math.floor(
          shade.rgb[1]
        )}, ${Math.floor(shade.rgb[2])})`,
      HEX: () => shade.hex,
      HSL: () =>
        `hsl(${Math.floor(shade.hsl[0])} ${Math.floor(
          shade.hsl[1]
        )}% ${Math.floor(shade.hsl[2])}%)`,
      LCH: () =>
        `lch(${Math.floor(shade.lch[0])}% ${Math.floor(
          shade.lch[1]
        )} ${Math.floor(shade.lch[2])})`,
      P3: () =>
        `color(display-p3 ${shade.gl[0].toFixed(3)} ${shade.gl[1].toFixed(
          3
        )} ${shade.gl[2].toFixed(3)})`,
    }

    return actions[colorSpace ?? 'RGB']?.()
  }

  if (palette.children.length === 1) {
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const rowCss: Array<string> = []
        rowCss.unshift(
          `/* ${
            workingThemes[0].type === 'custom theme' ? theme.name + ' - ' : ''
          }${color.name} */`
        )
        color.shades.forEach((shade) => {
          rowCss.unshift(
            `--${
              workingThemes[0].type === 'custom theme'
                ? doKebabCase(theme.name + ' ' + color.name)
                : doKebabCase(color.name)
            }-${shade.name}: ${setValueAccordingToColorSpace(shade)};`
          )
        })
        rowCss.unshift('')
        rowCss.reverse().forEach((sampleCss) => css.push(sampleCss))
      })
    })

    css.pop()

    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_CSS',
      context: 'CSS',
      colorSpace: colorSpace,
      data: css,
    })
  } else figma.notify(locals[lang].error.corruption)
}

export default exportCss
