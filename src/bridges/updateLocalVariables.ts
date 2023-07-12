import chroma from 'chroma-js'
import type { PaletteDataItem } from '../utils/types'
import { locals, lang } from '../content/locals'

const updateLocalVariables = (palette, i: number) => {
  palette = figma.currentPage.selection[0]
  const localVariables: Array<Variable> = figma.variables.getLocalVariables()

  if (palette.children.length == 1) {
    i = 0
    let j = 0

    const name =
        palette.getPluginData('name') === ''
          ? 'UI Color Palette'
          : palette.getPluginData('name'),
      collections: Array<VariableCollection> =
        figma.variables.getLocalVariableCollections()

    let collection: VariableCollection | undefined = collections.find(
        (collection) => collection.name === name
      ),
      target: Variable

    JSON.parse(palette.getPluginData('data')).forEach(
      (color: PaletteDataItem) => {
        color.shades.forEach((shade) => {
          target = localVariables.find(
            (localVariable) =>
              localVariable.name ===
                `${color.name}/${color.name
                  .toLowerCase()
                  .split(' ')
                  .join('-')
                  .replace(/[@/$^%#&!?,;:+=<>(){}"«»]/g, '-')}-${shade.name}` &&
              localVariable.variableCollectionId === collection.id
          )
          const targetValue = target.valuesByMode[collection.modes[0].modeId]

          if (target != undefined) {
            if (
              shade.hex !=
              chroma([
                targetValue['r'] * 255,
                targetValue['g'] * 255,
                targetValue['b'] * 255,
              ]).hex()
            ) {
              target.setValueForMode(collection.modes[0].modeId, {
                r: shade.gl[0],
                g: shade.gl[1],
                b: shade.gl[2],
              })
              j++
            }
            if (color.description != '')
              if (target.description.split('﹒')[0] != color.description) {
                target.description =
                  color.description != ''
                    ? color.description.concat('﹒', shade.description)
                    : shade.description
                j++
              }

            j > 0 ? i++ : i
            j = 0
          }
        })
      }
    )

    if (i > 1) figma.notify(`${i} ${locals[lang].info.updatedLocalVariables}`)
    else if (i == 1)
      figma.notify(`${i} ${locals[lang].info.updatedLocalVariable}`)
    else figma.notify(locals[lang].warning.cannotUpdateLocalVariables)
  } else figma.notify(locals[lang].error.corruption)
}

export default updateLocalVariables
