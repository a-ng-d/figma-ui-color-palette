import type { ActionsList } from './utils/types'
import processSelection from './bridges/processSelection'
import isHighlightRead from './bridges/isHighlightRead'
import checkEditorType from './bridges/checkEditorType'
import checkPlanStatus from './bridges/checkPlanStatus'
import closeHighlight from './bridges/closeHighlight'
import createPalette from './bridges/createPalette'
import updateScale from './bridges/updateScale'
import updateColors from './bridges/updateColors'
import updateView from './bridges/updateView'
import createLocalStyles from './bridges/createLocalStyles'
import updateLocalStyles from './bridges/updateLocalStyles'
import exportJson from './bridges/exportJson'
import exportCss from './bridges/exportCss'
import exportCsv from './bridges/exportCsv'
import updateSettings from './bridges/updateSettings'
import getProPlan from './bridges/getProPlan'
import package_json from './../package.json'

figma.showUI(__html__, {
  width: 640,
  height: 320,
  title: 'UI Color Palette',
  themeColors: true,
})
figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
figma.loadFontAsync({ family: 'Roboto', style: 'Regular' })
figma.loadFontAsync({ family: 'Roboto Mono', style: 'Regular' })
figma.loadFontAsync({ family: 'Roboto Mono', style: 'Medium' })

figma.on('run', () => processSelection())
figma.on('selectionchange', () => processSelection())

figma.on('run', () => checkEditorType())
figma.on('run', () => isHighlightRead(package_json.version))
// figma.on('run', async () => await checkPlanStatus())

figma.ui.onmessage = async (msg) => {
  let palette: ReadonlyArray<SceneNode>
  const i = 0

  const actions: ActionsList = {
    CLOSE_HIGHLIGHT: () => closeHighlight(msg),
    CREATE_PALETTE: () => createPalette(msg, palette),
    UPDATE_SCALE: () => updateScale(msg, palette),
    UPDATE_VIEW: () => updateView(msg, palette),
    UPDATE_COLORS: () => updateColors(msg, palette),
    CREATE_LOCAL_STYLES: () => createLocalStyles(palette, i),
    UPDATE_LOCAL_STYLES: () => updateLocalStyles(palette, i),
    EXPORT_PALETTE: () => {
      msg.export === 'JSON' ? exportJson(palette) : null
      msg.export === 'CSS' ? exportCss(palette) : null
      msg.export === 'CSV' ? exportCsv(palette) : null
    },
    UPDATE_SETTINGS: () => updateSettings(msg, palette),
    GET_PRO_PLAN: async () => await getProPlan(),
  }

  return actions[msg.type]?.()
}
