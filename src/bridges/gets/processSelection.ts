import { uid } from 'uid'
import { SourceColorConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { tolgee } from '../..'

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectionHandler = (state: string, data?: any) => {
    const actions: { [key: string]: () => void } = {
      DOCUMENT_SELECTED: async () => {
        figma.ui.postMessage({
          type: 'DOCUMENT_SELECTED',
          data: {
            view: document.getSharedPluginData('uicp', 'view'),
            id: document.getSharedPluginData('uicp', 'id'),
            updatedAt: document.getSharedPluginData('uicp', 'updatedAt'),
            isLinkedToPalette:
              figma.currentPage.getSharedPluginData(
                'uicp',
                `palette_${document.getSharedPluginData('uicp', 'id')}`
              ) !== '',
          },
        })
        document.setRelaunchData({
          edit: tolgee.t('relaunch.edit.description'),
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
      IMAGE_SELECTED: () => {
        figma.ui.postMessage({
          type: 'GET_IMAGE_HASH',
          data: {
            arrayBuffer: data.arrayBuffer,
            name: data.element.name,
          },
        })
      },
    }

    return actions[state]?.()
  }

  if (
    selection.length === 1 &&
    document.getSharedPluginData('uicp', 'type') === 'UI_COLOR_PALETTE' &&
    document.type !== 'INSTANCE'
  )
    selectionHandler('DOCUMENT_SELECTED')
  else if (
    selection.length === 1 &&
    document.getSharedPluginDataKeys('uicp').length > 0 &&
    document.type !== 'INSTANCE'
  )
    selectionHandler('DOCUMENT_SELECTED')
  else if (selection.length === 0) selectionHandler('EMPTY_SELECTION')
  else if (
    selection.length > 1 &&
    document.getSharedPluginDataKeys('uicp').length !== 0
  )
    selectionHandler('EMPTY_SELECTION')
  else if (selection[0].type === 'INSTANCE') selectionHandler('EMPTY_SELECTION')
  else if ((selection[0] as FrameNode).fills === undefined)
    selectionHandler('EMPTY_SELECTION')
  else if (
    (selection[0] as FrameNode).fills &&
    ((selection[0] as FrameNode).fills as readonly Paint[]).length === 0
  )
    selectionHandler('EMPTY_SELECTION')

  selection.forEach(async (element) => {
    if (
      element.type !== 'CONNECTOR' &&
      element.type !== 'GROUP' &&
      element.type !== 'EMBED' &&
      element.type !== 'SLICE' &&
      element.type !== 'TEXT'
    ) {
      const foundColors = (
        (element as FrameNode).fills as readonly Paint[]
      ).filter((fill: Paint) => fill.type === 'SOLID')
      const foundImage = (
        (element as FrameNode).fills as readonly Paint[]
      ).filter((fill: Paint) => fill.type === 'IMAGE')

      if (
        foundColors.length !== 0 &&
        element.getSharedPluginDataKeys('uicp').length === 0
      ) {
        foundColors.forEach((solidFill: SolidPaint) => {
          viableSelection.push({
            name: (element as FrameNode).name,
            rgb: solidFill.color,
            source: 'CANVAS',
            id: uid(),
            isRemovable: true,
          })
        })
        selectionHandler('COLOR_SELECTED')
      }

      if (foundImage.length !== 0) {
        const hash = foundImage[0] as ImagePaint

        if (hash.imageHash) {
          const image = await figma
            .getImageByHash(hash.imageHash)
            ?.getBytesAsync()

          if (image) {
            const arrayBuffer = image.buffer.slice(
              image.byteOffset,
              image.byteOffset + image.byteLength
            )
            selectionHandler('IMAGE_SELECTED', { arrayBuffer, element })
          }
        }
      }
    }
  })

  setTimeout(() => (isSelectionChanged = false), 1000)
}

export default processSelection
