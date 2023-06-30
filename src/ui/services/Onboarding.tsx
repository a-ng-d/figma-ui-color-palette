import * as React from 'react'
import Feature from '../components/Feature'
import Icon from './../modules/Icon'
import Message from '../components/Message'
import Shortcuts from '../modules/Shortcuts'
import features from '../../utils/features'
import { locals } from '../../content/locals'

interface Props {
  planStatus: string
  lang: string
  onReopenHighlight: React.MouseEventHandler
}

export default class Onboarding extends React.Component<Props> {
  render = () => {
    return (
      <>
        <section>
          <div className="onboarding controls__control">
            <Icon size={48} />
            <Message
              icon="list-tile"
              messages={[locals[this.props.lang].onboarding.selectColor]}
            />
            <div className="type">－ or －</div>
            <Message
              icon="theme"
              messages={[locals[this.props.lang].onboarding.selectPalette]}
            />
          </div>
        </section>
        <Feature
          isActive={
            features.find((feature) => feature.name === 'SHORTCUTS').isActive
          }
        >
          <Shortcuts
            actions={[
              {
                label: locals[this.props.lang].shortcuts.documentation,
                isLink: true,
                url: 'https://docs.ui-color-palette.com',
                action: null,
              },
              {
                label: locals[this.props.lang].shortcuts.feedback,
                isLink: true,
                url: 'https://uicp.link/feedback',
                action: null,
              },
              {
                label: locals[this.props.lang].shortcuts.news,
                isLink: false,
                url: '',
                action: this.props.onReopenHighlight,
              },
            ]}
            planStatus={this.props.planStatus}
            lang={this.props.lang}
          />
        </Feature>
      </>
    )
  }
}
