import * as React from 'react';
import FormItem from './../components/FormItem';
import Input from './../components/Input';

interface Props {
  paletteName: string;
  onSettingsChange: any
}

export default class Settings extends React.Component<Props> {

  inputHandler = (e: any) => this.props.onSettingsChange(e)

  render() {
    return (
      <div className='settings controls__control'>
        <div className='settings__group'>
          <div className='section-controls'>
            <div className='section-title'>Base information</div>
          </div>
          <div className='settings__item'>
            <FormItem
              label='Palette name'
              id='rename-palette'
            >
              <Input
                type='text'
                icon={{type: 'none', value: null}}
                placeholder='UI Color Palette'
                value={this.props.paletteName != '' ? this.props.paletteName : ''}
                charactersLimit={64}
                feature='rename-palette'
                onChange={this.inputHandler}
                onFocus={this.inputHandler}
              />
            </FormItem>
          </div>
        </div>
      </div>
    )
  }

}
