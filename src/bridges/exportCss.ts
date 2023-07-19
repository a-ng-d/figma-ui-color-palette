import type { PaletteData } from '../utils/types'
import doSnakeCase from '../utils/doSnakeCase'
import { locals, lang } from '../content/locals'

const exportCss = (palette) => {
  palette = figma.currentPage.selection[0]

  const paletteData: PaletteData = JSON.parse(palette.getPluginData('data')),
  workingThemes = paletteData.themes
    .filter(theme => theme.type === 'custom theme').length == 0
    ? paletteData.themes
    .filter(theme => theme.type === 'default theme')
    : paletteData.themes
    .filter(theme => theme.type === 'custom theme'),
  css: Array<string> = []

  if (palette.children.length == 1) {
    workingThemes.forEach(theme => {  
      theme.colors.forEach(color => {
        const rowCss: Array<string> = []
        rowCss.unshift(`/* ${
          workingThemes[0].type === 'custom theme'
            ? theme.name + ' - '
            : ''
          }${color.name} */`)
        color.shades.forEach(shade => {
          rowCss.unshift(
            `--${
              workingThemes[0].type === 'custom theme'
                ? doSnakeCase(theme.name + ' ' + color.name)
                : doSnakeCase(color.name)
              }-${
              shade.name
            }: rgb(${
              Math.floor(shade.rgb[0])
            },${
              Math.floor(shade.rgb[1])
            },${
              Math.floor(shade.rgb[2])
            });`
          )
        })
        rowCss.unshift('')
        rowCss.reverse().forEach((sampleCss) => css.push(sampleCss))
      })
    })

    css.pop()

    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_CSS',
      data: css,
    })
  } else figma.notify(locals[lang].error.corruption)
}

export default exportCss
