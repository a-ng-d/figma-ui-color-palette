import { userConsentVersion } from '../../utils/config'
import { userConsent } from '../../utils/userConsent'

const checkUserConsent = async () => {
  const currentUserConsentVersion = await figma.clientStorage.getAsync(
    'user_consent_version'
  )
  const mixpanel = await figma.clientStorage.getAsync('mixpanel_user_consent')

  figma.ui.postMessage({
    type: 'CHECK_USER_CONSENT',
    mustUserConsent:
      currentUserConsentVersion !== userConsentVersion ||
      currentUserConsentVersion === undefined,
    userConsent: userConsent.map((consent) => {
      return {
        ...consent,
        isConsented: mixpanel === undefined ? false : mixpanel,
      }
    }),
  })
}

export default checkUserConsent
