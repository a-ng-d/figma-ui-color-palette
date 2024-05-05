import releaseNotes from '../../content/releaseNotes'

const checkHighlightStatus = async (version: string) => {
  // figma.clientStorage.deleteAsync(`${version}_isRead`)
  const mostRecentReleaseNoteVersion: string = releaseNotes.filter(
    (note) => note['isMostRecent']
  )[0]['version']

  if (mostRecentReleaseNoteVersion != version)
    await figma.ui.postMessage({
      type: 'HIGHLIGHT_STATUS',
      data: 'NO_RELEASE_NOTE',
    })
  else {
    if (
      (await figma.clientStorage.getAsync(`${version}_isRead`)) == undefined ||
      (await !figma.clientStorage.getAsync(`${version}_isRead`))
    )
      await figma.ui.postMessage({
        type: 'HIGHLIGHT_STATUS',
        data:
          figma.payments != undefined
            ? figma.payments.getUserFirstRanSecondsAgo() > 60
              ? 'UNREAD_RELEASE_NOTE'
              : 'READ_RELEASE_NOTE'
            : 'READ_RELEASE_NOTE',
      })
    else
      await figma.ui.postMessage({
        type: 'HIGHLIGHT_STATUS',
        data: 'READ_RELEASE_NOTE',
      })
  }
}

export default checkHighlightStatus
