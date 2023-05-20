const hasProPlan = async () => {
  console.log(figma.payments.status.type)
  if (figma.payments.status.type === "UNPAID") {
    await figma.ui.postMessage({
      type: 'plan-status',
      data: 'FREE',
    })
  }
}

export default hasProPlan