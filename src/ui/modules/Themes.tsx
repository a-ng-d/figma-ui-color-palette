import * as React from 'react'
import type {
  ActionsList,
  DispatchProcess,
  HoveredColor,
  PresetConfiguration,
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
import isBlocked from '../../utils/isBlocked'
import doMap from '../../utils/doMap'
import doLightnessScale from '../../utils/doLightnessScale'

interface Props {
  preset: PresetConfiguration
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

const themesMessage: ThemesMessage = {
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
        () => parent.postMessage({ pluginMessage: themesMessage }, '*'),
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
    if (this.listRef.current != null)
      if (
        (this.listRef &&
        !this.listRef.current.contains(e.target))
      )
        this.setState({
          selectedElement: {
            id: '',
            position: null,
          },
        })
  }

  // Handlers
  themesHandler = (e) => {
    let id: string
    const element: HTMLElement | null = e.target.closest('.list__item')

    element != null ? (id = element.getAttribute('data-id')) : null

    themesMessage.isEditedInRealTime = false

    const addTheme = () => {
      themesMessage.data = this.props.themes.map(theme => {
        theme.isEnabled = false
        return theme
      })
      const hasAlreadyNewUITheme = themesMessage.data.filter((color) =>
        color.name.includes('New UI Theme')
      )
      themesMessage.data.push({
        name: `New UI Theme ${hasAlreadyNewUITheme.length + 1}`,
        description: '',
        scale: doLightnessScale(
          this.props.preset.scale,
          this.props.preset.min == undefined ? 10 : this.props.preset.min,
          this.props.preset.max == undefined ? 90 : this.props.preset.max
        ),
        paletteBackground: '#FFFFFF',
        isEnabled: true,
        id: uuidv4(),
      })
      this.props.onChangeThemes(themesMessage.data)
      parent.postMessage({ pluginMessage: themesMessage }, '*')
    }

    const renameTheme = () => {
      const hasSameName = this.props.themes.filter(
        (color) => color.name === e.target.value
      )
      themesMessage.data = this.props.themes.map((item) => {
        if (item.id === id)
          item.name =
            hasSameName.length > 1 ? e.target.value + ' 2' : e.target.value
        return item
      })
      this.props.onChangeThemes(themesMessage.data)
      if (e._reactName === 'onBlur')
        parent.postMessage({ pluginMessage: themesMessage }, '*')
      if (e.key === 'Enter')
        parent.postMessage({ pluginMessage: themesMessage }, '*')
    }

    const updatePaletteBackgroundColor = () => {
      const code: string =
        e.target.value.indexOf('#') == -1
          ? '#' + e.target.value
          : e.target.value
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
        themesMessage.data = this.props.themes.map((item) => {
          if (item.id === id)
            item.paletteBackground = code
          return item
        })
        this.props.onChangeThemes(themesMessage.data)
      }
      if (e._reactName === 'onBlur') {
        this.dispatch.themes.on.status = false
        parent.postMessage({ pluginMessage: themesMessage }, '*')
      } else {
        themesMessage.isEditedInRealTime = true
        this.dispatch.themes.on.status = true
      }
    }

    const updateThemeDescription = () => {
      themesMessage.data = this.props.themes.map((item) => {
        if (item.id === id) item.description = e.target.value
        return item
      })
      this.props.onChangeThemes(themesMessage.data)
      if (e._reactName === 'onBlur')
        parent.postMessage({ pluginMessage: themesMessage }, '*')
      if (e.key === 'Enter')
        parent.postMessage({ pluginMessage: themesMessage }, '*')
    }

    const removeTheme = () => {
      themesMessage.data = this.props.themes.filter((item) => item.id != id)
      if (this.props.themes.find(theme => theme.id === id).isEnabled)
        themesMessage.data.find(theme => theme.id === '00000000-0000-0000-0000-000000000000').isEnabled = true
      this.props.onChangeThemes(themesMessage.data)
      parent.postMessage({ pluginMessage: themesMessage }, '*')
    }

    const actions: ActionsList = {
      ADD_THEME: () => addTheme(),
      RENAME_THEME: () => renameTheme(),
      UPDATE_PALETTE_BACKGROUND: () => updatePaletteBackgroundColor(),
      UPDATE_DESCRIPTION: () => updateThemeDescription(),
      REMOVE_THEME: () => removeTheme(),
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
    return (
      <>
        <div className="list-controller controls__control">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className="section-title">
                {locals[this.props.lang].themes.title}
              </div>
              <div className="type">{`(${this.props.themes.length - 1})`}</div>
            </div>
            <div className="section-controls__right-part">
              <Button
                icon="plus"
                type="icon"
                state={
                  isBlocked('THEMES', this.props.planStatus) ? 'disabled' : ''
                }
                feature="ADD_THEME"
                action={
                  isBlocked('THEMES', this.props.planStatus)
                    ? () => null
                    : this.themesHandler
                }
              />
            </div>
          </div>
          {this.props.themes.length == 1 ? (
            <div className="onboarding__callout">
              <Message
                icon="theme"
                messages={[locals[this.props.lang].themes.callout.message]}
              />
              <div className="onboarding__actions">
                <Button
                  type='primary'
                  feature="ADD_THEME"
                  label={locals[this.props.lang].themes.callout.cta}
                  isBlocked={isBlocked('THEMES', this.props.planStatus)}
                  action={
                    isBlocked('THEMES', this.props.planStatus)
                      ? () => null
                      : this.themesHandler
                  }
                />
              </div>
            </div>
          ) : (
            <ul className="list" ref={this.listRef}>
              {this.props.themes.map((theme, index) => {
                if (theme.id != '00000000-0000-0000-0000-000000000000')
                  return (
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
                      onChangeThemes={this.themesHandler}
                      onChangeSelection={this.selectionHandler}
                      onCancellationSelection={this.selectionHandler}
                      onDragChange={this.dragHandler}
                      onDropOutside={this.dropOutsideHandler}
                      onChangeOrder={this.orderHandler}
                    />
                  )
              })}
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
