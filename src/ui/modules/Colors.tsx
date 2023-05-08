import * as React from 'react'
import type { HoveredColor, SelectedColor, ColorConfiguration } from '../../utils/types'
import Button from '../components/Button'
import ColorItem from '../components/ColorItem'
import chroma from 'chroma-js'

interface Props {
  colors: Array<ColorConfiguration>
  selectedElement: SelectedColor
  hoveredElement: HoveredColor
  onColorChange: React.ChangeEventHandler
  onAddColor: React.MouseEventHandler
  onSelectionChange: React.ChangeEventHandler
  onDragChange: (id: string, hasGuideAbove: boolean, hasGuideBelow: boolean, position: number) => void
  onDropOutside: React.ChangeEventHandler
  onOrderChange: React.ChangeEventHandler
}

export default class Colors extends React.Component<Props> {
  render() {
    return (
      <div className="source-colors controls__control">
        <div className="section-controls">
          <div className="section-title">Source colors</div>
          <Button
            icon="plus"
            type="icon"
            feature="add"
            action={this.props.onAddColor}
          />
        </div>
        <ul className="colors">
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
              onColorChange={this.props.onColorChange}
              onSelectionChange={this.props.onSelectionChange}
              onSelectionCancellation={this.props.onSelectionChange}
              onDragChange={this.props.onDragChange}
              onDropOutside={this.props.onDropOutside}
              onOrderChange={this.props.onOrderChange}
            />
          ))}
        </ul>
      </div>
    )
  }
}
