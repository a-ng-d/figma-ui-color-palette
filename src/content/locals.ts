export const lang = 'en-US'

export const locals: { [key: string]: any } = {
  'en-US': {
    name: 'UI Color Palette',
    tagline:
      'Create accessible UI Color Palettes with consistent lightness and contrast',
    url: 'www.ui-color-palette.com',
    global: {
      description: {
        label: 'Description',
        placeholder: "What's it for?",
      },
    },
    onboarding: {
      selectColor:
        'Select your source colors (solid colors only) on the Figma/Figjam canvas to create a UI Color Palette',
      selectPalette: 'Select a UI Color Palette to edit it',
    },
    shortcuts: {
      feedback: 'Give feedback',
      news: "What's new",
      about: 'About',
    },
    contexts: {
      scale: 'Scale',
      colors: 'Colors',
      themes: 'Themes',
      export: 'Export',
      settings: 'Settings',
      about: 'About',
    },
    scale: {
      title: 'Lightness scale',
      tips: {
        ctrl: 'Hold Ctrl ⌃ or Cmd ⌘ while dragging a stop to move them all',
        shift:
          "Hold Shift ⇧ while dragging the first or the last stop to distribute stops' horizontal spacing",
        esc: 'Press Esc. after selecting a stop to unselect it',
        nav: 'Press ← or → after selecting a stop to shift it',
        edit: 'Double click a stop to type its value',
        remove: 'Press Backspace ⌫ after selecting a stop to remove it',
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
      format: 'File format',
      preview: 'Preview',
      json: 'JSON (Global tokens)',
      amznStyleDictionary: 'JSON (Amazon Style Dictionary)',
      tokensStudio: 'JSON (Tokens Studio)',
      css: 'CSS (Custom Properties)',
      swift: 'SwiftUI (Apple OS)',
      xml: 'XML (Android)',
      csv: 'CSV (LCH)',
    },
    settings: {
      global: {
        title: 'Palette global settings',
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
          lch: 'LCH (Lightness, Chroma, Hue)',
          oklch: 'OKLCH (OK, Lightness, Chroma, Hue)',
          lab: 'CIELAB (CIE, Lightness, a﹡ axis, b﹡ axis)',
          oklab: 'OKLAB (OK, Lightness, a﹡ axis, b﹡ axis)',
          hsl: 'HSL (Hue, Saturation, Lightness)',
          hsluv: 'HSLuv (Hue, Saturation, Lightness, u* axis, v* axis)',
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
        title: 'Get help',
        documentation: 'Read the documentation',
        email: 'Send an email',
      },
      beInvolved: {
        title: 'Be involved',
        issue: 'Open an issue',
        discuss: 'Start a discussion',
      },
      giveSupport: {
        title: 'Give support',
        follow: 'Follow my actvity',
        coffee: 'Buy me a coffee',
      },
    },
    actions: {
      createPalette: 'Create a UI Color Palette',
      createLocalStyles: 'Create local styles',
      createLocalVariables: 'Create local variables',
      updateLocalStyles: 'Update the existing local styles',
      updateLocalVariables: 'Update the existing local variables',
      export: 'Export the UI Color Palette to',
      managePalette: {
        localStyles: 'Manage local styles',
        localVariables: 'Manage local variables',
      },
    },
    highlight: {
      cta: {
        next: 'Next',
        gotIt: 'Got it',
        learnMore: 'Learn more',
      }
      
    },
    plan: {
      getPro: 'Get pro',
      pro: 'Pro plan',
      free: 'Free plan',
    },
    proPlan: {
      welcome: {
        title: 'Welcome to UI Color Palette Pro!',
        message: 'You have successfully upgraded to the Pro plan, unlocking a range of tools to transform your color palette into a color system.',
        cta: "Let's enhance it"
      }
        
    },
    properties: {
      base: 'Base',
      wcag: 'WCAG scores',
      apca: 'APCA scores',
      fontSize: 'Minimum font sizes',
    },
    info: {
      createdLocalStyle: 'local color style has been created',
      createdLocalStyles: 'local color styles have been created',
      updatedLocalStyle: 'local color style has been updated',
      updatedLocalStyles: 'local color styles have been updated',
      noLocalVariable: 'No local color variable',
      localVariable: 'local color variable',
      localVariables: 'local color variables',
      noVariableMode: 'No variable mode',
      variableMode: 'variable mode',
      variableModes: 'variable modes',
    },
    warning: {
      cannotCreateLocalStyles: 'Local color styles have been already created',
      cannotUpdateLocalStyles:
        'Your UI Color Palette is up-to-date or local color styles must be created',
      cannotCreateLocalVariablesAndModes:
        'Local color variables and variable modes have been already created',
      cannotUpdateLocalVariablesAndModes:
        'Your UI Color Palette is up-to-date or local color variables and variable modes must be created',
      collectionDoesNotExist: 'Variables collection must be created',
      tooManyThemesToCreateModes:
        'You cannot create more that 4 variable modes',
      emptySourceColors:
        'There is not any source color. Add it manually in the Colors section.',
      hslColorSpace:
        'The HSL color space may include the source colors in the palette, but this approach will not ensure consistency in lightness and contrast.',
    },
    error: {
      corruption:
        'Your UI Color Palette seems corrupted. Do not edit any layer within it.',
    },
  },
}
