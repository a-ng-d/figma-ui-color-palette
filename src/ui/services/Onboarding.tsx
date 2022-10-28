import * as React from 'react';
import Icon from './../modules/Icon'
import Message from '../components/Message';

export default class Onboarding extends React.Component {

  render() {
    return (
      <section>
        <div className='onboarding controls__control'>
          <Icon size={48} />
          <Message
            icon='list-tile'
            messages= {[
              'Select your colors (layers filled with a solid color) on the Figma canvas to create an UI Color Palette',
            ]}
          />
          <div className='type'>－ or －</div>
          <Message
            icon='theme'
            messages= {[
              'Select an UI Color Palette to edit it'
            ]}
          />
        </div>
      </section>
    )
  }

}
