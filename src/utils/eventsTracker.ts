import mixpanel from "mixpanel-figma"

export const trackTrialEnablementEvent = (id: string, date: number, trialTime: number) => {
  mixpanel.identify(id),
  mixpanel.track('Trial Enabled', {
    'Trial Start Date': new Date(date).toISOString(),
    'Trial End Date': new Date(date + (trialTime * 3600 * 1000)).toISOString(),
    'Trail Time': trialTime + ' hours',
    'Trial Version': '3.2.0',
  })
}

export const trackPurchaseEvent = (id: string) => {
  mixpanel.identify(id),
  mixpanel.track('Purchase Enabled')
}