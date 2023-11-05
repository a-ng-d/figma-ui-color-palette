import * as React from 'react'
import chroma from 'chroma-js'
import type {
  EditorType,
  Language,
  SourceColorConfiguration,
} from '../../utils/types'
import Feature from '../components/Feature'
import Message from '../components/Message'
import Actions from './Actions'
import { palette, presets } from '../../utils/palettePackage'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'
import FormItem from '../components/FormItem'
import Input from '../components/Input'

interface Props {
  sourceColors: Array<SourceColorConfiguration>
  planStatus: 'UNPAID' | 'PAID'
  editorType?: EditorType
  lang: Language
  onImportCoolors: (sourceColorsFromCoolers: Array<SourceColorConfiguration>) => void
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
  importCoolorsHandler = (e: React.SyntheticEvent) => {
    const url = (e.target as HTMLInputElement).value,
      domain = url.split('/')[3],
      hexs = url.split('/').at(-1)

    if (hexs != undefined)
      if (/[A-Za-z0-9]+-[A-Za-z0-9]+/i.test(hexs)) {
        this.props.onImportCoolors(
          hexs.split('-').map(hex => {
            const gl = chroma(hex).gl()
            return {
              name: hex,
              rgb: {
                r: gl[0],
                g: gl[1],
                b: gl[2]
              },
              source: 'COOLORS'
            }
          }
        ))
        this.setState({
          coolorsUrl: ''
        })
      }

  }

  // Direct actions


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
                  <li
                    key={index}
                    className="list__item"
                  >
                    <div className="source-colors">
                      <div
                        className="source-colors__thumbnail"
                        style={{
                          backgroundColor: `rgb(${sourceColor.rgb.r * 255}, ${sourceColor.rgb.g * 255}, ${sourceColor.rgb.b * 255})`
                        }}
                      ></div>
                      <div className="source-colors__name">
                        <div className="type">
                          {sourceColor.name}
                        </div>
                        <div className="type type--secondary">
                          {`(${
                            chroma(sourceColor.rgb.r * 255, sourceColor.rgb.g * 255, sourceColor.rgb.b * 255)
                              .hex()
                              .toUpperCase()
                          })`}
                        </div>
                      </div>
                    </div>
                  </li>
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
              onChange={(e: React.SyntheticEvent) => this.setState({
                coolorsUrl: (e.target as HTMLInputElement).value
              })}
              onFocus={() => null}
              onBlur={this.importCoolorsHandler}
              onConfirm={() => null}
            />
          </FormItem>
        </div>
        <ul className="list">
          {this.props.sourceColors.filter(sourceColor => sourceColor.source === 'COOLORS').map((sourceColor, index) => {
            return (
              <li
                key={index}
                className="list__item"
              >
                <div className="source-colors">
                  <div
                    className="source-colors__thumbnail"
                    style={{
                      backgroundColor: `rgb(${sourceColor.rgb.r * 255}, ${sourceColor.rgb.g * 255}, ${sourceColor.rgb.b * 255})`
                    }}
                  ></div>
                  <div className="source-colors__name">
                    <div className="type">
                      {sourceColor.name}
                    </div>
                    <div className="type type--secondary">
                      {`(${
                        chroma(sourceColor.rgb.r * 255, sourceColor.rgb.g * 255, sourceColor.rgb.b * 255)
                          .hex()
                          .toUpperCase()
                      })`}
                    </div>
                  </div>
                </div>
              </li>
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
          <this.SelectedColors />
          <this.CoolorsColors />
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
