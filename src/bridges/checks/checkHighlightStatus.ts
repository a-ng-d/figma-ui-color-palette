import { releaseNotesVersion } from '../../utils/config'

const checkHighlightStatus = async () => {
  // figma.clientStorage.deleteAsync(`${version}_isRead`)
  const isRead = await figma.clientStorage.getAsync(
    `${releaseNotesVersion}_isRead`
  )

  if (isRead === undefined || !isRead)
    figma.ui.postMessage({
      type: 'CHECK_HIGHLIGHT_STATUS',
      data:
        figma.payments !== undefined
          ? figma.payments.getUserFirstRanSecondsAgo() > 60
            ? 'UNREAD_RELEASE_NOTE'
            : 'READ_RELEASE_NOTE'
          : 'READ_RELEASE_NOTE',
    })
  else
    figma.ui.postMessage({
      type: 'CHECK_HIGHLIGHT_STATUS',
      data: 'READ_RELEASE_NOTE',
    })
}

export default checkHighlightStatus
