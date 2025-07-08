import { uid } from 'uid'
import {
  ColorConfiguration,
  Data,
  ExchangeConfiguration,
  SourceColorConfiguration,
  ThemeConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

interface Msg {
  data: {
    sourceColors: Array<SourceColorConfiguration>
    exchange: ExchangeConfiguration
  }
}

const createPalette = async (msg: Msg, fromUI = true) => {
  const colors: Array<ColorConfiguration> = msg.data.sourceColors
    .map((sourceColor) => {
      return {
        name: sourceColor.name,
        description: '',
        rgb: sourceColor.rgb,
        id: uid(),
        hue: {
          shift: 0,
          isLocked: false,
        },
        chroma: {
          shift: msg.data.exchange.shift.chroma,
          isLocked: false,
        },
        alpha: {
          isEnabled: false,
          backgroundColor: '#FFFFFF',
        },
      }
    })
    .sort((a, b) => {
      if (a.name.localeCompare(b.name) > 0) return 1
      else if (a.name.localeCompare(b.name) < 0) return -1
      else return 0
    })

  const themes: Array<ThemeConfiguration> = [
    {
      name: locales.get().themes.switchTheme.defaultTheme,
      description: '',
      scale: msg.data.exchange.scale,
      paletteBackground: '#FFFFFF',
      visionSimulationMode: msg.data.exchange.visionSimulationMode,
      textColorsTheme: msg.data.exchange.textColorsTheme,
      isEnabled: true,
      id: '00000000000',
      type: 'default theme',
    },
  ]

  const now = new Date().toISOString()

  const palette = new Data({
    base: {
      name: msg.data.exchange.name,
      description: msg.data.exchange.description,
      preset: msg.data.exchange.preset,
      shift: msg.data.exchange.shift,
      areSourceColorsLocked: msg.data.exchange.areSourceColorsLocked,
      colors: colors,
      colorSpace: msg.data.exchange.colorSpace,
      algorithmVersion: msg.data.exchange.algorithmVersion,
    },
    themes: themes,
    meta: {
      id: uid(),
      dates: {
        createdAt: now,
        updatedAt: now,
        publishedAt: '',
        openedAt: now,
      },
      creatorIdentity: {
        creatorId: '',
        creatorFullName: '',
        creatorAvatar: '',
      },
      publicationStatus: {
        isShared: false,
        isPublished: false,
      },
    },
  }).makePaletteFullData()

  figma.currentPage.setSharedPluginData(
    'uicp',
    `palette_${palette.meta.id}`,
    JSON.stringify(palette)
  )
  if (fromUI)
    figma.ui.postMessage({
      type: 'LOAD_PALETTE',
      data: palette,
    })

  await new Promise((r) => setTimeout(r, 1000))
  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${locales.get().events.paletteCreated}`
  )

  return palette
}

export default createPalette
