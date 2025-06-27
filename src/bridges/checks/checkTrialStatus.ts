import globalConfig from '../../global.config'

const checkTrialStatus = async (context = 'UI' as 'UI' | 'PARAMETERS') => {
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

    if (
      consumedTime <= currentTrialTime &&
      currentTrialVersion !== globalConfig.versions.trialVersion &&
      globalConfig.plan.isTrialEnabled
    )
      trialStatus = 'PENDING'
    else if (
      consumedTime >= globalConfig.plan.trialTime &&
      globalConfig.plan.isTrialEnabled
    )
      trialStatus = 'EXPIRED'
    else trialStatus = 'UNUSED'
  }

  if (context === 'UI')
    figma.ui.postMessage({
      type: 'CHECK_TRIAL_STATUS',
      data: {
        planStatus:
          trialStatus === 'PENDING' || !globalConfig.plan.isProEnabled
            ? 'PAID'
            : figma.payments?.status.type,
        trialStatus: trialStatus,
        trialRemainingTime: Math.ceil(
          currentTrialVersion !== globalConfig.versions.trialVersion
            ? currentTrialTime - consumedTime
            : globalConfig.plan.trialTime - consumedTime
        ),
      },
    })

  return trialStatus === 'PENDING' || !globalConfig.plan.isProEnabled
    ? 'PAID'
    : figma.payments?.status.type
}

export default checkTrialStatus
figma.payments?.status.type
