import * as React from 'react'
import chroma from 'chroma-js'
import type {
  HoveredColor,
  SelectedColor,
  ColorConfiguration,
  ColorsMessage,
  DispatchProcess,
  ActionsList,
} from '../../utils/types'
import Dispatcher from './Dispatcher'
import Button from '../components/Button'
import ColorItem from '../components/ColorItem'
import Actions from './Actions'
import { locals } from '../../content/locals'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  colors: Array<ColorConfiguration>
  view: string
  editorType: string
  planStatus: string
  lang: string
  onChangeColors: (colors: Array<ColorConfiguration>) => void
  onCreateLocalStyles: () => void
  onUpdateLocalStyles: () => void
  onCreateLocalVariables: () => void
  onUpdateLocalVariables: () => void
}

const colorsMessage: ColorsMessage = {
  type: 'UPDATE_COLORS',
  data: [],
  isEditedInRealTime: false,
}

export default class Colors extends React.Component<Props> {
  dispatch: { [key: string]: DispatchProcess }
  listRef: any

  constructor(props) {
    super(props)
    this.dispatch = {
      colors: new Dispatcher(
        () => parent.postMessage({ pluginMessage: colorsMessage }, '*'),
        500
      ),
    }
    this.state = {
      selectedElement: {
        id: '',
        position: null,
      },
      hoveredElement: {
        id: '',
        hasGuideAbove: false,
        hasGuideBelow: false,
        position: null,
      },
    }
    this.listRef = React.createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount = () =>
    document.addEventListener('mousedown', this.handleClickOutside)

  componentWillUnmount = () =>
    document.removeEventListener('mousedown', this.handleClickOutside)

  handleClickOutside = (e) => {
    if (
      this.listRef &&
      !this.listRef.current.contains(e.target)
    )
      this.setState({
        selectedElement: {
          id: '',
          position: null,
        },
      })
  }

  // Handlers
  colorsHandler = (e) => {
    let id: string
    const element: HTMLElement | null = e.target.closest('.list__item')

    element != null ? (id = element.getAttribute('data-id')) : null

    colorsMessage.isEditedInRealTime = false

    const updateHexCode = () => {
      const code: string =
        e.target.value.indexOf('#') == -1
          ? '#' + e.target.value
          : e.target.value
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
        colorsMessage.data = this.props.colors.map((item) => {
          const rgb = chroma(
            e.target.value.indexOf('#') == -1
              ? '#' + e.target.value
              : e.target.value
          )._rgb
          if (item.id === id)
            item.rgb = {
              r: rgb[0] / 255,
              g: rgb[1] / 255,
              b: rgb[2] / 255,
            }
          return item
        })
        this.props.onChangeColors(colorsMessage.data)
      }
      if (e._reactName === 'onBlur') {
        this.dispatch.colors.on.status = false
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
      } else {
        colorsMessage.isEditedInRealTime = true
        this.dispatch.colors.on.status = true
      }
    }

    const updateLightnessProp = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        const rgb = chroma(
          item.rgb.r * 255,
          item.rgb.g * 255,
          item.rgb.b * 255
        ).set('lch.l', e.target.value)._rgb
        if (item.id === id)
          item.rgb = {
            r: rgb[0] / 255,
            g: rgb[1] / 255,
            b: rgb[2] / 255,
          }
        return item
      })
      this.props.onChangeColors(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const updateChromaProp = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        const rgb = chroma(
          item.rgb.r * 255,
          item.rgb.g * 255,
          item.rgb.b * 255
        ).set('lch.c', e.target.value)._rgb
        if (item.id === id)
          item.rgb = {
            r: rgb[0] / 255,
            g: rgb[1] / 255,
            b: rgb[2] / 255,
          }
        return item
      })
      this.props.onChangeColors(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const updateHueProp = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        const rgb = chroma(
          item.rgb.r * 255,
          item.rgb.g * 255,
          item.rgb.b * 255
        ).set('lch.h', e.target.value)._rgb
        if (item.id === id)
          item.rgb = {
            r: rgb[0] / 255,
            g: rgb[1] / 255,
            b: rgb[2] / 255,
          }
        return item
      })
      this.props.onChangeColors(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const addColor = () => {
      colorsMessage.data = this.props.colors
      const hasAlreadyNewUIColor = colorsMessage.data.filter((color) =>
        color.name.includes('New UI Color')
      )
      colorsMessage.data.push({
        name: `New UI Color ${hasAlreadyNewUIColor.length + 1}`,
        description: '',
        rgb: {
          r: 0.53,
          g: 0.92,
          b: 0.97,
        },
        id: uuidv4(),
        oklch: false,
        hueShifting: 0,
      })
      this.props.onChangeColors(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const removeColor = () => {
      colorsMessage.data = this.props.colors.filter((item) => item.id != id)
      this.props.onChangeColors(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const renameColor = () => {
      const hasSameName = this.props.colors.filter(
        (color) => color.name === e.target.value
      )
      colorsMessage.data = this.props.colors.map((item) => {
        if (item.id === id)
          item.name =
            hasSameName.length > 1 ? e.target.value + ' 2' : e.target.value
        return item
      })
      this.props.onChangeColors(colorsMessage.data)
      if (e._reactName === 'onBlur')
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
      if (e.key === 'Enter')
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const setHueShifting = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        if (item.id === id) item.hueShifting = parseFloat(e.target.value)
        return item
      })
      this.props.onChangeColors(colorsMessage.data)
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const updateColorDescription = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        if (item.id === id) item.description = e.target.value
        return item
      })
      this.props.onChangeColors(colorsMessage.data)
      if (e._reactName === 'onBlur')
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
      if (e.key === 'Enter')
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const actions: ActionsList = {
      UPDATE_HEX: () => updateHexCode(),
      UPDATE_LIGHTNESS: () => updateLightnessProp(),
      UPDATE_CHROMA: () => updateChromaProp(),
      UPDATE_HUE: () => updateHueProp(),
      ADD_COLOR: () => addColor(),
      REMOVE_COLOR: () => removeColor(),
      RENAME_COLOR: () => renameColor(),
      SHIFT_HUE: () => setHueShifting(),
      UPDATE_DESCRIPTION: () => updateColorDescription(),
    }

    return actions[e.target.dataset.feature]?.()
  }

  orderHandler = () => {
    const source: SelectedColor = this.state['selectedElement'],
      target: HoveredColor = this.state['hoveredElement'],
      colors = this.props.colors.map((el) => el)

    let position: number

    const colorsWithoutSource = colors.splice(source.position, 1)[0]

    if (target.hasGuideAbove && target.position > source.position)
      position = target.position - 1
    else if (target.hasGuideBelow && target.position > source.position)
      position = target.position
    else if (target.hasGuideAbove && target.position < source.position)
      position = target.position
    else if (target.hasGuideBelow && target.position < source.position)
      position = target.position + 1
    else position = target.position

    colors.splice(position, 0, colorsWithoutSource)
    this.props.onChangeColors(colors)
    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_COLORS',
          data: colors,
          isEditedInRealTime: false,
        },
      },
      '*'
    )
  }

  selectionHandler = (e) => {
    const target = e.currentTarget
    if (target !== e.target) return
    this.setState({
      selectedElement: {
        id: target.dataset.id,
        position: target.dataset.position,
      },
    })
  }

  dragHandler = (
    id: string,
    hasGuideAbove: boolean,
    hasGuideBelow: boolean,
    position: number
  ) => {
    this.setState({
      hoveredElement: {
        id: id,
        hasGuideAbove: hasGuideAbove,
        hasGuideBelow: hasGuideBelow,
        position: position,
      },
    })
  }

  dropOutsideHandler = (e) => {
    const target = e.target,
      parent: ParentNode = target.parentNode,
      scrollY: number = (parent.parentNode.parentNode as HTMLElement).scrollTop,
      parentRefTop: number = (parent as HTMLElement).offsetTop,
      parentRefBottom: number =
        parentRefTop + (parent as HTMLElement).clientHeight

    if (e.pageY + scrollY < parentRefTop) this.orderHandler()
    else if (e.pageY + scrollY > parentRefBottom) this.orderHandler()
  }

  render() {
    return (
      <>
        <div className="list-controller controls__control">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className="section-title">
                {locals[this.props.lang].colors.title}
              </div>
              <div className="type">{`(${this.props.colors.length})`}</div>
            </div>
            <div className="section-controls__right-part">
              <Button
                icon="plus"
                type="icon"
                feature="ADD_COLOR"
                action={this.colorsHandler}
              />
            </div>
          </div>
          <ul className="list" ref={this.listRef}>
            {this.props.colors.map((color, index) => (
              <ColorItem
                key={color.id}
                name={color.name}
                index={index}
                hex={chroma(
                  color.rgb.r * 255,
                  color.rgb.g * 255,
                  color.rgb.b * 255
                ).hex()}
                oklch={color.oklch}
                shift={color.hueShifting}
                description={color.description}
                uuid={color.id}
                selected={
                  this.state['selectedElement'].id === color.id ? true : false
                }
                guideAbove={
                  this.state['hoveredElement'].id === color.id
                    ? this.state['hoveredElement'].hasGuideAbove
                    : false
                }
                guideBelow={
                  this.state['hoveredElement'].id === color.id
                    ? this.state['hoveredElement'].hasGuideBelow
                    : false
                }
                lang={this.props.lang}
                onChangeColors={this.colorsHandler}
                onChangeSelection={this.selectionHandler}
                onCancellationSelection={this.selectionHandler}
                onDragChange={this.dragHandler}
                onDropOutside={this.dropOutsideHandler}
                onChangeOrder={this.orderHandler}
              />
            ))}
          </ul>
        </div>
        {this.props.editorType === 'figma' ? (
          <Actions
            context="DEPLOY"
            view={this.props.view}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onCreateLocalStyles={this.props.onCreateLocalStyles}
            onUpdateLocalStyles={this.props.onUpdateLocalStyles}
            onCreateLocalVariables={this.props.onCreateLocalVariables}
            onUpdateLocalVariables={this.props.onUpdateLocalVariables}
          />
        ) : null}
      </>
    )
  }
}
