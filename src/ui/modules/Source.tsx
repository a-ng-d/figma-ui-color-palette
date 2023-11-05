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
  onChangeColorsFromCoolors: (sourceColorsFromCoolers: Array<SourceColorConfiguration>) => void
  onCreatePalette: () => void
}

export default class Source extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {
      coolorsUrl: ''
    }
  }

  // Handlers
  importColorsFromCoolorsHandler = (e: React.SyntheticEvent) => {
    const url = (e.target as HTMLInputElement).value,
      domain = url.split('/')[3],
      hexs = url.split('/').at(-1)

    if (hexs != undefined)
      if (/[A-Za-z0-9]+-[A-Za-z0-9]+/i.test(hexs)) {
        this.props.onChangeColorsFromCoolors(
          hexs
            .split('-')
            .map(hex => {
              const gl = chroma(hex).gl()
              return {
                name: hex,
                rgb: {
                  r: gl[0],
                  g: gl[1],
                  b: gl[2]
                },
                source: 'COOLORS',
                id: uid()
              }
            }
        ))
        this.setState({
          coolorsUrl: ''
        })
      }
  }

  removeColorsFromCoolorsHandler = (e: React.SyntheticEvent) =>
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
            <div className="type">{`(${this.props.sourceColors.filter(sourceColor => sourceColor.source === 'CANVAS').length})`}</div>
          </div>
          <div className="section-controls__right-part">
          </div>
        </div>
        {
          this.props.sourceColors.filter(sourceColor => sourceColor.source === 'CANVAS').length > 0
          ? (
            <ul className="list">
              {this.props.sourceColors.filter(sourceColor => sourceColor.source === 'CANVAS').map((sourceColor, index) => {
                return (
                  <CompactColorItem
                    key={sourceColor.id}
                    name={sourceColor.name}
                    hex={
                      chroma(sourceColor.rgb.r * 255, sourceColor.rgb.g * 255, sourceColor.rgb.b * 255)
                        .hex()
                        .toUpperCase()
                    }
                    uuid={sourceColor.id}
                    lang={this.props.lang}
                  />
                )
              })}
            </ul>
          )
          : (
            <Message
              icon="list-tile"
              messages={[locals[this.props.lang].onboarding.selectColor]}
            />
          )
        }   
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
            <div className="type">{`(${this.props.sourceColors.filter(sourceColor => sourceColor.source === 'COOLORS').length})`}</div>
          </div>
          <div className="section-controls__right-part">
            {this.props.sourceColors.filter(sourceColor => sourceColor.source === 'COOLORS').length > 0 ? (
              <Button
                type="icon"
                icon="minus"
                feature="REMOVE_COLORS"
                action={this.removeColorsFromCoolorsHandler}
              />
              ) : null
            }
          </div>
        </div>
        <div>
          <FormItem
            id="coolors-palette-urn"
            label="Paste your palette URL"
          >
            <Input
              type="TEXT"
              placeholder="https://coolors.co/…"
              value={this.state['coolorsUrl']}
              feature="UPLOAD_COLORS_FROM_URL"
              onChange={(e: React.SyntheticEvent) => this.setState({
                coolorsUrl: (e.target as HTMLInputElement).value
              })}
              onFocus={() => null}
              onBlur={this.importColorsFromCoolorsHandler}
              onConfirm={this.importColorsFromCoolorsHandler}
            />
          </FormItem>
        </div>
        <ul className="list">
          {this.props.sourceColors.filter(sourceColor => sourceColor.source === 'COOLORS').map((sourceColor, index) => {
            return (
              <CompactColorItem
                key={sourceColor.id}
                name={sourceColor.name}
                hex={
                  chroma(sourceColor.rgb.r * 255, sourceColor.rgb.g * 255, sourceColor.rgb.b * 255)
                    .hex()
                    .toUpperCase()
                }
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
          onCreatePalette={this.props.sourceColors.length > 0 ? this.props.onCreatePalette : () => null}
        />
      </>
    )
  }
}
