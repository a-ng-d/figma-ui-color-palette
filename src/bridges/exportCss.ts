import { PaletteDataItem } from '../utils/types'
import { locals } from '../content/locals'

const exportCss = (palette) => {
  palette = figma.currentPage.selection[0]
  const css: Array<string> = []

  if (palette.children.length == 1) {
    JSON.parse(palette.getPluginData('data')).forEach(
      (color: PaletteDataItem) => {
        const rowCss: Array<string> = []
        color.shades.forEach((shade) => {
          rowCss.unshift(
            `--${color.name.toLowerCase().split(' ').join('-')}-${
              shade.name
            }: rgb(${Math.floor(shade.rgb[0])}, ${Math.floor(
              shade.rgb[1]
            )}, ${Math.floor(shade.rgb[2])})`
          )
        })
        rowCss.reverse().forEach((sampleCss) => css.push(sampleCss))
      }
    )
    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_CSS',
      data: css,
    })
  } else figma.notify(locals.en.error.corruption)
}

export default exportCss
