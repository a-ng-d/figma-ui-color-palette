import chroma from 'chroma-js'
import { FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const updateLocalStyles = async (id: string) => {
  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

  if (rawPalette === '') throw new Error(locales.get().error.unfoundPalette)

  const palette = JSON.parse(rawPalette) as FullConfiguration

  const canDeepSyncStyles = await figma.clientStorage.getAsync(
    'can_deep_sync_styles'
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

      palette.libraryData?.forEach((item) => {
        const styleMatch = localStyles.find(
          (localStyle) => localStyle.id === item.styleId
        )
        const path = `${item.path}/${item.name}`
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
        messages.push(`${i} ${locales.get().info.updatedLocalStyles.plural}`)
      else if (i === 1)
        messages.push(locales.get().info.updatedLocalStyles.single)
      else messages.push(locales.get().info.updatedLocalStyles.none)

      if (k > 1)
        messages.push(`${k} ${locales.get().info.removedLocalStyles.plural}`)
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
