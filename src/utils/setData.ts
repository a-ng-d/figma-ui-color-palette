const setData = (
  data: Array<any>,
  entry: string,
  value: boolean | string | number
): string => {
  data.forEach((record) => (record[entry] = value))
  return JSON.stringify(data)
}

export default setData
