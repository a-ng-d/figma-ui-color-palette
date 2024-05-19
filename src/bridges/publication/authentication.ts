import { createClient } from '@supabase/supabase-js'

import { lang, locals } from '../../content/locals'
import { authUrl, databaseUrl, proxyUrl } from '../../utils/config'
import checkConnectionStatus from '../checks/checkConnectionStatus'

let isAuthenticated = false

export const supabase = createClient(
  databaseUrl,
  process.env.REACT_APP_SUPABASE_PUBLIC_ANON_KEY ?? ''
)

export const signIn = async () => {
  fetch(proxyUrl, {
    cache: 'no-cache',
    credentials: 'omit',
    headers: {
      type: 'GET_PASSKEY',
    },
  })
    .then((response) => {
      if (response.body) return response.json()
      else throw new Error()
    })
    .then((result) => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'OPEN_IN_BROWSER',
            url: `${authUrl}/?passkey=${result.passkey}`,
          },
        },
        '*'
      )
      return result.passkey
    })
    .then((passkey) => {
      const poll = setInterval(() => {
        fetch(proxyUrl, {
          cache: 'no-cache',
          credentials: 'omit',
          headers: {
            type: 'GET_TOKENS',
            passkey: passkey,
          },
        })
          .then((response) => {
            if (response.body) return response.json()
            else throw new Error()
          })
          .then(async (result) => {
            if (result.message != 'No tokens found') {
              isAuthenticated = true
              parent.postMessage(
                {
                  pluginMessage: {
                    type: 'SET_ITEMS',
                    items: [
                      {
                        key: 'supabase_access_token',
                        value: result.access_token,
                      },
                      {
                        key: 'supabase_refresh_token',
                        value: result.refresh_token,
                      },
                    ],
                  },
                },
                '*'
              )
              checkConnectionStatus(result.access_token, result.refresh_token)
              clearInterval(poll)
              return result
            }
          })
          .catch((error) => {
            parent.postMessage(
              {
                pluginMessage: {
                  type: 'SEND_MESSAGE',
                  message: locals[lang].error.generic,
                },
              },
              '*'
            )
            clearInterval(poll)
            throw error
          })
      }, 5000)
      setTimeout(
        () => {
          if (!isAuthenticated) {
            parent.postMessage(
              {
                pluginMessage: {
                  type: 'SEND_MESSAGE',
                  message: locals[lang].error.timeout,
                },
              },
              '*'
            )
            clearInterval(poll)
            throw 'Timeout'
          }
        },
        2 * 60 * 1000
      )
    })
    .catch((error) => {
      parent.postMessage(
        {
          pluginMessage: {
            type: 'SEND_MESSAGE',
            message: locals[lang].error.generic,
          },
        },
        '*'
      )
      throw error
    })
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut({
    scope: 'global',
  })

  if (!error) {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'DELETE_ITEMS',
          items: ['supabase_access_token', 'supabase_refresh_token'],
        },
      },
      '*'
    )
    parent.postMessage(
      {
        pluginMessage: {
          type: 'SEND_MESSAGE',
          message: locals[lang].info.signOut,
        },
      },
      '*'
    )
    return
  } else {
    console.log(error)
    parent.postMessage(
      {
        pluginMessage: {
          type: 'SEND_MESSAGE',
          message: locals[lang].error.generic,
        },
      },
      '*'
    )
    throw error
  }
}
