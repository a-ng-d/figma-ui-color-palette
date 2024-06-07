import mixpanel from "mixpanel-figma"
import { TrialEnablementEvent, ExportEvent } from "../types/events"

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

export const trackSourceColorRenameEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Source Color Renamed')
}

export const trackSourceColorHexUpdateEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Source Color Hex Updated')
}

export const trackSourceColorLchUpdateEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Source Color LCH Updated')
}

export const trackSourceColorShiftEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Source Color Shifted')
}

export const trackSourceColorDescriptionEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Source Color Described')
}

export const trackColorThemeRenameEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Color Theme Renamed')
}

export const trackColorThemeBackgroundEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Color Theme Background Updated')
}

export const trackColorThemeDescriptionEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Color Theme Described')
}
