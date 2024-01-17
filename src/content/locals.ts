export const lang = 'en-US'

const glossary: {
  [key: string]: string
} = {
  colorSpace: 'Color space',
  lch: 'LCH',
  oklch: 'OKLCH',
  lab: 'CIELAB',
  oklab: 'OKLAB',
  hsl: 'HSL',
  hsluv: 'HSLuv',
  hex: 'HEX',
  rgb: 'RGB',
  p3: 'P3',
  protanomaly: 'Protanomaly',
  protanopia: 'Protanopia',
  deuteranomaly: 'Deuteranomaly',
  deuteranopia: 'Deuteranopia',
  tritanomaly: 'Tritanomaly',
  tritanopia: 'Tritanopia',
  achromatomaly: 'Achromatomaly',
  achromatopsia: 'Achromatopsia',
}

export const locals: { [key: string]: any } = {
  'en-US': {
    name: 'UI Color Palette',
    tagline:
      'Create accessible color palettes for UI with consistent lightness and contrast',
    url: 'www.ui-color-palette.com',
    global: {
      description: {
        label: 'Description',
        placeholder: "What's it for?",
      },
    },
    onboarding: {
      selectColor:
        'Select your source colors (solid colors only) on the Figma/FigJam canvas to create a UI Color Palette',
      selectPalette: 'Select a UI Color Palette to edit',
    },
    shortcuts: {
      feedback: 'Give feedback',
      trialFeedback: 'How was it?',
      news: "What's new",
      about: 'About',
    },
    relaunch: {
      create: {
        label: 'Create a UI Color Palette',
        description: 'Scale the selected colors',
      },
      edit: {
        label: 'Edit a UI Color Palette',
        description: 'Manage, publish, transfer shades',
      },
    },
    contexts: {
      source: 'Source',
      scale: 'Scale',
      colors: 'Colors',
      themes: 'Themes',
      export: 'Export',
      settings: 'Settings',
      about: 'About',
    },
    source: {
      title: 'Source colors',
      canvas: {
        title: 'Selected colors',
        tip: 'Select a frame or a shape (filled with color) on the Figma/FigJam canvas, then create a UI Color Palette.',
      },
      coolors: {
        title: 'Import from Coolors',
        url: {
          label: 'Palette URL',
          placeholder: 'https://coolors.co/…',
          errorMessage:
            'The end of the URL must match with several hexadecimal codes (e.g. 8ecae6-…-219ebc)',
        },
      },
    },
    scale: {
      title: 'Lightness scale',
      tips: {
        ctrl: 'Hold Ctrl ⌃ or Cmd ⌘ while dragging a stop to move them',
        shift:
          "Hold Shift ⇧ while dragging the first or the last stop to distribute stops' horizontal spacing",
        esc: 'Press Esc. after selecting a stop to unselect',
        nav: 'Press ← or → after selecting a stop to shift',
        edit: 'Double click a stop to type its value',
        remove: 'Press Backspace ⌫ after selecting a stop to remove',
        add: 'Click on the slider range to add a stop',
      },
    },
    colors: {
      title: 'Source colors',
      callout: {
        message:
          'Create a source color to split it into multiple shades according to your lightness scale',
        cta: 'Create a source color',
      },
      lch: {
        label: 'LCH',
      },
      hueShifting: {
        label: 'Shift the hue',
      },
    },
    themes: {
      title: 'Color themes',
      callout: {
        message:
          'Create color themes to manage multiple color palettes within one single (e.g. light and dark modes)',
        cta: 'Create a color theme',
      },
      paletteBackgroundColor: {
        label: 'Palette background color',
      },
      switchTheme: {
        label: 'Theme',
        defaultTheme: 'None',
      },
    },
    export: {
      format: 'Code',
      preview: 'Preview',
      tokens: {
        label: 'Tokens',
        global: 'Global (JSON)',
        amznStyleDictionary: 'Amazon Style Dictionary (JSON)',
        tokensStudio: 'Tokens Studio (JSON)',
      },
      css: {
        customProperties: 'Custom Properties (CSS)',
      },
      tailwind: {
        config: 'Tailwind (JS)',
      },
      apple: {
        label: 'Apple',
        swiftui: 'SwiftUI (SWIFT)',
        uikit: 'UIKit (SWIFT)',
      },
      android: {
        label: 'Android',
        compose: 'Compose (KT)',
        resources: 'Resources (XML)',
      },
      csv: {
        spreadsheet: 'Spreadsheet (CSV)',
      },
      colorSpace: {
        label: glossary.colorSpace,
        rgb: glossary.rgb,
        hex: glossary.hex,
        lch: glossary.lch,
        p3: glossary.p3,
      },
    },
    settings: {
      global: {
        title: 'Global settings',
        name: {
          label: 'Name',
        },
        description: {
          label: 'Description',
        },
        views: {
          label: 'Layout',
          simple: 'Palette',
          detailed: 'Palette with properties',
          sheet: 'Color sheet',
        },
      },
      contrast: {
        title: 'Contrast management',
        textColors: {
          textLightColor: 'Text light color',
          textDarkColor: 'Text dark color',
          textThemeColorsDescription:
            'The light and dark text colors serve as a reference to simulate contrast and obtain both WCAG and APCA scores',
        },
      },
      color: {
        title: 'Color management',
        colorSpace: {
          label: glossary.colorSpace,
          lch: glossary.lch,
          oklch: glossary.oklch,
          lab: glossary.lab,
          oklab: glossary.oklab,
          hsl: glossary.hsl,
          hsluv: glossary.hsluv,
          hex: glossary.hex,
          rgb: glossary.rgb,
          p3: glossary.p3,
        },
        visionSimulationMode: {
          label: 'Vision simulation',
          colorBlind: 'Color blind',
          none: 'None',
          protanomaly: glossary.protanomaly,
          protanopia: glossary.protanopia,
          deuteranomaly: glossary.deuteranomaly,
          deuteranopia: glossary.deuteranopia,
          tritanomaly: glossary.tritanomaly,
          tritanopia: glossary.tritanopia,
          achromatomaly: glossary.achromatomaly,
          achromatopsia: glossary.achromatopsia,
        },
        newAlgorithm: {
          label: 'Enable the new algorithm for creating color shades',
          description:
            'The Chroma values are harmonized to ensure consistent lightness across all shades, but this may make the colors look desaturated.',
        },
      },
    },
    about: {
      title: 'About UI Color Palette',
      getHelp: {
        title: 'Have help',
        documentation: 'Read the documentation',
        email: 'Contact support',
      },
      beInvolved: {
        title: 'Get involved',
        issue: 'Open an issue',
        discuss: 'Start a discussion',
      },
      giveSupport: {
        title: 'Give support',
        follow: 'Follow our LinkedIn page',
        rate: 'Like us',
      },
    },
    actions: {
      createPalette: 'Create a UI Color Palette',
      createLocalStyles: 'Sync with the local styles',
      createLocalVariables: 'Sync with the local variables',
      updateLocalStyles: 'Update the existing local styles',
      updateLocalVariables: 'Update the existing local variables',
      export: 'Export the UI Color Palette to',
      managePalette: {
        localStyles: 'Manage local styles',
        localVariables: 'Manage local variables',
      },
      sourceColorsNumber: {
        single: 'source color',
        several: 'source colors',
      },
    },
    highlight: {
      cta: {
        next: 'Next',
        gotIt: 'Got it',
        learnMore: 'Learn more',
      },
    },
    plan: {
      getPro: 'Get Pro',
      tryPro: 'Try Pro',
      pro: 'Pro plan',
      free: 'Free plan',
      trial: 'Trial',
      trialEnded: 'Your trial has ended',
    },
    proPlan: {
      welcome: {
        title: 'Welcome to UI Color Palette Pro!',
        message:
          'This upgrade will unlock a range of tools that enable you to convert your color palette into a color system. We hope you will enjoy the benefits.',
        trial:
          'This upgrade will unlock a range of tools that enable you to convert your color palette into a color system. We hope you will enjoy the benefits for the next 72 hours.',
        cta: "Let's build",
      },
      trial: {
        title:
          'Would you like to upgrade to the Pro plan within the next 72 hours?',
        message:
          'Explore the potential of synchronizing your color palette with variables, exporting it as design tokens, app resources, or for Tokens Studio and simulating vision disabilities.',
        cta: 'Enable the 72-hour trial',
        option: 'Purchase',
      },
    },
    properties: {
      base: 'Base',
      wcag: 'WCAG scores',
      apca: 'APCA scores',
      fontSize: 'Minimum font sizes',
    },
    info: {
      createdLocalStyle: 'local color style created',
      createdLocalStyles: 'local color styles created',
      updatedLocalStyle: 'local color style updated',
      updatedLocalStyles: 'local color styles updated',
      localVariable: 'local color variable',
      localVariables: 'local color variables',
      variableMode: 'variable mode',
      variableModes: 'variable modes',
    },
    warning: {
      tooManyThemesToCreateModes:
        'You must upgrade your plan to create more variable modes',
      emptySourceColors:
        'There is no source color. Add them manually in the Colors section.',
      hslColorSpace:
        'The HSL color space may include the source colors in the palette, but this approach will not ensure consistency in lightness and contrast.',
      unselectedColor:
        'Select a layer that is filled with at least one solid color',
      paletteNameRecommendation: '64 characters max is recommended',
    },
    error: {
      corruption:
        'Your UI Color Palette seems corrupted. Do not edit any layer within it.',
    },
  },
}
