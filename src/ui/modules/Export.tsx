import * as React from 'react';
import RadioButton from './../components/RadioButton'

interface Props {
  exportType: string;
  onFileFormatChange: any
};

export default class Export extends React.Component<Props> {

  render() {
    return (
      <div className='export-palette controls__control'>
        <div>
          <div className='section-controls'>
            <div className='section-title'>File format</div>
          </div>
          <ul className="options">
            <li>
              <RadioButton
                id='options__json'
                label='JSON'
                isChecked={this.props.exportType === 'JSON' ? true : false}
                isDisabled={false}
                feature='export-to-json'
                group='fileFormat'
                onChange={this.props.onFileFormatChange}
              />
            </li>
          </ul>
        </div>
      </div>
    )
  }

}
