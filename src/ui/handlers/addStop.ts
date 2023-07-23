import type { ScaleConfiguration } from '../../utils/types'
import { palette } from '../../utils/palettePackage'
import doMap from './../../utils/doMap'

const addStop = (
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  scale: ScaleConfiguration,
  presetName: string,
  presetMin: number,
  presetMax: number
) => {
  const rangeWidth: number = (e.currentTarget as HTMLElement).offsetWidth,
    sliderPadding: number = parseFloat(
      window
        .getComputedStyle(
          (e.currentTarget as HTMLElement).parentNode as Element,
          null
        )
        .getPropertyValue('padding-left')
    ),
    offset: number = doMap(e.clientX - sliderPadding, 0, rangeWidth, 0, 100),
    newLightnessScale: { [key: string]: number } = {}

  let newScale = []

  newScale = Object.values(scale)
  newScale.length < 25 ? newScale.push(parseFloat(offset.toFixed(1))) : null
  newScale.sort((a, b) => b - a)
  newScale.forEach(
    (scale, index) => (newLightnessScale[`lightness-${index + 1}`] = scale)
  )

  palette.scale = newLightnessScale
  palette.preset = {
    name: presetName,
    scale: newScale.map((scale, index) => index + 1),
    min: presetMin,
    max: presetMax,
  }
}

export default addStop
