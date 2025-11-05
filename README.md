![GitHub package.json version](https://img.shields.io/github/package-json/v/a-ng-d/figma-ui-color-palette?color=informational) ![GitHub last commit](https://img.shields.io/github/last-commit/a-ng-d/figma-ui-color-palette?color=informational) ![GitHub](https://img.shields.io/github/license/a-ng-d/figma-ui-color-palette?color=informational)

# UI Color Palette on Figma
UI Color Palette is a Figma, Dev mode, and FigJam plugin that creates consistent and accessible color palettes specifically for UI. The plugin uses alternative color spaces, like `LCH`, `OKLCH`, `CIELAB`, `OKLAB`, and `HSLuv`, to create color shades and tints based on the configured lightness scale. These spaces ensure [WCAG standards](https://www.w3.org/WAI/standards-guidelines/wcag/) compliance and sufficient contrast between information and background color.

The idea to make this Figma plugin comes from the article: [Accessible Palette: stop using HSL for color systems](https://wildbit.com/blog/accessible-palette-stop-using-hsl-for-color-systems).

This plugin will allow you to:
- Create a complete palette from any existing color to help you build a color scaling (or Primitive colors)
- Manage the color palette in real-time to control the contrast
- Sync the color shades/tints with local styles, and variables
- Generate code in various languages
- Publish the palette for reuse across multiple documents or add shared palettes from the community

## Documentation
The full documentation can be consulted on [docs.ui-color-palette.com](https://uicp.ylb.lt/docs-figma-plugin).

## Contribution
### Community
Ask questions, submit your ideas or requests on [Canny](https://uicp.ylb.lt/ideas).

### Issues
Have you encountered a bug? Could a feature be improved?
Go to the `Issues` section and browse the existing tickets or create a new one.

### Development
- Clone this repository (or fork it)
- Install dependencies with `npm install`
- Run `npm run start:dev` to watch in development mode
- Run `npm run start:ext` to run the external services such as the workers ansd the auth lobby
- Go to Figma, then `Plugins` > `Development` > `Import plugin from manifest…` and choose `manifest.json` in the repository
- Create a `Branch` and open a `Pull Request`
- _Let's do this_

### Beta test
- Go to the `Actions` sections and access the `Build and Download UI Color Palette` tab
- Click `Run workflow`, then select a branch and confirm
- Wait a minute, and once finished, download the artifact (which is a ZIP file containing the plugin)
- Go to Figma, then `Plugins` > `Development` > `Import plugin from manifest…` and choose `manifest.json` in the unzipped folder
- _Enjoy!_

---

## Attribution
- The colors are managed thanks to the [chroma.js](https://github.com/gka/chroma.js) library by [Gregor Aisch](https://github.com/gka)
- The APCA algorithm is provided thanks to the [apca-w3](https://www.npmjs.com/package/apca-w3) module by [Andrew Somers](https://github.com/Myndex)
- The color names are provided by [color-name](https://github.com/meodai/color-names) by [meodai](https://github.com/meodai/color-names)
- Presets inspired by these organizations and projects: [Ant Design](https://ant.design/docs/spec/colors) | [Bootstrap](https://getbootstrap.com/docs/5.3/customize/color/#all-colors) | [Tailwind CSS](https://tailwindcss.com/docs/colors) | [Material (M3)](https://m3.material.io/styles/color/static/baseline) | [Untitled UI](https://untitledui.com/) | [Open Color](https://yeun.github.io/open-color/) | [Radix](https://www.radix-ui.com/colors) | [Atlassian](https://atlassian.design/foundations/color-new/color-palette-new) | [Shopify Polaris](https://polaris-react.shopify.com/design/colors/palettes-and-roles) | [Uber Base](https://base.uber.com/6d2425e9f/p/797362-color-beta) | [Microsoft Fluent](https://fluent2.microsoft.design/color/) | [IBM Carbon](https://carbondesignsystem.com/elements/color/overview/) | [Adobe Spectrum](https://spectrum.adobe.com/page/color-palette/)

## Support
- [Follow the plugin LinkedIn page](https://uicp.ylb.lt/network)
- [Support the author](https://uicp.ylb.lt/author)
