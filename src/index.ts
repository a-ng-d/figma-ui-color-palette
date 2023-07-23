import type { ActionsList } from './utils/types'
import processSelection from './bridges/processSelection'
import isHighlightRead from './bridges/isHighlightRead'
import checkEditorType from './bridges/checkEditorType'
import checkPlanStatus from './bridges/checkPlanStatus'
import closeHighlight from './bridges/closeHighlight'
import createPalette from './bridges/createPalette'
import updateScale from './bridges/updateScale'
import updateColors from './bridges/updateColors'
import updateThemes from './bridges/updateThemes'
import updateView from './bridges/updateView'
import createLocalStyles from './bridges/createLocalStyles'
import updateLocalStyles from './bridges/updateLocalStyles'
import createLocalVariables from './bridges/createLocalVariables'
import updateLocalVariables from './bridges/updateLocalVariables'
import exportJson from './bridges/exportJson'
import exportCss from './bridges/exportCss'
import exportSwift from './bridges/exportSwift'
import exportXml from './bridges/exportXml'
import exportCsv from './bridges/exportCsv'
import updateSettings from './bridges/updateSettings'
import getProPlan from './bridges/getProPlan'
import package_json from './../package.json'
import { locals, lang } from './content/locals'

figma.showUI(__html__, {
  width: 640,
  height: 320,
  title: locals[lang].name,
  themeColors: true,
})
figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
figma.loadFontAsync({ family: 'Red Hat Mono', style: 'Medium' })

figma.on('run', () => processSelection())
figma.on('selectionchange', () => processSelection())

figma.on('run', () => checkEditorType())
figma.on('run', () => isHighlightRead(package_json.version))
// figma.on('run', async () => await checkPlanStatus())

figma.ui.onmessage = async (msg) => {
  let palette: SceneNode
  const i = 0,
    j = 0

  const actions: ActionsList = {
    CLOSE_HIGHLIGHT: () => closeHighlight(msg),
    CREATE_PALETTE: () => createPalette(msg, palette),
    UPDATE_SCALE: () => updateScale(msg, palette),
    UPDATE_VIEW: () => updateView(msg, palette),
    UPDATE_COLORS: () => updateColors(msg, palette),
    UPDATE_THEMES: () => updateThemes(msg, palette),
    CREATE_LOCAL_STYLES: () => createLocalStyles(palette, i),
    UPDATE_LOCAL_STYLES: () => updateLocalStyles(palette, i),
    CREATE_LOCAL_VARIABLES: () => createLocalVariables(palette, i, j),
    UPDATE_LOCAL_VARIABLES: () => updateLocalVariables(palette, i, j),
    EXPORT_PALETTE: () => {
      msg.export === 'JSON' ? exportJson(palette) : null
      msg.export === 'CSS' ? exportCss(palette) : null
      msg.export === 'SWIFT' ? exportSwift(palette) : null
      msg.export === 'XML' ? exportXml(palette) : null
      msg.export === 'CSV' ? exportCsv(palette) : null
    },
    UPDATE_SETTINGS: () => updateSettings(msg, palette),
    GET_PRO_PLAN: async () => await getProPlan(),
  }

  return actions[msg.type]?.()
}
