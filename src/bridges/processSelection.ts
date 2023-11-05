import { uid } from 'uid'
import type {
  ActionsList,
  SourceColorConfiguration,
  ThemeConfiguration,
} from '../utils/types'
import setPaletteMigration from '../utils/setPaletteMigration'

export let currentSelection: ReadonlyArray<SceneNode>
export let previousSelection: ReadonlyArray<SceneNode> | undefined
export let isSelectionChanged = false

const processSelection = () => {
  previousSelection =
    currentSelection == undefined ? undefined : currentSelection
  isSelectionChanged = true

  const selection: ReadonlyArray<BaseNode> = figma.currentPage.selection
  currentSelection = figma.currentPage.selection

  const readyToCreatePaletteSelection: Array<SourceColorConfiguration> = []

  const palette: FrameNode | InstanceNode = selection[0] as
    | FrameNode
    | InstanceNode
  const selectionHandler = (state: string) => {
    const actions: ActionsList = {
      PALETTE_SELECTED: () =>
        figma.ui.postMessage({
          type: 'PALETTE_SELECTED',
          data: {
            name: palette.getPluginData('name'),
            description: palette.getPluginData('description'),
            preset: JSON.parse(palette.getPluginData('preset')),
            scale: JSON.parse(palette.getPluginData('themes')).find(
              (theme: ThemeConfiguration) => theme.isEnabled
            ).scale,
            colors: JSON.parse(palette.getPluginData('colors')),
            colorSpace: palette.getPluginData('colorSpace'),
            themes: JSON.parse(palette.getPluginData('themes')),
            view: palette.getPluginData('view'),
            textColorsTheme: JSON.parse(
              palette.getPluginData('textColorsTheme')
            ),
            algorithmVersion: palette.getPluginData('algorithmVersion'),
          },
        }),
      EMPTY_SELECTION: () =>
        figma.ui.postMessage({
          type: 'EMPTY_SELECTION',
          data: {},
        }),
      COLOR_SELECTED: () => {
        figma.ui.postMessage({
          type: 'COLOR_SELECTED',
          data: readyToCreatePaletteSelection,
        })
      },
    }

    return actions[state]?.()
  }

  if (
    selection.length == 1 &&
    palette.getPluginData('type') === 'UI_COLOR_PALETTE' &&
    palette.type != 'INSTANCE'
  ) {
    setPaletteMigration(palette) // Migration
    selectionHandler('PALETTE_SELECTED')
  } else if (
    selection.length == 1 &&
    palette.getPluginDataKeys().length > 0 &&
    palette.type != 'INSTANCE'
  ) {
    setPaletteMigration(palette) // Migration
    selectionHandler('PALETTE_SELECTED')
  } else if (selection.length == 0) selectionHandler('EMPTY_SELECTION')
  else if (selection.length > 1 && palette.getPluginDataKeys().length != 0)
    selectionHandler('EMPTY_SELECTION')
  else if (selection[0].type === 'INSTANCE') selectionHandler('EMPTY_SELECTION')
  else if ((selection[0] as any).fills == undefined)
    selectionHandler('EMPTY_SELECTION')
  else if ((selection[0] as any).fills.length == 0)
    selectionHandler('EMPTY_SELECTION')

  selection.forEach((element) => {
    if (
      element.type != 'CONNECTOR' &&
      element.type != 'GROUP' &&
      element.type != 'EMBED'
    )
      if (
        (element as any).fills.filter((fill: Paint) => fill.type === 'SOLID')
          .length != 0 &&
        element.getPluginDataKeys().length == 0
      ) {
        readyToCreatePaletteSelection.push({
          name: (element as any).name,
          rgb: (element as any).fills[0].color,
          source: 'CANVAS',
          id: uid(),
        })
        selectionHandler('COLOR_SELECTED')
      }
  })

  setTimeout(() => (isSelectionChanged = false), 1000)
}

export default processSelection
