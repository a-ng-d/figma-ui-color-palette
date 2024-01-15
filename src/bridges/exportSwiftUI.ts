import type { PaletteData } from '../utils/types'
import { locals, lang } from '../content/locals'
import { doCamelCase } from '@a-ng-d/figmug.modules.do-camel-case'

const exportSwiftUI = (palette: SceneNode) => {
  palette = figma.currentPage.selection[0] as FrameNode

  const paletteData: PaletteData = JSON.parse(palette.getPluginData('data')),
    workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length == 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    swift: Array<string> = []

  if (palette.children.length == 1) {
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const Colors: Array<string> = []
        Colors.unshift(
          `// ${
            workingThemes[0].type === 'custom theme' ? theme.name + ' - ' : ''
          }${color.name}`
        )
        color.shades.forEach((shade) => {
          Colors.unshift(
            `public let ${
              workingThemes[0].type === 'custom theme'
                ? doCamelCase(theme.name + ' ' + color.name)
                : doCamelCase(color.name)
            }${
              shade.name === 'source' ? 'Source' : shade.name
            } = Color(red: ${shade.gl[0].toFixed(
              3
            )}, green: ${shade.gl[1].toFixed(3)}, blue: ${shade.gl[2].toFixed(
              3
            )})`
          )
        })
        Colors.unshift('')
        Colors.reverse().forEach((color) => swift.push(color))
      })
    })

    swift.pop()

    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_SWIFTUI',
      data: swift,
    })
  } else figma.notify(locals[lang].error.corruption)
}

export default exportSwiftUI
