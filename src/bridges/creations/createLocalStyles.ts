import { Data, FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { getJsonSize } from '../../utils/getSize'
import LocalStyle from '../../canvas/LocalStyle'
import { tolgee } from '../..'

const createLocalStyles = async (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '') throw new Error(tolgee.t('error.unfoundPalette'))

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

  const hasThemes = palette.libraryData.some(
    (item) => !item.id.includes('00000000000')
  )

  const createdLocalStylesStatusMessage = await figma
    .getLocalPaintStylesAsync()
    .then((localStyles) => {
      let i = 0

      palette.libraryData
        .filter((item) => {
          return hasThemes
            ? !item.id.includes('00000000000')
            : item.id.includes('00000000000')
        })
        .forEach((item) => {
          const path = [
            item.paletteName,
            item.themeName === ''
              ? tolgee.t('themes.defaultName')
              : item.themeName,
            item.colorName === ''
              ? tolgee.t('colors.defaultName')
              : item.colorName,
            item.shadeName,
          ]
            .filter((item) => item !== '' && item !== 'None')
            .join('/')

          if (
            localStyles.find((localStyle) => localStyle.id === item.styleId) ===
              undefined &&
            item.gl !== undefined
          ) {
            const style = new LocalStyle({
              name: path,
              rgb: {
                r: (item.gl ?? [0, 0, 0])[0],
                g: (item.gl ?? [0, 0, 0])[1],
                b: (item.gl ?? [0, 0, 0])[2],
              },
              alpha: item.alpha,
              description: item.description || '',
            })
            item.styleId = style.paintStyle.id
            i++
          }
        })

      palette.libraryData = new Data(palette).makeLibraryData(
        ['style_id', 'collection_id', 'variable_id', 'mode_id'],
        palette.libraryData
      )

      if (getJsonSize(palette) < 100)
        figma.currentPage.setSharedPluginData(
          'uicp',
          `palette_${id}`,
          JSON.stringify(palette)
        )
      else throw new Error(tolgee.t('error.paletteSizeExceeded'))

      return tolgee.t('info.createdLocalStyles', {
        count: i,
      })
    })

  return createdLocalStylesStatusMessage
}

export default createLocalStyles
