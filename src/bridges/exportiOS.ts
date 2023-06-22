import { PaletteDataItem } from '../utils/types'
import { locals } from '../content/locals'

const exportiOS = (palette) => {
  palette = figma.currentPage.selection[0]
  const iOS: Array<string> = []

  if (palette.children.length == 1) {
    JSON.parse(palette.getPluginData('data')).forEach(
      (color: PaletteDataItem) => {
        const UIColors: Array<string> = []
        UIColors.unshift(`// ${color.name}`)
        color.shades.forEach((shade) => {
          UIColors.unshift(
            `static let ${color.name.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())}${shade.name === 'source' ? 'Source' : shade.name} = Color(red: ${shade.gl[0].toFixed(3)}, green: ${shade.gl[1].toFixed(3)}, blue: ${shade.gl[2].toFixed(3)})`
          )
        })
        UIColors.reverse().forEach((UIColor) => iOS.push(UIColor))
      }
    )
    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_IOS',
      data: iOS,
    })
  } else figma.notify(locals.en.error.corruption)
}

export default exportiOS
