import {
  ColorSpaceConfiguration,
  Data,
  PaletteData,
  PaletteDataShadeItem,
} from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportJsonDtcg = (id: string, colorSpace: ColorSpaceConfiguration) => {
  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

  if (rawPalette === undefined || rawPalette === null)
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
    json: { [key: string]: any } = {}

  const setValueAccordingToColorSpace = (shade: PaletteDataShadeItem) => {
    const actions: { [action: string]: () => void } = {
      RGB: () => {
        return {
          colorSpace: 'srgb',
          components: [
            parseFloat(shade.gl[0].toFixed(3)),
            parseFloat(shade.gl[1].toFixed(3)),
            parseFloat(shade.gl[2].toFixed(3)),
          ],
          hex: shade.hex,
        }
      },
      OKLCH: () => {
        return {
          colorSpace: 'oklch',
          components: [
            parseFloat(shade.oklch[0].toFixed(3)),
            parseFloat(shade.oklch[1].toFixed(3)),
            parseFloat(shade.oklch[2].toFixed(0)),
          ],
          hex: shade.hex,
        }
      },
    }

    return actions[colorSpace ?? 'RGB']?.()
  }

  const setValueAccordingToColorSpaceAndAlpha = (
    source: PaletteDataShadeItem,
    shade: PaletteDataShadeItem
  ) => {
    const actions: { [action: string]: () => void } = {
      RGB: () => {
        return {
          colorSpace: 'srgb',
          components: [
            parseFloat(source.gl[0].toFixed(3)),
            parseFloat(source.gl[1].toFixed(3)),
            parseFloat(source.gl[2].toFixed(3)),
          ],
          hex: source.hex,
          alpha: shade.alpha,
        }
      },
      OKLCH: () => {
        return {
          colorSpace: 'oklch',
          components: [
            parseFloat(source.oklch[0].toFixed(3)),
            parseFloat(source.oklch[1].toFixed(3)),
            parseFloat(source.oklch[2].toFixed(0)),
          ],
          hex: source.hex,
          alpha: shade.alpha,
        }
      },
    }

    return actions[colorSpace ?? 'RGB']?.()
  }

  if (workingThemes[0].type === 'custom theme')
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        if (!json[color.name])
          json[color.name] = {
            $type: 'color',
          }

        color.shades.forEach((shade) => {
          if (!json[color.name][shade.name] && source)
            json[color.name][shade.name] = {
              $value: shade.isTransparent
                ? setValueAccordingToColorSpaceAndAlpha(source, shade)
                : setValueAccordingToColorSpace(shade),
              $extensions: {
                mode: {},
              },
            }
          if (source)
            json[color.name][shade.name].$extensions.mode[theme.name] =
              shade.isTransparent
                ? setValueAccordingToColorSpaceAndAlpha(source, shade)
                : setValueAccordingToColorSpace(shade)
        })
      })
    })
  else
    workingThemes.forEach((theme) => {
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        json[color.name] = {}
        color.shades.forEach((shade) => {
          if (shade && source)
            json[color.name][shade.name] = {
              $type: 'color',
              $value: shade.isTransparent
                ? setValueAccordingToColorSpaceAndAlpha(source, shade)
                : setValueAccordingToColorSpace(shade),
              $description:
                color.description !== ''
                  ? color.description +
                    locales.get().separator +
                    shade.description
                  : shade.description,
            }
        })
      })
    })

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_JSON',
    data: {
      id: '',
      context: 'TOKENS_DTCG',
      colorSpace: colorSpace,
      code: JSON.stringify(json, null, '  '),
    },
  })
}

export default exportJsonDtcg
