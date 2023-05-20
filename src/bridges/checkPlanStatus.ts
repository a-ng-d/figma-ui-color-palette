const checkPlanStatus = async () => {
  await figma.ui.postMessage({
    type: 'plan-status',
    data: figma.payments.status.type,
  })
}

export default checkPlanStatus