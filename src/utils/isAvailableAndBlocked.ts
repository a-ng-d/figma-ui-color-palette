import features from './config'
import isBlocked from './isBlocked'

const isAvailableAndBlocked = (featureName: string, suggestion: string) => {
  if (features.find(feature => feature.name === featureName)?.isActive)
    if (!isBlocked(featureName, (figma.payments?.status.type as 'PAID' | 'UNPAID')))
      return suggestion
    else
      return null
  else
    return null
}

export default isAvailableAndBlocked
