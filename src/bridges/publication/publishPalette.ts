import { lang, locals } from "../../content/locals"
import { databaseUrl, palettesDbTableName, palettesStorageName } from "../../utils/config"
import { supabase } from "./authentication"

const publishPalette = async (rawData: any) => {
  const { data, error } = await supabase
    .storage
    .from(palettesStorageName)
    .upload(
      `${rawData.userSession.userId}/${rawData.id}.png`,
      rawData.screenshot.buffer,
      {
        contentType: 'image/png'
      }
    )
  
  if (!error) {
    const { data, error } = await supabase
      .from(palettesDbTableName)
      .insert([
        {
          palette_id: rawData.id,
          name: rawData.name === ''
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
          is_shared: false,
          screenshot: `${databaseUrl}/storage/v1/object/public/${palettesStorageName}/${rawData.userSession.userId}/${rawData.id}.png`,
          creator_id: rawData.userSession.userId,
          created_at: rawData.dates.createdAt,
          updated_at: rawData.dates.updatedAt,
        },
      ])
      .select()
    console.log(data)
    
    if (!error) {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'SET_DATA',
            items: [
              {
                key: 'publishedAt',
                value: new Date().toISOString(),
              },
              {
                key: 'isPublished',
                value: 'true',
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
    }
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
  }
}

export default publishPalette
