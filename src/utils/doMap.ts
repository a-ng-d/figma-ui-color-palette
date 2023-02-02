export const doMap = (
  value: number,
  oldMin: number,
  oldMax: number,
  newMin: number,
  newMax: number
) => {
  const oldRange = oldMax - oldMin,
    newRange = newMax - newMin
  return ((value - oldMin) * newRange) / oldRange + newMin
}
