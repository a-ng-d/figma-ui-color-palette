import {
  Data,
  FullConfiguration,
  LibraryData,
} from '@a_ng_d/utils-ui-color-palette'
import { locales } from '../../content/locales'
import LocalVariable from '../../canvas/LocalVariable'

const createLocalVariables = async (id: string) => {
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

  const collection = await figma.variables
    .getLocalVariableCollectionsAsync()
    .then((collections) =>
      collections.find(
        (collection) => collection.id === palette.libraryData[0].collectionId
      )
    )
    .then(async (collection) => {
      if (collection === undefined) {
        collection = new LocalVariable().makeCollection(name)
        palette.libraryData.forEach((item) => {
          item.collectionId = collection?.id
        })
      }
      return collection
    })

  const createLocalVariablesStatusMessage = figma.variables
    .getLocalVariablesAsync()
    .then((allLocalVariables) =>
      allLocalVariables.filter(
        async (localVariable) =>
          localVariable.variableCollectionId === collection?.id
      )
    )
    .then((localVariables) => {
      let i = 0,
        j = 0,
        k = 0
      const messages: Array<string> = []
      const createdVariables: Array<Variable> = []

      // Create variables
      palette.libraryData
        .filter((item) => item.id.includes('00000000000'))
        .forEach((item) => {
          let isRemoved = false
          const boundVariable = localVariables.find(
            (localVariable) => localVariable.id === item.variableId
          )
          if (boundVariable?.variableCollectionId !== collection?.id) {
            boundVariable?.remove()
            isRemoved = true
          }
          if (boundVariable === undefined || isRemoved) {
            const variable = new LocalVariable().makeVariable(
              `${item.colorName}/${item.shadeName}`,
              collection,
              item.description ?? ''
            )
            item.variableId = variable.id
            createdVariables.push(variable)
            if (collection !== undefined) {
              variable.setValueForMode(collection.modes[0].modeId, {
                r: (item.gl ?? [0, 0, 0])[0],
                g: (item.gl ?? [0, 0, 0])[1],
                b: (item.gl ?? [0, 0, 0])[2],
                a: item.alpha ?? 1,
              })
              item.modeId = collection.defaultModeId
            }
            i++
          }
          if (
            collection?.modes[0].name !== 'Mode 1' &&
            collection !== undefined
          )
            collection.renameMode(collection.defaultModeId, 'Mode 1')
        })

      // Create modes
      palette.libraryData
        .filter((item) => !item.id.includes('00000000000'))
        .reduce((acc: Array<LibraryData>, item) => {
          const [themeId] = item.id.split(':')
          const lastItem = acc[acc.length - 1]

          if (collection !== undefined) {
            const isPassed = acc.some((accItem) => {
              const [accThemeId] = accItem.id.split(':')
              return accThemeId === themeId
            })

            if (isPassed) item.modeId = lastItem.modeId
            if (!isPassed && collection?.modes[0].name === 'Mode 1') {
              collection.renameMode(collection.defaultModeId, item.themeName)
              item.modeId = collection.defaultModeId
            } else if (!isPassed)
              try {
                const modeId = collection.addMode(item.themeName)
                item.modeId = modeId
                j++
              } catch {
                k++
              }
          }
          return (acc = [...acc, item])
        }, [])

      // Set values
      palette.libraryData
        .filter((item) => !item.id.includes('00000000000'))
        .forEach((item) => {
          if (collection !== undefined) {
            const variableMatch = createdVariables.find(
              (variable) =>
                variable.name === `${item.colorName}/${item.shadeName}`
            )
            const hasModeMatch = collection.modes.some(
              (mode) => mode.modeId === item.modeId
            )

            if (
              variableMatch !== undefined &&
              item.modeId !== undefined &&
              item.gl !== undefined &&
              hasModeMatch
            ) {
              variableMatch.setValueForMode(item.modeId, {
                r: item.gl[0],
                g: item.gl[1],
                b: item.gl[2],
                a: item.alpha ?? 1,
              })

              item.variableId = variableMatch.id
            }
          }
        })

      palette.libraryData = new Data(palette).makeLibraryData(
        ['style_id', 'collection_id', 'variable_id', 'mode_id'],
        palette.libraryData
      )

      figma.currentPage.setPluginData(`palette_${id}`, JSON.stringify(palette))

      if (i > 1 && j > 1)
        messages.push(
          locales
            .get()
            .info.createdVariablesAndModes.pluralPlural.replace(
              '{$1}',
              i.toString()
            )
            .replace('{$2}', j.toString())
        )
      else if (i === 1 && j === 1)
        messages.push(locales.get().info.createdVariablesAndModes.singleSingle)
      else if (i === 0 && j === 0)
        messages.push(locales.get().info.createdVariablesAndModes.noneNone)
      else if (i > 1 && j === 1)
        messages.push(
          locales
            .get()
            .info.createdVariablesAndModes.pluralSingle.replace(
              '{$1}',
              i.toString()
            )
        )
      else if (i === 1 && j > 1)
        messages.push(
          locales
            .get()
            .info.createdVariablesAndModes.singlePlural.replace(
              '{$1}',
              j.toString()
            )
        )
      else if (i > 1 && j === 0)
        messages.push(
          locales
            .get()
            .info.createdVariablesAndModes.pluralNone.replace(
              '{$1}',
              i.toString()
            )
        )
      else if (i === 0 && j > 1)
        messages.push(
          locales
            .get()
            .info.createdVariablesAndModes.nonePlural.replace(
              '{$1}',
              j.toString()
            )
        )
      else if (i === 1 && j === 0)
        messages.push(locales.get().info.createdVariablesAndModes.singleNone)
      else if (i === 0 && j === 1)
        messages.push(locales.get().info.createdVariablesAndModes.noneSingle)

      if (k > 1) messages.push(locales.get().warning.tooManyThemesToCreateModes)

      return messages.join(locales.get().separator)
    })

  return await createLocalVariablesStatusMessage
}

export default createLocalVariables
