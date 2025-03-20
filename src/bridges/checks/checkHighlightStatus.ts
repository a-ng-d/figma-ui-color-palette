const checkHighlightStatus = async (remoteVersion: string) => {
  const localVersion = await figma.clientStorage.getAsync('highlight_version')

  if (localVersion === undefined && remoteVersion === undefined)
    return figma.ui.postMessage({
      type: 'PUSH_HIGHLIGHT_STATUS',
      data: 'NO_HIGHLIGHT',
    })
  else if (localVersion === undefined)
    return figma.ui.postMessage({
      type: 'PUSH_HIGHLIGHT_STATUS',
      data: 'DISPLAY_HIGHLIGHT_DIALOG',
    })
  else {
    const remoteMajorVersion = remoteVersion.split('.')[0],
      remoteMinorVersion = remoteVersion.split('.')[1]

    const localMajorVersion = localVersion.split('.')[0],
      localMinorVersion = localVersion.split('.')[1]

    if (remoteMajorVersion !== localMajorVersion)
      return figma.ui.postMessage({
        type: 'PUSH_HIGHLIGHT_STATUS',
        data: 'DISPLAY_HIGHLIGHT_DIALOG',
      })

    if (remoteMinorVersion !== localMinorVersion)
      return figma.ui.postMessage({
        type: 'PUSH_HIGHLIGHT_STATUS',
        data: 'DISPLAY_HIGHLIGHT_NOTIFICATION',
      })
  }
}

export default checkHighlightStatus
