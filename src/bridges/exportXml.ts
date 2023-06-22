import { PaletteDataItem } from '../utils/types'
import { locals } from '../content/locals'

const exportXml = (palette) => {
  palette = figma.currentPage.selection[0]
  const resources: Array<string> = []

  if (palette.children.length == 1) {
    JSON.parse(palette.getPluginData('data')).forEach(
      (color: PaletteDataItem) => {
        const colors: Array<string> = []
        colors.unshift(`<!--${color.name}-->`)
        color.shades.forEach((shade) => {
          colors.unshift(
            `<color name="${color.name.toLowerCase().split(' ').join('_')}_${shade.name}">${shade.hex}</color>`
          )
        })
        colors.unshift('')
        colors.reverse().forEach((color) => resources.push(color))
      }
    )
    resources.pop()
    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_XML',
      data: resources,
    })
  } else figma.notify(locals.en.error.corruption)
}

export default exportXml
