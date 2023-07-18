import setData from './setData'
import Colors from '../canvas/Colors'
import { presets } from './palettePackage'
import { lang, locals } from '../content/locals'
import { uid } from 'uid'

const setPaletteMigration = (palette: BaseNode) => {
  const min = palette.getPluginData('min'),
    max = palette.getPluginData('max'),
    preset = palette.getPluginData('preset'),
    scale = palette.getPluginData('scale'),
    colors = JSON.parse(palette.getPluginData('colors')),
    colorSpace = palette.getPluginData('colorSpace'),
    themes = palette.getPluginData('themes'),
    captions = palette.getPluginData('captions'),
    properties = palette.getPluginData('properties'),
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
  if (!colors[0].hasOwnProperty('hueShifting'))
    palette.setPluginData('colors', setData(colors, 'hueShifting', 0))

  if (!colors[0].hasOwnProperty('description'))
    palette.setPluginData('colors', setData(colors, 'description', ''))

  if (!colors[0].hasOwnProperty('id'))
    palette.setPluginData('colors', JSON.stringify(
      colors.map(color => {
        color.id = uid()
        return color
      })
    ))

  if (
    colors.filter((color) => color.oklch).length ==
    colors.length
  )
    palette.setPluginData('colorSpace', 'OKLCH')

  if (colorSpace === '')
    palette.setPluginData('colorSpace', 'LCH')

  // themes
  if (themes === '')
    palette.setPluginData('themes', JSON.stringify([{
      name: locals[lang].themes.switchTheme.defaultTheme,
      description: '',
      scale: JSON.parse(scale),
      paletteBackground: '#FFFFFF',
      isEnabled: true,
      id: '00000000000'
    }]))

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
  if (algorithmVersion === '')
    palette.setPluginData('algorithmVersion', 'v1')

  // data
  if (
    palette.getPluginData('data') === '' ||
    JSON.parse(palette.getPluginData('data')).type == undefined
  )
    new Colors(
      {
        name: palette.getPluginData('name'),
        preset: JSON.parse(palette.getPluginData('preset')),
        scale: JSON.parse(palette.getPluginData('scale')),
        colors: JSON.parse(palette.getPluginData('colors')),
        colorSpace: palette.getPluginData('colorSpace'),
        themes: JSON.parse(palette.getPluginData(('themes'))),
        view: 'SHEET',
        textColorsTheme: JSON.parse(palette.getPluginData('textColorsTheme')),
        algorithmVersion: palette.getPluginData('algorithmVersion'),
      },
      palette as FrameNode
    ).makePaletteData('CREATE')
}

export default setPaletteMigration
