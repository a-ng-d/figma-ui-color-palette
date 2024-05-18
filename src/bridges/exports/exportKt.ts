import { doSnakeCase } from '@a-ng-d/figmug.modules.do-snake-case'

import { lang, locals } from '../../content/locals'
import type { PaletteData } from '../../utils/types'

const exportKt = (palette: FrameNode) => {
  const paletteData: PaletteData = JSON.parse(palette.getPluginData('data')),
    workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length == 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    val: Array<string> = []

  if (palette.children.length == 1) {
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const colors: Array<string> = []
        colors.unshift(
          `// ${
            workingThemes[0].type === 'custom theme' ? theme.name + ' - ' : ''
          }${color.name}`
        )
        color.shades.forEach((shade) => {
          colors.unshift(
            `val ${
              workingThemes[0].type === 'custom theme'
                ? doSnakeCase(theme.name + ' ' + color.name)
                : doSnakeCase(color.name)
            }_${shade.name} = Color(${shade.hex
              .replace('#', '0xFF')
              .toUpperCase()})`
          )
        })
        colors.unshift('')
        colors.reverse().forEach((color) => val.push(color))
      })
    })

    val.pop()

    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_KT',
      context: 'ANDROID_COMPOSE',
      data: val,
    })
  } else figma.notify(locals[lang].error.corruption)
}

export default exportKt
