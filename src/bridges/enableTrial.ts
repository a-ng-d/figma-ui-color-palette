const enableTrial = async () => {
  await figma.clientStorage
    .setAsync('trial_start_date', new Date().getTime())
    .then(() => {
      figma.ui.postMessage({
        type: 'ENABLE_TRIAL',
      })
    })
}

export default enableTrial
