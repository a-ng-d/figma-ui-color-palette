import * as React from 'react'
import type { ActionsList, Language } from '../../utils/types'
import { Input } from '@a-ng-d/figmug.inputs.input'
import { Dropdown } from '@a-ng-d/figmug.inputs.dropdown'
import Actions from './Actions'
import { texts } from '@a-ng-d/figmug.stylesheets.texts'
import features from '../../utils/config'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'

interface Props {
  exportPreview: string
  planStatus: 'UNPAID' | 'PAID'
  exportType: string
  lang: Language
  onExportPalette: () => void
}

export default class Export extends React.Component<Props, any> {
  counter: number

  static defaultProps = {
    exportPreview: '',
  }

  constructor(props: Props) {
    super(props)
    this.counter = 0
    this.state = {
      format: 'EXPORT_TO_JSON',
      colorSpace: {
        selected: '',
        options: [],
      }
    }
  }

  // Handlers
  exportHandler = (e: React.SyntheticEvent) => {
    const actions: ActionsList = {
      EXPORT_TO_JSON: () => {
        this.setState({
          format: 'EXPORT_TO_JSON',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'JSON' } },
          '*'
        )
      },
      EXPORT_TO_JSON_AMZN_STYLE_DICTIONARY: () => {
        this.setState({
          format: 'EXPORT_TO_JSON_AMZN_STYLE_DICTIONARY',
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: 'JSON_AMZN_STYLE_DICTIONARY',
            },
          },
          '*'
        )
      },
      EXPORT_TO_JSON_TOKENS_STUDIO: () => {
        this.setState({
          format: 'EXPORT_TO_JSON_TOKENS_STUDIO',
        })
        parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: 'JSON_TOKENS_STUDIO',
            },
          },
          '*'
        )
      },
      EXPORT_TO_CSS: () => {
        this.setState({
          format: 'EXPORT_TO_CSS',
          colorSpace: {
            selected: 'RGB',
            options: [
              {
                label: "RGB",
                value: 'EXPORT_TO_CSS_RGB',
                position: 0,
                isActive: features.find(
                  (feature) => feature.name === 'EXPORT_JSON'
                )?.isActive,
                isBlocked: isBlocked(
                  'EXPORT_JSON',
                  this.props.planStatus
                ),
                children: [],
              },
              {
                label: "HEX",
                value: 'EXPORT_TO_CSS_HEX',
                position: 1,
                isActive: features.find(
                  (feature) => feature.name === 'EXPORT_JSON'
                )?.isActive,
                isBlocked: isBlocked(
                  'EXPORT_JSON',
                  this.props.planStatus
                ),
                children: [],
              },
              {
                label: "LCH",
                value: 'EXPORT_TO_CSS_LCH',
                position: 2,
                isActive: features.find(
                  (feature) => feature.name === 'EXPORT_JSON'
                )?.isActive,
                isBlocked: isBlocked(
                  'EXPORT_JSON',
                  this.props.planStatus
                ),
                children: [],
              },
              {
                label: "P3",
                value: 'EXPORT_TO_CSS_P3',
                position: 3,
                isActive: features.find(
                  (feature) => feature.name === 'EXPORT_JSON'
                )?.isActive,
                isBlocked: isBlocked(
                  'EXPORT_JSON',
                  this.props.planStatus
                ),
                children: [],
              },
            ],
          }
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSS', colorSpace: 'RGB' } },
          '*'
        )
      },
      EXPORT_TO_CSS_RGB: () => {
        this.setState({
          colorSpace: {
            selected: 'RGB',
            options: this.state['colorSpace'].options,
          }
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSS', colorSpace: 'RGB' } },
          '*'
        )
      },
      EXPORT_TO_CSS_LCH: () => {
        this.setState({
          colorSpace: {
            selected: 'LCH',
            options: this.state['colorSpace'].options,
          }
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSS', colorSpace: 'LCH' } },
          '*'
        )
      },
      EXPORT_TO_CSS_P3: () => {
        this.setState({
          colorSpace: {
            selected: 'P3',
            options: this.state['colorSpace'].options,
          }
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSS', colorSpace: 'P3' } },
          '*'
        )
      },
      EXPORT_TO_CSS_HEX: () => {
        this.setState({
          colorSpace: {
            selected: 'HEX',
            options: this.state['colorSpace'].options,
          }
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSS', colorSpace: 'HEX' } },
          '*'
        )
      },
      EXPORT_TO_SWIFT: () => {
        this.setState({
          format: 'EXPORT_TO_SWIFT',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'SWIFT' } },
          '*'
        )
      },
      EXPORT_TO_XML: () => {
        this.setState({
          format: 'EXPORT_TO_XML',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'XML' } },
          '*'
        )
      },
      EXPORT_TO_CSV: () => {
        this.setState({
          format: 'EXPORT_TO_CSV',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSV' } },
          '*'
        )
      },
      NULL: () => null,
    }

    return actions[(e.target as HTMLElement).dataset.value ?? 'NULL']?.()
  }

  // Direct actions
  setFirstPreview = () => {
    this.counter == 0
      ? parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: this.state['format'].replace('EXPORT_TO_', ''),
            },
          },
          '*'
        )
      : null
    this.counter = 1
  }

  selectPreview = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => e.target.select()

  deSelectPreview = () => window.getSelection()?.removeAllRanges()

  // Render
  render() {
    this.setFirstPreview()
    return (
      <div className="controls__control">
        <div className="control__block">
          <div className="section-controls">
            <div className="section-controls__left-part">
              <div className={`section-title ${texts['section-title']}`}>
                {locals[this.props.lang].export.format}
                <div className={`type ${texts.type}`}>(7)</div>
              </div>
            </div>
            <div className="section-controls__right-part">
              <Dropdown
                id="exports-list"
                options={[
                  {
                    label: 'Tokens',
                    value: 'TOKENS_GROUP',
                    position: 0,
                    isActive: true,
                    isBlocked: false,
                    children: [
                      {
                        label: locals[this.props.lang].export.json,
                        value: 'EXPORT_TO_JSON',
                        position: 0,
                        isActive: features.find(
                          (feature) => feature.name === 'EXPORT_JSON'
                        )?.isActive,
                        isBlocked: isBlocked(
                          'EXPORT_JSON',
                          this.props.planStatus
                        ),
                        children: [],
                      },
                      {
                        label:
                          locals[this.props.lang].export.amznStyleDictionary,
                        value: 'EXPORT_TO_JSON_AMZN_STYLE_DICTIONARY',
                        position: 0,
                        isActive: features.find(
                          (feature) =>
                            feature.name === 'EXPORT_JSON_AMZN_STYLE_DICTIONARY'
                        )?.isActive,
                        isBlocked: isBlocked(
                          'EXPORT_JSON_AMZN_STYLE_DICTIONARY',
                          this.props.planStatus
                        ),
                        children: [],
                      },
                      {
                        label: locals[this.props.lang].export.tokensStudio,
                        value: 'EXPORT_TO_JSON_TOKENS_STUDIO',
                        position: 0,
                        isActive: features.find(
                          (feature) =>
                            feature.name === 'EXPORT_JSON_TOKENS_STUDIO'
                        )?.isActive,
                        isBlocked: isBlocked(
                          'EXPORT_JSON_TOKENS_STUDIO',
                          this.props.planStatus
                        ),
                        children: [],
                      },
                    ],
                  },
                  {
                    label: locals[this.props.lang].export.css,
                    value: 'EXPORT_TO_CSS',
                    position: 1,
                    isActive: features.find(
                      (feature) => feature.name === 'EXPORT_CSS'
                    )?.isActive,
                    isBlocked: isBlocked('EXPORT_CSS', this.props.planStatus),
                    children: [],
                  },
                  {
                    label: locals[this.props.lang].export.swift,
                    value: 'EXPORT_TO_SWIFT',
                    position: 2,
                    isActive: features.find(
                      (feature) => feature.name === 'EXPORT_SWIFT'
                    )?.isActive,
                    isBlocked: isBlocked('EXPORT_SWIFT', this.props.planStatus),
                    children: [],
                  },
                  {
                    label: locals[this.props.lang].export.xml,
                    value: 'EXPORT_TO_XML',
                    position: 3,
                    isActive: features.find(
                      (feature) => feature.name === 'EXPORT_XML'
                    )?.isActive,
                    isBlocked: isBlocked('EXPORT_XML', this.props.planStatus),
                    children: [],
                  },
                  {
                    label: locals[this.props.lang].export.csv,
                    value: 'EXPORT_TO_CSV',
                    position: 4,
                    isActive: features.find(
                      (feature) => feature.name === 'EXPORT_CSV'
                    )?.isActive,
                    isBlocked: isBlocked('EXPORT_CSV', this.props.planStatus),
                    children: [],
                  },
                ]}
                selected={this.state['format'] ?? ''}
                feature="SELECT_EXPORT_FILE"
                parentClassName="controls"
                alignment="RIGHT"
                onChange={this.exportHandler}
              />
              {this.state['format'] === 'EXPORT_TO_CSS' ? (
                <Dropdown
                  id="select-color-space"
                  options={this.state['colorSpace'].options}
                  selected={`${this.state['format']}_${this.state['colorSpace'].selected}`}
                  feature="SELECT_COLOR_SPACE"
                  parentClassName="controls"
                  alignment="RIGHT"
                  onChange={this.exportHandler}
                />
              ) : null}
            </div>
          </div>
          <div className="export-palette__preview">
            <Input
              id="code-snippet-dragging"
              type="CODE"
              value={this.props.exportPreview}
            />
          </div>
        </div>
        <Actions
          context="EXPORT"
          exportType={this.props.exportType}
          lang={this.props.lang}
          onExportPalette={this.props.onExportPalette}
        />
      </div>
    )
  }
}
