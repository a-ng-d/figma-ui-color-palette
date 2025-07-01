import chroma from 'chroma-js'
import { Data, FullConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'

const updateLocalVariables = async (id: string) => {
  const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)

  if (rawPalette === undefined || rawPalette === null)
    throw new Error(locales.get().error.unfoundPalette)

  const palette = JSON.parse(rawPalette) as FullConfiguration

  palette.libraryData = new Data(palette).makeLibraryData(
    [
      'style_id',
      'collection_id',
      'variable_id',
      'mode_id',
      'alpha',
      'gl',
      'description',
    ],
    palette.libraryData
  )

  const name: string =
    palette.base.name === '' ? locales.get().name : palette.base.name
  const canDeepSyncVariables = await figma.clientStorage.getAsync(
    'can_deep_sync_variables'
  )
  const hasThemes = palette.libraryData.some(
    (item) => !item.id.includes('00000000000')
  )

  const collection = await figma.variables
    .getLocalVariableCollectionsAsync()
    .then((collections) =>
      collections.find(
        (collection) => collection.id === palette.libraryData[0].collectionId
      )
    )

  if (collection !== undefined) {
    const updateLocalVariablesStatusMessage = figma.variables
      .getLocalVariablesAsync()
      .then((allLocalVariables) =>
        allLocalVariables.filter(
          (localVariable) =>
            localVariable.variableCollectionId === collection?.id
        )
      )
      .then((localVariables) => {
        let i = 0,
          j = 0,
          k = 0,
          l = 0,
          m = 0
        const messages: Array<string> = []

        if (collection.name !== name && (canDeepSyncVariables ?? false))
          collection.name = name

        if (canDeepSyncVariables ?? false) {
          collection.modes.forEach((mode) => {
            const themeMatch = palette.libraryData.some(
              (theme) => theme.modeId === mode.modeId
            )
            if (!themeMatch) {
              collection.removeMode(mode.modeId)
              m++
            }
          })
          localVariables.forEach((localVariable) => {
            const shadeMatch = palette.libraryData.some(
              (item) => item.variableId === localVariable.id
            )
            if (!shadeMatch) {
              localVariable.remove()
              l++
            }
          })
        }

        palette.libraryData
          .filter((item) => {
            return hasThemes
              ? !item.id.includes('00000000000')
              : item.id.includes('00000000000')
          })
          .forEach((item) => {
            const modeMatch = collection.modes.find(
              (mode) => mode.modeId === item.modeId
            )
            const variableMatch = localVariables.find(
              (localVariable) => localVariable.id === item.variableId
            )

            if (modeMatch !== undefined)
              if (
                modeMatch.name !== item.themeName &&
                !item.id.includes('00000000000')
              ) {
                collection.renameMode(modeMatch.modeId, item.themeName)
                j++
              }

            if (
              variableMatch !== undefined &&
              modeMatch !== undefined &&
              item.gl !== undefined &&
              item.modeId !== undefined
            ) {
              const variableMatchHex = chroma([
                (variableMatch.valuesByMode[item.modeId] as RGBA).r * 255,
                (variableMatch.valuesByMode[item.modeId] as RGBA).g * 255,
                (variableMatch.valuesByMode[item.modeId] as RGBA).b * 255,
              ]).hex()
              const itemHex = chroma([
                (item.gl ?? [0, 0, 0])[0] * 255,
                (item.gl ?? [0, 0, 0])[1] * 255,
                (item.gl ?? [0, 0, 0])[2] * 255,
              ]).hex()
              const variableMatchOpacity = parseFloat(
                (variableMatch.valuesByMode[item.modeId] as RGBA).a.toFixed(
                  2
                ) ?? '1'
              )

              if (
                variableMatch.name !== `${item.colorName}/${item.shadeName}`
              ) {
                variableMatch.name = `${item.colorName}/${item.shadeName}`
                k++
              }

              if (variableMatch.description !== item.description) {
                variableMatch.description = item.description ?? ''
                k++
              }

              if (
                variableMatchHex !== itemHex ||
                variableMatchOpacity !== (item.alpha ?? 1)
              ) {
                variableMatch.setValueForMode(item.modeId, {
                  r: (item.gl ?? [0, 0, 0])[0],
                  g: (item.gl ?? [0, 0, 0])[1],
                  b: (item.gl ?? [0, 0, 0])[2],
                  a: item.alpha ?? 1,
                })
                k++
              }
            }
            if (k > 0) i++
            k = 0
          })

        if (i > 1 && j > 1)
          messages.push(
            locales
              .get()
              .info.updatedVariablesAndModes.pluralPlural.replace(
                '{$1}',
                i.toString()
              )
              .replace('{$2}', j.toString())
          )
        else if (i === 1 && j === 1)
          messages.push(
            locales.get().info.updatedVariablesAndModes.singleSingle
          )
        else if (i === 0 && j === 0)
          messages.push(locales.get().info.updatedVariablesAndModes.noneNone)
        else if (i > 1 && j === 1)
          messages.push(
            locales
              .get()
              .info.updatedVariablesAndModes.pluralSingle.replace(
                '{$1}',
                i.toString()
              )
          )
        else if (i === 1 && j > 1)
          messages.push(
            locales
              .get()
              .info.updatedVariablesAndModes.singlePlural.replace(
                '{$1}',
                j.toString()
              )
          )
        else if (i > 1 && j === 0)
          messages.push(
            locales
              .get()
              .info.updatedVariablesAndModes.pluralNone.replace(
                '{$1}',
                i.toString()
              )
          )
        else if (i === 0 && j > 1)
          messages.push(
            locales
              .get()
              .info.updatedVariablesAndModes.nonePlural.replace(
                '{$1}',
                j.toString()
              )
          )
        else if (i === 1 && j === 0)
          messages.push(locales.get().info.updatedVariablesAndModes.singleNone)
        else if (i === 0 && j === 1)
          messages.push(locales.get().info.updatedVariablesAndModes.noneSingle)

        if (l > 1 && m > 1)
          messages.push(
            locales
              .get()
              .info.removedVariablesAndModes.pluralPlural.replace(
                '{$1}',
                l.toString()
              )
              .replace('{$2}', m.toString())
          )
        else if (l === 1 && m === 1)
          messages.push(
            locales.get().info.removedVariablesAndModes.singleSingle
          )
        else if (l === 0 && m === 0)
          messages.push(locales.get().info.removedVariablesAndModes.noneNone)
        else if (l > 1 && m === 1)
          messages.push(
            locales
              .get()
              .info.removedVariablesAndModes.pluralSingle.replace(
                '{$1}',
                l.toString()
              )
          )
        else if (l === 1 && m > 1)
          messages.push(
            locales
              .get()
              .info.removedVariablesAndModes.singlePlural.replace(
                '{$1}',
                m.toString()
              )
          )
        else if (l > 1 && m === 0)
          messages.push(
            locales
              .get()
              .info.removedVariablesAndModes.pluralNone.replace(
                '{$1}',
                l.toString()
              )
          )
        else if (l === 0 && m > 1)
          messages.push(
            locales
              .get()
              .info.removedVariablesAndModes.nonePlural.replace(
                '{$1}',
                m.toString()
              )
          )
        else if (l === 1 && m === 0)
          messages.push(locales.get().info.removedVariablesAndModes.singleNone)
        else if (l === 0 && m === 1)
          messages.push(locales.get().info.removedVariablesAndModes.noneSingle)

        return messages.join(locales.get().separator)
      })

    return await updateLocalVariablesStatusMessage
  }
}

export default updateLocalVariables
