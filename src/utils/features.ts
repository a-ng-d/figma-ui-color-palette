interface Features {
  name: string
  description: string
  isPro: boolean
  isActive: boolean
}

export const features: Array<Features> = [
  {
    name: 'onboarding',
    description: 'Onboarding service when the selection is empty',
    isActive: true,
    isPro: false
  },
  {
    name: 'highlight',
    description: 'Release note that highlights the key feature',
    isActive: true,
    isPro: false
  },
  {
    name: 'create palette',
    description: 'Palette creation service when several colors are selected',
    isActive: true,
    isPro: false
  },
  {
    name: 'edit palette',
    description: 'Palette configuration service when the palette is selected',
    isActive: true,
    isPro: false
  },
  {
    name: 'shortcuts',
    description: 'Quick links and accesses',
    isActive: true,
    isPro: false
  },
  {
    name: 'scale',
    description: 'Lightness scale configuration',
    isActive: true,
    isPro: false
  },
  {
    name: 'properties',
    description: 'Shades information and WCAG scores',
    isActive: true,
    isPro: false
  },
  {
    name: 'go create palette',
    description: 'Generate a palette',
    isActive: true,
    isPro: false
  },
  {
    name: 'create local styles',
    description: 'Create local styles on the document',
    isActive: true,
    isPro: false
  },
  {
    name: 'update local styles',
    description: 'Update local styles on the document',
    isActive: true,
    isPro: false
  },
  {
    name: 'presets',
    description: 'List of existing color systems',
    isActive: true,
    isPro: false
  },
  {
    name: 'lightness configuration',
    description: 'The lightness stops on a range slider',
    isActive: true,
    isPro: false
  },
  {
    name: 'lightness configuration tips',
    description: 'Tip message to onboard users about how to configure the lightness scale',
    isActive: true,
    isPro: false
  },
  {
    name: 'colors',
    description: 'Source colors configuration',
    isActive: true,
    isPro: false
  },
  {
    name: 'export',
    description: 'Palette export options',
    isActive: true,
    isPro: false
  },
  {
    name: 'json export',
    description: 'Palette export to JSON',
    isActive: true,
    isPro: false
  },
  {
    name: 'css export',
    description: 'Palette export to CSS',
    isActive: true,
    isPro: false
  },
  {
    name: 'lch csv export',
    description: 'Palette LCH values export to CSV',
    isActive: true,
    isPro: false
  },
  {
    name: 'settings',
    description: 'Palette global configuration',
    isActive: true,
    isPro: false
  },
  {
    name: 'edit palette name',
    description: 'Palette name text field',
    isActive: true,
    isPro: false
  },
  {
    name: 'enable new algorithm',
    description: 'Toggle for enabling or disabling the color shades generation new algorithm',
    isActive: true,
    isPro: false
  },
  {
    name: 'about',
    description: 'Additional informations and useful links',
    isActive: true,
    isPro: false
  },
]
