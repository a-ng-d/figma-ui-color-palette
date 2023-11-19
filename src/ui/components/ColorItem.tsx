import * as React from 'react'
import chroma from 'chroma-js'
import type { HexModel, Language } from '../../utils/types'
import Feature from './Feature'
import Input from './Input'
import Button from './Button'
import FormItem from './FormItem'
import doMap from './../../utils/doMap'
import features from '../../utils/config'
import { locals } from '../../content/locals'

interface Props {
  name: string
  hex: HexModel
  oklch: boolean
  shift: number
  description: string
  uuid: string
  index: number
  selected: boolean
  guideAbove: boolean
  guideBelow: boolean
  lang: Language
  onChangeColors: React.KeyboardEventHandler<
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

export default class ColorItem extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isDragged: false,
      hasMoreOptions: false,
    }
  }

  // Handlers
  optionsHandler = () => {
    this.props.onCancellationSelection
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
        target?.dataset.position ?? 0
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
        data-color={this.props.name.split(' ').join('-').toLowerCase()}
        data-position={this.props.index}
        className={[
          'list__item',
          this.state['isDragged'] ? 'list__item--dragged' : null,
          this.props.guideAbove ? 'list__item--above' : null,
          this.props.guideBelow ? 'list__item--below' : null,
          this.state['hasMoreOptions'] ? 'list__item--emphasis' : null,
        ]
          .filter((n) => n)
          .join(' ')}
        draggable={this.props.selected}
        onMouseDown={this.props.onChangeSelection}
        onDragStart={(e) => this.onDragStart(e)}
        onDragEnd={(e) => this.onDragEnd(e)}
        onDragOver={(e) => this.onDragOver(e)}
        onDrop={(e) => this.onDrop(e)}
      >
        <div className="list__item__primary">
          <div className="list__item__left-part">
            <Feature
              isActive={
                features.find((feature) => feature.name === 'COLORS_NAME')
                  ?.isActive
              }
            >
              <div className="list__item__param--compact">
                <Input
                  type="TEXT"
                  value={this.props.name}
                  charactersLimit={24}
                  feature="RENAME_COLOR"
                  onChange={this.props.onChangeColors}
                  onFocus={this.props.onCancellationSelection}
                  onBlur={this.props.onChangeColors}
                  onConfirm={this.props.onChangeColors}
                />
              </div>
            </Feature>
            <Feature
              isActive={
                features.find((feature) => feature.name === 'COLORS_PARAMS')
                  ?.isActive
              }
            >
              <>
                <div className="list__item__param--compact">
                  <Input
                    type="COLOR"
                    value={this.props.hex}
                    feature="UPDATE_HEX"
                    onChange={this.props.onChangeColors}
                    onFocus={this.props.onCancellationSelection}
                    onBlur={this.props.onChangeColors}
                  />
                </div>
                <div className="list__item__param inputs">
                  <div className="label">
                    {locals[this.props.lang].colors.lch.label}
                  </div>
                  <div className="inputs__bar">
                    <Input
                      type="NUMBER"
                      value={chroma(this.props.hex).lch()[0].toFixed(0)}
                      min="0"
                      max="100"
                      feature="UPDATE_LIGHTNESS"
                      onChange={this.props.onChangeColors}
                      onFocus={this.props.onCancellationSelection}
                      onBlur={this.props.onChangeColors}
                    />
                    <Input
                      type="NUMBER"
                      value={chroma(this.props.hex).lch()[1].toFixed(0)}
                      min="0"
                      max="100"
                      feature="UPDATE_CHROMA"
                      onChange={this.props.onChangeColors}
                      onFocus={this.props.onCancellationSelection}
                      onBlur={this.props.onChangeColors}
                    />
                    <Input
                      type="NUMBER"
                      value={
                        chroma(this.props.hex).lch()[2].toFixed(0) == 'NaN'
                          ? '0'
                          : chroma(this.props.hex).lch()[2].toFixed(0)
                      }
                      min="0"
                      max="360"
                      feature="UPDATE_HUE"
                      onChange={this.props.onChangeColors}
                      onFocus={this.props.onCancellationSelection}
                      onBlur={this.props.onChangeColors}
                    />
                  </div>
                </div>
              </>
            </Feature>
          </div>
          <div className="list__item__right-part">
            <Feature
              isActive={
                features.find(
                  (feature) => feature.name === 'COLORS_HUE_SHIFTING'
                )?.isActive ||
                features.find(
                  (feature) => feature.name === 'COLORS_DESCRIPTION'
                )?.isActive
              }
            >
              <Button
                type="icon"
                icon="ellipsis"
                state={this.state['hasMoreOptions'] ? 'selected' : ''}
                feature="DISPLAY_MORE"
                action={this.optionsHandler}
              />
            </Feature>
            <Button
              type="icon"
              icon="minus"
              feature="REMOVE_COLOR"
              action={this.props.onChangeColors}
            />
          </div>
        </div>
        {this.state['hasMoreOptions'] ? (
          <div className="list__item__secondary">
            <Feature
              isActive={
                features.find(
                  (feature) => feature.name === 'COLORS_HUE_SHIFTING'
                )?.isActive
              }
            >
              <div className="list__item__param">
                <FormItem
                  id="color-description"
                  label={locals[this.props.lang].colors.hueShifting.label}
                >
                  <Input
                    type="NUMBER"
                    icon={{ type: 'ICON', value: 'arrow-left-right' }}
                    value={this.props.shift.toString()}
                    min="-360"
                    max="360"
                    feature="SHIFT_HUE"
                    onChange={this.props.onChangeColors}
                    onFocus={this.props.onCancellationSelection}
                    onBlur={this.props.onChangeColors}
                  />
                </FormItem>
              </div>
            </Feature>
            <Feature
              isActive={
                features.find(
                  (feature) => feature.name === 'COLORS_DESCRIPTION'
                )?.isActive
              }
            >
              <div className="list__item__param">
                <FormItem
                  id="color-description"
                  label={locals[this.props.lang].global.description.label}
                >
                  <Input
                    id="color-description"
                    type="LONG_TEXT"
                    value={this.props.description}
                    placeholder={
                      locals[this.props.lang].global.description.placeholder
                    }
                    feature="UPDATE_DESCRIPTION"
                    onChange={this.props.onChangeColors}
                    onFocus={this.props.onCancellationSelection}
                    onBlur={this.props.onChangeColors}
                    onConfirm={this.props.onChangeColors}
                  />
                </FormItem>
              </div>
            </Feature>
          </div>
        ) : null}
      </li>
    )
  }
}
