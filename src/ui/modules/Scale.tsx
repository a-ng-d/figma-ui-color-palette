import * as React from 'react'
import type { PresetConfiguration, ScaleConfiguration } from '../../utils/types'
import Feature from '../components/Feature'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import Slider from '../components/Slider'
import Message from '../components/Message'
import Actions from './Actions'
import Shortcuts from './Shortcuts'
import { palette, presets } from '../../utils/palettePackage'
import features from '../../utils/features'
import { locals } from '../../content/locals'

interface Props {
  hasPreset: boolean
  preset: PresetConfiguration
  scale?: ScaleConfiguration
  view: string
  planStatus: string
  editorType?: string
  lang: string
  onChangePreset?: React.ReactEventHandler
  onChangeScale: (e: string) => void
  onAddStop?: React.ReactEventHandler
  onRemoveStop?: React.ReactEventHandler
  onChangeView: React.ChangeEventHandler
  onCreatePalette?: () => void
  onCreateLocalStyles?: () => void
  onUpdateLocalStyles?: () => void
  onReopenHighlight: React.ChangeEventHandler
}

export default class Scale extends React.Component<Props> {
  // Direct actions
  setOnboardingMessages = () => {
    const messages: Array<string> = []

    if (this.props.preset.name === 'Custom' && !this.props.hasPreset)
      messages.push(locals[this.props.lang].scale.add, locals[this.props.lang].scale.remove)

    if (!this.props.hasPreset)
      messages.push(
        locals[this.props.lang].scale.edit,
        locals[this.props.lang].scale.nav,
        locals[this.props.lang].scale.esc
      )

    messages.push(locals[this.props.lang].scale.shift, locals[this.props.lang].scale.ctrl)

    return messages
  }

  // Templates
  Shortcuts = () => {
    return (
      <Feature
        isActive={
          features.find((feature) => feature.name === 'SHORTCUTS').isActive
        }
      >
        <Shortcuts
          actions={[
            {
              label: locals[this.props.lang].shortcuts.documentation,
              isLink: true,
              url: 'https://docs.ui-color-palette.com',
              action: null,
            },
            {
              label: locals[this.props.lang].shortcuts.feedback,
              isLink: true,
              url: 'https://uicp.link/feedback',
              action: null,
            },
            {
              label: locals[this.props.lang].shortcuts.news,
              isLink: false,
              url: '',
              action: this.props.onReopenHighlight,
            },
          ]}
          planStatus={this.props.planStatus}
          lang={this.props.lang}
        />
      </Feature>
    )
  }

  Create = () => {
    palette.scale = {}
    return (
      <>
        <div className="lightness-scale controls__control">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className="section-title">{locals[this.props.lang].scale.title}</div>
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'SCALE_PRESETS')
                    .isActive
                }
              >
                <Dropdown
                  id="presets"
                  options={Object.entries(presets).map((entry, index) => {
                    return {
                      label: entry[1].name,
                      value: entry[1].id,
                      position: index,
                      isActive: true,
                      isBlocked: false,
                    }
                  })}
                  selected={this.props.preset.id}
                  feature="UPDATE_PRESET"
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
                    feature="REMOVE"
                    action={this.props.onRemoveStop}
                  />
                ) : null}
                {this.props.preset.name === 'Custom' ? (
                  <Button
                    icon="plus"
                    type="icon"
                    state={
                      this.props.preset.scale.length == 24 ? 'disabled' : ''
                    }
                    feature="ADD"
                    action={this.props.onAddStop}
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
              stops={this.props.preset.scale}
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
        <Actions
          context="CREATE"
          view={this.props.view}
          planStatus={this.props.planStatus}
          lang={this.props.lang}
          onCreatePalette={this.props.onCreatePalette}
          onChangeView={this.props.onChangeView}
        />
        <this.Shortcuts />
      </>
    )
  }

  Edit = () => {
    palette.scale = {}
    return (
      <>
        <div className="lightness-scale controls__control">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className="section-title">{locals[this.props.lang].scale.title}</div>
              <div className="type">{`(${Object.entries(this.props.scale).length})`}</div>
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
              stops={this.props.preset.scale}
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
        <Actions
          context="EDIT"
          view={this.props.view}
          editorType={this.props.editorType}
          planStatus={this.props.planStatus}
          lang={this.props.lang}
          onCreateLocalStyles={this.props.onCreateLocalStyles}
          onUpdateLocalStyles={this.props.onUpdateLocalStyles}
          onChangeView={this.props.onChangeView}
        />
        <this.Shortcuts />
      </>
    )
  }

  // Render
  render() {
    return <>{!this.props.hasPreset ? <this.Edit /> : <this.Create />}</>
  }
}
