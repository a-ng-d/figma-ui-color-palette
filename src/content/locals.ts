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
      selectPaletteinDevMode:
        'Select a UI Color Palette on the Figma canvas to inspect and export',
    },
    shortcuts: {
      feedback: 'Give feedback',
      trialFeedback: 'How was it?',
      news: "What's new",
      about: 'About',
    },
    publication: {
      title: 'Publish your palette',
      message:
        'Publish your palette to reuse in others Figma document and share it with the community',
      selectToShare: 'Share with community',
      statusLocalChanges: 'Local changes',
      statusUptoDate: 'No change',
      statusUnpublished: 'Unpublished',
      statusRemoteChanges: 'Remote changes',
      statusWaiting: 'Waiting…',
      statusNotFound: 'Not found',
      publish: 'Publish…',
      unpublish: 'Unpublish',
      synchronize: 'Synchronize',
      revert: 'Revert',
      detach: 'Detach',
      waiting: 'Waiting…',
      signIn: 'Sign in to publish',
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
        title: 'Coolors',
        helper:
          'Coolors is a tool for creating and exploring beautiful color schemes',
        url: {
          label: 'Palette URL',
          placeholder: 'Paste a link－https://coolors.co/…',
          infoMessage: 'The URL must start with "https://coolors.co"',
          errorMessage:
            'The URL must include several hexadecimal codes (e.g. 8ecae6-…-219ebc)',
        },
      },
      realtimeColors: {
        title: 'Realtime Colors',
        helper:
          'Realtime Colors is a tool for visualizing a color palette through a page template',
        url: {
          label: 'Realtime URL',
          placeholder: 'Paste a link－https://www.realtimecolors.com/…',
          infoMessage:
            'The URL must start with "https://www.realtimecolors.com"',
          errorMessage:
            'The URL must include several hexadecimal codes (e.g. 8ecae6-…-219ebc)',
        },
      },
    },
    scale: {
      title: 'Lightness scale',
      keyboardShortcuts: 'Review the keyboard shortcuts',
      howTo: 'How to adjust',
      easing: {
        label: 'Distribution easing',
        linear: 'Linear',
        easeIn: 'Ease in',
        easeOut: 'Ease out',
        easeInOut: 'Ease in and out',
      },
      namingConvention: {
        ones: '1 - 24',
        tens: '10 - 240',
        hundreds: '100 - 2400',
      },
      tips: {
        title: 'Keyboard shortcuts',
        custom: 'Adjustment with Custom preset',
        cta: 'Got it',
        move: 'Move every stop',
        distribute: 'Distribute stops based on easing',
        add: 'Add stop',
        select: 'Select stop',
        unselect: 'Unselect stop',
        navPrevious: 'Select previous stop',
        navNext: 'Select next stop',
        shiftLeft: 'Shift left stop',
        shiftRight: 'Shift right stop',
        type: 'Type stop value',
        remove: 'Remove stop',
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
        label: 'Shift hue',
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
        hsl: glossary.hsl,
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
          protanomaly: 'Protanomaly (red-weak)',
          protanopia: 'Protanopia (red-blind)',
          deuteranomaly: 'Deuteranomaly (green-weak)',
          deuteranopia: 'Deuteranopia (green-blind)',
          tritanomaly: 'Tritanomaly (blue-weak)',
          tritanopia: 'Tritanopia (blue-blind)',
          achromatomaly: 'Achromatomaly (total color-weak)',
          achromatopsia: 'Achromatopsia (total color-blind)',
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
      repository: 'Repository',
      getHelp: {
        title: 'Have help',
        documentation: 'Read the documentation',
        email: 'Contact support',
      },
      beInvolved: {
        title: 'Get involved',
        issue: 'Report a bug',
        discuss: 'Start a discussion',
        request: 'Post a feature request',
      },
      giveSupport: {
        title: 'Give support',
        follow: 'Follow us',
        rate: 'Like us',
      },
    },
    actions: {
      createPalette: 'Create a UI Color Palette',
      run: 'Run',
      createLocalStyles: 'Sync with the local styles',
      createLocalVariables: 'Sync with the local variables',
      publishPalette: 'Publish palette',
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
      colorThemesNumber: {
        single: 'color theme',
        several: 'color themes',
      },
    },
    palettesList: {
      title: 'UI Color Palettes on the page',
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
          'This upgrade will unlock a range of tools that enable you to convert your color palette into a color system. We hope you will enjoy the benefits for the next 48 hours.',
        cta: "Let's build",
      },
      trial: {
        title:
          'Would you like to upgrade to the Pro plan within the next 48 hours?',
        message:
          'Explore the potential of synchronizing your color palette with variables, exporting it as design tokens, app resources, or for Tokens Studio and simulating a vision impairment.',
        cta: 'Enable the 48-hour trial',
        option: 'Purchase',
      },
    },
    user: {
      signIn: 'Sign in',
      signOut: 'Sign out',
      welcomeMessage: 'Hello $[]',
    },
    properties: {
      base: 'Base',
      wcag: 'WCAG scores',
      apca: 'APCA scores',
      fontSize: 'Minimum font sizes',
    },
    success: {
      publication: '✓ The palette has been published',
      nonPublication: '✓ The palette has been unpublished',
      synchronization: '✓ The palette has been synchronized',
      detachment: '✓ The palette has been detached',
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
      signOut: 'See you later',
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
      noPaletteOnCurrrentPage:
        'There is no UI Color Palette on the current page. You can ask a member with editing permissions to create.',
    },
    error: {
      corruption:
        'Your UI Color Palette seems corrupted. Do not edit any layer within it.',
      palettesPicking: 'UI Color Palettes cannot be picked for now',
      generic: 'Something went wrong',
      timeout: '✕ The authentication has failed',
      publication: '✕ The palette cannot be published',
      nonPublication: '✕ The palette cannot be unpublished',
      synchronization: '✕ The palette has been synchronized',
    },
  },
}
