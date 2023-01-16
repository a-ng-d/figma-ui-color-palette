![GitHub package.json version](https://img.shields.io/github/package-json/v/inVoltag/figma-ui-color-palette?color=informational) ![GitHub last commit](https://img.shields.io/github/last-commit/inVoltag/figma-ui-color-palette?color=informational) ![GitHub](https://img.shields.io/github/license/inVoltag/figma-ui-color-palette?color=informational) ![Twitter Follow](https://img.shields.io/twitter/follow/a_ng_d?style=social)

# UI Color Palette
UI Color Palette is a Figma plugin that generates consistant and accessible color palettes. The plugin uses the LCH model to generate colors according to the chosen lightness scale. The model LCH is relevant to make colors compliant with the [WCAG standards](https://www.w3.org/WAI/standards-guidelines/wcag/). The idea to make this Figma plugin comes from that article: [Accessible Palette: stop using HSL for color systems](https://wildbit.com/blog/accessible-palette-stop-using-hsl-for-color-systems).

## Documentation
The full documentation can be consulted on [docs.ui-color-palette.com](https://docs.ui-color-palette.com).

## Contribution
- Clone this repository (or fork it)
- Install dependencies with `npm install`
- Run `npm run start` to watch in development mode
- Go to Figma, then `Plugins` > `Development` > `Import plugin from manifest…` and choose `manifest.json` in the repository

## Attribution
- The colors are managed thanks to the [chroma.js](https://github.com/gka/chroma.js) library by [Gregor Aisch](https://github.com/gka)
- The APCA algorithm is provided thanks to the [apca-w3](https://www.npmjs.com/package/apca-w3) module by [Andrew Somers](https://github.com/Myndex)

## Support
- [Follow me on Twitter 🐦](https://twitter.com/a_ng_d)
- [Buy me a coffee ☕️](https://www.buymeacoffee.com/a_ng_d)
