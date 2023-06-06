import * as React from 'react'
import type { PresetConfiguration } from '../../utils/types'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import Slider from '../components/Slider'
import Message from '../components/Message'
import Feature from '../components/Feature'
import { palette, presets } from '../../utils/palettePackage'
import { features } from '../../utils/features'

interface Props {
  hasPreset: boolean
  preset: PresetConfiguration
  scale?: { [key: string]: string }
  onChangePreset?: React.ReactEventHandler
  onChangeScale: (e: string) => void
  onAddScale?: React.ReactEventHandler
  onRemoveScale?: React.ReactEventHandler
}

export default class Scale extends React.Component<Props> {
  // Direct actions
  setOnboardingMessages = () => {
    const messages: Array<string> = []

    if (this.props.preset.name === 'Custom' && !this.props.hasPreset)
      messages.push(
        'Click on the slider range to add a stop',
        'Press Backspace ⌫ after selecting a stop to remove it'
      )

    if (!this.props.hasPreset)
      messages.push(
        'Press ← or → to shift the stops with accuracy',
        'Press Esc. after selecting a stop to unselect it'
      )

    messages.push(
      "Hold Shift ⇧ while dragging the first or the last stop to distribute stops' horizontal spacing",
      'Hold Ctrl ⌃ or Cmd ⌘ while dragging a stop to move them all'
    )

    return messages
  }

  // Templates
  Create = () => {
    palette.scale = {}
    return (
      <div className="lightness-scale controls__control">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <div className="section-title">Lightness scale</div>
            <Feature
              isActive={
                features.find((feature) => feature.name === 'SCALE_PRESETS')
                  .isActive
              }
            >
              <Dropdown
                id="presets"
                options={Object.entries(presets).map((entry) => {
                  return {
                      label: entry[1].name,
                      value: entry[1].name,
                      isActive: true,
                      isBlocked: false
                    }
                })}
                selected={this.props.preset.name}
                onChange={this.props.onChangePreset}
              />
            </Feature>
          </div>
          <div className="section-controls__right-part">
            <Feature
              isActive={
                features.find((feature) => feature.name === 'SCALE_PRESETS')
                  .isActive
              }
            >
              {this.props.preset.scale.length > 2 &&
              this.props.preset.name === 'Custom' ? (
                <Button
                  icon="minus"
                  type="icon"
                  feature="remove"
                  action={this.props.onRemoveScale}
                />
              ) : null}
              {this.props.preset.name === 'Custom' ? (
                <Button
                  icon="plus"
                  type="icon"
                  state={this.props.preset.scale.length == 24 ? 'disabled' : ''}
                  feature="add"
                  action={this.props.onAddScale}
                />
              ) : null}
            </Feature>
          </div>
        </div>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SCALE_CONFIGURATION')
              .isActive
          }
        >
          <Slider
            type="EQUAL"
            hasPreset={this.props.hasPreset}
            presetName={this.props.preset.name}
            knobs={this.props.preset.scale}
            min={this.props.preset.min}
            max={this.props.preset.max}
            onChange={this.props.onChangeScale}
          />
        </Feature>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SCALE_TIPS').isActive
          }
        >
          <Message
            icon="library"
            messages={this.setOnboardingMessages()}
          />
        </Feature>
      </div>
    )
  }

  Edit = () => {
    palette.scale = {}
    return (
      <div className="lightness-scale controls__control">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <div className="section-title">Lightness scale</div>
          </div>
          <div className="section-controls__right-part">
            <div className="label">{this.props.preset.name}</div>
          </div>
        </div>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SCALE_CONFIGURATION')
              .isActive
          }
        >
          <Slider
            type="CUSTOM"
            hasPreset={this.props.hasPreset}
            presetName={this.props.preset.name}
            knobs={this.props.preset.scale}
            scale={this.props.scale}
            onChange={this.props.onChangeScale}
          />
        </Feature>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SCALE_TIPS').isActive
          }
        >
          <Message
            icon="library"
            messages={this.setOnboardingMessages()}
          />
        </Feature>
      </div>
    )
  }

  // Render
  render() {
    return <>{!this.props.hasPreset ? <this.Edit /> : <this.Create />}</>
  }
}
