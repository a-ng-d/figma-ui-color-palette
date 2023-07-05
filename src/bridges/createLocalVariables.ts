import type { PaletteDataItem } from '../utils/types'
import LocalVariable from '../canvas/LocalVariable'
import { locals, lang } from '../content/locals'

const createLocalVariables = (palette, i: number) => {
  palette = figma.currentPage.selection[0] as FrameNode
  const localVariables: Array<Variable> = figma.variables.getLocalVariables()

  if (palette.children.length == 1) {
    i = 0
    const name =
        palette.getPluginData('name') === ''
          ? 'UI Color Palette'
          : palette.getPluginData('name'),
      collections: Array<VariableCollection> =
        figma.variables.getLocalVariableCollections()

    let collection: VariableCollection | undefined = collections.find(
      (collection) => collection.name === name
    )

    if (collection == undefined)
      collection = new LocalVariable().makeCollection(name)

    JSON.parse(palette.getPluginData('data')).forEach(
      (color: PaletteDataItem) => {
        color.shades.forEach((shade) => {
          if (
            localVariables.find(
              (localVariable) =>
                localVariable.name ===
                  `${color.name}/${color.name
                    .toLowerCase()
                    .split(' ')
                    .join('-')
                    .replace(/[@/$^%#&!?,;:+=<>(){}"«»]/g, '-')}-${
                    shade.name
                  }` && localVariable.variableCollectionId === collection.id
            ) == undefined
          ) {
            new LocalVariable(
              `${color.name}/${color.name
                .toLowerCase()
                .split(' ')
                .join('-')
                .replace(/[@/$^%#&!?,;:+=<>(){}"«»]/g, '-')}-${shade.name}`,
              collection,
              color.description != ''
                ? color.description.concat('﹒', shade.description)
                : shade.description,
              {
                r: shade.gl[0],
                g: shade.gl[1],
                b: shade.gl[2],
              }
            ).makeVariable()
            i++
          }
        })
      }
    )

    if (i > 1) figma.notify(`${i} ${locals[lang].info.createdLocalVariables}`)
    else if (i == 1)
      figma.notify(`${i} ${locals[lang].info.createdLocalVariable}`)
    else figma.notify(locals[lang].warning.cannotCreateLocalVariables)
  } else figma.notify(locals[lang].error.corruption)
}

export default createLocalVariables
