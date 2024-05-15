import type { PublicationDetails } from '../../utils/types'
import {
  palettesDbTableName,
  palettesStorageName,
} from '../../utils/config'
import type { AppStates } from '../../ui/App'
import { supabase } from './authentication'
import { lang, locals } from '../../content/locals'

const unpublishPalette = async (
  rawData: AppStates,
): Promise<PublicationDetails> => {
  if (rawData.screenshot !== null) {
    const { data, error } = await supabase.storage
      .from(palettesStorageName)
      .remove([
        `${rawData.userSession.userId}/${rawData.id}.png`,
      ])
  }

  const { data, error } = await supabase
    .from(palettesDbTableName)
    .delete()
    .match({ palette_id: rawData.id })

  console.log(data)

  if (!error) {
    const palettePublicationDetails = {
      creatorIdentity: {
        creatorFullName: '',
        creatorAvatar: '',
        creatorId: '',
      },
      dates: {
        publishedAt: '',
        createdAt: rawData.dates.createdAt,
        updatedAt: rawData.dates.updatedAt,
      },
      publicationStatus: {
        isPublished: false,
        isShared: false,
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
          message: locals[lang].success.nonPublication,
        },
      },
      '*'
    )
    return palettePublicationDetails
  } else {
    console.log(error)
    parent.postMessage(
      {
        pluginMessage: {
          type: 'SEND_MESSAGE',
          message: locals[lang].error.nonPublication,
        },
      },
      '*'
    )
    throw error
  }
}

export default unpublishPalette
