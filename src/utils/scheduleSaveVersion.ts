const DEBOUNCE_DELAY = 2000

let timeoutId: ReturnType<typeof setTimeout> | undefined

const scheduleSaveVersion = (label: string) => {
  if (timeoutId !== undefined) clearTimeout(timeoutId)

  timeoutId = setTimeout(() => {
    timeoutId = undefined
    figma.saveVersionHistoryAsync(label)
  }, DEBOUNCE_DELAY)
}

export default scheduleSaveVersion
