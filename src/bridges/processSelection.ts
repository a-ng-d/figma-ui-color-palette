import { uid } from 'uid'

import { lang, locals } from '../content/locals'
import {
  SourceColorConfiguration,
  ThemeConfiguration,
} from '../types/configurations'
import { ActionsList } from '../types/models'
import setPaletteMigration from '../utils/setPaletteMigration'

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

  const palette: FrameNode | InstanceNode = selection[0] as
    | FrameNode
    | InstanceNode
  const selectionHandler = (state: string, element: any = null) => {
    const actions: ActionsList = {
      PALETTE_SELECTED: async () => {
        figma.ui.postMessage({
          type: 'PALETTE_SELECTED',
          data: {
            editorType: figma.editorType,
            id: palette.getPluginData('id'),
            name: palette.getPluginData('name'),
            description: palette.getPluginData('description'),
            preset: JSON.parse(palette.getPluginData('preset')),
            scale: JSON.parse(palette.getPluginData('themes')).find(
              (theme: ThemeConfiguration) => theme.isEnabled
            ).scale,
            colors: JSON.parse(palette.getPluginData('colors')),
            colorSpace: palette.getPluginData('colorSpace'),
            visionSimulationMode: palette.getPluginData('visionSimulationMode'),
            themes: JSON.parse(palette.getPluginData('themes')),
            view: palette.getPluginData('view'),
            textColorsTheme: JSON.parse(
              palette.getPluginData('textColorsTheme')
            ),
            algorithmVersion: palette.getPluginData('algorithmVersion'),
            screenshot: await palette.exportAsync({
              format: 'PNG',
              constraint: { type: 'SCALE', value: 0.25 },
            }),
            isPublished: palette.getPluginData('isPublished') === 'true',
            isShared: palette.getPluginData('isShared') === 'true',
            creatorFullName: palette.getPluginData('creatorFullName'),
            creatorAvatar: palette.getPluginData('creatorAvatar'),
            creatorId: palette.getPluginData('creatorId'),
            createdAt: palette.getPluginData('createdAt'),
            updatedAt: palette.getPluginData('updatedAt'),
            publishedAt: palette.getPluginData('publishedAt'),
          },
        })
        palette.setRelaunchData({
          edit: locals[lang].relaunch.edit.description,
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
        element.setRelaunchData({
          create: locals[lang].relaunch.create.description,
        })
      },
    }

    return actions[state]?.()
  }

  if (
    selection.length === 1 &&
    palette.getPluginData('type') === 'UI_COLOR_PALETTE' &&
    palette.type !== 'INSTANCE'
  ) {
    setPaletteMigration(palette) // Migration
    selectionHandler('PALETTE_SELECTED')
  } else if (
    selection.length === 1 &&
    palette.getPluginDataKeys().length > 0 &&
    palette.type !== 'INSTANCE'
  ) {
    setPaletteMigration(palette) // Migration
    selectionHandler('PALETTE_SELECTED')
  } else if (selection.length === 0) selectionHandler('EMPTY_SELECTION')
  else if (selection.length > 1 && palette.getPluginDataKeys().length !== 0)
    selectionHandler('EMPTY_SELECTION')
  else if (selection[0].type === 'INSTANCE') selectionHandler('EMPTY_SELECTION')
  else if ((selection[0] as any).fills === undefined)
    selectionHandler('EMPTY_SELECTION')
  else if ((selection[0] as any).fills.length === 0)
    selectionHandler('EMPTY_SELECTION')

  selection.forEach((element) => {
    if (
      element.type !== 'CONNECTOR' &&
      element.type !== 'GROUP' &&
      element.type !== 'EMBED'
    )
      if (
        (element as any).fills.filter((fill: Paint) => fill.type === 'SOLID')
          .length !== 0 &&
        element.getPluginDataKeys().length === 0
      ) {
        viableSelection.push({
          name: (element as any).name,
          rgb: (element as any).fills[0].color,
          source: 'CANVAS',
          id: uid(),
        })
        selectionHandler('COLOR_SELECTED', element)
      }
  })

  setTimeout(() => (isSelectionChanged = false), 1000)
}

export default processSelection
