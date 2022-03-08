import * as React from 'react';
import chroma from 'chroma-js';

interface Props {
  name: string;
  hex: string
};

export default class ColorItem extends React.Component<Props> {

  render() {
    console.log(this.props.hex)
    return(
      <li className='colors__item' key={this.props.name}>
        <label className='label'>{this.props.name}</label>
        <div className='colors__parameters'>
          <div className='input input--with-icon'>
            <div className='icon'><input type='color' value={this.props.hex} /></div>
            <input type='input' className='input__field' value={this.props.hex.toUpperCase().substr(1, 6)} />
          </div>
          <div className='input input--with-icon'>
            <div className='icon'>L</div>
            <input type='number' className='input__field' value={chroma(this.props.hex).lch()[0].toFixed(0)} min='0' max='100' />
          </div>
          <div className='input input--with-icon'>
            <div className='icon'>C</div>
            <input type='number' className='input__field' value={chroma(this.props.hex).lch()[1].toFixed(0)} min='0' max='100' />
          </div>
          <div className='input input--with-icon'>
            <div className='icon'>H</div>
            <input type='number' className='input__field' value={chroma(this.props.hex).lch()[2].toFixed(0)} min='0' max='255' />
          </div>
        </div>
        <div className='icon-button'>
          <div className='icon icon--minus'></div>
        </div>
      </li>
    )
  }

}
