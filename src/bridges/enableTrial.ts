import { notionOptions } from '../utils/fetch'

const enableTrial = async () => {
  const date = new Date()

  await figma.clientStorage
    .setAsync('trial_start_date', date.getTime())
    .then(() => {
      figma.ui.postMessage({
        type: 'ENABLE_TRIAL',
      })
    })
    .then(() => {
      fetch(
        'https://corsproxy.io/?' +
          encodeURIComponent('https://api.notion.com/v1/pages'),
        {
          method: 'POST',
          headers: notionOptions,
          body: JSON.stringify({
            parent: {
              database_id: process.env.REACT_APP_NOTION_TRIAL_TABLE_ID,
            },
            properties: {
              "Nom de l'utilisateur": {
                title: [
                  {
                    type: 'text',
                    text: {
                      content: figma.currentUser?.name ?? 'NC',
                      link: null,
                    },
                    annotations: {
                      bold: false,
                      italic: false,
                      strikethrough: false,
                      underline: false,
                      code: false,
                      color: 'default',
                    },
                    plain_text: figma.currentUser?.name ?? 'NC',
                    href: null,
                  },
                ],
              },
              "Id de l'utilisateur": {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: figma.currentUser?.id ?? 'NC',
                      link: null,
                    },
                    annotations: {
                      bold: false,
                      italic: false,
                      strikethrough: false,
                      underline: false,
                      code: false,
                      color: 'default',
                    },
                    plain_text: figma.currentUser?.id ?? 'NC',
                    href: null,
                  },
                ],
              },
              "Période de l'essai": {
                date: {
                  start: date.toISOString(),
                  end: new Date(date.getTime() + 604800000).toISOString(),
                },
              },
            },
          }),
          cache: 'no-cache',
          credentials: 'omit',
        }
      )
        .then((response) => response.json())
        .then((response) => console.log(response))
        .catch((err) => console.error(err))
    })
}

export default enableTrial
