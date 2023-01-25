import * as React from 'react';

interface Props {
  id: string;
  label: string;
  children: any
}

export default class FormItem extends React.Component<Props> {

  render() {
    return (
      <div className='form-item'>
        <label className='type' htmlFor={this.props.id}>{this.props.label}</label>
        {this.props.children}
      </div>
    )
  }

}
