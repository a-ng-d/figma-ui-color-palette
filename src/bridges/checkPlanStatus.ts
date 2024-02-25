const checkPlanStatus = async () => {
  // figma.clientStorage.deleteAsync('trial_start_date')
  //figma.clientStorage.deleteAsync('is_trial_extended')
  /*figma.clientStorage
        .setAsync('trial_start_date', 1703286000000)*/
  
  const
    trialTime = 168

  let trialStartDate: number | undefined = await figma.clientStorage.getAsync(
      'trial_start_date'
    ),
    isTrialExtended: boolean | undefined = await figma.clientStorage.getAsync(
      'is_trial_extended'
    ),
    consumedTime = 0,
    trialStatus = 'UNUSED'

  if (trialStartDate != undefined) {
    if (trialStartDate < 1708902000000 && (isTrialExtended == undefined || !isTrialExtended)) {
      figma.clientStorage
        .setAsync('trial_start_date', new Date().getTime() - 259200000)
      figma.clientStorage
        .setAsync('is_trial_extended', true)
      trialStartDate = new Date().getTime() - 259200000
      isTrialExtended = true
    }
    consumedTime = (new Date().getTime() - trialStartDate) / 1000 / (60 * 60)
    trialStatus = consumedTime >= trialTime ? 'EXPIRED' : 'PENDING'
  }

  /* await figma.payments?.setPaymentStatusInDevelopment({
    type: 'UNPAID',
  }) */
  await figma.ui.postMessage({
    type: 'PLAN_STATUS',
    data: {
      planStatus:
        trialStatus === 'PENDING' ? 'PAID' : figma.payments?.status.type,
      trialStatus: trialStatus,
      trialRemainingTime: Math.ceil(trialTime - consumedTime),
    },
  })
}

export default checkPlanStatus
