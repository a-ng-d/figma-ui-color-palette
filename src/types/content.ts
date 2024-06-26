export interface ReleaseNote {
  version: string
  isMostRecent: boolean
  title: Array<string>
  image: Array<string>
  content: Array<string>
  numberOfNotes: number
  learnMore: Array<`https://${string}`>
}
