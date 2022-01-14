# Awesome Colors Palette
Awesome Colors Palette is a Figma plugin that generates consistante xand accessible color palettes. The plugin uses the LCH model to generate colors according to the lightness scale. The model LCH is relevant to make colors compliant with the [WCAG standards](https://www.w3.org/WAI/standarsds-guidelines/wcag/). The idea to make a Figma plugin to build a color system comes from that article: [Accessible Palette: stop using HSL for color systems](https://wildbit.com/blog/accessible-palette-stop-using-hsl-for-color-systems).

## Documentation
### What is LCH model
Every variants from a starting color is created using the LCH (Lightness Chroma Hue) color model. It works a bit like the HSL (Hue Saturation Lightness) color model. The HSL is really simple to use to build a color system, because the lightness can just be changed to create variants. The LCH too, but the Chroma, and Hue are automatically adjusted to keep the colors within the [sRGB gamut](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/#1-we-actually-get-access-to-about-50-more-colors).

### Create a colors palette
![Create a colors palette](./assets/create-colors-palette.gif 'Create a colors palette')
- Run the plugin
- Select some layers in the canvas with at least one solid color as fill. Those fills will be use as starting colors at creating the colors palette
- Edit the lightness scale with the multiple knobs slider. There are 10 steps (from 50 to 900), indexed on lightness scale (from 0% to 100%) from the LCH model.
- Choose if you want to display a caption for every color by clicking on the `Show captions` checkbox. The caption indicates the color name, the hexadecimal code, the LCH code, and the contrast (and WCAG compliance)
- Click `Create a colors palette` to generate directly the palette on the Figma canvas. The palette is automatically selected and the view is centered on it. Its default name is `Awesome Colors Palette`.

The Awesome Colors Palette is composed of a frame called `colors`. This frame gathers every variants of the starting colors according to the chosen lightness scale (10 steps, from 50 to 900). Here is the palette architecture (do not manual edit it):

- Awesome Colors Palette
  - colors
    - layerName
      - layerName-50
      - …
      - layerName-900
    - …

### Edit a colors palette
> Note: Editing a colors palette only works on those already created with the plugin

![Edit a colors palette](./assets/edit-colors-palette.gif 'Edit a colors palette')
- Run the plugin
- Select a colors palette
- Edit the palette lightness scale by moving the knobs. The editing occurs in real time
- Choose the caption display. Your choice will occur in real time.
- Click `Create local styles` to create Figma document local styles from each color of the palette
- Click `Update the local styles` to update every edited colors already declared as local style

### Troubleshooting
- `Your Awesome Color Palette seems corrupted. Do not edit any layer within it.`: The palette has been edited without the plugin. Some manual editing may occur troubles and errors. So the plugins avoids executing editing while the palette does not seem compliant with the architecture
- `The layer 'foo' must get at least one solid color`: You have selected a layer without any solid color fill

## Contribution
- Clone this repository (or fork it)
- Install dependencies with `npm install`
- Run `npm run start` to watch in development mode
- Go to Figma, then `Plugins` > `Development` > `Import plugin from manifest…` and choose `manifest.json` in the repository

## Support
- [Follow me on Twitter 🐦](https://twitter.com/inVoltag)
- [Shoot me a coffee ☕️](https://www.buymeacoffee.com/inVoltag)
