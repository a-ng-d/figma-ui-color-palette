import { lang, locals } from '../../content/locals'
import type { AppStates } from '../../ui/App'

const detachPalette = async (
  rawData: AppStates
): Promise<Partial<AppStates>> => {
  const palettePublicationDetails = {
    dates: {
      publishedAt: '',
      createdAt: rawData.dates.createdAt,
      updatedAt: rawData.dates.updatedAt,
    },
    publicationStatus: {
      isPublished: false,
      isShared: false,
    },
    creatorIdentity: {
      creatorFullName: '',
      creatorAvatar: '',
      creatorId: '',
    },
  }

  parent.postMessage(
    {
      pluginMessage: {
        type: 'SET_DATA',
        items: [
          {
            key: 'publishedAt',
            value: palettePublicationDetails.dates.publishedAt,
          },
          {
            key: 'isPublished',
            value:
              palettePublicationDetails.publicationStatus.isPublished.toString(),
          },
          {
            key: 'isShared',
            value:
              palettePublicationDetails.publicationStatus.isShared.toString(),
          },
          {
            key: 'creatorAvatar',
            value: palettePublicationDetails.creatorIdentity.creatorAvatar,
          },
          {
            key: 'creatorFullName',
            value: palettePublicationDetails.creatorIdentity.creatorFullName,
          },
          {
            key: 'creatorId',
            value: palettePublicationDetails.creatorIdentity.creatorId,
          },
        ],
      },
    },
    '*'
  )
  parent.postMessage(
    {
      pluginMessage: {
        type: 'SEND_MESSAGE',
        message: locals[lang].success.detachment,
      },
    },
    '*'
  )
  return palettePublicationDetails
}

export default detachPalette
