import {
  BaseConfiguration,
  Data,
  MetaConfiguration,
  ThemeConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

interface Msg {
  data: {
    base: BaseConfiguration
    themes: Array<ThemeConfiguration>
    meta: MetaConfiguration
  }
}

const createPaletteFromRemote = async (msg: Msg) => {
  const localPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${msg.data.meta.id}`
  )

  if (localPalette !== '') throw new Error(locales.get().info.addToLocal)

  const palette = new Data({
    base: {
      name: msg.data.base.name,
      description: msg.data.base.description,
      preset: msg.data.base.preset,
      shift: msg.data.base.shift,
      areSourceColorsLocked: msg.data.base.areSourceColorsLocked,
      colors: msg.data.base.colors,
      colorSpace: msg.data.base.colorSpace,
      algorithmVersion: msg.data.base.algorithmVersion,
    },
    themes: msg.data.themes,
    meta: {
      id: msg.data.meta.id,
      dates: {
        createdAt: msg.data.meta.dates.createdAt,
        updatedAt: msg.data.meta.dates.updatedAt,
        publishedAt: msg.data.meta.dates.publishedAt,
        openedAt: new Date().toISOString(),
      },
      creatorIdentity: {
        creatorId: msg.data.meta.creatorIdentity.creatorId,
        creatorFullName: msg.data.meta.creatorIdentity.creatorFullName,
        creatorAvatar: msg.data.meta.creatorIdentity.creatorAvatar,
      },
      publicationStatus: {
        isShared: msg.data.meta.publicationStatus.isShared,
        isPublished: msg.data.meta.publicationStatus.isPublished,
      },
    },
  }).makePaletteFullData()

  figma.currentPage.setSharedPluginData(
    'uicp',
    `palette_${palette.meta.id}`,
    JSON.stringify(palette)
  )
  figma.ui.postMessage({
    type: 'LOAD_PALETTE',
    data: palette,
  })

  await new Promise((r) => setTimeout(r, 1000))
  await figma.saveVersionHistoryAsync(
    `${palette.base.name} - ${locales.get().events.palettePulled}`
  )

  return palette
}

export default createPaletteFromRemote
