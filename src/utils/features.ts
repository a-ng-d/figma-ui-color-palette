interface Features {
  name: string
  description: string
  isActive: boolean
  isPro: boolean
  type: string
}

export const features: Array<Features> = [
  {
    name: 'onboarding',
    description: 'Onboarding service when the selection is empty',
    isActive: true,
    isPro: false,
    type: 'SERVICE'
  },
  {
    name: 'create palette',
    description: 'Palette creation service when several colors are selected',
    isActive: true,
    isPro: false,
    type: 'SERVICE'
  },
  {
    name: 'edit palette',
    description: 'Palette configuration service when the palette is selected',
    isActive: true,
    isPro: false,
    type: 'SERVICE'
  },
  {
    name: 'highlight',
    description: 'Release note that highlights the key feature',
    isActive: true,
    isPro: false,
    type: 'DIVISION'
  },
  {
    name: 'shortcuts',
    description: 'Quick links and access',
    isActive: true,
    isPro: false,
    type: 'DIVISION'
  },
  {
    name: 'properties',
    description: 'Shades information and WCAG scores',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'go create palette',
    description: 'Generate a palette',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'create local styles',
    description: 'Create local styles on the document',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'update local styles',
    description: 'Update local styles on the document',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'scale',
    description: 'Lightness scale configuration',
    isActive: true,
    isPro: false,
    type: 'CONTEXT'
  },
  {
    name: 'presets',
    description: 'List of existing color systems',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'lightness configuration',
    description: 'The lightness stops on a range slider',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'lightness configuration tips',
    description: 'Tip message to onboard users about how to configure the lightness scale',
    isActive: true,
    isPro: false,
    type: 'DIVISION'
  },
  {
    name: 'colors',
    description: 'Source colors configuration',
    isActive: true,
    isPro: false,
    type: 'CONTEXT'
  },
  {
    name: 'oklch color space',
    description: 'OKLCH color space toggle',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'hue shifting',
    description: 'Color hue shifting number field',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'export',
    description: 'Palette export options',
    isActive: true,
    isPro: false,
    type: 'CONTEXT'
  },
  {
    name: 'json export',
    description: 'Palette export to JSON',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'css export',
    description: 'Palette export to CSS',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'lch csv export',
    description: 'Palette LCH values export to CSV',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'settings',
    description: 'Palette global configuration',
    isActive: true,
    isPro: false,
    type: 'CONTEXT'
  },
  {
    name: 'edit palette name',
    description: 'Palette name text field',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'enable new algorithm',
    description: 'Color shades generation new algorithm toggle',
    isActive: true,
    isPro: false,
    type: 'ACTION'
  },
  {
    name: 'about',
    description: 'Additional informations and useful links',
    isActive: true,
    isPro: false,
    type: 'CONTEXT'
  },
]
