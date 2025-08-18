import globalConfig from '../../global.config'

const checkTrialStatus = async ({
  context = 'UI',
  plugin = 'fig',
}: {
  context?: 'UI' | 'PARAMETERS'
  plugin?: 'fig' | 'one'
}) => {
  const trialStartDate: number | undefined =
    await figma.clientStorage.getAsync('trial_start_date')
  const currentTrialVersion: string =
    (await figma.clientStorage.getAsync('trial_version')) ??
    globalConfig.versions.trialVersion
  const currentTrialTime: number =
    (await figma.clientStorage.getAsync('trial_time')) || 72

  let consumedTime = 0,
    trialStatus = 'UNUSED'

  if (trialStartDate) {
    consumedTime =
      (new Date().getTime() - new Date(trialStartDate).getTime()) /
      1000 /
      (60 * 60)

    if (consumedTime <= currentTrialTime && globalConfig.plan.isTrialEnabled)
      trialStatus = 'PENDING'
    else if (
      consumedTime >= globalConfig.plan.trialTime &&
      globalConfig.plan.isTrialEnabled
    )
      trialStatus = 'EXPIRED'
    else trialStatus = 'UNUSED'
  }

  if (trialStatus === 'PENDING' || !globalConfig.plan.isProEnabled)
    if (context === 'UI') {
      let planStatus

      if (trialStatus === 'PENDING' || !globalConfig.plan.isProEnabled)
        planStatus = 'PAID'
      else if (plugin === 'fig') planStatus = figma.payments?.status.type
      else planStatus = undefined

      figma.ui.postMessage({
        type: 'CHECK_TRIAL_STATUS',
        data: {
          planStatus: planStatus,
          trialStatus: trialStatus,
          trialRemainingTime: Math.ceil(
            currentTrialVersion !== globalConfig.versions.trialVersion
              ? currentTrialTime - consumedTime
              : globalConfig.plan.trialTime - consumedTime
          ),
        },
      })
    }

  if (trialStatus === 'PENDING' || !globalConfig.plan.isProEnabled)
    return 'PAID'
  else if (plugin === 'fig') return figma.payments?.status.type
  else return undefined
}

export default checkTrialStatus
