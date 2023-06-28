import setData from './setData'
import { presets } from './palettePackage'
import Colors from '../canvas/Colors'

const setPaletteMigration = (palette: BaseNode) => {
  const
    min = palette.getPluginData('min'),
    max = palette.getPluginData('max'),
    preset = palette.getPluginData('preset'),
    scale = palette.getPluginData('scale'),
    colors = palette.getPluginData('colors'),
    colorSpace = palette.getPluginData('colorSpace'),
    captions = palette.getPluginData('captions'),
    properties = palette.getPluginData('properties'),
    view = palette.getPluginData('view'),
    textColorsTheme = palette.getPluginData('textColorsTheme'),
    algorithmVersion = palette.getPluginData('algorithmVersion')

  // min-max
  if (min != '' || max != '') {
    palette.setPluginData('min', '')
    palette.setPluginData('max', '')
  }

  // preset
  if (preset === '')
    palette.setPluginData('preset', JSON.stringify(presets.material))

  // colors
  if (!colors.includes('oklch'))
    palette.setPluginData(
      'colors',
      setData(colors, 'oklch', false)
    )

  if (!colors.includes('hueShifting'))
    palette.setPluginData(
      'colors',
      setData(colors, 'hueShifting', 0)
    )

  if (JSON.parse(colors).filter(color => color.oklch).length == JSON.parse(colors).length)
    palette.setPluginData('colorSpace', 'OKLCH')
  
  if (colorSpace === '')
    palette.setPluginData('colorSpace', 'LCH')
  
  // view
  if (
    captions == 'hasCaptions' ||
    properties == 'hasProperties'
  ) {
    palette.setPluginData('captions', '')
    palette.setPluginData('properties', '')
    palette.setPluginData('view', 'PALETTE_WITH_PROPERTIES')
  } else if (
    captions == 'hasNotCaptions' ||
    properties == 'hasNotProperties'
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
  if (algorithmVersion === '')
    palette.setPluginData('algorithmVersion', 'v1')

  // data
  if (palette.getPluginData('data') === '')
    new Colors(
      {
        name: palette.getPluginData('name'),
        preset: JSON.parse(palette.getPluginData('preset')),
        scale: JSON.parse(palette.getPluginData('scale')),
        colors: JSON.parse(palette.getPluginData('colors')),
        colorSpace: palette.getPluginData('colorSpace'),
        view: 'SHEET',
        textColorsTheme: JSON.parse(palette.getPluginData('textColorsTheme')),
        algorithmVersion: palette.getPluginData('algorithmVersion'),
      },
      palette as FrameNode
    ).makePaletteData()
}

export default setPaletteMigration
