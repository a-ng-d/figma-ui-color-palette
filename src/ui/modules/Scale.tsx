import * as React from 'react'
import type {
  ActionsList,
  DispatchProcess,
  EditorType,
  Language,
  PresetConfiguration,
  ScaleConfiguration,
  SourceColorConfiguration,
} from '../../utils/types'
import Feature from '../components/Feature'
import { Button } from '@a-ng-d/figmug.actions.button'
import { Dropdown } from '@a-ng-d/figmug.inputs.dropdown'
import Slider from '../components/Slider'
import { Message } from '@a-ng-d/figmug.dialogs.message'
import Actions from './Actions'
import { texts } from '@a-ng-d/figmug.stylesheets.texts'
import { palette, presets } from '../../utils/palettePackage'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import doLightnessScale from '../../utils/doLightnessScale'
import { locals } from '../../content/locals'
import Dispatcher from './Dispatcher'

interface Props {
  sourceColors?: Array<SourceColorConfiguration>
  hasPreset: boolean
  preset: PresetConfiguration
  scale?: ScaleConfiguration
  actions?: string
  planStatus: 'UNPAID' | 'PAID'
  editorType?: EditorType
  lang: Language
  onChangePreset?: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent
  ) => void
  onChangeScale: () => void
  onChangeStop?: () => void
  onAddStop?: React.ReactEventHandler
  onRemoveStop?: React.ReactEventHandler
  onCreatePalette?: () => void
  onSyncLocalStyles?: () => void
  onSyncLocalVariables?: () => void
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

    const onUpdatingStop = () => {
      this.dispatch.scale.on.status = true
    }

    const actions: ActionsList = {
      RELEASED: () => onReleaseStop(),
      SHIFTED: () => onChangeStop(),
      TYPED: () => onTypeStopValue(),
      UPDATING: () => onUpdatingStop(),
    }

    if (!this.props.hasPreset) return actions[state]?.()
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
      <div className="controls__control">
        <div className="control__block control__block--distributed">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className={`section-title ${texts['section-title']}`}>
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
                      feature: 'UPDATE_PRESET',
                      position: index,
                      type: 'OPTION',
                      isActive: features.find(
                        (feature) => feature.name === `PRESETS_${preset[1].id}`
                      )?.isActive,
                      isBlocked: isBlocked(
                        `PRESETS_${preset[1].id}`,
                        this.props.planStatus
                      ),
                      isNew: features.find(
                        (feature) => feature.name === `PRESETS_${preset[1].id}`
                      )?.isNew,
                      children: [],
                      action: (e) => this.props.onChangePreset?.(e),
                    }
                  })}
                  selected={this.props.preset.id}
                  parentClassName="controls"
                  alignment="RIGHT"
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
                    isDisabled={this.props.preset.scale.length == 24}
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
            {this.props.preset.isDistributed ? (
              <Slider
                type="EQUAL"
                hasPreset={this.props.hasPreset}
                presetName={this.props.preset.name}
                stops={this.props.preset.scale}
                min={this.props.preset.min}
                max={this.props.preset.max}
                onChange={this.slideHandler}
              />
            ) : (
              <Slider
                type="CUSTOM"
                hasPreset={this.props.hasPreset}
                presetName={this.props.preset.name}
                stops={this.props.preset.scale}
                scale={doLightnessScale(
                  this.props.preset.scale,
                  this.props.preset.min,
                  this.props.preset.max,
                  false
                )}
                onChange={this.slideHandler}
              />
            )}
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
          sourceColors={this.props.sourceColors}
          planStatus={this.props.planStatus}
          lang={this.props.lang}
          onCreatePalette={this.props.onCreatePalette}
        />
      </div>
    )
  }

  Edit = () => {
    palette.scale = {}
    return (
      <div className="controls__control">
        <div className="control__block control__block--distributed">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className={`section-title ${texts['section-title']}`}>
                {locals[this.props.lang].scale.title}
                <div className={`type ${texts.type}`}>{`(${
                  Object.entries(this.props.scale ?? {}).length
                })`}</div>
              </div>
            </div>
            <div className="section-controls__right-part">
              <div className={`label ${texts.label}`}>
                {this.props.preset.name}
              </div>
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
            onSyncLocalStyles={this.props.onSyncLocalStyles}
            onSyncLocalVariables={this.props.onSyncLocalVariables}
            onChangeActions={this.props.onChangeActions}
          />
        ) : null}
      </div>
    )
  }

  // Render
  render() {
    return <>{!this.props.hasPreset ? <this.Edit /> : <this.Create />}</>
  }
}
