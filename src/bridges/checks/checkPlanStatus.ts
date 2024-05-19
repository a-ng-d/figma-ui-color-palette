import { oldTrialTime, trialTime } from '../../utils/config'

const checkPlanStatus = async () => {
  //figma.clientStorage.deleteAsync('trial_start_date')
  //figma.clientStorage.deleteAsync('trial_version')
  /*figma.clientStorage.setAsync(
    'trial_start_date',
    new Date().getTime() - 12 * 60 * 60 * 1000
  )*/
  /*figma.payments?.setPaymentStatusInDevelopment({
    type: 'UNPAID',
  })*/

  const trialStartDate: number | undefined =
      await figma.clientStorage.getAsync('trial_start_date'),
    trialVersion: string =
      (await figma.clientStorage.getAsync('trial_version')) ?? '3.1.0'

  let consumedTime = 0,
    trialStatus = 'UNUSED'

  if (trialStartDate != undefined) {
    consumedTime = (new Date().getTime() - trialStartDate) / 1000 / (60 * 60)

    if (consumedTime <= oldTrialTime && trialVersion != '3.2.0')
      trialStatus = 'PENDING'
    else if (consumedTime >= trialTime) trialStatus = 'EXPIRED'
    else trialStatus = 'PENDING'
  }

  figma.ui.postMessage({
    type: 'PLAN_STATUS',
    data: {
      planStatus:
        trialStatus === 'PENDING' ? 'PAID' : figma.payments?.status.type,
      trialStatus: trialStatus,
      trialRemainingTime: Math.ceil(
        trialVersion != '3.2.0'
          ? oldTrialTime - consumedTime
          : trialTime - consumedTime
      ),
    },
  })
}

export default checkPlanStatus
