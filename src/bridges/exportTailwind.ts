import type { PaletteData } from '../utils/types'
import { locals, lang } from '../content/locals'
import { doKebabCase } from '@a-ng-d/figmug.modules.do-kebab-case'

const exportTailwind = (palette: SceneNode) => {
  palette = figma.currentPage.selection[0] as FrameNode

  const paletteData: PaletteData = JSON.parse(palette.getPluginData('data')),
    workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length == 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    json: { [key: string]: any } = {
      theme: {
        colors: {},
      },
    }

  paletteData.themes[0].colors.forEach((color) => {
    json['theme']['colors'][doKebabCase(color.name)] = {}
  })

  if (palette.children.length == 1) {
    if (workingThemes[0].type === 'custom theme')
      workingThemes.forEach((theme) => {
        theme.colors.forEach((color) => {
          json['theme']['colors'][doKebabCase(color.name)][
            doKebabCase(theme.name)
          ] = {}
          color.shades.reverse().forEach((shade) => {
            json['theme']['colors'][doKebabCase(color.name)][
              doKebabCase(theme.name)
            ][doKebabCase(shade.name)] = shade.hex
          })
        })
      })
    else
      workingThemes.forEach((theme) => {
        theme.colors.forEach((color) => {
          json['theme']['colors'][doKebabCase(color.name)] = {}
          color.shades.sort().forEach((shade) => {
            json['theme']['colors'][doKebabCase(color.name)][
              doKebabCase(shade.name)
            ] = shade.hex
          })
        })
      })

    figma.ui.postMessage({
      type: 'EXPORT_PALETTE_TAILWIND',
      context: 'TAILWIND',
      data: json,
    })
  } else figma.notify(locals[lang].error.corruption)
}

export default exportTailwind
