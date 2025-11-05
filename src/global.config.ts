import { Config } from '@ui-lib/types/config'
import { doSpecificMode } from '@ui-lib/stores/features'
import { locales } from '@ui-lib/content/locales'
import { Feature } from '@a_ng_d/figmug-utils'

declare const __PLUGIN__: 'fig' | 'one'
declare const __APP_VERSION__: string

const isDev = import.meta.env.MODE === 'development'

const specConfig: Record<
  string,
  {
    pluginId: string
    features: Feature<'BROWSE' | 'CREATE' | 'EDIT' | 'SEE'>[]
  }
> = {
  fig: {
    pluginId: '1063959496693642315',
    features: doSpecificMode(
      ['HELP_CHAT', 'USER_LICENSE'],
      [
        'LOCAL_PALETTES',
        'SYNC_LOCAL_STYLES',
        'SYNC_LOCAL_VARIABLES',
        'USER_PREFERENCES_SYNC_DEEP_STYLES',
        'USER_PREFERENCES_SYNC_DEEP_VARIABLES',
        'PREVIEW_LOCK_SOURCE_COLORS',
        'SOURCE',
        'SOURCE_COOLORS_ADD',
        'SOURCE_REALTIME_COLORS_ADD',
        'SOURCE_EXPLORE_ADD',
        'SOURCE_AI_REQUEST',
        'SOURCE_IMAGE_UPLOAD',
        'SOURCE_HARMONY_BASE',
        'SOURCE_HARMONY_ADD',
        'SOURCE_EXPLORE_ADD',
        'PRESETS_CUSTOM_ADD',
        'SCALE_CHROMA',
        'THEMES',
        'THEMES_NAME',
        'THEMES_PARAMS',
        'THEMES_DESCRIPTION',
        'COLORS',
        'COLORS_HUE_SHIFTING',
        'COLORS_CHROMA_SHIFTING',
        'COLORS_ALPHA',
        'COLORS_BACKGROUND_COLOR',
        'EXPORT_STYLESHEET_SCSS',
        'EXPORT_STYLESHEET_LESS',
        'EXPORT_TAILWIND_V3',
        'EXPORT_TAILWIND_V4',
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
      [
        'SOURCE_AI',
        'SOURCE_IMAGE',
        'SOURCE_HARMONY',
        'PRESETS_SPECTRUM',
        'PRESETS_SPECTRUM_NEUTRAL',
        'PRESETS_BOOTSTRAP',
        'PRESETS_RADIX',
        'PRESETS_UNTITLED_UI',
        'PRESETS_OPEN_COLOR',
        'PRESETS_FLUENT',
        'REMOTE_PALETTES_STARRED',
        'REMOTE_PALETTES_ORG',
        'INVOLVE_COMMUNITY',
      ]
    ),
  },
  one: {
    pluginId: '1532789439226122095',
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
        'SOURCE_COOLORS_ADD',
        'SOURCE_REALTIME_COLORS_ADD',
        'SOURCE_EXPLORE_ADD',
        'SOURCE_AI_REQUEST',
        'SOURCE_IMAGE_UPLOAD',
        'SOURCE_HARMONY_BASE',
        'SOURCE_HARMONY_ADD',
        'SOURCE_EXPLORE_ADD',
        'PRESETS_CUSTOM_ADD',
        'SCALE_CHROMA',
        'THEMES',
        'THEMES_NAME',
        'THEMES_PARAMS',
        'THEMES_DESCRIPTION',
        'COLORS',
        'COLORS_HUE_SHIFTING',
        'COLORS_CHROMA_SHIFTING',
        'COLORS_ALPHA',
        'COLORS_BACKGROUND_COLOR',
        'EXPORT_STYLESHEET_SCSS',
        'EXPORT_STYLESHEET_LESS',
        'EXPORT_TAILWIND_V3',
        'EXPORT_TAILWIND_V4',
        'EXPORT_APPLE_SWIFTUI',
        'EXPORT_APPLE_UIKIT',
        'EXPORT_ANDROID_COMPOSE',
        'EXPORT_ANDROID_XML',
        'EXPORT_CSV',
        'SETTINGS_VISION_SIMULATION_MODE_PROTANOMALY',
        'SETTINGS_VISION_SIMULATION_MODE_PROTANOPIA',
        'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOMALY',
        'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOPIA',
        'SETTINGS_VISION_SIMULATION_MODE_TRITANOMALY',
        'SETTINGS_VISION_SIMULATION_MODE_TRITANOPIA',
        'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOMALY',
        'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOPSIA',
      ],
      [
        'SOURCE_AI',
        'SOURCE_IMAGE',
        'SOURCE_HARMONY',
        'PRESETS_SPECTRUM',
        'PRESETS_SPECTRUM_NEUTRAL',
        'PRESETS_BOOTSTRAP',
        'PRESETS_RADIX',
        'PRESETS_UNTITLED_UI',
        'PRESETS_OPEN_COLOR',
        'PRESETS_FLUENT',
        'REMOTE_PALETTES_STARRED',
        'REMOTE_PALETTES_ORG',
        'INVOLVE_COMMUNITY',
      ]
    ),
  },
}

