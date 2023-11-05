export const lang = 'en-US'

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
      news: "What's new",
      about: 'About',
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
        tip: 'The selected solid colors from the Figma/FigJam canvas will be displayed here',
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
        label: 'HUE',
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
      json: 'Global (JSON)',
      amznStyleDictionary: 'Amazon Style Dictionary (JSON)',
      tokensStudio: 'Tokens Studio (JSON)',
      css: 'Custom Properties (CSS)',
      swift: 'iOS (SwiftUI)',
      xml: 'Android (XML)',
      csv: 'Spreadsheet (CSV)',
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
          label: 'Color space',
          lch: 'LCH',
          oklch: 'OKLCH',
          lab: 'CIELAB',
          oklab: 'OKLAB',
          hsl: 'HSL',
          hsluv: 'HSLuv',
        },
        newAlgorithm: {
          label: 'Enable the new algorithm for creating color shades',
          description:
            'The Chroma values are harmonized to ensure consistent lightness across all shades, but this may make the colors look desaturated.',
        },
      },
    },
    feedback: {
      title: 'Tell your experience',
    },
    about: {
      title: 'About UI Color Palette',
      getHelp: {
        title: 'Have help',
        documentation: 'Read the documentation',
        email: 'Send an email',
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
          'Explore the potential of synchronizing your color palette with variables and exporting it as design tokens, app resources, or files for Tokens Studio.',
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
        'You cannot create more than 4 variable modes',
      emptySourceColors:
        'There is no source color. Add them manually in the Colors section.',
      hslColorSpace:
        'The HSL color space may include the source colors in the palette, but this approach will not ensure consistency in lightness and contrast.',
    },
    error: {
      corruption:
        'Your UI Color Palette seems corrupted. Do not edit any layer within it.',
    },
  },
}
