import { Feature } from '../types/config'

export const trialTime = 48
export const oldTrialTime = 168
export const pageSize = 20
export const proxyUrl =
  'https://hook.eu1.make.com/s02o2bjkknapgjidnp5bko7duc5w6t65'
export const databaseUrl = 'https://zclweepgvqkrelyfwhma.supabase.co'
export const authUrl = 'http://localhost:3000'
export const palettesDbTableName = 'Palettes'
export const palettesStorageName = 'Palette screenshots'

export const features: Array<Feature> = [
  {
    name: 'CREATE',
    description: 'Palette creation service when several colors are selected',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'SERVICE',
    service: [],
  },
  {
    name: 'EDIT',
    description: 'Palette configuration service when the palette is selected',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'SERVICE',
    service: [],
  },
  {
    name: 'TRANSFER',
    description: 'Palette transfer service when the dev mode is selected',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'SERVICE',
    service: [],
  },
  {
    name: 'PROPERTIES',
    description: 'Shades information and WCAG scores',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'BROWSE',
    description: 'Browse UI Color Palette on the current page',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'CONTEXT',
    service: ['TRANSFER'],
  },
  {
    name: 'VIEWS',
    description: 'Information arrangement',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'DIVISION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'VIEWS_PALETTE',
    description: 'Palette view',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'VIEWS_PALETTE_WITH_PROPERTIES',
    description: 'Detailed palette view',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'VIEWS_SHEET',
    description: 'Detailed color sheet view',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'CREATE_PALETTE',
    description: 'Generate a palette',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'SYNC_LOCAL_STYLES',
    description: 'Styles local sychronization',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT'],
  },
  {
    name: 'SYNC_LOCAL_VARIABLES',
    description: 'Variable local sychronization',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT'],
  },
  {
    name: 'PUBLISH_PALETTE',
    description: 'Publish palette to the community and self',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT'],
  },
  {
    name: 'PALETTES',
    description: 'Palettes that can be reused',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'CONTEXT',
    service: ['CREATE'],
  },
  {
    name: 'PALETTES_SELF',
    description: 'Self-created palettes',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'DIVISION',
    service: ['CREATE'],
  },
  {
    name: 'PALETTES_COMMUNITY',
    description: 'Community palettes',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'DIVISION',
    service: ['CREATE'],
  },
  {
    name: 'PALETTES_DEV',
    description: 'Dev mode palettes',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'DIVISION',
    service: ['CREATE'],
  },
  {
    name: 'PALETTES_SEARCH',
    description: 'Search palettes',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'SOURCE',
    description: 'Raw source colors',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'CONTEXT',
    service: ['CREATE'],
  },
  {
    name: 'SOURCE_CANVAS',
    description: 'Selected colors from the Figma or Figjam canvas',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'SOURCE_OVERVIEW',
    description: 'Source colors overview and import',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'CONTEXT',
    service: ['CREATE'],
  },
  {
    name: 'SOURCE_EXPLORE',
    description: 'External color palettes from Colour Lovers',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'CONTEXT',
    service: ['CREATE'],
  },
  {
    name: 'SOURCE_COOLORS',
    description: 'Import colors from a Coolors palette',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'SOURCE_REALTIME_COLORS',
    description: 'Import colors from a Realtime Colors simulation',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'SCALE',
    description: 'Lightness scale configuration',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'CONTEXT',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SCALE_PRESETS',
    description: 'List of existing color systems',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'SCALE_PRESETS_NAMING_CONVENTION',
    description: 'Naming convention pattern',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'PRESETS_MATERIAL',
    description: 'Material Design color system',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'PRESETS_MATERIAL_3',
    description: 'Material 3 color system',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'PRESETS_TAILWIND',
    description: 'Tailwind color system',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'PRESETS_ANT',
    description: 'Ant Design color system',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'PRESETS_ADS',
    description: 'ADS Foundation color system',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'PRESETS_ADS_NEUTRAL',
    description: 'ADS Foundation Neutral color system',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'PRESETS_CARBON',
    description: 'IBM Carbon color system',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'PRESETS_BASE',
    description: 'Uber Base color system',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'PRESETS_CUSTOM',
    description: 'Customized color system',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE'],
  },
  {
    name: 'SCALE_CONFIGURATION',
    description: 'Lightness stops on a range slider',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SCALE_HELPER',
    description: 'Tips and tools to help configurate the scaling',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'DIVISION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SCALE_HELPER_DISTRIBUTION',
    description: 'Distribution mode according to easings',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SCALE_HELPER_TIPS',
    description: 'Keyboard shortcuts',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'COLORS',
    description: 'Source colors configuration',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'CONTEXT',
    service: ['EDIT'],
  },
  {
    name: 'COLORS_NAME',
    description: 'Source color name',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT'],
  },
  {
    name: 'COLORS_PARAMS',
    description: 'Source color parameters (hex and lch)',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT'],
  },
  {
    name: 'COLORS_HUE_SHIFTING',
    description: 'Source color hue shifting number',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT'],
  },
  {
    name: 'COLORS_DESCRIPTION',
    description: 'Source color description of the purpose',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT'],
  },
  {
    name: 'THEMES',
    description: 'Color themes configuration',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'CONTEXT',
    service: ['EDIT'],
  },
  {
    name: 'THEMES_NAME',
    description: 'Color theme name',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT'],
  },
  {
    name: 'THEMES_PARAMS',
    description: 'Palette background related to the theme',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT'],
  },
  {
    name: 'THEMES_DESCRIPTION',
    description: 'Color theme description of the purpose',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT'],
  },
  {
    name: 'EXPORT',
    description: 'Palette export options',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'CONTEXT',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_TOKENS',
    description: 'Palette export to a tokens file',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_TOKENS_JSON',
    description: 'Palette export to JSON',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_TOKENS_JSON_AMZN_STYLE_DICTIONARY',
    description: 'Palette export for the Amazon Style Dictionary',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_TOKENS_JSON_TOKENS_STUDIO',
    description: 'Palette export to the Tokens Studio plugin',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_CSS',
    description: 'Palette export to CSS',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_CSS_RGB',
    description: 'Palette export to CSS (RGB)',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_CSS_HEX',
    description: 'Palette export to CSS (Hex)',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_CSS_HSL',
    description: 'Palette export to CSS (HSL)',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_CSS_LCH',
    description: 'Palette export to CSS (LCH)',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_CSS_P3',
    description: 'Palette export to CSS (P3)',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_TAILWIND',
    description: 'Palette export to Tailwind',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_APPLE',
    description: 'Palette export for Apple projects',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_APPLE_SWIFTUI',
    description: 'Palette export to SwiftUI (Apple)',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_APPLE_UIKIT',
    description: 'Palette export to UIkit (Apple)',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_ANDROID',
    description: 'Palette export for Android projects',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_ANDROID_COMPOSE',
    description: 'Palette export to Compose (Android)',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_ANDROID_XML',
    description: 'Palette export to XML (Android)',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'EXPORT_CSV',
    description: 'Palette LCH values export to CSV',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT', 'TRANSFER'],
  },
  {
    name: 'SETTINGS',
    description: 'Palette global configuration',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'CONTEXT',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_PALETTE_NAME',
    description: 'Palette name',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_PALETTE_DESCRIPTION',
    description: 'Palette description',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_COLOR_SPACE',
    description: 'Palette global color space',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_COLOR_SPACE_LCH',
    description: 'LCH color space',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_COLOR_SPACE_OKLCH',
    description: 'OKLCH color space',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_COLOR_SPACE_LAB',
    description: 'CIELAB color space',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_COLOR_SPACE_OKLAB',
    description: 'OKLAB color space',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_COLOR_SPACE_HSL',
    description: 'HSL color space',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_COLOR_SPACE_HSLUV',
    description: 'HSLUV color space',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_VISION_SIMULATION_MODE',
    description: 'Color blind simulation mode',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_VISION_SIMULATION_MODE_NONE',
    description: 'No vision simulation mode',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_VISION_SIMULATION_MODE_PROTANOMALY',
    description: 'Protanomaly vision simulation mode',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_VISION_SIMULATION_MODE_PROTANOPIA',
    description: 'Protanopia vision simulation mode',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOMALY',
    description: 'Deuteranomaly vision simulation mode',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_VISION_SIMULATION_MODE_DEUTERANOPIA',
    description: 'Deuteranopia vision simulation mode',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_VISION_SIMULATION_MODE_TRITANOMALY',
    description: 'Tritanomaly vision simulation mode',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_VISION_SIMULATION_MODE_TRITANOPIA',
    description: 'Tritanopia vision simulation mode',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOMALY',
    description: 'Achromatomaly vision simulation mode',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_VISION_SIMULATION_MODE_ACHROMATOPSIA',
    description: 'Achromatopsia vision simulation mode',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SETTINGS_NEW_ALGORITHM',
    description: 'Color shades generation algorithm',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['EDIT'],
  },
  {
    name: 'SETTINGS_TEXT_COLORS_THEME',
    description: 'Text colors customization',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SHORTCUTS',
    description: 'Quick useful links',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'DIVISION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SHORTCUTS_USER',
    description: 'User menu',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'DIVISION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SHORTCUTS_HIGHLIGHT',
    description: 'Release notes',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SHORTCUTS_DOCUMENTATION',
    description: 'User documentation',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SHORTCUTS_REPOSITORY',
    description: 'Repository',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SHORTCUTS_EMAIL',
    description: 'Support email',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SHORTCUTS_FEEDBACK',
    description: 'NPS and feedback form to get NPS',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SHORTCUTS_REPORTING',
    description: 'Bug reports',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SHORTCUTS_REQUESTS',
    description: 'Feature requests',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SHORTCUTS_ABOUT',
    description: 'Additional information',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'SHORTCUTS_NETWORKING',
    description: 'LinkedIn page',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
  {
    name: 'PUBLICATION',
    description: 'Palette publication pitch',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'DIVISION',
    service: ['EDIT'],
  },
  {
    name: 'GET_PRO_PLAN',
    description: 'Pro plan subscription',
    isActive: true,
    isPro: false,
    isNew: false,
    type: 'ACTION',
    service: ['CREATE', 'EDIT'],
  },
]

export default features
