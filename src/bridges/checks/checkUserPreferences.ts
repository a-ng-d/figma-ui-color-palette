import { Language } from '../../types/translations'
import { locales } from '../../content/locales'

const checkUserPreferences = async () => {
  const isWCAGDisplayed =
    await figma.clientStorage.getAsync('is_wcag_displayed')
  const isAPCADisplayed =
    await figma.clientStorage.getAsync('is_apca_displayed')
  const canDeepSyncStyles = await figma.clientStorage.getAsync(
    'can_deep_sync_styles'
  )
  const canDeepSyncVariables = await figma.clientStorage.getAsync(
    'can_deep_sync_variables'
  )
  const isVsCodeMessageDisplayed = await figma.clientStorage.getAsync(
    'is_vscode_message_displayed'
  )
  const userLanguage = await figma.clientStorage.getAsync('user_language')

  if (isWCAGDisplayed === undefined)
    await figma.clientStorage.setAsync('is_wcag_displayed', true)

  if (isAPCADisplayed === undefined)
    await figma.clientStorage.setAsync('is_apca_displayed', true)

  if (canDeepSyncStyles === undefined)
    await figma.clientStorage.setAsync('can_deep_sync_styles', false)

  if (canDeepSyncVariables === undefined)
    await figma.clientStorage.setAsync('can_deep_sync_variables', false)

  if (isVsCodeMessageDisplayed === undefined)
    await figma.clientStorage.setAsync('is_vscode_message_displayed', true)

  if (userLanguage === undefined)
    await figma.clientStorage.setAsync('user_language', 'en-US')

  locales.set((userLanguage as Language) ?? 'en-US')

  return figma.ui.postMessage({
    type: 'CHECK_USER_PREFERENCES',
    data: {
      isWCAGDisplayed:
        isWCAGDisplayed === undefined ? true : isWCAGDisplayed === 'true',
      isAPCADisplayed:
        isAPCADisplayed === undefined ? true : isAPCADisplayed === 'true',
      canDeepSyncStyles:
        canDeepSyncStyles === undefined ? false : canDeepSyncStyles === 'true',
      canDeepSyncVariables:
        canDeepSyncVariables === undefined
          ? false
          : canDeepSyncVariables === 'true',
      isVsCodeMessageDisplayed:
        isVsCodeMessageDisplayed === undefined
          ? true
          : isVsCodeMessageDisplayed === 'true',
      userLanguage: userLanguage ?? 'en-US',
    },
  })
}

export default checkUserPreferences
