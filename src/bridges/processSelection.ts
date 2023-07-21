import setPaletteMigration from '../utils/setPaletteMigration'

export let currentSelection: ReadonlyArray<SceneNode>
export let previousSelection: ReadonlyArray<SceneNode>
export let isSelectionChanged = false

const processSelection = () => {
  previousSelection =
    currentSelection == undefined ? undefined : currentSelection
  isSelectionChanged = true

  const selection: ReadonlyArray<BaseNode> = figma.currentPage.selection
  currentSelection = figma.currentPage.selection

  if (selection.length == 1 && selection[0].getPluginDataKeys().length > 0) {
    const palette: BaseNode = selection[0]

    // Migration
    setPaletteMigration(palette)
    console.log(JSON.parse(palette.getPluginData('colors')))

    // to UI
    figma.ui.postMessage({
      type: 'PALETTE_SELECTED',
      data: {
        name: palette.getPluginData('name'),
        preset: JSON.parse(palette.getPluginData('preset')),
        scale: JSON.parse(palette.getPluginData('themes')).find(
          (theme) => theme.isEnabled
        ).scale,
        colors: JSON.parse(palette.getPluginData('colors')),
        colorSpace: palette.getPluginData('colorSpace'),
        themes: JSON.parse(palette.getPluginData('themes')),
        view: palette.getPluginData('view'),
        textColorsTheme: JSON.parse(palette.getPluginData('textColorsTheme')),
        algorithmVersion: palette.getPluginData('algorithmVersion'),
      },
    })
  } else if (
    selection.length == 0 ||
    (selection.length > 1 && selection[0].getPluginDataKeys().length != 0) ||
    selection.find((element) => (element as any).fills.length == 0)
  )
    figma.ui.postMessage({
      type: 'EMPTY_SELECTION',
      data: {},
    })

  selection.forEach((element) => {
    if (
      element.type != 'CONNECTOR' &&
      element.type != 'GROUP' &&
      element.type != 'EMBED'
    )
      if (
        element['fills'].filter((fill) => fill.type === 'SOLID').length != 0 &&
        element.getPluginDataKeys().length == 0
      )
        figma.ui.postMessage({
          type: 'COLOR_SELECTED',
          data: {},
        })
  })

  setTimeout(() => (isSelectionChanged = false), 1000)
}

export default processSelection
