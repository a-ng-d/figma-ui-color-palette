# UI Color Palette
UI Color Palette is a Figma plugin that generates consistant and accessible color palettes. The plugin uses the LCH model to generate colors according to the chosen lightness scale. The model LCH is relevant to make colors compliant with the [WCAG standards](https://www.w3.org/WAI/standards-guidelines/wcag/). The idea to make this Figma plugin comes from that article: [Accessible Palette: stop using HSL for color systems](https://wildbit.com/blog/accessible-palette-stop-using-hsl-for-color-systems).

## Documentation
### What is LCH model
Every variants from a starting color is created by using the LCH (Lightness-Chroma-Hue) color model. It works like the HSL (Hue-Saturation-Lightness) color model. The HSL is simple to use to build a color system, because the lightness can just be changed to create variants. The LCH too, but the Chroma, and the Hue are automatically adjusted to keep the colors within the [sRGB gamut](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/#1-we-actually-get-access-to-about-50-more-colors).

### Create a color palette
![Create a color palette](./assets/create-colors-palette.gif 'Create a color palette')
- Run the plugin
- Select some layers in the canvas filled with at least one solid color. It will be use as starting colors to create the color palette.
- Edit the lightness scale with the multiple knobs slider. There are 10 steps (from 50 to 900), linked with the LCH lightness scale (from 0% to 100%).
- Choose the captions display. It indicates the color name, the hexadecimal code, the RGB and LCH values, the contrast ratio, and the WCAG score.
- Click `Create a color palette` to generate directly the palette on the Figma canvas. The palette is automatically selected and the view is centered on it. Its default name is `UI Color Palette`.

The UI Color Palette is composed of a frame called `colors`, gathering every variants of the starting colors－according to the chosen lightness scale.

> Note: The variant color's Chroma/Hue values may change (compared to the starting color's one) to be inside the sRBG gamut.

The palette architecture (do not manual edit it) is:
- UI Color Palette
  - colors
    - layerName
      - layerName-50
      - …
      - layerName-900
    - …

### Edit a color palette
> Note: Editing a color palette only works on those already created with the plugin.

![Edit a color palette](./assets/edit-colors-palette.gif 'Edit a color palette')
- Run the plugin
- Select a color palette
- Edit the palette lightness scale with the multiple knobs slider－real time editing.
- Choose the caption display－real time editing.
- Click `Create local styles` to create Figma document local styles from every color of the palette
- Click `Update the local styles` to update every edited colors already declared as local style

### Troubleshooting
- `Your UI Color Palette seems corrupted. Do not edit any layer within it.`: The palette has been manually edited, and it may occur troubles and errors. So the plugins avoids executing editing while the palette does not seem compliant with the architecture.
- `The layer 'foo' must get at least one solid color`: You have selected a layer without any solid color.

## Contribution
- Clone this repository (or fork it)
- Install dependencies with `npm install`
- Run `npm run start` to watch in development mode
- Go to Figma, then `Plugins` > `Development` > `Import plugin from manifest…` and choose `manifest.json` in the repository

## Attribution
- The colors are managed thanks to the [chroma.js](https://github.com/gka/chroma.js) library by [Gregor Aisch](https://github.com/gka)

## Support
- [Follow me on Twitter 🐦](https://twitter.com/inVoltag)
- [Shoot me a coffee ☕️](https://www.buymeacoffee.com/inVoltag)
