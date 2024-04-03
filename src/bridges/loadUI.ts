import { lang, locals } from '../content/locals'
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
import getPalettesOnCurrentPage from './getPalettesOnCurrentPage'
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
      SYNC_LOCAL_STYLES: async () => {
        createLocalStyles(palette)
          .then(async message => [message, await updateLocalStyles(palette)])
          .then((messages) => figma.notify(messages.join('﹒')))
          .catch(error => {
            console.log(error)
            return locals[lang].error.generic
          })
      },
      SYNC_LOCAL_VARIABLES: () => {
        createLocalVariables(palette)
          .then(async message => [message, await updateLocalVariables(palette)])
          .then((messages) => figma.notify(messages.join('﹒')))
          .catch(error => {
            console.log(error)
            return locals[lang].error.generic
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
      UPDATE_SETTINGS: () => updateSettings(msg, palette),
      OPEN_IN_BROWSER: () => {
        figma.openExternal(msg.url)
      },
      GET_PALETTES: async () => await getPalettesOnCurrentPage(),
      JUMP_TO_PALETTE: async () => {
        const scene: Array<SceneNode> = []
        const palette = await figma.currentPage.loadAsync()
          .then(() => figma.currentPage.findOne(
              (node) => node.getPluginData('id') === msg.id
            )
          )
          .catch((error) => {
            console.log(error)
            figma.notify(locals[lang].error.generic)
            return null
          })
        palette != null ? scene.push(palette) : null
        figma.currentPage.selection = scene
      },
      GET_PRO_PLAN: async () => await getProPlan(),
      ENABLE_TRIAL: async () => await enableTrial(),
    }

    return actions[msg.type]?.()
  }

  figma.on('currentpagechange', () => getPalettesOnCurrentPage())
}

export default loadUI
