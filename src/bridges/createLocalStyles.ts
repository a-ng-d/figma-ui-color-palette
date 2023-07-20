import type { PaletteData, PaletteDataThemeItem } from '../utils/types'
import LocalStyle from './../canvas/LocalStyle'
import { locals, lang } from '../content/locals'

const createLocalStyles = (palette, i: number) => {
  palette = figma.currentPage.selection[0] as FrameNode

  const paletteData: PaletteData = JSON.parse(palette.getPluginData('data')),
  localStyles: Array<PaintStyle> = figma.getLocalPaintStyles(),
  workingThemes = paletteData.themes
    .filter(theme => theme.type === 'custom theme').length == 0
      ? paletteData.themes
        .filter(theme => theme.type === 'default theme')
      : paletteData.themes
        .filter(theme => theme.type === 'custom theme')
  
  if (palette.children.length == 1) {
    i = 0
    workingThemes.forEach(theme => {
      theme.colors.forEach(color => {
        color.shades.forEach(shade => {
          if (
            localStyles.find(
              (localStyle) => localStyle.id === shade.styleId
            ) == undefined
          ) {
            const style = new LocalStyle(
              workingThemes[0].type === 'custom theme'
                ? `${paletteData.name == '' ? '' : paletteData.name + '/'}${theme.name}/${color.name}/${shade.name}`
                : `${color.name}/${shade.name}`,
              shade.description,
              {
                r: shade.gl[0],
                g: shade.gl[1],
                b: shade.gl[2],
              }
            ).makePaintStyle()
            shade.styleId = style.id
            i++
          }
        })
      })
    })

    palette.setPluginData('data', JSON.stringify(paletteData))

    if (i > 1) figma.notify(`${i} ${locals[lang].info.createdLocalStyles}`)
    else if (i == 1) figma.notify(`${i} ${locals[lang].info.createdLocalStyle}`)
    else figma.notify(locals[lang].warning.cannotCreateLocalStyles)
  } else figma.notify(locals[lang].error.corruption)
}

export default createLocalStyles
