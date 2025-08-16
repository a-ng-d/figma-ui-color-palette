import { locales } from '../content/locales'
import updateThemes from './updates/updateThemes'
import updateSettings from './updates/updateSettings'
import updateScale from './updates/updateScale'
import updatePalette from './updates/updatePalette'
import updateLocalVariables from './updates/updateLocalVariables'
import updateLocalStyles from './updates/updateLocalStyles'
import updateDocument from './updates/updateDocument'
import updateColors from './updates/updateColors'
import processSelection from './processSelection'
import payProPlan from './payProPlan'
import jumpToPalette from './jumpToPalette'
import getPalettesOnCurrentPage from './getPalettesOnCurrentPage'
import enableTrial from './enableTrial'
import deletePalette from './creations/deletePalette'
import createPaletteFromRemote from './creations/createPaletteFromRemote'
import createPaletteFromDuplication from './creations/createPaletteFromDuplication'
import createPaletteFromDocument from './creations/createPaletteFromDocument'
import createPalette from './creations/createPalette'
import createLocalVariables from './creations/createLocalVariables'
import createLocalStyles from './creations/createLocalStyles'
import createDocument from './creations/createDocument'
import checkUserPreferences from './checks/checkUserPreferences'
import checkUserLicense from './checks/checkUserLicense'
import checkUserConsent from './checks/checkUserConsent'
import checkTrialStatus from './checks/checkTrialStatus'
import checkEditor from './checks/checkEditor'
import checkAnnouncementsStatus from './checks/checkAnnouncementsStatus'

declare const __PLUGIN__: 'fig' | 'one'

interface Window {
  width: number
  height: number
}

const loadUI = async () => {
  const windowSize: Window = {
    width: (await figma.clientStorage.getAsync('plugin_window_width')) ?? 640,
    height: (await figma.clientStorage.getAsync('plugin_window_height')) ?? 640,
  }
  const pluginName = __PLUGIN__ === 'fig' ? ' /figma' : ' /one'

  figma.showUI(__html__, {
    width: windowSize.width,
    height: windowSize.height,
    title: `${locales.get().name}${pluginName}${locales.get().separator}${locales.get().tagline}`,
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

  if (figma.command === 'create')
    figma.ui.postMessage({
      type: 'SWITCH_SERVICE',
      data: {
        service: 'CREATE',
      },
    })
  else if (figma.command === 'edit') {
    const document = figma.currentPage.selection[0]
    const id = document.getSharedPluginData('uicp', 'id')

    if (id !== '')
      jumpToPalette(id).catch((error) =>
        figma.ui.postMessage({
          type: 'POST_MESSAGE',
          data: {
            type: 'ERROR',
            message: error.message,
          },
        })
      )
  }

  // Checks
  checkUserConsent()
    .then(() => checkEditor())
    .then(() => checkTrialStatus({ context: 'UI', plugin: __PLUGIN__ }))
    .then(() => checkUserLicense(__PLUGIN__))
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
      UPDATE_SCALE: () =>
        updateScale(path).catch((error) => {
          figma.ui.postMessage({
            type: 'POST_MESSAGE',
            data: {
              type: 'ERROR',
              message: error.message,
              timer: 10000,
            },
          })
        }),
      UPDATE_COLORS: () =>
        updateColors(path).catch((error) => {
          figma.ui.postMessage({
            type: 'POST_MESSAGE',
            data: {
              type: 'ERROR',
              message: error.message,
              timer: 10000,
            },
          })
        }),
      UPDATE_THEMES: () =>
        updateThemes(path).catch((error) => {
          figma.ui.postMessage({
            type: 'POST_MESSAGE',
            data: {
              type: 'ERROR',
              message: error.message,
              timer: 10000,
            },
          })
        }),
      UPDATE_SETTINGS: () =>
        updateSettings(path).catch((error) => {
          figma.ui.postMessage({
            type: 'POST_MESSAGE',
            data: {
              type: 'ERROR',
              message: error.message,
              timer: 10000,
            },
          })
        }),
      UPDATE_PALETTE: () =>
        updatePalette({
          msg: path,
          isAlreadyUpdated: path.isAlreadyUpdated,
          shouldLoadPalette: path.shouldLoadPalette,
        }).catch((error) => {
          figma.ui.postMessage({
            type: 'POST_MESSAGE',
            data: {
              type: 'ERROR',
              message: error.message,
              timer: 10000,
            },
          })
        }),
      UPDATE_DOCUMENT: () =>
        updateDocument(path.view)
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
      SYNC_LOCAL_VARIABLES: async () =>
        createLocalVariables(path.id)
          .then(async (message) => [
            message,
            await updateLocalVariables(path.id),
          ])
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
              data: {
                value: value,
              },
            })
        }),
      DELETE_ITEMS: () =>
        path.items.forEach(async (item: string) =>
          figma.clientStorage.setAsync(item, '')
        ),
      //
      OPEN_IN_BROWSER: () => figma.openExternal(path.data.url),
      GET_PALETTES: async () => getPalettesOnCurrentPage(),
      JUMP_TO_PALETTE: async () =>
        jumpToPalette(path.id).catch((error) =>
          figma.ui.postMessage({
            type: 'POST_MESSAGE',
            data: {
              type: 'ERROR',
              message: error.message,
            },
          })
        ),
      DUPLICATE_PALETTE: async () =>
        createPaletteFromDuplication(path.id)
          .finally(async () => {
            getPalettesOnCurrentPage()
            figma.ui.postMessage({ type: 'STOP_LOADER' })
          })
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
        deletePalette(path.id).finally(async () => {
          getPalettesOnCurrentPage()
          figma.ui.postMessage({ type: 'STOP_LOADER' })
        }),
      //
      GET_TRIAL: async () =>
        figma.ui.postMessage({
          type: 'GET_TRIAL',
        }),
      ENABLE_TRIAL: async () => {
        enableTrial(path.data.trialTime, path.data.trialVersion).then(() =>
          checkTrialStatus({ context: 'UI', plugin: __PLUGIN__ })
        )
      },
      GET_PRO_PLAN: async () =>
        figma.ui.postMessage({
          type: 'GET_PRICING',
          data: {
            plans: __PLUGIN__ === 'fig' ? ['ONE', 'FIGMA'] : ['ONE'],
          },
        }),
      PAY_PRO_PLAN: async () => payProPlan(),
      ENABLE_PRO_PLAN: async () =>
        figma.ui.postMessage({
          type: 'ENABLE_PRO_PLAN',
        }),
      LEAVE_PRO_PLAN: async () =>
        figma.ui.postMessage({
          type: 'LEAVE_PRO_PLAN',
        }),
      WELCOME_TO_PRO: async () =>
        figma.ui.postMessage({
          type: 'WELCOME_TO_PRO',
        }),
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
