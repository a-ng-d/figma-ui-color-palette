import * as React from 'react'
import type { ScaleConfiguration } from '../../utils/types'
import Knob from './Knob'
import doMap from './../../utils/doMap'
import addStop from './../handlers/addStop'
import deleteStop from './../handlers/deleteStop'
import shiftLeftStop from './../handlers/shiftLeftStop'
import shiftRightStop from './../handlers/shiftRightStop'
import { palette } from '../../utils/palettePackage'

interface Props {
  knobs: Array<number>
  hasPreset: boolean
  presetName: string
  type: string
  min?: number
  max?: number
  scale?: ScaleConfiguration
  onChange: (state: string, e?: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => void
}

export default class Slider extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      selectedKnob: {
        knob: null,
        state: 'NORMAL',
      },
      knobs: [],
      value: 0
    }
  }

  clickHandler = (e) => {
    if (e.detail == 1 && !this.props.hasPreset && this.state['selectedKnob']['state'] != 'SLIDING') {
      this.setState({
        selectedKnob: {
          knob: e.target,
          state: 'SELECTED'
        }
      })
    }
    else if (e.detail == 2 && !this.props.hasPreset) {
      this.setState({
        selectedKnob: {
          knob: e.target,
          state: 'EDITING'
        },
        value: this.props.scale[e.target.classList[1]]
      })
    }
  }

  validHandler = (stopId: string, e) => {
    if (e.key === 'Enter' || e._reactName === 'onBlur') {
      palette.scale = this.props.scale
      if (parseFloat(e.target.value) < parseFloat(e.target.min)) {
        palette.scale[`lightness-${stopId}`] = parseFloat(e.target.min)
        this.setState({ value: parseFloat(e.target.min) })
      }
      else if (parseFloat(e.target.value) > parseFloat(e.target.max)) {
        palette.scale[`lightness-${stopId}`] = parseFloat(e.target.max)
        this.setState({ value: parseFloat(e.target.max) })
      }
      else {
        palette.scale[`lightness-${stopId}`] = parseFloat(e.target.value)
        this.setState({ value: parseFloat(e.target.value) })
      }
      this.props.onChange('TYPED')
    }
  }

  // Direct actions
  onGrab = (e) => {
    const knob = e.target as HTMLElement,
      range = knob.parentElement as HTMLElement,
      shift = e.nativeEvent.layerX as number,
      tooltip = knob.children[0] as HTMLElement,
      rangeWidth = range.offsetWidth as number,
      slider = range.parentElement as HTMLElement,
      knobs = Array.from(range.children as HTMLCollectionOf<HTMLElement>),
      startTime: number = Date.now()

    let offset: number
    const update = () => {
      palette.min = parseFloat(
        doMap(
          (range.lastChild as HTMLElement).offsetLeft,
          0,
          rangeWidth,
          0,
          100
        ).toFixed(1)
      )
      palette.max = parseFloat(
        doMap(
          (range.firstChild as HTMLElement).offsetLeft,
          0,
          rangeWidth,
          0,
          100
        ).toFixed(1)
      )
      knobs.forEach((knob) =>
        this.updateLightnessScaleEntry(
          knob.classList[1],
          doMap(knob.offsetLeft, 0, rangeWidth, 0, 100)
        )
      )
    }

    knob.style.zIndex = '2'
    this.setState({
      selectedKnob: {
        knob: null,
        state: 'NORMAL'
      },
      knobs: knobs,
    })

    document.onmousemove = (e) =>
      this.onSlide(
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
      )

    document.onmouseup = () =>
      this.onRelease(knobs, knob, update, startTime)
  }

  onSlide = (
    e: MouseEvent,
    slider: HTMLElement,
    range: HTMLElement,
    knobs: Array<HTMLElement>,
    knob: HTMLElement,
    tooltip: HTMLElement,
    offset: number,
    shift: number,
    rangeWidth: number,
    update: () => void
  ) => {
    let limitMin: number, limitMax: number
    const gap: number = doMap(2, 0, 100, 0, rangeWidth),
      sliderPadding: number = parseFloat(
        window.getComputedStyle(slider, null).getPropertyValue('padding-left')
      )
    offset = e.clientX - slider.offsetLeft - sliderPadding - shift

    palette.min = parseFloat(
      doMap(
        (range.lastChild as HTMLElement).offsetLeft,
        0,
        rangeWidth,
        0,
        100
      ).toFixed(1)
    )
    palette.max = parseFloat(
      doMap(
        (range.firstChild as HTMLElement).offsetLeft,
        0,
        rangeWidth,
        0,
        100
      ).toFixed(1)
    )
    this.setState({
      selectedKnob: {
        knob: knob,
        state: 'SLIDING',
      },
    })

    if (knob == range.lastChild) {
      // 900
      limitMin = 0
      limitMax = (knob.previousElementSibling as HTMLElement).offsetLeft - gap
    } else if (knob == range.firstChild) {
      // 50
      limitMin = (knob.nextElementSibling as HTMLElement).offsetLeft + gap
      limitMax = rangeWidth
    } else {
      limitMin = (knob.nextElementSibling as HTMLElement).offsetLeft + gap
      limitMax = (knob.previousElementSibling as HTMLElement).offsetLeft - gap
    }

    if (offset <= limitMin) offset = limitMin
    else if (offset >= limitMax) offset = limitMax

    // distribute knobs horizontal spacing
    if (knob == range.lastChild && e.shiftKey)
      // 900
      this.distributeKnobs(
        'MIN',
        parseFloat(doMap(offset, 0, rangeWidth, 0, 100).toFixed(1)),
        knobs
      )
    else if (knob == range.firstChild && e.shiftKey)
      // 50
      this.distributeKnobs(
        'MAX',
        parseFloat(doMap(offset, 0, rangeWidth, 0, 100).toFixed(1)),
        knobs
      )

    // link every knob
    if (e.ctrlKey || e.metaKey) {
      if (
        offset <
          knob.offsetLeft - (range.lastChild as HTMLElement).offsetLeft ||
        offset >
          rangeWidth -
            (range.firstChild as HTMLElement).offsetLeft +
            knob.offsetLeft
      )
        offset = knob.offsetLeft
      else this.linkKnobs(offset, knob, knobs, rangeWidth)
    }

    if (e.ctrlKey == false && e.metaKey == false && e.shiftKey == false)
      knobs.forEach(
        (knob) => ((knob.children[0] as HTMLElement).style.display = 'none')
      )

    knob.style.left = doMap(offset, 0, rangeWidth, 0, 100).toFixed(1) + '%'

    // update lightness scale
    knobs.forEach((knob) =>
      this.updateLightnessScaleEntry(
        knob.classList[1],
        parseFloat(doMap(knob.offsetLeft, 0, rangeWidth, 0, 100).toFixed(1))
      )
    )
    this.updateKnobTooltip(
      tooltip,
      parseFloat(doMap(offset, 0, rangeWidth, 0, 100).toFixed(1))
    )
    update()
    this.props.onChange('UPDATING')
  }

  onRelease = (
    knobs: Array<HTMLElement>,
    knob: HTMLElement,
    update: () => void,
    startTime: number
  ) => {
    document.onmousemove = null
    document.onmouseup = null
    knob.onmouseup = null
    knob.style.zIndex = '1'
    knobs.forEach(
      (knob) => ((knob.children[0] as HTMLElement).style.display = 'none')
    )
    update()
    if (Date.now() - startTime < 200 && !this.props.hasPreset) {
      this.setState({
        selectedKnob: {
          knob: null,
          state: 'NORMAL',
        },
      })
    }
    this.props.onChange('RELEASED')
  }

  onAdd = (e) => {
    if (
      (e.target as HTMLElement).classList[0] === 'slider__range' &&
      Object.keys(this.props.scale).length < 24 &&
      this.props.presetName === 'Custom' &&
      !this.props.hasPreset
    ) {
      this.setState({
        selectedKnob: {
          knob: null,
          state: 'NORMAL'
        },
      })
      addStop(
        e,
        this.props.scale,
        this.props.presetName,
        this.props.min,
        this.props.max
      )
      this.props.onChange('SHIFTED')
    }
  }

  onDelete = () => {
    deleteStop(
      this.props.scale,
      this.state['selectedKnob']['knob'],
      this.props.presetName,
      this.props.min,
      this.props.max
    )
    this.setState({
      selectedKnob: {
        knob: null,
        state: 'NORMAL'
      },
    })
    this.props.onChange('SHIFTED')
  }

  onShiftRight = (e: KeyboardEvent) => {
    shiftRightStop(
      this.props.scale,
      this.state['selectedKnob']['knob'],
      e.metaKey,
      e.ctrlKey
    )
    this.props.onChange('SHIFTED')
  }

  onShiftLeft = (e: KeyboardEvent) => {
    shiftLeftStop(
      this.props.scale,
      this.state['selectedKnob']['knob'],
      e.metaKey,
      e.ctrlKey
    )
    this.props.onChange('SHIFTED')
  }

  // Utils
  doLightnessScale = () => {
    let granularity = 1

    this.props.knobs.map((index) => {
      palette.scale[`lightness-${index}`] = parseFloat(
        doMap(granularity, 0, 1, palette.min, palette.max).toFixed(1)
      )
      granularity -= 1 / (this.props.knobs.length - 1)
    })

    return palette.scale
  }

  updateLightnessScaleEntry = (key: string, value: number) => {
    palette.scale[key] = parseFloat(value.toFixed(1))
  }

  updateKnobTooltip = (tooltip: HTMLElement, value: number | string) => {
    tooltip.style.display = 'block'
    if (typeof value === 'string')
      tooltip.textContent = value == '100.0' ? '100' : value
    else tooltip.textContent = value == 100 ? '100' : value?.toFixed(1)
  }

  distributeKnobs = (
    type: string,
    value: number,
    knobs: Array<HTMLElement>
  ) => {
    if (type === 'MIN') palette.min = value
    else if (type === 'MAX') palette.max = value

    this.doLightnessScale()

    knobs.forEach((knob) => {
      knob.style.left = palette.scale[knob.classList[1]] + '%'
      this.updateKnobTooltip(
        knob.childNodes[0] as HTMLElement,
        parseFloat(palette.scale[knob.classList[1]].toFixed(1))
      )
    })
  }

  linkKnobs = (
    offset: number,
    src: HTMLElement,
    knobs: Array<HTMLElement>,
    width: number
  ) => {
    knobs.forEach((knob) => {
      const shift = knob.offsetLeft - src.offsetLeft + offset
      if (knob != src) knob.style.left = doMap(shift, 0, width, 0, 100) + '%'
      this.updateKnobTooltip(
        knob.childNodes[0] as HTMLElement,
        palette.scale[knob.classList[1]]
      )
    })
  }

  getState = (lightness: string) => {
    let state: string
    if (this.state['selectedKnob']['knob'] != null)
      state =
        this.state['selectedKnob']['knob'].classList[1] === lightness
          ? this.state['selectedKnob']['state']
          : 'NORMAL'
    else state = 'NORMAL'

    return state
  }

  componentDidMount() {
    window.onkeydown = (e: KeyboardEvent) => {
      if (
        e.key === 'Backspace' &&
        this.state['selectedKnob']['knob'] != null &&
        this.props.knobs.length > 2
      )
        this.props.presetName === 'Custom' && !this.props.hasPreset
          ? this.onDelete()
          : null
      else if (e.key === 'ArrowRight' && this.state['selectedKnob']['knob'] != null)
        this.onShiftRight(e)
      else if (e.key === 'ArrowLeft' && this.state['selectedKnob']['knob'] != null)
        this.onShiftLeft(e)
      else if (e.key === 'Escape' && this.state['selectedKnob']['knob'] != null)
        this.setState({
          selectedKnob: {
            knob: null,
            state: 'NORMAL'
          },
        })
    }
    document.onmousedown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.slider__knob') == null)
        this.setState({
          selectedKnob: {
            knob: null,
            state: 'NORMAL'
          },
        })
    }
  }

  componentWillUnmount() {
    window.onkeydown = null
    document.onmousedown = null
  }

  // Templates
  Equal = () => {
    palette.min = this.props.min
    palette.max = this.props.max
    return (
      <div className="slider__range">
        {Object.entries(this.doLightnessScale()).map((lightness) => (
          <Knob
            key={lightness[0]}
            id={lightness[0]}
            shortId={lightness[0].replace('lightness-', '')}
            value={lightness[1]}
            inputValue={this.state['value']}
            onMouseDown={this.onGrab}
          />
        ))}
      </div>
    )
  }

  Custom = () => {
    return (
      <div
        className="slider__range"
        onMouseDown={this.onAdd}
      >
        {Object.entries(this.props.scale).map((lightness, index, original) => (
          <Knob
            key={lightness[0]}
            id={lightness[0]}
            shortId={lightness[0].replace('lightness-', '')}
            value={lightness[1]}
            inputValue={this.state['value']}
            state={this.getState(lightness[0])}
            min={original[index + 1] == undefined ? '0' : (original[index + 1][1] + 2).toString()}
            max={original[index - 1] == undefined ? '100' : (original[index - 1][1] - 2).toString()}
            onMouseDown={this.onGrab}
            onClick={this.clickHandler}
            onChangeStopValue={(e) => this.setState({ value: e.target.value })}
            onValidStopValue={this.validHandler}
          />
        ))}
      </div>
    )
  }

  // Render
  render() {
    return (
      <div className="slider">
        {this.props.type === 'EQUAL' ? <this.Equal /> : null}
        {this.props.type === 'CUSTOM' ? <this.Custom /> : null}
      </div>
    )
  }
}
