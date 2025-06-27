import { Case } from '@a_ng_d/figmug-utils'
import { Data, PaletteData } from '@a_ng_d/utils-ui-color-palette'
import chroma from 'chroma-js'
import { locales } from '../../content/locales'

const exportTailwind = (id: string) => {
  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_TAILWIND',
      data: {
        id: '',
        context: 'TAILWIND',
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: { [key: string]: any } = {
      theme: {
        colors: {},
      },
    }

  paletteData.themes[0].colors.forEach((color) => {
    json['theme']['colors'][new Case(color.name).doKebabCase()] = {}
  })

  if (workingThemes[0].type === 'custom theme')
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        json['theme']['colors'][new Case(color.name).doKebabCase()][
          new Case(theme.name).doKebabCase()
        ] = {}
        color.shades.forEach((shade) => {
          json['theme']['colors'][new Case(color.name).doKebabCase()][
            new Case(theme.name).doKebabCase()
          ][new Case(shade.name).doKebabCase()] = shade.isTransparent
            ? chroma(source?.hex ?? '#000000')
                .alpha(shade.alpha ?? 1)
                .hex()
            : shade.hex
        })
      })
    })
  else
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        json['theme']['colors'][new Case(color.name).doKebabCase()] = {}
        color.shades.sort().forEach((shade) => {
          json['theme']['colors'][new Case(color.name).doKebabCase()][
            new Case(shade.name).doKebabCase()
          ] = shade.isTransparent
            ? chroma(source?.hex ?? '#000000')
                .alpha(shade.alpha ?? 1)
                .hex()
            : shade.hex
        })
      })
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_TAILWIND',
    data: {
      id: '',
      context: 'TAILWIND',
      code: json,
    },
  })
}

export default exportTailwind
