import { uid } from 'uid'
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
  const
    now = new Date().toISOString(),
    name =
      rawData.name === ''
        ? `${rawData.userSession.userFullName}'s UI COLOR PALETTE`
        : rawData.name,
    id = uid()

  if (rawData.screenshot !== null) {
    const { error } = await supabase.storage
      .from(palettesStorageName)
      .upload(
        `${rawData.userSession.userId}/${id}.png`,
        rawData.screenshot.buffer,
        {
          contentType: 'image/png',
          upsert: true,
        }
      )

    if (!error)
      imageUrl = `${databaseUrl}/storage/v1/object/public/${palettesStorageName}/${rawData.userSession.userId}/${id}.png`
    else throw error
  }

  const { error } = await supabase
    .from(palettesDbTableName)
    .insert([
      {
        palette_id: id,
        name: name,
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
        updated_at: now,
        published_at: now,
      },
    ])
    .select()

  if (!error) {
    const palettePublicationDetails = {
      id: id,
      name: name,
      dates: {
        publishedAt: now,
        createdAt: rawData.dates.createdAt,
        updatedAt: now,
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
              key: 'id',
              value: palettePublicationDetails.id,
            },
            {
              key: 'name',
              value: palettePublicationDetails.name,
            },
            {
              key: 'publishedAt',
              value: palettePublicationDetails.dates.publishedAt,
            },
            {
              key: 'updatedAt',
              value: palettePublicationDetails.dates.updatedAt,
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

    parent.postMessage(
      {
        pluginMessage: {
          type: 'UPDATE_SETTINGS',
          data: {
            name: palettePublicationDetails.name,
            description: rawData.description,
            colorSpace: rawData.colorSpace,
            visionSimulationMode: rawData.visionSimulationMode,
            textColorsTheme: rawData.textColorsTheme,
            algorithmVersion: rawData.algorithmVersion,
          },
          isEditedInRealTime: false,
          isSynchronized: true,
        },
      },
      '*'
    )

    return palettePublicationDetails
  } else throw error
}

export default publishPalette
