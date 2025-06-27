import chroma from 'chroma-js'
import { Data, PaletteData } from '@a_ng_d/utils-ui-color-palette'
import { Case } from '@a_ng_d/figmug-utils'
import { locales } from '../../content/locales'

const exportXml = (id: string) => {
  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_XML',
      data: {
        id: '',
        context: 'ANDROID_XML',
        code: locales.get().error.export,
      },
    })

  const paletteData: PaletteData = new Data(
      JSON.parse(rawPalette)
    ).makePaletteData(),
    workingThemes =
      paletteData.themes.filter((theme) => theme.type === 'custom theme')
        .length === 0
        ? paletteData.themes.filter((theme) => theme.type === 'default theme')
        : paletteData.themes.filter((theme) => theme.type === 'custom theme'),
    resources: Array<string> = []

  workingThemes.forEach((theme) => {
    theme.colors.forEach((color) => {
      const source = color.shades.find((shade) => shade.type === 'source color')
      const colors: Array<string> = []

      colors.push(
        `${'<'}!--${
          workingThemes[0].type === 'custom theme'
            ? `${theme.name} - ${color.name}--${'>'}`
            : `${color.name}--${'>'}`
        }`
      )
      color.shades.reverse().forEach((shade) => {
        colors.push(
          `<color name="${
            workingThemes[0].type === 'custom theme'
              ? new Case(theme.name + ' ' + color.name).doSnakeCase()
              : new Case(color.name).doSnakeCase()
          }_${shade.name}">${
            shade.isTransparent
              ? chroma(source?.hex ?? '#000000')
                  .alpha(shade.alpha ?? 1)
                  .hex()
              : shade.hex
          }</color>`
        )
      })
      colors.push('')
      colors.forEach((color) => resources.push(color))
    })
  })

  resources.pop()

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_XML',
    data: {
      id: '',
      context: 'ANDROID_XML',
      code: `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n  ${resources.join(
        '\n  '
      )}\n</resources>`,
    },
  })
}

export default exportXml
