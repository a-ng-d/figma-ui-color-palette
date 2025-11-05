import { uid } from 'uid'
import { locales } from '@ui-lib/content/locales'
import {
  AlgorithmVersionConfiguration,
  ColorConfiguration,
  ColorSpaceConfiguration,
  CreatorConfiguration,
  Data,
  DatesConfiguration,
  FullConfiguration,
  LibraryData,
  LockedSourceColorsConfiguration,
  PaletteData,
  PaletteDataShadeItem,
  PaletteDataThemeItem,
  PresetConfiguration,
  PublicationConfiguration,
  ScaleConfiguration,
  ShiftConfiguration,
  TextColorsThemeConfiguration,
  ThemeConfiguration,
  ViewConfiguration,
  VisionSimulationModeConfiguration,
} from '@a_ng_d/utils-ui-color-palette'
import { doScale } from '@a_ng_d/figmug-utils'
import globalConfig from '../global.config'

const setPaletteMigration = async (document: BaseNode) => {
  const palette = {
    base: {
      name: '',
      description: '',
      preset: {
        id: 'MATERIAL',
        name: 'Material Design, 50-900',
        max: 96,
        min: 24,
        family: 'Google',
        stops: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
        easing: 'LINEAR',
      },
      shift: {
        chroma: 100,
      },
      areSourceColorsLocked: false,
      colors: [],
      colorSpace: 'LCH',
      algorithmVersion: 'v3',
    },
    themes: [
      {
        id: '00000000000',
        name: 'None',
        description: '',
        scale: {},
        paletteBackground: '#FFFFFF',
        isEnabled: true,
        visionSimulationMode: 'NONE',
        textColorsTheme: {
          lightColor: '#FFFFFF',
          darkColor: '#000000',
        },
        type: 'default theme',
      },
    ],
    libraryData: [],
    meta: {
      id: '',
      dates: {
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
        openedAt: '',
      },
      creatorIdentity: {
        creatorId: '',
        creatorAvatar: '',
        creatorFullName: '',
      },
      publicationStatus: {
        isPublished: false,
        isShared: false,
      },
    },
    version: globalConfig.versions.paletteVersion,
    type: 'UI_COLOR_PALETTE',
  } as FullConfiguration

  const rawName = document.getPluginData('name')
  const rawDescription = document.getPluginData('description')
  const rawPreset = document.getPluginData('preset')
  const rawScale = document.getPluginData('scale')
  const rawShift = document.getPluginData('shift')
  const rawAreSourceColorsLocked = document.getPluginData(
    'areSourceColorsLocked'
  )
  const rawColors = document.getPluginData('colors')
  const rawColorSpace = document.getPluginData('colorSpace')
  const rawVisionSimulationMode = document.getPluginData('visionSimulationMode')
  const rawThemes = document.getPluginData('themes')
  const rawTextColorsTheme = document.getPluginData('textColorsTheme')
  const rawAlgorithmVersion = document.getPluginData('algorithmVersion')
  const rawData = document.getPluginData('data')
  const rawIsPublished = document.getPluginData('isPublished')
  const rawIsShared = document.getPluginData('isShared')
  const rawCreatedAt = document.getPluginData('createdAt')
  const rawUpdatedAt = document.getPluginData('updatedAt')
  const rawPublishedAt = document.getPluginData('publishedAt')
  const rawCreatorId = document.getPluginData('creatorId')
  const rawCreatorFullName = document.getPluginData('creatorFullName')
  const rawCreatorAvatar = document.getPluginData('creatorAvatar')
  const rawId = document.getPluginData('id')
  const rawView = document.getPluginData('view')

  const name = rawName !== '' ? rawName : ''
  const description = rawDescription !== '' ? rawDescription : ''
  const preset: PresetConfiguration & { scale: Array<number> } =
    rawPreset !== undefined
      ? JSON.parse(rawPreset)
      : {
          id: 'MATERIAL',
          name: 'Material Design, 50-900',
          max: 96,
          min: 24,
          family: 'Google',
          stops: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
          easing: 'LINEAR',
        }
  const scale: ScaleConfiguration =
    rawScale !== ''
      ? JSON.parse(rawScale)
      : doScale(preset.scale, preset.min, preset.max)
  const shift: ShiftConfiguration =
    rawShift !== '' ? JSON.parse(rawShift) : { chroma: 100 }
  const areSourceColorsLocked: LockedSourceColorsConfiguration =
    rawAreSourceColorsLocked !== undefined
      ? rawAreSourceColorsLocked === 'true'
      : false
  const colors: Array<
    ColorConfiguration & { hueShifting: number } & {
      chromaShifting: number
    }
  > = rawColors !== '' ? JSON.parse(rawColors) : []
  const textColorsTheme: TextColorsThemeConfiguration<'HEX'> =
    rawTextColorsTheme !== '' ? JSON.parse(rawTextColorsTheme) : ''
  const colorSpace: ColorSpaceConfiguration =
    rawColorSpace !== '' ? (rawColorSpace as ColorSpaceConfiguration) : 'LCH'
  const visionSimulationMode: VisionSimulationModeConfiguration =
    rawVisionSimulationMode !== ''
      ? (rawVisionSimulationMode as VisionSimulationModeConfiguration)
      : 'NONE'
  const algorithmVersion: AlgorithmVersionConfiguration =
    rawAlgorithmVersion !== ''
      ? (rawAlgorithmVersion as AlgorithmVersionConfiguration)
      : 'v3'
  const themes: Array<ThemeConfiguration> =
    rawThemes !== ''
      ? JSON.parse(rawThemes)
      : [
          {
            id: '00000000000',
            name: locales.get().themes.switchTheme.defaultTheme,
            description: '',
            scale: scale,
            paletteBackground: '#FFFFFF',
            isEnabled: true,
            visionSimulationMode: visionSimulationMode,
            textColorsTheme: textColorsTheme,
            type: 'default theme',
          },
        ]
  const publicationStatus: PublicationConfiguration = {
    isPublished: rawIsPublished !== '' ? rawIsPublished === 'true' : false,
    isShared: rawIsShared !== '' ? rawIsShared === 'true' : false,
  }
  const dates: DatesConfiguration = {
    createdAt: rawCreatedAt !== '' ? rawCreatedAt : new Date().toISOString(),
    updatedAt: rawUpdatedAt !== '' ? rawUpdatedAt : new Date().toISOString(),
    publishedAt: rawPublishedAt !== '' ? rawPublishedAt : '',
    openedAt: new Date().toISOString(),
  }
  const creatorIdentity: CreatorConfiguration = {
    creatorId: rawCreatorId !== '' ? rawCreatorId : '',
    creatorFullName: rawCreatorFullName !== '' ? rawCreatorFullName : '',
    creatorAvatar: rawCreatorAvatar !== '' ? rawCreatorAvatar : '',
  }
  const id = rawId !== '' ? rawId : uid()
  const view = rawView !== '' ? (rawView as ViewConfiguration) : 'PALETTE'

  if (preset.name.includes('Custom')) preset.id = 'CUSTOM'
  else if (preset.name.includes('Material Design')) preset.id = 'MATERIAL'
  else if (preset.name.includes('Material 3')) preset.id = 'MATERIAL_3'
  else if (preset.name.includes('Tailwind')) preset.id = 'TAILWIND'
  else if (preset.name.includes('Ant Design')) preset.id = 'ANT'
  else if (preset.name.includes('ADS')) preset.id = 'ADS'
  else if (preset.name.includes('Neutral')) preset.id = 'ADS_NEUTRAL'
  else if (preset.name.includes('Carbon')) preset.id = 'CARBON'
  else if (preset.name.includes('Base')) preset.id = 'BASE'
  else if (preset.name.includes('Polaris')) preset.id = 'POLARIS'

  palette.base.name = name
  palette.base.description = description
  palette.base.preset.name =
    preset.name === 'Custom' ? locales.get().scale.presets.legacy : preset.name
  palette.base.preset.id = preset.id
  palette.base.preset.family = preset.family
  palette.base.preset.max = preset.max
  palette.base.preset.min = preset.min
  palette.base.preset.stops = preset.scale
  palette.base.preset.easing = preset.easing
  palette.base.shift.chroma = shift.chroma
  palette.base.areSourceColorsLocked = areSourceColorsLocked
  palette.base.colorSpace = colorSpace
  palette.base.algorithmVersion = algorithmVersion

  palette.base.colors = colors.map((color) => {
    return {
      id: color.id || uid(),
      name: color.name || '',
      rgb: color.rgb,
      hue: {
        shift: color.hue?.shift || color.hueShifting || 0,
        isLocked: color.hue?.isLocked || false,
      },
      chroma: {
        shift: color.chroma?.shift || color.chromaShifting || 100,
        isLocked: color.chroma?.isLocked || false,
      },
      description: color.description || '',
      alpha: {
        isEnabled: false,
        backgroundColor: '#FFFFFF',
      },
    }
  })

  palette.themes = themes.map((theme) => {
    return {
      id: theme.id,
      name: theme.name,
      description: theme.description,
      scale: transformScale(theme.scale) || transformScale(scale),
      paletteBackground: theme.paletteBackground || '#FFFFFF',
      isEnabled: theme.isEnabled || false,
      visionSimulationMode: theme.visionSimulationMode || visionSimulationMode,
      textColorsTheme: theme.textColorsTheme || textColorsTheme,
      type: theme.type,
    }
  })

  palette.meta.id = id
  palette.meta.dates = dates
  palette.meta.creatorIdentity = creatorIdentity
  palette.meta.publicationStatus = publicationStatus

  const data: PaletteData & { collectionId: string } =
    rawData !== '' ? JSON.parse(rawData) : new Data(palette).makePaletteData()

  const libraryData: Array<LibraryData> = data.themes.flatMap(
    (theme: PaletteDataThemeItem & { modeId?: string }) => {
      return theme.colors.flatMap((color) =>
        color.shades.flatMap(
          (
            shade: PaletteDataShadeItem & { variableId?: string } & {
              styleId?: string
            }
          ) => {
            const generatedId = `${theme.id}:${color.id}:${shade.name}`

            return {
              id: generatedId,
              paletteName: data.name,
              themeName: theme.name,
              colorName: color.name,
              shadeName: shade.name,
              ...(data.collectionId !== '' && {
                collectionId: data.collectionId,
              }),
              ...(theme.modeId !== '' && { modeId: theme.modeId }),
              ...(shade.variableId !== '' && { variableId: shade.variableId }),
              ...(shade.styleId !== '' && { styleId: shade.styleId }),
            }
          }
        )
      )
    }
  )

  palette.libraryData = libraryData

  document.getPluginDataKeys().forEach((key) => {
    document.setPluginData(key, '')
  })

  document.setSharedPluginData('uicp', 'type', palette.type)
  document.setSharedPluginData('uicp', 'version', palette.version)
  document.setSharedPluginData('uicp', 'view', view)
  document.setSharedPluginData('uicp', 'id', palette.meta.id)
  document.setSharedPluginData(
    'uicp',
    'themeId',
    palette.themes.find((theme: ThemeConfiguration) => theme.isEnabled)?.id ||
      '00000000000'
  )
  document.setSharedPluginData(
    'uicp',
    'createdAt',
    palette.meta.dates.createdAt as string
  )
  document.setSharedPluginData(
    'uicp',
    'updatedAt',
    palette.meta.dates.updatedAt as string
  )
  document.setSharedPluginData('uicp', 'backup', JSON.stringify(palette))

  document.setRelaunchData({
    edit: locales.get().relaunch.edit.description,
  })

  figma.currentPage.setSharedPluginData(
    'uicp',
    `palette_${palette.meta.id}`,
    JSON.stringify(palette)
  )
}

const transformScale = (scale: ScaleConfiguration): ScaleConfiguration => {
  const transformedScale: ScaleConfiguration = {}

  Object.entries(scale).forEach(([key, value]) => {
    transformedScale[key.replace('lightness-', '')] = value
  })

  return transformedScale
}

export default setPaletteMigration
