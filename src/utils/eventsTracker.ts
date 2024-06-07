import mixpanel from "mixpanel-figma"
import { TrialEnablementEvent, ExportEvent, SourceColorEvent, ColorThemeEvent } from "../types/events"

export const trackTrialEnablementEvent = (id: string, options: TrialEnablementEvent) => {
  mixpanel.identify(id),
  mixpanel.track('Trial Enabled', {
    'Trial Start Date': new Date(options.date).toISOString(),
    'Trial End Date': new Date(options.date + (options.trialTime * 3600 * 1000)).toISOString(),
    'Trail Time': options.trialTime + ' hours',
    'Trial Version': '3.2.0',
  })
}

export const trackPurchaseEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Purchase Enabled')
}

export const trackExportEvent = (id: string, options: ExportEvent) => {
  mixpanel.identify(id),
  mixpanel.track('Palette Color Shades Exported', {
    'Context': options.context,
    'Color Space': options.colorSpace ?? 'NC'
  })
}

export const trackSourceColorEvent = (id: string, options: SourceColorEvent) => {
  mixpanel.identify(id),
  mixpanel.track('Source Color Updated', {
    'Feature': options.feature
  })
}

export const trackColorThemeEvent = (id: string, options: ColorThemeEvent) => {
  mixpanel.identify(id),
  mixpanel.track('Source Color Updated', {
    'Feature': options.feature
  })
}
