import * as React from 'react';

interface Props {
  id: string;
  value: string;
  min: string;
  max: string;
  step: string;
  onChange: any
};

export default class NumericStepper extends React.Component<Props> {

  render() {
    return(
      <div className='input'>
        <input type='number' min={this.props.min} max={this.props.max} step={this.props.step} className='input__field' value={this.props.value} onChange={this.props.onChange} />
      </div>
    )
  }

}
