import { ConsentConfiguration } from '@a_ng_d/figmug-ui'
import { locales } from '../content/locales'

export const userConsent: Array<ConsentConfiguration> = [
  {
    name: locales.get().vendors.mixpanel.name,
    id: 'mixpanel',
    icon: 'https://asset.brandfetch.io/idr_rhI2FS/ideb-tnj2D.svg',
    description: locales.get().vendors.mixpanel.description,
    isConsented: false,
  },
]
