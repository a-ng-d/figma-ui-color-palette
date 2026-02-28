import { ConsentConfiguration } from '@unoff/ui'
import globalConfig from '../../global.config'

const checkUserConsent = async (userConsent: Array<ConsentConfiguration>) => {
  const currentUserConsentVersion = await figma.clientStorage.getAsync(
    'user_consent_version'
  )

  const userConsentData = await Promise.all(
    userConsent.map(async (consent) => {
      return {
        ...consent,
        isConsented: await figma.clientStorage.getAsync(
          `${consent.id}_user_consent`
        ),
      }
    })
  )

  return figma.ui.postMessage({
    type: 'CHECK_USER_CONSENT',
    data: {
      mustUserConsent:
        currentUserConsentVersion !==
          globalConfig.versions.userConsentVersion ||
        currentUserConsentVersion === undefined,
      userConsent: userConsentData,
    },
  })
}

export default checkUserConsent
