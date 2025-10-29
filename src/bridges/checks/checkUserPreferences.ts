import { Language } from '@ui-lib/types/translations'
import { locales } from '@ui-lib/content/locales'

const checkUserPreferences = async () => {
  let isWCAGDisplayed = await figma.clientStorage.getAsync('is_wcag_displayed')
  let isAPCADisplayed = await figma.clientStorage.getAsync('is_apca_displayed')
  let canDeepSyncStyles = await figma.clientStorage.getAsync(
    'can_deep_sync_styles'
  )
  let canDeepSyncVariables = await figma.clientStorage.getAsync(
    'can_deep_sync_variables'
  )
  let isVsCodeMessageDisplayed = await figma.clientStorage.getAsync(
    'is_vscode_message_displayed'
  )
  let userLanguage = await figma.clientStorage.getAsync('user_language')

  if (isWCAGDisplayed === undefined) {
    await figma.clientStorage.setAsync('is_wcag_displayed', true)
    isWCAGDisplayed = true
  }

  if (isAPCADisplayed === undefined) {
    await figma.clientStorage.setAsync('is_apca_displayed', true)
    isAPCADisplayed = true
  }

  if (canDeepSyncStyles === undefined) {
    await figma.clientStorage.setAsync('can_deep_sync_styles', false)
    canDeepSyncStyles = false
  }

  if (canDeepSyncVariables === undefined) {
    await figma.clientStorage.setAsync('can_deep_sync_variables', false)
    canDeepSyncVariables = false
  }

  if (isVsCodeMessageDisplayed === undefined) {
    await figma.clientStorage.setAsync('is_vscode_message_displayed', true)
    isVsCodeMessageDisplayed = true
  }

  if (userLanguage === undefined) {
    await figma.clientStorage.setAsync('user_language', 'en-US')
    userLanguage = 'en-US'
  }

  locales.set((userLanguage as Language) ?? 'en-US')

  // Migration - Convert string preferences to boolean
  if (isWCAGDisplayed === 'true' || isWCAGDisplayed === 'false') {
    isWCAGDisplayed = isWCAGDisplayed === 'true'
    await figma.clientStorage.setAsync('is_wcag_displayed', isWCAGDisplayed)
  }

  if (isAPCADisplayed === 'true' || isAPCADisplayed === 'false') {
    isAPCADisplayed = isAPCADisplayed === 'true'
    await figma.clientStorage.setAsync('is_apca_displayed', isAPCADisplayed)
  }

  if (canDeepSyncStyles === 'true' || canDeepSyncStyles === 'false') {
    canDeepSyncStyles = canDeepSyncStyles === 'true'
    await figma.clientStorage.setAsync(
      'can_deep_sync_styles',
      canDeepSyncStyles
    )
  }

  if (canDeepSyncVariables === 'true' || canDeepSyncVariables === 'false') {
    canDeepSyncVariables = canDeepSyncVariables === 'true'
    await figma.clientStorage.setAsync(
      'can_deep_sync_variables',
      canDeepSyncVariables
    )
  }

  if (
    isVsCodeMessageDisplayed === 'true' ||
    isVsCodeMessageDisplayed === 'false'
  ) {
    isVsCodeMessageDisplayed = isVsCodeMessageDisplayed === 'true'
    await figma.clientStorage.setAsync(
      'is_vscode_message_displayed',
      isVsCodeMessageDisplayed
    )
  }

  return figma.ui.postMessage({
    type: 'CHECK_USER_PREFERENCES',
    data: {
      isWCAGDisplayed: isWCAGDisplayed,
      isAPCADisplayed: isAPCADisplayed,
      canDeepSyncStyles: canDeepSyncStyles,
      canDeepSyncVariables: canDeepSyncVariables,
      isVsCodeMessageDisplayed: isVsCodeMessageDisplayed,
      userLanguage: userLanguage,
    },
  })
}

export default checkUserPreferences
