import { lang, locals } from "../content/locals"
import { notifications } from "../utils/palettePackage"
import { ActionsList } from "../utils/types"
import checkEditorType from "./checkEditorType"
import checkHighlightStatus from "./checkHighlightStatus"
import checkPlanStatus from "./checkPlanStatus"
import closeHighlight from "./closeHighlight"
import createLocalStyles from "./createLocalStyles"
import createLocalVariables from "./createLocalVariables"
import createPalette from "./createPalette"
import enableTrial from "./enableTrial"
import exportCss from "./exportCss"
import exportCsv from "./exportCsv"
import exportJson from "./exportJson"
import exportJsonAmznStyleDictionary from "./exportJsonAmznStyleDictionary"
import exportJsonTokensStudio from "./exportJsonTokensStudio"
import exportSwift from "./exportSwift"
import exportXml from "./exportXml"
import getProPlan from "./getProPlan"
import processSelection from "./processSelection"
import updateColors from "./updateColors"
import updateLocalStyles from "./updateLocalStyles"
import updateLocalVariables from "./updateLocalVariables"
import updateScale from "./updateScale"
import updateSettings from "./updateSettings"
import updateThemes from "./updateThemes"
import updateView from "./updateView"
import package_json from './../../package.json'

const loadUI = async (palette: SceneNode) => {
  figma.showUI(__html__, {
    width: 640,
    height: 320,
    title: locals[lang].name,
    themeColors: true,
  })

  processSelection()
  checkEditorType()
  checkHighlightStatus(package_json.version)

  await checkPlanStatus()

  figma.ui.onmessage = async (msg) => {
    const i = 0,
      j = 0
  
    const actions: ActionsList = {
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
        msg.export === 'JSON' ? exportJson(palette) : null
        msg.export === 'JSON_AMZN_STYLE_DICTIONARY'
          ? exportJsonAmznStyleDictionary(palette)
          : null
        msg.export === 'JSON_TOKENS_STUDIO'
          ? exportJsonTokensStudio(palette)
          : null
        msg.export === 'CSS' ? exportCss(palette) : null
        msg.export === 'SWIFT' ? exportSwift(palette) : null
        msg.export === 'XML' ? exportXml(palette) : null
        msg.export === 'CSV' ? exportCsv(palette) : null
      },
      UPDATE_SETTINGS: () => updateSettings(msg, palette),
      GET_PRO_PLAN: async () => await getProPlan(),
      ENABLE_TRIAL: async () => await enableTrial(),
    }
  
    return actions[msg.type]?.()
  }
}

export default loadUI