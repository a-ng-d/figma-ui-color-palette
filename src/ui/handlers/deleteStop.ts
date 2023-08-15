import type { ScaleConfiguration } from '../../utils/types'
import { palette } from '../../utils/palettePackage'

const deleteStop = (
  scale: ScaleConfiguration,
  selectedKnob: HTMLElement,
  presetName: string,
  presetMin: number,
  presetMax: number
) => {
  const newScale: Array<number> = [],
    newLightnessScale: { [key: string]: number } = {}

  Object.values(scale).forEach((scale) => {
    scale === parseFloat(selectedKnob.style.left) ? null : newScale.push(scale)
  })
  newScale.forEach(
    (scale, index) => (newLightnessScale[`lightness-${index + 1}`] = scale)
  )

  palette.scale = newLightnessScale
  palette.preset = {
    name: presetName,
    scale: Object.keys(palette.scale).map((key) =>
      parseFloat(key.replace('lightness-', ''))
    ),
    min: presetMin,
    max: presetMax,
  }
}

export default deleteStop
