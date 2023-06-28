import type { ReleaseNote } from '../utils/types'
import rnv22 from './images/release_note_v22.webp'
import rnv21 from './images/release_note_v21.webp'
import rnv20 from './images/release_note_v20.webp'
import rnv19 from './images/release_note_v19.webp'

const releaseNotes: Array<ReleaseNote> = [
  {
    version: '2.2.0',
    isMostRecent: true,
    title: 'UI Color Palette 22 update highlight',
    image: rnv22,
    content:
      'Newly extended to Figjam, the UI Color Palette plugin empowers designers to create and customize their UI color schemes at the start of the design process, providing greater flexibility to their workflow and enhancing their creative potential.',
    learnMore: 'https://uicp.link/whats-new',
  },
  {
    version: '2.1.0',
    isMostRecent: false,
    title: 'UI Color Palette 21 update highlight',
    image: rnv21,
    content:
      "Enhance your palette customization by editing the text colors used for the contrast score, surpassing the restrictions of using pure black and white. This ensures that your palette remains accessible, aligns with your brand's style, and complies with the WCAG and APCA standards.",
    learnMore: 'https://uicp.link/whats-new',
  },
  {
    version: '2.0.0',
    isMostRecent: false,
    title: 'UI Color Palette 20 update highlight',
    image: rnv20,
    content:
      "The color shades generation has been updated to improve the consistency of your palette's lightness and saturation. The new algorithm is automatically used for new palettes, and can be enabled for existing palettes in the settings.",
    learnMore: 'https://uicp.link/whats-new',
  },
  {
    version: '1.9.0',
    isMostRecent: false,
    title: 'UI Color Palette 19 update highlight',
    image: rnv19,
    content:
      'Automatically identify the closest color shade to the source color when editing a palette. This feature aims to obtain the sRGB version of the source color that may not be natively within the gamut, making it easier to use in your UI.',
    learnMore: 'https://uicp.link/whats-new',
  },
]

export default releaseNotes
