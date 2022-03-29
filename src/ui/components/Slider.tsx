import * as React from 'react';
import Knob from './Knob';
import { palette } from '../data';

interface Props {
  knobsList: string;
  type: string;
  min: string;
  max: string;
  scale: any;
  onChange: any
};

export default class Slider extends React.Component<Props> {

  doMap = (value: number, oldMin: number, oldMax: number, newMin: number, newMax: number) => {
    const oldRange = oldMax - oldMin,
        newRange = newMax - newMin
    return ((value - oldMin) * newRange / oldRange) + newMin
  }

  // Events
  onGrab = (e: any) => {
    const knob = e.target as HTMLElement,
          range = knob.parentElement as HTMLElement,
          shift = e.nativeEvent.layerX as number,
          tooltip = knob.children[0] as HTMLElement,
          rangeWidth = range.offsetWidth as number,
          slider = range.parentElement as HTMLElement,
          knobs = Array.from(range.children as HTMLCollectionOf<HTMLElement>);

    let offset: number,
        update = () => {
          palette.min = parseFloat(this.doMap((range.lastChild as HTMLElement).offsetLeft, 0, rangeWidth, 0, 100).toFixed(1));
          palette.max = parseFloat(this.doMap((range.firstChild as HTMLElement).offsetLeft, 0, rangeWidth, 0, 100).toFixed(1));
          knobs.forEach(knob => this.updateLightnessScaleEntry(knob.classList[1], this.doMap(knob.offsetLeft, 0, rangeWidth, 0, 100).toFixed(1)));
        };

    knob.style.zIndex = '2';

    document.onmousemove = (e) => this.onSlide(
      e,
      slider,
      range,
      knobs,
      knob,
      tooltip,
      offset,
      shift,
      rangeWidth,
      update
    );

    document.onmouseup = () => this.onRelease(
      knobs,
      knob,
      offset,
      update,
      rangeWidth
    )
  }

  onSlide = (e: any, slider: HTMLElement, range: HTMLElement, knobs: Array<HTMLElement>, knob: HTMLElement, tooltip: HTMLElement, offset: number, shift: number, rangeWidth: number, update: any) => {
    let limitMin: number, limitMax: number;
    const gap: number = this.doMap(2, 0, 100, 0, rangeWidth);
    offset = e.clientX - slider.offsetLeft - shift;

    palette.min = parseFloat(this.doMap((range.lastChild as HTMLElement).offsetLeft, 0, rangeWidth, 0, 100).toFixed(1));
    palette.max = parseFloat(this.doMap((range.firstChild as HTMLElement).offsetLeft, 0, rangeWidth, 0, 100).toFixed(1));

    if (knob == range.lastChild) { // 900
      limitMin = 0;
      limitMax = (knob.previousElementSibling as HTMLElement).offsetLeft - gap
    } else if (knob == range.firstChild) { // 50
      limitMin = (knob.nextElementSibling as HTMLElement).offsetLeft + gap;
      limitMax = rangeWidth
    } else {
      limitMin = (knob.nextElementSibling as HTMLElement).offsetLeft + gap;
      limitMax = (knob.previousElementSibling as HTMLElement).offsetLeft - gap
    }

    if (offset <= limitMin)
      offset = limitMin
    else if (offset >= limitMax)
      offset = limitMax;

    // distribute knobs horizontal spacing
    if (knob == range.lastChild && e.shiftKey) // 900
      this.distributeKnobs('MIN', this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1), knobs)
    else if (knob == range.firstChild && e.shiftKey) // 50
      this.distributeKnobs('MAX', this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1), knobs)

    // link every knob
    if (e.ctrlKey || e.metaKey) {
      if (offset <= (knob.offsetLeft - (range.lastChild as HTMLElement).offsetLeft) || offset > (rangeWidth - (range.firstChild as HTMLElement).offsetLeft + knob.offsetLeft))
        offset = knob.offsetLeft
      else
        this.linkKnobs(offset, knob, knobs, rangeWidth)
    }

    if (e.ctrlKey == false && e.metaKey == false && e.shiftKey == false)
      knobs.forEach(knob => (knob.children[0] as HTMLElement).style.display = 'none');

    knob.style.left = this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1) + '%';

    // update lightness scale
    knobs.forEach(knob => this.updateLightnessScaleEntry(knob.classList[1], this.doMap(knob.offsetLeft, 0, rangeWidth, 0, 100).toFixed(1)));
    this.updateKnobTooltip(tooltip, this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1));
    update();
    this.props.onChange()
  }

  onRelease = (knobs: Array<HTMLElement>, knob: HTMLElement, offset: number, update: any, rangeWidth: number) => {
    document.onmousemove = null;
    document.onmouseup = null;
    knob.onmouseup = null;
    knob.style.zIndex = '1';
    knobs.forEach(knob => (knob.children[0] as HTMLElement).style.display = 'none');
    update();
    this.props.onChange('released')
  }

  // Actions
  doLightnessScale = () => {
    let granularity: number = 1;

    this.props.knobsList.split(' ').forEach(index => {
      palette.scale[`lightness-${index}`] = this.doMap(granularity, 0, 1, palette.min, palette.max).toFixed(1);
      granularity -= 1 / (this.props.knobsList.split(' ').length - 1)
    });

    return palette.scale
  }

  updateLightnessScaleEntry = (key: string, value: string) => {
    palette.scale[key] = value;
  }

  updateKnobTooltip = (tooltip: HTMLElement, value: string) => {
    tooltip.style.display = 'block';
    tooltip.textContent = value
  }

  distributeKnobs = (type: string, value: string, knobs: Array<HTMLElement>) => {
    if (type === 'MIN')
      palette.min = parseFloat(value)
    else if (type === 'MAX')
      palette.max = parseFloat(value);

    this.doLightnessScale();

    knobs.forEach(knob => {
      knob.style.left = palette.scale[knob.classList[1]] + '%';
      this.updateKnobTooltip(knob.childNodes[0] as HTMLElement, palette.scale[knob.classList[1]])
    })
  }

  linkKnobs = (offset: number, src: HTMLElement, knobs: Array<HTMLElement>, width: number) => {
    knobs.forEach(knob => {
      let shift = (knob.offsetLeft - src.offsetLeft) + offset;
      if (knob != src)
        knob.style.left = this.doMap(shift, 0, width, 0, 100) + '%';
      this.updateKnobTooltip(knob.childNodes[0] as HTMLElement, palette.scale[knob.classList[1]])
    })
  }

  // Templates
  Equal = (props) => {
    palette.min = parseFloat(this.props.min);
    palette.max = parseFloat(this.props.max);
    return (
      <div className='slider__range'>
        {Object.entries(this.doLightnessScale()).map(lightness =>
          <Knob
            key={lightness[0]}
            id={lightness[0]}
            scale={lightness[1]}
            number={lightness[0].replace('lightness-', '')}
            action={this.onGrab}
          />
        )}
      </div>
    )
  }

  Custom = (props) => {
    return (
      <div className='slider__range'>
        {Object.entries(this.props.scale).map(lightness =>
          <Knob
            key={lightness[0]}
            id={lightness[0]}
            scale={lightness[1]}
            number={lightness[0].replace('lightness-', '')}
            action={this.onGrab}
          />
        )}
      </div>
    )
  }

  render() {
    return (
      <div className='slider'>
        {this.props.type == 'EQUAL' ? <this.Equal /> : null}
        {this.props.type == 'CUSTOM' ? <this.Custom /> : null}
      </div>
    )
  }

}
