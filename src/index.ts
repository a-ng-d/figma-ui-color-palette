import checkPlanStatus from './bridges/checkPlanStatus'
import isHighlightRead from './bridges/isHighlightRead'
import closeHighlight from './bridges/closeHighlight'
import createPalette from './bridges/createPalette'
import updateScale from './bridges/updateScale'
import updateView from './bridges/updateView'
import updateColors from './bridges/updateColors'
import createLocalStyles from './bridges/createLocalStyles'
import updateLocalStyles from './bridges/updateLocalStyles'
import processSelection from './bridges/processSelection'
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
figma.loadFontAsync({ family: 'Roboto', style: 'Regular' })
figma.loadFontAsync({ family: 'Roboto Mono', style: 'Regular' })
figma.loadFontAsync({ family: 'Roboto Mono', style: 'Medium' })

figma.on('run', () => processSelection())
figma.on('selectionchange', () => processSelection())

figma.on('run', () => isHighlightRead(package_json.version))
figma.on('run', async () => await checkPlanStatus())

figma.ui.onmessage = async (msg) => {
  let palette: ReadonlyArray<SceneNode>
  const i = 0

  switch (msg.type) {
    case 'close-highlight':
      closeHighlight(msg)
      break

    case 'create-palette':
      createPalette(msg, palette)
      break

    case 'update-scale':
      updateScale(msg, palette)
      break

    case 'update-view':
      updateView(msg, palette)
      break

    case 'update-colors':
      updateColors(msg, palette)
      break

    case 'create-local-styles':
      createLocalStyles(palette, i)
      break

    case 'update-local-styles':
      updateLocalStyles(palette, i)
      break

    case 'export-palette':
      msg.export === 'JSON' ? exportJson(palette) : null
      msg.export === 'CSS' ? exportCss(palette) : null
      msg.export === 'CSV' ? exportCsv(palette) : null
      break

    case 'update-settings':
      updateSettings(msg, palette)
      break

    case 'get-pro-plan':
      await getProPlan()
  }
}
