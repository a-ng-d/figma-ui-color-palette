import { palette } from '../../utils/palettePackage';

const shiftLeftStop = (scale, selectedKnob, meta, ctrl) => {
  const stopsList = [];

  Object.keys(scale).forEach(stop => {
    stopsList.push(stop)
  });
  
  const selectedKnobIndex = stopsList.indexOf(selectedKnob.classList[1]),
        newLightnessScale = scale,
        currentStopValue: number = parseFloat(newLightnessScale[stopsList[selectedKnobIndex]]),
        nextStopValue: number = parseFloat(newLightnessScale[stopsList[selectedKnobIndex + 1]]) + 2;

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

  palette.scale = newLightnessScale
};

export default shiftLeftStop
