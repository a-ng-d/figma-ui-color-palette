import * as React from 'react';
import Button from '../components/Button';
import Icon from './Icon'
const package_json = require('./../../../package.json')

interface Props {

};

export default class About extends React.Component<Props> {

  render() {
    return (
      <div className='about controls__control'>
        <div>
            <Icon size={32} />
            <div>
              <div className='type type--xlarge'>UI Color Palette</div>
              <div className='type'>{`Version ${package_json.version.slice(0, 1) + package_json.version.slice(2, 3)}`}</div>
            </div>
            <p className='type'>Created and maintained by <a href='https://an.gd' target='_blank'>Aurélien Grimaud</a></p>
        </div>
        <div>
          <div>
            <div className='type type--bold'>Get help</div>
            <div className='about__links'>
              <button className='button button--tertiary'><a href='https://docs.ui-color-palette.com' target='_blank'>Read the documentation</a></button>
              ﹒
              <button className='button button--tertiary'><a href='mailto:hello@ui-color-palette.com' target='_blank'>Send an email</a></button>
            </div>
          </div>
          <div>
            <div className='type type--bold'>Be involved</div>
            <div className='about__links'>
              <button className='button button--tertiary'><a href='https://github.com/inVoltag/figma-ui-color-palette/issues/new' target='_blank'>Open an issue</a></button>
            </div>
          </div>
          <div>
            <div className='type type--bold'>Give support</div>
            <div className='about__links'>
              <button className='button button--tertiary'><a href='https://twitter.com/a_ng_d' target='_blank'>Follow my activity</a></button>
              ﹒
              <button className='button button--tertiary'><a href='https://www.buymeacoffee.com/a_ng_d' target='_blank'>Buy me a coffee</a></button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
