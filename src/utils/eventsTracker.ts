import mixpanel from 'mixpanel-figma'

import {
  ColorThemeEvent,
  ExportEvent,
  ImportEvent,
  PublicationEvent,
  ScaleEvent,
  SettingEvent,
  SourceColorEvent,
  TrialEvent,
} from '../types/events'

const eventsRecurringProperties = {
  'Env': process.env.NODE_ENV === 'development' ? 'Dev' : 'Prod',
}

export const trackRunningEvent = (id: string) => {
  mixpanel.identify(id)
  mixpanel.track('Plugin Run', { ...eventsRecurringProperties })
}

export const trackSignInEvent = (id: string) => {
  mixpanel.identify(id)
  mixpanel.track('Signed in', { ...eventsRecurringProperties })
}

export const trackSignOutEvent = (id: string) => {
  mixpanel.identify(id)
  mixpanel.track('Signed out', { ...eventsRecurringProperties })
}

export const trackTrialEnablementEvent = (
  id: string,
  options: TrialEvent
) => {
  mixpanel.identify(id)
  mixpanel.track('Trial Enabled', {
    'Trial Start Date': new Date(options.date).toISOString(),
    'Trial End Date': new Date(
      options.date + options.trialTime * 3600 * 1000
    ).toISOString(),
    'Trail Time': options.trialTime + ' hours',
    'Trial Version': '3.2.0',
    ...eventsRecurringProperties
  })
}

export const trackPurchaseEvent = (id: string) => {
  mixpanel.identify(id)
  mixpanel.track('Purchase Enabled' , { ...eventsRecurringProperties })
}

export const trackPublicationEvent = (
  id: string,
  options: PublicationEvent
) => {
  mixpanel.identify(id)
  mixpanel.track('Palette Managed', {
    'Feature': options.feature,
    ...eventsRecurringProperties
  })
}

export const trackImportEvent = (
  id: string,
  options: ImportEvent
) => {
  mixpanel.identify(id)
  mixpanel.track('Colors Imported', {
    'Feature': options.feature,
    ...eventsRecurringProperties,
  })
}

export const trackScaleManagementEvent = (
  id: string,
  options: ScaleEvent
) => {
  mixpanel.identify(id)
  mixpanel.track('Scale Updated', {
    'Feature': options.feature,
    ...eventsRecurringProperties
  })
}

export const trackSourceColorsManagementEvent = (
  id: string,
  options: SourceColorEvent
) => {
  mixpanel.identify(id)
  mixpanel.track('Source Color Updated', {
    'Feature': options.feature,
    ...eventsRecurringProperties
  })
}

export const trackColorThemesManagementEvent = (id: string, options: ColorThemeEvent) => {
  mixpanel.identify(id)
  mixpanel.track('Color Theme Updated', {
    'Feature': options.feature,
    ...eventsRecurringProperties
  })
}

export const trackSettingsManagementEvent = (id: string, options: SettingEvent) => {
  mixpanel.identify(id)
  mixpanel.track('Setting Updated', {
    'Feature': options.feature,
    ...eventsRecurringProperties
  })
}

export const trackExportEvent = (id: string, options: ExportEvent) => {
  mixpanel.identify(id)
  mixpanel.track('Color Shades Exported', {
    'Context': options.context,
    'Color Space': options.colorSpace ?? 'NC',
    ...eventsRecurringProperties
  })
}