const globalConfig: Config = {
  limits: {
    pageSize: 20,
  },
  env: {
    platform: 'figma',
    editor: 'figma',
    ui: 'figma',
    colorMode: 'figma-dark',
    isDev,
    isSupabaseEnabled: true,
    isMixpanelEnabled: true,
    isSentryEnabled: true,
    isMistralAiEnabled: true,
    announcementsDbId: import.meta.env.VITE_NOTION_ANNOUNCEMENTS_ID as string,
    onboardingDbId: import.meta.env.VITE_NOTION_ONBOARDING_ID as string,
    pluginId: specConfig[__PLUGIN__].pluginId,
  },
  plan: {
    isProEnabled: true,
    isTrialEnabled: false,
    trialTime: 72,
    creditsLimit: 400,
    creditsRenewalPeriodDays: 1,
    creditsRenewalPeriodHours: 24,
  },
  dbs: {
    palettesDbViewName: isDev
      ? 'sandbox_palettes_with_creators'
      : 'palettes_with_creators',
    palettesDbTableName: isDev ? 'sandbox_palettes' : 'palettes',
    starredPalettesDbTableName: 'starred_palettes',
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
    aiApiUrl: import.meta.env.VITE_MISTRAL_AI_API_URL as string,
    platformUrl: 'https://www.figma.com',
    uiUrl: isDev
      ? 'http://localhost:4400'
      : 'https://figma.ui-color-palette.com',
    documentationUrl: 'https://uicp.ylb.lt/docs-figma-plugin',
    repositoryUrl: 'https://uicp.ylb.lt/repository-figma-plugin',
    communityUrl: 'https://uicp.ylb.lt/community',
    supportEmail: 'https://uicp.ylb.lt/contact',
    feedbackUrl: 'https://uicp.ylb.lt/feedback',
    trialFeedbackUrl: 'https://uicp.ylb.lt/feedback-trial',
    requestsUrl: 'https://uicp.ylb.lt/ideas',
    networkUrl: 'https://uicp.ylb.lt/network',
    authorUrl: 'https://uicp.ylb.lt/author',
    licenseUrl: 'https://uicp.ylb.lt/license',
    privacyUrl: 'https://uicp.ylb.lt/privacy',
    vsCodeFigmaPluginUrl: 'https://uicp.ylb.lt/vscode-figma-plugin',
    isbUrl: 'https://isb.ylb.lt/website',
    uicpUrl: 'https://uicp.ylb.lt/website',
    storeUrl: 'https://uicp.ylb.lt/store',
    storeManagementUrl: 'https://uicp.ylb.lt/store-management',
    storeWithDiscountUrl: 'https://uicp.ylb.lt/store-discount',
    howToUseUrl: 'https://uicp.ylb.lt/how-to-use-figma',
  },
  versions: {
    userConsentVersion: '2025.09',
    trialVersion: '2024.03',
    algorithmVersion: 'v3',
    paletteVersion: '2025.06',
    pluginVersion: __APP_VERSION__,
    creditsVersion: '2025.10',
  },
  features: specConfig[__PLUGIN__].features,
  locales: locales.get(),
  lang: 'en-US',
  fees: {
    colourLoversImport: 25,
    coolorsImport: 25,
    realtimeColorsImport: 25,
    imageColorsExtract: 100,
    harmonyCreate: 50,
    aiColorsGenerate: 100,
  },
}

export default globalConfig
