import {
  Data,
  PaletteData,
  PaletteDataShadeItem,
} from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const exportJson = (id: string) => {
  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

  if (rawPalette === undefined || rawPalette === null)
    return figma.ui.postMessage({
      type: 'EXPORT_PALETTE_JSON',
      data: {
        id: '',
        context: 'TOKENS_GLOBAL',
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

  const model = (shade: PaletteDataShadeItem) => {
    return {
      rgb: {
        r: Math.floor(shade.rgb[0]),
        g: Math.floor(shade.rgb[1]),
        b: Math.floor(shade.rgb[2]),
      },
      gl: {
        r: parseFloat(shade.gl[0].toFixed(3)),
        g: parseFloat(shade.gl[1].toFixed(3)),
        b: parseFloat(shade.gl[2].toFixed(3)),
      },
      lch: {
        l: Math.floor(shade.lch[0]),
        c: Math.floor(shade.lch[1]),
        h: Math.floor(shade.lch[2]),
      },
      oklch: {
        l: parseFloat(shade.oklch[0].toFixed(3)),
        c: parseFloat(shade.oklch[1].toFixed(3)),
        h: Math.floor(shade.oklch[2]),
      },
      lab: {
        l: Math.floor(shade.lab[0]),
        a: Math.floor(shade.lab[1]),
        b: Math.floor(shade.lab[2]),
      },
      oklab: {
        l: parseFloat(shade.oklab[0].toFixed(3)),
        a: parseFloat(shade.oklab[1].toFixed(3)),
        b: parseFloat(shade.oklab[2].toFixed(3)),
      },
      hsl: {
        h: Math.floor(shade.hsl[0]),
        s: Math.floor(shade.hsl[1] * 100),
        l: Math.floor(shade.hsl[2] * 100),
      },
      hsluv: {
        h: Math.floor(shade.hsluv[0]),
        s: Math.floor(shade.hsluv[1]),
        l: Math.floor(shade.hsluv[2]),
      },
      hex: shade.hex,
      description: shade.description,
      type: 'color shade',
    }
  }

  const modelWithAlpha = (
    shade: PaletteDataShadeItem,
    source: PaletteDataShadeItem
  ) => {
    return {
      rgb: {
        r: Math.floor(source.rgb[0]),
        g: Math.floor(source.rgb[1]),
        b: Math.floor(source.rgb[2]),
      },
      gl: {
        r: parseFloat(source.gl[0].toFixed(3)),
        g: parseFloat(source.gl[1].toFixed(3)),
        b: parseFloat(source.gl[2].toFixed(3)),
      },
      lch: {
        l: Math.floor(source.lch[0]),
        c: Math.floor(source.lch[1]),
        h: Math.floor(source.lch[2]),
      },
      oklch: {
        l: parseFloat(source.oklch[0].toFixed(3)),
        c: parseFloat(source.oklch[1].toFixed(3)),
        h: Math.floor(source.oklch[2]),
      },
      lab: {
        l: Math.floor(source.lab[0]),
        a: Math.floor(source.lab[1]),
        b: Math.floor(source.lab[2]),
      },
      oklab: {
        l: parseFloat(source.oklab[0].toFixed(3)),
        a: parseFloat(source.oklab[1].toFixed(3)),
        b: parseFloat(source.oklab[2].toFixed(3)),
      },
      hsl: {
        h: Math.floor(source.hsl[0]),
        s: Math.floor(source.hsl[1] * 100),
        l: Math.floor(source.hsl[2] * 100),
      },
      hsluv: {
        h: Math.floor(source.hsluv[0]),
        s: Math.floor(source.hsluv[1]),
        l: Math.floor(source.hsluv[2]),
      },
      hex: source.hex,
      alpha: shade.alpha,
      description: shade.description,
      type: 'color shade',
    }
  }

  if (workingThemes[0].type === 'custom theme')
    workingThemes.forEach((theme) => {
      json[theme.name] = {}
      theme.colors.forEach((color) => {
        const source = color.shades.find(
          (shade) => shade.type === 'source color'
        )

        json[theme.name][color.name] = {}
        color.shades.forEach((shade) => {
          if (shade && source)
            json[theme.name][color.name][shade.name] = shade.isTransparent
              ? modelWithAlpha(shade, source)
              : model(shade)
        })
        json[theme.name][color.name]['description'] = color.description
        json[theme.name][color.name]['type'] = 'color'
      })
      json[theme.name]['description'] = theme.description
      json[theme.name]['type'] = 'color theme'
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
            json[color.name][shade.name] = shade.isTransparent
              ? modelWithAlpha(shade, source)
              : model(shade)
        })
        json[color.name]['description'] = color.description
        json[color.name]['type'] = 'color'
      })
    })

  json['descrption'] = paletteData.description
  json['type'] = 'color palette'

  return figma.ui.postMessage({
    type: 'EXPORT_PALETTE_JSON',
    data: {
      id: '',
      context: 'TOKENS_GLOBAL',
      code: JSON.stringify(json, null, '  '),
    },
  })
}

export default exportJson
