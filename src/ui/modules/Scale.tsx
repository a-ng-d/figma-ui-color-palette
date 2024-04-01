import * as React from 'react'
import type {
  ActionsList,
  DispatchProcess,
  EditorType,
  Language,
  PlanStatus,
  PresetConfiguration,
  ScaleConfiguration,
  SourceColorConfiguration,
  Easing,
  NamingConvention,
} from '../../utils/types'
import Feature from '../components/Feature'
import { Button } from '@a-ng-d/figmug.actions.button'
import { Dropdown } from '@a-ng-d/figmug.inputs.dropdown'
import { texts } from '@a-ng-d/figmug.stylesheets.texts'
import { SectionTitle } from '@a-ng-d/figmug.layouts.section-title'
import { Dialog } from '@a-ng-d/figmug.dialogs.dialog'
import { KeyboardShortcutItem } from '@a-ng-d/figmug.lists.keyboard-shortcut-item'
import { FormItem } from '@a-ng-d/figmug.layouts.form-item'
import Slider from '../components/Slider'
import Actions from './Actions'
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
  namingConvention: NamingConvention
  scale?: ScaleConfiguration
  actions?: string
  planStatus: PlanStatus
  editorType?: EditorType
  lang: Language
  onChangePreset?: (
    e: React.MouseEvent<HTMLLIElement, MouseEvent> | React.KeyboardEvent
  ) => void
  onChangeScale: () => void
  onChangeStop?: () => void
  onAddStop?: React.ReactEventHandler
  onRemoveStop?: React.ReactEventHandler
  onChangeNamingConvention?: React.ReactEventHandler
  onCreatePalette?: () => void
  onSyncLocalStyles?: () => void
  onSyncLocalVariables?: () => void
  onChangeActions?: (value: string) => void | undefined
}

interface States {
  distributionEasing: Easing
  isTipsOpen: boolean
}

export default class Scale extends React.Component<Props, States> {
  dispatch: { [key: string]: DispatchProcess }

