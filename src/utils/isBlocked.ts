import features from './features'

const isBlocked = (
  featureName: string,
  planStatus: 'UNPAID' | 'PAID'
): boolean => {
  const match = features.find((feature) => feature.name === featureName)

  if (match != undefined)
    if (match.isPro && planStatus === 'PAID') return false
    else if (!match.isPro && planStatus === 'UNPAID') return false
    else return true
  else return true
}

export default isBlocked
