const doCamelCase = (string: string) =>
  string
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
    .replace(/[@/$^%#&!?,;:+=<>(){}"«»]/g, '')

export default doCamelCase
