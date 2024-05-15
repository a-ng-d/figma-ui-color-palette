import React from 'react'
import chroma from 'chroma-js'
import type {
  HoveredColor,
  SelectedColor,
  ColorConfiguration,
  ColorsMessage,
  DispatchProcess,
  ActionsList,
  HexModel,
  Language,
  EditorType,
  PlanStatus,
} from '../../utils/types'
import type { AppStates } from '../App'
import Dispatcher from './Dispatcher'
import { Button, Message, SectionTitle } from '@a_ng_d/figmug-ui'
import ColorItem from '../components/ColorItem'
import Actions from './Actions'
import { locals } from '../../content/locals'
import { uid } from 'uid'

interface ColorsProps {
  colors: Array<ColorConfiguration>
  editorType: EditorType
  planStatus: PlanStatus
  lang: Language
  onChangeColors: React.Dispatch<Partial<AppStates>>
  onSyncLocalStyles: () => void
  onSyncLocalVariables: () => void
  onPublishPalette: () => void
}

interface ColorsStates {
  selectedElement: SelectedColor
  hoveredElement: HoveredColor
}

const colorsMessage: ColorsMessage = {
  type: 'UPDATE_COLORS',
  data: [],
  isEditedInRealTime: false,
}

export default class Colors extends React.Component<ColorsProps, ColorsStates> {
  dispatch: { [key: string]: DispatchProcess }
  listRef: React.RefObject<HTMLUListElement>

  constructor(props: ColorsProps) {
    super(props)
    this.dispatch = {
      colors: new Dispatcher(
        () => parent.postMessage({ pluginMessage: colorsMessage }, '*'),
        500
      ) as DispatchProcess,
    }
    this.state = {
      selectedElement: {
        id: undefined,
        position: 0,
      },
      hoveredElement: {
        id: undefined,
        hasGuideAbove: false,
        hasGuideBelow: false,
        position: 0,
      },
    }
    this.listRef = React.createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount = () =>
    document.addEventListener('mousedown', this.handleClickOutside)

  componentWillUnmount = () =>
    document.removeEventListener('mousedown', this.handleClickOutside)

  handleClickOutside = (e: Event) => {
    if (this.listRef.current != null)
      if (this.listRef && !this.listRef.current.contains(e.target as HTMLElement))
        this.setState({
          selectedElement: {
            id: undefined,
            position: 0,
          },
        })
  }

  // Handlers
  colorsHandler = (e: any) => {
    let id: string | null
    const element: HTMLElement | null = (e.target as HTMLElement).closest(
        '.list__item'
      ),
      currentElement: HTMLInputElement = e.currentTarget

    element != null ? (id = element.getAttribute('data-id')) : (id = null)

    colorsMessage.isEditedInRealTime = false

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
        id: uid(),
        oklch: false,
        hueShifting: 0,
      })
      this.props.onChangeColors({
        colors: colorsMessage.data,
        onGoingStep: 'colors changed',
      })
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const renameColor = () => {
      const hasSameName = this.props.colors.filter(
        (color) => color.name === currentElement.value
      )
      colorsMessage.data = this.props.colors.map((item) => {
        if (item.id === id)
          item.name =
            hasSameName.length > 1
              ? currentElement.value + ' 2'
              : currentElement.value
        return item
      })
      this.props.onChangeColors({
        colors: colorsMessage.data,
        onGoingStep: 'colors changed',
      })
      if (e.type === 'blur' || e.code === 'Enter')
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const updateHexCode = () => {
      const code: HexModel =
        currentElement.value.indexOf('#') == -1
          ? '#' + currentElement.value
          : currentElement.value
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
        colorsMessage.data = this.props.colors.map((item) => {
          const rgb = chroma(
            currentElement.value.indexOf('#') == -1
              ? '#' + currentElement.value
              : currentElement.value
          ).rgb()
          if (item.id === id)
            item.rgb = {
              r: rgb[0] / 255,
              g: rgb[1] / 255,
              b: rgb[2] / 255,
            }
          return item
        })
        this.props.onChangeColors({
          colors: colorsMessage.data,
          onGoingStep: 'colors changed',
        })
      }
      if (e.type === 'blur') {
        this.dispatch.colors.on.status = false
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
      } else {
        colorsMessage.isEditedInRealTime = true
        this.dispatch.colors.on.status = true
      }
    }

