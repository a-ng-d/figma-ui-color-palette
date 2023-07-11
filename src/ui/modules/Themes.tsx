import * as React from 'react'
import type {
  ActionsList,
  DispatchProcess,
  HoveredColor,
  ScaleConfiguration,
  SelectedColor,
  ThemeConfiguration,
  ThemesMessage
} from '../../utils/types'
import Dispatcher from './Dispatcher'
import Button from '../components/Button'
import Message from '../components/Message'
import ThemeItem from '../components/ThemeItem'
import Actions from './Actions'
import { locals } from '../../content/locals'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  scale: ScaleConfiguration
  themes: Array<ThemeConfiguration>
  view: string
  editorType: string
  planStatus: string
  lang: string
  onChangeThemes: (themes: Array<ThemeConfiguration>) => void
  onCreateLocalStyles: () => void
  onUpdateLocalStyles: () => void
  onCreateLocalVariables: () => void
  onUpdateLocalVariables: () => void
}

const themeMessage: ThemesMessage = {
  type: 'UPDATE_THEMES',
  data: [],
  isEditedInRealTime: false,
}

export default class Themes extends React.Component<Props> {
  dispatch: { [key: string]: DispatchProcess }
  listRef: any

  constructor(props) {
    super(props)
    this.dispatch = {
      themes: new Dispatcher(
        () => parent.postMessage({ pluginMessage: themeMessage }, '*'),
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
  themeHandler = (e) => {
    let id: string
    const element: HTMLElement | null = e.target.closest('.list__item')

    element != null ? (id = element.getAttribute('data-id')) : null

    themeMessage.isEditedInRealTime = false

    const addTheme = () => {
      themeMessage.data = this.props.themes
      const hasAlreadyNewUITheme = themeMessage.data.filter((color) =>
        color.name.includes('New UI Theme')
      )
      themeMessage.data.push({
        name: `New UI Theme ${hasAlreadyNewUITheme.length + 1}`,
        description: '',
        paletteBackground: '#FFFFFF',
        isEnabled: this.props.themes.length == 0 ? true : false,
        scale: this.props.scale,
        id: uuidv4(),
      })
      this.props.onChangeThemes(themeMessage.data)
      parent.postMessage({ pluginMessage: themeMessage }, '*')
    }

    const removeTheme = () => {
      themeMessage.data = this.props.themes.filter((item) => item.id != id)
      this.props.onChangeThemes(themeMessage.data)
      parent.postMessage({ pluginMessage: themeMessage }, '*')
    }

    const actions: ActionsList = {
      ADD_THEME: () => addTheme(),
      REMOVE_THEME: () => removeTheme()
    }

    return actions[e.target.dataset.feature]?.()  
  }

  orderHandler = () => {
    const source: SelectedColor = this.state['selectedElement'],
      target: HoveredColor = this.state['hoveredElement'],
      colors = this.props.themes.map((el) => el)

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
    this.props.onChangeThemes(colors)
    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_THEMES',
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
    console.log(this.props.themes)
    return (
      <>
        <div className="list-controller controls__control">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className="section-title">
                {locals[this.props.lang].themes.title}
              </div>
              <div className="type">{`(${this.props.themes.length})`}</div>
            </div>
            <div className="section-controls__right-part">
              <Button
                icon="plus"
                type="icon"
                feature="ADD_THEME"
                action={this.themeHandler}
              />
            </div>
          </div>
          {this.props.themes.length == 0 ? (
            <div className="onboarding__callout">
              <Message
                icon="theme"
                messages={[locals[this.props.lang].themes.tips.creation]}
              />
              <div className="onboarding__actions">
                <Button
                  type='primary'
                  feature="ADD_THEME"
                  label={locals[this.props.lang].themes.label}
                  action={this.themeHandler}
                />
              </div>
            </div>
          ) : (
            <ul className="list" ref={this.listRef}>
              {this.props.themes.map((theme, index) => (
                <ThemeItem
                  key={theme.id}
                  name={theme.name}
                  description={theme.description}
                  index={index}
                  paletteBackground={theme.paletteBackground}
                  uuid={theme.id}
                  selected={
                    this.state['selectedElement'].id === theme.id ? true : false
                  }
                  guideAbove={
                    this.state['hoveredElement'].id === theme.id
                      ? this.state['hoveredElement'].hasGuideAbove
                      : false
                  }
                  guideBelow={
                    this.state['hoveredElement'].id === theme.id
                      ? this.state['hoveredElement'].hasGuideBelow
                      : false
                  }
                  lang={this.props.lang}
                  onChangeThemes={this.themeHandler}
                  onChangeSelection={this.selectionHandler}
                  onCancellationSelection={this.selectionHandler}
                  onDragChange={this.dragHandler}
                  onDropOutside={this.dropOutsideHandler}
                  onChangeOrder={this.orderHandler}
                />
              ))}
            </ul>
          )}      
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
