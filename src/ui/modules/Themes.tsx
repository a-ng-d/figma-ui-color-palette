import * as React from 'react'
import chroma from 'chroma-js'
import type {
  ActionsList,
  HoveredColor,
  ScaleConfiguration,
  SelectedColor,
  ThemeConfiguration,
  ThemesMessage
} from '../../utils/types'
import Button from '../components/Button'
import Message from '../components/Message'
import ThemeItem from '../components/ThemeItem'
import Actions from './Actions'
import { locals } from '../../content/locals'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  selectedElement: SelectedColor
  hoveredElement: HoveredColor
  scale: ScaleConfiguration
  themes: Array<ThemeConfiguration>
  view: string
  editorType: string
  planStatus: string
  lang: string
  onChangeTheme: (themes: Array<ThemeConfiguration>) => void
  onChangeSelection: React.MouseEventHandler<HTMLLIElement> & React.ChangeEventHandler
  onDragChange: (
    id: string,
    hasGuideAbove: boolean,
    hasGuideBelow: boolean,
    position: number
  ) => void
  onDropOutside: React.ChangeEventHandler
  onChangeOrder: React.ChangeEventHandler
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
      this.props.onChangeTheme(themeMessage.data)
      parent.postMessage({ pluginMessage: themeMessage }, '*')
    }

    const removeTheme = () => {
      themeMessage.data = this.props.themes.filter((item) => item.id != id)
      this.props.onChangeTheme(themeMessage.data)
      parent.postMessage({ pluginMessage: themeMessage }, '*')
    }

    const actions: ActionsList = {
      ADD_THEME: () => addTheme(),
      REMOVE_THEME: () => removeTheme()
    }

    return actions[e.target.dataset.feature]?.()  
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
            <ul className="list">
              {this.props.themes.map((theme, index) => (
                <ThemeItem
                  key={theme.id}
                  name={theme.name}
                  description={theme.description}
                  index={index}
                  paletteBackground={theme.paletteBackground}
                  uuid={theme.id}
                  selected={
                    this.props.selectedElement.id === theme.id ? true : false
                  }
                  guideAbove={
                    this.props.hoveredElement.id === theme.id
                      ? this.props.hoveredElement.hasGuideAbove
                      : false
                  }
                  guideBelow={
                    this.props.hoveredElement.id === theme.id
                      ? this.props.hoveredElement.hasGuideBelow
                      : false
                  }
                  lang={this.props.lang}
                  onChangeTheme={this.themeHandler}
                  onChangeSelection={this.props.onChangeSelection}
                  onCancellationSelection={this.props.onChangeSelection}
                  onDragChange={this.props.onDragChange}
                  onDropOutside={this.props.onDropOutside}
                  onChangeOrder={this.props.onChangeOrder}
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
