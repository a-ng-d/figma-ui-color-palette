import * as React from 'react'
import RadioButton from './../components/RadioButton'

interface Props {
  exportPreview: string
}

export default class Export extends React.Component<Props> {
  counter: number

  constructor(props) {
    super(props)
    this.counter = 0
    this.state = {
      format: 'JSON',
    }
  }

  // Handlers
  exportHandler = (e: any) => {
    switch (e.target.dataset.feature) {
      case 'export-to-json': {
        this.setState({
          format: 'JSON',
        })
        parent.postMessage(
          { pluginMessage: { type: 'export-palette', export: 'JSON' } },
          '*'
        )
        break
      }
      case 'export-to-css': {
        this.setState({
          format: 'CSS',
        })
        parent.postMessage(
          { pluginMessage: { type: 'export-palette', export: 'CSS' } },
          '*'
        )
        break
      }
      case 'export-to-csv': {
        this.setState({
          format: 'CSV',
        })
        parent.postMessage(
          { pluginMessage: { type: 'export-palette', export: 'CSV' } },
          '*'
        )
      }
    }
  }

  setFirstPreview = () => {
    this.counter == 0
      ? parent.postMessage(
          {
            pluginMessage: {
              type: 'export-palette',
              export: this.state['format'],
            },
          },
          '*'
        )
      : null
    this.counter = 1
  }

  // Render
  render() {
    this.setFirstPreview()
    return (
      <div className="export-palette controls__control">
        <div>
          <div className="section-controls">
            <div className="section-title">File format</div>
          </div>
          <div className="export-palette__options">
            <ul>
              <li>
                <RadioButton
                  id="options__json"
                  label="JSON"
                  isChecked={this.state['format'] === 'JSON' ? true : false}
                  isDisabled={false}
                  feature="export-to-json"
                  group="fileFormat"
                  onChange={this.exportHandler}
                />
              </li>
              <li>
                <RadioButton
                  id="options__css"
                  label="CSS Custom Properties"
                  isChecked={this.state['format'] === 'CSS' ? true : false}
                  isDisabled={false}
                  feature="export-to-css"
                  group="fileFormat"
                  onChange={this.exportHandler}
                />
              </li>
              <li>
                <RadioButton
                  id="options__csv"
                  label="CSV (LCH)"
                  isChecked={this.state['format'] === 'CSV' ? true : false}
                  isDisabled={false}
                  feature="export-to-csv"
                  group="fileFormat"
                  onChange={this.exportHandler}
                />
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div className="section-controls">
            <div className="section-title">Preview</div>
          </div>
          <div className="export-palette__options">
            <textarea
              className="export-palette__preview textarea"
              value={this.props.exportPreview}
              readOnly
            ></textarea>
          </div>
        </div>
      </div>
    )
  }
}
