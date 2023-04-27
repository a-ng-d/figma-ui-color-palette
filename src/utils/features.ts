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
    name: 'properties',
    description: 'Shades information and WCAG scores',
    isActive: true,
    isPro: false
  },
  {
    name: 'go create palette',
    description: 'Generate a palette',
    isActive: false,
    isPro: false
  }
]
