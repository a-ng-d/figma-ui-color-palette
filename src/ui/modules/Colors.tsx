import * as React from 'react'
import chroma from 'chroma-js'
import type {
  HoveredColor,
  SelectedColor,
  ColorConfiguration,
} from '../../utils/types'
import Feature from '../components/Feature'
import Button from '../components/Button'
import ColorItem from '../components/ColorItem'
import Actions from './Actions'
import Shortcuts from './Shortcuts'
import features from '../../utils/features'
import { locals } from '../../content/locals'

interface Props {
  colors: Array<ColorConfiguration>
  selectedElement: SelectedColor
  hoveredElement: HoveredColor
  view: string
  editorType: string
  planStatus: string
  onChangeColor: React.ChangeEventHandler
  onAddColor: React.MouseEventHandler
  onChangeSelection: React.ChangeEventHandler
  onDragChange: (
    id: string,
    hasGuideAbove: boolean,
    hasGuideBelow: boolean,
    position: number
  ) => void
  onDropOutside: React.ChangeEventHandler
  onChangeOrder: React.ChangeEventHandler
  ononCreateLocalStyles: () => void
  ononUpdateLocalStyles: () => void
  onChangeView: React.ChangeEventHandler
  onReopenHighlight: React.ChangeEventHandler
}

export default class Colors extends React.Component<Props> {
  render() {
    return (
      <>
        <div className="source-colors controls__control">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className="section-title">{locals.en.colors.title}</div>
              <div className="type">{`(${this.props.colors.length})`}</div>
            </div>
            <div className="section-controls__right-part">
              <Button
                icon="plus"
                type="icon"
                feature="ADD"
                action={this.props.onAddColor}
              />
            </div>
          </div>
          <ul className="colors mask">
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
                uuid={color.id}
                selected={
                  this.props.selectedElement.id === color.id ? true : false
                }
                guideAbove={
                  this.props.hoveredElement.id === color.id
                    ? this.props.hoveredElement.hasGuideAbove
                    : false
                }
                guideBelow={
                  this.props.hoveredElement.id === color.id
                    ? this.props.hoveredElement.hasGuideBelow
                    : false
                }
                onChangeColor={this.props.onChangeColor}
                onChangeSelection={this.props.onChangeSelection}
                onCancellationSelection={this.props.onChangeSelection}
                onDragChange={this.props.onDragChange}
                onDropOutside={this.props.onDropOutside}
                onChangeOrder={this.props.onChangeOrder}
              />
            ))}
          </ul>
        </div>
        <Actions
          context="EDIT"
          view={this.props.view}
          editorType={this.props.editorType}
          planStatus={this.props.planStatus}
          ononCreateLocalStyles={this.props.ononCreateLocalStyles}
          ononUpdateLocalStyles={this.props.ononUpdateLocalStyles}
          onChangeView={this.props.onChangeView}
        />
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SHORTCUTS').isActive
          }
        >
          <Shortcuts
            actions={[
              {
                label: locals.en.shortcuts.documentation,
                isLink: true,
                url: 'https://docs.ui-color-palette.com',
                action: null,
              },
              {
                label: locals.en.shortcuts.feedback,
                isLink: true,
                url: 'https://uicp.link/feedback',
                action: null,
              },
              {
                label: locals.en.shortcuts.news,
                isLink: false,
                url: '',
                action: this.props.onReopenHighlight,
              },
            ]}
            planStatus={this.props.planStatus}
          />
        </Feature>
      </>
    )
  }
}
