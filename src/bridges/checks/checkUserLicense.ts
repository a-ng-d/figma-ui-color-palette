const checkUserLicense = async (plugin: 'fig' | 'one') => {
  const licenseKey = await figma.clientStorage.getAsync('user_license_key')
  const instanceId = await figma.clientStorage.getAsync(
    'user_license_instance_id'
  )

  if (licenseKey && instanceId)
    return figma.ui.postMessage({
      type: 'CHECK_USER_LICENSE',
      data: {
        licenseKey: licenseKey,
        instanceId: instanceId,
      },
    })
  else if (plugin === 'fig') {
    const paymentStatus = figma.payments?.status.type
    if (paymentStatus === 'PAID')
      return figma.ui.postMessage({
        type: 'ENABLE_PRO_PLAN',
      })
  }
  return true
}

export default checkUserLicense
