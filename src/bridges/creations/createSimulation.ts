import { Data, FullConfiguration } from '@yelbolt/engine-ui-color-palette'
import { tolgee } from '../..'

// Platform-independent core of "Simulate on selection": given a palette, find
// for any color the closest color the palette offers. Each platform only owns
// the canvas traversal (which nodes, which fills, undo, notifications).

// RGB channels are normalized between 0 and 1, like the engine's `gl` values
type Rgb = { r: number; g: number; b: number }

type Lab = [number, number, number]
type Lch = { l: number; c: number; h: number }
type Shade = { rgb: Rgb; lch: Lch }
type Family = { shades: Array<Shade>; hue: number; chroma: number }

// Below this OKLCH chroma a source color reads as neutral (white, grays,
// black) and its hue is meaningless; pale tints stay above it
const NEUTRAL_SOURCE_CHROMA = 0.015
// A palette color whose most saturated shade stays below this chroma is a
// neutral family, even when slightly tinted (e.g. cool or warm grays)
const NEUTRAL_FAMILY_CHROMA = 0.06

const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

const toOklab = ({ r, g, b }: Rgb): Lab => {
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

const toOklch = (color: Rgb): Lch => {
  const [l, a, b] = toOklab(color)
  return { l, c: Math.sqrt(a * a + b * b), h: Math.atan2(b, a) }
}

const hueGap = (a: number, b: number) => {
  const d = Math.abs(a - b) % (2 * Math.PI)
  return d > Math.PI ? 2 * Math.PI - d : d
}

const createFamilies = (palette: FullConfiguration): Array<Family> => {
  const libraryData = new Data(palette).makeLibraryData(['gl', 'alpha'])

  // Palettes with themes also carry a default-theme duplicate: keep only one
  // set of shades, and only one theme, so families are never mixed
  const hasThemes = libraryData.some((item) => !item.id.includes('00000000000'))
  const items = libraryData
    .filter((item) =>
      hasThemes
        ? !item.id.includes('00000000000')
        : item.id.includes('00000000000')
    )
    .filter((item) => item.gl !== undefined)
  const themeName = items[0]?.themeName

  const byName = new Map<string, Array<Shade>>()
  items
    .filter((item) => item.themeName === themeName)
    .forEach((item) => {
      const gl = item.gl ?? [0, 0, 0]
      const rgb = { r: gl[0], g: gl[1], b: gl[2] }
      const shades = byName.get(item.colorName) ?? []
      shades.push({ rgb, lch: toOklch(rgb) })
      byName.set(item.colorName, shades)
    })

  // A family's hue is read on its most saturated shade, where it is the most
  // reliable; its chroma tells whether the family is a neutral one
  return Array.from(byName.values()).map((shades) => {
    const peak = shades.reduce((a, b) => (b.lch.c > a.lch.c ? b : a))
    return { shades, hue: peak.lch.h, chroma: peak.lch.c }
  })
}

// Simulation in two steps, the way a designer would pick a replacement:
// 1. the palette color (family of shades) with the closest hue — or the most
//    neutral one when the source color is itself neutral;
// 2. within that family, the shade with the closest lightness.
// Returns null when the palette has no usable color.
const createPaletteMatcher = (
  palette: FullConfiguration
): ((color: Rgb) => Rgb) | null => {
  const families = createFamilies(palette)
  if (families.length === 0) return null

  const chromatics = families.filter((f) => f.chroma >= NEUTRAL_FAMILY_CHROMA)
  const mostNeutral = families.reduce((a, b) => (b.chroma < a.chroma ? b : a))
  const cache = new Map<string, Rgb>()

  const match = (color: Rgb): Rgb => {
    const key = `${color.r},${color.g},${color.b}`
    const cached = cache.get(key)
    if (cached !== undefined) return cached

    const lch = toOklch(color)

    const family =
      lch.c < NEUTRAL_SOURCE_CHROMA || chromatics.length === 0
        ? mostNeutral
        : chromatics.reduce((a, b) =>
            hueGap(lch.h, b.hue) < hueGap(lch.h, a.hue) ? b : a
          )

    const shade = family.shades.reduce((a, b) => {
      const dA = Math.abs(a.lch.l - lch.l)
      const dB = Math.abs(b.lch.l - lch.l)
      if (dB !== dA) return dB < dA ? b : a
      return Math.abs(b.lch.c - lch.c) < Math.abs(a.lch.c - lch.c) ? b : a
    })

    cache.set(key, shade.rgb)
    return shade.rgb
  }

  return match
}

const remapPaints = (
  paints: ReadonlyArray<Paint>,
  match: (color: Rgb) => Rgb
): { paints: Array<Paint>; count: number } => {
  let count = 0
  const next = paints.map((paint) => {
    if (paint.type !== 'SOLID') return paint
    count++
    return {
      type: 'SOLID',
      color: match(paint.color),
      opacity: paint.opacity,
      visible: paint.visible,
      blendMode: paint.blendMode,
    } as SolidPaint
  })
  return { paints: next, count }
}

const remapNode = (node: SceneNode, match: (color: Rgb) => Rgb): number => {
  let count = 0

  if (node.type === 'TEXT' && node.fills === figma.mixed)
    node.getStyledTextSegments(['fills']).forEach((segment) => {
      const result = remapPaints(segment.fills, match)
      if (result.count > 0) {
        node.setRangeFills(segment.start, segment.end, result.paints)
        count += result.count
      }
    })
  else if ('fills' in node && node.fills !== figma.mixed) {
    const result = remapPaints(node.fills as ReadonlyArray<Paint>, match)
    if (result.count > 0) {
      node.fills = result.paints
      count += result.count
    }
  }

  if ('strokes' in node) {
    const result = remapPaints(node.strokes, match)
    if (result.count > 0) {
      node.strokes = result.paints
      count += result.count
    }
  }

  return count
}

const simulateNode = (node: SceneNode, match: (color: Rgb) => Rgb) => {
  if (!node.visible || node.locked) return

  remapNode(node, match)
  if ('children' in node)
    node.children.forEach((child) => simulateNode(child, match))
}

const createSimulation = async (id: string) => {
  const rawPalette = figma.currentPage.getSharedPluginData(
    'uicp',
    `palette_${id}`
  )

  if (rawPalette === '') throw new Error(tolgee.t('error.unfoundPalette'))

  const selection = figma.currentPage.selection
  if (selection.length === 0)
    return {
      type: 'WARNING' as const,
      message: tolgee.t('warning.emptySelection'),
    }

  const palette = JSON.parse(rawPalette) as FullConfiguration
  const match = createPaletteMatcher(palette)

  if (match === null) throw new Error(tolgee.t('error.unfoundPalette'))

  selection.forEach((node) => simulateNode(node, match))

  figma.commitUndo()
}

export default createSimulation
