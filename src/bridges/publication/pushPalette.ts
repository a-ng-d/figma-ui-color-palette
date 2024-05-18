import { lang, locals } from '../../content/locals'
import type { AppStates } from '../../ui/App'
import { palettesDbTableName, palettesStorageName } from '../../utils/config'
import { supabase } from './authentication'

const pushPalette = async (
  rawData: AppStates,
  isShared = false
): Promise<Partial<AppStates>> => {
  const publishedAt = new Date().toISOString()

  if (rawData.screenshot !== null) {
    const { data, error } = await supabase.storage
      .from(palettesStorageName)
      .update(
        `${rawData.userSession.userId}/${rawData.id}.png`,
        rawData.screenshot.buffer,
        {
          contentType: 'image/png',
        }
      )
  }

  const { data, error } = await supabase
    .from(palettesDbTableName)
    .update([
      {
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
        creator_full_name: rawData.userSession.userFullName,
        creator_avatar: rawData.userSession.userAvatar,
        creator_id: rawData.userSession.userId,
        updated_at: rawData.dates.updatedAt,
        published_at: publishedAt,
      },
    ])
    .match({ palette_id: rawData.id })

  console.log(data)

  if (!error) {
    const palettePublicationDetails = {
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
              key: 'publishedAt',
              value: palettePublicationDetails.dates.publishedAt,
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

export default pushPalette
