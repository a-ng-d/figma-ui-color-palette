![GitHub package.json version](https://img.shields.io/github/package-json/v/inVoltag/figma-ui-color-palette?color=informational) ![GitHub last commit](https://img.shields.io/github/last-commit/inVoltag/figma-ui-color-palette?color=informational) ![GitHub](https://img.shields.io/github/license/inVoltag/figma-ui-color-palette?color=informational) ![Twitter Follow](https://img.shields.io/twitter/follow/a_ng_d?style=social)

# UI Color Palette
UI Color Palette is a Figma and FigJam plugin creating consistent and accessible color palettes specifically for UI. The plugin uses the alternative color space from `RGB` and `HSL`, like `LCH`, `OKLCH`, `CIELAB`, `OKLAB`, and `HSLuv`, to create color shades according to the chosen lightness scale. These spaces are relevant to make these shades compliant with the [WCAG standards](https://www.w3.org/WAI/standards-guidelines/wcag/) and guarantee enough contrast between the information and its background color. The idea to make this Figma plugin comes from the article: [Accessible Palette: stop using HSL for color systems](https://wildbit.com/blog/accessible-palette-stop-using-hsl-for-color-systems).

This plugin will allow you to:
- Create a complete palette from any existing color to help you build a color system.
- Adjust the color palette in real-time to control the contrast.
- Deploy the color palette by publishing it as local styles and variables or exporting it as code for several platforms.

## Documentation
The full documentation can be consulted on [docs.ui-color-palette.com](https://uicp.link/docs).

## Contribution
### Community
Ask questions, submit your ideas or requests, discuss your usage, debate the evolution, get support, etc.
Open a new discussion to share your usage, issues, or ideas with the community (requires a GitHub account) or browse the topics.
Go to the [Discussion](https://uicp.link/discuss) section to enter the community.

### Issues
Have you encountered a bug? Could a feature be improved?
Go to the [Issues](https://uicp.link/report) section and browse the existing tickets or create a new one.

### Development
- Clone this repository (or fork it)
- Install dependencies with `npm install`
- Run `npm run start` to watch in development mode
- Go to Figma, then `Plugins` > `Development` > `Import plugin from manifest…` and choose `manifest.json` in the repository
- Create a `Branch` and open a `Pull Request`
- _Let's do this_

## Attribution
- The colors are managed thanks to the [chroma.js](https://github.com/gka/chroma.js) library by [Gregor Aisch](https://github.com/gka)
- The APCA algorithm is provided thanks to the [apca-w3](https://www.npmjs.com/package/apca-w3) module by [Andrew Somers](https://github.com/Myndex)
- The Figma components are emulated thanks to the [Figma Plugin DS](https://github.com/thomas-lowry/figma-plugin-ds) stylesheet by [Tom Lowry](https://github.com/thomas-lowry)

## Support
- [Follow my posts on LinkedIn 💼](https://uicp.link/network)
- [Support me on Figma 🎨](https://uicp.link/author)
- [Buy me a coffee ☕️](https://uicp.link/donate)
