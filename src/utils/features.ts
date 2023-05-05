interface Features {
  name: string
  description: string
  isActive: boolean
  isPro: boolean
  type: string
}

export const features: Array<Features> = [
  {
    name: 'ONBOARDING',
    description: 'Onboarding service when the selection is empty',
    isActive: true,
    isPro: false,
    type: 'SERVICE'
  },
  {
    name: 'CREATE_PALETTE',
    description: 'Palette creation service when several colors are selected',
    isActive: true,
    isPro: false,
    type: 'SERVICE'
  },
  {
    name: 'EDIT_PALETTE',
    description: 'Palette configuration service when the palette is selected',
    isActive: true,
    isPro: false,
    type: 'SERVICE'
  },
  {
    name: 'HIGHLIGHT',
    description: 'Release note that highlights the key feature',
    isActive: true,
    isPro: false,
    type: 'DIVISION'
  },
  {
    name: 'SHORTCUTS',
    description: 'Quick links and access',
    isActive: true,
    isPro: false,
    type: 'DIVISION'
  },
  {
    name: 'PROPERTIES',
    description: 'Shades information and WCAG scores',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'GO_CREATE_PALETTE',
    description: 'Generate a palette',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'CREATE_LOCAL_STYLES',
    description: 'Create local styles on the document',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'UPDATE_LOCAL_STYLES',
    description: 'Update local styles on the document',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'SCALE',
    description: 'Lightness scale configuration',
    isActive: true,
    isPro: false,
    type: 'CONTEXT'
  },
  {
    name: 'PRESETS',
    description: 'List of existing color systems',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'LIGHTNESS_CONFIGURATION',
    description: 'The lightness stops on a range slider',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'LIGHTNESS_CONFIGURATION_TIPS',
    description: 'Tip message to onboard users about how to configure the lightness scale',
    isActive: true,
    isPro: false,
    type: 'DIVISION'
  },
  {
    name: 'COLORS',
    description: 'Source colors configuration',
    isActive: true,
    isPro: false,
    type: 'CONTEXT'
  },
  {
    name: 'OKLCH_COLOR_SPACE',
    description: 'OKLCH color space toggle',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'HUE_SHIFTING',
    description: 'Color hue shifting number field',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'EXPORT',
    description: 'Palette export options',
    isActive: true,
    isPro: false,
    type: 'CONTEXT'
  },
  {
    name: 'JSON_EXPORT',
    description: 'Palette export to JSON',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'CSS_EXPORT',
    description: 'Palette export to CSS',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'LCH_CSV_EXPORT',
    description: 'Palette LCH values export to CSV',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'SETTINGS',
    description: 'Palette global configuration',
    isActive: true,
    isPro: false,
    type: 'CONTEXT'
  },
  {
    name: 'EDIT_PALETTE_NAME',
    description: 'Palette name text field',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'ENABLE_NEW_ALGORITHM',
    description: 'Color shades generation new algorithm toggle',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'ABOUT',
    description: 'Additional informations and useful links',
    isActive: true,
    isPro: false,
    type: 'CONTEXT'
  },
]
