const createLocalVariables = async (id: string) => {
  /*const rawPalette = figma.currentPage.getPluginData(`palette_${id}`)
  
    if (rawPalette === undefined || rawPalette === null)
      throw new Error(locales.get().error.unfoundPalette)
  
    const palette = JSON.parse(rawPalette) as FullConfiguration

    const name: string =
        palette.base.name === ''
          ? locales.get().name
          : palette.base.name
    const themesList =
        palette.themes
          .map((theme) => {
            if (theme.type === 'custom theme')
              return {
                name: theme.name,
                id: theme.modeId,
              }
          })
          .slice(1) ?? []

    const collection = await figma.variables
      .getLocalVariableCollectionsAsync()
      .then((collections) =>
        collections.find(
          (collection) => collection.id === palette.libraryData.collectionId[0]
        )
      )
      .then(async (collection) => {
        if (collection === undefined) {
          collection = new LocalVariable().makeCollection(name)
          palette.libraryData.forEach((data) => {
            data.collectionId = collection?.id
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
          j = 0
        const messages: Array<string> = []
        let createdVariables: Array<Variable> = []

        // Create variables
        paletteData.themes
          .filter((theme) => theme.type === 'default theme')
          .forEach((theme) => {
            theme.colors.forEach((color) => {
              color.shades.forEach((shade) => {
                let isRemoved = false
                const boundVariable = localVariables.find(
                  (localVariable) => localVariable.id === shade.variableId
                )
                if (boundVariable?.variableCollectionId !== collection?.id) {
                  boundVariable?.remove()
                  isRemoved = true
                }
                if (boundVariable === undefined || isRemoved) {
                  const variable = new LocalVariable().makeVariable(
                    `${color.name}/${shade.name}`,
                    collection,
                    color.description
                  )
                  shade.variableId = variable.id
                  createdVariables.push(variable)
                  if (themesList.length === 0 && collection !== undefined) {
                    variable.setValueForMode(collection.modes[0].modeId, {
                      r: shade.gl[0],
                      g: shade.gl[1],
                      b: shade.gl[2],
                    })
                    theme.modeId = collection?.defaultModeId
                  }
                  i++
                } else if (
                  themesList.length === 0 &&
                  collection?.modes[0].name !== 'Mode 1' &&
                  collection !== undefined
                ) {
                  collection.renameMode(collection.defaultModeId, 'Mode 1')
                  paletteData.themes[0].modeId = collection.defaultModeId
                }
              })
            })
          })

        // Create modes
        if (themesList.length > 0)
          themesList.forEach((themeItem) => {
            if (themeItem !== undefined && collection !== undefined) {
              const theme = paletteData.themes.find(
                (theme) => theme.name === themeItem.name
              )
              if (collection?.modes[0].name === 'Mode 1') {
                collection.renameMode(collection.defaultModeId, themeItem.name)
                themeItem.id = collection.defaultModeId
                theme !== undefined && (theme.modeId = collection.defaultModeId)
              } else if (
                collection.modes.find(
                  (mode) => mode.modeId === themeItem.id
                ) === undefined
              )
                try {
                  const modeId = collection.addMode(themeItem.name)
                  themeItem.id = modeId
                  theme !== undefined && (theme.modeId = modeId)
                  j++
                } catch {
                  figma.notify(locals[lang].warning.tooManyThemesToCreateModes)
                }
            }
          })

        // Set values
        themesList.forEach((themeItem) => {
          if (collection !== undefined && themeItem !== undefined) {
            if (createdVariables.length === 0) createdVariables = localVariables
            createdVariables.forEach((variable) => {
              const rightShade = paletteData.themes
                .find((theme) => theme.name === themeItem?.name)
                ?.colors.find(
                  (color) => color.name === variable.name.split('/')[0]
                )
                ?.shades.find(
                  (shade) => shade.name === variable.name.split('/')[1]
                )
              if (rightShade !== undefined && collection !== undefined)
                rightShade.variableId = variable.id
            })
          }
        })

        palette.setPluginData('data', JSON.stringify(paletteData))

        if (i > 1 && j > 1)
          messages.push(
            locals[lang].info.createdVariablesAndModes.pluralPlural
              .replace('$1', i)
              .replace('$2', j)
          )
        else if (i === 1 && j === 1)
          messages.push(locals[lang].info.createdVariablesAndModes.singleSingle)
        else if (i === 0 && j === 0)
          messages.push(locals[lang].info.createdVariablesAndModes.noneNone)
        else if (i > 1 && j === 1)
          messages.push(
            locals[lang].info.createdVariablesAndModes.pluralSingle.replace(
              '$1',
              i
            )
          )
        else if (i === 1 && j > 1)
          messages.push(
            locals[lang].info.createdVariablesAndModes.singlePlural.replace(
              '$1',
              j
            )
          )
        else if (i > 1 && j === 0)
          messages.push(
            locals[lang].info.createdVariablesAndModes.pluralNone.replace(
              '$1',
              i
            )
          )
        else if (i === 0 && j > 1)
          messages.push(
            locals[lang].info.createdVariablesAndModes.nonePlural.replace(
              '$1',
              j
            )
          )
        else if (i === 1 && j === 0)
          messages.push(locals[lang].info.createdVariablesAndModes.singleNone)
        else if (i === 0 && j === 1)
          messages.push(locals[lang].info.createdVariablesAndModes.noneSingle)

        if (themesList.length > 4)
          figma.notify(locals[lang].warning.tooManyThemesToCreateModes)

        return messages.join(locals[lang].separator)
      })
      .catch(() => locals[lang].error.generic)

    return await createLocalVariablesStatusMessage*/
}

export default createLocalVariables
