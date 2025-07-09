import { presets } from '@ui-lib/stores/presets'
import { FeatureStatus } from '@a_ng_d/figmug-utils'
import globalConfig from '../global.config'
import { locales } from '../content/locales'
import checkPlanStatus from './checks/checkTrialStatus'

const loadParameters = async ({ key, result }: ParameterInputEvent) => {
  switch (key) {
    case 'preset': {
      const planStatus = (await checkPlanStatus('PARAMETERS')) ?? 'UNPAID'

      const filteredPresets = await Promise.all(
        presets.map(async (preset) => {
          const isBlocked = new FeatureStatus({
            features: globalConfig.features,
            featureName: `PRESETS_${preset.id}`,
            planStatus: planStatus,
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
      const planStatus = (await checkPlanStatus('PARAMETERS')) ?? 'UNPAID'
      const suggestionsList = [
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_LCH',
          planStatus: planStatus,
          suggestion: locales.get().settings.color.colorSpace.lch,
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_OKLCH',
          planStatus: planStatus,
          suggestion: locales.get().settings.color.colorSpace.oklch,
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_LAB',
          planStatus: planStatus,
          suggestion: locales.get().settings.color.colorSpace.lab,
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_OKLAB',
          planStatus: planStatus,
          suggestion: locales.get().settings.color.colorSpace.oklab,
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_HSL',
          planStatus: planStatus,
          suggestion: locales.get().settings.color.colorSpace.hsl,
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'SETTINGS_COLOR_SPACE_HSLUV',
          planStatus: planStatus,
          suggestion: locales.get().settings.color.colorSpace.hsluv,
        }).isAvailableAndBlocked(),
      ].filter((n) => n) as Array<string>

      result.setSuggestions(suggestionsList)
      break
    }

    case 'view': {
      const planStatus = (await checkPlanStatus('PARAMETERS')) ?? 'UNPAID'
      const suggestionsList = [
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'VIEWS_PALETTE_WITH_PROPERTIES',
          planStatus: planStatus,
          suggestion: locales.get().settings.global.views.detailed,
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'VIEWS_PALETTE',
          planStatus: planStatus,
          suggestion: locales.get().settings.global.views.simple,
        }).isAvailableAndBlocked(),
        new FeatureStatus({
          features: globalConfig.features,
          featureName: 'VIEWS_SHEET',
          planStatus: planStatus,
          suggestion: locales.get().settings.global.views.sheet,
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
