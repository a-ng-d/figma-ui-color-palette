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
    // Migration
    if (selection[0].getPluginData('preset') === '')
      selection[0].setPluginData('preset', JSON.stringify(presets.material))

    if (selection[0].getPluginData('algorithmVersion') === '')
      selection[0].setPluginData('algorithmVersion', 'v1')

    if (!selection[0].getPluginData('colors').includes('oklch'))
      selection[0].setPluginData(
        'colors',
        setData(selection[0].getPluginData('colors'), 'oklch', false)
      )

    if (!selection[0].getPluginData('colors').includes('hueShifting'))
      selection[0].setPluginData(
        'colors',
        setData(selection[0].getPluginData('colors'), 'hueShifting', 0)
      )

    if (selection[0].getPluginData('captions') == 'hasCaptions') {
      selection[0].setPluginData('PROPERTIES', 'hasProperties')
      selection[0].setPluginData('captions', '')
    } else if (selection[0].getPluginData('captions') == 'hasNotCaptions') {
      selection[0].setPluginData('PROPERTIES', 'hasNotProperties')
      selection[0].setPluginData('captions', '')
    }

    if (selection[0].getPluginData('textColorsTheme') === '') {
      selection[0].setPluginData('textColorsTheme', JSON.stringify({
        lightColor: '#FFFFFF',
        darkColor: '#000000'
      }))
    }
      
    // to UI
    figma.ui.postMessage({
      type: 'palette-selected',
      data: {
        name: selection[0].getPluginData('name'),
        scale: JSON.parse(selection[0].getPluginData('scale')),
        properties: selection[0].getPluginData('properties'),
        colors: JSON.parse(selection[0].getPluginData('colors')),
        textColorsTheme: JSON.parse(selection[0].getPluginData('textColorsTheme')),
        algorithmVersion: selection[0].getPluginData('algorithmVersion'),
        preset: JSON.parse(selection[0].getPluginData('preset')),
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
