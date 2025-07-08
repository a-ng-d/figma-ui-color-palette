import { uid } from 'uid'
import { SourceColorConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../content/locales'

export let currentSelection: ReadonlyArray<SceneNode>
export let previousSelection: ReadonlyArray<SceneNode> | undefined
export let isSelectionChanged = false

const processSelection = () => {
  previousSelection =
    currentSelection === undefined ? undefined : currentSelection
  isSelectionChanged = true

  const selection: ReadonlyArray<BaseNode> = figma.currentPage.selection
  currentSelection = figma.currentPage.selection

  const viableSelection: Array<SourceColorConfiguration> = []

  const document: FrameNode | InstanceNode = selection[0] as
    | FrameNode
    | InstanceNode
  const selectionHandler = (state: string) => {
    const actions: { [key: string]: () => void } = {
      DOCUMENT_SELECTED: async () => {
        figma.ui.postMessage({
          type: 'DOCUMENT_SELECTED',
          data: {
            view: document.getPluginData('view'),
            id: document.getPluginData('id'),
            updatedAt: document.getPluginData('updatedAt'),
            isLinkedToPalette:
              figma.currentPage.getSharedPluginData(
                'uicp',
                `palette_${document.getPluginData('id')}`
              ) !== '',
          },
        })
        document.setRelaunchData({
          edit: locales.get().relaunch.edit.description,
        })
      },
      EMPTY_SELECTION: () =>
        figma.ui.postMessage({
          type: 'EMPTY_SELECTION',
          data: {},
        }),
      COLOR_SELECTED: () => {
        figma.ui.postMessage({
          type: 'COLOR_SELECTED',
          data: {
            selection: viableSelection,
          },
        })
      },
    }

    return actions[state]?.()
  }

  if (
    selection.length === 1 &&
    document.getPluginData('type') === 'UI_COLOR_PALETTE' &&
    document.type !== 'INSTANCE'
  )
    //setPaletteMigration(document) // Migration
    selectionHandler('DOCUMENT_SELECTED')
  else if (
    selection.length === 1 &&
    document.getPluginDataKeys().length > 0 &&
    document.type !== 'INSTANCE'
  )
    //setPaletteMigration(palette) // Migration
    selectionHandler('DOCUMENT_SELECTED')
  else if (selection.length === 0) selectionHandler('EMPTY_SELECTION')
  else if (selection.length > 1 && document.getPluginDataKeys().length !== 0)
    selectionHandler('EMPTY_SELECTION')
  else if (selection[0].type === 'INSTANCE') selectionHandler('EMPTY_SELECTION')
  else if ((selection[0] as FrameNode).fills === undefined)
    selectionHandler('EMPTY_SELECTION')
  else if (
    (selection[0] as FrameNode).fills &&
    ((selection[0] as FrameNode).fills as readonly Paint[]).length === 0
  )
    selectionHandler('EMPTY_SELECTION')

  selection.forEach((element) => {
    if (
      element.type !== 'CONNECTOR' &&
      element.type !== 'GROUP' &&
      element.type !== 'EMBED' &&
      element.type !== 'SLICE'
    ) {
      const foundColors = (
        (element as FrameNode).fills as readonly Paint[]
      ).filter((fill: Paint) => fill.type === 'SOLID')

      if (
        foundColors.length !== 0 &&
        element.getPluginDataKeys().length === 0
      ) {
        foundColors.forEach((solidFill: SolidPaint) => {
          viableSelection.push({
            name: (element as FrameNode).name,
            rgb: solidFill.color,
            source: 'CANVAS',
            id: uid(),
            isRemovable: false,
          })
        })
        selectionHandler('COLOR_SELECTED')
        element?.setRelaunchData({
          create: locales.get().relaunch.create.description,
        })
      }
    }
  })

  setTimeout(() => (isSelectionChanged = false), 1000)
}

export default processSelection
