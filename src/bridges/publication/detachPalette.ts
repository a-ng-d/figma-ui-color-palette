import { lang, locals } from '../../content/locals'
import type { AppStates } from '../../ui/App'

const detachPalette = async (
  rawData: AppStates
): Promise<Partial<AppStates>> => {
  const palettePublicationDetails = {
    id: '',
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
            key: 'id',
            value: palettePublicationDetails.id,
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
  parent.postMessage(
    {
      pluginMessage: {
        type: 'UPDATE_GLOBAL',
        data: {
          ...rawData,
          ...palettePublicationDetails,
        },
      },
    },
    '*'
  )

  return palettePublicationDetails
}

export default detachPalette
