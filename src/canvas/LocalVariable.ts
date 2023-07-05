
import type { RgbModel } from '../utils/types'

export default class LocalVariable {
  name: string
  collection: VariableCollection
  description: string
  rgb: RgbModel
  variable: Variable

  constructor(name?: string, collection?: VariableCollection, description?: string, rgb?: RgbModel) {
    this.name = name
    this.collection = collection
    this.description = description
    this.rgb = rgb
  }

  makeCollection = (name: string) => {
    this.collection = figma.variables.createVariableCollection(name)
    this.collection.renameMode(this.collection.modes[0].modeId, 'Value')

    return this.collection
  }

  makeVariable = () => {
    this.variable = figma.variables.createVariable(
      this.name,
      this.collection.id,
      'COLOR'
    )
    this.variable.description = this.description
    this.variable.setValueForMode(
      this.collection.modes[0].modeId,
      this.rgb
    )

    return this.variable
  }
}
