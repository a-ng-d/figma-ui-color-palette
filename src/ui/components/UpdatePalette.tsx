import * as React from 'react';
import Slider from './Slider';

interface Props {
  isPaletteSelected: boolean;
};

export default class UpdatePalette extends React.Component<Props> {

  // Templates
  Message = () => {
    return (
      <div className='message'>
        <div className='onboarding-tip'>
          <div className='icon icon--warning'></div>
          <div className='onboarding-tip__msg'>Select an Awesome palette to update its lightness scale</div>
        </div>
      </div>
    )
  }

  Scale = () => {
    return (
      <div className='lightness-scale'>
        <div className='section-title'>Lightness scale</div>
        <Slider />
        <div className='onboarding-tip'>
          <div className='icon icon--library'></div>
          <div className='onboarding-tip__msg'>Hold Shift ⇧ while dragging 50 or 900 to distribute knobs' horizontal spacing</div>
          <div className='onboarding-tip__msg'>Hold Ctrl or Cmd ⌘ while dragging a scale to shift every one</div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <section>
        {this.props.palette == false ? <this.Message /> : null}
        {this.props.palette == true ? <this.Scale /> : null}
      </section>
    )
  }

}
