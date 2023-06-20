export const locals = {
  en: {
    name: 'UI Color Palette',
    onboarding: {
      selectColor: 'Select your source colors (solid colors only) on the Figma/Figjam canvas to create a UI Color Palette',
      selectPalette: 'Select a UI Color Palette to edit it'
    },
    shortcuts: {
      documentation: 'Read the documentation',
      feedback: 'Give feedback',
      news: 'What\'s new'
    },
    scale: {
      title: 'Lightness scale',
      ctrl: 'Hold Ctrl ⌃ or Cmd ⌘ while dragging a stop to move them all',
      shift: 'Hold Shift ⇧ while dragging the first or the last stop to distribute stops\' horizontal spacing',
      esc: 'Press Esc. after selecting a stop to unselect it',
      nav: 'Press ← or → after selecting a stop to shift it',
      edit: 'Double click a stop to type its value',
      remove: 'Press Backspace ⌫ after selecting a stop to remove it',
      add: 'Click on the slider range to add a stop'
    },
    colors: {
      title: 'Source colors',
      oklch: 'Use OKLCH'
    },
    export: {
      format: 'File format',
      preview: 'Preview'
    },
    settings: {
      base: {
        title: 'Base information',
        name: 'Palette name',
        defaultName: 'UI Color Palette'
      },
      contrast: {
        title: 'Contrast management',
        textLightColor: 'Text light color',
        textDarkColor: 'Text dark color',
        textThemeColorsDescription: 'The light and dark text colors serve as a reference to simulate contrast and obtain both WCAG and APCA scores'
      },
      color: {
        title: 'Color management',
        newAlgorithm: 'Enable the new algorithm for creating color shades',
        newAlgorithmDescription: 'The Chroma values are harmonized to ensure consistent lightness across all shades, but this may make the colors look desaturated.'
      }
    },
    about: {
      getHelp: {
        title: 'Get help',
        documentation: 'Read the documentation',
        email: 'Send an email'
      },
      beInvolved: {
        title: 'Be involved',
        issue: 'Open an issue',
        feedback: 'Give feedback'
      },
      giveSupport: {
        title: 'Give support',
        follow: 'Follow my actvity',
        coffee: 'Buy me a coffee'
      }
    },
    views: {
      title: 'Layout',
      simple: 'Palette',
      detailed: 'Palette with properties',
      sheet: 'Color sheet'
    },
    actions: {
      createPalette: 'Create a UI Color Palette',
      createLocalStyles: 'Create local styles',
      updateLocalStyles: 'Update the local styles',
      export: 'Export the palette to'
    },
    plan: {
      getPro: 'Get pro',
      pro: 'Pro plan',
      free: 'Free plan'
    },
    info: {
      createdlocalStyle: 'local color style has been created',
      createdlocalStyles: 'local color styles have been created',
      updatedlocalStyle: 'local color style has been updated',
      updatedlocalStyles: 'local color styles have been updated',
    },
    warning: {
      createLocalStyles: 'Local color styles already exist and cannot be created twice',
      updateLocalStyles: 'No color has been updated because the UI Color Palette has not been edited'
    },
    error: {
      corruption: 'Your UI Color Palette seems corrupted. Do not edit any layer within it.'
    }
  }
}