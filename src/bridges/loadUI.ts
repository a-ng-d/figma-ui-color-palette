import { locales } from '../content/locales'
import checkAnnouncementsStatus from './checks/checkAnnouncementsStatus'
import checkEditorType from './checks/checkEditorType'
import checkTrialStatus from './checks/checkTrialStatus'
import checkUserConsent from './checks/checkUserConsent'
import checkUserPreferences from './checks/checkUserPreferences'
import createDocument from './creations/createDocument'
import createLocalStyles from './creations/createLocalStyles'
import createPalette from './creations/createPalette'
import createPaletteFromDocument from './creations/createPaletteFromDocument'
import createPaletteFromDuplication from './creations/createPaletteFromDuplication'
import createPaletteFromRemote from './creations/createPaletteFromRemote'
import deletePalette from './creations/deletePalette'
import enableTrial from './enableTrial'
import exportCss from './exports/exportCss'
import exportCsv from './exports/exportCsv'
import exportJson from './exports/exportJson'
import exportJsonAmznStyleDictionary from './exports/exportJsonAmznStyleDictionary'
import exportJsonDtcg from './exports/exportJsonDtcg'
import exportJsonTokensStudio from './exports/exportJsonTokensStudio'
import exportKt from './exports/exportKt'
import exportSwiftUI from './exports/exportSwiftUI'
import exportTailwind from './exports/exportTailwind'
import exportUIKit from './exports/exportUIKit'
import exportXml from './exports/exportXml'
import getPalettesOnCurrentPage from './getPalettesOnCurrentPage'
import getProPlan from './getProPlan'
import jumpToPalette from './jumpToPalette'
import processSelection from './processSelection'
import updateColors from './updates/updateColors'
import updateLocalStyles from './updates/updateLocalStyles'
import updatePalette from './updates/updatePalette'
import updateScale from './updates/updateScale'
import updateSettings from './updates/updateSettings'
import updateThemes from './updates/updateThemes'

interface Window {
  width: number
  height: number
}

