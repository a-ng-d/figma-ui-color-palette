import type { ScaleConfiguration } from './types'
import { doMap } from '@a-ng-d/figmug.modules.do-map'

const doLightnessScale = (stops: Array<number>, min: number, max: number) => {
  let granularity = 1
  const scale: ScaleConfiguration = {}

  stops.map((index) => {
    scale[`lightness-${index}`] = parseFloat(
      doMap(granularity, 0, 1, min, max).toFixed(1)
    )
    granularity -= 1 / (stops.length - 1)
  })

  return scale
}

export default doLightnessScale
