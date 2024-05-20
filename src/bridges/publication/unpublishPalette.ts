import type { AppStates } from '../../ui/App'
import { palettesDbTableName, palettesStorageName } from '../../utils/config'
import { supabase } from './authentication'

const unpublishPalette = async (
  rawData: AppStates
): Promise<Partial<AppStates>> => {
  if (rawData.screenshot !== null) {
    const { error } = await supabase.storage
      .from(palettesStorageName)
      .remove([`${rawData.userSession.userId}/${rawData.id}.png`])
    
    if (error) throw error
  }

  const { error } = await supabase
    .from(palettesDbTableName)
    .delete()
    .match({ palette_id: rawData.id })

  if (!error) {
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

    return palettePublicationDetails
  } else throw error
}

export default unpublishPalette
