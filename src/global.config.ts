import { doSpecificMode } from '@ui-lib/stores/features'
import { Config } from './types/config'
import { locales } from './content/locales'

const isDev = import.meta.env.MODE === 'development'

const globalConfig: Config = {
  limits: {
    pageSize: 20,
  },
  env: {
    platform: 'figma',
    editor: 'figma',
    ui: 'figma-ui3',
    colorMode: 'figma-dark',
    isDev,
    isSupabaseEnabled: true,
    isMixpanelEnabled: true,
    isSentryEnabled: true,
    announcementsDbId: import.meta.env.VITE_NOTION_ANNOUNCEMENTS_ID as string,
    onboardingDbId: import.meta.env.VITE_NOTION_ONBOARDING_ID as string,
    pluginId: '1063959496693642315',
  },
  plan: {
    isProEnabled: true,
    isTrialEnabled: false,
    trialTime: 72,
  },
  dbs: {
    palettesDbTableName: isDev ? 'sandbox.palettes' : 'palettes',
    palettesStorageName: isDev ? 'palette.screenshots' : 'palette.screenshots',
  },
  urls: {
    authWorkerUrl: isDev
      ? 'http://localhost:8787'
      : (import.meta.env.VITE_AUTH_WORKER_URL as string),
    announcementsWorkerUrl: isDev
      ? 'http://localhost:8888'
      : (import.meta.env.VITE_ANNOUNCEMENTS_WORKER_URL as string),
    databaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
    authUrl: isDev
      ? 'http://localhost:3000'
      : (import.meta.env.VITE_AUTH_URL as string),
    storeApiUrl: import.meta.env.VITE_LEMONSQUEEZY_URL as string,
    platformUrl: 'https://www.figma.com',
    uiUrl: isDev
      ? 'http://localhost:4400'
      : 'https://figma.ui-color-palette.com',
    documentationUrl: 'https://uicp.ylb.lt/docs',
    repositoryUrl: 'https://uicp.ylb.lt/repository',
    communityUrl: 'https://uicp.ylb.lt/community',
    supportEmail: 'https://uicp.ylb.lt/contact',
    feedbackUrl: 'https://uicp.ylb.lt/feedback',
    trialFeedbackUrl: 'https://uicp.ylb.lt/feedback-trial',
    requestsUrl: 'https://uicp.ylb.lt/ideas',
    networkUrl: 'https://uicp.ylb.lt/network',
    authorUrl: 'https://uicp.ylb.lt/author',
    licenseUrl: 'https://uicp.ylb.lt/license',
    privacyUrl: 'https://uicp.ylb.lt/privacy',
    vsCodeFigmaPluginUrl:
      'https://marketplace.visualstudio.com/items?itemName=figma.figma-vscode-extension',
    isbUrl: 'https://isb.ylb.lt/run-figma',
    uicpUrl: 'https://uicp.ylb.lt/run-figma-one',
    storeUrl: isDev
      ? 'https://uicp.ylb.lt/store-dev'
      : 'https://uicp.ylb.lt/store',
    storeManagementUrl: isDev
      ? 'https://uicp.ylb.lt/store-management-dev'
      : 'https://uicp.ylb.lt/store-management',
  },
  versions: {
    userConsentVersion: '2024.01',
    trialVersion: '2024.03',
    algorithmVersion: 'v3',
    paletteVersion: '2025.06',
  },
  features: doSpecificMode(
    ['HELP_CHAT'],
    [
      'LOCAL_PALETTES',
      'SYNC_LOCAL_STYLES',
      'SYNC_LOCAL_VARIABLES',
      'USER_PREFERENCES_SYNC_DEEP_STYLES',
      'USER_PREFERENCES_SYNC_DEEP_VARIABLES',
      'PREVIEW_LOCK_SOURCE_COLORS',
      'SOURCE',
      'PRESETS_MATERIAL_3',
      'PRESETS_TAILWIND',
      'PRESETS_ADS',
      'PRESETS_ADS_NEUTRAL',
      'PRESETS_CARBON',
      'PRESETS_BASE',
      'PRESETS_POLARIS',
      'PRESETS_CUSTOM_ADD',
      'SCALE_CHROMA',
      'SCALE_HELPER_DISTRIBUTION',
      'THEMES',
      'THEMES_NAME',
      'THEMES_PARAMS',
      'THEMES_DESCRIPTION',
      'COLORS',
      'COLORS_HUE_SHIFTING',
      'COLORS_CHROMA_SHIFTING',
      'COLORS_ALPHA',
      'COLORS_BACKGROUND_COLOR',
      'EXPORT_TOKENS_JSON_AMZN_STYLE_DICTIONARY',
      'EXPORT_TAILWIND',
      'EXPORT_APPLE_SWIFTUI',
      'EXPORT_APPLE_UIKIT',
      'EXPORT_ANDROID_COMPOSE',
      'EXPORT_ANDROID_XML',
      'EXPORT_CSV',
      'SETTINGS_VISION_SIMULATION_MODE_PROTANOPIA',
      'SETTINGS_VISION_SIMULATION_MODE_PROTANOMALY',
      'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOMALY',
      'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOPIA',
      'SETTINGS_VISION_SIMULATION_MODE_TRITANOMALY',
      'SETTINGS_VISION_SIMULATION_MODE_TRITANOPIA',
      'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOMALY',
      'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOPSIA',
    ],
    ['SCALE_CONTRAST_RATIO']
  ),
  locales: locales.get(),
}

export default globalConfig
