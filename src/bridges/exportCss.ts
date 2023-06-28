import { PaletteDataItem } from '../utils/types'
import { locals, lang } from '../content/locals'

const exportCss = (palette) => {
  palette = figma.currentPage.selection[0]
  const css: Array<string> = []

  if (palette.children.length == 1) {
    JSON.parse(palette.getPluginData('data')).forEach(
      (color: PaletteDataItem) => {
        const rowCss: Array<string> = []
        rowCss.unshift(`/* ${color.name} */`)
        color.shades.forEach((shade) => {
          rowCss.unshift(
            `--${color.name
              .toLowerCase()
              .split(' ')
              .join('-')
              .replace(/[@/$^%#&!?,;:+=<>(){}\[\]"«»]/g, '-')}-${
              shade.name
            }: rgb(${Math.floor(shade.rgb[0])}, ${Math.floor(
              shade.rgb[1]
            )}, ${Math.floor(shade.rgb[2])});`
          )
        })
        rowCss.unshift('')
        rowCss.reverse().forEach((sampleCss) => css.push(sampleCss))
      }
    )
    css.pop()
    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_CSS',
      data: css,
    })
  } else figma.notify(locals[lang].error.corruption)
}

export default exportCss
