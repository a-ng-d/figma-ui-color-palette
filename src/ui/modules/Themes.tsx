import * as React from 'react'
import type {
  ActionsList,
  DispatchProcess,
  EditorType,
  HexModel,
  HoveredColor,
  Language,
  PresetConfiguration,
  ScaleConfiguration,
  SelectedColor,
  ThemeConfiguration,
  ThemesMessage,
} from '../../utils/types'
import Dispatcher from './Dispatcher'
import Button from '../components/Button'
import Message from '../components/Message'
import ThemeItem from '../components/ThemeItem'
import Actions from './Actions'
import isBlocked from '../../utils/isBlocked'
import doLightnessScale from '../../utils/doLightnessScale'
import { locals } from '../../content/locals'
import { uid } from 'uid'

interface Props {
  preset: PresetConfiguration
  scale: ScaleConfiguration
  themes: Array<ThemeConfiguration>
  actions: string
  planStatus: 'UNPAID' | 'PAID'
  editorType: EditorType
  lang: Language
  onChangeThemes: (themes: Array<ThemeConfiguration>) => void
  onSyncLocalStyles: () => void
  onSyncLocalVariables: () => void
  onChangeActions: (value: string) => void
}

const themesMessage: ThemesMessage = {
  type: 'UPDATE_THEMES',
  data: [],
  isEditedInRealTime: false,
}

export default class Themes extends React.Component<Props, any> {
  dispatch: { [key: string]: DispatchProcess }
  listRef: any

  constructor(props: Props) {
    super(props)
    this.dispatch = {
      themes: new Dispatcher(
        () => parent.postMessage({ pluginMessage: themesMessage }, '*'),
        500
      ) as DispatchProcess,
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

  handleClickOutside = (e: Event) => {
    if (this.listRef.current != null)
      if (this.listRef && !this.listRef.current.contains(e.target))
        this.setState({
          selectedElement: {
            id: '',
            position: null,
          },
        })
  }

  // Handlers
  themesHandler = (e: any) => {
    let id: string | null
    const element: HTMLElement | null = (e.target as HTMLElement).closest(
        '.list__item'
      ),
      currentElement: HTMLInputElement = e.target as HTMLInputElement

    element != null ? (id = element.getAttribute('data-id')) : (id = null)

    themesMessage.isEditedInRealTime = false

    const addTheme = () => {
      themesMessage.data = this.props.themes.map((theme) => {
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
        id: uid(),
        type: 'custom theme',
      })
      this.props.onChangeThemes(themesMessage.data)
      parent.postMessage({ pluginMessage: themesMessage }, '*')
    }

    const renameTheme = () => {
      const hasSameName = this.props.themes.filter(
        (color) => color.name === currentElement.value
      )
      themesMessage.data = this.props.themes.map((item) => {
        if (item.id === id)
          item.name =
            hasSameName.length > 1
              ? currentElement.value + ' 2'
              : currentElement.value
        return item
      })
      this.props.onChangeThemes(themesMessage.data)
      if (e._reactName === 'onBlur')
        parent.postMessage({ pluginMessage: themesMessage }, '*')
    }

    const updatePaletteBackgroundColor = () => {
      const code: HexModel =
        currentElement.value.indexOf('#') == -1
          ? '#' + currentElement.value
          : currentElement.value
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(code)) {
        themesMessage.data = this.props.themes.map((item) => {
          if (item.id === id) item.paletteBackground = code
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
        if (item.id === id) item.description = currentElement.value
        return item
      })
      this.props.onChangeThemes(themesMessage.data)
      if (e._reactName === 'onBlur' || e.key === 'Enter')
        parent.postMessage({ pluginMessage: themesMessage }, '*')
    }

    const removeTheme = () => {
      themesMessage.data = this.props.themes.filter((item) => item.id != id)
      if (themesMessage.data.length > 1)
        themesMessage.data.filter(
          (item) => item.type === 'custom theme'
        )[0].isEnabled = true
      else {
        const result = themesMessage.data.find(
          (item) => item.type === 'default theme'
        )
        if (result != undefined) result.isEnabled = true
      }
      this.props.onChangeThemes(themesMessage.data)
      parent.postMessage({ pluginMessage: themesMessage }, '*')
    }

    const actions: ActionsList = {
      ADD_THEME: () => addTheme(),
      RENAME_THEME: () => renameTheme(),
      UPDATE_PALETTE_BACKGROUND: () => updatePaletteBackgroundColor(),
      UPDATE_DESCRIPTION: () => updateThemeDescription(),
      REMOVE_THEME: () => removeTheme(),
      NULL: () => null,
    }

    return actions[currentElement.dataset.feature ?? 'NULL']?.()
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

  selectionHandler = (e: any) => {
    const target = e.currentTarget
    if (e.target.dataset.feature === 'DISPLAY_MORE') return
    this.setState({
      selectedElement: {
        id: target.dataset.id,
        position: target.dataset.position,
      },
    })
  }

  dragHandler = (
    id: string | undefined,
    hasGuideAbove: boolean,
    hasGuideBelow: boolean,
    position: number | string
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

  // Direct actions
  onAddTheme = () => {
    themesMessage.data = this.props.themes.map((theme) => {
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
      id: uid(),
      type: 'custom theme',
    })
    this.props.onChangeThemes(themesMessage.data)
    parent.postMessage({ pluginMessage: themesMessage }, '*')
  }

  render() {
    return (
      <div className="controls__control">
        <div className="control__block control__block--list">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className="section-title">
                {locals[this.props.lang].themes.title}
                <div className="type">{`(${
                  this.props.themes.length - 1
                })`}</div>
              </div>
            </div>
            <div className="section-controls__right-part">
              <Button
                type="icon"
                icon="plus"
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
                  type="primary"
                  feature="ADD_THEME"
                  label={locals[this.props.lang].themes.callout.cta}
                  state={
                    isBlocked('THEMES', this.props.planStatus)
                      ? 'disabled'
                      : 'default'
                  }
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
            <ul
              className="list"
              ref={this.listRef}
            >
              {this.props.themes.map((theme, index) => {
                if (theme.type != 'default theme')
                  return (
                    <ThemeItem
                      key={theme.id}
                      name={theme.name}
                      description={theme.description}
                      index={index}
                      paletteBackground={theme.paletteBackground}
                      uuid={theme.id}
                      selected={
                        this.state['selectedElement'].id === theme.id
                          ? true
                          : false
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
                      onChangeThemes={(e) => this.themesHandler(e)}
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
            actions={this.props.actions}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onSyncLocalStyles={this.props.onSyncLocalStyles}
            onSyncLocalVariables={this.props.onSyncLocalVariables}
            onChangeActions={this.props.onChangeActions}
          />
        ) : null}
      </div>
    )
  }
}
