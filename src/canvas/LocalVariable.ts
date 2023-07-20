export default class LocalVariable {
  collection: VariableCollection
  variable: Variable

  constructor(
    collection?: VariableCollection,
    variable?: Variable,
  ) {
    this.collection = collection
    this.variable = variable
  }

  makeCollection = (name: string) => {
    this.collection = figma.variables.createVariableCollection(name)

    return this.collection
  }

  makeVariable = (name: string, description: string) => {
    this.variable = figma.variables.createVariable(
      name,
      this.collection.id,
      'COLOR'
    )
    this.variable.description = description

    return this.variable
  }
}
