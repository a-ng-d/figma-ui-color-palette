import React from 'react'
import type { AppStates } from '../App'
import type { Language } from '../../utils/types'
import { Dialog, Thumbnail, Chip, texts } from '@a_ng_d/figmug-ui'
import publishPalette from '../../bridges/publication/publishPalette'
import pushPalette from '../../bridges/publication/pushPalette'
import detachPalette from '../../bridges/publication/detachPalette'
import unpublishPalette from '../../bridges/publication/unpublishPalette'
import { locals } from '../../content/locals'
import { supabase } from '../../bridges/publication/authentication'
import { palettesDbTableName } from '../../utils/config'
import pullPalette from '../../bridges/publication/pullPalette'

interface PublicationProps {
  rawData: AppStates
  isPrimaryActionLoading: boolean
  isSecondaryActionLoading: boolean
  lang: Language
  onPrimaryActionLoading: (e: boolean) => void
  onSecondaryActionLoading: (e: boolean) => void
  onPalettePublished: React.Dispatch<Partial<AppStates>>
  onClosePublication: React.ReactEventHandler
}

type PublicationStatus = 'UNPUBLISHED' | 'CAN_BE_PUSHED' | 'MUST_BE_PULLED' | 'MAY_BE_PULLED' | 'PUBLISHED' | 'UP_TO_DATE' | 'CAN_BE_REVERTED' | 'IS_NOT_FOUND' | 'FROZEN'

interface PublicationStates {
  isPaletteShared: boolean
  publicationStatus: PublicationStatus
}

interface PublicationAction {
  label: string
  state: "LOADING" | "DEFAULT" | "DISABLED"
  action: React.EventHandler<any> | (() => void)
}

interface PublicationOption {
  label: string
  state: boolean
  action: React.EventHandler<any> | (() => void)
}

interface PublicationActions {
  primary: PublicationAction | undefined
  secondary: PublicationAction | undefined
}

export default class Publication extends React.Component<
  PublicationProps,
  PublicationStates
