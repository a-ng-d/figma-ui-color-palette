import * as React from 'react'
import type { ScaleConfiguration } from '../../utils/types'
import Knob from './Knob'
import doMap from './../../utils/doMap'
import addStop from './../handlers/addStop'
import deleteStop from './../handlers/deleteStop'
import shiftLeftStop from './../handlers/shiftLeftStop'
import shiftRightStop from './../handlers/shiftRightStop'
import { palette } from '../../utils/palettePackage'

const safeGap = 2

interface Props {
  stops: Array<number>
  hasPreset: boolean
  presetName: string
  type: string
  min?: number
  max?: number
  scale?: ScaleConfiguration
  onChange: (
    state: string,
    e?:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void
}

export default class Slider extends React.Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      selectedStop: {
        stop: null,
        state: 'NORMAL',
      },
      stopInputValue: 0,
    }
  }

  clickHandler = (e) => {
    if (
      e.detail == 1 &&
      !this.props.hasPreset &&
      this.state['selectedStop']['state'] === 'NORMAL'
    ) {
      this.setState({
        selectedStop: {
          stop: e.target,
          state: 'SELECTED',
        },
      })
    } else if (
      e.detail == 2 &&
      !this.props.hasPreset &&
      this.state['selectedStop']['state'] != 'EDITING'
    ) {
      this.setState({
        selectedStop: {
          stop: e.target,
          state: 'EDITING',
        },
        stopInputValue: this.props.scale[e.target.classList[1]],
      })
    }
  }

  validHandler = (stopId: string, e) => {
    if (e.key === 'Enter' || e._reactName === 'onBlur') {
      if (e.target.value != '') {
        palette.scale = this.props.scale
        if (parseFloat(e.target.value) < parseFloat(e.target.min)) {
          palette.scale[`lightness-${stopId}`] = parseFloat(e.target.min)
          this.setState({ stopInputValue: parseFloat(e.target.min) })
        } else if (parseFloat(e.target.value) > parseFloat(e.target.max)) {
          palette.scale[`lightness-${stopId}`] = parseFloat(e.target.max)
          this.setState({ stopInputValue: parseFloat(e.target.max) })
        } else {
          palette.scale[`lightness-${stopId}`] = parseFloat(e.target.value)
          this.setState({ stopInputValue: parseFloat(e.target.value) })
        }
        this.props.onChange('TYPED')
      } else
        this.setState({
          stopInputValue: this.props.scale[`lightness-${stopId}`],
        })
    }
  }

  // Direct actions
  onGrab = (e) => {
    const stop = e.currentTarget as HTMLElement,
      range = stop.parentElement as HTMLElement,
      shift = e.nativeEvent.layerX as number,
      tooltip = stop.children[0] as HTMLElement,
      rangeWidth = range.offsetWidth as number,
      slider = range.parentElement as HTMLElement,
      stops = Array.from(range.children as HTMLCollectionOf<HTMLElement>)

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
      stops.forEach((stop) =>
        this.updateLightnessScaleEntry(
          stop.classList[1],
          parseFloat(stop.style.left.replace('%', ''))
        )
      )
    }

    stop.style.zIndex = '2'
    if (this.state['selectedStop']['stop'] != stop)
      this.setState({
        selectedStop: {
          stop: null,
          state: 'NORMAL',
        },
      })

    document.onmousemove = (e) =>
      this.onSlide(
        e,
        slider,
        range,
        stops,
        stop,
        tooltip,
        offset,
        shift,
        rangeWidth,
        update
      )

    document.onmouseup = () => this.onRelease(stops, stop, update)
  }

  onSlide = (
    e: MouseEvent,
    slider: HTMLElement,
    range: HTMLElement,
    stops: Array<HTMLElement>,
    stop: HTMLElement,
    tooltip: HTMLElement,
    offset: number,
    shift: number,
    rangeWidth: number,
    update: () => void
  ) => {
    let limitMin: number, limitMax: number
    const gap: number = doMap(safeGap, 0, 100, 0, rangeWidth),
      sliderPadding: number = parseFloat(
        window.getComputedStyle(slider, null).getPropertyValue('padding-left')
      )
    offset = e.clientX - slider.offsetLeft - sliderPadding - shift

    this.setState({
      selectedStop: {
        stop: stop,
        state: 'SLIDING',
      },
    })

    update()

    if (stop == range.lastChild) {
      // 900
      limitMin = 0
      limitMax = (stop.previousElementSibling as HTMLElement).offsetLeft - gap
    } else if (stop == range.firstChild) {
      // 50
      limitMin = (stop.nextElementSibling as HTMLElement).offsetLeft + gap
      limitMax = rangeWidth
    } else {
      limitMin = (stop.nextElementSibling as HTMLElement).offsetLeft + gap
      limitMax = (stop.previousElementSibling as HTMLElement).offsetLeft - gap
    }

    if (offset <= limitMin) offset = limitMin
    else if (offset >= limitMax) offset = limitMax

    // distribute stops horizontal spacing
    if (stop == range.lastChild && e.shiftKey)
      // 900
      this.distributeStops(
        'MIN',
        parseFloat(doMap(offset, 0, rangeWidth, 0, 100).toFixed(1)),
        stops
      )
    else if (stop == range.firstChild && e.shiftKey)
      // 50
      this.distributeStops(
        'MAX',
        parseFloat(doMap(offset, 0, rangeWidth, 0, 100).toFixed(1)),
        stops
      )

    // link every stop
    if (e.ctrlKey || e.metaKey) {
      if (
        offset <
          stop.offsetLeft - (range.lastChild as HTMLElement).offsetLeft ||
        offset >
          rangeWidth -
            (range.firstChild as HTMLElement).offsetLeft +
            stop.offsetLeft
      )
        offset = stop.offsetLeft
      else this.linkStops(offset, stop, stops, rangeWidth)
    }

    if (e.ctrlKey == false && e.metaKey == false && e.shiftKey == false)
      stops.forEach(
        (stop) => ((stop.children[0] as HTMLElement).style.display = 'none')
      )

    stop.style.left = doMap(offset, 0, rangeWidth, 0, 100).toFixed(1) + '%'

    // update lightness scale
    this.updateStopTooltip(
      tooltip,
      parseFloat(doMap(offset, 0, rangeWidth, 0, 100).toFixed(1))
    )
    update()
    this.props.onChange('UPDATING')
  }

  onRelease = (
    stops: Array<HTMLElement>,
    stop: HTMLElement,
    update: () => void
  ) => {
    document.onmousemove = null
    document.onmouseup = null
    stop.onmouseup = null
    stop.style.zIndex = '1'
    stops.forEach(
      (stop) => ((stop.children[0] as HTMLElement).style.display = 'none')
    )

    if (this.state['selectedStop']['state'] === 'SLIDING')
      this.setState({
        selectedStop: {
          stop: null,
          state: 'SLIDED',
        },
      })

    update()
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
        selectedStop: {
          stop: null,
          state: 'NORMAL',
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
      this.state['selectedStop']['stop'],
      this.props.presetName,
      this.props.min,
      this.props.max
    )
    this.setState({
      selectedStop: {
        stop: null,
        state: 'NORMAL',
      },
    })
    this.props.onChange('SHIFTED')
  }

  onShiftRight = (e: KeyboardEvent) => {
    shiftRightStop(
      this.props.scale,
      this.state['selectedStop']['stop'],
      e.metaKey,
      e.ctrlKey,
      safeGap
    )
    this.props.onChange('SHIFTED')
  }

  onShiftLeft = (e: KeyboardEvent) => {
    shiftLeftStop(
      this.props.scale,
      this.state['selectedStop']['stop'],
      e.metaKey,
      e.ctrlKey,
      safeGap
    )
    this.props.onChange('SHIFTED')
  }

  // Utils
  doLightnessScale = () => {
    let granularity = 1

    this.props.stops.map((index) => {
      palette.scale[`lightness-${index}`] = parseFloat(
        doMap(granularity, 0, 1, palette.min, palette.max).toFixed(1)
      )
      granularity -= 1 / (this.props.stops.length - 1)
    })

    return palette.scale
  }

  updateLightnessScaleEntry = (key: string, value: number) => {
    palette.scale[key] = parseFloat(value.toFixed(1))
  }

  updateStopTooltip = (tooltip: HTMLElement, value: number | string) => {
    tooltip.style.display = 'block'
    if (typeof value === 'string')
      tooltip.textContent = value == '100.0' ? '100' : value
    else tooltip.textContent = value == 100 ? '100' : value?.toFixed(1)
  }

  distributeStops = (
    type: string,
    value: number,
    stops: Array<HTMLElement>
  ) => {
    if (type === 'MIN') palette.min = value
    else if (type === 'MAX') palette.max = value

    this.doLightnessScale()

    stops.forEach((stop) => {
      stop.style.left = palette.scale[stop.classList[1]] + '%'
      this.updateStopTooltip(
        stop.childNodes[0] as HTMLElement,
        parseFloat(palette.scale[stop.classList[1]].toFixed(1))
      )
    })
  }

  linkStops = (
    offset: number,
    src: HTMLElement,
    stops: Array<HTMLElement>,
    width: number
  ) => {
    stops.forEach((stop) => {
      const shift = stop.offsetLeft - src.offsetLeft + offset
      if (stop != src)
        stop.style.left =
          parseFloat(doMap(shift, 0, width, 0, 100).toFixed(1)) + '%'
      this.updateStopTooltip(
        stop.childNodes[0] as HTMLElement,
        parseFloat(doMap(shift, 0, width, 0, 100).toFixed(1))
      )
    })
  }

  getState = (lightness: string) => {
    let state: string
    if (this.state['selectedStop']['stop'] != null)
      state =
        this.state['selectedStop']['stop'].classList[1] === lightness
          ? this.state['selectedStop']['state']
          : 'NORMAL'
    else state = 'NORMAL'

    return state
  }

  componentDidMount() {
    window.onkeydown = (e: KeyboardEvent) => {
      if (
        e.key === 'Backspace' &&
        this.state['selectedStop']['stop'] != null &&
        this.props.stops.length > 2 &&
        this.state['selectedStop']['state'] != 'EDITING'
      )
        this.props.presetName === 'Custom' && !this.props.hasPreset
          ? this.onDelete()
          : null
      else if (
        e.key === 'ArrowRight' &&
        this.state['selectedStop']['stop'] != null &&
        this.state['selectedStop']['state'] != 'EDITING'
      )
        this.onShiftRight(e)
      else if (
        e.key === 'ArrowLeft' &&
        this.state['selectedStop']['stop'] != null &&
        this.state['selectedStop']['state'] != 'EDITING'
      )
        this.onShiftLeft(e)
      else if (e.key === 'Escape' && this.state['selectedStop']['stop'] != null)
        this.setState({
          selectedStop: {
            stop: null,
            state: 'NORMAL',
          },
        })
    }
    document.onmousedown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('.slider__knob') == null)
        setTimeout(
          () =>
            this.setState({
              selectedStop: {
                stop: null,
                state: 'NORMAL',
              },
            }),
          50
        )
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
            stopInputValue={this.state['stopInputValue']}
            onMouseDown={this.onGrab}
          />
        ))}
      </div>
    )
  }

  Custom = () => {
    palette.scale = this.props.scale
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
            stopInputValue={this.state['stopInputValue']}
            state={this.getState(lightness[0])}
            min={
              original[index + 1] == undefined
                ? '0'
                : (original[index + 1][1] + safeGap).toString()
            }
            max={
              original[index - 1] == undefined
                ? '100'
                : (original[index - 1][1] - safeGap).toString()
            }
            onMouseDown={this.onGrab}
            onClick={this.clickHandler}
            onChangeStopValue={(e) =>
              this.setState({ stopInputValue: e.target.value })
            }
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
