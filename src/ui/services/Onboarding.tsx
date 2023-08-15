import * as React from 'react'
import type { Language } from '../../utils/types'
import Icon from './../modules/Icon'
import Message from '../components/Message'
import { locals } from '../../content/locals'

interface Props {
  planStatus: 'UNPAID' | 'PAID'
  lang: Language
}

export default class Onboarding extends React.Component<Props> {
  render() {
    return (
      <>
        <section className="controller">
          <div className="onboarding controls__control">
            <div className="onboarding__icon">
              <Icon size={64} />
            </div>
            <div className="onboarding__messages">
              <Message
                icon="list-tile"
                messages={[locals[this.props.lang].onboarding.selectColor]}
              />
              <div className="type">－ or －</div>
              <Message
                icon="layout-grid-uniform"
                messages={[locals[this.props.lang].onboarding.selectPalette]}
              />
            </div>
          </div>
        </section>
      </>
    )
  }
}
