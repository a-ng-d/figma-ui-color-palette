import { createClient } from '@supabase/supabase-js'

import { authUrl, databaseUrl, proxyUrl } from '../../utils/config'
import checkConnectionStatus from '../checks/checkConnectionStatus'

let isAuthenticated = false

export const supabase = createClient(
  databaseUrl,
  process.env.REACT_APP_SUPABASE_PUBLIC_ANON_KEY ?? ''
)

export const signIn = async () => {
  return new Promise((resolve, reject) => {
    fetch(proxyUrl, {
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        type: 'GET_PASSKEY',
      },
    })
      .then((response) => {
        if (response.body) return response.json()
        else reject(new Error())
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
        const poll = setInterval(async () => {
          fetch(proxyUrl, {
            cache: 'no-cache',
            credentials: 'omit',
            headers: {
              type: 'GET_TOKENS',
              passkey: result.passkey,
            },
          })
            .then((response) => {
              if (response.body) return response.json()
              else reject(new Error())
            })
            .then(async (result) => {
              //console.log(result)
              if (result.message !== 'No token found') {
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
                  .then(() => {
                    clearInterval(poll)
                    resolve(result)
                  })
                  .catch((error) => {
                    clearInterval(poll)
                    reject(error)
                  })
              }
            })
            .catch((error) => {
              clearInterval(poll)
              reject(error)
            })
        }, 5000)
        setTimeout(
          () => {
            if (!isAuthenticated) {
              clearInterval(poll)
              reject(new Error('Authentication timeout'))
            }
          },
          2 * 60 * 1000
        )
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut({
    scope: 'others',
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
          type: 'SIGN_OUT',
        },
      },
      '*'
    )

    return
  } else throw error
}
