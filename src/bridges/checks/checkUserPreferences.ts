import globalConfig from '../../global.config'
import { tolgee } from '../..'

const checkUserPreferences = async () => {
  let isWCAGDisplayed = await figma.clientStorage.getAsync('is_wcag_displayed')
  let isAPCADisplayed = await figma.clientStorage.getAsync('is_apca_displayed')
  let canDeepSyncStyles = await figma.clientStorage.getAsync(
    'can_deep_sync_styles'
  )
  let canDeepSyncVariables = await figma.clientStorage.getAsync(
    'can_deep_sync_variables'
  )
  let isSuggestedLanguageDisplayed = await figma.clientStorage.getAsync(
    'is_suggested_language_displayed'
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

  if (isSuggestedLanguageDisplayed === undefined) {
    await figma.clientStorage.setAsync('is_suggested_language_displayed', true)
    isSuggestedLanguageDisplayed = true
  }

  if (userLanguage === undefined) {
    await figma.clientStorage.setAsync('user_language', globalConfig.lang)
    userLanguage = globalConfig.lang
  }

  tolgee.changeLanguage(userLanguage)

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
    isSuggestedLanguageDisplayed === 'true' ||
    isSuggestedLanguageDisplayed === 'false'
  ) {
    isSuggestedLanguageDisplayed = isSuggestedLanguageDisplayed === 'true'
    await figma.clientStorage.setAsync(
      'is_suggested_language_displayed',
      isSuggestedLanguageDisplayed
    )
  }

  return figma.ui.postMessage({
    type: 'CHECK_USER_PREFERENCES',
    data: {
      isWCAGDisplayed: isWCAGDisplayed,
      isAPCADisplayed: isAPCADisplayed,
      canDeepSyncStyles: canDeepSyncStyles,
      canDeepSyncVariables: canDeepSyncVariables,
      isSuggestedLanguageDisplayed: isSuggestedLanguageDisplayed,
      userLanguage: userLanguage,
    },
  })
}

export default checkUserPreferences
