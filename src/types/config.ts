import { AlgorithmVersionConfiguration } from '@a_ng_d/utils-ui-color-palette'
import { Feature } from '@a_ng_d/figmug-utils'
import { Translations } from './translations'

export interface Config {
  limits: {
    pageSize: number
  }
  env: {
    isDev: boolean
    platform: 'figma' | 'penpot'
    editor: 'figma' | 'figjam' | 'dev' | 'penpot'
    ui: 'figma-ui3' | 'penpot'
    colorMode: 'figma-dark' | 'figma-light' | 'penpot-dark' | 'penpot-light'
    isSupabaseEnabled: boolean
    isMixpanelEnabled: boolean
    isSentryEnabled: boolean
    announcementsDbId: string
    onboardingDbId: string
    readonly pluginId: string
  }
  plan: {
    isProEnabled: boolean
    isTrialEnabled: boolean
    trialTime: number
  }
  dbs: {
    palettesDbTableName: string
    palettesStorageName: string
  }
  urls: {
    authWorkerUrl: string
    announcementsWorkerUrl: string
    databaseUrl: string
    authUrl: string
    storeApiUrl: string
    platformUrl: string
    uiUrl: string
    documentationUrl: string
    repositoryUrl: string
    supportEmail: string
    communityUrl: string
    feedbackUrl: string
    trialFeedbackUrl: string
    requestsUrl: string
    networkUrl: string
    authorUrl: string
    licenseUrl: string
    privacyUrl: string
    vsCodeFigmaPluginUrl: string
    isbUrl: string
    storeUrl: string
    storeManagementUrl: string
  }
  versions: {
    userConsentVersion: string
    trialVersion: string
    algorithmVersion: AlgorithmVersionConfiguration
  }
  features: Array<Feature<'BROWSE' | 'CREATE' | 'EDIT' | 'TRANSFER'>>
  locales: Translations
}