  static defaultProps = {
    namingConvention: 'ONES'
  }

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
    this.state = {
      distributionEasing: 'LINEAR',
      isTipsOpen: false,
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

  // Templates
  DistributionEasing = () => {
    return (
      <FormItem
        label={locals[this.props.lang].scale.easing.label}
        id="distribution-easing"
        shouldFill={false}
      >
        <Dropdown
          id="distribution-easing"
          options={[
            {
              label: locals[this.props.lang].scale.easing.linear,
              value: 'LINEAR',
              feature: 'UPDATE_DISTRIBUTION_EASING',
              position: 0,
              type: 'OPTION',
              isActive: true,
              isBlocked: false,
              isNew: false,
              children: [],
              action: (e) =>
                this.setState({
                  distributionEasing: e.target.dataset.value,
                }),
            },
            {
              label: locals[this.props.lang].scale.easing.easeIn,
              value: 'EASE_IN',
              feature: 'UPDATE_DISTRIBUTION_EASING',
              position: 1,
              type: 'OPTION',
              isActive: true,
              isBlocked: false,
              isNew: false,
              children: [],
              action: (e) =>
                this.setState({
                  distributionEasing: e.target.dataset.value,
                }),
            },
            {
              label: locals[this.props.lang].scale.easing.easeOut,
              value: 'EASE_OUT',
              feature: 'UPDATE_DISTRIBUTION_EASING',
              position: 2,
              type: 'OPTION',
              isActive: true,
              isBlocked: false,
              isNew: false,
              children: [],
              action: (e) =>
                this.setState({
                  distributionEasing: e.target.dataset.value,
                }),
            },
            {
              label: locals[this.props.lang].scale.easing.easeInOut,
              value: 'EASE_IN_OUT',
              feature: 'UPDATE_DISTRIBUTION_EASING',
              position: 3,
              type: 'OPTION',
              isActive: true,
              isBlocked: false,
              isNew: false,
              children: [],
              action: (e) =>
                this.setState({
                  distributionEasing: e.target.dataset.value,
                }),
            },
          ]}
          selected={this.state['distributionEasing']}
          parentClassName="controls"
          isNew={
            features.find(
              (feature) => feature.name === 'SCALE_HELPER_DISTRIBUTION'
            )?.isNew
          }
        />
      </FormItem>
    )
  }

  NamingConvention = () => {
    return (
      <Dropdown
        id="naming-convention"
        options={[
          {
            label: locals[this.props.lang].scale.namingConvention.ones,
            value: 'ONES',
            feature: 'UPDATE_NAMING_CONVENTION',
            position: 0,
            type: 'OPTION',
            isActive: true,
            isBlocked: false,
            isNew: false,
            children: [],
            action: (e) => this.props.onChangeNamingConvention?.(e),
          },
          {
            label: locals[this.props.lang].scale.namingConvention.tens,
            value: 'TENS',
            feature: 'UPDATE_NAMING_CONVENTION',
            position: 1,
            type: 'OPTION',
            isActive: true,
            isBlocked: false,
            isNew: false,
            children: [],
            action: (e) => this.props.onChangeNamingConvention?.(e),
          },
          {
            label: locals[this.props.lang].scale.namingConvention.hundreds,
            value: 'HUNDREDS',
            feature: 'UPDATE_NAMING_CONVENTION',
            position: 2,
            type: 'OPTION',
            isActive: true,
            isBlocked: false,
            isNew: false,
            children: [],
            action: (e) => this.props.onChangeNamingConvention?.(e),
          },
        ]}
        selected={this.props.namingConvention}
        parentClassName="controls"
        alignment="RIGHT"
        isNew={
          features.find(
            (feature) => feature.name === 'SCALE_PRESETS_NAMING_CONVENTION'
          )?.isNew
        }
      />
    )
  }

  KeyboardShortcuts = () => {
    const isMacOrWinKeyboard =
      navigator.userAgent.indexOf('Mac') != -1 ? '⌘' : '⌃' ?? '⌘'

    return (
      <Dialog
        title={locals[this.props.lang].scale.tips.title}
        actions={{}}
        onClose={() =>
          this.setState({
            isTipsOpen: false,
          })
        }
      >
        <div className="controls__control controls__control--horizontal">
          <div className="control__block control__block--no-padding">
            <ul className="list">
              <KeyboardShortcutItem
                label={locals[this.props.lang].scale.tips.move}
                shortcuts={[[isMacOrWinKeyboard, 'drag']]}
              />
              <KeyboardShortcutItem
                label={locals[this.props.lang].scale.tips.distribute}
                shortcuts={[['⇧', 'drag']]}
              />
              <KeyboardShortcutItem
                label={locals[this.props.lang].scale.tips.select}
                shortcuts={[['click']]}
              />
              <KeyboardShortcutItem
                label={locals[this.props.lang].scale.tips.unselect}
                shortcuts={[['⎋ Esc']]}
              />
              <KeyboardShortcutItem
                label={locals[this.props.lang].scale.tips.navPrevious}
                shortcuts={[['⇧', '⇥ Tab']]}
              />
              <KeyboardShortcutItem
                label={locals[this.props.lang].scale.tips.navNext}
                shortcuts={[['⇥ Tab']]}
              />
              {!this.props.hasPreset ? (
                <>
                  <KeyboardShortcutItem
                    label={locals[this.props.lang].scale.tips.type}
                    shortcuts={[['db click'], ['↩︎ Enter']]}
                    separator="or"
                  />
                  <KeyboardShortcutItem
                    label={locals[this.props.lang].scale.tips.shiftLeft}
                    shortcuts={[['←'], [isMacOrWinKeyboard, '←']]}
                    separator="or"
                  />
                  <KeyboardShortcutItem
                    label={locals[this.props.lang].scale.tips.shiftRight}
                    shortcuts={[['→'], [isMacOrWinKeyboard, '→']]}
                    separator="or"
                  />
                </>
              ) : null}
            </ul>
          </div>
          {!this.props.hasPreset ? (
            <div className="control__block control__block--list">
              <div className="section-controls">
                <div className="section-controls__left-part">
                  <SectionTitle
                    label={locals[this.props.lang].scale.tips.custom}
                  />
                </div>
                <div className="section-controls__right-part"></div>
              </div>
              <ul className="list">
                <KeyboardShortcutItem
                  label={locals[this.props.lang].scale.tips.add}
                  shortcuts={[['click']]}
                />
                <KeyboardShortcutItem
                  label={locals[this.props.lang].scale.tips.remove}
                  shortcuts={[['⌫']]}
                />
              </ul>
            </div>
          ) : null}
        </div>
      </Dialog>
    )
  }

  Create = () => {
    palette.scale = {}
    return (
      <div className="controls__control">
        <div className="control__block control__block--distributed">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <SectionTitle label={locals[this.props.lang].scale.title} />
            </div>
            <div className="section-controls__right-part">
              <Feature
                isActive={
                  features.find((feature) => feature.name === 'SCALE_PRESETS')
                    ?.isActive
                }
              >
                <Dropdown
                  id="presets"
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
                {this.props.preset.name === 'Custom' ? (
                  <>
                    <Feature
                      isActive={
                        features.find(
                          (feature) => feature.name === 'SCALE_PRESETS_NAMING_CONVENTION'
                        )?.isActive
                      }
                    >
                      <this.NamingConvention />
                    </Feature>
                    {this.props.preset.scale.length > 2 ? (
                      <Button
                        type="icon"
                        icon="minus"
                        feature="REMOVE_STOP"
                        action={this.props.onRemoveStop}
                      />
                    ) : null}
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
                  </>
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
                min={palette.min}
                max={palette.max}
                distributionEasing={this.state['distributionEasing']}
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
                distributionEasing={this.state['distributionEasing']}
                onChange={this.slideHandler}
              />
            )}
          </Feature>
          <Feature
            isActive={
              features.find((feature) => feature.name === 'SCALE_HELPER')
                ?.isActive
            }
          >
            <div className="section-controls">
              <div className="section-controls__left-part">
                <Feature
                  isActive={
                    features.find(
                      (feature) => feature.name === 'SCALE_HELPER_DISTRIBUTION'
                    )?.isActive
                  }
                >
                  <this.DistributionEasing />
                </Feature>
              </div>
              <div className="section-controls__right-part">
                <Feature
                  isActive={
                    features.find(
                      (feature) => feature.name === 'SCALE_HELPER_TIPS'
                    )?.isActive
                  }
                >
                  <div className="snackbar">
                    <Button
                      type="tertiary"
                      label={locals[this.props.lang].scale.howTo}
                      action={() =>
                        parent.postMessage(
                          {
                            pluginMessage: {
                              type: 'OPEN_IN_BROWSER',
                              url: 'https://uicp.link/how-to-adjust',
                            },
                          },
                          '*'
                        )
                      }
                    />
                    <span
                      className={`type ${texts.type} ${texts['type--secondary']}`}
                    >
                      ﹒
                    </span>
                    <Button
                      type="tertiary"
                      label={locals[this.props.lang].scale.keyboardShortcuts}
                      action={() =>
                        this.setState({
                          isTipsOpen: true,
                        })
                      }
                    />
                  </div>
                </Feature>
              </div>
            </div>
            {this.state['isTipsOpen'] ? <this.KeyboardShortcuts /> : null}
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
              <SectionTitle
                label={locals[this.props.lang].scale.title}
                indicator={Object.entries(
                  this.props.scale ?? {}
                ).length.toString()}
              />
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
              distributionEasing={this.state['distributionEasing']}
              onChange={this.slideHandler}
            />
          </Feature>
          <Feature
            isActive={
              features.find((feature) => feature.name === 'SCALE_HELPER')
                ?.isActive
            }
          >
            <div className="section-controls">
              <div className="section-controls__left-part">
                <Feature
                  isActive={
                    features.find(
                      (feature) => feature.name === 'SCALE_HELPER_DISTRIBUTION'
                    )?.isActive
                  }
                >
                  <this.DistributionEasing />
                </Feature>
              </div>
              <div className="section-controls__right-part">
                <Feature
                  isActive={
                    features.find(
                      (feature) => feature.name === 'SCALE_HELPER_TIPS'
                    )?.isActive
                  }
                >
                  <div className="snackbar">
                    <Button
                      type="tertiary"
                      label={locals[this.props.lang].scale.howTo}
                      action={() =>
                        parent.postMessage(
                          {
                            pluginMessage: {
                              type: 'OPEN_IN_BROWSER',
                              url: 'https://uicp.link/how-to-adjust',
                            },
                          },
                          '*'
                        )
                      }
                    />
                    <span
                      className={`type ${texts.type} ${texts['type--secondary']}`}
                    >
                      ﹒
                    </span>
                    <Button
                      type="tertiary"
                      label={locals[this.props.lang].scale.keyboardShortcuts}
                      action={() =>
                        this.setState({
                          isTipsOpen: true,
                        })
                      }
                    />
                  </div>
                </Feature>
              </div>
            </div>
            {this.state['isTipsOpen'] ? <this.KeyboardShortcuts /> : null}
          </Feature>
        </div>
        {this.props.editorType === 'figma' ? (
          <Actions
            context="DEPLOY"
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
