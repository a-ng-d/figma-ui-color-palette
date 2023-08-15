import chroma from 'chroma-js'
import type { PaletteData } from '../utils/types'
import { locals, lang } from '../content/locals'

const updateLocalVariables = (palette: SceneNode, i: number, j: number) => {
  palette = figma.currentPage.selection[0] as FrameNode

  const paletteData: PaletteData = JSON.parse(palette.getPluginData('data'))

  if (palette.children.length == 1) {
    i = 0
    j = 0
    let k = 0

    const name =
        palette.getPluginData('name') === ''
          ? 'UI Color Palette'
          : palette.getPluginData('name'),
      notifications: Array<string> = []

    const collection: VariableCollection | undefined = figma.variables
      .getLocalVariableCollections()
      .find((collection) => collection.id === paletteData.collectionId)

    if (collection != undefined) {
      const localVariables: Array<Variable> = figma.variables
        .getLocalVariables()
        .filter(
          (localVariable) =>
            localVariable.variableCollectionId === collection.id
        )

      if (collection.name != name) collection.name = name

      const workingThemes =
        paletteData.themes.filter((theme) => theme.type === 'custom theme')
          .length == 0
          ? paletteData.themes.filter((theme) => theme.type === 'default theme')
          : paletteData.themes.filter((theme) => theme.type === 'custom theme')

      workingThemes.forEach((theme) => {
        const modeMatch = collection.modes.find(
          (mode) => mode.modeId === theme.modeId
        )
        if (modeMatch != undefined)
          if (modeMatch.name != theme.name && theme.name != 'None') {
            collection.renameMode(modeMatch.modeId, theme.name)
            j++
          }

        theme.colors.forEach((color) => {
          color.shades.forEach((shade) => {
            const variableMatch = localVariables.find(
                (localVariable) => localVariable.id === shade.variableId
              ),
              description =
                color.description != ''
                  ? color.description + '﹒' + shade.description
                  : shade.description
            if (variableMatch != undefined) {
              if (variableMatch.name != `${color.name}/${shade.name}`) {
                variableMatch.name = `${color.name}/${shade.name}`
                k++
              }

              if (variableMatch.description != description) {
                variableMatch.description = description
                k++
              }

              if (
                chroma([
                  (variableMatch.valuesByMode[theme.modeId] as RGB).r * 255,
                  (variableMatch.valuesByMode[theme.modeId] as RGB).g * 255,
                  (variableMatch.valuesByMode[theme.modeId] as RGB).b * 255,
                ]).hex() != shade.hex
              ) {
                variableMatch.setValueForMode(theme.modeId, {
                  r: shade.gl[0],
                  g: shade.gl[1],
                  b: shade.gl[2],
                })
                k++
              }
            }
            if (k > 0) i++
            k = 0
          })
        })
      })

      if (i > 1) notifications.push(`${i} ${locals[lang].info.localVariables}`)
      else if (i == 1)
        notifications.push(`${i} ${locals[lang].info.localVariable}`)
      else if (i == 0) notifications.push(locals[lang].info.noLocalVariable)

      if (j > 1) notifications.push(`${j} ${locals[lang].info.variableModes}`)
      else if (j == 1)
        notifications.push(`${j} ${locals[lang].info.variableMode}`)
      else if (j == 0) notifications.push(locals[lang].info.noVariableMode)

      if (i > 1 || j > 1)
        figma.notify(`${notifications.join(' and ')} have been updated`)
      else if (i == 0 && j == 0)
        figma.notify(locals[lang].warning.cannotUpdateLocalVariablesAndModes)
      else figma.notify(`${notifications.join(' and ')} has been updated`)
    } else figma.notify(locals[lang].warning.collectionDoesNotExist)
  } else figma.notify(locals[lang].error.corruption)
}

export default updateLocalVariables
