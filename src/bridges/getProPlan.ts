import { notionOptions } from '../utils/fetch'

const getProPlan = async () => {
  await figma.payments
    ?.initiateCheckoutAsync({
      interstitial: 'SKIP',
    })
    .then(() => {
      if (figma.payments?.status.type === 'PAID')
        figma.ui.postMessage({
          type: 'GET_PRO_PLAN',
          data: figma.payments.status.type,
        })
    })
    .then(() => {
      if (figma.payments?.status.type === 'PAID')
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
                "Souscription à l'abonnement": {
                  checkbox: true,
                },
              },
            }),
            cache: 'no-cache',
            credentials: 'omit',
          }
        )
          .then((response) => response.json())
          .then((response) => console.log(response))
          .catch((error) => console.error(error))
    })
}

export default getProPlan
