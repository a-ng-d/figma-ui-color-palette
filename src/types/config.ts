export interface Feature {
  name: string
  description: string
  isActive: boolean
  isPro: boolean
  isNew: boolean
  type: 'SERVICE' | 'DIVISION' | 'ACTION' | 'CONTEXT'
  service: Array<Service>
}

export type Service = 'CREATE' | 'EDIT' | 'TRANSFER'

export type Context = 'PALETTES' | 'SOURCE' | 'SCALE' | 'COLORS' | 'THEMES' | 'EXPORT' | 'SETTINGS' | 'PALETTES_SELF' | 'PALETTES_COMMUNITY' | 'PALETTES_EXPLORE'

export type EditorType = 'figma' | 'figjam' | 'dev'

export type PlanStatus = 'UNPAID' | 'PAID' | 'NOT_SUPPORTED'

export type TrialStatus = 'UNUSED' | 'PENDING' | 'EXPIRED'

export type Language = 'en-US'

export interface windowSize {
  w: number
  h: number
}
