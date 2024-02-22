import { uid } from 'uid'

const setPalettesMigration = () => {
  figma.currentPage
    .findAllWithCriteria({
      pluginData: {},
    })
    .forEach((palette) => {
      if (palette.getPluginData('id') === '') palette.setPluginData('id', uid())
    })
}

export default setPalettesMigration
