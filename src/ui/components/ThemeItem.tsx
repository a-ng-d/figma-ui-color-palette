import * as React from 'react'
import { HexModel, Language } from '../../utils/types'
import Feature from './Feature'
import Input from './Input'
import Button from './Button'
import FormItem from './FormItem'
import doMap from '../../utils/doMap'
import features from '../../utils/features'
import { locals } from '../../content/locals'

interface Props {
  name: string
  description: string
  paletteBackground: HexModel
  uuid: string
  index: number
  selected: boolean
  guideAbove: boolean
  guideBelow: boolean
  lang: Language
  onChangeThemes: React.KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > &
    React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> &
    React.MouseEventHandler
  onChangeSelection: React.MouseEventHandler<HTMLLIElement>
  onCancellationSelection: React.MouseEventHandler<Element> &
    React.FocusEventHandler<HTMLInputElement>
  onDragChange: (
    id: string | undefined,
    hasGuideAbove: boolean,
    hasGuideBelow: boolean,
    position: number | string
  ) => void
  onDropOutside: (e: React.DragEvent<HTMLLIElement>) => void
  onChangeOrder: (e: React.DragEvent<HTMLLIElement>) => void
}

export default class ThemeItem extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isDragged: false,
      hasMoreOptions: false,
    }
  }

  // Handlers
  optionsHandler = (e: React.MouseEvent<Element, MouseEvent>) => {
    this.props.onCancellationSelection(e)
    this.setState({ hasMoreOptions: !this.state['hasMoreOptions'] })
  }

  // Direct actions
  onDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    this.setState({ isDragged: true })
    const clone = e.currentTarget.cloneNode(true)
    ;(clone as HTMLElement).style.opacity = '0'
    ;(clone as HTMLElement).id = 'ghost'
    document.body.appendChild(clone)
    e.dataTransfer.setDragImage(clone as Element, 0, 0)
    e.dataTransfer.effectAllowed = 'move'
    document.querySelector('#react-page')?.classList.add('dragged-ghost')
  }

  onDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    this.setState({ isDragged: false })
    this.props.onDragChange('', false, false, 0)
    this.props.onDropOutside(e)
    document.querySelector('#react-page')?.classList.remove('dragged-ghost')
    document.querySelector('#ghost')?.remove()
  }

  onDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault()
    const target = e.currentTarget,
      height: number = target.clientHeight,
      parentY: number = (target.parentNode as HTMLElement).offsetTop,
      scrollY: number = (target.parentNode as HTMLElement).scrollTop,
      refTop: number = target.offsetTop - parentY,
      refBottom: number = refTop + height,
      y: number = e.pageY - parentY + scrollY,
      refY: number = doMap(y, refTop, refBottom, 0, height)

    if (refY >= -1 && refY <= height / 2)
      this.props.onDragChange(
        target.dataset.id,
        true,
        false,
        target.dataset.position ?? 0
      )
    else if (refY > height / 2 && refY <= height)
      this.props.onDragChange(
        target.dataset.id,
        false,
        true,
        target.dataset.position ?? 0
      )
  }

  onDrop = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault()
    this.props.onChangeOrder(e)
  }

  // Render
  render() {
    return (
      <li
        id={this.props.name.split(' ').join('-').toLowerCase()}
        data-id={this.props.uuid}
        data-theme={this.props.name.split(' ').join('-').toLowerCase()}
        data-position={this.props.index}
        className={`list__item${
          this.state['isDragged'] ? ' list__item--dragged' : ''
        }${this.props.guideAbove ? ' list__item--above' : ''}${
          this.props.guideBelow ? ' list__item--below' : ''
        }${this.state['hasMoreOptions'] ? ' list__item--emphasis' : ''}`}
        draggable={this.props.selected}
        onMouseDown={this.props.onChangeSelection}
        onDragStart={(e) => this.onDragStart(e)}
        onDragEnd={(e) => this.onDragEnd(e)}
        onDragOver={(e) => this.onDragOver(e)}
        onDrop={(e) => this.onDrop(e)}
      >
        <Feature
          isActive={
            features.find((feature) => feature.name === 'THEMES_NAME')?.isActive
          }
        >
          <div className="themes__name">
            <Input
              type="TEXT"
              value={this.props.name}
              feature="RENAME_THEME"
              charactersLimit={24}
              onChange={this.props.onChangeThemes}
              onFocus={this.props.onCancellationSelection}
              onBlur={this.props.onChangeThemes}
              onConfirm={this.props.onChangeThemes}
            />
          </div>
        </Feature>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'THEMES_PARAMS')
              ?.isActive
          }
        >
          <div className="themes__palette-background-color">
            <FormItem
              id="palette-background-color"
              label={
                locals[this.props.lang].themes.paletteBackgroundColor.label
              }
              shouldFill={false}
            >
              <Input
                type="COLOR"
                value={this.props.paletteBackground}
                feature="UPDATE_PALETTE_BACKGROUND"
                onChange={this.props.onChangeThemes}
                onFocus={this.props.onCancellationSelection}
                onBlur={this.props.onChangeThemes}
              />
            </FormItem>
          </div>
        </Feature>
        <div className="list__item__buttons">
          <Feature
            isActive={
              features.find((feature) => feature.name === 'THEMES_DESCRIPTION')
                ?.isActive
            }
          >
            <Button
              type="icon"
              icon="ellipsis"
              state={this.state['hasMoreOptions'] ? 'selected' : ''}
              feature="DISPLAY_MORE"
              action={(e) => this.optionsHandler(e)}
            />
          </Feature>
          <Button
            type="icon"
            icon="minus"
            feature="REMOVE_THEME"
            action={this.props.onChangeThemes}
          />
        </div>
        {this.state['hasMoreOptions'] ? (
          <>
            <Feature
              isActive={
                features.find(
                  (feature) => feature.name === 'THEMES_DESCRIPTION'
                )?.isActive
              }
            >
              <div className="themes__description">
                <FormItem
                  id="theme-description"
                  label={locals[this.props.lang].global.description.label}
                  shouldFill={false}
                >
                  <Input
                    id="theme-description"
                    type="LONG_TEXT"
                    value={this.props.description}
                    placeholder={
                      locals[this.props.lang].global.description.placeholder
                    }
                    isSansFont={true}
                    feature="UPDATE_DESCRIPTION"
                    onChange={this.props.onChangeThemes}
                    onFocus={this.props.onCancellationSelection}
                    onBlur={this.props.onChangeThemes}
                    onConfirm={this.props.onChangeThemes}
                  />
                </FormItem>
              </div>
            </Feature>
          </>
        ) : null}
      </li>
    )
  }
}
