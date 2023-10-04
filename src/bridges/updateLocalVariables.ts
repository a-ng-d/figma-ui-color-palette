import chroma from 'chroma-js'
import type { PaletteData } from '../utils/types'
import { locals, lang } from '../content/locals'
import { notifications } from '../utils/palettePackage'

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
      messages: Array<string> = []

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
              description = color.description.endsWith(' ') ? color.description.slice(0, -1) : color.description
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

      if (i > 1) messages.push(`${i} ${locals[lang].info.localVariables}`)
      else
        messages.push(`${i} ${locals[lang].info.localVariable}`)

      if (j > 1) messages.push(`${j} ${locals[lang].info.variableModes}`)
      else
        messages.push(`${j} ${locals[lang].info.variableMode}`)

      notifications.push(`${messages.join(', ')} updated`)

    } else notifications.splice(0, notifications.length).push(locals[lang].warning.collectionDoesNotExist)
  } else notifications.splice(0, notifications.length).push(locals[lang].error.corruption)
}

export default updateLocalVariables
