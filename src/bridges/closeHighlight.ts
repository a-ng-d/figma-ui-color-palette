const closeHighlight = (options: {
  data: { version: string; isRead: boolean }
}) => {
  figma.clientStorage.setAsync(
    `${options.data.version}_isRead`,
    options.data.isRead
  )
}

export default closeHighlight
