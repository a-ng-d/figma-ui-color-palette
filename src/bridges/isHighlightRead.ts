const isHighlightRead = async (version: string) => {
  // debug figma.clientStorage.deleteAsync(`${version}_isRead`)
  if (await figma.clientStorage.getAsync(`${version}_isRead`) == undefined || await !figma.clientStorage.getAsync(`${version}_isRead`))
    await figma.ui.postMessage({
      type: 'highlight-status',
      data: false
    })
  else
    await figma.ui.postMessage({
      type: 'highlight-status',
      data: true
    })
}

export default isHighlightRead
