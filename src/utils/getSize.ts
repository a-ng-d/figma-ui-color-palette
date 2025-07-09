// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getJsonSize = (obj: any): number => {
  try {
    const jsonString = JSON.stringify(obj)
    let size = 0
    for (let i = 0; i < jsonString.length; i++) {
      const code = jsonString.charCodeAt(i)
      if (code <= 0x7f) size += 1
      else if (code <= 0x7ff) size += 2
      else if (code >= 0xd800 && code <= 0xdfff) {
        size += 4
        i++
      } else if (code <= 0xffff) size += 3
      else size += 4
    }

    return parseFloat((size / 1024).toFixed(2))
  } catch (e) {
    return 100
  }
}
