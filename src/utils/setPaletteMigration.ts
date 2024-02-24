import type {
  AlgorithmVersionConfiguration,
  visionSimulationModeConfiguration,
  ColorConfiguration,
  ColorSpaceConfiguration,
} from './types'
import setData from './setData'
import Colors from '../canvas/Colors'
import { presets } from './palettePackage'
import { lang, locals } from '../content/locals'
import { uid } from 'uid'

const setPaletteMigration = (palette: BaseNode) => {
  const id = palette.getPluginData('id'),
    type = palette.getPluginData('type'),
    min = palette.getPluginData('min'),
    max = palette.getPluginData('max'),
    description = palette.getPluginData('description'),
    preset = palette.getPluginData('preset'),
    scale = palette.getPluginData('scale'),
    colors: Array<ColorConfiguration> = JSON.parse(
      palette.getPluginData('colors')
    ),
    colorSpace = palette.getPluginData('colorSpace'),
    visionSimulationMode = palette.getPluginData('visionSimulationMode'),
    themes = palette.getPluginData('themes'),
    captions = palette.getPluginData('captions'),
    properties = palette.getPluginData('properties'),
    textColorsTheme = palette.getPluginData('textColorsTheme'),
    algorithmVersion = palette.getPluginData('algorithmVersion')

  // id
  if (id === '') palette.setPluginData('id', uid())

  // type
  if (type === '') palette.setPluginData('type', 'UI_COLOR_PALETTE')

  // min-max
  if (min != '' || max != '') {
    palette.setPluginData('min', '')
    palette.setPluginData('max', '')
  }

  // description
  if (description === '') palette.setPluginData('description', '')

  // preset
  if (preset === '')
    palette.setPluginData(
      'preset',
      JSON.stringify(presets.find((preset) => preset.id === 'MATERIAL'))
    )

  // colors
  if (colors.length != 0) {
    if (!Object.prototype.hasOwnProperty.call(colors[0], 'hueShifting'))
      palette.setPluginData('colors', setData(colors, 'hueShifting', 0))

    if (!Object.prototype.hasOwnProperty.call(colors[0], 'description'))
      palette.setPluginData('colors', setData(colors, 'description', ''))

    if (!Object.prototype.hasOwnProperty.call(colors[0], 'id'))
      palette.setPluginData(
        'colors',
        JSON.stringify(
          colors.map((color) => {
            color.id = uid()
            return color
          })
        )
      )
  }

  if (colors.filter((color) => color.oklch).length == colors.length)
    palette.setPluginData('colorSpace', 'OKLCH')

  if (colorSpace === '') palette.setPluginData('colorSpace', 'LCH')

  if (visionSimulationMode === '')
    palette.setPluginData('visionSimulationMode', 'NONE')

  // themes
  if (themes === '')
    palette.setPluginData(
      'themes',
      JSON.stringify([
        {
          name: locals[lang].themes.switchTheme.defaultTheme,
          description: '',
          scale: JSON.parse(scale),
          paletteBackground: '#FFFFFF',
          isEnabled: true,
          id: '00000000000',
          type: 'default theme',
        },
      ])
    )

  // view
  if (captions == 'hasCaptions' || properties == 'hasProperties') {
    palette.setPluginData('captions', '')
    palette.setPluginData('properties', '')
    palette.setPluginData('view', 'PALETTE_WITH_PROPERTIES')
  } else if (captions == 'hasNotCaptions' || properties == 'hasNotProperties') {
    palette.setPluginData('captions', '')
    palette.setPluginData('properties', '')
    palette.setPluginData('view', 'PALETTE')
  }

  // textColorsTheme
  if (textColorsTheme === '') {
    palette.setPluginData(
      'textColorsTheme',
      JSON.stringify({
        lightColor: '#FFFFFF',
        darkColor: '#000000',
      })
    )
  }

  // algorithm
  if (algorithmVersion === '') palette.setPluginData('algorithmVersion', 'v1')

  // data
  if (
    palette.getPluginData('data') === '' ||
    JSON.parse(palette.getPluginData('data')).type == undefined
  )
    new Colors(
      {
        name: palette.getPluginData('name'),
        description: palette.getPluginData('description'),
        preset: JSON.parse(palette.getPluginData('preset')),
        scale: JSON.parse(palette.getPluginData('scale')),
        colors: JSON.parse(palette.getPluginData('colors')),
        colorSpace: palette.getPluginData(
          'colorSpace'
        ) as ColorSpaceConfiguration,
        visionSimulationMode: palette.getPluginData(
          'visionSimulationMode'
        ) as visionSimulationModeConfiguration,
        themes: JSON.parse(palette.getPluginData('themes')),
        view: 'SHEET',
        textColorsTheme: JSON.parse(palette.getPluginData('textColorsTheme')),
        algorithmVersion: palette.getPluginData(
          'algorithmVersion'
        ) as AlgorithmVersionConfiguration,
      },
      palette as FrameNode
    ).makePaletteData('CREATE')
}

export default setPaletteMigration
