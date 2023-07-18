import type { PaletteData } from '../utils/types'
import LocalVariable from '../canvas/LocalVariable'
import { locals, lang } from '../content/locals'

const createLocalVariables = (palette, i: number, j: number) => {
  palette = figma.currentPage.selection[0] as FrameNode
  const localVariables: Array<Variable> = figma.variables.getLocalVariables(),
  paletteData: PaletteData = JSON.parse(palette.getPluginData('data')),
  variablesSet: Array<{
    variable: Variable
    colorName: string
    shadeName: string
  }> = []


  if (palette.children.length == 1) {
    i = 0
    j = 0
    const name: string =
        palette.getPluginData('name') === ''
          ? locals[lang].name
          : palette.getPluginData('name'),
      themesList = paletteData.themes.map(theme => {
        if (theme.type === 'custom theme')
          return {
            name: theme.name,
            id: theme.modeId
          }
      }).slice(1),
      notifications: Array<string> = []

    let collection: VariableCollection | undefined =
      figma.variables
        .getLocalVariableCollections()
        .find(
          (collection) => collection.id === paletteData.collectionId
        )

    // Create collection
    if (collection == undefined) {
      collection = new LocalVariable().makeCollection(name)
      paletteData.collectionId = collection.id
    }

    // Create variables
    paletteData.themes
      .filter(theme => theme.type === 'default theme')
      .forEach(theme => {
        theme.colors.forEach(color => {
          color.shades.forEach(shade => {
            const boundVariable = localVariables
              .find(
                (localVariable) =>
                  localVariable.id === shade.variableId
              )
            if (boundVariable == undefined) {
              const variable = new LocalVariable(
                collection
              ).makeVariable(
                `${color.name}/${color.name
                  .toLowerCase()
                  .split(' ')
                  .join('-')
                  .replace(/[@$^%#&!?,;:+=<>(){}"«»]/g, '-')}-${shade.name}`,
                color.description != ''
                  ? color.description.concat('﹒', shade.description)
                  : shade.description,
              )
              shade.variableId = variable.id
              variablesSet.push({
                variable: variable,
                colorName: color.name,
                shadeName: shade.name,
              })
              i++
            } else
              variablesSet.push({
                variable: boundVariable,
                colorName: color.name,
                shadeName: shade.name,
              })
          })
        })
      })

    // Create modes and set values
    themesList.forEach(themeItem => {
      if (collection.modes.find(mode => mode.modeId === themeItem.id) == undefined) {
        if (collection.modes[0].name === 'Mode 1') {
          collection.renameMode(collection.modes[0].modeId, themeItem.name)
          j++
        }
        else {
          collection.addMode(themeItem.name)
          j++
        }

        paletteData.themes.find(theme => theme.name === themeItem.name).modeId = collection.modes.find(mode => mode.name === themeItem.name).modeId
      }
      variablesSet.forEach(variableSet => {
        const rightShade = paletteData.themes
          .find(theme => theme.name === themeItem.name).colors
          .find(color => color.name === variableSet.colorName).shades
          .find(shade => shade.name === variableSet.shadeName)

        rightShade.variableId = variableSet.variable.id

        variableSet.variable.setValueForMode(
          collection.modes.find(mode => mode.name === themeItem.name).modeId,
          {
            r: rightShade.gl[0],
            g: rightShade.gl[1],
            b: rightShade.gl[2]
          }
        )
      })
    })

    palette.setPluginData('data', JSON.stringify(paletteData))
    
    if (i > 1)
      notifications.push(`${i} ${locals[lang].info.createdLocalVariables}`)
    else if (i == 1)
      notifications.push(`${i} ${locals[lang].info.createdLocalVariable}`)
    else if (i == 0)
      notifications.push(locals[lang].info.noLocalVariable)
    
    if (j > 1)
      notifications.push(`${j} ${locals[lang].info.createdVariableModes}`)
    else if (j == 1)
      notifications.push(`${j} ${locals[lang].info.createdVariableMode}`)
    else if (j == 0)
      notifications.push(locals[lang].info.noVariableMode)

    if (i > 1 || j > 1)
      figma.notify(`${notifications.join(' and ')} have been created`)
    else if (i == 0 && j == 0)
      figma.notify(locals[lang].warning.cannotCreateLocalVariablesAndMode)
    else
      figma.notify(`${notifications.join(' and ')} has been created`)
  } else figma.notify(locals[lang].error.corruption)
}

export default createLocalVariables
