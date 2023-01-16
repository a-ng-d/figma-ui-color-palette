![GitHub package.json version](https://img.shields.io/github/package-json/v/inVoltag/figma-ui-color-palette?color=informational) ![GitHub last commit](https://img.shields.io/github/last-commit/inVoltag/figma-ui-color-palette?color=informational) ![GitHub](https://img.shields.io/github/license/inVoltag/figma-ui-color-palette?color=informational) ![Twitter Follow](https://img.shields.io/twitter/follow/a_ng_d?style=social)

# UI Color Palette
UI Color Palette is a Figma plugin that generates consistant and accessible color palettes. The plugin uses the LCH model to generate colors according to the chosen lightness scale. The model LCH is relevant to make colors compliant with the [WCAG standards](https://www.w3.org/WAI/standards-guidelines/wcag/). The idea to make this Figma plugin comes from that article: [Accessible Palette: stop using HSL for color systems](https://wildbit.com/blog/accessible-palette-stop-using-hsl-for-color-systems).

## Documentation
### What is LCH model
Every variants from a starting color is created by using the LCH (Lightness-Chroma-Hue) color model. It works like the HSL (Hue-Saturation-Lightness) color model. The HSL is simple to use to build a color system, because the lightness can just be changed to create variants. The LCH too, but the Chroma, and the Hue are automatically adjusted to keep the colors within the [sRGB gamut](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/#1-we-actually-get-access-to-about-50-more-colors).

### Create a color palette
![Create a color palette](./assets/create-color-palette.gif 'Create a color palette')
- Run the plugin
- Select some layers in the canvas filled with at least one solid color. It will be use as starting colors to create the color palette.
- Edit the lightness scale with the multiple stops slider, linked with the LCH lightness scale (from 0% to 100%). You can choose the preset you need to configure the number of stops:
  - Material Design, from 50 to 900 (10 stops)
  - Ant Design, from 1 to 10 (10 stops)
  - ADS Foundations (Atlassian), from 50 to 500 (7 stops)
  - ADS Foundations Neutrals (Atlassian), from 0 to 900 (19 stops)
  - Carbon (IBM), from 10 to 100 (10 stops)
  - Base (Uber), from 10 to 700 (8 stops)
  - Custom, from 2 to 24 (24 stops)
- Choose the captions display. It indicates the color name, the hexadecimal code, the RGB and LCH values, the contrast ratio, and the WCAG score.
- Click `Create a color palette` to generate directly the palette on the Figma canvas. The palette is automatically selected and the view is centered on it. Its default name is `UI Color Palette`.

The UI Color Palette is composed of a frame called `colors`, gathering every variants of the starting colors－according to the chosen lightness scale.

> Note: The variant color's Chroma/Hue values may change (compared to the starting color's one) to be inside the sRBG gamut.

The palette architecture (do not manual edit it) is:
- UI Color Palette・Preset name
  - _colors
      - layerName
        - scale-0
        - …
        - scale-N
      - …
      - _header
        - scale-0
        - …
        - scale-N
        - Colors
      - _title


### Edit a color palette
> Note: Editing a color palette only works on those already created with the plugin.

- Run the plugin
- Select a color palette
---
![Edit lightness scale from the palette](./assets/edit-lightness-scale.gif 'Edit lightness scale from the palette')
- Edit the palette lightness scale with the multiple stops slider－real time editing
- Select a stop and use the left and right arrow with your keyboard to shift it with more accuracy (press Alt ⌥ to shift it with a reduced step)
- In custom mode, select a stop and press Backspace ⌫ to remove it (up to 2 minimum)
- In custom mode, click on the slider range to add a stop (up to 24 maximum)
---
![Edit starting colors from the palette](./assets/edit-starting-colors.gif 'Edit starting colors from the palette')

![Add a starting color to the palette](./assets/add-starting-color.gif 'Add a starting color to the palette')
- Edit the starting colors－real time editing:
  - Tweak:
    - the hexadecimal code
    - the LCH parameters
    - the color model (LCH/OKLCH)
    - the hue range shifting
  - Rename or remove a color
  - Reorder the colors
  - Adding a new color to the palette
---
- Choose the caption display－real time editing
- Click `Create local styles` to create Figma document local styles from every color of the palette
- Click `Update the local styles` to update every edited colors already declared as local style
- Export every color of the palette to:
  - JSON (color tokens)
  - CSS Custom Properties

### Troubleshooting
- `Your UI Color Palette seems corrupted. Do not edit any layer within it`: The palette has been manually edited, and it may occur troubles and errors. So the plugins avoids executing editing while the palette does not seem compliant with the architecture.
- `The layer 'foo' must get at least one solid color`: You have selected a layer without any solid color.
- The real-time edit is quite slow: It depends of the number of color samples in the palette. Dealing with hundreds of samples may slow your Figma and cause UI freezes.

## Contribution
- Clone this repository (or fork it)
- Install dependencies with `npm install`
- Run `npm run start` to watch in development mode
- Go to Figma, then `Plugins` > `Development` > `Import plugin from manifest…` and choose `manifest.json` in the repository

## Attribution
- The colors are managed thanks to the [chroma.js](https://github.com/gka/chroma.js) library by [Gregor Aisch](https://github.com/gka)

## Support
- [Follow me on Twitter 🐦](https://twitter.com/a_ng_d)
- [Buy me a coffee ☕️](https://www.buymeacoffee.com/a_ng_d)