> {
  counter: number

  constructor(props: PublicationProps) {
    super(props)
    this.counter = 0
    this.state = {
      isPaletteShared: this.props.rawData.publicationStatus.isShared,
      publicationStatus: 'FROZEN',
    }
  }

  // Lifecycle
  componentDidMount = () => {
    if (this.props.rawData.publicationStatus.isPublished)
      this.callUICPAgent()
    else
      this.setState({
        publicationStatus: 'UNPUBLISHED'
      })
  }

  componentDidUpdate = (prevProps: Readonly<PublicationProps>) => {
    if (
      this.props.rawData.publicationStatus.isPublished &&
      prevProps.rawData.id !== this.props.rawData.id
    )
      this.callUICPAgent()
    else if (prevProps.rawData.id !== this.props.rawData.id)
      this.setState({
        publicationStatus: 'UNPUBLISHED'
      })
  }

  // Direct actions
  callUICPAgent = async () => {
    const localCreatorId = this.props.rawData.creatorIdentity.creatorId,
      localPublicationDate = new Date(this.props.rawData.dates.publishedAt),
      localUpdatedDate = new Date(this.props.rawData.dates.updatedAt)

    const { data, error } = await supabase
      .from(palettesDbTableName)
      .select('*')
      .eq('palette_id', this.props.rawData.id)

    console.log(data)

    if (!error && data.length !== 0) {
      const isMyPalette = data?.[0].creator_id === localCreatorId

      if (new Date(data[0].published_at) > localPublicationDate)
        this.setState({
          publicationStatus: isMyPalette ? 'MUST_BE_PULLED' : 'MAY_BE_PULLED'
        })
      else if (new Date(data[0].published_at) < localUpdatedDate)
        this.setState({
          publicationStatus: isMyPalette ? 'CAN_BE_PUSHED' : 'CAN_BE_REVERTED'
        })
      else
        this.setState({
          publicationStatus: isMyPalette ? 'PUBLISHED' : 'UP_TO_DATE'
        })
    } else
      this.setState({
        publicationStatus: 'IS_NOT_FOUND'
      })
  }

  getImageSrc = () => {
    if (this.props.rawData.screenshot !== null) {
      const blob = new Blob([this.props.rawData.screenshot], {
        type: 'image/png',
      })
      return URL.createObjectURL(blob)
    } else return ''
  }

  uploadPaletteScreenshot = () => {
    this.counter == 0
      ? parent.postMessage(
          {
            pluginMessage: {
              type: 'UPDATE_SCREENSHOT',
            },
          },
          '*'
        )
      : null
    this.counter = 1
  }

  getPaletteStatus = () => {
    if (this.state['publicationStatus'] === 'UNPUBLISHED')
      return (
        <Chip state="INACTIVE">
          {locals[this.props.lang].publication.statusUnpublished}
        </Chip>
      )
    else if (
      this.state['publicationStatus'] === 'CAN_BE_PUSHED'
      || this.state['publicationStatus'] === 'CAN_BE_REVERTED'
    )
      return <Chip>{locals[this.props.lang].publication.statusChanges}</Chip>
    else if (
      this.state['publicationStatus'] === 'PUBLISHED'
      || this.state['publicationStatus'] === 'UP_TO_DATE'
    )
      return (
        <Chip state="INACTIVE">
          {locals[this.props.lang].publication.statusUptoDate}
        </Chip>
      )
    else if (this.state['publicationStatus'] === 'IS_NOT_FOUND')
      return (
        <Chip state="INACTIVE">
          {locals[this.props.lang].publication.statusNotFound}
        </Chip>
      )
    else if (this.state['publicationStatus'] === 'FROZEN')
      return (
        <Chip state="INACTIVE">
          {locals[this.props.lang].publication.statusWaiting}
        </Chip>
      )
  }

  getPaletteMeta = () => {
    const colorsNumber = this.props.rawData.colors.length,
      themesNumber = this.props.rawData.themes.filter(
        (theme) => theme.type === 'custom theme'
      ).length

    let colorLabel: string, themeLabel: string

    if (colorsNumber > 1)
      colorLabel = locals[this.props.lang].actions.sourceColorsNumber.several
    else colorLabel = locals[this.props.lang].actions.sourceColorsNumber.single

    if (themesNumber > 1)
      themeLabel = locals[this.props.lang].actions.colorThemesNumber.several
    else themeLabel = locals[this.props.lang].actions.colorThemesNumber.single

    return `${colorsNumber} ${colorLabel}, ${themesNumber} ${themeLabel}`
  }

  publicationActions = (publicationStatus: PublicationStatus): PublicationActions => {
    const actions: Record<string, PublicationActions> = {
      UNPUBLISHED: {
        primary: {
          label: locals[this.props.lang].publication.publish,
          state: this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onPrimaryActionLoading(true)
            publishPalette(
              this.props.rawData,
              this.state['isPaletteShared']
            )
              .then((data) => {
                this.props.onPalettePublished(data)
              })
              .finally(() => {
                this.props.onPrimaryActionLoading(false)
                this.setState({
                  publicationStatus: 'PUBLISHED'
                })
              })
          }
        },
        secondary: undefined
      },
      CAN_BE_PUSHED: {
        primary: {
          label: locals[this.props.lang].publication.publish,
          state: this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onPrimaryActionLoading(true)
            pushPalette(
              this.props.rawData,
              this.state['isPaletteShared']
            )
              .then((data) => {
                this.props.onPalettePublished(data)
              })
              .finally(() => {
                this.props.onPrimaryActionLoading(false)
                this.setState({
                  publicationStatus: 'PUBLISHED'
                })
              })
          }
        },
        secondary: {
          label: locals[this.props.lang].publication.revert,
          state: this.props.isSecondaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onSecondaryActionLoading(true)
            pullPalette(
              this.props.rawData
            )
              .then((data) => {
                this.props.onPalettePublished(data)
              })
              .finally(() => {
                this.props.onSecondaryActionLoading(false)
                this.setState({
                  publicationStatus: 'PUBLISHED'
                })
              })
          }
        }
      },
      MUST_BE_PULLED: {
        primary: {
          label: locals[this.props.lang].publication.synchronize,
          state: this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onPrimaryActionLoading(true)
            pullPalette(
              this.props.rawData
            )
              .then((data) => {
                this.props.onPalettePublished(data)
              })
              .finally(() => {
                this.props.onPrimaryActionLoading(false)
                this.setState({
                  publicationStatus: 'PUBLISHED'
                })
              })
          }
        },
        secondary: {
          label: locals[this.props.lang].publication.detach,
          state: this.props.isSecondaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onSecondaryActionLoading(true)
            detachPalette(
              this.props.rawData,
            )
              .then((data) => {
                this.props.onPalettePublished(data)
              }).finally(() => {
                this.props.onSecondaryActionLoading(false)
                this.setState({
                  publicationStatus: 'UNPUBLISHED'
                })
              })
          }
        }
      },
      MAY_BE_PULLED: {
        primary: {
          label: locals[this.props.lang].publication.synchronize,
          state: this.props.isPrimaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onPrimaryActionLoading(true)
            pullPalette(
              this.props.rawData
            )
              .then((data) => {
                this.props.onPalettePublished(data)
              })
              .finally(() => {
                this.props.onPrimaryActionLoading(false)
                this.setState({
                  publicationStatus: 'UP_TO_DATE'
                })
              })
          }
        },
        secondary: {
          label: locals[this.props.lang].publication.detach,
          state: 'DEFAULT',
          action: async () => {
            this.props.onSecondaryActionLoading(true)
            detachPalette(
              this.props.rawData,
            )
              .then((data) => {
                this.props.onPalettePublished(data)
              }).finally(() => {
                this.props.onSecondaryActionLoading(false)
                this.setState({
                  publicationStatus: 'UNPUBLISHED'
                })
              })
          }
        }
      },
      PUBLISHED: {
        primary: {
          label: locals[this.props.lang].publication.publish,
          state: 'DISABLED',
          action: () => null
        },
        secondary: {
          label: locals[this.props.lang].publication.unpublish,
          state: this.props.isSecondaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onSecondaryActionLoading(true)
            unpublishPalette(
              this.props.rawData,
            )
              .then((data) => {
                this.props.onPalettePublished(data)
              }).finally(() => {
                this.props.onSecondaryActionLoading(false)
                this.setState({
                  publicationStatus: 'UNPUBLISHED'
                })
              })
          }
        }
      },
      UP_TO_DATE: {
        primary: {
          label: locals[this.props.lang].publication.synchronize,
          state: 'DISABLED',
          action: () => null
        },
        secondary: {
          label: locals[this.props.lang].publication.detach,
          state: this.props.isSecondaryActionLoading ? 'LOADING' : 'DEFAULT',
          action: async () => {
            this.props.onSecondaryActionLoading(true)
            detachPalette(
              this.props.rawData,
            )
              .then((data) => {
                this.props.onPalettePublished(data)
              }).finally(() => {
                this.props.onSecondaryActionLoading(false)
                this.setState({
                  publicationStatus: 'UNPUBLISHED'
                })
              })
          }
        }
      },
      IS_NOT_FOUND: {
        primary: {
          label: locals[this.props.lang].publication.detach,
          state: 'DEFAULT',
          action: async () => {
            this.props.onSecondaryActionLoading(true)
            detachPalette(
              this.props.rawData,
            )
              .then((data) => {
                this.props.onPalettePublished(data)
              }).finally(() => {
                this.props.onSecondaryActionLoading(false)
                this.setState({
                  publicationStatus: 'UNPUBLISHED'
                })
              })
          }
        },
        secondary: undefined
      },
      FROZEN: {
        primary: {
          label: locals[this.props.lang].publication.waiting,
          state: 'DISABLED',
          action: () => null
        },
        secondary: {
          label: locals[this.props.lang].publication.waiting,
          state: 'DISABLED',
          action: () => null
        }
      }
    }
    
    return actions[publicationStatus]
  }

  publicationOption = (publicationStatus: PublicationStatus): PublicationOption | undefined => {
    const actions: Record<string, PublicationOption | undefined> = {
      UNPUBLISHED: {   
        label: locals[this.props.lang].publication.selectToShare,
        state: this.state['isPaletteShared'],
        action: () => this.setState({ isPaletteShared: !this.state['isPaletteShared'] })
      },
      CAN_BE_PUSHED: {
        label: locals[this.props.lang].publication.selectToShare,
        state: this.state['isPaletteShared'],
        action: () => this.setState({ isPaletteShared: !this.state['isPaletteShared'] })
      },
      MUST_BE_PULLED: undefined,
      MAY_BE_PULLED: undefined,
      PUBLISHED: {
        label: locals[this.props.lang].publication.selectToShare,
        state: this.state['isPaletteShared'],
        action: () => this.setState({ isPaletteShared: !this.state['isPaletteShared'] })
      },
      UP_TO_DATE: undefined,
      IS_NOT_FOUND: undefined,
      FROZEN: undefined
    }
    
    return actions[publicationStatus]
  }

  render() {
    this.uploadPaletteScreenshot()
    console.log(this.state['publicationStatus'])
    //console.log(this.props.rawData.publicationStatus, this.props.rawData.dates, this.props.rawData.creatorIdentity)
    
    return (
      <Dialog
        title={locals[this.props.lang].publication.title}
        actions={this.publicationActions(this.state['publicationStatus'])}
        select={this.publicationOption(this.state['publicationStatus'])}
        onClose={this.props.onClosePublication}
      >
        <div className="dialog__cover dialog__cover--padding">
          <Thumbnail src={this.getImageSrc()} />
        </div>
        <div className={`dialog__text`}>
          <div>
            <div className={`${texts.type} type--large`}>
              {this.props.rawData.name === ''
                ? locals[this.props.lang].name
                : this.props.rawData.name}
              {this.getPaletteStatus()}
            </div>
            <div className={`${texts.type} type`}>
              {this.props.rawData.preset.name}
            </div>
            <div className={`${texts.type} ${texts['type--secondary']} type`}>
              {this.getPaletteMeta()}
            </div>
          </div>
          <div
            className={`type ${texts.type} ${texts['type--secondary']}`}
          ></div>
        </div>
      </Dialog>
    )
  }
}
