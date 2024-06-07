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

export const trackJsonExportEvent = (id: string, options: ExportEvent) => {
  mixpanel.identify(id),
  mixpanel.track('JSON Exported', {
    'Context': options.context,
  })
}

export const trackCssExportEvent = (id: string, options: ExportEvent) => {
  mixpanel.identify(id),
  mixpanel.track('CSS Exported', {
    'Color Space': options.colorSpace
  })
}

export const trackTailwindExportEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Tailwind Exported')
}

export const trackSwiftUIExportEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Swift UI Exported')
}

export const trackUIKitExportEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('UI Kit Exported')
}

export const trackKtExportEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Kotlin Exported')
}

export const trackXmlExportEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('XML Exported')
}

export const trackCsvExportEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('CSV Exported')
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
