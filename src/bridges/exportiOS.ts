import { PaletteDataItem } from '../utils/types'
import { locals } from '../content/locals'

const exportiOS = (palette) => {
  palette = figma.currentPage.selection[0]
  const iOS: Array<string> = []

  if (palette.children.length == 1) {
    JSON.parse(palette.getPluginData('data')).forEach(
      (color: PaletteDataItem) => {
        const UIColors: Array<string> = []
        color.shades.forEach((shade) => {
          UIColors.unshift(
            `// ${color.name}/${shade.name}\nconst ${color.name.charAt(0) + color.name.slice(1).toLowerCase()}${shade.name === 'source' ? 'Source' : shade.name} = UIColor(red: ${shade.gl[0].toFixed(3)}, green: ${shade.gl[1].toFixed(3)}, blue: ${shade.gl[2].toFixed(3)}), alpha: 1).cgColor`
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
