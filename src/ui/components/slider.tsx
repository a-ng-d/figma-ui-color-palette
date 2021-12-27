import * as React from 'react';
import { lightness } from '../data';

export default class Slider extends React.Component {
  lightnessList: Array<number>;

  constructor(props) {
    super(props)
    this.lightnessList = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
  }

  doMap = (value, oldMin, oldMax, newMin, newMax) => {
    const oldRange = oldMax - oldMin,
        newRange = newMax - newMin
    return ((value - oldMin) * newRange / oldRange) + newMin
  }

  // Events
  onSlide = (e: any) => {
    const knob = e.target,
          range = knob.parentElement,
          shift = e.nativeEvent.layerX,
          tooltip = knob.children[0],
          rangeWidth = range.offsetWidth,
          knobs = Array.from(range.childNodes as HTMLCollectionOf<HTMLElement>);

    let offset;
    knob.style.zIndex = 2;

    const slide = (e) => {
      let limitMin, limitMax;
      const gap = this.doMap(2, 0, 100, 0, rangeWidth);
      offset = e.clientX - range.offsetLeft - shift;

      lightness.min = parseFloat(this.doMap(range.lastChild.offsetLeft, 0, rangeWidth, 0, 100).toFixed(1));
      lightness.max = parseFloat(this.doMap(range.firstChild.offsetLeft, 0, rangeWidth, 0, 100).toFixed(1));

      if (knob == range.lastChild) { // 900
        limitMin = 0;
        limitMax = knob.previousElementSibling.offsetLeft - gap
      } else if (knob == range.firstChild) { // 50
        limitMin = knob.nextElementSibling.offsetLeft + gap;
        limitMax = rangeWidth
      } else {
        limitMin = knob.nextElementSibling.offsetLeft + gap;
        limitMax = knob.previousElementSibling.offsetLeft - gap
      }

      if (offset <= limitMin)
        offset = limitMin
      else if (offset >= limitMax)
        offset = limitMax;

      // distribute knobs horizontal spacing
      if (knob == range.lastChild && e.shiftKey == true) // 900
        this.distributeKnobs('MIN', this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1), knobs)
      else if (knob == range.firstChild && e.shiftKey == true) // 50
        this.distributeKnobs('MAX', this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1), knobs)

      // link every knob
      if (e.ctrlKey == true || e.metaKey == true) {
        if (offset <= (knob.offsetLeft - range.lastChild.offsetLeft) || offset > (rangeWidth - range.firstChild.offsetLeft + knob.offsetLeft))
          offset = knob.offsetLeft
        else
          this.linkKnobs(offset, knob, knobs, rangeWidth)
      }

      if (e.ctrlKey == false && e.metaKey == false && e.shiftKey == false)
        knobs.forEach(knob => (knob.children[0] as HTMLElement).style.display = 'none');

      knob.style.left = this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1) + '%';

      // update lightness scale
      knobs.forEach(knob => this.updateLightnessScaleEntry(knob.classList[1], this.doMap(knob.offsetLeft, 0, rangeWidth, 0, 100).toFixed(1)));
      this.updateKnobTooltip(tooltip, this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1))
    };

    document.addEventListener('mousemove', slide);

    document.onmouseup = () => {
      document.removeEventListener('mousemove', slide);
      knob.onmouseup = null;
      knob.style.zIndex = 1;
      knob.style.left = this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1) + '%';
      knobs.forEach(knob => (knob.children[0] as HTMLElement).style.display = 'none');
      console.log(lightness.scale)
    }

  }

  // Actions
  doLightnessScale = () => {
    let granularity: number = 1;

    this.lightnessList.forEach(index => {
      lightness.scale[`lightness-${index}`] = this.doMap(granularity, 0, 1, lightness.min, lightness.max).toFixed(1);
      granularity -= 1 / (this.lightnessList.length - 1)
    });

    return lightness.scale
  }

  updateLightnessScaleEntry = (key, value) => {
    lightness.scale[key] = value;
  }

  updateKnobTooltip = (tooltip, value) => {
    tooltip.style.display = 'block';
    tooltip.textContent = value
  }

  distributeKnobs = (type, value, knobs) => {
    if (type === 'MIN')
      lightness.min = parseFloat(value)
    else if (type === 'MAX')
      lightness.max = parseFloat(value);

    this.doLightnessScale();

    knobs.forEach(knob => {
      knob.style.left = lightness.scale[knob.classList[1]] + '%';
      this.updateKnobTooltip(knob.childNodes[0], lightness.scale[knob.classList[1]])
    })
  }

  linkKnobs = (offset, src, knobs, width) => {
    knobs.forEach(knob => {
      let shift = (knob.offsetLeft - src.offsetLeft) + offset;
      if (knob != src)
        knob.style.left = this.doMap(shift, 0, width, 0, 100) + '%';
      this.updateKnobTooltip(knob.childNodes[0], lightness.scale[knob.classList[1]])
    })
  }

  render() {
    return (
      <div className='slider'>
        <div className='slider_range'>
          {Object.entries(this.doLightnessScale()).map(lightness =>
            <div key={lightness[0]} className={`slider_knob ${lightness[0]}`} style={{left: `${lightness[1]}%`}} onMouseDown={this.onSlide}>
              <span className='type slider_label'>{lightness[0].replace('lightness-', '')}</span>
              <div className='type type--inverse slider_tooltip'>{lightness[1]}</div>
            </div>
          )}
        </div>
      </div>
    )
  }

}
