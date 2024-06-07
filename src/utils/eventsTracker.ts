import mixpanel from "mixpanel-figma"

export const trackTrialEnabledEvent = (id: string, date: number, trialTime: number) => {
  mixpanel.identify(id),
  mixpanel.track('Trial Enabled', {
    'User ID': id,
    'Trial Start Date': new Date(date).toISOString(),
    'Trial End Date': new Date(date + (trialTime * 3600 * 1000)).toISOString(),
    'Trial Version': '3.2.0',
  })
}