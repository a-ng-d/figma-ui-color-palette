import { lang, locals } from "../content/locals"
import { notifications, presets } from "../utils/palettePackage"
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
import package_json from '../../package.json'
import isBlocked from "../utils/isBlocked"
import isAvailableAndBlocked from "../utils/isAvailableAndBlocked"

const loadParameters = ({ parameters, key, query, result }: ParameterInputEvent) => {
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

export default loadParameters