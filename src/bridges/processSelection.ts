import { setData } from './../utils/setData'
import { presets } from './../utils/palettePackage'

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
    // Migration
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

    if (palette.getPluginData('captions') == 'hasCaptions') {
      palette.setPluginData('properties', 'hasProperties')
      palette.setPluginData('captions', '')
    } else if (palette.getPluginData('captions') == 'hasNotCaptions') {
      palette.setPluginData('properties', 'hasNotProperties')
      palette.setPluginData('captions', '')
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
    

    // to UI
    figma.ui.postMessage({
      type: 'palette-selected',
      data: {
        name: palette.getPluginData('name'),
        scale: JSON.parse(palette.getPluginData('scale')),
        properties: palette.getPluginData('properties'),
        colors: JSON.parse(palette.getPluginData('colors')),
        textColorsTheme: JSON.parse(
          palette.getPluginData('textColorsTheme')
        ),
        algorithmVersion: palette.getPluginData('algorithmVersion'),
        preset: JSON.parse(palette.getPluginData('preset')),
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