const loadUI = async () => {
  const windowSize: Window = {
    width: (await figma.clientStorage.getAsync('plugin_window_width')) ?? 640,
    height: (await figma.clientStorage.getAsync('plugin_window_height')) ?? 640,
  }

  figma.showUI(__html__, {
    width: windowSize.width,
    height: windowSize.height,
    title: `${locales.get().name}${locales.get().separator}${locales.get().tagline}`,
    themeColors: true,
  })

  // Canvas > UI
  figma.ui.postMessage({
    type: 'CHECK_USER_AUTHENTICATION',
    data: {
      id: figma.currentUser?.id,
      fullName: figma.currentUser?.name,
      avatar: figma.currentUser?.photoUrl,
      accessToken: await figma.clientStorage.getAsync('supabase_access_token'),
      refreshToken: await figma.clientStorage.getAsync(
        'supabase_refresh_token'
      ),
    },
  })

  // Checks
  checkUserConsent()
    .then(() => checkEditorType())
    .then(() => checkTrialStatus())
    .then(() => checkUserPreferences())
    .then(() => processSelection())

  // UI > Canvas
  figma.ui.onmessage = async (msg) => {
    const path = msg

    const actions: { [key: string]: () => void } = {
      RESIZE_UI: async () => {
        await figma.clientStorage.setAsync(
          'plugin_window_width',
          path.data.width
        )
        await figma.clientStorage.setAsync(
          'plugin_window_height',
          path.data.height
        )

        figma.ui.resize(path.data.width, path.data.height)
      },
      //
      CHECK_USER_CONSENT: () => checkUserConsent(),
      CHECK_ANNOUNCEMENTS_STATUS: () =>
        checkAnnouncementsStatus(path.data.version),
      //
      UPDATE_SCALE: () => updateScale(path),
      UPDATE_COLORS: () => updateColors(path),
      UPDATE_THEMES: () => updateThemes(path),
      UPDATE_SETTINGS: () => updateSettings(path),
      UPDATE_PALETTE: () =>
        updatePalette({
          msg: path,
          isAlreadyUpdated: path.isAlreadyUpdated,
          shouldLoadPalette: path.shouldLoadPalette,
        }),
      UPDATE_LANGUAGE: async () => {
        await figma.clientStorage.setAsync('user_language', path.data.lang)
        locales.set(path.data.lang)
      },
      //
      CREATE_PALETTE: () =>
        createPalette(path).finally(() =>
          figma.ui.postMessage({ type: 'STOP_LOADER' })
        ),
      CREATE_PALETTE_FROM_DOCUMENT: () =>
        createPaletteFromDocument().finally(() =>
          figma.ui.postMessage({ type: 'STOP_LOADER' })
        ),
      CREATE_PALETTE_FROM_REMOTE: () =>
        createPaletteFromRemote(path)
          .finally(() => figma.ui.postMessage({ type: 'STOP_LOADER' }))
          .catch((error) => {
            figma.ui.postMessage({
              type: 'POST_MESSAGE',
              data: {
                type: 'INFO',
                message: error.message,
              },
            })
          }),
      SYNC_LOCAL_STYLES: async () =>
        createLocalStyles(path.id)
          .then(async (message) => [message, await updateLocalStyles(path.id)])
          .then((messages) =>
            figma.ui.postMessage({
              type: 'POST_MESSAGE',
              data: {
                type: 'INFO',
                message: messages.join(locales.get().separator),
                timer: 10000,
              },
            })
          )
          .finally(() => figma.ui.postMessage({ type: 'STOP_LOADER' }))
          .catch((error) => {
            figma.ui.postMessage({
              type: 'POST_MESSAGE',
              data: {
                type: 'ERROR',
                message: error.message,
              },
            })
          }),
      CREATE_DOCUMENT: () =>
        createDocument(path.id, path.view)
          .finally(() => figma.ui.postMessage({ type: 'STOP_LOADER' }))
          .catch((error) => {
            figma.ui.postMessage({
              type: 'POST_MESSAGE',
              data: {
                type: 'ERROR',
                message: error.message,
              },
            })
          }),
      //
      EXPORT_PALETTE: () => {
        path.export === 'TOKENS_DTCG' &&
          exportJsonDtcg(path.id, path.colorSpace)
        path.export === 'TOKENS_GLOBAL' && exportJson(path.id)
        path.export === 'TOKENS_AMZN_STYLE_DICTIONARY' &&
          exportJsonAmznStyleDictionary(path.id)
        path.export === 'TOKENS_TOKENS_STUDIO' &&
          exportJsonTokensStudio(path.id)
        path.export === 'CSS' && exportCss(path.id, path.colorSpace)
        path.export === 'TAILWIND' && exportTailwind(path.id)
        path.export === 'APPLE_SWIFTUI' && exportSwiftUI(path.id)
        path.export === 'APPLE_UIKIT' && exportUIKit(path.id)
        path.export === 'ANDROID_COMPOSE' && exportKt(path.id)
        path.export === 'ANDROID_XML' && exportXml(path.id)
        path.export === 'CSV' && exportCsv(path.id)
      },
      //
      POST_MESSAGE: () => {
        figma.ui.postMessage({
          type: 'POST_MESSAGE',
          data: {
            type: path.data.type,
            message: path.data.message,
          },
        })
      },
      SET_ITEMS: () => {
        path.items.forEach(async (item: { key: string; value: unknown }) => {
          if (typeof item.value === 'object')
            figma.clientStorage.setAsync(item.key, JSON.stringify(item.value))
          else if (
            typeof item.value === 'boolean' ||
            typeof item.value === 'number'
          )
            figma.clientStorage.setAsync(item.key, item.value.toString())
          else figma.clientStorage.setAsync(item.key, item.value as string)
        })
      },
      GET_ITEMS: async () =>
        path.items.map(async (item: string) => {
          const value = await figma.clientStorage.getAsync(item)
          if (value && typeof value === 'string')
            figma.ui.postMessage({
              type: `GET_ITEM_${item.toUpperCase()}`,
              value: value,
            })
        }),
      DELETE_ITEMS: () =>
        path.items.forEach(async (item: string) =>
          figma.clientStorage.setAsync(item, '')
        ),
      SET_DATA: () =>
        path.items.forEach((item: { key: string; value: string }) =>
          figma.currentPage.setPluginData(item.key, JSON.stringify(item.value))
        ),
      GET_DATA: async () =>
        path.items.map((item: string) => {
          const value = figma.currentPage.getPluginData(item)
          if (value && typeof value === 'string')
            figma.ui.postMessage({
              type: `GET_DATA_${item.toUpperCase()}`,
              value: value,
            })
        }),
      DELETE_DATA: () =>
        path.items.forEach(async (item: string) =>
          figma.currentPage.setPluginData(item, '')
        ),
      //
      OPEN_IN_BROWSER: () => figma.openExternal(path.url),
      GET_PALETTES: async () => await getPalettesOnCurrentPage(),
      JUMP_TO_PALETTE: async () =>
        await jumpToPalette(path.id).catch((error) =>
          figma.ui.postMessage({
            type: 'POST_MESSAGE',
            data: {
              type: 'ERROR',
              message: error.message,
            },
          })
        ),
      DUPLICATE_PALETTE: async () =>
        await createPaletteFromDuplication(path.id)
          .finally(async () => await getPalettesOnCurrentPage())
          .catch((error) => {
            figma.ui.postMessage({
              type: 'POST_MESSAGE',
              data: {
                type: 'ERROR',
                message: error.message,
              },
            })
          }),
      DELETE_PALETTE: async () =>
        await deletePalette(path.id).finally(
          async () => await getPalettesOnCurrentPage()
        ),
      //
      GET_PRO_PLAN: async () => await getProPlan(),
      GET_TRIAL: async () =>
        figma.ui.postMessage({
          type: 'GET_TRIAL',
          data: {
            id: figma.currentUser?.id,
          },
        }),
      WELCOME_TO_PRO: async () =>
        figma.ui.postMessage({
          type: 'WELCOME_TO_PRO',
          data: {
            id: figma.currentUser?.id,
          },
        }),
      ENABLE_PRO_PLAN: async () =>
        figma.ui.postMessage({
          type: 'ENABLE_PRO_PLAN',
          data: {
            id: figma.currentUser?.id,
          },
        }),
      LEAVE_PRO_PLAN: async () =>
        figma.ui.postMessage({
          type: 'LEAVE_PRO_PLAN',
          data: {
            id: figma.currentUser?.id,
          },
        }),
      ENABLE_TRIAL: async () => {
        enableTrial(path.data.trialTime, path.data.trialVersion).then(() =>
          checkTrialStatus()
        )
      },
      //
      SIGN_OUT: () =>
        figma.ui.postMessage({
          type: 'SIGN_OUT',
          data: {
            connectionStatus: 'UNCONNECTED',
            userFullName: '',
            userAvatar: '',
            userId: undefined,
          },
        }),
      //
      DEFAULT: () => null,
    }

    try {
      return actions[path.type]?.()
    } catch {
      return actions['DEFAULT']?.()
    }
  }

  // Listeners
  figma.on('currentpagechange', () => {
    figma.ui.postMessage({
      type: 'LOAD_PALETTES',
    })
    figma.ui.postMessage({
      type: 'RESET_PALETTES',
    })
    setTimeout(() => getPalettesOnCurrentPage(), 1000)
  })

  // Relaunch
  figma.root.setRelaunchData({
    open: locales.get().relaunch.open.description,
  })
}

export default loadUI
