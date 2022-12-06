import { palette } from '../../utils/palettePackage';

const shiftLeftStop = (scale, selectedKnob, meta, ctrl, presetName, presetMin, presetMax) => {
  let stopsList = [],
      newLightnessScale = {},
      selectedKnobIndex;

  Object.keys(scale).forEach(stop => {
    stopsList.push(stop)
  });
  selectedKnobIndex = stopsList.indexOf(selectedKnob.classList[1])
  newLightnessScale = scale;

  const currentStopValue: number = parseFloat(newLightnessScale[stopsList[selectedKnobIndex]]),
        nextStopValue: number = parseFloat(newLightnessScale[stopsList[selectedKnobIndex + 1]]) + 2

  if (currentStopValue <= nextStopValue)
    null
  else if (currentStopValue <= 1 && (!meta || ctrl))
    newLightnessScale[stopsList[selectedKnobIndex]] = 0
  else if (currentStopValue === 0 && (meta || ctrl))
    newLightnessScale[stopsList[selectedKnobIndex]] = 0
  else
    meta || ctrl ?
    newLightnessScale[stopsList[selectedKnobIndex]] = parseFloat(newLightnessScale[stopsList[selectedKnobIndex]]) - .1 :
    newLightnessScale[stopsList[selectedKnobIndex]]--;

  newLightnessScale[stopsList[selectedKnobIndex]] = parseFloat(newLightnessScale[stopsList[selectedKnobIndex]]).toFixed(1);

  palette.scale = newLightnessScale;
  palette.preset = {
    name: presetName,
    scale: Object.keys(palette.scale).map(key => parseFloat(key.replace('lightness-', ''))),
    min: presetMin,
    max: presetMax
  }
};

export default shiftLeftStop
