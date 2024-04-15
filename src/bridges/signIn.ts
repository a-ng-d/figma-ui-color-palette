const signIn = async () => {
  fetch(
    'https://corsproxy.io/?' +
      encodeURIComponent('https://hook.eu1.make.com/s02o2bjkknapgjidnp5bko7duc5w6t65'),
    {
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'type': 'GET_PASSKEY'
      }
    }
  )
  .then(response => {
    console.log(response.body)
    if (response.body) return response.json()
    else throw new Error()
  })
  .then(result => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'OPEN_IN_BROWSER',
          url: `http://localhost:3000/?passkey=${result.passkey}`,
        },
      },
      '*'
    )
    return result.passkey
  })
  .then((passkey) => {
    const poll = setInterval(() => {
      fetch(
        'https://corsproxy.io/?' +
          encodeURIComponent('https://hook.eu1.make.com/s02o2bjkknapgjidnp5bko7duc5w6t65'),
        {
          cache: 'no-cache',
          credentials: 'omit',
          headers: {
            'type': 'GET_TOKENS',
            'passkey': passkey
          }
        }
      )
      .then(response => {
        if (response.body) return response.json()
        else throw new Error()
      })
      .then(result => {
        console.log(result)
        if (result.tokens != 'No tokens found') clearInterval(poll)
      })
      .catch((error: any) => {
        console.error(error)
        clearInterval(poll)
      })
    }, 5000)
    setTimeout(() => clearInterval(poll), 2 * 60 * 1000)
  })
  .catch(error => console.log(error))
}

export default signIn
