import releaseNotes from '../content/releaseNotes'

const isHighlightRead = async (version: string) => {
  // figma.clientStorage.deleteAsync(`${version}_isRead`)
  const mostRecentReleaseNoteVersion: string = releaseNotes.filter(
    (note) => note['isMostRecent']
  )[0]['version']

  if (mostRecentReleaseNoteVersion != version)
    await figma.ui.postMessage({
      type: 'highlight-status',
      data: true,
    })
  else {
    if (
      (await figma.clientStorage.getAsync(`${version}_isRead`)) == undefined ||
      (await !figma.clientStorage.getAsync(`${version}_isRead`))
    )
      await figma.ui.postMessage({
        type: 'highlight-status',
        data: false,
      })
    else
      await figma.ui.postMessage({
        type: 'highlight-status',
        data: true,
      })
  }
}

export default isHighlightRead
