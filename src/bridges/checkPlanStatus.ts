const checkPlanStatus = async () => {
  // figma.clientStorage.deleteAsync('trial_start_date')
  const trialStartDate: number | undefined = await figma.clientStorage.getAsync(
      'trial_start_date'
    ),
    trialTime = 72
  let remainingTime = 0,
    trialStatus = 'UNUSED'

  if (trialStartDate != undefined) {
    remainingTime = (new Date().getTime() - trialStartDate) / 1000 / (60 * 60)
    trialStatus = remainingTime >= trialTime ? 'EXPIRED' : 'PENDING'
  }

  /*await figma.payments?.setPaymentStatusInDevelopment({
    type: 'UNPAID',
  })*/
  await figma.ui.postMessage({
    type: 'PLAN_STATUS',
    data: {
      planStatus:
        trialStatus === 'PENDING' ? 'PAID' : figma.payments?.status.type,
      trialStatus: trialStatus,
      trialRemainingTime: Math.ceil(trialTime - remainingTime),
    },
  })
}

export default checkPlanStatus
