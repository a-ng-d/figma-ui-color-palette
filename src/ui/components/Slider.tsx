import * as React from 'react'
import type { ScaleConfiguration } from '../../utils/types'
import Knob from './Knob'
import { doMap } from '@a-ng-d/figmug.modules.do-map'
import addStop from './../handlers/addStop'
import deleteStop from './../handlers/deleteStop'
import shiftLeftStop from './../handlers/shiftLeftStop'
import shiftRightStop from './../handlers/shiftRightStop'
import { palette } from '../../utils/palettePackage'
import doLightnessScale from '../../utils/doLightnessScale'

const safeGap = 2

interface Props {
  stops: Array<number>
  hasPreset: boolean
  presetName: string
  type: 'EQUAL' | 'CUSTOM'
  min?: number
  max?: number
  scale?: ScaleConfiguration
  onChange: (state: string, feature?: string) => void
}

export default class Slider extends React.Component<Props> {
  // Handlers
  validHandler = (stopId: string, e: any) => {
    if (e.target.value != '') {
      palette.scale = this.props.scale ?? {}
      if (parseFloat(e.target.value) < parseFloat(e.target.min))
        palette.scale[`lightness-${stopId}`] = parseFloat(e.target.min)
      else if (parseFloat(e.target.value) > parseFloat(e.target.max))
        palette.scale[`lightness-${stopId}`] = parseFloat(e.target.max)
      else palette.scale[`lightness-${stopId}`] = parseFloat(e.target.value)
      this.props.onChange('TYPED')
    }
  }

  // Direct actions
  onGrab = (e: React.MouseEvent<Element, MouseEvent>) => {
    const stop = e.currentTarget as HTMLElement,
      range = stop.parentElement as HTMLElement,
      shift = (e.nativeEvent as any).layerX as number,
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

    update()
    this.props.onChange('RELEASED')
  }

  onAdd = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (
      (e.target as HTMLElement).classList[0] === 'slider__range' &&
      Object.keys(this.props.scale != undefined ? this.props.scale : {})
        .length < 24 &&
      this.props.presetName === 'Custom' &&
      !this.props.hasPreset
    ) {
      addStop(
        e,
        this.props.scale ?? {},
        this.props.presetName,
        this.props.min ?? 0,
        this.props.max ?? 100
      )
      this.props.onChange('SHIFTED', 'ADD_STOP')
    }
  }

  onDelete = (knob: HTMLElement) => {
    deleteStop(
      this.props.scale ?? {},
      knob,
      this.props.presetName,
      this.props.min ?? 0,
      this.props.max ?? 100
    )
    this.props.onChange('SHIFTED', 'DELETE_STOP')
  }

  onShiftRight = (knob: HTMLElement, isMeta: boolean, isCtrl: boolean) => {
    shiftRightStop(this.props.scale ?? {}, knob, isMeta, isCtrl, safeGap)
    this.props.onChange('SHIFTED')
  }

  onShiftLeft = (knob: HTMLElement, isMeta: boolean, isCtrl: boolean) => {
    shiftLeftStop(this.props.scale ?? {}, knob, isMeta, isCtrl, safeGap)
    this.props.onChange('SHIFTED')
  }

  // Utils
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

    palette.scale = doLightnessScale(
      this.props.stops,
      palette.min ?? 0,
      palette.max ?? 100
    )

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

  // Templates
  Equal = () => {
    palette.min = this.props.min
    palette.max = this.props.max
    palette.scale = doLightnessScale(
      this.props.stops,
      palette.min ?? 0,
      palette.max ?? 100
    )
    return (
      <div className="slider__range">
        {Object.entries(palette.scale).map((lightness) => (
          <Knob
            key={lightness[0]}
            id={lightness[0]}
            shortId={lightness[0].replace('lightness-', '')}
            value={lightness[1]}
            canBeTyped={false}
            onMouseDown={(e) => this.onGrab(e)}
          />
        ))}
      </div>
    )
  }

  Custom = () => {
    palette.scale = this.props.scale ?? {}
    return (
      <div
        className="slider__range"
        onMouseDown={(e) => this.onAdd(e)}
      >
        {Object.entries(this.props.scale ?? {}).map(
          (lightness, index, original) => (
            <Knob
              key={lightness[0]}
              id={lightness[0]}
              shortId={lightness[0].replace('lightness-', '')}
              value={lightness[1]}
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
              canBeTyped={true}
              onShiftRight={(e) => {
                this.onShiftRight(e.target as HTMLElement, e.metaKey, e.ctrlKey)
              }}
              onShiftLeft={(e) => {
                this.onShiftLeft(e.target as HTMLElement, e.metaKey, e.ctrlKey)
              }}
              onDelete={(e) => {
                if (
                  this.props.stops.length > 2 &&
                  this.props.presetName === 'Custom' &&
                  !this.props.hasPreset
                )
                  this.onDelete(e.target as HTMLElement)
              }}
              onMouseDown={(e) => {
                this.onGrab(e)
                ;(e.target as HTMLElement).focus()
              }}
              onValidStopValue={(stopId, e) => this.validHandler(stopId, e)}
            />
          )
        )}
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
