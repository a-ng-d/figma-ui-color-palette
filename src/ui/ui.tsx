import * as React from 'react';
import * as ReactDOM from 'react-dom';
import '../../node_modules/figma-plugin-ds/dist/figma-plugin-ds.css';
import './ui.css';

declare function require(path: string): any;

class App extends React.Component {
  lightnessScale: object;
  lightnessMin: number;
  lightnessMax: number;
  lightnessList: Array<number>;

  constructor(props) {
    super(props)
    this.lightnessScale = {};
    this.lightnessMin = 24;
    this.lightnessMax = 96;
    this.lightnessList = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
  }

  // Generic
  doMap = (value, oldMin, oldMax, newMin, newMax) => {
  	const oldRange = oldMax - oldMin,
        newRange = newMax - newMin
  	return ((value - oldMin) * newRange / oldRange) + newMin
  }

  // Events
  onCreate = () => {
    const data = this.lightnessScale;
    parent.postMessage({ pluginMessage: { type: 'make-palette', data } }, '*')
  }

  onSlide = (e) => {
    const knob = e.target,
          range = e.nativeEvent.path[1],
          shift = e.nativeEvent.layerX,
          tooltip = knob.children[1],
          rangeWidth = range.offsetWidth,
          knobs = Array.from(range.childNodes as HTMLCollectionOf<HTMLElement>);

    let offset;
    knob.style.zIndex = 2;

    const slide = (e) => {
      let limitMin, limitMax;
      offset = e.clientX - range.offsetLeft - shift;

      if (knob == range.lastChild) { // 900
        limitMin = 0;
        limitMax = knob.previousElementSibling.offsetLeft - 10
      } else if (knob == range.firstChild) { // 50
        limitMin = knob.nextElementSibling.offsetLeft + 10;
        limitMax = rangeWidth
      } else {
        limitMin = knob.nextElementSibling.offsetLeft + 10;
        limitMax = knob.previousElementSibling.offsetLeft - 10
      }

      if (offset < limitMin)
        offset = limitMin;
      else if (offset >= limitMax)
        offset = limitMax;

      if (knob == range.lastChild && e.shiftKey == true) // 900
        this.updateKnobsPosition('min', this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1), knobs);
      else if (knob == range.firstChild && e.shiftKey == true) // 50
          this.updateKnobsPosition('max', this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1), knobs);
      else if (e.shiftKey == false)
        knobs.forEach(knob => (knob.children[1] as HTMLElement).style.display = 'none');

      knob.style.left = offset + 'px'
      this.updateLightnessScaleEntry(knob.classList[1], this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1));
      this.updateKnobTooltip(tooltip, this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1));
    }

    document.addEventListener('mousemove', slide)

    document.onmouseup = () => {
      document.removeEventListener('mousemove', slide);
      knob.onmouseup = null;
      knob.style.zIndex = 1;
      knob.style.left = this.doMap(offset, 0, rangeWidth, 0, 100).toFixed(1) + '%';
      knobs.forEach(knob => (knob.children[1] as HTMLElement).style.display = 'none')
      console.log(this.lightnessScale)
    }

  }

  // Actions
  doLightnessScale = () => {
    let granularity: number = 1;

    this.lightnessList.forEach(index => {
      this.lightnessScale[`lightness-${index}`] = this.doMap(granularity, 0, 1, this.lightnessMin, this.lightnessMax).toFixed(1);
      granularity -= 1 / (this.lightnessList.length - 1)
    })

    return this.lightnessScale
  }

  updateLightnessScaleEntry = (key, value) => {
    this.lightnessScale[key] = value;
  }

  updateKnobTooltip = (tooltip, value) => {
    tooltip.style.display = 'block';
    tooltip.textContent = value
  }

  updateKnobsPosition = (type, value, knobs) => {
    if (type === 'min')
      this.lightnessMin = parseFloat(value)
    else if (type === 'max')
      this.lightnessMax = parseFloat(value)

    this.doLightnessScale();

    knobs.forEach(knob => {
      knob.style.left = this.lightnessScale[knob.classList[1]] + '%';
      this.updateKnobTooltip(knob.childNodes[1], this.lightnessScale[knob.classList[1]])
    })
  }

  render() {
    return <main>
      <section id='lightness-scale'>
        <div className='section-title'>Lightness scale</div>
        <div className='slider'>
          <div className='slider_range'>
            {Object.entries(this.doLightnessScale()).map(lightness =>
              <div key={lightness[0]} className={`slider_knob ${lightness[0]}`} style={{left: `${lightness[1]}%`}} onMouseDown={this.onSlide}><span className='type slider_label'>{lightness[0].replace('lightness-', '')}</span><div className='type type--inverse slider_tooltip'>{lightness[1]}</div></div>
            )}
          </div>
        </div>
        <div className="onboarding-tip">
          <div className="icon icon--library"></div>
          <div className="onboarding-tip__msg">Hold Shift ⇧ while dragging 50 or 900 to distribute horizontal spacing</div>
        </div>
      </section>
      <section id='actions'>
        <button className='button button--primary' onClick={this.onCreate}>Generate a palette</button>
      </section>
    </main>
  }
};

ReactDOM.render(<App />, document.getElementById('react-page'))
