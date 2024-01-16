import type { PaletteData } from '../utils/types'
import { locals, lang } from '../content/locals'
import { doSnakeCase } from '@a-ng-d/figmug.modules.do-snake-case'

const exportXml = (palette: SceneNode) => {
  palette = figma.currentPage.selection[0] as FrameNode

  const paletteData: PaletteData = JSON.parse(palette.getPluginData('data')),
    workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length == 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    resources: Array<string> = []

  if (palette.children.length == 1) {
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const colors: Array<string> = []
        colors.unshift(
          `<!--${
            workingThemes[0].type === 'custom theme' ? theme.name + ' - ' : ''
          }${color.name}-->`
        )
        color.shades.forEach((shade) => {
          colors.unshift(
            `<color name="${
              workingThemes[0].type === 'custom theme'
                ? doSnakeCase(theme.name + ' ' + color.name)
                : doSnakeCase(color.name)
            }_${shade.name}">${shade.hex}</color>`
          )
        })
        colors.unshift('')
        colors.reverse().forEach((color) => resources.push(color))
      })
    })

    resources.pop()

    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_XML',
      context: 'ANDROID_XML',
      data: resources,
    })
  } else figma.notify(locals[lang].error.corruption)
}

export default exportXml
