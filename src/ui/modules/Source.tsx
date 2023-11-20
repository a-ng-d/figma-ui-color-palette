import * as React from 'react'
import chroma from 'chroma-js'
import { uid } from 'uid'
import type {
  EditorType,
  Language,
  SourceColorConfiguration,
} from '../../utils/types'
import Feature from '../components/Feature'
import Message from '../components/Message'
import Actions from './Actions'
import FormItem from '../components/FormItem'
import Input from '../components/Input'
import Button from '../components/Button'
import CompactColorItem from '../components/CompactColorItem'
import features from '../../utils/config'
import { locals } from '../../content/locals'

interface Props {
  sourceColors: Array<SourceColorConfiguration>
  planStatus: 'UNPAID' | 'PAID'
  editorType?: EditorType
  lang: Language
  onChangeColorsFromCoolors: (
    sourceColorsFromCoolers: Array<SourceColorConfiguration>
  ) => void
  onCreatePalette: () => void
}

export default class Source extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {
      coolorsUrl: {
        value: '' as string,
        state: 'DEFAULT' as 'DEFAULT' | 'ERROR',
        canBeSubmitted: false,
        helper: undefined,
      },
    }
  }

  componentWillUnmount(): void {
    this.setState({
      coolorsUrl: {
        value: '',
        state: 'DEFAULT',
        canBeSubmitted: false,
        helper: undefined,
      },
    })
  }

  // Handlers
  isTypingHandler = (e: React.SyntheticEvent) =>
    this.setState({
      coolorsUrl: {
        value: (e.target as HTMLInputElement).value,
        state: !(e.target as HTMLInputElement).value.includes(
          'https://coolors.co'
        )
          ? ''
          : this.state['coolorsUrl'].state,
        canBeSubmitted: (e.target as HTMLInputElement).value.includes(
          'https://coolors.co'
        )
          ? true
          : false,
        helper: !(e.target as HTMLInputElement).value.includes(
          'https://coolors.co'
        )
          ? undefined
          : this.state['coolorsUrl'].helper,
      },
    })

  importColorsFromCoolorsHandler = () => {
    const url: string = this.state['coolorsUrl'].value,
      hexs: string | undefined = url.split('/').at(-1)

    if (hexs != undefined)
      if (/^(?:[0-9a-fA-F]{6}-)+[0-9a-fA-F]{6}$/i.test(hexs)) {
        this.props.onChangeColorsFromCoolors(
          hexs.split('-').map((hex) => {
            const gl = chroma(hex).gl()
            return {
              name: hex,
              rgb: {
                r: gl[0],
                g: gl[1],
                b: gl[2],
              },
              source: 'COOLORS',
              id: uid(),
            }
          })
        )
        this.setState({
          coolorsUrl: {
            value: '',
            state: 'DEFAULT',
            canBeSubmitted: false,
            helper: undefined,
          },
        })
      } else
        this.setState({
          coolorsUrl: {
            value: this.state['coolorsUrl'].value,
            state: 'ERROR',
            canBeSubmitted: this.state['coolorsUrl'].canBeSubmitted,
            helper: {
              type: 'ERROR',
              message: locals[this.props.lang].source.coolors.url.errorMessage,
            },
          },
        })
  }

  removeColorsFromCoolorsHandler = () =>
    this.props.onChangeColorsFromCoolors([])

  // Templates
  SelectedColors = () => {
    return (
      <div className="control__block control__block--list">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <div className="section-title">
              {locals[this.props.lang].source.canvas.title}
            </div>
            <div className="type">{`(${
              this.props.sourceColors.filter(
                (sourceColor) => sourceColor.source === 'CANVAS'
              ).length
            })`}</div>
          </div>
          <div className="section-controls__right-part"></div>
        </div>
        {this.props.sourceColors.filter(
          (sourceColor) => sourceColor.source === 'CANVAS'
        ).length > 0 ? (
          <ul className="list">
            {this.props.sourceColors
              .filter((sourceColor) => sourceColor.source === 'CANVAS')
              .map((sourceColor) => {
                return (
                  <CompactColorItem
                    key={sourceColor.id}
                    name={sourceColor.name}
                    hex={chroma(
                      sourceColor.rgb.r * 255,
                      sourceColor.rgb.g * 255,
                      sourceColor.rgb.b * 255
                    )
                      .hex()
                      .toUpperCase()}
                    uuid={sourceColor.id}
                    lang={this.props.lang}
                  />
                )
              })}
          </ul>
        ) : (
          <Message
            icon="list-tile"
            messages={[locals[this.props.lang].source.canvas.tip]}
          />
        )}
      </div>
    )
  }

  CoolorsColors = () => {
    return (
      <div className="control__block control__block--list">
        <div className="section-controls">
          <div className="section-controls__left-part">
            <div className="section-title">
              {locals[this.props.lang].source.coolors.title}
            </div>
            <div className="type">{`(${
              this.props.sourceColors.filter(
                (sourceColor) => sourceColor.source === 'COOLORS'
              ).length
            })`}</div>
          </div>
          <div className="section-controls__right-part">
            {this.props.sourceColors.filter(
              (sourceColor) => sourceColor.source === 'COOLORS'
            ).length > 0 ? (
              <Button
                type="icon"
                icon="minus"
                feature="REMOVE_COLORS"
                action={this.removeColorsFromCoolorsHandler}
              />
            ) : null}
          </div>
        </div>
        <div className="settings__item">
          <FormItem
            id="coolors-palette-urn"
            label={locals[this.props.lang].source.coolors.url.label}
            helper={this.state['coolorsUrl'].helper}
            shouldFill={false}
          >
            <Input
              type="TEXT"
              state={this.state['coolorsUrl'].state}
              placeholder={
                locals[this.props.lang].source.coolors.url.placeholder
              }
              value={this.state['coolorsUrl'].value}
              onChange={this.isTypingHandler}
              onFocus={() => null}
              onBlur={() => null}
              onConfirm={() => {
                if (this.state['coolorsUrl'].canBeSubmitted) {
                  this.importColorsFromCoolorsHandler()
                }
              }}
            />
            <div
              style={{
                alignSelf: 'center',
              }}
            >
              <Button
                type="icon"
                state={
                  this.state['coolorsUrl'].canBeSubmitted
                    ? 'default'
                    : 'disabled'
                }
                icon="plus"
                feature="IMPORT_COLORS_FROM_URL"
                action={this.importColorsFromCoolorsHandler}
              />
            </div>
          </FormItem>
        </div>
        <ul className="list">
          {this.props.sourceColors
            .filter((sourceColor) => sourceColor.source === 'COOLORS')
            .map((sourceColor) => {
              return (
                <CompactColorItem
                  key={sourceColor.id}
                  name={sourceColor.name}
                  hex={chroma(
                    sourceColor.rgb.r * 255,
                    sourceColor.rgb.g * 255,
                    sourceColor.rgb.b * 255
                  )
                    .hex()
                    .toUpperCase()}
                  uuid={sourceColor.id}
                  lang={this.props.lang}
                />
              )
            })}
        </ul>
      </div>
    )
  }

  // Render
  render() {
    return (
      <>
        <div className="controls__control controls__control--horizontal">
          <Feature
            isActive={
              features.find((feature) => feature.name === 'SOURCE_CANVAS')
                ?.isActive
            }
          >
            <this.SelectedColors />
          </Feature>
          <Feature
            isActive={
              features.find((feature) => feature.name === 'SOURCE_COOLORS')
                ?.isActive
            }
          >
            <this.CoolorsColors />
          </Feature>
        </div>
        <Actions
          context="CREATE"
          sourceColors={this.props.sourceColors}
          planStatus={this.props.planStatus}
          lang={this.props.lang}
          onCreatePalette={
            this.props.sourceColors.length > 0
              ? this.props.onCreatePalette
              : () => null
          }
        />
      </>
    )
  }
}
