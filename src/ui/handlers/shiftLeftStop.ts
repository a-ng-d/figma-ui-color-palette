import type { ScaleConfiguration } from '../../utils/types'
import { palette } from '../../utils/palettePackage'

const shiftLeftStop = (
  scale: ScaleConfiguration,
  selectedKnob: HTMLElement,
  meta: boolean,
  ctrl: boolean,
  gap: number
) => {
  const stopsList = []

  Object.keys(scale).forEach((stop) => {
    stopsList.push(stop)
  })

  const selectedKnobIndex = stopsList.indexOf(selectedKnob.classList[1]),
    newLightnessScale = scale,
    currentStopValue: number = newLightnessScale[stopsList[selectedKnobIndex]],
    nextStopValue: number =
      newLightnessScale[stopsList[selectedKnobIndex + 1]] + gap

  if (currentStopValue <= nextStopValue) null
  else if (currentStopValue <= 1 && (!meta || ctrl))
    newLightnessScale[stopsList[selectedKnobIndex]] = 0
  else if (currentStopValue === 0 && (meta || ctrl))
    newLightnessScale[stopsList[selectedKnobIndex]] = 0
  else
    meta || ctrl
      ? (newLightnessScale[stopsList[selectedKnobIndex]] = parseFloat(
          (newLightnessScale[stopsList[selectedKnobIndex]] - 0.1).toFixed(1)
        ))
      : newLightnessScale[stopsList[selectedKnobIndex]]--
  palette.scale = newLightnessScale
}

export default shiftLeftStop
