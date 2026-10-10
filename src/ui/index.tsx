import { render } from 'preact'
import mixpanel from 'mixpanel-figma'
import { commons, figmaPlugin, figmaTypes } from '@unoff/ui'
import App from '@ui-lib/ui/App'
import { initTolgee } from '@ui-lib/external/translation'
import { initPolar } from '@ui-lib/external/transactional'
import {
  initMixpanel,
  setEditor,
  setMixpanelEnv,
} from '@ui-lib/external/tracking/client'
import { initSentry } from '@ui-lib/external/monitoring'
import { initMistral } from '@ui-lib/external/mistral'
import { initNotion } from '@ui-lib/external/cms'
import { initSupabase } from '@ui-lib/external/auth'
import zh_Hans_CN from '@ui-lib/content/translations/zh-Hans-CN.json'
import pt_BR from '@ui-lib/content/translations/pt-BR.json'
import ko_KR from '@ui-lib/content/translations/ko-KR.json'
import ja_JP from '@ui-lib/content/translations/ja-JP.json'
import fr_FR from '@ui-lib/content/translations/fr-FR.json'
import es_ES from '@ui-lib/content/translations/es-ES.json'
import en_US from '@ui-lib/content/translations/en-US.json'
import { ThemeProvider } from '@ui-lib/config/ThemeContext'
import { ConfigProvider } from '@ui-lib/config/ConfigContext'
import { TolgeeProvider } from '@tolgee/react'
import * as Sentry from '@sentry/react'
import globalConfig from '../global.config'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('app')!

const mixpanelToken = import.meta.env.VITE_MIXPANEL_TOKEN
const sentryDsn = import.meta.env.VITE_SENTRY_DSN
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_ANON_KEY
const mistralApiKey = import.meta.env.VITE_MISTRAL_AI_API_KEY
const notionApiKey = import.meta.env.VITE_NOTION_API_KEY
const tolgeeUrl = import.meta.env.VITE_TOLGEE_URL
const tolgeeApiKey = import.meta.env.VITE_TOLGEE_API_KEY
const polarAccessToken = import.meta.env.VITE_POLAR_ACCESS_TOKEN

// Mixpanel
if (globalConfig.env.isMixpanelEnabled && mixpanelToken !== undefined) {
  mixpanel.init(mixpanelToken, {
    api_host: 'https://api-eu.mixpanel.com',
    debug: globalConfig.env.isDev,
    disable_persistence: true,
    disable_cookie: true,
    opt_out_tracking_by_default: true,
  })
  mixpanel.opt_in_tracking()

  const now = new Date()
  const cohort = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const env = import.meta.env.MODE as 'development' | 'production'
  mixpanel.register({
    Cohort: cohort,
    Version: globalConfig.versions.pluginVersion,
    Env: env,
  })

  setMixpanelEnv(env)
  initMixpanel(mixpanel)
  setEditor(globalConfig.env.editor)
}

// Sentry
if (
  globalConfig.env.isSentryEnabled &&
  !globalConfig.env.isDev &&
  sentryDsn !== undefined
) {
  Sentry.init({
    dsn: sentryDsn,
    environment: 'production',
    initialScope: {
      tags: {
        platform: globalConfig.env.platform,
        version: globalConfig.versions.pluginVersion,
      },
    },
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      Sentry.feedbackIntegration({
        colorScheme: 'system',
        autoInject: false,
      }),
    ],
    attachStacktrace: true,
    normalizeDepth: 15,
    maxValueLength: 5000,
    maxBreadcrumbs: 150,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    release: globalConfig.versions.pluginVersion,
  })

  initSentry(Sentry)
} else {
  const devLogger = {
    captureException: (error: Error) => {
      console.group('🐛 Dev Error Logger')
      console.error(error)
      console.groupEnd()
    },
    captureMessage: (message: string) => {
      console.group('📝 Dev Message Logger')
      console.info(message)
      console.groupEnd()
    },
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).Sentry = devLogger
}

// Supabase
if (globalConfig.env.isSupabaseEnabled && supabaseAnonKey !== undefined)
  initSupabase(globalConfig.urls.databaseUrl, supabaseAnonKey)

// Mistral AI
if (globalConfig.env.isMistralAiEnabled) initMistral(mistralApiKey)

// Notion
if (globalConfig.env.isNotionEnabled && notionApiKey !== undefined)
  initNotion(notionApiKey)

// Tolgee
const tolgee = initTolgee(tolgeeUrl, tolgeeApiKey, globalConfig.lang, {
  'en-US': en_US,
  'fr-FR': fr_FR,
  'pt-BR': pt_BR,
  'zh-Hans-CN': zh_Hans_CN,
  'es-ES': es_ES,
  'ja-JP': ja_JP,
  'ko-KR': ko_KR,
})

// Polar
if (globalConfig.env.isPolarEnabled && globalConfig.env.isSupabaseEnabled)
  initPolar(
    polarAccessToken as string,
    `${globalConfig.urls.databaseUrl}/functions/v1`,
    globalConfig.env.isDev ? 'sandbox' : 'production'
  )

// Bridge Canvas <> UI
window.addEventListener(
  'message',
  (event: MessageEvent) => {
    const pluginEvent = new CustomEvent('platformMessage', {
      detail: event.data.pluginMessage,
    })
    window.dispatchEvent(pluginEvent)
  },
  false
)

window.addEventListener('pluginMessage', ((event: MessageEvent) => {
  if (event instanceof CustomEvent && window.parent !== window) {
    const { message, targetOrigin } = event.detail
    parent.postMessage(message, targetOrigin)
  }
}) as EventListener)

// Figma Theme
void commons
void figmaPlugin
void figmaTypes

// Render
tolgee?.run().then(() => {
  render(
    <TolgeeProvider
      tolgee={tolgee}
      fallback="Loading..."
    >
      <ConfigProvider
        limits={globalConfig.limits}
        env={globalConfig.env}
        plan={globalConfig.plan}
        dbs={globalConfig.dbs}
        urls={globalConfig.urls}
        versions={globalConfig.versions}
        features={globalConfig.features}
        lang={globalConfig.lang}
        fees={globalConfig.fees}
      >
        <ThemeProvider
          theme={globalConfig.env.ui}
          mode={globalConfig.env.colorMode}
        >
          <App />
        </ThemeProvider>
      </ConfigProvider>
    </TolgeeProvider>,
    container
  )
})
