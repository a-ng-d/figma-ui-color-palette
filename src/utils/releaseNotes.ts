interface RealeaseNote {
  version: string,
  title: string,
  image: string,
  content: string,
  learnMore: string
}

const releaseNotes: Array<RealeaseNote> = [
  {
    'version': '1.8.0',
    'title': 'Version 18 has been removed from the oven',
    'image': '',
    'content': 'test',
    'learnMore': ''
  }
]

export default releaseNotes