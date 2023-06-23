import * as React from 'react'
import type { ActionsList } from '../../utils/types'
import Feature from '../components/Feature'
import RadioButton from './../components/RadioButton'
import Actions from './Actions'
import Shortcuts from './Shortcuts'
import features from '../../utils/features'
import isBlocked from '../../utils/isBlocked'
import { locals } from '../../content/locals'

interface Props {
  exportPreview: string
  planStatus: string
  exportType: string
  onExportPalette: () => void
  onReopenHighlight: React.ChangeEventHandler
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
      EXPORT_TO_CSV: () => {
        this.setState({
          format: 'CSV',
        })
        parent.postMessage(
          { pluginMessage: { type: 'EXPORT_PALETTE', export: 'CSV' } },
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
      }
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
                <div className="section-title">{locals.en.export.format}</div>
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
                      label={locals.en.export.json}
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
                      label={locals.en.export.css}
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
                    features.find((feature) => feature.name === 'EXPORT_CSV')
                      .isActive
                  }
                >
                  <li>
                    <RadioButton
                      id="options__csv"
                      label={locals.en.export.csv}
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
                <Feature
                  isActive={
                    features.find((feature) => feature.name === 'EXPORT_SWIFT')
                      .isActive
                  }
                >
                  <li>
                    <RadioButton
                      id="options__swift"
                      label={locals.en.export.swift}
                      isChecked={this.state['format'] === 'SWIFT' ? true : false}
                      isBlocked={isBlocked('EXPORT_SWIFT', this.props.planStatus)}
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
              </ul>
            </div>
          </div>
          <div>
            <div className="section-controls">
              <div className="section-controls__left-part">
                <div className="section-title">{locals.en.export.preview}</div>
              </div>
            </div>
            <div className="export-palette__options">
              <textarea
                className="export-palette__preview textarea"
                value={this.props.exportPreview}
                onBlur={this.deSelectPreview}
                onFocus={this.selectPreview}
                readOnly
              ></textarea>
            </div>
          </div>
        </div>
        <Actions
          context="EXPORT"
          exportType={this.props.exportType}
          onExportPalette={this.props.onExportPalette}
        />
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SHORTCUTS').isActive
          }
        >
          <Shortcuts
            actions={[
              {
                label: locals.en.shortcuts.documentation,
                isLink: true,
                url: 'https://docs.ui-color-palette.com',
                action: null,
              },
              {
                label: locals.en.shortcuts.feedback,
                isLink: true,
                url: 'https://uicp.link/feedback',
                action: null,
              },
              {
                label: locals.en.shortcuts.news,
                isLink: false,
                url: '',
                action: this.props.onReopenHighlight,
              },
            ]}
            planStatus={this.props.planStatus}
          />
        </Feature>
      </>
    )
  }
}
