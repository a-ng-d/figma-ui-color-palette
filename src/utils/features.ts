import type { Features } from './types'

export const features: Array<Features> = [
  {
    name: 'ONBOARDING',
    description: 'Onboarding service when the selection is empty',
    isActive: true,
    isPro: false,
    type: 'SERVICE',
    service: [],
  },
  {
    name: 'CREATE',
    description: 'Palette creation service when several colors are selected',
    isActive: true,
    isPro: false,
    type: 'SERVICE',
    service: [],
  },
  {
    name: 'EDIT',
    description: 'Palette configuration service when the palette is selected',
    isActive: true,
    isPro: false,
    type: 'SERVICE',
    service: [],
  },
  {
    name: 'HIGHLIGHT',
    description: 'Release note that highlights the key feature',
    isActive: true,
    isPro: false,
    type: 'DIVISION',
    service: ['onboard', 'create', 'edit'],
  },
  {
    name: 'SHORTCUTS',
    description: 'Quick links and access',
    isActive: true,
    isPro: false,
    type: 'DIVISION',
    service: ['onboard', 'create', 'edit'],
  },
  {
    name: 'PROPERTIES',
    description: 'Shades information and WCAG scores',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['create', 'edit'],
  },
  {
    name: 'CREATE_PALETTE',
    description: 'Generate a palette',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['create'],
  },
  {
    name: 'CREATE_LOCAL_STYLES',
    description: 'Create local styles on the document',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['edit'],
  },
  {
    name: 'UPDATE_LOCAL_STYLES',
    description: 'Update local styles on the document',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['edit'],
  },
  {
    name: 'SCALE',
    description: 'Lightness scale configuration',
    isActive: true,
    isPro: false,
    type: 'CONTEXT',
    service: ['create', 'edit'],
  },
  {
    name: 'SCALE_PRESETS',
    description: 'List of existing color systems',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['create'],
  },
  {
    name: 'SCALE_CONFIGURATION',
    description: 'The lightness stops on a range slider',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['create', 'edit'],
  },
  {
    name: 'SCALE_TIPS',
    description:
      'Tip message to onboard users about how to configure the lightness scale',
    isActive: true,
    isPro: false,
    type: 'DIVISION',
    service: ['create', 'edit'],
  },
  {
    name: 'COLORS',
    description: 'Source colors configuration',
    isActive: true,
    isPro: false,
    type: 'CONTEXT',
    service: ['edit'],
  },
  {
    name: 'COLORS_OKLCH_SPACE',
    description: 'OKLCH color space toggle',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['edit'],
  },
  {
    name: 'COLORS_HUE_SHIFTING',
    description: 'Color hue shifting number field',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['edit'],
  },
  {
    name: 'EXPORT',
    description: 'Palette export options',
    isActive: true,
    isPro: false,
    type: 'CONTEXT',
    service: ['edit'],
  },
  {
    name: 'EXPORT_JSON',
    description: 'Palette export to JSON',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['edit'],
  },
  {
    name: 'EXPORT_CSS',
    description: 'Palette export to CSS',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['edit'],
  },
  {
    name: 'EXPORT_CSV',
    description: 'Palette LCH values export to CSV',
    isActive: true,
    isPro: true,
    type: 'ACTION',
    service: ['edit'],
  },
  {
    name: 'SETTINGS',
    description: 'Palette global configuration',
    isActive: true,
    isPro: false,
    type: 'CONTEXT',
    service: ['create', 'edit'],
  },
  {
    name: 'SETTINGS_PALETTE_NAME',
    description: 'Palette name text field',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['create', 'edit'],
  },
  {
    name: 'SETTINGS_TEXT_COLORS_THEME',
    description: 'Text colors customization to better check contrast',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['create', 'edit'],
  },
  {
    name: 'SETTINGS_NEW_ALGORITHM',
    description: 'Color shades generation new algorithm toggle',
    isActive: true,
    isPro: false,
    type: 'ACTION',
    service: ['edit'],
  },
  {
    name: 'ABOUT',
    description: 'Additional informations and useful links',
    isActive: true,
    isPro: false,
    type: 'CONTEXT',
    service: ['create', 'edit'],
  },
]
