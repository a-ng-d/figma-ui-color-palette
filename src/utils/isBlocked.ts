import features from './features'

const isBlocked = (featureName: string, planStatus: string): boolean =>
  features.find((feature) => feature.name === featureName).isPro
    ? planStatus === 'PAID'
      ? false
      : true
    : false

export default isBlocked
