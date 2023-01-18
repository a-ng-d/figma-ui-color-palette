import { palette } from '../../utils/palettePackage';
import { doMap } from './../../utils/doMap';

const deleteStop = (scale: any, selectedKnob: HTMLElement, presetName: string, presetMin: string, presetMax: string) => {
  let newScale = [],
      newLightnessScale = {};

  Object.values(scale).forEach(scale => {
    scale === parseFloat(selectedKnob.style.left).toFixed(1) ? null : newScale.push(scale)
  });
  newScale.forEach((scale, index) => newLightnessScale[`lightness-${index + 1}`] = scale);

  palette.scale = newLightnessScale;
  palette.preset = {
    name: presetName,
    scale: Object.keys(palette.scale).map(key => parseFloat(key.replace('lightness-', ''))),
    min: presetMin,
    max: presetMax
  }
};

export default deleteStop
