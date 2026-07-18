import { Feature } from '@unoff/utils'
import { Config } from '@ui-lib/types/config'
import { Service } from '@ui-lib/types/app'
import { doSpecificMode } from '@ui-lib/stores/features'

declare const __PLUGIN__: 'one' | 'team'
declare const __APP_VERSION__: string

const isDev = import.meta.env.MODE === 'development'

const specConfig: Record<
  string,
  {
    pluginId: string
    features: Feature<Service>[]
  }
> = {
  one: {
    pluginId: '1063959496693642315',
    features: doSpecificMode(
      [
        'HELP_CHAT',
        'USER_LICENSE',
        'VIEWS',
        'VIEWS_PALETTE',
        'VIEWS_PALETTE_WITH_PROPERTIES',
        'VIEWS_SHEET',
      ],
      [
        'CREATE_PALETTE',
        'LOCAL_PALETTES',
        'DOCUMENT_CREATE',
        'SYNC_LOCAL_STYLES',
        'SYNC_LOCAL_VARIABLES',
        'USER_PREFERENCES_SYNC_DEEP_STYLES',
        'USER_PREFERENCES_SYNC_DEEP_VARIABLES',
        'USER_PREFERENCES_SYNC_DEEP_TOKENS',
        'PREVIEW_SCORES_WCAG_INTERVAL',
        'PREVIEW_SCORES_APCA_INTERVAL',
        'PREVIEW_FILTER_PASS',
        'PREVIEW_FILTER_FAIL',
        'DOCUMENT_PALETTE',
        'DOCUMENT_PALETTE_PROPERTIES',
        'DOCUMENT_SHEET',
        'DOCUMENT_PUSH_UPDATES',
        'PRESETS_MATERIAL',
        'PRESETS_MATERIAL_3',
        'PRESETS_TAILWIND',
        'PRESETS_ANT',
        'PRESETS_RADIX',
        'PRESETS_UNTITLED_UI',
        'PRESETS_BOOTSTRAP',
        'PRESETS_OPEN_COLOR',
        'PRESETS_SPECTRUM',
        'PRESETS_SPECTRUM_NEUTRAL',
        'PRESETS_ADS',
        'PRESETS_ADS_NEUTRAL',
        'PRESETS_CARBON',
        'PRESETS_BASE',
        'PRESETS_FLUENT',
        'PRESETS_POLARIS',
        'PRESETS_CUSTOM_ADD',
        'COLORS_ADD',
        'THEMES_ADD',
        'EXPORT_TOKENS_DTCG',
        'EXPORT_TOKENS_NATIVE',
        'EXPORT_TOKENS_STYLE_DICTIONARY_V3',
        'EXPORT_TOKENS_UNIVERSAL',
        'EXPORT_STYLESHEET_SCSS',
        'EXPORT_STYLESHEET_LESS',
        'EXPORT_TAILWIND_V3',
        'EXPORT_TAILWIND_V4',
        'EXPORT_APPLE_SWIFTUI',
        'EXPORT_APPLE_UIKIT',
        'EXPORT_ANDROID_COMPOSE',
        'EXPORT_ANDROID_XML',
        'EXPORT_CSV',
        'REPORT',
        'HELP_EMAIL',
      ],
      [
        'INVOLVE_COMMUNITY',
        'USER_LANGUAGE_JA_JP',
        'USER_LANGUAGE_KO_KR',
        'USER_LANGUAGE_ES_ES',
        'USER_LANGUAGE',
      ]
    ),
  },
  team: {
    pluginId: '1532789439226122095',
    features: doSpecificMode(
      [
        'HELP_CHAT',
        'VIEWS',
        'VIEWS_PALETTE',
        'VIEWS_PALETTE_WITH_PROPERTIES',
        'VIEWS_SHEET',
      ],
      [
        'CREATE_PALETTE',
        'LOCAL_PALETTES',
        'DOCUMENT_CREATE',
        'SYNC_LOCAL_STYLES',
        'SYNC_LOCAL_VARIABLES',
        'USER_PREFERENCES_SYNC_DEEP_STYLES',
        'USER_PREFERENCES_SYNC_DEEP_VARIABLES',
        'PREVIEW_SCORES_WCAG_INTERVAL',
        'PREVIEW_SCORES_APCA_INTERVAL',
        'PREVIEW_FILTER_PASS',
        'PREVIEW_FILTER_FAIL',
        'DOCUMENT_PALETTE',
        'DOCUMENT_PALETTE_PROPERTIES',
        'DOCUMENT_SHEET',
        'DOCUMENT_PUSH_UPDATES',
        'PRESETS_MATERIAL',
        'PRESETS_MATERIAL_3',
        'PRESETS_TAILWIND',
        'PRESETS_ANT',
        'PRESETS_RADIX',
        'PRESETS_UNTITLED_UI',
        'PRESETS_BOOTSTRAP',
        'PRESETS_OPEN_COLOR',
        'PRESETS_SPECTRUM',
        'PRESETS_SPECTRUM_NEUTRAL',
        'PRESETS_ADS',
        'PRESETS_ADS_NEUTRAL',
        'PRESETS_CARBON',
        'PRESETS_BASE',
        'PRESETS_FLUENT',
        'PRESETS_POLARIS',
        'PRESETS_CUSTOM_ADD',
        'COLORS_ADD',
        'THEMES_ADD',
        'EXPORT_TOKENS_DTCG',
        'EXPORT_TOKENS_NATIVE',
        'EXPORT_TOKENS_STYLE_DICTIONARY_V3',
        'EXPORT_TOKENS_UNIVERSAL',
        'EXPORT_STYLESHEET_SCSS',
        'EXPORT_STYLESHEET_LESS',
        'EXPORT_TAILWIND_V3',
        'EXPORT_TAILWIND_V4',
        'EXPORT_APPLE_SWIFTUI',
        'EXPORT_APPLE_UIKIT',
        'EXPORT_ANDROID_COMPOSE',
        'EXPORT_ANDROID_XML',
        'EXPORT_CSV',
        'REPORT',
      ],
      [
        'INVOLVE_COMMUNITY',
        'USER_LANGUAGE_JA_JP',
        'USER_LANGUAGE_KO_KR',
        'USER_LANGUAGE_ES_ES',
        'USER_LANGUAGE',
      ]
    ),
  },
}

