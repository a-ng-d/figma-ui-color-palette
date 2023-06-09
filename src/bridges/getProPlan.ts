const getProPlan = async () => {
  await figma.payments
    .initiateCheckoutAsync({
      interstitial: 'SKIP',
    })
    .then(() => {
      if (figma.payments.status.type === 'PAID') {
        figma.ui.postMessage({
          type: 'PLAN_STATUS',
          data: figma.payments.status.type,
        })
        figma.notify('You have upgraded UI Color Palette to Pro Plan')
      }
    })
}

export default getProPlan
