import type { PublicationDetails } from '../../utils/types'
import {
  databaseUrl,
  palettesDbTableName,
  palettesStorageName,
} from '../../utils/config'
import type { AppStates } from '../../ui/App'
import { supabase } from './authentication'
import { lang, locals } from '../../content/locals'

const publishPalette = async (
  rawData: AppStates,
  isShared = false
): Promise<PublicationDetails> => {
  let imageUrl = null

  if (rawData.screenshot !== null) {
    const { data, error } = await supabase.storage
      .from(palettesStorageName)
      .upload(
        `${rawData.userSession.userId}/${rawData.id}.png`,
        rawData.screenshot.buffer,
        {
          contentType: 'image/png',
        }
      )

    if (!error)
      imageUrl = `${databaseUrl}/storage/v1/object/public/${palettesStorageName}/${rawData.userSession.userId}/${rawData.id}.png`
  }

  const { data, error } = await supabase
    .from(palettesDbTableName)
    .insert([
      {
        palette_id: rawData.id,
        name:
          rawData.name === ''
            ? `${rawData.userSession.userFullName}'s UI COLOR PALETTE`
            : rawData.name,
        description: rawData.description,
        preset: rawData.preset,
        scale: rawData.scale,
        colors: rawData.colors,
        color_space: rawData.colorSpace,
        vision_simulation_mode: rawData.visionSimulationMode,
        themes: rawData.themes,
        view: rawData.view,
        text_colors_theme: rawData.textColorsTheme,
        algorithm_version: rawData.algorithmVersion,
        is_shared: isShared,
        screenshot: imageUrl,
        creator_full_name: rawData.userSession.userFullName,
        creator_avatar: rawData.userSession.userAvatar,
        creator_id: rawData.userSession.userId,
        created_at: rawData.dates.createdAt,
        updated_at: rawData.dates.updatedAt,
      },
    ])
    .select()
  console.log(data)

  if (!error) {
    const palettePublicationDetails = {
      creatorIdentity: {
        creatorFullName: rawData.userSession.userFullName,
        creatorAvatar: rawData.userSession.userAvatar,
        creatorId: rawData.userSession.userId ?? '',
      },
      dates: {
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      publicationStatus: {
        isPublished: true,
        isShared: isShared,
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
          message: locals[lang].success.publication,
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
          message: locals[lang].error.publication,
        },
      },
      '*'
    )
    throw error
  }
}

export default publishPalette