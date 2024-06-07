import { ColorSpaceConfiguration } from "./configurations"

export interface TrialEnablementEvent {
  date: number,
  trialTime: number
}

export interface ExportEvent {
  context?: string,
  colorSpace?: ColorSpaceConfiguration
}