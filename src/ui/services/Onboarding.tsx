import * as React from 'react';
import Message from '../components/Message';

export default class Onboarding extends React.Component {

  render() {
    return (
      <section>
        <div className='onboarding'>
          <div className='plugin-icon'></div>
          <Message
            icon='list-tile'
            messages= {[
              'Select your starting colors on the Figma canvas to create a UI Color Palette (from the layers filled with a solid color)',
            ]}
          />
          <div className='label'>or</div>
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
