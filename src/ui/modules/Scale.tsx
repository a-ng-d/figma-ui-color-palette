import * as React from 'react'
import type {
  ActionsList,
  DispatchProcess,
  Language,
  PresetConfiguration,
  ScaleConfiguration,
} from '../../utils/types'
import Feature from '../components/Feature'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import Slider from '../components/Slider'
import Message from '../components/Message'
import Actions from './Actions'
import { palette, presets } from '../../utils/palettePackage'
import features from '../../utils/config'
import { locals } from '../../content/locals'
import Dispatcher from './Dispatcher'

interface Props {
  hasPreset: boolean
  preset: PresetConfiguration
  scale?: ScaleConfiguration
  actions?: string
  planStatus: 'UNPAID' | 'PAID'
  editorType?: string
  lang: Language
  onChangePreset?: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void
  onChangeScale: () => void
  onChangeStop?: () => void
  onAddStop?: React.ReactEventHandler
  onRemoveStop?: React.ReactEventHandler
  onCreatePalette?: () => void
  onCreateLocalStyles?: () => void
  onUpdateLocalStyles?: () => void
  onCreateLocalVariables?: () => void
  onUpdateLocalVariables?: () => void
  onChangeActions?: (value: string) => void | undefined
}

export default class Scale extends React.Component<Props, any> {
  dispatch: { [key: string]: DispatchProcess }

  constructor(props: Props) {
    super(props)
    this.dispatch = {
      scale: new Dispatcher(
        () =>
          parent.postMessage(
            {
              pluginMessage: {
                type: 'UPDATE_SCALE',
                data: palette,
                isEditedInRealTime: true,
              },
            },
            '*'
          ),
        500
      ) as DispatchProcess,
    }
  }

  // Handlers
  slideHandler = (state: string, feature?: string) => {
    const onReleaseStop = () => {
      this.dispatch.scale.on.status = false
      parent.postMessage(
        {
          pluginMessage: {
            type: 'UPDATE_SCALE',
            data: palette,
            isEditedInRealTime: false,
          },
        },
        '*'
      )
      this.props.onChangeScale()
    }

    const onChangeStop = () => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'UPDATE_SCALE',
            data: palette,
            isEditedInRealTime: false,
            feature: feature,
          },
        },
        '*'
      )
      this.props.onChangeStop?.()
    }

    const onTypeStopValue = () => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'UPDATE_SCALE',
            data: palette,
            isEditedInRealTime: false,
          },
        },
        '*'
      )
      this.props.onChangeStop?.()
    }

    const actions: ActionsList = {
      RELEASED: () => onReleaseStop(),
      SHIFTED: () => onChangeStop(),
      TYPED: () => onTypeStopValue(),
      UPDATING: () => (this.dispatch.scale.on.status = true),
    }

    return actions[state]?.()
  }

  // Direct actions
  setOnboardingMessages = () => {
    const messages: Array<string> = []

    if (this.props.preset.name === 'Custom' && !this.props.hasPreset)
      messages.push(
        locals[this.props.lang].scale.tips.add,
        locals[this.props.lang].scale.tips.remove
      )

    if (!this.props.hasPreset)
      messages.push(
        locals[this.props.lang].scale.tips.edit,
        locals[this.props.lang].scale.tips.nav,
        locals[this.props.lang].scale.tips.esc
      )

    messages.push(
      locals[this.props.lang].scale.tips.shift,
      locals[this.props.lang].scale.tips.ctrl
    )

    return messages
  }

  // Templates
  Create = () => {
    palette.scale = {}
    return (
      <>
        <div className="lightness-scale controls__control">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className="section-title">
                {locals[this.props.lang].scale.title}
              </div>
            </div>
            <div className="section-controls__right-part">
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'SCALE_PRESETS')
                    ?.isActive
                }
              >
                <Dropdown
                  id="switch-presets"
                  options={Object.entries(presets).map((preset, index) => {
                    return {
                      label: preset[1].name,
                      value: preset[1].id,
                      position: index,
                      isActive: true,
                      isBlocked: false,
                    }
                  })}
                  selected={this.props.preset.id}
                  feature="UPDATE_PRESET"
                  parentClassName="controls"
                  alignment="RIGHT"
                  onChange={(e) => this.props.onChangePreset?.(e)}
                />
              </Feature>
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'SCALE_PRESETS')
                    ?.isActive
                }
              >
                {this.props.preset.scale.length > 2 &&
                this.props.preset.name === 'Custom' ? (
                  <Button
                    type="icon"
                    icon="minus"
                    feature="REMOVE_STOP"
                    action={this.props.onRemoveStop}
                  />
                ) : null}
                {this.props.preset.name === 'Custom' ? (
                  <Button
                    type="icon"
                    icon="plus"
                    state={
                      this.props.preset.scale.length == 24 ? 'disabled' : ''
                    }
                    feature="ADD_STOP"
                    action={
                      this.props.preset.scale.length >= 24
                        ? () => null
                        : this.props.onAddStop
                    }
                  />
                ) : null}
              </Feature>
            </div>
          </div>
          <Feature
            isActive={
              features.find((feature) => feature.name === 'SCALE_CONFIGURATION')
                ?.isActive
            }
          >
            <Slider
              type="EQUAL"
              hasPreset={this.props.hasPreset}
              presetName={this.props.preset.name}
              stops={this.props.preset.scale}
              min={this.props.preset.min}
              max={this.props.preset.max}
              onChange={this.slideHandler}
            />
          </Feature>
          <Feature
            isActive={
              features.find((feature) => feature.name === 'SCALE_TIPS')
                ?.isActive
            }
          >
            <Message
              icon="key"
              messages={this.setOnboardingMessages()}
            />
          </Feature>
        </div>
        <Actions
          context="CREATE"
          planStatus={this.props.planStatus}
          lang={this.props.lang}
          onCreatePalette={this.props.onCreatePalette}
        />
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
              <div className="section-title">
                {locals[this.props.lang].scale.title}
                <div className="type">{`(${
                  Object.entries(this.props.scale ?? {}).length
                })`}</div>
              </div>
            </div>
            <div className="section-controls__right-part">
              <div className="label">{this.props.preset.name}</div>
            </div>
          </div>
          <Feature
            isActive={
              features.find((feature) => feature.name === 'SCALE_CONFIGURATION')
                ?.isActive
            }
          >
            <Slider
              type="CUSTOM"
              hasPreset={this.props.hasPreset}
              presetName={this.props.preset.name}
              stops={this.props.preset.scale}
              scale={this.props.scale}
              onChange={this.slideHandler}
            />
          </Feature>
          <Feature
            isActive={
              features.find((feature) => feature.name === 'SCALE_TIPS')
                ?.isActive
            }
          >
            <Message
              icon="key"
              messages={this.setOnboardingMessages()}
            />
          </Feature>
        </div>
        {this.props.editorType === 'figma' ? (
          <Actions
            context="DEPLOY"
            actions={this.props.actions}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
            onCreateLocalStyles={this.props.onCreateLocalStyles}
            onUpdateLocalStyles={this.props.onUpdateLocalStyles}
            onCreateLocalVariables={this.props.onCreateLocalVariables}
            onUpdateLocalVariables={this.props.onUpdateLocalVariables}
            onChangeActions={this.props.onChangeActions}
          />
        ) : null}
      </>
    )
  }

  // Render
  render() {
    return <>{!this.props.hasPreset ? <this.Edit /> : <this.Create />}</>
  }
}
