import { FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'
import LocalStyle from '../../canvas/LocalStyle'

const createLocalStyles = async (id: string) => {
  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

  if (rawPalette === '') throw new Error(locales.get().error.unfoundPalette)

  const palette = JSON.parse(rawPalette) as FullConfiguration

  const createdLocalStylesStatusMessage = await figma
    .getLocalPaintStylesAsync()
    .then((localStyles) => {
      console.log(`Creating local styles for palette ${id}...`)
      let i = 0
      palette.libraryData.map((item) => {
        console.log(item)
        if (
          localStyles.find((localStyle) => localStyle.id === item.styleId) ===
            undefined &&
          item.hex !== undefined
        ) {
          const style = new LocalStyle({
            name: `${item.path} / ${item.name}`,
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

      figma.currentPage.setPluginData(`palette_${id}`, JSON.stringify(palette))

      if (i > 1) return `${i} ${locales.get().info.createdLocalStyles.plural}`
      else if (i === 1) return locales.get().info.createdLocalStyles.single
      else return locales.get().info.createdLocalStyles.none
    })

  return createdLocalStylesStatusMessage
}

export default createLocalStyles
