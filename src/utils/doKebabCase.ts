const doKebabCase = (string: string) =>
  string
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[@/$^%#&!?,;:+=<>(){}"«»]/g, '')

export default doKebabCase
