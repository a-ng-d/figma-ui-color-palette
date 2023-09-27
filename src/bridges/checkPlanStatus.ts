const checkPlanStatus = async () => {
  const trialStartDate: number | undefined = await figma.clientStorage.getAsync('trial_start_date')
  let consumedTime = undefined

  if (trialStartDate != undefined)
    consumedTime = new Date().getTime() - trialStartDate!

  console.log(trialStartDate)

  await figma.payments?.setPaymentStatusInDevelopment({
    type: 'UNPAID',
  })
  await figma.ui.postMessage({
    type: 'PLAN_STATUS',
    data: figma.payments?.status.type,
  })
}

export default checkPlanStatus
