import { doSpecificMode, featuresScheme } from './stores/features'

// Theme
export const theme = 'figma-ui3'

// Limitations
export const isTrialEnabled = false
export const isProEnabled = true
export const trialTime = 48
export const oldTrialTime = 72
export const pageSize = 20

// Versions
export const userConsentVersion = '2024.01'
export const trialVersion = '2024.03'
export const algorithmVersion = 'v3'
export const paletteDataVersion = '2025.03'

// URLs
export const authWorkerUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8787'
    : (process.env.REACT_APP_AUTH_WORKER_URL as string)
export const announcementsWorkerUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8888'
    : (process.env.REACT_APP_ANNOUNCEMENTS_WORKER_URL as string)
export const databaseUrl = process.env.REACT_APP_SUPABASE_URL as string
export const authUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : (process.env.REACT_APP_AUTH_URL as string)

export const palettesDbTableName =
  process.env.NODE_ENV === 'development' ? 'sandbox.palettes' : 'palettes'
export const palettesStorageName =
  process.env.NODE_ENV === 'development'
    ? 'sandbox.palette.screenshots'
    : 'palette.screenshots'

// External URLs
export const documentationUrl = 'https://uicp.ylb.lt/docs'
export const repositoryUrl = 'https://uicp.ylb.lt/repository'
export const supportEmail = 'https://uicp.ylb.lt/contact'
export const feedbackUrl = 'https://uicp.ylb.lt/feedback'
export const trialFeedbackUrl = 'https://uicp.ylb.lt/feedback-trial'
export const requestsUrl = 'https://uicp.ylb.lt/ideas'
export const networkUrl = 'https://uicp.ylb.lt/network'
export const authorUrl = 'https://uicp.ylb.lt/author'
export const licenseUrl = 'https://uicp.ylb.lt/license'
export const privacyUrl = 'https://isb.ylb.lt/privacy'
export const vsCodeFigmaPluginUrl =
  'https://marketplace.visualstudio.com/items?itemName=figma.figma-vscode-extension'
export const isbUrl = 'https://isb.ylb.lt/run'

// Features modes
const devMode = featuresScheme
const prodMode = doSpecificMode(
  [
    'SYNC_LOCAL_STYLES',
    'SYNC_LOCAL_VARIABLES',
    'SOURCE',
    'PRESETS_MATERIAL_3',
    'PRESETS_TAILWIND',
    'PRESETS_ADS',
    'PRESETS_ADS_NEUTRAL',
    'PRESETS_CARBON',
    'PRESETS_BASE',
    'PRESETS_POLARIS',
    'SCALE_CHROMA',
    'SCALE_HELPER_DISTRIBUTION_SLOW_EASE_IN',
    'SCALE_HELPER_DISTRIBUTION_SLOW_EASE_OUT',
    'SCALE_HELPER_DISTRIBUTION_SLOW_EASE_IN_OUT',
    'SCALE_HELPER_DISTRIBUTION_EASE_IN',
    'SCALE_HELPER_DISTRIBUTION_EASE_IN_OUT',
    'SCALE_HELPER_DISTRIBUTION_FAST_EASE_IN',
    'SCALE_HELPER_DISTRIBUTION_FAST_EASE_OUT',
    'SCALE_HELPER_DISTRIBUTION_FAST_EASE_IN_OUT',
    'THEMES',
    'THEMES_NAME',
    'THEMES_PARAMS',
    'THEMES_DESCRIPTION',
    'COLORS',
    'COLORS_HUE_SHIFTING',
    'COLORS_CHROMA_SHIFTING',
    'EXPORT_TOKENS_JSON_AMZN_STYLE_DICTIONARY',
    'EXPORT_TOKENS_JSON_TOKENS_STUDIO',
    'EXPORT_TAILWIND',
    'EXPORT_APPLE_SWIFTUI',
    'EXPORT_APPLE_UIKIT',
    'EXPORT_ANDROID_COMPOSE',
    'EXPORT_ANDROID_XML',
    'EXPORT_CSV',
    'VIEWS_SHEET',
    'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOMALY',
    'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOPIA',
    'SETTINGS_VISION_SIMULATION_MODE_TRITANOMALY',
    'SETTINGS_VISION_SIMULATION_MODE_TRITANOPIA',
    'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOMALY',
    'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOPSIA',
  ],
  [
    'PREVIEW_LOCK_SOURCE_COLORS',
    'SETTINGS_PREFERENCES',
    'SETTINGS_SYNC_DEEP_PALETTE',
    'SETTINGS_SYNC_DEEP_VARIABLES',
    'SETTINGS_SYNC_DEEP_STYLES',
    'SETTINGS_ALGORITHM',
    'SETTINGS_ALGORITHM_V3',
  ]
)

export const features =
  process.env.NODE_ENV === 'development' ? devMode : prodMode

export default features
