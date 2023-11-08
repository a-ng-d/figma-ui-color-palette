import type { ActionsList } from './utils/types'
import processSelection from './bridges/processSelection'
import checkHighlightStatus from './bridges/checkHighlightStatus'
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
import exportJsonAmznStyleDictionary from './bridges/exportJsonAmznStyleDictionary'
import exportJsonTokensStudio from './bridges/exportJsonTokensStudio'
import exportCss from './bridges/exportCss'
import exportSwift from './bridges/exportSwift'
import exportXml from './bridges/exportXml'
import exportCsv from './bridges/exportCsv'
import updateSettings from './bridges/updateSettings'
import getProPlan from './bridges/getProPlan'
import enableTrial from './bridges/enableTrial'
import package_json from './../package.json'
import { locals, lang } from './content/locals'
import { notifications, presets } from './utils/palettePackage'
import doLightnessScale from './utils/doLightnessScale'
import features from './utils/config'
import isBlocked from './utils/isBlocked'

let palette: SceneNode

figma.loadFontAsync({ family: 'Inter', style: 'Regular' })
figma.loadFontAsync({ family: 'Inter', style: 'Medium' })
figma.loadFontAsync({ family: 'Red Hat Mono', style: 'Medium' })

figma.parameters.on(
  'input',
  ({ parameters, key, query, result }: ParameterInputEvent) => {
    const viableSelection = figma.currentPage.selection
      .filter(element =>
        element.type != 'GROUP' &&
        element.type != 'EMBED' &&
        element.type != 'CONNECTOR' &&
        element.getPluginDataKeys().length == 0 &&
        (element as any).fills.filter((fill: Paint) => fill.type === 'SOLID')
          .length != 0
      )

    switch (key) {
      case 'preset': {
        const suggestionsList = presets
          .filter(preset => !isBlocked(`PRESET_${preset.id}`, (figma.payments?.status.type as 'PAID' | 'UNPAID')))
          .map(preset => preset.name) as Array<string>

        if (viableSelection.length > 0)
          result.setSuggestions(suggestionsList)
        else
          result.setError('Select a layer that is filled with at least one solid color')
        break
      }

      case 'space': {
        const suggestionsList= [
          isAvailableAndBlocked('SETTINGS_COLOR_SPACE_LCH', 'LCH'),
          isAvailableAndBlocked('SETTINGS_COLOR_SPACE_OKLCH', 'OKLCH'),
          isAvailableAndBlocked('SETTINGS_COLOR_SPACE_LAB', 'LAB'),
          isAvailableAndBlocked('SETTINGS_COLOR_SPACE_OKLAB', 'OKLAB'),
          isAvailableAndBlocked('SETTINGS_COLOR_SPACE_HSL', 'HSL'),
          isAvailableAndBlocked('SETTINGS_COLOR_SPACE_HSLUV', 'HSLuv'),
        ].filter(n => n) as Array<string>

        result.setSuggestions(suggestionsList)
        break
      }

      case 'view': {
        const suggestionsList = [
          isAvailableAndBlocked('VIEWS_PALETTE', 'Palette'),
          isAvailableAndBlocked('VIEWS_PALETTE_WITH_PROPERTIES', 'Palette with properties'),
          isAvailableAndBlocked('VIEWS_SHEET', 'Color sheet')
        ].filter(n => n) as Array<string>

        result.setSuggestions(suggestionsList)
        break
      }

      case 'name': {
        result.setLoadingMessage('64 characters max is recommended')
        break
      }

      default:
        return
    }
  }
)

const isAvailableAndBlocked = (featureName: string, suggestion: string) => {
  if (features.find(feature => feature.name === featureName)?.isActive)
    if (!isBlocked(featureName, (figma.payments?.status.type as 'PAID' | 'UNPAID')))
      return suggestion
    else
      return null
  else
    return null
}

figma.on('run', async ({ parameters }: RunEvent) => {
  if (parameters == undefined) {
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
  } else {
    const selectedPreset = presets.find(preset => preset.name === parameters.preset)
    createPalette(
      {
        data: {
          sourceColors: figma.currentPage.selection
          .filter(element =>
            element.type != 'GROUP' &&
            element.type != 'EMBED' &&
            element.type != 'CONNECTOR' &&
            element.getPluginDataKeys().length == 0 &&
            (element as any).fills.filter((fill: Paint) => fill.type === 'SOLID')
              .length != 0
          ).map(element => {
            return {
              name: element.name,
              rgb: (element as any).fills[0].color,
              source: 'CANVAS',
              id: ''
            }
          }),
          palette: {
            name: parameters.name == undefined ? '' : parameters.name,
            description: '',
            preset: presets.find(preset => preset.name === parameters.preset),
            scale: doLightnessScale(
              selectedPreset?.scale ?? [1, 2],
              selectedPreset?.min ?? 0,
              selectedPreset?.max ?? 100
            ),
            colorSpace: parameters.space.toUpperCase().replace(' ', '_'),
            view: parameters.view.toUpperCase().replace(' ', '_'),
            textColorsTheme: {
              lightColor: '#FFFFFF',
              darkColor: '#000000',
            }
          }
        }
      },
      palette
    )
    figma.closePlugin()
  }
})

figma.on('selectionchange', () => processSelection())
figma.on('selectionchange', async () => await checkPlanStatus())
