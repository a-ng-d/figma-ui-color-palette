export const setData = (data: string, entry: string, value: boolean | string | number): string => {
  let parsedData = JSON.parse(data);
  parsedData.forEach(record => record[entry] = value)
  return JSON.stringify(parsedData)
}

export const doMap = (value: number, oldMin: number, oldMax: number, newMin: number, newMax: number) => {
  const oldRange = oldMax - oldMin,
      newRange = newMax - newMin
  return ((value - oldMin) * newRange / oldRange) + newMin
}
