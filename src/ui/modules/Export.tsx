import * as React from 'react'
import type { ActionsList, Language } from '../../utils/types'
import Feature from '../components/Feature'
import RadioButton from './../components/RadioButton'
import Input from '../components/Input'
import Actions from './Actions'
import features from '../../utils/features'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'

interface Props {
  exportPreview: string
  planStatus: 'UNPAID' | 'PAID'
  exportType: string
  lang: Language
  onExportPalette: () => void
}

export default class Export extends React.Component<Props> {
  counter: number

  static defaultProps = {
    exportPreview: '',
  }

  constructor(props) {
    super(props)
    this.counter = 0
    this.state = {
      format:
        features.filter(
          (feature) =>
            feature.name.includes('EXPORT') &&
            feature.type === 'ACTION' &&
            feature.isActive
        )[0] != undefined
          ? features
              .filter(
                (feature) =>
                  feature.name.includes('EXPORT') &&
                  feature.type === 'ACTION' &&
                  feature.isActive
              )[0]
              .name.slice(7)
          : '',
    }
  }

  // Handlers
  exportHandler = (e: React.SyntheticEvent) => {
    const actions: ActionsList = {
      EXPORT_TO_JSON: () => {
        this.setState({
          format: 'JSON',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'JSON' } },
          '*'
        )
      },
      EXPORT_TO_CSS: () => {
        this.setState({
          format: 'CSS',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSS' } },
          '*'
        )
      },
      EXPORT_TO_SWIFT: () => {
        this.setState({
          format: 'SWIFT',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'SWIFT' } },
          '*'
        )
      },
      EXPORT_TO_XML: () => {
        this.setState({
          format: 'XML',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'XML' } },
          '*'
        )
      },
      EXPORT_TO_CSV: () => {
        this.setState({
          format: 'CSV',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSV' } },
          '*'
        )
      },
    }

    return actions[(e.target as HTMLElement).dataset.feature]?.()
  }

  // Direct actions
  setFirstPreview = () => {
    this.counter == 0 && this.state['format'] != ''
      ? parent.postMessage(
          {
            pluginMessage: {
              type: 'EXPORT_PALETTE',
              export: this.state['format'],
            },
          },
          '*'
        )
      : null
    this.counter = 1
  }

  selectPreview = (e) => e.target.select()

  deSelectPreview = () => window.getSelection().removeAllRanges()

  // Render
  render() {
    this.setFirstPreview()
    return (
      <>
        <div className="export-palette controls__control">
          <div>
            <div className="section-controls">
              <div className="section-controls__left-part">
                <div className="section-title">
                  {locals[this.props.lang].export.format}
                </div>
              </div>
            </div>
            <div className="export-palette__options">
              <ul>
                <Feature
                  isActive={
                    features.find((feature) => feature.name === 'EXPORT_JSON')
                      .isActive
                  }
                >
                  <li>
                    <RadioButton
                      id="options__json"
                      label={locals[this.props.lang].export.json}
                      isChecked={this.state['format'] === 'JSON' ? true : false}
                      isBlocked={isBlocked(
                        'EXPORT_JSON',
                        this.props.planStatus
                      )}
                      feature="EXPORT_TO_JSON"
                      group="fileFormat"
                      onChange={
                        isBlocked('EXPORT_JSON', this.props.planStatus)
                          ? () => null
                          : this.exportHandler
                      }
                    />
                  </li>
                </Feature>
                <Feature
                  isActive={
                    features.find((feature) => feature.name === 'EXPORT_CSS')
                      .isActive
                  }
                >
                  <li>
                    <RadioButton
                      id="options__css"
                      label={locals[this.props.lang].export.css}
                      isChecked={this.state['format'] === 'CSS' ? true : false}
                      isBlocked={isBlocked('EXPORT_CSS', this.props.planStatus)}
                      feature="EXPORT_TO_CSS"
                      group="fileFormat"
                      onChange={
                        isBlocked('EXPORT_CSS', this.props.planStatus)
                          ? () => null
                          : this.exportHandler
                      }
                    />
                  </li>
                </Feature>
                <Feature
                  isActive={
                    features.find((feature) => feature.name === 'EXPORT_SWIFT')
                      .isActive
                  }
                >
                  <li>
                    <RadioButton
                      id="options__swift"
                      label={locals[this.props.lang].export.swift}
                      isChecked={
                        this.state['format'] === 'SWIFT' ? true : false
                      }
                      isBlocked={isBlocked(
                        'EXPORT_SWIFT',
                        this.props.planStatus
                      )}
                      feature="EXPORT_TO_SWIFT"
                      group="fileFormat"
                      onChange={
                        isBlocked('EXPORT_SWIFT', this.props.planStatus)
                          ? () => null
                          : this.exportHandler
                      }
                    />
                  </li>
                </Feature>
                <Feature
                  isActive={
                    features.find((feature) => feature.name === 'EXPORT_XML')
                      .isActive
                  }
                >
                  <li>
                    <RadioButton
                      id="options__xml"
                      label={locals[this.props.lang].export.xml}
                      isChecked={this.state['format'] === 'XML' ? true : false}
                      isBlocked={isBlocked('EXPORT_XML', this.props.planStatus)}
                      feature="EXPORT_TO_XML"
                      group="fileFormat"
                      onChange={
                        isBlocked('EXPORT_XML', this.props.planStatus)
                          ? () => null
                          : this.exportHandler
                      }
                    />
                  </li>
                </Feature>
                <Feature
                  isActive={
                    features.find((feature) => feature.name === 'EXPORT_CSV')
                      .isActive
                  }
                >
                  <li>
                    <RadioButton
                      id="options__csv"
                      label={locals[this.props.lang].export.csv}
                      isChecked={this.state['format'] === 'CSV' ? true : false}
                      isBlocked={isBlocked('EXPORT_CSV', this.props.planStatus)}
                      feature="EXPORT_TO_CSV"
                      group="fileFormat"
                      onChange={
                        isBlocked('EXPORT_CSV', this.props.planStatus)
                          ? () => null
                          : this.exportHandler
                      }
                    />
                  </li>
                </Feature>
              </ul>
            </div>
          </div>
          <div>
            <div className="section-controls">
              <div className="section-controls__left-part">
                <div className="section-title">
                  {locals[this.props.lang].export.preview}
                </div>
              </div>
            </div>
            <div className="export-palette__options">
              <Input
                type="LONG_TEXT"
                value={this.props.exportPreview}
                isReadOnly={true}
                onBlur={this.deSelectPreview}
                onFocus={this.selectPreview}
              />
            </div>
          </div>
        </div>
        <Actions
          context="EXPORT"
          exportType={this.props.exportType}
          lang={this.props.lang}
          onExportPalette={this.props.onExportPalette}
        />
      </>
    )
  }
}
