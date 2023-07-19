const doSnakeCase = (string: string) =>
  string
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[@/$^%#&!?,;:+=<>(){}"«»]/g, '-')

export default doSnakeCase