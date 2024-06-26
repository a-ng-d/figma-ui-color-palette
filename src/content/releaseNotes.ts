import { ReleaseNote } from '../types/content'
import rnv19 from './images/release_note_v19.webp'
import rnv20 from './images/release_note_v20.webp'
import rnv21 from './images/release_note_v21.webp'
import rnv22 from './images/release_note_v22.webp'
import rnv23 from './images/release_note_v23.webp'
import rnv241 from './images/release_note_v24_1.webp'
import rnv242 from './images/release_note_v24_2.webp'
import rnv251 from './images/release_note_v25_1.webp'
import rnv252 from './images/release_note_v25_2.webp'
import rnv281 from './images/release_note_v28_1.webp'
import rnv282 from './images/release_note_v28_2.webp'
import rnv283 from './images/release_note_v28_3.webp'
import rnv291 from './images/release_note_v29_1.webp'
import rnv292 from './images/release_note_v29_2.webp'
import rnv301 from './images/release_note_v30_1.webp'
import rnv302 from './images/release_note_v30_2.webp'
import rnv311 from './images/release_note_v31_1.webp'
import rnv312 from './images/release_note_v31_2.webp'
import rnv313 from './images/release_note_v31_3.webp'
import rnv321 from './images/release_note_v32_1.webp'
import rnv322 from './images/release_note_v32_2.webp'
import rnv323 from './images/release_note_v32_3.webp'
import rnv331 from './images/release_note_v33_1.webp'
import rnv332 from './images/release_note_v33_2.webp'
import rnv333 from './images/release_note_v33_3.webp'
import rnv334 from './images/release_note_v33_4.webp'

