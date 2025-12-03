import { presets } from '@ui-lib/stores/presets'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import globalConfig from '../global.config'
import { tolgee } from '..'
import checkTrialStatus from './checks/checkTrialStatus'

declare const __PLUGIN__: 'fig' | 'one'

const loadParameters = async ({ key, result }: ParameterInputEvent) => {
  switch (key) {
    case 'preset': {
      const planStatus = 'UNPAID'

      const filteredPresets = await Promise.all(
        presets.map(async (preset) => {
          const isBlocked = new FeatureStatus({
            features: globalConfig.features,
            featureName: `PRESETS_${preset.id}`,
            planStatus: planStatus,
            currentService: 'CREATE',
            currentEditor: figma.editorType,
          }).isBlocked()
          return { preset, isBlocked }
        })
      )

      const suggestionsList = filteredPresets
        .filter(({ isBlocked }) => !isBlocked)
        .map(({ preset }) => preset.name) as Array<string>

      result.setSuggestions(suggestionsList)
      break
    }

    case 'space': {
      const planStatus =
        (await checkTrialStatus({
          context: 'PARAMETERS',
          plugin: __PLUGIN__,
        })) ?? 'UNPAID'
      const suggestionsList = [
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_LCH',
          planStatus: planStatus,
          currentService: 'CREATE',
          currentEditor: figma.editorType,
          suggestion: tolgee.t('settings.color.colorSpace.lch'),
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_OKLCH',
          planStatus: planStatus,
          currentService: 'CREATE',
          currentEditor: figma.editorType,
          suggestion: tolgee.t('settings.color.colorSpace.oklch'),
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_LAB',
          planStatus: planStatus,
          currentService: 'CREATE',
          currentEditor: figma.editorType,
          suggestion: tolgee.t('settings.color.colorSpace.lab'),
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_OKLAB',
          planStatus: planStatus,
          currentService: 'CREATE',
          currentEditor: figma.editorType,
          suggestion: tolgee.t('settings.color.colorSpace.oklab'),
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_HSL',
          planStatus: planStatus,
          currentService: 'CREATE',
          currentEditor: figma.editorType,
          suggestion: tolgee.t('settings.color.colorSpace.hsl'),
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_HSLUV',
          planStatus: planStatus,
          currentService: 'CREATE',
          currentEditor: figma.editorType,
          suggestion: tolgee.t('settings.color.colorSpace.hsluv'),
        }).isAvailableAndBlocked(),
      ].filter((n) => n) as Array<string>

      result.setSuggestions(suggestionsList)
      break
    }

    case 'view': {
      const planStatus =
        (await checkTrialStatus({
          context: 'PARAMETERS',
          plugin: __PLUGIN__,
        })) ?? 'UNPAID'
      const suggestionsList = [
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'VIEWS_PALETTE_WITH_PROPERTIES',
          planStatus: planStatus,
          currentService: 'CREATE',
          currentEditor: figma.editorType,
          suggestion: tolgee.t('settings.global.views.detailed'),
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'VIEWS_PALETTE',
          planStatus: planStatus,
          currentService: 'CREATE',
          currentEditor: figma.editorType,
          suggestion: tolgee.t('settings.global.views.simple'),
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'VIEWS_SHEET',
          planStatus: planStatus,
          currentService: 'CREATE',
          currentEditor: figma.editorType,
          suggestion: tolgee.t('settings.global.views.sheet'),
        }).isAvailableAndBlocked(),
      ].filter((n) => n) as Array<string>

      result.setSuggestions(suggestionsList)
      break
    }

    default:
      return
  }
}

export default loadParameters
