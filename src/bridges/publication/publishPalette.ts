import type { AppStates } from '../../ui/App'
import {
  databaseUrl,
  palettesDbTableName,
  palettesStorageName,
} from '../../utils/config'
import { supabase } from './authentication'

const publishPalette = async (
  rawData: AppStates,
  isShared = false
): Promise<Partial<AppStates>> => {
  let imageUrl = null
  const publishedAt = new Date().toISOString()

  if (rawData.screenshot !== null) {
    const { error } = await supabase.storage
      .from(palettesStorageName)
      .upload(
        `${rawData.userSession.userId}/${rawData.id}.png`,
        rawData.screenshot.buffer,
        {
          contentType: 'image/png',
          upsert: true,
        }
      )

    if (!error)
      imageUrl = `${databaseUrl}/storage/v1/object/public/${palettesStorageName}/${rawData.userSession.userId}/${rawData.id}.png`
    else throw error
  }

  const { error } = await supabase
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
        published_at: publishedAt,
      },
    ])
    .select()

  if (!error) {
    const palettePublicationDetails = {
      name:
        rawData.name === ''
          ? `${rawData.userSession.userFullName}'s UI COLOR PALETTE`
          : rawData.name,
      dates: {
        publishedAt: publishedAt,
        createdAt: rawData.dates.createdAt,
        updatedAt: rawData.dates.updatedAt,
      },
      publicationStatus: {
        isPublished: true,
        isShared: isShared,
      },
      creatorIdentity: {
        creatorFullName: rawData.userSession.userFullName,
        creatorAvatar: rawData.userSession.userAvatar,
        creatorId: rawData.userSession.userId ?? '',
      },
    }

    parent.postMessage(
      {
        pluginMessage: {
          type: 'SET_DATA',
          items: [
            {
              key: 'name',
              value: palettePublicationDetails.name,
            },
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
              key: 'creatorFullName',
              value: palettePublicationDetails.creatorIdentity.creatorFullName,
            },
            {
              key: 'creatorAvatar',
              value: palettePublicationDetails.creatorIdentity.creatorAvatar,
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

export default publishPalette
