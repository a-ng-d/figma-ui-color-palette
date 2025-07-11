import chroma from 'chroma-js'
import { Data, FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const updateLocalStyles = async (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '') throw new Error(locales.get().error.unfoundPalette)

  const palette = JSON.parse(rawPalette) as FullConfiguration

  palette.libraryData = new Data(palette).makeLibraryData(
    [
      'style_id',
      'collection_id',
      'variable_id',
      'mode_id',
      'alpha',
      'gl',
      'description',
    ],
    palette.libraryData
  )

  const canDeepSyncStyles = await figma.clientStorage.getAsync(
    'can_deep_sync_styles'
  )
  const hasThemes = palette.libraryData.some(
    (item) => !item.id.includes('00000000000')
  )

  const updatedLocalStylesStatusMessage = figma
    .getLocalPaintStylesAsync()
    .then((localStyles) => {
      let i = 0,
        j = 0,
        k = 0
      const messages: Array<string> = []

      if (canDeepSyncStyles ?? false)
        localStyles.forEach((localStyle) => {
          const hasStyleMatch = palette.libraryData.some(
            (libraryItem) => libraryItem.styleId === localStyle.id
          )

          if (!hasStyleMatch) {
            localStyle.remove()
            k++
          }
        })

      palette.libraryData
        .filter((item) => {
          return hasThemes
            ? !item.id.includes('00000000000')
            : item.id.includes('00000000000')
        })
        .forEach((item) => {
          const styleMatch = localStyles.find(
            (localStyle) => localStyle.id === item.styleId
          )
          const path = [
            item.paletteName,
            item.themeName === ''
              ? locales.get().themes.defaultName
              : item.themeName,
            item.colorName === ''
              ? locales.get().colors.defaultName
              : item.colorName,
            item.shadeName,
          ]
            .filter((item) => item !== '' && item !== 'None')
            .join('/')
          const fill = {
            type: 'SOLID',
            color: {
              r: (item.gl ?? [0, 0, 0])[0],
              g: (item.gl ?? [0, 0, 0])[1],
              b: (item.gl ?? [0, 0, 0])[2],
            },
            opacity: item.alpha ?? 1,
          } as SolidPaint

          if (styleMatch !== undefined) {
            const styleMatchHex = chroma([
              (styleMatch.paints[0] as SolidPaint).color.r * 255,
              (styleMatch.paints[0] as SolidPaint).color.g * 255,
              (styleMatch.paints[0] as SolidPaint).color.b * 255,
            ]).hex()
            const fillHex = chroma([
              fill.color.r * 255,
              fill.color.g * 255,
              fill.color.b * 255,
            ]).hex()

            if (styleMatch.name !== path) {
              styleMatch.name = path
              j++
            }

            if (styleMatch.description !== item.description) {
              styleMatch.description = item.description ?? ''
              j++
            }

            if (
              parseFloat(styleMatch.paints[0].opacity?.toFixed(2) ?? '1') !==
                fill.opacity ||
              styleMatchHex !== fillHex
            ) {
              styleMatch.paints = [fill]
              j++
            }

            j > 0 ? i++ : i
            j = 0
          }
        })

      if (i > 1)
        messages.push(
          locales
            .get()
            .info.updatedLocalStyles.plural.replace('{count}', i.toString())
        )
      else if (i === 1)
        messages.push(locales.get().info.updatedLocalStyles.single)
      else messages.push(locales.get().info.updatedLocalStyles.none)

      if (k > 1)
        messages.push(
          locales
            .get()
            .info.removedLocalStyles.plural.replace('{count}', k.toString())
        )
      else if (k === 1)
        messages.push(locales.get().info.removedLocalStyles.single)
      else messages.push(locales.get().info.removedLocalStyles.none)

      figma.saveVersionHistoryAsync(
        `${palette.base.name} - ${locales.get().events.stylesSynced}`
      )

      return messages.join(locales.get().separator)
    })

  return updatedLocalStylesStatusMessage
}

export default updateLocalStyles
