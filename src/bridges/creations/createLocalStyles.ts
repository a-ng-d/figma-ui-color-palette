import { Data, FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'
import LocalStyle from '../../canvas/LocalStyle'

const createLocalStyles = async (id: string) => {
  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

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

  const createdLocalStylesStatusMessage = await figma
    .getLocalPaintStylesAsync()
    .then((localStyles) => {
      let i = 0
      palette.libraryData.map((item) => {
        const path = [
          item.paletteName,
          item.themeName,
          item.colorName,
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

        return item
      })

      palette.libraryData = new Data(palette).makeLibraryData(
        ['style_id', 'collection_id', 'variable_id', 'mode_id'],
        palette.libraryData
      )

      figma.currentPage.setPluginData(`palette_${id}`, JSON.stringify(palette))

      if (i > 1)
        return locales
          .get()
          .info.createdLocalStyles.plural.replace('{$1}', i.toString())
      else if (i === 1) return locales.get().info.createdLocalStyles.single
      else return locales.get().info.createdLocalStyles.none
    })

  return createdLocalStylesStatusMessage
}

export default createLocalStyles