const releaseNotes: Array<ReleaseNote> = [
  {
    version: '4.0.0',
    isMostRecent: true,
    title: [
      'UI Color Palette at the Config!',
      'Let’s Celebrate with a Special Offer',
      'Publish and Share Palettes',
      'Score Indicator Enhancement',
    ],
    image: [rnv331, rnv332, rnv333, rnv334],
    content: [
      'We are happy to share with you this new: UI Color Palette will be exhibited in the Figma Config community showcase! During the next weeks, we would like to celebrate our current users and welcome our new comers!',
      'The celebration is followed with special offer! For a limited time, we are offering a discount on our service and a longer trial period to supercharge your palettes. Enjoy exploring and creating!',
      'You have the ability to publish color palettes for your personal use or for the wider community. This allows for the reuse of synchronized palettes in other documents and provides a source of inspiration drawn from the collective offerings of the UI Color Palette community!',
      'The score indicators offer precise and useful metrics (WCAG 2 and 3), enabling you to effectively assess the contrast ratio between text and background colors.',
    ],
    numberOfNotes: 4,
    learnMore: [
      'https://uicp.link/whats-new',
      'https://uicp.link/whats-new',
      'https://uicp.link/whats-new',
      'https://uicp.link/whats-new',
    ],
  },
  {
    version: '3.2.0',
    isMostRecent: false,
    title: [
      'Stops Distribution Easing',
      'Canny Forefront Integration',
      'Custom Naming Convention',
    ],
    image: [rnv321, rnv322, rnv323],
    content: [
      'You can distribute stops using pre-configured easing such as "ease" or "ease-in". This method provides a quick way to evenly distribute them across the range, thereby enhancing harmonized color scaling.',
      'Canny has been emphasized and prioritized. This promotes user feedback and increases the visibility of community discussions, creating a more interactive and communicative user experience.',
      'The naming convention within the Custom preset can be adjusted to either increase or decrease the stop number (from 1-10, 10-100, or 100-1000). This option is only available when creating a palette.',
    ],
    numberOfNotes: 3,
    learnMore: [
      'https://uicp.link/whats-new',
      'https://uicp.link/whats-new',
      'https://uicp.link/whats-new',
    ],
  },
  {
    version: '3.1.0',
    isMostRecent: false,
    title: [
      'Ready to Dev Mode',
      'Need More Trial Time?',
      'Import Colors from Realtime Colors',
    ],
    image: [rnv311, rnv312, rnv313],
    content: [
      'Dev Mode, after a six-month beta test, is now complete tool for handoffs, effectively connecting designers and developers. Code extraction from palettes is now possible with this mode.',
      'Trial periods are now seven days long, giving you an extra 96 hours to try out locked features, collaborate between roles, set up processes, etc. We believe you will find this extension beneficial.',
      'Realtime Colors is a practical tool that allows you to test and adjust color palettes using a template. This work can then be imported into Figma to convert these color variations into a color system.',
    ],
    numberOfNotes: 3,
    learnMore: [
      'https://uicp.link/whats-new',
      'https://uicp.link/whats-new',
      'https://uicp.link/whats-new',
    ],
  },
  {
    version: '3.0.0',
    isMostRecent: false,
    title: [
      'Simulate various visions for accessibility',
      'Exports more for Android and Apple apps',
    ],
    image: [rnv301, rnv302],
    content: [
      'You can simulate color perception and contrast for various types of color blindness. This is a step towards incorporating accessibility into the design process.',
      'Both Android and Apple offer numerous ways to apply color themes. Now, you can export your palette for use in Compose on Android and UIKit on Apple.',
    ],
    numberOfNotes: 2,
    learnMore: ['https://uicp.link/whats-new', 'https://uicp.link/whats-new'],
  },
  {
    version: '2.9.0',
    isMostRecent: false,
    title: ['Use your palettes for Tailwind', 'Happy Xmas!'],
    image: [rnv291, rnv292],
    content: [
      'You can now set your new palettes using the Tailwind color system and export all the shades and themes to a JSON file that complies with its configuration.',
      "For Christmas, we're providing a special discount as an end-of-year gift.",
    ],
    numberOfNotes: 2,
    learnMore: ['https://uicp.link/whats-new', 'https://uicp.link/whats-new'],
  },
  {
    version: '2.8.0',
    isMostRecent: false,
    title: [
      'Black Friday Offer',
      'Import colors from Coolors',
      'Create a palette in fewer steps',
    ],
    image: [rnv283, rnv281, rnv282],
    content: [
      'The Pro plan for UI Color Palette is 90% off when billed yearly for the next two weeks. Happy Thanksgiving to our fellow Americans 🇺🇸!',
      "In the Source context when creating, you can view the selected colors (from the document canvas). Additionally, you're able to paste a URL from a Coolors palette to supplement your color collection prior to scaling.",
      'You can create a color palette using the quick action feature in just a few steps. Simply select the colors, choose the preset, specify the color space, and finally, name it using a simple input field.',
    ],
    numberOfNotes: 3,
    learnMore: [
      'https://uicp.link/black-friday',
      'https://uicp.link/whats-new',
      'https://uicp.link/whats-new',
    ],
  },
  {
    version: '2.5.0',
    isMostRecent: false,
    title: [
      '72-hour trial period to spread your palettes',
      'UI Color Palette is on LinkedIn',
    ],
    image: [rnv251, rnv252],
    content: [
      'Within 72 hours, all the tools will be available for you to test how you can distribute your color palettes among design and development teams. Our ambition is to make color palettes accessible, easy to handle, and publishable.',
      'Stay connected with our announcements and sharing, and help us spread good practices in building color palettes and systems.',
    ],
    numberOfNotes: 2,
    learnMore: ['https://uicp.link/whats-new', 'https://uicp.link/network'],
  },
  {
    version: '2.4.0',
    isMostRecent: false,
    title: [
      'UI Color palette 24: Create Color systems “like a Pro”',
      'UI Color palette 24: Color themes management “like a Pro”',
    ],
    image: [rnv241, rnv242],
    content: [
      'UI Color Palette allows you to create freely accessible color palettes. However, the Pro plan offers additional features such as color themes, more export options, and the ability to create variables that can transform your color palette into a color system. Are you ready to try it out?',
      'With the Pro plan, you can manage color themes within the same palette, enabling you to create as many variations of lightness scales as needed to build your color system. This feature is useful for managing both light and dark mode themes.',
    ],
    numberOfNotes: 2,
    learnMore: ['https://uicp.link/whats-new', 'https://uicp.link/whats-new'],
  },
  {
    version: '2.3.0',
    isMostRecent: false,
    title: ['UI Color Palette 23 says welcome to Color spaces'],
    image: [rnv23],
    content: [
      'Color spaces can be managed throughout the UI Color Palette. This allows you to select and switch between a variety of color spaces such as LCH, OKLCH, LAB, OKLAB, and HSL.',
    ],
    numberOfNotes: 1,
    learnMore: ['https://uicp.link/whats-new'],
  },
  {
    version: '2.2.0',
    isMostRecent: false,
    title: ['UI Color Palette 22 update highlight'],
    image: [rnv22],
    content: [
      'Newly extended to Figjam, the UI Color Palette plugin empowers designers to create and customize their UI color schemes at the start of the design process, providing greater flexibility to their workflow and enhancing their creative potential.',
    ],
    numberOfNotes: 1,
    learnMore: ['https://uicp.link/whats-new'],
  },
  {
    version: '2.1.0',
    isMostRecent: false,
    title: ['UI Color Palette 21 update highlight'],
    image: [rnv21],
    content: [
      "Enhance your palette customization by editing the text colors used for the contrast score, surpassing the restrictions of using pure black and white. This ensures that your palette remains accessible, aligns with your brand's style, and complies with the WCAG and APCA standards.",
    ],
    numberOfNotes: 1,
    learnMore: ['https://uicp.link/whats-new'],
  },
  {
    version: '2.0.0',
    isMostRecent: false,
    title: ['UI Color Palette 20 update highlight'],
    image: [rnv20],
    content: [
      "The color shades generation has been updated to improve the consistency of your palette's lightness and saturation. The new algorithm is automatically used for new palettes, and can be enabled for existing palettes in the settings.",
    ],
    numberOfNotes: 1,
    learnMore: ['https://uicp.link/whats-new'],
  },
  {
    version: '1.9.0',
    isMostRecent: false,
    title: ['UI Color Palette 19 update highlight'],
    image: [rnv19],
    content: [
      'Automatically identify the closest color shade to the source color when editing a palette. This feature aims to obtain the sRGB version of the source color that may not be natively within the gamut, making it easier to use in your UI.',
    ],
    numberOfNotes: 1,
    learnMore: ['https://uicp.link/whats-new'],
  },
]

export default releaseNotes
