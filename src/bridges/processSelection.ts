import { setData } from './../utils/setData'
import { presets } from './../utils/palettePackage'
import Colors from '../canvas/Colors'

export let currentSelection: ReadonlyArray<SceneNode>
export let previousSelection: ReadonlyArray<SceneNode>
export let isSelectionChanged = false

const processSelection = () => {
  previousSelection =
    currentSelection == undefined ? undefined : currentSelection
  isSelectionChanged = true

  const selection: ReadonlyArray<BaseNode> = figma.currentPage.selection
  currentSelection = figma.currentPage.selection

  if (selection.length == 1 && selection[0].getPluginData('scale') != '') {
    const palette: BaseNode = selection[0]
    console.log(palette.getPluginDataKeys())
    // Migration
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

    if (palette.getPluginData('captions') == 'hasCaptions' || palette.getPluginData('properties') == 'hasProperties') {
      palette.setPluginData('captions', '')
      palette.setPluginData('properties', '')
      palette.setPluginData('view', 'PALETTE_WITH_PROPERTIES')
    } else if (palette.getPluginData('captions') == 'hasNotCaptions' || palette.getPluginData('properties') == 'hasNotProperties') {
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
      new Colors({ 
        paletteName: palette.getPluginData('name'),
        colors: JSON.parse(palette.getPluginData('colors')),
        scale: JSON.parse(palette.getPluginData('scale')),
        properties: palette.getPluginData('properties') == 'hasProperties' ? true : false,
        preset: JSON.parse(palette.getPluginData('preset')),
        textColorsTheme: JSON.parse(palette.getPluginData('textColorsTheme')),
        view: 'SHEET',
        algorithmVersion: palette.getPluginData('algorithmVersion'),
      }, selection[0] as FrameNode).makePaletteData()

    // to UI
    figma.ui.postMessage({
      type: 'palette-selected',
      data: {
        name: palette.getPluginData('name'),
        colors: JSON.parse(palette.getPluginData('colors')),
        scale: JSON.parse(palette.getPluginData('scale')),
        properties: palette.getPluginData('properties'),
        preset: JSON.parse(palette.getPluginData('preset')),
        textColorsTheme: JSON.parse(
          palette.getPluginData('textColorsTheme')
        ),
        view: palette.getPluginData('view'),
        algorithmVersion: palette.getPluginData('algorithmVersion'),
        
      },
    })
  } else if (
    selection.length == 0 ||
    (selection.length > 1 && selection[0].getPluginData('scale') != '')
  )
    figma.ui.postMessage({
      type: 'empty-selection',
      data: {},
    })

  selection.forEach((element) => {
    if (element.type != 'GROUP')
      if (
        element['fills'].filter((fill) => fill.type === 'SOLID').length != 0 &&
        element.getPluginData('scale') === ''
      )
        figma.ui.postMessage({
          type: 'color-selected',
          data: {},
        })
  })

  setTimeout(() => (isSelectionChanged = false), 1000)
}

export default processSelection
