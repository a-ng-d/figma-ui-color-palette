import { uid } from 'uid'

import Colors from '../canvas/Colors'
import { lang, locals } from '../content/locals'
import {
  AlgorithmVersionConfiguration,
  ColorConfiguration,
  ColorSpaceConfiguration,
  VisionSimulationModeConfiguration,
} from '../types/configurations'
import { presets } from './palettePackage'
import setData from './setData'

const setPaletteMigration = (palette: BaseNode) => {
  const
    type = palette.getPluginData('type'),
    name = palette.getPluginData('name'),
    min = palette.getPluginData('min'),
    max = palette.getPluginData('max'),
    description = palette.getPluginData('description'),
    preset = palette.getPluginData('preset'),
    scale = palette.getPluginData('scale'),
    colors = palette.getPluginData('colors'),
    colorsObject: Array<ColorConfiguration> = JSON.parse(colors),
    colorSpace = palette.getPluginData('colorSpace'),
    visionSimulationMode = palette.getPluginData('visionSimulationMode'),
    themes = palette.getPluginData('themes'),
    captions = palette.getPluginData('captions'),
    properties = palette.getPluginData('properties'),
    textColorsTheme = palette.getPluginData('textColorsTheme'),
    algorithmVersion = palette.getPluginData('algorithmVersion'),
    data = palette.getPluginData('data'),
    isPublished = palette.getPluginData('isPublished'),
    isShared = palette.getPluginData('isShared'),
    createdAt = palette.getPluginData('createdAt'),
    updatedAt = palette.getPluginData('updatedAt')

  // id
  if (!isPublished) palette.setPluginData('id', '')

  // type
  if (type === '') palette.setPluginData('type', 'UI_COLOR_PALETTE')

  // min-max
  if (min !== '' || max !== '') {
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
  if (colorsObject.length !== 0) {
    if (!Object.prototype.hasOwnProperty.call(colorsObject[0], 'hueShifting'))
      palette.setPluginData('colors', setData(colorsObject, 'hueShifting', 0))

    if (!Object.prototype.hasOwnProperty.call(colorsObject[0], 'description'))
      palette.setPluginData('colors', setData(colorsObject, 'description', ''))

    if (!Object.prototype.hasOwnProperty.call(colorsObject[0], 'id'))
      palette.setPluginData(
        'colors',
        JSON.stringify(
          colorsObject.map((color) => {
            color.id = uid()
            return color
          })
        )
      )
  }

  if (
    colorsObject.filter((color) => color.oklch).length === colorsObject.length
  )
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
  if (captions === 'hasCaptions' || properties === 'hasProperties') {
    palette.setPluginData('captions', '')
    palette.setPluginData('properties', '')
    palette.setPluginData('view', 'PALETTE_WITH_PROPERTIES')
  } else if (
    captions === 'hasNotCaptions' ||
    properties === 'hasNotProperties'
  ) {
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
  if (data === '' || JSON.parse(data).type === undefined)
    new Colors(
      {
        name: name,
        description: palette.getPluginData('description'),
        preset: JSON.parse(palette.getPluginData('preset')),
        scale: JSON.parse(palette.getPluginData('scale')),
        colors: JSON.parse(palette.getPluginData('colors')),
        colorSpace: palette.getPluginData(
          'colorSpace'
        ) as ColorSpaceConfiguration,
        visionSimulationMode: palette.getPluginData(
          'visionSimulationMode'
        ) as VisionSimulationModeConfiguration,
        themes: JSON.parse(palette.getPluginData('themes')),
        view: 'SHEET',
        textColorsTheme: JSON.parse(palette.getPluginData('textColorsTheme')),
        algorithmVersion: palette.getPluginData(
          'algorithmVersion'
        ) as AlgorithmVersionConfiguration,
      },
      palette as FrameNode
    ).makePaletteData('CREATE')

  // publication and share
  if (isPublished === '') palette.setPluginData('isPublished', 'false')
  if (isShared === '') palette.setPluginData('isShared', 'false')

  // created, updated and published
  if (createdAt === '')
    palette.setPluginData('createdAt', new Date().toISOString())
  if (updatedAt === '')
    palette.setPluginData('updatedAt', new Date().toISOString())
}

export default setPaletteMigration
