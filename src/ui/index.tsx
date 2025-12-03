import { createRoot } from 'react-dom/client'
import React from 'react'
import mixpanel from 'mixpanel-figma'
import App from '@ui-lib/ui/App'
import { initTolgee } from '@ui-lib/external/translation'
import {
  initMixpanel,
  setEditor,
  setMixpanelEnv,
} from '@ui-lib/external/tracking/client'
import { initSentry } from '@ui-lib/external/monitoring'
import { initMistral } from '@ui-lib/external/mistral'
import { initSupabase } from '@ui-lib/external/auth'
import zh_Hans_CN from '@ui-lib/content/translations/zh-Hans-CN.json'
import pt_BR from '@ui-lib/content/translations/pt-BR.json'
import fr_FR from '@ui-lib/content/translations/fr-FR.json'
import en_US from '@ui-lib/content/translations/en-US.json'
import { ThemeProvider } from '@ui-lib/config/ThemeContext'
import { ConfigProvider } from '@ui-lib/config/ConfigContext'
import { TolgeeProvider } from '@tolgee/react'
import * as Sentry from '@sentry/react'
import globalConfig from '../global.config'

const container = document.getElementById('app'),
  root = createRoot(container)

const mixpanelToken = import.meta.env.VITE_MIXPANEL_TOKEN
const sentryDsn = import.meta.env.VITE_SENTRY_DSN
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_ANON_KEY
const mistralApiKey = import.meta.env.VITE_MISTRAL_AI_API_KEY
const tolgeeUrl = import.meta.env.VITE_TOLGEE_URL
const tolgeeApiKey = import.meta.env.VITE_TOLGEE_API_KEY

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

  setMixpanelEnv(import.meta.env.MODE as 'development' | 'production')
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
    replaysSessionSampleRate: 0.01,
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

// Tolgee
const tolgee = initTolgee(tolgeeUrl, tolgeeApiKey, globalConfig.lang, {
  'en-US': en_US,
  'fr-FR': fr_FR,
  'pt-BR': pt_BR,
  'zh-Hans-CN': zh_Hans_CN,
})

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

// Render
tolgee?.run().then(() => {
  root.render(
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
    </TolgeeProvider>
  )
})
