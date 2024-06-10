import { ConsentConfiguration } from '@a_ng_d/figmug-ui'

import { lang, locals } from '../content/locals'

export const userConsent: Array<ConsentConfiguration> = [
  {
    name: locals[lang].vendors.mixpanel.name,
    id: 'mixpanel',
    icon: 'https://asset.brandfetch.io/idr_rhI2FS/ideb-tnj2D.svg',
    description: locals[lang].vendors.mixpanel.description,
    isConsented: false,
  },
  {
    name: locals[lang].vendors.sentry.name,
    id: 'sentry',
    icon: 'https://asset.brandfetch.io/idag_928SW/idvt5Qs5eF.jpeg',
    description: locals[lang].vendors.sentry.description,
    isConsented: false,
  },
]
