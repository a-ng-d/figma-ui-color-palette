import {
  Data,
  FullConfiguration,
  LibraryData,
} from '@a_ng_d/utils-ui-color-palette'
import { getJsonSize } from '../../utils/getSize'
import LocalVariable from '../../canvas/LocalVariable'
import { tolgee } from '../..'

const createLocalVariables = async (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '') throw new Error(tolgee.t('error.unfoundPalette'))

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
    palette.base.name === '' ? tolgee.t('name') : palette.base.name

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
      const allAvailableVariables: Array<Variable> = [...localVariables]

      // Create variables
      palette.libraryData
        .filter((item) => item.id.includes('00000000000'))
        .forEach((item) => {
          let isRemoved = false
          const boundVariable = localVariables.find(
            (localVariable) => localVariable.id === item.variableId
          )
          const path = [
            item.colorName === ''
              ? tolgee.t('colors.defaultName')
              : item.colorName,
            item.shadeName,
          ]
            .filter((item) => item !== '' && item !== 'None')
            .join('/')

          if (boundVariable?.variableCollectionId !== collection?.id) {
            boundVariable?.remove()
            isRemoved = true
          }
          if (boundVariable === undefined || isRemoved) {
            const variable = new LocalVariable().makeVariable(
              path,
              collection,
              item.description ?? ''
            )
            item.variableId = variable.id
            createdVariables.push(variable)
            allAvailableVariables.push(variable)
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
          } else if (boundVariable !== undefined)
            createdVariables.push(boundVariable)
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
          const themeName =
            item.themeName === ''
              ? tolgee.t('themes.defaultName')
              : item.themeName

          if (collection !== undefined) {
            const path = [
              item.colorName === ''
                ? tolgee.t('colors.defaultName')
                : item.colorName,
              item.shadeName,
            ]
              .filter((name) => name !== '' && name !== 'None')
              .join('/')

            const variableMatch = allAvailableVariables.find(
              (variable) => variable.name === path
            )

            if (variableMatch !== undefined) item.variableId = variableMatch.id

            const hasModeMatch = collection.modes.some(
              (mode) => mode.modeId === item.modeId
            )
            const isPassed = acc.some((accItem) => {
              const [accThemeId] = accItem.id.split(':')
              return accThemeId === themeId
            })

            if (isPassed) item.modeId = lastItem.modeId
            if (!isPassed && collection?.modes[0].name === 'Mode 1') {
              collection.renameMode(collection.defaultModeId, themeName)
              item.modeId = collection.defaultModeId
            } else if (!isPassed && !hasModeMatch)
              try {
                const modeId = collection.addMode(themeName)
                item.modeId = modeId
                j++
              } catch {
                k++
              }
          }
          return (acc = [...acc, item])
        }, [])

      palette.libraryData = new Data(palette).makeLibraryData(
        ['style_id', 'collection_id', 'variable_id', 'mode_id'],
        palette.libraryData
      )

      if (getJsonSize(palette) < 100)
        figma.currentPage.setSharedPluginData(
          'uicp',
          `palette_${id}`,
          JSON.stringify(palette)
        )
      else throw new Error(tolgee.t('error.paletteSizeExceeded'))

      if (i > 0)
        messages.push(
          tolgee.t('info.createdLocalVariables', {
            count: i.toString(),
          })
        )
      if (j > 0)
        messages.push(
          tolgee.t('info.createdLocalModes', {
            count: j.toString(),
          })
        )
      if (k > 1) messages.push(tolgee.t('warning.tooManyThemesToCreateModes'))

      if (i + j === 0) messages.push(tolgee.t('info.noChange'))

      return messages.join(tolgee.t('separator'))
    })

  return await createLocalVariablesStatusMessage
}

export default createLocalVariables
