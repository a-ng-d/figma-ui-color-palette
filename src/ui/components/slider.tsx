import * as React from 'react';
import NumericStepper from './NumericStepper';
import { palette } from '../data';

interface Props {
  knobsList: string;
  type: string;
  min: string;
  max: string;
  scale: string;
  onChange: any
};

export default class Slider extends React.Component<Props> {
  time: number;

  constructor(props) {
    super(props);
    this.time = 0;
    this.state = {
      id: null,
      value: null,
      hasInput: false
    }
  }

  doMap = (value, oldMin, oldMax, newMin, newMax) => {
    const oldRange = oldMax - oldMin,
        newRange = newMax - newMin
    return ((value - oldMin) * newRange / oldRange) + newMin
  }

  // Events
  onGrab = (e: any) => {
    const knob = e.target,
          range = knob.parentElement,
          shift = e.nativeEvent.layerX,
          tooltip = knob.children[0],
          rangeWidth = range.offsetWidth,
          knobs = Array.from(range.childNodes as HTMLCollectionOf<HTMLElement>);

    let offset,
        update = setInterval(() => this.props.onChange(), 500);

    if ((e.timeStamp - this.time) < 300) {
      this.onDoubleClick(knob.style.left.slice(0, -1));
      this.time = 0
    };

    this.time = e.timeStamp;
    knob.style.zIndex = 2;

    document.onmousemove = (e) => this.onSlide(
      e,
      range,
      knobs,
      knob,
      tooltip,
      offset,
      shift,
      rangeWidth
    );

    document.onmouseup = () => this.onRelease(
      knobs,
      knob,
      offset,
      update,
      rangeWidth
    )
  }

  onSlide = (e, range, knobs, knob, tooltip, offset, shift, rangeWidth) => {
    let limitMin, limitMax;
    const gap = this.doMap(2, 0, 100, 0, rangeWidth);
    offset = e.clientX - range.offsetLeft - shift;

    palette.min = parseFloat(this.doMap(range.lastChild.offsetLeft, 0, rangeWidth, 0, 100).toFixed(1));
    palette.max = parseFloat(this.doMap(range.firstChild.offsetLeft, 0, rangeWidth, 0, 100).toFixed(1));

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
    if (knob == range.lastChild && e.shiftKey) // 900
      this.distributeKnobs('MIN', this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1), knobs)
    else if (knob == range.firstChild && e.shiftKey) // 50
      this.distributeKnobs('MAX', this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1), knobs)

    // link every knob
    if (e.ctrlKey || e.metaKey) {
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
    this.updateKnobTooltip(tooltip, this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1));
  }

  onRelease = (knobs, knob, offset, update, rangeWidth) => {
    document.onmousemove = null;
    document.onmouseup = null;
    knob.onmouseup = null;
    knob.style.zIndex = 1;
    knobs.forEach(knob => (knob.children[0] as HTMLElement).style.display = 'none');
    clearInterval(update)
  }

  onDoubleClick = (value: string) => {
    this.setState({ hasInput: true, value: value })
  }

  onEdit = () => {
    console.log('ok')
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

  updateLightnessScaleEntry = (key, value) => {
    palette.scale[key] = value;
  }

  updateKnobTooltip = (tooltip, value) => {
    tooltip.style.display = 'block';
    tooltip.textContent = value
  }

  distributeKnobs = (type, value, knobs) => {
    if (type === 'MIN')
      palette.min = parseFloat(value)
    else if (type === 'MAX')
      palette.max = parseFloat(value);

    this.doLightnessScale();

    knobs.forEach(knob => {
      knob.style.left = palette.scale[knob.classList[1]] + '%';
      this.updateKnobTooltip(knob.childNodes[0], palette.scale[knob.classList[1]])
    })
  }

  linkKnobs = (offset, src, knobs, width) => {
    knobs.forEach(knob => {
      let shift = (knob.offsetLeft - src.offsetLeft) + offset;
      if (knob != src)
        knob.style.left = this.doMap(shift, 0, width, 0, 100) + '%';
      this.updateKnobTooltip(knob.childNodes[0], palette.scale[knob.classList[1]])
    })
  }

  // Templates
  Equal = (props) => {
    palette.min = parseFloat(this.props.min);
    palette.max = parseFloat(this.props.max);
    return (
      <div className='slider__range'>
        {Object.entries(this.doLightnessScale()).map(lightness =>
          <div key={lightness[0]} className={`slider__knob ${lightness[0]}`} style={{left: `${lightness[1]}%`}} onMouseDown={this.onGrab}>
            <div className='type type--inverse slider__tooltip'>{lightness[1]}</div>
            <div className='type slider__label'>{lightness[0].replace('lightness-', '')}</div>
          </div>
        )}
      </div>
    )
  }

  Custom = (props) => {
    return (
      <div className='slider__range'>
        {Object.entries(JSON.parse(this.props.scale)).map(lightness =>
          <div key={lightness[0]} className={`slider__knob ${lightness[0]}`} style={{left: `${lightness[1]}%`}} onMouseDown={this.onGrab}>
            <div className='type type--inverse slider__tooltip'>{lightness[1]}</div>
            <div className='type slider__label'>{lightness[0].replace('lightness-', '')}</div>
          </div>
        )}
      </div>
    )
  }

  render() {
    return (
      <div className='slider'>
        {this.props.type == 'EQUAL' ? <this.Equal /> : null}
        {this.props.type == 'CUSTOM' ? <this.Custom /> : null}
        {this.state['hasInput'] ?
          <div className='slider__input' style={{left: `${this.state['value']}%`}}>
            <NumericStepper min='0' max='100' step='0.1' value={this.state['value']} onChange={this.onEdit} />
          </div>
        : null}
      </div>
    )
  }

}
