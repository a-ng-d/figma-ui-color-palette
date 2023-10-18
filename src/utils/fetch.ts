import { NOTION_API_KEY } from './../../env.s'

export const notionOptions = {
  Authorization: `Bearer ${NOTION_API_KEY}`,
  Accept: 'application/json',
  'Notion-Version': '2022-06-28',
  'content-type': 'application/json',
}