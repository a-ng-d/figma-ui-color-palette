const checkPlanStatus = async () => {
  await figma.payments?.setPaymentStatusInDevelopment({
    type: 'UNPAID',
  })
  await figma.ui.postMessage({
    type: 'PLAN_STATUS',
    data: figma.payments?.status.type,
  })
}

export default checkPlanStatus
