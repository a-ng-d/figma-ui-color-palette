import { lang, locals } from '../content/locals'
import { ActionsList, windowSize } from '../utils/types'
import package_json from './../../package.json'
import checkEditorType from './checks/checkEditorType'
import checkHighlightStatus from './checks/checkHighlightStatus'
import checkPlanStatus from './checks/checkPlanStatus'
import closeHighlight from './closeHighlight'
import createLocalStyles from './creations/createLocalStyles'
import createLocalVariables from './creations/createLocalVariables'
import createPalette from './creations/createPalette'
import enableTrial from './enableTrial'
import exportCss from './exports/exportCss'
import exportCsv from './exports/exportCsv'
import exportJson from './exports/exportJson'
import exportJsonAmznStyleDictionary from './exports/exportJsonAmznStyleDictionary'
import exportJsonTokensStudio from './exports/exportJsonTokensStudio'
import exportKt from './exports/exportKt'
import exportSwiftUI from './exports/exportSwiftUI'
import exportTailwind from './exports/exportTailwind'
import exportUIKit from './exports/exportUIKit'
import exportXml from './exports/exportXml'
import getPalettesOnCurrentPage from './getPalettesOnCurrentPage'
import getProPlan from './getProPlan'
import processSelection from './processSelection'
import updateColors from './updates/updateColors'
import updateGlobal from './updates/updateGlobal'
import updateLocalStyles from './updates/updateLocalStyles'
import updateLocalVariables from './updates/updateLocalVariables'
import updateScale from './updates/updateScale'
import updateSettings from './updates/updateSettings'
import updateThemes from './updates/updateThemes'
import updateView from './updates/updateView'

const loadUI = async () => {
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

  figma.ui.postMessage({
    type: 'CHECK_USER_AUTHENTICATION',
    data: {
      accessToken: await figma.clientStorage.getAsync('supabase_access_token'),
      refreshToken: await figma.clientStorage.getAsync(
        'supabase_refresh_token'
      ),
    },
  })

  figma.ui.onmessage = async (msg) => {
    const palette = figma.currentPage.selection[0] as FrameNode
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
      CREATE_PALETTE: () => createPalette(msg),
      UPDATE_SCALE: () => updateScale(msg),
      UPDATE_VIEW: () => updateView(msg, palette),
      UPDATE_COLORS: () => updateColors(msg),
      UPDATE_THEMES: () => updateThemes(msg),
      UPDATE_GLOBAL: () => updateGlobal(msg),
      SYNC_LOCAL_STYLES: async () => {
        createLocalStyles(palette)
          .then(async (message) => [message, await updateLocalStyles(palette)])
          .then((messages) => figma.notify(messages.join('﹒')))
          .catch((error) => {
            figma.notify(locals[lang].error.generic)
            throw error
          })
      },
      SYNC_LOCAL_VARIABLES: () => {
        createLocalVariables(palette)
          .then(async (message) => [
            message,
            await updateLocalVariables(palette),
          ])
          .then((messages) => figma.notify(messages.join('﹒')))
          .catch((error) => {
            figma.notify(locals[lang].error.generic)
            throw error
          })
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
      UPDATE_SETTINGS: () => updateSettings(msg),
      OPEN_IN_BROWSER: () => {
        figma.openExternal(msg.url)
      },
      SEND_MESSAGE: () => {
        figma.notify(msg.message)
      },
      SET_ITEMS: () => {
        msg.items.forEach(
          async (item: { key: string; value: string }) =>
            await figma.clientStorage.setAsync(item.key, item.value)
        )
      },
      DELETE_ITEMS: () => {
        msg.items.forEach(
          async (item: string) => await figma.clientStorage.deleteAsync(item)
        )
      },
      SET_DATA: () => {
        msg.items.forEach((item: { key: string; value: string }) =>
          palette.setPluginData(item.key, item.value)
        )
      },
      UPDATE_SCREENSHOT: async () => {
        const bytes = await palette.exportAsync({
          format: 'PNG',
          constraint: { type: 'SCALE', value: 0.25 },
        })
        figma.ui.postMessage({
          type: 'UPDATE_SCREENSHOT',
          data: bytes,
        })
      },
      UPDATE_PALETTE_DATE: async () => {
        figma.ui.postMessage({
          type: 'UPDATE_SCREENSHOT',
          data: msg.data,
        })
      },
      GET_PALETTES: async () => await getPalettesOnCurrentPage(),
      JUMP_TO_PALETTE: async () => {
        const scene: Array<SceneNode> = []
        const palette = await figma.currentPage
          .loadAsync()
          .then(() =>
            figma.currentPage.findOne(
              (node) => node.getPluginData('id') === msg.id
            )
          )
          .catch((error) => {
            figma.notify(locals[lang].error.generic)
            throw error
          })
        palette != null ? scene.push(palette) : null
        figma.currentPage.selection = scene
      },
      GET_PRO_PLAN: async () => await getProPlan(),
      ENABLE_TRIAL: async () => {
        await enableTrial()
        await checkPlanStatus()
      },
    }

    return actions[msg.type]?.()
  }

  figma.on('currentpagechange', () => getPalettesOnCurrentPage())
}

export default loadUI
