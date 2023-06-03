import Style from './../canvas/Style'
import Colors from '../canvas/Colors'

const createLocalStyles = (palette, i: number) => {
  palette = figma.currentPage.selection[0] as FrameNode
  console.log(palette.getPluginData('colors'))

  if (palette.children.length == 1) {
    const localStyles: Array<PaintStyle> = figma.getLocalPaintStyles()
    let source: PaintStyle, shade
    i = 0

    JSON.parse(palette.getPluginData('colors')).forEach(color => {
      if (localStyles.filter((e) => e.name === `${color.name}/source`).length == 0) {
        source = new Style(
          `${color.name}/source`,
          {
            r: color.rgb.r,
            g: color.rgb.g,
            b: color.rgb.b
          }
        ).makeNode()
        i++
      }
      Object.entries(JSON.parse(palette.getPluginData('scale'))).forEach((lightness: any) => {
        if (
          localStyles.filter(
            (e) =>
              e.name ===
              `${color.name}/${lightness[0].replace('lightness-', '')}`
          ).length == 0
        ) {
          shade = new Colors().getShadeColorFromLch(
            [
              color.rgb.r * 255,
              color.rgb.g * 255,
              color.rgb.b * 255,
            ],
            lightness[1],
            color.hueShifting,
            palette.getPluginData('algorithmVersion')
          )
          const style = new Style(
            `${color.name}/${lightness[0].replace('lightness-', '')}`,
            {
              r: shade._rgb[0] / 255,
              g: shade._rgb[1] / 255,
              b: shade._rgb[2] / 255
            }
          ).makeNode()
          i++
        }
      })
    })

    if (i > 1) figma.notify(`${i} local color styles have been created`)
    else if (i == 1) figma.notify(`${i} local color style has been created`)
    else figma.notify(`Local color styles already exist and cannot be created twice`)
  } else
    figma.notify(
      'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    )
}

export default createLocalStyles
