const checkAnnouncementsStatus = async (remoteVersion: string) => {
  const localVersion = await figma.clientStorage.getAsync(
    'announcements_version'
  )
  const isOnboardingRead =
    await figma.clientStorage.getAsync('is_onboarding_read')

  if (localVersion === '' && remoteVersion === '')
    return {
      type: 'PUSH_ANNOUNCEMENTS_STATUS',
      data: {
        status: 'NO_ANNOUNCEMENTS',
      },
    }
  else if (localVersion === '' && isOnboardingRead === '')
    return figma.ui.postMessage({
      type: 'PUSH_ONBOARDING_STATUS',
      data: {
        status: 'DISPLAY_ONBOARDING_DIALOG',
      },
    })
  else if (localVersion === '')
    return figma.ui.postMessage({
      type: 'PUSH_ANNOUNCEMENTS_STATUS',
      data: {
        status: 'DISPLAY_ANNOUNCEMENTS_DIALOG',
      },
    })
  else {
    const remoteMajorVersion = remoteVersion.split('.')[0],
      remoteMinorVersion = remoteVersion.split('.')[1]

    const localMajorVersion = localVersion?.split('.')[0],
      localMinorVersion = localVersion?.split('.')[1]

    if (remoteMajorVersion !== localMajorVersion)
      return figma.ui.postMessage({
        type: 'PUSH_ANNOUNCEMENTS_STATUS',
        data: {
          status: 'DISPLAY_ANNOUNCEMENTS_DIALOG',
        },
      })

    if (remoteMinorVersion !== localMinorVersion)
      return figma.ui.postMessage({
        type: 'PUSH_ANNOUNCEMENTS_STATUS',
        data: {
          status: 'DISPLAY_ANNOUNCEMENTS_NOTIFICATION',
        },
      })

    return {
      type: 'PUSH_ANNOUNCEMENTS_STATUS',
      data: {
        status: 'NO_ANNOUNCEMENTS',
      },
    }
  }
}

export default checkAnnouncementsStatus
