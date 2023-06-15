import setData from './setData'
import { presets } from './palettePackage'
import Colors from '../canvas/Colors'

const setPaletteMigration = (palette: BaseNode) => {
  if (palette.getPluginData('min') != '' || palette.getPluginData('max')) {
    palette.setPluginData('min', '')
    palette.setPluginData('max', '')
  }

  if (palette.getPluginData('preset') === '')
    palette.setPluginData('preset', JSON.stringify(presets.material))

  if (palette.getPluginData('algorithmVersion') === '')
    palette.setPluginData('algorithmVersion', 'v1')

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

  if (palette.getPluginData('textColorsTheme') === '') {
    palette.setPluginData(
      'textColorsTheme',
      JSON.stringify({
        lightColor: '#FFFFFF',
        darkColor: '#000000',
      })
    )
  }

  if (palette.getPluginData('view') === '')
    palette.setPluginData('view', 'PALETTE')

  if (palette.getPluginData('data') === '')
    new Colors(
      {
        paletteName: palette.getPluginData('name'),
        preset: JSON.parse(palette.getPluginData('preset')),
        scale: JSON.parse(palette.getPluginData('scale')),
        colors: JSON.parse(palette.getPluginData('colors')),
        view: 'SHEET',
        textColorsTheme: JSON.parse(palette.getPluginData('textColorsTheme')),
        algorithmVersion: palette.getPluginData('algorithmVersion'),
      },
      palette as FrameNode
    ).makePaletteData()
  
  // console.log(palette.getPluginDataKeys())
}

export default setPaletteMigration