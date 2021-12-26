import * as React from 'react';

export default class UpdatePalette extends React.Component {

  render() {
    return (
      <section>
        <div className='message'>
          <div className='onboarding-tip'>
            <div className='icon icon--warning'></div>
            <div className='onboarding-tip__msg'>Select an Awesome palette to update its lightness scale</div>
          </div>
        </div>
      </section>
    )
  }

}
