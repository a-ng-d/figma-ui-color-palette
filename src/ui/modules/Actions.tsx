import * as React from 'react';
import Button from '../components/Button';
import Checkbox from '../components/Checkbox';
import Switch from '../components/Switch';

interface Props {
  context: string;
  hasCaptions: boolean;
  exportType: string | null;
  onCreatePalette: any;
  onCreateLocalColors: any;
  onUpdateLocalColors: any;
  onChangeCaptions: any;
  onExportPalette: any
};

export default class Actions extends React.Component<Props> {

  Create = () => {
    return (
      <div className='actions'>
        <div className='buttons'>
          <Button
            icon={null}
            type='primary'
            label='Create a color palette'
            state=''
            feature='create'
            action={this.props.onCreatePalette}
          />
        </div>
        <Checkbox
          id='showCaptions'
          label='Show captions'
          isChecked={this.props.hasCaptions}
          isDisabled={false}
          feature='show-caption'
          onChange={this.props.onChangeCaptions}
        />
      </div>
    )
  }

  Edit = () => {
    return (
      <div className='actions'>
        <div className='buttons'>
          <Button
            icon={null}
            type='secondary'
            label='Update the local styles'
            state=''
            feature='update'
            action={this.props.onUpdateLocalColors}
          />
          <Button
            icon={null}
            type='primary'
            label='Create local styles'
            state=''
            feature='create'
            action={this.props.onCreateLocalColors}
          />
        </div>
        <Switch
          id='showCaptions'
          label='Show captions'
          isChecked={this.props.hasCaptions}
          isDisabled={false}
          feature='caption'
          onChange={this.props.onChangeCaptions}
        />
      </div>
    )
  }

  Export = () => {
    return (
      <div className='actions'>
        <div className='buttons'>
          <Button
            icon={null}
            type='primary'
            label={`Export to ${this.props.exportType}`}
            state=''
            feature='export'
            action={this.props.onExportPalette}
          >
            <a></a>
          </Button>
        </div>
      </div>
    )
  }

  render() {
    return (
      <>
        {this.props.context === 'create' ? <this.Create /> : null}
        {this.props.context === 'edit' ? <this.Edit /> : null}
        {this.props.context === 'export' ? <this.Export /> : null}
      </>
    )
  }

}
