const enableTrial = async (trialTime: number, trialVersion: string) => {
  const now = new Date().getTime()

  await figma.clientStorage.setAsync('trial_start_date', now)
  await figma.clientStorage.setAsync('trial_version', trialVersion)
  await figma.clientStorage.setAsync('trial_time', trialTime)

  return figma.ui.postMessage({
    type: 'ENABLE_TRIAL',
    data: {
      date: now,
      trialTime: trialTime,
    },
  })
}

export default enableTrial
