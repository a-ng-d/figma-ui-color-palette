import chroma from 'chroma-js'
import {
  Data,
  PaletteData,
  PaletteDataColorItem,
  PaletteDataShadeItem,
} from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportJsonTokensStudio = (id: string) => {
  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

  if (rawPalette === '')
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_JSON',
      data: {
        id: '',
        context: 'TOKENS_AMZN_STYLE_DICTIONARY',
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
      $themes: [],
      $metadata: {
        activeThemes: [],
        tokenSetOrder: [],
        activeSets: [],
      },
    }

  const paletteName = JSON.parse(rawPalette).base.name

  const model = (
    color: PaletteDataColorItem,
    shade: PaletteDataShadeItem,
    source: PaletteDataShadeItem
  ) => {
    return {
      $type: 'color',
      $value: shade.isTransparent
        ? chroma(source.hex)
            .alpha(shade.alpha ?? 1)
            .hex()
        : shade.hex,
      $description:
        color.description !== ''
          ? color.description + locales.get().separator + shade.description
          : shade.description,
    }
  }

  if (workingThemes[0].type === 'custom theme')
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        json[`${theme.name}/${color.name}`] = {}
        color.shades.forEach((shade) => {
          if (shade && source)
            json[`${theme.name}/${color.name}`][shade.name] = model(
              color,
              shade,
              source
            )
        })
      })
    })
  else
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        json[`${paletteName}/${color.name}`] = {}
        color.shades.forEach((shade) => {
          if (shade && source)
            json[`${paletteName}/${color.name}`][shade.name] = model(
              color,
              shade,
              source
            )
        })
      })
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_JSON',
    data: {
      id: '',
      context: 'TOKENS_TOKENS_STUDIO',
      code: JSON.stringify(json, null, '  '),
    },
  })
}

export default exportJsonTokensStudio