const globalConfig: Config = {
  limits: {
    pageSize: 20,
    width: 640,
    height: 640,
    minWidth: 240,
    minHeight: 420,
    sourceColors: 5,
    customStops: 6,
    colorThemes: 2,
    localPalettes: 3,
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
    isNotionEnabled: true,
    isMistralAiEnabled: true,
    isPolarEnabled: true,
    announcementsDbId: import.meta.env.VITE_NOTION_ANNOUNCEMENTS_ID as string,
    onboardingDbId: import.meta.env.VITE_NOTION_ONBOARDING_ID as string,
    pluginId: specConfig[__PLUGIN__].pluginId,
  },
  plan: {
    isProEnabled: true,
    isTrialEnabled: false,
    isCreditsEnabled: false,
    trialTime: 72,
    creditsLimit: 500,
    creditsRenewalPeriodDays: 7,
    creditsRenewalPeriodHours: 168,
    storeProWeekId: '17eb1281-cf21-4d58-9144-76a1426ec73c',
    storeProMonthId: '1c4ad049-f424-4ec4-ac66-0997050e0060',
    storeProYearId: '87a83311-cba6-424f-a72f-84a1785a1079',
    storeProLifetimeId: '9ed0e164-8972-4f60-88cf-91b805991e87',
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
    corsWorkerUrl: isDev
      ? 'http://localhost:8989'
      : (import.meta.env.VITE_CORS_WORKER_URL as string),
    databaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
    authUrl: isDev
      ? 'http://localhost:3000'
      : (import.meta.env.VITE_AUTH_URL as string),
    storeApiUrl: import.meta.env.VITE_LEMONSQUEEZY_URL as string,
    platformUrl: 'https://www.figma.com',
    uiUrl: isDev
      ? 'http://localhost:4400'
      : 'https://figma.ui-color-palette.com',
    documentationUrl: 'https://uicp.ylb.lt/docs-figma-plugin',
    repositoryUrl: 'https://uicp.ylb.lt/repository-figma-plugin',
    communityUrl: 'https://uicp.ylb.lt/community',
    supportEmail: 'https://uicp.ylb.lt/support',
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
    storeUltimateRequestUrl: 'https://uicp.ylb.lt/ultimate-request',
    howToUseUrl: 'https://uicp.ylb.lt/how-to-use-figma',
  },
  versions: {
    userConsentVersion: '2025.09',
    trialVersion: '2024.03',
    algorithmVersion: 'v3',
    paletteVersion: '2025.06',
    pluginVersion: __APP_VERSION__,
    creditsVersion: '2026.05',
  },
  features: specConfig[__PLUGIN__].features,
  lang: 'en-US',
  fees: {
    colourLoversImport: 25,
    coolorsImport: 25,
    realtimeColorsImport: 25,
    imageColorsExtract: 50,
    harmonyCreate: 50,
    aiColorsGenerate: 50,
    paletteCreate: 100,
    paletteGenerate: 200,
    paletteWithPropsGenerate: 200,
    sheetGenerate: 200,
    paletteUpdates: 100,
    localStylesSync: 300,
    localVariablesSync: 300,
    localTokensSync: 300,
  },
}

const limitsMapping: { [key: string]: keyof typeof globalConfig.limits } = {
  COLORS_ADD: 'sourceColors',
  THEMES_ADD: 'colorThemes',
  PRESETS_CUSTOM_ADD: 'customStops',
  LOCAL_PALETTES: 'localPalettes',
}

globalConfig.features.forEach((feature) => {
  const limitKey = limitsMapping[feature.name]
  if (limitKey && globalConfig.limits[limitKey] !== undefined)
    feature.limit = globalConfig.limits[limitKey]
})

export default globalConfig