    const updateLightnessProp = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        const rgb = chroma(item.rgb.r * 255, item.rgb.g * 255, item.rgb.b * 255)
          .set('lch.l', currentElement.value)
          .rgb()
        if (item.id === id)
          item.rgb = {
            r: rgb[0] / 255,
            g: rgb[1] / 255,
            b: rgb[2] / 255,
          }
        return item
      })
      this.props.onChangeColors({
        colors: colorsMessage.data,
        onGoingStep: 'colors changed',
      })
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const updateChromaProp = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        const rgb = chroma(item.rgb.r * 255, item.rgb.g * 255, item.rgb.b * 255)
          .set('lch.c', currentElement.value)
          .rgb()
        if (item.id === id)
          item.rgb = {
            r: rgb[0] / 255,
            g: rgb[1] / 255,
            b: rgb[2] / 255,
          }
        return item
      })
      this.props.onChangeColors({
        colors: colorsMessage.data,
        onGoingStep: 'colors changed',
      })
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const updateHueProp = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        const rgb = chroma(item.rgb.r * 255, item.rgb.g * 255, item.rgb.b * 255)
          .set('lch.h', currentElement.value)
          .rgb()
        if (item.id === id)
          item.rgb = {
            r: rgb[0] / 255,
            g: rgb[1] / 255,
            b: rgb[2] / 255,
          }
        return item
      })
      this.props.onChangeColors({
        colors: colorsMessage.data,
        onGoingStep: 'colors changed',
      })
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const setHueShifting = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        if (item.id === id) item.hueShifting = parseFloat(currentElement.value)
        return item
      })
      this.props.onChangeColors({
        colors: colorsMessage.data,
        onGoingStep: 'colors changed',
      })
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const updateColorDescription = () => {
      colorsMessage.data = this.props.colors.map((item) => {
        if (item.id === id) item.description = currentElement.value
        return item
      })
      this.props.onChangeColors({
        colors: colorsMessage.data,
        onGoingStep: 'colors changed',
      })
      if (e.type === 'blur')
        parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const removeColor = () => {
      colorsMessage.data = this.props.colors.filter((item) => item.id != id)
      this.props.onChangeColors({
        colors: colorsMessage.data,
        onGoingStep: 'colors changed',
      })
      parent.postMessage({ pluginMessage: colorsMessage }, '*')
    }

    const actions: ActionsList = {
      ADD_COLOR: () => addColor(),
      UPDATE_HEX: () => updateHexCode(),
      RENAME_COLOR: () => renameColor(),
      UPDATE_LIGHTNESS: () => updateLightnessProp(),
      UPDATE_CHROMA: () => updateChromaProp(),
      UPDATE_HUE: () => updateHueProp(),
      SHIFT_HUE: () => setHueShifting(),
      UPDATE_DESCRIPTION: () => updateColorDescription(),
      REMOVE_COLOR: () => removeColor(),
      NULL: () => null,
    }

    return actions[currentElement.dataset.feature ?? 'NULL']?.()
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
    this.props.onChangeColors({
      colors: colors,
      onGoingStep: 'colors changed',
    })
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

  selectionHandler: React.MouseEventHandler<HTMLLIElement> &
    React.MouseEventHandler<Element> &
    React.FocusEventHandler<HTMLInputElement> = (e) => {
    const target = e.currentTarget as HTMLElement
    if ((e.target as HTMLElement).dataset.feature != undefined) return
    this.setState({
      selectedElement: {
        id: target.dataset.id,
        position: parseFloat(target.dataset.position ?? '0'),
      },
    })
  }

  dragHandler = (
    id: string | undefined,
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

  dropOutsideHandler = (e: React.DragEvent<HTMLLIElement>) => {
    const target = e.target,
      parent: ParentNode =
        (target as HTMLElement).parentNode ?? (target as HTMLElement),
      scrollY: number = (parent.parentNode?.parentNode as HTMLElement)
        .scrollTop,
      parentRefTop: number = (parent as HTMLElement).offsetTop,
      parentRefBottom: number =
        parentRefTop + (parent as HTMLElement).clientHeight

    if (e.pageY + scrollY < parentRefTop) this.orderHandler()
    else if (e.pageY + scrollY > parentRefBottom) this.orderHandler()
  }

  // Render
  render() {
    return (
      <div className="controls__control">
        <div className="control__block control__block--list">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <SectionTitle
                label={locals[this.props.lang].colors.title}
                indicator={this.props.colors.length.toString()}
              />
            </div>
            <div className="section-controls__right-part">
              <Button
                type="icon"
                icon="plus"
                feature="ADD_COLOR"
                action={(e) => this.colorsHandler(e)}
              />
            </div>
          </div>
          {this.props.colors.length == 0 ? (
            <div className="onboarding__callout">
              <Message
                icon="list-tile"
                messages={[locals[this.props.lang].colors.callout.message]}
              />
              <div className="onboarding__actions">
                <Button
                  type="primary"
                  feature="ADD_COLOR"
                  label={locals[this.props.lang].colors.callout.cta}
                  action={(e) => this.colorsHandler(e)}
                />
              </div>
            </div>
          ) : (
            <ul
              className="list"
              ref={this.listRef}
            >
              {this.props.colors.map((color, index) => (
                <ColorItem
                  key={color.id}
                  name={color.name}
                  index={index}
                  hex={
                    chroma(
                      color.rgb.r * 255,
                      color.rgb.g * 255,
                      color.rgb.b * 255
                    ).hex() as HexModel
                  }
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
                  onChangeColors={(e) => this.colorsHandler(e)}
                  onChangeSelection={this.selectionHandler}
                  onCancellationSelection={this.selectionHandler}
                  onDragChange={this.dragHandler}
                  onDropOutside={(e) => this.dropOutsideHandler(e)}
                  onChangeOrder={this.orderHandler}
                />
              ))}
            </ul>
          )}
        </div>
        {this.props.editorType === 'figma' ? (
          <Actions
            context="DEPLOY"
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onSyncLocalStyles={this.props.onSyncLocalStyles}
            onSyncLocalVariables={this.props.onSyncLocalVariables}
            onPublishPalette={this.props.onPublishPalette}
          />
        ) : null}
      </div>
    )
  }
}
