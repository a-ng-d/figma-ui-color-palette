import setData from './setData'
import { presets } from './palettePackage'
import Colors from '../canvas/Colors'

const setPaletteMigration = (palette: BaseNode) => {
  // min-max
  if (palette.getPluginData('min') != '' || palette.getPluginData('max')) {
    palette.setPluginData('min', '')
    palette.setPluginData('max', '')
  }

  // preset
  if (palette.getPluginData('preset') === '')
    palette.setPluginData('preset', JSON.stringify(presets.material))

  // colors
  if (!palette.getPluginData('colors').includes('oklch'))
    palette.setPluginData(
      'colors',
      setData(palette.getPluginData('colors'), 'oklch', false)
    )

  if (!palette.getPluginData('colors').includes('hueShifting'))
    palette.setPluginData(
      'colors',
      setData(palette.getPluginData('colors'), 'hueShifting', 0)
    )

  if (JSON.parse(palette.getPluginData('colors')).filter(color => color.oklch).length == JSON.parse(palette.getPluginData('colors')).length)
      palette.setPluginData('colorSpace', 'OKLCH')
  
  if (palette.getPluginData('colorSpace') === '')
    palette.setPluginData('colorSpace', 'LCH')
  
  // view
  if (
    palette.getPluginData('captions') == 'hasCaptions' ||
    palette.getPluginData('properties') == 'hasProperties'
  ) {
    palette.setPluginData('captions', '')
    palette.setPluginData('properties', '')
    palette.setPluginData('view', 'PALETTE_WITH_PROPERTIES')
  } else if (
    palette.getPluginData('captions') == 'hasNotCaptions' ||
    palette.getPluginData('properties') == 'hasNotProperties'
  ) {
    palette.setPluginData('captions', '')
    palette.setPluginData('properties', '')
    palette.setPluginData('view', 'PALETTE')
  }

  if (palette.getPluginData('view') === '')
    palette.setPluginData('view', 'PALETTE')

  // textColorsTheme
  if (palette.getPluginData('textColorsTheme') === '') {
    palette.setPluginData(
      'textColorsTheme',
      JSON.stringify({
        lightColor: '#FFFFFF',
        darkColor: '#000000',
      })
    )
  }

  // algorithm
  if (palette.getPluginData('algorithmVersion') === '')
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
