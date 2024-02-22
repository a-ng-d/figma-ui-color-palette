import { lang, locals } from '../content/locals'
import { notifications } from '../utils/palettePackage'
import { ActionsList, windowSize } from '../utils/types'
import checkEditorType from './checkEditorType'
import checkHighlightStatus from './checkHighlightStatus'
import checkPlanStatus from './checkPlanStatus'
import closeHighlight from './closeHighlight'
import createLocalStyles from './createLocalStyles'
import createLocalVariables from './createLocalVariables'
import createPalette from './createPalette'
import enableTrial from './enableTrial'
import exportCss from './exportCss'
import exportTailwind from './exportTailwind'
import exportCsv from './exportCsv'
import exportJson from './exportJson'
import exportJsonAmznStyleDictionary from './exportJsonAmznStyleDictionary'
import exportJsonTokensStudio from './exportJsonTokensStudio'
import exportSwiftUI from './exportSwiftUI'
import exportUIKit from './exportUIKit'
import exportKt from './exportKt'
import exportXml from './exportXml'
import getProPlan from './getProPlan'
import processSelection from './processSelection'
import updateColors from './updateColors'
import updateLocalStyles from './updateLocalStyles'
import updateLocalVariables from './updateLocalVariables'
import updateScale from './updateScale'
import updateSettings from './updateSettings'
import updateThemes from './updateThemes'
import updateView from './updateView'
import package_json from './../../package.json'

const loadUI = async (palette: SceneNode) => {
  const windowSize: windowSize = {
    w: (await figma.clientStorage.getAsync('plugin_window_width')) ?? 640,
    h: (await figma.clientStorage.getAsync('plugin_window_height')) ?? 320,
  }

  figma.showUI(__html__, {
    width: windowSize.w,
    height: windowSize.h,
    title: locals[lang].name,
    themeColors: true,
  })

  checkEditorType()
  checkHighlightStatus(package_json.version)
  processSelection()

  await checkPlanStatus()

  figma.ui.onmessage = async (msg) => {
    const i = 0,
      j = 0

    const actions: ActionsList = {
      RESIZE_UI: async () => {
        windowSize.w < 540
          ? (windowSize.w = 540)
          : (windowSize.w += msg.movement.x)
        windowSize.h < 300
          ? (windowSize.h = 300)
          : (windowSize.h = windowSize.h += msg.movement.y)

        await figma.clientStorage.setAsync('plugin_window_width', windowSize.w)
        await figma.clientStorage.setAsync('plugin_window_height', windowSize.h)

        figma.ui.resize(windowSize.w, windowSize.h)
      },
      CLOSE_HIGHLIGHT: () => closeHighlight(msg),
      CREATE_PALETTE: () => createPalette(msg, palette),
      UPDATE_SCALE: () => updateScale(msg, palette),
      UPDATE_VIEW: () => updateView(msg, palette),
      UPDATE_COLORS: () => updateColors(msg, palette),
      UPDATE_THEMES: () => updateThemes(msg, palette),
      SYNC_LOCAL_STYLES: () => {
        notifications.splice(0, notifications.length)
        createLocalStyles(palette, i)
        updateLocalStyles(palette, i)
        figma.notify(notifications.join('﹒'))
      },
      SYNC_LOCAL_VARIABLES: () => {
        notifications.splice(0, notifications.length)
        createLocalVariables(palette, i, j)
        updateLocalVariables(palette, i, j)
        figma.notify(notifications.join('﹒'))
      },
      EXPORT_PALETTE: () => {
        msg.export === 'TOKENS_GLOBAL' ? exportJson(palette) : null
        msg.export === 'TOKENS_AMZN_STYLE_DICTIONARY'
          ? exportJsonAmznStyleDictionary(palette)
          : null
        msg.export === 'TOKENS_TOKENS_STUDIO'
          ? exportJsonTokensStudio(palette)
          : null
        msg.export === 'CSS' ? exportCss(palette, msg.colorSpace) : null
        msg.export === 'TAILWIND' ? exportTailwind(palette) : null
        msg.export === 'APPLE_SWIFTUI' ? exportSwiftUI(palette) : null
        msg.export === 'APPLE_UIKIT' ? exportUIKit(palette) : null
        msg.export === 'ANDROID_COMPOSE' ? exportKt(palette) : null
        msg.export === 'ANDROID_XML' ? exportXml(palette) : null
        msg.export === 'CSV' ? exportCsv(palette) : null
      },
      UPDATE_SETTINGS: () => updateSettings(msg, palette),
      OPEN_IN_BROWSER: () => {
        figma.openExternal(msg.url)
      },
      GET_PALETTES: () => getPalettesOnCurrentPage(),
      JUMP_TO_PALETTE: () => {
        const scene = figma.currentPage.findChildren(node =>
          node.getPluginData('id') === msg.id
        )
        figma.currentPage.selection = scene
        figma.viewport.scrollAndZoomIntoView(scene)
      },
      GET_PRO_PLAN: async () => await getProPlan(),
      ENABLE_TRIAL: async () => await enableTrial(),
    }

    return actions[msg.type]?.()
  }

  figma.on('currentpagechange', () => getPalettesOnCurrentPage())
}

const getPalettesOnCurrentPage = () => {
  const palettes = figma.currentPage.findAllWithCriteria({
    pluginData: {}
  })
  if (palettes.length != 0)
    figma.ui.postMessage({
      type: 'EXPOSE_PALETTES',
      data: palettes.map(palette => {
        return {
          id: palette.getPluginData('id'),
          name: palette.getPluginData('name'),
          preset: JSON.parse(palette.getPluginData('preset')).name,
          colors: JSON.parse(palette.getPluginData('colors')),
          themes: JSON.parse(palette.getPluginData('themes')),
        }
      }),
    })
  else
    figma.ui.postMessage({
      type: 'EXPOSE_PALETTES',
      data: []
    })
}

export default loadUI
